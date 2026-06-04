import './globals.css';

export const metadata = {
  title: 'Hangi Yazarsın? — Türk Edebiyatı Kişilik Testi',
  description: '15 soruluk kişilik testini çöz, sana en yakın Türk yazarını keşfet! Namık Kemal mi, Orhan Veli mi, yoksa Cemal Süreya mı?',
  keywords: 'kişilik testi, türk edebiyatı, yazar, quiz, onedio',
  openGraph: {
    title: 'Hangi Yazarsın? — Türk Edebiyatı Kişilik Testi',
    description: 'Sana en yakın Türk yazarını keşfet!',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body className="min-h-screen mesh-gradient">
        {children}
      </body>
    </html>
  );
}
