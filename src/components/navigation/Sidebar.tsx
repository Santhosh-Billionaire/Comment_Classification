import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Home, Search, PlusSquare, Bell, User, Settings, LogOut, Moon 
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const sidebarItems = [
    { icon: <Home size={24} />, label: 'Home', path: '/' },
    { icon: <Search size={24} />, label: 'Search', path: '/search' },
    { icon: <PlusSquare size={24} />, label: 'Create', path: '/create' },
    { icon: <Bell size={24} />, label: 'Notifications', path: '/notifications' },
    { 
      icon: <User size={24} />, 
      label: 'Profile', 
      path: `/profile/${user?.username}` 
    },
    { icon: <Settings size={24} />, label: 'Settings', path: '/settings' },
  ];

  return (
    <div className="fixed h-full glassmorphism w-64 lg:w-72 border-r border-white/5 py-6 px-4 flex flex-col">
      {/* Logo */}
      <div className="flex items-center justify-start mb-8 px-2">
        <Moon className="text-primary h-8 w-8 mr-3" />
        <motion.h1 
          className="text-2xl font-bold bg-gradient-to-r from-primary to-accent-purple bg-clip-text text-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          Night Walker
        </motion.h1>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1">
        <ul className="space-y-2">
          {sidebarItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) => 
                  `flex items-center py-3 px-4 rounded-lg transition-all duration-300 ${
                    isActive 
                      ? 'bg-primary/10 text-primary font-medium' 
                      : 'text-text-primary hover:bg-white/5'
                  }`
                }
              >
                <span className="mr-4">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      {/* User Profile Section */}
      <div className="mt-auto pt-6 border-t border-white/10">
        <div className="flex items-center px-4 py-3">
          {user?.avatar ? (
            <img 
              src={user.avatar} 
              alt={user.displayName} 
              className="w-10 h-10 rounded-full object-cover mr-3 border-2 border-primary/30"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mr-3">
              <span className="text-primary font-bold">
                {user?.displayName.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
          )}
          <div className="flex-1 overflow-hidden">
            <p className="font-medium truncate">{user?.displayName}</p>
            <p className="text-text-secondary text-sm truncate">@{user?.username}</p>
          </div>
        </div>

        {/* Logout Button */}
        <button 
          onClick={handleLogout}
          className="mt-4 flex items-center py-2 px-4 rounded-lg w-full text-text-secondary hover:bg-white/5 transition-all"
        >
          <LogOut size={20} className="mr-3" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;