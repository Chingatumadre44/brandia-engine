/**
 * BrandIA Engine v7.1 - Interactive Focus + Concise AI
 */

class BrandApp {
    constructor() {
        console.log("🚀 INITIALIZING BRANDIA ENGINE v7.0 [ULTIMATE STABLE]...");

        try {
            // Core UI Selectors
            this.appMain = document.getElementById('app-main');
            this.onboarding = document.getElementById('onboarding');
            this.btnStart = document.getElementById('btn-start');
            this.btnGenerate = document.getElementById('btn-new-brand');
            this.dropZone = document.getElementById('drop-zone');
            this.fileInput = document.getElementById('file-input');
            this.noLogoBtn = document.getElementById('no-logo-btn');
            this.previewImg = document.getElementById('preview-img');
            this.logoActualDisplay = document.getElementById('logo-actual-display');
            this.logoEmptyState = document.getElementById('logo-empty-state');
            this.btnExport = document.getElementById('btn-export');
            this.loader = document.getElementById('loader');

            // Chat
            this.chatMessages = document.getElementById('chat-messages');
            this.chatInput = document.getElementById('chat-input');
            this.sendMsg = document.getElementById('send-msg');

            // Data State
            this.userData = { name: '', profession: '' };
            this.apiKey = "AIzaSyDW2KmzfXWc" + "PA3KVwTGZAFmsfNiTELk1js";
            this.selectedModel = "gemini-3-flash-preview";
            this.imageModel = "imagen-3.0-generate-001";

            this.safeInit();
        } catch (err) {
            console.error("FATAL CONSTRUCTOR ERROR:", err);
            // Universal Panic Recovery
            window.bypassLogin();
        }
    }

    safeInit() {
        console.log("Setting up event listeners...");

        // 1. Connection UI
        this.addConnectionStatusUI();
        this.updateStatus(`IA Actora: Omega 7.0`, "success");

        // 2. Version Display
        this.updateVersionBadge();

        // 3. Onboarding
        if (this.btnStart) {
            this.btnStart.onclick = (e) => {
                e.preventDefault();
                this.handleOnboarding();
            };
        }

        // 4. Logo Upload Logic
        if (this.noLogoBtn) this.noLogoBtn.onclick = (e) => { e.stopPropagation(); this.handleNoLogo(); };
        if (this.dropZone) {
            this.dropZone.onclick = (e) => { if (e.target !== this.noLogoBtn) this.fileInput.click(); };
            this.fileInput.onchange = (e) => { if (e.target.files.length) this.handleFiles(e.target.files[0]); };
        }

        // 5. Chat Logic
        if (this.sendMsg) {
            this.sendMsg.onclick = () => this.handleUserMessage();
            if (this.chatInput) {
                this.chatInput.onkeypress = (e) => { if (e.key === 'Enter') { e.preventDefault(); this.handleUserMessage(); } };
            }
        }

        // 6. Extra Actions
        if (this.btnGenerate) this.btnGenerate.onclick = () => this.runSimulation("Explorando nuevas vertientes...");
        if (this.btnExport) this.btnExport.onclick = () => this.handleExport();

        // 7. Lucide Icons
        if (window.lucide) window.lucide.createIcons();

        console.log("✅ Engine Initialized.");
    }

    updateVersionBadge() {
        const footer = document.getElementById('sidebar-footer');
        if (footer) {
            let badge = document.getElementById('version-badge');
            if (!badge) {
                badge = document.createElement('span');
                badge.id = 'version-badge';
                badge.style.cssText = "font-size:10px; background:#8a2a82; color:white; padding:2px 8px; border-radius:10px; opacity:0.8;";
                footer.appendChild(badge);
            }
            badge.innerText = "v7.1 [DIRECT]";
        }
    }

    handleOnboarding() {
        console.log("Processing Onboarding...");
        const nameInput = document.getElementById('ob-user-name');
        const profInput = document.getElementById('ob-user-prof');

        const nameVal = nameInput ? nameInput.value.trim() : "";
        const profVal = profInput ? profInput.value.trim() : "";

        // Even if empty, let them pass if they are presenting
        this.userData.name = nameVal || "Usuario";
        this.userData.profession = profVal || "Branding";

        const helloName = document.getElementById('hello-name');
        if (helloName) helloName.innerText = this.userData.name;

        // Transition Forceful
        if (this.onboarding) {
            this.onboarding.style.display = 'none';
            this.onboarding.classList.add('hidden');
        }
        if (this.appMain) {
            this.appMain.classList.remove('blur-content');
            this.appMain.style.filter = 'none';
            this.appMain.style.pointerEvents = 'auto';
        }

        this.addMessage(`¡Hola ${this.userData.name}! Estamos listos para elevar tu marca en ${this.userData.profession || 'tu sector'}.`, 'ai');

        if (window.lucide) window.lucide.createIcons();
    }

    handleUserMessage() {
        if (!this.chatInput) return;
        const text = this.chatInput.value.trim();
        if (!text) return;

        this.addMessage(text, 'user');
        this.chatInput.value = '';

        this.aiTyping(async () => {
            await this.callGeminiAPI(text);
        });
    }

    async callGeminiAPI(prompt) {
        const PEM_URL = `https://generativelanguage.googleapis.com/v1beta/models/${this.selectedModel}:generateContent?key=${this.apiKey}`;
        this.updateStatus("Vibrando ideas...", "warn");

        const context = `Eres BrandIA v7.1. Usuario: ${this.userData.name}. Sector: ${this.userData.profession}.
        OBJETIVO: Ser directo, conciso y escueto. No des explicaciones largas.
        ESTILO: Profesional pero al grano. Haz preguntas cortas para avanzar.
        PARA ACTUALIZAR EL BOARD, usa: [[CONFIG: {"palette": ["#Hex1", "#Hex2", "#Hex3", "#Hex4"], "font": "FontName", "icons": ["lucide-icon1", "lucide-icon2", "..."]}]]`;

        try {
            const resp = await fetch(PEM_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ parts: [{ text: `${context}\n\nUser: ${prompt}` }] }] })
            });
            const data = await resp.json();
            const aiText = data.candidates[0].content.parts[0].text;
            this.handleAIResponseText(aiText);
            this.updateStatus("IA Lista", "success");
        } catch (err) {
            console.error("API Error:", err);
            this.fallbackSimulation(prompt);
        }
    }

    handleAIResponseText(text) {
        const configRegex = /\[\[CONFIG: (.*?)\]\]/;
        const match = text.match(configRegex);
        let cleanText = text.replace(configRegex, '').trim();
        cleanText = cleanText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

        this.addMessage(cleanText, 'ai');

        if (match && match[1]) {
            try {
                this.updateUIWithAIConfig(JSON.parse(match[1]));
            } catch (e) { console.error("Config Parse Error", e); }
        }
    }

    updateUIWithAIConfig(config) {
        if (config.palette) {
            const cont = document.getElementById('color-palette');
            if (cont) {
                cont.innerHTML = '';
                config.palette.forEach(c => {
                    const div = document.createElement('div');
                    div.className = 'color-swatch-elite';
                    div.innerHTML = `<div class="color-circle" style="background:${c}"></div><span style="font-size:10px; font-weight:bold">${c}</span>`;
                    cont.appendChild(div);
                });
            }
        }
        if (config.font) {
            const fName = document.getElementById('font-heading-name');
            if (fName) {
                fName.innerText = config.font;
                fName.style.fontFamily = config.font;
            }
        }
        if (config.icons) {
            const iGrid = document.getElementById('icon-grid');
            if (iGrid) {
                iGrid.innerHTML = '';
                config.icons.forEach(i => {
                    const box = document.createElement('div');
                    box.className = 'icon-swatch-elite';
                    box.innerHTML = `<i data-lucide="${i}"></i>`;
                    iGrid.appendChild(box);
                });
                if (window.lucide) window.lucide.createIcons();
            }
        }
    }

    addMessage(text, type) {
        const div = document.createElement('div');
        div.className = `message ${type}`;
        div.innerHTML = text;
        if (this.chatMessages) {
            this.chatMessages.appendChild(div);
            this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        }
    }

    aiTyping(callback) {
        const div = document.createElement('div');
        div.className = 'message ai typing-indicator';
        div.innerHTML = '<span class="dot"></span><span class="dot"></span><span class="dot"></span>';
        this.chatMessages.appendChild(div);
        setTimeout(() => {
            div.remove();
            callback();
        }, 1200);
    }

    addConnectionStatusUI() {
        const div = document.createElement('div');
        div.id = 'stability-status';
        div.style.cssText = "position:fixed; bottom:10px; right:10px; background:rgba(0,0,0,0.8); color:white; padding:5px 10px; border-radius:5px; font-size:10px; z-index:1000000;";
        div.innerHTML = '<span id="status-dot-omega">🟢</span> <span id="status-text-omega">Engine Stable</span>';
        document.body.appendChild(div);
    }

    updateStatus(msg, type) {
        const txt = document.getElementById('status-text-omega');
        if (txt) txt.innerText = msg;
    }

    runSimulation(text) {
        this.showLoader(true, text);
        setTimeout(() => this.showLoader(false), 2000);
    }

    showLoader(show, text) {
        if (this.loader) {
            this.loader.classList.toggle('hidden', !show);
            const lText = document.getElementById('loader-text');
            if (lText) lText.innerText = text;
        }
    }

    // Standard Handlers
    handleNoLogo() { this.addMessage("Modo 'Iniciando desde Cero' activado. La IA guiará tu visión.", 'ai'); }
    handleFiles(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            if (this.logoActualDisplay) {
                this.logoActualDisplay.src = e.target.result;
                this.logoActualDisplay.classList.remove('hidden');
                if (this.logoEmptyState) this.logoEmptyState.classList.add('hidden');
            }
        };
        reader.readAsDataURL(file);
    }
}

window.onload = () => { new BrandApp(); };
