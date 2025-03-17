import os
from PIL import Image

def rename_images_in_folder(folder_path):
    hf_count = 1  # Zähler für Hochformat-Bilder
    qf_count = 1  # Zähler für Querformat-Bilder
    
    for filename in sorted(os.listdir(folder_path)):
        if filename.startswith("image") and filename.endswith(".webp"):  # Nur passende Dateien auswählen
            file_path = os.path.join(folder_path, filename)
            try:
                with Image.open(file_path) as img:
                    width, height = img.size
                
                # Bestimmen, ob Hochformat oder Querformat
                if height > width:
                    new_name = f"{hf_count}hf.webp"
                    hf_count += 1
                else:
                    new_name = f"{qf_count}qf.webp"
                    qf_count += 1
                
                new_path = os.path.join(folder_path, new_name)
                os.rename(file_path, new_path)
                print(f"{filename} -> {new_name}")
            
            except Exception as e:
                print(f"Fehler bei {filename}: {e}")

# Beispiel: Pfad zum Ordner angeben
folder_path = "assets/gallery"  # Hier den tatsächlichen Ordnerpfad einfügen
rename_images_in_folder(folder_path)