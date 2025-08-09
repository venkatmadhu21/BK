import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Database, 
  GitBranch, 
  BarChart3, 
  Eye, 
  Heart,
  Calendar,
  MapPin,
  Info,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import api from '../utils/api';
import EnhancedFamilyMemberCard from '../components/family/EnhancedFamilyMemberCard';

const NewFeaturesShowcase = () => {
  const [stats, setStats] = useState({});
  const [sampleMembers, setSampleMembers] = useState([]);
  const [relationships, setRelationships] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShowcaseData = async () => {
      try {
        // Fetch members
        const membersRes = await api.get('/api/family/members-new');
        const members = membersRes.data;
        
        // Fetch relationships
        const relationshipsRes = await api.get('/api/family/all-relationships');
        const allRelationships = relationshipsRes.data;
        
        // Calculate comprehensive statistics
        const statistics = {
          totalMembers: members.length,
          totalRelationships: allRelationships.length,
          maleMembers: members.filter(m => m.gender === 'Male').length,
          femaleMembers: members.filter(m => m.gender === 'Female').length,
          marriedMembers: members.filter(m => m.spouseSerNo).length,
          membersWithChildren: members.filter(m => m.childrenSerNos && m.childrenSerNos.length > 0).length,
          totalChildren: members.reduce((sum, m) => sum + (m.sonDaughterCount || 0), 0),
          generations: [...new Set(members.map(m => m.level))].length,
          uniqueVanshes: [...new Set(members.map(m => m.vansh).filter(Boolean))].length,
          relationshipTypes: [...new Set(allRelationships.map(r => r.relation))].length,
          membersWithBio: members.filter(m => m.Bio).length,
          membersWithDOB: members.filter(m => m.dob).length,
          membersWithDOD: members.filter(m => m.dod).length
        };
        
        // Get sample members (first 6 for showcase)
        const samples = members.slice(0, 6);
        
        setStats(statistics);
        setSampleMembers(samples);
        setRelationships(allRelationships.slice(0, 10)); // First 10 relationships for display
        setLoading(false);
      } catch (error) {
        console.error('Error fetching showcase data:', error);
        setLoading(false);
      }
    };

    fetchShowcaseData();
  }, []);

  const features = [
    {
      title: 'Enhanced Member Profiles',
      description: 'Rich member profiles with full names, birth/death dates, vansh information, and biographical details.',
      icon: Users,
      color: 'blue',
      highlights: [
        'Full name structure (firstName, middleName, lastName)',
        'Birth and death date tracking',
        'Vansh (lineage) information',
        'Biographical details',
        'Profile image support'
      ]
    },
    {
      title: 'Relationship Management',
      description: 'Comprehensive relationship tracking with support for all family relationships in English and Marathi.',
      icon: Heart,
      color: 'pink',
      highlights: [
        `${stats.relationshipTypes} different relationship types`,
        'Bilingual relationship names (English/Marathi)',
        'Parent-child relationships',
        'Spouse relationships',
        'Extended family relationships'
      ]
    },
    {
      title: 'Advanced Search & Filtering',
      description: 'Powerful search and filtering capabilities across all member attributes.',
      icon: Eye,
      color: 'green',
      highlights: [
        'Search by name, serial number, or vansh',
        'Filter by generation level',
        'Filter by gender',
        'Filter by vansh',
        'Multiple view modes (cards/compact)'
      ]
    },
    {
      title: 'Interactive Family Tree',
      description: 'Enhanced family tree visualization with expandable nodes and relationship details.',
      icon: GitBranch,
      color: 'purple',
      highlights: [
        'Expandable/collapsible tree nodes',
        'Relationship labels on connections',
        'Multiple tree view options',
        'Click to navigate between members',
        'Visual relationship indicators'
      ]
    },
    {
      title: 'Comprehensive Statistics',
      description: 'Detailed family statistics and analytics across all dimensions.',
      icon: BarChart3,
      color: 'orange',
      highlights: [
        `${stats.totalMembers} total family members`,
        `${stats.generations} generations tracked`,
        `${stats.uniqueVanshes} different vanshes`,
        `${stats.totalRelationships} documented relationships`,
        'Gender distribution analytics'
      ]
    },
    {
      title: 'Modern Data Architecture',
      description: 'Robust database design with separate collections for members and relationships.',
      icon: Database,
      color: 'indigo',
      highlights: [
        'Separate members and relationships collections',
        'Referential integrity between collections',
        'Scalable data structure',
        'Efficient querying and indexing',
        'Data validation and cleanup'
      ]
    }
  ];

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-4">
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading new features showcase...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          New Family Tree Features
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Explore the enhanced family tree system with new collections, advanced features, 
          and comprehensive relationship management.
        </p>
      </div>

      {/* Statistics Overview */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Family Tree Statistics
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          <div className="text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-blue-600">{stats.totalMembers}</p>
            <p className="text-sm text-gray-600">Total Members</p>
          </div>
          
          <div className="text-center">
            <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
              <Heart className="h-8 w-8 text-pink-600" />
            </div>
            <p className="text-3xl font-bold text-pink-600">{stats.totalRelationships}</p>
            <p className="text-sm text-gray-600">Relationships</p>
          </div>
          
          <div className="text-center">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
              <GitBranch className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-green-600">{stats.generations}</p>
            <p className="text-sm text-gray-600">Generations</p>
          </div>
          
          <div className="text-center">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
              <MapPin className="h-8 w-8 text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-purple-600">{stats.uniqueVanshes}</p>
            <p className="text-sm text-gray-600">Vanshes</p>
          </div>
          
          <div className="text-center">
            <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
              <Calendar className="h-8 w-8 text-orange-600" />
            </div>
            <p className="text-3xl font-bold text-orange-600">{stats.membersWithDOB}</p>
            <p className="text-sm text-gray-600">With Birth Dates</p>
          </div>
          
          <div className="text-center">
            <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
              <Info className="h-8 w-8 text-indigo-600" />
            </div>
            <p className="text-3xl font-bold text-indigo-600">{stats.membersWithBio}</p>
            <p className="text-sm text-gray-600">With Biography</p>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          New Features & Capabilities
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className={`bg-${feature.color}-100 w-16 h-16 rounded-full flex items-center justify-center mb-4`}>
                <feature.icon className={`h-8 w-8 text-${feature.color}-600`} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">{feature.title}</h3>
              <p className="text-gray-600 mb-4">{feature.description}</p>
              <ul className="space-y-2">
                {feature.highlights.map((highlight, idx) => (
                  <li key={idx} className="flex items-start text-sm text-gray-700">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Sample Members Showcase */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Enhanced Member Profiles
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {sampleMembers.map(member => (
            <EnhancedFamilyMemberCard 
              key={member.serNo} 
              member={member} 
              showAllFields={true}
            />
          ))}
        </div>
      </div>

      {/* Sample Relationships */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Relationship Data Structure
        </h2>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-800">From</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-800">To</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-800">Relationship</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-800">Marathi</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-800">Level</th>
                </tr>
              </thead>
              <tbody>
                {relationships.map((rel, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <Link 
                        to={`/family/member/${rel.fromSerNo}`}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        #{rel.fromSerNo}
                      </Link>
                    </td>
                    <td className="py-3 px-4">
                      <Link 
                        to={`/family/member/${rel.toSerNo}`}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        #{rel.toSerNo}
                      </Link>
                    </td>
                    <td className="py-3 px-4">
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                        {rel.relation}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {rel.relationMarathi || '-'}
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {rel.level || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Explore the New Features
        </h2>
        <div className="flex flex-wrap justify-center gap-4">
          <Link 
            to="/family"
            className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg flex items-center transition-colors"
          >
            <Users className="mr-2" size={20} />
            Enhanced Family List
            <ArrowRight className="ml-2" size={16} />
          </Link>
          
          <Link 
            to="/family/tree/1"
            className="bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg flex items-center transition-colors"
          >
            <GitBranch className="mr-2" size={20} />
            Interactive Family Tree
            <ArrowRight className="ml-2" size={16} />
          </Link>
          
          <Link 
            to="/raw-data"
            className="bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-lg flex items-center transition-colors"
          >
            <Database className="mr-2" size={20} />
            Raw Data View
            <ArrowRight className="ml-2" size={16} />
          </Link>
          
          <Link 
            to="/api-test"
            className="bg-orange-600 hover:bg-orange-700 text-white py-3 px-6 rounded-lg flex items-center transition-colors"
          >
            <BarChart3 className="mr-2" size={20} />
            API Testing
            <ArrowRight className="ml-2" size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NewFeaturesShowcase;