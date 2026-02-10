# Product Management Dashboard

A production-ready admin panel for managing an e-commerce product catalog, built with React 18+, TypeScript, Tailwind CSS, and ShadCN UI.

## 🚀 Features

### Authentication
- JWT-based authentication with automatic token refresh
- Secure session management with localStorage
- "Remember Me" functionality
- Password visibility toggle

### Dashboard
- Real-time statistics (Total Products, Users, Low Stock, Avg Price, Avg Rating, Categories)
- Interactive charts using Recharts (Pie, Bar, Horizontal Bar)
- Recent products table with quick actions

### Product Management
- Full CRUD operations (Create, Read, Update, Delete)
- Advanced filtering (search, category)
- Client-side sorting (price, rating, stock, title)
- URL-synced pagination and filters
- Image upload with Cloudinary integration
- Multiple image support (up to 5 images per product)
- Upload progress indicators

### User Management
- User listing with pagination
- Search and sorting capabilities
- Comprehensive user detail modal
- URL-synced state

### Settings
- Profile information display
- Light/Dark theme toggle
- Logout functionality

## 🛠️ Tech Stack

- **Framework:** React 18+ with TypeScript (Strict Mode)
- **Styling:** Tailwind CSS
- **UI Components:** ShadCN UI
- **State Management:** Zustand (auth), TanStack Query (server state)
- **Form Handling:** React Hook Form + Zod
- **HTTP Client:** Axios
- **Routing:** React Router v6
- **Charts:** Recharts
- **Icons:** Lucide React
- **Image Upload:** Cloudinary

## 📦 Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd aptech-product-dashboard
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your Cloudinary credentials:
   ```env
   VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
   VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to `http://localhost:5173`

## 🔑 Test Credentials

```
Username: emilys
Password: emilyspass
```

## 📁 Project Structure

```
src/
├── components/
│   ├── common/          # Reusable components (ImageUpload, MultiImageUpload)
│   ├── layout/          # Layout components (Layout, Sidebar, Header)
│   ├── products/        # Product-specific components (ProductForm, ProductDetailModal)
│   └── ui/              # ShadCN UI components
├── hooks/               # Custom React hooks
│   ├── use-auth-store.ts
│   ├── use-dashboard.ts
│   ├── use-debounce.ts
│   ├── use-products.ts
│   └── use-users.ts
├── lib/                 # Utility functions and configurations
│   ├── api-client.ts    # Axios instance with interceptors
│   └── utils.ts
├── pages/               # Page components
│   ├── DashboardPage.tsx
│   ├── LoginPage.tsx
│   ├── ProductsPage.tsx
│   ├── SettingsPage.tsx
│   └── UsersPage.tsx
├── services/            # API service layer
│   ├── auth.service.ts
│   ├── product.service.ts
│   ├── upload.service.ts
│   └── user.service.ts
├── stores/              # Zustand stores
│   └── use-auth-store.ts
├── types/               # TypeScript type definitions
│   ├── api.types.ts
│   └── product.types.ts
├── App.tsx              # Main app component with routing
└── main.tsx             # Application entry point
```

## 🔧 Key Features Implementation

### 1. Authentication Flow
- JWT tokens stored in localStorage
- Automatic token refresh using Axios interceptors
- 401 error handling with retry logic
- Session persistence across page refreshes

### 2. State Management
- **Zustand** for global auth state
- **TanStack Query** for server state with automatic caching and invalidation
- Optimistic UI updates for better UX

### 3. Form Validation
- React Hook Form for form state management
- Zod schemas for runtime validation
- Inline error messages

### 4. Image Upload
- Cloudinary integration for cloud storage
- Progress indicators for upload feedback
- Support for single and multiple images
- File type and size validation (max 5MB)

### 5. URL State Management
- Search params synced with URL
- Filters, sorting, and pagination persist on page refresh
- Shareable URLs with current state

## 🎨 UI/UX Features

- **Responsive Design:** Mobile-first approach with breakpoints for tablet and desktop
- **Dark Mode:** Full theme support with localStorage persistence
- **Loading States:** Skeleton loaders and spinners for better perceived performance
- **Toast Notifications:** User feedback for all actions (success/error)
- **Smooth Animations:** Transitions for sidebar, modals, and interactive elements
- **Accessibility:** Proper ARIA labels and keyboard navigation

## 📊 API Integration

### DummyJSON API
- Base URL: `https://dummyjson.com`
- Endpoints used:
  - `/auth/login` - User authentication
  - `/auth/refresh` - Token refresh
  - `/products` - Product CRUD operations
  - `/products/search` - Product search
  - `/products/categories` - Category list
  - `/users` - User management

### Cloudinary API
- Image upload endpoint: `https://api.cloudinary.com/v1_1/{cloud_name}/image/upload`
- Supports multiple file formats (JPG, PNG, GIF)

## 🚢 Deployment

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Deploy to Vercel
```bash
vercel
```

### Deploy to Netlify
```bash
netlify deploy --prod
```

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name | Yes |
| `VITE_CLOUDINARY_UPLOAD_PRESET` | Your Cloudinary upload preset | Yes |

## 🧪 Code Quality

- **TypeScript Strict Mode:** Full type safety
- **ESLint:** Code linting with recommended rules
- **Prettier:** Code formatting (if configured)
- **Component Structure:** Modular and reusable components
- **Error Handling:** Comprehensive error boundaries and try-catch blocks

## 🔐 Security Features

- JWT token-based authentication
- Secure token storage
- Automatic token refresh
- Protected routes
- Input validation and sanitization

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🤝 Contributing

This is a take-home assessment project. For any questions or issues, please contact the project maintainer.

## 📄 License

This project is created as part of a frontend developer assessment for Aptech Solutions.

---

**Built with ❤️ using React + TypeScript + Tailwind CSS**
