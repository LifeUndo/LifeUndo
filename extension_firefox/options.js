// LifeUndo Options Page
import { LINKS, TRIAL_DAYS } from './constants.js';

class OptionsManager {
  constructor() {
    this.init();
  }

  async init() {
    await this.loadData();
    this.setupEventListeners();
  }

  async loadData() {
    try {
      // Load statistics and pro status
      const response = await chrome.runtime.sendMessage({ type: 'LU_GET_STATS' });
      if (response.ok) {
        this.updateStats(response.stats);
        this.updateLicenseStatus(response.pro);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }

  updateStats(stats) {
    if (!stats) return;

    document.getElementById('popupOpens').textContent = stats.popupOpens || 0;
    document.getElementById('undos').textContent = stats.undos || 0;
    document.getElementById('tabRestores').textContent = stats.tabRestores || 0;
    document.getElementById('clipboardRestores').textContent = stats.clipboardRestores || 0;
  }

  updateLicenseStatus(pro) {
    if (!pro) return;

    const statusEl = document.getElementById('licenseStatus');
    const trialInfoEl = document.getElementById('trialInfo');
    const trialDaysEl = document.getElementById('trialDays');

    statusEl.classList.remove('hidden', 'success', 'error', 'info');

    if (pro.status === 'pro') {
      statusEl.textContent = '✅ Pro License Active';
      statusEl.classList.add('success');
      trialInfoEl.classList.add('hidden');
    } else if (pro.status === 'trial') {
      const trialStart = pro.trialStart || Date.now();
      const daysLeft = Math.max(0, TRIAL_DAYS - Math.floor((Date.now() - trialStart) / (24 * 60 * 60 * 1000)));
      
      if (daysLeft > 0) {
        statusEl.textContent = `🕒 Trial Active (${daysLeft} days left)`;
        statusEl.classList.add('info');
        trialDaysEl.textContent = daysLeft;
        trialInfoEl.classList.remove('hidden');
      } else {
        statusEl.textContent = '❌ Trial Expired - Upgrade to Pro';
        statusEl.classList.add('error');
        trialInfoEl.classList.add('hidden');
      }
    } else {
      statusEl.textContent = '🆓 Free Version';
      statusEl.classList.add('info');
      trialInfoEl.classList.add('hidden');
    }
  }

  setupEventListeners() {
    // License activation
    document.getElementById('activateBtn').addEventListener('click', () => {
      this.activateLicense();
    });

    // Enter key for license input
    document.getElementById('licenseKey').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.activateLicense();
      }
    });

    // Export data
    document.getElementById('exportBtn').addEventListener('click', () => {
      this.exportData();
    });

    // Reset statistics
    document.getElementById('resetBtn').addEventListener('click', () => {
      this.resetStats();
    });
  }

  async activateLicense() {
    const key = document.getElementById('licenseKey').value.trim();
    const statusEl = document.getElementById('licenseStatus');
    const activateBtn = document.getElementById('activateBtn');

    if (!key) {
      this.showStatus('Please enter a license key', 'error');
      return;
    }

    activateBtn.disabled = true;
    activateBtn.textContent = 'Activating...';

    try {
      const response = await chrome.runtime.sendMessage({
        type: 'LU_ACTIVATE_LICENSE',
        payload: { key }
      });

      if (response.ok) {
        this.showStatus('✅ License activated successfully!', 'success');
        document.getElementById('licenseKey').value = '';
        await this.loadData(); // Reload to update status
      } else {
        this.showStatus(`❌ ${response.message}`, 'error');
      }
    } catch (error) {
      this.showStatus('❌ Error activating license', 'error');
    } finally {
      activateBtn.disabled = false;
      activateBtn.textContent = 'Activate License';
    }
  }

  async exportData() {
    try {
      const response = await chrome.runtime.sendMessage({ type: 'LU_EXPORT_DATA' });
      if (response.ok) {
        const data = response.data;
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `lifeundo-stats-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.showStatus('✅ Data exported successfully!', 'success');
      } else {
        this.showStatus('❌ Error exporting data', 'error');
      }
    } catch (error) {
      this.showStatus('❌ Error exporting data', 'error');
    }
  }

  async resetStats() {
    if (!confirm('Are you sure you want to reset all statistics? This action cannot be undone.')) {
      return;
    }

    try {
      // Reset statistics in background
      await chrome.runtime.sendMessage({ type: 'LU_RESET_STATS' });
      await this.loadData(); // Reload to show updated stats
      this.showStatus('✅ Statistics reset successfully!', 'success');
    } catch (error) {
      this.showStatus('❌ Error resetting statistics', 'error');
    }
  }

  showStatus(message, type) {
    const statusEl = document.getElementById('licenseStatus');
    statusEl.textContent = message;
    statusEl.className = `status ${type}`;
    statusEl.classList.remove('hidden');

    // Auto-hide after 5 seconds
    setTimeout(() => {
      statusEl.classList.add('hidden');
    }, 5000);
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new OptionsManager();
});

