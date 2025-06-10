import React, { useState, useEffect } from 'react';
import { Calendar, Clock, ExternalLink, Users, Timer } from 'lucide-react';
import { Contest, ApiResponse } from '../types/contest';
import { getUpcomingContests, PLATFORMS } from '../utils/api';

const UpcomingContests: React.FC = () => {
  const [contests, setContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data: ApiResponse<Contest> = await getUpcomingContests();
        
        // Filter contests to only include supported platforms
        const filteredContests = data.objects.filter(contest => 
          Object.keys(PLATFORMS).some(platform => contest.host.includes(platform))
        );
        
        setContests(filteredContests);
        setError(null);
      } catch (err) {
        setError('Failed to fetch upcoming contests');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // Update current time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

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

  const getTimeUntilContest = (startTime: string) => {
    const contestStart = new Date(startTime);
    const now = currentTime;
    const timeDiff = contestStart.getTime() - now.getTime();

    if (timeDiff <= 0) {
      return { text: 'Started', color: 'text-green-600', urgent: false };
    }

    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

    let timeText = '';
    let color = 'text-blue-600';
    let urgent = false;

    if (days > 0) {
      timeText = `${days}d ${hours}h`;
    } else if (hours > 0) {
      timeText = `${hours}h ${minutes}m`;
      if (hours < 2) {
        color = 'text-orange-600';
        urgent = true;
      }
    } else {
      timeText = `${minutes}m`;
      color = 'text-red-600';
      urgent = true;
    }

    return { text: timeText, color, urgent };
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

  if (loading) {
    return (
      <div id="upcoming-contests" className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <Calendar className="w-6 h-6 mr-2 text-blue-600" />
          Upcoming Contests
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
      <div id="upcoming-contests" className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <Calendar className="w-6 h-6 mr-2 text-blue-600" />
          Upcoming Contests
        </h2>
        <div className="text-center py-8">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div id="upcoming-contests" className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 flex items-center">
        <Calendar className="w-6 h-6 mr-2 text-blue-600" />
        Upcoming Contests
        <span className="ml-auto text-sm font-normal text-gray-500">
          {contests.length} contests
        </span>
      </h2>
      
      {contests.length === 0 ? (
        <div className="text-center py-8">
          <Users className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">No upcoming contests found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {contests.slice(0, 10).map((contest) => {
            const { date, time } = formatDateTimeIST(contest.start);
            const timeUntil = getTimeUntilContest(contest.start);
            return (
              <div
                key={contest.id}
                className={`border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200 ${
                  timeUntil.urgent ? 'ring-2 ring-orange-200 bg-orange-50' : ''
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getPlatformColor(contest.host)}`}
                      >
                        {getPlatformName(contest.host)}
                      </span>
                      <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${timeUntil.color} bg-gray-100`}>
                        <Timer className="w-3 h-3 mr-1" />
                        {timeUntil.text}
                      </div>
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
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
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
      )}
    </div>
  );
};

export default UpcomingContests;