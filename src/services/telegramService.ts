/**
 * ElderGuard AI 360 — Telegram Emergency Alert Service
 * Dispatches real-time vital surge & emergency SOS alerts directly to family members via Telegram Bot API (@jinjunh_bot).
 */

export interface TelegramConfig {
  botToken: string;
  chatId: string;
  recipientName: string;
  isEnabled: boolean;
}

export const DEFAULT_TELEGRAM_CONFIG: TelegramConfig = {
  botToken: '8892676006:AAG6jWPy9dnxA21BK4Idwr9seUXs4Q5Gwws', // Live Telegram Bot Token (@jinjunh_bot)
  chatId: '8646441377', // User Telegram ID
  recipientName: 'Universe (+91 7597036780 / @jinjunh_bot)',
  isEnabled: true
};

export interface SendTelegramParams {
  message: string;
  vitalName?: string;
  vitalValue?: string;
  recipient?: string;
  severity?: 'CRITICAL' | 'WARNING';
}

export interface TelegramSendResult {
  success: boolean;
  telegramUrl: string;
  formattedText: string;
  error?: any;
}

/**
 * Sends emergency notification to Telegram chat via @jinjunh_bot
 */
export const sendTelegramAlert = async (params: SendTelegramParams): Promise<TelegramSendResult> => {
  const savedToken = localStorage.getItem('elderguard_telegram_bot_token') || DEFAULT_TELEGRAM_CONFIG.botToken;
  const savedChatId = localStorage.getItem('elderguard_telegram_chat_id') || DEFAULT_TELEGRAM_CONFIG.chatId;

  const formattedText = `🚨 ELDERGUARD EMERGENCY ALERT 🚨\n\n` +
    `👤 Senior: Devendra Kumar (78y)\n` +
    `📍 Location: Living Room, Home\n` +
    `⚠️ Surge: ${params.vitalName || 'Critical Vital Sign Exceeded'}\n` +
    `📊 Reading: ${params.vitalValue || 'Surge State'}\n` +
    `⏰ Timestamp: ${new Date().toLocaleTimeString()}\n\n` +
    `💬 Alert Message:\n${params.message}\n\n` +
    `📲 Delivered to: ${params.recipient || DEFAULT_TELEGRAM_CONFIG.recipientName}\n` +
    `🌐 Caregiver Portal: http://localhost:5173`;

  // Fallback Telegram Link (Direct to Bot t.me/jinjunh_bot or Share URL)
  const botLink = `https://t.me/jinjunh_bot`;
  const telegramShareUrl = `https://t.me/share/url?url=${encodeURIComponent('http://localhost:5173')}&text=${encodeURIComponent(formattedText)}`;

  if (!savedToken || !savedChatId) {
    console.log('[Telegram Service] No API keys set. Using Direct Web Share Link fallback.');
    return {
      success: true,
      telegramUrl: telegramShareUrl,
      formattedText
    };
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${savedToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: savedChatId,
        text: formattedText
      })
    });

    const data = await response.json();
    console.log('[Telegram Service] Telegram API Response:', data);

    return {
      success: data.ok === true,
      telegramUrl: data.ok ? botLink : telegramShareUrl,
      formattedText,
      error: data.ok ? undefined : data.description
    };
  } catch (err) {
    console.warn('[Telegram Service] Network error sending Telegram alert:', err);
    return {
      success: false,
      telegramUrl: telegramShareUrl,
      formattedText,
      error: err
    };
  }
};
