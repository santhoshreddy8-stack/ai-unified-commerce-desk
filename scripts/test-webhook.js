/**
 * Project: AI Unified Commerce Desk
 * Author: Kandlagari Santhosh Reddy
 * Description: Cryptographic HMAC-SHA256 simulator for testing Shopify Webhooks locally.
 */
const crypto = require('crypto');

const SHOPIFY_WEBHOOK_SECRET = 'my_test_secret_123';
const ENDPOINT_URL = 'http://localhost:3000/api/webhooks/shopify/orders/create';

const payload = {
  id: Math.floor(1000000000 + Math.random() * 9000000000),
  email: "priority.customer@primepawz.com",
  total_price: "145.00",
  financial_status: "paid",
  line_items: [
    { title: "Slow Feeder Dog Bowl - Large" },
    { title: "Foldable Double Pet Bowl" }
  ]
};

const rawBody = JSON.stringify(payload);
const generatedSignature = crypto
  .createHmac('sha256', SHOPIFY_WEBHOOK_SECRET)
  .update(rawBody, 'utf8')
  .digest('base64');

async function simulateWebhook() {
  console.log('🚀 Firing signed Shopify webhook payload (Engineered by Kandlagari Santhosh Reddy)...');
  try {
    const response = await fetch(ENDPOINT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Hmac-Sha256': generatedSignature
      },
      body: rawBody
    });
    console.log(`📡 Status: ${response.status} | Body: ${await response.text()}`);
  } catch (error) {
    console.error('⚠️ Error: Ensure core-api is running on port 3000.');
  }
}

simulateWebhook();