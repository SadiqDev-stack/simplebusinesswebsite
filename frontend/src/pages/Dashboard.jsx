import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/FormComponents";
import { useAuth } from "../hooks/useAuth";
import {
  MessageSquare,
  Eye,
  Star,
  TrendingUp,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  Zap,
  ArrowRight,
  Inbox,
  Activity,
  Calendar,
  Mail,
  Phone,
  Loader2,
} from "lucide-react";
import { contactAPI } from "../services/api";

export const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    total: 0,
    today: 0,
    unseen: 0,
    thisWeek: 0,
    thisMonth: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentContacts, setRecentContacts] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await contactAPI.getHistory(1, 1000, {});

        // Handle the response structure correctly
        if (response.data?.success) {
          // Access contacts from response.data.data.contacts
          const contacts =
            response.data.data?.contacts || response.data.contacts || [];
          const pagination =
            response.data.data?.pagination || response.data.pagination;

          console.log("Contacts found:", contacts.length);

          const today = new Date();
          today.setHours(0, 0, 0, 0);

          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);

          const monthAgo = new Date();
          monthAgo.setDate(monthAgo.getDate() - 30);

          const todayContacts = contacts.filter((c) => {
            const contactDate = new Date(c.createdAt);
            contactDate.setHours(0, 0, 0, 0);
            return contactDate.getTime() === today.getTime();
          });

          const weekContacts = contacts.filter((c) => {
            const contactDate = new Date(c.createdAt);
            return contactDate >= weekAgo;
          });

          const monthContacts = contacts.filter((c) => {
            const contactDate = new Date(c.createdAt);
            return contactDate >= monthAgo;
          });

          const unseenContacts = contacts.filter((c) => !c.seen);
      
          setStats({
            total: contacts.length,
            today: todayContacts.length,
            unseen: unseenContacts.length,
            thisWeek: weekContacts.length,
            thisMonth: monthContacts.length,
          });

          // Get 5 most recent contacts
          setRecentContacts(contacts.slice(0, 5));
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      icon: <MessageSquare className="w-6 h-6" />,
      label: "Total Messages",
      value: stats.total,
      gradient: "from-blue-600 to-blue-400",
      bgGradient: "from-blue-500/10 to-blue-600/5",
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      label: "Today",
      value: stats.today,
      gradient: "from-green-600 to-green-400",
      bgGradient: "from-green-500/10 to-green-600/5",
    },
    {
      icon: <Eye className="w-6 h-6" />,
      label: "Unseen",
      value: stats.unseen,
      gradient: "from-yellow-600 to-yellow-400",
      bgGradient: "from-yellow-500/10 to-yellow-600/5",
    }
  ];

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    return "Just now";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-black">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-128 h-128 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-pulse delay-2000"></div>
      </div>

      {/* Header */}
      <div className="relative border-b border-gray-800 bg-black/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                  Welcome back, {user?.name || "Admin"}! 👋
                </h1>
              </div>
              <p className="text-gray-400 mt-1">
                Here's an overview of your contacts and messages
              </p>
            </div>
            <div className="hidden md:block">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Live Dashboard</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((card, idx) => (
            <div
              key={idx}
              className={`group relative bg-gradient-to-br ${card.bgGradient} backdrop-blur-sm rounded-2xl border border-gray-800 p-6 hover:border-purple-500/50 transition-all duration-300 hover:transform hover:-translate-y-1`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">
                    {card.label}
                  </p>
                  {loading ? (
                    <div className="mt-2">
                      <Loader2 className="w-8 h-8 text-gray-500 animate-spin" />
                    </div>
                  ) : (
                    <p
                      className={`text-3xl font-bold bg-gradient-to-r ${card.gradient} bg-clip-text text-transparent mt-2`}
                    >
                      {card.value}
                    </p>
                  )}
                </div>
                <div
                  className={`p-3 bg-gradient-to-br ${card.gradient} rounded-xl opacity-80 group-hover:opacity-100 transition-opacity`}
                >
                  {card.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Overview Row */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Weekly Stats */}
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-purple-400" />
              <h3 className="text-lg font-semibold text-white">
                Recent Activity
              </h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">This Week</span>
                <span className="text-2xl font-bold text-white">
                  {stats.thisWeek}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">This Month</span>
                <span className="text-2xl font-bold text-white">
                  {stats.thisMonth}
                </span>
              </div>
              <div className="mt-4 h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-full transition-all duration-500"
                  style={{
                    width: `${stats.total > 0 ? (stats.thisMonth / stats.total) * 100 : 0}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>

          {/* Response Rate */}
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800 p-6">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <h3 className="text-lg font-semibold text-white">Performance</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Response Rate</span>
                <span className="text-2xl font-bold text-white">
                  {stats.total > 0
                    ? Math.round(
                        ((stats.total - stats.unseen) / stats.total) * 100,
                      )
                    : 0}
                  %
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Attention Needed</span>
                <span className="text-2xl font-bold text-yellow-400">
                  {stats.unseen}
                </span>
              </div>
              <div className="mt-4 h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-600 to-green-400 rounded-full transition-all duration-500"
                  style={{
                    width: `${stats.total > 0 ? ((stats.total - stats.unseen) / stats.total) * 100 : 0}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Contacts */}
        {recentContacts.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Inbox className="w-5 h-5 text-purple-400" />
                <h3 className="text-lg font-semibold text-white">
                  Recent Messages
                </h3>
              </div>
              <Link to="/contacts">
                <Button
                  variant="ghost"
                  className="text-purple-400 hover:text-purple-300"
                >
                  View All <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
            <div className="space-y-3">
              {recentContacts.map((contact) => (
                <div
                  key={contact._id}
                  className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-4 hover:border-purple-500/50 transition-all duration-300"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-white">
                          {contact.name || "Unknown"}
                        </h4>
                      
                        {!contact.seen && (
                          <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full">
                            New
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-400 mb-2">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {contact.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {contact.phone}
                        </span>
                      </div>
                      <p className="text-gray-500 text-sm line-clamp-1">
                        {contact.message || contact.subject}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">
                        {getTimeAgo(contact.createdAt)}
                      </p>
                      <Link to={`/contacts?view=${contact._id}`}>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="mt-2 text-purple-400"
                        >
                          View <ArrowRight className="w-3 h-3 ml-1" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid md:grid-cols-2 gap-6">
          <Link to="/contacts" className="block">
            <div className="group bg-gradient-to-br from-gray-900/50 to-gray-900/30 backdrop-blur-sm rounded-2xl p-8 border border-gray-800 hover:border-purple-500/50 transition-all duration-300 hover:transform hover:-translate-y-1 cursor-pointer">
              <div className="p-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform">
                <MessageSquare className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                View All Messages
              </h3>
              <p className="text-gray-400 mb-4 leading-relaxed">
                Browse, search, and manage all your messages with advanced
                filters and AI assistance.
              </p>
              <Button
                variant="outline"
                className="border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white"
              >
                Go to Messages <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </Link>

          <div className="group bg-gradient-to-br from-gray-900/50 to-gray-900/30 backdrop-blur-sm rounded-2xl p-8 border border-gray-800 hover:border-purple-500/50 transition-all duration-300">
            <div className="p-3 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-xl w-fit mb-4">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Quick Actions</h3>
            <p className="text-gray-400 mb-4 leading-relaxed">
              {stats.unseen > 0
                ? `${stats.unseen} new message${stats.unseen > 1 ? "s" : ""} waiting for your attention.`
                : "All caught up! No pending messages."}
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center py-2 border-b border-gray-800">
                <span className="text-gray-400">Response Rate</span>
                <span className="font-semibold text-white">
                  {stats.total > 0
                    ? Math.round(
                        ((stats.total - stats.unseen) / stats.total) * 100,
                      )
                    : 0}
                  %
                </span>
              </div>
             
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-400">Total Contacts</span>
                <span className="font-semibold text-white">{stats.total}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Tips */}
        <div className="mt-8 bg-gradient-to-br from-gray-900/50 to-gray-900/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-800">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-purple-400" />
            <h3 className="text-lg font-semibold text-white">💡 Pro Tips</h3>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2"></div>
              <p className="text-gray-400 text-sm">
                Flag important messages for quick follow-up
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-pink-500 rounded-full mt-2"></div>
              <p className="text-gray-400 text-sm">
                Use AI assistant to draft responses quickly
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2"></div>
              <p className="text-gray-400 text-sm">
                Check WhatsApp directly for urgent chats
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2"></div>
              <p className="text-gray-400 text-sm">
                Mark messages as read to track progress
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
