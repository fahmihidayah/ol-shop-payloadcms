# 🚀 Payload Starter

A modern, full-stack web application built with **Payload CMS**, **Next.js 15**, and **React 19**. This starter template includes a beautiful, responsive UI with dark/light theme support, authentication, and a complete admin panel.

## ✨ Features

- 🎨 **Modern UI** - Built with shadcn/ui components and Tailwind CSS
- 🌙 **Dark/Light Theme** - Complete theme switching with next-themes
- 📱 **Fully Responsive** - Mobile-first design with responsive navigation
- 🔐 **Authentication Ready** - Login/register pages and user management
- 📊 **Content Management** - Powerful CMS with Payload
- ⚡ **Performance** - Built on Next.js 15 with React 19
- 🎯 **TypeScript** - Full type safety throughout the application
- 🛠 **Developer Experience** - Hot reload, ESLint, and modern tooling

## 🛠 Tech Stack

- **Framework**: Next.js 15
- **React**: React 19
- **CMS**: Payload CMS
- **Database**: PostgreSQL (configurable)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui + Radix UI
- **Icons**: Lucide React
- **Theme**: next-themes
- **State Management**: TanStack Query
- **TypeScript**: Full type safety
- **Package Manager**: pnpm

## 🚀 Quick Start

### Prerequisites

- Node.js 18.20.2+ or 20.9.0+
- pnpm 9+

### Development Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd payload-starter
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   Add your database connection string and other environment variables.

4. **Start the development server**
   ```bash
   pnpm dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

### First Time Setup

1. Visit the admin panel at `/admin`
2. Create your first admin user
3. Configure your collections and content

## 📁 Project Structure

```
src/
├── app/
│   ├── (frontend)/          # Public-facing pages
│   │   ├── layout.tsx       # Main layout with providers
│   │   ├── page.tsx         # Homepage
│   │   └── not-found.tsx    # 404 page
│   └── (payload)/           # Payload CMS admin
│       └── custom.scss      # Custom admin styling
├── collections/             # Payload CMS collections
│   ├── Users/
│   │   └── config.ts        # User collection with UUID
│   ├── Posts/
│   │   └── config.ts        # Blog posts collection
│   ├── Categories/
│   │   └── config.ts        # Content categories
│   └── Media.ts             # Media uploads
├── fields/
│   └── slug.ts             # Reusable slug field
├── components/
│   ├── layouts/
│   │   └── navbar.tsx       # Responsive navigation
│   ├── ui/                  # shadcn/ui components
│   └── mode-toggle.tsx      # Theme switcher
├── providers/
│   ├── QueryProvider.tsx   # TanStack Query setup
│   └── ThemeProvider.tsx   # Theme provider
└── lib/
    └── utils.ts             # Utility functions
```

## 🎨 UI Components

This project uses [shadcn/ui](https://ui.shadcn.com/) components including:

- Navigation with responsive mobile menu
- Theme switching (light/dark/system)
- Cards, buttons, and form components
- Custom 404 error page
- Accessible dialog/sheet components

## 🔧 Available Scripts

```bash
# Development
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server

# Payload CMS
pnpm payload      # Access Payload CLI
pnpm generate:types  # Generate TypeScript types

# Quality
pnpm lint         # Run ESLint
pnpm test         # Run tests
pnpm test:e2e     # Run E2E tests
```

## 🐳 Docker Setup (Optional)

For local development with Docker:

1. **Update environment variables**
   ```bash
   # In .env file
   MONGODB_URI=mongodb://127.0.0.1/<dbname>
   ```

2. **Start with Docker**
   ```bash
   docker-compose up -d
   ```

## 📝 Customization

### Adding New Pages
1. Create new files in `src/app/(frontend)/`
2. Use existing components from `src/components/ui/`
3. Follow the established patterns for styling

### Modifying Theme
- Edit `src/app/(frontend)/styles.css` for global styles
- Customize shadcn theme in `components.json`
- Add new color variables as needed

### Extending Components
- Add new UI components in `src/components/ui/`
- Create layout components in `src/components/layouts/`
- Follow shadcn/ui patterns for consistency

## 📊 Payload CMS Configuration

The Payload config is optimized for modern web applications with organized collections:

### Collection Architecture
Collections are organized in dedicated directories for better maintainability:
- Each collection has its own folder with a `config.ts` file
- Admin grouping for logical organization in the dashboard
- UUID-based IDs for all collections instead of auto-increment

### 👥 Users Collection (`/collections/Users/`)
- **Group**: User Management
- **Features**: Auth-enabled with admin panel access
- **ID**: UUID-based for better security
- **Fields**: Email (default), extensible for custom user fields

### 📝 Posts Collection (`/collections/Posts/`)
- **Group**: Content
- **Features**: Rich text content management with full blog functionality
- **ID**: UUID-based
- **Fields**: 
  - Title, slug (auto-generated), rich text content
  - Excerpt, featured image, categories (relationship)
  - Published date, status (draft/published/archived)
  - Timestamps for created/updated tracking

### 🏷️ Categories Collection (`/collections/Categories/`)
- **Group**: Content
- **Features**: Hierarchical content organization
- **ID**: UUID-based
- **Fields**:
  - Name, slug (auto-generated), description
  - Color coding for visual organization
  - Parent relationship for nested categories
  - Timestamps for tracking

### 📁 Media Collection
- **Features**: Upload-enabled collection with image optimization
- Pre-configured sizes and focal point support
- Automatic resizing and format conversion

### Admin Organization
Collections are grouped in the admin panel:
- **User Management**: Users
- **Content**: Posts, Categories
- **Media**: Media uploads

For more details, see the [Payload Collections documentation](https://payloadcms.com/docs/configuration/collections).

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
This Next.js application can be deployed on any platform that supports Node.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🛠 Development Tips

### Code Quality
- ESLint and Prettier are pre-configured
- TypeScript strict mode enabled
- Automatic code formatting on save

### Performance
- Next.js 15 with React 19 for optimal performance
- Image optimization with Next.js Image component
- Lazy loading and code splitting built-in

### Accessibility
- shadcn/ui components are built with accessibility in mind
- ARIA labels and keyboard navigation included
- Color contrast optimized for WCAG compliance

## 📚 Learn More

- [Payload CMS Documentation](https://payloadcms.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 💬 Support

If you have any issues or questions:
- Create an issue on GitHub
- Join the [Payload Discord](https://discord.com/invite/payload)
- Check the [Payload documentation](https://payloadcms.com/docs)
