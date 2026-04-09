document.addEventListener('DOMContentLoaded', () => {
    console.log("KHEM Initialized. Alchemy active.");

    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    // Observe text and cards
    const elementsToAnimate = document.querySelectorAll('.text-block p, .card, .section-title, .soul-text');
    elementsToAnimate.forEach(el => {
        observer.observe(el);
    });

    // --- LOGICA MODAL MATRIZ ---
    const modal = document.getElementById('matrix-modal');
    const modalImg = document.getElementById('modal-img');
    const modalTitle = document.getElementById('modal-title');
    const closeBtn = document.querySelector('.modal-close');
    const matrixItems = document.querySelectorAll('.matrix-item');

    matrixItems.forEach(item => {
        item.addEventListener('click', () => {
            const type = item.getAttribute('data-type') || 'image';
            const title = item.getAttribute('data-title');
            
            modalTitle.textContent = title;
            const modalBody = document.querySelector('.modal-content');
            
            // Limpiar TODO el contenido previo (excepto el título)
            const mediaSelectors = 'img, .links-container, .img-collection-wrapper, .img-wrapper, .proof-label';
            modalBody.querySelectorAll(mediaSelectors).forEach(el => el.remove());

            if (type === 'links') {
                const linksContainer = document.createElement('div');
                linksContainer.className = 'links-container';
                linksContainer.innerHTML = `
                    <div class="framed-links">
                        <a href="https://dudeduart.es" target="_blank" class="matrix-link">DUDEDUART.ES <i class="ph ph-arrow-square-out"></i></a>
                        <a href="https://khem.es" target="_blank" class="matrix-link">KHEM.ES <i class="ph ph-arrow-square-out"></i></a>
                        <a href="https://trbandmusic.es" target="_blank" class="matrix-link">TRBANDMUSIC.ES <i class="ph ph-arrow-square-out"></i></a>
                        <a href="https://lamesadesalyolivo.es" target="_blank" class="matrix-link">LA MESA DE SAL Y OLIVO <i class="ph ph-arrow-square-out"></i></a>
                        <a href="https://jjalmela.es" target="_blank" class="matrix-link">JJALMELA.ES <i class="ph ph-arrow-square-out"></i></a>
                    </div>
                `;
                modalBody.appendChild(linksContainer);
            } else {
                const imgPaths = item.getAttribute('data-images').split(',');
                const wrapper = document.createElement('div');
                wrapper.className = 'img-collection-wrapper';
                
                imgPaths.forEach(path => {
                    const imgContainer = document.createElement('div');
                    imgContainer.className = 'img-wrapper';
                    
                    const img = document.createElement('img');
                    img.src = path.trim();
                    img.alt = "Prueba de Veracidad Real";
                    
                    const label = document.createElement('div');
                    label.className = 'proof-label';
                    label.textContent = 'VORTEX - REAL PROOF';
                    
                    imgContainer.appendChild(img);
                    imgContainer.appendChild(label);
                    wrapper.appendChild(imgContainer);
                });
                
                modalBody.appendChild(wrapper);
            }

            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    });

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
});
