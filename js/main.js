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
            const imgPath = item.getAttribute('data-image');
            const title = item.getAttribute('data-title');
            
            modalImg.src = imgPath;
            modalTitle.textContent = title;
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Stop scrolling
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
