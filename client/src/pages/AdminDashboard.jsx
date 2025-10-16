import React, { useState, useEffect } from 'react';
import { Shield, Users, UserPlus, Database, FileText, Calendar, Network, Eye, Edit, Trash2, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Modal from '../components/common/Modal';
import api from '../utils/api';

const AdminDashboard = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [news, setNews] = useState([]);
  const [events, setEvents] = useState([]);
  const [relationships, setRelationships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes] = await Promise.all([
        api.get('/api/admin/dashboard')
      ]);
      setStats(statsRes.data.stats);
    } catch (error) {
      addToast('Failed to load dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const res = await api.get('/api/admin/users');
      setUsers(res.data);
    } catch (error) {
      addToast('Failed to load users', 'error');
    }
  };

  const loadFamilyMembers = async () => {
    try {
      const res = await api.get('/api/admin/family-members');
      setFamilyMembers(res.data);
    } catch (error) {
      addToast('Failed to load family members', 'error');
    }
  };

  const loadNews = async () => {
    try {
      const res = await api.get('/api/admin/news');
      setNews(res.data);
    } catch (error) {
      addToast('Failed to load news', 'error');
    }
  };

  const loadEvents = async () => {
    try {
      const res = await api.get('/api/admin/events');
      setEvents(res.data);
    } catch (error) {
      addToast('Failed to load events', 'error');
    }
  };

  const loadRelationships = async () => {
    try {
      const res = await api.get('/api/admin/relationships');
      setRelationships(res.data);
    } catch (error) {
      addToast('Failed to load relationships', 'error');
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    switch (tab) {
      case 'users': loadUsers(); break;
      case 'family': loadFamilyMembers(); break;
      case 'news': loadNews(); break;
      case 'events': loadEvents(); break;
      case 'relationships': loadRelationships(); break;
      default: break;
    }
  };

  const openModal = (type, item = null) => {
    setModalType(type);
    setEditingItem(item);
    setFormData(item || {});
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalType('');
    setEditingItem(null);
    setFormData({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        // Update
        await api.put(`/api/admin/${modalType}/${editingItem._id}`, formData);
        addToast(`${modalType.slice(0, -1)} updated successfully`, 'success');
      } else {
        // Create
        await api.post(`/api/admin/${modalType}`, formData);
        addToast(`${modalType.slice(0, -1)} created successfully`, 'success');
      }

      // Reload data
      switch (modalType) {
        case 'users': loadUsers(); break;
        case 'family-members': loadFamilyMembers(); break;
        case 'news': loadNews(); break;
        case 'events': loadEvents(); break;
        case 'relationships': loadRelationships(); break;
      }

      closeModal();
    } catch (error) {
      addToast(error.response?.data?.message || 'Operation failed', 'error');
    }
  };

  const handleDelete = async (type, id, confirmText) => {
    if (!window.confirm(`Are you sure you want to delete this ${type.slice(0, -1)}? ${confirmText}`)) return;

    try {
      await api.delete(`/api/admin/${type}/${id}`);
      addToast(`${type.slice(0, -1)} deleted successfully`, 'success');

      // Reload data
      switch (type) {
        case 'users': loadUsers(); break;
        case 'family-members': loadFamilyMembers(); break;
        case 'news': loadNews(); break;
        case 'events': loadEvents(); break;
        case 'relationships': loadRelationships(); break;
      }
    } catch (error) {
      addToast('Delete operation failed', 'error');
    }
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Shield },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'family', label: 'Family Members', icon: Network },
    { id: 'news', label: 'News', icon: FileText },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'relationships', label: 'Relationships', icon: Network }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/95 to-indigo-500/90" />
        <div className="relative p-6 sm:p-8 text-white rounded-2xl">
          <div className="inline-flex items-center px-2.5 py-1 rounded-full bg-white/15 text-white text-xs font-medium mb-2">
            <Shield size={14} className="mr-1" /> Admin Center
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Admin Dashboard</h1>
          <p className="text-indigo-50/90 text-sm sm:text-base mt-1">
            Welcome back, {user?.firstName}! Manage all system data and users.
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-1">
        <div className="flex flex-wrap gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon size={16} className="mr-2" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      {activeTab === 'dashboard' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
            <div className="flex items-center mb-3">
              <Users size={24} className="text-indigo-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">Users</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.users || 0}</p>
            <p className="text-sm text-gray-600 mt-1">Total registered users</p>
          </div>
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
            <div className="flex items-center mb-3">
              <Network size={24} className="text-green-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">Family Members</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.familyMembers || 0}</p>
            <p className="text-sm text-gray-600 mt-1">In family tree</p>
          </div>
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
            <div className="flex items-center mb-3">
              <FileText size={24} className="text-blue-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">News</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.news || 0}</p>
            <p className="text-sm text-gray-600 mt-1">Published articles</p>
          </div>
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
            <div className="flex items-center mb-3">
              <Calendar size={24} className="text-purple-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">Events</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.events || 0}</p>
            <p className="text-sm text-gray-600 mt-1">Scheduled events</p>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">User Management</h2>
            <button
              onClick={() => openModal('users')}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center"
            >
              <UserPlus size={16} className="mr-2" />
              Add User
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold">Name</th>
                  <th className="text-left py-3 px-4 font-semibold">Email</th>
                  <th className="text-left py-3 px-4 font-semibold">Role</th>
                  <th className="text-left py-3 px-4 font-semibold">Status</th>
                  <th className="text-left py-3 px-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="border-b border-gray-100">
                    <td className="py-3 px-4">{user.firstName} {user.lastName}</td>
                    <td className="py-3 px-4">{user.email}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        user.role === 'admin' ? 'bg-red-100 text-red-800' :
                        user.role === 'dataentry' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openModal('users', user)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete('users', user._id, `${user.firstName} ${user.lastName}`)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'family' && (
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Family Member Management</h2>
            <button
              onClick={() => openModal('family-members')}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
            >
              <Plus size={16} className="mr-2" />
              Add Member
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold">Ser No</th>
                  <th className="text-left py-3 px-4 font-semibold">Name</th>
                  <th className="text-left py-3 px-4 font-semibold">Gender</th>
                  <th className="text-left py-3 px-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {familyMembers.map((member) => (
                  <tr key={member._id} className="border-b border-gray-100">
                    <td className="py-3 px-4">{member.serNo}</td>
                    <td className="py-3 px-4">{member.firstName} {member.lastName}</td>
                    <td className="py-3 px-4">{member.gender}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openModal('family-members', member)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete('family-members', member._id, `${member.firstName} ${member.lastName}`)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'news' && (
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">News Management</h2>
            <button
              onClick={() => openModal('news')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
            >
              <Plus size={16} className="mr-2" />
              Add News
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold">Title</th>
                  <th className="text-left py-3 px-4 font-semibold">Date</th>
                  <th className="text-left py-3 px-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {news.map((item) => (
                  <tr key={item._id} className="border-b border-gray-100">
                    <td className="py-3 px-4">{item.title}</td>
                    <td className="py-3 px-4">{new Date(item.date).toLocaleDateString()}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openModal('news', item)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete('news', item._id, item.title)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'events' && (
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Events Management</h2>
            <button
              onClick={() => openModal('events')}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center"
            >
              <Plus size={16} className="mr-2" />
              Add Event
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold">Title</th>
                  <th className="text-left py-3 px-4 font-semibold">Date</th>
                  <th className="text-left py-3 px-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((item) => (
                  <tr key={item._id} className="border-b border-gray-100">
                    <td className="py-3 px-4">{item.title}</td>
                    <td className="py-3 px-4">{new Date(item.date).toLocaleDateString()}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openModal('events', item)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete('events', item._id, item.title)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'relationships' && (
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Relationships Management</h2>
            <button
              onClick={() => openModal('relationships')}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
            >
              <Plus size={16} className="mr-2" />
              Add Relationship
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold">Person 1</th>
                  <th className="text-left py-3 px-4 font-semibold">Person 2</th>
                  <th className="text-left py-3 px-4 font-semibold">Type</th>
                  <th className="text-left py-3 px-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {relationships.map((item) => (
                  <tr key={item._id} className="border-b border-gray-100">
                    <td className="py-3 px-4">{item.person1}</td>
                    <td className="py-3 px-4">{item.person2}</td>
                    <td className="py-3 px-4">{item.type}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openModal('relationships', item)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete('relationships', item._id, `${item.person1} - ${item.person2}`)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal for CRUD operations */}
      <Modal isOpen={modalOpen} onClose={closeModal} title={`${editingItem ? 'Edit' : 'Add'} ${modalType.slice(0, -1)}`}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Dynamic form fields based on modalType */}
          {modalType === 'users' && (
            <>
              <input
                type="text"
                placeholder="First Name"
                value={formData.firstName || ''}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
              />
              <input
                type="text"
                placeholder="Last Name"
                value={formData.lastName || ''}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email || ''}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
              />
              {!editingItem && (
                <input
                  type="password"
                  placeholder="Password"
                  value={formData.password || ''}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  required
                />
              )}
              <select
                value={formData.role || 'user'}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg"
              >
                <option value="user">User</option>
                <option value="dataentry">Data Entry</option>
                <option value="admin">Admin</option>
              </select>
            </>
          )}

          {modalType === 'family-members' && (
            <>
              <input
                type="number"
                placeholder="Serial Number"
                value={formData.serNo || ''}
                onChange={(e) => setFormData({...formData, serNo: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
              />
              <input
                type="text"
                placeholder="First Name"
                value={formData.firstName || ''}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
              />
              <input
                type="text"
                placeholder="Last Name"
                value={formData.lastName || ''}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
              />
              <select
                value={formData.gender || ''}
                onChange={(e) => setFormData({...formData, gender: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {/* Add more fields as needed for family members */}
            </>
          )}

          {modalType === 'news' && (
            <>
              <input
                type="text"
                placeholder="Title"
                value={formData.title || ''}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
              />
              <textarea
                placeholder="Content"
                value={formData.content || ''}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg"
                rows={4}
                required
              />
              <input
                type="date"
                placeholder="Date"
                value={formData.date || ''}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
              />
              {/* Add more fields as needed */}
            </>
          )}

          {modalType === 'events' && (
            <>
              <input
                type="text"
                placeholder="Title"
                value={formData.title || ''}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
              />
              <input
                type="date"
                placeholder="Date"
                value={formData.date || ''}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
              />
              <input
                type="text"
                placeholder="Location"
                value={formData.location || ''}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
              <textarea
                placeholder="Description"
                value={formData.description || ''}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg"
                rows={4}
              />
              {/* Add more fields as needed */}
            </>
          )}

          {modalType === 'relationships' && (
            <>
              <input
                type="text"
                placeholder="Person 1 ID"
                value={formData.person1 || ''}
                onChange={(e) => setFormData({...formData, person1: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
              />
              <input
                type="text"
                placeholder="Person 2 ID"
                value={formData.person2 || ''}
                onChange={(e) => setFormData({...formData, person2: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
              />
              <select
                value={formData.type || ''}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
              >
                <option value="">Select Type</option>
                <option value="parent">Parent</option>
                <option value="child">Child</option>
                <option value="spouse">Spouse</option>
                <option value="sibling">Sibling</option>
              </select>
              {/* Add more fields as needed */}
            </>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            >
              {editingItem ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminDashboard;
