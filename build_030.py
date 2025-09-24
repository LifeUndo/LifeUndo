#!/usr/bin/env python3
import os
import shutil
import zipfile
import json
from pathlib import Path

def create_release():
    version = "0.3.0"
    release_dir = f"releases/{version}"
    
    # Создаем директорию релиза
    os.makedirs(release_dir, exist_ok=True)
    
    # Firefox XPI
    print("Creating Firefox XPI...")
    firefox_dir = f"{release_dir}/LifeUndo-{version}-firefox"
    if os.path.exists(firefox_dir):
        shutil.rmtree(firefox_dir)
    shutil.copytree("extension_firefox", firefox_dir)
    
    # Создаем XPI
    xpi_path = f"{release_dir}/LifeUndo-{version}-firefox.xpi"
    with zipfile.ZipFile(xpi_path, 'w', zipfile.ZIP_DEFLATED) as zf:
        for root, dirs, files in os.walk(firefox_dir):
            for file in files:
                file_path = os.path.join(root, file)
                arc_path = os.path.relpath(file_path, firefox_dir).replace('\\', '/')
                zf.write(file_path, arc_path)
                print(f"Added to XPI: {arc_path}")
    
    # Chrome ZIP
    print("\nCreating Chrome ZIP...")
    chrome_dir = f"{release_dir}/LifeUndo-{version}-chromium"
    if os.path.exists(chrome_dir):
        shutil.rmtree(chrome_dir)
    shutil.copytree("extension", chrome_dir)
    
    # Создаем ZIP
    zip_path = f"{release_dir}/LifeUndo-{version}-chromium.zip"
    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zf:
        for root, dirs, files in os.walk(chrome_dir):
            for file in files:
                file_path = os.path.join(root, file)
                arc_path = os.path.relpath(file_path, chrome_dir).replace('\\', '/')
                zf.write(file_path, arc_path)
                print(f"Added to ZIP: {arc_path}")
    
    # Проверяем содержимое XPI
    print(f"\nVerifying XPI contents...")
    with zipfile.ZipFile(xpi_path, 'r') as zf:
        files = zf.namelist()
        print(f"Files in XPI: {len(files)}")
        print(f"manifest.json present: {'manifest.json' in files}")
        print(f"_locales present: {any('_locales' in f for f in files)}")
    
    # Создаем README
    readme_path = f"{release_dir}/README.txt"
    with open(readme_path, 'w', encoding='utf-8') as f:
        f.write(f"""LifeUndo v{version} Release

Files:
- LifeUndo-{version}-firefox.xpi (Firefox extension)
- LifeUndo-{version}-chromium.zip (Chrome/Edge extension)

Changes in v{version}:
- Fixed VIP import with inline verifier (no dynamic imports)
- Clear feedback: Importing / VIP activated / error messages
- Full localization including "What's New" modal
- Upgrade to Pro stub modal
- Support links; Trial/PRO badges hidden on VIP

Installation:
1. Firefox: Load the .xpi file as temporary add-on in about:debugging
2. Chrome: Load the .zip file as unpacked extension in chrome://extensions

VIP License Import:
- Click "Activate VIP" button
- Select your .lifelic file
- Should show "VIP activated ✅" status
""")
    
    print(f"\nRelease {version} created:")
    print(f"- {xpi_path}")
    print(f"- {zip_path}")
    print(f"- {readme_path}")

if __name__ == "__main__":
    create_release()
















