# GK Nexergy AI Chatbot Widget ⚡

> **Tailored AI Assistant & Lead-Gen Chatbot for [gknexergy.com](https://www.gknexergy.com)**  
> Tagline: *Train. Build. Transform.*

This production-ready chatbot widget is designed specifically for **GK Nexergy** (GKNEXERGY PRIVATE LIMITED). It delivers 24/7 intelligent customer support, course guidance for Nexergy Academy, consultation requests for enterprise software projects, and direct WhatsApp lead dispatching.

---

## 🌟 Key Features

1. **Nexergy Academy Course Guidance**:
   - Detailed answers on **Cyber Security & Ethical Hacking**, **AI-Powered Digital Marketing**, **PostgreSQL Database Mastery**, and **Technology Foundation (Python/Cloud/AI)**.
   - Information on target audiences, outcomes, syllabus, and enrollment.

2. **Enterprise Solutions & Technology Services**:
   - Immediate assistance for **Custom Software Development**, **Mobile Apps (iOS & Android)**, **Digital Transformation**, and **Intelligent AI Workflows**.
   - Answers related to portfolio case studies (AI Hospital Management, Real Estate AI, Restaurant AI, Ayurvedic eCommerce).

3. **Instant WhatsApp Integration**:
   - One-click launch to WhatsApp chat at **`+91 9704585960`** (`https://wa.me/919704585960`) with pre-filled inquiry messages.

4. **Interactive Lead Capture Form**:
   - Inline lead collection form (Name, Phone/WhatsApp, Email, Project description) with automatic formatting and WhatsApp dispatch.

5. **Official Certificate Verification**:
   - Direct guidance for students and employers verifying official Nexergy Academy certificates with their Certificate ID.

6. **Careers & Mentorship**:
   - Answers about hiring for Technical Mentors, Software Developers, and Digital Marketing specialists.

7. **Zero Dependencies & Lightweight**:
   - Built with pure Vanilla JavaScript and CSS. No React, jQuery, or bloated external libraries required.
   - Responsive across mobile, tablet, and desktop screens with dark-mode aesthetic matching `#0B1120`.
   - Audio feedback synthesised natively with Web Audio API (no audio file requests).

---

## 🚀 Quick Start (Running the Demo)

You can launch the test showcase immediately:

```bash
# In this directory:
python -m http.server 8080
```

Then open your browser at:
👉 **`http://localhost:8080`**

Click the glowing chat icon in the bottom-right corner or any of the sample questions on screen.

---

## 💻 How to Embed on https://www.gknexergy.com

### Option 1: Direct HTML Embed (Fastest)

Add these two lines to your `index.html` file (e.g. before `</body>`):

```html
<!-- GK Nexergy AI Chatbot Stylesheet -->
<link rel="stylesheet" href="/chatbot/widget.css" />

<!-- GK Nexergy AI Chatbot Widget -->
<script src="/chatbot/widget.js"></script>
```

### Option 2: Integration into React / Vite App

If `gknexergy.com` is a Vite/React application, copy `widget.js` and `widget.css` into your `public/` directory (e.g., `public/chatbot/widget.js` and `public/chatbot/widget.css`), and reference them in `index.html` or load dynamically in `App.jsx`:

```jsx
import { useEffect } from 'react';

export default function App() {
  useEffect(() => {
    // Load CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/chatbot/widget.css';
    document.head.appendChild(link);

    // Load Script
    const script = document.createElement('script');
    script.src = '/chatbot/widget.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup if needed
    };
  }, []);

  return (
    <div>
      {/* Your website components */}
    </div>
  );
}
```

---

## ⚙️ Configuration & Customization

Inside `widget.js`, you can adjust the settings in the `CONFIG` object:

```javascript
const CONFIG = {
  companyName: 'GK Nexergy',
  tagline: 'Train. Build. Transform.',
  phone: '+919704585960',              // Your WhatsApp number
  email: 'contact@gknexergy.com',     // Contact email
  apiUrl: null,                       // Optional backend AI endpoint
  soundEnabled: true,                 // Toggle audio notification chimes
};
```

---

## 📂 File Structure

```
gknexergy-chatbot/
├── widget.js             # Standalone vanilla JS chatbot widget & NLP engine
├── widget.css            # Dark futuristic styling matching gknexergy.com
├── index.html            # Interactive showcase & demo website
├── knowledge_base.json   # Structured knowledge base about GK Nexergy
├── server.py             # Optional Python backend API (with AI completion support)
└── README.md             # Documentation and integration guide
```
