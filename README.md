# Expo React Native Boilerplate

A modern, production-ready React Native boilerplate built with Expo SDK 53, TypeScript, and best practices for rapid mobile app development.

## 🚀 Features

- **Expo SDK 53** - Latest Expo framework with React Native 0.79.5
- **TypeScript** - Full type safety with strict mode enabled
- **Expo Router v5** - File-based routing with typed routes
- **Redux Toolkit** - Modern state management
- **Supabase Integration** - Authentication and backend services
- **Theme System** - Dark/light mode support with consistent styling
- **Custom Hooks** - Reusable logic for common functionality
- **ESLint 9** - Code quality and consistency
- **Jest Testing** - Unit testing setup
- **Husky Git Hooks** - Pre-commit quality checks

## 📱 Tech Stack

- **Frontend**: React Native, Expo SDK 53, TypeScript
- **Navigation**: Expo Router v5 (file-based routing)
- **State Management**: Redux Toolkit
- **Backend**: Supabase (Auth, Database)
- **Styling**: StyleSheet with theme system
- **Testing**: Jest, React Native Testing Library
- **Code Quality**: ESLint 9, Prettier, Husky

## 🏗️ Project Structure

```
app/                 # Expo Router routes (file-based routing)
├── (tabs)/          # Tab navigation routes
├── auth/            # Authentication routes
└── _layout.tsx      # Root layout

src/
├── components/      # Reusable UI components
│   ├── elements/    # Basic UI elements (Button, Input, etc.)
│   └── layouts/     # Layout components
├── scenes/          # Screen components (main UI logic)
├── hooks/           # Custom React hooks
├── slices/          # Redux Toolkit slices
├── services/        # API and external services
├── theme/           # Colors, fonts, styling system
├── types/           # TypeScript type definitions
└── utils/           # Utility functions

assets/              # Static assets (images, fonts)
```

## 🛠️ Setup

### Prerequisites

- Node.js 18+ and npm
- Expo CLI: `npm install -g @expo/cli`
- For iOS: Xcode and iOS Simulator
- For Android: Android Studio and Android Emulator

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd expoboilerplate
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env .env.local
   ```
   Update `.env.local` with your actual values:
   ```env
   EXPO_PUBLIC_SUPABASE_URL=your-supabase-url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   EXPO_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## 📱 Development

### Available Scripts

#### Development Commands
- `npm run dev` - Start development server for all platforms
- `npm run dev:ios` - Start for iOS simulator only
- `npm run dev:android` - Start for Android emulator only
- `npm run dev:web` - Start for web browser only
- `npm run dev:doctor` - Run Expo diagnostics

#### Building & Deployment
- `npm run dev:build:mobile` - Build iOS/Android with EAS Build
- `npm run dev:build:web` - Export static web app
- `npm run dev:serve:web` - Serve built web app locally
- `npm run dev:deploy:web` - Deploy to EAS Hosting

#### Code Quality
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run test` - Run Jest tests
- `npm run test:watch` - Run tests in watch mode

### Development Guidelines

#### Component Development
1. Use TypeScript interfaces for all props
2. Follow the established file structure
3. Use the theme system for consistent styling
4. Write tests for all components
5. Use existing hooks and utilities

#### State Management
- Use Redux Toolkit for global state
- Keep component state local when not shared
- Use `useAppSelector` and `useAppDispatch` hooks

#### Styling
- Import colors from `@/theme/colors`
- Use `StyleSheet.create` for performance
- Support dark/light mode through theme system
- Use spacing and typography from theme

## 🎨 Theme System

The project includes a comprehensive theme system supporting dark/light modes:

```typescript
import { colors, spacing, typography } from '@/theme';
import { useColorScheme } from '@/hooks';

function MyComponent() {
  const { isDark } = useColorScheme();
  const themeColors = colors(isDark);
  
  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      {/* Your component */}
    </View>
  );
}
```

## 🔐 Authentication

Built-in authentication system with Supabase:

- **Email/Password** authentication
- **Google OAuth** integration
- **Magic Link** authentication
- **Session management** with Redux
- **Protected routes** with authentication guards

## 🧪 Testing

Testing setup with Jest and React Native Testing Library:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm test -- --coverage
```

## 📦 Built-in Components

### UI Elements
- `Button` - Customizable button with theme support
- `Input` - Text input with validation
- `Card` - Container with elevation and styling
- `Loading` - Loading indicators
- `ScreenLayout` - Consistent screen wrapper

### Custom Hooks
- `useColorScheme` - Dark/light theme detection
- `useDataPersist` - Local storage operations
- `useKeyboard` - Keyboard state management

## 🚀 Deployment

### EAS Build (Recommended)

1. **Install EAS CLI**
   ```bash
   npm install -g eas-cli
   ```

2. **Configure EAS**
   ```bash
   eas build:configure
   ```

3. **Build for production**
   ```bash
   eas build --platform all
   ```

### Web Deployment

```bash
# Build for web
npm run dev:build:web

# Deploy to EAS Hosting
npm run dev:deploy:web
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Expo documentation](https://docs.expo.dev/)
2. Review the [React Native documentation](https://reactnative.dev/docs/getting-started)
3. Search existing [GitHub issues](https://github.com/your-repo/issues)
4. Create a new issue with detailed information

## 🙏 Acknowledgments

- [Expo](https://expo.dev/) for the amazing development platform
- [Supabase](https://supabase.com/) for backend services
- [Redux Toolkit](https://redux-toolkit.js.org/) for state management
- React Native community for continuous improvements

---

**Happy coding! 🎉**