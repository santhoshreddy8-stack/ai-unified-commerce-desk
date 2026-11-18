require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const webhookRoutes = require('./routes/webhooks');

const app = express();
app.use(cors());

app.use(express.json({
  verify: (req, res, buf) => { req.rawBody = buf; }
}));

// Webhook routes still work normally
app.use('/api/webhooks', webhookRoutes);

// Demo Memory Store
let memoryTickets = [
  {
    id: '101',
    customer_email: 'sarah@example.com',
    message: 'My order arrived completely broken and late! I demand a full refund immediately.',
    urgency_level: 'HIGH_PRIORITY',
    status: 'OPEN',
    created_at: new Date().toISOString()
  },
  {
    id: '102',
    customer_email: 'mark@example.com',
    message: 'Hello, do you have tracking details available for my shipment?',
    urgency_level: 'NORMAL',
    status: 'OPEN',
    created_at: new Date().toISOString()
  }
];

// GET: Instantly return memory tickets
app.get('/api/tickets', (req, res) => {
  res.json(memoryTickets);
});

// POST: Send to AI Service, save in memory, return instantly
app.post('/api/tickets', async (req, res) => {
  const { email, message } = req.body;
  if (!email || !message) return res.status(400).json({ error: 'Email and message required' });

  const aiUrl = process.env.AI_SERVICE_URL || 'http://localhost:5000';
  let urgency = 'NORMAL';
  let sentimentScore = 0.0;

  try {
    const aiRes = await axios.post($aiUrl/analyze-ticket, { message }, { timeout: 3000 });
    urgency = aiRes.data.urgency;
    sentimentScore = aiRes.data.sentiment_score;
  } catch (e) {
    console.warn('⚠️ AI Service unreachable, defaulting urgency to NORMAL');
  }

  const newTicket = {
    id: String(Date.now()),
    customer_email: email,
    message,
    urgency_level: urgency,
    sentiment_score: sentimentScore,
    status: 'OPEN',
    created_at: new Date().toISOString()
  };

  memoryTickets.unshift(newTicket);
  res.status(201).json({ success: true, ticket: newTicket });
});

// PATCH: Resolve in memory
app.patch('/api/tickets/:id/resolve', (req, res) => {
  const { id } = req.params;
  memoryTickets = memoryTickets.map(t => t.id === id ? { ...t, status: 'RESOLVED' } : t);
  res.json({ success: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(\🚀 Core API running in DEMO MODE on http://localhost:\\));
