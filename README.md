# URVA — Rural Products E-Commerce Platform

> **URVA — Delivering the Authentic Rural Aura**  
> A high-performance rural commerce platform built around the *“One Village – One Product”* initiative. Showcases authentic regional foods, tribal-origin products, eco-friendly goods, Swadesi handlooms, and nursery plants directly to consumers across India.

---

## 🏛️ System Architecture

The project is structured as a streamlined full-stack application optimized for serverless edge deployment on **Vercel**:

```
├── api/                       # Vercel Serverless Function Endpoints
│   ├── data/                  # Local fallback data persistence
│   │   └── store_banners.json # Fallback banner configuration store
│   └── index.js               # Unified Serverless REST API router
│
├── client/                    # Frontend React 18 + TypeScript Application
│   ├── public/                # Static public assets (icons, manifests)
│   ├── src/
│   │   ├── assets/            # Local images, logos, and vector assets
│   │   ├── components/        # Reusable UI components (Navbar, Footer, Cart, Checkout)
│   │   ├── constants/         # Category definitions, navigation links
│   │   ├── pages/             # Page views & Admin CMS Dashboard
│   │   ├── redux/             # Redux Toolkit state slices & RTK Query APIs
│   │   ├── types/             # TypeScript interfaces & domain models
│   │   ├── utils/             # Cloudinary helpers, analytics, service worker utils
│   │   ├── App.tsx            # Main application router & route boundaries
│   │   └── main.tsx           # Application entry point
│   ├── index.html             # HTML5 template with SEO meta tags & preconnects
│   ├── vite.config.ts         # Vite build configuration with chunk splitting
│   └── tsconfig.json          # TypeScript strict configuration
│
├── .env.example               # Root environment variable template
├── package.json               # Monorepo root scripts & backend dependencies
├── schema.sql                 # Canonical PostgreSQL schema & RLS policies
└── vercel.json                # Vercel routing, rewrites & deployment spec
```

---

## 🛠️ Technology Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) | Type-safe, component-driven user interface |
| **Bundler** | [Vite](https://vitejs.dev/) | Lightning-fast HMR and optimized production bundling |
| **State Management** | [Redux Toolkit](https://redux-toolkit.js.org/) | Global cart, user session, and modal state management |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) | Utility-first responsive design tokens |
| **Backend API** | Node.js Serverless Functions | Serverless Express-compatible handler (`/api/*`) |
| **Database** | [Supabase](https://supabase.com/) (PostgreSQL) | Managed relational database with Row Level Security |
| **Media CDN** | [Cloudinary](https://cloudinary.com/) | Auto-formatting, image optimization & unsigned uploads |
| **Payments** | [Razorpay](https://razorpay.com/) | UPI, Cards, NetBanking, and Wallets gateway integration |
| **Hosting** | [Vercel](https://vercel.com/) | Edge network CDN hosting with zero-config serverless support |

---

## 🚀 Key Features

### 🛒 Customer Storefront
- **High-Performance Architecture**: Native WebP/AVIF format auto-negotiation via Cloudinary, responsive image sets, script deferral, and aggressive bundle chunking.
- **Dynamic Banners**: CMS-managed Hero carousel and mid-page promotional banners with automatic fallback resilience.
- **Regional Discovery**: Category-based exploration for foods, textiles, tribal crafts, and plants.
- **Variant Selector**: Dynamic size, scent, and pack variant selection with live inventory adjustments.
- **Cart & Order Flow**: Instant quantity updates, coupon code engine, delivery tracking, and clean checkout modal.

### ⚙️ Admin CMS Dashboard
- **Collapsible Sidebar**: Clean, space-efficient administration layout with toggleable navigation.
- **Banner & Media Manager**: Real-time management of storefront carousel slides, video spotlights, and promotional placements.
- **Product Inventory**: Full CRUD capabilities for adding, updating, and categorizing catalog items.
- **Order Processing**: Live order stream with status updates (`Pending`, `Processing`, `Shipped`, `Delivered`).
- **Analytics & Demographics**: Sales overviews, top revenue categories, and monthly velocity charts.

---

## 🏁 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) `>= 18.0.0`
- [npm](https://www.npmjs.com/) `>= 9.0.0`

### 1. Installation

Clone the repository and install root dependencies:

```bash
git clone https://github.com/theshubhamgundu/urvaa.git
cd urvaa
npm install
cd client && npm install && cd ..
```

### 2. Environment Variables

Copy the provided `.env.example` templates to `.env`:

```bash
cp .env.example .env
cp client/.env.example client/.env
```

Configure your credentials in `.env`:
- **Supabase**: Set `SUPABASE_URL` and `SUPABASE_ANON_KEY`
- **Cloudinary**: Set `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET`
- **Razorpay**: Set `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`

### 3. Database Initialization

Execute the canonical schema script in your Supabase SQL Editor:
1. Open your Supabase Dashboard -> **SQL Editor**.
2. Copy and paste the contents of [`schema.sql`](./schema.sql).
3. Run the query to create all tables (`products`, `orders`, `categories`, `coupons`, `store_banners`, etc.) and enable Row Level Security policies.

### 4. Running Locally

Start the development server:

```bash
npm run dev
```

The application will be accessible at: **`http://localhost:5173`**

---

## 📦 Scripts Reference

| Command | Action |
| :--- | :--- |
| `npm run dev` | Starts the Vite development server with HMR |
| `npm run build` | Runs TypeScript compiler checks (`tsc`) and compiles production assets |
| `npm run lint` | Runs ESLint over the client source tree |

---

## 🔒 Security & Best Practices

- **Zero Hardcoded Secrets**: All sensitive API keys and secrets are loaded via environment variables.
- **Row Level Security (RLS)**: Enforced across all Supabase database tables to prevent unauthorized data manipulation.
- **Defensive API Architecture**: Fallback persistence ensures storefront banners and critical content remain operable even during database network interruptions.
- **Payment Verification**: Signature-based payment verification on the backend before marking orders as confirmed.

---

## 📄 License

This project is licensed under the [MIT License](./LICENSE).

**URVA** — *Delivering the Authentic Rural Aura.* 🌾
