# Tourplan Booking Engine

A modern, responsive booking engine for tour operators using the Tourplan API. Built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- 🔍 **Tour Search & Discovery** - Search tours by destination, dates, and party size
- 📅 **Real-time Availability** - Check tour availability and pricing
- 💳 **Secure Payments** - Stripe integration for secure payment processing
- 📱 **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- 🏢 **Tourplan Integration** - Direct integration with Tourplan API
- 📊 **Admin Dashboard** - Manage bookings and customers
- 📧 **Email Notifications** - Automated booking confirmations
- 🔒 **Secure & Scalable** - Built with modern security practices

## Tech Stack

- **Frontend:** Next.js 14, React, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes, Node.js
- **Database:** Neon PostgreSQL
- **Payments:** Stripe
- **Email:** Resend
- **Deployment:** EC2, Vercel
- **API Integration:** Tourplan SOAP API

## Quick Start

### Prerequisites

- Node.js 18+ 
- Tourplan API credentials
- Neon database (or PostgreSQL)
- Stripe account (for payments)

### Installation

1. **Clone the repository:**
   \`\`\`bash
   git clone https://github.com/your-username/tourplan-booking-engine.git
   cd tourplan-booking-engine
   \`\`\`

2. **Install dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up environment variables:**
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`

   Configure your `.env.local`:
   \`\`\`env
   # Tourplan API
   TOURPLAN_API_URL=https://your-tourplan-api-url
   TOURPLAN_USERNAME=your-username
   TOURPLAN_PASSWORD=your-password
   TOURPLAN_AGENT_ID=your-agent-id

   # Database
   NEON_NEON_DATABASE_URL=your-neon-database-url

   # App URLs
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   APP_URL=http://localhost:3000

   # Stripe (optional)
   STRIPE_SECRET_KEY=sk_test_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

   # Email (optional)
   RESEND_API_KEY=your-resend-key
   EMAIL_FROM=noreply@yourdomain.com
   \`\`\`

4. **Set up the database:**
   Run the SQL script in your Neon console:
   \`\`\`sql
   -- See scripts/create-database-schema.sql
   \`\`\`

5. **Run the development server:**
   \`\`\`bash
   npm run dev
   \`\`\`

6. **Open your browser:**
   Visit [http://localhost:3000](http://localhost:3000)

## API Endpoints

### Health & Status
- `GET /api/health` - System health check
- `GET /api/check-ip` - Get current IP address
- `GET /api/check-tourplan-connection` - Test Tourplan API connection

### Tours
- `GET /api/tours/search` - Search tours
- `GET /api/tours/availability` - Check availability
- `GET /api/tourplan/option-info` - Get tour details

### Bookings
- `POST /api/bookings/create` - Create new booking
- `GET /api/bookings/[id]` - Get booking details

### Payments
- `POST /api/create-payment-session` - Create Stripe payment session
- `POST /api/verify-payment` - Verify payment status

## Deployment

### EC2 Deployment

1. **Launch EC2 Instance:**
   - Ubuntu 22.04 LTS
   - t3.micro or larger
   - Security groups: SSH (22), HTTP (80), HTTPS (443)

2. **Setup Server:**
   \`\`\`bash
   # Run the setup script
   chmod +x scripts/ec2-setup.sh
   ./scripts/ec2-setup.sh
   \`\`\`

3. **Deploy Application:**
   \`\`\`bash
   # Run the deployment script
   chmod +x scripts/deploy-app.sh
   ./scripts/deploy-app.sh
   \`\`\`

4. **Get Your IP Address:**
   \`\`\`bash
   curl http://169.254.169.254/latest/meta-data/public-ipv4
   \`\`\`

5. **Whitelist IP with Tourplan:**
   Contact Tourplan support to whitelist your EC2 public IP address.

### Vercel Deployment

1. **Connect Repository:**
   - Import your GitHub repository to Vercel
   - Configure environment variables in Vercel dashboard

2. **Add Environment Variables:**
   - All the same variables from `.env.local`
   - Make sure `NEXT_PUBLIC_APP_URL` points to your Vercel domain

3. **Deploy:**
   - Vercel will automatically deploy on push to main branch

## Configuration

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `TOURPLAN_API_URL` | ✅ | Tourplan SOAP API endpoint |
| `TOURPLAN_USERNAME` | ✅ | Tourplan API username |
| `TOURPLAN_PASSWORD` | ✅ | Tourplan API password |
| `TOURPLAN_AGENT_ID` | ✅ | Tourplan agent ID |
| `NEON_DATABASE_URL` | ✅ | Neon PostgreSQL connection string |
| `NEXT_PUBLIC_APP_URL` | ✅ | Your application URL |
| `STRIPE_SECRET_KEY` | ⚠️ | Stripe secret key (for payments) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | ⚠️ | Stripe publishable key |
| `RESEND_API_KEY` | ⚠️ | Resend API key (for emails) |
| `EMAIL_FROM` | ⚠️ | From email address |

### Database Schema

The application uses PostgreSQL with the following main tables:
- `customers` - Customer information
- `bookings` - Tour bookings
- `payments` - Payment records
- `booking_extras` - Additional booking items

## Development

### Project Structure

\`\`\`
├── app/                    # Next.js 14 app directory
│   ├── api/               # API routes
│   ├── components/        # React components
│   └── pages/            # Application pages
├── components/            # Reusable UI components
├── lib/                  # Utility libraries
│   ├── tourplan-api.ts   # Tourplan API client
│   ├── database.ts       # Database operations
│   └── env.ts           # Environment configuration
├── scripts/              # Database and deployment scripts
└── docs/                # Documentation
\`\`\`

### Available Scripts

\`\`\`bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
\`\`\`

### Testing

\`\`\`bash
# Test API endpoints
curl http://localhost:3000/api/health
curl http://localhost:3000/api/check-ip
curl http://localhost:3000/api/check-tourplan-connection

# Test database connection
curl http://localhost:3000/api/test-db
\`\`\`

## Troubleshooting

### Common Issues

1. **Tourplan API Connection Failed**
   - Verify your IP is whitelisted with Tourplan
   - Check API credentials are correct
   - Test connection: `/api/check-tourplan-connection`

2. **Database Connection Issues**
   - Verify `NEON_DATABASE_URL` is correct
   - Check database is accessible
   - Test connection: `/api/health`

3. **Environment Variables Not Loading**
   - Ensure `.env.local` exists in root directory
   - Restart development server after changes
   - Check `/api/debug-env` for configuration status

### Getting Help

1. **Check Health Status:** Visit `/api/health`
2. **View Environment:** Visit `/debug-env` (development only)
3. **Check Logs:** Use browser dev tools or server logs
4. **Test APIs:** Use the provided test endpoints

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support with:
- **Application Issues:** Create an issue in this repository
- **Tourplan API:** Contact Tourplan support
- **Deployment:** Check the EC2 Setup Guide in `/docs`

---

Built with ❤️ using Next.js and the Tourplan API
