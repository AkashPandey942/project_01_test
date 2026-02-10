# Frontend Developer Assessment

## Aptech Solutions - Take Home Assignment

---

### Position: Senior Frontend Developer (4+ Years Experience)

**Estimated Duration:** 8-10 Hours  
**Submission Deadline:** Within 2 days  
**Tech Stack:** React 18+, TypeScript (Strict Mode), Tailwind CSS, ShadCN UI, TanStack Query

---

## Project Overview

Build a **Product Management Dashboard** - a fully functional admin panel for managing an e-commerce product catalog. This assessment evaluates your ability to build production-ready applications with proper architecture, API integration, state management, and polished UI/UX.

---

## APIs You Will Use

### 1. DummyJSON (Primary API)

| Property       | Value                      |
| -------------- | -------------------------- |
| Base URL       | `https://dummyjson.com`    |
| Documentation  | https://dummyjson.com/docs |
| Authentication | JWT-based                  |
| Rate Limit     | None                       |

### 2. Cloudinary (File Upload)

| Property         | Value                                                       |
| ---------------- | ----------------------------------------------------------- |
| Upload URL       | `https://api.cloudinary.com/v1_1/{cloud_name}/image/upload` |
| Documentation    | https://cloudinary.com/documentation                        |
| Account Required | Yes (Free Tier)                                             |

---

## Test Credentials

```
Username: emilys
Password: emilyspass
```

> **Important:** Set `expiresInMins: 1` during login to test token refresh functionality.

---

## Functional Requirements

### Module 1: Authentication

#### 1.1 Login Page

- Clean, centered login form with username and password fields
- Form validation using React Hook Form + Zod
- Show/hide password toggle
- "Remember me" checkbox (persist username in localStorage)
- Loading state on submit button
- Display API errors inline (e.g., "Invalid credentials")

#### 1.2 Authentication Flow

| Requirement         | Details                                                              |
| ------------------- | -------------------------------------------------------------------- |
| Login Endpoint      | `POST /auth/login` with `{ username, password, expiresInMins: 1 }`   |
| Token Storage       | Store `accessToken` and `refreshToken` securely                      |
| Auth Header         | Send `Authorization: Bearer <accessToken>` on all protected requests |
| Token Refresh       | Implement automatic refresh using `POST /auth/refresh`               |
| Session Persistence | User should remain logged in on page refresh                         |
| Logout              | Clear tokens and redirect to login page                              |

#### 1.3 Token Refresh Implementation

```
When a request returns 401 Unauthorized:
1. Pause the failed request
2. Call POST /auth/refresh with { refreshToken, expiresInMins: 1 }
3. If refresh succeeds → Update tokens → Retry original request
4. If refresh fails → Clear tokens → Redirect to login
```

This must happen silently without user awareness.

---

### Module 2: Application Layout

#### 2.1 Sidebar Navigation

- Collapsible sidebar (icon-only mode on collapse)
- Navigation items: Dashboard, Products, Users (read-only), Settings
- Active state highlighting
- Smooth collapse/expand animation
- Persistent collapse state in localStorage

#### 2.2 Header

- Page title / Breadcrumbs
- Global search input (searches products)
- User avatar with dropdown menu (Profile, Settings, Logout)
- Theme toggle (Light/Dark mode)

#### 2.3 Responsive Behavior

| Breakpoint          | Behavior                                      |
| ------------------- | --------------------------------------------- |
| Desktop (≥1024px)   | Sidebar visible, collapsible                  |
| Tablet (768-1023px) | Sidebar collapsed by default                  |
| Mobile (<768px)     | Sidebar as overlay/drawer with hamburger menu |

---

### Module 3: Dashboard

#### 3.1 Statistics Cards

Display the following metrics with appropriate icons:

| Card             | Data Source            | Calculation                 |
| ---------------- | ---------------------- | --------------------------- |
| Total Products   | `/products`            | `total` from response       |
| Total Users      | `/users`               | `total` from response       |
| Low Stock Items  | `/products`            | Count where `stock < 10`    |
| Average Price    | `/products`            | Calculate from all products |
| Average Rating   | `/products`            | Calculate from all products |
| Categories Count | `/products/categories` | Array length                |

#### 3.2 Charts

Using Recharts library:

1. **Products by Category** - Donut/Pie chart showing distribution
2. **Price Range Distribution** - Bar chart with ranges (₹0-500, ₹500-1000, ₹1000-2000, ₹2000+)
3. **Top 10 Rated Products** - Horizontal bar chart

#### 3.3 Recent Products Table

- Show latest 5 products
- Columns: Image, Title, Category, Price, Stock, Rating
- "View All" link to Products page

---

### Module 4: Product Management (Core Feature)

#### 4.1 Product Listing Page

**Data Fetching:**

| Feature         | API Endpoint                            |
| --------------- | --------------------------------------- |
| Paginated List  | `GET /products?limit=10&skip={offset}`  |
| Search          | `GET /products/search?q={query}`        |
| By Category     | `GET /products/category/{categoryName}` |
| Single Product  | `GET /products/{id}`                    |
| Categories List | `GET /products/categories`              |

**Table Features:**

| Feature             | Implementation                                                   |
| ------------------- | ---------------------------------------------------------------- |
| Columns             | Thumbnail, Title, Brand, Category, Price, Stock, Rating, Actions |
| Pagination          | Server-side using `limit` and `skip` params                      |
| Search              | Debounced (300ms) using `/products/search?q=`                    |
| Category Filter     | Dropdown populated from `/products/categories`                   |
| Sorting             | Client-side by Price, Rating, Stock, Title                       |
| URL Sync            | Reflect `?page=2&search=phone&category=laptops` in URL           |
| Refresh Persistence | Filters and page should persist on browser refresh               |

**Row Actions:**

- View (opens detail modal or page)
- Edit (opens edit form)
- Delete (confirmation dialog → optimistic delete)

**Bulk Actions:**

- Select multiple rows with checkboxes
- Bulk delete selected products

#### 4.2 Add/Edit Product

**Form Fields:**

| Field               | Type                  | Validation                     |
| ------------------- | --------------------- | ------------------------------ |
| Title               | Text                  | Required, min 3 characters     |
| Description         | Textarea              | Required, min 10 characters    |
| Price               | Number                | Required, positive number      |
| Discount Percentage | Number                | Optional, 0-100                |
| Stock               | Number                | Required, non-negative integer |
| Brand               | Text                  | Required                       |
| Category            | Select                | Required, from categories list |
| Thumbnail           | Image Upload          | Required, via Cloudinary       |
| Images              | Multiple Image Upload | Optional, via Cloudinary       |

**API Endpoints:**

- Create: `POST /products/add`
- Update: `PUT /products/{id}`

**UX Requirements:**

- Show loading state during submission
- Display success toast on completion
- Show field-level errors from validation
- Redirect to product list after successful save
- Implement optimistic updates where appropriate

#### 4.3 Delete Product

- Confirmation dialog with product name
- API: `DELETE /products/{id}`
- Optimistic removal from list
- Rollback and show error toast if API fails
- Success toast on completion

#### 4.4 Product Detail View

Display complete product information:

- Image gallery with thumbnails
- All product fields
- Stock status badge (In Stock / Low Stock / Out of Stock)
- Rating with stars visualization
- Edit and Delete buttons

---

### Module 5: Image Upload (Cloudinary)

#### 5.1 Setup Instructions

1. Create a free Cloudinary account at https://cloudinary.com
2. Go to Settings → Upload → Add upload preset
3. Set preset to "Unsigned"
4. Note your Cloud Name and Upload Preset

#### 5.2 Upload Implementation

```typescript
// Upload endpoint
POST https://api.cloudinary.com/v1_1/{cloud_name}/image/upload

// Form data
{
  file: File,
  upload_preset: string
}
```

#### 5.3 Requirements

| Requirement     | Details                                                      |
| --------------- | ------------------------------------------------------------ |
| File Validation | Accept only images (jpg, png, webp), max 5MB                 |
| Preview         | Show image preview before upload                             |
| Progress        | Display upload progress percentage                           |
| Error Handling  | Show user-friendly error for invalid files or failed uploads |
| Multiple Upload | Support multiple images for product gallery                  |
| Remove          | Allow removing uploaded images before form submission        |

---

### Module 6: Users Page (Read-Only)

#### 6.1 User Listing

- API: `GET /users?limit=10&skip={offset}`
- Table columns: Avatar, Name, Email, Phone, Company, City
- Pagination (server-side)
- Search using `GET /users/search?q={query}`

#### 6.2 User Detail Modal

- Click on row to view user details
- Display: Full name, Email, Phone, Address, Company info
- Read-only view (no edit functionality required)

---

### Module 7: Settings Page

#### 7.1 Theme Settings

- Theme toggle (Light/Dark/System)
- Persist selection in localStorage
- Apply theme using Tailwind's dark mode

#### 7.2 Display Settings

- Density toggle (Comfortable/Compact) for tables
- Default page size selection (10/20/50)
- Sidebar default state (Expanded/Collapsed)

---

## Technical Requirements

### Architecture

```
src/
├── app/                      # Route components (if using file-based routing)
├── components/
│   ├── ui/                   # ShadCN components
│   ├── layout/               # Header, Sidebar, Layout wrappers
│   ├── products/             # Product-specific components
│   ├── dashboard/            # Dashboard widgets
│   └── common/               # Shared components (DataTable, etc.)
├── hooks/
│   ├── use-auth.ts           # Authentication hook
│   ├── use-products.ts       # Product queries/mutations
│   ├── use-users.ts          # User queries
│   └── use-debounce.ts       # Utility hooks
├── lib/
│   ├── api-client.ts         # Axios instance with interceptors
│   ├── utils.ts              # Utility functions
│   └── validations.ts        # Zod schemas
├── services/
│   ├── auth.service.ts       # Auth API calls
│   ├── product.service.ts    # Product API calls
│   ├── user.service.ts       # User API calls
│   └── upload.service.ts     # Cloudinary upload
├── stores/                   # Zustand stores (if used)
├── types/
│   ├── auth.types.ts
│   ├── product.types.ts
│   ├── user.types.ts
│   └── api.types.ts
└── config/
    └── constants.ts          # API URLs, config values
```

### TypeScript Requirements

| Requirement  | Details                                               |
| ------------ | ----------------------------------------------------- |
| Strict Mode  | Enable `strict: true` in tsconfig                     |
| No `any`     | Zero usage of `any` type (use `unknown` if necessary) |
| API Typing   | All API responses must be typed                       |
| Props Typing | All component props must have interfaces              |
| Generics     | Use generics for reusable components/hooks            |

**Example API Response Types:**

```typescript
interface ApiResponse<T> {
  data: T;
  total: number;
  skip: number;
  limit: number;
}

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

interface AuthResponse {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  image: string;
  accessToken: string;
  refreshToken: string;
}
```

### API Client Requirements

```typescript
// Required Axios interceptor features:

// 1. Request Interceptor
- Attach Authorization header with access token
- Add request timestamp for debugging

// 2. Response Interceptor
- Handle 401: Attempt token refresh, retry original request
- Handle 403: Redirect to unauthorized page
- Handle 500: Show generic error toast
- Handle network errors: Show offline indicator

// 3. Request Cancellation
- Cancel pending requests on component unmount
- Cancel previous search requests when new search is initiated
```

### State Management

| State Type   | Solution                                |
| ------------ | --------------------------------------- |
| Server State | TanStack Query (React Query) - Required |
| Auth State   | React Context or Zustand                |
| UI State     | React useState/useReducer or Zustand    |
| Form State   | React Hook Form                         |

**TanStack Query Requirements:**

- Proper query keys with dependencies
- Stale time and cache time configuration
- Optimistic updates for mutations
- Query invalidation after mutations
- Prefetching on hover (bonus)

### Form Handling

- Use React Hook Form for all forms
- Use Zod for validation schemas
- Show inline field errors
- Disable submit button while submitting
- Show loading spinner in submit button

### Error Handling

| Error Type       | Expected Behavior                       |
| ---------------- | --------------------------------------- |
| 400 Bad Request  | Show validation errors on form fields   |
| 401 Unauthorized | Attempt token refresh → retry or logout |
| 403 Forbidden    | Show "Access Denied" message            |
| 404 Not Found    | Show "Resource Not Found" state         |
| 500 Server Error | Show generic error with retry button    |
| Network Error    | Show offline indicator, disable actions |

### Loading States

| State           | Implementation                               |
| --------------- | -------------------------------------------- |
| Page Loading    | Full page skeleton                           |
| Table Loading   | Table skeleton rows                          |
| Button Loading  | Spinner inside button, disabled state        |
| Image Loading   | Blur placeholder or skeleton                 |
| Infinite Scroll | Loading indicator at bottom (if implemented) |

### Empty States

Design and implement empty states for:

- No products found (with search/filter)
- No search results
- Empty product list
- No users found

---

## UI/UX Requirements

### Design System

- Use ShadCN UI components consistently
- Follow ShadCN's design patterns and conventions
- Customize theme colors in Tailwind config
- Maintain consistent spacing (use Tailwind's spacing scale)

### Required ShadCN Components

Use the following components appropriately:

- Button (all variants)
- Input, Textarea, Select
- Card
- Table
- Dialog/Modal
- Dropdown Menu
- Toast/Sonner
- Form components
- Tabs
- Badge
- Avatar
- Skeleton
- Alert
- Tooltip

### Accessibility

| Requirement         | Details                                          |
| ------------------- | ------------------------------------------------ |
| Keyboard Navigation | All interactive elements focusable and operable  |
| ARIA Labels         | Proper labels for icons and interactive elements |
| Focus Management    | Trap focus in modals, restore focus on close     |
| Color Contrast      | Meet WCAG AA standards                           |
| Screen Reader       | Announce dynamic content changes                 |

### Animations

- Smooth page transitions
- Modal open/close animations
- Sidebar collapse animation
- Button hover states
- Loading skeleton pulse
- Toast enter/exit animations

---

## Bonus Features

| Feature
|---------
| Unit tests for auth flow and at least 2 components
| E2E test for login and product CRUD flow
| Request cancellation for search (AbortController)
| Keyboard shortcuts (Ctrl+K for search, etc.)
| Skeleton loaders instead of spinners
| PWA setup with offline indicator
| Export products to CSV

---

## Submission Requirements

### GitHub Repository

- Initialize with proper `.gitignore`
- Clean, meaningful commit history (not single commit)
- No committed `.env` files or secrets
- Include `.env.example` with required variables

### README.md Must Include

1. **Project Overview** - Brief description
2. **Tech Stack** - List all technologies used
3. **Setup Instructions** - Step-by-step guide including:
   - How to clone and install
   - How to set up Cloudinary account
   - Environment variables needed
   - How to run the project
4. **Architecture Decisions** - Explain your choices:
   - Folder structure rationale
   - State management approach
   - API client design
5. **Token Refresh Implementation** - Explain how it works
6. **Trade-offs** - What you would do differently with more time
7. **Screenshots/GIF** - Demo of key features

### Deployment

- Deploy to Vercel or Netlify
- Provide live demo URL
- Ensure all features work in production

### Environment Variables Example

```env
# .env.example
VITE_API_BASE_URL=https://dummyjson.com
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

---

## Submission Instructions

Please submit your **GitHub repository link** along with a **live deployed URL** to:  
**info@aptechsolutions.io**

**Email Subject:**  
**Senior Frontend Developer Assignment – `<Your Name>`**

---

## Important Submission Notes

Submissions may be rejected if:

- The application does not run successfully
- Tokens or secrets are hardcoded in the codebase
- The GitHub repository is private or inaccessible

---

## Timeline Suggestion

| Phase               | Time    | Tasks                                               |
| ------------------- | ------- | --------------------------------------------------- |
| Setup & Auth        | 2 hrs   | Project setup, auth flow, token refresh             |
| Layout & Navigation | 1.5 hrs | Sidebar, header, routing, theme                     |
| Dashboard           | 1 hr    | Stats cards, charts                                 |
| Product List        | 2 hrs   | Table, pagination, search, filters, URL sync        |
| Product CRUD        | 1.5 hrs | Add/Edit forms, delete, image upload                |
| Users & Settings    | 0.5 hr  | Users list, settings page                           |
| Polish & Testing    | 1.5 hrs | Error handling, loading states, responsive, testing |

**Total: ~10 hours**

---

## Questions?

If you have any clarifying questions about the requirements, please email them within the first 24 hours. We will respond promptly.

---

## Important Notes

1. **Focus on quality over quantity** - It's better to have fewer features done well than all features done poorly.

2. **Show your thinking** - Use meaningful commit messages and document your decisions in the README.

3. **Handle edge cases** - We will test error scenarios, empty states, and unusual inputs.

4. **AI Tool Usage** - You may use AI tools for assistance. Please disclose usage in your README and be prepared to explain any code you submit.

5. **Don't over-engineer** - Build what's asked. Unnecessary complexity is a negative signal.

---

**Good luck! We're excited to see your work.**

---

_Aptech Solutions - info@aptechsolutions.io_
