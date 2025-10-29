import React from 'react';
import NewsScroller from './NewsScroller';
import NewsScrollerStandalone from './NewsScrollerStandalone';
import { Newspaper, Megaphone, Zap, Award } from 'lucide-react';

/**
 * NewsScrollerDemo - Example usage of NewsScroller component
 * Shows various configurations and use cases
 */
const NewsScrollerDemo = () => {
  // Sample news data
  const latestNews = [
    "Annual Day 2025 Announced! 🎉",
    "AI Hackathon registrations open now!",
    "New campus canteen inaugurated 🎊",
    "Placement Drive starts from Dec 1st",
    "Scholarship applications now open",
    "Cultural fest dates confirmed",
    "New library wing launched 📚",
    "Sports tournament results out ⚽"
  ];

  const familyUpdates = [
    "Family Reunion planned for summer 2025",
    "Bal Krishna Nivas website launched",
    "New family members photos added",
    "Monthly newsletter published",
    "Family tree now updated",
    "Event gallery updated",
    "Recipe collection shared",
    "Memories archive expanded"
  ];

  const communityNews = [
    "Community cleanup drive successful ♻️",
    "New wellness program started",
    "Volunteers needed for upcoming event",
    "Local news: New park inaugurated",
    "Blood donation camp schedule",
    "Education scholarship awards",
    "Youth mentorship program",
    "Environmental initiative launched"
  ];

  return (
    <div className="w-full bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">NewsScroller Component</h1>
        <p className="text-gray-600 mb-8">Beautiful horizontal scrolling news ticker with multiple variants</p>

        {/* Example 1: Default with Megaphone Icon */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">1. Default Style (with react-fast-marquee)</h2>
          <p className="text-gray-600 mb-4 text-sm">Uses fast marquee library for smooth scrolling</p>
          <NewsScroller 
            items={latestNews}
            title="📰 Latest News"
            icon={Newspaper}
            speed={50}
            pauseOnHover={true}
          />
        </section>

        {/* Example 2: Family Updates */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">2. Family Updates Theme</h2>
          <p className="text-gray-600 mb-4 text-sm">Purple/blue theme for family-related news</p>
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-b-2 border-purple-300 shadow-lg py-4 rounded-lg">
            <div className="max-w-full mx-auto px-4">
              <div className="flex items-center gap-2 mb-3 px-2">
                <Megaphone size={24} className="text-purple-600 flex-shrink-0 animate-pulse" />
                <h2 className="text-lg font-bold text-purple-700 whitespace-nowrap">
                  Family Updates
                </h2>
                <div className="h-1 flex-grow rounded-full bg-gradient-to-r from-purple-300 to-transparent ml-2"></div>
              </div>
              <div className="overflow-x-auto pb-4">
                <div className="flex gap-3 px-4">
                  {familyUpdates.slice(0, 4).map((item, index) => (
                    <div key={index} className="flex-shrink-0">
                      <div className="bg-white text-gray-800 px-4 py-2 rounded-full shadow-sm border border-purple-200 hover:border-purple-400 hover:shadow-md hover:bg-purple-50 transition-all duration-300 cursor-pointer whitespace-nowrap">
                        <span className="inline-block w-2 h-2 bg-purple-500 rounded-full mr-2 animate-pulse"></span>
                        <span className="text-sm font-medium group-hover:text-purple-700">{item}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Example 3: Standalone Version (No external library) */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">3. Standalone Version (Pure CSS)</h2>
          <p className="text-gray-600 mb-4 text-sm">No external library needed - uses CSS animations</p>
          <NewsScrollerStandalone 
            items={communityNews}
            title="🌍 Community News"
            icon={Zap}
            speed="normal"
            pauseOnHover={true}
          />
        </section>

        {/* Example 4: Fast Speed */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">4. Fast Speed Variant</h2>
          <p className="text-gray-600 mb-4 text-sm">Quick scrolling speed for urgent announcements</p>
          <NewsScroller 
            items={[
              "🔴 URGENT: Server maintenance tonight 9 PM",
              "⚠️ System update in progress",
              "✅ Critical bug fixed",
              "🚀 New feature released"
            ]}
            title="⚡ Urgent Announcements"
            icon={Zap}
            speed={80}
            pauseOnHover={true}
          />
        </section>

        {/* Usage Instructions */}
        <section className="bg-white border-2 border-gray-200 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Usage Instructions</h2>
          
          <div className="space-y-6">
            {/* Installation */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Installation</h3>
              <p className="text-gray-600 mb-2">For the default component with react-fast-marquee:</p>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
                <code>npm install react-fast-marquee</code>
              </pre>
              <p className="text-gray-600 mt-2">The standalone version requires no additional dependencies!</p>
            </div>

            {/* Basic Usage */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Basic Usage</h3>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
{`import NewsScroller from './components/NewsScroller';

export default function Home() {
  const newsItems = [
    "Breaking News 1",
    "Breaking News 2",
    "Breaking News 3",
    "Breaking News 4"
  ];

  return (
    <NewsScroller 
      items={newsItems}
      title="Latest Updates"
    />
  );
}`}
              </pre>
            </div>

            {/* Props Documentation */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Available Props</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="px-4 py-2 text-left">Prop</th>
                      <th className="px-4 py-2 text-left">Type</th>
                      <th className="px-4 py-2 text-left">Default</th>
                      <th className="px-4 py-2 text-left">Description</th>
                    </tr>
                  </thead>
                  <tbody className="border-t">
                    <tr className="border-b hover:bg-gray-50">
                      <td className="px-4 py-2 font-mono text-orange-600">items</td>
                      <td className="px-4 py-2">array</td>
                      <td className="px-4 py-2">[]</td>
                      <td className="px-4 py-2">Array of news strings</td>
                    </tr>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="px-4 py-2 font-mono text-orange-600">title</td>
                      <td className="px-4 py-2">string</td>
                      <td className="px-4 py-2">'Latest Updates'</td>
                      <td className="px-4 py-2">Title displayed in header</td>
                    </tr>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="px-4 py-2 font-mono text-orange-600">icon</td>
                      <td className="px-4 py-2">component</td>
                      <td className="px-4 py-2">Megaphone</td>
                      <td className="px-4 py-2">Lucide-react icon component</td>
                    </tr>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="px-4 py-2 font-mono text-orange-600">speed</td>
                      <td className="px-4 py-2">number</td>
                      <td className="px-4 py-2">50</td>
                      <td className="px-4 py-2">Scrolling speed (1-100)</td>
                    </tr>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="px-4 py-2 font-mono text-orange-600">pauseOnHover</td>
                      <td className="px-4 py-2">boolean</td>
                      <td className="px-4 py-2">true</td>
                      <td className="px-4 py-2">Pause scroll on mouse hover</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-2 font-mono text-orange-600">backgroundColor</td>
                      <td className="px-4 py-2">string</td>
                      <td className="px-4 py-2">'from-orange-50 to-amber-50'</td>
                      <td className="px-4 py-2">Tailwind gradient classes</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Advanced Example */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Advanced Usage</h3>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
{`import NewsScroller from './components/NewsScroller';
import { Award } from 'lucide-react';

export default function Dashboard() {
  const announcements = [
    "Achievement unlocked! 🏆",
    "Milestone reached!",
    "New record set! 📈"
  ];

  return (
    <>
      <NewsScroller 
        items={announcements}
        title="🎯 Achievements"
        icon={Award}
        speed={60}
        pauseOnHover={true}
        backgroundColor="from-yellow-50 to-yellow-50"
        borderColor="border-yellow-400"
      />
    </>
  );
}`}
              </pre>
            </div>

            {/* Standalone Usage */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Standalone Version (No Dependencies)</h3>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
{`import NewsScrollerStandalone from './components/NewsScrollerStandalone';

export default function Home() {
  return (
    <NewsScrollerStandalone 
      items={['News 1', 'News 2', 'News 3']}
      title="Updates"
      speed="normal"  // 'slow', 'normal', 'fast'
    />
  );
}`}
              </pre>
            </div>

            {/* Icons Available */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Available Icons (from lucide-react)</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                <div className="flex flex-col items-center gap-2 p-3 bg-gray-100 rounded">
                  <Newspaper size={24} />
                  <span className="text-xs text-gray-600">Newspaper</span>
                </div>
                <div className="flex flex-col items-center gap-2 p-3 bg-gray-100 rounded">
                  <Megaphone size={24} />
                  <span className="text-xs text-gray-600">Megaphone</span>
                </div>
                <div className="flex flex-col items-center gap-2 p-3 bg-gray-100 rounded">
                  <Zap size={24} />
                  <span className="text-xs text-gray-600">Zap</span>
                </div>
                <div className="flex flex-col items-center gap-2 p-3 bg-gray-100 rounded">
                  <Award size={24} />
                  <span className="text-xs text-gray-600">Award</span>
                </div>
              </div>
              <p className="text-gray-600 text-sm mt-3">Or use any other icon from lucide-react library</p>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-blue-900 mb-4">✨ Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-blue-900">
            <div className="flex gap-3">
              <span className="text-2xl">✅</span>
              <div>
                <p className="font-semibold">Smooth Scrolling</p>
                <p className="text-sm opacity-75">Uses react-fast-marquee for buttery smooth animations</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-2xl">📱</span>
              <div>
                <p className="font-semibold">Fully Responsive</p>
                <p className="text-sm opacity-75">Looks great on mobile, tablet, and desktop</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-2xl">🎨</span>
              <div>
                <p className="font-semibold">Tailwind Styled</p>
                <p className="text-sm opacity-75">Easily customize colors and spacing</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-2xl">⚡</span>
              <div>
                <p className="font-semibold">Performance</p>
                <p className="text-sm opacity-75">Lightweight and optimized for speed</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-2xl">🪝</span>
              <div>
                <p className="font-semibold">Customizable</p>
                <p className="text-sm opacity-75">Full prop control for colors, speed, icons</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-2xl">🆓</span>
              <div>
                <p className="font-semibold">Standalone Version</p>
                <p className="text-sm opacity-75">Use without react-fast-marquee if needed</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default NewsScrollerDemo;