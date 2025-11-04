# 🏋️ Murph

A modern workout tracking application for the legendary Murph CrossFit workout. Track your progress, compete on leaderboards, and connect with fellow athletes.

## What is Murph?

The **Murph** is a CrossFit workout named after Navy Lieutenant Michael Murphy, who was killed in action in Afghanistan in 2005. It's a challenging workout that consists of:

1. **1 mile run**
2. **100 pull-ups**
3. **200 push-ups**
4. **300 squats**
5. **1 mile run**

All for time, and often performed with a weighted vest (20 lbs for men, 14 lbs for women).

## Features

### 🎯 Workout Tracking
- **Real-time stopwatch** with precise timing
- **Progressive rep tracking** for pull-ups, push-ups, and squats
- **Run distance tracking** with time-based validation
- **Auto-save to localStorage** - never lose your progress
- **Resume capability** - pick up where you left off if interrupted
- **Multiple workout variations** - Full, 3/4, Half, Quarter, or Incomplete Murph

### 📊 Leaderboards
- **Global leaderboard** - see how you rank against all athletes
- **Personal best tracking** - monitor your improvement over time
- **Workout history** - view all your past Murph attempts

### 👤 User Profiles
- **Personal profile** - view your workout history and statistics
- **Public profiles** - check out other athletes' performances
- **Progress visualization** - track your improvement over time

### 🏆 Social Features (Coming Soon)
- User search and discovery
- Follow system for connecting with other athletes
- Activity feed (global and following)
- Comments and encouragement on workouts

## Tech Stack

### Frontend
- **React 19** - Modern React with latest features
- **TypeScript** - Type-safe development
- **TanStack Router** - File-based routing with type safety
- **TanStack Query** - Powerful data synchronization
- **TanStack Start** - Full-stack React framework with SSR
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful, accessible component library

### Backend
- **Better Auth** - Modern authentication solution
- **Drizzle ORM** - Type-safe SQL toolkit
- **SQLite** - Lightweight, fast database
- **TanStack Router SSR** - Server-side rendering support

### Development Tools
- **Vite** - Fast build tool and dev server
- **Biome** - Fast linter and formatter
- **Vitest** - Fast unit test framework
- **T3Env** - Type-safe environment variables

## Getting Started

### Prerequisites

- **Node.js** 18+ and **pnpm** installed

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd murph
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
   - Copy `.env.example` to `.env` (if available)
   - Configure your database and authentication settings

4. Set up the database:
```bash
pnpm db:generate
pnpm db:migrate
# or
pnpm db:push
```

5. Start the development server:
```bash
pnpm dev
```

The app will be available at `http://localhost:3000`

## Available Scripts

### Development
```bash
pnpm dev          # Start development server on port 3000
pnpm build        # Build for production
pnpm start        # Start production server
pnpm serve        # Preview production build
```

### Database
```bash
pnpm db:generate  # Generate database migrations
pnpm db:migrate   # Run database migrations
pnpm db:push      # Push schema changes to database
```

### Code Quality
```bash
pnpm lint         # Run linter
pnpm format       # Format code
pnpm check        # Run linter and formatter
pnpm test         # Run tests
```

## Project Structure

```
murph/
├── src/
│   ├── components/      # React components
│   │   ├── ui/          # shadcn/ui components
│   │   └── ...          # Feature components
│   ├── routes/          # TanStack Router file-based routes
│   │   ├── _auth/       # Authentication routes
│   │   ├── _marketing/  # Public marketing pages
│   │   └── app/         # Protected app routes
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility functions and API
│   ├── db/              # Database schema and setup
│   └── integrations/    # Third-party integrations
├── public/              # Static assets
└── ...config files
```

## Development Guidelines

### Adding Components

This project uses [shadcn/ui](https://ui.shadcn.com/) for UI components. To add a new component:

```bash
pnpx shadcn@latest add button
```

### Adding Routes

TanStack Router uses file-based routing. Simply create a new file in `src/routes/` and the router will automatically pick it up.

Example:
```tsx
// src/routes/app/about.tsx
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/about")({
  component: AboutPage,
});

function AboutPage() {
  return <div>About</div>;
}
```

### Environment Variables

Environment variables are type-safe using T3Env. Add variables to `src/env/client.ts` or `src/env/server.ts` depending on where they're used.

```typescript
import { env } from "@/env";

console.log(env.VITE_APP_TITLE);
```

### State Management

- **TanStack Query** - For server state and data fetching
- **React hooks** - For local component state
- **LocalStorage** - For workout persistence (via custom hooks)

### Styling

- Use **Tailwind CSS** utility classes
- Follow the design system defined by shadcn/ui
- Custom styles go in `src/styles.css`

## Database Schema

The app uses Drizzle ORM with SQLite. Key tables:

- **users** - User accounts and profiles
- **murphs** - Workout records with timing data
- **follows** - User relationships (coming soon)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is private and proprietary.

## Acknowledgments

- The Murph workout honors the memory of Navy Lieutenant Michael Murphy
- Built with modern web technologies for the fitness community

---

**Built with ❤️ for the CrossFit community**
