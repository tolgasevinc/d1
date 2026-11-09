(function (/** @type {any} */ root, /** @type {() => any} */ factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.createSupabaseTodoStore = factory().createSupabaseTodoStore;
})(typeof self !== 'undefined' ? self : this, function () {
  /** @param {any} row */
  function fromRow(row) {
    return {
      id: row.id,
      title: row.title,
      done: row.done,
      dueDate: row.due_date,
      priority: row.priority,
      createdAt: row.created_at,
      completedAt: row.completed_at,
    };
  }

  /** @param {any} t */
  function toRow(t) {
    /** @type {any} */
    const r = {};
    if ('title' in t) r.title = t.title;
    if ('done' in t) r.done = t.done;
    if ('dueDate' in t) r.due_date = t.dueDate;
    if ('priority' in t) r.priority = t.priority;
    if ('completedAt' in t) r.completed_at = t.completedAt;
    return r;
  }

  /**
   * Hatayı sınıflandırır: kind = 'network' | 'paused' | 'server'.
   * @param {any} error
   */
  function wrapError(error) {
    const msg = String((error && error.message) || error || '');
    const status = error && (error.status || error.code);
    let kind = 'server';
    if (/failed to fetch|networkerror|load failed|network request failed/i.test(msg)) kind = 'network';
    else if (status === 540 || status === 503 || status === 521 || status === 522 || status === 523 || /paused/i.test(msg)) kind = 'paused';
    const err = /** @type {any} */ (new Error(msg || 'Sunucu hatası'));
    err.kind = kind;
    return err;
  }

  /** @param {{ from: (t: string) => any }} client Supabase istemcisi */
  function createSupabaseTodoStore(client) {
    const table = () => client.from('todos');
    /** @param {{ data?: any, error?: any }} res */
    function check(res) {
      if (res.error) throw wrapError(res.error);
      return res.data;
    }
    /** @template T @param {() => Promise<T>} fn @returns {Promise<T>} */
    async function guard(fn) {
      try { return await fn(); } catch (e) {
        throw /** @type {any} */ (e).kind ? e : wrapError(e);
      }
    }
    return {
      list: () => guard(async () => check(await table().select('*')).map(fromRow)),
      insert: (/** @type {any} */ t) => guard(async () => fromRow(check(await table().insert(toRow(t)).select().single()))),
      update: (/** @type {string} */ id, /** @type {any} */ patch) =>
        guard(async () => fromRow(check(await table().update(toRow(patch)).eq('id', id).select().single()))),
      remove: (/** @type {string} */ id) => guard(async () => { check(await table().delete().eq('id', id)); }),
      removeCompleted: () => guard(async () => { check(await table().delete().eq('done', true)); }),
    };
  }
  return { createSupabaseTodoStore, wrapError };
});
