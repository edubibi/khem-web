/**
 * PDF Processing Logic
 * Uses pdf.js (loaded in global scope) to render PDF pages to Canvases
 */

const PdfProcessor = {
    /**
     * Reads a File object and renders its pages to Canvas elements
     * @param {File} file - The uploaded PDF file
     * @param {Function} onProgress - Callback for progress updates (current, total)
     * @returns {Promise<Array<HTMLCanvasElement>>} - Array of rendered canvases
     */
    async processFile(file, onProgress) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = async function (e) {
                try {
                    const typedarray = new Uint8Array(e.target.result);

                    // Load the PDF document
                    const loadingTask = pdfjsLib.getDocument(typedarray);
                    const pdf = await loadingTask.promise;

                    const totalPages = pdf.numPages;
                    const canvases = [];

                    // Determine scale based on first page to keep consistent size?
                    // For high quality, we want a good resolution (e.g. scale 1.5 or 2)
                    // But we might need to adjust this dynamically if pages vary wildly.
                    // For now, fixed scale.
                    // Increased scale to 2.5 to ensure crisp text when zooming in.
                    const scale = 2.5;

                    for (let i = 1; i <= totalPages; i++) {
                        if (onProgress) onProgress(i, totalPages);

                        const page = await pdf.getPage(i);
                        const viewport = page.getViewport({ scale: scale });

                        // Create Canvas
                        const canvas = document.createElement('canvas');
                        const context = canvas.getContext('2d');
                        canvas.height = viewport.height;
                        canvas.width = viewport.width;

                        // Render context
                        const renderContext = {
                            canvasContext: context,
                            viewport: viewport
                        };


                        await page.render(renderContext).promise;

                        // --- AUTO-PAGE NUMBERING ---
                        // Draw page number at the bottom center
                        // Reduced size per user feedback (was 4%, now 1.8%)
                        const fontSize = Math.floor(viewport.height * 0.018);
                        context.font = `bold ${fontSize}px Arial`;
                        context.fillStyle = "#333333";
                        context.textAlign = "center";
                        context.textBaseline = "bottom";
                        // Draw at bottom center, with padding relative to height
                        context.fillText(i.toString(), viewport.width / 2, viewport.height - (viewport.height * 0.015));

                        // Add class for styling if needed, but PageFlip handles mostly
                        canvas.classList.add('page-canvas');
                        canvases.push(canvas);
                    }

                    resolve(canvases);

                } catch (error) {
                    reject(error);
                }
            };

            reader.onerror = reject;
            reader.readAsArrayBuffer(file);
        });
    }
};
