const API_BASE = 'https://clist.by/api/v4';
const USERNAME = 'abhi17';
const API_KEY = '1efafc75818736bfddefe25a5fa4d609df51f3c2';

// Platform mapping for filtering
export const PLATFORMS = {
  'codeforces.com': 'Codeforces',
  'codechef.com': 'CodeChef', 
  'atcoder.jp': 'AtCoder',
  'leetcode.com': 'LeetCode',
  'geeksforgeeks.org': 'GeeksforGeeks'
};

export const fetchContests = async (params: Record<string, string> = {}) => {
  const searchParams = new URLSearchParams({
    username: USERNAME,
    api_key: API_KEY,
    format: 'json',
    limit: '100',
    ...params
  });

  try {
    const response = await fetch(`${API_BASE}/contest/?${searchParams}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching contests:', error);
    throw error;
  }
};

export const fetchUserAccounts = async (handles: Record<string, string>) => {
  const results: Record<string, any> = {};
  
  for (const [platform, handle] of Object.entries(handles)) {
    if (!handle.trim()) continue;
    
    try {
      const searchParams = new URLSearchParams({
        username: USERNAME,
        api_key: API_KEY,
        format: 'json',
        handle: handle,
        resource__host: platform
      });

      const response = await fetch(`${API_BASE}/account/?${searchParams}`);
      if (response.ok) {
        const data = await response.json();
        if (data.objects && data.objects.length > 0) {
          results[platform] = data.objects[0];
        }
      }
    } catch (error) {
      console.error(`Error fetching account for ${platform}:`, error);
    }
  }
  
  return results;
};

export const getUpcomingContests = async () => {
  const now = new Date();
  const endDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days from now
  
  return fetchContests({
    start__gte: now.toISOString(),
    start__lte: endDate.toISOString(),
    order_by: 'start'
  });
};

export const getPastContests = async () => {
  const now = new Date();
  const startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); // 30 days ago
  
  return fetchContests({
    start__gte: startDate.toISOString(),
    end__lte: now.toISOString(),
    order_by: '-start'
  });
};