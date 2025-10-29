const mongoose = require('mongoose');
require('dotenv').config({ path: './server/.env' });

const News = require('./server/models/News');
const Event = require('./server/models/Event');
const User = require('./server/models/User');

async function addSampleData() {
  try {
    // Connect to MongoDB
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000
    });
    console.log('✅ Connected to MongoDB\n');

    // Get or create admin user for author/organizer
    let admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      console.log('👤 Creating admin user...');
      admin = new User({
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@balkrishnanivas.com',
        password: 'admin123',
        role: 'admin'
      });
      await admin.save();
      console.log('✅ Admin user created\n');
    } else {
      console.log(`✅ Using existing admin user: ${admin.email}\n`);
    }

    // Sample News Data
    const sampleNews = [
      {
        title: '🎉 Family Reunion 2025 Announcement',
        content: 'Exciting news! We are planning a grand family reunion for December 2025. This will be a wonderful opportunity for all family members to gather, celebrate our heritage, and create lasting memories together. More details coming soon!',
        summary: 'Family reunion scheduled for December',
        author: admin._id,
        category: 'Announcement',
        isPublished: true,
        publishDate: new Date('2025-01-10'),
        priority: 'High',
        tags: ['reunion', 'family', '2025']
      },
      {
        title: '👶 New Baby in the Family!',
        content: 'We are thrilled to announce the arrival of a beautiful baby girl in our family! The newest member brings joy and blessings to the Bal Krishna Nivas family. Join us in celebrating this precious gift and offering your blessings to the proud parents.',
        summary: 'New baby girl born - celebrations begin',
        author: admin._id,
        category: 'Celebration',
        isPublished: true,
        publishDate: new Date('2025-01-08'),
        priority: 'High',
        tags: ['baby', 'celebration', 'family']
      },
      {
        title: '🏆 Family Member Achievement',
        content: 'Congratulations to our family member for achieving outstanding academic results! The entire family is proud of your dedication and hard work. Your success brings honor to our family name and inspires us all.',
        summary: 'Proud achievement by a family member',
        author: admin._id,
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
        description: 'Join us for a joyful celebration of Uncle Ramakrishna\'s birthday. Traditional rituals, cultural programs, and family feast will be organized. All family members are cordially invited to be part of this special occasion.',
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
        organizer: admin._id,
        status: 'Upcoming',
        priority: 'High'
      },
      {
        title: '💒 Wedding Celebration',
        description: 'A grand wedding celebration in the family! We cordially invite you to be part of our happiness as we celebrate this sacred union. Traditional ceremonies, receptions, and cultural programs planned across multiple days.',
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
        organizer: admin._id,
        status: 'Upcoming',
        priority: 'High'
      },
      {
        title: '🎭 Family Cultural Night',
        description: 'Experience our rich cultural heritage through music, dance, and traditional performances! A beautiful evening showcasing family talents and celebrating our roots. All family members welcome to participate and enjoy.',
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
        organizer: admin._id,
        status: 'Upcoming',
        priority: 'Medium'
      }
    ];

    // Insert News
    console.log('📰 Adding sample news items...');
    const newsResult = await News.insertMany(sampleNews);
    console.log(`✅ Added ${newsResult.length} news items\n`);

    // Insert Events
    console.log('📅 Adding sample events...');
    const eventsResult = await Event.insertMany(sampleEvents);
    console.log(`✅ Added ${eventsResult.length} events\n`);

    // Verify
    const newsCount = await News.countDocuments({ isPublished: true });
    const eventCount = await Event.countDocuments();

    console.log('📊 VERIFICATION:');
    console.log('================');
    console.log(`✅ Published News: ${newsCount}`);
    console.log(`✅ Events: ${eventCount}`);

    console.log('\n✨ Sample data added successfully!');
    console.log('   Now log in to the app to see news and events in the scroller.');

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.message.includes('connect')) {
      console.error('\n⚠️  MongoDB connection failed!');
      console.error('   Make sure MongoDB is running:');
      console.error('   1. Open Command Prompt as Admin');
      console.error('   2. Run: net start MongoDB');
      console.error('   3. Or run: mongod --dbpath "C:\\data\\db"');
    }
  } finally {
    await mongoose.connection.close();
    process.exit(error ? 1 : 0);
  }
}

addSampleData();