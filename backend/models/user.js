import { Schema, model } from "mongoose";
const { MAX_LOGIN_FAIL_ATTEMPT = 5 } = process.env;
import { generateKey } from "../utilities/general.js";
import { mongoose } from "../middlewares/dbhandler.js";

const { ObjectId } = mongoose.Types;

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      maxLength: 200,
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      maxLength: 200,
      lowercase: true,
    },

    active: {
      type: Boolean,
      default: true,
    },

    activationMessage: {
      type: String,
      lowercase: true,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
      maxLength: 200,
    },

    password: {
      type: String,
      required: true,
      maxLength: 1000,
    },

    gender: {
      type: String,
      enum: ["male", "female"],
      default: "male",
    },
    state: {
      type: String,
      required: true,
      lowercase: true,
    },
    role: {
      type: String,
      enum: ["admin", "user", "super"],
      default: "user",
    },

    emailVerified: {
      type: Boolean,
      default: false,
    },
    lastLogin: {
      type: Date,
      default: Date.now(),
    },
    loginFailAttempt: {
      type: Number,
      max: MAX_LOGIN_FAIL_ATTEMPT,
      default: 0,
    },
    lastFailedLogin: {
      type: Date,
      default: Date.now(),
    },

    createdAt: {
      type: Date,
      immutable: true,
      default: Date.now(),
    },

    updatedAt: {
      type: Date,
      default: Date.now(),
    },

    passCode: {
      type: String,
      maxLength: 4,
      default: "0000",
    },
    address: {
      type: String,
      required: true,
    },

    contact: {
      type: Number,
      default: 0,
    },

    storage: {
      contactList: [ObjectId],
      default: {
        contactList: [],
      },
    },
  },
  {
    timestamps: true,
  },
);

// all written by sadiq manually not ai
// indexing add speed and queries fast
UserSchema.index({ email: 1 });
UserSchema.index({ createdAt: -1 });
UserSchema.index({ name: 1 });

export default model("simplebusinesswebsiteuser", UserSchema);
