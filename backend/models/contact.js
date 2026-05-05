import { Schema, model , ObjectId} from "mongoose";

const Contact = new Schema({
  title: {
    type: String,
    required: true,
    maxLength: 200
  },
  for: {
    type: String,
    enum: ["single", "all"],
    default: "single"
  },
  description: {
    type: String, 
    required: true
  },
  createdAt: {
    type: Date,
    default: () => Date.now(),
    immutable: true
  },
  data: {
    type: Object,
  },
  flag: {
    type: String,
    enum: ['normal', 'info', 'warning', 'urgent'],
    default: "normal"
  },
  from: {
    type: String,
    enum: ['system', 'api', 'provider'],
    default: 'system'
  },
  seen: {
    type: Boolean,
    default: false
  }
})

export default model("simplebusinessusercontact", Contact)