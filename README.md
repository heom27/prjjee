# 📚 Hangi Yazarsın? — Türk Edebiyatı Kişilik Testi

15 soruluk kişilik testi ile sana en yakın Türk yazarını keşfet! Namık Kemal mi, Orhan Veli mi, yoksa Cemal Süreya mı?

## ✨ Özellikler

- 🎯 15 soruluk interaktif kişilik testi
- 📊 6 Türk yazarı arasından eşleşme (Namık Kemal, Orhan Veli, Tanpınar, Sait Faik, Halide Edip, Cemal Süreya)
- 🔧 Admin paneli ile soru CRUD yönetimi
- 📧 SendGrid ile e-posta gönderimi
- 📈 Basit analitik ve istatistikler
- 🔒 JWT tabanlı admin authentication
- ⚡ Rate limiting (60 req/IP/saat)
- 📱 Mobil-first tasarım, glassmorphism UI
- 🚀 Vercel'e tek tıkla deploy

## 🚀 Hızlı Kurulum

### 1. Repo'yu klonla veya ZIP'ten çıkar
```bash
cd codedede
```

### 2. Bağımlılıkları yükle
```bash
npm install
```

### 3. Ortam değişkenlerini ayarla
```bash
cp .env.example .env
```

`.env` dosyasını düzenleyin:
```
ADMIN_PASSWORD=admin123
JWT_SECRET=your-super-secret-jwt-key-change-this
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Geliştirme sunucusunu başlat
```bash
npm run dev
```

Tarayıcıda http://localhost:3000 adresini aç.

## 🌐 Vercel Deploy

### Yöntem: GitHub Entegrasyonu
1. Repo'yu GitHub'a push edin
2. [vercel.com](https://vercel.com)'a gidin → "Import Project" → GitHub repo'nuzu seçin
3. Environment Variables ekleyin:
   - `ADMIN_PASSWORD` — Admin paneli şifresi (Örnek: `admin123`)
   - `JWT_SECRET` — JWT imzalama anahtarı (uzun rastgele string)
   - `NEXT_PUBLIC_SITE_URL` — Vercel domain'iniz (ör. https://codedede.vercel.app)
   - `SENDGRID_API_KEY` — (Opsiyonel) SendGrid API key
   - `SENDGRID_FROM_EMAIL` — (Opsiyonel) Gönderici e-posta
4. "Deploy" tıkla

## 🔑 Ortam Değişkenleri

| Değişken | Zorunlu | Açıklama |
|----------|---------|----------|
| `ADMIN_PASSWORD` | ✅ | Admin paneli giriş şifresi |
| `JWT_SECRET` | ✅ | JWT token imzalama anahtarı |
| `NEXT_PUBLIC_SITE_URL` | ✅ | Site URL'i (e-posta linkleri için) |
| `SENDGRID_API_KEY` | ❌ | SendGrid API anahtarı (yoksa console'a log) |
| `SENDGRID_FROM_EMAIL` | ❌ | Gönderici e-posta adresi |

## 🧪 Testler

```bash
# Unit testleri çalıştırır
npm test
```
