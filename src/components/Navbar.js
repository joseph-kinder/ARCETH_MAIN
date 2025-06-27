import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { motion } from 'framer-motion';
import { Sparkles, Package, Palette, Grid3x3, User } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Home', icon: Sparkles },
    { path: '/marketplace', label: 'Marketplace', icon: Package },
    { path: '/create', label: 'Create', icon: Palette },
    { path: '/collection', label: 'Collection', icon: Grid3x3 },
  ];

  return (
    <nav className="bg-black/20 backdrop-blur-xl border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center"
            >
              <Sparkles className="w-6 h-6 text-white" />
            </motion.div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              ArcaneETH
            </span>
          </Link>
          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className="relative px-4 py-2 group"
              >
                <span className={`flex items-center space-x-2 transition-colors ${
                  location.pathname === path ? 'text-purple-400' : 'text-gray-300 hover:text-white'
                }`}>
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </span>
                {location.pathname === path && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute inset-0 bg-purple-500/20 rounded-lg -z-10"
                    transition={{ type: "spring", duration: 0.5 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Connect Wallet */}
          <div className="flex items-center">
            <ConnectButton 
              accountStatus="avatar"
              chainStatus="icon"
              showBalance={{
                smallScreen: false,
                largeScreen: true,
              }}
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;