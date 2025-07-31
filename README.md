# CodeShare - Share Code & Images Instantly

A modern, user-friendly web application for sharing code snippets and images with your team. Built with React, Node.js, and Tailwind CSS, designed to work seamlessly in corporate environments.

## ✨ Features

### Code Sharing
- **Syntax Highlighting**: Support for 20+ programming languages
- **Real-time Preview**: See your code with syntax highlighting before sharing
- **Copy to Clipboard**: One-click code copying
- **Short URLs**: Each snippet gets a short, memorable 6-character URL
- **View Tracking**: See how many times your code has been viewed

### Image Sharing
- **Drag & Drop Upload**: Easy image upload with drag-and-drop support
- **Multiple Formats**: Support for JPG, PNG, GIF, WebP
- **Direct Download Links**: Share download URLs for easy access
- **Preview Support**: View images before sharing
- **File Size Limit**: 10MB maximum file size

### Corporate-Friendly
- **No Registration Required**: Start sharing immediately
    - **Short URLs**: 6-character codes that are easy to remember and share
- **Mobile Responsive**: Works on all devices
- **Clean Interface**: Professional design suitable for business use
- **No External Dependencies**: Self-hosted solution

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd codeshare-app
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   npm install
   
   # Install frontend dependencies
   cd client
   npm install
   cd ..
   ```

3. **Start the development server**
   ```bash
   # Windows
   start-dev.bat
   
   # Unix/Mac
   chmod +x start-dev.sh
   ./start-dev.sh
   
   # Or manually start both servers:
   # Terminal 1: npm run server
   # Terminal 2: cd client && npm start
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📁 Project Structure

```
codeshare-app/
├── server/
│   ├── index.js          # Express server
│   └── uploads/          # Image storage directory
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── App.js        # Main app component
│   │   └── index.js      # Entry point
│   ├── package.json
│   └── tailwind.config.js
├── package.json
└── README.md
```

## 🛠️ Usage

### Creating Code Snippets

1. Navigate to `/create` or click "Create Code Snippet"
2. Enter your code in the editor
3. Select the programming language
4. Add an optional title and description
5. Click "Create & Share"
6. Copy the generated short URL (e.g., `http://localhost:3000/share/Ab3x9Y`) to share with others

### Short URL System

- **6-Character Codes**: Each snippet and image gets a unique 6-character code
- **Easy to Remember**: Codes like `Ab3x9Y`, `K9mN2p`, `X7vR4q`
- **Highly Unique**: 56+ billion possible combinations (62^6)
- **Alphanumeric**: Uses A-Z, a-z, 0-9 for maximum readability

### Uploading Images

1. Navigate to `/upload-image` or click "Upload Image"
2. Drag and drop an image or click to browse
3. Click "Upload Image"
4. Copy the view URL or download URL to share

### Viewing Shared Content

- **Code Snippets**: Visit `/share/{snippet-id}`
- **Images**: Visit `/image/{image-id}`

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
NODE_ENV=development
```

### Customization

#### Changing the Port
Edit the `PORT` variable in `server/index.js` or set it in your environment.

#### File Upload Limits
Modify the file size limit in `server/index.js`:
```javascript
limits: {
  fileSize: 10 * 1024 * 1024 // 10MB limit
}
```

#### Supported Image Formats
Update the file filter in `server/index.js`:
```javascript
const allowedTypes = /jpeg|jpg|png|gif|webp/;
```

## 🚀 Deployment

### Production Build

1. **Build the React app**
   ```bash
   cd client
   npm run build
   cd ..
   ```

2. **Start the production server**
   ```bash
   npm start
   ```

### Docker Deployment

Create a `Dockerfile`:

```dockerfile
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN cd client && npm install && npm run build

EXPOSE 5000

CMD ["npm", "start"]
```

### Environment Considerations

- **Corporate Networks**: The app uses standard HTTP/HTTPS ports and doesn't require special firewall rules
- **File Storage**: Images are stored locally in the `server/uploads` directory
- **Database**: Currently uses in-memory storage (consider adding a database for production)

## 🎨 Customization

### Styling
The app uses Tailwind CSS. Modify `client/tailwind.config.js` to customize colors, fonts, and other design elements.

### Adding Languages
Edit the `languages` array in `client/src/components/CodeEditor.js` to add more programming language support.

### Branding
Update the logo, colors, and text in the components to match your organization's branding.

## 🔒 Security Features

- **File Type Validation**: Only image files are accepted
- **File Size Limits**: Prevents large file uploads
- **CORS Configuration**: Properly configured for security
- **Input Sanitization**: All inputs are properly handled
- **Helmet.js**: Security headers for Express

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support or questions:
- Create an issue in the repository
- Check the documentation
- Review the code comments

## 🔄 Updates

### Version 1.0.0
- Initial release
- Code sharing with syntax highlighting
- Image upload and sharing
- Responsive design
- Corporate-friendly features

---

**Made with ❤️ for developers and teams** 