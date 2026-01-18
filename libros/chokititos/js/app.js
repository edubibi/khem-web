/**
 * Main Application Logic
 */

let pageFlip = null;

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const uploadInput = document.getElementById('pdf-upload');
    const zoomInBtn = document.getElementById('btn-zoom-in');
    const zoomOutBtn = document.getElementById('btn-zoom-out');

    // Event Listeners
    if (uploadInput) uploadInput.addEventListener('change', handleFileUpload);

    const btnReset = document.getElementById('btn-reset');
    if (btnReset) btnReset.addEventListener('click', resetApp);

    const btnPrev = document.getElementById('btn-prev');
    if (btnPrev) btnPrev.addEventListener('click', () => pageFlip?.flipPrev());

    const btnNext = document.getElementById('btn-next');
    if (btnNext) btnNext.addEventListener('click', () => pageFlip?.flipNext());

    if (zoomInBtn) zoomInBtn.addEventListener('click', zoomIn);
    if (zoomOutBtn) zoomOutBtn.addEventListener('click', zoomOut);

    // Side Navigation Arrows
    const navPrev = document.getElementById('nav-arrow-prev');
    const navNext = document.getElementById('nav-arrow-next');
    if (navPrev) navPrev.addEventListener('click', () => pageFlip?.flipPrev());
    if (navNext) navNext.addEventListener('click', () => pageFlip?.flipNext());

    // Check for Auto-Load Data
    if (window.BOOK_DATA && window.BOOK_DATA.length > 0) {
        console.log("Auto-loading book data...");
        handleAutoLoad(window.BOOK_DATA);
    }
});

async function handleAutoLoad(base64Files) {
    // UI Refs
    const uploadScreen = document.getElementById('upload-screen');
    const loadingScreen = document.getElementById('loading-screen');
    const loadingText = document.getElementById('loading-text');

    // Switch to Loading UI
    if (uploadScreen) uploadScreen.classList.add('hidden');
    if (loadingScreen) loadingScreen.classList.remove('hidden');

    try {
        let allCanvases = [];

        for (let i = 0; i < base64Files.length; i++) {
            const base64Str = base64Files[i];
            const fileNum = i + 1;
            const totalFiles = base64Files.length;

            if (loadingText) loadingText.textContent = `Procesando archivo incrustado ${fileNum} de ${totalFiles}...`;

            // Convert Base64 Data URI to Blob
            const res = await fetch(base64Str);
            const blob = await res.blob();
            // Create a fake File object (PDF.js just needs a file/blob)
            const file = new File([blob], `book_part_${fileNum}.pdf`, { type: 'application/pdf' });

            // Process PDF
            const canvases = await PdfProcessor.processFile(file, (current, total) => {
                if (loadingText) loadingText.textContent = `Archivo ${fileNum}/${totalFiles}: Renderizando página ${current}/${total}...`;
            });

            allCanvases = allCanvases.concat(canvases);
        }

        // Initialize Book
        initBook(allCanvases);

    } catch (error) {
        console.error("Auto-load error:", error);
        alert('Error cargando el libro regalo: ' + error.message);
        // Fallback to upload screen
        const uploadScreen = document.getElementById('upload-screen');
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) loadingScreen.classList.add('hidden');
        if (uploadScreen) uploadScreen.classList.remove('hidden');
    }
}

function getZoomTarget() {
    // Try to find the wrapper created by StPageFlip
    let target = document.querySelector('.stf__wrapper');
    // If not found, use our container
    if (!target) target = document.getElementById('flipbook-container');
    return target;
}

function zoomIn() {
    const target = getZoomTarget();
    if (target) {
        target.style.transition = 'transform 0.4s ease';
        target.style.transform = 'scale(1.4)'; // Zoom to 140%
        target.style.cursor = 'grab';
        console.log("Zoom In executed");
    } else {
        console.warn("No zoom target found");
    }
}

function zoomOut() {
    const target = getZoomTarget();
    if (target) {
        target.style.transition = 'transform 0.4s ease';
        target.style.transform = 'scale(1.0)'; // Reset
        console.log("Zoom Out executed");
    }
}

// Handle File Upload
// Handle File Upload
async function handleFileUpload(e) {
    // 1. Get all files
    let files = Array.from(e.target.files);
    if (!files || files.length === 0) return;

    // 2. Sort them naturally by name (so "1.pdf", "2.pdf", "10.pdf" are ordered correctly)
    files.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }));

    // 3. Filter only PDFs
    const pdfFiles = files.filter(f => f.type === 'application/pdf');
    if (pdfFiles.length === 0) {
        alert('Por favor selecciona archivos PDF válidos.');
        return;
    }

    // UI Refs
    const uploadScreen = document.getElementById('upload-screen');
    const loadingScreen = document.getElementById('loading-screen');
    const loadingText = document.getElementById('loading-text');

    // Switch to Loading UI
    if (uploadScreen) uploadScreen.classList.add('hidden');
    if (loadingScreen) loadingScreen.classList.remove('hidden');

    try {
        let allCanvases = [];

        // Process each PDF sequentially in strict order
        for (let i = 0; i < pdfFiles.length; i++) {
            const file = pdfFiles[i];
            const fileNum = i + 1;
            const totalFiles = pdfFiles.length;

            if (loadingText) loadingText.textContent = `Procesando archivo ${fileNum} de ${totalFiles}: ${file.name}...`;

            // Process PDF
            const canvases = await PdfProcessor.processFile(file, (current, total) => {
                if (loadingText) loadingText.textContent = `Archivo ${fileNum}/${totalFiles} (${file.name}): Renderizando página ${current}/${total}...`;
            });

            allCanvases = allCanvases.concat(canvases);
        }

        // Initialize Book
        initBook(allCanvases);

    } catch (error) {
        console.error(error);
        alert('Error al procesar los PDFs: ' + error.message);
        resetApp();
    }
}

// Initialize PageFlip
function initBook(canvases) {
    const loadingScreen = document.getElementById('loading-screen');
    const bookViewer = document.getElementById('book-viewer');
    const bookContainer = document.getElementById('flipbook-container');

    if (loadingScreen) loadingScreen.classList.add('hidden');
    if (bookViewer) bookViewer.classList.remove('hidden');

    // Clean container
    if (bookContainer) bookContainer.innerHTML = '';

    // Append canvases to container
    canvases.forEach((canvas, index) => {
        // Create Wrapper
        const wrapper = document.createElement('div');
        wrapper.classList.add('my-page');
        wrapper.classList.add('page-wrapper');

        // Setup Canvas
        canvas.classList.add('page-canvas');
        wrapper.appendChild(canvas);

        // Setup Bookmark Sticker
        const bookmark = document.createElement('div');
        bookmark.classList.add('bookmark-flag');
        bookmark.title = "Haz clic para marcar/desmarcar";

        // Trigger area (optional, or just click top right)
        const trigger = document.createElement('div');
        trigger.classList.add('bookmark-trigger');
        trigger.title = "Marcar página";

        // Load state
        const bookId = "current_book"; // Simple persistence key
        const savedMarks = JSON.parse(localStorage.getItem(bookId) || '[]');
        if (savedMarks.includes(index)) {
            bookmark.classList.add('active');
        }

        // Click Handler
        const toggleMark = (e) => {
            e.stopPropagation(); // Don't flip page
            bookmark.classList.toggle('active');

            // Save state
            let marks = JSON.parse(localStorage.getItem(bookId) || '[]');
            if (bookmark.classList.contains('active')) {
                if (!marks.includes(index)) marks.push(index);
            } else {
                marks = marks.filter(i => i !== index);
            }
            localStorage.setItem(bookId, JSON.stringify(marks));
        };

        bookmark.onclick = toggleMark;
        trigger.onclick = toggleMark; // Allow clicking the invisible corner to toggle

        wrapper.appendChild(trigger);
        wrapper.appendChild(bookmark);

        if (bookContainer) bookContainer.appendChild(wrapper);
    });

    if (!canvases.length) return;

    // Determine dimensions from the first page
    const baseWidth = canvases[0].width;
    const baseHeight = canvases[0].height;

    // --- CRITICAL FIX FOR SIZING ---
    // User wants it small initially (overview) then Zoomable.
    // We set max height to ~60% of viewport.
    const maxH = window.innerHeight * 0.6;

    // CRITICAL: The book opens to TWO pages. 
    // We want total width < 70% of screen to avoid any edge sticking. 
    // So single page max width = 35% of screen.
    const maxSinglePageW = (window.innerWidth * 0.7) / 2;

    const settings = {
        width: baseWidth,
        height: baseHeight,

        // Responsive mode with strict limits per SINGLE PAGE
        size: 'stretch',
        minWidth: 200,
        maxWidth: maxSinglePageW,
        minHeight: 200,
        maxHeight: maxH,

        showCover: true,
        maxShadowOpacity: 0.5,
        // Disable mouse events to prevent "magnetic" page corner effect
        useMouseEvents: false
    };

    try {
        if (bookContainer) {
            pageFlip = new St.PageFlip(bookContainer, settings);

            pageFlip.loadFromHTML(document.querySelectorAll('.my-page'));

            // Update UI on flip
            // Update UI on flip
            pageFlip.on('flip', (e) => {
                const pageInput = document.getElementById('page-nav-input');
                if (pageInput) pageInput.value = e.data + 1;
            });

            // Set total pages
            const totalSpan = document.getElementById('page-total');
            if (totalSpan) totalSpan.innerText = `de ${pageFlip.getPageCount()}`;

            // Initialize input max
            const pageInput = document.getElementById('page-nav-input');
            if (pageInput) {
                pageInput.max = pageFlip.getPageCount();
                pageInput.value = 1;
            }

            // Setup Go Button
            const btnGo = document.getElementById('btn-go-page');
            // pageInput is already defined above


            if (btnGo && pageInput) {
                const goToPage = () => {
                    let p = parseInt(pageInput.value);
                    if (p >= 1 && p <= pageFlip.getPageCount()) {
                        pageFlip.flip(p - 1);
                    } else {
                        alert(`Página ${p} fuera de rango. El libro tiene ${pageFlip.getPageCount()} páginas.`);
                    }
                };

                btnGo.onclick = goToPage;

                // Add Enter key support (Robust)
                pageInput.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault(); // Stop any form submit
                        goToPage();
                        pageInput.blur();
                    }
                });
            }
        }

    } catch (e) {
        console.error("Error init PageFlip:", e);
    }
}

function resetApp() {
    const bookViewer = document.getElementById('book-viewer');
    const uploadScreen = document.getElementById('upload-screen');
    const uploadInput = document.getElementById('pdf-upload');

    if (pageFlip) {
        pageFlip.destroy();
        pageFlip = null;
    }
    if (bookViewer) bookViewer.classList.add('hidden');
    if (uploadScreen) uploadScreen.classList.remove('hidden');
    if (uploadInput) uploadInput.value = '';

    // Reset zoom
    const target = getZoomTarget();
    if (target) target.style.transform = 'scale(1)';
}
