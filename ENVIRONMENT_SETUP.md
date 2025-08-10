# Environment Configuration

This project now uses environment variables to manage API and frontend URLs. Follow these steps to set up your environment:

## For Development (Local)

Create a file named `.env.development` in the `frontend/` directory:

```env
# Development Environment Variables
VITE_API_BASE_URL=http://localhost:8080
VITE_FRONTEND_URL=http://localhost:5173
```

## For Production

Create a file named `.env.production` in the `frontend/` directory:

```env
# Production Environment Variables
VITE_API_BASE_URL=https://tabib-c9pp.onrender.com
VITE_FRONTEND_URL=https://your-frontend-domain.netlify.app
```

## For Temporary Use

I've created `env.development` and `env.production` files in the root directory. To use them:

1. Copy the content from `env.development` to `frontend/.env.development`
2. Copy the content from `env.production` to `frontend/.env.production`

## Configuration File

The project now uses a centralized configuration file at `frontend/src/config/config.js` that automatically loads the correct environment variables based on your build mode.

## Updated Components

All components have been updated to use environment variables instead of hardcoded URLs:

- ✅ Login Component
- ✅ Signup Component  
- ✅ BookingModal Component
- ✅ PaymentModal Component
- ✅ ResponseSearch Component
- ✅ MyConsultation Component
- ✅ Dashboard Component
- ✅ Admin Component
- ✅ ChatOrdonnanceEditor Component

## Backend CORS Configuration

Don't forget to update your backend CORS configuration to allow your production frontend URL once you deploy it.

## Development vs Production

- **Development**: Uses `http://localhost:8080` for API and `http://localhost:5173` for frontend
- **Production**: Uses `https://tabib-c9pp.onrender.com` for API and your deployed frontend URL

The configuration automatically switches based on your build mode (`npm run dev` vs `npm run build`). 