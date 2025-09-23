import zipfile
z = zipfile.ZipFile('releases/0.3.2/LifeUndo-0.3.2-firefox.xpi')
files = z.namelist()
print(f'XPI contains {len(files)} files')
print('manifest.json present:', 'manifest.json' in files)
print('popup.js present:', 'popup.js' in files)  
print('popup.html present:', 'popup.html' in files)
print('\nAll files:')
for f in sorted(files):
    print(f'  {f}')














