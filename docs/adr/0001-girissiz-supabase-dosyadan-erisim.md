# 0001: Yerel HTML dosyasından girişsiz Supabase erişimi

**Durum:** Kabul edildi (2026-11-09)

## Bağlam

Uygulama, `file://` üzerinden açılan tek bir HTML sayfası. Veriler kalıcı olsun ve tarayıcı verisi silinince kaybolmasın diye Supabase'de tutulacak. Tek kullanıcı var: sahibi, kendi bilgisayarında.

## Karar

Uygulamada giriş yok. Sayfa Supabase publishable (anon) key ile doğrudan `todos` tablosuna bağlanır. RLS açık, ama `anon` rolüne tüm satırlarda okuma/yazma/silme izni veren politikalar var.

## Değerlendirilen alternatifler

- **E-posta + şifre ile Supabase Auth ve kullanıcıya bağlı RLS:** Daha güvenli, ama kullanıcı ek adım istemedi.
- **localStorage:** Kurulumsuz, ama tarayıcı verisi silinince ya da başka tarayıcıda açılınca veri kayboluyor.

## Sonuçlar

- Key'i ele geçiren herkes listeyi okuyup değiştirebilir. Key yalnızca kullanıcının bilgisayarındaki dosyada durduğu için bu risk kabul edildi.
- Uygulama ileride paylaşılırsa ya da yayınlanırsa bu karar yeniden ele alınmalı: Auth eklenir ve politikalar `auth.uid()` ile kısıtlanır.

## Güncelleme (2026-11-09)

Uygulama GitHub Pages ile yayınlandı; `js/config.js` repoda ve sitede herkese açık. Sitenin URL'sini bilen herkesin listeyi okuyup değiştirebileceği risk, Auth eklemeden bilerek kabul edildi.
