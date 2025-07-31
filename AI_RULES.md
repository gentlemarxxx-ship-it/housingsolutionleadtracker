# AI Development Rules for contact-sync-pro

This document outlines the technical stack and provides clear rules for developing this application. Following these guidelines is crucial for maintaining code quality, consistency, and predictability.

## Tech Stack

This project is built with a modern, type-safe, and efficient stack:

-   **Framework:** [React](https://react.dev/) for building the user interface.
-   **Language:** [TypeScript](https://www.typescriptlang.org/) for static typing and improved developer experience.
-   **Build Tool:** [Vite](https://vitejs.dev/) for fast development and optimized builds.
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/) for utility-first styling.
-   **UI Components:** [shadcn/ui](https://ui.shadcn.com/) for a pre-built, accessible, and customizable component library.
-   **Routing:** [React Router](https://reactrouter.com/) for client-side navigation.
-   **Data Fetching & Server State:** [TanStack Query](https://tanstack.com/query/latest) for managing asynchronous operations, caching, and server state.
-   **Database & Backend:** [Supabase](https://supabase.com/) for the database, authentication, and other backend services.
-   **Forms:** [React Hook Form](https://react-hook-form.com/) for performant and flexible form management, validated with [Zod](https://zod.dev/).
-   **Icons:** [Lucide React](https://lucide.dev/) for a comprehensive and consistent set of icons.

## Library Usage Rules

To ensure consistency, please adhere to the following rules when adding or modifying features:

-   **UI Components:**
    -   **ALWAYS** use components from the `shadcn/ui` library (`@/components/ui/*`) when possible.
    -   Do **NOT** create custom components for functionality that already exists in `shadcn/ui` (e.g., Buttons, Dialogs, Inputs).
    -   New, reusable business-logic components should be created in `src/components/`.

-   **Styling:**
    -   **ONLY** use Tailwind CSS classes for styling.
    -   Do **NOT** write custom CSS files or use CSS-in-JS libraries. All styling should be done via `className`.

-   **Routing:**
    -   All page routes **MUST** be defined in `src/App.tsx` using `react-router-dom`.
    -   Page components should be located in the `src/pages/` directory.

-   **Data & State Management:**
    -   Use **TanStack Query** for all interactions with the backend (fetching, mutating data). The `useLeads` hook is a good example of this pattern.
    -   For client-side state that is simple and local to a component, use React's built-in `useState` or `useReducer` hooks.

-   **Database:**
    -   All database interactions **MUST** go through the Supabase client, which can be imported from `@/integrations/supabase/client`.
    -   Do **NOT** interact with the database using any other method.

-   **Forms:**
    -   Use **React Hook Form** for handling all forms.
    -   Use **Zod** for form validation schemas.

-   **Icons:**
    -   **ONLY** use icons from the `lucide-react` library.

-   **Notifications:**
    -   Use the `sonner` library for displaying toast notifications for events like success, error, or information.

-   **File Structure:**
    -   **Pages:** `src/pages/`
    -   **Reusable Components:** `src/components/`
    -   **Custom Hooks:** `src/hooks/`
    -   **Core Layout:** `src/components/Layout.tsx`
    -   **Utility Functions:** `src/lib/`