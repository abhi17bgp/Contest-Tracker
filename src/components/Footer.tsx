import React from 'react';
import { Code, Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Code className="w-6 h-6 mr-2" />
            <span className="text-lg font-semibold">Contest Tracker</span>
          </div>
          <p className="text-gray-400 mb-4">
            Powered by CLIST API - Your competitive programming companion
          </p>
          <div className="flex items-center justify-center text-sm text-gray-400">
            <span>Made with</span>
            <Heart className="w-4 h-4 mx-2 text-red-500" />
            <span>for the competitive programming community</span>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-700">
            <p className="text-xs text-gray-500">
              Data provided by CLIST.BY - All contest information is subject to change
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;