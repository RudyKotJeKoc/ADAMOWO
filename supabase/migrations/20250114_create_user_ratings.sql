-- Create user_ratings table to store track ratings
CREATE TABLE IF NOT EXISTS user_ratings (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL,
  track_id VARCHAR(255) NOT NULL,
  rating SMALLINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  rated_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Ensure one rating per user per track
  UNIQUE(user_id, track_id)
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_user_ratings_user_id ON user_ratings(user_id);
CREATE INDEX IF NOT EXISTS idx_user_ratings_track_id ON user_ratings(track_id);
CREATE INDEX IF NOT EXISTS idx_user_ratings_rating ON user_ratings(rating);
CREATE INDEX IF NOT EXISTS idx_user_ratings_updated_at ON user_ratings(updated_at DESC);

-- Create a composite index for common queries
CREATE INDEX IF NOT EXISTS idx_user_ratings_user_track ON user_ratings(user_id, track_id);

-- Enable Row Level Security
ALTER TABLE user_ratings ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to read their own ratings
CREATE POLICY "Users can read own ratings" ON user_ratings
  FOR SELECT USING (auth.uid() = user_id);

-- Create policy to allow users to insert their own ratings
CREATE POLICY "Users can insert own ratings" ON user_ratings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to update their own ratings
CREATE POLICY "Users can update own ratings" ON user_ratings
  FOR UPDATE USING (auth.uid() = user_id);

-- Create policy to allow users to delete their own ratings
CREATE POLICY "Users can delete own ratings" ON user_ratings
  FOR DELETE USING (auth.uid() = user_id);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_user_ratings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically update updated_at
CREATE TRIGGER trigger_update_user_ratings_updated_at
  BEFORE UPDATE ON user_ratings
  FOR EACH ROW
  EXECUTE FUNCTION update_user_ratings_updated_at();

-- Create a view for rating statistics per track
CREATE OR REPLACE VIEW track_rating_stats AS
SELECT
  track_id,
  COUNT(*) as total_ratings,
  AVG(rating)::NUMERIC(3,2) as average_rating,
  COUNT(CASE WHEN rating = 1 THEN 1 END) as rating_1_count,
  COUNT(CASE WHEN rating = 2 THEN 1 END) as rating_2_count,
  COUNT(CASE WHEN rating = 3 THEN 1 END) as rating_3_count,
  COUNT(CASE WHEN rating = 4 THEN 1 END) as rating_4_count,
  COUNT(CASE WHEN rating = 5 THEN 1 END) as rating_5_count,
  MAX(updated_at) as last_rated_at
FROM user_ratings
GROUP BY track_id;

-- Create a view for user rating statistics
CREATE OR REPLACE VIEW user_rating_stats AS
SELECT
  user_id,
  COUNT(*) as total_ratings,
  AVG(rating)::NUMERIC(3,2) as average_rating,
  MAX(updated_at) as last_rated_at,
  MIN(created_at) as first_rated_at
FROM user_ratings
GROUP BY user_id;

-- Comment on table and columns
COMMENT ON TABLE user_ratings IS 'Stores user ratings for audio tracks with sync support';
COMMENT ON COLUMN user_ratings.user_id IS 'Reference to Supabase auth user';
COMMENT ON COLUMN user_ratings.track_id IS 'Unique identifier for the audio track';
COMMENT ON COLUMN user_ratings.rating IS 'Rating value from 1 to 5 stars';
COMMENT ON COLUMN user_ratings.comment IS 'Optional user comment about the track';
COMMENT ON COLUMN user_ratings.rated_at IS 'Timestamp when the rating was originally created by the user';
COMMENT ON COLUMN user_ratings.updated_at IS 'Timestamp when the rating was last modified';
