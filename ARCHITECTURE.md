# 🏗️ Architecture & System Design

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     USER'S BROWSER                              │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              SADIQ CAPS FRONTEND (React)                 │  │
│  │         Running at http://localhost:5174                │  │
│  │                                                           │  │
│  │  ┌─────────────────────────────────────────────────┐   │  │
│  │  │ Navigation                                      │   │  │
│  │  │ - Home | Contact | Admin Login | Logout       │   │  │
│  │  └─────────────────────────────────────────────────┘   │  │
│  │                                                           │  │
│  │  ┌─────────────────────────────────────────────────┐   │  │
│  │  │ Public Pages                 Protected Pages   │   │  │
│  │  │ ├─ Landing Page              ├─ Dashboard     │   │  │
│  │  │ ├─ Contact Form              ├─ Contacts     │   │  │
│  │  │ └─ Login Page                │   (Search/     │   │  │
│  │  │                              │    Filter)     │   │  │
│  │  │                              └─ AI Assistant  │   │  │
│  │  └─────────────────────────────────────────────────┘   │  │
│  │                                                           │  │
│  │  ┌─────────────────────────────────────────────────┐   │  │
│  │  │ State Management (React Context)                │   │  │
│  │  │ - AuthContext (user, login, logout)            │   │  │
│  │  │ - Local state for modals, forms                │   │  │
│  │  └─────────────────────────────────────────────────┘   │  │
│  │                                                           │  │
│  │  ┌─────────────────────────────────────────────────┐   │  │
│  │  │ API Client (Axios)                              │   │  │
│  │  │ - userAPI.login/logout/getProfile             │   │  │
│  │  │ - contactAPI.submit/getHistory/get/flag       │   │  │
│  │  │ - assistantAPI.getResponse                    │   │  │
│  │  └─────────────────────────────────────────────────┘   │  │
│  └──────────────────────────────────────────────────────────┘  │
│                          ↓ HTTP/HTTPS                          │
└──────────────────────────┼──────────────────────────────────────┘
                           │
                ┌──────────┴───────────┐
                │   CORS Enabled       │
                └──────────┬───────────┘
                           │
┌──────────────────────────┴──────────────────────────────────────┐
│                    YOUR BACKEND SERVER                          │
│            Running at http://localhost:8080                    │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐   │
│  │ Express Routes & Middleware                             │   │
│  │  ├─ CORS (allow frontend origin)                       │   │
│  │  ├─ Cookie Parser (handle auth tokens)                │   │
│  │  ├─ Error Handler                                      │   │
│  │  └─ Rate Limiter                                       │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐   │
│  │ Routes                                                  │   │
│  │                                                          │   │
│  │ /api/user/                                             │   │
│  │  ├─ POST /login          (username, password)          │   │
│  │  ├─ POST /logout                                       │   │
│  │  ├─ POST /register                                     │   │
│  │  └─ GET  /profile   [Protected]                        │   │
│  │                                                          │   │
│  │ /api/contact/                                          │   │
│  │  ├─ POST /support        (contact form submission)     │   │
│  │  ├─ GET  /history   [Protected] (with pagination)     │   │
│  │  ├─ GET  /:id       [Protected] (single contact)      │   │
│  │  ├─ PATCH /:id/read [Protected] (mark as read)       │   │
│  │  └─ PATCH /:id/flag [Protected] (set flag status)    │   │
│  │                                                          │   │
│  │ /api/assistant/                                        │   │
│  │  └─ POST /              [Protected] (AI response)     │   │
│  │                                                          │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐   │
│  │ Controllers                                             │   │
│  │  ├─ user.js (login, register, profile)                │   │
│  │  ├─ contact.js (submit, list, get, update)           │   │
│  │  └─ assistant.js (AI response generation)            │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐   │
│  │ Middleware                                              │   │
│  │  ├─ authentication.js (verify token)                  │   │
│  │  ├─ authorization.js (check permissions)              │   │
│  │  ├─ error.js (error handling)                         │   │
│  │  └─ logger.js (logging)                               │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐   │
│  │ Models (MongoDB)                                        │   │
│  │  ├─ User { name, email, phone, password, role }      │   │
│  │  ├─ Contact { name, email, phone, subject, issue,   │   │
│  │  │            priority, flag, seen, message }        │   │
│  │  └─ Timestamps (createdAt, updatedAt)                │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐   │
│  │ Database                                                │   │
│  │  └─ MongoDB (Collections: users, contacts)            │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

## Data Flow - User Login Example

```
1. User fills form and clicks "Sign In"
   └─ Form validation (email, password required)
   
2. Frontend sends POST request
   └─ POST /api/user/login
   └─ Body: { email, password }
   
3. Backend receives request
   └─ Find user by email
   └─ Compare password hash
   └─ Generate JWT token
   └─ Set httpOnly cookie
   
4. Response with user data
   └─ { success: true, user: {...} }
   
5. Frontend stores state
   └─ AuthContext updated
   └─ User object saved
   
6. Protected route allows access
   └─ Redirect to dashboard
   └─ Navigation shows "Logout" button
```

## Data Flow - Send Message via Contact Form

```
1. User fills contact form
   └─ Validation: name, email, phone, subject, issue, message
   
2. Frontend submits to backend
   └─ POST /api/contact/support
   └─ Body: { name, email, phone, subject, issue, priority, message }
   
3. Backend validates
   └─ Sanitizes input
   └─ Verifies email format
   └─ Stores in database
   
4. Backend sends email notification
   └─ Using nodemailer service
   └─ Template-based email
   
5. Response to frontend
   └─ { success: true, message: "We received your email..." }
   
6. Frontend shows confirmation
   └─ Success message displayed
   └─ Form cleared
   └─ Message auto-hides after 5 seconds
```

## Data Flow - Admin Views Messages

```
1. User logs in ✓
2. Admin visits /contacts page
3. Frontend requests message list
   └─ GET /api/contact/history?page=1&limit=10
   
4. Backend finds contacts (paginated)
   └─ Filter by search, flag, priority if provided
   └─ Sort by newest first
   
5. Response includes
   └─ contacts: [...]
   └─ total: 47
   └─ totalPages: 5
   └─ page: 1
   
6. Frontend displays
   └─ Message cards in list
   └─ Pagination controls
   └─ Search/filter UI
   
7. Admin clicks message
   └─ Frontend fetches full details
   └─ GET /api/contact/:id
   
8. Shows modal with
   └─ Full message content
   └─ Contact information
   └─ Flag buttons
   └─ AI assistant section
```

## Data Flow - AI Assistant

```
1. Admin clicks message, sees modal
2. Types question: "How should I respond?"
3. Clicks "Get AI Suggestion"
4. Frontend sends request
   └─ POST /api/assistant
   └─ Body: { message: "question", contactData: {...} }
   
5. Backend processes
   └─ Calls AI service (configured elsewhere)
   └─ Gets response text
   └─ Validates JSON response
   
6. Returns response
   └─ { success: true, message: "AI suggestion text" }
   
7. Frontend displays
   └─ Shows in blue box below input
   └─ Easy to read and copy
```

## Component Hierarchy

```
App (Router + AuthProvider)
├── Navigation
│   ├── Links (Home, Contact)
│   └── Auth Menu (Login/Logout/Dashboard)
│
├── Layout Wrapper
│   └── Routes
│       ├── Public Routes
│       │   ├── Landing Page
│       │   │   ├── Hero Section
│       │   │   ├── Features Grid
│       │   │   └── Footer
│       │   ├── Contact Page
│       │   │   ├── Form (FormComponents)
│       │   │   └── Contact Info Cards
│       │   └── Login Page
│       │       └── Login Form
│       │
│       └── Protected Routes (ProtectedRoute wrapper)
│           ├── Dashboard Page
│           │   ├── Welcome Header
│           │   └── Stats Cards (4x)
│           │
│           └── Contacts Page
│               ├── Search & Filters
│               ├── Contact Cards List
│               ├── Pagination
│               └── Detail Modal
│                   ├── Contact Info
│                   ├── Message Content
│                   ├── AI Assistant
│                   └── Actions (WhatsApp, Close)
```

## State Management

### Global State (AuthContext)
```javascript
{
  user: {
    _id: string,
    name: string,
    email: string,
    phone: string,
    role: "super" | "user"
  },
  loading: boolean,
  error: string,
  login: async (email, password) => Promise,
  logout: async () => void,
  setError: (error) => void
}
```

### Local State (Component Level)
```javascript
// Contacts page
{
  contacts: Array,
  loading: boolean,
  page: number,
  totalPages: number,
  search: string,
  filterFlag: string,
  filterPriority: string,
  selectedContact: Object,
  showDetailModal: boolean,
  aiQuestion: string,
  aiResponse: string,
  aiLoading: boolean
}
```

## Authentication & Authorization Flow

```
Unauthenticated User
│
├─ Can visit: /, /contact, /login
├─ Cannot visit: /dashboard, /contacts
│
└─ Clicks "Admin Login"
   └─ Fills form
   └─ Submits to backend
   └─ Backend validates credentials
   └─ Returns token (set in cookie)
   └─ Frontend updates AuthContext
   └─ User object stored
   │
   └─ Now Authenticated User
      │
      ├─ Can visit: All routes
      ├─ Cannot revisit: /login (redirects to /dashboard)
      │
      └─ Dashboard visible
         └─ Can view analytics
         └─ Can view messages
         └─ Can use AI assistant
         └─ Can interact with WhatsApp
         │
         └─ Clicks Logout
            └─ POST /api/user/logout
            └─ Token cleared
            └─ AuthContext cleared
            └─ Back to unauthenticated state
```

## Styling Architecture

```
Global Styles (index.css)
└─ Tailwind CSS directives
└─ Base styles

Component Styles (Inline Tailwind Classes)
├─ Navigation.jsx
│   └─ bg-white, border, shadow, responsive classes
├─ FormComponents.jsx
│   └─ Input, Button, Select styling
├─ Modal.jsx
│   └─ Overlay, card, modal styles
└─ All Pages
    └─ Layout, typography, spacing

Color Scheme
├─ Primary: gray-900 (black)
├─ Secondary: gray-600
├─ Backgrounds: white, gray-50
├─ Status:
│   ├─ Success: green-100, green-600
│   ├─ Error: red-100, red-600
│   ├─ Warning: yellow-100, yellow-600
│   ├─ Info: blue-100, blue-600
│   └─ Priority:
│       ├─ Low: blue
│       ├─ Medium: yellow
│       └─ High: red
```

## API Request/Response Pattern

All API responses follow this pattern:

```javascript
// Success Response
{
  success: true,
  data: { /* specific data */ },
  message: "Optional success message"
}

// Error Response
{
  success: false,
  message: "Error description",
  data: null
}
```

All requests include:
- Content-Type: application/json
- Credentials: include (for cookies)
- Authorization: via httpOnly cookie

---

This architecture ensures:
✅ Clean separation of concerns  
✅ Scalable component structure  
✅ Secure authentication  
✅ Efficient data flow  
✅ Professional code organization  
✅ Easy to extend and maintain
