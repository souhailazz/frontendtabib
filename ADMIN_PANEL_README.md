# TeleConsult Admin Panel

A comprehensive admin panel for managing the TeleConsult medical platform, providing full CRUD capabilities for patients, doctors, consultations, and prescriptions.

## 🚀 Features

### Dashboard Overview
- **Real-time Statistics**: Total patients, doctors, consultations, and prescriptions
- **Revenue Analytics**: Track completed consultation revenue
- **Status Distribution**: View consultation status breakdown (Completed, Pending, Accepted, Cancelled)
- **Recent Activity**: Latest consultations and top-performing doctors
- **Interactive Charts**: Visual representation of data trends

### Patient Management
- **View All Patients**: Complete list with search and filter capabilities
- **Add New Patients**: Create patient records with all necessary information
- **Edit Patient Details**: Update patient information including contact details
- **Delete Patients**: Remove patient records from the system
- **Patient Search**: Find patients by name, email, or other criteria

### Doctor Management
- **View All Doctors**: Complete list with specialties and ratings
- **Add New Doctors**: Register new healthcare providers
- **Edit Doctor Information**: Update doctor details, specialties, and ratings
- **Delete Doctors**: Remove doctor records from the system
- **Doctor Analytics**: Performance metrics and consultation statistics

### Consultation Management
- **View All Consultations**: Complete consultation history
- **Create Consultations**: Schedule new appointments between patients and doctors
- **Update Consultation Status**: Change status (Pending, Accepted, Completed, Cancelled)
- **Delete Consultations**: Remove consultation records
- **Consultation Details**: View patient, doctor, date, time, and pricing information

### Prescription Management
- **View All Prescriptions**: Complete prescription history
- **Create Prescriptions**: Generate new prescriptions for patients
- **Edit Prescriptions**: Update prescription content and details
- **Delete Prescriptions**: Remove prescription records
- **Prescription Analytics**: Track prescription patterns and trends

### Analytics & Reporting
- **Doctor Performance**: Individual doctor statistics and completion rates
- **Revenue Tracking**: Financial analytics and revenue trends
- **Consultation Patterns**: Time-based analysis of consultation distribution
- **Export Capabilities**: Download reports in various formats

## 🏗️ Architecture

### Frontend Components
- **Admin.jsx**: Main admin component with tabbed interface
- **Admin.css**: Comprehensive styling matching the dashboard design
- **Responsive Design**: Mobile-friendly interface with adaptive layouts

### Backend Components
- **AdminController.java**: REST API endpoints for admin operations
- **Service Integration**: Leverages existing PatientService, DocteurService, ConsultationService, and OrdonnanceService
- **Error Handling**: Comprehensive error handling and validation

### API Endpoints

#### Dashboard Statistics
```
GET /api/admin/statistics
```

#### Patient Management
```
GET    /api/admin/patients
POST   /api/admin/patients
PUT    /api/admin/patients/{id}
DELETE /api/admin/patients/{id}
```

#### Doctor Management
```
GET    /api/admin/doctors
POST   /api/admin/doctors
PUT    /api/admin/doctors/{id}
DELETE /api/admin/doctors/{id}
```

#### Consultation Management
```
GET    /api/admin/consultations
POST   /api/admin/consultations
PUT    /api/admin/consultations/{id}
DELETE /api/admin/consultations/{id}
```

#### Prescription Management
```
GET    /api/admin/prescriptions
POST   /api/admin/prescriptions
PUT    /api/admin/prescriptions/{id}
DELETE /api/admin/prescriptions/{id}
```

#### Analytics
```
GET /api/admin/analytics/doctors
```

## 🎨 User Interface

### Design Features
- **Modern Dashboard**: Clean, professional interface matching the provided design
- **Sidebar Navigation**: Easy access to all admin functions
- **Statistics Cards**: Visual representation of key metrics
- **Data Tables**: Sortable and filterable data presentation
- **Modal Forms**: Intuitive CRUD operations with form validation
- **Status Indicators**: Color-coded status badges for quick identification
- **Responsive Layout**: Works seamlessly on desktop, tablet, and mobile

### Color Scheme
- **Primary Blue**: #3b82f6 (Buttons, active states)
- **Success Green**: #10b981 (Completed status)
- **Warning Yellow**: #f59e0b (Pending status)
- **Danger Red**: #ef4444 (Cancelled status, delete actions)
- **Neutral Grays**: #64748b, #94a3b8 (Text, borders)

## 🔧 Setup Instructions

### Prerequisites
- Java 21+
- Spring Boot 3.2.5+
- React 19+
- Node.js 18+

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Build the project:
   ```bash
   mvn clean install
   ```

3. Run the application:
   ```bash
   mvn spring-boot:run
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

### Access Admin Panel
1. Start both backend and frontend servers
2. Navigate to the application in your browser
3. Click on "Admin Access" link in the navigation (for development)
4. The admin panel will be available at `/admin`

## 🔐 Security Considerations

### Current Implementation
- **Development Access**: Admin panel is currently accessible via direct link for development
- **No Authentication**: Admin functions are not protected by authentication in this version

### Recommended Security Enhancements
1. **Admin Authentication**: Implement admin login system
2. **Role-Based Access**: Restrict admin functions to authorized users
3. **Session Management**: Secure session handling for admin users
4. **API Security**: Implement JWT tokens for admin API access
5. **Audit Logging**: Track all admin actions for accountability

## 📊 Data Management

### Database Operations
- **CRUD Operations**: Full Create, Read, Update, Delete capabilities
- **Data Validation**: Input validation and error handling
- **Relationship Management**: Proper handling of patient-doctor-consultation relationships
- **Data Integrity**: Maintains referential integrity across all operations

### Performance Considerations
- **Efficient Queries**: Optimized database queries for large datasets
- **Pagination**: Support for large data sets with pagination
- **Caching**: Implement caching for frequently accessed data
- **Indexing**: Proper database indexing for optimal performance

## 🚨 Error Handling

### Frontend Error Handling
- **Loading States**: Visual feedback during data operations
- **Error Messages**: User-friendly error notifications
- **Retry Mechanisms**: Automatic retry for failed operations
- **Form Validation**: Real-time validation with helpful error messages

### Backend Error Handling
- **HTTP Status Codes**: Proper status code responses
- **Exception Handling**: Comprehensive exception handling
- **Validation Errors**: Detailed validation error messages
- **Logging**: Comprehensive logging for debugging

## 🔄 Future Enhancements

### Planned Features
1. **Advanced Analytics**: More detailed reporting and analytics
2. **Bulk Operations**: Mass import/export of data
3. **Notification System**: Real-time notifications for admin actions
4. **Audit Trail**: Complete audit logging of all admin actions
5. **Backup/Restore**: System backup and data recovery features
6. **Multi-language Support**: Internationalization for admin interface
7. **Advanced Search**: Full-text search across all entities
8. **Data Export**: Export data in various formats (CSV, Excel, PDF)

### Technical Improvements
1. **Real-time Updates**: WebSocket integration for live data updates
2. **Advanced Filtering**: Complex filtering and sorting options
3. **Dashboard Customization**: Configurable dashboard layouts
4. **Mobile App**: Native mobile application for admin functions
5. **API Documentation**: Comprehensive API documentation
6. **Testing**: Unit and integration tests for all admin functions

## 🆘 Troubleshooting

### Common Issues
1. **CORS Errors**: Ensure backend CORS configuration includes frontend URL
2. **API Connection**: Verify backend server is running on port 8080
3. **Data Loading**: Check database connection and data availability
4. **Form Submission**: Ensure all required fields are filled

### Debug Information
- **Browser Console**: Check for JavaScript errors
- **Network Tab**: Monitor API requests and responses
- **Backend Logs**: Review Spring Boot application logs
- **Database**: Verify data integrity in the database

## 📞 Support

For technical support or questions about the admin panel:
- **Documentation**: Refer to this README and code comments
- **Issues**: Report bugs through the project's issue tracker
- **Development**: Contact the development team for feature requests

---

**Note**: This admin panel is designed for development and testing purposes. For production deployment, ensure proper security measures are implemented, including authentication, authorization, and audit logging.
