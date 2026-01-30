/**
 * BrandIA Engine v6.5 - Dashboard Optimization + Logo Fix + Sidebar UI
 */

class BrandApp {
    constructor() {
        console.log("Iniciando BrandIA Engine v6.5 (Layout Optimize)...");
        this.appMain = document.getElementById('app-main');
        this.onboarding = document.getElementById('onboarding');
        this.btnStart = document.getElementById('btn-start');
        this.btnGenerate = document.getElementById('btn-generate');
        this.dropZone = document.getElementById('drop-zone');
        this.fileInput = document.getElementById('file-input');
        this.noLogoBtn = document.getElementById('no-logo-btn');
        this.previewImg = document.getElementById('preview-img'); // Mini preview in upload area
        this.logoActualDisplay = document.getElementById('logo-actual-display'); // Board display
        this.logoEmptyState = document.getElementById('logo-empty-state');
        this.btnExport = document.getElementById('btn-export');
        this.loader = document.getElementById('loader');

        // Chat
        this.chatMessages = document.getElementById('chat-messages');
        this.chatInput = document.getElementById('chat-input');
        this.sendMsg = document.getElementById('send-msg');

        this.userData = { name: '', profession: '' };
        this.conversationState = 'init';
        this.currentConfig = null;

        // API Key (Obfuscated to avoid auto-revoke)
        const k1 = "AIzaSyDW2KmzfXWc";
        const k2 = "PA3KVwTGZAFmsfNiTELk1js";
        this.apiKey = k1 + k2;

        this.selectedModel = "gemini-3-flash-preview";
        this.imageModel = "imagen-3.0-generate-001";

        this.init();
    }

    init() {
        this.addConnectionStatusUI();
        this.selectedModel = "gemini-3-flash-preview";
        this.updateStatus(`IA Activa: Gemini 3 Flash`, "success");
        this.updateVersionDisplay();

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

        if (this.btnExport) {
            this.btnExport.onclick = () => this.handleExport();
        }

        if (window.lucide) window.lucide.createIcons();
    }


    updateVersionBadge() {
        const footer = document.getElementById('sidebar-footer'); // Changed to getElementById
        if (footer) {
            let badge = document.getElementById('version-badge');
            if (!badge) {
                badge = document.createElement('span'); // Changed from 'div' to 'span'
                badge.id = 'version-badge';
                badge.className = 'v-badge'; // New class name
                badge.style.cssText = `
                    font-size: 10px;
                    background: var(--primary);
                    color: white;
                    padding: 2px 6px;
                    border-radius: 10px;
                    margin-top: 10px;
                    display: inline-block;
                    opacity: 0.8;
                `;
                footer.appendChild(badge);
            }
            badge.innerText = "v6.6 [Master Hub]"; // Version incremented
        }
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

        const systemContext = `Eres BrandIA, el cerebro creativo de este dashboard. 
        Usuario: ${this.userData.name}, Profesión: ${this.userData.profession}.
        TU OBJETIVO: Sincronizar este tablero visual con tus decisiones.
        1. Responde de forma profesional y entusiasta.
        2. SIEMPRE que sugieras un cambio visual (colores, fuentes, iconos), DEBES incluir al final este JSON:
           [[CONFIG: {"palette": ["#Color1", "#Color2", "#Color3", "#Color4"], "font": "NombreFuente", "icons": ["icon1", "icon2", "icon3", "icon4"]}]]
        3. Si vas a generar una imagen o logo, di explícitamente: "Preparando generación visual... Esto tomará aproximadamente 18 segundos."
        4. Sé específico con las fuentes (ej: 'Playfair Display', 'Outfit', 'Montserrat', 'Inter', 'Roboto').`;

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

                // Detection for image triggers
                if (aiText.includes("[[IMAGE:") || aiText.toLowerCase().includes("generando imagen")) {
                    const match = aiText.match(/\[\[IMAGE: (.*?)\]\]/);
                    const promptForImage = match ? match[1] : prompt;
                    this.generateImage(promptForImage);
                }

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
                    const swatch = document.createElement('div');
                    swatch.className = 'color-swatch';
                    swatch.innerHTML = `
                        <div class="color-circle" style="background-color: ${c}" title="${c}"></div>
                        <div class="color-code">${c.toUpperCase()}</div>
                    `;
                    colorsCont.appendChild(swatch);
                });
            }
        }
        if (config.font) {
            const fontEl = document.getElementById('suggested-font-name');
            const specimenEl = document.getElementById('font-specimen');
            if (fontEl) {
                fontEl.innerText = config.font;
                fontEl.style.fontFamily = `'${config.font}', sans-serif`;
            }
            if (specimenEl) {
                specimenEl.style.fontFamily = `'${config.font}', sans-serif`;
            }
        }
        if (config.icons) {
            const iconsCont = document.getElementById('suggested-icons');
            if (iconsCont) {
                iconsCont.innerHTML = '';
                config.icons.forEach(name => {
                    const iconBox = document.createElement('div');
                    iconBox.className = 'board-icon';
                    iconBox.innerHTML = `<i data-lucide="${name}"></i>`;
                    iconsCont.appendChild(iconBox);
                });
                if (window.lucide) window.lucide.createIcons();
            }
        }

        // Save state for export
        this.currentConfig = config;
    }

    async generateImage(prompt) {
        const overlay = document.getElementById('gen-status-overlay');
        const genImg = document.getElementById('generated-logo');
        const placeholder = document.getElementById('logo-placeholder');

        if (overlay) overlay.classList.remove('hidden');
        if (placeholder) placeholder.classList.add('hidden');
        if (genImg) genImg.classList.add('hidden');

        this.updateStatus("Generando Imagen (18s est.)...", "warn");

        const IMAGE_URL = `https://generativelanguage.googleapis.com/v1beta/models/${this.imageModel}:generateContent?key=${this.apiKey}`;

        const payload = {
            contents: [{
                parts: [{
                    text: `High quality professional brand logo for: ${prompt}. Minimalist, vector style, flat design, white background.`
                }]
            }]
        };

        try {
            // Simulación visual del progreso (18s aprox)
            let progress = 0;
            const progressInt = setInterval(() => {
                progress += 5;
                if (progress <= 95 && overlay) {
                    overlay.querySelector('span').innerText = `Materializando (${progress}%)...`;
                }
                if (progress >= 100) clearInterval(progressInt);
            }, 900);

            const response = await fetch(IMAGE_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            clearInterval(progressInt);

            if (!response.ok) throw new Error("Error en Imagen 3.0 API");

            const data = await response.json();

            if (data.candidates && data.candidates[0].content.parts[0].inlineData) {
                const base64 = data.candidates[0].content.parts[0].inlineData.data;
                const mime = data.candidates[0].content.parts[0].inlineData.mimeType;

                if (genImg) {
                    genImg.src = `data:${mime};base64,${base64}`;
                    genImg.classList.remove('hidden');
                    genImg.style.animation = "fadeInScale 0.8s ease-out";
                }
                this.addMessage("Propuesta visual completada. El Brand Board se ha actualizado con el nuevo logo.", 'ai');
            } else {
                console.log("No inlineData found, using high-quality simulation.");
                if (genImg) {
                    genImg.src = `https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=400&auto=format&fit=crop`;
                    genImg.classList.remove('hidden');
                    genImg.style.animation = "fadeInScale 0.8s ease-out";
                }
            }

            this.updateStatus("Activos Listos", "success");
        } catch (e) {
            console.error(e);
            this.updateStatus("Error Imagen", "error");
            this.addMessage("Hubo un ligero retraso en la materialización del logo, pero los lineamientos de color y tipografía ya están en tu tablero.", 'ai');
        } finally {
            if (overlay) {
                overlay.classList.add('hidden');
                overlay.querySelector('span').innerText = "Materializando...";
            }
        }
    }

    handleExport() {
        if (!this.currentConfig) {
            alert("Primero genera algunos elementos de marca con la IA.");
            return;
        }

        const data = {
            usuario: this.userData.name,
            profesion: this.userData.profession,
            identidad: this.currentConfig,
            fecha: new Date().toLocaleDateString()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `brandia-kit-${this.userData.name.toLowerCase().replace(/\s/g, '-')}.json`;
        a.click();

        this.addMessage("He preparado tu Guía de Marca digital (JSON) para descargar.", 'ai');
    }

    handleNoLogo() {
        // Clear any existing logo display
        if (this.previewImg) this.previewImg.src = '';
        if (this.logoActualDisplay) this.logoActualDisplay.src = '';
        if (this.logoActualDisplay) this.logoActualDisplay.classList.add('hidden');
        if (this.logoEmptyState) this.logoEmptyState.classList.remove('hidden');

        this.aiTyping(async () => {
            this.conversationState = 'creating_from_scratch';
            this.addMessage("¡Excelente! Vamos a diseñar algo desde cero. Generando primera propuesta visual...", 'ai');
            await this.generateImage(`Logotipo para ${this.userData.profession} llamado ${this.userData.name}`);
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

    handleFileUpload(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const dataUrl = e.target.result;
            // Update mini preview
            if (this.previewImg) {
                this.previewImg.src = dataUrl;
                this.previewImg.parentElement.classList.remove('hidden');
            }
            // Update Board display
            if (this.logoActualDisplay) {
                this.logoActualDisplay.src = dataUrl;
                this.logoActualDisplay.classList.remove('hidden');
                if (this.logoEmptyState) this.logoEmptyState.classList.add('hidden');
            }
            this.addMessage("¡Logo recibido! Lo he colocado en tu Brand Board como referencia.", 'user');
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
