# Ratings Sync API Endpoint

## Overview

The Ratings Sync endpoint allows the Service Worker to synchronize user track ratings from offline storage to the Supabase database. This endpoint handles batch synchronization of ratings with proper authentication and validation.

## Endpoint

```
POST /api/v1/ratings/sync
```

## Authentication

This endpoint requires authentication using a Supabase JWT token. The token must be provided in the `Authorization` header:

```
Authorization: Bearer <your-jwt-token>
```

## Request Format

### Headers

- `Content-Type: application/json`
- `Authorization: Bearer <jwt-token>`

### Body

The request body should be a JSON array of rating objects:

```json
[
  {
    "trackId": "string",
    "rating": 1-5,
    "timestamp": "ISO8601 datetime string",
    "comment": "optional string (max 500 characters)"
  }
]
```

### Field Descriptions

- **trackId** (required): Unique identifier for the audio track
- **rating** (required): Integer value between 1 and 5 (inclusive)
- **timestamp** (required): ISO8601 formatted datetime string indicating when the rating was created
- **comment** (optional): User's comment about the track (max 500 characters)

### Validation Rules

- Maximum 100 ratings per request
- `trackId` must be a non-empty string
- `rating` must be an integer between 1 and 5
- `timestamp` must be a valid ISO8601 datetime string
- `comment` (if provided) must be a string with max 500 characters

## Response Format

### Success Response (200 OK)

```json
{
  "success": true,
  "synced": 10,
  "failed": 0
}
```

### Partial Success Response (200 OK)

When some ratings sync successfully but others fail:

```json
{
  "success": false,
  "synced": 8,
  "failed": 2,
  "errors": [
    {
      "index": 3,
      "trackId": "track-123",
      "error": "Failed to sync rating"
    }
  ]
}
```

### Error Responses

#### 400 Bad Request

```json
{
  "error": "Validation failed",
  "details": {
    "rating[0]": ["rating must be between 1 and 5"],
    "rating[2]": ["timestamp must be a valid ISO8601 datetime string"]
  }
}
```

#### 401 Unauthorized

```json
{
  "error": "Authentication required. Please provide a valid JWT token in the Authorization header."
}
```

or

```json
{
  "error": "Invalid or expired token. Please authenticate again."
}
```

#### 405 Method Not Allowed

```json
{
  "error": "Method not allowed. Use POST."
}
```

#### 500 Internal Server Error

```json
{
  "error": "An unexpected error occurred. Please try again later."
}
```

## Example Usage

### JavaScript/TypeScript (Service Worker)

```javascript
async function syncRatings() {
  const ratings = [
    {
      trackId: 'track-001',
      rating: 5,
      timestamp: new Date().toISOString(),
      comment: 'Amazing track!'
    },
    {
      trackId: 'track-002',
      rating: 4,
      timestamp: new Date().toISOString()
    }
  ];

  // Get Supabase session token
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    console.error('User not authenticated');
    return;
  }

  const response = await fetch('/api/v1/ratings/sync', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.access_token}`
    },
    body: JSON.stringify(ratings)
  });

  const result = await response.json();

  if (result.success) {
    console.log(`Successfully synced ${result.synced} ratings`);
  } else {
    console.error(`Sync failed: ${result.failed} ratings failed`, result.errors);
  }
}
```

### cURL

```bash
curl -X POST https://adamowo.com/api/v1/ratings/sync \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '[
    {
      "trackId": "track-001",
      "rating": 5,
      "timestamp": "2025-01-14T10:30:00Z",
      "comment": "Great song!"
    }
  ]'
```

## Database Schema

The endpoint uses the `user_ratings` table in Supabase with the following schema:

```sql
CREATE TABLE user_ratings (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL,
  track_id VARCHAR(255) NOT NULL,
  rating SMALLINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  rated_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, track_id)
);
```

## Row Level Security (RLS)

The `user_ratings` table has Row Level Security enabled with the following policies:

- Users can only read their own ratings
- Users can only insert/update/delete their own ratings
- The `user_id` is automatically extracted from the JWT token

## Configuration

Required environment variables in `/api/.env`:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

## Error Handling

The endpoint implements comprehensive error handling:

1. **Authentication Errors**: Invalid or missing JWT tokens return 401
2. **Validation Errors**: Invalid data format or values return 400 with details
3. **Database Errors**: Connection or query errors return 500
4. **Partial Failures**: Individual rating sync failures are tracked and reported

## Performance Considerations

- Maximum 100 ratings per request to prevent timeout
- Individual rating processing for better error tracking
- Database upsert operations for idempotency
- Proper indexing on `user_id` and `track_id` for fast lookups

## Testing

To test the endpoint:

1. Ensure Supabase is configured with proper credentials
2. Run the Supabase migration to create the `user_ratings` table
3. Authenticate a user and obtain a JWT token
4. Send a POST request with valid rating data
5. Verify the ratings are stored in Supabase

## Integration with Service Worker

The Service Worker should implement the `syncRatings()` function to call this endpoint:

```javascript
// In public/sw-comprehensive.js
async function syncRatings() {
  try {
    // Get ratings from local storage/IndexedDB
    const pendingRatings = await getPendingRatings();

    if (pendingRatings.length === 0) {
      console.log('[SW] No ratings to sync');
      return;
    }

    // Get user session
    const session = await getSupabaseSession();

    if (!session) {
      console.log('[SW] User not authenticated, skipping sync');
      return;
    }

    // Sync ratings
    const response = await fetch('/api/v1/ratings/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`
      },
      body: JSON.stringify(pendingRatings)
    });

    const result = await response.json();

    if (result.success) {
      // Mark ratings as synced
      await markRatingsAsSynced(pendingRatings);
      console.log(`[SW] Successfully synced ${result.synced} ratings`);
    } else {
      console.error(`[SW] Sync partially failed: ${result.failed} ratings failed`);
    }
  } catch (error) {
    console.error('[SW] Rating sync error:', error);
  }
}
```

## Troubleshooting

### Common Issues

1. **401 Unauthorized**
   - Verify the JWT token is valid and not expired
   - Check that the Authorization header is properly formatted
   - Ensure the user is authenticated with Supabase

2. **400 Bad Request**
   - Validate the request body format
   - Check that all required fields are present
   - Ensure rating values are between 1 and 5

3. **500 Internal Server Error**
   - Check Supabase configuration in .env file
   - Verify database connectivity
   - Review server error logs

## Security

- All requests must be authenticated with valid JWT tokens
- Row Level Security (RLS) prevents users from accessing other users' ratings
- Input validation prevents SQL injection and XSS attacks
- Comment length limited to 500 characters
- Maximum 100 ratings per request to prevent DoS

## Future Enhancements

Potential improvements for future versions:

- Batch processing optimization for large datasets
- Rate limiting per user
- Webhook notifications on rating sync
- Analytics and reporting endpoints
- Real-time sync via WebSockets/SSE
