import shutil
import os

def make_zip(source_dir, output_filename):
    base_name = os.path.splitext(output_filename)[0]
    shutil.make_archive(base_name, 'zip', source_dir)
    print(f"Created {output_filename}")

if __name__ == "__main__":
    source = r"c:\Users\Usuario\.gemini\antigravity\scratch\KHEM_WEB\libros\chokititos"
    # Saving it to a generic easy-to-find location, or the same folder
    output = r"c:\Users\Usuario\.gemini\antigravity\scratch\KHEM_WEB\libros\chokititos\REGISTRO_CHOQUITITOS"
    make_zip(source, output)
