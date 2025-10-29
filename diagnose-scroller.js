const mongoose = require('mongoose');
require('dotenv').config();

const diagnoseScroller = async () => {
  try {
    console.log('\n🔍 SCROLLER DIAGNOSTIC TOOL\n');
    console.log('═'.repeat(50));

    // 1. MongoDB Connection
    console.log('\n1️⃣  Testing MongoDB Connection...');
    try {
      await mongoose.connect(process.env.MONGO_URI);
      console.log('   ✅ MongoDB Connected');
    } catch (err) {
      console.log('   ❌ MongoDB Connection Failed');
      console.log(`   Error: ${err.message}`);
      process.exit(1);
    }

    // 2. Check News Collection
    console.log('\n2️⃣  Checking News Collection...');
    const News = require('./server/models/News');
    const newsCount = await News.countDocuments();
    const publishedNewsCount = await News.countDocuments({ isPublished: true });
    
    console.log(`   Total News: ${newsCount}`);
    console.log(`   Published News (isPublished: true): ${publishedNewsCount}`);
    
    if (publishedNewsCount > 0) {
      const sample = await News.findOne({ isPublished: true });
      console.log(`   ✅ Sample News:`);
      console.log(`      - Title: ${sample.title}`);
      console.log(`      - Has content: ${!!sample.content}`);
      console.log(`      - Published Date: ${sample.publishDate}`);
    } else {
      console.log('   ⚠️  No published news found!');
    }

    // 3. Check Events Collection
    console.log('\n3️⃣  Checking Events Collection...');
    const Event = require('./server/models/Event');
    const eventCount = await Event.countDocuments();
    const upcomingEventCount = await Event.countDocuments({ status: 'Upcoming' });
    
    console.log(`   Total Events: ${eventCount}`);
    console.log(`   Upcoming Events (status: 'Upcoming'): ${upcomingEventCount}`);
    
    if (upcomingEventCount > 0) {
      const sample = await Event.findOne({ status: 'Upcoming' });
      console.log(`   ✅ Sample Event:`);
      console.log(`      - Title: ${sample.title}`);
      console.log(`      - Type: ${sample.eventType}`);
      console.log(`      - Has description: ${!!sample.description}`);
      console.log(`      - Start Date: ${sample.startDate}`);
      console.log(`      - Status: ${sample.status}`);
    } else {
      console.log('   ⚠️  No upcoming events found!');
    }

    // 4. Check API Endpoints
    console.log('\n4️⃣  Checking API Configuration...');
    console.log('   News API: GET /api/news');
    console.log('   - Filters by: isPublished = true');
    console.log('   - Returns: news collection with content field');
    console.log('   Events API: GET /api/events');
    console.log('   - Filters by: status = "Upcoming"');
    console.log('   - Returns: events collection with description field');

    // 5. Check Scroller Component
    console.log('\n5️⃣  Scroller Component Configuration...');
    console.log('   News Display: Blue badge 📰');
    console.log('   - Uses field: content (or summary as fallback)');
    console.log('   - Date field: publishDate');
    console.log('   Events Display: Purple badge 📅');
    console.log('   - Uses field: description');
    console.log('   - Date field: startDate');

    // 6. Summary and Recommendations
    console.log('\n' + '═'.repeat(50));
    console.log('\n📊 SUMMARY:\n');

    const newsReady = publishedNewsCount > 0;
    const eventsReady = upcomingEventCount > 0;

    if (newsReady && eventsReady) {
      console.log('✅ SCROLLER IS READY!');
      console.log('   - News: Ready to display');
      console.log('   - Events: Ready to display');
      console.log('\n💡 Next Steps:');
      console.log('   1. Start backend: npm run server');
      console.log('   2. Start frontend: cd client && npm start');
      console.log('   3. Login to the app');
      console.log('   4. Go to Home page and check Scroller at top');
    } else {
      console.log('⚠️  SCROLLER NEEDS DATA!\n');
      
      if (!newsReady) {
        console.log('❌ No published news found');
        console.log('   Run: node add-test-events.js (also creates sample news)\n');
      }
      
      if (!eventsReady) {
        console.log('❌ No upcoming events found');
        console.log('   Run: node add-test-events.js\n');
      }
    }

    console.log('\n═'.repeat(50) + '\n');
    
    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Diagnostic Error:', error.message);
    process.exit(1);
  }
};

diagnoseScroller();