# Maslow NYC Codebase AI Instructions

## Project Overview
**Maslow NYC** is a React + Vite web application for "The Infrastructure of Dignity" - a mission-driven platform combining membership, e-commerce, and community features with role-based access control.

**Tech Stack:**
- React 18.3 + React Router 7 (client-side routing)
- Vite 7 (build tool with custom plugins)
- Supabase (auth + database)
- Stripe (payments)
- Tailwind CSS 3.4 (styling with custom design system)
- Radix UI (headless component library)

---

## Architecture & Key Components

### Core Context Providers (src/contexts/)
The app wraps content in three essential providers in nested order:
- **AuthProvider** (SupabaseAuthContext): Manages user sessions and `isFounder` admin flag via Supabase `profiles.is_admin`
- **StripeProvider**: Initializes Stripe Elements from `VITE_STRIPE_PUBLISHABLE_KEY`
- **CartProvider**: Local state for e-commerce cart (persisted to localStorage as `e-commerce-cart`)

All three are required; omitting any breaks features.

### Routing & Protected Routes (src/App.jsx)
Routes are organized by access level:
- **Public**: `/` (hero), `/login`, `/vision`
- **Protected (logged-in users)**: `/hull`, `/lotus`, `/impact`, `/membership`, `/profile`, `/store`, `/product/:id`
- **Founder-only**: `/admin`, `/concierge` (checked via `requireFounder` prop in ProtectedRoute)

Header/Footer hide on `/login` and public homepage via `isHideHeaderPath` logic.

### State Management Patterns
- **Auth State**: Via AuthContext hooks (`useAuth`) - exposes `{ user, loading, isFounder }`
- **Cart State**: Via CartContext hook (`useCart`) - exposes methods like `addToCart()`, `removeItem()` with inventory checks
- **Form/UI State**: Component-level useState (no global state tool like Redux)

### Data Flows
1. **Authentication**: Supabase auth → session listener updates AuthContext → ProtectedRoute checks `user && !requireFounder || isFounder`
2. **E-commerce**: Hostinger API (`EcommerceApi.js`) fetches products → CartProvider manages cart → Stripe processes payments
3. **Inventory**: `formatCurrency()` handles currency conversion; `manage_inventory` flag controls stock validation

---

## Development Workflows

### Running the Application
```bash
npm run dev          # Start dev server on localhost:3000 with hot reload
npm run build        # Generate llms.txt + Vite bundle (see build hook below)
npm run preview      # Preview production build locally
```

### Build Process
The **build** script runs a pre-build step (`tools/generate-llms.js || true`) before Vite bundling. This generates `public/llms.txt` (used for LLM context). The `|| true` ensures build continues if generation fails.

### Environment Setup
Required `.env` variables (add to project root):
```env
VITE_SUPABASE_URL=<your-supabase-url>
VITE_SUPABASE_ANON_KEY=<your-supabase-key>
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_... (optional, has fallback in StripeContext)
```

Supabase and Stripe keys must be present; missing them throws errors in `customSupabaseClient.js`.

---

## Custom Vite Plugins (src/plugins/)

The project includes four specialized Vite plugins—understand these to avoid breaking builds:

### 1. **Visual Editor Plugin** (vite-plugin-react-inline-editor.js)
- Enables in-app live editing of JSX text/attributes
- Uses Babel AST parsing to locate and modify editable elements
- Whitelist: `EDITABLE_HTML_TAGS = ["a", "Button", "button", "p", "span", "h1-h6", "label", "img"]`
- Do NOT edit JSX files without understanding how edit IDs map to positions (format: `filePath:line:column`)

### 2. **Selection Mode Plugin** (vite-plugin-selection-mode.js)
- Adds selection/highlighting UI for interactive demos
- Injects `selection-mode-script.js` at dev/build time
- Used alongside visual editor for CMS-like experience

### 3. **Edit Mode Plugin** (vite-plugin-edit-mode.js)
- Dev-only mode toggle for in-app editing features
- Injects `edit-mode-script.js` (check both for feature gates)
- Related to inline editor but separate concern

### 4. **Iframe Route Restoration Plugin** (vite-plugin-iframe-route-restoration.js)
- Handles route restoration when app loads inside iframes
- Preserves URL state across iframe boundaries

**Never modify plugin logic without understanding Vite HMR (Hot Module Replacement) implications.**

---

## Design System & Styling

### Color Palette (tailwind.config.js)
Brand colors via `maslow.` namespace:
- `maslow-blue: #3B5998` (primary)
- `maslow-cream: #F5F1E8` (secondary)
- `maslow-gold: #C5A059` (accent)

Also aliased as `primary`, `secondary`, `accent` for consistency.

### Component Library Pattern (src/components/ui/)
Radix UI components wrapped with Tailwind styling:
- `button.jsx`, `dialog.jsx`, `card.jsx`, `tabs.jsx`, `alert-dialog.jsx`, etc.
- Use `cn()` utility (from `lib/utils.js`) to merge class names safely
- Example: `cn("px-4 py-2", disabled && "opacity-50")`

### Utility Functions
- **`cn()`** (lib/utils.js): Combines classnames using `clsx` + `tailwind-merge`
- **`formatCurrency()`** (api/EcommerceApi.js): Converts cent amounts to localized currency strings

---

## Feature Flags & Configuration

### Feature Flags (src/config/featureFlags.js)
```javascript
export const featureFlags = {
  enablePayments: false,  // Stripe integration toggle
  enableStore: true,       // E-commerce storefront toggle
};
```
Check flags in components before rendering payment/store features.

### Payment Integration (src/config/stripePaymentLinks.js)
Contains Stripe product/price IDs for checkout flows. Update when Stripe dashboard changes product configurations.

---

## Common Patterns & Conventions

### Component Structure
```jsx
// Typical pattern:
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useCart } from '@/hooks/useCart';

export default function MyComponent() {
  const { user, isFounder } = useAuth();
  const { cartItems, addToCart } = useCart();

  if (!user) return <div>Please log in</div>;
  
  return ( /* JSX */ );
}
```

### Error Handling
- **Supabase errors**: Check for `.error` in response objects; log to console
- **Stripe errors**: Handle in payment flow; StripeContext initializes with test key fallback
- **Inventory errors**: `addToCart()` rejects Promise with descriptive message

### API Integration
- E-commerce API: Uses Hostinger endpoint (`https://api-ecommerce.hostinger.com`) with store ID `store_01KET78XMJHGPEPK2PBY8D6RT0`
- No proxy; API calls happen client-side (watch for CORS issues in production)

### Path Aliases
Import paths use `@/` alias (configured in Vite):
```jsx
import { useAuth } from '@/contexts/SupabaseAuthContext';  // Resolves to src/
import Button from '@/components/ui/button';
```

---

## Testing & Debugging Tips

- **Dev Server Issues**: Check Vite error overlay (error handler in `vite.config.js` intercepts errors for clarity)
- **Cart Persistence**: Clear `e-commerce-cart` from localStorage to reset state
- **Auth Issues**: Check browser console for Supabase subscription errors; verify `.env` keys
- **Build Failures**: If `tools/generate-llms.js` fails, build continues (due to `|| true`) but `llms.txt` won't update
- **Styling**: Use Tailwind `@apply` or inline Tailwind classes; avoid inline CSS for brand colors

---

## Files to Know

- Entry Point: src/main.jsx, src/App.jsx
- Context Setup: src/contexts/ (Auth, Stripe, Cart)
- Pages: src/pages/ (route targets)
- Shared UI: src/components/ui/ (Radix-wrapped components)
- Config: src/config/featureFlags.js, src/config/stripePaymentLinks.js
- API: src/api/EcommerceApi.js (Hostinger integration)
- Build Config: vite.config.js (includes plugin setup)
- Tailwind Theme: tailwind.config.js (color system)

---

## Quick Troubleshooting

| Issue | Check |
|-------|-------|
| App doesn't start | `.env` vars present? Supabase/Stripe keys valid? |
| Routes inaccessible | User logged in? `ProtectedRoute` logic correct? |
| Cart items lost | localStorage enabled? Check browser dev tools |
| Styling looks broken | Tailwind watch mode running? Config extends applied? |
| Inline editing not working | Plugin loaded in dev? Edit ID format correct? |
| Build hangs | Check `tools/generate-llms.js` for errors |
