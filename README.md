# NIT Jamshedpur Attendance Portal

A comprehensive attendance management system designed specifically for National Institute of Technology, Jamshedpur. This portal provides efficient attendance tracking, reporting, and management capabilities for students, professors, and administrators.

## 🎯 Features

### For Students
- **Attendance Tracking**: View detailed attendance records for all subjects
- **Class Schedule**: Access class timings, room numbers, and professor information
- **Subject Management**: View enrolled subjects and academic progress
- **Profile Management**: Update personal information and contact details
- **Attendance Analytics**: Monitor attendance percentages and trends

### For Professors
- **Attendance Marking**: Mark student attendance for classes
- **Class Management**: Manage subjects and view enrolled students
- **Report Generation**: Generate comprehensive attendance reports
- **Student Analytics**: Track individual and class attendance patterns
- **Profile Management**: Update professional information

### For Administrators
- **User Management**: Add, edit, and manage user accounts
- **Subject Management**: Create and manage course subjects
- **Enrollment Management**: Handle student enrollments and course registrations
- **System Reports**: Generate system-wide attendance and performance reports
- **Data Analytics**: Monitor portal usage and system performance

## 🏗️ Technology Stack

- **Frontend**: Next.js 15, React 19
- **Backend**: Node.js with Next.js API routes
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with bcrypt for password hashing
- **Styling**: CSS Modules with responsive design
- **Deployment**: Ready for Vercel, Netlify, or any Node.js hosting

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB database
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd attendance-portal
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```

4. **Database Setup**
   - Ensure MongoDB is running
   - The application will automatically create necessary collections and indexes

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
attendance-portal/
├── app/                          # Next.js app directory
│   ├── (auth)/                  # Authentication routes
│   │   ├── login/              # Login page
│   │   └── signup/             # Signup page
│   ├── api/                     # API routes
│   │   └── auth/               # Authentication APIs
│   ├── dashboard/               # Dashboard pages
│   │   ├── layout.js           # Dashboard layout
│   │   ├── page.js             # Dashboard home
│   │   └── dashboard.module.css # Dashboard styles
│   ├── globals.css             # Global styles
│   ├── layout.js               # Root layout
│   └── page.js                 # Home page
├── lib/                         # Utility libraries
│   └── db.js                   # Database connection
├── models/                      # MongoDB models
│   ├── User.js                 # User model
│   ├── Subject.js              # Subject model
│   ├── Attendance.js           # Attendance model
│   ├── Enrollment.js           # Enrollment model
│   └── StudentMeta.js          # Student metadata model
├── utils/                       # Utility functions
│   ├── auth.js                 # Client-side auth utilities
│   └── auth_server.js          # Server-side auth utilities
└── package.json                 # Dependencies and scripts
```

## 🗄️ Database Models

### User Model
- Basic user information (name, email, password, role)
- Role-based fields (roll number, department, batch for students)
- Profile information and contact details

### Subject Model
- Subject details (code, name, department, semester)
- Professor assignment and academic year
- Credit hours and active status

### Attendance Model
- Student attendance records with date and status
- Subject and session information
- Marked by professor with optional remarks

### Enrollment Model
- Student-subject enrollment relationships
- Semester and academic year tracking
- Grade information and active status

### StudentMeta Model
- Extended student information
- Academic details (batch, section, current semester)
- Emergency contact and address information

## 🔐 Authentication & Security

- **JWT-based authentication** with secure token storage
- **Password hashing** using bcrypt with salt rounds
- **Role-based access control** for different user types
- **Protected API routes** with middleware authentication
- **Secure session management** with automatic token validation

## 🎨 UI/UX Features

- **Modern Design**: Clean, professional interface with gradient backgrounds
- **Responsive Layout**: Mobile-first design that works on all devices
- **Interactive Elements**: Hover effects, animations, and smooth transitions
- **Role-based Navigation**: Dynamic navigation based on user role
- **Accessibility**: Proper contrast, readable fonts, and keyboard navigation

## 📱 Responsive Design

The portal is fully responsive and optimized for:
- Desktop computers (1200px+)
- Tablets (768px - 1199px)
- Mobile devices (320px - 767px)

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
- **Netlify**: Configure build settings for Next.js
- **Railway**: Deploy with MongoDB Atlas integration
- **Heroku**: Use buildpacks for Node.js deployment

## 🔧 Configuration

### Environment Variables
```env
MONGODB_URI=mongodb://localhost:27017/attendance-portal
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=development
```

### Database Configuration
The application automatically:
- Creates necessary collections
- Sets up indexes for performance
- Validates data schemas
- Handles connection pooling

## 📊 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Dashboard (Protected)
- `GET /api/dashboard/student-stats` - Student statistics
- `GET /api/dashboard/professor-stats` - Professor statistics
- `GET /api/dashboard/admin-stats` - Admin statistics

## 🧪 Testing

```bash
# Run linting
npm run lint

# Run tests (when implemented)
npm test

# Build for production
npm run build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Contact the development team at NIT Jamshedpur
- Check the documentation and FAQ sections

## 🔮 Future Enhancements

- **QR Code Attendance**: Scan-based attendance marking
- **Mobile App**: Native mobile applications for iOS/Android
- **Advanced Analytics**: Machine learning-based attendance predictions
- **Integration**: LMS and ERP system integrations
- **Notifications**: Email and SMS attendance alerts
- **Offline Support**: PWA capabilities for offline usage

## 📞 Contact

**NIT Jamshedpur**  
National Institute of Technology  
Jamshedpur, Jharkhand, India  
Email: info@nitjsr.ac.in  
Website: [www.nitjsr.ac.in](https://www.nitjsr.ac.in)

---

**Built with ❤️ for NIT Jamshedpur**
