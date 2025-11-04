const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

const app = express();

// Middleware
app.use(cors());
// Increase JSON body limit to support base64 profile pictures
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.use("/api/family", require("./routes/familyRoutes"));
app.use("/api/news", require("./routes/news"));
app.use("/api/events", require("./routes/events"));
app.use("/api/media", require("./routes/media"));
app.use("/api/admin", require("./routes/admin"));
// app.use("/api/upload", require("./routes/upload")); // TODO: Create upload.js or use gallery endpoints
app.use("/api/legacy-family", require("./routes/family"));

// Development routes
if (process.env.NODE_ENV !== "production") {
  app.use("/api/seed", require("./routes/seed"));
}

// Serve static assets in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client", "build", "index.html"));
  });
}

// MongoDB Connection
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/bal-krishna-nivas";
    console.log(`Attempting to connect to MongoDB at: ${mongoURI}`);

    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("MongoDB Connected Successfully");

    // Log the database name to confirm we're connected to the right database
    const dbName = mongoose.connection.db.databaseName;
    console.log(`Connected to database: ${dbName}`);

    // Log the collections to confirm the familymembers collection exists
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log("Available collections:", collections.map((c) => c.name));
  } catch (error) {
    console.error("Database connection error:", error.message);
    console.error("Full error:", error);
    process.exit(1);
  }
};

connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});