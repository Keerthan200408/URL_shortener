import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Copy, ExternalLink, QrCode, BarChart3, Clock, Globe, Zap } from 'lucide-react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import QRCode from 'qrcode.react';
import { Link } from 'react-router-dom';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Home = () => {
  const [url, setUrl] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [description, setDescription] = useState('');
  const [expiresIn, setExpiresIn] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!url.trim()) {
      toast.error('Please enter a URL to shorten');
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/shorten`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: url.trim(),
          customCode: customCode.trim() || undefined,
          description: description.trim() || undefined,
          expiresIn: expiresIn ? parseInt(expiresIn) : undefined,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setResult(data.data);
        toast.success(data.isExisting ? 'URL retrieved successfully!' : 'URL shortened successfully!');
        
        // Reset form
        setUrl('');
        setCustomCode('');
        setDescription('');
        setExpiresIn('');
        setShowAdvanced(false);
      } else {
        toast.error(data.error || 'Failed to shorten URL');
      }
    } catch (error) {
      console.error('Error shortening URL:', error);
      toast.error('Failed to shorten URL. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopySuccess = () => {
    toast.success('Short URL copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Shorten URLs with
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              {' '}Smart Analytics
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Transform your long URLs into short, trackable links. Get detailed analytics, 
            custom short codes, and QR codes all in one powerful platform.
          </p>
          
          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-soft">
              <BarChart3 className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium">Real-time Analytics</span>
            </div>
            <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-soft">
              <QrCode className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium">QR Code Generation</span>
            </div>
            <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-soft">
              <Clock className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium">Custom Expiration</span>
            </div>
            <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-soft">
              <Globe className="w-4 h-4 text-orange-600" />
              <span className="text-sm font-medium">Geographic Tracking</span>
            </div>
          </div>
        </div>

        {/* URL Shortening Form */}
        <div className="bg-white rounded-2xl shadow-medium p-8 mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Main URL Input */}
            <div>
              <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
                Enter your long URL
              </label>
              <div className="relative">
                <input
                  type="url"
                  id="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com/your/very/long/url/here"
                  className="w-full px-4 py-4 pr-24 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-lg"
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="absolute right-2 top-2 bottom-2 bg-blue-600 text-white px-6 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      <span className="hidden sm:inline">Shorten</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Advanced Options Toggle */}
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors duration-200"
              >
                {showAdvanced ? 'Hide' : 'Show'} Advanced Options
              </button>
            </div>

            {/* Advanced Options */}
            {showAdvanced && (
              <div className="grid md:grid-cols-3 gap-4 pt-4 border-t border-gray-100">
                <div>
                  <label htmlFor="customCode" className="block text-sm font-medium text-gray-700 mb-1">
                    Custom Short Code (Optional)
                  </label>
                  <input
                    type="text"
                    id="customCode"
                    value={customCode}
                    onChange={(e) => setCustomCode(e.target.value)}
                    placeholder="my-custom-code"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description (Optional)
                  </label>
                  <input
                    type="text"
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Link description"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  />
                </div>
                
                <div>
                  <label htmlFor="expiresIn" className="block text-sm font-medium text-gray-700 mb-1">
                    Expires In (Days)
                  </label>
                  <select
                    id="expiresIn"
                    value={expiresIn}
                    onChange={(e) => setExpiresIn(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  >
                    <option value="">Never expires</option>
                    <option value="1">1 day</option>
                    <option value="7">7 days</option>
                    <option value="30">30 days</option>
                    <option value="90">90 days</option>
                  </select>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Result Section */}
        {result && (
          <div className="bg-white rounded-2xl shadow-medium p-8 animate-fade-in">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                🎉 Your Short URL is Ready!
              </h2>
              <p className="text-gray-600">Share it anywhere and track its performance</p>
            </div>

            {/* Short URL Display */}
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">Short URL:</p>
                  <p className="text-2xl font-mono font-bold text-blue-600 break-all">
                    {result.shortUrl}
                  </p>
                </div>
                <div className="flex space-x-2 ml-4">
                  <CopyToClipboard text={result.shortUrl} onCopy={handleCopySuccess}>
                    <button className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                      <Copy className="w-5 h-5" />
                    </button>
                  </CopyToClipboard>
                  <a
                    href={result.shortUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </a>
                  <button
                    onClick={() => setShowQR(!showQR)}
                    className="p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                  >
                    <QrCode className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Original URL */}
              <div className="border-t border-gray-200 pt-4">
                <p className="text-sm text-gray-600 mb-1">Original URL:</p>
                <p className="text-gray-800 break-all">{result.originalUrl}</p>
              </div>
            </div>

            {/* QR Code */}
            {showQR && (
              <div className="text-center mb-6">
                <div className="inline-block bg-white p-4 rounded-xl shadow-soft">
                  <QRCode value={result.shortUrl} size={200} />
                </div>
                <p className="text-sm text-gray-600 mt-2">Scan to visit the short URL</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to={`/analytics/${result.shortCode}`}
                className="flex items-center justify-center space-x-2 bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-all duration-200 hover:shadow-lg"
              >
                <BarChart3 className="w-5 h-5" />
                <span>View Analytics</span>
              </Link>
              <button
                onClick={() => setResult(null)}
                className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-all duration-200"
              >
                Shorten Another URL
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Our URL Shortener?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get more than just short links. Track, analyze, and optimize your URL performance 
              with our comprehensive analytics platform.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Advanced Analytics</h3>
              <p className="text-gray-600">
                Track clicks, geographic data, referrers, devices, and more with real-time analytics dashboard.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <QrCode className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">QR Code Generation</h3>
              <p className="text-gray-600">
                Automatically generate QR codes for your short URLs for easy sharing and mobile access.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Lightning Fast</h3>
              <p className="text-gray-600">
                Sub-50ms redirect times with global CDN and optimized database architecture.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;