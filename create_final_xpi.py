#!/usr/bin/env python3
import zipfile
import os

def create_final_xpi():
    """Create final correct XPI from extension_firefox"""
    source_dir = "extension_firefox"
    output_file = "releases/0.2.8/LifeUndo-0.2.8-firefox.xpi"
    
    if not os.path.exists(source_dir):
        print(f"Source directory not found: {source_dir}")
        return False
        
    print(f"Creating XPI from {source_dir}...")
    
    with zipfile.ZipFile(output_file, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(source_dir):
            for file in files:
                file_path = os.path.join(root, file)
                # Use forward slashes in archive paths
                arc_path = os.path.relpath(file_path, source_dir).replace('\\', '/')
                zipf.write(file_path, arc_path)
                print(f"Added: {arc_path}")
    
    print(f"\nFinal XPI created: {output_file}")
    
    # Verify the XPI contains manifest.json
    with zipfile.ZipFile(output_file, 'r') as zipf:
        files = zipf.namelist()
        if 'manifest.json' in files:
            print("✅ manifest.json found in XPI")
        else:
            print("❌ manifest.json NOT found in XPI")
            print("Files in XPI:", files)
    
    return True

if __name__ == "__main__":
    create_final_xpi()





















