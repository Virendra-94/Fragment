import React, { useState, useEffect } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check, Eye, Calendar, ArrowLeft, Share2 } from 'lucide-react';

const CodeViewer = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [snippet, setSnippet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  // Get return URL from query params (for session context)
  const returnUrl = searchParams.get('returnTo');
  const returnLabel = searchParams.get('returnLabel') || 'Back to Session';

  useEffect(() => {
    fetchSnippet();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchSnippet = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/snippets/${id}`);
      
      if (!response.ok) {
        throw new Error('Snippet not found');
      }
      
      const data = await response.json();
      setSnippet(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(snippet.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const copyShareUrl = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-white/80">Loading snippet...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-2xl font-bold text-white mb-4">Snippet Not Found</h1>
          <p className="text-white/70 mb-6">
            The code snippet you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to={returnUrl || "/"}
            className="btn-primary inline-flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{returnUrl ? returnLabel : 'Go Home'}</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            to={returnUrl || "/"}
            className="inline-flex items-center space-x-2 text-white/70 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{returnUrl ? returnLabel : 'Back to Home'}</span>
          </Link>
          
          <div className="card-dark p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  {snippet.title}
                </h1>
                {snippet.description && (
                  <p className="text-white/70 text-lg">
                    {snippet.description}
                  </p>
                )}
              </div>
              
              <div className="flex space-x-2 mt-4 md:mt-0">
                <button
                  onClick={copyToClipboard}
                  className="btn-secondary flex items-center space-x-2"
                >
                  {copied ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                  <span>{copied ? 'Copied!' : 'Copy Code'}</span>
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

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-white/60">
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>Created {formatDate(snippet.createdAt)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Eye className="w-4 h-4" />
                <span>{snippet.views} view{snippet.views !== 1 ? 's' : ''}</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="px-2 py-1 bg-primary-600 text-white rounded text-xs font-medium">
                  {snippet.language}
                </span>
              </div>
            </div>
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
                padding: '1.5rem',
                fontSize: '14px',
                lineHeight: '1.6',
                backgroundColor: '#1f2937'
              }}
              showLineNumbers={true}
              wrapLines={true}
            >
              {snippet.code}
            </SyntaxHighlighter>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <Link
            to="/create"
            className="btn-primary flex items-center justify-center space-x-2"
          >
            <span>Create Your Own Snippet</span>
          </Link>
          
          <Link
            to="/upload-image"
            className="btn-secondary flex items-center justify-center space-x-2"
          >
            <span>Upload an Image</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CodeViewer; 