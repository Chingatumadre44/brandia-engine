/**
 * main.js - BrandIA Engine Integrated v12.1
 */

const API_PATH = '/api/brand';

document.addEventListener('DOMContentLoaded', () => {
    const btnGenerate = document.getElementById('btn-generate');
    const brandIdeaInput = document.getElementById('brand-idea');
    const resultsSection = document.getElementById('results-section');
    const conceptsGrid = document.getElementById('concepts-grid');
    const loader = btnGenerate.querySelector('.loader');
    const btnText = btnGenerate.querySelector('.btn-text');

    btnGenerate.addEventListener('click', async () => {
        const userInput = brandIdeaInput.value.trim();

        if (!userInput) {
            alert('Por favor, describe tu idea de marca primero.');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${API_PATH}/strategy`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: userInput })
            });

            if (!response.ok) throw new Error('Error al conectar con el servidor.');

            const data = await response.json();

            renderConcepts(data.concepts);

            resultsSection.classList.remove('hidden');
            resultsSection.scrollIntoView({ behavior: 'smooth' });

        } catch (error) {
            console.error('Error:', error);
            alert('Error al generar el branding. Asegúrate de que el backend esté activo.');
        } finally {
            setLoading(false);
        }
    });

    function setLoading(isLoading) {
        btnGenerate.disabled = isLoading;
        if (isLoading) {
            loader.classList.remove('hidden');
            btnText.textContent = 'Generando Estrategia...';
        } else {
            loader.classList.add('hidden');
            btnText.textContent = 'Generar Estrategia de Branding';
        }
    }

    function renderConcepts(concepts) {
        conceptsGrid.innerHTML = '';

        concepts.forEach(concept => {
            const card = document.createElement('div');
            card.className = 'concept-card';

            const personality = concept.personality || [];
            const tagsHTML = personality
                .map(p => `<span class="tag">${p}</span>`).join('');

            card.innerHTML = `
                <h3>${concept.name}</h3>
                <p class="desc">${concept.description}</p>
                
                <div class="card-info">
                    <span class="info-label">Público Objetivo</span>
                    <span class="info-val">${concept.targetAudience}</span>
                </div>

                <div class="card-info">
                    <span class="info-label">Tono de Voz</span>
                    <span class="info-val">${concept.tone}</span>
                </div>

                <div class="personality-tags">
                    ${tagsHTML}
                </div>

                <button class="btn-secondary btn-select" 
                        data-id="${concept.id}" 
                        data-name="${concept.name}" 
                        data-personality='${JSON.stringify(personality)}'>
                    Elegir este concepto
                </button>
            `;

            conceptsGrid.appendChild(card);
        });

        // Add event listeners for select buttons
        document.querySelectorAll('.btn-select').forEach(btn => {
            btn.addEventListener('click', (e) => handleSelectConcept(e.target));
        });
    }

    async function handleSelectConcept(btn) {
        const id = btn.getAttribute('data-id');
        const name = btn.getAttribute('data-name');
        const personality = JSON.parse(btn.getAttribute('data-personality'));

        // Disable all buttons during load
        document.querySelectorAll('.btn-select').forEach(b => b.disabled = true);
        btn.textContent = 'Generando Dirección Visual...';

        try {
            const response = await fetch(`${API_PATH}/art-direction`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, name, personality })
            });

            if (!response.ok) throw new Error('Error en Dirección de Arte');

            const data = await response.json();
            renderArtDirection(data.artDirection);

            const artSection = document.getElementById('art-direction-section');
            artSection.classList.remove('hidden');
            artSection.scrollIntoView({ behavior: 'smooth' });

        } catch (error) {
            console.error('Error AD:', error);
            alert('No se pudo generar la dirección de arte. Revisa el backend.');
        } finally {
            btn.textContent = 'Elegido';
            // We don't enable others to keep the flow focused on the selected one
        }
    }

    function renderArtDirection(ad) {
        const container = document.getElementById('art-direction-content');

        const colorsHTML = (ad.colorSystem.palette || []).map(hex => `
            <div class="color-item">
                <div class="swatch" style="background-color: ${hex}"></div>
                <span class="color-hex">${hex}</span>
            </div>
        `).join('');

        const keywordsHTML = (ad.styleKeywords || [])
            .map(k => `<span class="mood-tag">${k}</span>`).join('');

        container.innerHTML = `
            <div class="art-col">
                <h4>Sistema Visual</h4>
                <div class="card-info">
                    <span class="info-label">Paleta de Colores</span>
                    <div class="color-palette">${colorsHTML}</div>
                </div>

                <div class="card-info">
                    <span class="info-label">Tipografía Corporativa</span>
                    <div class="font-preview">
                        <div class="heading" style="font-family: '${ad.typography.primaryFont}', sans-serif">
                            ${ad.typography.primaryFont} (Titulares)
                        </div>
                        <div class="body" style="font-family: '${ad.typography.secondaryFont}', sans-serif">
                            ${ad.typography.secondaryFont} (Cuerpo de texto)
                        </div>
                    </div>
                </div>

                <div class="card-info">
                    <span class="info-label">Estilo de Iconografía</span>
                    <span class="info-val">${ad.iconography.style} - Trazo ${ad.iconography.stroke}</span>
                </div>
            </div>

            <div class="art-col">
                <h4>Mood & Sensación</h4>
                <div class="card-info">
                    <span class="info-label">Mood General</span>
                    <span class="info-val">${ad.moodDescription}</span>
                </div>

                <div class="card-info">
                    <span class="info-label">Concepto Visual</span>
                    <p class="desc">${ad.visualConcept}</p>
                </div>

                <div class="card-info">
                    <span class="info-label">Keywords del Estilo</span>
                    <div class="mood-tags">${keywordsHTML}</div>
                </div>
            </div>
        `;
    }
});
