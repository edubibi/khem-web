import os
from PyPDF2 import PdfMerger

def merge_pdfs(source_dir, output_filename):
    merger = PdfMerger()
    
    # Get all PDF files
    files = [f for f in os.listdir(source_dir) if f.endswith('.pdf')]
    # Sort them to ensure correct order (01, 02, 03...)
    files.sort()
    
    if not files:
        print("No PDF files found to merge.")
        return

    print(f"Merging {len(files)} files...")
    for filename in files:
        filepath = os.path.join(source_dir, filename)
        print(f"Adding: {filename}")
        merger.append(filepath)

    merger.write(output_filename)
    merger.close()
    print(f"Successfully created: {output_filename}")

if __name__ == "__main__":
    # Source: The assets folder where the partial PDFs are
    source = r"c:\Users\Usuario\.gemini\antigravity\scratch\KHEM_WEB\libros\chokititos\assets"
    
    # Output: The main folder
    output = r"c:\Users\Usuario\.gemini\antigravity\scratch\KHEM_WEB\libros\chokititos\CHOQUITITO_LIBRO_COMPLETO.pdf"
    
    merge_pdfs(source, output)
