<img width="1352" height="878" alt="Screenshot 2025-08-20 at 11 55 18 PM" src="https://github.com/user-attachments/assets/b147e1c2-9b19-4349-a2c4-76ac9ce81c2f" /># Beautify - Premium Beauty E-commerce Platform

A modern, full-stack e-commerce platform for premium beauty products built with Next.js 14, Supabase, and Tailwind CSS. Features a responsive design, user authentication, shopping cart, wishlist functionality, and admin dashboard.

### Deployed Site:- https://beautify1111.vercel.app

<img width="1352" height="878" alt="Screenshot 2025-08-20 at 11 55 34 PM" src="https://github.com/user-attachments/assets/3cfc6ffe-4898-471a-bcff-25aef13c7b61" />

## ✨ Features

### 🛍️ Customer Features
- **Product Catalog** - Browse premium beauty products with detailed descriptions
- **User Authentication** - Secure login, registration, and password recovery
- **Shopping Cart** - Add products, manage quantities, and checkout
- **Wishlist** - Save favorite products for later
- **User Profile** - Manage personal information and order history
- **Responsive Design** - Optimized for desktop, tablet, and mobile devices
- **Dark/Light Theme** - Toggle between themes with system preference support

### 👨‍💼 Admin Features
- **Admin Dashboard** - Comprehensive overview of store metrics
- **Product Management** - Add, edit, and manage product inventory
- **Order Management** - View and process customer orders
- **User Management** - Monitor customer accounts and activity
- **Analytics** - Track sales, popular products, and customer insights

### 🎨 Design Features
- **Modern UI/UX** - Clean, elegant design focused on beauty products
- **Smooth Animations** - Scroll-triggered animations and micro-interactions
- **Accessibility** - WCAG compliant with proper ARIA labels
- **Performance Optimized** - Fast loading with Next.js optimizations

## 🚀 Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) with App Router
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL)
- **Authentication**: Supabase Auth
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **TypeScript**: Full type safety
- **Deployment**: [Vercel](https://vercel.com/)

## 📋 Prerequisites

Before you begin, ensure you have:
- Node.js 18+ installed
- A Supabase account and project
- Git installed on your machine

## 🛠️ Installation & Setup

### 1. Clone the Repository
\`\`\`bash
git clone <your-repo-url>
cd beautify-ecommerce
npm install
\`\`\`

### 2. Set Up Supabase Integration

#### Option A: Using v0 (Recommended)
1. Open the project in [v0.app](https://v0.app)
2. Go to Project Settings → Integrations
3. Add Supabase integration
4. Follow the setup wizard to connect your Supabase project

#### Option B: Manual Setup
1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Project Settings → API
3. Copy your project URL and anon key
4. Add environment variables (see below)

### 3. Environment Variables

Create a `.env.local` file in the root directory:

\`\`\`env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Development URL for auth redirects
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000
\`\`\`

### 4. Database Setup

Run the following SQL scripts in order (available in the `scripts/` folder):

1. **Create Tables**: `scripts/create-tables.sql`
2. **Seed Products**: `scripts/seed-products.sql`
3. **Setup RLS**: `scripts/setup-rls.sql`
4. **Create Address Tables**: `scripts/create-address-tables.sql`
5. **Alter Products Table v2**: `scripts/alter-products-table-v2.sql`
6. **Alter Products Table v3**: `scripts/alter-products-table-v3.sql`
7. **Setup Cart/Wishlist RLS**: `scripts/setup-cart-wishlist-rls.sql`
8. **Alter Orders Table v2**: `scripts/alter-orders-table-v2.sql`

#### Using v0:
The setup steps above will automatically run these scripts for you.

#### Manual Setup:
1. Open Supabase Dashboard → SQL Editor
2. Copy and paste each script in order
3. Run each script individually

### 5. Start Development Server

\`\`\`bash
npm run dev
\`\`\`

Visit [http://localhost:3000](http://localhost:3000) to see your application.

## 📁 Project Structure

\`\`\`
beautify-ecommerce/
├── app/                          # Next.js App Router
│   ├── (admin)/                  # Admin routes
│   │   └── admin/
│   │       ├── dashboard/
│   │       ├── products/
│   │       ├── orders/
│   │       └── users/
│   ├── auth/                     # Authentication pages
│   │   ├── login/
│   │   ├── register/
│   │   └── forgot-password/
│   ├── products/                 # Product pages
│   ├── cart/                     # Shopping cart
│   ├── profile/                  # User profile
│   ├── api/                      # API routes
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Homepage
│   └── globals.css               # Global styles
├── components/                   # Reusable components
│   ├── ui/                       # shadcn/ui components
│   ├── admin/                    # Admin-specific components
│   ├── auth/                     # Authentication components
│   └── [feature-components]      # Feature-specific components
├── hooks/                        # Custom React hooks
├── lib/                          # Utility functions
│   ├── supabase/                 # Supabase client & utilities
│   └── utils.ts                  # General utilities
├── scripts/                      # Database scripts
└── types/                        # TypeScript type definitions
\`\`\`

## 🔐 Authentication

The app uses Supabase Auth with email/password authentication:

- **Registration**: Users can create accounts with email verification
- **Login**: Secure login with session management
- **Password Recovery**: Email-based password reset
- **Protected Routes**: Automatic redirection for authenticated routes
- **Admin Access**: Role-based access control for admin features

## 🛒 Key Features Explained

### Shopping Cart
- Persistent cart using Supabase database
- Real-time quantity updates
- Guest cart support with session storage
- Automatic cart merge on login

### Product Management
- Rich product details with multiple images
- Category and subcategory organization
- Inventory tracking
- Price management with discounts

### Order Processing
- Secure checkout process
- Order status tracking
- Email notifications
- Order history for users

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Using v0**:
   - Click the "Deploy" button in the top right
   - Follow the deployment wizard

2. **Manual Deployment**:
   \`\`\`bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Deploy
   vercel
   \`\`\`

3. **Environment Variables**:
   - Add all environment variables in Vercel dashboard
   - Update `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL` to your production URL

### Other Platforms
The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🧪 Testing

\`\`\`bash
# Run tests (when implemented)
npm run test

# Run linting
npm run lint

# Type checking
npm run type-check
\`\`\`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow the existing code style and conventions
- Add TypeScript types for new features
- Test your changes thoroughly
- Update documentation as needed

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check this README and inline code comments
- **Issues**: Open an issue on GitHub for bugs or feature requests
- **Community**: Join discussions in the repository

## ⚠️ Note:- User's might see the below error since a proper payment gateway is not added to the site...Still the orders will be properly visble in the orders section when a user places an order.

**Order Failed 
User not authenticated.**

---
