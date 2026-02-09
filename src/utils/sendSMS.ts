// src/utils/sendSMS.ts
// Send SMS verification codes via Twilio Verify API

interface VerificationResult {
  success: boolean;
  status?: string;
  error?: string;
}

interface TwilioErrorResponse {
  message?: string;
}

interface TwilioVerificationResponse {
  status: string;
}

export async function sendVerificationSMS(phoneNumber: string): Promise<VerificationResult> {
  try {
    // Twilio credentials from environment variables
    const accountSid = import.meta.env.VITE_TWILIO_ACCOUNT_SID;
    const authToken = import.meta.env.VITE_TWILIO_AUTH_TOKEN;
    const verifyServiceSid = import.meta.env.VITE_TWILIO_VERIFY_SERVICE_SID;

    // Format phone number for Twilio (needs +1 prefix)
    const toNumber = phoneNumber.startsWith('+')
      ? phoneNumber
      : `+1${phoneNumber.replace(/\D/g, '')}`;

    // Twilio Verify API endpoint
    const url = `https://verify.twilio.com/v2/Services/${verifyServiceSid}/Verifications`;

    // Create form data
    const formData = new URLSearchParams();
    formData.append('To', toNumber);
    formData.append('Channel', 'sms');

    // Send verification request
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + btoa(`${accountSid}:${authToken}`),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    });

    if (!response.ok) {
      const error: TwilioErrorResponse = await response.json();
      throw new Error(`Twilio error: ${error.message || 'Failed to send verification'}`);
    }

    const data: TwilioVerificationResponse = await response.json();
    console.log('✅ Verification sent:', data.status);
    return { success: true, status: data.status };

  } catch (error) {
    console.error('❌ Failed to send verification:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function verifyCode(phoneNumber: string, code: string): Promise<VerificationResult> {
  try {
    const accountSid = import.meta.env.VITE_TWILIO_ACCOUNT_SID;
    const authToken = import.meta.env.VITE_TWILIO_AUTH_TOKEN;
    const verifyServiceSid = import.meta.env.VITE_TWILIO_VERIFY_SERVICE_SID;

    const toNumber = phoneNumber.startsWith('+')
      ? phoneNumber
      : `+1${phoneNumber.replace(/\D/g, '')}`;

    const url = `https://verify.twilio.com/v2/Services/${verifyServiceSid}/VerificationCheck`;

    const formData = new URLSearchParams();
    formData.append('To', toNumber);
    formData.append('Code', code);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + btoa(`${accountSid}:${authToken}`),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    });

    if (!response.ok) {
      const error: TwilioErrorResponse = await response.json();
      throw new Error(`Verification failed: ${error.message || 'Invalid code'}`);
    }

    const data: TwilioVerificationResponse = await response.json();
    console.log('✅ Verification status:', data.status);

    return {
      success: data.status === 'approved',
      status: data.status
    };

  } catch (error) {
    console.error('❌ Verification check failed:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
