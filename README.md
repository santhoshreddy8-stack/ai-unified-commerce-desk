# 🚀 AI Unified Commerce Desk

**Architected by:** Kandlagari Santhosh Reddy  
**Architecture:** Microservices Monorepo (Python, Node.js, React, PostgreSQL)

An autonomous e-commerce support queue orchestrator designed to solve high-volume customer service bottlenecks. This system ingests simulated Shopify webhooks, scores customer sentiment using an NLP microservice, and automatically escalates frustrated buyers to the top of the queue.

## 🧠 System Architecture

The project is structured as a monorepo containing three isolated services:

1. **Python AI Microservice (`/ai-service`)**: A lightweight Flask API utilizing `vaderSentiment` for rule-based Natural Language Processing. It evaluates text polarity with sub-10ms inference latency to classify tickets as `NORMAL` or `HIGH_PRIORITY`.
2. **Node.js Core API Gateway (`/core-api`)**: An Express.js backend that handles cryptographic webhook ingestion. It utilizes `crypto.timingSafeEqual` for HMAC-SHA256 signature verification to prevent timing attacks.
3. **React Client Dashboard (`/client`)**: A Vite-powered React 18 SPA styled with Tailwind CSS v4, providing support agents with a real-time, priority-sorted view of inbound tickets.

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **API Gateway**: Node.js, Express, Axios
- **AI Engine**: Python 3.13, Flask, VADER Sentiment Analysis
- **Database & Auth**: Supabase (PostgreSQL) with Row Level Security (RLS)
- **CI/CD**: GitHub Actions

## 🔒 Security Features Implemented

- **Idempotency**: Webhook database inserts use `upsert` with `onConflict` resolution to prevent duplicate orders during retry flooding.
- **Timing Attack Mitigation**: Webhook signatures are compared using constant-time buffer string comparison.
- **Zero-Trust DB**: Direct database access is secured via Supabase Row Level Security (RLS).

## 🚀 How to Run Locally

Start all three services concurrently in separate terminal panes:

**1. Start the AI Microservice**

```bash
cd ai-service
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
python app.py
```
