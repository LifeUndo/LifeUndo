#!/usr/bin/env python3
import zipfile
import os
import sys

def create_xpi_from_extension_firefox():
    """Create XPI file directly from extension_firefox directory"""
    source_dir = "extension_firefox"
    output_file = "releases/0.2.7/LifeUndo-0.2.7-firefox.xpi"
    
    if not os.path.exists(source_dir):
        print(f"Source directory not found: {source_dir}")
        return False
        
    with zipfile.ZipFile(output_file, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(source_dir):
            for file in files:
                file_path = os.path.join(root, file)
                # Use forward slashes in archive paths
                arc_path = os.path.relpath(file_path, source_dir).replace('\\', '/')
                zipf.write(file_path, arc_path)
                print(f"Added: {arc_path}")
    
    print(f"\nXPI created: {output_file}")
    return True

if __name__ == "__main__":
    create_xpi_from_extension_firefox()










