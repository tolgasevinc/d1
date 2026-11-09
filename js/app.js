(function () {
  'use strict';
  const $ = (/** @type {string} */ id) => /** @type {any} */ (document.getElementById(id));
  const g = /** @type {any} */ (window);

  /** @type {Record<string,string>} */
  const PRIO_LABEL = { dusuk: 'Düşük', orta: 'Orta', yuksek: 'Yüksek' };

  function localToday() {
    const d = new Date();
    const p = (/** @type {number} */ n) => String(n).padStart(2, '0');
    return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate());
  }
  /** @param {string} iso */
  function fmtDate(iso) {
    const [y, m, d] = iso.split('-');
    return d + '.' + m + '.' + y;
  }

  const cfg = g.TODO_CONFIG;
  // CDN yüklenemediyse (ör. internet yokken açıldı) sayfa yine de bandı göstermeli.
  const hasSdk = !!(g.supabase && g.supabase.createClient);
  const failing = () => Promise.reject(Object.assign(new Error('Supabase kitaplığı yüklenemedi'), { kind: 'network' }));
  const store = hasSdk
    ? g.createSupabaseTodoStore(g.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_KEY))
    : { list: failing, insert: failing, update: failing, remove: failing, removeCompleted: failing };
  const service = g.createTodoService(store, { today: localToday });

  /** 'online' | 'offline' | 'paused' | 'error' */
  let status = navigator.onLine ? 'online' : 'offline';
  let editingId = /** @type {string|null} */ (null);

  const BANNERS = {
    offline: 'Bağlantı yok. İnternet gelene kadar değişiklik yapılamaz.',
    paused: "Supabase projesi duraklatılmış olabilir. supabase.com panelinden 'Restore' ile açın.",
    error: "Sunucuya ulaşılamadı. Supabase projesi duraklatılmış olabilir: supabase.com panelinden 'Restore' ile açın. Otomatik olarak yeniden denenecek.",
  };

  /** @param {any} e */
  function handleError(e) {
    const kind = e && e.kind;
    if (kind === 'network') status = navigator.onLine ? 'error' : 'offline';
    else if (kind === 'paused') status = 'paused';
    else { $('error').textContent = 'İşlem başarısız: ' + ((e && e.message) || 'bilinmeyen hata'); }
    render();
  }

  /** @param {() => Promise<any>} fn */
  async function run(fn) {
    $('error').textContent = '';
    try { await fn(); } catch (/** @type {any} */ e) {
      if (e && /boş olamaz/.test(e.message)) $('error').textContent = e.message + '.';
      else handleError(e);
      return false;
    }
    render();
    return true;
  }

  async function reload() {
    try { await service.load(); if (status !== 'online') status = 'online'; } catch (e) { handleError(e); return; }
    render();
  }

  function render() {
    const disabled = status !== 'online';
    const banner = $('banner');
    banner.hidden = status === 'online';
    banner.textContent = /** @type {any} */ (BANNERS)[status] || '';
    for (const id of ['title', 'due', 'priority', 'add-btn']) $(id).disabled = disabled;

    const list = $('list');
    list.textContent = '';
    const todos = service.todos();
    for (const t of todos) list.appendChild(t.id === editingId ? editorRow(t, disabled) : row(t, disabled));
    $('empty').hidden = todos.length > 0;

    const n = service.remainingCount();
    $('remaining').textContent = n + ' iş kaldı';
    $('clear-btn').disabled = disabled || service.completedCount() === 0;
  }

  /** @param {any} t @param {boolean} disabled */
  function row(t, disabled) {
    const li = document.createElement('li');
    li.className = (t.done ? 'done ' : '') + (t.isOverdue ? 'overdue' : '');
    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.checked = t.done;
    cb.disabled = disabled;
    cb.addEventListener('change', () => run(() => service.toggle(t.id)));
    const title = document.createElement('span');
    title.className = 'title';
    title.textContent = t.title;
    const due = document.createElement('span');
    due.className = 'due';
    due.textContent = t.dueDate ? fmtDate(t.dueDate) : '';
    const prio = document.createElement('span');
    prio.className = 'prio';
    prio.textContent = PRIO_LABEL[t.priority];
    const del = document.createElement('button');
    del.type = 'button';
    del.textContent = '🗑';
    del.title = 'Sil';
    del.disabled = disabled;
    del.addEventListener('click', () => {
      if (confirm('"' + t.title + '" silinsin mi?')) run(() => service.remove(t.id));
    });
    li.append(cb, title, due, prio, del);
    if (!disabled) li.addEventListener('dblclick', (e) => {
      if (e.target === cb || e.target === del) return;
      editingId = t.id;
      render();
      const input = $('list').querySelector('.editor input[type=text]');
      if (input) input.focus();
    });
    return li;
  }

  /** @param {any} t @param {boolean} disabled */
  function editorRow(t, disabled) {
    const li = document.createElement('li');
    const box = document.createElement('div');
    box.className = 'editor';
    const title = document.createElement('input');
    title.type = 'text';
    title.value = t.title;
    const due = document.createElement('input');
    due.type = 'date';
    due.value = t.dueDate || '';
    const prio = document.createElement('select');
    for (const k of Object.keys(PRIO_LABEL)) {
      const o = document.createElement('option');
      o.value = k;
      o.textContent = PRIO_LABEL[k];
      o.selected = k === t.priority;
      prio.appendChild(o);
    }
    for (const el of [title, due, prio]) el.disabled = disabled;
    async function save() {
      const ok = await run(() => service.edit(t.id, { title: title.value, dueDate: due.value || null, priority: prio.value }));
      if (ok) { editingId = null; render(); }
    }
    function cancel() { editingId = null; $('error').textContent = ''; render(); }
    box.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { e.preventDefault(); save(); }
      else if (e.key === 'Escape') cancel();
    });
    box.append(title, due, prio);
    li.appendChild(box);
    return li;
  }

  $('add-form').addEventListener('submit', async (/** @type {Event} */ e) => {
    e.preventDefault();
    const ok = await run(() => service.add({ title: $('title').value, dueDate: $('due').value || null, priority: $('priority').value }));
    if (ok) { $('title').value = ''; $('due').value = ''; $('priority').value = 'orta'; $('title').focus(); }
  });

  $('clear-btn').addEventListener('click', () => {
    const n = service.completedCount();
    if (n > 0 && confirm(n + ' tamamlanan iş silinecek. Emin misiniz?')) run(() => service.clearCompleted());
  });

  window.addEventListener('offline', () => { status = 'offline'; render(); });
  window.addEventListener('online', () => {
    if (!hasSdk) { location.reload(); return; }
    status = 'online';
    reload();
  });

  // 'error'/'paused' durumundan tarayıcı olayı olmadan çıkış: 10 sn'de bir yeniden dene.
  setInterval(() => {
    if (status === 'error' || status === 'paused') {
      if (!hasSdk) { if (navigator.onLine) location.reload(); return; }
      reload();
    }
  }, 10000);

  render();
  if (!hasSdk) { status = navigator.onLine ? 'error' : 'offline'; render(); }
  else if (navigator.onLine) reload();
})();
