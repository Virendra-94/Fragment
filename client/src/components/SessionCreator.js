import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Users, Clock, Copy, Check, Share2, Zap } from 'lucide-react';

const SessionCreator = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [sessionData, setSessionData] = useState(null);
  const [copied, setCopied] = useState(false);

  const createSession = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (data.success) {
        setSessionData(data);
      } else {
        alert('Failed to create session');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to create session');
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
    copyToClipboard(sessionData.shareUrl);
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Create Live Sharing Session
          </h1>
          <p className="text-xl text-white/80">
            Start a collaborative session where multiple people can share code and images in real-time
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Session Creation */}
          <div className="space-y-6">
            <div className="card-dark p-6">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center space-x-2">
                <Plus className="w-6 h-6" />
                <span>Create New Session</span>
              </h2>
              
              <p className="text-white/70 mb-6">
                Create a new sharing session that allows multiple people to contribute code snippets and images. 
                Everyone with the session URL can view the content in real-time.
              </p>

              <button
                onClick={createSession}
                disabled={isLoading}
                className="btn-primary w-full py-4 text-lg flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="spinner"></div>
                    <span>Creating Session...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    <span>Create Live Session</span>
                  </>
                )}
              </button>
            </div>

            {/* Session Result */}
            {sessionData && (
              <div className="card-dark p-6 animate-fade-in">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                  <Share2 className="w-5 h-5" />
                  <span>Session Created!</span>
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-white/80 text-sm mb-2">
                      Session URL
                    </label>
                    <div className="flex">
                      <input
                        type="text"
                        value={sessionData.shareUrl}
                        readOnly
                        className="input-field rounded-r-none bg-gray-800 text-white"
                      />
                      <button
                        onClick={copyShareUrl}
                        className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-r-lg transition-colors flex items-center space-x-2"
                      >
                        {copied ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <a
                      href={sessionData.shareUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary flex-1 flex items-center justify-center space-x-2"
                    >
                      <Users className="w-4 h-4" />
                      <span>Open Session</span>
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Features and Instructions */}
          <div className="space-y-6">
            {/* How It Works */}
            <div className="card-dark p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                🚀 How Live Sessions Work
              </h3>
              <div className="space-y-3 text-white/70 text-sm">
                <div className="flex items-start space-x-2">
                  <span className="bg-primary-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mt-0.5">1</span>
                  <span>Create a session and get a unique 6-character URL</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="bg-primary-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mt-0.5">2</span>
                  <span>Share the URL with your team or collaborators</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="bg-primary-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mt-0.5">3</span>
                  <span>Everyone can add code snippets and images to the session</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="bg-primary-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mt-0.5">4</span>
                  <span>Content updates automatically - just refresh to see new items</span>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="card-dark p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                ✨ Session Features
              </h3>
              <ul className="space-y-2 text-white/70 text-sm">
                <li>• <strong>Real-time Updates</strong>: Auto-refresh every 30 seconds</li>
                <li>• <strong>Multiple Contributors</strong>: Anyone with the URL can add content</li>
                <li>• <strong>Code & Images</strong>: Share both code snippets and images</li>
                <li>• <strong>Live Collaboration</strong>: Perfect for team meetings and presentations</li>
                <li>• <strong>Short URLs</strong>: Easy to share and remember</li>
                <li>• <strong>No Registration</strong>: Start sharing immediately</li>
              </ul>
            </div>

            {/* Use Cases
            <div className="card-dark p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                💡 Perfect For
              </h3>
              <ul className="space-y-2 text-white/70 text-sm">
                <li>• <strong>Team Meetings</strong>: Share code during discussions</li>
                <li>• <strong>Code Reviews</strong>: Collect feedback and suggestions</li>
                <li>• <strong>Presentations</strong>: Live demo with code examples</li>
                <li>• <strong>Bug Reports</strong>: Share code and screenshots</li>
                <li>• <strong>Learning Sessions</strong>: Collaborative coding tutorials</li>
                <li>• <strong>Remote Collaboration</strong>: Work together from anywhere</li>
              </ul>
            </div> */}

            {/* Quick Actions */}
            <div className="card-dark p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <Link
                  to="/create"
                  className="btn-secondary w-full flex items-center justify-center space-x-2"
                >
                  <span>Create Individual Code Snippet</span>
                </Link>
                <Link
                  to="/upload-image"
                  className="btn-secondary w-full flex items-center justify-center space-x-2"
                >
                  <span>Upload Individual Image</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionCreator; 