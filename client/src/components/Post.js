import React, { useState } from 'react';
import { FiHeart, FiMessageCircle, FiSend } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';

const Post = ({ post, currentUser, onLike, onAddComment }) => {
  const [comment, setComment] = useState('');
  const [showAllComments, setShowAllComments] = useState(false);

  const isLiked = post.likedBy?.includes(currentUser.username);
  const displayedComments = showAllComments ? post.comments : post.comments.slice(0, 2);

  const handleLike = () => {
    onLike(post.id);
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (comment.trim()) {
      onAddComment(post.id, comment);
      setComment('');
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMs = now - date;
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays > 0) {
      return `${diffInDays}d`;
    } else if (diffInHours > 0) {
      return `${diffInHours}h`;
    } else {
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      return diffInMinutes > 0 ? `${diffInMinutes}m` : 'now';
    }
  };

  return (
    <div className="post">
      <div className="post-header">
        <div className="post-avatar">
          {post.username.charAt(0).toUpperCase()}
        </div>
        <div className="post-user-info">
          <div className="post-username">{post.username}</div>
          <div className="post-timestamp">{formatTimestamp(post.timestamp)}</div>
        </div>
      </div>

      <img 
        src={post.imageUrl} 
        alt="Post" 
        className="post-image"
        onError={(e) => {
          e.target.style.display = 'none';
          console.error('Failed to load image:', post.imageUrl);
        }}
      />

      <div className="post-actions">
        <div className="post-buttons">
          <button 
            className={`action-btn ${isLiked ? 'liked' : ''}`}
            onClick={handleLike}
            title={isLiked ? 'Unlike' : 'Like'}
          >
            {isLiked ? <FaHeart /> : <FiHeart />}
          </button>
          <button className="action-btn" title="Comment">
            <FiMessageCircle />
          </button>
          <button className="action-btn" title="Share">
            <FiSend />
          </button>
        </div>

        <div className="post-likes">
          {post.likes === 1 ? '1 like' : `${post.likes} likes`}
        </div>

        {post.caption && (
          <div className="post-caption">
            <span className="post-username-caption">{post.username}</span>
            {post.caption}
          </div>
        )}

        <div className="post-comments">
          {post.comments.length > 2 && !showAllComments && (
            <div 
              className="view-comments"
              onClick={() => setShowAllComments(true)}
            >
              View all {post.comments.length} comments
            </div>
          )}
          
          {displayedComments.map(comment => (
            <div key={comment.id} className="comment">
              <span className="comment-username">{comment.username}</span>
              {comment.text}
            </div>
          ))}
          
          {post.comments.length > 2 && showAllComments && (
            <div 
              className="view-comments"
              onClick={() => setShowAllComments(false)}
            >
              Show less
            </div>
          )}
        </div>

        <form className="comment-form" onSubmit={handleCommentSubmit}>
          <input
            type="text"
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="comment-input"
          />
          <button 
            type="submit" 
            className="comment-submit"
            disabled={!comment.trim()}
          >
            Post
          </button>
        </form>
      </div>
    </div>
  );
};

export default Post;
