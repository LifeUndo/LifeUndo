#!/usr/bin/env python3
import zipfile
import os
import shutil

def create_release_028():
    """Create release 0.2.8"""
    release_dir = "releases/0.2.8"
    
    # Create XPI for Firefox
    firefox_dir = f"{release_dir}/LifeUndo-0.2.8-firefox"
    xpi_file = f"{release_dir}/LifeUndo-0.2.8-firefox.xpi"
    
    with zipfile.ZipFile(xpi_file, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(firefox_dir):
            for file in files:
                file_path = os.path.join(root, file)
                arc_path = os.path.relpath(file_path, firefox_dir).replace('\\', '/')
                zipf.write(file_path, arc_path)
                print(f"Added to XPI: {arc_path}")
    
    # Create ZIP for Chrome
    chrome_dir = f"{release_dir}/LifeUndo-0.2.8-chromium"
    zip_file = f"{release_dir}/LifeUndo-0.2.8-chromium.zip"
    
    with zipfile.ZipFile(zip_file, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(chrome_dir):
            for file in files:
                file_path = os.path.join(root, file)
                arc_path = os.path.relpath(file_path, chrome_dir).replace('\\', '/')
                zipf.write(file_path, arc_path)
                print(f"Added to ZIP: {arc_path}")
    
    print(f"\nRelease 0.2.8 created:")
    print(f"- {xpi_file}")
    print(f"- {zip_file}")

if __name__ == "__main__":
    create_release_028()
















