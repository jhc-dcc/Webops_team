# E-waste Leaderboard System Setup

## Development Setup

1. **Install dependencies** (if not already done):

   ```bash
   pnpm install
   ```

2. **Start Convex development server**:

   ```bash
   pnpm run dev:convex
   ```

   This will regenerate the API types and include our new `ewaste` functions.

3. **Start Next.js development server** (in another terminal):

   ```bash
   pnpm run dev
   ```

4. **Visit the E-waste pages**:
   - Main overview: `http://localhost:3000/ewaste`
   - Submit form: `http://localhost:3000/ewaste/submit`
   - Full leaderboard: `http://localhost:3000/ewaste/leaderboard`

## Features

### 🎯 Multi-step Form

- **Step 1**: Basic Information (Name, Email, Phone)
- **Step 2**: Participant Type (Individual/Organization)
- **Step 3**: Organization Details (if organization)
- **Step 4**: E-waste Details (Weight, Types, Notes)
- **Step 5**: Review & Submit

### 📊 Leaderboards

- **Individual Leaderboard**: Ranked by e-waste weight
- **Organization Leaderboard**: Ranked by total e-waste weight (grouped)
- **Top 5 Display**: Featured on main e-waste page
- **Full Leaderboard**: Complete rankings with detailed information

### 🎨 Design Features

- **Modern Dark Theme**: Following your site's color scheme
- **Responsive Design**: Works on all screen sizes
- **Event Display Ready**: Optimized for projection during events
- **Animated Components**: Smooth transitions and hover effects
- **Progressive Icons**: Trophy, Crown, Medal for top 3

### 🔧 Technical Features

- **Convex Backend**: Real-time database with type safety
- **Form Validation**: Comprehensive validation using Zod
- **Error Handling**: User-friendly error messages
- **Loading States**: Smooth loading indicators
- **SEO Optimized**: Meta tags and structured data

## Database Schema

The system creates an `ewasteSubmissions` table with:

- Basic participant info (name, email, phone)
- Participant type (individual/organization)
- Organization details (conditional)
- E-waste details (weight, types, notes)
- Verification status (pending/verified/rejected)
- Timestamps and indexing

## Admin Features (Future Enhancement)

The schema includes verification status fields for admin features:

- Verify submissions
- Reject invalid entries
- Track verification history

## Usage

1. Users visit `/ewaste` to see the overview and top 5 leaderboards
2. Click "Submit E-waste Entry" to go to the multi-step form
3. Fill out the comprehensive form with validation
4. View their entry on the leaderboard after admin verification
5. Full leaderboard shows complete rankings for event display

## Troubleshooting

If you see TypeScript errors about `api.ewaste`, run:

```bash
pnpm run dev:convex
```

This will regenerate the Convex API types and resolve the import issues.
