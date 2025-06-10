import React, { useState, useEffect } from 'react';
import { History, Clock, ExternalLink, Users, Calendar, Filter } from 'lucide-react';
import { Contest, ApiResponse } from '../types/contest';
import { getPastContests, PLATFORMS } from '../utils/api';

const PastContests: React.FC = () => {
  const [contests, setContests] = useState<Contest[]>([]);
  const [filteredContests, setFilteredContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const contestsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data: ApiResponse<Contest> = await getPastContests();
        
        // Filter contests to only include supported platforms
        const filteredContests = data.objects.filter(contest =>
          Object.keys(PLATFORMS).some(platform => contest.host.includes(platform))
        );
        
        // Sort by start time (most recent first)
        const sortedContests = filteredContests.sort((a, b) => 
          new Date(b.start).getTime() - new Date(a.start).getTime()
        );
        
        setContests(sortedContests);
        setFilteredContests(sortedContests);
        setError(null);
      } catch (err) {
        setError('Failed to fetch past contests');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let filtered = contests;

    // Filter by platform
    if (selectedPlatform !== 'all') {
      filtered = filtered.filter(contest => contest.host.includes(selectedPlatform));
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(contest =>
        contest.event.toLowerCase().includes(searchQuery.toLowerCase()) ||
        getPlatformName(contest.host).toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredContests(filtered);
    setCurrentPage(1);
  }, [contests, selectedPlatform, searchQuery]);

  const formatDateTimeIST = (dateString: string) => {
    const date = new Date(dateString);
    
    // Convert to IST (UTC+5:30)
    const istDate = new Date(date.getTime() + (5.5 * 60 * 60 * 1000));
    
    return {
      date: istDate.toLocaleDateString('en-IN', { 
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        timeZone: 'Asia/Kolkata'
      }),
      time: istDate.toLocaleTimeString('en-IN', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true,
        timeZone: 'Asia/Kolkata'
      }) + ' IST'
    };
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const getPlatformName = (host: string) => {
    const platform = Object.keys(PLATFORMS).find(p => host.includes(p));
    return platform ? PLATFORMS[platform as keyof typeof PLATFORMS] : host;
  };

  const getPlatformColor = (host: string) => {
    if (host.includes('codeforces')) return 'bg-red-500';
    if (host.includes('codechef')) return 'bg-orange-500';
    if (host.includes('atcoder')) return 'bg-green-500';
    if (host.includes('leetcode')) return 'bg-yellow-500';
    if (host.includes('geeksforgeeks')) return 'bg-green-600';
    return 'bg-blue-500';
  };

  const getTimeSince = (dateString: string) => {
    const contestDate = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - contestDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  // Pagination
  const totalPages = Math.ceil(filteredContests.length / contestsPerPage);
  console.log("pages",totalPages);
  const startIndex = (currentPage - 1) * contestsPerPage;
  const endIndex = startIndex + contestsPerPage;
  const currentContests = filteredContests.slice(startIndex, endIndex);

  if (loading) {
    return (
      <div id="past-contests" className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <History className="w-6 h-6 mr-2 text-purple-600" />
          Past Contests
        </h2>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-24 bg-gray-200 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div id="past-contests" className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <History className="w-6 h-6 mr-2 text-purple-600" />
          Past Contests
        </h2>
        <div className="text-center py-8">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div id="past-contests" className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 flex items-center">
        <History className="w-6 h-6 mr-2 text-purple-600" />
        Past Contests
        <span className="ml-auto text-sm font-normal text-gray-500">
          {filteredContests.length} contests
        </span>
      </h2>

      {/* Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Platform Filter */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Filter className="w-4 h-4 inline mr-1" />
              Filter by Platform
            </label>
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Platforms</option>
              {Object.entries(PLATFORMS).map(([platform, name]) => (
                <option key={platform} value={platform}>{name}</option>
              ))}
            </select>
          </div>

          {/* Search */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Contests
            </label>
            <input
              type="text"
              placeholder="Search by contest name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>
      
      {filteredContests.length === 0 ? (
        <div className="text-center py-8">
          <History className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">No past contests found</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {currentContests.map((contest) => {
              const { date, time } = formatDateTimeIST(contest.start);
              const timeSince = getTimeSince(contest.start);
              return (
                <div
                  key={contest.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200 bg-gray-50"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getPlatformColor(contest.host)}`}
                        >
                          {getPlatformName(contest.host)}
                        </span>
                        <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
                          {timeSince}
                        </span>
                      </div>
                      <h3 className="font-semibold text-lg text-gray-900 mb-2">
                        {contest.event}
                      </h3>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {date}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {time}
                        </div>
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          {formatDuration(contest.duration)}
                        </div>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <a
                        href={contest.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors duration-200"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View Contest
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-8 space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              
              <div className="flex space-x-1">
                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                  const pageNum = i+1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-2 border rounded-md ${
                        currentPage === pageNum
                          ? 'bg-purple-600 text-white border-purple-600'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>

            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PastContests;