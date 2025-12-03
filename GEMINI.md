# Gemini Context File for StudioFund

## Project Overview
**StudioFund** is a modern web application built with Next.js 15, focusing on funding/investment management (inferred from name/structure). It uses a clean, component-based architecture with `shadcn/ui` and Tailwind CSS.

## Tech Stack
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** `shadcn/ui` (Radix UI primitives)
- **State Management:** React Context (Auth)
- **Backend Integration:** Firebase / Genkit (AI)

## Key Directories
- `src/app`: Next.js App Router pages and layouts.
  - `(app)`: Authenticated application routes (Dashboard, etc.).
  - `(auth)`: Authentication routes (Login, Register).
  - `admin`: Admin dashboard routes.
- `src/components`: React components.
  - `ui`: Reusable atomic components (Buttons, Inputs, etc.).
  - `app`, `admin`, `auth`: Feature-specific components.
- `src/lib`: Utilities, API clients, and type definitions.
- `src/contexts`: Global state providers.

## Design System
The design system is centralized in `src/app/globals.css` using CSS variables for theming.
- **Colors:** Defined as HSL variables (e.g., `--primary`, `--background`).
- **Typography:** Custom utility classes in `globals.css` (e.g., `.text-display-lg`).
- **Font:** Inter (via `next/font/google`).

## Development Workflow
- **Package Manager:** npm
- **Dev Server:** `npm run dev` (Standard Next.js)
- **Linting:** ESLint

## Current Task
- **Objective:** Redesign UI/UX to be "Premium", "White Background", with "Lighter Econet Blue" accents.
- **Constraint:** Keep endpoints functional.
