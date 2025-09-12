const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const QRCode = require('qrcode');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 5000;

const DATA_FILE = path.join(__dirname, 'urls.json');

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Load URLs from file
async function loadUrls() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return {};
  }
}

// Save URLs to file
async function saveUrls(urls) {
  await fs.writeFile(DATA_FILE, JSON.stringify(urls, null, 2));
}

// Generate short code
function generateShortCode() {
  return crypto.randomBytes(4).toString('hex').toUpperCase();
}

// Validate URL
function isValidUrl(string) {
  try {
    const url = new URL(string);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (_) {
    return false;
  }
}

// Routes
app.post('/api/shorten', async (req, res) => {
  try {
    const { originalUrl, customCode } = req.body;

    // Validate URL
    if (!originalUrl || !isValidUrl(originalUrl)) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid URL'
      });
    }

    // Load existing URLs
    const urls = await loadUrls();

    // Check if URL already exists
    const existingEntry = Object.entries(urls).find(([code, data]) => data.originalUrl === originalUrl);
    if (existingEntry) {
      const [shortCode, data] = existingEntry;
      const shortUrl = `http://localhost:${PORT}/${shortCode}`;
      
      // Generate QR code
      const qrCode = await QRCode.toDataURL(shortUrl);
      
      return res.json({
        success: true,
        data: {
          originalUrl: data.originalUrl,
          shortUrl,
          shortCode,
          qrCode,
          message: 'URL already exists'
        }
      });
    }

    // Generate or use custom short code
    let shortCode = customCode;
    if (customCode) {
      // Check if custom code is already taken
      if (urls[customCode]) {
        return res.status(400).json({
          success: false,
          error: 'Custom code is already taken'
        });
      }
      // Validate custom code
      if (!/^[a-zA-Z0-9_-]+$/.test(customCode) || customCode.length < 3 || customCode.length > 20) {
        return res.status(400).json({
          success: false,
          error: 'Custom code must be 3-20 characters long and contain only letters, numbers, hyphens, and underscores'
        });
      }
    } else {
      // Generate unique short code
      do {
        shortCode = generateShortCode();
      } while (urls[shortCode]);
    }

    // Create URL entry
    const urlData = {
      originalUrl,
      createdAt: new Date().toISOString(),
      clicks: 0
    };

    // Save to storage
    urls[shortCode] = urlData;
    await saveUrls(urls);

    const shortUrl = `http://localhost:${PORT}/${shortCode}`;
    
    // Generate QR code
    const qrCode = await QRCode.toDataURL(shortUrl);

    res.json({
      success: true,
      data: {
        originalUrl,
        shortUrl,
        shortCode,
        qrCode,
        message: 'URL shortened successfully'
      }
    });

  } catch (error) {
    console.error('Error shortening URL:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// GET /api/urls - Get all shortened URLs (simple list)
app.get('/api/urls', async (req, res) => {
  try {
    const urls = await loadUrls();
    const urlList = Object.entries(urls).map(([shortCode, data]) => ({
      shortCode,
      originalUrl: data.originalUrl,
      shortUrl: `http://localhost:${PORT}/${shortCode}`,
      createdAt: data.createdAt,
      clicks: data.clicks
    }));

    // Sort by creation date (newest first)
    urlList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({
      success: true,
      data: urlList
    });

  } catch (error) {
    console.error('Error fetching URLs:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// GET /:shortCode - Redirect to original URL
app.get('/:shortCode', async (req, res) => {
  try {
    const { shortCode } = req.params;
    const urls = await loadUrls();

    if (!urls[shortCode]) {
      return res.status(404).send(`
        <!DOCTYPE html>
        <html>
          <head><title>URL Not Found</title></head>
          <body style="font-family: Arial, sans-serif; text-align: center; margin-top: 100px;">
            <h1>URL Not Found</h1>
            <p>The shortened URL you're looking for does not exist.</p>
            <a href="http://localhost:3000" style="color: #3B82F6;">Go to URL Shortener</a>
          </body>
        </html>
      `);
    }

    // Increment click counter
    urls[shortCode].clicks++;
    await saveUrls(urls);

    // Redirect to original URL
    res.redirect(urls[shortCode].originalUrl);

  } catch (error) {
    console.error('Error redirecting:', error);
    res.status(500).send('Internal server error');
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 URL Shortener server running on http://localhost:${PORT}`);
  console.log(`📊 Frontend: http://localhost:3000`);
});