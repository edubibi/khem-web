import shutil
import os

def make_commercial_zip(source_dir, output_filename):
    base_name = os.path.splitext(output_filename)[0]
    # Create the zip file
    shutil.make_archive(base_name, 'zip', source_dir)
    print(f"Created Commercial ZIP: {output_filename}")

if __name__ == "__main__":
    source = r"c:\Users\Usuario\.gemini\antigravity\scratch\KHEM_WEB\libros\chokititos"
    output = r"c:\Users\Usuario\.gemini\antigravity\scratch\KHEM_WEB\libros\chokititos\CHOQUITITOS_EDICION_DIGITAL"
    make_commercial_zip(source, output)
