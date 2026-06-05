# Land Registry Frontend

React-based frontend application for the Blockchain-Based Land Registry system.

## Features

- **User Authentication**: Secure login and registration
- **Dashboard**: Overview of properties and statistics
- **Property Management**: Register, view, and manage properties
- **Ownership Transfers**: Execute and track property transfers
- **Verification System**: Verify ownership and generate certificates
- **User Profile**: Manage personal information and properties
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Technology Stack

- React 18
- React Router v6
- Axios for API calls
- React Toastify for notifications
- React Icons
- CSS3 with responsive design

## Installation

### Prerequisites

- Node.js >= 16.0.0
- npm >= 8.0.0

### Setup

1. **Install dependencies**:
```bash
npm install
```

2. **Configure environment**:
```bash
cp .env.example .env
# Edit .env with your API URL
REACT_APP_API_URL=http://localhost:3000/api
```

3. **Start development server**:
```bash
npm start
```

The application will open at `http://localhost:3000`

## Project Structure

```
frontend/
├── public/              # Static files
├── src/
│   ├── components/      # Reusable components
│   │   ├── Navbar.js
│   │   └── ProtectedRoute.js
│   ├── pages/           # Page components
│   │   ├── HomePage.js
│   │   ├── LoginPage.js
│   │   ├── RegisterPage.js
│   │   ├── DashboardPage.js
│   │   ├── PropertiesPage.js
│   │   ├── TransfersPage.js
│   │   ├── VerificationPage.js
│   │   └── ProfilePage.js
│   ├── services/        # API services
│   │   └── api.js
│   ├── context/         # React Context
│   │   └── AuthContext.js
│   ├── styles/          # CSS files
│   ├── App.js           # Main component
│   └── index.js         # Entry point
├── package.json
└── README.md
```

## Available Pages

### Public Pages
- **Home** (`/`) - Landing page with features overview
- **Login** (`/login`) - User login
- **Register** (`/register`) - User registration

### Protected Pages
- **Dashboard** (`/dashboard`) - Overview and statistics
- **Properties** (`/properties`) - Property management
- **Transfers** (`/transfers`) - Property transfers
- **Verify** (`/verify`) - Ownership verification
- **Profile** (`/profile`) - User profile and settings

## API Integration

The frontend communicates with the backend API using Axios. API endpoints are configured in `src/services/api.js`.

### Authentication

- Tokens are stored in localStorage
- Automatically added to API requests
- Token expiration redirects to login

### Error Handling

- Global error handling with user-friendly messages
- Toast notifications for success/error messages
- Automatic logout on 401 responses

## Component Usage

### Using Protected Routes

```jsx
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  }
/>
```

### Using Auth Context

```jsx
const { user, isAuthenticated, login, logout } = useAuth();
```

### API Calls

```jsx
import { propertyService } from '../services/api';

const properties = await propertyService.getAllProperties(page, limit);
```

## Styling

The application uses custom CSS with a responsive design. Main style files:

- `styles/global.css` - Global styles and utilities
- `styles/navbar.css` - Navigation styles
- `styles/auth.css` - Authentication pages
- `styles/dashboard.css` - Dashboard layout
- `styles/properties.css` - Properties page
- `styles/transfers.css` - Transfers page
- `styles/verification.css` - Verification page
- `styles/profile.css` - Profile page
- `styles/home.css` - Home page

## Building for Production

```bash
npm run build
```

This creates an optimized production build in the `build/` directory.

## Environment Variables

```
REACT_APP_API_URL=http://localhost:3000/api
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Optimization

- Code splitting with React Router
- Lazy loading of routes
- Optimized API calls
- CSS minification in production
- Image optimization

## Testing

```bash
npm test
```

## Troubleshooting

### API Connection Failed
- Ensure backend server is running on `http://localhost:3000`
- Check `REACT_APP_API_URL` in .env
- Verify CORS configuration on backend

### Login Issues
- Clear localStorage: `localStorage.clear()`
- Check token validity
- Verify backend authentication service

### Styling Issues
- Clear browser cache
- Run `npm install` to ensure dependencies
- Check CSS file paths

## Contributing

1. Create feature branch: `git checkout -b feature/name`
2. Make changes and test locally
3. Commit with clear message: `git commit -m "feat: description"`
4. Push and create pull request

## License

Apache 2.0 License

## Support

For issues and questions:
- GitHub Issues
- Check existing documentation
- Review API documentation

---

Happy coding! 🚀
