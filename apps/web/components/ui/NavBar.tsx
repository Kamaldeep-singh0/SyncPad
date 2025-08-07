import React from 'react'


const NavBar = () => (
  <nav className="bg-white border-b border-gray-100 px-6 py-4">
    <div className="max-w-7xl mx-auto flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">S</span>
        </div>
        <span className="text-xl font-bold text-gray-900">SyncPad</span>
      </div>
      <div className="flex items-center space-x-4">
        <button className="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg font-medium transition-colors">
          Login
        </button>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
          Sign Up
        </button>
      </div>
    </div>
  </nav>
);


export default NavBar;
