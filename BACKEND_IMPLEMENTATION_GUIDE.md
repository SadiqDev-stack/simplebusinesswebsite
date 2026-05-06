# Backend API Implementation Guide

This guide shows you exactly what backend endpoints need to be implemented or updated for the frontend to work properly.

## Overview

Your frontend makes requests to these endpoints:

```
GET  /api/user/profile              ← NEEDS IMPLEMENTATION
POST /api/user/login                ✅ Already exists
POST /api/user/logout               ✅ Already exists

POST /api/contact/support           ✅ Already exists
GET  /api/contact/history           ← NEEDS IMPLEMENTATION
GET  /api/contact/:id               ← NEEDS IMPLEMENTATION
PATCH /api/contact/:id/read         ← NEEDS IMPLEMENTATION
PATCH /api/contact/:id/flag         ← NEEDS IMPLEMENTATION

POST /api/assistant                 ✅ Already exists
```

## Detailed Endpoint Specifications

### 1. GET /api/user/profile

**Purpose**: Get logged-in user's profile (for auto-login verification)

**Auth**: Required (token in cookie)

**Response**:
```javascript
{
  success: true,
  user: {
    _id: "userId",
    name: "Admin Name",
    email: "admin@email.com",
    phone: "234xxxxx",
    role: "super" | "user"
  }
}
```

**Error Response**:
```javascript
{
  success: false,
  message: "Unauthorized"
}
```

---

### 2. GET /api/contact/history

**Purpose**: Get all contacts with pagination, search, and filters

**Auth**: Required (token in cookie)

**Query Parameters**:
```
page: number (1-based, default: 1)
limit: number (items per page, default: 10)
search: string (search in email, subject, message - optional)
flag: string (important|followup|resolved - optional)
priority: string (low|medium|high - optional)
```

**Example Request**:
```
GET /api/contact/history?page=1&limit=10&search=email&flag=important&priority=high
```

**Response**:
```javascript
{
  success: true,
  contacts: [
    {
      _id: "contactId",
      name: "John Doe",
      email: "john@example.com",
      phone: "+234xxx",
      subject: "Order Inquiry",
      issue: "Product Question",
      message: "I want to know about your caps...",
      priority: "medium",
      flag: "default" | "important" | "followup" | "resolved",
      seen: false,
      createdAt: "2024-05-06T10:30:00Z",
      updatedAt: "2024-05-06T10:30:00Z"
    }
    // ... more contacts
  ],
  totalPages: 5,
  total: 47,
  page: 1,
  limit: 10
}
```

**Implementation Notes**:
- Implement search using regex/contains on email, subject, message
- Filter by flag and priority if provided
- Return total count and total pages
- Sort by createdAt descending (newest first)
- Only return user's contacts (if user-specific)

---

### 3. GET /api/contact/:id

**Purpose**: Get full details of a single contact

**Auth**: Required (token in cookie)

**URL Parameter**: `:id` - MongoDB ObjectId of contact

**Response**:
```javascript
{
  success: true,
  contact: {
    _id: "contactId",
    name: "John Doe",
    email: "john@example.com",
    phone: "+234xxx",
    subject: "Order Inquiry",
    issue: "Product Question",
    message: "I want to know about your caps and bulk orders...",
    priority: "high",
    flag: "important",
    seen: true,
    createdAt: "2024-05-06T10:30:00Z",
    updatedAt: "2024-05-06T11:00:00Z"
  }
}
```

**Error Response**:
```javascript
{
  success: false,
  message: "Contact not found"
}
```

---

### 4. PATCH /api/contact/:id/read

**Purpose**: Mark a contact as read/unread

**Auth**: Required (token in cookie)

**URL Parameter**: `:id` - MongoDB ObjectId of contact

**Request Body**:
```javascript
{
  // No body needed - toggle current state
  // Or send: { seen: true } to explicitly set
}
```

**Response**:
```javascript
{
  success: true,
  contact: {
    _id: "contactId",
    // ... contact data
    seen: true,
    updatedAt: "2024-05-06T11:00:00Z"
  }
}
```

---

### 5. PATCH /api/contact/:id/flag

**Purpose**: Update flag status of a contact

**Auth**: Required (token in cookie)

**URL Parameter**: `:id` - MongoDB ObjectId of contact

**Request Body**:
```javascript
{
  flag: "important" | "followup" | "resolved" | "default"
}
```

**Response**:
```javascript
{
  success: true,
  contact: {
    _id: "contactId",
    // ... contact data
    flag: "important",
    updatedAt: "2024-05-06T11:00:00Z"
  }
}
```

---

## Sample Express Router Implementation

Here's a template for implementing these endpoints:

```javascript
// In your routers/contact.js

import { Router } from "express";
import Contact from "../models/contact.js";
import authorize from "../middlewares/authorization.js";

const app = Router();

// POST /support - Already exists ✅

// GET /history - Get all contacts with pagination & filters
app.get("/history", authorize, async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = "", flag = "", priority = "" } = req.query;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = {};
    
    if (search) {
      filter.$or = [
        { email: { $regex: search, $options: "i" } },
        { subject: { $regex: search, $options: "i" } },
        { message: { $regex: search, $options: "i" } }
      ];
    }
    
    if (flag && flag !== "") {
      filter.flag = flag;
    }
    
    if (priority && priority !== "") {
      filter.priority = priority;
    }

    const contacts = await Contact.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Contact.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      contacts,
      total,
      totalPages,
      page: parseInt(page),
      limit: parseInt(limit)
    });
  } catch (error) {
    req.err = error;
    next();
  }
});

// GET /:id - Get single contact
app.get("/:id", authorize, async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.id);
    
    if (!contact) {
      return res.json({
        success: false,
        message: "Contact not found"
      });
    }

    res.json({
      success: true,
      contact
    });
  } catch (error) {
    req.err = error;
    next();
  }
});

// PATCH /:id/read - Mark as read
app.patch("/:id/read", authorize, async (req, res, next) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { seen: true, updatedAt: new Date() },
      { new: true }
    );

    if (!contact) {
      return res.json({
        success: false,
        message: "Contact not found"
      });
    }

    res.json({
      success: true,
      contact
    });
  } catch (error) {
    req.err = error;
    next();
  }
});

// PATCH /:id/flag - Update flag
app.patch("/:id/flag", authorize, async (req, res, next) => {
  try {
    const { flag } = req.body;

    if (!["important", "followup", "resolved", "default"].includes(flag)) {
      return res.json({
        success: false,
        message: "Invalid flag value"
      });
    }

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { flag, updatedAt: new Date() },
      { new: true }
    );

    if (!contact) {
      return res.json({
        success: false,
        message: "Contact not found"
      });
    }

    res.json({
      success: true,
      contact
    });
  } catch (error) {
    req.err = error;
    next();
  }
});

export default app;
```

```javascript
// In your routers/user.js - Add profile endpoint

// GET /profile - Get user profile
app.get("/profile", authorize, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.json({
        success: false,
        message: "User not found"
      });
    }

    res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (error) {
    req.err = error;
    next();
  }
});
```

## Testing the Endpoints

### Using cURL

```bash
# Get profile
curl -H "Cookie: token=YOUR_TOKEN" http://localhost:8080/api/user/profile

# Get contacts
curl -H "Cookie: token=YOUR_TOKEN" "http://localhost:8080/api/contact/history?page=1&limit=10"

# Get single contact
curl -H "Cookie: token=YOUR_TOKEN" http://localhost:8080/api/contact/CONTACT_ID

# Mark as read
curl -X PATCH -H "Cookie: token=YOUR_TOKEN" http://localhost:8080/api/contact/CONTACT_ID/read

# Update flag
curl -X PATCH \
  -H "Cookie: token=YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"flag":"important"}' \
  http://localhost:8080/api/contact/CONTACT_ID/flag
```

### Using Postman

1. Get your auth token from login
2. Set `Authorization` header or `token` cookie
3. Send requests to endpoints above

## Important Notes

1. **Pagination**: Frontend expects `totalPages` field for pagination UI
2. **Timestamps**: Use ISO 8601 format for dates (new Date().toISOString())
3. **Authentication**: All endpoints except login/register require valid token
4. **CORS**: Ensure frontend domain can access these endpoints
5. **Validation**: Validate all input data
6. **Error Handling**: Use consistent error response format
7. **Security**: Only return user's own contacts (add user filter if needed)

## Frontend Expectations

The frontend expects:
- All responses to have `success` boolean
- Contact objects with all required fields
- Proper HTTP status codes
- CORS headers properly configured
- Cookies to be set with httpOnly flag

---

That's all you need to implement! Once these endpoints are working, your frontend will be fully functional.
