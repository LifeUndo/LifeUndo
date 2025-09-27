#!/usr/bin/env python3
import os
import zipfile
import shutil
from pathlib import Path

def create_xpi():
    """Create Firefox XPI with correct POSIX paths"""
    xpi_path = "releases/0.3.2/LifeUndo-0.3.2-firefox.xpi"
    
    # Ensure directory exists
    os.makedirs("releases/0.3.2", exist_ok=True)
    
    with zipfile.ZipFile(xpi_path, 'w', zipfile.ZIP_DEFLATED) as zf:
        # Add all files from extension_firefox directory
        for root, dirs, files in os.walk("extension_firefox"):
            for file in files:
                file_path = os.path.join(root, file)
                # Use POSIX path (forward slashes) in archive, remove extension_firefox/ prefix
                arc_path = file_path.replace("extension_firefox\\", "").replace("extension_firefox/", "").replace("\\", "/")
                zf.write(file_path, arc_path)
                print(f"Added: {arc_path}")
    
    print(f"\n✅ Firefox XPI created: {xpi_path}")
    return xpi_path

def create_chrome_zip():
    """Create Chrome ZIP"""
    zip_path = "releases/0.3.2/LifeUndo-0.3.2-chromium.zip"
    
    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zf:
        # Add all files from extension directory
        for root, dirs, files in os.walk("extension"):
            for file in files:
                file_path = os.path.join(root, file)
                arc_path = file_path.replace("extension/", "").replace("\\", "/")
                zf.write(file_path, arc_path)
                print(f"Added: {arc_path}")
    
    print(f"\n✅ Chrome ZIP created: {zip_path}")
    return zip_path

def verify_xpi(xpi_path):
    """Verify XPI contents"""
    with zipfile.ZipFile(xpi_path, 'r') as zf:
        files = zf.namelist()
        print(f"\n📦 XPI contains {len(files)} files:")
        for f in sorted(files):
            print(f"  {f}")
        
        # Check critical files
        critical = ['manifest.json', 'popup.js', 'popup.html', 'background.js']
        missing = [f for f in critical if f not in files]
        if missing:
            print(f"❌ Missing critical files: {missing}")
        else:
            print("✅ All critical files present")

if __name__ == "__main__":
    print("🚀 Building LifeUndo v0.3.2...")
    
    # Create releases directory
    os.makedirs("releases/0.3.2", exist_ok=True)
    
    # Build Firefox XPI
    xpi_path = create_xpi()
    verify_xpi(xpi_path)
    
    # Build Chrome ZIP
    zip_path = create_chrome_zip()
    
    print(f"\n🎉 Build complete!")
    print(f"Firefox: {xpi_path}")
    print(f"Chrome:  {zip_path}")
