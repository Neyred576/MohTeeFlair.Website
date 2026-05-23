const webpush = require('web-push');

const VAPID_PUBLIC_KEY = 'BJnLCMI-QS5sWkLCVkYPO3Cw6h2-WzcKemqcagQ0mGOz4vcLrOiqd0iXTFiV06BU_9YXuK8N5MEBJe4Zac_Vx1M';
const VAPID_PRIVATE_KEY = 'fcUug0Rw2grCCE8kKK0M5OX4vo3Fq4titsINEEKwNE4';

webpush.setVapidDetails(
  'mailto:mohteeflair@gmail.com',
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY
);

exports.handler = async (event) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  try {
    const { subscriptions, title, message } = JSON.parse(event.body);

    if (!subscriptions || !message) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing subscriptions or message' }) };
    }

    const payload = JSON.stringify({
      title: title || 'Moh Tee Flair ✨',
      body: message,
      url: '/'
    });

    const results = await Promise.allSettled(
      subscriptions.map(sub => {
        const pushSubscription = {
          endpoint: sub.endpoint,
          keys: sub.keys
        };
        return webpush.sendNotification(pushSubscription, payload);
      })
    );

    const succeeded = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, sent: succeeded, failed })
    };
  } catch (error) {
    console.error('Push send error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};
