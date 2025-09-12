# URL Shortener

A modern, fast URL shortener with QR code generation built with React and Node.js.

## Features

- ⚡ **Lightning Fast** - Instant URL shortening
- 🎨 **QR Codes** - Auto-generated QR codes for every shortened URL
- 🔗 **Custom Codes** - Personalized short links
- 💾 **File Storage** - No database required, uses JSON file storage
- 📱 **Responsive** - Works on all devices
- 🎯 **Copy & Share** - One-click copy to clipboard

## Tech Stack

**Frontend:**
- React 18
- Tailwind CSS (via classes)
- Lucide React Icons
- React Hot Toast

**Backend:**
- Node.js & Express
- QRCode library
- CORS enabled
- JSON file storage

## Project Structure

```
URL Shortener/
├── backend/
│   ├── server.js       # Main server file
│   ├── package.json    # Backend dependencies
│   └── urls.json       # URL storage (auto-created)
├── frontend/
│   ├── src/
│   │   ├── App.js      # Main React component
│   │   └── index.css   # Styles
│   └── package.json    # Frontend dependencies
└── README.md
```

## Installation & Setup

### Backend Setup
1. Navigate to backend directory:
   ```bash
   cd backend
   npm install
   ```

2. Start the server:
   ```bash
   npm start
   ```

### Frontend Setup
1. Navigate to frontend directory:
   ```bash
   cd frontend
   npm install
   ```

2. Start the React app:
   ```bash
   npm start
   ```

## How to Use

1. Enter your long URL
2. Optionally add a custom short code (3-20 characters)
3. Click "Shorten URL"
4. Get your shortened URL with QR code
5. Copy, share, or download the QR code

## API Endpoints

- `POST /api/shorten` - Create shortened URL
- `GET /api/urls` - Get all URLs
- `GET /:shortCode` - Redirect to original URL

## Storage

URLs are saved in `backend/urls.json` and persist between server restarts. No database setup required!

## Author

**Keerthan Vilasagaram**
- GitHub: [Keerthan200408](https://github.com/Keerthan200408)
- LinkedIn: [keerthanv0408](https://linkedin.com/in/keerthanv0408)

## License

MIT License