import GrantForm from './GrantForm';
import { useTranslations } from 'next-intl';

export default function DownloadsPage() {
  const t = useTranslations('downloads');
  
  try {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-white mb-8 text-center">
              {t('title')}
            </h1>
            
            {/* Test License Card - Client-side check */}
            <GrantForm />
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Chrome */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">C</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Chrome</h3>
              <p className="text-gray-300 mb-4">Install as unpacked extension</p>
              <a 
                href="chrome://extensions/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 px-4 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all inline-block text-center"
              >
                Get for Chrome
              </a>
            </div>

            {/* Firefox */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">F</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Firefox</h3>
              <p className="text-gray-300 mb-4">Load temporary add-on</p>
              <a 
                href="about:debugging#/runtime/this-firefox"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-2 px-4 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all inline-block text-center"
              >
                Get for Firefox
              </a>
            </div>

            {/* Edge */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">E</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Edge</h3>
              <p className="text-gray-300 mb-4">Install as unpacked extension</p>
              <a 
                href="edge://extensions/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 px-4 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all inline-block text-center"
              >
                Get for Edge
              </a>
            </div>
          </div>

          {/* Manual Installation Instructions */}
          <div id="extension-instructions" className="bg-white/10 backdrop-blur-sm rounded-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">📦 Manual Installation (Dev)</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Chrome/Edge</h3>
                <ol className="text-gray-300 space-y-2">
                  <li>1. Open <code className="bg-gray-800 px-2 py-1 rounded">chrome://extensions/</code></li>
                  <li>2. Enable "Developer mode"</li>
                  <li>3. Click "Load unpacked"</li>
                  <li>4. Select the extension folder: <code className="bg-gray-800 px-2 py-1 rounded">extension/</code></li>
                </ol>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Firefox</h3>
                <ol className="text-gray-300 space-y-2">
                  <li>1. Open <code className="bg-gray-800 px-2 py-1 rounded">about:debugging</code></li>
                  <li>2. Click "This Firefox"</li>
                  <li>3. Click "Load Temporary Add-on…"</li>
                  <li>4. Select <code className="bg-gray-800 px-2 py-1 rounded">extension/manifest.json</code></li>
                </ol>
              </div>
            </div>

            <div className="mt-8 p-4 bg-blue-500/20 border border-blue-500/30 rounded-lg">
              <h4 className="text-lg font-semibold text-blue-300 mb-2">📁 Extension Build Path</h4>
              <p className="text-gray-300 mb-2">
                The extension files are located in: <code className="bg-gray-800 px-2 py-1 rounded">extension/</code>
              </p>
              <p className="text-sm text-gray-400 mb-4">
                Run <code className="bg-gray-800 px-2 py-1 rounded">npm run build:ext</code> to prepare the extension for installation.
              </p>
              
              <div className="mt-4">
                <a 
                  href="/extension-dev-0.4.0.zip" 
                  download
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 px-4 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all"
                >
                  📦 Download Extension ZIP
                </a>
                <p className="text-xs text-gray-400 mt-2">
                  Run <code className="bg-gray-800 px-1 py-0.5 rounded">npm run build:ext:zip</code> to generate this file
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    );
  } catch (e) {
    console.error('[downloads] render error', e);
    return (
      <main style={{padding: 24}} className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">We're preparing the downloads page…</h1>
          <p className="text-gray-300">Please try again in a moment.</p>
        </div>
      </main>
    );
  }
}