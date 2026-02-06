/**
 * main.js - BrandIA Engine v12
 * Lógica del frontend para interactuar con la API de Estrategia.
 */

const API_BASE_URL = 'http://localhost:3000/api/brand';

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

        // Estado de carga
        setLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/strategy`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ prompt: userInput })
            });

            if (!response.ok) {
                throw new Error('Error al conectar con el servidor IA.');
            }

            const data = await response.json();

            // Renderizamos los resultados
            renderConcepts(data.concepts);

            // Mostramos la sección de resultados
            resultsSection.classList.remove('hidden');
            resultsSection.scrollIntoView({ behavior: 'smooth' });

        } catch (error) {
            console.error('Error:', error);
            alert('Oops! Hubo un problema al generar el branding. Asegúrate de que el backend esté corriendo.');
        } finally {
            setLoading(false);
        }
    });

    function setLoading(isLoading) {
        if (isLoading) {
            btnGenerate.disabled = true;
            loader.classList.remove('hidden');
            btnText.textContent = 'Analizando marca...';
        } else {
            btnGenerate.disabled = false;
            loader.classList.add('hidden');
            btnText.textContent = 'Generar Branding';
        }
    }

    function renderConcepts(concepts) {
        conceptsGrid.innerHTML = '';

        concepts.forEach(concept => {
            const card = document.createElement('div');
            card.className = 'concept-card';

            const tagsHTML = concept.personality
                ? concept.personality.map(p => `<span class="tag">${p}</span>`).join('')
                : '';

            card.innerHTML = `
                <h3>${concept.name}</h3>
                <p class="desc">${concept.description}</p>
                <div class="personality-tags">
                    ${tagsHTML}
                </div>
            `;

            conceptsGrid.appendChild(card);
        });
    }
});
