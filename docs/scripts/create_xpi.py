#!/usr/bin/env python3
import zipfile
import os
import sys

def create_xpi(source_dir, output_file):
    """Create XPI file from directory"""
    with zipfile.ZipFile(output_file, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(source_dir):
            # Skip _locales subdirectories that might have wrong paths
            if '_locales' in root and 'extension_firefox' in root:
                continue
            for file in files:
                file_path = os.path.join(root, file)
                # Use forward slashes in archive paths
                arc_path = os.path.relpath(file_path, source_dir).replace('\\', '/')
                # Skip files from wrong directories
                if 'extension_firefox' in arc_path and arc_path.count('/') > 1:
                    continue
                zipf.write(file_path, arc_path)
                print(f"Added: {arc_path}")

if __name__ == "__main__":
    source_dir = "releases/0.2.7/LifeUndo-0.2.7-firefox"
    output_file = "releases/0.2.7/LifeUndo-0.2.7-firefox.xpi"
    
    if os.path.exists(source_dir):
        create_xpi(source_dir, output_file)
        print(f"\nXPI created: {output_file}")
    else:
        print(f"Source directory not found: {source_dir}")
        sys.exit(1)