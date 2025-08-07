# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
```bash
npm run dev          # Start development server on http://localhost:3000
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Type Checking
```bash
npx tsc --noEmit     # Run TypeScript type checking
```

### Testing
No test runner is currently configured. Consider adding:
```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
npm install --save-dev @types/jest
```

## Architecture Overview

### Technology Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (with `strict: false` in tsconfig.json)
- **Styling**: Tailwind CSS with custom UI components
- **Database**: Supabase/Neon (optional - demo mode works without)
- **Payment**: Stripe (optional - demo mode works without)
- **Email**: Resend/SMTP (optional)
- **External API**: Tourplan SOAP API for tour inventory

### Key Architecture Patterns

#### 1. Client-Server Separation
- **Client Components** (`'use client'`): Interactive UI in `app/page.tsx`, `components/`
- **Server Components**: API routes in `app/api/`
- **API Routes**: All external integrations handled server-side

#### 2. Tourplan Integration
The application integrates with Tourplan's SOAP API for real tour data:
- **Primary Client**: `lib/tourplan-api.ts` - Main TypeScript client
- **XML Client**: `lib/api/tourplan/xmlTourplanClient.ts` - Enhanced XML handling
- **Proxy Route**: `app/api/tourplan/route.ts` - Handles retries and error recovery

Key Tourplan patterns:
```typescript
// Search tours
const api = new TourplanAPI()
const result = await api.searchTours({ destination, buttonName, info })

// Create booking
const booking = await api.createBooking({ tourId, startDate, customerDetails })
```

#### 3. API Route Structure
```
app/api/
├── tours/search/         # Tour search with demo fallback
├── bookings/create/      # Booking creation (requires payment verification)
├── create-payment-session/ # Stripe payment session
├── tourplan/            # Direct Tourplan proxy
└── health/              # System health checks
```

#### 4. Environment Configuration
Managed through `lib/env.ts` with Zod validation:
- Tourplan credentials (optional for demo mode)
- Database connections (optional)
- Payment keys (optional)
- All validated at runtime

#### 5. Demo Mode Architecture
The app works fully in demo mode without external services:
- Mock tour data in `app/api/tours/search/route.ts`
- Simulated payment flow
- Local booking storage

### Critical Business Logic

#### Tour Search Flow
1. User selects search criteria in `app/page.tsx`
2. Frontend calls `/api/tours/search` 
3. API attempts Tourplan search, falls back to mock data
4. Results displayed with availability status

#### Booking Creation Flow
1. Customer fills booking form with tour selection
2. Payment processed through Stripe
3. **CRITICAL**: Booking only created after payment verification
4. Tourplan booking attempted via `AddServiceRequest`
5. Local booking record created regardless

#### Pricing Extraction (WordPress Compatible)
The app uses WordPress-compatible pricing logic:
```typescript
// Extract lowest twin rate from Tourplan XML
// Display price = Math.ceil(twinRate / 200)
```

### Common Development Tasks

#### Adding New Tour Types
Edit `searchTypeConfigs` in `app/page.tsx`:
```typescript
'NewType': {
  buttonName: 'Tourplan Button Name',
  info: 'GMFT',  // Tourplan info parameter
  description: 'User-facing description',
  status: 'active'
}
```

#### Modifying Tourplan Integration
1. Main client: `lib/tourplan-api.ts`
2. XML operations: `lib/api/tourplan/xmlTourplanClient.ts`
3. Proxy/retry logic: `app/api/tourplan/route.ts`

#### Adding API Endpoints
1. Create route file: `app/api/[endpoint]/route.ts`
2. Export async functions: `POST`, `GET`, etc.
3. Use `NextResponse.json()` for responses
4. Handle errors with appropriate status codes

### Environment Setup

Required for production:
```env
# Tourplan API
TOURPLAN_API_URL=https://your-instance.tourplan.net/api
TOURPLAN_USERNAME=your-username
TOURPLAN_PASSWORD=your-password
TOURPLAN_AGENT_ID=your-agent-id

# App URL
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

Optional services:
- Stripe keys for payments
- Resend API key for emails
- Database URLs for persistence

### Security Considerations
- All sensitive operations server-side only
- Payment verification before booking creation
- Environment variables validated with Zod
- API routes handle authentication/authorization
- Never expose Tourplan credentials to client

### Deployment Notes
- Vercel: Use `vercel.json` configuration
- Build ignores TypeScript/ESLint errors (see `next.config.mjs`)
- Consider enabling strict mode for production
- AWS proxy may be needed for IP whitelisting with Tourplan