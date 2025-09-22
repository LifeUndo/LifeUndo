// options.patch.js — emit event after successful import/verify
async function onLicenseImported(licenseObj) {
  await browser.storage.local.set({ lu_license: licenseObj, lu_plan: licenseObj?.license?.plan || null });
  try { await browser.runtime.sendMessage({ type: 'license-updated' }); } catch(e) {}
  // update local UI state if needed
}

// Example wiring:
const btnImport = document.getElementById('btnImport');
if (btnImport) {
  btnImport.addEventListener('click', async () => {
    // ... your existing file input & ECDSA verify code ...
    // suppose 'parsed' is the verified license object:
    // await onLicenseImported(parsed);
  });
}
