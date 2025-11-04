import React, { useState, useEffect, useMemo } from 'react';
import { Shield, Users, UserPlus, Database, FileText, Calendar, Network, Edit, Trash2, Plus, Eye, Key } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Modal from '../components/common/Modal';
import SearchFilterBar from '../components/admin/SearchFilterBar';
import api from '../utils/api';
import HierarchyFormSection from '../components/admin/HierarchyFormSection';
import { createHierarchyFormDefaults, prepareHierarchyFormPayload } from '../utils/hierarchyFormUtils';
import '../styles/heritage-background.css';

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
  const [hierarchyFormEntries, setHierarchyFormEntries] = useState([]);
  const [loginDetails, setLoginDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});
  
  const [searchTerms, setSearchTerms] = useState({
    users: '',
    family: '',
    news: '',
    events: '',
    relationships: '',
    Heirarchy_form: '',
    loginDetails: ''
  });
  
  const [filters, setFilters] = useState({
    users: { role: '', isActive: '' },
    family: { gender: '', isAlive: '' },
    news: { category: '', isPublished: '', priority: '' },
    events: { status: '', eventType: '', isPublic: '' },
    relationships: {},
    Heirarchy_form: { isapproved: '' },
    loginDetails: { isActive: '' }
  });

  const normalizeDateInput = (value) => {
    if (!value) return '';
    if (typeof value === 'string') {
      return value.length > 10 ? value.slice(0, 10) : value;
    }
    try {
      return new Date(value).toISOString().slice(0, 10);
    } catch (error) {
      return '';
    }
  };

  const toNumberOrNull = (value) => {
    if (value === '' || value === null || value === undefined) return null;
    const parsed = Number(value);
    return Number.isNaN(parsed) ? null : parsed;
  };

  const splitList = (value) => {
    if (!value) return [];
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  };

  const parseNumberList = (value) =>
    splitList(value)
      .map((item) => Number(item))
      .filter((num) => !Number.isNaN(num));

  const getDefaultFormData = (type, item = null) => {
    switch (type) {
      case 'users':
        return {
          firstName: item?.firstName || '',
          lastName: item?.lastName || '',
          email: item?.email || '',
          password: '',
          phone: item?.phone || '',
          dateOfBirth: normalizeDateInput(item?.dateOfBirth),
          gender: item?.gender || 'Male',
          profilePicture: item?.profilePicture || '',
          occupation: item?.occupation || '',
          maritalStatus: item?.maritalStatus || 'Single',
          role: item?.role || 'user',
          isActive: item?.isActive ?? true,
          address: {
            street: item?.address?.street || '',
            city: item?.address?.city || '',
            state: item?.address?.state || '',
            pincode: item?.address?.pincode || '',
            country: item?.address?.country || 'India'
          },
          familyId: item?.familyId || ''
        };
      case 'family-members':
        const hierarchyDefaults = createHierarchyFormDefaults(item);
        return {
          ...hierarchyDefaults,
          serNo: item?.serNo ?? '',
          fatherSerNo: item?.fatherSerNo ?? '',
          motherSerNo: item?.motherSerNo ?? '',
          spouseSerNo: item?.spouseSerNo ?? '',
          childrenSerNos: Array.isArray(item?.childrenSerNos) ? item.childrenSerNos.join(', ') : '',
          level: item?.level ?? '',
          vansh: item?.vansh || ''
        };
      case 'news':
        return {
          title: item?.title || '',
          content: item?.content || '',
          summary: item?.summary || '',
          category: item?.category || 'General',
          isPublished: item?.isPublished ?? false,
          publishDate: normalizeDateInput(item?.publishDate),
          priority: item?.priority || 'Medium',
          tags: Array.isArray(item?.tags) ? item.tags.join(', ') : '',
          author: (item?.author && (item.author._id || item.author)) || user?._id || ''
        };
      case 'events':
        return {
          title: item?.title || '',
          description: item?.description || '',
          eventType: item?.eventType || 'Other',
          startDate: normalizeDateInput(item?.startDate),
          endDate: normalizeDateInput(item?.endDate),
          startTime: item?.startTime || '',
          endTime: item?.endTime || '',
          venue: {
            name: item?.venue?.name || '',
            address: {
              street: item?.venue?.address?.street || '',
              city: item?.venue?.address?.city || '',
              state: item?.venue?.address?.state || '',
              pincode: item?.venue?.address?.pincode || '',
              country: item?.venue?.address?.country || 'India'
            },
            coordinates: {
              latitude: item?.venue?.coordinates?.latitude ?? '',
              longitude: item?.venue?.coordinates?.longitude ?? ''
            }
          },
          organizer: (item?.organizer && (item.organizer._id || item.organizer)) || user?._id || '',
          coOrganizers: Array.isArray(item?.coOrganizers) ? item.coOrganizers.join(', ') : '',
          isPublic: item?.isPublic ?? true,
          maxAttendees: item?.maxAttendees ?? '',
          status: item?.status || 'Upcoming',
          priority: item?.priority || 'Medium'
        };
      case 'relationships':
        return {
          fromSerNo: item?.fromSerNo?.toString() || '',
          toSerNo: item?.toSerNo?.toString() || '',
          relation: item?.relation || '',
          relationMarathi: item?.relationMarathi || '',
          level: item?.level?.toString() || ''
        };
      case 'Heirarchy_form':
        return createHierarchyFormDefaults(item);
      default:
        return item || {};
    }
  };

  const preparePayload = (type, data, isEdit = false) => {
    switch (type) {
      case 'users': {
        const payload = {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          dateOfBirth: data.dateOfBirth || null,
          gender: data.gender,
          profilePicture: data.profilePicture || '',
          occupation: data.occupation || '',
          maritalStatus: data.maritalStatus || 'Single',
          role: data.role,
          isActive: data.isActive,
          address: {
            street: data.address?.street || '',
            city: data.address?.city || '',
            state: data.address?.state || '',
            pincode: data.address?.pincode || '',
            country: data.address?.country || 'India'
          },
          familyId: data.familyId || undefined
        };

        if (isEdit) {
          if (data.password) {
            payload.password = data.password;
          }
        } else {
          payload.password = data.password;
        }

        if (!payload.familyId) delete payload.familyId;
        if (!payload.profilePicture) delete payload.profilePicture;
        if (!payload.dateOfBirth) delete payload.dateOfBirth;

        return payload;
      }
      case 'family-members': {
        // Use hierarchy form payload with family tree relationship fields
        const hierarchyPayload = prepareHierarchyFormPayload(data);
        return {
          ...hierarchyPayload,
          // Add family tree relationship fields
      ...(data.serNo && Number(data.serNo) > 0 ? { serNo: Number(data.serNo) } : {}),

          isapproved: data.isapproved ?? false,
          fatherSerNo: toNumberOrNull(data.fatherSerNo),
          motherSerNo: toNumberOrNull(data.motherSerNo),
          spouseSerNo: toNumberOrNull(data.spouseSerNo),
          childrenSerNos: parseNumberList(data.childrenSerNos),
          level: toNumberOrNull(data.level),
          vansh: data.vansh || ''
        };
      }
      case 'news':
        return {
          title: data.title,
          content: data.content,
          summary: data.summary || '',
          category: data.category || 'General',
          isPublished: data.isPublished,
          publishDate: data.publishDate || null,
          priority: data.priority || 'Medium',
          tags: splitList(data.tags),
          author: data.author || user?._id
        };
      case 'events':
        return {
          title: data.title,
          description: data.description,
          eventType: data.eventType,
          startDate: data.startDate,
          endDate: data.endDate,
          startTime: data.startTime,
          endTime: data.endTime,
          venue: {
            name: data.venue?.name,
            address: {
              street: data.venue?.address?.street || '',
              city: data.venue?.address?.city || '',
              state: data.venue?.address?.state || '',
              pincode: data.venue?.address?.pincode || '',
              country: data.venue?.address?.country || 'India'
            },
            coordinates: {
              latitude: toNumberOrNull(data.venue?.coordinates?.latitude),
              longitude: toNumberOrNull(data.venue?.coordinates?.longitude)
            }
          },
          organizer: data.organizer || user?._id,
          coOrganizers: splitList(data.coOrganizers),
          isPublic: data.isPublic,
          maxAttendees: toNumberOrNull(data.maxAttendees),
          status: data.status,
          priority: data.priority
        };
      case 'relationships':
        return {
          fromSerNo: toNumberOrNull(data.fromSerNo),
          toSerNo: toNumberOrNull(data.toSerNo),
          relation: data.relation,
          relationMarathi: data.relationMarathi || '',
          level: toNumberOrNull(data.level)
        };
      case 'Heirarchy_form':
        return prepareHierarchyFormPayload(data);
      default:
        return data;
    }
  };

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

  const loadHierarchyFormEntries = async () => {
    try {
      const res = await api.get(`/api/admin/${getApiPath('Heirarchy_form')}`);
      setHierarchyFormEntries(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      addToast('Failed to load hierarchy form entries', 'error');
    }
  };

  const loadLoginDetails = async () => {
    try {
      const res = await api.get('/api/admin/login-details');
      setLoginDetails(res.data);
    } catch (error) {
      addToast('Failed to load login details', 'error');
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
      case 'Heirarchy_form': loadHierarchyFormEntries(); break;
      case 'login-details': loadLoginDetails(); break;
      default: break;
    }
  };

  const openModal = (type, item = null) => {
    setModalType(type);
    setEditingItem(item);
    setFormData(getDefaultFormData(type, item));
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalType('');
    setEditingItem(null);
    setFormData({});
  };

  const handleSearchChange = (tab, value) => {
    setSearchTerms({ ...searchTerms, [tab]: value });
  };

  const handleFilterChange = (tab, filterKey, value) => {
    setFilters({
      ...filters,
      [tab]: { ...filters[tab], [filterKey]: value }
    });
  };

  const handleClearFilters = (tab) => {
    const defaultFilters = {
      users: { role: '', isActive: '' },
      family: { gender: '', isAlive: '' },
      news: { category: '', isPublished: '', priority: '' },
      events: { status: '', eventType: '', isPublic: '' },
      relationships: {},
      Heirarchy_form: { isapproved: '' }
    };
    setFilters({ ...filters, [tab]: defaultFilters[tab] });
  };

  const getEntityLabel = (type, plural = false) => {
    switch (type) {
      case 'users':
        return plural ? 'Users' : 'User';
      case 'family-members':
        return plural ? 'Family Members' : 'Family Member';
      case 'news':
        return plural ? 'News Articles' : 'News Article';
      case 'events':
        return plural ? 'Events' : 'Event';
      case 'relationships':
        return plural ? 'Relationships' : 'Relationship';
      case 'Heirarchy_form':
        return plural ? 'Hierarchy Form Entries' : 'Hierarchy Form Entry';
      default:
        return plural ? 'Items' : 'Item';
    }
  };

  const getApiPath = (type) => {
    switch (type) {
      case 'Heirarchy_form':
        return 'heirarchy-form';
      default:
        return type;
    }
  };

  const filterUsers = (items) => {
    let filtered = items;
    const search = searchTerms.users.toLowerCase();
    const f = filters.users;

    if (search) {
      filtered = filtered.filter(item =>
        `${item.firstName} ${item.lastName}`.toLowerCase().includes(search) ||
        item.email.toLowerCase().includes(search) ||
        item.phone?.includes(search)
      );
    }

    if (f.role) filtered = filtered.filter(item => item.role === f.role);
    if (f.isActive !== '') filtered = filtered.filter(item => item.isActive === (f.isActive === 'true'));

    return filtered;
  };

  const filterFamilyMembers = (items) => {
    let filtered = items;
    const search = searchTerms.family.toLowerCase();
    const f = filters.family;

    if (search) {
      filtered = filtered.filter(item => {
        const personal = item.personalDetails || {};
        const fullName = `${personal.firstName || ''} ${personal.lastName || ''}`.toLowerCase();
        return fullName.includes(search) ||
          item.serNo?.toString().includes(search) ||
          item.vansh?.toLowerCase().includes(search);
      });
    }

    if (f.gender) {
      filtered = filtered.filter(item => {
        const personal = item.personalDetails || {};
        return personal.gender === f.gender;
      });
    }
    if (f.isAlive !== '') {
      filtered = filtered.filter(item => {
        const personal = item.personalDetails || {};
        const isAlive = personal.isAlive === 'yes' || personal.isAlive === true;
        return isAlive === (f.isAlive === 'true');
      });
    }

    return filtered;
  };

  const filterNews = (items) => {
    let filtered = items;
    const search = searchTerms.news.toLowerCase();
    const f = filters.news;

    if (search) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(search) ||
        item.summary?.toLowerCase().includes(search) ||
        item.content?.toLowerCase().includes(search)
      );
    }

    if (f.category) filtered = filtered.filter(item => item.category === f.category);
    if (f.isPublished !== '') filtered = filtered.filter(item => item.isPublished === (f.isPublished === 'true'));
    if (f.priority) filtered = filtered.filter(item => item.priority === f.priority);

    return filtered;
  };

  const filterEvents = (items) => {
    let filtered = items;
    const search = searchTerms.events.toLowerCase();
    const f = filters.events;

    if (search) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(search) ||
        item.description?.toLowerCase().includes(search) ||
        item.venue?.name?.toLowerCase().includes(search)
      );
    }

    if (f.status) filtered = filtered.filter(item => item.status === f.status);
    if (f.eventType) filtered = filtered.filter(item => item.eventType === f.eventType);
    if (f.isPublic !== '') filtered = filtered.filter(item => item.isPublic === (f.isPublic === 'true'));

    return filtered;
  };

  const filterRelationships = (items) => {
    let filtered = items;
    const search = searchTerms.relationships.toLowerCase();

    if (search) {
      filtered = filtered.filter(item =>
        item.fromSerNo?.toString().includes(search) ||
        item.toSerNo?.toString().includes(search) ||
        item.relation?.toLowerCase().includes(search)
      );
    }

    return filtered;
  };

  const filterHierarchyForm = (items) => {
    let filtered = items;
    const search = searchTerms.Heirarchy_form.toLowerCase();
    const f = filters.Heirarchy_form;

    if (search) {
      filtered = filtered.filter(item => {
        const personal = item.personalDetails || {};
        const fullName = `${personal.firstName || ''} ${personal.middleName || ''} ${personal.lastName || ''}`.toLowerCase();
        return fullName.includes(search) ||
               personal.email?.toLowerCase().includes(search) ||
               personal.mobileNumber?.includes(search);
      });
    }

    if (f.isapproved !== '') filtered = filtered.filter(item => item.isapproved === (f.isapproved === 'true'));

    return filtered;
  };

  const filterLoginDetails = (items) => {
    let filtered = items;
    const search = searchTerms.loginDetails.toLowerCase();
    const f = filters.loginDetails;

    if (search) {
      filtered = filtered.filter(item =>
        item.email?.toLowerCase().includes(search) ||
        item.username?.toLowerCase().includes(search) ||
        `${item.firstName || ''} ${item.lastName || ''}`.toLowerCase().includes(search)
      );
    }

    if (f.isActive !== '') filtered = filtered.filter(item => item.isActive === (f.isActive === 'true'));

    return filtered;
  };

  const filteredUsers = useMemo(() => filterUsers(users), [users, searchTerms.users, filters.users]);
  const filteredFamilyMembers = useMemo(() => filterFamilyMembers(familyMembers), [familyMembers, searchTerms.family, filters.family]);
  const filteredNews = useMemo(() => filterNews(news), [news, searchTerms.news, filters.news]);
  const filteredEvents = useMemo(() => filterEvents(events), [events, searchTerms.events, filters.events]);
  const filteredRelationships = useMemo(() => filterRelationships(relationships), [relationships, searchTerms.relationships, filters.relationships]);
  const filteredLoginDetails = useMemo(() => filterLoginDetails(loginDetails), [loginDetails, searchTerms.loginDetails, filters.loginDetails]);
  const filteredHierarchyForm = useMemo(() => filterHierarchyForm(hierarchyFormEntries), [hierarchyFormEntries, searchTerms.Heirarchy_form, filters.Heirarchy_form]);

  const getMemberName = (serNo) => {
    if (!serNo) return 'N/A';
    const member = familyMembers.find(m => m.serNo === Number(serNo));
    if (!member) return `SerNo: ${serNo}`;
    const personal = member.personalDetails || {};
    return member.fullName || `${personal.firstName || ''} ${personal.lastName || ''}`.trim() || `SerNo: ${serNo}`;
  };

  const getOnlyChangedFields = (original, current, type) => {
    const changed = {};
    
    const compare = (orig, curr, prefix = '') => {
      Object.keys(curr).forEach(key => {
        const currentValue = curr[key];
        const originalValue = orig?.[key];
        const fullKey = prefix ? `${prefix}.${key}` : key;
        
        if (currentValue === null || currentValue === undefined || currentValue === '') {
          return;
        }
        
        if (typeof currentValue === 'object' && !Array.isArray(currentValue) && !(currentValue instanceof File)) {
          const nestedOrig = originalValue || {};
          compare(nestedOrig, currentValue, fullKey);
        } else if (Array.isArray(currentValue)) {
          const originalArray = Array.isArray(originalValue) ? originalValue : [];
          if (JSON.stringify(currentValue) !== JSON.stringify(originalArray)) {
            if (prefix) {
              if (!changed[prefix]) changed[prefix] = {};
              changed[prefix][key] = currentValue;
            } else {
              changed[key] = currentValue;
            }
          }
        } else if (currentValue instanceof File) {
          if (prefix) {
            if (!changed[prefix]) changed[prefix] = {};
            changed[prefix][key] = currentValue;
          } else {
            changed[key] = currentValue;
          }
        } else if (JSON.stringify(currentValue) !== JSON.stringify(originalValue)) {
          if (prefix) {
            if (!changed[prefix]) changed[prefix] = {};
            changed[prefix][key] = currentValue;
          } else {
            changed[key] = currentValue;
          }
        }
      });
    };
    
    compare(original, current);
    return changed;
  };

  const excludeUnchangedNestedFields = (payload, originalData) => {
    const cleaned = { ...payload };
    
    const cleanNestedObject = (obj, orig, path = '') => {
      if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return obj;
      
      const cleaned = {};
      Object.keys(obj).forEach(key => {
        const value = obj[key];
        const origValue = orig?.[key];
        
        if (value === null || value === undefined || value === '') {
          return;
        }
        
        if (typeof value === 'object' && !Array.isArray(value) && !(value instanceof File)) {
          const nested = cleanNestedObject(value, origValue);
          if (Object.keys(nested).length > 0) {
            cleaned[key] = nested;
          }
        } else {
          cleaned[key] = value;
        }
      });
      
      return cleaned;
    };
    
    if (cleaned.address) {
      cleaned.address = cleanNestedObject(cleaned.address, originalData.address);
    }
    if (cleaned.venue) {
      cleaned.venue = cleanNestedObject(cleaned.venue, originalData.venue);
    }
    if (cleaned.personalDetails) {
      cleaned.personalDetails = cleanNestedObject(cleaned.personalDetails, originalData.personalDetails);
    }
    
    return cleaned;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let payload = preparePayload(modalType, formData, Boolean(editingItem));
      const entityLabel = getEntityLabel(modalType);

      if (editingItem) {
        const originalData = getDefaultFormData(modalType, editingItem);
        const changedFields = getOnlyChangedFields(originalData, formData, modalType);
        if (Object.keys(changedFields).length > 0) {
          payload = preparePayload(modalType, { ...originalData, ...changedFields }, true);
          payload = excludeUnchangedNestedFields(payload, originalData);
        } else {
          addToast('No changes made', 'info');
          return;
        }
        await api.put(`/api/admin/${getApiPath(modalType)}/${editingItem._id}`, payload);
        addToast(`${entityLabel} updated successfully`, 'success');
      } else {
        await api.post(`/api/admin/${getApiPath(modalType)}`, payload);
        addToast(`${entityLabel} created successfully`, 'success');
      }

      switch (modalType) {
        case 'users':
          loadUsers();
          break;
        case 'family-members':
          loadFamilyMembers();
          break;
        case 'news':
          loadNews();
          break;
        case 'events':
          loadEvents();
          break;
        case 'relationships':
          loadRelationships();
          break;
        case 'Heirarchy_form':
          loadHierarchyFormEntries();
          break;
        default:
          break;
      }

      closeModal();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Operation failed';
      const errorDetails = error.response?.data?.errors;
      
      addToast(errorMessage, 'error');
      
      if (Array.isArray(errorDetails) && errorDetails.length > 0) {
        errorDetails.forEach(detail => {
          addToast(`• ${detail}`, 'error');
        });
      }
    }
  };

  const handleDelete = async (type, id, confirmText) => {
    if (!window.confirm(`Are you sure you want to delete this ${getEntityLabel(type).toLowerCase()}? ${confirmText}`)) return;

    try {
      await api.delete(`/api/admin/${getApiPath(type)}/${id}`);
      addToast(`${getEntityLabel(type)} deleted successfully`, 'success');

      // Reload data
      switch (type) {
        case 'users': loadUsers(); break;
        case 'family-members': loadFamilyMembers(); break;
        case 'news': loadNews(); break;
        case 'events': loadEvents(); break;
        case 'relationships': loadRelationships(); break;
        case 'Heirarchy_form': loadHierarchyFormEntries(); break;
      }
    } catch (error) {
      addToast('Delete operation failed', 'error');
    }
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Shield },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'family', label: 'Family Members', icon: Network },
    { id: 'Heirarchy_form', label: 'Hierarchy Form', icon: FileText },
    { id: 'news', label: 'News', icon: FileText },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'relationships', label: 'Relationships', icon: Network },
    { id: 'login-details', label: 'Login Details', icon: Key }
  ];

  const modalTitle = modalType ? `${editingItem ? 'Edit' : 'Add'} ${getEntityLabel(modalType)}` : 'Manage Item';

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="heritage-bg min-h-screen relative overflow-hidden">
      <div className="heritage-gradient-overlay"></div>
      <div className="heritage-decoration"></div>
      <div className="heritage-decoration"></div>
      <div className="heritage-decoration"></div>
      <div className="heritage-decoration"></div>
      <div className="heritage-content space-y-6">
        {/* Header */}
      <div className="relative overflow-hidden rounded-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600/95 to-orange-500/90" />
        <div className="relative p-6 sm:p-8 text-white rounded-2xl">
          <div className="inline-flex items-center px-2.5 py-1 rounded-full bg-white/15 text-white text-xs font-medium mb-2">
            <Shield size={14} className="mr-1" /> Admin Center
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Admin Dashboard</h1>
          <p className="text-orange-50/90 text-sm sm:text-base mt-1">
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
                    ? 'bg-orange-600 text-white shadow-md'
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
              <Users size={24} className="text-orange-600 mr-3" />
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
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
            <div className="flex items-center mb-3">
              <Key size={24} className="text-red-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">Login Accounts</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.loginDetails || 0}</p>
            <p className="text-sm text-gray-600 mt-1">Login credentials in system</p>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">User Management</h2>
            <button
              onClick={() => openModal('users')}
              className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 flex items-center"
            >
              <UserPlus size={16} className="mr-2" />
              Add User
            </button>
          </div>
          
          <SearchFilterBar
            searchTerm={searchTerms.users}
            onSearchChange={(val) => handleSearchChange('users', val)}
            filters={filters.users}
            onFilterChange={(key, val) => handleFilterChange('users', key, val)}
            onClearFilters={() => handleClearFilters('users')}
            filterOptions={{
              role: [
                { value: 'user', label: 'User' },
                { value: 'dataentry', label: 'Data Entry' },
                { value: 'admin', label: 'Admin' }
              ],
              isActive: [
                { value: 'true', label: 'Active' },
                { value: 'false', label: 'Inactive' }
              ]
            }}
          />

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
                {filteredUsers.map((user) => (
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

      {activeTab === 'Heirarchy_form' && (
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h2 className="text-xl font-bold text-gray-900">Hierarchy Form Entries</h2>
            <button
              onClick={() => openModal('Heirarchy_form')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center"
            >
              <Plus size={16} className="mr-2" />
              Add Entry
            </button>
          </div>

          <SearchFilterBar
            searchTerm={searchTerms.Heirarchy_form}
            onSearchChange={(val) => handleSearchChange('Heirarchy_form', val)}
            filters={filters.Heirarchy_form}
            onFilterChange={(key, val) => handleFilterChange('Heirarchy_form', key, val)}
            onClearFilters={() => handleClearFilters('Heirarchy_form')}
            filterOptions={{
              isapproved: [
                { value: 'true', label: 'Approved' },
                { value: 'false', label: 'Pending' }
              ]
            }}
          />

          {filteredHierarchyForm.length === 0 ? (
            <p className="text-gray-600">No hierarchy form entries found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mobile</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S.No</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredHierarchyForm.map((entry) => {
                    const personal = entry.personalDetails || {};
                    const fullName = [personal.firstName, personal.middleName, personal.lastName].filter(Boolean).join(' ');
                    return (
                      <tr key={entry._id}>
                        <td className="px-4 py-3 text-sm text-gray-900">{fullName || '—'}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">{personal.email || '—'}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">{personal.mobileNumber || '—'}</td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${entry.isapproved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {entry.isapproved ? '✓ Approved' : 'Pending'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">{entry.serNo ? `${entry.serNo}` : '—'}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">{entry.createdAt ? new Date(entry.createdAt).toLocaleString() : '—'}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => openModal('Heirarchy_form', entry)}
                              className="text-orange-600 hover:text-orange-800 flex items-center gap-1"
                            >
                              <Eye size={16} />
                              View / Edit
                            </button>
                            <button
                              onClick={() => handleDelete('Heirarchy_form', entry._id, fullName)}
                              className="text-red-600 hover:text-red-800 flex items-center gap-1"
                            >
                              <Trash2 size={16} />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
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
          
          <SearchFilterBar
            searchTerm={searchTerms.family}
            onSearchChange={(val) => handleSearchChange('family', val)}
            filters={filters.family}
            onFilterChange={(key, val) => handleFilterChange('family', key, val)}
            onClearFilters={() => handleClearFilters('family')}
            filterOptions={{
              gender: [
                { value: 'Male', label: 'Male' },
                { value: 'Female', label: 'Female' }
              ],
              isAlive: [
                { value: 'true', label: 'Alive' },
                { value: 'false', label: 'Deceased' }
              ]
            }}
          />

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-3 px-4 font-semibold text-sm">Ser No</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Email</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Mobile</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Gender</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">DOB</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFamilyMembers.map((member) => {
                  const personal = member.personalDetails || {};
                  const fullName = member.fullName || `${personal.firstName || ''} ${personal.lastName || ''}`.trim();
                  const isAlive = personal.isAlive === 'yes' || personal.isAlive === true;
                  const dob = personal.dateOfBirth ? new Date(personal.dateOfBirth).toLocaleDateString('en-IN') : '-';
                  
                  return (
                    <tr key={member._id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-orange-600">{member.serNo || '-'}</td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-gray-900">{fullName}</p>
                          {member.vansh && <p className="text-xs text-gray-500">Vansh: {member.vansh}</p>}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">{personal.email || '-'}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{personal.mobileNumber || '-'}</td>
                      <td className="py-3 px-4 text-sm capitalize">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          personal.gender === 'male' || personal.gender === 'Male' ? 'bg-blue-100 text-blue-800' : 
                          personal.gender === 'female' || personal.gender === 'Female' ? 'bg-pink-100 text-pink-800' : 
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {personal.gender || '-'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">{dob}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${isAlive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {isAlive ? '✓ Alive' : '✗ Deceased'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => openModal('family-members', member)}
                            className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-2 rounded transition"
                            title="Edit member"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete('family-members', member._id, fullName)}
                            className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded transition"
                            title="Delete member"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
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
          
          <SearchFilterBar
            searchTerm={searchTerms.news}
            onSearchChange={(val) => handleSearchChange('news', val)}
            filters={filters.news}
            onFilterChange={(key, val) => handleFilterChange('news', key, val)}
            onClearFilters={() => handleClearFilters('news')}
            filterOptions={{
              category: [
                { value: 'General', label: 'General' },
                { value: 'Announcement', label: 'Announcement' },
                { value: 'Event', label: 'Event' },
                { value: 'Birthday', label: 'Birthday' },
                { value: 'Achievement', label: 'Achievement' }
              ],
              isPublished: [
                { value: 'true', label: 'Published' },
                { value: 'false', label: 'Draft' }
              ],
              priority: [
                { value: 'High', label: 'High' },
                { value: 'Medium', label: 'Medium' },
                { value: 'Low', label: 'Low' }
              ]
            }}
          />

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold">Title</th>
                  <th className="text-left py-3 px-4 font-semibold">Summary</th>
                  <th className="text-left py-3 px-4 font-semibold">Category</th>
                  <th className="text-left py-3 px-4 font-semibold">Publish Date</th>
                  <th className="text-left py-3 px-4 font-semibold">Priority</th>
                  <th className="text-left py-3 px-4 font-semibold">Published</th>
                  <th className="text-left py-3 px-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredNews.map((item) => (
                  <tr key={item._id} className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium">{item.title}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{item.summary || '-'}</td>
                    <td className="py-3 px-4">{item.category || 'General'}</td>
                    <td className="py-3 px-4">{item.publishDate ? new Date(item.publishDate).toLocaleDateString() : '-'}</td>
                    <td className="py-3 px-4">{item.priority || 'Medium'}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${item.isPublished ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'}`}>
                        {item.isPublished ? 'Yes' : 'No'}
                      </span>
                    </td>
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
          
          <SearchFilterBar
            searchTerm={searchTerms.events}
            onSearchChange={(val) => handleSearchChange('events', val)}
            filters={filters.events}
            onFilterChange={(key, val) => handleFilterChange('events', key, val)}
            onClearFilters={() => handleClearFilters('events')}
            filterOptions={{
              status: [
                { value: 'Upcoming', label: 'Upcoming' },
                { value: 'Ongoing', label: 'Ongoing' },
                { value: 'Completed', label: 'Completed' },
                { value: 'Cancelled', label: 'Cancelled' }
              ],
              eventType: [
                { value: 'Wedding', label: 'Wedding' },
                { value: 'Birthday', label: 'Birthday' },
                { value: 'Festival', label: 'Festival' },
                { value: 'Gathering', label: 'Gathering' },
                { value: 'Other', label: 'Other' }
              ],
              isPublic: [
                { value: 'true', label: 'Public' },
                { value: 'false', label: 'Private' }
              ]
            }}
          />

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
                {filteredEvents.map((item) => (
                  <tr key={item._id} className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium">{item.title}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{item.eventType}</td>
                    <td className="py-3 px-4">{item.startDate ? new Date(item.startDate).toLocaleDateString() : '-'}</td>
                    <td className="py-3 px-4">{item.endDate ? new Date(item.endDate).toLocaleDateString() : '-'}</td>
                    <td className="py-3 px-4">{item.venue?.name || '-'}</td>
                    <td className="py-3 px-4">{item.status}</td>
                    <td className="py-3 px-4">{item.priority}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${item.isPublic ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'}`}>
                        {item.isPublic ? 'Public' : 'Private'}
                      </span>
                    </td>
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
          
          <SearchFilterBar
            searchTerm={searchTerms.relationships}
            onSearchChange={(val) => handleSearchChange('relationships', val)}
            filters={filters.relationships}
            onFilterChange={(key, val) => handleFilterChange('relationships', key, val)}
            onClearFilters={() => handleClearFilters('relationships')}
            filterOptions={{}}
          />

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-3 px-4 font-semibold">From Person</th>
                  <th className="text-left py-3 px-4 font-semibold">To Person</th>
                  <th className="text-left py-3 px-4 font-semibold">Relation</th>
                  <th className="text-left py-3 px-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRelationships.map((item) => {
                  const fromName = getMemberName(item.fromSerNo);
                  const toName = getMemberName(item.toSerNo);
                  return (
                    <tr key={item._id} className="border-b border-gray-100">
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-gray-900">{fromName}</p>
                          <p className="text-xs text-gray-500">SerNo: {item.fromSerNo}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-gray-900">{toName}</p>
                          <p className="text-xs text-gray-500">SerNo: {item.toSerNo}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">{item.relation}</td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => openModal('relationships', item)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete('relationships', item._id, `${fromName} - ${toName}`)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'login-details' && (
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Login Details Management</h2>
          </div>
          
          <SearchFilterBar
            searchTerm={searchTerms.loginDetails}
            onSearchChange={(val) => handleSearchChange('loginDetails', val)}
            filters={filters.loginDetails}
            onFilterChange={(key, val) => handleFilterChange('loginDetails', key, val)}
            onClearFilters={() => handleClearFilters('loginDetails')}
            filterOptions={{
              isActive: [
                { value: 'true', label: 'Active' },
                { value: 'false', label: 'Inactive' }
              ]
            }}
          />

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold">Email</th>
                  <th className="text-left py-3 px-4 font-semibold">Username</th>
                  <th className="text-left py-3 px-4 font-semibold">First Name</th>
                  <th className="text-left py-3 px-4 font-semibold">Last Name</th>
                  <th className="text-left py-3 px-4 font-semibold">Serial No</th>
                  <th className="text-left py-3 px-4 font-semibold">Status</th>
                  <th className="text-left py-3 px-4 font-semibold">Created At</th>
                </tr>
              </thead>
              <tbody>
                {filteredLoginDetails.map((login) => (
                  <tr key={login._id} className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium text-gray-900">{login.email}</td>
                    <td className="py-3 px-4 text-gray-700">{login.username || '-'}</td>
                    <td className="py-3 px-4 text-gray-700">{login.firstName || '-'}</td>
                    <td className="py-3 px-4 text-gray-700">{login.lastName || '-'}</td>
                    <td className="py-3 px-4 text-gray-700">{login.serNo || login.serno || '-'}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        login.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {login.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {login.createdAt ? new Date(login.createdAt).toLocaleDateString() : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal for CRUD operations */}
      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={modalTitle}
        size={modalType === 'Heirarchy_form' || modalType === 'family-members' ? 'full' : 'md'}
      >
        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          {/* Dynamic form fields based on modalType */}
          {modalType === 'users' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">First Name</label>
                  <input
                    type="text"
                    value={formData.firstName || ''}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Last Name</label>
                  <input
                    type="text"
                    value={formData.lastName || ''}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Phone</label>
                  <input
                    type="text"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Date of Birth</label>
                  <input
                    type="date"
                    value={formData.dateOfBirth || ''}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Gender</label>
                  <select
                    value={formData.gender || 'Male'}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Marital Status</label>
                  <select
                    value={formData.maritalStatus || 'Single'}
                    onChange={(e) => setFormData({ ...formData, maritalStatus: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  >
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Divorced">Divorced</option>
                    <option value="Widowed">Widowed</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Role</label>
                  <select
                    value={formData.role || 'user'}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  >
                    <option value="user">User</option>
                    <option value="dataentry">Data Entry</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Occupation</label>
                  <input
                    type="text"
                    value={formData.occupation || ''}
                    onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Profile Picture URL</label>
                  <input
                    type="text"
                    value={formData.profilePicture || ''}
                    onChange={(e) => setFormData({ ...formData, profilePicture: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Family ID</label>
                  <input
                    type="text"
                    value={formData.familyId || ''}
                    onChange={(e) => setFormData({ ...formData, familyId: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Password</label>
                  <input
                    type="password"
                    value={formData.password || ''}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    placeholder={editingItem ? 'New Password (optional)' : 'Password'}
                    required={!editingItem}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-semibold text-gray-800">Address</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Street</label>
                    <input
                      type="text"
                      value={formData.address?.street || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        address: {
                          ...(formData.address || {}),
                          street: e.target.value
                        }
                      })}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">City</label>
                    <input
                      type="text"
                      value={formData.address?.city || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        address: {
                          ...(formData.address || {}),
                          city: e.target.value
                        }
                      })}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">State</label>
                    <input
                      type="text"
                      value={formData.address?.state || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        address: {
                          ...(formData.address || {}),
                          state: e.target.value
                        }
                      })}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Pincode</label>
                    <input
                      type="text"
                      value={formData.address?.pincode || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        address: {
                          ...(formData.address || {}),
                          pincode: e.target.value
                        }
                      })}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Country</label>
                    <input
                      type="text"
                      value={formData.address?.country || 'India'}
                      onChange={(e) => setFormData({
                        ...formData,
                        address: {
                          ...(formData.address || {}),
                          country: e.target.value
                        }
                      })}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
              </div>

              <label className="flex items-center gap-3 text-sm font-medium text-gray-700">
                <input
                  type="checkbox"
                  checked={Boolean(formData.isActive)}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 text-orange-600 border-gray-300 rounded"
                />
                Active
              </label>
            </div>
          )}

          {modalType === 'family-members' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                <div>
                  <label className="text-sm font-medium text-gray-700">Serial Number (serNo - Read Only)</label>
                  <input
                    type="number"
                    value={formData.serNo || ''}
                    disabled
                    className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Level</label>
                  <input
                    type="number"
                    value={formData.level || ''}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Vansh</label>
                  <input
                    type="text"
                    value={formData.vansh || ''}
                    onChange={(e) => setFormData({ ...formData, vansh: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Father SerNo</label>
                  <input
                    type="number"
                    value={formData.fatherSerNo || ''}
                    onChange={(e) => setFormData({ ...formData, fatherSerNo: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                  {formData.fatherSerNo && (
                    <p className="text-xs text-gray-500 mt-1">Father: {getMemberName(formData.fatherSerNo)}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Mother SerNo</label>
                  <input
                    type="number"
                    value={formData.motherSerNo || ''}
                    onChange={(e) => setFormData({ ...formData, motherSerNo: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                  {formData.motherSerNo && (
                    <p className="text-xs text-gray-500 mt-1">Mother: {getMemberName(formData.motherSerNo)}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Spouse SerNo</label>
                  <input
                    type="number"
                    value={formData.spouseSerNo || ''}
                    onChange={(e) => setFormData({ ...formData, spouseSerNo: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                  {formData.spouseSerNo && (
                    <p className="text-xs text-gray-500 mt-1">Spouse: {getMemberName(formData.spouseSerNo)}</p>
                  )}
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium text-gray-700">Children SerNos (comma-separated)</label>
                  <input
                    type="text"
                    value={formData.childrenSerNos || ''}
                    onChange={(e) => setFormData({ ...formData, childrenSerNos: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                  {formData.childrenSerNos && (
                    <div className="text-xs text-gray-500 mt-1">
                      Children: {formData.childrenSerNos.split(',').map(s => s.trim()).filter(Boolean).map(serNo => (
                        <div key={serNo}>• {getMemberName(serNo)}</div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <HierarchyFormSection
                formData={formData}
                onChange={(updatedData) => setFormData(updatedData)}
              />
            </div>
          )}

          {modalType === 'news' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Summary</label>
                <textarea
                  value={formData.summary || ''}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Content</label>
                <textarea
                  value={formData.content || ''}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  rows={6}
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Category</label>
                  <select
                    value={formData.category || 'General'}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  >
                    <option value="General">General</option>
                    <option value="Announcement">Announcement</option>
                    <option value="Event">Event</option>
                    <option value="Birthday">Birthday</option>
                    <option value="Achievement">Achievement</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Publish Date</label>
                  <input
                    type="date"
                    value={formData.publishDate || ''}
                    onChange={(e) => setFormData({ ...formData, publishDate: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Priority</label>
                  <select
                    value={formData.priority || 'Medium'}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={formData.tags || ''}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Author ID</label>
                <input
                  type="text"
                  value={formData.author || ''}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
              </div>
              <label className="flex items-center gap-3 text-sm font-medium text-gray-700">
                <input
                  type="checkbox"
                  checked={Boolean(formData.isPublished)}
                  onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                  className="w-4 h-4 text-orange-600 border-gray-300 rounded"
                />
                Published
              </label>
            </div>
          )}

          {modalType === 'events' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  rows={5}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Event Type</label>
                  <select
                    value={formData.eventType || 'Other'}
                    onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  >
                    <option value="Wedding">Wedding</option>
                    <option value="Birthday">Birthday</option>
                    <option value="Festival">Festival</option>
                    <option value="Gathering">Gathering</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  <select
                    value={formData.status || 'Upcoming'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  >
                    <option value="Upcoming">Upcoming</option>
                    <option value="Ongoing">Ongoing</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Priority</label>
                  <select
                    value={formData.priority || 'Medium'}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Max Attendees</label>
                  <input
                    type="number"
                    value={formData.maxAttendees ?? ''}
                    onChange={(e) => setFormData({ ...formData, maxAttendees: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    min="0"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Start Date</label>
                  <input
                    type="date"
                    value={formData.startDate || ''}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">End Date</label>
                  <input
                    type="date"
                    value={formData.endDate || ''}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Start Time</label>
                  <input
                    type="time"
                    value={formData.startTime || ''}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">End Time</label>
                  <input
                    type="time"
                    value={formData.endTime || ''}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Organizer ID</label>
                  <input
                    type="text"
                    value={formData.organizer || ''}
                    onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Co-organizer IDs (comma-separated)</label>
                  <input
                    type="text"
                    value={formData.coOrganizers || ''}
                    onChange={(e) => setFormData({ ...formData, coOrganizers: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
              <label className="flex items-center gap-3 text-sm font-medium text-gray-700">
                <input
                  type="checkbox"
                  checked={Boolean(formData.isPublic)}
                  onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                  className="w-4 h-4 text-orange-600 border-gray-300 rounded"
                />
                Public Event
              </label>
              <div className="space-y-3">
                <p className="text-sm font-semibold text-gray-800">Venue</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Venue Name</label>
                    <input
                      type="text"
                      value={formData.venue?.name || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        venue: {
                          ...(formData.venue || {}),
                          name: e.target.value
                        }
                      })}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Street</label>
                    <input
                      type="text"
                      value={formData.venue?.address?.street || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        venue: {
                          ...(formData.venue || {}),
                          address: {
                            ...(formData.venue?.address || {}),
                            street: e.target.value
                          }
                        }
                      })}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">City</label>
                    <input
                      type="text"
                      value={formData.venue?.address?.city || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        venue: {
                          ...(formData.venue || {}),
                          address: {
                            ...(formData.venue?.address || {}),
                            city: e.target.value
                          }
                        }
                      })}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">State</label>
                    <input
                      type="text"
                      value={formData.venue?.address?.state || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        venue: {
                          ...(formData.venue || {}),
                          address: {
                            ...(formData.venue?.address || {}),
                            state: e.target.value
                          }
                        }
                      })}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Pincode</label>
                    <input
                      type="text"
                      value={formData.venue?.address?.pincode || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        venue: {
                          ...(formData.venue || {}),
                          address: {
                            ...(formData.venue?.address || {}),
                            pincode: e.target.value
                          }
                        }
                      })}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Country</label>
                    <input
                      type="text"
                      value={formData.venue?.address?.country || 'India'}
                      onChange={(e) => setFormData({
                        ...formData,
                        venue: {
                          ...(formData.venue || {}),
                          address: {
                            ...(formData.venue?.address || {}),
                            country: e.target.value
                          }
                        }
                      })}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Latitude</label>
                    <input
                      type="text"
                      value={formData.venue?.coordinates?.latitude ?? ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        venue: {
                          ...(formData.venue || {}),
                          coordinates: {
                            ...(formData.venue?.coordinates || {}),
                            latitude: e.target.value
                          }
                        }
                      })}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Longitude</label>
                    <input
                      type="text"
                      value={formData.venue?.coordinates?.longitude ?? ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        venue: {
                          ...(formData.venue || {}),
                          coordinates: {
                            ...(formData.venue?.coordinates || {}),
                            longitude: e.target.value
                          }
                        }
                      })}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {modalType === 'relationships' && (
            <>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">From Person (SerNo)</label>
                  <input
                    type="number"
                    placeholder="Enter serial number"
                    value={formData.fromSerNo || ''}
                    onChange={(e) => setFormData({ ...formData, fromSerNo: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    required
                  />
                  {formData.fromSerNo && <p className="text-xs text-gray-500 mt-1">Name: {getMemberName(formData.fromSerNo)}</p>}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">To Person (SerNo)</label>
                  <input
                    type="number"
                    placeholder="Enter serial number"
                    value={formData.toSerNo || ''}
                    onChange={(e) => setFormData({ ...formData, toSerNo: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    required
                  />
                  {formData.toSerNo && <p className="text-xs text-gray-500 mt-1">Name: {getMemberName(formData.toSerNo)}</p>}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Relation</label>
                  <input
                    type="text"
                    placeholder="e.g., father, mother, child, spouse, sibling"
                    value={formData.relation || ''}
                    onChange={(e) => setFormData({ ...formData, relation: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Relation (Marathi)</label>
                  <input
                    type="text"
                    placeholder="Marathi translation (optional)"
                    value={formData.relationMarathi || ''}
                    onChange={(e) => setFormData({ ...formData, relationMarathi: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Level</label>
                  <input
                    type="number"
                    placeholder="Relationship level (optional)"
                    value={formData.level || ''}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
            </>
          )}

          {modalType === 'Heirarchy_form' && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
                <h3 className="font-semibold text-blue-900">Approval Status</h3>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isapproved || false}
                    onChange={(e) => setFormData({ ...formData, isapproved: e.target.checked })}
                    className="w-5 h-5 rounded border-gray-300 text-orange-600 cursor-pointer"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {formData.isapproved ? '✓ Approved' : 'Approve this entry'}
                  </span>
                </label>
                <p className="text-xs text-blue-600 mt-2">
                  When approved, this entry will be moved to the members table with an auto-incremented s.no
                </p>
              </div>

              <HierarchyFormSection
                formData={formData}
                onChange={(updatedData) => setFormData(updatedData)}
              />
            </div>
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
              className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700"
            >
              {editingItem ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>
      </div>
    </div>
  );
};

export default AdminDashboard;
