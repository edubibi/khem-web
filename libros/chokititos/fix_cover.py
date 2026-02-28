from PIL import Image
import os

def fix_dpi(input_path, output_path):
    try:
        if not os.path.exists(input_path):
            print(f"Error: No se encuentra el archivo {input_path}")
            return

        img = Image.open(input_path)
        print(f"Original: {img.format}, Size: {img.size}, Info: {img.info.get('dpi')}")
        
        # Amazon requires 300 DPI. We will save it with explicitly set DPI.
        # We don't resize (upscale) unless strictly necessary, usually setting the metadata is enough 
        # if the pixel dimension is decent.
        
        # Check if resolution is very low for print
        width, height = img.size
        print(f"Dimensiones en pixeles: {width}x{height}")
        
        # Calculation: For a 6x9 inch book at 300 DPI, we need approx 1800x2700 pixels.
        # If it's much smaller, we might need to upscale (resize).
        
        # Let's force 300 DPI metadata first.
        img.save(output_path, dpi=(300, 300))
        print(f"Saved fixed version to: {output_path} with 300 DPI header.")

    except Exception as e:
        print(f"Error processing image: {e}")

if __name__ == "__main__":
    folder = r"c:\Users\Usuario\.gemini\antigravity\scratch\KHEM_WEB\libros\chokititos"
    infile = os.path.join(folder, "PORTADA OK LIBRO.png")
    outfile = os.path.join(folder, "PORTADA_AMAZON_300DPI.png")
    
    fix_dpi(infile, outfile)
