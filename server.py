#!/usr/bin/env python3
"""
GK Nexergy AI Chatbot - Local Backend Server
Serves static widget files and provides `/api/chat` and `/api/lead` endpoints.
Works with zero dependencies (uses Python standard library).
"""

import os
import json
import urllib.parse
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

PORT = int(os.environ.get("PORT", 8080))
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Load Knowledge Base
KB_PATH = os.path.join(BASE_DIR, "knowledge_base.json")
try:
    with open(KB_PATH, "r", encoding="utf-8") as f:
        KNOWLEDGE_BASE = json.load(f)
except Exception as e:
    KNOWLEDGE_BASE = {}

LEADS_FILE = os.path.join(BASE_DIR, "leads.jsonl")


class GKNexergyChatHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=BASE_DIR, **kwargs)

    def _send_cors_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")

    def do_OPTIONS(self):
        self.send_response(200)
        self._send_cors_headers()
        self.end_headers()

    def do_POST(self):
        if self.path == "/api/chat":
            content_length = int(self.headers.get("Content-Length", 0))
            body = self.rfile.read(content_length).decode("utf-8")
            try:
                data = json.loads(body)
            except Exception:
                data = {}

            user_msg = data.get("message", "").strip().lower()

            # Rule & Knowledge-based Response Engine
            reply, chips = self.generate_response(user_msg)

            response_data = {
                "reply": reply,
                "chips": chips,
                "status": "success"
            }

            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self._send_cors_headers()
            self.end_headers()
            self.wfile.write(json.dumps(response_data).encode("utf-8"))

        elif self.path == "/api/lead":
            content_length = int(self.headers.get("Content-Length", 0))
            body = self.rfile.read(content_length).decode("utf-8")
            try:
                lead = json.loads(body)
                with open(LEADS_FILE, "a", encoding="utf-8") as f:
                    f.write(json.dumps(lead) + "\n")
                res = {"status": "saved", "message": "Lead received successfully"}
            except Exception as e:
                res = {"status": "error", "message": str(e)}

            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self._send_cors_headers()
            self.end_headers()
            self.wfile.write(json.dumps(res).encode("utf-8"))
        else:
            self.send_response(404)
            self.end_headers()

    def generate_response(self, text):
        # AI/NLP Intent Classification
        if any(w in text for w in ["course", "academy", "training", "learn", "study", "fee", "enroll"]):
            return (
                "🎓 **Nexergy Academy Programs**\n\n"
                "• **Cyber Security & Ethical Hacking**: Defensive hardening, vulnerability assessment, penetration testing.\n"
                "• **AI-Powered Digital Marketing**: AI content generation, modern campaign optimization, growth strategies.\n"
                "• **PostgreSQL Database Mastery**: Relational modeling, complex queries, index tuning, real-world deployment.\n"
                "• **Technology Foundation**: Python programming, SQL, Cloud deployment (AWS/Azure), and AI basics.\n\n"
                "Which course matches your goals?",
                ["🛡️ Cyber Security", "🤖 AI Marketing", "🗄️ PostgreSQL", "💬 Ask on WhatsApp"]
            )
        elif any(w in text for w in ["software", "service", "app", "mobile", "web", "develop", "build", "project"]):
            return (
                "💼 **GK Nexergy Enterprise Solutions**\n\n"
                "We design and build bespoke software tailored to your organization:\n"
                "• **Custom Software & Web Applications**\n"
                "• **Cross-Platform Mobile Apps (iOS & Android)**\n"
                "• **Intelligent AI Workflows & Machine Learning**\n"
                "• **Digital Transformation & Cloud Architecture**\n\n"
                "Would you like an estimate or to review our past projects?",
                ["📋 Request a Quote", "📱 Mobile Apps", "🚀 View Projects", "💬 WhatsApp Chat"]
            )
        elif any(w in text for w in ["whatsapp", "human", "agent", "call", "talk", "contact", "support"]):
            return (
                "💬 **Speak with our Team Directly**\n\n"
                "You can connect directly on WhatsApp at **+91 9704585960** or email us at **contact@gknexergy.com**.\n\n"
                "Click below to launch an immediate chat:",
                ["💬 Chat on WhatsApp", "📋 Leave a Message", "🏠 Home"]
            )
        elif any(w in text for w in ["certificate", "verify", "verification"]):
            return (
                "🔍 **Official Certificate Verification**\n\n"
                "All Nexergy Academy credentials can be authenticated via your **Certificate ID**.\n"
                "Visit the verification section on [gknexergy.com](https://www.gknexergy.com) with your ID ready.",
                ["💬 Contact Support", "🎓 Academy Courses"]
            )
        else:
            return (
                "Hello! Welcome to **GK Nexergy** (*Train. Build. Transform.*).\n\n"
                "I'm here to assist with **Nexergy Academy Training Courses**, **Custom Software & AI Solutions**, or connecting you with our team on WhatsApp.",
                ["🎓 Academy Courses", "💼 Software Solutions", "💬 WhatsApp Chat", "📍 Contact Us"]
            )


def run_server():
    server = ThreadingHTTPServer(("0.0.0.0", PORT), GKNexergyChatHandler)
    print(f"==================================================")
    print(f"🚀 GK Nexergy AI Chatbot Server running on http://localhost:{PORT}")
    print(f"📁 Serving static files from: {BASE_DIR}")
    print(f"💬 Chat API Endpoint: http://localhost:{PORT}/api/chat")
    print(f"==================================================")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping server...")
        server.server_close()


if __name__ == "__main__":
    run_server()
