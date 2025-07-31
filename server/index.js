const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs-extra');
const { v4: uuidv4 } = require('uuid');

// Function to generate short unique codes
// 6 characters with 62 possible characters = 62^6 = 56,800,235,584 possible combinations
function generateShortCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Function to generate unique short code
function generateUniqueShortCode(existingCodes) {
  let code;
  let attempts = 0;
  const maxAttempts = 100;
  
  do {
    code = generateShortCode();
    attempts++;
    if (attempts > maxAttempts) {
      // Fallback to UUID if we can't generate a unique short code
      return uuidv4().substring(0, 6);
    }
  } while (existingCodes.has(code));
  
  return code;
}

// Function to create a new sharing session
function createSharingSession() {
  const sessionId = generateUniqueShortCode(sessionShortCodes);
  sessionShortCodes.add(sessionId);
  
  const session = {
    id: sessionId,
    snippets: [],
    images: [],
    createdAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString()
  };
  
  sharingSessions.set(sessionId, session);
  return session;
}

// Function to add snippet to a session
function addSnippetToSession(sessionId, snippet) {
  const session = sharingSessions.get(sessionId);
  if (session) {
    session.snippets.push(snippet);
    session.lastUpdated = new Date().toISOString();
    sharingSessions.set(sessionId, session);
    return true;
  }
  return false;
}

// Function to add image to a session
function addImageToSession(sessionId, imageInfo) {
  const session = sharingSessions.get(sessionId);
  if (session) {
    session.images.push(imageInfo);
    session.lastUpdated = new Date().toISOString();
    sharingSessions.set(sessionId, session);
    return true;
  }
  return false;
}
const compression = require('compression');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(compression());
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.FRONTEND_URL, process.env.BACKEND_URL]
    : ['http://localhost:3000', 'http://localhost:5000'],
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
const imagesDir = path.join(uploadsDir, 'images');
fs.ensureDirSync(uploadsDir);
fs.ensureDirSync(imagesDir);

// In-memory storage for code snippets (in production, use a database)
const codeSnippets = new Map();
const imageFiles = new Map();
const existingShortCodes = new Set(); // Track existing short codes

// Session-based sharing storage
const sharingSessions = new Map(); // sessionId -> { snippets: [], images: [], createdAt, lastUpdated }
const sessionShortCodes = new Set(); // Track existing session codes

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, imagesDir);
  },
  filename: (req, file, cb) => {
    const shortCode = generateShortCode();
    const uniqueName = `${shortCode}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// Routes

// Create a new code snippet
app.post('/api/snippets', (req, res) => {
  try {
    const { code, language, title, description } = req.body;
    
    if (!code) {
      return res.status(400).json({ error: 'Code content is required' });
    }

    const snippetId = generateUniqueShortCode(existingShortCodes);
    existingShortCodes.add(snippetId);
    
    const snippet = {
      id: snippetId,
      code,
      language: language || 'text',
      title: title || 'Untitled',
      description: description || '',
      createdAt: new Date().toISOString(),
      views: 0
    };

    codeSnippets.set(snippetId, snippet);
    
    // Generate share URL based on environment
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? `${req.protocol}://${req.get('host')}`
      : 'http://localhost:3000';
    
    res.json({
      success: true,
      snippetId,
      shareUrl: `${baseUrl}/share/${snippetId}`
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create snippet' });
  }
});

// Get a code snippet by ID
app.get('/api/snippets/:id', (req, res) => {
  try {
    const { id } = req.params;
    const snippet = codeSnippets.get(id);
    
    if (!snippet) {
      return res.status(404).json({ error: 'Snippet not found' });
    }

    // Increment view count
    snippet.views += 1;
    codeSnippets.set(id, snippet);
    
    res.json(snippet);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve snippet' });
  }
});

// Upload image
app.post('/api/upload-image', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const imageId = generateUniqueShortCode(existingShortCodes);
    existingShortCodes.add(imageId);
    
    const imageInfo = {
      id: imageId,
      filename: req.file.filename,
      originalName: req.file.originalname,
      path: req.file.path,
      size: req.file.size,
      mimetype: req.file.mimetype,
      uploadedAt: new Date().toISOString()
    };

    imageFiles.set(imageId, imageInfo);
    
    // Generate URLs based on environment
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? `${req.protocol}://${req.get('host')}`
      : 'http://localhost:3000';
    
    res.json({
      success: true,
      imageId,
      filename: req.file.filename,
      downloadUrl: `${req.protocol}://${req.get('host')}/api/images/${imageId}/download`,
      viewUrl: `${baseUrl}/image/${imageId}`
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// Download image
app.get('/api/images/:id/download', (req, res) => {
  try {
    const { id } = req.params;
    const imageInfo = imageFiles.get(id);
    
    if (!imageInfo) {
      return res.status(404).json({ error: 'Image not found' });
    }

    res.download(imageInfo.path, imageInfo.originalName);
  } catch (error) {
    res.status(500).json({ error: 'Failed to download image' });
  }
});

// View image
app.get('/api/images/:id/view', (req, res) => {
  try {
    const { id } = req.params;
    const imageInfo = imageFiles.get(id);
    
    if (!imageInfo) {
      return res.status(404).json({ error: 'Image not found' });
    }

    res.sendFile(imageInfo.path);
  } catch (error) {
    res.status(500).json({ error: 'Failed to view image' });
  }
});

// Get recent snippets
app.get('/api/snippets', (req, res) => {
  try {
    const snippets = Array.from(codeSnippets.values())
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10);
    
    res.json(snippets);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve snippets' });
  }
});

// Get statistics
app.get('/api/stats', (req, res) => {
  try {
    const stats = {
      totalSnippets: codeSnippets.size,
      totalImages: imageFiles.size,
      totalShortCodes: existingShortCodes.size,
      totalSessions: sharingSessions.size,
      possibleCombinations: Math.pow(62, 6), // 62^6
      uniquenessPercentage: ((existingShortCodes.size / Math.pow(62, 6)) * 100).toFixed(10)
    };
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve statistics' });
  }
});

// Create a new sharing session
app.post('/api/sessions', (req, res) => {
  try {
    const session = createSharingSession();
    
    // Generate share URL based on environment
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? `${req.protocol}://${req.get('host')}`
      : 'http://localhost:3000';
    
    res.json({
      success: true,
      sessionId: session.id,
      shareUrl: `${baseUrl}/session/${session.id}`,
      session: session
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create session' });
  }
});

// Get a sharing session
app.get('/api/sessions/:id', (req, res) => {
  try {
    const { id } = req.params;
    const session = sharingSessions.get(id);
    
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    res.json(session);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve session' });
  }
});

// Add snippet to a session
app.post('/api/sessions/:id/snippets', (req, res) => {
  try {
    const { id } = req.params;
    const { code, language, title, description } = req.body;
    
    if (!code) {
      return res.status(400).json({ error: 'Code content is required' });
    }

    const snippetId = generateUniqueShortCode(existingShortCodes);
    existingShortCodes.add(snippetId);
    
    const snippet = {
      id: snippetId,
      code,
      language: language || 'text',
      title: title || 'Untitled',
      description: description || '',
      createdAt: new Date().toISOString(),
      views: 0
    };

    // Add to both individual snippets and session
    codeSnippets.set(snippetId, snippet);
    
    if (addSnippetToSession(id, snippet)) {
      // Generate share URL based on environment
      const baseUrl = process.env.NODE_ENV === 'production' 
        ? `${req.protocol}://${req.get('host')}`
        : 'http://localhost:3000';
      
      res.json({
        success: true,
        snippetId,
        sessionId: id,
        shareUrl: `${baseUrl}/session/${id}`,
        snippet: snippet
      });
    } else {
      res.status(404).json({ error: 'Session not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to add snippet to session' });
  }
});

// Add image to a session
app.post('/api/sessions/:id/images', upload.single('image'), (req, res) => {
  try {
    const { id } = req.params;
    
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const imageId = generateUniqueShortCode(existingShortCodes);
    existingShortCodes.add(imageId);
    
    const imageInfo = {
      id: imageId,
      filename: req.file.filename,
      originalName: req.file.originalname,
      path: req.file.path,
      size: req.file.size,
      mimetype: req.file.mimetype,
      uploadedAt: new Date().toISOString()
    };

    // Add to both individual images and session
    imageFiles.set(imageId, imageInfo);
    
    if (addImageToSession(id, imageInfo)) {
      // Generate URLs based on environment
      const baseUrl = process.env.NODE_ENV === 'production' 
        ? `${req.protocol}://${req.get('host')}`
        : 'http://localhost:3000';
      
      res.json({
        success: true,
        imageId,
        sessionId: id,
        shareUrl: `${baseUrl}/session/${id}`,
        downloadUrl: `${req.protocol}://${req.get('host')}/api/images/${imageId}/download`,
        viewUrl: `${baseUrl}/image/${imageId}`,
        imageInfo: imageInfo
      });
    } else {
      res.status(404).json({ error: 'Session not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to add image to session' });
  }
});



// Serve static files from React build (only in production)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));

  // Handle React routing, return all requests to React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} to access the application`);
}); 