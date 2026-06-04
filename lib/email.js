import sgMail from '@sendgrid/mail';
import nodemailer from 'nodemailer';

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = process.env.SMTP_PORT || '587';
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL || SMTP_USER || 'noreply@codedede.com';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export async function sendResultEmail(toEmail, winner, author, scores) {
  if (!toEmail) {
    console.log('[Email] No email provided, skipping.');
    return { sent: false, reason: 'no_email' };
  }

  const sortedScores = Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([id, score]) => `${id}: ${score}`)
    .join(', ');

  const subject = `Senin Yazar Vibe'ın: ${winner.name}`;
  const text = `Merhaba,\n\nTest sonuçlarına göre sana en yakın yazar vibes'ı: ${winner.name}.\n\nKısa açıklama:\n${author.shortBio_tr}\n\nSonuç detayları:\n- Confidence: %${Math.round(winner.confidence * 100)}\n- Top skorlar: ${sortedScores}\n\nTesti tekrar denemek için: ${SITE_URL}\n\nTeşekkürler!`;
  const html = `<div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
    <h1 style="color:#7c3aed;">Senin Yazar Vibe'ın: ${winner.name}</h1>
    <p>Merhaba,</p>
    <p>Test sonuçlarına göre sana en yakın yazar vibes'ı: <strong>${winner.name}</strong></p>
    <div style="background:#f5f3ff;border-radius:12px;padding:16px;margin:16px 0;">
      <p style="margin:0;color:#4c1d95;">${author.shortBio_tr}</p>
    </div>
    <p><strong>Confidence:</strong> %${Math.round(winner.confidence * 100)}</p>
    <p><strong>Top skorlar:</strong> ${sortedScores}</p>
    <a href="${SITE_URL}" style="display:inline-block;background:#7c3aed;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;margin-top:16px;">Testi Tekrar Dene</a>
    <p style="color:#94a3b8;font-size:12px;margin-top:24px;">Bu e-posta codedede.com tarafından gönderilmiştir.</p>
  </div>`;

  // 1. Try SMTP if credentials are provided
  if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
    console.log(`[Email] Trying SMTP: host=${SMTP_HOST}, port=${SMTP_PORT}, user=${SMTP_USER}`);
    try {
      const transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: parseInt(SMTP_PORT, 10),
        secure: false,
        auth: {
          user: SMTP_USER,
          pass: SMTP_PASS.trim(), // trim possible whitespace from env var
        },
        tls: {
          rejectUnauthorized: false, // avoid TLS issues on serverless
        },
      });

      // Verify connection first
      await transporter.verify();

      await transporter.sendMail({
        from: `"Hangi Yazarsın?" <${SMTP_USER}>`,
        to: toEmail,
        subject,
        text,
        html,
      });

      console.log(`[Email] Sent via SMTP to ${toEmail}`);
      return { sent: true, method: 'smtp' };
    } catch (error) {
      console.error('[Email] SMTP Error:', error.message, error.code);
      // Fallback to SendGrid if SMTP fails
    }
  } else {
    console.warn('[Email] SMTP credentials missing:', { SMTP_HOST: !!SMTP_HOST, SMTP_USER: !!SMTP_USER, SMTP_PASS: !!SMTP_PASS });
  }

  // 2. Try SendGrid as fallback
  if (SENDGRID_API_KEY) {
    try {
      sgMail.setApiKey(SENDGRID_API_KEY);
      await sgMail.send({ to: toEmail, from: FROM_EMAIL, subject, text, html });
      console.log(`[Email] Sent via SendGrid to ${toEmail}`);
      return { sent: true, method: 'sendgrid' };
    } catch (error) {
      console.error('[Email] SendGrid Error:', error.message);
      return { sent: false, reason: error.message };
    }
  }

  console.log('[Email] No mail credentials configured. Logged output:');
  console.log(`  To: ${toEmail}`);
  console.log(`  Subject: ${subject}`);
  console.log(`  Body: ${text.substring(0, 150)}...`);
  return { sent: false, reason: 'no_credentials_configured' };
}
