import os
import re

def rename_images(folder_path):
    pattern = re.compile(r'^image(\d+)\.webp$')

    # Alle passenden Dateien sammeln
    files = []
    for filename in os.listdir(folder_path):
        match = pattern.match(filename)
        if match:
            number = int(match.group(1))
            files.append((number, filename))
    
    # Dateien nach ihrer ursprünglichen Nummer sortieren
    files.sort(key=lambda x: x[0])

    # Fortlaufende Neubenennung
    counter = 1
    for (original_number, old_filename) in files:
        new_filename = f"image{counter}.webp"
        old_path = os.path.join(folder_path, old_filename)
        new_path = os.path.join(folder_path, new_filename)

        os.rename(old_path, new_path)
        print(f"Umbenannt: {old_filename} -> {new_filename}")
        counter += 1

# Ordnerpfad anpassen und Funktion aufrufen
ordner = r"assets/gallery"
rename_images(ordner)
