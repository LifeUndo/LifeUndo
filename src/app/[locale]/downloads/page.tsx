import React from 'react';

export default function DownloadsPage() {
  const handleGrantTestLicense = async () => {
    const email = (document.getElementById('testEmail') as HTMLInputElement)?.value;
    if (!email) {
      alert('Please enter your email');
      return;
    }

    try {
      const response = await fetch('/api/dev/license/grant-ui', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          plan: 'starter_6m'
        })
      });

      const data = await response.json();
      
      if (data.ok) {
        alert(`Test license granted! Level: ${data.level}, Expires: ${data.expiresAt}`);
        // Open account page
        window.open(`/ru/account?email=${encodeURIComponent(email)}`, '_blank');
      } else {
        alert('Error: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      alert('Network error: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8 text-center">
            Download LifeUndo Extension
          </h1>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Chrome */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">C</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Chrome</h3>
              <p className="text-gray-300 mb-4">Install as unpacked extension</p>
              <button 
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 px-4 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all"
                onClick={() => window.open('chrome://extensions/', '_blank')}
              >
                Get for Chrome
              </button>
            </div>

            {/* Firefox */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">F</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Firefox</h3>
              <p className="text-gray-300 mb-4">Load temporary add-on</p>
              <button 
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-2 px-4 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all"
                onClick={() => window.open('about:debugging#/runtime/this-firefox', '_blank')}
              >
                Get for Firefox
              </button>
            </div>

            {/* Edge */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">E</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Edge</h3>
              <p className="text-gray-300 mb-4">Install as unpacked extension</p>
              <button 
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 px-4 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all"
                onClick={() => window.open('edge://extensions/', '_blank')}
              >
                Get for Edge
              </button>
            </div>
          </div>

          {/* Manual Installation Instructions */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">Manual Installation (Dev)</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Chrome/Edge</h3>
                <ol className="text-gray-300 space-y-2">
                  <li>1. Open <code className="bg-gray-800 px-2 py-1 rounded">chrome://extensions/</code></li>
                  <li>2. Enable "Developer mode"</li>
                  <li>3. Click "Load unpacked"</li>
                  <li>4. Select the extension folder</li>
                </ol>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Firefox</h3>
                <ol className="text-gray-300 space-y-2">
                  <li>1. Open <code className="bg-gray-800 px-2 py-1 rounded">about:debugging</code></li>
                  <li>2. Click "This Firefox"</li>
                  <li>3. Click "Load Temporary Add-on"</li>
                  <li>4. Select manifest.json</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Test License Grant */}
          {process.env.NODE_ENV === 'development' && (
            <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 backdrop-blur-sm rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-4">Test License Activation</h2>
              <p className="text-gray-300 mb-6">
                For testing purposes, you can grant a test license without payment.
              </p>
              
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <label className="block text-white mb-2">Email</label>
                  <input
                    id="testEmail"
                    type="email"
                    placeholder="your@email.com"
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <button
                  onClick={handleGrantTestLicense}
                  className="bg-gradient-to-r from-green-500 to-green-600 text-white py-2 px-6 rounded-lg hover:from-green-600 hover:to-green-700 transition-all"
                >
                  Grant Test License
                </button>
              </div>
              
              <p className="text-sm text-gray-400 mt-4">
                This will grant a Pro license for 6 months + bonus features.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
