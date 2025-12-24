import React, { useState } from 'react';
import axios from 'axios';
import { FiX, FiUpload } from 'react-icons/fi';

const PostForm = ({ user, onPostCreated, onClose }) => {
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }
      
      if (!selectedFile.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      setFile(selectedFile);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      alert('Please select an image');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('username', user.username);
      formData.append('caption', caption);

      const response = await axios.post('/api/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      onPostCreated(response.data);
      alert('Post created successfully!');
    } catch (error) {
      console.error('Error creating post:', error);
      alert(error.response?.data?.error || 'Failed to create post');
    } finally {
      setUploading(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="post-form-overlay" onClick={handleOverlayClick}>
      <div className="post-form">
        <div className="post-form-header">
          <h2 className="post-form-title">Create New Post</h2>
          <button className="close-btn" onClick={onClose}>
            <FiX />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="file-input-container">
            <label className="file-input">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={uploading}
              />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <FiUpload />
                {file ? 'Change Photo' : 'Select Photo'}
              </div>
            </label>
          </div>

          {preview && (
            <div style={{ marginBottom: '20px', textAlign: 'center' }}>
              <img 
                src={preview} 
                alt="Preview" 
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: '300px', 
                  borderRadius: '8px',
                  objectFit: 'cover'
                }} 
              />
            </div>
          )}

          <textarea
            className="textarea"
            placeholder="Write a caption..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            disabled={uploading}
          />

          <div className="form-actions">
            <button 
              type="button" 
              className="btn" 
              onClick={onClose}
              disabled={uploading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={!file || uploading}
            >
              {uploading ? 'Sharing...' : 'Share'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostForm;
