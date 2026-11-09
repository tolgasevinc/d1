(function (/** @type {any} */ root, /** @type {() => any} */ factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.createInMemoryTodoStore = factory().createInMemoryTodoStore;
})(typeof self !== 'undefined' ? self : this, function () {
  /**
   * Test amaçlı Store. Supabase Store ile aynı arayüz.
   * @param {{ now?: () => string, newId?: () => string }} [opts]
   */
  function createInMemoryTodoStore(opts) {
    const now = (opts && opts.now) || (() => new Date().toISOString());
    let n = 0;
    const newId = (opts && opts.newId) || (() => 'id' + ++n);
    /** @type {any[]} */
    let rows = [];
    /** @type {any} */
    const store = {
      async list() { return rows.map((r) => ({ ...r })); },
      async insert(/** @type {any} */ newTodo) {
        const row = { ...newTodo, id: newId(), createdAt: now() };
        rows.push(row);
        return { ...row };
      },
      async update(/** @type {string} */ id, /** @type {any} */ patch) {
        const row = rows.find((r) => r.id === id);
        if (!row) throw new Error('Todo bulunamadı');
        Object.assign(row, patch);
        return { ...row };
      },
      async remove(/** @type {string} */ id) { rows = rows.filter((r) => r.id !== id); },
      async removeCompleted() { rows = rows.filter((r) => !r.done); },
      /** Test yardımcısı: bir sonraki çağrıyı hata ile başarısız kıl. */
      failNext(/** @type {any} */ err) {
        const keys = ['list', 'insert', 'update', 'remove', 'removeCompleted'];
        const origs = keys.map((k) => this[k]);
        keys.forEach((k) => {
          this[k] = async () => {
            keys.forEach((kk, i) => { this[kk] = origs[i]; });
            throw err;
          };
        });
      },
    };
    return store;
  }
  return { createInMemoryTodoStore };
});
