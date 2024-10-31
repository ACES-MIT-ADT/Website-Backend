import express from "express";
import bodyParser from "body-parser";
import { config } from "dotenv";
import {
  BannerS,
  ContactS,
  FetchData,
  GalleryS,
  LeadershipS,
  TimelineS,
} from "./service.js";
import cors from "cors";
import { database, gridfsBucket, upload } from "./DB.js";

// Create an Express application
const app = express();
const port = process.env.PORT || 5000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());
app.use(cors());

config();

// Endpoint test
app.get("/services/:collection", async (req, res) => {
  const collection = req.params.collection;
  try {
    const Document = await FetchData(collection);
    res.json(Document);
  } catch (err) {
    res.status(500).json({ message: "Error fetching users: ", error: err });
  }
});

app.post("/service/leadership", async (req, res) => {
  const { Name, Image, Position, Description, Link } = req.body;
  try {
    const Leadership = LeadershipS(Name, Image, Position, Description, Link);
    // await Leadership.save();
    res.status(201).json(Leadership);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error adding Leadership: ", error: err });
  }
});

app.post("/service/timeline", async (req, res) => {
  const { Title, Description, Year } = req.body;
  try {
    const Timeline = TimelineS(Title, Description, Year);
    // await Timeline.save();
    res.status(201).json(Timeline);
  } catch (err) {
    res.status(500).json({ message: "Error adding Timeline: ", error: err });
  }
});

app.post("/service/gallery", async (req, res) => {
  const { Image } = req.body;
  let image = "";
  // var url = "https://drive.google.com/uc?export=view&id=";
  var url = "https://drive.usercontent.google.com/download?id="; // {ID}&sz=w1000
  if (Image.startsWith("https://drive.google.com/file/d/")) {
    image = Image.split("/")[5];
    console.log(image);
    url += `${image}&sz=w1000`;
    console.log(url);
  }
  try {
    const Gallery = GalleryS(image ? url : Image);
    // await Gallery.save();
    res.status(201).json(Gallery);
  } catch (err) {
    res.status(500).json({ message: "Error adding Gallery: ", error: err });
  }
});

app.post("/service/banner", async (req, res) => {
  const { Title, Image, Description, Btext } = req.body;
  try {
    const Banner = BannerS(Title, Image, Description, Btext);
    // await Banner.save();
    res.status(201).json(Banner);
  } catch (err) {
    res.status(500).json({ message: "Error adding Banner: ", error: err });
  }
});

app.post("/service/bannernl", async (req, res) => {
  const { Title, Image, Description, Btext } = req.body;
  try {
    const BannerNL = BannerS(Title, Image, Description, Btext);
    // await BannerNL.save();
    res.status(201).json(BannerNL);
  } catch (err) {
    res.status(500).json({ message: "Error adding BannerNL: ", error: err });
  }
});

app.post("/service/contact", async (req, res) => {
  const { Name, Email, Message } = req.body;
  try {
    const Contact = ContactS(Name, Email, Message);
    // await Contact.save();
    res.status(201).json(Contact);
  } catch (err) {
    res.status(500).json({ message: "Error adding Contact: ", error: err });
  }
});

// Image Function
app.post("/service/upload", upload.single("file"), (req, res) => {
  console.log("Working ", req.file); // Log only req.file to avoid clutter
  res.json({ file: req.file });
});

// Display all files in JSON
app.get("/images", (req, res) => {
  // Query the uploads.files collection to list all files
  database.db
    .collection("uploads")
    .find()
    .toArray((err, files) => {
      if (err) {
        return res.status(500).json({ err: "Error fetching files" });
      }
      if (!files || files.length === 0) {
        return res.status(404).json({ err: "No files exist" });
      }
      return res.json(files);
    });
});

// @desc  Display single image by filename
// app.get('/image/:filename', (req, res) => {
//   gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
//     if (!file || file.length === 0) {
//       return res.status(404).json({ err: 'No file exists' });
//     }

//     // Check if image
//     if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
//       // Read output to browser
//       const readstream = gfs.createReadStream(file.filename);
//       readstream.pipe(res);
//     } else {
//       res.status(404).json({ err: 'Not an image' });
//     }
//   });
// });

// Basic error handler for any unhandled errors
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(500).send("Something broke!");
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
