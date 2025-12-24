import React from 'react';
import { FiPlus, FiLogOut, FiUser } from 'react-icons/fi';

const Header = ({ user, onLogout, onCreatePost }) => {
  return (
    <header className="header">
      <div className="header-left">
        <a href="/" className="logo">
          Instagram Mini
        </a>
      </div>
      
      <div className="header-right">
        <div className="header-user">
          <FiUser />
          <span>{user.username}</span>
        </div>
        
        <button 
          className="btn btn-primary" 
          onClick={onCreatePost}
          title="Create new post"
        >
          <FiPlus />
        </button>
        
        <button 
          className="btn" 
          onClick={onLogout}
          title="Logout"
        >
          <FiLogOut />
        </button>
      </div>
    </header>
  );
};

export default Header;
