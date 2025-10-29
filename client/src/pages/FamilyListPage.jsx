import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, User, Users, GitBranch, Grid, List, Eye, BarChart3 } from 'lucide-react';
import api from '../utils/api';
import EnhancedFamilyMemberCard from '../components/family/EnhancedFamilyMemberCard';

const FamilyListPage = () => {
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedGender, setSelectedGender] = useState('');
  const [selectedVansh, setSelectedVansh] = useState('');
  const [viewMode, setViewMode] = useState('cards'); // 'cards', 'compact', 'table'
  const [levels, setLevels] = useState([]);
  const [vanshes, setVanshes] = useState([]);
  const [stats, setStats] = useState({});

  useEffect(() => {
    const fetchFamilyMembers = async () => {
      try {
        setLoading(true);
        // Fetch from members collection endpoint
        const res = await api.get('/api/family/members');
        
        // Get data from response (backend now returns flat, transformed data)
        const membersData = Array.isArray(res.data) ? res.data : (res.data.data || []);
        
        // Ensure gender is capitalized for display
        const normalizedMembers = membersData.map(member => ({
          ...member,
          gender: member.gender ? member.gender.charAt(0).toUpperCase() + member.gender.slice(1) : ''
        }));
        
        // Extract unique levels and vanshes
        const uniqueLevels = [...new Set(normalizedMembers.map(member => member.level))].filter(Boolean).sort((a, b) => a - b);
        const uniqueVanshes = [...new Set(normalizedMembers.map(member => member.vansh).filter(Boolean))].sort();
        
        // Calculate statistics
        const statistics = {
          total: normalizedMembers.length,
          male: normalizedMembers.filter(m => m.gender?.toLowerCase() === 'male').length,
          female: normalizedMembers.filter(m => m.gender?.toLowerCase() === 'female').length,
          withSpouse: normalizedMembers.filter(m => m.spouseSerNo).length,
          withChildren: normalizedMembers.filter(m => m.childrenSerNos && m.childrenSerNos.length > 0).length,
          totalChildren: normalizedMembers.reduce((sum, m) => sum + (m.childrenSerNos?.length || 0), 0),
          byLevel: uniqueLevels.reduce((acc, level) => {
            acc[level] = normalizedMembers.filter(m => m.level === level).length;
            return acc;
          }, {}),
          byVansh: uniqueVanshes.reduce((acc, vansh) => {
            acc[vansh] = normalizedMembers.filter(m => m.vansh === vansh).length;
            return acc;
          }, {})
        };
        
        // Set a minimum loading time of 1 second for better UX
        setTimeout(() => {
          setMembers(normalizedMembers);
          setFilteredMembers(normalizedMembers);
          setLevels(uniqueLevels);
          setVanshes(uniqueVanshes);
          setStats(statistics);
          setLoading(false);
        }, 1000);
      } catch (err) {
        console.error('Error fetching family members:', err);
        setTimeout(() => {
          setError('Failed to load family members. Please try again later.');
          setLoading(false);
        }, 1000);
      }
    };

    fetchFamilyMembers();
  }, []);

  useEffect(() => {
    // Filter members based on search term and selected filters
    let filtered = [...members];
    
    if (searchTerm) {
      filtered = filtered.filter(member => {
        const memberName = member.fullName || `${member.firstName || ''} ${member.middleName || ''} ${member.lastName || ''}`.trim();
        return memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
               member.serNo.toString().includes(searchTerm) ||
               (member.vansh && member.vansh.toLowerCase().includes(searchTerm.toLowerCase()));
      });
    }
    
    if (selectedLevel) {
      filtered = filtered.filter(member => member.level === parseInt(selectedLevel));
    }
    
    if (selectedGender) {
      filtered = filtered.filter(member => member.gender?.toLowerCase() === selectedGender?.toLowerCase());
    }
    
    if (selectedVansh) {
      filtered = filtered.filter(member => member.vansh === selectedVansh);
    }
    
    setFilteredMembers(filtered);
  }, [searchTerm, selectedLevel, selectedGender, selectedVansh, members]);

  const handleLevelChange = async (level) => {
    setSelectedLevel(level);
    
    if (level) {
      try {
        setLoading(true);
        const res = await api.get(`/api/family/members?level=${level}`);
        
        // Get data from response
        const membersData = Array.isArray(res.data) ? res.data : (res.data.data || []);
        
        // Ensure gender is capitalized for display
        const normalizedMembers = membersData.map(member => ({
          ...member,
          gender: member.gender ? member.gender.charAt(0).toUpperCase() + member.gender.slice(1) : ''
        }));
        
        // Set a minimum loading time of 1 second for better UX
        setTimeout(() => {
          setFilteredMembers(normalizedMembers);
          setLoading(false);
        }, 1000);
      } catch (err) {
        console.error('Error fetching members by level:', err);
        setTimeout(() => {
          setError('Failed to load members by level. Please try again later.');
          setLoading(false);
        }, 1000);
      }
    } else {
      setLoading(true);
      // Set a minimum loading time of 1 second for better UX
      setTimeout(() => {
        setFilteredMembers(members);
        setLoading(false);
      }, 1000);
    }
  };

  if (loading && members.length === 0) return <div className="text-center py-10">Loading family members...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Family Members</h1>
          <p className="text-gray-600 mt-1">
            Explore our family tree with {stats.total || 0} members across {levels.length} generations
          </p>
        </div>
        <div className="flex space-x-3">
          <Link 
            to="/family/tree/1" 
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center transition-colors"
          >
            <GitBranch className="mr-2" size={16} />
            View Family Tree
          </Link>
          <Link 
            to="/raw-data" 
            className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg flex items-center transition-colors"
          >
            <BarChart3 className="mr-2" size={16} />
            Raw Data
          </Link>
        </div>
      </div>

      {/* Statistics Cards */}
      {!loading && stats.total && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <p className="text-blue-600 text-sm font-medium">Total Members</p>
            <p className="text-2xl font-bold text-blue-800">{stats.total}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <p className="text-green-600 text-sm font-medium">Male</p>
            <p className="text-2xl font-bold text-green-800">{stats.male}</p>
          </div>
          <div className="bg-pink-50 p-4 rounded-lg border border-pink-200">
            <p className="text-pink-600 text-sm font-medium">Female</p>
            <p className="text-2xl font-bold text-pink-800">{stats.female}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <p className="text-purple-600 text-sm font-medium">Married</p>
            <p className="text-2xl font-bold text-purple-800">{stats.withSpouse}</p>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <p className="text-orange-600 text-sm font-medium">With Children</p>
            <p className="text-2xl font-bold text-orange-800">{stats.withChildren}</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <p className="text-yellow-600 text-sm font-medium">Generations</p>
            <p className="text-2xl font-bold text-yellow-800">{levels.length}</p>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col space-y-4">
          {/* Search input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name, serial number, or vansh..."
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Filter Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Level filter */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-4 w-4 text-gray-400" />
              </div>
              <select
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                value={selectedLevel}
                onChange={(e) => handleLevelChange(e.target.value)}
              >
                <option value="">All Levels</option>
                {levels.map((level, idx) => (
                  <option key={`level-${idx}-${level}`} value={level}>Level {level}</option>
                ))}
              </select>
            </div>

            {/* Gender filter */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-4 w-4 text-gray-400" />
              </div>
              <select
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                value={selectedGender}
                onChange={(e) => setSelectedGender(e.target.value)}
              >
                <option value="">All Genders</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            {/* Vansh filter */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-4 w-4 text-gray-400" />
              </div>
              <select
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                value={selectedVansh}
                onChange={(e) => setSelectedVansh(e.target.value)}
              >
                <option value="">All Vansh</option>
                {vanshes.filter(Boolean).map((vansh, idx) => (
                  <option key={`vansh-${idx}-${vansh}`} value={vansh}>{vansh}</option>
                ))}
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex rounded-lg border border-gray-300 overflow-hidden">
              <button
                onClick={() => setViewMode('cards')}
                className={`flex-1 px-3 py-2 text-sm font-medium transition-colors ${
                  viewMode === 'cards' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Grid size={16} className="mx-auto" />
              </button>
              <button
                onClick={() => setViewMode('compact')}
                className={`flex-1 px-3 py-2 text-sm font-medium transition-colors ${
                  viewMode === 'compact' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <List size={16} className="mx-auto" />
              </button>
            </div>
          </div>

          {/* Active Filters */}
          {(selectedLevel || selectedGender || selectedVansh || searchTerm) && (
            <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-200">
              <span className="text-sm text-gray-600">Active filters:</span>
              {searchTerm && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Search: "{searchTerm}"
                  <button onClick={() => setSearchTerm('')} className="ml-1 text-blue-600 hover:text-blue-800">×</button>
                </span>
              )}
              {selectedLevel && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Level {selectedLevel}
                  <button onClick={() => setSelectedLevel('')} className="ml-1 text-green-600 hover:text-green-800">×</button>
                </span>
              )}
              {selectedGender && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  {selectedGender}
                  <button onClick={() => setSelectedGender('')} className="ml-1 text-purple-600 hover:text-purple-800">×</button>
                </span>
              )}
              {selectedVansh && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                  {selectedVansh}
                  <button onClick={() => setSelectedVansh('')} className="ml-1 text-orange-600 hover:text-orange-800">×</button>
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Results Section */}
      <div className="mb-4 flex justify-between items-center">
        <p className="text-gray-600">
          Showing {filteredMembers.length} of {members.length} members
        </p>
        {filteredMembers.length > 0 && (
          <div className="text-sm text-gray-500">
            {viewMode === 'cards' ? 'Detailed Cards' : 'Compact List'}
          </div>
        )}
      </div>

      {loading ? (
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading family members...</p>
        </div>
      ) : filteredMembers.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg shadow-md">
          <div className="text-gray-400 mb-4">
            <Users size={48} className="mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No members found</h3>
          <p className="text-gray-500 mb-4">
            No family members match your current search criteria.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedLevel('');
              setSelectedGender('');
              setSelectedVansh('');
            }}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className={
          viewMode === 'cards' 
            ? "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
            : "space-y-3"
        }>
          {filteredMembers.map(member => (
            <EnhancedFamilyMemberCard 
              key={member.serNo} 
              member={member} 
              compact={viewMode === 'compact'}
              showAllFields={viewMode === 'cards'}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FamilyListPage;