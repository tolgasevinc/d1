# Todo Uygulaması: Spec ve Uygulama Planı

> Bu belge `/mattpocock-skills:implement` ile kodlanmak üzere hazırlandı.
> Sözlük: [GLOSSARY.md](GLOSSARY.md). Kararlar: [docs/adr/](docs/adr/).
> Tüm metinlerde sözlükteki terimleri kullan (Todo, Başlık, Tamamlandı, Son tarih, Öncelik, Tamamlananları temizle).

---

## Problem Statement

Kullanıcı, kendi Mac'inde yapacaklarını takip etmek istiyor. Kurulum, sunucu çalıştırma veya terminal gerektirmeyen; çift tıklayınca tarayıcıda açılan basit bir Todo listesi istiyor. Veriler tarayıcının hafızasında değil, Supabase'de dursun ki tarayıcı verisi silinince kaybolmasın.

## Solution

Proje klasöründe `todo.html` adlı bir sayfa. Masaüstündeki kısayola çift tıklayınca varsayılan tarayıcıda `file://` üzerinden açılır. Sayfa, Supabase'deki tek bir tabloya doğrudan bağlanır (giriş/şifre yok). Tek bir liste vardır. Todo eklenir, düzenlenir, tamamlanır, silinir. Başlıklar her zaman BÜYÜK HARF (Türkçe kurallarıyla) saklanır. İnternet yoksa üstte uyarı çıkar ve değişiklik yapılamaz.

## User Stories

1. Kullanıcı olarak masaüstündeki kısayola çift tıklayınca uygulamanın tarayıcıda açılmasını istiyorum, böylece hiçbir şey kurmadan kullanabilirim.
2. Kullanıcı olarak açılışta mevcut Todo'larımın Supabase'den yüklenmesini istiyorum, böylece her açtığımda kaldığım yerden devam ederim.
3. Kullanıcı olarak bir Başlık yazıp Enter'a basarak yeni Todo eklemek istiyorum, böylece hızlıca not alabilirim.
4. Kullanıcı olarak Todo eklerken isteğe bağlı bir Son tarih seçmek istiyorum, böylece ne zamana kadar yapmam gerektiğini bilirim.
5. Kullanıcı olarak Todo eklerken Öncelik (Düşük / Orta / Yüksek) seçmek istiyorum; seçmezsem Orta olsun.
6. Kullanıcı olarak yazdığım Başlığın yazarken ve kaydedilirken BÜYÜK HARF olmasını istiyorum (i → İ, ı → I), böylece kodlama kurallarımla tutarlı olur.
7. Kullanıcı olarak boş ya da yalnızca boşluktan oluşan bir Başlıkla Todo ekleyememek istiyorum.
8. Kullanıcı olarak Başlığın baştaki/sondaki boşluklarının kırpılmasını istiyorum.
9. Kullanıcı olarak bir Todo'nun yanındaki kutucuğa tıklayarak onu Tamamlandı olarak işaretlemek istiyorum.
10. Kullanıcı olarak Tamamlandı işaretini geri alabilmek istiyorum, böylece yanlış tıklamayı düzeltebilirim.
11. Kullanıcı olarak Tamamlanan Todo'ların üstü çizili görünmesini ve listenin en altına inmesini istiyorum.
12. Kullanıcı olarak tamamlanmamış Todo'ların önce Son tarihi en yakın olandan sıralanmasını istiyorum.
13. Kullanıcı olarak Son tarihi aynı olan Todo'ların Önceliği yüksek olandan düşüğe sıralanmasını istiyorum.
14. Kullanıcı olarak Son tarihi olmayan Todo'ların tamamlanmamışların en sonunda (yine Önceliğe göre) durmasını istiyorum.
15. Kullanıcı olarak Son tarihi ve Önceliği aynı olan Todo'ların eklenme sırasına göre (eski üstte) dizilmesini istiyorum, böylece liste her açılışta aynı görünür.
16. Kullanıcı olarak Tamamlanan Todo'ların en son tamamlanan üstte olacak şekilde dizilmesini istiyorum.
17. Kullanıcı olarak Son tarihi bugünden önce olan ve tamamlanmamış Todo'ların kırmızıyla vurgulanmasını istiyorum. Son tarihi bugün olan gecikmiş sayılmaz.
18. Kullanıcı olarak Tamamlanmış bir Todo'nun, Son tarihi geçmiş olsa bile kırmızı görünmemesini istiyorum.
19. Kullanıcı olarak bir Todo'ya çift tıklayınca Başlık, Son tarih ve Önceliğini düzenleyebilmek istiyorum.
20. Kullanıcı olarak düzenlemeyi Enter ile kaydetmek, Esc ile iptal etmek istiyorum.
21. Kullanıcı olarak düzenlerken Başlığı boşaltırsam kaydın reddedilmesini ve eski hâlin korunmasını istiyorum.
22. Kullanıcı olarak düzenlerken Son tarihi kaldırabilmek istiyorum.
23. Kullanıcı olarak bir Todo'yu 🗑 düğmesiyle silmek istiyorum; silmeden önce onay sorulsun.
24. Kullanıcı olarak "Tamamlananları temizle" düğmesiyle tüm Tamamlanan Todo'ları tek seferde silmek istiyorum; önce kaç tane silineceği yazan bir onay sorulsun.
25. Kullanıcı olarak hiç Tamamlanan Todo yokken "Tamamlananları temizle" düğmesinin pasif olmasını istiyorum.
26. Kullanıcı olarak kaç tane tamamlanmamış Todo kaldığını görmek istiyorum (ör. "3 iş kaldı").
27. Kullanıcı olarak liste boşken anlamlı bir boş durum mesajı görmek istiyorum.
28. Kullanıcı olarak internet bağlantım yokken üstte "Bağlantı yok" uyarısı görmek ve ekleme/düzenleme/silme kontrollerinin pasif olmasını istiyorum.
29. Kullanıcı olarak bağlantı geri geldiğinde uyarının kalkmasını ve listenin Supabase'den yeniden yüklenmesini istiyorum.
30. Kullanıcı olarak bir kayıt işlemi sunucu hatasıyla başarısız olursa anlaşılır bir hata mesajı görmek ve ekranın Supabase'deki gerçek durumla tutarlı kalmasını istiyorum (iyimser güncelleme yapılmaz; sunucu onayından sonra ekran güncellenir).
31. Kullanıcı olarak Supabase projesi (ücretsiz planda 7 gün kullanılmayınca) duraklatılmışsa, bunu ve panelden nasıl yeniden açacağımı anlatan bir mesaj görmek istiyorum.
32. Kullanıcı olarak arayüzün Türkçe olmasını istiyorum (tarihler gg.aa.yyyy biçiminde).
33. Kullanıcı olarak uygulamanın Chrome ve Safari'de `file://` ile açıldığında çalışmasını istiyorum.

## Implementation Decisions

### Dağıtım ve çalışma şekli
- Build adımı yok. Sayfa düz HTML + CSS + klasik `<script src>` dosyalarından oluşur. **ES module (`type="module"`) kullanılmaz**: Chrome `file://` altında modül yüklemeyi CORS nedeniyle engeller.
- "Tek dosya" kararı kullanıcının deneyimi içindir: kullanıcı yalnızca `todo.html`'e çift tıklar. Yanındaki JS dosyaları aynı klasörde durur.
- Masaüstüne `todo.html` için bir Finder alias'ı konur.
- Supabase istemcisi CDN'den UMD paketiyle yüklenir (`@supabase/supabase-js@2`, jsDelivr), global `supabase.createClient` üzerinden kullanılır.

### Modüller
1. **Çekirdek (TodoService)**: Saf iş mantığı, DOM ve Supabase bilmez. Hem tarayıcıda global olarak hem Node'da (testler için) `require` ile yüklenebilecek UMD/CommonJS-uyumlu bir klasik script. Arayüzü:
   - `createTodoService(store, { today })`: Store'u enjekte alır; `today` bir fonksiyondur (yerel tarih, `YYYY-MM-DD`), testte sabitlenir.
   - `load()`: Store'dan tüm Todo'ları çeker.
   - `add({ title, dueDate?, priority? })`: Başlığı normalleştirir (trim + `toLocaleUpperCase('tr-TR')`), boşsa hata fırlatır, Öncelik verilmezse `orta`.
   - `edit(id, { title?, dueDate?, priority? })`: Aynı doğrulama; `dueDate: null` Son tarihi kaldırır.
   - `toggle(id)`: Tamamlandı'yı tersine çevirir; tamamlanırken `completedAt` doldurulur, geri alınırken temizlenir.
   - `remove(id)`, `clearCompleted()`.
   - `todos()`: Sıralanmış görünüm; her öğe `isOverdue` bilgisini taşır.
   - `remainingCount()`, `completedCount()`.
   - Store çağrısı başarısız olursa servis durumunu değiştirmez ve hatayı yukarı fırlatır (iyimser güncelleme yok).
2. **SupabaseTodoStore (adapter)**: Store arayüzünün Supabase uygulaması. Arayüz:
   - `list(): Promise<Todo[]>`
   - `insert(newTodo): Promise<Todo>`
   - `update(id, patch): Promise<Todo>`
   - `remove(id): Promise<void>`
   - `removeCompleted(): Promise<void>`
   - snake_case ↔ camelCase dönüşümü burada yapılır. Supabase hataları, ağ hatası mı sunucu hatası mı ayırt edilebilecek şekilde sarılır.
3. **InMemoryTodoStore (adapter)**: Testler için aynı Store arayüzü. Sabit id/zaman üretimi için enjekte edilebilir saat ve id üretici alır.
4. **UI (app)**: DOM oluşturma, olay bağlama, bağlantı durumu (`navigator.onLine` + `online`/`offline` olayları + Store hataları), onay diyalogları (`confirm()`), çift tıklayınca satır içi düzenleme. Başlık input'unda yazarken CSS `text-transform: uppercase` görsel olarak, kaydederken servis gerçek dönüşümü yapar.
5. **Config**: Supabase URL ve publishable key'i tutan küçük bir klasik script (global `TODO_CONFIG`). Kurulum biletinde CLI çıktısından üretilir.

### Domain modeli
```
Todo {
  id: string (uuid)
  title: string          // her zaman trim'li ve tr-TR büyük harf, boş olamaz
  done: boolean
  dueDate: string | null // 'YYYY-MM-DD', yerel tarih
  priority: 'dusuk' | 'orta' | 'yuksek'
  createdAt: string      // ISO
  completedAt: string | null
}
```

### Sıralama kuralı (kesin tanım)
1. Tamamlanmamışlar önce, Tamamlananlar sonra.
2. Tamamlanmamışlar içinde: Son tarih artan (Son tarihi olmayanlar en sonda) → Öncelik (yuksek > orta > dusuk) → `createdAt` artan.
3. Tamamlananlar içinde: `completedAt` azalan.

### Gecikmiş kuralı
`isOverdue = !done && dueDate !== null && dueDate < today()`. Karşılaştırma `YYYY-MM-DD` string karşılaştırmasıdır. `today()` UTC değil, kullanıcının yerel tarihidir.

### Veritabanı şeması (Supabase migration)
- Tablo `public.todos`:
  - `id uuid primary key default gen_random_uuid()`
  - `title text not null check (length(btrim(title)) > 0)`
  - `done boolean not null default false`
  - `due_date date null`
  - `priority text not null default 'orta' check (priority in ('dusuk','orta','yuksek'))`
  - `created_at timestamptz not null default now()`
  - `completed_at timestamptz null`
- RLS **açık**, `anon` rolüne select/insert/update/delete için `using (true) with check (true)` politikaları (kullanıcı girişsiz kullanımı seçti, bkz. ADR-0001).
- `anon` rolüne tablo üzerinde açık `grant select, insert, update, delete` verilir (yeni projelerde otomatik verilmeyebilir).

### Supabase projesi
- Organizasyon: `hhs` (id `nnenvoxqoardfiyeqjmz`). CLI ile giriş yapıldı.
- Yeni proje adı `todo`, bölge `eu-central-1` (Frankfurt).
- Veritabanı şifresi kurulum sırasında rastgele üretilir ve yalnızca yerel, git'e girmeyen bir dosyaya (izin 600) yazılır. Sohbete yazılmaz.
- Not: Organizasyonda duraklatılmış bir `otto` projesi var. Ücretsiz plandaki aktif proje sınırı dolarsa kullanıcıya sorulur; `otto`'ya dokunulmaz.

### Bağlantı durumu
- Durum: `online | offline | paused | error`.
- `offline`: `navigator.onLine === false` ya da Store'dan ağ hatası. Uyarı bandı "Bağlantı yok", tüm değiştirme kontrolleri pasif.
- `online` olayında `load()` tekrar çağrılır.
- `paused`: Supabase'e ulaşılamıyor ama internet var (ör. DNS/540 benzeri yanıt). Bant: "Supabase projesi duraklatılmış olabilir. supabase.com panelinden 'Restore' ile açın."

## Testing Decisions

- İyi test: yalnızca dışarıdan görünen davranışı test eder. Store'un içine ya da servisin özel alanlarına bakmaz. Beklenen değerler elle yazılmış somut örneklerdir, kodla aynı yoldan hesaplanmaz.
- **Kararlaştırılan tek seam: `createTodoService(store, { today })`**, `InMemoryTodoStore` ile.
  - Yakaladıkları: Başlık normalleştirme (Türkçe i/ı dahil), boş başlık reddi, varsayılan Öncelik, sıralama kuralının tamamı, gecikmiş kuralı (bugün/dün/yarın/tamamlanmış), toggle ve `completedAt`, clearCompleted, sayaçlar, Store hatasında durumun değişmemesi.
  - Kaçırdıkları: DOM davranışı, Supabase'e gerçek erişim, RLS/grant ayarları.
  - `implement` oturumu başında bu seam kullanıcıyla bir kez daha teyit edilir (tdd skill kuralı).
- Supabase adapter'ı ve UI otomatik test edilmez. Bunun yerine:
  - Kurulum biletinde CLI ile REST üzerinden insert/select/delete duman testi.
  - Son bilette tarayıcıda (`file://`) elle/otomasyonla kabul kontrolü (aşağıdaki kontrol listesi).
- Araçlar: `vitest` (testler), `typescript` yalnızca `tsc --noEmit` + `checkJs` ile JSDoc tip kontrolü için. Bu bir `package.json` gerektirir; yalnızca geliştirme içindir, kullanıcı hiçbir zaman `npm` çalıştırmaz.
- Önceki örnek: Repoda test yok (sıfırdan proje).

## Out of Scope

- Kullanıcı girişi / çoklu kullanıcı (ADR-0001).
- Çevrimdışı çalışma ve değişiklik kuyruğu.
- Birden fazla liste, etiket, not/açıklama alanı.
- JSON dışa/içe aktarma.
- Bildirim/hatırlatıcı, tekrarlayan Todo'lar.
- Sürükle-bırak ile elle sıralama.
- Gerçek zamanlı senkron (Supabase Realtime). Başka cihazdan yapılan değişiklik sayfa yenilenince görünür.
- `.app` paketi, PWA, Electron.

## Further Notes

- Kullanıcı Supabase'i hiç bilmiyor. Kullanıcıya dönük her mesaj ve kurulum açıklaması Türkçe ve sade olmalı.
- Publishable key `config` dosyasında düz metin durur; kullanıcı bu riski kabul etti. Config dosyası git'e girebilir, ama veritabanı şifresi asla girmez.
- Masaüstü alias'ı: `osascript -e 'tell application "Finder" to make alias file to (POSIX file "<mutlak yol>/todo.html") at desktop'`.

---

# Biletler (task graph)

Issue tracker yok; biletler bu belgede. `implement` her bileti bitirince commit atar. Bağımlılıklar `Engelleyen:` satırında.

### T1: Proje iskeleti ve araçlar
**Engelleyen:** yok
- `git init`, `.gitignore` (node_modules, veritabanı şifre dosyası, `supabase/.temp`).
- `package.json` (private), `vitest`, `typescript` dev bağımlılıkları; `test` ve `typecheck` script'leri.
- `tsconfig.json`: `allowJs`, `checkJs`, `noEmit`, `strict`, DOM lib.
- Boş `todo.html` iskeleti (Türkçe `lang="tr"`, UTF-8).
- **Bitti:** `npm test` (boş geçer) ve `npm run typecheck` çalışıyor.

### T2: Supabase projesi, şema ve config
**Engelleyen:** T1
- `supabase init`, `supabase projects create todo --org-id nnenvoxqoardfiyeqjmz --region eu-central-1 --db-password <üretilen>`; proje `ACTIVE_HEALTHY` olana kadar bekle.
- `supabase link --project-ref <ref>`.
- `supabase migration new create_todos` → yukarıdaki şema, RLS, politikalar, grant'ler.
- `supabase db push`.
- `supabase projects api-keys --project-ref <ref>` ile publishable (yoksa anon) key'i al, config dosyasını üret.
- Duman testi: publishable key ile REST üzerinden bir satır ekle, oku, sil.
- **Bitti:** Tablo var, anon key ile CRUD çalışıyor, şifre yalnızca git'e girmeyen dosyada.

### T3: TodoService çekirdeği (TDD)
**Engelleyen:** T1
- `tdd` skill ile, yalnızca kararlaştırılan seam üzerinden, dikey dilimler hâlinde:
  1. add + todos() (normalleştirme, tr-TR büyük harf, varsayılan Öncelik)
  2. boş Başlık reddi
  3. toggle + completedAt + sıralamada en alta inme
  4. sıralama kuralının tamamı
  5. gecikmiş kuralı
  6. edit (Son tarih kaldırma dahil, boş Başlık reddi)
  7. remove, clearCompleted, sayaçlar
  8. Store hatasında durumun değişmemesi
- `InMemoryTodoStore` bu bilette yazılır.
- **Bitti:** Tüm testler yeşil, typecheck temiz, dosya hem tarayıcıda global olarak hem Node'da `require` ile yüklenebiliyor.

### T4: SupabaseTodoStore adapter
**Engelleyen:** T2, T3 (Store arayüzü T3'te sabitlenir)
- Store arayüzünü supabase-js ile uygula; snake/camel dönüşümü; hata sınıflandırması (ağ / duraklatılmış / sunucu).
- **Bitti:** Typecheck temiz; küçük bir Node duman script'i ya da tarayıcı konsolu ile gerçek tabloya karşı list/insert/update/remove/removeCompleted çalışıyor.

### T5: Arayüz
**Engelleyen:** T3, T4
- Ekleme formu (Başlık, Son tarih, Öncelik), liste, kutucuk, üstü çizili, gecikmiş kırmızı, 🗑 ve onay, çift tıkla düzenle (Enter/Esc), Tamamlananları temizle (sayılı onay, pasif durum), kalan sayacı, boş durum, bağlantı bandı ve kontrollerin pasifleşmesi, `online` olayında yeniden yükleme.
- Sade, okunaklı CSS. Sayfa içinde `<style>`.
- **Bitti:** Aşağıdaki kabul kontrol listesi Chrome'da `file://` ile geçiyor.

### T6: Masaüstü kısayolu ve kabul
**Engelleyen:** T5
- Masaüstüne alias oluştur.
- Kabul kontrol listesi (Chrome ve Safari, `file://`):
  - [ ] Çift tıkla açılıyor, Todo'lar yükleniyor
  - [ ] "istanbul ılık" eklenince "İSTANBUL ILIK" olarak görünüyor ve Supabase'de öyle saklanıyor
  - [ ] Sıralama ve gecikmiş vurgusu doğru
  - [ ] Düzenle / tamamla / geri al / sil / temizle çalışıyor, sayfa yenilenince kalıcı
  - [ ] Wi-Fi kapatınca bant çıkıyor, kontroller pasif; açınca liste yenileniyor
- Ardından `code-review` skill'i, bulguların düzeltilmesi, son commit.

**Paralel çalışabilecekler:** T2 ve T3 (T1'den sonra).
