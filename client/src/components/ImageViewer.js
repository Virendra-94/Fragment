import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Download, Share2, Copy, Check, ArrowLeft, Eye } from 'lucide-react';

const ImageViewer = () => {
  const { id } = useParams();
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchImage();
  }, [id]);

  const fetchImage = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/images/${id}/view`);
      
      if (!response.ok) {
        throw new Error('Image not found');
      }
      
      // Get the image URL
      const imageUrl = `/api/images/${id}/view`;
      setImageUrl(imageUrl);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
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
    copyToClipboard(window.location.href);
  };

  const copyDownloadUrl = () => {
    copyToClipboard(`${window.location.origin}/api/images/${id}/download`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-white/80">Loading image...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-2xl font-bold text-white mb-4">Image Not Found</h1>
          <p className="text-white/70 mb-6">
            The image you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/"
            className="btn-primary inline-flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Home</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-white/70 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Image Display */}
          <div className="lg:col-span-2">
            <div className="card-dark p-6">
              <div className="text-center">
                <img
                  src={imageUrl}
                  alt="Shared Image"
                  className="max-w-full h-auto rounded-lg shadow-lg"
                  onLoad={() => setLoading(false)}
                  onError={() => setError('Failed to load image')}
                />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Share Section */}
            <div className="card-dark p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                <Share2 className="w-5 h-5" />
                <span>Share Image</span>
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-white/80 text-sm mb-2">
                    View URL
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      value={window.location.href}
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
                      value={`${window.location.origin}/api/images/${id}/download`}
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

                <div className="flex space-x-3">
                  <a
                    href={imageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary flex-1 flex items-center justify-center space-x-2"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View Full Size</span>
                  </a>
                  
                  <a
                    href={`/api/images/${id}/download`}
                    download
                    className="btn-secondary flex-1 flex items-center justify-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card-dark p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Quick Actions
              </h3>
              
              <div className="space-y-3">
                <Link
                  to="/upload-image"
                  className="btn-primary w-full flex items-center justify-center space-x-2"
                >
                  <span>Upload Another Image</span>
                </Link>
                
                <Link
                  to="/create"
                  className="btn-secondary w-full flex items-center justify-center space-x-2"
                >
                  <span>Create Code Snippet</span>
                </Link>
              </div>
            </div>

            {/* Features */}
            <div className="glass rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                ✨ Features
              </h3>
              <ul className="space-y-2 text-white/70 text-sm">
                <li>• High-quality image display</li>
                <li>• Direct download links</li>
                <li>• Share via URL</li>
                <li>• Mobile responsive</li>
                <li>• Corporate-friendly</li>
                <li>• No registration needed</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageViewer; 