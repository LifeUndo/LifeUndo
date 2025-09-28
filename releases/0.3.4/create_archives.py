#!/usr/bin/env python3
import zipfile
import os
import shutil

def create_zip_archive(source_dir, zip_path):
    """Create a zip archive from a directory"""
    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(source_dir):
            for file in files:
                file_path = os.path.join(root, file)
                arcname = os.path.relpath(file_path, source_dir)
                zipf.write(file_path, arcname)
    print(f"Created: {zip_path}")

def create_xpi_archive(source_dir, xpi_path):
    """Create an XPI archive (which is just a ZIP) from a directory"""
    create_zip_archive(source_dir, xpi_path)
    print(f"Created: {xpi_path}")

if __name__ == "__main__":
    # Create Chrome/Chromium zip
    if os.path.exists("LifeUndo-0.3.4-chromium"):
        create_zip_archive("LifeUndo-0.3.4-chromium", "LifeUndo-0.3.4-chromium.zip")
    else:
        print("Chrome directory not found!")
    
    # Create Firefox XPI
    if os.path.exists("LifeUndo-0.3.4-firefox"):
        create_xpi_archive("LifeUndo-0.3.4-firefox", "LifeUndo-0.3.4-firefox.xpi")
    else:
        print("Firefox directory not found!")
    
    print("Archive creation completed!")






















