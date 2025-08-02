import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check, Eye, Calendar, Clock, ArrowLeft, Share2, RefreshCw, Code, Image as ImageIcon, Plus, X, Trash2 } from 'lucide-react';


const SessionViewer = () => {
  const { id } = useParams();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [showCodeForm, setShowCodeForm] = useState(false);
  const [showImageForm, setShowImageForm] = useState(false);
  const [codeForm, setCodeForm] = useState({ code: '', language: 'javascript', title: '', description: '' });
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingItems, setDeletingItems] = useState(new Set());

  useEffect(() => {
    fetchSession();
    // Set up auto-refresh every 30 seconds
    const interval = setInterval(fetchSession, 30000);
    return () => clearInterval(interval);
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchSession = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/sessions/${id}`);
      
      if (!response.ok) {
        throw new Error('Session not found');
      }
      
      const data = await response.json();
      setSession(data);
      setLastUpdated(new Date().toLocaleTimeString());
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

  const handleAddCode = async (e) => {
    e.preventDefault();
    if (!codeForm.code.trim()) {
      alert('Please enter some code');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/sessions/${id}/snippets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: codeForm.code.trim(),
          language: codeForm.language,
          title: codeForm.title.trim() || 'Untitled',
          description: codeForm.description.trim()
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        // Reset form and refresh session
        setCodeForm({ code: '', language: 'javascript', title: '', description: '' });
        setShowCodeForm(false);
        fetchSession();
      } else {
        alert('Failed to add code to session');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to add code to session');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSnippet = async (snippetId) => {
    if (!window.confirm('Are you sure you want to remove this code snippet from the session?')) {
      return;
    }

    setDeletingItems(prev => new Set([...prev, `snippet-${snippetId}`]));
    try {
      const response = await fetch(`/api/sessions/${id}/snippets/${snippetId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (data.success) {
        fetchSession(); // Refresh session data
      } else {
        alert('Failed to remove snippet from session');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to remove snippet from session');
    } finally {
      setDeletingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(`snippet-${snippetId}`);
        return newSet;
      });
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (limit to 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        e.target.value = '';
        return;
      }
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        e.target.value = '';
        return;
      }
      
      setSelectedFile(file);
    } else {
      setSelectedFile(null);
    }
  };

  const handleAddImage = async (e) => {
    e.preventDefault();
    
    if (!selectedFile) {
      alert('Please select an image file');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append('image', selectedFile);
      
      const response = await fetch(`/api/sessions/${id}/images`, {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Reset form
        setSelectedFile(null);
        setShowImageForm(false);
        
        // Reset file input
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) {
          fileInput.value = '';
        }
        
        // Refresh session data to show new image
        await fetchSession();
        
        alert('Image added successfully!');
      } else {
        alert(data.error || 'Failed to add image to session');
      }
    } catch (error) {
      console.error('Error adding image:', error);
      alert('Failed to add image to session');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteImage = async (imageId) => {
    if (!window.confirm('Are you sure you want to remove this image from the session?')) {
      return;
    }

    setDeletingItems(prev => {
      const newSet = new Set(prev);
      newSet.add(`image-${imageId}`);
      return newSet;
    });

    try {
      const response = await fetch(`/api/sessions/${id}/images/${imageId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (data.success) {
        fetchSession(); // Refresh session data
      } else {
        alert('Failed to remove image from session');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to remove image from session');
    } finally {
      setDeletingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(`image-${imageId}`);
        return newSet;
      });
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading session...</div>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-red-400 text-xl">Error: {error || 'Session not found'}</div>
      </div>
    );
  }

  // Create safe session object to prevent undefined errors
  const safeSession = {
    ...session,
    snippets: session.snippets || [],
    images: session.images || []
  };

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
          
          <div className="card-dark p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  Live Sharing Session
                </h1>
                <p className="text-white/70 text-lg">
                  Session ID: {safeSession.id}
                </p>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
                <button
                  onClick={() => setShowCodeForm(true)}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Code</span>
                </button>
                
                <button
                  onClick={() => setShowImageForm(true)}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Images</span>
                </button>
                
                <button
                  onClick={fetchSession}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Refresh</span>
                </button>
                
                <button
                  onClick={copyShareUrl}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </button>
              </div>
            </div>

            {/* Session Meta Information */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-white/60">
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>Created {formatDate(safeSession.createdAt)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>Last updated {formatDate(safeSession.lastUpdated)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Code className="w-4 h-4" />
                <span>{safeSession.snippets.length} code snippet{safeSession.snippets.length !== 1 ? 's' : ''}</span>
              </div>
              <div className="flex items-center space-x-1">
                <ImageIcon className="w-4 h-4" />
                <span>{safeSession.images.length} image{safeSession.images.length !== 1 ? 's' : ''}</span>
              </div>
              {lastUpdated && (
                <div className="flex items-center space-x-1 text-green-400">
                  <span>✓ Auto-refreshed at {lastUpdated}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-8">
          {/* Code Snippets */}
          {safeSession.snippets.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
                  <Code className="w-6 h-6" />
                  <span>Code Snippets</span>
                </h2>
                <button
                  onClick={() => setShowCodeForm(true)}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add More Code</span>
                </button>
              </div>
              
              <div className="space-y-6">
                {safeSession.snippets.map((snippet, index) => (
                  <div key={snippet.id} className="card-dark p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-2">
                          {snippet.title}
                        </h3>
                        <div className="text-white/60 text-sm mb-2">
                          <span className="inline-flex items-center space-x-2">
                            <span>{snippet.language || 'text'}</span>
                            <span>•</span>
                            <span>{snippet.views || 0} view{(snippet.views || 0) !== 1 ? 's' : ''}</span>
                          </span>
                        </div>
                        {snippet.description && (
                          <p className="text-white/70">
                            {snippet.description}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex space-x-2 mt-4 md:mt-0">
                        <button
                          onClick={() => copyToClipboard(snippet.code)}
                          className="btn-secondary flex items-center space-x-2"
                        >
                          {copied ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                          <span>{copied ? 'Copied!' : 'Copy Code'}</span>
                        </button>
                        
                        <Link
                          to={`/share/${snippet.id}?returnTo=${encodeURIComponent(`/session/${id}`)}&returnLabel=${encodeURIComponent('Back to Session')}`}
                          className="btn-primary flex items-center space-x-2"
                        >
                          <Eye className="w-4 h-4" />
                          <span>View Full</span>
                        </Link>
                        
                        <button
                          onClick={() => handleDeleteSnippet(snippet.id)}
                          disabled={deletingItems.has(`snippet-${snippet.id}`)}
                          className="btn-danger flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Remove from session"
                        >
                          {deletingItems.has(`snippet-${snippet.id}`) ? (
                            <div className="spinner w-4 h-4"></div>
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                          <span className="hidden sm:inline">{deletingItems.has(`snippet-${snippet.id}`) ? 'Removing...' : 'Remove'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Code Display */}
                    <div className="card-dark overflow-hidden">
                      <div className="bg-gray-800 px-4 py-3 border-b border-gray-700 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        </div>
                        <span className="text-white/60 text-sm font-mono">
                          {snippet.language}
                        </span>
                      </div>
                      
                      <div className="p-0">
                        <SyntaxHighlighter
                          language={snippet.language}
                          style={tomorrow}
                          customStyle={{
                            margin: 0,
                            padding: '1rem',
                            fontSize: '14px',
                            lineHeight: '1.5',
                            backgroundColor: '#1f2937',
                            maxHeight: '300px',
                            overflow: 'auto'
                          }}
                          showLineNumbers={true}
                          wrapLines={true}
                        >
                          {snippet.code}
                        </SyntaxHighlighter>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center gap-4 text-sm text-white/60">
                      <span>Created {formatDate(snippet.createdAt)}</span>
                      <span>{snippet.views} view{snippet.views !== 1 ? 's' : ''}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Images */}
          {safeSession.images.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
                  <ImageIcon className="w-6 h-6" />
                  <span>Images</span>
                </h2>
                <button
                  onClick={() => setShowImageForm(true)}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add More Images</span>
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {safeSession.images.map((image) => (
                  <div key={image.id} className="card-dark p-4">
                    <div className="text-center mb-4">
                      <img
                        src={`/api/images/${image.id}/view`}
                        alt={image.originalName}
                        className="max-w-full h-32 object-contain rounded-lg border border-gray-600 mx-auto"
                      />
                    </div>
                    
                    <div className="text-center">
                      <h3 className="text-white font-medium mb-2 truncate">
                        {image.originalName}
                      </h3>
                      <div className="text-white/60 text-sm mb-3 space-y-1">
                        <p>{(image.size / 1024 / 1024).toFixed(2)} MB</p>
                        <p>{image.views || 0} view{(image.views || 0) !== 1 ? 's' : ''}</p>
                      </div>
                      
                      <div className="flex flex-col space-y-2">
                        <div className="flex space-x-2">
                          <a
                            href={`/api/images/${image.id}/download`}
                            download
                            className="btn-secondary flex-1 flex items-center justify-center space-x-2 text-sm"
                          >
                            <span>Download</span>
                          </a>
                          
                          <Link
                            to={`/image/${image.id}`}
                            className="btn-primary flex-1 flex items-center justify-center space-x-2 text-sm"
                          >
                            <Eye className="w-4 h-4" />
                            <span>View</span>
                          </Link>
                        </div>
                        
                        <button
                          onClick={() => handleDeleteImage(image.id)}
                          disabled={deletingItems.has(`image-${image.id}`)}
                          className="btn-danger w-full flex items-center justify-center space-x-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Remove from session"
                        >
                          {deletingItems.has(`image-${image.id}`) ? (
                            <div className="spinner w-4 h-4"></div>
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                          <span>{deletingItems.has(`image-${image.id}`) ? 'Removing...' : 'Remove'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {safeSession.snippets.length === 0 && safeSession.images.length === 0 && !showCodeForm && !showImageForm && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <h2 className="text-2xl font-bold text-white mb-4">No Content Yet</h2>
              <p className="text-white/70 mb-6">
                This session is ready to receive code snippets and images. 
                Share this URL with others to start collaborating!
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setShowCodeForm(true)}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Code className="w-4 h-4" />
                  <span>Add Code</span>
                </button>
                <button
                  onClick={() => setShowImageForm(true)}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <ImageIcon className="w-4 h-4" />
                  <span>Add Image</span>
                </button>
              </div>
            </div>
          )}

          {/* Add Code Form */}
          {showCodeForm && (
            <div className="card-dark p-6 animate-fade-in">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                  <Code className="w-5 h-5" />
                  <span>Add Code to Session</span>
                </h3>
                <button
                  onClick={() => setShowCodeForm(false)}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleAddCode} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white font-medium mb-2">
                      Title (Optional)
                    </label>
                    <input
                      type="text"
                      value={codeForm.title}
                      onChange={(e) => setCodeForm({...codeForm, title: e.target.value})}
                      placeholder="Enter a title for your code"
                      className="input-field"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white font-medium mb-2">
                      Language
                    </label>
                    <select
                      value={codeForm.language}
                      onChange={(e) => setCodeForm({...codeForm, language: e.target.value})}
                      className="input-field"
                    >
                      <option value="javascript">JavaScript</option>
                      <option value="python">Python</option>
                      <option value="java">Java</option>
                      <option value="cpp">C++</option>
                      <option value="csharp">C#</option>
                      <option value="php">PHP</option>
                      <option value="html">HTML</option>
                      <option value="css">CSS</option>
                      <option value="sql">SQL</option>
                      <option value="json">JSON</option>
                      <option value="text">Plain Text</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-white font-medium mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    value={codeForm.description}
                    onChange={(e) => setCodeForm({...codeForm, description: e.target.value})}
                    placeholder="Describe what your code does"
                    rows="2"
                    className="input-field resize-none"
                  />
                </div>
                
                <div>
                  <label className="block text-white font-medium mb-2">
                    Code
                  </label>
                  <textarea
                    value={codeForm.code}
                    onChange={(e) => setCodeForm({...codeForm, code: e.target.value})}
                    placeholder="Enter your code here..."
                    rows="10"
                    className="code-editor w-full bg-gray-900 text-gray-100 rounded-lg p-4 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                    spellCheck="false"
                  />
                </div>
                
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    disabled={isSubmitting || !codeForm.code.trim()}
                    className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="spinner"></div>
                        <span>Adding...</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        <span>Add to Session</span>
                      </>
                    )}
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setShowCodeForm(false)}
                    className="btn-secondary flex items-center space-x-2"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Add Image Form */}
          {showImageForm && (
            <div className="card-dark p-6 animate-fade-in">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                  <ImageIcon className="w-5 h-5" />
                  <span>Add Image to Session</span>
                </h3>
                <button
                  onClick={() => setShowImageForm(false)}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleAddImage} className="space-y-4">
                <div>
                  <label className="block text-white font-medium mb-2">
                    Select Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="input-field"
                  />
                  {selectedFile && (
                    <p className="text-green-400 text-sm mt-2">
                      ✓ {selectedFile.name} selected ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  )}
                </div>
                
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    disabled={isSubmitting || !selectedFile}
                    className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="spinner"></div>
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        <span>Add to Session</span>
                      </>
                    )}
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setShowImageForm(false)}
                    className="btn-secondary flex items-center space-x-2"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Add Content Buttons - Only show when there's content and no forms are open */}
        {(session && session.snippets && session.images && (session.snippets.length > 0 || session.images.length > 0)) && !showCodeForm && !showImageForm && (
          <div className="mt-12 flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => setShowCodeForm(true)}
              className="btn-primary flex items-center justify-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add More Code</span>
            </button>
            
            <button
              onClick={() => setShowImageForm(true)}
              className="btn-secondary flex items-center justify-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add More Images</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SessionViewer; 