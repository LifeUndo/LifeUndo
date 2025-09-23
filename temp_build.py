#!/usr/bin/env python3
import zipfile
import os

print("Building LifeUndo v0.3.2...")

# Create releases directory
os.makedirs("releases/0.3.2", exist_ok=True)

# Build Firefox XPI with correct paths
xpi_path = "releases/0.3.2/LifeUndo-0.3.2-firefox.xpi"
with zipfile.ZipFile(xpi_path, 'w', zipfile.ZIP_DEFLATED) as zf:
    base_dir = "extension_firefox"
    for root, dirs, files in os.walk(base_dir):
        for file in files:
            file_path = os.path.join(root, file)
            # Remove the base directory from the archive path
            arc_path = os.path.relpath(file_path, base_dir).replace('\\', '/')
            zf.write(file_path, arc_path)
            print(f"Firefox: {arc_path}")

print(f"✅ Firefox XPI created: {xpi_path}")

# Build Chrome ZIP
zip_path = "releases/0.3.2/LifeUndo-0.3.2-chromium.zip"
with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zf:
    base_dir = "extension"
    for root, dirs, files in os.walk(base_dir):
        for file in files:
            file_path = os.path.join(root, file)
            # Remove the base directory from the archive path
            arc_path = os.path.relpath(file_path, base_dir).replace('\\', '/')
            zf.write(file_path, arc_path)
            print(f"Chrome: {arc_path}")

print(f"✅ Chrome ZIP created: {zip_path}")

# Verify XPI
with zipfile.ZipFile(xpi_path, 'r') as zf:
    files = zf.namelist()
    print(f"\n📦 XPI contains {len(files)} files:")
    for f in sorted(files)[:10]:  # Show first 10
        print(f"  {f}")
    if len(files) > 10:
        print(f"  ... and {len(files)-10} more")
    
    # Check critical files
    critical = ['manifest.json', 'popup.js', 'popup.html']
    missing = [f for f in critical if f not in files]
    if missing:
        print(f"❌ Missing critical files: {missing}")
    else:
        print("✅ All critical files present")

print("\n🎉 Build v0.3.2 complete!")











