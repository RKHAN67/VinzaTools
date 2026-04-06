import { useEffect, useState } from 'react';

import {
  ShieldCheck,
  BarChart3,
  Users,
  Mail,
  LayoutDashboard,
  UserCog,
  GraduationCap,
  Layers,
  Wallet,
  MessageSquare,
  LogOut,
  RefreshCw,
  Activity,
  TrendingUp,
  Clock,
  Search,
  Bell,
  Menu,
  X,
  ChevronRight,
  Lock,
  User,
  Zap,
  Database,
  Eye,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Calendar,
  ArrowUpRight,
  Filter,
  Globe,
} from 'lucide-react';
import { apiFetch } from '../api';
import { BrandMark } from '../components/BrandMark';

type UsageRow = { toolId: string; count: number };
type UserRow = { clientId: string | null; count: number };
type UserToolRow = { clientId: string | null; toolId: string; count: number };
type DayRow = { day: string; count: number };
type IpRow = { ip: string | null; count: number };
type RecentUsageRow = {
  toolId: string;
  subAction?: string | null;
  clientId?: string | null;
  ip?: string | null;
  timestamp: string;
};
type MessageRow = {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  subject: string;
  message: string;
  category: string;
  replyStatus?: string | null;
  lastReplyChannel?: string | null;
  lastReplyText?: string | null;
  repliedAt?: string | null;
  ip?: string | null;
  timestamp: string;
};
type ThemeRow = {
  id: string;
  name: string;
  relativePath: string;
  fileCount: number;
  previewFiles: string[];
  hasPreview?: boolean;
  canBuildPreview?: boolean;
};
type ThemeSummary = {
  totalThemes: number;
  previewReady: number;
  buildReady: number;
  totalFiles: number;
  totalQuickPreviewFiles: number;
  totalDownloads: number;
  totalPreviews: number;
  totalPrepares: number;
  uniqueVisitors?: number;
  totalTraffic?: number;
};
type ThemeActivityRow = {
  themeId: string;
  actionName: string;
  ip?: string | null;
  userAgent?: string | null;
  timestamp: string;
};
type ThemeVisitorRow = {
  ip: string;
  totalActions: number;
  downloads: number;
  previews: number;
  prepares: number;
  lastSeen: string;
};
type ThemeDayRow = {
  day: string;
  count: number;
};

const TOTAL_AVAILABLE_TOOLS = 94;
const ADMIN_FALLBACK_PIN = 'admin123';

export const AdminPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [usageByTool, setUsageByTool] = useState<UsageRow[]>([]);
  const [usageByUser, setUsageByUser] = useState<UserRow[]>([]);
  const [usageByUserTool, setUsageByUserTool] = useState<UserToolRow[]>([]);
  const [usageByDay, setUsageByDay] = useState<DayRow[]>([]);
  const [usageByIp, setUsageByIp] = useState<IpRow[]>([]);
  const [recentUsage, setRecentUsage] = useState<RecentUsageRow[]>([]);
  const [messages, setMessages] = useState<MessageRow[]>([]);
  const [themes, setThemes] = useState<ThemeRow[]>([]);
  const [themeSummary, setThemeSummary] = useState<ThemeSummary>({
    totalThemes: 0,
    previewReady: 0,
    buildReady: 0,
    totalFiles: 0,
    totalQuickPreviewFiles: 0,
    totalDownloads: 0,
    totalPreviews: 0,
    totalPrepares: 0,
  });
  const [recentThemeActivity, setRecentThemeActivity] = useState<
    ThemeActivityRow[]
  >([]);
  const [themeTrafficByVisitor, setThemeTrafficByVisitor] = useState<
    ThemeVisitorRow[]
  >([]);
  const [themeTrafficByDay, setThemeTrafficByDay] = useState<ThemeDayRow[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [lastRefreshed, setLastRefreshed] = useState<string>('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<MessageRow | null>(
    null
  );
  const [replyText, setReplyText] = useState('');
  const [replyLoading, setReplyLoading] = useState(false);
  const [replyFeedback, setReplyFeedback] = useState('');
  const [messageActionLoading, setMessageActionLoading] = useState<'read' | 'delete' | ''>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [messageTab, setMessageTab] = useState<
    'all' | 'general' | 'tool' | 'feedback'
  >('all');
  const [showNotifications, setShowNotifications] = useState(false);

  const fetchOverview = async (user: string, pass: string) => {
    setLoading(true);
    setError('');
    try {
      const query = `?admin_user=${encodeURIComponent(user)}&admin_pass=${encodeURIComponent(pass)}`;
      const res = await apiFetch(`/api/admin/overview${query}`, {
        headers: {
          'x-admin-user': user,
          'x-admin-pass': pass,
          'x-admin-pin': ADMIN_FALLBACK_PIN,
        },
      });
      if (!res.ok) {
        throw new Error('Invalid credentials');
      }
      const data = await res.json();
      setUsageByTool(data.usageByTool || []);
      setUsageByUser(data.usageByUser || []);
      setUsageByUserTool(data.usageByUserTool || []);
      setUsageByDay(data.usageByDay || []);
      setUsageByIp(data.usageByIp || []);
      setRecentUsage(data.recentUsage || []);
      setMessages(data.messages || []);
      setSelectedMessage((prev) =>
        prev ? (data.messages || []).find((item: MessageRow) => item.id === prev.id) || null : prev
      );
      setThemes(data.themes || []);
      setThemeSummary(
        data.themeSummary || {
          totalThemes: 0,
          previewReady: 0,
          buildReady: 0,
          totalFiles: 0,
          totalQuickPreviewFiles: 0,
          totalDownloads: 0,
          totalPreviews: 0,
          totalPrepares: 0,
          uniqueVisitors: 0,
          totalTraffic: 0,
        }
      );
      setRecentThemeActivity(data.recentThemeActivity || []);
      setThemeTrafficByVisitor(data.themeTrafficByVisitor || []);
      setThemeTrafficByDay(data.themeTrafficByDay || []);
      setAuthed(true);
      setLastRefreshed(new Date().toLocaleTimeString());
    } catch (err: any) {
      setAuthed(false);
      setError(err.message || 'Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authed) {
      fetchOverview(username, password);
    }
  }, [authed]);

  const formatClient = (value: string | null) => {
    if (!value) return 'Anonymous';
    return `${value.slice(0, 6)}...${value.slice(-4)}`;
  };

  const totalEvents = usageByTool.reduce((acc, row) => acc + row.count, 0);
  const uniqueUsers = usageByUser.length;
  const topTool = usageByTool[0];
  const topUser = usageByUser[0];
  const hottestTheme = themes[0];
  const topThemeVisitor = themeTrafficByVisitor[0];

  const formatThemeName = (themeIdOrName: string) =>
    themeIdOrName
      .replace(/[-_]+/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());

  const formatThemeAction = (actionName: string) =>
    actionName.replace(/_/g, ' ');

  const refresh = async () => {
    await fetchOverview(username, password);
  };

  const sendReply = async () => {
    if (!selectedMessage || !replyText.trim()) {
      setReplyFeedback('Please write a reply first.');
      return;
    }

    setReplyLoading(true);
    setReplyFeedback('');
    const popup = window.open('', '_blank', 'noopener,noreferrer');
    try {
      const query = `?admin_user=${encodeURIComponent(username)}&admin_pass=${encodeURIComponent(password)}`;
      const res = await apiFetch(`/api/admin/messages/${selectedMessage.id}/reply${query}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-user': username,
          'x-admin-pass': password,
          'x-admin-pin': ADMIN_FALLBACK_PIN,
        },
        body: JSON.stringify({ replyText: replyText.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || 'Failed to prepare reply.');
      }

      if (data.targetUrl) {
        if (popup) {
          popup.location.href = data.targetUrl;
        } else {
          window.open(data.targetUrl, '_blank', 'noopener,noreferrer');
        }
      }

      setReplyFeedback(
        data.channel === 'whatsapp'
          ? 'Reply opened in WhatsApp successfully.'
          : 'Reply opened in email successfully.'
      );
      await fetchOverview(username, password);
      setReplyText('');
    } catch (err: any) {
      if (popup && !popup.closed) popup.close();
      setReplyFeedback(err.message || 'Reply failed.');
    } finally {
      setReplyLoading(false);
    }
  };

  const markMessageAsRead = async () => {
    if (!selectedMessage) return;
    setMessageActionLoading('read');
    setReplyFeedback('');
    try {
      const query = `?admin_user=${encodeURIComponent(username)}&admin_pass=${encodeURIComponent(password)}`;
      const res = await apiFetch(`/api/admin/messages/${selectedMessage.id}/read${query}`, {
        method: 'POST',
        headers: {
          'x-admin-user': username,
          'x-admin-pass': password,
          'x-admin-pin': ADMIN_FALLBACK_PIN,
        },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Failed to mark message as read.');
      setReplyFeedback(data.message || 'Message marked as read.');
      await fetchOverview(username, password);
    } catch (err: any) {
      setReplyFeedback(err.message || 'Failed to mark message as read.');
    } finally {
      setMessageActionLoading('');
    }
  };

  const deleteMessage = async () => {
    if (!selectedMessage) return;
    const confirmed = window.confirm('Are you sure you want to delete this message?');
    if (!confirmed) return;

    setMessageActionLoading('delete');
    setReplyFeedback('');
    try {
      const query = `?admin_user=${encodeURIComponent(username)}&admin_pass=${encodeURIComponent(password)}`;
      const res = await apiFetch(`/api/admin/messages/${selectedMessage.id}${query}`, {
        method: 'DELETE',
        headers: {
          'x-admin-user': username,
          'x-admin-pass': password,
          'x-admin-pin': ADMIN_FALLBACK_PIN,
        },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Failed to delete message.');
      setReplyFeedback(data.message || 'Message deleted successfully.');
      setSelectedMessage(null);
      setReplyText('');
      await fetchOverview(username, password);
    } catch (err: any) {
      setReplyFeedback(err.message || 'Failed to delete message.');
    } finally {
      setMessageActionLoading('');
    }
  };

  const navItems = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'top', label: 'Analytics', icon: BarChart3 },
    { id: 'users', label: 'Users & Tools', icon: Users },
    { id: 'usage', label: 'Usage Stats', icon: Activity },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
  ];

  const filteredMessages = messages
    .filter(
      (msg) =>
        msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (msg.ip || '').toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((msg) => messageTab === 'all' || msg.category === messageTab);

  const messageCounts = {
    all: messages.length,
    general: messages.filter((m) => m.category === 'general').length,
    tool: messages.filter((m) => m.category === 'tool').length,
    feedback: messages.filter((m) => m.category === 'feedback').length,
  };

  const getReplyStatusTone = (status?: string | null) => {
    if (status === 'replied') return 'bg-emerald-500/15 text-emerald-400';
    if (status === 'read') return 'bg-sky-500/15 text-sky-300';
    return 'bg-amber-500/15 text-amber-300';
  };

  const getReplyStatusLabel = (status?: string | null) => {
    if (status === 'replied') return 'Replied';
    if (status === 'read') return 'Read';
    return 'Pending';
  };

  // Access Screen
  if (!authed) {
    return (
      <div className="min-h-screen bg-[#0f0a0a] flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-rose-600/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-[120px] animate-pulse delay-700" />
        </div>

        <div className="relative z-10 w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="mb-6 flex justify-center">
              <BrandMark className="!bg-transparent !border-0 !shadow-none" textClassName="text-center" />
            </div>
            <p className="text-white text-[40px] font-black">VinzaTools</p>
            <p className="text-slate-400 text-2xl font-semibold">Management Console</p>
          </div>

        {/* Access Card */}
          <div className="bg-[#1a1414] border border-white/10 rounded-3xl p-8 shadow-2xl">
            <div className="mb-6 rounded-2xl border border-white/10 bg-[#151010] px-4 py-3 text-sm text-slate-400">
              Sign in to view live tool analytics, theme activity, messages, and recent usage from the VinzaTools dashboard.
            </div>
            {error && (
              <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-3 text-rose-400">
                <AlertCircle size={20} />
                <span className="text-sm font-medium">{error}</span>
              </div>
            )}

            <div className="space-y-5">
              <div className="group">
                <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
                  Username
                </label>
                <div className="relative">
                  <User
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-rose-400 transition-colors"
                    size={20}
                  />
                  <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === 'Enter' && fetchOverview(username, password)
                    }
                    className="w-full pl-12 pr-4 py-4 bg-[#0f0a0a] border border-white/10 rounded-xl text-white placeholder-slate-600 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/50 transition-all outline-none"
                    placeholder="Enter username"
                  />
                </div>
              </div>

              <div className="group">
                <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-rose-400 transition-colors"
                    size={20}
                  />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === 'Enter' && fetchOverview(username, password)
                    }
                    className="w-full pl-12 pr-4 py-4 bg-[#0f0a0a] border border-white/10 rounded-xl text-white placeholder-slate-600 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/50 transition-all outline-none"
                    placeholder="Enter password"
                  />
                </div>
              </div>

              <button
                onClick={() => fetchOverview(username, password)}
                disabled={loading || !username || !password}
                className="w-full py-4 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-lg shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 transform hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <RefreshCw className="animate-spin" size={20} />
                    Authenticating...
                  </>
                ) : (
                  <>
                    <Zap size={20} />
                    Access Dashboard
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main Dashboard
  return (
    <div className="min-h-screen bg-[#0f0a0a] text-white">
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-[#1a1414] border-b border-white/10 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <BrandMark compact subtitle="Admin Console" />
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg bg-white/5 border border-white/10"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div className="flex max-w-[1600px] mx-auto">
        {/* Sidebar */}
        <aside
          className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:sticky lg:top-0 left-0 z-40 w-72 h-screen bg-[#151010] border-r border-white/10 transition-transform duration-300 overflow-y-auto`}
        >
          <div className="p-6 flex flex-col h-full">
            {/* Logo */}
            <div className="mb-10">
              <BrandMark subtitle="Admin Console" />
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                      active
                        ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon size={20} />
                    <span className="font-semibold">{item.label}</span>
                    {active && <ChevronRight size={16} className="ml-auto" />}
                  </button>
                );
              })}
            </nav>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-white/10 space-y-2">
              <button
                onClick={refresh}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all"
              >
                <RefreshCw
                  size={18}
                  className={loading ? 'animate-spin' : ''}
                />
                <span className="font-medium text-sm">Refresh Data</span>
              </button>
              <button
                onClick={() => setAuthed(false)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-all"
              >
                <LogOut size={18} />
                <span className="font-medium text-sm">Logout</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 min-h-screen p-4 lg:p-8">
          {/* Top Bar */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl lg:text-3xl font-black text-white mb-1">
                {navItems.find((n) => n.id === activeTab)?.label}
              </h2>
              <p className="text-slate-400 text-sm flex items-center gap-2">
                <Clock size={14} />
                Last updated: {lastRefreshed || 'Just now'}
              </p>
            </div>
            <div className="flex items-center gap-4 relative">
              <button
                onClick={() => setShowNotifications((prev) => !prev)}
                className="p-3 rounded-xl bg-[#1a1414] border border-white/10 text-slate-400 hover:text-white hover:border-rose-500/50 transition-all relative"
              >
                <Bell size={20} />
                {messages.length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
                )}
              </button>
              {showNotifications && (
                <div className="absolute right-0 top-14 w-96 bg-[#151010] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden">
                  <div className="p-4 border-b border-white/10 flex items-center justify-between">
                    <div>
                      <div className="text-sm font-bold text-white">
                        Notifications
                      </div>
                      <div className="text-xs text-slate-500">
                        Latest activity & messages
                      </div>
                    </div>
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <div className="max-h-[420px] overflow-y-auto app-scrollbar">
                    <div className="p-4 border-b border-white/5">
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                        Recent Usage
                      </div>
                      <div className="space-y-2">
                        {recentUsage.slice(0, 5).map((row, idx) => (
                          <div
                            key={`${row.toolId}-${row.timestamp}-${idx}`}
                            className="p-3 bg-[#0f0a0a] border border-white/5 rounded-xl"
                          >
                            <div className="text-sm text-white font-medium">
                              {row.toolId}
                            </div>
                            <div className="text-xs text-slate-500 font-mono">
                              {row.clientId
                                ? formatClient(row.clientId)
                                : 'Anonymous'}{' '}
                              {row.ip ? `· ${row.ip}` : ''}
                            </div>
                          </div>
                        ))}
                        {recentUsage.length === 0 && (
                          <div className="text-xs text-slate-500">
                            No recent usage yet.
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="p-4 border-b border-white/5">
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                        Theme Activity
                      </div>
                      <div className="space-y-2">
                        {recentThemeActivity.slice(0, 4).map((row, idx) => (
                          <div
                            key={`${row.themeId}-${row.actionName}-${row.timestamp}-${idx}`}
                            className="p-3 bg-[#0f0a0a] border border-white/5 rounded-xl"
                          >
                            <div className="text-sm text-white font-medium">
                              {formatThemeName(row.themeId)}
                            </div>
                            <div className="text-xs text-slate-500">
                              {formatThemeAction(row.actionName)}
                              {row.ip ? ` · ${row.ip}` : ''}
                            </div>
                          </div>
                        ))}
                        {recentThemeActivity.length === 0 && (
                          <div className="text-xs text-slate-500">
                            No theme activity yet.
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                        Latest Messages
                      </div>
                      <div className="space-y-2">
                        {messages.slice(0, 5).map((msg) => (
                          <button
                            key={msg.id}
                            onClick={() => {
                              setActiveTab('messages');
                              setSelectedMessage(msg);
                              setShowNotifications(false);
                            }}
                            className="w-full text-left p-3 bg-[#0f0a0a] border border-white/5 rounded-xl hover:border-rose-500/30 transition-all"
                          >
                            <div className="text-sm text-white font-medium truncate">
                              {msg.subject || 'No subject'}
                            </div>
                            <div className="text-xs text-slate-500 truncate">
                              {msg.name} · {msg.email}
                            </div>
                          </button>
                        ))}
                        {messages.length === 0 && (
                          <div className="text-xs text-slate-500">
                            No messages yet.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div className="hidden md:flex items-center gap-3 px-4 py-2 rounded-xl bg-[#1a1414] border border-white/10">
                <div className="w-8 h-8 rounded-full bg-rose-500 flex items-center justify-center text-sm font-bold">
                  {username[0]?.toUpperCase()}
                </div>
                <span className="font-medium text-sm">{username}</span>
              </div>
            </div>
          </div>

          {/* Dashboard Content */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-4">
                {[
                  {
                    label: 'Total Events',
                    value: totalEvents.toLocaleString(),
                    icon: Activity,
                    trend: '+12%',
                    subtext: 'All time usage',
                  },
                  {
                    label: 'Active Users',
                    value: uniqueUsers.toLocaleString(),
                    icon: Users,
                    trend: '+5%',
                    subtext: 'Unique clients',
                  },
                  {
                    label: 'Tools Tracked',
                    value: TOTAL_AVAILABLE_TOOLS,
                    icon: Layers,
                    trend: '0%',
                    subtext: 'Available tools',
                  },
                  {
                    label: 'Theme Library',
                    value: themeSummary.totalThemes,
                    icon: Database,
                    trend:
                      themeSummary.previewReady > 0
                        ? `${themeSummary.previewReady} live`
                        : '0',
                    subtext: 'Stored themes',
                  },
                  {
                    label: 'New Messages',
                    value: messages.length,
                    icon: Mail,
                    trend: messages.length > 0 ? 'New' : '0',
                    subtext: 'Unread messages',
                  },
                  {
                    label: 'Theme Traffic',
                    value: Number(themeSummary.totalTraffic || 0),
                    icon: Eye,
                    trend:
                      Number(themeSummary.uniqueVisitors || 0) > 0
                        ? `${Number(themeSummary.uniqueVisitors || 0)} visitors`
                        : '0',
                    subtext: 'Preview + download events',
                  },
                  {
                    label: 'Active IPs',
                    value: usageByIp.length,
                    icon: ShieldCheck,
                    trend: usageByIp.length > 0 ? 'Live' : '0',
                    subtext: 'Distinct IPs',
                  },
                ].map((stat, idx) => (
                  <div
                    key={idx}
                    className="group bg-[#1a1414] border border-white/10 rounded-2xl p-6 hover:border-rose-500/30 transition-all hover:shadow-xl hover:shadow-rose-500/5"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 rounded-xl bg-rose-500/10 text-rose-400">
                        <stat.icon size={24} />
                      </div>
                      <span
                        className={`text-xs font-bold px-2 py-1 rounded-full ${
                          stat.trend.startsWith('+')
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : stat.trend.includes('live') ||
                                stat.trend.includes('ready')
                              ? 'bg-sky-500/20 text-sky-400'
                            : stat.trend === 'New'
                              ? 'bg-rose-500/20 text-rose-400'
                              : 'bg-slate-500/20 text-slate-400'
                        }`}
                      >
                        {stat.trend}
                      </span>
                    </div>
                    <div className="text-3xl font-black text-white mb-1 group-hover:text-rose-400 transition-colors">
                      {stat.value}
                    </div>
                    <div className="text-sm text-slate-500">{stat.subtext}</div>
                  </div>
                ))}
              </div>

              {/* Quick Insights */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-[#1a1414] border border-white/10 rounded-2xl p-6 hover:border-rose-500/20 transition-all">
                  <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                    <TrendingUp size={20} className="text-rose-400" />
                    Top Performing Tool
                  </h3>
                  {topTool ? (
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-rose-500/5 border border-rose-500/20">
                      <div className="w-16 h-16 rounded-2xl bg-rose-500 flex items-center justify-center text-2xl font-black text-white">
                        {topTool.toolId[0]}
                      </div>
                      <div className="flex-1">
                        <div className="text-xl font-bold text-white mb-1">
                          {topTool.toolId}
                        </div>
                        <div className="text-sm text-slate-400">
                          {topTool.count.toLocaleString()} total uses
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-black text-rose-400">
                          #1
                        </div>
                        <div className="text-xs text-slate-500">Rank</div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-8 text-center text-slate-500 bg-[#0f0a0a] rounded-xl border border-white/5">
                      No data available yet
                    </div>
                  )}
                </div>

                <div className="bg-[#1a1414] border border-white/10 rounded-2xl p-6 hover:border-rose-500/20 transition-all">
                  <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                    <UserCog size={20} className="text-rose-400" />
                    Most Active User
                  </h3>
                  {topUser ? (
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-rose-500/5 border border-rose-500/20">
                      <div className="w-16 h-16 rounded-2xl bg-[#0f0a0a] border border-rose-500/30 flex items-center justify-center text-2xl font-black text-rose-400">
                        {formatClient(topUser.clientId)[0]}
                      </div>
                      <div className="flex-1">
                        <div className="text-xl font-bold text-white mb-1 font-mono">
                          {formatClient(topUser.clientId)}
                        </div>
                        <div className="text-sm text-slate-400">
                          {topUser.count.toLocaleString()} events
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-black text-rose-400">
                          #1
                        </div>
                        <div className="text-xs text-slate-500">Rank</div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-8 text-center text-slate-500 bg-[#0f0a0a] rounded-xl border border-white/5">
                      No user activity yet
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-[1.25fr,0.9fr] gap-6">
                <div className="bg-[#1a1414] border border-white/10 rounded-2xl p-6 hover:border-rose-500/20 transition-all">
                  <div className="flex items-start justify-between gap-4 mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Database size={20} className="text-rose-400" />
                        Theme Library Snapshot
                      </h3>
                      <p className="text-sm text-slate-400 mt-1">
                        Shopify themes, preview readiness, and download health in one place.
                      </p>
                    </div>
                    <div className="rounded-full border border-rose-500/20 bg-rose-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-rose-300">
                      {themeSummary.totalThemes} themes
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 gap-4 mb-6">
                    {[
                      {
                        label: 'Preview Ready',
                        value: themeSummary.previewReady,
                        hint: 'Live preview now',
                      },
                      {
                        label: 'Build Ready',
                        value: themeSummary.buildReady,
                        hint: 'Can prepare preview',
                      },
                      {
                        label: 'Total Downloads',
                        value: themeSummary.totalDownloads,
                        hint: 'Theme zip exports',
                      },
                      {
                        label: 'Preview Opens',
                        value: themeSummary.totalPreviews,
                        hint: 'Visitor preview hits',
                      },
                      {
                        label: 'Unique Visitors',
                        value: Number(themeSummary.uniqueVisitors || 0),
                        hint: 'IPs tracked on themes',
                      },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="rounded-xl border border-white/8 bg-[#0f0a0a] p-4"
                      >
                        <div className="text-xs uppercase tracking-[0.22em] text-slate-500">
                          {item.label}
                        </div>
                        <div className="mt-3 text-3xl font-black text-white">
                          {item.value}
                        </div>
                        <div className="mt-1 text-sm text-slate-400">{item.hint}</div>
                      </div>
                    ))}
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    {themes.slice(0, 4).map((theme) => (
                      <div
                        key={theme.id}
                        className="rounded-2xl border border-white/8 bg-[#0f0a0a] p-4 hover:border-rose-500/20 transition-all"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="text-base font-bold text-white">
                              {formatThemeName(theme.name)}
                            </div>
                            <div className="mt-1 text-xs text-slate-500">
                              {theme.relativePath}
                            </div>
                          </div>
                          <div
                            className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] ${
                              theme.hasPreview
                                ? 'bg-emerald-500/15 text-emerald-300'
                                : 'bg-amber-500/15 text-amber-300'
                            }`}
                          >
                            {theme.hasPreview ? 'Live' : 'Build'}
                          </div>
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                          <div className="rounded-xl bg-[#151010] px-3 py-3">
                            <div className="text-slate-500">Files</div>
                            <div className="mt-1 font-bold text-white">{theme.fileCount}</div>
                          </div>
                          <div className="rounded-xl bg-[#151010] px-3 py-3">
                            <div className="text-slate-500">Quick Views</div>
                            <div className="mt-1 font-bold text-white">
                              {theme.previewFiles.length}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {themes.length === 0 && (
                      <div className="col-span-full rounded-2xl border border-dashed border-white/10 bg-[#0f0a0a] p-8 text-center text-slate-500">
                        Theme library abhi empty hai. Shopify themes folder me items add karo aur yahan live data show hoga.
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-[#1a1414] border border-white/10 rounded-2xl p-6 hover:border-rose-500/20 transition-all">
                  <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                    <Eye size={20} className="text-rose-400" />
                    Theme Activity Feed
                  </h3>

                  <div className="rounded-2xl border border-rose-500/15 bg-rose-500/5 p-4 mb-5">
                    <div className="text-xs uppercase tracking-[0.22em] text-rose-300">
                      Featured Theme
                    </div>
                    <div className="mt-2 text-xl font-black text-white">
                      {hottestTheme ? formatThemeName(hottestTheme.name) : 'No theme yet'}
                    </div>
                    <div className="mt-2 text-sm text-slate-400">
                      {hottestTheme
                        ? `${hottestTheme.fileCount} files · ${hottestTheme.previewFiles.length} quick preview files`
                        : 'Add a Shopify theme to start tracking previews and downloads.'}
                    </div>
                  </div>

                  <div className="mb-5 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-white/8 bg-[#0f0a0a] p-4">
                      <div className="text-xs uppercase tracking-[0.22em] text-slate-500">
                        Top Theme Visitor
                      </div>
                      <div className="mt-2 text-lg font-black text-white">
                        {topThemeVisitor?.ip || 'No visitor yet'}
                      </div>
                      <div className="mt-1 text-sm text-slate-400">
                        {topThemeVisitor
                          ? `${topThemeVisitor.previews} previews · ${topThemeVisitor.downloads} downloads`
                          : 'Theme visitors will appear after preview or download activity.'}
                      </div>
                    </div>
                    <div className="rounded-2xl border border-white/8 bg-[#0f0a0a] p-4">
                      <div className="text-xs uppercase tracking-[0.22em] text-slate-500">
                        Theme Traffic Window
                      </div>
                      <div className="mt-2 text-lg font-black text-white">
                        {themeTrafficByDay.length} tracked day{themeTrafficByDay.length === 1 ? '' : 's'}
                      </div>
                      <div className="mt-1 text-sm text-slate-400">
                        {Number(themeSummary.totalTraffic || 0)} total theme events across previews, downloads, and prepares.
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 max-h-[420px] overflow-y-auto app-scrollbar">
                    {recentThemeActivity.map((row, idx) => (
                      <div
                        key={`${row.themeId}-${row.actionName}-${row.timestamp}-${idx}`}
                        className="rounded-xl border border-white/8 bg-[#0f0a0a] p-4"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <div className="font-semibold text-white">
                              {formatThemeName(row.themeId)}
                            </div>
                            <div className="mt-1 text-xs uppercase tracking-[0.18em] text-rose-300">
                              {formatThemeAction(row.actionName)}
                            </div>
                            {row.userAgent && (
                              <div className="mt-2 line-clamp-2 text-xs text-slate-500">
                                {row.userAgent}
                              </div>
                            )}
                          </div>
                          <div className="text-right text-xs text-slate-500">
                            <div>{row.timestamp}</div>
                            <div>{row.ip || 'No IP'}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {recentThemeActivity.length === 0 && (
                      <div className="rounded-2xl border border-dashed border-white/10 bg-[#0f0a0a] p-8 text-center text-slate-500">
                        Preview, prepare, ya download karte hi yahan theme activity aa jayegi.
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-[#1a1414] border border-white/10 rounded-2xl p-6 hover:border-rose-500/20 transition-all">
                <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Globe size={20} className="text-rose-400" />
                      Theme Visitors & Downloads
                    </h3>
                    <p className="text-sm text-slate-400 mt-1">
                      See which users and IPs opened previews, downloaded themes, or prepared preview builds.
                    </p>
                  </div>
                  <div className="rounded-full border border-rose-500/20 bg-rose-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-rose-300">
                    {Number(themeSummary.uniqueVisitors || 0)} visitors tracked
                  </div>
                </div>

                <div className="overflow-x-auto app-scrollbar">
                  <div className="min-w-[760px] space-y-3">
                    {themeTrafficByVisitor.map((row) => (
                      <div
                        key={`${row.ip}-${row.lastSeen}`}
                        className="grid grid-cols-[1.3fr,120px,120px,120px,120px,160px] items-center gap-3 rounded-xl border border-white/8 bg-[#0f0a0a] p-4"
                      >
                        <div>
                          <div className="text-sm font-semibold text-white">{row.ip || 'Unknown'}</div>
                          <div className="mt-1 text-xs text-slate-500">Latest theme activity by this visitor</div>
                        </div>
                        <div>
                          <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Traffic</div>
                          <div className="mt-1 text-base font-bold text-white">{row.totalActions}</div>
                        </div>
                        <div>
                          <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Previews</div>
                          <div className="mt-1 text-base font-bold text-white">{row.previews}</div>
                        </div>
                        <div>
                          <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Downloads</div>
                          <div className="mt-1 text-base font-bold text-white">{row.downloads}</div>
                        </div>
                        <div>
                          <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Prepares</div>
                          <div className="mt-1 text-base font-bold text-white">{row.prepares}</div>
                        </div>
                        <div>
                          <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Last Seen</div>
                          <div className="mt-1 text-sm text-slate-300">{row.lastSeen}</div>
                        </div>
                      </div>
                    ))}
                    {themeTrafficByVisitor.length === 0 && (
                      <div className="rounded-2xl border border-dashed border-white/10 bg-[#0f0a0a] p-8 text-center text-slate-500">
                        Theme visitor analytics will appear here as soon as users preview or download a theme.
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-[#1a1414] border border-white/10 rounded-2xl p-6 hover:border-rose-500/20 transition-all">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <Activity size={20} className="text-rose-400" />
                  Recent Activity
                </h3>
                <div className="space-y-2 max-h-[420px] overflow-y-auto app-scrollbar">
                  {recentUsage.map((row, idx) => (
                    <div
                      key={`${row.toolId}-${row.timestamp}-${idx}`}
                      className="flex items-center justify-between p-3 rounded-lg bg-[#0f0a0a] border border-white/5 hover:border-rose-500/20 transition-all"
                    >
                      <div className="flex flex-col">
                        <span className="text-sm text-white font-medium">
                          {row.toolId}{' '}
                          {row.subAction ? `· ${row.subAction}` : ''}
                        </span>
                        <span className="text-xs text-slate-500 font-mono">
                          {row.clientId
                            ? formatClient(row.clientId)
                            : 'Anonymous'}{' '}
                          {row.ip ? `· ${row.ip}` : ''}
                        </span>
                      </div>
                      <span className="text-xs text-slate-400 whitespace-nowrap">
                        {row.timestamp}
                      </span>
                    </div>
                  ))}
                  {recentUsage.length === 0 && (
                    <div className="text-center py-10 text-slate-500">
                      No recent usage yet. Use some tools to see live activity
                      here.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'top' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-[#1a1414] border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <BarChart3 size={20} className="text-rose-400" />
                  Tool Usage Ranking
                </h3>
                <div className="space-y-3">
                  {usageByTool.map((row, idx) => (
                    <div
                      key={row.toolId}
                      className="flex items-center gap-4 p-4 rounded-xl bg-[#0f0a0a] border border-white/5 hover:border-rose-500/20 transition-all group"
                    >
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm ${
                          idx < 3
                            ? 'bg-rose-500 text-white'
                            : 'bg-white/10 text-slate-400'
                        }`}
                      >
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-white mb-1">
                          {row.toolId}
                        </div>
                        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-rose-500 rounded-full transition-all duration-500"
                            style={{
                              width: `${(row.count / (usageByTool[0]?.count || 1)) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-white">
                          {row.count.toLocaleString()}
                        </div>
                        <div className="text-xs text-slate-500">uses</div>
                      </div>
                    </div>
                  ))}
                  {usageByTool.length === 0 && (
                    <div className="text-center py-12 text-slate-500">
                      <Database size={48} className="mx-auto mb-4 opacity-50" />
                      No analytics data available
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-[#1a1414] border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <Calendar size={20} className="text-rose-400" />
                  Daily Activity Trend
                </h3>
                <div className="space-y-3">
                  {usageByDay.slice(0, 10).map((row) => (
                    <div
                      key={row.day}
                      className="flex items-center justify-between p-4 rounded-xl bg-[#0f0a0a] border border-white/5"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-rose-500/10 flex items-center justify-center">
                          <Calendar size={18} className="text-rose-400" />
                        </div>
                        <span className="font-medium text-white">
                          {row.day}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="h-8 w-32 bg-white/5 rounded-lg overflow-hidden">
                          <div
                            className="h-full bg-rose-500/60"
                            style={{
                              width: `${Math.min((row.count / 100) * 100, 100)}%`,
                            }}
                          />
                        </div>
                        <span className="font-bold text-white w-12 text-right">
                          {row.count}
                        </span>
                      </div>
                    </div>
                  ))}
                  {usageByDay.length === 0 && (
                    <div className="text-center py-12 text-slate-500">
                      <Clock size={48} className="mx-auto mb-4 opacity-50" />
                      No daily statistics yet
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-[#1a1414] border border-white/10 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                    <Users size={20} className="text-rose-400" />
                    Active Users
                  </h3>
                  <div className="space-y-3 max-h-[600px] overflow-y-auto app-scrollbar">
                    {usageByUser.map((row) => {
                      const userTopTool = usageByUserTool
                        .filter((t) => t.clientId === row.clientId)
                        .sort((a, b) => b.count - a.count)[0];
                      return (
                        <div
                          key={row.clientId}
                          className="p-4 rounded-xl bg-[#0f0a0a] border border-white/5 hover:border-rose-500/20 transition-all"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-rose-500/20 flex items-center justify-center font-bold text-rose-400 text-sm">
                                {formatClient(row.clientId)[0]}
                              </div>
                              <div>
                                <div className="font-mono text-sm text-white">
                                  {formatClient(row.clientId)}
                                </div>
                                <div className="text-xs text-slate-500">
                                  Active User
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-rose-400">
                                {row.count}
                              </div>
                              <div className="text-xs text-slate-500">
                                events
                              </div>
                            </div>
                          </div>
                          {userTopTool && (
                            <div className="mt-3 pt-3 border-t border-white/5 flex items-center gap-2 text-xs text-slate-400">
                              <Zap size={12} className="text-rose-400" />
                              Favorite:{' '}
                              <span className="text-white font-medium">
                                {userTopTool.toolId}
                              </span>{' '}
                              ({userTopTool.count} uses)
                            </div>
                          )}
                        </div>
                      );
                    })}
                    {usageByUser.length === 0 && (
                      <div className="text-center py-12 text-slate-500">
                        No users found
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-[#1a1414] border border-white/10 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                    <Layers size={20} className="text-rose-400" />
                    User-Tool Matrix
                  </h3>
                  <div className="space-y-2 max-h-[600px] overflow-y-auto app-scrollbar">
                    {usageByUserTool.slice(0, 30).map((row) => (
                      <div
                        key={`${row.clientId}-${row.toolId}`}
                        className="flex items-center justify-between p-3 rounded-lg bg-[#0f0a0a] border border-white/5 hover:border-rose-500/20 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-xs text-slate-500">
                            {formatClient(row.clientId)}
                          </span>
                          <ArrowUpRight size={14} className="text-slate-600" />
                          <span className="font-medium text-white text-sm">
                            {row.toolId}
                          </span>
                        </div>
                        <span className="text-xs font-bold bg-rose-500/20 text-rose-400 px-2 py-1 rounded">
                          {row.count}
                        </span>
                      </div>
                    ))}
                    {usageByUserTool.length === 0 && (
                      <div className="text-center py-12 text-slate-500">
                        No usage data
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-[#1a1414] border border-white/10 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                    <ShieldCheck size={20} className="text-rose-400" />
                    Recent IPs
                  </h3>
                  <div className="space-y-2 max-h-[600px] overflow-y-auto app-scrollbar">
                    {usageByIp.map((row) => (
                      <div
                        key={`${row.ip}-${row.count}`}
                        className="flex items-center justify-between p-3 rounded-lg bg-[#0f0a0a] border border-white/5 hover:border-rose-500/20 transition-all"
                      >
                        <div className="font-mono text-xs text-slate-300">
                          {row.ip || 'Unknown'}
                        </div>
                        <span className="text-xs font-bold bg-rose-500/20 text-rose-400 px-2 py-1 rounded">
                          {row.count}
                        </span>
                      </div>
                    ))}
                    {usageByIp.length === 0 && (
                      <div className="text-center py-12 text-slate-500">
                        No IP data yet
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'usage' && (
            <div className="bg-[#1a1414] border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Database size={20} className="text-rose-400" />
                Complete Usage Log
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        User
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Tool
                      </th>
                      <th className="text-right py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Uses
                      </th>
                      <th className="text-right py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Share
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {usageByUserTool.map((row) => {
                      const percentage = (
                        (row.count / totalEvents) *
                        100
                      ).toFixed(1);
                      return (
                        <tr
                          key={`${row.clientId}-${row.toolId}`}
                          className="hover:bg-white/5 transition-colors"
                        >
                          <td className="py-3 px-4 font-mono text-sm text-slate-300">
                            {formatClient(row.clientId)}
                          </td>
                          <td className="py-3 px-4 text-sm text-white font-medium">
                            {row.toolId}
                          </td>
                          <td className="py-3 px-4 text-right text-sm font-bold text-white">
                            {row.count}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-rose-500 rounded-full"
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                              <span className="text-xs text-slate-400 w-10">
                                {percentage}%
                              </span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {usageByUserTool.length === 0 && (
                  <div className="text-center py-12 text-slate-500">
                    <Database size={48} className="mx-auto mb-4 opacity-50" />
                    No usage records found
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'messages' && (
            <div className="space-y-6">
              {/* Message Tabs */}
              <div className="flex flex-wrap gap-2">
                {(
                  [
                    { id: 'all', label: 'All Messages' },
                    { id: 'general', label: 'Contact' },
                    { id: 'tool', label: 'Tool Requests' },
                    { id: 'feedback', label: 'Feedback' },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setMessageTab(tab.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                      messageTab === tab.id
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : 'bg-[#1a1414] text-slate-400 border border-white/10 hover:text-white hover:border-white/20'
                    }`}
                  >
                    {tab.label}{' '}
                    <span className="ml-1 text-[10px] text-slate-500">
                      ({messageCounts[tab.id]})
                    </span>
                  </button>
                ))}
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search messages by name, email, or subject..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-[#1a1414] border border-white/10 rounded-xl text-white placeholder-slate-600 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/50 transition-all outline-none"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Message List */}
                <div className="lg:col-span-1 space-y-3 max-h-[700px] overflow-y-auto app-scrollbar">
                  {filteredMessages.map((msg) => (
                    <button
                      key={msg.id}
                      onClick={() => {
                        setSelectedMessage(msg);
                        setReplyText(msg.lastReplyText || '');
                        setReplyFeedback('');
                      }}
                      className={`w-full text-left p-4 rounded-xl border transition-all ${
                        selectedMessage?.id === msg.id
                          ? 'bg-rose-500/10 border-rose-500/30'
                          : 'bg-[#1a1414] border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <span className="font-semibold text-white text-sm truncate pr-2">
                          {msg.name}
                        </span>
                        <span className="text-xs text-slate-500 whitespace-nowrap">
                          {msg.timestamp}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mb-2">
                        {msg.email}
                      </div>
                      <div className="text-sm text-slate-300 line-clamp-2 font-medium mb-2">
                        {msg.subject || 'No subject'}
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] uppercase tracking-wider px-2 py-1 rounded-full bg-rose-500/20 text-rose-400 font-bold">
                          {msg.category}
                        </span>
                          <span className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-full font-bold ${
                           getReplyStatusTone(msg.replyStatus)
                          }`}>
                           {getReplyStatusLabel(msg.replyStatus)}
                          </span>
                      </div>
                    </button>
                  ))}
                  {filteredMessages.length === 0 && (
                    <div className="text-center py-12 text-slate-500 bg-[#1a1414] rounded-xl border border-white/10">
                      <Mail size={48} className="mx-auto mb-4 opacity-50" />
                      No messages found
                    </div>
                  )}
                </div>

                {/* Message Detail */}
                <div className="lg:col-span-2">
                  {selectedMessage ? (
                    <div className="bg-[#1a1414] border border-white/10 rounded-2xl p-6 h-full">
                      <div className="flex items-start justify-between mb-6 pb-6 border-b border-white/10">
                        <div>
                          <h3 className="text-xl font-bold text-white mb-2">
                            {selectedMessage.subject || 'No Subject'}
                          </h3>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
                            <span className="flex items-center gap-2">
                              <User size={14} />
                              {selectedMessage.name}
                            </span>
                            <span className="flex items-center gap-2">
                              <Mail size={14} />
                              {selectedMessage.email}
                            </span>
                            {selectedMessage.phone && (
                              <span className="flex items-center gap-2">
                                <Globe size={14} />
                                {selectedMessage.phone}
                              </span>
                            )}
                            {selectedMessage.ip && (
                              <span className="flex items-center gap-2 font-mono text-xs text-slate-400">
                                <ShieldCheck size={14} />
                                {selectedMessage.ip}
                              </span>
                            )}
                            <span className="flex items-center gap-2">
                              <Clock size={14} />
                              {selectedMessage.timestamp}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-400 text-xs font-bold uppercase">
                            {selectedMessage.category}
                          </span>
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                             getReplyStatusTone(selectedMessage.replyStatus)
                            }`}>
                             {getReplyStatusLabel(selectedMessage.replyStatus)}
                            </span>
                        </div>
                      </div>
                      <div className="prose prose-invert max-w-none">
                        <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                          {selectedMessage.message}
                        </p>
                      </div>
                      {(selectedMessage.lastReplyText || selectedMessage.repliedAt) && (
                        <div className="mt-6 rounded-2xl border border-emerald-500/15 bg-emerald-500/5 p-4">
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-400">
                              Latest Reply
                            </div>
                            <div className="text-xs text-slate-500">
                              {selectedMessage.lastReplyChannel || 'email'} {selectedMessage.repliedAt ? `· ${selectedMessage.repliedAt}` : ''}
                            </div>
                          </div>
                          {selectedMessage.lastReplyText && (
                            <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-300">
                              {selectedMessage.lastReplyText}
                            </p>
                          )}
                        </div>
                      )}

                      <div className="mt-8 rounded-2xl border border-white/10 bg-[#120d0d] p-4">
                        <div className="mb-3 flex items-center justify-between gap-3">
                          <div>
                            <div className="text-sm font-bold text-white">Reply to this message</div>
                            <div className="text-xs text-slate-500">
                              {selectedMessage.phone ? 'This reply will open in WhatsApp.' : 'This reply will open in email.'}
                            </div>
                          </div>
                          <span className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
                            {selectedMessage.phone ? 'WhatsApp route' : 'Email route'}
                          </span>
                        </div>
                        <textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Write your reply here..."
                          className="h-32 w-full resize-none rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-slate-600 focus:border-rose-500/40"
                        />
                        {replyFeedback && (
                          <div className={`mt-3 text-sm font-medium ${replyFeedback.toLowerCase().includes('failed') || replyFeedback.toLowerCase().includes('please') ? 'text-amber-300' : 'text-emerald-400'}`}>
                            {replyFeedback}
                          </div>
                        )}
                      </div>

                        <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap gap-3">
                          <button
                            onClick={sendReply}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 transition-all font-medium text-sm"
                            disabled={replyLoading}
                          >
                            {replyLoading ? <RefreshCw size={18} className="animate-spin" /> : <ArrowUpRight size={18} />}
                            {replyLoading ? 'Preparing...' : 'Send Reply'}
                          </button>
                          <button
                            onClick={markMessageAsRead}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-sky-500/15 text-sky-300 hover:bg-sky-500/25 transition-all font-medium text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                            disabled={messageActionLoading !== '' || selectedMessage.replyStatus === 'read'}
                          >
                            {messageActionLoading === 'read' ? <RefreshCw size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
                            {selectedMessage.replyStatus === 'read' ? 'Already Read' : messageActionLoading === 'read' ? 'Saving...' : 'Mark as Read'}
                          </button>
                          <button
                            onClick={deleteMessage}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 text-slate-400 hover:bg-white/10 transition-all font-medium text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                            disabled={messageActionLoading !== ''}
                          >
                            {messageActionLoading === 'delete' ? <RefreshCw size={18} className="animate-spin" /> : <Trash2 size={18} />}
                            {messageActionLoading === 'delete' ? 'Deleting...' : 'Delete'}
                          </button>
                        </div>
                    </div>
                  ) : (
                    <div className="h-full min-h-[400px] flex items-center justify-center bg-[#1a1414] rounded-2xl border border-white/10 border-dashed">
                      <div className="text-center text-slate-500">
                        <MessageSquare
                          size={64}
                          className="mx-auto mb-4 opacity-30"
                        />
                        <p>Select a message to view details</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};


