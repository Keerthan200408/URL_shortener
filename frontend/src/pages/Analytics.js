import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
  BarChart3,
  TrendingUp,
  Globe,
  Monitor,
  Smartphone,
  Calendar,
  ExternalLink,
  Copy,
  ArrowLeft,
  Users,
  MousePointer,
  Clock
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
} from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { format, parseISO } from 'date-fns';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Analytics = () => {
  const { shortCode } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState(30);
  const [realTimeData, setRealTimeData] = useState(null);

  useEffect(() => {
    fetchAnalytics();
    fetchRealTimeData();
    
    // Set up real-time updates every 30 seconds
    const interval = setInterval(fetchRealTimeData, 30000);
    
    return () => clearInterval(interval);
  }, [shortCode, timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/api/analytics/${shortCode}?days=${timeRange}`
      );
      const result = await response.json();

      if (result.success) {
        setData(result.data);
      } else {
        toast.error(result.error || 'Failed to fetch analytics');
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to fetch analytics data');
    } finally {
      setLoading(false);
    }
  };

  const fetchRealTimeData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/analytics/realtime/${shortCode}`);
      const result = await response.json();

      if (result.success) {
        setRealTimeData(result.data);
      }
    } catch (error) {
      console.error('Error fetching real-time data:', error);
    }
  };

  const handleCopySuccess = () => {
    toast.success('URL copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Analytics Not Found</h1>
          <p className="text-gray-600 mb-4">
            The analytics for this short code could not be found.
          </p>
          <Link
            to="/"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Go Back Home
          </Link>
        </div>
      </div>
    );
  }

  // Chart configurations
  const clicksOverTimeData = {
    labels: data.timeline.daily.map(item => format(parseISO(item.date), 'MMM dd')),
    datasets: [
      {
        label: 'Total Clicks',
        data: data.timeline.daily.map(item => item.clicks),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Unique Clicks',
        data: data.timeline.daily.map(item => item.uniqueClicks),
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const hourlyData = {
    labels: data.timeline.hourly.map(item => `${item.hour}:00`),
    datasets: [
      {
        label: 'Clicks by Hour',
        data: data.timeline.hourly.map(item => item.clicks),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
      },
    ],
  };

  const countriesData = {
    labels: data.geographic.countries.map(item => item.country),
    datasets: [
      {
        data: data.geographic.countries.map(item => item.clicks),
        backgroundColor: [
          '#3B82F6',
          '#10B981',
          '#F59E0B',
          '#EF4444',
          '#8B5CF6',
          '#06B6D4',
          '#84CC16',
          '#F97316',
          '#EC4899',
          '#6B7280',
        ],
      },
    ],
  };

  const devicesData = {
    labels: data.technology.devices.map(item => item.device),
    datasets: [
      {
        data: data.technology.devices.map(item => item.count),
        backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Link
              to="/"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </Link>
            
            <div className="flex items-center space-x-4">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(parseInt(e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={7}>Last 7 days</option>
                <option value={30}>Last 30 days</option>
                <option value={90}>Last 90 days</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-soft p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="mb-4 lg:mb-0">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Analytics for /{shortCode}
                </h1>
                <div className="flex items-center space-x-4">
                  <p className="text-gray-600 break-all">{data.url.originalUrl}</p>
                  <div className="flex space-x-2">
                    <CopyToClipboard text={data.url.shortUrl} onCopy={handleCopySuccess}>
                      <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200">
                        <Copy className="w-4 h-4" />
                      </button>
                    </CopyToClipboard>
                    <a
                      href={data.url.shortUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Created</p>
                <p className="text-lg font-semibold text-gray-900">
                  {format(parseISO(data.url.createdAt), 'MMM dd, yyyy')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-soft p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Clicks</p>
                <p className="text-3xl font-bold text-gray-900">{data.overview.totalClicks.toLocaleString()}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <MousePointer className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {data.overview.clicksInPeriod} in last {timeRange} days
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-soft p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Unique Visitors</p>
                <p className="text-3xl font-bold text-gray-900">{data.overview.uniqueClicks.toLocaleString()}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {data.overview.clickThroughRate}% click-through rate
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-soft p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Top Country</p>
                <p className="text-2xl font-bold text-gray-900">
                  {data.geographic.topCountry?.country || 'Unknown'}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <Globe className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {data.geographic.topCountry?.clicks || 0} clicks
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-soft p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Last Clicked</p>
                <p className="text-lg font-bold text-gray-900">
                  {data.overview.lastClicked 
                    ? format(parseISO(data.overview.lastClicked), 'MMM dd, HH:mm')
                    : 'Never'
                  }
                </p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Clicks Over Time */}
          <div className="bg-white rounded-xl shadow-soft p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Clicks Over Time
            </h3>
            <div className="h-80">
              <Line data={clicksOverTimeData} options={chartOptions} />
            </div>
          </div>

          {/* Hourly Distribution */}
          <div className="bg-white rounded-xl shadow-soft p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Hourly Distribution (Last 7 Days)
            </h3>
            <div className="h-80">
              <Bar data={hourlyData} options={chartOptions} />
            </div>
          </div>

          {/* Geographic Distribution */}
          <div className="bg-white rounded-xl shadow-soft p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Globe className="w-5 h-5 mr-2" />
              Top Countries
            </h3>
            <div className="h-80">
              <Pie data={countriesData} options={pieOptions} />
            </div>
          </div>

          {/* Device Distribution */}
          <div className="bg-white rounded-xl shadow-soft p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Monitor className="w-5 h-5 mr-2" />
              Device Types
            </h3>
            <div className="h-80">
              <Pie data={devicesData} options={pieOptions} />
            </div>
          </div>
        </div>

        {/* Tables Section */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Top Referrers */}
          <div className="bg-white rounded-xl shadow-soft p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Top Referrers</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 text-sm font-medium text-gray-600">Source</th>
                    <th className="text-right py-3 text-sm font-medium text-gray-600">Clicks</th>
                  </tr>
                </thead>
                <tbody>
                  {data.traffic.referrers.map((referrer, index) => (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="py-3 text-gray-900">{referrer.referrer}</td>
                      <td className="text-right py-3 font-medium text-gray-900">
                        {referrer.clicks}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Browser Stats */}
          <div className="bg-white rounded-xl shadow-soft p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Browser Usage</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 text-sm font-medium text-gray-600">Browser</th>
                    <th className="text-right py-3 text-sm font-medium text-gray-600">Usage</th>
                  </tr>
                </thead>
                <tbody>
                  {data.technology.browsers.map((browser, index) => (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="py-3 text-gray-900">{browser.browser}</td>
                      <td className="text-right py-3 font-medium text-gray-900">
                        {browser.count}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Real-time Activity */}
        {realTimeData && realTimeData.recentClicks.length > 0 && (
          <div className="mt-8 bg-white rounded-xl shadow-soft p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-3"></div>
              Recent Activity ({realTimeData.clicksLast24h} clicks in last 24h)
            </h3>
            <div className="space-y-3">
              {realTimeData.recentClicks.slice(0, 5).map((click, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-900">{click.country}</span>
                    <span className="text-sm text-gray-500">•</span>
                    <span className="text-sm text-gray-600">{click.device}</span>
                    <span className="text-sm text-gray-500">•</span>
                    <span className="text-sm text-gray-600">{click.browser}</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {format(parseISO(click.timestamp), 'HH:mm')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;