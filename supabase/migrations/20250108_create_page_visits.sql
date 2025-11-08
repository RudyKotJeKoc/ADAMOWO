-- Create page_visits table to track website visits
CREATE TABLE IF NOT EXISTS page_visits (
  id BIGSERIAL PRIMARY KEY,
  path VARCHAR(500) NOT NULL,
  visited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_agent TEXT,
  referrer TEXT,
  session_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on path for faster queries
CREATE INDEX IF NOT EXISTS idx_page_visits_path ON page_visits(path);

-- Create index on visited_at for time-based queries
CREATE INDEX IF NOT EXISTS idx_page_visits_visited_at ON page_visits(visited_at DESC);

-- Create index on session_id for session tracking
CREATE INDEX IF NOT EXISTS idx_page_visits_session_id ON page_visits(session_id);

-- Create a view for visit statistics
CREATE OR REPLACE VIEW page_visit_stats AS
SELECT
  path,
  COUNT(*) as total_visits,
  COUNT(DISTINCT session_id) as unique_sessions,
  MAX(visited_at) as last_visit,
  MIN(visited_at) as first_visit
FROM page_visits
GROUP BY path;

-- Create a function to get total visits
CREATE OR REPLACE FUNCTION get_total_visits()
RETURNS BIGINT AS $$
  SELECT COUNT(*) FROM page_visits;
$$ LANGUAGE SQL STABLE;

-- Create a function to get visits by path
CREATE OR REPLACE FUNCTION get_visits_by_path(p_path VARCHAR)
RETURNS BIGINT AS $$
  SELECT COUNT(*) FROM page_visits WHERE path = p_path;
$$ LANGUAGE SQL STABLE;

-- Enable Row Level Security
ALTER TABLE page_visits ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to read visit counts
CREATE POLICY "Allow public read access" ON page_visits
  FOR SELECT USING (true);

-- Create policy to allow anyone to insert visits (for tracking)
CREATE POLICY "Allow public insert" ON page_visits
  FOR INSERT WITH CHECK (true);

-- Comment on table
COMMENT ON TABLE page_visits IS 'Tracks page visits and sessions for analytics';
