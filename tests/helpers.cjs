const { createTodoService } = require('../js/todo-service.js');
const { createInMemoryTodoStore } = require('../js/in-memory-store.js');

/** Test kurulumu: sabit bugün, artan sahte saat ve id. */
function setup(today = '2026-03-10') {
  let tick = 0;
  const store = createInMemoryTodoStore({
    now: () => new Date(Date.UTC(2026, 0, 1, 0, 0, tick++)).toISOString(),
    newId: (() => { let n = 0; return () => 'id' + ++n; })(),
  });
  const service = createTodoService(store, { today: () => today, now: () => new Date(Date.UTC(2026, 1, 1, 0, 0, tick++)).toISOString() });
  return { store, service };
}
/** Aynı Store'u paylaşan ikinci bir servis (sayfa yenileme benzetimi). */
function serviceFor(store, today = '2026-03-10') {
  return createTodoService(store, { today: () => today });
}
module.exports = { setup, serviceFor };
