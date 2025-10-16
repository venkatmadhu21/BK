import React, { useState, useEffect, useRef } from 'react';
import { Users, TreePine, Download, Share2, Search, Filter, Plus, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Link } from 'react-router-dom';
import '../styles/heritage-background.css';

const FamilyTree = () => {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const treeRef = useRef(null);

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (treeRef.current) {
      observer.observe(treeRef.current);
    }

    return () => {
      if (treeRef.current) {
        observer.unobserve(treeRef.current);
      }
    };
  }, []);
  
  return (
    <>
      {/* Custom CSS for enhanced animations and modern design */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(2deg); }
        }
        
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(249, 115, 22, 0.3); }
          50% { box-shadow: 0 0 30px rgba(249, 115, 22, 0.6), 0 0 40px rgba(249, 115, 22, 0.4); }
        }
        
        .float-animation {
          animation: float 6s ease-in-out infinite;
        }
        
        .glow-effect {
          animation: glow 2s ease-in-out infinite alternate;
        }
        
        .modern-card {
          background: linear-gradient(145deg, #ffffff 0%, #fefefe 100%);
          border: 1px solid rgba(249, 115, 22, 0.1);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .modern-card:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 20px 40px rgba(249, 115, 22, 0.15), 0 10px 20px rgba(0, 0, 0, 0.1);
          border-color: rgba(249, 115, 22, 0.2);
        }
        
        .floating-action-btn {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 1000;
          background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
          box-shadow: 0 8px 25px rgba(249, 115, 22, 0.3);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .floating-action-btn:hover {
          transform: translateY(-2px) scale(1.05);
          box-shadow: 0 12px 35px rgba(249, 115, 22, 0.4);
        }
        
        .pattern-bg {
          background-image: 
            radial-gradient(circle at 25% 25%, rgba(249, 115, 22, 0.03) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(249, 115, 22, 0.03) 0%, transparent 50%);
          background-size: 100px 100px;
        }
        
        .tree-icon {
          background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>
      
      <div className="heritage-bg min-h-screen" ref={treeRef}>
        <div className="heritage-gradient-overlay"></div>
        <div className="heritage-decoration"></div>
        <div className="heritage-decoration"></div>
        <div className="heritage-decoration"></div>
        <div className="heritage-decoration"></div>
        <div className="heritage-content">
        {/* Floating Action Buttons */}
        <div className="fixed top-20 right-4 z-1000 flex flex-col gap-3">
          <button className="floating-action-btn flex items-center px-4 py-3 text-white rounded-full font-semibold text-sm shadow-lg">
            <Plus size={18} className="mr-2" />
            <span className="hidden sm:inline">Add Member</span>
          </button>
          <button className="floating-action-btn flex items-center px-4 py-3 text-white rounded-full font-semibold text-sm shadow-lg">
            <Download size={18} className="mr-2" />
            <span className="hidden sm:inline">Export</span>
          </button>
          <button className="floating-action-btn flex items-center px-4 py-3 text-white rounded-full font-semibold text-sm shadow-lg">
            <Share2 size={18} className="mr-2" />
            <span className="hidden sm:inline">Share</span>
          </button>
        </div>

        {/* Modern Header Section */}
        <div className="pt-20 pb-8 px-4 sm:px-6 lg:px-8">
          <div className={`max-w-7xl mx-auto transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {/* Back Button */}
            <div className="mb-8">
              <Link 
                to="/family" 
                className="inline-flex items-center px-4 py-2 text-orange-600 hover:text-orange-700 font-medium transition-colors duration-300"
              >
                <ArrowLeft size={20} className="mr-2" />
                Back to Family List
              </Link>
            </div>

            {/* Main Header */}
            <div className="text-center mb-12">
              <div className="mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center mx-auto mb-6 float-animation">
                  <TreePine size={40} className="tree-icon" />
                </div>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
                <span className="bg-gradient-to-r from-orange-600 via-orange-500 to-orange-700 bg-clip-text text-transparent">
                  Family Tree
                </span>
        </h1>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Explore the rich heritage and connections of our family through an interactive family tree
              </p>
            </div>

            {/* Quick Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="heritage-card modern-card rounded-2xl p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users size={24} className="text-orange-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">150+</h3>
                <p className="text-gray-600">Family Members</p>
              </div>
              <div className="heritage-card modern-card rounded-2xl p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TreePine size={24} className="text-orange-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">8</h3>
                <p className="text-gray-600">Generations</p>
              </div>
              <div className="heritage-card modern-card rounded-2xl p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Share2 size={24} className="text-orange-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">500+</h3>
                <p className="text-gray-600">Relationships</p>
              </div>
            </div>

            {/* View Type Selector */}
            <div className="heritage-card modern-card rounded-2xl p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Choose Your View</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <button className="p-4 border-2 border-orange-200 rounded-xl hover:border-orange-400 hover:bg-orange-50 transition-all duration-300 text-left group">
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center mr-3">
                      <TreePine size={20} className="text-orange-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 group-hover:text-orange-700">Interactive Tree</h4>
                  </div>
                  <p className="text-sm text-gray-600">Explore relationships with interactive connections</p>
                </button>
                
                <button className="p-4 border-2 border-orange-200 rounded-xl hover:border-orange-400 hover:bg-orange-50 transition-all duration-300 text-left group">
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center mr-3">
                      <Users size={20} className="text-orange-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 group-hover:text-orange-700">All Members</h4>
                  </div>
                  <p className="text-sm text-gray-600">Browse all family members by generation</p>
                </button>
                
                <button className="p-4 border-2 border-orange-200 rounded-xl hover:border-orange-400 hover:bg-orange-50 transition-all duration-300 text-left group">
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center mr-3">
                      <Search size={20} className="text-orange-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 group-hover:text-orange-700">Search & Filter</h4>
                  </div>
                  <p className="text-sm text-gray-600">Find specific members quickly</p>
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="text-center">
              <div className="inline-flex gap-4">
                <button className="px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
                  Start Exploring
                </button>
                <button className="px-8 py-4 bg-white text-orange-600 border-2 border-orange-200 rounded-xl font-semibold hover:bg-orange-50 hover:border-orange-300 transition-all duration-300 hover:scale-105">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default FamilyTree;