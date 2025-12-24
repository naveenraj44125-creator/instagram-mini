import React from 'react';
import Post from './Post';

const Feed = ({ posts, currentUser, onLikePost, onAddComment, loading }) => {
  if (loading) {
    return (
      <div className="feed">
        <div className="loading">
          Loading posts...
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="feed">
        <div className="no-posts">
          <h3>No posts yet!</h3>
          <p>Be the first to share something amazing.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="feed">
      {posts.map(post => (
        <Post
          key={post.id}
          post={post}
          currentUser={currentUser}
          onLike={onLikePost}
          onAddComment={onAddComment}
        />
      ))}
    </div>
  );
};

export default Feed;
