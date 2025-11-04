/**
 * Rating Component
 *
 * Track rating system with:
 * - 5-star rating display and input
 * - Optional comments
 * - Local storage persistence
 * - Optional Supabase sync
 * - Rating statistics
 */

import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useRatingStore } from '../../state/media';
import type { AudioTrack, TrackRating } from './media.schema';

// ============================================================================
// STAR RATING INPUT
// ============================================================================

interface StarRatingInputProps {
  rating: number;
  onChange: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg';
  readonly?: boolean;
  showLabel?: boolean;
}

export function StarRatingInput({
  rating,
  onChange,
  size = 'md',
  readonly = false,
  showLabel = true,
}: StarRatingInputProps): JSX.Element {
  const { t } = useTranslation();
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);

  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
  };

  const displayRating = hoveredRating !== null ? hoveredRating : rating;

  const handleClick = (value: number) => {
    if (!readonly) {
      onChange(value);
    }
  };

  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-1">
        {stars.map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleClick(star)}
            onMouseEnter={() => !readonly && setHoveredRating(star)}
            onMouseLeave={() => !readonly && setHoveredRating(null)}
            disabled={readonly}
            className={`${sizeClasses[size]} ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'} transition-transform`}
            aria-label={t('multimedia.rating.rateStar', { star }, `Rate ${star} stars`)}
          >
            <span className={star <= displayRating ? 'text-accent-400' : 'text-base-700'}>
              {star <= displayRating ? '★' : '☆'}
            </span>
          </button>
        ))}
      </div>
      {showLabel && (
        <span className="text-sm text-base-400">
          {displayRating > 0
            ? t('multimedia.rating.starsCount', { count: displayRating }, `${displayRating} star${displayRating !== 1 ? 's' : ''}`)
            : t('multimedia.rating.notRated', 'Not rated')}
        </span>
      )}
    </div>
  );
}

// ============================================================================
// TRACK RATING CARD
// ============================================================================

interface TrackRatingCardProps {
  track: AudioTrack;
  showComment?: boolean;
  onRatingChange?: (rating: TrackRating) => void;
}

export function TrackRatingCard({
  track,
  showComment = true,
  onRatingChange,
}: TrackRatingCardProps): JSX.Element {
  const { t } = useTranslation();
  const { getRating, setRating } = useRatingStore();

  const existingRating = getRating(track.id);
  const [rating, setRatingState] = useState(existingRating?.rating || 0);
  const [comment, setComment] = useState(existingRating?.comment || '');
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = useCallback(() => {
    if (rating === 0) return;

    setRating(track.id, rating, comment || undefined);
    setIsEditing(false);

    const newRating: TrackRating = {
      trackId: track.id,
      rating,
      ratedAt: new Date().toISOString(),
      comment: comment || undefined,
      syncStatus: 'local',
    };

    onRatingChange?.(newRating);
  }, [track.id, rating, comment, setRating, onRatingChange]);

  const handleCancel = useCallback(() => {
    setRatingState(existingRating?.rating || 0);
    setComment(existingRating?.comment || '');
    setIsEditing(false);
  }, [existingRating]);

  return (
    <div className="bg-base-900 rounded-lg p-4 space-y-4">
      {/* Track info */}
      <div className="flex items-center gap-4">
        {track.coverUrl && (
          <img
            src={track.coverUrl}
            alt={track.title}
            className="w-16 h-16 rounded object-cover"
            loading="lazy"
          />
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-base-100 font-medium truncate">{track.title}</h3>
          <p className="text-base-400 text-sm truncate">{track.artist}</p>
        </div>
      </div>

      {/* Rating input */}
      <div>
        <StarRatingInput
          rating={rating}
          onChange={(newRating) => {
            setRatingState(newRating);
            if (!isEditing) setIsEditing(true);
          }}
          size="md"
          readonly={false}
        />
      </div>

      {/* Comment input */}
      {showComment && isEditing && (
        <div>
          <label htmlFor={`comment-${track.id}`} className="block text-base-300 text-sm mb-2">
            {t('multimedia.rating.comment', 'Comment (optional)')}
          </label>
          <textarea
            id={`comment-${track.id}`}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={t('multimedia.rating.commentPlaceholder', 'Share your thoughts about this track...')}
            className="w-full px-3 py-2 bg-base-800 text-base-100 rounded-lg border border-base-700 focus:border-accent-500 focus:ring-1 focus:ring-accent-500 outline-none transition-colors resize-none"
            rows={3}
            maxLength={500}
          />
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-base-500">{comment.length}/500</span>
          </div>
        </div>
      )}

      {/* Display existing comment */}
      {showComment && !isEditing && existingRating?.comment && (
        <div className="p-3 bg-base-800 rounded-lg">
          <p className="text-base-300 text-sm">{existingRating.comment}</p>
        </div>
      )}

      {/* Action buttons */}
      {isEditing && (
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            disabled={rating === 0}
            className="flex-1 px-4 py-2 bg-accent-500 hover:bg-accent-600 disabled:bg-base-700 disabled:text-base-500 text-base-950 font-medium rounded-lg transition-colors"
          >
            {t('multimedia.rating.save', 'Save Rating')}
          </button>
          <button
            onClick={handleCancel}
            className="px-4 py-2 bg-base-800 hover:bg-base-700 text-base-100 rounded-lg transition-colors"
          >
            {t('multimedia.rating.cancel', 'Cancel')}
          </button>
        </div>
      )}

      {/* Edit button for existing rating */}
      {!isEditing && existingRating && (
        <button
          onClick={() => setIsEditing(true)}
          className="w-full px-4 py-2 bg-base-800 hover:bg-base-700 text-base-100 rounded-lg transition-colors text-sm"
        >
          {t('multimedia.rating.edit', 'Edit Rating')}
        </button>
      )}

      {/* Rating date */}
      {existingRating && !isEditing && (
        <p className="text-xs text-base-500 text-center">
          {t('multimedia.rating.ratedOn', 'Rated on')}{' '}
          {new Date(existingRating.ratedAt).toLocaleDateString()}
        </p>
      )}
    </div>
  );
}

// ============================================================================
// RATING STATISTICS
// ============================================================================

interface RatingStatisticsProps {
  ratings: TrackRating[];
  className?: string;
}

export function RatingStatistics({ ratings, className = '' }: RatingStatisticsProps): JSX.Element {
  const { t } = useTranslation();

  if (ratings.length === 0) {
    return (
      <div className={`text-center text-base-400 ${className}`}>
        {t('multimedia.rating.noRatings', 'No ratings yet')}
      </div>
    );
  }

  const averageRating = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;

  const distribution = ratings.reduce(
    (acc, r) => {
      acc[r.rating as 1 | 2 | 3 | 4 | 5] = (acc[r.rating as 1 | 2 | 3 | 4 | 5] || 0) + 1;
      return acc;
    },
    {} as Record<1 | 2 | 3 | 4 | 5, number>
  );

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="text-center">
        <div className="text-4xl font-bold text-accent-400">{averageRating.toFixed(1)}</div>
        <StarRatingInput rating={Math.round(averageRating)} onChange={() => {}} readonly size="sm" showLabel={false} />
        <p className="text-sm text-base-400 mt-2">
          {t('multimedia.rating.totalRatings', { count: ratings.length }, `${ratings.length} rating${ratings.length !== 1 ? 's' : ''}`)}
        </p>
      </div>

      <div className="space-y-2">
        {[5, 4, 3, 2, 1].map((star) => {
          const count = distribution[star as 1 | 2 | 3 | 4 | 5] || 0;
          const percentage = (count / ratings.length) * 100;

          return (
            <div key={star} className="flex items-center gap-2">
              <span className="text-sm text-base-400 w-8">{star}★</span>
              <div className="flex-1 bg-base-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-accent-500 h-full transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-sm text-base-400 w-12 text-right">{count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================================
// RATINGS LIST
// ============================================================================

interface RatingsListProps {
  tracks: AudioTrack[];
  filterRating?: number; // Show only tracks with this rating
  sortBy?: 'rating' | 'date';
  className?: string;
}

export function RatingsList({
  tracks,
  filterRating,
  sortBy = 'date',
  className = '',
}: RatingsListProps): JSX.Element {
  const { t } = useTranslation();
  const { getRating, getAllRatings } = useRatingStore();

  const allRatings = getAllRatings();
  const ratingMap = new Map(allRatings.map((r) => [r.trackId, r]));

  // Filter tracks that have ratings
  let ratedTracks = tracks.filter((track) => ratingMap.has(track.id));

  // Apply rating filter
  if (filterRating) {
    ratedTracks = ratedTracks.filter((track) => {
      const rating = ratingMap.get(track.id);
      return rating && rating.rating === filterRating;
    });
  }

  // Sort tracks
  ratedTracks.sort((a, b) => {
    const ratingA = ratingMap.get(a.id)!;
    const ratingB = ratingMap.get(b.id)!;

    if (sortBy === 'rating') {
      return ratingB.rating - ratingA.rating;
    } else {
      return new Date(ratingB.ratedAt).getTime() - new Date(ratingA.ratedAt).getTime();
    }
  });

  if (ratedTracks.length === 0) {
    return (
      <div className={`text-center text-base-400 py-8 ${className}`}>
        {filterRating
          ? t('multimedia.rating.noTracksWithRating', { rating: filterRating }, `No tracks with ${filterRating} star rating`)
          : t('multimedia.rating.noRatedTracks', 'No rated tracks yet')}
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {ratedTracks.map((track) => {
        const rating = ratingMap.get(track.id)!;

        return (
          <div key={track.id} className="bg-base-900 rounded-lg p-4">
            <div className="flex items-start gap-4">
              {track.coverUrl && (
                <img
                  src={track.coverUrl}
                  alt={track.title}
                  className="w-16 h-16 rounded object-cover flex-shrink-0"
                  loading="lazy"
                />
              )}
              <div className="flex-1 min-w-0">
                <h3 className="text-base-100 font-medium truncate">{track.title}</h3>
                <p className="text-base-400 text-sm truncate">{track.artist}</p>
                <div className="mt-2">
                  <StarRatingInput rating={rating.rating} onChange={() => {}} readonly size="sm" showLabel={false} />
                </div>
                {rating.comment && (
                  <p className="text-base-300 text-sm mt-2 line-clamp-2">{rating.comment}</p>
                )}
                <p className="text-xs text-base-500 mt-2">
                  {new Date(rating.ratedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default TrackRatingCard;
