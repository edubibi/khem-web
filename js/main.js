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
});
