const admin = require('firebase-admin');

// Lazy initializer for Firebase Admin SDK to prevent crashing if config is missing
function getFirestoreDb() {
  if (admin.apps.length) {
    return admin.firestore();
  }

  const serviceAccountStr = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!serviceAccountStr) {
    console.warn("FIREBASE_SERVICE_ACCOUNT environment variable is not defined. Leads will not be saved to Firestore.");
    return null;
  }

  try {
    const serviceAccount = JSON.parse(serviceAccountStr);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    return admin.firestore();
  } catch (err) {
    console.error("Failed to parse or initialize Firebase Admin SDK from FIREBASE_SERVICE_ACCOUNT:", err);
    return null;
  }
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed'
    };
  }

  try {
    const { phone, source, page } = JSON.parse(event.body);

    if (!phone) {
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, error: "Missing required WhatsApp phone number" })
      };
    }

    // Clean up phone number: remove non-digits
    const cleanPhone = phone.replace(/\D/g, '');
    const finalPhone = cleanPhone.length === 12 && cleanPhone.startsWith('91') ? cleanPhone.substring(2) : cleanPhone;

    console.log(`[CAPTURE-LEAD] Processing lead for WhatsApp: +91${finalPhone}`);

    // 1. Save to Firestore (leads collection)
    let firestoreSaved = false;
    const db = getFirestoreDb();
    if (db) {
      try {
        await db.collection('exit_intent_leads').add({
          phone: `+91${finalPhone}`,
          source: source || 'Exit Intent Popup',
          page: page || 'N/A',
          capturedAt: new Date().toISOString(),
          discountCode: 'MUKESH150',
          converted: false
        });
        firestoreSaved = true;
        console.log('[CAPTURE-LEAD] Lead successfully saved to Firestore.');
      } catch (dbErr) {
        console.error('[CAPTURE-LEAD] Error writing lead to Firestore:', dbErr);
      }
    } else {
      console.warn('[CAPTURE-LEAD] Skipping Firestore save as Firebase is not configured.');
    }

    // 2. Send WhatsApp notification via Interakt API
    let whatsappSent = false;
    const interaktKey = process.env.INTERAKT_API_KEY;
    if (interaktKey) {
      try {
        const response = await fetch('https://api.interakt.ai/v1/public/message/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${interaktKey}`
          },
          body: JSON.stringify({
            countryCode: '+91',
            phoneNumber: finalPhone,
            callbackData: 'exit_intent',
            type: 'Template',
            template: {
              name: 'exit_intent_discount', // pre-approved WhatsApp template
              languageCode: 'en',
              bodyValues: ['MUKESH150', '₹150', '24 hours']
            }
          })
        });

        const statusText = response.status;
        console.log(`[CAPTURE-LEAD] Interakt API response status: ${statusText}`);
        whatsappSent = response.ok;
      } catch (waErr) {
        console.error('[CAPTURE-LEAD] Error triggering Interakt WhatsApp message:', waErr);
      }
    } else {
      console.warn('[CAPTURE-LEAD] Skipping Interakt WhatsApp trigger as INTERAKT_API_KEY is not defined.');
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({ 
        success: true, 
        firestoreSaved, 
        whatsappSent,
        message: 'Lead capture processed successfully'
      })
    };

  } catch (error) {
    console.error('[CAPTURE-LEAD] Exception inside handler:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ success: false, error: error.message })
    };
  }
};
