"""
Project: AI Unified Commerce Desk - NLP Sentiment Microservice
Author: Kandlagari Santhosh Reddy
"""
from flask import Flask, request, jsonify
from flask_cors import CORS
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from waitress import serve

app = Flask(__name__)
CORS(app)
sia = SentimentIntensityAnalyzer()

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        "status": "healthy",
        "service": "ai-nlp-microservice",
        "author": "Kandlagari Santhosh Reddy"
    }), 200

@app.route('/analyze-ticket', methods=['POST'])
def analyze():
    data = request.get_json(silent=True) or {}
    message = data.get('message', '').strip()
    if not message:
        return jsonify({"error": "Message text is required"}), 400

    scores = sia.polarity_scores(message)
    compound = scores['compound']
    urgent_keywords = ['refund', 'broken', 'scam', 'terrible', 'wrong', 'missing', 'late', 'never arrived']
    has_urgent_keyword = any(w in message.lower() for w in urgent_keywords)

    urgency = "HIGH_PRIORITY" if (compound <= -0.35 or has_urgent_keyword) else "NORMAL"

    return jsonify({
        "urgency": urgency,
        "sentiment_score": compound
    }), 200

if __name__ == '__main__':
    print("🚀 Production WSGI Server (Waitress) running on http://0.0.0.0:5000")
    serve(app, host='0.0.0.0', port=5000, threads=4)
