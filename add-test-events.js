const mongoose = require('mongoose');
const Event = require('./server/models/Event');
require('dotenv').config();

const addTestEvents = async () => {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Get an admin user ID (you can use any existing user ID)
    const User = require('./server/models/User');
    const admin = await User.findOne();
    
    if (!admin) {
      console.log('❌ No users found. Create a user first!');
      process.exit(1);
    }

    console.log(`👤 Using user: ${admin.firstName} ${admin.lastName}`);

    const today = new Date();
    const nextMonth = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

    const testEvents = [
      {
        title: '🎉 Birthday Celebration',
        description: 'Join us for an amazing birthday party with family and friends!',
        eventType: 'Birthday',
        startDate: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        endDate: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000),
        startTime: '10:00 AM',
        endTime: '08:00 PM',
        venue: {
          name: 'Family Home',
          address: {
            city: 'Pune',
            state: 'Maharashtra',
            country: 'India'
          }
        },
        organizer: admin._id,
        status: 'Upcoming',
        priority: 'High',
        isPublic: true
      },
      {
        title: '💒 Family Wedding',
        description: 'Celebrating the union of two wonderful families!',
        eventType: 'Wedding',
        startDate: new Date(today.getTime() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
        endDate: new Date(today.getTime() + 16 * 24 * 60 * 60 * 1000),
        startTime: '02:00 PM',
        endTime: '11:00 PM',
        venue: {
          name: 'Grand Ballroom',
          address: {
            city: 'Pune',
            state: 'Maharashtra',
            country: 'India'
          }
        },
        organizer: admin._id,
        status: 'Upcoming',
        priority: 'High',
        isPublic: true
      },
      {
        title: '🎭 Cultural Festival',
        description: 'Experience our family cultural heritage and traditions!',
        eventType: 'Cultural',
        startDate: new Date(today.getTime() + 25 * 24 * 60 * 60 * 1000), // 25 days from now
        endDate: new Date(today.getTime() + 25 * 24 * 60 * 60 * 1000),
        startTime: '06:00 PM',
        endTime: '10:00 PM',
        venue: {
          name: 'Community Hall',
          address: {
            city: 'Pune',
            state: 'Maharashtra',
            country: 'India'
          }
        },
        organizer: admin._id,
        status: 'Upcoming',
        priority: 'Medium',
        isPublic: true
      }
    ];

    // Delete existing test events
    await Event.deleteMany({ organizer: admin._id });

    // Insert new test events
    const insertedEvents = await Event.insertMany(testEvents);
    
    console.log('\n✅ Sample Events Added:');
    insertedEvents.forEach((event, index) => {
      console.log(`${index + 1}. ${event.title}`);
      console.log(`   Type: ${event.eventType}`);
      console.log(`   Date: ${event.startDate.toLocaleDateString()}`);
      console.log(`   Status: ${event.status}`);
    });

    // Verify events are retrievable
    const allEvents = await Event.find({ status: 'Upcoming' });
    console.log(`\n📊 Total Upcoming Events in DB: ${allEvents.length}`);

    console.log('\n✅ Done! Events are ready for the Scroller.');
    console.log('📝 Next: Login to the app and check the home page scroller.');
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

addTestEvents();