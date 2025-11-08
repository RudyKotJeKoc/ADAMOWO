# Supabase Database Migrations

## Setup Instructions

### Running Migrations

To set up the page visits tracking, run the migration in your Supabase dashboard:

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Open the migration file: `migrations/20250108_create_page_visits.sql`
4. Copy and paste the SQL into the editor
5. Click **Run** to execute the migration

### What This Migration Creates

- **`page_visits` table**: Stores individual page visit records
  - `id`: Unique identifier
  - `path`: The page path that was visited
  - `visited_at`: Timestamp of the visit
  - `user_agent`: Browser user agent
  - `referrer`: Referrer URL
  - `session_id`: UUID for tracking unique sessions

- **Indexes**: For optimal query performance on path, visited_at, and session_id

- **`page_visit_stats` view**: Aggregated statistics per path

- **Functions**:
  - `get_total_visits()`: Returns total count of all visits
  - `get_visits_by_path(path)`: Returns visit count for a specific path

- **Row Level Security (RLS)**: Enabled with policies allowing public read and insert

### Verification

After running the migration, verify it worked:

```sql
-- Check if table exists
SELECT * FROM page_visits LIMIT 1;

-- Check total visits function
SELECT get_total_visits();

-- Check visit stats view
SELECT * FROM page_visit_stats;
```

### Environment Variables

Make sure your `.env` file contains:

```env
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON=your-anon-key
```
