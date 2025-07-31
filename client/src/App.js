import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import CodeEditor from './components/CodeEditor';
import CodeViewer from './components/CodeViewer';
import ImageUploader from './components/ImageUploader';
import ImageViewer from './components/ImageViewer';
import SessionViewer from './components/SessionViewer';
import SessionCreator from './components/SessionCreator';
import Footer from './components/Footer';

function App() {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<CodeEditor />} />
            <Route path="/share/:id" element={<CodeViewer />} />
            <Route path="/upload-image" element={<ImageUploader />} />
            <Route path="/image/:id" element={<ImageViewer />} />
            <Route path="/session/:id" element={<SessionViewer />} />
            <Route path="/create-session" element={<SessionCreator />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App; 