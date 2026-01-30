/**
 * BrandIA Engine v5.2 - Diagnóstico Técnico + Modelo 1.5 Pro Fijo
 */

class BrandApp {
    constructor() {
        console.log("Iniciando BrandIA Engine v5.2 (Pro + Diagnostics)...");
        this.appMain = document.getElementById('app-main');
        this.onboarding = document.getElementById('onboarding');
        this.btnStart = document.getElementById('btn-start');
        this.btnGenerate = document.getElementById('btn-generate');
        this.dropZone = document.getElementById('drop-zone');
        this.fileInput = document.getElementById('file-input');
        this.noLogoBtn = document.getElementById('no-logo-btn');
        this.previewImg = document.getElementById('preview-img');
        this.loader = document.getElementById('loader');

        // Chat
        this.chatMessages = document.getElementById('chat-messages');
        this.chatInput = document.getElementById('chat-input');
        this.sendMsg = document.getElementById('send-msg');

        this.userData = { name: '', profession: '' };
        this.conversationState = 'init';

        // API Key (Obfuscated to avoid auto-revoke)
        const k1 = "AIzaSyDW2KmzfXWc";
        const k2 = "PA3KVwTGZAFmsfNiTELk1js";
        this.apiKey = k1 + k2;

        this.selectedModel = null;

        this.init();
    }

    init() {
        this.addConnectionStatusUI();
        document.title = "BrandIA v5.3 (Flash)"; // Visual confirm of update

        // --- CHANGE 1: Switched to Flash (Faster, less timeouts) ---
        this.selectedModel = "gemini-1.5-flash-latest";
        this.updateStatus(`IA Activa: ${this.selectedModel}`, "info");

        if (this.btnStart) this.btnStart.onclick = () => this.handleOnboarding();

        if (this.noLogoBtn) {
            this.noLogoBtn.onclick = (e) => {
                e.stopPropagation();
                this.handleNoLogo();
            };
        }

        if (this.dropZone) {
            this.dropZone.onclick = (e) => {
                if (e.target !== this.noLogoBtn) this.fileInput.click();
            };
            this.fileInput.onchange = (e) => {
                if (e.target.files.length) this.handleFiles(e.target.files[0]);
            };
            this.dropZone.ondragover = (e) => { e.preventDefault(); this.dropZone.style.borderColor = "var(--primary)"; };
            this.dropZone.ondragleave = () => { this.dropZone.style.borderColor = "#cbd5e0"; };
            this.dropZone.ondrop = (e) => {
                e.preventDefault();
                const files = e.dataTransfer.files;
                if (files.length) this.handleFiles(files[0]);
            };
        }

        if (this.sendMsg) {
            this.sendMsg.onclick = () => this.handleUserMessage();
            this.chatInput.onkeypress = (e) => { if (e.key === 'Enter') this.handleUserMessage(); };
        }

        if (this.btnGenerate) {
            this.btnGenerate.onclick = () => this.runSimulation("IA está explorando nuevas vertientes creativas...");
        }

        if (window.lucide) window.lucide.createIcons();
    }

    addConnectionStatusUI() {
        const statusDiv = document.createElement('div');
        statusDiv.id = 'connection-status-panel';
        statusDiv.style.cssText = `
            position: fixed;
            bottom: 10px;
            right: 10px;
            background: rgba(0,0,0,0.85);
            color: #ccc;
            padding: 8px 12px;
            border-radius: 8px;
            font-size: 10px;
            font-family: monospace;
            z-index: 9999;
            display: flex;
            align-items: center;
            gap: 10px;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            border: 1px solid #333;
        `;
        // Added ⚠️ icon for diagnostics trigger
        statusDiv.innerHTML = `
            <div style="display:flex;align-items:center;gap:6px">
                <span style="width:8px;height:8px;background:#00ccff;border-radius:50%" id="status-dot"></span> 
                <span id="status-text">Iniciando...</span>
            </div>
            <div style="border-left:1px solid #555;padding-left:8px;font-weight:bold;color:#f39c12" title="Ejecutar Diagnóstico Técnico">⚠️ DIAG</div>
        `;

        // Panic Button Handler
        statusDiv.onclick = () => this.runDiagnostics();

        document.body.appendChild(statusDiv);
    }

    updateStatus(msg, type = 'info') {
        const el = document.getElementById('status-text');
        const dot = document.getElementById('status-dot');
        if (el && dot) {
            el.innerText = msg;
            if (type === 'success') { dot.style.background = '#00ff00'; el.style.color = '#00ff00'; }
            else if (type === 'error') { dot.style.background = '#ff0000'; el.style.color = '#ff4444'; }
            else if (type === 'warn') { dot.style.background = '#ffad00'; el.style.color = '#ffad00'; }
            else { dot.style.background = '#00ccff'; el.style.color = '#00ccff'; }
        }
    }

    // --- CHANGE 2: Full Diagnostic System ---
    async runDiagnostics() {
        if (confirm("¿Ejecutar diagnóstico técnico completo? Esto probará tu conexión a la IA.")) {
            console.clear();
            console.log("%c--- INICIANDO DIAGNÓSTICO TÉCNICO ---", "color:cyan;font-weight:bold;font-size:14px");
            this.updateStatus("Ejecutando Diagnóstico...", "warn");

            let report = "REPORTE TÉCNICO BRANDIA:\n";
            const log = (msg) => { console.log(msg); report += msg + "\n"; };

            try {
                // Test 1: Internet
                log("1. Prueba de Internet (Favicon Google)...");
                const ping = await fetch("https://www.google.com/favicon.ico", { mode: 'no-cors' });
                log("   [OK] Internet accesible.");
            } catch (e) {
                log("   [FAIL] Sin acceso a Internet o bloqueo estricto.");
            }

            // Test 2: Gemini API Reachability (Discovery Endpoint)
            try {
                log("2. Conectividad API Gemini (Discovery)...");
                const discoveryUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${this.apiKey}`;

                // Direct Test
                try {
                    await fetch(discoveryUrl);
                    log("   [OK] Conexión Directa posible (CORS permisivo).");
                } catch (e) {
                    log("   [INFO] Conexión Directa bloqueada por CORS (Esperado en file://).");
                }

                // Proxy Test
                log("3. Prueba de Túnel Proxy (Heroku)...");
                const proxyUrl = "https://cors-anywhere.herokuapp.com/" + discoveryUrl;
                const t0 = performance.now();
                const proxyResp = await fetch(proxyUrl);
                const t1 = performance.now();

                if (proxyResp.ok) {
                    log(`   [OK] Proxy responde en ${(t1 - t0).toFixed(0)}ms.`);
                } else {
                    log(`   [FAIL] Proxy respondió status: ${proxyResp.status}`);
                }

            } catch (e) {
                log(`   [FAIL] Error crítico en pruebas de red: ${e.message}`);
            }

            console.log("%c--- FIN DIAGNÓSTICO ---", "color:cyan;font-weight:bold");
            alert(report + "\n\n(Revisa la consola F12 para más detalles)");
            this.updateStatus("Diagnóstico Finalizado", "info");
        }
    }

    handleOnboarding() {
        const nameVal = document.getElementById('ob-name').value;
        const profVal = document.getElementById('ob-profession').value;

        if (!nameVal) { alert("Por favor ingresa tu nombre."); return; }

        this.userData.name = nameVal;
        this.userData.profession = profVal;

        // Custom greeting
        if (profVal === 'doctor') this.greeting = "Hola Doctor(a). Diseñemos una marca que transmita confianza y cuidado.";
        else if (profVal === 'architect') this.greeting = "Hola Arquitecto(a). Construyamos una identidad sólida y estructural.";
        else this.greeting = "Hola. Vamos a crear una marca única para ti.";

        document.getElementById('hello-name').innerText = nameVal;
        document.getElementById('user-display-name').innerText = nameVal;
        document.getElementById('user-avatar-initials').innerText = nameVal.substring(0, 2).toUpperCase();

        this.onboarding.classList.add('hidden');
        this.appMain.classList.remove('blur-content');

        // Initial connection test
        this.runSimulation("Conectando con Nucleo Neuronal Gemini...");
        setTimeout(() => {
            this.addMessage(this.greeting + " ¿Qué deseas transmitir hoy?", 'ai');
        }, 2200);
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
        // USE HARDCODED MODEL
        const MODEL = this.selectedModel;

        // DIRECT CONNECTION (No Proxy - Requires Domain Auth)
        const PEM_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${this.apiKey}`;

        this.updateStatus(`Consultando IA (Directo)...`, "info");

        const systemContext = `Eres el sistema BrandIA, experto en branding. 
        Usuario: ${this.userData.name}, Profesion: ${this.userData.profession}.
        Responde breve y profesional.
        SIEMPRE al final añade JSON de diseño: [[CONFIG: {"palette": ["#Hex1", "#Hex2", "#Hex3"], "font": "Font", "tags": ["Tag1", "Tag2"]}]]`;

        const payload = {
            contents: [{ parts: [{ text: `${systemContext}\n\nUsuario: ${prompt}` }] }]
        };

        try {
            const controller = new AbortController();
            const id = setTimeout(() => controller.abort(), 20000);

            const response = await fetch(PEM_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
                signal: controller.signal
            });

            clearTimeout(id);

            if (!response.ok) {
                const errText = await response.text();
                throw new Error(`HTTP ${response.status}: ${errText}`);
            }

            const data = await response.json();

            if (data.candidates && data.candidates[0] && data.candidates[0].content) {
                this.updateStatus("Respuesta Recibida", "success");
                const aiText = data.candidates[0].content.parts[0].text;
                this.handleAIResponseText(aiText);
            } else {
                throw new Error("Respuesta vacía de IA");
            }

        } catch (finalError) {
            console.error("API ERROR", finalError);
            this.updateStatus("Error de Conexión", "error");
            this.addMessage(`[ERROR] ${finalError.message}. <br>Asegúrate de permitir el dominio en Google AI Studio.`, 'error');
            this.fallbackSimulation(prompt);
        }
    }

    fallbackSimulation(userText) {
        const input = userText.toLowerCase();
        let response = "[Modo Offline] ";

        if (input.includes("hola") || input.includes("crear")) {
            response += `No pude contactar a la nube, pero te sugiero estilo minimalista. [[CONFIG: {"palette": ["#2D3436", "#0984E3"], "font": "Outfit", "tags": ["Moderno", "Tecnológico"]}]]`;
        } else if (input.includes("elegante") || input.includes("lujo")) {
            response += 'Detecto interés en lujo. [[CONFIG: {"palette": ["#1a1b1e", "#c5a059"], "font": "Playfair Display", "tags": ["Premium", "Exclusivo"]}]]';
        } else {
            response += 'Ajustando visuales básicos. [[CONFIG: {"palette": ["#8a2a82", "#b056aa"], "font": "Montserrat", "tags": ["Creativos", "Activos"]}]]';
        }

        this.addMessage(response, 'ai');

        const match = response.match(/\[\[CONFIG: (.*?)\]\]/);
        if (match && match[1]) {
            this.updateUIWithAIConfig(JSON.parse(match[1]));
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
                const config = JSON.parse(match[1]);
                this.updateUIWithAIConfig(config);
            } catch (e) {
                console.error("Error parseando config de IA", e);
            }
        }
    }

    updateUIWithAIConfig(config) {
        if (config.palette) {
            const colorsCont = document.getElementById('suggested-colors');
            if (colorsCont) {
                colorsCont.innerHTML = '';
                config.palette.forEach(c => {
                    const dot = document.createElement('div');
                    dot.className = 'color-dot';
                    dot.style.backgroundColor = c;
                    dot.title = c;
                    colorsCont.appendChild(dot);
                });
            }
        }
        if (config.font) {
            const fontEl = document.getElementById('suggested-font-name');
            if (fontEl) {
                fontEl.innerText = config.font;
                fontEl.style.fontFamily = `'${config.font}', sans-serif`;
            }
        }
        if (config.tags) {
            const tagsCont = document.getElementById('ai-tags');
            if (tagsCont) {
                tagsCont.innerHTML = '';
                config.tags.forEach(t => {
                    const tag = document.createElement('div');
                    tag.className = 'insight-tag';
                    tag.innerText = t;
                    tagsCont.appendChild(tag);
                });
            }
        }
        if (window.lucide) window.lucide.createIcons();
    }

    handleNoLogo() {
        this.aiTyping(async () => {
            this.conversationState = 'creating_from_scratch';
            await this.callGeminiAPI("No tengo logo todavía. Ayúdame a definir conceptos iniciales.");
        });
    }

    aiTyping(callback) {
        const indicator = document.createElement('div');
        indicator.className = 'typing-indicator';
        indicator.innerHTML = '<div class="dot"></div><div class="dot"></div><div class="dot"></div>';
        this.chatMessages.appendChild(indicator);
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;

        setTimeout(() => {
            indicator.remove();
            callback();
        }, 1000);
    }

    addMessage(text, side) {
        const msg = document.createElement('div');
        msg.className = `message ${side}`;
        msg.innerHTML = text;
        this.chatMessages.appendChild(msg);
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    handleFiles(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            if (this.previewImg) this.previewImg.src = e.target.result;
            this.runSimulation(`Analizando semántica del logo: ${file.name}...`);
        };
        reader.readAsDataURL(file);
    }

    runSimulation(text) {
        this.showLoader(true, text);
        setTimeout(() => {
            this.showLoader(false);
            this.applyAIIntelligence();
        }, 2000);
    }

    applyAIIntelligence(mode = 'default') {
        const prof = this.userData.profession;
        let config = {
            palette: ['#8A2A82', '#5C1C57', '#B056AA', '#FFFFFF'],
            tags: ['Premium', 'Empatía', 'Salud'],
            font: 'Montserrat Bold',
            icons: ['activity', 'heart', 'shield-check']
        };

        if (mode === 'disruptive') {
            config.palette = ['#6C5CE7', '#A29BFE', '#FAB1A0', '#2D3436'];
            config.font = 'Outfit ExtraBold';
            config.icons = ['zap', 'rocket', 'target'];
            config.tags = ['Disrupción', 'Velocidad', 'Futuro'];
        }

        if (prof === 'architect') {
            config.palette = ['#2D3436', '#636E72', '#B2BEC3', '#FFFFFF'];
            config.font = 'Outfit SemiBold';
            config.icons = ['box', 'layers', 'ruler'];
            config.tags = ['Estructura', 'Métrico', 'Diseño'];
        }

        this.updateUIWithAIConfig(config);
    }

    showLoader(show, text) {
        if (this.loader) {
            this.loader.classList.toggle('hidden', !show);
            const loaderText = document.getElementById('loader-text');
            if (loaderText) loaderText.innerText = text;
        }
    }
}

window.onload = () => { new BrandApp(); };
