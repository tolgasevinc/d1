(function (/** @type {any} */ root, /** @type {() => any} */ factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.createTodoService = factory().createTodoService;
})(typeof self !== 'undefined' ? self : this, function () {
  /**
   * @typedef {{ id: string, title: string, done: boolean, dueDate: string|null,
   *   priority: 'dusuk'|'orta'|'yuksek', createdAt: string, completedAt: string|null }} Todo
   */
  /** @param {unknown} raw */
  function normalizeTitle(raw) {
    const t = String(raw == null ? '' : raw).trim().toLocaleUpperCase('tr-TR');
    if (!t) throw new Error('Başlık boş olamaz');
    return t;
  }

  /** @param {any} store @param {{ today: () => string, now?: () => string }} opts */
  function createTodoService(store, opts) {
    /** @type {Todo[]} */
    let items = [];
    const now = opts.now || (() => new Date().toISOString());
    const RANK = { yuksek: 0, orta: 1, dusuk: 2 };

    /** @param {Todo} a @param {Todo} b */
    function compare(a, b) {
      if (a.done !== b.done) return a.done ? 1 : -1;
      if (a.done) return (b.completedAt || '') < (a.completedAt || '') ? -1 : (b.completedAt || '') > (a.completedAt || '') ? 1 : 0;
      if (a.dueDate !== b.dueDate) {
        if (a.dueDate === null) return 1;
        if (b.dueDate === null) return -1;
        return a.dueDate < b.dueDate ? -1 : 1;
      }
      if (a.priority !== b.priority) return RANK[a.priority] - RANK[b.priority];
      return a.createdAt < b.createdAt ? -1 : a.createdAt > b.createdAt ? 1 : 0;
    }

    /** @param {string} id @param {any} patch */
    async function patchItem(id, patch) {
      const updated = await store.update(id, patch);
      items = items.map((t) => (t.id === id ? updated : t));
    }

    return {
      async load() { items = await store.list(); },
      /** @param {{ title: string, dueDate?: string|null, priority?: Todo['priority'] }} input */
      async add(input) {
        const title = normalizeTitle(input.title);
        const created = await store.insert({
          title,
          done: false,
          dueDate: input.dueDate || null,
          priority: input.priority || 'orta',
          completedAt: null,
        });
        items = items.concat(created);
      },
      /** @param {string} id */
      async toggle(id) {
        const cur = items.find((t) => t.id === id);
        if (!cur) throw new Error('Todo bulunamadı');
        await patchItem(id, cur.done ? { done: false, completedAt: null } : { done: true, completedAt: now() });
      },
      /** @param {string} id @param {{ title?: string, dueDate?: string|null, priority?: Todo['priority'] }} input */
      async edit(id, input) {
        /** @type {any} */
        const patch = {};
        if (input.title !== undefined) patch.title = normalizeTitle(input.title);
        if (input.dueDate !== undefined) patch.dueDate = input.dueDate || null;
        if (input.priority !== undefined) patch.priority = input.priority;
        await patchItem(id, patch);
      },
      /** @param {string} id */
      async remove(id) {
        await store.remove(id);
        items = items.filter((t) => t.id !== id);
      },
      async clearCompleted() {
        await store.removeCompleted();
        items = items.filter((t) => !t.done);
      },
      remainingCount() { return items.filter((t) => !t.done).length; },
      completedCount() { return items.filter((t) => t.done).length; },
      todos() {
        const today = opts.today();
        return items.slice().sort(compare).map((t) => ({
          ...t,
          isOverdue: !t.done && t.dueDate !== null && t.dueDate < today,
        }));
      },
    };
  }
  return { createTodoService };
});
