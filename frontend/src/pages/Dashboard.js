import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import {
  BarChart3,
  TrendingUp,
  Link as LinkIcon,
  MousePointer,
  Calendar,
  ExternalLink,
  Trash2,
  Edit3,
  QrCode,
  Copy,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Activity
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
  PointElement,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { format, parseISO } from 'date-fns';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [urlsLoading, setUrlsLoading] = useState(false);
  const [timeRange, setTimeRange] = useState(30);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    fetchDashboardData();
    fetchUrls();
  }, [timeRange]);

  useEffect(() => {
    fetchUrls();
  }, [currentPage, searchTerm, sortBy, sortOrder]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/analytics/dashboard?days=${timeRange}`);
      const result = await response.json();

      if (result.success) {
        setDashboardData(result.data);
      } else {
        toast.error(result.error || 'Failed to fetch dashboard data');
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const fetchUrls = async () => {
    try {
      setUrlsLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        sortBy,
        sortOrder,
        search: searchTerm,
        isActive: 'true',
      });

      const response = await fetch(`${API_BASE_URL}/api/urls?${params}`);
      const result = await response.json();

      if (result.success) {
        setUrls(result.data.urls);
      } else {
        toast.error(result.error || 'Failed to fetch URLs');
      }
    } catch (error) {
      console.error('Error fetching URLs:', error);
      toast.error('Failed to fetch URLs');
    } finally {
      setUrlsLoading(false);
    }
  };

  const handleDeleteUrl = async (urlId) => {
    if (!window.confirm('Are you sure you want to delete this URL?')) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/urls/${urlId}`, {
        method: 'DELETE',
      });
      const result = await response.json();

      if (result.success) {
        toast.success('URL deleted successfully');
        fetchUrls();
        fetchDashboardData();
      } else {
        toast.error(result.error || 'Failed to delete URL');
      }
    } catch (error) {
      console.error('Error deleting URL:', error);
      toast.error('Failed to delete URL');
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
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">No Data Available</h1>
          <p className="text-gray-600 mb-4">Start by creating your first short URL!</p>
          <Link
            to="/"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Create Short URL
          </Link>
        </div>
      </div>
    );
  }

  // Chart configurations
  const trendsData = {
    labels: dashboardData.trends.daily.map(item => format(parseISO(item.date), 'MMM dd')),
    datasets: [
      {
        label: 'Total Clicks',
        data: dashboardData.trends.daily.map(item => item.clicks),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Unique Clicks',
        data: dashboardData.trends.daily.map(item => item.uniqueClicks),
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const topUrlsData = {
    labels: dashboardData.topUrls.slice(0, 10).map(url => url.shortCode),
    datasets: [
      {
        label: 'Clicks',
        data: dashboardData.topUrls.slice(0, 10).map(url => url.clicks),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
              <p className="text-gray-600">
                Overview of your URL performance and click analytics
              </p>
            </div>
            <div className="flex items-center space-x-4 mt-4 lg:mt-0">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(parseInt(e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={7}>Last 7 days</option>
                <option value={30}>Last 30 days</option>
                <option value={90}>Last 90 days</option>
              </select>
              <Link
                to="/"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
              >
                <LinkIcon className="w-4 h-4" />
                <span>Create URL</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-soft p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total URLs</p>
                <p className="text-3xl font-bold text-gray-900">{dashboardData.overview.totalUrls}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <LinkIcon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {dashboardData.overview.activeUrls} active
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-soft p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Clicks</p>
                <p className="text-3xl font-bold text-gray-900">{dashboardData.overview.totalClicks.toLocaleString()}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <MousePointer className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="flex items-center mt-2">
              <span className="text-sm text-gray-500">{dashboardData.overview.clicksInPeriod} in last {timeRange} days</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-soft p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Growth Rate</p>
                <p className="text-3xl font-bold text-gray-900">
                  {dashboardData.overview.growthRate > 0 ? '+' : ''}{dashboardData.overview.growthRate}%
                </p>
              </div>
              <div className={`p-3 rounded-lg ${
                dashboardData.overview.growthRate >= 0 ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {dashboardData.overview.growthRate >= 0 ? (
                  <ArrowUpRight className="w-6 h-6 text-green-600" />
                ) : (
                  <ArrowDownRight className="w-6 h-6 text-red-600" />
                )}
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">vs previous period</p>
          </div>

          <div className="bg-white rounded-xl shadow-soft p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Clicks/URL</p>
                <p className="text-3xl font-bold text-gray-900">
                  {dashboardData.overview.averageClicksPerUrl}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">per active URL</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-xl shadow-soft p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Click Trends
            </h3>
            <div className="h-80">
              <Line data={trendsData} options={chartOptions} />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-soft p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Top Performing URLs
            </h3>
            <div className="h-80">
              <Bar data={topUrlsData} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* URL Management Section */}
        <div className="bg-white rounded-xl shadow-soft p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Your URLs</h3>
            
            <div className="flex items-center space-x-4 mt-4 lg:mt-0">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search URLs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split('-');
                  setSortBy(field);
                  setSortOrder(order);
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="createdAt-desc">Newest first</option>
                <option value="createdAt-asc">Oldest first</option>
                <option value="clicks-desc">Most clicks</option>
                <option value="clicks-asc">Least clicks</option>
              </select>
            </div>
          </div>

          {urlsLoading ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-gray-600">Loading URLs...</p>
            </div>
          ) : urls.length === 0 ? (
            <div className="text-center py-8">
              <LinkIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">No URLs found</h4>
              <p className="text-gray-600 mb-4">
                {searchTerm ? 'No URLs match your search criteria.' : 'Start by creating your first short URL!'}
              </p>
              <Link
                to="/"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Create Short URL
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 text-sm font-medium text-gray-600">Short URL</th>
                    <th className="text-left py-3 text-sm font-medium text-gray-600">Original URL</th>
                    <th className="text-center py-3 text-sm font-medium text-gray-600">Clicks</th>
                    <th className="text-center py-3 text-sm font-medium text-gray-600">Created</th>
                    <th className="text-center py-3 text-sm font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {urls.map((url) => (
                    <tr key={url._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200">
                      <td className="py-4">
                        <div className="flex items-center space-x-3">
                          <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                            /{url.shortCode}
                          </code>
                          <CopyToClipboard text={url.shortUrl} onCopy={handleCopySuccess}>
                            <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200">
                              <Copy className="w-4 h-4" />
                            </button>
                          </CopyToClipboard>
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="max-w-xs">
                          <p className="text-gray-900 truncate" title={url.originalUrl}>
                            {url.originalUrl}
                          </p>
                          {url.description && (
                            <p className="text-sm text-gray-500 truncate" title={url.description}>
                              {url.description}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="text-center py-4">
                        <span className="text-lg font-semibold text-gray-900">
                          {url.clicks.toLocaleString()}
                        </span>
                      </td>
                      <td className="text-center py-4 text-sm text-gray-600">
                        {format(parseISO(url.createdAt), 'MMM dd, yyyy')}
                      </td>
                      <td className="text-center py-4">
                        <div className="flex items-center justify-center space-x-2">
                          <Link
                            to={`/analytics/${url.shortCode}`}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                            title="View Analytics"
                          >
                            <BarChart3 className="w-4 h-4" />
                          </Link>
                          <a
                            href={url.shortUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
                            title="Visit URL"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                          <button
                            onClick={() => window.open(`${API_BASE_URL}/api/qrcode/${url.shortCode}`, '_blank')}
                            className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors duration-200"
                            title="QR Code"
                          >
                            <QrCode className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteUrl(url._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                            title="Delete URL"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent Activity */}
        {dashboardData.recentActivity && dashboardData.recentActivity.length > 0 && (
          <div className="mt-8 bg-white rounded-xl shadow-soft p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              Recent Activity
            </h3>
            <div className="space-y-3">
              {dashboardData.recentActivity.slice(0, 10).map((activity, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                      /{activity.shortCode}
                    </code>
                    <span className="text-sm text-gray-600">{activity.country}</span>
                    <span className="text-sm text-gray-500">•</span>
                    <span className="text-sm text-gray-600">{activity.device}</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {format(parseISO(activity.timestamp), 'MMM dd, HH:mm')}
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

export default Dashboard;