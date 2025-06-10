import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { Contest, ApiResponse } from '../types/contest';
import { getPastContests, PLATFORMS } from '../utils/api';

const ContestChart: React.FC = () => {
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data: ApiResponse<Contest> = await getPastContests();
        
        // Filter contests to only include supported platforms
        const filteredContests = data.objects.filter(contest =>
          Object.keys(PLATFORMS).some(platform => contest.host.includes(platform))
        );

        // Group contests by date
        const contestsByDate: Record<string, number> = {};
        const last30Days = [];
        
        // Generate last 30 days
        for (let i = 29; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          const dateStr = date.toISOString().split('T')[0];
          last30Days.push(dateStr);
          contestsByDate[dateStr] = 0;
        }

        // Count contests per day
        filteredContests.forEach(contest => {
          const contestDate = contest.start.split('T')[0];
          if (contestsByDate.hasOwnProperty(contestDate)) {
            contestsByDate[contestDate]++;
          }
        });

        // Convert to chart data format
        const chartData = last30Days.map(date => ({
          date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          contests: contestsByDate[date] || 0,
          fullDate: date
        }));

        setChartData(chartData);
        setError(null);
      } catch (err) {
        setError('Failed to fetch contest data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div id="contest-trends" className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <TrendingUp className="w-6 h-6 mr-2 text-green-600" />
          Contest Trends (Last 30 Days)
        </h2>
        <div className="h-80 bg-gray-100 rounded-lg animate-pulse"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div id="contest-trends" className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <TrendingUp className="w-6 h-6 mr-2 text-green-600" />
          Contest Trends (Last 30 Days)
        </h2>
        <div className="text-center py-8">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  const totalContests = chartData.reduce((sum, day) => sum + day.contests, 0);

  return (
    <div id="contest-trends" className="bg-white rounded-lg shadow-md p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center">
          <TrendingUp className="w-6 h-6 mr-2 text-green-600" />
          Contest Trends (Last 30 Days)
        </h2>
        <div className="mt-2 md:mt-0">
          <span className="text-2xl font-bold text-green-600">{totalContests}</span>
          <span className="text-gray-500 ml-1">total contests</span>
        </div>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
            <XAxis 
              dataKey="date" 
              stroke="#6b7280"
              fontSize={12}
              interval="preserveStartEnd"
            />
            <YAxis stroke="#6b7280" fontSize={12} />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '6px'
              }}
              labelStyle={{ color: '#374151' }}
            />
            <Bar 
              dataKey="contests" 
              fill="#3b82f6"
              radius={[4, 4, 0, 0]}
              name="Contests"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ContestChart;