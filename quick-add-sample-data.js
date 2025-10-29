const mongoose = require('mongoose');
require('dotenv').config({ path: './server/.env' });

const News = require('./server/models/News');
const Event = require('./server/models/Event');

async function addSampleData() {
  try {
    // Connect to MongoDB with short timeout
    console.log('🔗 Connecting to MongoDB...');
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    // Use a dummy ObjectId for author/organizer (will still work)
    const dummyUserId = new mongoose.Types.ObjectId();

    // Sample News Data
    const sampleNews = [
      {
        title: '🎉 Family Reunion 2025 Announcement',
        content: 'Exciting news! We are planning a grand family reunion for December 2025. This will be a wonderful opportunity for all family members to gather, celebrate our heritage, and create lasting memories together.',
        summary: 'Family reunion scheduled for December',
        author: dummyUserId,
        category: 'Announcement',
        isPublished: true,
        publishDate: new Date('2025-01-10'),
        priority: 'High',
        tags: ['reunion', 'family', '2025']
      },
      {
        title: '👶 New Baby in the Family!',
        content: 'We are thrilled to announce the arrival of a beautiful baby girl in our family! The newest member brings joy and blessings to the Bal Krishna Nivas family. Join us in celebrating this precious gift.',
        summary: 'New baby girl born - celebrations begin',
        author: dummyUserId,
        category: 'Celebration',
        isPublished: true,
        publishDate: new Date('2025-01-08'),
        priority: 'High',
        tags: ['baby', 'celebration', 'family']
      },
      {
        title: '🏆 Family Member Achievement',
        content: 'Congratulations to our family member for achieving outstanding academic results! The entire family is proud of your dedication and hard work. Your success brings honor to our family name.',
        summary: 'Proud achievement by a family member',
        author: dummyUserId,
        category: 'Achievement',
        isPublished: true,
        publishDate: new Date('2025-01-05'),
        priority: 'Medium',
        tags: ['achievement', 'education', 'pride']
      }
    ];

    // Sample Events Data
    const sampleEvents = [
      {
        title: '🎂 Birthday Celebration - Uncle Ramakrishna',
        description: 'Join us for a joyful celebration of Uncle Ramakrishna\'s birthday. Traditional rituals, cultural programs, and family feast will be organized. All family members are cordially invited.',
        eventType: 'Birthday',
        startDate: new Date('2025-02-15'),
        endDate: new Date('2025-02-15'),
        startTime: '10:00 AM',
        endTime: '08:00 PM',
        venue: {
          name: 'Bal Krishna Nivas Family Home',
          address: {
            street: 'Gokhale Street',
            city: 'Pune',
            state: 'Maharashtra',
            pincode: '411001',
            country: 'India'
          }
        },
        organizer: dummyUserId,
        status: 'Upcoming',
        priority: 'High'
      },
      {
        title: '💒 Wedding Celebration',
        description: 'A grand wedding celebration in the family! We cordially invite you to be part of our happiness as we celebrate this sacred union. Traditional ceremonies and receptions planned.',
        eventType: 'Wedding',
        startDate: new Date('2025-03-10'),
        endDate: new Date('2025-03-12'),
        startTime: '09:00 AM',
        endTime: '11:00 PM',
        venue: {
          name: 'Heritage Convention Center',
          address: {
            street: 'Shivaji Nagar',
            city: 'Pune',
            state: 'Maharashtra',
            pincode: '411005',
            country: 'India'
          }
        },
        organizer: dummyUserId,
        status: 'Upcoming',
        priority: 'High'
      },
      {
        title: '🎭 Family Cultural Night',
        description: 'Experience our rich cultural heritage through music, dance, and traditional performances! A beautiful evening showcasing family talents and celebrating our roots.',
        eventType: 'Cultural',
        startDate: new Date('2025-02-28'),
        endDate: new Date('2025-02-28'),
        startTime: '06:00 PM',
        endTime: '10:00 PM',
        venue: {
          name: 'Community Hall',
          address: {
            street: 'FC Road',
            city: 'Pune',
            state: 'Maharashtra',
            pincode: '411004',
            country: 'India'
          }
        },
        organizer: dummyUserId,
        status: 'Upcoming',
        priority: 'Medium'
      }
    ];

    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log('🗑️  Clearing existing sample data...');
    await News.deleteMany({ priority: 'High' });
    await Event.deleteMany({ priority: 'High' });

    // Insert News
    console.log('📰 Adding news items...');
    const newsResult = await News.insertMany(sampleNews);
    console.log(`✅ Added ${newsResult.length} news items`);

    // Insert Events
    console.log('📅 Adding events...');
    const eventsResult = await Event.insertMany(sampleEvents);
    console.log(`✅ Added ${eventsResult.length} events\n`);

    // Verify
    const newsCount = await News.countDocuments({ isPublished: true });
    const eventCount = await Event.countDocuments();

    console.log('📊 DATABASE STATUS:');
    console.log('===================');
    console.log(`✅ Published News: ${newsCount}`);
    console.log(`✅ Events: ${eventCount}`);
    console.log('\n✨ SUCCESS! Sample data added.\n');
    console.log('📌 NEXT STEPS:');
    console.log('   1. Refresh your browser');
    console.log('   2. Log in to the application');
    console.log('   3. Go to Home page');
    console.log('   4. You should see news and events in the scroller! 🎉');

    process.exit(0);

  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    
    if (error.message.includes('timeout') || error.message.includes('ECONNREFUSED')) {
      console.error('\n⚠️  MongoDB Connection Issue!');
      console.error('\nSOLUTION - Start MongoDB:');
      console.error('   1. Open Command Prompt as Administrator');
      console.error('   2. Run: net start MongoDB');
      console.error('   3. Wait for "The MongoDB service has been started successfully"');
      console.error('   4. Then run this script again: node quick-add-sample-data.js');
    }
    
    process.exit(1);
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
  }
}

addSampleData();