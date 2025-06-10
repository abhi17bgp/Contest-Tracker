import React from 'react';
import Header from './components/Header';
import UpcomingContests from './components/UpcomingContests';
import ContestChart from './components/ContestChart';
import PastContests from './components/PastContests';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Upcoming Contests Section */}
          <UpcomingContests />
          
          {/* Contest Trends Chart */}
          <ContestChart />
          
          {/* Past Contests Section */}
          <PastContests />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

export default App;