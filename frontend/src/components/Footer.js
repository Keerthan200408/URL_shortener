import React from 'react';
import { Link as LinkIcon, Github, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-primary-600 p-2 rounded-lg">
                <LinkIcon className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">ShortURL</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Professional URL shortening service with comprehensive analytics. 
              Track your links, understand your audience, and optimize your digital presence.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://github.com/Keerthan200408"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com/in/keerthanv0408"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="mailto:keerthanvils@gmail.com"
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Features</h3>
            <ul className="space-y-2 text-gray-300">
              <li>URL Shortening</li>
              <li>Click Analytics</li>
              <li>Custom Short Codes</li>
              <li>QR Code Generation</li>
              <li>Geographic Tracking</li>
              <li>Real-time Dashboard</li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <a 
                  href="/api/docs" 
                  className="hover:text-white transition-colors duration-200"
                >
                  API Documentation
                </a>
              </li>
              <li>
                <a 
                  href="https://github.com/Keerthan200408/URL-Shortener" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors duration-200"
                >
                  GitHub Repository
                </a>
              </li>
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
              <li>Support</li>
            </ul>
          </div>
        </div>

        <hr className="border-gray-800 my-8" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © 2025 ShortURL by Keerthan Vilasagaram. Built with React & Node.js.
          </p>
          <div className="flex items-center space-x-6 text-sm text-gray-400">
            <span>Made with ❤️ for the web</span>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>All systems operational</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;