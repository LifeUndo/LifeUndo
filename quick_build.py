import zipfile
import os

# Create releases directory
os.makedirs("releases/0.3.2", exist_ok=True)

# Build Firefox XPI
with zipfile.ZipFile("releases/0.3.2/LifeUndo-0.3.2-firefox.xpi", 'w', zipfile.ZIP_DEFLATED) as zf:
    for root, dirs, files in os.walk("extension_firefox"):
        for file in files:
            file_path = os.path.join(root, file)
            arc_path = file_path.replace("extension_firefox\\", "").replace("extension_firefox/", "").replace("\\", "/")
            zf.write(file_path, arc_path)
            print(f"Added: {arc_path}")

print("✅ Firefox XPI created!")

# Build Chrome ZIP  
with zipfile.ZipFile("releases/0.3.2/LifeUndo-0.3.2-chromium.zip", 'w', zipfile.ZIP_DEFLATED) as zf:
    for root, dirs, files in os.walk("extension"):
        for file in files:
            file_path = os.path.join(root, file)
            arc_path = file_path.replace("extension\\", "").replace("extension/", "").replace("\\", "/")
            zf.write(file_path, arc_path)
            print(f"Added: {arc_path}")

print("✅ Chrome ZIP created!")
print("🎉 Build complete!")











