# Fitrah Beard Oil - Premium E-Commerce Store 🌿

Fitrah is a modern, high-performance e-commerce platform built specifically for premium beard oil products. It features a complete customer-facing storefront and a powerful, custom-built Admin Dashboard with integrated analytics.

## 🌟 Key Features

### 🛍️ Storefront (Customer Facing)
- **Cinematic Landing Page:** Immersive hero carousel with lazy-loaded videos and `framer-motion` animations.
- **Product Catalog:** Dynamic product listing fetched directly from Supabase.
- **Shopping Cart & Checkout:** Seamless cart management using Context API and a clean checkout flow.
- **User Authentication:** Sign up, login, and profile management with Supabase Auth.
- **Order Tracking:** Customers can track their recent orders and view their history.
- **Multi-Currency Support:** Ability to switch between currencies based on settings.

### ⚙️ Admin Dashboard
- **Sales & Traffic Analytics:** Fully interactive custom analytics dashboard mimicking Shopify, built with `recharts`.
- **Date Filters & PDF Export:** Custom date range picker and instant PDF report generation using `react-to-print`.
- **In-App Page Views Tracking:** Native tracking of visitors and page views directly into Supabase without relying on third-party iframes.
- **Order Management:** View, update, and manage order statuses (Pending, Processing, Shipped, Delivered).
- **Customer Management:** View registered users and securely manage accounts.
- **Dynamic Site Settings:** Control promotional banners, discount codes, and newsletter toggles from the dashboard.

## 🛠️ Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router, Server Actions)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Database & Auth:** [Supabase](https://supabase.com/) (PostgreSQL)
- **Charts:** [Recharts](https://recharts.org/)
- **Email:** Nodemailer (SMTP integration for order confirmations)
- **Deployment:** [Vercel](https://vercel.com)

## 🚀 Getting Started

### 1. Prerequisites
Ensure you have Node.js (v18+) and npm installed.

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Environment Variables
Create a `.env.local` file in the root of the project and add your keys:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# SMTP Email Settings
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM="Fitrah <your_email@gmail.com>"
```

### 4. Database Setup (Supabase)
Ensure the following core tables are created in your Supabase SQL Editor:
- `products` (id, name, description, price, image_url, etc.)
- `orders` (id, user_id, customer_name, total_amount, status, created_at, etc.)
- `page_views` (id, path, session_id, created_at)
- `site_settings` (newsletter_enabled, newsletter_discount_percent, etc.)

*Note: RLS (Row Level Security) policies must be configured correctly for public reads and authenticated admin writes.*

### 5. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📂 Project Structure

- `/src/app`: Next.js App Router pages (Admin routes, Shop, Checkout, Account).
- `/src/components`: Reusable UI components (Navbar, Footer, GallerySlider, LazyVideo).
- `/src/context`: React Context providers for Cart and Currency states.
- `/src/utils`: Helper functions, Supabase clients (Client, Server, Admin), and Mailer.
- `/public`: Static assets, images, and videos.

## 📝 License
Proprietary software. Created for Fitrah Beard Oil. All rights reserved.
