import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/FormComponents';
import { useAuth } from '../hooks/useAuth';
import { MessageSquare, Eye, Star, TrendingUp } from 'lucide-react';
import { contactAPI } from '../services/api';

export const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    total: 0,
    today: 0,
    unseen: 0,
    important: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await contactAPI.getHistory(1, 1000);
        if (response.data.success) {
          const contacts = response.data.contacts || [];
          const today = new Date().toDateString();

          const todayContacts = contacts.filter(
            (c) => new Date(c.createdAt).toDateString() === today
          );
          const unseenContacts = contacts.filter((c) => !c.seen);
          const importantContacts = contacts.filter((c) => c.flag === 'important');

          setStats({
            total: contacts.length,
            today: todayContacts.length,
            unseen: unseenContacts.length,
            important: importantContacts.length,
          });
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      icon: <MessageSquare className="w-8 h-8 text-gray-900" />,
      label: 'Total Messages',
      value: stats.total,
      color: 'bg-blue-50',
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-gray-900" />,
      label: 'Today',
      value: stats.today,
      color: 'bg-green-50',
    },
    {
      icon: <Eye className="w-8 h-8 text-gray-900" />,
      label: 'Unseen',
      value: stats.unseen,
      color: 'bg-yellow-50',
    },
    {
      icon: <Star className="w-8 h-8 text-gray-900" />,
      label: 'Important',
      value: stats.important,
      color: 'bg-red-50',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name || 'Admin'}! 👋
          </h1>
          <p className="text-gray-600 mt-2">
            Here's an overview of your contacts and messages.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {statCards.map((card, idx) => (
            <div
              key={idx}
              className={`${card.color} rounded-lg p-6 border border-gray-200`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{card.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {loading ? '-' : card.value}
                  </p>
                </div>
                {card.icon}
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="grid md:grid-cols-2 gap-6">
          <Link to="/contacts" className="block">
            <div className="bg-white rounded-lg p-8 border-2 border-gray-200 hover:border-gray-900 transition-all cursor-pointer">
              <MessageSquare className="w-12 h-12 text-gray-900 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">View All Messages</h3>
              <p className="text-gray-600 mb-4">
                Browse, search, and manage all your messages with advanced filters.
              </p>
              <Button variant="outline">
                Go to Messages →
              </Button>
            </div>
          </Link>

          <div className="bg-white rounded-lg p-8 border-2 border-gray-200 hover:border-gray-900 transition-all">
            <Star className="w-12 h-12 text-gray-900 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Quick Stats</h3>
            <p className="text-gray-600 mb-4">
              {stats.unseen} new messages waiting for your attention.
            </p>
            <div className="space-y-2 text-sm">
              <p className="flex justify-between">
                <span>Response Rate:</span>
                <span className="font-semibold">85%</span>
              </p>
              <p className="flex justify-between">
                <span>Avg Response Time:</span>
                <span className="font-semibold">2 hours</span>
              </p>
            </div>
          </div>
        </div>

        {/* Quick Tips */}
        <div className="mt-8 bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">💡 Quick Tips</h3>
          <ul className="space-y-2 text-gray-600">
            <li>• Flag important messages for quick follow-up</li>
            <li>• Use the AI assistant to draft responses quickly</li>
            <li>• Check WhatsApp directly for urgent conversations</li>
            <li>• Mark messages as read to keep track of what you've reviewed</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
