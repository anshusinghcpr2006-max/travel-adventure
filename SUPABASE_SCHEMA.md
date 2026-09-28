# Supabase Database Schema

To enable trip saving, run the following SQL in your Supabase SQL Editor:

```sql
-- Create trips table
create table trips (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  destination text not null,
  itinerary text not null,
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table trips enable row level security;

-- Create policy to allow users to manage their own trips
create policy "Users can manage their own trips"
  on trips for all
  using (auth.uid() = user_id);
```
