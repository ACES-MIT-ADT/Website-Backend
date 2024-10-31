import mongoose from "mongoose";
import { config } from "dotenv";
import multer from "multer";
import crypto from "crypto";
import path from "path";
import { GridFsStorage } from "multer-gridfs-storage";
import { MongoClient, GridFSBucket } from "mongodb";

// Load environment variables from .env file
config();

// MongoDB connection URI from environment variables
const uri = process.env.MONGODB_URL;

// Create a new Mongoose connection
mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

const database = mongoose.connection.useDb("Test");

// Init gfs
let gfs;
let gridfsBucket;
database.once("open", () => {
  // Initialize GridFSBucket
  gridfsBucket = new GridFSBucket(database.db, {
    bucketName: "uploads",
  });
});

// Image Storage
const storage = new GridFsStorage({
  url: uri,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString("hex") + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: "uploads",
        };
        resolve(fileInfo);
      });
    });
  },
});

const upload = multer({ storage });

// Define the schema for storing images
const LeadershipSchema = new mongoose.Schema({
  Name: String,
  Image: String,
  Position: String,
  Description: String,
  Link: Array,
  uploadedAt: { type: Date, default: Date.now },
});

// Define the schema for form submissions
const TimelineSchema = new mongoose.Schema({
  Title: String,
  Description: String,
  Year: String,
  submittedAt: { type: Date, default: Date.now },
});

const GallerySchema = new mongoose.Schema({
  Image: String,
});

const BannerSchema = new mongoose.Schema({
  Title: String,
  Image: String,
  Description: String,
  BText: String,
  uploadedAt: { type: Date, default: Date.now },
});

const BannerNLSchema = new mongoose.Schema({
  Title: String,
  Image: String,
  Description: String,
  BText: String,
  uploadedAt: { type: Date, default: Date.now },
});

const ContactSchema = new mongoose.Schema({
  Name: String,
  Email: String,
  Message: String,
  uploadedAt: { type: Date, default: Date.now },
});

// Create models for the schemas
const LeadershipModel = database.model("Leadership", LeadershipSchema);
const TimelineModel = database.model("Timeline", TimelineSchema);
const GalleryModel = database.model("Gallery", GallerySchema);
const BannerModel = database.model("Banner", BannerSchema);
const BannerNLModel = database.model("BannerNL", BannerNLSchema);
const ContactModel = database.model("Contact", ContactSchema);

// Export the database connection and models
export {
  mongoose,
  database,
  LeadershipModel,
  TimelineModel,
  GalleryModel,
  BannerModel,
  BannerNLModel,
  ContactModel,
  upload,
  gridfsBucket,
};
