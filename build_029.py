#!/usr/bin/env python3
import zipfile
import os

def create_release_029():
    """Create release 0.2.9"""
    release_dir = "releases/0.2.9"
    
    # Create XPI for Firefox
    firefox_dir = f"{release_dir}/LifeUndo-0.2.9-firefox"
    xpi_file = f"{release_dir}/LifeUndo-0.2.9-firefox.xpi"
    
    # Copy Firefox files
    if os.path.exists("extension_firefox"):
        import shutil
        if os.path.exists(firefox_dir):
            shutil.rmtree(firefox_dir)
        shutil.copytree("extension_firefox", firefox_dir)
        print(f"Copied Firefox files to {firefox_dir}")
    
    with zipfile.ZipFile(xpi_file, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(firefox_dir):
            for file in files:
                file_path = os.path.join(root, file)
                arc_path = os.path.relpath(file_path, firefox_dir).replace('\\', '/')
                zipf.write(file_path, arc_path)
                print(f"Added to XPI: {arc_path}")
    
    # Create ZIP for Chrome
    chrome_dir = f"{release_dir}/LifeUndo-0.2.9-chromium"
    zip_file = f"{release_dir}/LifeUndo-0.2.9-chromium.zip"
    
    # Copy Chrome files
    if os.path.exists("extension"):
        import shutil
        if os.path.exists(chrome_dir):
            shutil.rmtree(chrome_dir)
        shutil.copytree("extension", chrome_dir)
        print(f"Copied Chrome files to {chrome_dir}")
    
    with zipfile.ZipFile(zip_file, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(chrome_dir):
            for file in files:
                file_path = os.path.join(root, file)
                arc_path = os.path.relpath(file_path, chrome_dir).replace('\\', '/')
                zipf.write(file_path, arc_path)
                print(f"Added to ZIP: {arc_path}")
    
    print(f"\nRelease 0.2.9 created:")
    print(f"- {xpi_file}")
    print(f"- {zip_file}")

if __name__ == "__main__":
    create_release_029()










