# WaZoBiaRide - Investor Demo Guide

## Quick Start

The demo application is running at: **http://localhost:3000/**

## Demo Credentials

### Rider Account
- **Username:** `rider@demo.com`
- **Password:** `demo123`

### Driver Account
- **Username:** `driver@demo.com`
- **Password:** `demo123`

### Admin Account
- **Username:** `admin@demo.com`
- **Password:** `demo123`

---

## Key Features to Showcase

### 1. PIN Verification System (Safety)
- After requesting a ride, a 4-digit PIN is generated
- Driver must enter this PIN at pickup to confirm rider identity
- Reduces fraud and enhances rider safety
- Located in: Rider Dashboard → Request Ride → Driver Arrives

### 2. Timed Driver Dispatch (Sequential Routing)
- Drivers have **5-10 seconds** to accept ride requests
- If declined/times out, request automatically routes to next available driver
- Ensures efficient pickup times and fair opportunity distribution
- Located in: Driver Dashboard → Incoming Ride Request

### 3. Premium vs Standard Tier Selection
- Riders can choose between Standard and Premium service tiers
- Premium drivers earn 20% more and get priority access to high-value rides
- Premium rides have higher fares and better vehicles
- Located in: Rider Dashboard → Select Service Tier

### 4. Upfront Driver Earnings Visibility
- Drivers see their exact earnings BEFORE accepting a ride
- Shows fare minus platform commission (20% for Standard, 25% for Premium)
- Helps drivers make informed decisions and increases transparency
- Located in: Driver Dashboard → Incoming Ride Request (top of card)

### 5. Driver Wallet and Payout System
- Real-time earnings tracking
- Transaction history with detailed breakdown
- Weekly payout schedule (Monday, Wednesday, Friday)
- Payout status tracking
- Located in: Driver Dashboard → Earnings Tab

---

## Dashboard Walkthroughs

### Rider Dashboard Features

#### 1. **Home Tab**
- Interactive map showing nearby drivers
- Real-time driver locations with tier indicators
- Driver availability status

#### 2. **Request a Ride**
- Enter pickup and dropoff locations
- Choose service type: Car, Okada (motorcycle), or Share
- Select tier: Standard or Premium
- View fare estimates before booking

#### 3. **Finding Driver**
- Visual search animation
- Shows nearest available drivers
- Simulates dispatch to sequential drivers

#### 4. **Ride In Progress**
- Real-time driver location tracking
- Driver details (name, photo, vehicle info)
- Estimated arrival time
- Safety features: SOS, share trip

#### 5. **Ride Complete**
- Driver rating system (1-5 stars)
- Review option
- Trip summary with fare breakdown
- Payment confirmation

#### 6. **Trip History Tab**
- Past rides with details
- Receipts and payment history
- Rating and review status

#### 7. **Profile Tab**
- Personal information
- Payment methods (Cash, Card, Mobile Money)
- Notification settings
- Safety preferences

---

### Driver Dashboard Features

#### 1. **Go Online/Offline**
- Toggle availability status
- Online drivers appear on rider maps
- Start receiving ride requests

#### 2. **Incoming Ride Request**
- **KEY FEATURE:** Upfront earnings display (₦X,XXX after commission)
- Pickup and dropoff locations
- Distance and estimated time
- **KEY FEATURE:** 10-second countdown timer
- Accept or Decline options

#### 3. **Arriving at Pickup**
- Navigation to rider location
- Real-time ETA
- Rider contact information

#### 4. **PIN Verification**
- Driver enters 4-digit PIN provided by rider
- Confirms rider identity before trip
- Required to complete pickup

#### 5. **Trip In Progress**
- Navigation to destination
- Real-time trip progress
- Earnings display for current trip

#### 6. **Ride Complete**
- Trip summary
- Total earnings for this ride
- Ready for next ride prompt

#### 7. **Earnings Tab**
- Total balance
- Today's earnings
- This week's earnings
- Transaction history
- **KEY FEATURE:** Payout schedule (Mon/Wed/Fri)
- Payout status tracking

#### 8. **Profile Tab**
- Driver information
- Vehicle details
- Tier assignment (Standard/Premium)
- Document verification status
- Upgrade to Premium option

---

### Admin Dashboard Features

#### 1. **Overview Tab**
- Real-time statistics:
  - Active rides count
  - Online drivers count
  - Total revenue
  - Total riders
- **Live activity map** showing:
  - Online driver locations
  - Active ride locations
- Recent rides feed
- Safety alerts panel

#### 2. **Rides Tab**
- All ride management
- Filter by status (active, completed, cancelled)
- Ride details and history
- Revenue tracking

#### 3. **Drivers Tab**
- Driver management cards
- Online/offline status
- Tier assignments (Standard/Premium)
- Driver profiles
- Enable/disable accounts

#### 4. **Riders Tab**
- Rider management
- Total rides per rider
- Rating information
- Account status
- Activity tracking

#### 5. **Analytics Tab**
- Revenue trends chart
- Time range filtering (Today/Week/Month)
- Key metrics:
  - Ride completion rate (94.5%)
  - Average trip time (18 min)
  - Driver retention (87%)
- Growth indicators

---

## Nigerian Context & Localization

### Locations
- All locations are in major Nigerian cities:
  - **Lagos:** Victoria Island, Lekki, Ikoyi, Ikeja, Surulere, Yaba, Oshodi
  - **Ibadan:** Bodija, Challenge, Ring Road

### Currency
- All amounts displayed in Nigerian Naira (₦)
- Realistic fare pricing for local market

### Service Types
- **Car:** Standard sedan/SUV service
- **Okada:** Motorcycle taxi (popular in Nigeria)
- **Share:** Shared ride option

### Payment Methods
- **Cash:** Traditional payment
- **Card:** Credit/Debit card
- **Mobile Money:** MTN, Airtel, Glo, 9mobile

---

## Technical Highlights

### Frontend Stack
- **React 19.2.1 + TypeScript 5.6.3:** Type-safe, maintainable codebase
- **Vite 7.1.7:** Lightning-fast build tool
- **Wouter 3.3.5:** Lightweight routing library
- **Framer Motion 12.23.22:** Smooth animations and transitions
- **Lucide React 0.453.0:** Modern icon set
- **Tailwind CSS 4.1.14:** Utility-first styling
- **Radix UI:** Comprehensive accessible component library
- **Zod 4.1.12:** Schema validation
- **React Hook Form 7.64.0:** Form management
- **Recharts 2.15.2:** Data visualization

### Key Differentiators Implemented

1. **Safety-First Design**
   - PIN verification at pickup
   - Driver identity confirmation
   - SOS and trip sharing features

2. **Driver Empowerment**
   - Upfront earnings visibility
   - Transparent commission structure
   - Weekly guaranteed payouts
   - Tier advancement opportunities

3. **Efficient Dispatch**
   - Sequential routing with timeouts
   - Fair opportunity distribution
   - Priority for premium drivers
   - Quick pickup times

4. **Data-Driven Operations**
   - Real-time analytics dashboard
   - Revenue tracking
   - Driver performance metrics
   - Safety incident monitoring

---

## Demo Flow Suggestion

**For Investors - Recommended Demo Sequence:**

1. **Start with Admin Dashboard** (2 minutes)
   - Show overview statistics
   - Highlight live activity map
   - Show analytics trends

2. **Switch to Rider Experience** (5 minutes)
   - Request a ride from VI to Lekki
   - Show tier selection (Standard vs Premium)
   - Demonstrate map with nearby drivers
   - Simulate driver finding and dispatch
   - Show ride in progress with tracking
   - Complete ride with rating

3. **Switch to Driver Perspective** (5 minutes)
   - Go online to receive requests
   - Show incoming ride with upfront earnings (highlight this!)
   - Demonstrate 10-second countdown timer
   - Accept and navigate to pickup
   - Show PIN verification (highlight safety feature!)
   - Complete trip and show earnings

4. **Return to Admin Dashboard** (1 minute)
   - Show completed ride in system
   - Show updated revenue

**Total demo time: ~13 minutes**

---

## Notes

- This is a **fully functional demo** with mock data
- No backend required - all data is client-side
- All interactions are simulated for demonstration
- Ready for investor presentations
- Mobile-responsive design
- Nigerian localization throughout

---

## Support

For questions or to request additional features for demo, please contact the development team.

**WaZoBiaRide - Moving Nigeria Forward, Together.**