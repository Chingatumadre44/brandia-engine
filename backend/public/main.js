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

            const tagsHTML = (concept.personality || [])
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
            `;

            conceptsGrid.appendChild(card);
        });
    }
});
