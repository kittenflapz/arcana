# Supabase Setup Instructions for Arcana

## Current Status
✅ **Demo Mode Active** - The app will work with a demo user when Google OAuth isn't configured  
⚠️ **Production Setup Needed** - Follow these steps for full authentication

## Quick Setup for Google OAuth

### 1. Enable Google OAuth in Supabase
1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your `arcana-mystical` project
3. Go to **Authentication** → **Providers**
4. Find **Google** and toggle it **ON**

### 2. Configure Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or use existing)
3. Enable **Google+ API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Set Application type to **Web application**
6. Add these URIs:
   - **Authorized JavaScript origins**: `http://localhost:3001` (for dev)
   - **Authorized redirect URIs**: `https://[YOUR-PROJECT-REF].supabase.co/auth/v1/callback`

### 3. Add Credentials to Supabase
1. Copy **Client ID** and **Client Secret** from Google
2. In Supabase → **Authentication** → **Providers** → **Google**:
   - Paste **Client ID**
   - Paste **Client Secret** 
   - Click **Save**

### 4. Database Tables
The following tables should be created in your Supabase project:

```sql
-- Users table (extends auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  username TEXT,
  has_begun BOOLEAN DEFAULT FALSE,
  start_date DATE,
  home_timezone TEXT,
  current_day INTEGER DEFAULT 0,
  year_intention TEXT
);

-- Readings table
CREATE TABLE public.readings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  day_number INTEGER,
  cards JSONB, -- [cardId1, cardId2, cardId3]
  oracle_response TEXT,
  user_intention TEXT,
  journal_entry TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE readings ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can view own readings" ON readings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own readings" ON readings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own readings" ON readings FOR UPDATE USING (auth.uid() = user_id);
```

### 5. Environment Variables
Make sure your `.env.local` has:
```bash
ANTHROPIC_API_KEY=your_anthropic_key_here
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Testing the Demo Mode

Until Google OAuth is configured, the app will:
1. Show auth errors in console (expected)
2. Automatically create a demo user: `demo@arcana.app`
3. Allow you to test the full journey flow
4. Store state locally (no database persistence)

**To test right now:**
1. Visit `http://localhost:3001`
2. Click "Begin Your Journey" 
3. Go through the Prologue → Ritual → Daily Reading flow
4. The Oracle will respond normally via Claude API

## Production Checklist
- [ ] Google OAuth configured
- [ ] Database tables created with RLS policies
- [ ] Environment variables set
- [ ] Domain configured in Google OAuth (for production)
- [ ] Supabase project configured for production domain

---

*The Oracle whispers: "Authentication is the first sacred gate. Once opened, the true journey can begin."* 🔮
