const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });

// Import the News model
const News = require('../models/News');

// Connect to MongoDB
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/bal-krishna-nivas';
    console.log(`Attempting to connect to MongoDB at: ${mongoURI}`);
    
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('MongoDB Connected Successfully');
    
    // Log the database name to confirm we're connected to the right database
    const dbName = mongoose.connection.db.databaseName;
    console.log(`Connected to database: ${dbName}`);
    
    // Log the collections to confirm the news collection exists
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));
    
    // Check if there are any news records in the database
    const count = await News.countDocuments();
    console.log(`Number of news records in the database: ${count}`);
    
    if (count > 0) {
      // Get all news records
      const allNews = await News.find({})
        .populate('author', 'firstName lastName email')
        .sort({ createdAt: -1 });

      console.log('\n=== ALL NEWS RECORDS ===\n');

      allNews.forEach((news, index) => {
        console.log(`--- News Record ${index + 1} ---`);
        console.log(`ID: ${news._id}`);
        console.log(`Title: ${news.title}`);
        console.log(`Category: ${news.category}`);
        console.log(`Priority: ${news.priority}`);
        console.log(`Published: ${news.isPublished ? 'Yes' : 'No'}`);
        console.log(`Publish Date: ${news.publishDate ? new Date(news.publishDate).toLocaleString() : 'Not set'}`);
        console.log(`Author: ${news.author ? `${news.author.firstName} ${news.author.lastName}` : 'Unknown'}`);
        console.log(`Summary: ${news.summary || 'No summary'}`);
        console.log(`Content: ${news.content ? news.content.substring(0, 100) + '...' : 'No content'}`);
        console.log(`Tags: ${news.tags ? news.tags.join(', ') : 'No tags'}`);
        console.log(`Images: ${news.images ? news.images.length : 0} image(s)`);
        console.log(`Likes: ${news.likes ? news.likes.length : 0}`);
        console.log(`Comments: ${news.comments ? news.comments.length : 0}`);
        console.log(`Views: ${news.views || 0}`);
        console.log(`Created: ${new Date(news.createdAt).toLocaleString()}`);
        console.log(`Updated: ${new Date(news.updatedAt).toLocaleString()}`);
        
        // Show image details if any
        if (news.images && news.images.length > 0) {
          console.log('\nImages:');
          news.images.forEach((image, imgIndex) => {
            console.log(`  Image ${imgIndex + 1}:`);
            console.log(`    URL: ${image.url ? image.url.substring(0, 50) + '...' : 'No URL'}`);
            console.log(`    Thumbnail: ${image.thumbnail ? image.thumbnail.substring(0, 50) + '...' : 'No thumbnail'}`);
            console.log(`    Caption: ${image.caption || 'No caption'}`);
          });
        }
        
        console.log('\n' + '='.repeat(50) + '\n');
      });

      // Summary statistics
      console.log('=== SUMMARY STATISTICS ===');
      console.log(`Total Records: ${allNews.length}`);
      console.log(`Published: ${allNews.filter(n => n.isPublished).length}`);
      console.log(`Drafts: ${allNews.filter(n => !n.isPublished).length}`);
      
      const categories = {};
      allNews.forEach(news => {
        categories[news.category] = (categories[news.category] || 0) + 1;
      });
      console.log('\nRecords by Category:');
      Object.entries(categories).forEach(([category, count]) => {
        console.log(`  ${category}: ${count}`);
      });

      const priorities = {};
      allNews.forEach(news => {
        priorities[news.priority] = (priorities[news.priority] || 0) + 1;
      });
      console.log('\nRecords by Priority:');
      Object.entries(priorities).forEach(([priority, count]) => {
        console.log(`  ${priority}: ${count}`);
      });

      const totalImages = allNews.reduce((sum, news) => sum + (news.images ? news.images.length : 0), 0);
      const totalLikes = allNews.reduce((sum, news) => sum + (news.likes ? news.likes.length : 0), 0);
      const totalComments = allNews.reduce((sum, news) => sum + (news.comments ? news.comments.length : 0), 0);
      const totalViews = allNews.reduce((sum, news) => sum + (news.views || 0), 0);

      console.log('\nEngagement Statistics:');
      console.log(`  Total Images: ${totalImages}`);
      console.log(`  Total Likes: ${totalLikes}`);
      console.log(`  Total Comments: ${totalComments}`);
      console.log(`  Total Views: ${totalViews}`);

    } else {
      console.log('No news records found in the database.');
    }
    
  } catch (error) {
    console.error('Database connection error:', error.message);
    console.error('Full error:', error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};

// Run the function
connectDB();

