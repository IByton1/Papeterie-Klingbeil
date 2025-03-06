import os
import concurrent.futures
from pillow_heif import open_heif
from PIL import Image

def convert_file(input_path, output_path, quality):
    """Konvertiert eine einzelne HEIC-Datei zu WEBP."""
    try:
        heif_image = open_heif(input_path)
        image = Image.frombytes(
            heif_image.mode, 
            heif_image.size, 
            heif_image.data, 
            "raw", 
            heif_image.mode
        )

        image.save(output_path, "WEBP", quality=quality)
        print(f"✅ {os.path.basename(input_path)} → {output_path}")
    except Exception as e:
        print(f"❌ Fehler bei {os.path.basename(input_path)}: {e}")

def convert_heic_to_webp_multithreaded(input_folder, output_folder, quality=90, max_threads=8):
    """Konvertiert alle HEIC-Dateien aus input_folder zu WEBP mit Multithreading."""
    os.makedirs(output_folder, exist_ok=True)

    heic_files = sorted([f for f in os.listdir(input_folder) if f.lower().endswith(".heic")])
    input_paths = [os.path.join(input_folder, f) for f in heic_files]
    output_paths = [os.path.join(output_folder, f"image{index+1}.webp") for index in range(len(heic_files))]

    # Multithreading für schnellere Verarbeitung
    with concurrent.futures.ThreadPoolExecutor(max_threads) as executor:
        executor.map(convert_file, input_paths, output_paths, [quality] * len(heic_files))

# Beispielaufruf:
input_folder = "assets/heic"  # Ändern!
output_folder = "assets/gallery"  # Ändern!

convert_heic_to_webp_multithreaded(input_folder, output_folder)
