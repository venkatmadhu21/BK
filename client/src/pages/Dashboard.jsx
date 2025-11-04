import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Users,
  Newspaper,
  Calendar,
  User,
  TrendingUp,
  Heart,
  MessageCircle,
  Link as LinkIcon,
  ExternalLink,
  Sparkles,
  Shield,
  Star
} from 'lucide-react';
import heroImage from '../assets/images/hero.jpg';
import ionBal from '../assets/images/ion-bal.jpg';
import api from '../utils/api';
import '../styles/heritage-background.css';

// Small helper for accent ring without changing primary palette
const Card = ({ children, className = '' }) => (
  <div className={`relative overflow-hidden rounded-3xl bg-white/75 backdrop-blur-xl shadow-lg shadow-orange-100/60 border border-white/60 transition-transform duration-300 ${className}`}>
    <div
      className="absolute inset-0 rounded-3xl pointer-events-none"
      style={{
        background: 'linear-gradient(135deg, rgba(251,146,60,0.12), rgba(59,130,246,0.08))',
        mask: 'linear-gradient(#000, #000) content-box, linear-gradient(#000, #000)',
        WebkitMask: 'linear-gradient(#000, #000) content-box, linear-gradient(#000, #000)',
        padding: '1px'
      }}
    ></div>
    <div className="relative z-10">{children}</div>
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [quickStats, setQuickStats] = useState([
    { title: 'Family Members', value: '0', icon: Users, tint: 'bg-orange-100 text-orange-600', chip: '' },
    { title: 'Recent News', value: '0', icon: Newspaper, tint: 'bg-emerald-100 text-emerald-600', chip: '' },
    { title: 'Upcoming Events', value: '0', icon: Calendar, tint: 'bg-violet-100 text-violet-600', chip: '' },
    { title: 'New Photos/albums', value: '0', icon: TrendingUp, tint: 'bg-amber-100 text-amber-700', chip: '' },
  ]);
  const [recentNews, setRecentNews] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const fetchDashboardData = async () => {
      const [familyResult, newsResult, eventsResult, mediaResult] = await Promise.allSettled([
        api.get('/api/family'),
        api.get('/api/news', {
          params: {
            limit: 5,
            sortBy: 'publishDate',
            sortOrder: 'desc'
          }
        }),
        api.get('/api/events', {
          params: {
            status: 'Upcoming',
            limit: 5,
            sortBy: 'startDate',
            sortOrder: 'asc'
          }
        }),
        api.get('/api/media')
      ]);

      if (!isMounted) {
        return;
      }

      const membersData = familyResult.status === 'fulfilled' ? familyResult.value?.data || [] : [];
      const newsData = newsResult.status === 'fulfilled' ? newsResult.value?.data?.news || [] : [];
      const eventsData = eventsResult.status === 'fulfilled' ? eventsResult.value?.data?.events || [] : [];
      const mediaData = mediaResult.status === 'fulfilled' ? mediaResult.value?.data?.media || [] : [];

      const membersCount = Array.isArray(membersData) ? membersData.length : 0;
      const newsCount = Array.isArray(newsData) ? newsData.length : 0;
      const eventsCount = Array.isArray(eventsData) ? eventsData.length : 0;
      const mediaCount = Array.isArray(mediaData) ? mediaData.length : 0;

      setQuickStats([
        { title: 'Family Members', value: membersCount.toString(), icon: Users, tint: 'bg-orange-100 text-orange-600', chip: membersCount ? `${membersCount} total` : '' },
        { title: 'Recent News', value: newsCount.toString(), icon: Newspaper, tint: 'bg-emerald-100 text-emerald-600', chip: newsCount ? `${newsCount} published` : '' },
        { title: 'Upcoming Events', value: eventsCount.toString(), icon: Calendar, tint: 'bg-violet-100 text-violet-600', chip: eventsCount ? `${eventsCount} scheduled` : '' },
        { title: 'New Photos/albums', value: mediaCount.toString(), icon: TrendingUp, tint: 'bg-amber-100 text-amber-700', chip: mediaCount ? `${mediaCount} items` : '' },
      ]);

      const newsItems = newsData.slice(0, 3).map((item) => ({
        id: item._id,
        title: item.title,
        summary: item.summary || item.content?.slice(0, 140) || '',
        author: item.author ? `${item.author.firstName || ''} ${item.author.lastName || ''}`.trim() || 'Unknown' : 'Unknown',
        date: item.publishDate ? new Date(item.publishDate).toLocaleDateString() : '',
        likes: Array.isArray(item.likes) ? item.likes.length : 0,
        comments: Array.isArray(item.comments) ? item.comments.length : 0
      }));
      setRecentNews(newsItems);

      const now = new Date();
      const events = eventsData
        .filter((event) => {
          if (!event?.startDate) return true;
          const eventDate = new Date(event.startDate);
          return !Number.isNaN(eventDate) && eventDate >= now;
        })
        .slice(0, 3)
        .map((event) => ({
          id: event._id,
          title: event.title,
          date: event.startDate ? new Date(event.startDate).toLocaleDateString() : '',
          time: event.startTime || '',
          location: event.venue?.name || '',
          attendees: Array.isArray(event.attendees) ? event.attendees.length : 0
        }));
      setUpcomingEvents(events);
    };

    if (user) {
      fetchDashboardData();
    }

    return () => {
      isMounted = false;
    };
  }, [user]);

  return (
    <div className="heritage-bg min-h-screen relative overflow-hidden">
      <div className="heritage-gradient-overlay"></div>
      <div className="heritage-decoration"></div>
      <div className="heritage-decoration"></div>
      <div className="heritage-decoration"></div>
      <div className="heritage-decoration"></div>
      <div className="heritage-content relative space-y-6 xs:space-y-8">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-orange-50 via-white to-blue-50" />
      <div className="absolute -top-24 -right-20 w-72 h-72 bg-orange-200/60 blur-3xl rounded-full -z-10" />
      <div className="absolute top-1/3 -left-24 w-80 h-80 bg-blue-200/40 blur-3xl rounded-full -z-10" />

      {/* Welcome / Hero */}
      <div className="relative overflow-hidden rounded-3xl">
        <div
          className="absolute inset-0 bg-center bg-cover opacity-15"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="relative rounded-3xl p-4 xs:p-6 sm:p-8 text-white bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-white/20 text-white text-xs font-semibold mb-3 shadow-sm shadow-black/10 backdrop-blur-md">
                <Sparkles size={14} className="mr-2" /> Welcome back
              </div>
              <h1 className="text-2xl xs:text-3xl sm:text-4xl font-black tracking-tight drop-shadow-sm">
                Hi, {user?.firstName}! Your Family Hub
              </h1>
              <p className="text-orange-50/95 text-sm xs:text-base sm:text-lg mt-2 max-w-xl leading-relaxed">
                We’ve curated the latest celebrations, milestones, and memories so you can stay close to every moment.
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-3 text-xs sm:text-sm">
                <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-white/15 border border-white/30 backdrop-blur-md">
                  <Shield size={14} className="mr-2" /> Secure Space
                </div>
                <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-white/15 border border-white/30 backdrop-blur-md">
                  <Star size={14} className="mr-2" /> Family First
                </div>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-4">
              <div className="w-20 h-20 rounded-full overflow-hidden border-3 border-white/80 shadow-xl shadow-orange-500/30">
                <img src={ionBal} alt="Bal Krishna" className="w-full h-full object-cover rounded-full" />
              </div>
              <div className="bg-white/20 rounded-2xl p-4 shadow-lg shadow-orange-900/20 backdrop-blur-lg">
                <User size={48} className="text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 xs:gap-6">
        {quickStats.map((stat) => (
          <Card key={stat.title} className="hover:-translate-y-1">
            <div className="p-4 xs:p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs xs:text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">{stat.title}</p>
                  <p className="text-3xl xs:text-4xl font-black text-gray-900 tracking-tight flex items-baseline gap-2">
                    {stat.value}
                    <span className="text-xs font-medium text-gray-400">today</span>
                  </p>
                  {stat.chip ? (
                    <span className="inline-flex mt-3 text-xs px-3 py-1.5 rounded-full bg-orange-50 text-orange-600 border border-orange-200/60 shadow-sm shadow-orange-100">
                      {stat.chip}
                    </span>
                  ) : null}
                </div>
                <div className={`${stat.tint} rounded-2xl p-3 xs:p-3.5 shadow-inner shadow-white/40`}
                  style={{
                    boxShadow: '0 12px 30px -10px rgba(249,115,22,0.25)'
                  }}
                >
                  <stat.icon size={24} className="xs:w-[26px] xs:h-[26px]" />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Family Tree View removed as requested */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 xs:gap-8">
        {/* Recent News */}
        <Card className="hover:-translate-y-1 hover:shadow-2xl hover:shadow-orange-200/40">
          <div className="p-4 xs:p-6 border-b border-white/60 bg-white/50 backdrop-blur-md rounded-t-3xl">
            <div className="flex items-center justify-between">
              <h2 className="text-lg xs:text-xl font-semibold text-gray-900 flex items-center gap-2">
                <span className="inline-flex items-center justify-center h-9 w-9 rounded-2xl bg-orange-100 text-orange-600 shadow-sm"><Newspaper size={18} /></span>
                <span>Recent News</span>
              </h2>
              <Link to="/news" className="text-orange-600 hover:text-orange-700 text-xs xs:text-sm font-semibold inline-flex items-center gap-1">
                View All
                <ExternalLink size={14} />
              </Link>
            </div>
          </div>
          <div className="p-4 xs:p-6">
            <div className="space-y-4">
              {recentNews.map((news) => (
                <div key={news.id} className="rounded-2xl border border-white/60 bg-white/80 p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between text-xs text-orange-500 font-semibold uppercase tracking-wide mb-2">
                    <span>{news.date}</span>
                    <span className="flex items-center gap-1"><Heart size={12} /> {news.likes} • <MessageCircle size={12} /> {news.comments}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate('/news', { state: { newsId: news.id } })}
                    className="font-semibold text-left text-gray-900 text-lg mb-1.5 leading-tight hover:text-orange-600"
                  >
                    {news.title}
                  </button>
                  <p className="text-gray-600 text-sm mb-3 leading-relaxed">{news.summary}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center gap-2 font-medium text-gray-700">
                        <User size={12} className="text-orange-500" />
                        {news.author}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => navigate('/news', { state: { newsId: news.id } })}
                      className="text-orange-600 hover:text-orange-700 font-semibold text-xs inline-flex items-center gap-1"
                    >
                      Read Story
                      <ExternalLink size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Upcoming Events */}
        <Card className="hover:-translate-y-1 hover:shadow-2xl hover:shadow-orange-200/40">
          <div className="p-6 border-b border-white/60 bg-white/50 backdrop-blur-md rounded-t-3xl">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <span className="inline-flex items-center justify-center h-10 w-10 rounded-2xl bg-orange-100 text-orange-600 shadow-sm"><Calendar size={20} /></span>
                Upcoming Events
              </h2>
              <Link to="/events" className="text-orange-600 hover:text-orange-700 text-sm font-semibold inline-flex items-center gap-1">
                View All
                <ExternalLink size={14} />
              </Link>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="relative overflow-hidden rounded-2xl border border-white/60 bg-white/80 p-5 shadow-sm hover:shadow-lg transition-shadow">
                  <div className="absolute -top-10 -right-10 w-24 h-24 bg-orange-200/30 blur-3xl rounded-full" />
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => navigate('/events', { state: { eventId: event.id } })}
                      className="font-semibold text-left text-gray-900 text-lg mb-2 flex items-center gap-2 hover:text-orange-600"
                    >
                      <span className="inline-flex h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
                      {event.title}
                    </button>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p className="flex items-center gap-2"><Calendar size={14} className="text-orange-500" />{event.date} at {event.time}</p>
                      <p className="flex items-center gap-2"><Users size={14} className="text-orange-500" />{event.attendees} attending</p>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => navigate('/events', { state: { eventId: event.id } })}
                        className="text-orange-600 hover:text-orange-700 text-sm font-semibold inline-flex items-center gap-2"
                      >
                        View Details
                        <ExternalLink size={12} />
                      </button>
                      <span className="text-xs uppercase tracking-wider text-orange-400 font-semibold bg-orange-50 px-3 py-1 rounded-full">
                        Featured
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Links */}
      <Card className="hover:-translate-y-1 hover:shadow-2xl hover:shadow-orange-200/40">
        <div className="p-6 bg-white/60 backdrop-blur-md rounded-3xl">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-3">
            <span className="inline-flex items-center justify-center h-10 w-10 rounded-2xl bg-orange-100 text-orange-600 shadow-sm"><LinkIcon size={20} /></span>
            Quick Links & Useful Features
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link to="/family" className="group flex items-center gap-3 p-4 rounded-2xl border border-white/60 bg-white/80 hover:bg-white transition-all shadow-sm hover:shadow-lg">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 group-hover:scale-110 transition-transform">
                <Users size={22} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Member Directory</h3>
                <p className="text-sm text-gray-500">Browse all family members</p>
              </div>
            </Link>
            <Link to="/events" className="group flex items-center gap-3 p-4 rounded-2xl border border-white/60 bg-white/80 hover:bg-white transition-all shadow-sm hover:shadow-lg">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-600 group-hover:scale-110 transition-transform">
                <Calendar size={22} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Event Calendar</h3>
                <p className="text-sm text-gray-500">View upcoming gatherings</p>
              </div>
            </Link>
            <Link to="/relationships" className="group flex items-center gap-3 p-4 rounded-2xl border border-white/60 bg-white/80 hover:bg-white transition-all shadow-sm hover:shadow-lg">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-100 text-pink-600 group-hover:scale-110 transition-transform">
                <Heart size={22} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Relationships</h3>
                <p className="text-sm text-gray-500">Explore family connections</p>
              </div>
            </Link>
          </div>
        </div>
      </Card>
      </div>
    </div>
  );
};

export default Dashboard;