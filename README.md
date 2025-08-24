# S2S Postback URL System

A server-to-server (S2S) postback URL system for affiliate marketing that tracks clicks and conversions between affiliates and campaigns.

## System Overview

### What is a Postback?

A postback is a server-to-server HTTP request that an affiliate network sends to notify advertisers about conversions (sales, leads, or other desired actions) that result from their marketing efforts. This system provides the infrastructure to:

- **Track affiliate clicks** on campaign links
- **Record conversions** when users complete desired actions
- **Attribute conversions** back to the original click through unique click IDs
- **Provide reporting** through a web dashboard

### Key Components

- **Backend API**: Node.js/Express server with Prisma ORM
- **Database**: PostgreSQL with Prisma schema
- **Frontend**: Next.js dashboard for viewing reports
- **Tracking**: Click and conversion tracking endpoints

### Database Schema

- **Affiliates**: Marketing partners who drive traffic
- **Campaigns**: Marketing campaigns with unique tracking parameters
- **Clicks**: Individual click events with unique click IDs
- **Conversions**: Revenue events attributed to specific clicks

## Local Development Setup

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL 12+ (or Docker)
- Git

### 1. Clone and Install Dependencies

```bash
git clone https://github.com/shekhar9837/s2s-postback-url.git
cd s2s-postback-url

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Database Setup

#### Option A: Using Docker (Recommended)

```bash
# Start PostgreSQL container
docker run --name postgres-s2s -e POSTGRES_PASSWORD=password -e POSTGRES_DB=s2s_db -p 5432:5432 -d postgres:13

# The database will be available at: postgresql://postgres:password@localhost:5432/s2s_db
```

#### Option B: Local PostgreSQL Installation

```bash
# Create database
createdb s2s_db

# Update connection string in environment variables
```

### 3. Environment Configuration

Create a `.env` file in the `backend` directory:

```bash
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/s2s_db"

# Server
PORT=4000
CORS_ORIGIN="http://localhost:3000"

# Optional: Override frontend API base
NEXT_PUBLIC_API_BASE="http://localhost:4000"
```

### 4. Database Migration and Seeding

```bash
cd backend

# Generate Prisma client
npx prisma generate

# Run migrations
npm run prisma:dev

# Seed initial data (creates sample affiliates and campaigns)
npm run seed
```

### 5. Start the Services

#### Terminal 1: Backend API
```bash
cd backend
npm run dev
```
API will be available at: http://localhost:4000

#### Terminal 2: Frontend Dashboard
```bash
cd frontend
npm run dev
```
Dashboard will be available at: http://localhost:3000

#### Optional: Database Management
```bash
cd backend
npm run prisma:studio
```
Prisma Studio will be available at: http://localhost:5555

## API Endpoints

### Health Check
```bash
GET /health
```

### Click Tracking
Records a click event when a user clicks on an affiliate link.

```bash
GET /click?affiliate_id={id}&campaign_id={id}&click_id={unique_string}
```

**Parameters:**
- `affiliate_id` (required): The affiliate's unique identifier
- `campaign_id` (required): The campaign's unique identifier  
- `click_id` (required): Unique identifier for this specific click

**Example:**
```bash
curl "http://localhost:4000/click?affiliate_id=1&campaign_id=1&click_id=abc123"
```

**Response:**
```json
{
  "status": "success",
  "message": "Click logged"
}
```

### Conversion Tracking (Postback)
Records a conversion event when a user completes a desired action.

```bash
GET /postback?affiliate_id={id}&click_id={unique_string}&amount={value}&currency={code}
```

**Parameters:**
- `affiliate_id` (required): The affiliate's unique identifier
- `click_id` (required): The original click ID to attribute the conversion
- `amount` (required): The conversion amount/value
- `currency` (required): Currency code (e.g., USD, EUR)

**Example:**
```bash
curl "http://localhost:4000/postback?affiliate_id=1&click_id=abc123&amount=99.99&currency=USD"
```

**Response:**
```json
{
  "status": "success", 
  "message": "Conversion tracked"
}
```

### Reporting Endpoints

#### Get All Affiliates
```bash
GET /affiliates
```

#### Get Clicks for an Affiliate
```bash
GET /affiliates/{id}/clicks
```

#### Get Conversions for an Affiliate
```bash
GET /affiliates/{id}/conversions
```

## Example Workflow

1. **Affiliate Link Click:**
   ```bash
   curl "http://localhost:4000/click?affiliate_id=1&campaign_id=1&click_id=user123_session456"
   ```

2. **User makes a purchase and converts:**
   ```bash
   curl "http://localhost:4000/postback?affiliate_id=1&click_id=user123_session456&amount=49.99&currency=USD"
   ```

3. **View results in dashboard:**
   - Visit http://localhost:3000
   - Check affiliate performance and conversion attribution

## Architecture Notes

- **Click Tracking**: Uses upsert logic to handle duplicate click IDs gracefully
- **Conversion Attribution**: Links conversions to clicks through unique click IDs
- **Data Integrity**: Foreign key relationships ensure referential integrity
- **Performance**: Indexed queries for efficient reporting
- **Security**: Input validation and parameterized queries prevent common vulnerabilities

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Verify PostgreSQL is running on port 5432
   - Check DATABASE_URL in .env file
   - Ensure database `s2s_db` exists

2. **Port Already in Use**
   - Backend uses port 4000 by default
   - Frontend uses port 3000 by default
   - Update PORT in .env or kill existing processes

3. **Prisma Client Error**
   - Run `npx prisma generate` after schema changes
   - Ensure migrations are applied with `npm run prisma:dev`

4. **CORS Issues**
   - Verify CORS_ORIGIN includes your frontend URL
   - Default allows all origins (*) for development

## Production Deployment

For production deployment:

1. Use a managed PostgreSQL service (RDS, Supabase, etc.)
2. Set secure environment variables
3. Configure proper CORS origins
4. Use process manager like PM2 for the backend
5. Set up SSL/TLS certificates
6. Implement proper logging and monitoring

## Contributing

1. Follow the local development setup
2. Create feature branches for new functionality
3. Write tests for new endpoints
4. Update documentation for API changes
