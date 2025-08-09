import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { AccessibilityProvider } from './context/AccessibilityContext';
import { LoadingProvider } from './context/LoadingContext';
import { ToastProvider } from './context/ToastContext';
import './i18n'; // Initialize i18n
import './styles/accessibility.css'; // Import accessibility styles
import Navbar from './components/layout/NavbarWithDropdown';
import BackgroundDecorations from './components/layout/BackgroundDecorations';
import AccessibilityToolbar from './components/accessibility/AccessibilityToolbar';
import SkipToContent from './components/accessibility/SkipToContent';
import KeyboardShortcuts from './components/accessibility/KeyboardShortcuts';
import AccessibilityNotification from './components/accessibility/AccessibilityNotification';
import Home from './pages/Home';
import About from './pages/About';
import History from './pages/History';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import FamilyTree from './pages/FamilyTree';
import News from './pages/News';
import Events from './pages/Events';
import Profile from './pages/Profile';
import YogeshwariDevi from './pages/YogeshwariDevi';
import VyadeshwarTemple from './pages/VyadeshwarTemple';
import LoaderDemo from './components/common/LoaderDemo';
import LoaderUsageExample from './components/common/LoaderUsageExample';
import LoadingEffectsDemo from './pages/LoadingEffectsDemo';
import PDFExportDemo from './pages/PDFExportDemo';
import QuickLoader from './components/common/QuickLoader';
import PageLifecycleLoader from './components/common/PageLifecycleLoader';
import PrivateRoute from './components/routing/PrivateRoute';

// New Family Tree Components
import FamilyListPage from './pages/FamilyListPage';
import FamilyMemberPage from './pages/FamilyMemberPage';
import FamilyChildrenPage from './pages/FamilyChildrenPage';
import FamilyTreeComponent from './components/family/FamilyTree';
import SeedDataPage from './pages/SeedDataPage';
import ApiTestPage from './pages/ApiTestPage';
import RawDataPage from './pages/RawDataPage';
import NewFeaturesShowcase from './pages/NewFeaturesShowcase';
import RelationshipsPage from './pages/RelationshipsPage';

function App() {
  return (
    <AccessibilityProvider>
      <LanguageProvider>
        <AuthProvider>
          <ToastProvider>
            <Router>
              <LoadingProvider>
              <QuickLoader>
                <div className="min-h-screen bg-white relative">
                  {/* Page Lifecycle Loader - Temporarily disabled */}
                  {/* <PageLifecycleLoader /> */}
                  
                  {/* Skip to content link for keyboard navigation */}
                  <SkipToContent />
                  <KeyboardShortcuts />
                  <BackgroundDecorations />
                  <Navbar />
                  <AccessibilityToolbar />
                  <AccessibilityNotification />
          <Routes>
            <Route path="/" element={<div id="main-content"><Home /></div>} />
            <Route path="/about" element={
              <main id="main-content" className="container mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 pt-20 xs:pt-24 sm:pt-28 pb-6 xs:pb-8 relative z-10">
                <About />
              </main>
            } />
            <Route path="/history" element={
              <main id="main-content" className="container mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 pt-20 xs:pt-24 sm:pt-28 pb-6 xs:pb-8 relative z-10">
                <History />
              </main>
            } />
            <Route path="/news" element={
              <main id="main-content" className="container mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 pt-20 xs:pt-24 sm:pt-28 pb-6 xs:pb-8 relative z-10">
                <News />
              </main>
            } />
            <Route path="/events" element={
              <main id="main-content" className="container mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 pt-20 xs:pt-24 sm:pt-28 pb-6 xs:pb-8 relative z-10">
                <Events />
              </main>
            } />
            <Route path="/login" element={
              <main id="main-content" className="container mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 pt-20 xs:pt-24 sm:pt-28 pb-6 xs:pb-8 relative z-10">
                <Login />
              </main>
            } />
            <Route path="/register" element={
              <main id="main-content" className="container mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 pt-20 xs:pt-24 sm:pt-28 pb-6 xs:pb-8 relative z-10">
                <Register />
              </main>
            } />
            <Route path="/dashboard" element={
              <main id="main-content" className="container mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 pt-20 xs:pt-24 sm:pt-28 pb-6 xs:pb-8 relative z-10">
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              </main>
            } />
            <Route path="/family-tree" element={
              <main id="main-content" className="container mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 pt-20 xs:pt-24 sm:pt-28 pb-6 xs:pb-8 relative z-10">
                <PrivateRoute>
                  <FamilyTree />
                </PrivateRoute>
              </main>
            } />
            
            {/* New Family Tree Routes */}
            {/* Family routes - temporarily without authentication for testing */}
            <Route path="/family" element={
              <main id="main-content" className="container mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 pt-20 xs:pt-24 sm:pt-28 pb-6 xs:pb-8 relative z-10">
                <FamilyListPage />
              </main>
            } />
            <Route path="/family/member/:serNo" element={
              <main id="main-content" className="container mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 pt-20 xs:pt-24 sm:pt-28 pb-6 xs:pb-8 relative z-10">
                <FamilyMemberPage />
              </main>
            } />
            <Route path="/family/member/:serNo/children" element={
              <main id="main-content" className="container mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 pt-20 xs:pt-24 sm:pt-28 pb-6 xs:pb-8 relative z-10">
                <FamilyChildrenPage />
              </main>
            } />
            <Route path="/family/tree/:serNo" element={
              <main id="main-content" className="container mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 pt-20 xs:pt-24 sm:pt-28 pb-6 xs:pb-8 relative z-10">
                <FamilyTreeComponent />
              </main>
            } />
            
            {/* Seed Data Page (for development only) */}
            <Route path="/seed" element={
              <main id="main-content" className="container mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 pt-20 xs:pt-24 sm:pt-28 pb-6 xs:pb-8 relative z-10">
                <SeedDataPage />
              </main>
            } />
            
            {/* API Test Page (for development only) */}
            <Route path="/api-test" element={
              <main id="main-content" className="container mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 pt-20 xs:pt-24 sm:pt-28 pb-6 xs:pb-8 relative z-10">
                <ApiTestPage />
              </main>
            } />
            
            {/* Raw Data Page (for development only) */}
            <Route path="/raw-data" element={
              <main id="main-content" className="container mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 pt-20 xs:pt-24 sm:pt-28 pb-6 xs:pb-8 relative z-10">
                <RawDataPage />
              </main>
            } />
            
            {/* New Features Showcase */}
            <Route path="/new-features" element={
              <main id="main-content" className="container mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 pt-20 xs:pt-24 sm:pt-28 pb-6 xs:pb-8 relative z-10">
                <NewFeaturesShowcase />
              </main>
            } />
            
            {/* Relationships Page */}
            <Route path="/relationships" element={
              <main id="main-content" className="container mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 pt-20 xs:pt-24 sm:pt-28 pb-6 xs:pb-8 relative z-10">
                <RelationshipsPage />
              </main>
            } />
            <Route path="/profile" element={
              <main id="main-content" className="container mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 pt-20 xs:pt-24 sm:pt-28 pb-6 xs:pb-8 relative z-10">
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              </main>
            } />
            <Route path="/yogeshwari-devi" element={<YogeshwariDevi />} />
            <Route path="/vyadeshwar-temple" element={<VyadeshwarTemple />} />
            <Route path="/loader-demo" element={
              <main id="main-content" className="relative z-10">
                <LoaderDemo />
              </main>
            } />
            <Route path="/loader-examples" element={
              <main id="main-content" className="relative z-10">
                <LoaderUsageExample />
              </main>
            } />
            <Route path="/loading-effects" element={
              <main id="main-content" className="relative z-10">
                <LoadingEffectsDemo />
              </main>
            } />
            <Route path="/pdf-export-demo" element={
              <main id="main-content" className="container mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 pt-20 xs:pt-24 sm:pt-28 pb-6 xs:pb-8 relative z-10">
                <PDFExportDemo />
              </main>
            } />
                  </Routes>
                </div>
              </QuickLoader>
            </LoadingProvider>
          </Router>
          </ToastProvider>
        </AuthProvider>
      </LanguageProvider>
    </AccessibilityProvider>
  );
}

export default App;