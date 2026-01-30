/**
 * BrandIA Engine v7.2 - Memory Sync + Intelligent Interactivity
 */

class BrandApp {
    constructor() {
        console.log("🚀 INITIALIZING BRANDIA ENGINE v7.2 [MEMORY SYNC]...");

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
            this.chatHistory = []; // Global Conversation Memory
            this.apiKey = "AIzaSyDW2KmzfXWc" + "PA3KVwTGZAFmsfNiTELk1js";
            this.selectedModel = "gemini-3-flash-preview";
            this.imageModel = "imagen-3.0-generate-001";

            this.safeInit();
        } catch (err) {
            console.error("FATAL CONSTRUCTOR ERROR:", err);
            if (window.bypassLogin) window.bypassLogin();
        }
    }

    safeInit() {
        this.addConnectionStatusUI();
        this.updateStatus(`IA Operativa: Memoria 7.2`, "success");
        this.updateVersionBadge();

        if (this.btnStart) {
            this.btnStart.onclick = (e) => {
                e.preventDefault();
                this.handleOnboarding();
            };
        }

        if (this.noLogoBtn) this.noLogoBtn.onclick = (e) => { e.stopPropagation(); this.handleNoLogo(); };
        if (this.dropZone) {
            this.dropZone.onclick = (e) => { if (e.target !== this.noLogoBtn) this.fileInput.click(); };
            this.fileInput.onchange = (e) => { if (e.target.files.length) this.handleFiles(e.target.files[0]); };
        }

        if (this.sendMsg) {
            this.sendMsg.onclick = () => this.handleUserMessage();
            if (this.chatInput) {
                this.chatInput.onkeypress = (e) => { if (e.key === 'Enter') { e.preventDefault(); this.handleUserMessage(); } };
            }
        }

        if (this.btnGenerate) this.btnGenerate.onclick = () => this.runSimulation("IA Generando conceptos...");
        if (this.btnExport) this.btnExport.onclick = () => this.handleExport();

        if (window.lucide) window.lucide.createIcons();
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
            badge.innerText = "v7.2 [MEMORY]";
        }
    }

    handleOnboarding() {
        const nameInput = document.getElementById('ob-user-name');
        const profInput = document.getElementById('ob-user-prof');

        this.userData.name = nameInput ? nameInput.value.trim() : "Usuario";
        this.userData.profession = profInput ? profInput.value.trim() : "Brand";

        document.getElementById('hello-name').innerText = this.userData.name;

        if (this.onboarding) this.onboarding.style.display = 'none';
        if (this.appMain) {
            this.appMain.classList.remove('blur-content');
            this.appMain.style.filter = 'none';
            this.appMain.style.pointerEvents = 'auto';
        }

        this.addMessage(`¡Hola ${this.userData.name}! Memoria activa. ¿Cómo visualizas tu marca de ${this.userData.profession}?`, 'ai');
        if (window.lucide) window.lucide.createIcons();
    }

    handleUserMessage() {
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
        this.updateStatus("Sincronizando...", "warn");

        const context = `Eres BrandIA v7.2. Usuario: ${this.userData.name}. Sector: ${this.userData.profession}.
        REGLA DE ORO: Tienes memoria histórica. Revisa los mensajes anteriores para no repetir preguntas de datos que ya tienes.
        PERSONALIDAD: Sé muy breve, directo y escueto.
        MODO BOARD: NO envíes el bloque [[CONFIG: ...]] de forma redundante. Solo si propones un cambio visual aceptado o claro.
        LOGOS: Para generar logos usa [[IMAGE: prompt detallado]]. Di "Generando visual..." antes.`;

        const contents = [
            { role: 'user', parts: [{ text: `CONTEXTO: ${context}` }] },
            { role: 'model', parts: [{ text: "Entendido. Operaré con memoria activa y brevedad extrema." }] },
            ...this.chatHistory,
            { role: 'user', parts: [{ text: prompt }] }
        ];

        try {
            const resp = await fetch(PEM_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: contents })
            });
            const data = await resp.json();

            if (data.candidates && data.candidates[0].content) {
                const aiText = data.candidates[0].content.parts[0].text;

                // Detection Image triggers
                if (aiText.includes("[[IMAGE:")) {
                    const match = aiText.match(/\[\[IMAGE: (.*?)\]\]/);
                    if (match) this.generateImage(match[1]);
                }

                this.handleAIResponseText(aiText);
                this.updateStatus("IA Lista", "success");
            }
        } catch (err) {
            console.error("API Error:", err);
            this.addMessage("[CONEXIÓN] Reconectando núcleos neuronales...", 'ai');
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
                    div.innerHTML = `<div class="color-circle" style="background:${c}"></div><div style="font-size:10px; font-weight:bold; margin-top:5px;">${c.toUpperCase()}</div>`;
                    cont.appendChild(div);
                });
            }
        }
        if (config.font) {
            const fName = document.getElementById('font-heading-name');
            const fPrev = document.getElementById('font-preview-text');
            if (fName) {
                fName.innerText = config.font;
                fName.style.fontFamily = `'${config.font}', sans-serif`;
            }
            if (fPrev) fPrev.style.fontFamily = `'${config.font}', sans-serif`;
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

    async generateImage(prompt) {
        const overlay = document.getElementById('gen-status-overlay');
        const genImg = document.getElementById('generated-logo');
        const placeholder = document.getElementById('logo-placeholder');

        if (overlay) overlay.classList.remove('hidden');
        if (placeholder) placeholder.classList.add('hidden');
        if (genImg) genImg.classList.add('hidden');

        this.updateStatus("Generando Logo...", "warn");

        const IMAGE_URL = `https://generativelanguage.googleapis.com/v1beta/models/${this.imageModel}:generateContent?key=${this.apiKey}`;

        try {
            const resp = await fetch(IMAGE_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: `Professional minimalist brand logo for: ${prompt}. Vector, flat design, white background.` }] }]
                })
            });
            const data = await resp.json();
            if (data.candidates && data.candidates[0].content.parts[0].inlineData) {
                const b64 = data.candidates[0].content.parts[0].inlineData.data;
                if (genImg) {
                    genImg.src = `data:image/png;base64,${b64}`;
                    genImg.classList.remove('hidden');
                    if (overlay) overlay.classList.add('hidden');
                    this.updateStatus("Logo Listo", "success");
                }
            }
        } catch (err) {
            console.error("Image Error", err);
            this.updateStatus("Error Image", "error");
            if (overlay) overlay.classList.add('hidden');
            if (placeholder) placeholder.classList.remove('hidden');
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

        const cleanText = text.replace(/<[^>]*>?/gm, '');
        this.chatHistory.push({
            role: type === 'user' ? 'user' : 'model',
            parts: [{ text: cleanText }]
        });

        // Limit history for performance
        if (this.chatHistory.length > 20) this.chatHistory.shift();
    }

    aiTyping(callback) {
        const div = document.createElement('div');
        div.className = 'message ai typing-indicator';
        div.innerHTML = '<span class="dot"></span><span class="dot"></span><span class="dot"></span>';
        if (this.chatMessages) this.chatMessages.appendChild(div);
        setTimeout(() => {
            div.remove();
            callback();
        }, 1200);
    }

    addConnectionStatusUI() {
        if (document.getElementById('stability-status')) return;
        const div = document.createElement('div');
        div.id = 'stability-status';
        div.style.cssText = "position:fixed; bottom:10px; right:10px; background:rgba(0,0,0,0.8); color:white; padding:5px 10px; border-radius:5px; font-size:10px; z-index:1000000;";
        div.innerHTML = '🟢 Engine Memoria 7.2';
        document.body.appendChild(div);
    }

    updateStatus(msg) {
        const st = document.getElementById('stability-status');
        if (st) st.innerText = `🟢 ${msg}`;
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

    handleNoLogo() { this.addMessage("Modo 'Creación' activo. Definamos tu identidad.", 'ai'); }
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

    handleExport() { alert("Exportando Brand Board... (Función Simulation)"); }
}

window.onload = () => { new BrandApp(); };
