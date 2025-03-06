import os
import multiprocessing
from PIL import Image

def compress_webp_image(input_folder, output_folder, filename, quality=80):
    """
    Komprimiert ein einzelnes WEBP-Bild und speichert es im Zielordner.
    """
    input_path = os.path.join(input_folder, filename)
    output_path = os.path.join(output_folder, filename)
    
    with Image.open(input_path) as img:
        # Bild komprimieren und mit demselben Dateinamen im Zielordner speichern
        img.save(output_path, "webp", quality=quality)

def compress_webp_images(input_folder, output_folder, quality=80):
    """
    Findet alle WEBP-Dateien im Quellordner und komprimiert sie mithilfe
    mehrerer Kerne (CPUs) im Zielordner.
    """
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)
    
    # Alle WEBP-Dateien im Quellordner sammeln
    webp_files = [f for f in os.listdir(input_folder) if f.lower().endswith(".webp")]
    
    # Vorbereitung der Argumente für Pool-Starmap
    tasks = [(input_folder, output_folder, f, quality) for f in webp_files]

    # Multiprocessing-Pool erstellen (Standard: Anzahl CPU-Kerne)
    with multiprocessing.Pool() as pool:
        pool.starmap(compress_webp_image, tasks)

    print(f"Alle {len(webp_files)} WEBP-Dateien wurden komprimiert und in '{output_folder}' gespeichert.")

if __name__ == "__main__":
    # Ordnerpfade anpassen
    input_folder_path = r"original_Bilder/img"
    output_folder_path = r"assets/img"

    # Qualitätsfaktor (1-100, je niedriger desto höhere Kompression)
    quality_value = 65
    
    compress_webp_images(input_folder_path, output_folder_path, quality=quality_value)
