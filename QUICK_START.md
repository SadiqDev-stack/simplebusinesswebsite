# 🚀 Quick Start Guide

Get your Sadiq Caps frontend up and running in minutes!

## 📋 Prerequisites

- Node.js v18+ installed
- npm or yarn
- Backend server running on `http://localhost:8080`

## ⚡ Quick Setup (5 minutes)

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Configure Environment
```bash
# Copy example env file
cp .env.example .env

# Update if your backend is on a different URL:
# Edit .env and change VITE_API_URL if needed
```

### 3. Start Development Server
```bash
npm run dev
```

The frontend will open at **http://localhost:5174/**

## 🧪 Testing Checklist

### Public Pages (No Login Required)
- [ ] Visit home page `/` - See landing page
- [ ] Click "Contact" link - See contact form
- [ ] Fill and submit contact form
- [ ] Click "Admin Login" - See login page

### Admin Dashboard (Login Required)
- [ ] Click "Admin Login" in navigation
- [ ] Enter admin credentials
- [ ] Should redirect to dashboard `/dashboard`
- [ ] See analytics stats
- [ ] Click "View All Messages" button
- [ ] See contacts management page `/contacts`

### Contacts Management Features
- [ ] **Search**: Type email in search box
- [ ] **Filter by Flag**: Select "Important" from flag dropdown
- [ ] **Filter by Priority**: Select "High" from priority dropdown
- [ ] **Pagination**: Click previous/next buttons
- [ ] **Click Message**: View message details in modal
- [ ] **Mark as Read**: Click eye icon on message card
- [ ] **Flag Message**: Click flag icon on message card
- [ ] **AI Assistant**: Ask question in modal
- [ ] **WhatsApp Link**: Click "Open WhatsApp" button

## 📱 Responsive Testing

Test on different screen sizes:
```bash
# In browser DevTools
- Mobile: iPhone 12 (390px)
- Tablet: iPad (768px)
- Desktop: Full width (1024px+)
```

All pages should be fully responsive!

## 🐛 Troubleshooting

### Frontend won't start
```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install
npm run dev
```

### Port 5174 in use
```bash
# Kill process on port 5174 or use different port
# Or let Vite auto-select a new port
```

### "Cannot find module" error
- Check all imports use correct paths
- Verify all component files exist in `src/`

### API calls failing
- Verify backend is running on `http://localhost:8080`
- Check `.env` has correct `VITE_API_URL`
- Check browser console for detailed errors

### Login not working
- Verify backend has user credentials
- Check network tab in DevTools for API response
- Verify backend endpoints exist

## 📚 File Structure Reference

```
frontend/
├── src/
│   ├── pages/              # Page components
│   ├── components/         # Reusable components
│   ├── context/            # Auth context
│   ├── services/           # API client
│   ├── hooks/              # Custom hooks
│   ├── utils/              # Helper functions
│   ├── App.jsx            # Main app
│   └── main.jsx           # Entry point
├── .env                    # API configuration
├── package.json            # Dependencies
└── vite.config.js         # Vite config
```

## 🌐 Available Routes

| Route | Purpose | Auth Required |
|-------|---------|---------------|
| `/` | Landing page | No |
| `/contact` | Contact form | No |
| `/login` | Admin login | No |
| `/dashboard` | Analytics dashboard | Yes |
| `/contacts` | Message management | Yes |

## 🔑 Demo Login

Use these credentials (you need to create them in your backend):
```
Email: admin@example.com
Password: password123
```

Or use your actual admin credentials from your database.

## 💾 Build for Production

```bash
# Create optimized build
npm run build

# Output goes to: frontend/dist/

# Preview production build
npm run preview
```

## 🚢 Deployment

1. **Build**:
   ```bash
   npm run build
   ```

2. **Deploy `dist/` folder to**:
   - Vercel (easiest)
   - Netlify
   - AWS S3 + CloudFront
   - Any static hosting

3. **Update environment variable**:
   - Set `VITE_API_URL` to production API URL
   - Example: `https://api.sadiqcaps.com/api`

## 📞 Need Help?

### Check These Files
- `FRONTEND_README.md` - Full frontend documentation
- `BUILD_SUMMARY.md` - What's been built
- `BACKEND_IMPLEMENTATION_GUIDE.md` - Backend endpoints needed

### Common Issues & Solutions

**Q: Frontend shows "Loading..." forever**
A: Check if backend is running and `.env` has correct API URL

**Q: Forms don't submit**
A: Verify backend contact endpoint exists
A: Check browser console for API error messages

**Q: AI assistant shows error**
A: Verify backend `/api/assistant` endpoint exists
A: Check if AI service is configured

**Q: WhatsApp button doesn't work**
A: Contact should have a phone number
A: Try with format: +234xxxxxxxxxx

**Q: Pagination doesn't work**
A: Backend `/api/contact/history` endpoint not implemented
A: Check `BACKEND_IMPLEMENTATION_GUIDE.md`

## ✨ Features Ready to Use

- ✅ Beautiful landing page
- ✅ Contact form with validation
- ✅ Admin authentication
- ✅ Dashboard analytics
- ✅ Message search & filters
- ✅ Message pagination
- ✅ Responsive design
- ✅ AI assistant integration
- ✅ WhatsApp integration
- ✅ Flag system
- ✅ Read/Unread tracking

## 🎓 Learning the Codebase

### Where to Find Things

- **Authentication Logic**: `src/context/AuthContext.jsx`
- **API Calls**: `src/services/api.js`
- **Protected Routes**: `src/components/ProtectedRoute.jsx`
- **Form Validation**: See any `pages/*.jsx` with useForm
- **Navigation**: `src/components/Navigation.jsx`
- **Styling**: Tailwind CSS classes in components

### Code Style

- Clean, readable variable names
- Proper file organization
- Comments for complex logic
- Reusable components
- No code duplication

## 🎉 You're All Set!

Your modern Sadiq Caps frontend is ready to go. Start the dev server and begin testing!

```bash
npm run dev
```

Visit **http://localhost:5174/** to see your beautiful frontend in action! 🚀

---

**Need to make changes?** All files are editable. The frontend will hot-reload on save during development.

**Need to add features?** Refer to `FRONTEND_README.md` for architecture and patterns.

**Need backend guidance?** Check `BACKEND_IMPLEMENTATION_GUIDE.md` for exact endpoint specs.

Happy building! 🎊
