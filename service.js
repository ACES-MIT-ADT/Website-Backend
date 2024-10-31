import {
  LeadershipModel,
  TimelineModel,
  GalleryModel,
  BannerModel,
  BannerNLModel,
  ContactModel,
  database,
} from "./DB.js";

// Function to add an image
async function LeadershipS(Name, Image, Position, Description, Link) {
  try {
    const LS = new LeadershipModel({
      Name,
      Image,
      Position,
      Description,
      Link,
    });
    await LS.save();
    console.log("Leadership Collection added successfully");
  } catch (err) {
    console.error("Error adding Leadership Collection:", err);
  }
}

// Function to add a form submission
async function TimelineS(Title, Description, Year) {
  try {
    const TS = new TimelineModel({ Title, Description, Year });
    await TS.save();
    console.log("Timeline collection added successfully");
  } catch (err) {
    console.error("Error adding Timeline collection: ", err);
  }
}

async function GalleryS(Image) {
  try {
    const TS = new GalleryModel({ Image });
    await TS.save();
    console.log("Gallery collection added successfully");
  } catch (err) {
    console.error("Error adding Gallery collection: ", err);
  }
}

async function BannerS(Title, Image, Description, BText) {
  try {
    const TS = new BannerModel({ Title, Image, Description, BText });
    await TS.save();
    console.log("BannerModel collection added successfully");
  } catch (err) {
    console.error("Error adding BannerModel collection: ", err);
  }
}

async function BannerNLS(Title, Image, Description, BText) {
  try {
    const TS = new BannerNLModel({ Title, Image, Description, BText });
    await TS.save();
    console.log("BannerNL collection added successfully");
  } catch (err) {
    console.error("Error adding BannerNL collection: ", err);
  }
}

async function ContactS(Name, Email, Message) {
  try {
    const TS = new ContactModel({ Name, Email, Message });
    await TS.save();
    console.log("Contact collection added successfully");
  } catch (err) {
    console.error("Error adding Contact collection: ", err);
  }
}

// Read Data

const FetchData = async (col) => {
  try {
    const Col = database.collection(col);
    let doc = await Col.find().toArray();
    return doc;
  } catch (err) {
    console.log("Error In Fetch : ", err);
  }
};

export {
  LeadershipS,
  TimelineS,
  GalleryS,
  BannerS,
  BannerNLS,
  ContactS,
  FetchData,
};
