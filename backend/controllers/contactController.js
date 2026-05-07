// controllers/contactController.js
import Contact from "../models/contact.js";
import User from "../models/user.js";
import { sendMail } from "../services/mail.js";
import { sanitizeInput } from "../utilities/general.js";
import { log } from "../middlewares/logger.js";

export const contactController = {
  // Submit support ticket (public)
  async submitSupport(req, res, next) {
    try {
      for (const field in req.body) {
        req.body[field] = sanitizeInput(req.body[field]);
        if (!req.body[field]) throw new req.AppError("invalid request data!");
      }

      const { email, subject, issue, message, priority } = req.body;

      if (!email.includes("@")) throw new req.AppError("invalid email!!");

      const contact = await Contact.create(req.body);

      if (contact) {
        res.status(201).json({
          success: true,
          message: "We received your email, we will review it shortly, fix the issues and notify you, thank you 🙏",
        });

        return sendMail({
          subject,
          template: "message",
          title: `${subject} - ${issue} - ${priority}`,
          description: `${message} <br> <br> <strong> sent by ${email}, contact id for more details ${contact._id}`,
        });
      } else {
        return res.status(500).json({ success: false, message: "something went wrong please try again!" });
      }
    } catch (er) {
      log(er);
      req.err = er;
      next();
    }
  },

  // Get contacts with pagination and filters
  async getHistory(req, res, next) {
    try {
      const {
        page = 1,
        limit = 20,
        from,
        flag,
        seen,
        dateFrom,
        search,
      } = req.query;

      for (const field in req.query) {
        if (field !== "limit" && field !== "page")
          req.query[field] = sanitizeInput(req.query[field]);
      }

      const query = {};
      const skip = (parseInt(page) - 1) * parseInt(limit);

      // Apply filters
      if (from) query.from = from;
      if (flag) query.flag = flag;
      if (seen !== undefined) query.seen = seen === "true";
      if (dateFrom) query.createdAt = { $gte: new Date(dateFrom) };

      // Search filter
      if (search) {
        const searchRegex = new RegExp(search, "i");
        query.$or = [
          { title: searchRegex },
          { description: searchRegex },
          { email: searchRegex },
          { name: searchRegex }
        ];
      }

      // Get contacts
      const contacts = await Contact.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .select("-__v")
        .lean();

      // Get total for pagination
      const total = await Contact.countDocuments(query);
      const totalPages = Math.ceil(total / parseInt(limit));

      res.status(200).json({
        success: true,
        data: {
          contacts,
          pagination: {
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages,
            hasNext: page < totalPages,
            hasPrev: page > 1,
          },
        },
      });
    } catch (error) {
      req.err = error;
      next();
    }
  },

  // Get single contact by ID
  async getContactById(req, res, next) {
    try {
      const { id } = req.params;
      
      const contact = await Contact.findById(id).select("-__v").lean();
      
      if (!contact) {
        return res.status(404).json({
          success: false,
          message: "Contact not found",
        });
      }
      
      res.status(200).json({
        success: true,
        data: { contact },
      });
    } catch (error) {
      req.err = error;
      next();
    }
  },

  // Mark contact as seen
  async markAsSeen(req, res, next) {
    try {
      const { contactId } = req.body;

      if (typeof contactId !== "string") {
        throw new req.AppError("invalid contact id!!");
      }

      if (!contactId) {
        return res.status(400).json({
          success: false,
          message: "contact ID is required",
        });
      }

      // Update contact
      const contact = await Contact.findOneAndUpdate(
        { _id: contactId },
        { seen: true },
        { new: true }
      ).select("-__v").lean();

      if (!contact) {
        return res.status(404).json({
          success: false,
          message: "contact not found",
        });
      }

      res.status(200).json({
        success: true,
        data: { contact },
      });

      // Update user contact count
      return await User.findByIdAndUpdate(
        { _id: req.user._id, contact: { $gte: 1 } },
        { $inc: { contact: -1 } }
      );
    } catch (error) {
      console.log(error);
      req.err = error;
      next();
    }
  },

  // Mark all contacts as seen
  async markAllAsSeen(req, res, next) {
    try {
      // Update all unseen contacts
      const result = await Contact.updateMany(
        { seen: false },
        { seen: true }
      );

      await User.findByIdAndUpdate(req.user._id, {
        $set: { contact: 0 },
      });

      res.status(200).json({
        success: true,
        data: {
          modifiedCount: result.modifiedCount,
        },
      });
    } catch (error) {
      req.err = error;
      next();
    }
  },

  // Delete old contacts
  async deleteOldContacts(req, res, next) {
    try {
      const { days = 30 } = req.query;
      const daysNum = parseInt(days);

      if (daysNum < 1) {
        return res.status(400).json({
          success: false,
          message: "Days must be at least 1",
        });
      }

      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysNum);

      const query = {
        createdAt: { $lt: cutoffDate },
      };

      const count = await Contact.countDocuments(query);
      const result = await Contact.deleteMany(query);

      res.status(200).json({
        success: true,
        message: `Deleted ${result.deletedCount} contact older than ${daysNum} days`,
        data: {
          deletedCount: result.deletedCount,
          matchedCount: count,
          cutoffDate,
          days: daysNum,
        },
      });
    } catch (er) {
      req.err = er;
      next();
    }
  },
};