import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Share2, Check, Code, Save, Eye } from 'lucide-react';

const CodeEditor = () => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [copied, setCopied] = useState(false);

  const languages = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'cpp', label: 'C++' },
    { value: 'csharp', label: 'C#' },
    { value: 'php', label: 'PHP' },
    { value: 'ruby', label: 'Ruby' },
    { value: 'go', label: 'Go' },
    { value: 'rust', label: 'Rust' },
    { value: 'swift', label: 'Swift' },
    { value: 'kotlin', label: 'Kotlin' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'html', label: 'HTML' },
    { value: 'css', label: 'CSS' },
    { value: 'sql', label: 'SQL' },
    { value: 'json', label: 'JSON' },
    { value: 'xml', label: 'XML' },
    { value: 'yaml', label: 'YAML' },
    { value: 'markdown', label: 'Markdown' },
    { value: 'bash', label: 'Bash' },
    { value: 'text', label: 'Plain Text' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!code.trim()) {
      alert('Please enter some code');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/snippets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: code.trim(),
          language,
          title: title.trim() || 'Untitled',
          description: description.trim()
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setShareUrl(data.shareUrl);
        // Scroll to share section with null check
        const shareSection = document.getElementById('share-section');
        if (shareSection) {
          shareSection.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        alert('Failed to create snippet');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to create snippet');
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

  const copyCode = () => {
    copyToClipboard(code);
  };

  const copyShareUrl = () => {
    copyToClipboard(shareUrl);
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Create Code Snippet
          </h1>
          <p className="text-xl text-white/80">
            Write your code, choose a language, and share it instantly
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Editor Section */}
          <div className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title and Description */}
              <div className="space-y-4">
                <div>
                  <label className="block text-white font-medium mb-2">
                    Title (Optional)
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter a title for your code snippet"
                    className="input-field"
                  />
                </div>
                
                <div>
                  <label className="block text-white font-medium mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe what your code does"
                    rows="3"
                    className="input-field resize-none"
                  />
                </div>
              </div>

              {/* Language Selection */}
              <div>
                <label className="block text-white font-medium mb-2">
                  Programming Language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="input-field"
                >
                  {languages.map((lang) => (
                    <option key={lang.value} value={lang.value}>
                      {lang.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Code Editor */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-white font-medium">
                    Code
                  </label>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={copyCode}
                      className="flex items-center space-x-1 text-white/70 hover:text-white transition-colors"
                    >
                      {copied ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                      <span className="text-sm">
                        {copied ? 'Copied!' : 'Copy'}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowPreview(!showPreview)}
                      className="flex items-center space-x-1 text-white/70 hover:text-white transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      <span className="text-sm">
                        {showPreview ? 'Hide' : 'Preview'}
                      </span>
                    </button>
                  </div>
                </div>
                
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Enter your code here..."
                  rows="20"
                  className="code-editor w-full bg-gray-900 text-gray-100 rounded-lg p-4 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                  spellCheck="false"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || !code.trim()}
                className="btn-primary w-full py-4 text-lg flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="spinner"></div>
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    <span>Create & Share</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Preview Section */}
          <div className="space-y-6">
            {/* Code Preview */}
            {showPreview && code && (
              <div className="card-dark p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                  <Code className="w-5 h-5" />
                  <span>Preview</span>
                </h3>
                <div className="rounded-lg overflow-hidden">
                  <SyntaxHighlighter
                    language={language}
                    style={tomorrow}
                    customStyle={{
                      margin: 0,
                      borderRadius: '0.5rem',
                      fontSize: '14px',
                      lineHeight: '1.5'
                    }}
                  >
                    {code}
                  </SyntaxHighlighter>
                </div>
              </div>
            )}

            {/* Share Section */}
            {shareUrl && (
              <div id="share-section" className="card-dark p-6 animate-fade-in">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                  <Share2 className="w-5 h-5" />
                  <span>Share Your Code</span>
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-white/80 text-sm mb-2">
                      Share URL
                    </label>
                    <div className="flex">
                      <input
                        type="text"
                        value={shareUrl}
                        readOnly
                        className="input-field rounded-r-none bg-gray-800 text-white"
                      />
                      <button
                        onClick={copyShareUrl}
                        className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-r-lg transition-colors flex items-center space-x-2"
                      >
                        <Copy className="w-4 h-4" />
                        <span>Copy</span>
                      </button>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <a
                      href={shareUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary flex-1 flex items-center justify-center space-x-2"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View Snippet</span>
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
                <li>• Use descriptive titles to help others understand your code</li>
                <li>• Add comments in your code for better clarity</li>
                <li>• Choose the correct programming language for proper syntax highlighting</li>
                <li>• Share the URL with your team for instant collaboration</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor; 