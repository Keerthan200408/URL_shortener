import React, { useState, useEffect } from 'react';
import { Link2, Copy, Download, RefreshCw, ExternalLink } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const App = () => {
  const [url, setUrl] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [recentUrls, setRecentUrls] = useState([]);

  // Fetch recent URLs
  const fetchRecentUrls = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/urls');
      const data = await response.json();
      if (data.success) {
        setRecentUrls(data.data.slice(0, 5)); // Show only 5 most recent
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
        fetchRecentUrls(); // Refresh the list
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <Link2 className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-800">Simple URL Shortener</h1>
          </div>
          <p className="text-gray-600 mt-2">Shorten URLs and generate QR codes instantly</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Main Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
                Enter URL to shorten
              </label>
              <input
                type="url"
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/your-long-url"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                required
              />
            </div>

            <div>
              <label htmlFor="customCode" className="block text-sm font-medium text-gray-700 mb-2">
                Custom short code (optional)
              </label>
              <input
                type="text"
                id="customCode"
                value={customCode}
                onChange={(e) => setCustomCode(e.target.value)}
                placeholder="my-custom-link"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                pattern="[a-zA-Z0-9_-]+"
                minLength="3"
                maxLength="20"
              />
              <p className="text-sm text-gray-500 mt-1">
                3-20 characters, letters, numbers, hyphens, and underscores only
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Shortening...
                </>
              ) : (
                <>
                  <Link2 className="w-5 h-5" />
                  Shorten URL
                </>
              )}
            </button>
          </form>
        </div>

        {/* Result Display */}
        {result && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Your Shortened URL</h2>
              <button
                onClick={clearResult}
                className="text-gray-500 hover:text-gray-700 text-sm"
              >
                Clear
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* URL Details */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Original URL
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={result.originalUrl}
                      readOnly
                      className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm"
                    />
                    <button
                      onClick={() => window.open(result.originalUrl, '_blank')}
                      className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                      title="Open original URL"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Short URL
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={result.shortUrl}
                      readOnly
                      className="flex-1 px-3 py-2 bg-blue-50 border border-blue-200 rounded font-medium text-blue-800"
                    />
                    <button
                      onClick={() => copyToClipboard(result.shortUrl)}
                      className="p-2 text-blue-600 hover:text-blue-800 transition-colors"
                      title="Copy to clipboard"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => window.open(result.shortUrl, '_blank')}
                      className="p-2 text-blue-600 hover:text-blue-800 transition-colors"
                      title="Open short URL"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Short Code
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={result.shortCode}
                      readOnly
                      className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded font-mono"
                    />
                    <button
                      onClick={() => copyToClipboard(result.shortCode)}
                      className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                      title="Copy short code"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* QR Code */}
              <div className="text-center">
                <label className="block text-sm font-medium text-gray-600 mb-4">
                  QR Code
                </label>
                <div className="inline-block p-4 bg-white border-2 border-gray-200 rounded-lg">
                  <img 
                    src={result.qrCode} 
                    alt="QR Code"
                    className="w-40 h-40 mx-auto"
                  />
                </div>
                <button
                  onClick={downloadQR}
                  className="mt-4 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors mx-auto"
                >
                  <Download className="w-4 h-4" />
                  Download QR Code
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Recent URLs */}
        {recentUrls.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Recent URLs</h2>
            <div className="space-y-4">
              {recentUrls.map((urlItem, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {urlItem.shortCode}
                      </span>
                      <span className="text-sm text-gray-600">
                        {urlItem.clicks} clicks
                      </span>
                    </div>
                    <p className="text-sm text-gray-800 truncate mt-1">
                      {urlItem.originalUrl}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => copyToClipboard(urlItem.shortUrl)}
                      className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                      title="Copy short URL"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => window.open(urlItem.shortUrl, '_blank')}
                      className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
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
      </div>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-4xl mx-auto px-4 py-8 text-center text-gray-600">
          <p>Simple URL Shortener with QR Code Generation</p>
        </div>
      </footer>
    </div>
  );
};

export default App;