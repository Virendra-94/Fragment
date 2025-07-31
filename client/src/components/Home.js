import React from 'react';
import { Link } from 'react-router-dom';
import { Code, Image, Share2, Download, Zap, Shield, Globe, Users } from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: <Users className="w-8 h-8" />,
      title: "Live Sessions",
      description: "Create collaborative sessions where multiple people can share code and images in real-time."
    },
    {
      icon: <Code className="w-8 h-8" />,
      title: "Share Code",
      description: "Create and share code snippets with syntax highlighting and multiple language support."
    },
    {
      icon: <Image className="w-8 h-8" />,
      title: "Upload Images",
      description: "Upload and share images with easy download links for your team."
    },
    {
      icon: <Share2 className="w-8 h-8" />,
      title: "Simple Sharing",
      description: "Get unique URLs for your content that anyone can access instantly."
    },
    {
      icon: <Download className="w-8 h-8" />,
      title: "Easy Downloads",
      description: "Download shared images and copy code with just one click."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Corporate Safe",
      description: "Designed to work seamlessly in corporate environments without blocking issues."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl font-bold text-slate-200 mb-6 leading-tight drop-shadow-lg">
              Share Code & Images
              <span className="block bg-gradient-to-r from-slate-300 to-slate-400 bg-clip-text text-transparent drop-shadow-sm">
                Instantly
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto drop-shadow-sm">
              Create, share, and collaborate with your team using simple URLs. 
              Perfect for corporate environments and team collaboration.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link
              to="/create-session"
              className="btn-primary text-lg px-8 py-4 flex items-center space-x-2 group"
            >
              <Users className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>Create Live Session</span>
            </Link>
            <Link
              to="/create"
              className="btn-secondary text-lg px-8 py-4 flex items-center space-x-2 group"
            >
              <Code className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>Create Code Snippet</span>
            </Link>
            <Link
              to="/upload-image"
              className="btn-secondary text-lg px-8 py-4 flex items-center space-x-2 group"
            >
              <Image className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>Upload Image</span>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="glass rounded-xl p-6 text-center shadow-xl">
              <div className="text-4xl font-bold text-slate-300 mb-2 drop-shadow-sm">∞</div>
              <div className="text-slate-200 font-medium">Unlimited Sharing</div>
            </div>
            <div className="glass rounded-xl p-6 text-center shadow-xl">
              <div className="text-4xl font-bold text-slate-300 mb-2 drop-shadow-sm">⚡</div>
              <div className="text-slate-200 font-medium">Instant Access</div>
            </div>
            <div className="glass rounded-xl p-6 text-center shadow-xl">
              <div className="text-4xl font-bold text-slate-300 mb-2 drop-shadow-sm">🔒</div>
              <div className="text-slate-200 font-medium">Corporate Safe</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-200 mb-6 drop-shadow-lg">
              Everything You Need to Share
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto drop-shadow-sm">
              Powerful features designed for modern teams and corporate environments
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="glass rounded-xl p-8 text-center hover:scale-105 transition-all duration-300 group shadow-xl"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-slate-600 to-slate-700 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-200 shadow-lg">
                  <div className="text-slate-200">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-slate-200 mb-4 drop-shadow-sm">
                  {feature.title}
                </h3>
                <p className="text-slate-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              How It Works
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Three simple steps to share your content with anyone
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Create or Upload</h3>
              <p className="text-white/70">
                Write your code or upload an image using our simple interface
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Get Share Link</h3>
              <p className="text-white/70">
                Instantly receive a unique URL for your content
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Share & Collaborate</h3>
              <p className="text-white/70">
                Share the link with your team and start collaborating
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass rounded-2xl p-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Start Sharing?
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Join thousands of developers and teams who trust Fragment for their collaboration needs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/create"
                className="btn-primary text-lg px-8 py-4 flex items-center justify-center space-x-2 group"
              >
                <Zap className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>Start Sharing Now</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 