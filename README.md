# This Is Africa - Booking Engine

A modern, responsive booking engine for "This Is Africa" tours and activities. Built with Next.js 14, TypeScript, and Tailwind CSS, featuring seamless Tourplan API integration and secure payment processing.

## 🌟 Features

- 🔍 **Advanced Tour Search** - Search tours by destination, dates, and preferences
- 📅 **Real-time Availability** - Check tour availability and pricing
- 💳 **Secure Payments** - Stripe integration with demo mode support
- 📱 **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- 🏢 **Tourplan Integration** - Direct integration with Tourplan API (with AWS proxy support)
- 📊 **Admin Dashboard** - Manage bookings and customers
- 📧 **Email Notifications** - Automated booking confirmations
- 🔒 **Secure & Scalable** - Built with modern security practices

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or pnpm
- Tourplan API credentials (optional for demo mode)
- Stripe account (optional for demo mode)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/tourplan-booking-engine.git
   cd tourplan-booking-engine
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Set up environment variables:**
   Create a `.env.local` file in the root directory:
   ```env
   # Tourplan API (Optional - demo mode works without these)
   TOURPLAN_API_URL=https://your-tourplan-api-url
   TOURPLAN_USERNAME=your-username
   TOURPLAN_PASSWORD=your-password
   TOURPLAN_AGENT_ID=your-agent-id
   TOURPLAN_PROXY_URL=https://your-aws-proxy-endpoint
   USE_TOURPLAN_PROXY=true

   # App URLs
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   APP_URL=http://localhost:3000

   # Stripe (Optional - demo mode works without these)
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

   # Email (Optional)
   RESEND_API_KEY=your_resend_api_key
   EMAIL_FROM=noreply@thisisafrica.com.au
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

5. **Open your browser:**
   Visit [http://localhost:3000](http://localhost:3000)

## 🎯 Demo Mode

The booking engine works in **demo mode** by default, providing:

- ✅ **Mock Tour Data** - 6 sample tours with realistic pricing
- ✅ **Demo Payment Processing** - Simulated payment flow
- ✅ **Full Booking Flow** - Complete booking experience
- ✅ **Responsive UI** - All components work perfectly

### Demo Features

- **Search Tours**: Filter by country, destination, and tour level
- **Tour Details**: View comprehensive tour information
- **Booking Form**: Collect customer details and select extras
- **Payment Processing**: Demo payment with realistic flow
- **Booking Confirmation**: Complete booking confirmation

## 🔧 Configuration

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `TOURPLAN_API_URL` | ⚠️ | Tourplan SOAP API endpoint |
| `TOURPLAN_USERNAME` | ⚠️ | Tourplan API username |
| `TOURPLAN_PASSWORD` | ⚠️ | Tourplan API password |
| `TOURPLAN_AGENT_ID` | ⚠️ | Tourplan agent ID |
| `TOURPLAN_PROXY_URL` | ⚠️ | AWS proxy endpoint for IP whitelisting |
| `USE_TOURPLAN_PROXY` | ⚠️ | Enable proxy for Tourplan API |
| `NEXT_PUBLIC_APP_URL` | ✅ | Your application URL |
| `STRIPE_SECRET_KEY` | ⚠️ | Stripe secret key (for payments) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | ⚠️ | Stripe publishable key |
| `RESEND_API_KEY` | ⚠️ | Resend API key (for emails) |
| `EMAIL_FROM` | ⚠️ | From email address |

### AWS Proxy Setup

For production deployment with Tourplan API:

1. **Launch EC2 Instance** with Ubuntu 22.04
2. **Configure Security Groups** for HTTP/HTTPS
3. **Set up Proxy Server** to forward requests to Tourplan
4. **Whitelist EC2 IP** with Tourplan support
5. **Configure Environment Variables** with proxy URL

## 📁 Project Structure

```
├── app/                    # Next.js 14 app directory
│   ├── api/               # API routes
│   │   ├── tours/         # Tour search and availability
│   │   ├── bookings/      # Booking creation
│   │   ├── payments/      # Payment processing
│   │   └── health/        # System health checks
│   ├── payment/           # Payment success/cancel pages
│   └── page.tsx           # Main booking engine
├── components/            # React components
│   ├── enhanced-search-form.tsx
│   ├── tour-results.tsx
│   ├── booking-form.tsx
│   ├── payment-form.tsx
│   └── booking-confirmation.tsx
├── lib/                  # Utility libraries
│   ├── tourplan-api.ts   # Tourplan API client
│   ├── env.ts           # Environment configuration
│   └── utils.ts         # Helper functions
└── docs/                # Documentation
```

## 🔌 API Endpoints

### Health & Status
- `GET /api/health` - System health check
- `GET /api/check-ip` - Get current IP address
- `GET /api/check-tourplan-connection` - Test Tourplan API connection

### Tours
- `POST /api/tours/search` - Search tours with criteria
- `GET /api/tours/search` - Get search endpoint info
- `POST /api/tours/availability` - Check tour availability

### Bookings
- `POST /api/bookings/create` - Create new booking
- `GET /api/bookings/create` - Get booking endpoint info

### Payments
- `POST /api/create-payment-session` - Create Stripe payment session
- `GET /api/create-payment-session` - Get payment endpoint info

## 🎨 UI Components

### Search Form
- Country and destination selection
- Tour level filtering (Basic, Standard, Luxury)
- Responsive design with modern UI

### Tour Results
- Card-based tour display
- Availability badges (Available, On Request, Not Available)
- Tour details with pricing and extras

### Booking Form
- Customer information collection
- Extra services selection
- Dynamic pricing calculation
- Age-based pricing for children

### Payment Form
- Stripe integration with demo mode
- Payment summary and deposit calculation
- Secure payment processing

### Booking Confirmation
- Complete booking details
- Payment confirmation
- Next steps and important notes

## 🚀 Deployment

### Vercel Deployment

1. **Connect Repository** to Vercel
2. **Configure Environment Variables** in Vercel dashboard
3. **Deploy** - Vercel will automatically deploy on push

### AWS EC2 Deployment

1. **Launch EC2 Instance** with Ubuntu 22.04
2. **Install Node.js** and dependencies
3. **Configure Nginx** as reverse proxy
4. **Set up SSL** with Let's Encrypt
5. **Configure Environment Variables**
6. **Deploy Application**

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🧪 Testing

### API Testing

```bash
# Test health endpoint
curl http://localhost:3000/api/health

# Test tour search
curl -X POST http://localhost:3000/api/tours/search \
  -H "Content-Type: application/json" \
  -d '{"country": "South Africa", "tourLevel": "luxury"}'

# Test booking creation
curl -X POST http://localhost:3000/api/bookings/create \
  -H "Content-Type: application/json" \
  -d '{"tour": {...}, "customerDetails": {...}}'
```

### Browser Testing

1. **Search Tours**: Test search functionality
2. **Select Tour**: Choose a tour and view details
3. **Complete Booking**: Fill booking form and process payment
4. **Confirmation**: Verify booking confirmation

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Adding New Tours

Edit `app/api/tours/search/route.ts` and add to the `mockTours` array:

```typescript
{
  id: "new-tour-id",
  name: "Tour Name",
  description: "Tour description",
  duration: 3,
  price: 1200,
  level: "luxury",
  availability: "OK",
  supplier: "This Is Africa Safaris",
  location: "Location, Country",
  extras: [...]
}
```

## 📞 Support

For support and questions:

- **Email**: support@thisisafrica.com.au
- **Documentation**: Check the `/docs` folder
- **Issues**: Create an issue on GitHub

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

---

**This Is Africa Booking Engine** - Making African adventures accessible to everyone.
