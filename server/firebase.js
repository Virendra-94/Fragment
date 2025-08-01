// Firebase configuration and initialization
const { initializeApp } = require('firebase/app');
const { getDatabase, ref, set, get, remove, push, child, serverTimestamp } = require('firebase/database');

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC8ZtUngfgKA9XiH9IMEHYR5sM-3DlIKow",
  authDomain: "fragment-de7d9.firebaseapp.com",
  databaseURL: "https://fragment-de7d9-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "fragment-de7d9",
  storageBucket: "fragment-de7d9.firebasestorage.app",
  messagingSenderId: "819862066610",
  appId: "1:819862066610:web:138698a088349ccedd80ab",
  measurementId: "G-ZECJ66LH16"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Database helper functions
class FirebaseStorage {
  // Sessions
  async saveSession(sessionId, sessionData) {
    try {
      const sessionRef = ref(database, `sessions/${sessionId}`);
      await set(sessionRef, {
        ...sessionData,
        createdAt: sessionData.createdAt || new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        expiresAt: new Date(Date.now() + (20 * 24 * 60 * 60 * 1000)).toISOString() // 20 days from now
      });
      return true;
    } catch (error) {
      console.error('Error saving session:', error);
      return false;
    }
  }

  async getSession(sessionId) {
    try {
      const sessionRef = ref(database, `sessions/${sessionId}`);
      const snapshot = await get(sessionRef);
      if (snapshot.exists()) {
        const session = snapshot.val();
        // Check if session has expired
        if (new Date(session.expiresAt) < new Date()) {
          await this.deleteSession(sessionId);
          return null;
        }
        return session;
      }
      return null;
    } catch (error) {
      console.error('Error getting session:', error);
      return null;
    }
  }

  async deleteSession(sessionId) {
    try {
      const sessionRef = ref(database, `sessions/${sessionId}`);
      await remove(sessionRef);
      return true;
    } catch (error) {
      console.error('Error deleting session:', error);
      return false;
    }
  }

  async getAllSessions() {
    try {
      const sessionsRef = ref(database, 'sessions');
      const snapshot = await get(sessionsRef);
      if (snapshot.exists()) {
        return snapshot.val();
      }
      return {};
    } catch (error) {
      console.error('Error getting all sessions:', error);
      return {};
    }
  }

  // Code Snippets
  async saveSnippet(snippetId, snippetData) {
    try {
      const snippetRef = ref(database, `snippets/${snippetId}`);
      await set(snippetRef, {
        ...snippetData,
        createdAt: snippetData.createdAt || new Date().toISOString(),
        expiresAt: new Date(Date.now() + (20 * 24 * 60 * 60 * 1000)).toISOString() // 20 days from now
      });
      return true;
    } catch (error) {
      console.error('Error saving snippet:', error);
      return false;
    }
  }

  async getSnippet(snippetId) {
    try {
      const snippetRef = ref(database, `snippets/${snippetId}`);
      const snapshot = await get(snippetRef);
      if (snapshot.exists()) {
        const snippet = snapshot.val();
        // Check if snippet has expired
        if (new Date(snippet.expiresAt) < new Date()) {
          await this.deleteSnippet(snippetId);
          return null;
        }
        return snippet;
      }
      return null;
    } catch (error) {
      console.error('Error getting snippet:', error);
      return null;
    }
  }

  async deleteSnippet(snippetId) {
    try {
      const snippetRef = ref(database, `snippets/${snippetId}`);
      await remove(snippetRef);
      return true;
    } catch (error) {
      console.error('Error deleting snippet:', error);
      return false;
    }
  }

  async updateSnippetViews(snippetId, views) {
    try {
      const snippetRef = ref(database, `snippets/${snippetId}/views`);
      await set(snippetRef, views);
      return true;
    } catch (error) {
      console.error('Error updating snippet views:', error);
      return false;
    }
  }

  // Images
  async saveImage(imageId, imageData) {
    try {
      const imageRef = ref(database, `images/${imageId}`);
      await set(imageRef, {
        ...imageData,
        uploadedAt: imageData.uploadedAt || new Date().toISOString(),
        expiresAt: new Date(Date.now() + (20 * 24 * 60 * 60 * 1000)).toISOString() // 20 days from now
      });
      return true;
    } catch (error) {
      console.error('Error saving image:', error);
      return false;
    }
  }

  async getImage(imageId) {
    try {
      const imageRef = ref(database, `images/${imageId}`);
      const snapshot = await get(imageRef);
      if (snapshot.exists()) {
        const image = snapshot.val();
        // Check if image has expired
        if (new Date(image.expiresAt) < new Date()) {
          await this.deleteImage(imageId);
          return null;
        }
        return image;
      }
      return null;
    } catch (error) {
      console.error('Error getting image:', error);
      return null;
    }
  }

  async deleteImage(imageId) {
    try {
      const imageRef = ref(database, `images/${imageId}`);
      await remove(imageRef);
      return true;
    } catch (error) {
      console.error('Error deleting image:', error);
      return false;
    }
  }

  // Cleanup expired items
  async cleanupExpiredItems() {
    try {
      const now = new Date();
      let cleanedCount = 0;

      // Cleanup sessions
      const sessions = await this.getAllSessions();
      for (const [sessionId, session] of Object.entries(sessions)) {
        if (session.expiresAt && new Date(session.expiresAt) < now) {
          await this.deleteSession(sessionId);
          cleanedCount++;
          console.log(`Cleaned up expired session: ${sessionId}`);
        }
      }

      // Cleanup snippets
      const snippetsRef = ref(database, 'snippets');
      const snippetsSnapshot = await get(snippetsRef);
      if (snippetsSnapshot.exists()) {
        const snippets = snippetsSnapshot.val();
        for (const [snippetId, snippet] of Object.entries(snippets)) {
          if (snippet.expiresAt && new Date(snippet.expiresAt) < now) {
            await this.deleteSnippet(snippetId);
            cleanedCount++;
            console.log(`Cleaned up expired snippet: ${snippetId}`);
          }
        }
      }

      // Cleanup images
      const imagesRef = ref(database, 'images');
      const imagesSnapshot = await get(imagesRef);
      if (imagesSnapshot.exists()) {
        const images = imagesSnapshot.val();
        for (const [imageId, image] of Object.entries(images)) {
          if (image.expiresAt && new Date(image.expiresAt) < now) {
            await this.deleteImage(imageId);
            cleanedCount++;
            console.log(`Cleaned up expired image: ${imageId}`);
          }
        }
      }

      if (cleanedCount > 0) {
        console.log(`Firebase cleanup completed: ${cleanedCount} expired items removed`);
      }

      return cleanedCount;
    } catch (error) {
      console.error('Error during Firebase cleanup:', error);
      return 0;
    }
  }
}

module.exports = new FirebaseStorage();
