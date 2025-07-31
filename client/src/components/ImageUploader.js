import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, Download, Share2, Copy, Check, X } from 'lucide-react';

const ImageUploader = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (file) => {
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (data.success) {
        setUploadResult(data);
        // Scroll to result section
        document.getElementById('upload-result').scrollIntoView({ behavior: 'smooth' });
      } else {
        alert('Failed to upload image');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to upload image');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const copyShareUrl = () => {
    copyToClipboard(uploadResult.viewUrl);
  };

  const copyDownloadUrl = () => {
    copyToClipboard(uploadResult.downloadUrl);
  };

  const resetForm = () => {
    setSelectedFile(null);
    setPreview(null);
    setUploadResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Upload & Share Images
          </h1>
          <p className="text-xl text-white/80">
            Drag and drop your images or click to browse. Share them instantly with your team.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="space-y-6">
            {/* Upload Area */}
            <div
              className={`upload-area ${isDragOver ? 'dragover' : ''} ${
                preview ? 'border-green-400 bg-green-50' : ''
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInputChange}
                className="hidden"
              />
              
              {preview ? (
                <div className="space-y-4">
                  <div className="relative inline-block">
                    <img
                      src={preview}
                      alt="Preview"
                      className="max-w-full h-48 object-contain rounded-lg border-2 border-gray-300"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        resetForm();
                      }}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-center">
                    <p className="text-green-600 font-medium">
                      ✓ {selectedFile.name} selected
                    </p>
                    <p className="text-sm text-gray-600">
                      Size: {formatFileSize(selectedFile.size)}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-purple-600 rounded-full flex items-center justify-center mx-auto">
                    <ImageIcon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-gray-700 mb-2">
                      Drop your image here
                    </p>
                    <p className="text-gray-500 mb-4">
                      or click to browse files
                    </p>
                    <p className="text-sm text-gray-400">
                      Supports: JPG, PNG, GIF, WebP (max 10MB)
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Upload Button */}
            {selectedFile && (
              <button
                onClick={handleUpload}
                disabled={isLoading}
                className="btn-primary w-full py-4 text-lg flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="spinner"></div>
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    <span>Upload Image</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* Preview and Results Section */}
          <div className="space-y-6">
            {/* Upload Result */}
            {uploadResult && (
              <div id="upload-result" className="card-dark p-6 animate-fade-in">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                  <Share2 className="w-5 h-5" />
                  <span>Share Your Image</span>
                </h3>
                
                <div className="space-y-4">
                  {/* Image Preview */}
                  <div className="text-center">
                    <img
                      src={uploadResult.viewUrl}
                      alt="Uploaded"
                      className="max-w-full h-48 object-contain rounded-lg border border-gray-600 mx-auto"
                    />
                  </div>

                  {/* Share URLs */}
                  <div className="space-y-3">
                    <div>
                      <label className="block text-white/80 text-sm mb-2">
                        View URL
                      </label>
                      <div className="flex">
                        <input
                          type="text"
                          value={uploadResult.viewUrl}
                          readOnly
                          className="input-field rounded-r-none bg-gray-800 text-white text-sm"
                        />
                        <button
                          onClick={copyShareUrl}
                          className="px-3 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-r-lg transition-colors flex items-center space-x-1"
                        >
                          {copied ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-white/80 text-sm mb-2">
                        Download URL
                      </label>
                      <div className="flex">
                        <input
                          type="text"
                          value={uploadResult.downloadUrl}
                          readOnly
                          className="input-field rounded-r-none bg-gray-800 text-white text-sm"
                        />
                        <button
                          onClick={copyDownloadUrl}
                          className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-r-lg transition-colors flex items-center space-x-1"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3">
                    <a
                      href={uploadResult.viewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary flex-1 flex items-center justify-center space-x-2"
                    >
                      <ImageIcon className="w-4 h-4" />
                      <span>View Image</span>
                    </a>
                    
                    <a
                      href={uploadResult.downloadUrl}
                      download
                      className="btn-secondary flex-1 flex items-center justify-center space-x-2"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Tips */}
            <div className="glass rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                💡 Tips
              </h3>
              <ul className="space-y-2 text-white/70 text-sm">
                <li>• Supported formats: JPG, PNG, GIF, WebP</li>
                <li>• Maximum file size: 10MB</li>
                <li>• Use descriptive filenames for better organization</li>
                <li>• Share the view URL for preview, download URL for saving</li>
                <li>• Images are stored securely and accessible via unique URLs</li>
              </ul>
            </div>

            {/* Features */}
            <div className="glass rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                ✨ Features
              </h3>
              <ul className="space-y-2 text-white/70 text-sm">
                <li>• Drag & drop upload</li>
                <li>• Instant preview</li>
                <li>• Direct download links</li>
                <li>• Corporate-friendly hosting</li>
                <li>• No registration required</li>
                <li>• Mobile responsive</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageUploader; 