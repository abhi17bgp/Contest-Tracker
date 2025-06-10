import React from 'react';
import { Trophy, TrendingUp, History } from 'lucide-react';

const Header: React.FC = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="flex justify-center items-center mb-4">
            <Trophy className="w-12 h-12 mr-3" />
            <h1 className="text-4xl md:text-5xl font-bold">Contest Tracker</h1>
          </div>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Track upcoming programming contests, analyze trends, and view past contest history
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-6 mt-8">
          <button
            onClick={() => scrollToSection('upcoming-contests')}
            className="flex items-center bg-white/10 rounded-lg px-4 py-2 backdrop-blur-sm hover:bg-white/20 transition-all duration-200 cursor-pointer"
          >
            <Trophy className="w-5 h-5 mr-2" />
            <span className="text-sm">Upcoming Contests</span>
          </button>
          <button
            onClick={() => scrollToSection('contest-trends')}
            className="flex items-center bg-white/10 rounded-lg px-4 py-2 backdrop-blur-sm hover:bg-white/20 transition-all duration-200 cursor-pointer"
          >
            <TrendingUp className="w-5 h-5 mr-2" />
            <span className="text-sm">Contest Trends</span>
          </button>
          <button
            onClick={() => scrollToSection('past-contests')}
            className="flex items-center bg-white/10 rounded-lg px-4 py-2 backdrop-blur-sm hover:bg-white/20 transition-all duration-200 cursor-pointer"
          >
            <History className="w-5 h-5 mr-2" />
            <span className="text-sm">Past Contests</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;