import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Star, MessageSquare } from 'lucide-react';

const STARS = [1, 2, 3, 4, 5];

const ratingLabelKey = (value) => {
  if (value >= 5) return 'ratingExcellent';
  if (value >= 4) return 'ratingGreat';
  if (value >= 3) return 'ratingOkay';
  if (value >= 2) return 'ratingPoor';
  return 'ratingBad';
};

const ratingLabelFallback = (value) => {
  if (value >= 5) return 'Excellent!';
  if (value >= 4) return 'Great!';
  if (value >= 3) return 'It was okay';
  if (value >= 2) return 'Below expectations';
  return 'Poor service';
};

// Star rating + written review for a completed (paid) booking. On live mode the
// review persists via the server; offline it stays in local state. Once a review
// is present on the booking it renders the submitted state instead of the form.
export const ReviewSection = ({ booking, bookingLabel }) => {
  const { submitReview, t } = useApp();
  const [rating, setRating] = useState(0);
  const [text, setText] = useState('');
  const [hover, setHover] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const reviewed = booking?.userReview || null;

  if (reviewed) {
    return (
      <div className="bg-amber-50 border border-amber-200 p-5 rounded-2xl text-center space-y-2 animate-scale-up">
        <span className="inline-flex gap-1">
          {STARS.map((star) => (
            <Star
              key={star}
              className={`w-7 h-7 ${star <= reviewed.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
            />
          ))}
        </span>
        <p className="font-bold text-sm text-amber-950">✓ {t('reviewSubmitted', 'Review submitted')}</p>
        {reviewed.comment ? (
          <p className="text-xs text-amber-800 italic">“{reviewed.comment}”</p>
        ) : null}
        <p className="text-xs text-amber-800">
          {t('reviewThanks', 'Thank you for rating')} {bookingLabel}!
        </p>
      </div>
    );
  }

  const handleSubmit = async () => {
    if (rating < 1) {
      window.alert('Please select a star rating before submitting.');
      return;
    }
    setSubmitting(true);
    await submitReview(booking.id, rating, text);
    setSubmitting(false);
  };

  return (
    <div className="bg-white border-2 border-amber-300 rounded-2xl p-5 space-y-3 shadow-md">
      <div className="text-center space-y-1">
        <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full border border-amber-300">
          <MessageSquare className="w-3.5 h-3.5" />
          {t('rateYourShramik', 'Rate Your Shramik')}
        </div>
        <h3 className="text-lg font-bold font-heading text-slate-900">
          {t('howWasService', 'How was your service?')}
        </h3>
        <p className="text-xs text-slate-500">
          {t('rateHelpOthers', 'Tap a star to rate')} {bookingLabel}.
          {t('reviewHelpsOthers', ' Your review helps other customers.')}
        </p>
      </div>

      <div className="flex justify-center gap-2">
        {STARS.map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            className="transition-transform hover:scale-125"
            aria-label={`${star} star`}
          >
            <Star
              className={`w-9 h-9 cursor-pointer transition-colors ${star <= (hover || rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
            />
          </button>
        ))}
      </div>

      {rating > 0 && (
        <p className="text-center text-xs font-bold text-amber-700">
          {t(ratingLabelKey(rating), ratingLabelFallback(rating))}
        </p>
      )}

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        maxLength={500}
        rows={3}
        placeholder={t('writeReviewPlaceholder', 'Write a short review about your experience (optional)…')}
        className="w-full bg-slate-50 border border-slate-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-200 outline-none rounded-xl p-3 text-sm text-slate-800 placeholder:text-slate-400 transition-all resize-none"
      />

      <button
        onClick={handleSubmit}
        disabled={submitting}
        className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-amber-500/20 transition-all text-sm flex items-center justify-center space-x-2 disabled:opacity-60"
      >
        <Star className="w-4 h-4 fill-white" />
        <span>{submitting ? 'Submitting…' : t('submitReview', 'Submit Rating & Review')}</span>
      </button>
    </div>
  );
};