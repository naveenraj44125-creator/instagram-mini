import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import Header from './components/Header';
import Feed from './components/Feed';
import PostForm from './components/PostForm';
import Login from './components/Login';

function App() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [showPostForm, setShowPostForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in (simple localStorage check)
    const savedUser = localStorage.getItem('instagramMiniUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('/api/posts');
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (username) => {
    const userData = { username, email: `${username}@example.com` };
    setUser(userData);
    localStorage.setItem('instagramMiniUser', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('instagramMiniUser');
  };

  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]);
    setShowPostForm(false);
  };

  const handleLikePost = async (postId) => {
    if (!user) return;
    
    try {
      const response = await axios.post(`/api/posts/${postId}/like`, {
        username: user.username
      });
      
      setPosts(posts.map(post => 
        post.id === postId ? response.data : post
      ));
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleAddComment = async (postId, commentText) => {
    if (!user || !commentText.trim()) return;
    
    try {
      const response = await axios.post(`/api/posts/${postId}/comments`, {
        username: user.username,
        text: commentText.trim()
      });
      
      setPosts(posts.map(post => 
        post.id === postId 
          ? { ...post, comments: [...post.comments, response.data] }
          : post
      ));
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="App">
      <Header 
        user={user} 
        onLogout={handleLogout}
        onCreatePost={() => setShowPostForm(true)}
      />
      
      <main className="main-content">
        {showPostForm && (
          <PostForm
            user={user}
            onPostCreated={handlePostCreated}
            onClose={() => setShowPostForm(false)}
          />
        )}
        
        <Feed
          posts={posts}
          currentUser={user}
          onLikePost={handleLikePost}
          onAddComment={handleAddComment}
          loading={loading}
        />
      </main>
    </div>
  );
}

export default App;
