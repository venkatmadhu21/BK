const mongoose = require('mongoose');
require('dotenv').config();

const News = require('./server/models/News');
const Event = require('./server/models/Event');

async function checkData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Count documents
    const newsCount = await News.countDocuments();
    const eventCount = await Event.countDocuments();
    
    const publishedNewsCount = await News.countDocuments({ isPublished: true });
    
    console.log('\n📊 DATABASE STATISTICS:');
    console.log('========================');
    console.log(`Total News Items: ${newsCount}`);
    console.log(`Published News Items: ${publishedNewsCount}`);
    console.log(`Total Events: ${eventCount}`);

    // Get sample data
    if (newsCount > 0) {
      console.log('\n📰 SAMPLE NEWS (First 3):');
      console.log('========================');
      const news = await News.find().limit(3);
      news.forEach((n, i) => {
        console.log(`${i + 1}. Title: ${n.title}`);
        console.log(`   Published: ${n.isPublished}`);
        console.log(`   Date: ${n.publishDate}`);
        console.log(`   Content: ${n.content.substring(0, 100)}...`);
        console.log('---');
      });
    } else {
      console.log('\n❌ NO NEWS ITEMS IN DATABASE');
    }

    if (eventCount > 0) {
      console.log('\n📅 SAMPLE EVENTS (First 3):');
      console.log('========================');
      const events = await Event.find().limit(3);
      events.forEach((e, i) => {
        console.log(`${i + 1}. Title: ${e.title}`);
        console.log(`   Type: ${e.eventType}`);
        console.log(`   Start Date: ${e.startDate}`);
        console.log(`   Status: ${e.status}`);
        console.log('---');
      });
    } else {
      console.log('\n❌ NO EVENTS IN DATABASE');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

checkData();