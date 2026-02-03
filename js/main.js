/**
 * BrandIA Engine v7.3 - Gemini 3.0 + Dual-IA Design Strike
 */

class BrandApp {
    constructor() {
        console.log("🚀 INITIALIZING BRANDIA ENGINE v7.7 [SVG PRO + CHAT RESTORE]...");

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

            // Onboarding v7.4
            this.onboardingContainer = document.getElementById('onboarding-container');
            this.currentStep = 1;

            // Selection Matrix v7.4
            this.matrixArea = document.getElementById('matrix-selection-area');
            this.matrixContainer = document.getElementById('matrix-options');
            this.eliteViewer = document.getElementById('elite-viewer');

            // State for 5 options
            this.brandOptions = [];
            this.selectedOptionIndex = 0;
            this.currentSelections = {
                logo: 0,
                colors: 0,
                fonts: 0,
                icons: 0
            };

            // Chat
            this.chatMessages = document.getElementById('chat-messages');
            this.chatInput = document.getElementById('chat-input');
            this.sendMsg = document.getElementById('send-msg');

            // Data State
            this.userData = { name: '', profession: '', industry: '', values: [], style: '' };
            this.chatHistory = []; // Master memory
            this.apiKey = "AIzaSyDW2KmzfXWc" + "PA3KVwTGZAFmsfNiTELk1js";

            // Models
            this.selectedModel = "gemini-3-pro-preview";
            this.visualEngine = "dicebear";

            this.safeInit();
        } catch (err) {
            console.error("FATAL CONSTRUCTOR ERROR:", err);
        }
    }

    safeInit() {
        this.addConnectionStatusUI();
        this.updateStatus(`IA Operativa: Gemini 3.0`, "success");
        this.updateVersionBadge();

        if (this.btnStart) {
            this.btnStart.onclick = (e) => {
                e.preventDefault();
                this.handleOnboarding(true); // Skipped to dashboard
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
                badge.style.cssText = "font-size:10px; background:#D95486; color:white; padding:2px 8px; border-radius:10px; opacity:0.8;";
                footer.appendChild(badge);
            }
            badge.innerText = "v8.1 [PENTÁGONO CREATIVO]";
        }
    }

    handleOnboarding(isSkip = false) {
        if (isSkip) {
            this.currentStep = 3; // Jump to end
        }

        if (this.currentStep === 1) {
            const nameInput = document.getElementById('ob-user-name');
            const profInput = document.getElementById('ob-user-prof');
            this.userData.name = nameInput ? nameInput.value.trim() : "Usuario";
            this.userData.profession = profInput ? profInput.value.trim() : "Brand";

            this.updateStepper(2);
            this.currentStep = 2;
            this.addMessage(`¡Hola ${this.userData.name}! Cuéntame más sobre la <strong>Industria</strong> y los <strong>Valores</strong> de tu marca de ${this.userData.profession}.`, 'ai');
        } else if (this.currentStep === 2) {
            this.updateStepper(3);
            this.currentStep = 3;
            this.addMessage("Perfecto. ¿Qué <strong>Estilo Visual</strong> prefieres? (ej: Minimalista, Elegante, Moderno).", 'ai');
        } else {
            if (this.onboarding) {
                this.onboarding.style.opacity = '0';
                setTimeout(() => this.onboarding.style.display = 'none', 500);
            }
            if (this.appMain) {
                this.appMain.classList.remove('blur-content');
                this.appMain.style.filter = 'none';
                this.appMain.style.pointerEvents = 'auto';
            }
            this.updateStatus("Matriz de Selección Lista", "success");
            // En la v7.8 NO generamos la matriz automáticamente al entrar, 
            // dejamos que el usuario hable con el chat primero para alinear visión.
            this.addMessage("¡Bienvenido al Dashboard Elite! Describe tu visión aquí abajo para empezar el proceso creativo.", 'ai');
        }
        if (window.lucide) window.lucide.createIcons();
    }

    updateStepper(stepNum) {
        if (this.onboardingContainer) this.onboardingContainer.classList.remove('hidden');
        document.querySelectorAll('.step').forEach((s, idx) => {
            s.classList.remove('active', 'completed');
            if (idx + 1 < stepNum) s.classList.add('completed');
            if (idx + 1 === stepNum) s.classList.add('active');
        });
    }

    startCreativeProcess() {
        this.addMessage(`¡Todo listo! Estoy orquestando <strong>5 propuestas de diseño exclusivas</strong> para <strong>${this.userData.name}</strong>. Esto tomará unos segundos de procesamiento neuronal...`, 'ai');
        this.aiTyping(async () => {
            await this.callGeminiAPI("GENERATE_MASTER_MATRIX");
        });
    }

    handleUserMessage() {
        const text = this.chatInput.value.trim();
        if (!text) return;

        this.addMessage(text, 'user');
        this.chatInput.value = '';

        if (this.currentStep < 3) {
            this.handleOnboarding();
        } else {
            this.aiTyping(async () => {
                await this.callGeminiAPI(text);
            });
        }
    }

    async callGeminiAPI(prompt) {
        const PEM_URL = `https://generativelanguage.googleapis.com/v1beta/models/${this.selectedModel}:generateContent?key=${this.apiKey}`;
        this.updateStatus("Generando Matriz...", "warn");

        const isMatrixRequest = prompt === "GENERATE_MASTER_MATRIX";

        const context = `Eres BrandIA v8.1 [PENTÁGONO CREATIVO]. Estratega de Branding Supremo.
        Usuario: ${this.userData.name}. Sector: ${this.userData.profession}.
        
        OBJETIVO: Generar 5 PROPUESTAS DE MARCA ÍNTEGRAS (Brand Boards 360°).
        CADA PROPUESTA DEBE INCLUIR:
        1. LOGO_PROMPT: Prompt artístico en INGLES, descriptivo, SIN TEXTO. (Ej: "Minimalist abstract lotus flower, gold and deep teal, professional vector style, symmetrical").
        2. PALETA: 6 colores lujosos coordinados.
        3. FUENTES: 2 nombres de Google Fonts (Heading, Body).
        4. ICONOS: 6 nombres de Lucide Icons consistentes.
        5. CONCEPTO: Nombre evocador.

        RESPONDER SIEMPRE CON [[MATRIX: {"options": [ ... 5 items ... ]}]]
        IMPORTANTE: Los prompts de imagen deben ser limpios, sin caracteres especiales (#, %, etc.) ni saltos de línea.`;

        const contents = [
            { role: 'user', parts: [{ text: `DIRECTRIZ SISTEMA: ${context}` }] },
            { role: 'model', parts: [{ text: "Entendido. Generaré la Matriz de Selección de 5 opciones con lógica de diseño Quick." }] },
            ...this.chatHistory
        ];

        try {
            const resp = await fetch(PEM_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: contents })
            });

            if (!resp.ok) throw new Error(`API HTTP Error: ${resp.status}`);

            const data = await resp.json();

            if (data.candidates && data.candidates[0].content) {
                const aiText = data.candidates[0].content.parts[0].text;

                // Robust JSON Extraction
                let matrixData = null;
                if (aiText.includes("[[MATRIX:")) {
                    try {
                        const match = aiText.match(/\[\[MATRIX:\s*(\{.*?\})\s*\]\]/s);
                        if (match && match[1]) {
                            const jsonStr = match[1].replace(/```json/g, '').replace(/```/g, '');
                            matrixData = JSON.parse(jsonStr);
                            this.handleMatrixData(matrixData);
                        }
                    } catch (e) {
                        console.error("Matrix Parse Error:", e);
                        this.addMessage("⚠️ Error procesando la matriz visual. Reintentando...", 'error');
                    }
                }

                this.handleAIResponseText(aiText);
                if (matrixData) this.updateStatus("Matriz Materializada", "success");
                else this.updateStatus("Respuesta Recibida", "success");
            }
        } catch (err) {
            console.error("API Error Matrix:", err);
            this.addMessage("[ERROR] Conexión inestable con el núcleo creativo.", 'error');
            this.updateStatus("Error de Sincronización", "error");
        }
    }

    async handleMatrixData(data) {
        if (!data || !data.options) return;
        this.brandOptions = data.options;

        const matrixArea = document.getElementById('matrix-selection-area');
        const boardHero = document.getElementById('brand-board-hero');

        if (matrixArea) {
            matrixArea.classList.remove('hidden');
            matrixArea.style.animation = "fadeInScale 0.8s ease-out forwards";
        }
        if (boardHero) {
            boardHero.classList.remove('hidden');
            boardHero.style.animation = "fadeInScale 1s ease-out forwards";
        }

        // Generate images for all options early
        this.updateStatus("Generando Visuales v7.9...", "warn");
        this.renderMatrix();
        this.applyOption(0);
    }

    renderMatrix() {
        if (!this.matrixContainer) return;
        this.matrixContainer.innerHTML = '';

        this.brandOptions.forEach((opt, idx) => {
            const board = document.createElement('div');
            board.className = `mini-brand-board ${this.selectedOptionIndex === idx ? 'active' : ''}`;

            // Image Engine Stability Fix v8.1
            const safePrompt = opt.logo_prompt.replace(/[^a-zA-Z0-9\s,]/g, '').trim();
            const imageUrl = `https://pollinations.ai/p/${encodeURIComponent(safePrompt)}?width=400&height=400&model=flux&nologo=true&seed=${idx + 123}`;

            board.innerHTML = `
                <div class="board-mini-header" onclick="app.applyOption(${idx})">
                    <span class="badge-idx">PROPUESTA ${idx + 1}</span>
                    <h3 class="mini-brand-title">${opt.concept}</h3>
                    <button class="btn-use-board">Cargar Identidad Completa</button>
                </div>
                
                <div class="mini-board-grid">
                    <div class="mini-section logo-sub">
                        <div class="mini-label">Logotipo Conceptualmente</div>
                        <img src="${imageUrl}" class="mini-logo-img" onerror="this.src='https://placehold.co/400x400/f8fafc/D95486?text=IA+Cargando...'">
                        <button class="btn-mixer-mini" onclick="app.selectAsset('logo', ${idx})">Usar Logo</button>
                    </div>
                    
                    <div class="mini-section color-sub">
                        <div class="mini-label">Paleta</div>
                        <div class="mini-palette-grid">
                            ${opt.palette.map(c => `<div class="mini-swatch" style="background:${c}"></div>`).join('')}
                        </div>
                        <button class="btn-mixer-mini" onclick="app.selectAsset('colors', ${idx})">Usar Colores</button>
                    </div>
                    
                    <div class="mini-section font-sub">
                        <div class="mini-label">Tipografía</div>
                        <div class="mini-font-name">${opt.fonts[0]}</div>
                        <button class="btn-mixer-mini" onclick="app.selectAsset('fonts', ${idx})">Usar Fuente</button>
                    </div>
                    
                    <div class="mini-section icon-sub">
                        <div class="mini-label">Iconos</div>
                        <div class="mini-icon-strip">
                            ${opt.icons.slice(0, 4).map(i => `<i data-lucide="${i}"></i>`).join('')}
                        </div>
                        <button class="btn-mixer-mini" onclick="app.selectAsset('icons', ${idx})">Usar Iconos</button>
                    </div>
                </div>
            `;
            this.matrixContainer.appendChild(board);
        });

        if (window.lucide) window.lucide.createIcons();
    }

    applyOption(idx) {
        this.selectedOptionIndex = idx;
        // Al aplicar una opción completa, reseteamos selecciones individuales para esta opción
        this.currentSelections = { logo: idx, colors: idx, fonts: idx, icons: idx };
        this.updateFinalBoard();
        this.renderMatrix();
    }

    selectAsset(type, idx) {
        this.currentSelections[type] = idx;
        this.updateFinalBoard();
        this.renderMatrix();
        this.updateStatus(`Mix: ${type.toUpperCase()} de Opción ${idx + 1}`, "success");
    }

    updateFinalBoard() {
        const logoOpt = this.brandOptions[this.currentSelections.logo];
        const colorOpt = this.brandOptions[this.currentSelections.colors];
        const fontOpt = this.brandOptions[this.currentSelections.fonts];
        const iconOpt = this.brandOptions[this.currentSelections.icons];

        // Update Logo Image v8.1 (Sanitized)
        const genBox = document.getElementById('generated-logo');
        const placeholder = document.getElementById('logo-placeholder');
        if (genBox) {
            const safePrompt = logoOpt.logo_prompt.replace(/[^a-zA-Z0-9\s,]/g, '').trim();
            const imageUrl = `https://pollinations.ai/p/${encodeURIComponent(safePrompt)}?width=800&height=800&model=flux&nologo=true&seed=${this.currentSelections.logo + 123}`;
            genBox.innerHTML = `<img src="${imageUrl}" class="shadow-lg hover:scale-105 transition-transform duration-500" onerror="this.src='https://placehold.co/800x800/f8fafc/D95486?text=IA+Cargando...'">`;
            genBox.classList.remove('hidden');
            genBox.onclick = () => this.openEliteViewer(`<img src="${imageUrl}" style="max-width:90vmin">`, false);
        }
        if (placeholder) placeholder.classList.add('hidden');

        // Update Colors
        this.updateUIWithAIConfig({ palette: colorOpt.palette });

        // Update Fonts (First of the array is Heading, second is Body)
        this.updateUIWithAIConfig({ font: fontOpt.fonts[0] });

        // Update Icons
        this.updateUIWithAIConfig({ icons: iconOpt.icons });
    }

    updateUIWithAIConfig(config) {
        if (config.palette) {
            const cont = document.getElementById('color-palette');
            if (cont) {
                cont.innerHTML = '';
                config.palette.forEach(c => {
                    const div = document.createElement('div');
                    div.className = 'color-swatch-elite';
                    div.innerHTML = `<div class="color-circle" style="background:${c}"></div><div class="color-code" style="font-size:10px; font-weight:bold; margin-top:5px;">${c.toUpperCase()}</div>`;
                    cont.appendChild(div);
                });
            }
        }
        if (config.font) {
            const fName = document.getElementById('font-heading-name');
            const fPrev = document.getElementById('font-specimen');
            if (fName) fName.innerText = config.font;
            if (fPrev) {
                fPrev.innerText = "BrandIA Style";
                fPrev.style.fontFamily = `'${config.font}', sans-serif`;
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

    async generateImage(prompt) {
        const overlay = document.getElementById('gen-status-overlay');
        const genImg = document.getElementById('generated-logo');
        const placeholder = document.getElementById('logo-placeholder');

        if (overlay) {
            overlay.classList.remove('hidden');
            overlay.innerHTML = '<div class="loader-spinner"></div><span>BrandIA Diseñando...</span>';
        }
        if (placeholder) placeholder.classList.add('hidden');
        if (genImg) genImg.classList.add('hidden');

        this.updateStatus("DiceBear: Creando Logo...", "warn");

        try {
            // Use 'shapes' for professional brands, 'initials' for personal
            let style = "shapes";
            let seed = prompt.replace(/\s+/g, '-').toLowerCase() + "-" + Math.random().toString(36).substring(7);

            if (prompt.toLowerCase().includes("inicial") || prompt.toLowerCase().includes("nombre") || prompt.length < 10) {
                style = "initials";
            }

            const DICEBEAR_URL = `https://api.dicebear.com/9.x/${style}/svg?seed=${encodeURIComponent(seed)}&backgroundColor=ffffff&backgroundType=solid`;

            if (genImg) {
                genImg.src = DICEBEAR_URL;
                genImg.onload = () => {
                    genImg.classList.remove('hidden');
                    if (overlay) overlay.classList.add('hidden');
                    this.updateStatus("Logo Materializado", "success");
                };
            }
        } catch (err) {
            console.error("Visual Error", err);
            this.updateStatus("Falla Visual", "error");
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

        if (this.chatHistory.length > 30) this.chatHistory.shift();
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

    async generateBrandPDF() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        doc.setFillColor(0, 42, 50); // Dark Teal
        doc.rect(0, 0, 210, 40, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.text("BRANDIA ELITE BRAND BOOK", 105, 20, { align: 'center' });
        doc.setFontSize(12);
        doc.text(`Identidad para: ${this.userData.name}`, 105, 30, { align: 'center' });

        doc.setTextColor(0, 42, 50);
        doc.setFontSize(16);
        doc.text("1. Paleta de Colores", 20, 60);

        const colors = this.brandOptions[this.currentSelections.colors].palette;
        colors.forEach((c, idx) => {
            doc.setFillColor(c);
            doc.rect(20 + (idx * 30), 70, 20, 20, 'F');
            doc.setFontSize(8);
            doc.text(c.toUpperCase(), 30 + (idx * 30), 95, { align: 'center' });
        });

        doc.setFontSize(16);
        doc.text("2. Tipografías Sugeridas", 20, 120);
        const font = this.brandOptions[this.currentSelections.fonts].font;
        doc.setFontSize(12);
        doc.text(`Primaria: ${font}`, 20, 130);
        doc.text("Muestra: ABCDEFGHIJKLMNOPQRSTUVWXYZ", 20, 140);

        doc.setFontSize(16);
        doc.text("3. Concepto Visual", 20, 170);
        doc.setFontSize(10);
        const concept = this.brandOptions[this.currentSelections.logo].concept || "Branding generado con motor SVG nativo v7.6.";
        doc.text(doc.splitTextToSize(concept, 170), 20, 180);

        doc.save(`${this.userData.name}_BrandBook.pdf`);
        this.updateStatus("PDF Descargado", "success");
    }

    openEliteViewer(content, isSvg = false) {
        if (!this.eliteViewer) return;
        this.eliteViewer.classList.add('active');
        const container = document.getElementById('viewer-logo-container');
        if (container) {
            if (isSvg) {
                container.innerHTML = content;
                // Ensure SVG in modal is visible and scaled
                const svg = container.querySelector('svg');
                if (svg) {
                    svg.style.width = "300px";
                    svg.style.height = "300px";
                }
            } else {
                container.innerHTML = `<img src="${content}" class="viewer-image">`;
            }
        }
        const name = document.getElementById('viewer-brand-name');
        if (name) name.innerText = this.userData.name;
    }

    closeEliteViewer() {
        if (this.eliteViewer) this.eliteViewer.classList.remove('active');
    }

    addConnectionStatusUI() {
        if (document.getElementById('stability-status')) return;
        const div = document.createElement('div');
        div.id = 'stability-status';
        div.style.cssText = "position:fixed; bottom:10px; right:10px; background:#002A32; color:white; padding:5px 15px; border-radius:25px; font-size:11px; z-index:1000000; font-family:'Space Mono'; border:1px solid #D95486;";
        div.innerHTML = '🟢 Engine SVG PRO 7.7';
        document.body.appendChild(div);
    }

    updateStatus(msg, type) {
        const st = document.getElementById('stability-status');
        if (st) {
            const color = type === 'error' ? '#ff6b6b' : (type === 'warn' ? '#ffd93d' : '#6bff6b');
            st.innerHTML = `<span style="color:${color}">●</span> ${msg}`;
        }
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

    handleNoLogo() { this.addMessage("Modo 'Creación Pura' activo. Gemini 3.0 te guiará.", 'ai'); }
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

    handleAIResponseText(text) {
        if (!text) return;
        // Clean [[MATRIX:...]] from display text
        const cleanText = text.replace(/\[\[MATRIX:[\s\S]*?\]\]/g, '').trim();
        if (cleanText) this.addMessage(cleanText, 'ai');
    }

    handleExport() { this.generateBrandPDF(); }
}

window.onload = () => { window.app = new BrandApp(); };
