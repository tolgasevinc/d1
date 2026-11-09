import { describe, it, expect } from 'vitest';
import { createRequire } from 'node:module';
const { setup, serviceFor } = createRequire(import.meta.url)('./helpers.cjs');

describe('add', () => {
  it('başlığı kırpar ve tr-TR kurallarıyla büyük harfe çevirir, öncelik varsayılan orta', async () => {
    const { service } = setup();
    await service.load();
    await service.add({ title: '  istanbul ılık  ' });
    const [t] = service.todos();
    expect(t.title).toBe('İSTANBUL ILIK');
    expect(t.priority).toBe('orta');
    expect(t.done).toBe(false);
    expect(t.dueDate).toBe(null);
  });
});

describe('boş başlık', () => {
  it('boş ya da yalnızca boşluk olan başlıkla eklenemez ve liste değişmez', async () => {
    const { service } = setup();
    await service.load();
    await expect(service.add({ title: '   ' })).rejects.toThrow();
    await expect(service.add({ title: '' })).rejects.toThrow();
    expect(service.todos()).toEqual([]);
  });
});

describe('toggle', () => {
  it('tamamlanınca completedAt dolar, geri alınınca temizlenir', async () => {
    const { service } = setup();
    await service.load();
    await service.add({ title: 'a' });
    const id = service.todos()[0].id;
    await service.toggle(id);
    let t = service.todos()[0];
    expect(t.done).toBe(true);
    expect(t.completedAt).not.toBe(null);
    await service.toggle(id);
    t = service.todos()[0];
    expect(t.done).toBe(false);
    expect(t.completedAt).toBe(null);
  });

  it('tamamlanan en alta iner', async () => {
    const { service } = setup();
    await service.load();
    await service.add({ title: 'a' });
    await service.add({ title: 'b' });
    await service.toggle(service.todos()[0].id);
    expect(service.todos().map((t) => t.title)).toEqual(['B', 'A']);
  });
});

async function addAll(service, list) {
  for (const t of list) await service.add(t);
}
const titles = (service) => service.todos().map((t) => t.title);

describe('sıralama', () => {
  it('Son tarihi en yakın olan önce, tarihsizler tamamlanmamışların sonunda', async () => {
    const { service } = setup();
    await service.load();
    await addAll(service, [
      { title: 'tarihsiz' },
      { title: 'geç', dueDate: '2026-05-01' },
      { title: 'erken', dueDate: '2026-03-12' },
    ]);
    expect(titles(service)).toEqual(['ERKEN', 'GEÇ', 'TARİHSİZ']);
  });

  it('aynı Son tarihte Öncelik yüksekten düşüğe; tarihsizlerde de Öncelik geçerli', async () => {
    const { service } = setup();
    await service.load();
    await addAll(service, [
      { title: 'd', dueDate: '2026-03-12', priority: 'dusuk' },
      { title: 'y', dueDate: '2026-03-12', priority: 'yuksek' },
      { title: 'o', dueDate: '2026-03-12' },
      { title: 'td', priority: 'dusuk' },
      { title: 'ty', priority: 'yuksek' },
    ]);
    expect(titles(service)).toEqual(['Y', 'O', 'D', 'TY', 'TD']);
  });

  it('tarih ve Öncelik aynıysa eklenme sırası (eski üstte)', async () => {
    const { service } = setup();
    await service.load();
    await addAll(service, [{ title: 'bir' }, { title: 'iki' }, { title: 'üç' }]);
    expect(titles(service)).toEqual(['BİR', 'İKİ', 'ÜÇ']);
  });

  it('Tamamlananlar en son tamamlanan üstte', async () => {
    const { service } = setup();
    await service.load();
    await addAll(service, [{ title: 'a' }, { title: 'b' }, { title: 'c' }]);
    const id = (t) => service.todos().find((x) => x.title === t).id;
    await service.toggle(id('B'));
    await service.toggle(id('A'));
    await service.toggle(id('C'));
    expect(titles(service)).toEqual(['C', 'A', 'B']);
  });
});

describe('gecikmiş', () => {
  it('yalnızca Son tarihi bugünden önce olan ve tamamlanmamış olanlar gecikmiştir', async () => {
    const { service } = setup('2026-03-10');
    await service.load();
    await addAll(service, [
      { title: 'dün', dueDate: '2026-03-09' },
      { title: 'bugün', dueDate: '2026-03-10' },
      { title: 'yarın', dueDate: '2026-03-11' },
      { title: 'tarihsiz' },
      { title: 'bitmiş', dueDate: '2026-03-01' },
    ]);
    await service.toggle(service.todos().find((t) => t.title === 'BİTMİŞ').id);
    const overdue = Object.fromEntries(service.todos().map((t) => [t.title, t.isOverdue]));
    expect(overdue).toEqual({ DÜN: true, BUGÜN: false, YARIN: false, TARİHSİZ: false, BİTMİŞ: false });
  });
});

describe('edit', () => {
  it('başlık, Son tarih ve Önceliği değiştirir; başlık normalleştirilir', async () => {
    const { service } = setup();
    await service.load();
    await service.add({ title: 'a' });
    const id = service.todos()[0].id;
    await service.edit(id, { title: ' ışık ', dueDate: '2026-04-01', priority: 'yuksek' });
    expect(service.todos()[0]).toMatchObject({ title: 'IŞIK', dueDate: '2026-04-01', priority: 'yuksek' });
  });

  it('dueDate: null Son tarihi kaldırır; verilmeyen alanlar korunur', async () => {
    const { service } = setup();
    await service.load();
    await service.add({ title: 'a', dueDate: '2026-04-01', priority: 'dusuk' });
    const id = service.todos()[0].id;
    await service.edit(id, { dueDate: null });
    expect(service.todos()[0]).toMatchObject({ title: 'A', dueDate: null, priority: 'dusuk' });
  });

  it('boş başlık reddedilir ve eski hâl korunur', async () => {
    const { service } = setup();
    await service.load();
    await service.add({ title: 'a' });
    const id = service.todos()[0].id;
    await expect(service.edit(id, { title: '  ' })).rejects.toThrow();
    expect(service.todos()[0].title).toBe('A');
  });
});

describe('silme ve sayaçlar', () => {
  it('remove tek Todo siler', async () => {
    const { service } = setup();
    await service.load();
    await addAll(service, [{ title: 'a' }, { title: 'b' }]);
    await service.remove(service.todos()[0].id);
    expect(titles(service)).toEqual(['B']);
  });

  it('clearCompleted yalnızca tamamlananları siler; sayaçlar doğru', async () => {
    const { service } = setup();
    await service.load();
    await addAll(service, [{ title: 'a' }, { title: 'b' }, { title: 'c' }]);
    await service.toggle(service.todos()[0].id);
    await service.toggle(service.todos()[1].id);
    expect(service.completedCount()).toBe(2);
    expect(service.remainingCount()).toBe(1);
    await service.clearCompleted();
    expect(service.todos().length).toBe(1);
    expect(service.completedCount()).toBe(0);
    expect(service.remainingCount()).toBe(1);
  });

  it('load, kalıcı veriyi Store\'dan geri getirir', async () => {
    const { service, store } = setup();
    const other = serviceFor(store);
    await other.load();
    await other.add({ title: 'kalıcı' });
    await service.load();
    expect(titles(service)).toEqual(['KALICI']);
  });
});

describe('Store hatası', () => {
  it('başarısız işlemde durum değişmez ve hata yukarı fırlar', async () => {
    const { service, store } = setup();
    await service.load();
    await service.add({ title: 'a' });
    const before = service.todos();
    const id = before[0].id;
    for (const op of [
      () => service.add({ title: 'b' }),
      () => service.toggle(id),
      () => service.edit(id, { title: 'x' }),
      () => service.remove(id),
      () => service.clearCompleted(),
    ]) {
      store.failNext(new Error('ağ'));
      await expect(op()).rejects.toThrow('ağ');
      expect(service.todos()).toEqual(before);
    }
  });
});

describe('eşzamanlı işlemler', () => {
  it('beklemeden art arda iki toggle sırayla işlenir: ikincisi birincisini geri alır', async () => {
    const { service } = setup();
    await service.load();
    await service.add({ title: 'a' });
    const id = service.todos()[0].id;
    await Promise.all([service.toggle(id), service.toggle(id)]);
    expect(service.todos()[0].done).toBe(false);
    expect(service.todos()[0].completedAt).toBe(null);
  });
});
