import mongoose from "mongoose";

const { NODE_ENV = "development" } = process.env;

const DB_URI =
  NODE_ENV == "development" ? process.env.LOCAL_DB_URI : process.env.DB_URI;

let cachedDb = null;

const dbHandler = async (req, res, next) => {
  /*  if (cachedDb) {
    console.log('using existing db connection')
    return next()
  }*/

  try {
    req.dbConnected = false;
    await mongoose.connect(DB_URI, {
      serverSelectionTimeoutMS: 5000, // Optional: faster error for debugging
    });
    cachedDb = mongoose.connection;
    if (req) req.dbConnected = true;
    console.log("using New DB Connection");
    if (next) return next();
  } catch (error) {
    console.error("Mongo connect Error:", error);
    res.json({
      message: "a slight issue occured, please try again 🙏",
      success: false,
    });
  }
};

export { dbHandler, DB_URI, mongoose };
