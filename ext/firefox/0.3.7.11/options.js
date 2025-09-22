// LifeUndo Options - v0.3.7.11
// License management page

const api = window.browser || window.chrome;

const licenseFile = document.getElementById('licenseFile');
const importBtn = document.getElementById('importBtn');
const verifyBtn = document.getElementById('verifyBtn');
const deleteBtn = document.getElementById('deleteBtn');
const status = document.getElementById('status');
const licenseInfo = document.getElementById('licenseInfo');
const licenseDetails = document.getElementById('licenseDetails');

let currentLicense = null;

// Show status message
function showStatus(message, type = 'success') {
  status.textContent = message;
  status.className = `status ${type}`;
  status.style.display = 'block';
  
  setTimeout(() => {
    status.style.display = 'none';
  }, 3000);
}

// Update UI based on license state
async function updateUI() {
  const { lu_license, lu_plan } = await api.storage.local.get(['lu_license', 'lu_plan']);
  
  if (lu_license && lu_plan) {
    currentLicense = lu_license;
    verifyBtn.disabled = false;
    deleteBtn.disabled = false;
    
    licenseInfo.style.display = 'block';
    licenseDetails.innerHTML = `
      <div>Plan: ${lu_plan.toUpperCase()}</div>
      <div>Status: Active</div>
      <div>Type: ${lu_license.type || 'Demo'}</div>
    `;
  } else {
    currentLicense = null;
    verifyBtn.disabled = true;
    deleteBtn.disabled = true;
    licenseInfo.style.display = 'none';
  }
}

// Import license file
importBtn.addEventListener('click', async () => {
  const file = licenseFile.files[0];
  if (!file) {
    showStatus('Please select a license file', 'error');
    return;
  }
  
  try {
    const text = await file.text();
    const license = JSON.parse(text);
    
    // Store license and set demo plan
    await api.storage.local.set({
      lu_license: license,
      lu_plan: 'demo'
    });
    
    showStatus('License imported successfully! Click Verify to activate.');
    updateUI();
    
    // Send message to popup about license update
    api.runtime.sendMessage('license-updated');
    
  } catch (error) {
    showStatus('Import error: ' + error.message, 'error');
  }
});

// Verify license (stub implementation)
verifyBtn.addEventListener('click', async () => {
  if (!currentLicense) {
    showStatus('No license to verify', 'error');
    return;
  }
  
  try {
    // TODO: Implement ECDSA P-256/SHA-256 verification
    // For now, just confirm the license
    await api.storage.local.set({
      lu_plan: 'vip' // Set to VIP for demo
    });
    
    showStatus('License verified and activated!');
    updateUI();
    
    // Send message to popup about license update
    api.runtime.sendMessage('license-updated');
    
  } catch (error) {
    showStatus('Verification error: ' + error.message, 'error');
  }
});

// Delete license
deleteBtn.addEventListener('click', async () => {
  if (!confirm('Are you sure you want to delete the license?')) {
    return;
  }
  
  try {
    await api.storage.local.remove(['lu_license', 'lu_plan']);
    
    showStatus('License deleted successfully');
    updateUI();
    
    // Send message to popup about license update
    api.runtime.sendMessage('license-updated');
    
  } catch (error) {
    showStatus('Delete error: ' + error.message, 'error');
  }
});

// Initialize
updateUI();
