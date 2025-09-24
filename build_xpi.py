#!/usr/bin/env python3
import os
import posixpath
import zipfile
from pathlib import Path

def build_xpi():
    SRC = 'extension_firefox'
    OUT = 'releases/0.2.3/LifeUndo-0.2.3-firefox.xpi'
    
    # Create output directory
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    
    print(f"Building XPI from {SRC} to {OUT}")
    
    with zipfile.ZipFile(OUT, 'w', compression=zipfile.ZIP_DEFLATED) as z:
        for root, dirs, files in os.walk(SRC):
            for file in files:
                abs_path = os.path.join(root, file)
                # Convert to POSIX path (use / instead of \)
                rel_path = posixpath.join(*os.path.relpath(abs_path, SRC).split(os.sep))
                print(f"Adding: {rel_path}")
                z.write(abs_path, rel_path)
    
    print(f"XPI created successfully: {OUT}")
    
    # Verify the XPI contents
    print("\nVerifying XPI contents:")
    with zipfile.ZipFile(OUT, 'r') as z:
        for name in z.namelist():
            print(f"  {name}")

if __name__ == "__main__":
    build_xpi()


















