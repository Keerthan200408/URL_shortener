import React, { useState, useEffect } from 'react';
import { Link2, Copy, Download, RefreshCw, ExternalLink, Sparkles, Shield, Zap } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const App = () => {
  const [url, setUrl] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [recentUrls, setRecentUrls] = useState([]);

  const fetchRecentUrls = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/urls');
      const data = await response.json();
      if (data.success) {
        setRecentUrls(data.data.slice(0, 5));
      }
    } catch (error) {
      console.error('Failed to fetch recent URLs');
    }
  };

  useEffect(() => {
    fetchRecentUrls();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!url.trim()) {
      toast.error('Please enter a URL');
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/shorten', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          originalUrl: url.trim(),
          customCode: customCode.trim() || undefined
        }),
      });

      const data = await response.json();

      if (data.success) {
        setResult(data.data);
        toast.success(data.data.message || 'URL shortened successfully!');
        setUrl('');
        setCustomCode('');
        fetchRecentUrls();
      } else {
        toast.error(data.error || 'Failed to shorten URL');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const downloadQR = () => {
    if (result?.qrCode) {
      const link = document.createElement('a');
      link.download = `qr-${result.shortCode}.png`;
      link.href = result.qrCode;
      link.click();
      toast.success('QR code downloaded!');
    }
  };

  const clearResult = () => {
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1f2937',
            color: '#f9fafb',
            borderRadius: '12px',
          },
        }}
      />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400 to-indigo-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
      </div>

      {/* Header */}
      <header className="relative bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-center justify-center gap-3">
            <div className="relative">
              <Link2 className="w-10 h-10 text-indigo-600" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full animate-ping"></div>
            </div>
            <div className="text-center">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                URL Shortener
              </h1>
              <p className="text-gray-600 text-sm mt-1">Transform long URLs into short, shareable links with QR codes</p>
            </div>
          </div>
        </div>
      </header>

      <main className="relative max-w-6xl mx-auto px-6 py-12">
        {/* Features banner */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="flex items-center gap-3 p-4 bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-100">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Zap className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Lightning Fast</h3>
              <p className="text-sm text-gray-600">Instant URL shortening</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-100">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Sparkles className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">QR Codes</h3>
              <p className="text-sm text-gray-600">Auto-generated QR codes</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-100">
            <div className="p-2 bg-cyan-100 rounded-lg">
              <Shield className="w-5 h-5 text-cyan-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Custom Codes</h3>
              <p className="text-sm text-gray-600">Personalized short links</p>
            </div>
          </div>
        </div>

        {/* Main Form */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-100 p-8 mb-12">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              <div>
                <label htmlFor="url" className="block text-lg font-semibold text-gray-800 mb-3">
                  Enter your URL
                </label>
                <div className="relative">
                  <input
                    type="url"
                    id="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com/your-very-long-url-that-needs-shortening"
                    className="w-full px-6 py-4 pr-16 bg-gray-50/80 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all text-lg placeholder-gray-400"
                    required
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                      <Link2 className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="customCode" className="block text-lg font-semibold text-gray-800 mb-3">
                  Custom short code (optional)
                </label>
                <div className="relative">
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 text-lg pointer-events-none font-medium">
                    localhost:5000/
                  </div>
                  <input
                    type="text"
                    id="customCode"
                    value={customCode}
                    onChange={(e) => setCustomCode(e.target.value)}
                    placeholder="my-custom-link"
                    className="w-full pl-[160px] pr-16 py-4 bg-gray-50/80 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 outline-none transition-all text-lg placeholder-gray-400"
                    pattern="[a-zA-Z0-9_-]+"
                    minLength="3"
                    maxLength="20"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <Shield className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-2 ml-1">
                  3-20 characters • Letters, numbers, hyphens, and underscores only
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 hover:from-indigo-700 hover:via-purple-700 hover:to-cyan-700 disabled:from-gray-400 disabled:via-gray-400 disabled:to-gray-400 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 text-lg shadow-xl hover:shadow-2xl hover:scale-105 disabled:scale-100 disabled:shadow-xl"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-6 h-6 animate-spin" />
                  Creating your short link...
                </>
              ) : (
                <>
                  <Sparkles className="w-6 h-6" />
                  Shorten URL
                </>
              )}
            </button>
          </form>
        </div>

        {/* Result Display */}
        {result && (
          <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-100 p-8 mb-12">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                ✨ Your Shortened URL
              </h2>
              <button
                onClick={clearResult}
                className="text-gray-400 hover:text-gray-600 text-sm transition-colors"
              >
                Clear
              </button>
            </div>

            <div className="grid lg:grid-cols-2 gap-10">
              {/* URL Details */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Original URL
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={result.originalUrl}
                      readOnly
                      className="flex-1 px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl text-sm"
                    />
                    <button
                      onClick={() => window.open(result.originalUrl, '_blank')}
                      className="p-3 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                      title="Open original URL"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Short URL
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={result.shortUrl}
                      readOnly
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl font-semibold text-indigo-700"
                    />
                    <button
                      onClick={() => copyToClipboard(result.shortUrl)}
                      className="p-3 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-xl transition-all"
                      title="Copy to clipboard"
                    >
                      <Copy className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => window.open(result.shortUrl, '_blank')}
                      className="p-3 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-xl transition-all"
                      title="Open short URL"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Short Code
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={result.shortCode}
                      readOnly
                      className="flex-1 px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl font-mono font-semibold"
                    />
                    <button
                      onClick={() => copyToClipboard(result.shortCode)}
                      className="p-3 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                      title="Copy short code"
                    >
                      <Copy className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* QR Code */}
              <div className="text-center">
                <label className="block text-sm font-semibold text-gray-700 mb-6">
                  QR Code
                </label>
                <div className="inline-block p-6 bg-white border-2 border-gray-100 rounded-2xl shadow-lg">
                  <img 
                    src={result.qrCode} 
                    alt="QR Code"
                    className="w-48 h-48 mx-auto"
                  />
                </div>
                <button
                  onClick={downloadQR}
                  className="mt-6 inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl hover:scale-105"
                >
                  <Download className="w-5 h-5" />
                  Download QR Code
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Recent URLs */}
        {recentUrls.length > 0 && (
          <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-8">Recent URLs</h2>
            <div className="space-y-4">
              {recentUrls.map((urlItem, index) => (
                <div key={index} className="flex items-center justify-between p-6 bg-gradient-to-r from-gray-50/80 to-white/80 rounded-2xl border border-gray-100 hover:shadow-md transition-all">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-4 mb-2">
                      <span className="font-mono text-sm bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 px-3 py-1 rounded-lg font-semibold">
                        {urlItem.shortCode}
                      </span>
                      <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                        {urlItem.clicks} clicks
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 truncate">
                      {urlItem.originalUrl}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-6">
                    <button
                      onClick={() => copyToClipboard(urlItem.shortUrl)}
                      className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                      title="Copy short URL"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => window.open(urlItem.shortUrl, '_blank')}
                      className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                      title="Open URL"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative bg-white/80 backdrop-blur-md border-t border-gray-100 mt-12">
        <div className="max-w-6xl mx-auto px-6 py-8 text-center">
          <p className="text-gray-600">
            URL Shortener with QR Code Generation
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;