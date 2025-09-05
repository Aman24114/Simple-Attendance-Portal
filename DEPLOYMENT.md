# Deployment Guide - NIT Jamshedpur Attendance Portal

## 🚀 Quick Deployment Steps

### 1. Environment Variables
Create a `.env.local` file in the root directory with:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/attendance_portal
JWT_SECRET=your-super-secret-jwt-key-here
NODE_ENV=production
```

### 2. Build the Application
```bash
npm run build
```

### 3. Start the Application
```bash
npm start
```

## 🌐 Deployment Platforms

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your GitHub repo to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Netlify
1. Build command: `npm run build`
2. Publish directory: `.next`
3. Add environment variables in Netlify dashboard

### Railway
1. Connect your GitHub repo
2. Add environment variables
3. Deploy automatically

## 🔧 Common Issues & Solutions

### Build Errors
- **Mongoose Issues**: Already fixed with `serverComponentsExternalPackages`
- **Runtime Errors**: Removed `export const runtime = 'nodejs'` from API routes
- **Import Errors**: All imports are properly configured

### Database Connection
- Ensure MongoDB URI is correct
- Check network access in MongoDB Atlas
- Verify database name is `attendance_portal`

### Environment Variables
- Never commit `.env.local` to Git
- Add all required variables to deployment platform
- Use strong JWT secret (32+ characters)

## 📋 Pre-deployment Checklist

- [ ] Environment variables configured
- [ ] MongoDB database accessible
- [ ] All dependencies installed
- [ ] Build completes without errors
- [ ] No console errors in browser
- [ ] Authentication working
- [ ] Database operations working

## 🎯 Post-deployment Testing

1. **Test Authentication**
   - Sign up new users
   - Login with different roles
   - Logout functionality

2. **Test Core Features**
   - Admin: Add students, professors, subjects
   - Professor: Mark attendance
   - Student: View attendance

3. **Test Database**
   - Check data persistence
   - Verify relationships between models
   - Test error handling

## 🔒 Security Notes

- Use HTTPS in production
- Set secure cookies
- Use strong JWT secrets
- Enable MongoDB authentication
- Regular security updates

## 📞 Support

If you encounter issues:
1. Check the console for errors
2. Verify environment variables
3. Test database connectivity
4. Check deployment platform logs
