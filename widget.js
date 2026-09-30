/**
 * GK Nexergy AI Chatbot Widget
 * Website: https://www.gknexergy.com
 * Support: contact@gknexergy.com | WhatsApp: +91 9704585960
 */
(function () {
  'use strict';

  // Configuration & Defaults
  const CONFIG = {
    companyName: 'GK Nexergy',
    tagline: 'Train. Build. Transform.',
    phone: '+919704585960',
    email: 'contact@gknexergy.com',
    apiUrl: window.GKN_CHAT_API_URL || null, // Optional backend API
    apiKey: window.GKN_CHAT_API_KEY || null,
    storageKey: 'gkn_chat_history_v1',
    soundEnabled: true,
  };

  // Sound Synthesizer via Web Audio API (zero external sound file needed)
  function playNotificationChime() {
    if (!CONFIG.soundEnabled) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12); // A5

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.28);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) {
      // Audio autoplay policy might prevent sound before user gesture
    }
  }

  // Pre-compiled Knowledge Base & Intent Matcher
  const KNOWLEDGE = {
    greetings: {
      triggers: ['hi', 'hello', 'hey', 'start', 'good morning', 'good afternoon', 'namaste'],
      response: `👋 **Welcome to GK Nexergy!**\n\nWe empower businesses with cutting-edge technology and transform individuals through industry-grade training.\n\nHow can I help you today?`,
      chips: [
        '🎓 Academy Courses',
        '💼 Software & AI Solutions',
        '📱 Mobile App Dev',
        '💬 Chat on WhatsApp',
        '📋 Request a Quote'
      ]
    },
    academy: {
      triggers: ['course', 'academy', 'training', 'learn', 'student', 'classes', 'syllabus', 'curriculum', 'fees', 'enroll', 'admission', 'study'],
      response: `🎓 **Nexergy Academy Programs**\n\nOur hands-on programs prepare you for real-world tech careers:\n\n1. **🛡️ Cyber Security & Ethical Hacking**: Attack methodology, vulnerability assessment & defensive hardening.\n2. **🤖 AI-Powered Digital Marketing**: Modern campaigns, AI tools, copywriting & growth strategy.\n3. **🗄️ PostgreSQL Database Mastery**: Advanced SQL, query optimization & enterprise data architecture.\n4. **💻 Technology Foundation Program**: Python programming, SQL, Cloud (AWS/Azure) & AI basics.\n\nWhich program would you like to explore?`,
      chips: [
        '🛡️ Cyber Security',
        '🤖 AI Digital Marketing',
        '🗄️ PostgreSQL Mastery',
        '💻 Tech Foundation',
        '💬 Ask on WhatsApp'
      ]
    },
    cybersecurity: {
      triggers: ['cyber', 'security', 'ethical hacking', 'hacker', 'penetration', 'vulnerability', 'infosec'],
      response: `🛡️ **Cyber Security Fundamentals & Ethical Hacking**\n*“Learn to Think Like an Attacker. Defend Like a Professional.”*\n\n• **Core Topics**: Network security, ethical hacking methodology, vulnerability scanning, web app security (OWASP), system hardening.\n• **Ideal For**: Students, graduates, and professionals wanting to break into cybersecurity.\n• **Outcome**: Hands-on lab experience with industry-standard penetration testing tools and defensive methodologies.\n\nWould you like to enroll or speak with a mentor?`,
      chips: ['💬 Speak with Mentor', '🎓 Other Courses', '📋 Request Syllabus']
    },
    aimarketing: {
      triggers: ['marketing', 'digital marketing', 'ai marketing', 'seo', 'content', 'growth'],
      response: `🤖 **AI-Powered Digital Marketing**\n*“Market Smarter With AI at Your Side.”*\n\n• **Core Topics**: Generative AI tools for marketing, automated copywriting, performance marketing, SEO strategy, social media campaigns & analytics.\n• **Ideal For**: Marketers, entrepreneurs, business owners, and graduates.\n• **Outcome**: Build and execute high-ROI digital campaigns with AI-assisted productivity.\n\nReady to transform your marketing skillset?`,
      chips: ['💬 Enroll via WhatsApp', '🎓 Other Courses', '💼 Hire Our Agency']
    },
    postgres: {
      triggers: ['postgres', 'postgresql', 'database', 'sql', 'query', 'data modeling', 'rdbms'],
      response: `🗄️ **PostgreSQL Database Mastery**\n*“Master the Layer Every Application Depends On.”*\n\n• **Core Topics**: Relational schema design, normalization, complex SQL joins, indexing, query execution plans, transactions & replication.\n• **Ideal For**: Software engineers, backend developers, and data practitioners.\n• **Outcome**: Build production-ready, performant, and scalable database architectures.\n\nWant to master PostgreSQL?`,
      chips: ['💬 Talk to Instructor', '💻 Tech Foundation', '🎓 All Courses']
    },
    techfoundation: {
      triggers: ['foundation', 'python', 'beginner', 'basics', 'cloud', 'aws', 'azure', 'programming', 'start tech'],
      response: `💻 **Technology Foundation Program**\n*“Build Your Technology Foundation.”*\n\n• **Core Topics**: Python programming from scratch, SQL & database essentials, Cloud fundamentals (AWS & Azure), and applied AI concepts.\n• **Ideal For**: College students, non-IT graduates, and career switchers wanting a solid entry into technology.\n• **Outcome**: Real project delivery and strong fundamentals for modern software roles.\n\nWould you like to get the full curriculum?`,
      chips: ['💬 Get Curriculum', '🛡️ Cyber Security', '📋 Admissions Info']
    },
    solutions: {
      triggers: ['service', 'solution', 'software', 'develop', 'website', 'web app', 'build', 'enterprise', 'project'],
      response: `💼 **GK Nexergy Enterprise Solutions**\n\nWe engineer custom digital solutions that scale with your business:\n\n• **Custom Software & Web Apps**: Scalable cloud architecture, high-performance web platforms.\n• **Mobile App Development**: Cross-platform & native apps (iOS / Android) with premium UX.\n• **Intelligent Workflows & AI**: Generative AI, predictive models, and automated business pipelines.\n• **Digital Transformation**: Modernizing operations, paperless systems, and cloud migration.\n\nTell us about your project or choose an area below:`,
      chips: [
        '📱 Mobile Apps',
        '🤖 AI & Automation',
        '🌐 Custom Web Apps',
        '📋 Request a Quote',
        '💬 Discuss on WhatsApp'
      ]
    },
    mobile: {
      triggers: ['mobile', 'app', 'android', 'ios', 'cross-platform', 'flutter', 'react native'],
      response: `📱 **Mobile Application Development**\n*“Mobile Experiences Designed for Real Users.”*\n\n• Native & Cross-Platform engineering for iOS and Android\n• Offline-first capabilities, lightning-fast interfaces, and biometric security\n• Enterprise client apps & consumer facing products\n• Full app store deployment and lifecycle maintenance.\n\nHave an app idea you'd like to bring to life?`,
      chips: ['📋 Request App Quote', '💬 WhatsApp Chat', '💼 Other Solutions']
    },
    ai_services: {
      triggers: ['artificial intelligence', 'machine learning', 'llm', 'chatgpt', 'bot', 'workflow automation', 'predictive'],
      response: `🤖 **Intelligent Workflows & Applied AI**\n*“Turn Data and Workflows Into Intelligent Systems.”*\n\n• Custom AI chatbots & automated customer assistants\n• Machine learning pipelines & predictive analytics\n• Document processing & generative workflow automation\n• LLM integration for enterprise knowledge bases.\n\nLet's discuss how AI can boost your business operations!`,
      chips: ['💬 Book AI Consultation', '📋 Get a Quote', '💼 Portfolio Projects']
    },
    projects: {
      triggers: ['project', 'portfolio', 'case study', 'client', 'work', 'example', 'experience'],
      response: `🚀 **Delivered Projects & Case Studies**\n\n• **🏥 AI Hospital Management System**: Intelligent patient triage, clinical scheduling & EHR HIPAA compliance.\n• **🏢 AI Real Estate Business Platform**: Property discovery AI, broker pipelines & automated valuation.\n• **🍽️ AI Restaurant Management**: Smart POS, predictive kitchen workflows & loyalty intelligence.\n• **🌿 Ayurvedic Product Showcase**: Wholesale distributor enquiry system & compliant e-commerce portal.\n\nWould you like a demo or technical walkthrough?`,
      chips: ['💬 Request Demo', '💼 Custom Software', '📋 Contact Us']
    },
    contact: {
      triggers: ['contact', 'reach', 'address', 'location', 'phone', 'call', 'email', 'office', 'where are you'],
      response: `📍 **Get in Touch with GK Nexergy**\n\n• **Email**: [contact@gknexergy.com](mailto:contact@gknexergy.com)\n• **Phone / WhatsApp**: [+91 9704585960](https://wa.me/919704585960)\n• **Headquarters**: Proddatur, Cuddapah, Andhra Pradesh, India\n• **Remote Support**: Worldwide delivery across timezones\n\nYou can also click below to chat directly with our team on WhatsApp!`,
      chips: ['💬 Open WhatsApp Now', '📋 Request a Callback', '🎓 Academy Inquiries']
    },
    whatsapp: {
      triggers: ['whatsapp', 'chat with human', 'support person', 'talk to person', 'agent', 'human', 'call me'],
      response: `💬 **Direct WhatsApp Connection**\n\nClick below to immediately initiate a chat with our engineering and admissions team on WhatsApp:`,
      chips: ['💬 Launch WhatsApp Chat', '📋 Leave a Message', '🎓 Courses']
    },
    quote: {
      triggers: ['quote', 'price', 'pricing', 'cost', 'hire', 'proposal', 'estimate', 'budget'],
      response: `📋 **Request a Project Estimate or Consultation**\n\nWe provide tailored quotes based on your specific requirements, timeline, and tech stack.\n\nPlease fill out the quick form below or send us a WhatsApp message:`,
      chips: ['💬 Instant Quote on WhatsApp', '📝 Fill Inquiry Form', '💼 Our Services']
    },
    certificate: {
      triggers: ['certificate', 'verify', 'verification', 'credential', 'cert', 'id'],
      response: `🔍 **Official Certificate Verification Authority**\n\nAll official certificates issued by **Nexergy Academy** can be verified directly on our portal.\n\nPlease have your **Certificate ID** ready (found at the bottom of your certificate) and visit the verification section on [gknexergy.com](https://www.gknexergy.com).`,
      chips: ['💬 Contact Support', '🎓 Academy Courses', '🏠 Home']
    },
    careers: {
      triggers: ['job', 'career', 'hiring', 'vacancy', 'apply', 'trainer', 'mentor', 'internship', 'work with you'],
      response: `💼 **Join the GK Nexergy Team!**\n\nWe are actively looking for talented individuals across multiple domains:\n• **Technical Mentors & Trainers** (Cybersecurity, AI, Databases, Python)\n• **Software Engineers & Full-Stack Developers**\n• **Digital Marketing Specialists**\n\nSend your resume and portfolio to [contact@gknexergy.com](mailto:contact@gknexergy.com) with your area of interest!`,
      chips: ['💬 Contact via WhatsApp', '📧 Email Resume', '🎓 Academy']
    }
  };

  // Helper: Match User Query to Knowledge Base
  function findBestMatch(text) {
    const q = text.toLowerCase().trim();

    // Check specific direct intents
    for (const key of Object.keys(KNOWLEDGE)) {
      const item = KNOWLEDGE[key];
      if (item.triggers.some(t => q.includes(t))) {
        return item;
      }
    }

    // Default Fallback
    return {
      response: `Thank you for your message! I'm here to assist with **Nexergy Academy Courses** (Cybersecurity, AI Marketing, PostgreSQL, Tech Foundations) and **Enterprise Solutions** (Custom Software, Mobile Apps, Applied AI, Digital Transformation).\n\nYou can also speak directly with our team on WhatsApp:`,
      chips: [
        '🎓 Academy Programs',
        '💼 Software & AI Services',
        '💬 Chat on WhatsApp',
        '📍 Contact Info'
      ]
    };
  }

  // Helper: Format Markdown to HTML
  function formatMarkdown(text) {
    if (!text) return '';
    let html = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Bold
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Italics
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    // Links [text](url)
    html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
    // Bullet points
    const lines = html.split('\n');
    let inList = false;
    let result = [];

    for (let line of lines) {
      if (line.trim().startsWith('• ') || line.trim().startsWith('- ')) {
        if (!inList) {
          result.push('<ul>');
          inList = true;
        }
        result.push(`<li>${line.trim().substring(2)}</li>`);
      } else {
        if (inList) {
          result.push('</ul>');
          inList = false;
        }
        if (line.trim()) {
          result.push(`<p>${line}</p>`);
        }
      }
    }
    if (inList) result.push('</ul>');
    return result.join('');
  }

  // Class: GK Nexergy Chatbot Widget
  class GKNexergyChatbot {
    constructor() {
      this.isOpen = false;
      this.messages = [];
      this.unreadCount = 0;
      this.isTyping = false;
      this.init();
    }

    init() {
      this.loadHistory();
      this.render();
      this.bindEvents();

      // Show welcome if empty
      if (this.messages.length === 0) {
        this.addBotMessage(
          `👋 **Welcome to GK Nexergy!**\n\n*Train. Build. Transform.*\n\nI'm your AI guide for enterprise technology solutions, custom software, and Nexergy Academy training programs.\n\nHow can I help you today?`,
          [
            '🎓 Academy Courses',
            '💼 Software & AI Solutions',
            '📱 Mobile App Dev',
            '💬 Chat on WhatsApp',
            '📋 Request a Quote'
          ]
        );
        this.unreadCount = 1;
        this.updateBadge();
      }
    }

    loadHistory() {
      try {
        const stored = sessionStorage.getItem(CONFIG.storageKey);
        if (stored) {
          this.messages = JSON.parse(stored);
        }
      } catch (e) {
        this.messages = [];
      }
    }

    saveHistory() {
      try {
        sessionStorage.setItem(CONFIG.storageKey, JSON.stringify(this.messages.slice(-30)));
      } catch (e) {}
    }

    render() {
      const container = document.createElement('div');
      container.id = 'gkn-chat-container';
      container.innerHTML = `
        <!-- Floating Launcher -->
        <button class="gkn-launcher" id="gkn-launcher" aria-label="Open GK Nexergy Chat">
          <div class="gkn-pulse"></div>
          <svg class="gkn-launcher-icon gkn-icon-chat" viewBox="0 0 24 24">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
          </svg>
          <svg class="gkn-launcher-icon gkn-icon-close" viewBox="0 0 24 24">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>
          </svg>
          <div class="gkn-badge" id="gkn-badge" style="display: none;">1</div>
          <div class="gkn-tooltip" id="gkn-tooltip">Chat with GK Nexergy AI ⚡</div>
        </button>

        <!-- Chat Window -->
        <div class="gkn-window" id="gkn-window">
          <!-- Header -->
          <div class="gkn-header">
            <div class="gkn-brand">
              <div class="gkn-avatar">
                <span>⚡</span>
                <div class="gkn-online-dot" title="Active"></div>
              </div>
              <div class="gkn-brand-info">
                <h3>GK Nexergy AI</h3>
                <p>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="#10b981"><circle cx="12" cy="12" r="10"/></svg>
                  Train • Build • Transform
                </p>
              </div>
            </div>
            <div class="gkn-header-actions">
              <button class="gkn-header-btn" id="gkn-reset-btn" title="Restart conversation">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M3 12a9 9 0 0 1 15-6.7L21 8M21 3v5h-5M21 12a9 9 0 0 1-15 6.7L3 16M3 21v-5h5"/></svg>
              </button>
              <button class="gkn-header-btn" id="gkn-sound-btn" title="Toggle audio chime">
                <svg id="gkn-sound-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
              </button>
              <button class="gkn-header-btn" id="gkn-close-btn" title="Close window">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
          </div>

          <!-- Messages Scroll Area -->
          <div class="gkn-messages" id="gkn-messages"></div>

          <!-- Typing indicator (hidden by default) -->
          <div id="gkn-typing-container" style="padding: 0 16px 8px; display: none;">
            <div class="gkn-typing">
              <span class="gkn-dot"></span>
              <span class="gkn-dot"></span>
              <span class="gkn-dot"></span>
            </div>
          </div>

          <!-- Footer Input -->
          <form class="gkn-footer" id="gkn-chat-form">
            <div class="gkn-input-box">
              <input type="text" id="gkn-input" class="gkn-input" placeholder="Ask about courses, software, AI, or WhatsApp..." autocomplete="off" />
              <button type="submit" class="gkn-send-btn" id="gkn-send-btn" aria-label="Send">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                </svg>
              </button>
            </div>
          </form>
          <div class="gkn-footer-sub">
            Powered by <span>GK Nexergy</span> • Proddatur, AP, India
          </div>
        </div>
      `;

      document.body.appendChild(container);
      this.renderMessages();
    }

    bindEvents() {
      const launcher = document.getElementById('gkn-launcher');
      const closeBtn = document.getElementById('gkn-close-btn');
      const resetBtn = document.getElementById('gkn-reset-btn');
      const soundBtn = document.getElementById('gkn-sound-btn');
      const form = document.getElementById('gkn-chat-form');
      const input = document.getElementById('gkn-input');
      const tooltip = document.getElementById('gkn-tooltip');

      launcher.addEventListener('click', () => this.toggleWindow());
      closeBtn.addEventListener('click', () => this.closeWindow());

      resetBtn.addEventListener('click', () => {
        if (confirm('Restart conversation?')) {
          this.messages = [];
          this.saveHistory();
          this.init();
        }
      });

      soundBtn.addEventListener('click', () => {
        CONFIG.soundEnabled = !CONFIG.soundEnabled;
        const icon = document.getElementById('gkn-sound-icon');
        icon.style.opacity = CONFIG.soundEnabled ? '1' : '0.4';
      });

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = input.value.trim();
        if (!text) return;
        input.value = '';
        this.handleUserMessage(text);
      });

      // Show tooltip after 3 seconds on first visit
      setTimeout(() => {
        if (!this.isOpen && tooltip) {
          tooltip.classList.add('show');
          setTimeout(() => tooltip.classList.remove('show'), 6000);
        }
      }, 3000);
    }

    toggleWindow() {
      if (this.isOpen) {
        this.closeWindow();
      } else {
        this.openWindow();
      }
    }

    openWindow() {
      this.isOpen = true;
      document.getElementById('gkn-window').classList.add('open');
      document.getElementById('gkn-launcher').classList.add('active');
      this.unreadCount = 0;
      this.updateBadge();
      this.scrollToBottom();
      setTimeout(() => {
        document.getElementById('gkn-input').focus();
      }, 300);
    }

    closeWindow() {
      this.isOpen = false;
      document.getElementById('gkn-window').classList.remove('open');
      document.getElementById('gkn-launcher').classList.remove('active');
    }

    updateBadge() {
      const badge = document.getElementById('gkn-badge');
      if (this.unreadCount > 0 && !this.isOpen) {
        badge.textContent = this.unreadCount;
        badge.style.display = 'flex';
      } else {
        badge.style.display = 'none';
      }
    }

    addUserMessage(text) {
      const msg = {
        sender: 'user',
        text: text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      this.messages.push(msg);
      this.saveHistory();
      this.renderMessages();
      this.scrollToBottom();
    }

    addBotMessage(text, chips = [], specialCard = null) {
      const msg = {
        sender: 'bot',
        text: text,
        chips: chips,
        specialCard: specialCard,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      this.messages.push(msg);
      this.saveHistory();
      this.renderMessages();
      this.scrollToBottom();

      if (!this.isOpen) {
        this.unreadCount++;
        this.updateBadge();
      }
      playNotificationChime();
    }

    showTyping() {
      this.isTyping = true;
      const el = document.getElementById('gkn-typing-container');
      if (el) el.style.display = 'block';
      this.scrollToBottom();
    }

    hideTyping() {
      this.isTyping = false;
      const el = document.getElementById('gkn-typing-container');
      if (el) el.style.display = 'none';
    }

    async handleUserMessage(text) {
      this.addUserMessage(text);
      this.showTyping();

      // Check special actions
      const lower = text.toLowerCase();

      // If user asks for direct WhatsApp
      if (lower.includes('whatsapp') || lower.includes('chat on whatsapp')) {
        setTimeout(() => {
          this.hideTyping();
          this.addBotMessage(
            `💬 **Connect Directly on WhatsApp**\n\nOur team is online to assist you with course inquiries, admissions, and enterprise software consultations.`,
            ['🎓 Explore Academy', '💼 Software Solutions'],
            {
              type: 'whatsapp_card',
              url: `https://wa.me/${CONFIG.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hello GK Nexergy team, I visited your website and would like to know more.')}`,
              label: 'Open WhatsApp Chat (+91 9704585960)'
            }
          );
        }, 500);
        return;
      }

      // If user asks for quote or inquiry form
      if (lower.includes('quote') || lower.includes('inquiry form') || lower.includes('leave a message')) {
        setTimeout(() => {
          this.hideTyping();
          this.addBotMessage(
            `📝 **Project or Course Inquiry Form**\n\nPlease submit your details below and our team will get back to you promptly:`,
            [],
            { type: 'lead_form' }
          );
        }, 500);
        return;
      }

      // Try backend API if configured
      if (CONFIG.apiUrl) {
        try {
          const res = await fetch(CONFIG.apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text, history: this.messages.slice(-8) })
          });
          if (res.ok) {
            const data = await res.json();
            this.hideTyping();
            this.addBotMessage(data.reply || data.response, data.chips || []);
            return;
          }
        } catch (e) {
          console.warn('Backend chat API failed, using client knowledge base:', e);
        }
      }

      // Intelligent Client Knowledge Base matching
      setTimeout(() => {
        this.hideTyping();
        const match = findBestMatch(text);
        this.addBotMessage(match.response, match.chips);
      }, 600);
    }

    renderMessages() {
      const container = document.getElementById('gkn-messages');
      if (!container) return;

      container.innerHTML = '';
      this.messages.forEach((msg, idx) => {
        const msgDiv = document.createElement('div');
        msgDiv.className = `gkn-msg gkn-msg-${msg.sender}`;

        let contentHtml = `<div class="gkn-bubble">${formatMarkdown(msg.text)}</div>`;

        // Special Cards (WhatsApp, Lead Form)
        if (msg.specialCard) {
          if (msg.specialCard.type === 'whatsapp_card') {
            contentHtml += `
              <div class="gkn-card-cta">
                <div class="gkn-card-title">⚡ Instant WhatsApp Support</div>
                <a href="${msg.specialCard.url}" target="_blank" rel="noopener noreferrer" class="gkn-btn-wa">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.16 12.04 20.16C10.66 20.16 9.3 19.8 8.1 19.11L7.81 18.94L4.7 19.76L5.53 16.73L5.34 16.43C4.56 15.19 4.14 13.58 4.14 11.91C4.14 7.37 7.84 3.67 12.05 3.67Z"/></svg>
                  ${msg.specialCard.label}
                </a>
              </div>
            `;
          } else if (msg.specialCard.type === 'lead_form') {
            contentHtml += `
              <form class="gkn-lead-form" onsubmit="window.gknSubmitLead(event, ${idx})">
                <input type="text" class="gkn-lead-input" placeholder="Your Name" required name="lead_name" />
                <input type="text" class="gkn-lead-input" placeholder="Phone or WhatsApp Number" required name="lead_phone" />
                <input type="email" class="gkn-lead-input" placeholder="Email Address (optional)" name="lead_email" />
                <textarea class="gkn-lead-input" placeholder="Tell us your requirement or course interest..." rows="2" required name="lead_msg"></textarea>
                <button type="submit" class="gkn-lead-submit">Send to WhatsApp & Email 🚀</button>
              </form>
            `;
          }
        }

        // Suggestions chips
        if (msg.chips && msg.chips.length > 0 && idx === this.messages.length - 1) {
          contentHtml += `<div class="gkn-suggestions-wrapper">`;
          msg.chips.forEach(chip => {
            contentHtml += `<button class="gkn-chip" onclick="window.gknSendChip('${chip.replace(/'/g, "\\'")}')">${chip}</button>`;
          });
          contentHtml += `</div>`;
        }

        contentHtml += `<div class="gkn-msg-time">${msg.time}</div>`;
        msgDiv.innerHTML = contentHtml;
        container.appendChild(msgDiv);
      });
    }

    scrollToBottom() {
      const container = document.getElementById('gkn-messages');
      if (container) {
        setTimeout(() => {
          container.scrollTop = container.scrollHeight;
        }, 50);
      }
    }
  }

  // Global Helpers for inline handlers
  window.gknSendChip = function (chipText) {
    if (window.gknInstance) {
      window.gknInstance.handleUserMessage(chipText);
    }
  };

  window.gknSubmitLead = function (e, msgIndex) {
    e.preventDefault();
    const form = e.target;
    const name = form.lead_name.value.trim();
    const phone = form.lead_phone.value.trim();
    const email = form.lead_email.value.trim();
    const msg = form.lead_msg.value.trim();

    const formattedLead = `*New Website Inquiry*\n• *Name*: ${name}\n• *Phone*: ${phone}\n• *Email*: ${email || 'N/A'}\n• *Requirement*: ${msg}`;
    const waUrl = `https://wa.me/${CONFIG.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(formattedLead)}`;

    window.open(waUrl, '_blank');

    if (window.gknInstance) {
      window.gknInstance.addBotMessage(
        `✅ **Thank you, ${name}!**\n\nYour inquiry has been submitted. We've also opened WhatsApp so you can continue the chat directly with our team.`
      );
    }
  };

  // Auto initialize on DOMContentLoaded or immediately if ready
  function initWidget() {
    if (!document.getElementById('gkn-chat-container')) {
      window.gknInstance = new GKNexergyChatbot();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWidget);
  } else {
    initWidget();
  }

})();
