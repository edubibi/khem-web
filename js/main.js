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
            
            // Limpiar contenido previo (excepto el título)
            const existingMedia = modalBody.querySelector('img, .links-container');
            if (existingMedia) existingMedia.remove();

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
                const imgPath = item.getAttribute('data-image');
                const img = document.createElement('img');
                img.id = 'modal-img';
                img.src = imgPath;
                img.alt = "Prueba de Veracidad";
                
                // Overlay "PROOF OF WORK" label
                const label = document.createElement('div');
                label.className = 'proof-label';
                label.textContent = 'VORTEX - VISUAL PROOF (INTERNAL PREVIEW)';
                
                const wrapper = document.createElement('div');
                wrapper.className = 'img-wrapper';
                wrapper.appendChild(img);
                wrapper.appendChild(label);
                
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
