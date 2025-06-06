import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Search, PlusSquare, Bell, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';

const MobileNavbar: React.FC = () => {
  const { user } = useAuth();
  
  const navItems = [
    { icon: <Home size={24} />, label: 'Home', path: '/' },
    { icon: <Search size={24} />, label: 'Search', path: '/search' },
    { icon: <PlusSquare size={24} />, label: 'Create', path: '/create' },
    { icon: <Bell size={24} />, label: 'Notifications', path: '/notifications' },
    { 
      icon: <User size={24} />, 
      label: 'Profile', 
      path: `/profile/${user?.username}` 
    },
  ];

  return (
    <motion.nav 
      className="bg-background-card border-t border-white/5 py-2 glassmorphism rounded-t-xl"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <ul className="flex justify-around items-center">
        {navItems.map((item) => (
          <li key={item.path}>
            <NavLink
              to={item.path}
              className={({ isActive }) => 
                `flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-300 ${
                  isActive 
                    ? 'text-primary' 
                    : 'text-text-secondary'
                }`
              }
            >
              {item.icon}
              <span className="text-xs mt-1">{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </motion.nav>
  );
};

export default MobileNavbar;