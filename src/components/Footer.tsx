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
            Built by <span className="text-white font-medium">Abhishek Anand</span> to support every coder's journey.
          </p>
          <div className="flex items-center justify-center text-sm text-gray-400">
            <span>Made with</span>
            <Heart className="w-4 h-4 mx-2 text-red-500" />
            <span>for the competitive programming community</span>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-700">
            <p className="text-xs text-gray-500">
              Contest data sourced from CLIST.BY • Use for personal or educational purposes
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
