/**
 * ElderGuard AI 360 — Real-Time SMS Dispatch Service
 * Handles SMS notification routing to phone number +91 7597036780 via Mobile SMS Protocol (sms:) & Web SMS Gateways.
 */

export interface SmsConfig {
  phoneNumber: string;
  fast2smsApiKey?: string;
  twilioSid?: string;
  twilioToken?: string;
}

export const DEFAULT_SMS_CONFIG: SmsConfig = {
  phoneNumber: '+917597036780', // User's primary mobile number
  fast2smsApiKey: '' // Optional Fast2SMS API Key for India direct SMS
};

export interface SendSmsParams {
  message: string;
  phoneNumber?: string;
  vitalName?: string;
  vitalValue?: string;
}

export interface SmsSendResult {
  success: boolean;
  smsUri: string;
  formattedText: string;
  statusMessage: string;
}

/**
 * Sends/triggers SMS to phone number +91 7597036780
 */
export const sendRealSms = async (params: SendSmsParams): Promise<SmsSendResult> => {
  const targetNumber = params.phoneNumber || DEFAULT_SMS_CONFIG.phoneNumber;
  const cleanNumber = targetNumber.replace(/\s+/g, '').replace(/^[+]/, '');

  const formattedText = `🚨 ELDERGUARD CRITICAL VITAL SURGE ALERT 🚨\n\n` +
    `Senior: Devendra Kumar (78y)\n` +
    `Vital Surge: ${params.vitalName || 'Surge Detected'}\n` +
    `Reading: ${params.vitalValue || 'Abnormal'}\n` +
    `Time: ${new Date().toLocaleTimeString()}\n\n` +
    `Alert: ${params.message}\n` +
    `Dashboard: http://localhost:5173`;

  // Standard Mobile & Desktop Native SMS Protocol (sms:+917597036780?body=...)
  // Automatically opens native Messages / SMS app on Android, iOS, and Windows Phone Link!
  const smsUri = `sms:${cleanNumber}?body=${encodeURIComponent(formattedText)}`;

  // Optional Fast2SMS API integration for direct Indian carrier SMS delivery
  const fast2smsKey = localStorage.getItem('elderguard_fast2sms_key') || DEFAULT_SMS_CONFIG.fast2smsApiKey;

  if (fast2smsKey) {
    try {
      const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
        method: 'POST',
        headers: {
          'authorization': fast2smsKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          route: 'q',
          message: formattedText,
          flash: 0,
          numbers: cleanNumber
        })
      });
      const data = await response.json();
      console.log('[SMS Service] Fast2SMS Carrier Response:', data);
      return {
        success: data.return === true,
        smsUri,
        formattedText,
        statusMessage: data.return ? 'Direct Carrier SMS Dispatched' : 'Native SMS Link Ready'
      };
    } catch (err) {
      console.warn('[SMS Service] Fast2SMS error fallback to Native SMS URI:', err);
    }
  }

  return {
    success: true,
    smsUri,
    formattedText,
    statusMessage: `Native SMS link generated for ${targetNumber}`
  };
};
