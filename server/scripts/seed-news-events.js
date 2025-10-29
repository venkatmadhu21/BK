const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });
const User = require('../models/User');
const News = require('../models/News');
const Event = require('../models/Event');

const seedNewsAndEvents = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/bal-krishna-nivas';
    console.log(`Attempting to connect to MongoDB at: ${mongoURI}`);
    
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ MongoDB Connected Successfully');

    // Get a user to use as author/organizer
    let user = await User.findOne();
    if (!user) {
      console.log('⚠️ No users found, creating a default admin user...');
      user = await User.create({
        name: 'Rajesh Gogte',
        email: 'rajesh@example.com',
        password: 'hashed_password_here',
        role: 'admin'
      });
      console.log('✅ Default user created');
    }
    
    const userId = user._id;
    console.log(`Using user: ${user.name} (${userId})`);

    // Clear existing data
    await News.deleteMany({});
    await Event.deleteMany({});
    console.log('🗑️ Cleared existing News and Events');

    // Sample News Data
    const newsArticles = [
      {
        title: 'Annual Family Reunion 2024 Announced',
        content: 'Join us for our biggest family gathering of the year with exciting activities and cultural performances. This year promises to be more vibrant than ever with special performances, traditional games, and a grand feast.',
        summary: 'Join us for our biggest family gathering of the year with exciting activities and cultural performances.',
        author: userId,
        category: 'Announcement',
        priority: 'High',
        tags: ['reunion', 'family', 'celebration', '2024'],
        isPublished: true,
        publishDate: new Date('2024-01-15'),
        images: [{
          url: 'https://via.placeholder.com/800x400?text=Family+Reunion',
          thumbnail: 'https://via.placeholder.com/200x200?text=Reunion',
          caption: 'Family Reunion 2024'
        }],
        views: 45
      },
      {
        title: 'Sharma Family Celebrates 50th Wedding Anniversary',
        content: 'The Sharma family joyously celebrated the golden jubilee of their parents\' marriage. The event was attended by all family members and close relatives.',
        summary: 'The Sharma family joyously celebrated the golden jubilee of their parents\' marriage.',
        author: userId,
        category: 'Celebration',
        priority: 'High',
        tags: ['anniversary', 'milestone', 'celebration'],
        isPublished: true,
        publishDate: new Date('2024-01-10'),
        images: [{
          url: 'https://via.placeholder.com/800x400?text=Anniversary',
          thumbnail: 'https://via.placeholder.com/200x200?text=Anniversary',
          caption: 'Golden Jubilee Celebration'
        }],
        views: 38
      },
      {
        title: 'New Family Member Joins Our Tree',
        content: 'We are delighted to announce the arrival of a new member in our family. This wonderful addition brings joy and new energy to our family circle.',
        summary: 'We are delighted to announce the arrival of a new member in our family.',
        author: userId,
        category: 'Announcement',
        priority: 'Medium',
        tags: ['newborn', 'announcement', 'joy'],
        isPublished: true,
        publishDate: new Date('2024-01-08'),
        views: 52
      },
      {
        title: 'Family Educational Achievement Milestone',
        content: 'Congratulations to our youngest generation on their remarkable academic achievements. Multiple family members have excelled in their respective fields this year.',
        summary: 'Congratulations to our youngest generation on their remarkable academic achievements.',
        author: userId,
        category: 'Achievement',
        priority: 'Medium',
        tags: ['education', 'achievement', 'success'],
        isPublished: true,
        publishDate: new Date('2024-01-05'),
        views: 31
      },
      {
        title: 'Remembering Our Ancestors',
        content: 'Today we take a moment to honor the memory of our ancestors who laid the foundation for our family legacy. Their contributions continue to inspire us.',
        summary: 'Today we take a moment to honor the memory of our ancestors.',
        author: userId,
        category: 'Memorial',
        priority: 'High',
        tags: ['memorial', 'ancestors', 'legacy'],
        isPublished: true,
        publishDate: new Date('2024-01-02'),
        views: 28
      }
    ];

    // Sample Events Data
    const events = [
      {
        title: 'Diwali Celebration 2024',
        description: 'Join us for a grand Diwali celebration with traditional rituals, cultural performances, and a community feast. Families are welcome to bring dishes from their regional cuisines.',
        eventType: 'Festival',
        startDate: new Date('2024-11-12'),
        endDate: new Date('2024-11-13'),
        startTime: '18:00',
        endTime: '23:00',
        venue: {
          name: 'Community Hall',
          address: {
            street: '123 Temple Street',
            city: 'Mumbai',
            state: 'Maharashtra',
            pincode: '400001',
            country: 'India'
          },
          coordinates: {
            latitude: 19.0760,
            longitude: 72.8777
          }
        },
        organizer: userId,
        priority: 'High',
        status: 'Upcoming',
        maxAttendees: 100,
        isPublic: true,
        images: [{
          url: 'https://via.placeholder.com/800x400?text=Diwali+Celebration',
          thumbnail: 'https://via.placeholder.com/200x200?text=Diwali',
          caption: 'Diwali 2024'
        }],
        attendees: [],
        requirements: [
          { item: 'Decorations', isRequired: true },
          { item: 'Food Arrangements', isRequired: true },
          { item: 'Entertainment Setup', isRequired: true }
        ]
      },
      {
        title: 'Family Holi Celebration',
        description: 'Welcome the colors of spring with our traditional Holi celebration. Come celebrate the festival of colors with fun games, traditional sweets, and family bonding.',
        eventType: 'Festival',
        startDate: new Date('2024-03-25'),
        endDate: new Date('2024-03-25'),
        startTime: '10:00',
        endTime: '18:00',
        venue: {
          name: 'Central Park Grounds',
          address: {
            street: '456 Park Avenue',
            city: 'Bangalore',
            state: 'Karnataka',
            pincode: '560001',
            country: 'India'
          },
          coordinates: {
            latitude: 12.9716,
            longitude: 77.5946
          }
        },
        organizer: userId,
        priority: 'High',
        status: 'Upcoming',
        maxAttendees: 75,
        isPublic: true,
        images: [{
          url: 'https://via.placeholder.com/800x400?text=Holi+Celebration',
          thumbnail: 'https://via.placeholder.com/200x200?text=Holi',
          caption: 'Holi Festival'
        }],
        attendees: [],
        requirements: [
          { item: 'Colors and Gulal', isRequired: true },
          { item: 'Traditional Sweets', isRequired: true }
        ]
      },
      {
        title: 'Family Reunion BBQ & Picnic',
        description: 'Enjoy a casual outdoor gathering with family members. Bring your loved ones for games, food, and memorable moments. All ages welcome!',
        eventType: 'Reunion',
        startDate: new Date('2024-06-15'),
        endDate: new Date('2024-06-15'),
        startTime: '11:00',
        endTime: '17:00',
        venue: {
          name: 'Riverside Park',
          address: {
            street: '789 Riverside Road',
            city: 'Delhi',
            state: 'Delhi',
            pincode: '110001',
            country: 'India'
          },
          coordinates: {
            latitude: 28.7041,
            longitude: 77.1025
          }
        },
        organizer: userId,
        priority: 'Medium',
        status: 'Upcoming',
        maxAttendees: 150,
        isPublic: true,
        attendees: [],
        requirements: [
          { item: 'BBQ Setup', isRequired: true },
          { item: 'Seating Arrangements', isRequired: true },
          { item: 'Games & Activities', isRequired: true }
        ]
      },
      {
        title: 'Wedding Celebration - Sharma Family',
        description: 'The Sharma family warmly invites you to the wedding celebration of their children. Join us for a traditional ceremony followed by a grand reception with music and dance.',
        eventType: 'Wedding',
        startDate: new Date('2024-07-20'),
        endDate: new Date('2024-07-21'),
        startTime: '17:00',
        endTime: '23:59',
        venue: {
          name: 'Grand Palace Convention Center',
          address: {
            street: '321 Palace Street',
            city: 'Pune',
            state: 'Maharashtra',
            pincode: '411001',
            country: 'India'
          },
          coordinates: {
            latitude: 18.5204,
            longitude: 73.8567
          }
        },
        organizer: userId,
        priority: 'High',
        status: 'Upcoming',
        maxAttendees: 200,
        isPublic: true,
        attendees: [],
        requirements: [
          { item: 'Venue Decoration', isRequired: true },
          { item: 'Catering', isRequired: true },
          { item: 'Invitation Cards', isRequired: true },
          { item: 'Photography/Videography', isRequired: true }
        ]
      },
      {
        title: 'Monthly Family Get-together',
        description: 'Our regular monthly gathering to catch up, share stories, and strengthen family bonds. Light refreshments will be served.',
        eventType: 'Other',
        startDate: new Date('2024-02-10'),
        endDate: new Date('2024-02-10'),
        startTime: '19:00',
        endTime: '21:00',
        venue: {
          name: 'Family Community Center',
          address: {
            street: '555 Family Lane',
            city: 'Hyderabad',
            state: 'Telangana',
            pincode: '500001',
            country: 'India'
          },
          coordinates: {
            latitude: 17.3850,
            longitude: 78.4867
          }
        },
        organizer: userId,
        priority: 'Low',
        status: 'Upcoming',
        maxAttendees: 50,
        isPublic: true,
        attendees: [],
        requirements: [
          { item: 'Refreshments', isRequired: false }
        ]
      }
    ];

    // Insert News
    const createdNews = await News.insertMany(newsArticles);
    console.log(`✅ Added ${createdNews.length} news articles`);

    // Insert Events
    const createdEvents = await Event.insertMany(events);
    console.log(`✅ Added ${createdEvents.length} events`);

    // Verify the data
    const newsCount = await News.countDocuments();
    const eventCount = await Event.countDocuments();
    console.log(`\n📊 Database Status:`);
    console.log(`   News Articles: ${newsCount}`);
    console.log(`   Events: ${eventCount}`);
    
    console.log('\n✨ Seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

// Run the seeding
seedNewsAndEvents();