# Escrow Central

A modern, enterprise-grade financial escrow management system built with Next.js, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Modern Tech Stack**: Next.js 15, TypeScript, Tailwind CSS
- **State Management**: Zustand for lightweight, performant state management
- **Atomic Design**: Well-structured component architecture
- **Responsive Design**: Mobile-first approach with tablet and desktop support
- **Type Safety**: 100% TypeScript with strict typing
- **Performance**: Optimized with code splitting and lazy loading
- **Error Handling**: Comprehensive error boundaries and error pages
- **Theme Support**: Light/dark mode with system preference detection
- **Form Handling**: Custom hooks for form validation and state management
- **API Integration**: Custom hooks for API calls with loading states

## 🏗️ Architecture

### Atomic Design Structure

```bash
src/
├── components/
│   ├── atoms/          # Basic building blocks (Button, Input, etc.)
│   ├── molecules/      # Simple combinations (Card, SearchBar, etc.)
│   ├── organisms/      # Complex components (DataTable, Header, etc.)
│   └── templates/      # Page layouts (DashboardLayout, etc.)
├── hooks/              # Custom React hooks
├── store/              # Zustand state management
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
├── constants/          # Application constants
└── lib/                # Third-party library configurations
```

### State Management

The application uses Zustand for state management with the following slices:

- **User Slice**: Authentication and user data
- **Project Slice**: Project management and filtering
- **Transaction Slice**: Transaction data and operations
- **UI Slice**: Theme, sidebar, modals, and notifications

### Component Architecture

- **Atoms**: Reusable UI primitives (Button, Input, Select, etc.)
- **Molecules**: Composite components (Card, SearchBar, etc.)
- **Organisms**: Complex business components (DataTable, Header, etc.)
- **Templates**: Page layouts and structure

## 🛠️ Development

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd escrow

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run start           # Start production server

# Code Quality
npm run lint            # Run ESLint
npm run lint:fix        # Fix ESLint errors
npm run format          # Format code with Prettier
npm run format:check    # Check code formatting
npm run type-check      # Run TypeScript type checking

# Testing
npm run test            # Run tests
npm run test:watch      # Run tests in watch mode
npm run test:coverage   # Run tests with coverage

# Storybook
npm run storybook       # Start Storybook
npm run build-storybook # Build Storybook
```

### Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## 📁 Project Structure

```
escrow/
├── src/
│   ├── app/                    # Next.js App Router pages
│   ├── components/             # React components (Atomic Design)
│   ├── hooks/                  # Custom React hooks
│   ├── store/                  # Zustand state management
│   ├── types/                  # TypeScript type definitions
│   ├── utils/                  # Utility functions
│   ├── constants/              # Application constants
│   └── lib/                    # Third-party configurations
├── public/                     # Static assets
├── .husky/                     # Git hooks
├── .eslintrc.json             # ESLint configuration
├── .prettierrc                # Prettier configuration
├── tailwind.config.js         # Tailwind CSS configuration
├── tsconfig.json              # TypeScript configuration
└── package.json               # Dependencies and scripts
```

## 🎨 Styling

The application uses Tailwind CSS with a custom design system:

- **Colors**: Primary, secondary, success, warning, error palettes
- **Typography**: Custom font stack with Outfit font
- **Spacing**: Consistent spacing scale
- **Shadows**: Custom shadow variants
- **Animations**: Built-in animation classes
- **Dark Mode**: Full dark mode support

### Custom Theme

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          /* Custom primary colors */
        },
        secondary: {
          /* Custom secondary colors */
        },
        // ... other color palettes
      },
      // ... other theme customizations
    },
  },
}
```

## 🔧 Configuration

### TypeScript

Strict TypeScript configuration with:

- `noUnusedLocals`: Error on unused variables
- `noUnusedParameters`: Error on unused parameters
- `noImplicitReturns`: Require explicit return types
- `noUncheckedIndexedAccess`: Safer array/object access
- `exactOptionalPropertyTypes`: Strict optional property handling

### ESLint

Comprehensive linting rules:

- Next.js recommended rules
- TypeScript strict rules
- Prettier integration
- Custom rules for code quality

### Prettier

Consistent code formatting:

- Single quotes
- No semicolons
- 2-space indentation
- 80 character line length

## 🧪 Testing

The project includes:

- **Jest**: Unit testing framework
- **React Testing Library**: Component testing utilities
- **Storybook**: Component documentation and testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your repository to Vercel
2. Configure environment variables
3. Deploy automatically on push to main branch

### Other Platforms

The application can be deployed to any platform that supports Next.js:

- Netlify
- AWS Amplify
- DigitalOcean App Platform
- Railway

## 📚 API Integration

The application includes custom hooks for API integration:

```typescript
// Example usage
const { data, loading, error, get } = useGet<User[]>('/users')

// Fetch data
useEffect(() => {
  get()
}, [get])
```

## 🔒 Security

- Input validation on both client and server
- XSS protection with proper escaping
- CSRF protection with Next.js built-in features
- Secure headers with Next.js configuration

## 📱 Responsive Design

The application is fully responsive with:

- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+

## 🎯 Performance

- Code splitting with dynamic imports
- Image optimization with Next.js Image component
- Lazy loading for components and routes
- Optimized bundle size
- Core Web Vitals optimization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

### Code Style

- Follow the existing code style
- Use TypeScript for all new code
- Write tests for new features
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Check the documentation
- Review the code examples

---

Built with ❤️ using Next.js, TypeScript, and Tailwind CSS
