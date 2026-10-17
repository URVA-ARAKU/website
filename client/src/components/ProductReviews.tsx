import React, { useState, useMemo } from 'react';
import {
  FaStar,
  FaRegStar,
  FaCheckCircle,
  FaThumbsUp,
  FaLightbulb,
  FaMapMarkerAlt,
  FaPen,
  FaFilter,
  FaTimes,
  FaQuoteLeft,
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useGetReviewsQuery, useAddReviewMutation } from '../redux/api/review.api';
import { ProductReview } from '../types/api-types';

interface ProductReviewsProps {
  productId?: string;
  productName?: string;
}

export const ProductReviews: React.FC<ProductReviewsProps> = ({ productId, productName }) => {
  const { data, isLoading } = useGetReviewsQuery(productId);
  const [addReview, { isLoading: isSubmitting }] = useAddReviewMutation();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [filterRating, setFilterRating] = useState<number | 'all'>('all');
  const [onlySuggestions, setOnlySuggestions] = useState(false);

  // Review Form State
  const [authorName, setAuthorName] = useState('');
  const [authorLocation, setAuthorLocation] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [suggestion, setSuggestion] = useState('');

  // Helpful counts local state
  const [helpfulMap, setHelpfulMap] = useState<Record<string, number>>({});
  const [votedMap, setVotedMap] = useState<Record<string, boolean>>({});

  const reviews: ProductReview[] = useMemo(() => {
    return data?.reviews || [];
  }, [data]);

  // Calculations
  const totalReviews = reviews.length;
  const avgRating = totalReviews > 0
    ? (reviews.reduce((sum, r) => sum + (r.rating || 5), 0) / totalReviews).toFixed(1)
    : '4.9';

  const ratingCounts = useMemo(() => {
    const counts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((r) => {
      const star = Math.min(5, Math.max(1, Math.round(r.rating || 5)));
      counts[star] = (counts[star] || 0) + 1;
    });
    return counts;
  }, [reviews]);

  const filteredReviews = useMemo(() => {
    return reviews.filter((r) => {
      if (filterRating !== 'all' && Math.round(r.rating) !== filterRating) {
        return false;
      }
      if (onlySuggestions && (!r.suggestion || r.suggestion.trim().length === 0)) {
        return false;
      }
      return true;
    });
  }, [reviews, filterRating, onlySuggestions]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !comment.trim()) {
      toast.error('Please enter your name and review comment');
      return;
    }

    try {
      const res = await addReview({
        productId: productId || 'all',
        productName: productName || 'URVA Specialty',
        authorName: authorName.trim(),
        authorLocation: authorLocation.trim() || 'Verified Indian Patron',
        rating,
        title: title.trim() || `${rating}-Star Experience with URVA`,
        comment: comment.trim(),
        suggestion: suggestion.trim() || undefined,
      }).unwrap();

      toast.success(res.message || 'Thank you for your valuable feedback!');
      setIsFormOpen(false);
      setAuthorName('');
      setAuthorLocation('');
      setTitle('');
      setComment('');
      setSuggestion('');
      setRating(5);
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to submit review. Please try again.');
    }
  };

  const handleHelpful = (id: string, initialCount = 0) => {
    if (votedMap[id]) return;
    setHelpfulMap((prev) => ({
      ...prev,
      [id]: (prev[id] ?? initialCount) + 1,
    }));
    setVotedMap((prev) => ({ ...prev, [id]: true }));
    toast.success('Thank you for your feedback!');
  };

  return (
    <section className="mt-14 pt-10 border-t border-[#E2D9CC]">
      {/* ─── Header & Ratings Summary ─── */}
      <div className="bg-[#FAF8F4] border border-[#E2D9CC] rounded-3xl p-6 sm:p-8 shadow-sm mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          {/* Left: Overall Score */}
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            <div className="flex flex-col items-center justify-center w-28 h-28 rounded-2xl bg-[#5A3825] text-[#FAF8F4] p-3 shadow-md">
              <span className="text-4xl font-extrabold tracking-tight font-serif">{avgRating}</span>
              <div className="flex items-center text-amber-300 text-xs mt-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <FaStar key={s} />
                ))}
              </div>
              <span className="text-[10px] text-[#E2D9CC] mt-1 font-medium">Out of 5.0</span>
            </div>

            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-semibold tracking-wide uppercase mb-2">
                ✓ Verified Customer Reviews
              </span>
              <h3 className="text-2xl font-serif font-bold text-[#5A3825]">
                Customer Reviews & Suggestions
              </h3>
              <p className="text-xs sm:text-sm text-[#8C7364] mt-1 max-w-md">
                Honest feedback from patrons across India supporting rural artisans and tribal farmers.
              </p>
            </div>
          </div>

          {/* Center: Rating Breakdown Bars */}
          <div className="flex-1 max-w-sm space-y-2">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = ratingCounts[star] || 0;
              const pct = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
              return (
                <div key={star} className="flex items-center gap-2 text-xs text-[#5A3825]">
                  <span className="w-10 flex items-center gap-1 font-medium">
                    {star} <FaStar className="text-amber-500 text-[10px]" />
                  </span>
                  <div className="flex-1 h-2 rounded-full bg-[#EAE5D9] overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-8 text-right text-[11px] text-[#8C7364]">{count}</span>
                </div>
              );
            })}
          </div>

          {/* Right: CTA to Write Review */}
          <div className="flex flex-col items-center sm:items-end justify-center">
            <button
              type="button"
              onClick={() => setIsFormOpen(true)}
              className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#5A3825] hover:bg-[#3F2618] text-[#F4F1EA] text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all"
            >
              <FaPen className="text-xs text-amber-300" />
              <span>Write a Review & Feedback</span>
            </button>
            <p className="text-[11px] text-[#8C7364] mt-2 text-center sm:text-right">
              Share your suggestions to improve our rural crafts
            </p>
          </div>
        </div>
      </div>

      {/* ─── Filters & Search Controls ─── */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="flex items-center gap-1 text-[#8C7364] font-medium mr-1">
            <FaFilter className="text-[10px]" /> Filter:
          </span>
          <button
            type="button"
            onClick={() => setFilterRating('all')}
            className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
              filterRating === 'all'
                ? 'bg-[#5A3825] text-white border-[#5A3825]'
                : 'bg-[#FAF8F4] text-[#5A3825] border-[#E2D9CC] hover:bg-[#EAE5D9]'
            }`}
          >
            All Ratings ({totalReviews})
          </button>
          {[5, 4, 3].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setFilterRating(star)}
              className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors flex items-center gap-1 ${
                filterRating === star
                  ? 'bg-[#5A3825] text-white border-[#5A3825]'
                  : 'bg-[#FAF8F4] text-[#5A3825] border-[#E2D9CC] hover:bg-[#EAE5D9]'
              }`}
            >
              <span>{star}</span>
              <FaStar className="text-[10px] text-amber-400" />
              <span>({ratingCounts[star] || 0})</span>
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setOnlySuggestions(!onlySuggestions)}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
            onlySuggestions
              ? 'bg-amber-100 border-amber-400 text-amber-900 font-semibold'
              : 'bg-[#FAF8F4] border-[#E2D9CC] text-[#5A3825] hover:bg-[#EAE5D9]'
          }`}
        >
          <FaLightbulb className={onlySuggestions ? 'text-amber-600' : 'text-[#8C7364]'} />
          <span>With Customer Suggestions</span>
        </button>
      </div>

      {/* ─── Review Cards Grid ─── */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-7 h-7 border-2 border-[#5A3825] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="bg-[#FAF8F4] border border-[#E2D9CC] rounded-2xl p-10 text-center">
          <FaQuoteLeft className="mx-auto text-2xl text-[#8C7364]/40 mb-3" />
          <p className="text-sm font-semibold text-[#5A3825]">No reviews matching your filter.</p>
          <p className="text-xs text-[#8C7364] mt-1">Be the first to leave a review and suggestion for this craft!</p>
          <button
            type="button"
            onClick={() => setIsFormOpen(true)}
            className="mt-4 px-4 py-2 rounded-lg bg-[#5A3825] text-white text-xs font-semibold"
          >
            Leave Feedback
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredReviews.map((rev) => {
            const helpfulCount = (rev.helpfulCount || 0) + (helpfulMap[rev.id] || 0);
            const hasVoted = !!votedMap[rev.id];

            return (
              <div
                key={rev.id}
                className="bg-[#FAF8F4] border border-[#E2D9CC] rounded-2xl p-5 sm:p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow"
              >
                <div>
                  {/* Top: Stars, Date & Verified Tag */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-1 text-amber-500 text-xs">
                      {[1, 2, 3, 4, 5].map((s) =>
                        s <= rev.rating ? (
                          <FaStar key={s} />
                        ) : (
                          <FaRegStar key={s} className="text-[#C8BBAA]" />
                        )
                      )}
                    </div>
                    <span className="text-[11px] text-[#8C7364]">
                      {rev.createdAt
                        ? new Date(rev.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })
                        : 'Recent'}
                    </span>
                  </div>

                  {/* Title */}
                  <h4 className="text-sm sm:text-base font-bold text-[#5A3825] leading-snug mb-2 font-serif">
                    {rev.title}
                  </h4>

                  {/* Comment */}
                  <p className="text-xs sm:text-sm text-[#5A3825]/90 leading-relaxed font-sans mb-4">
                    {rev.comment}
                  </p>

                  {/* Customer Suggestion Box (if present) */}
                  {rev.suggestion && rev.suggestion.trim() && (
                    <div className="bg-[#F4EFE6] border-l-4 border-[#8B5A2B] rounded-r-xl p-3 mb-4 text-xs">
                      <div className="flex items-center gap-1.5 font-semibold text-[#8B5A2B] mb-1">
                        <FaLightbulb className="text-amber-600 text-xs" />
                        <span>Customer Suggestion & Idea:</span>
                      </div>
                      <p className="text-[#5A3825] italic leading-relaxed">
                        &ldquo;{rev.suggestion}&rdquo;
                      </p>
                    </div>
                  )}
                </div>

                {/* Footer: Author Info & Helpful Button */}
                <div className="pt-3 border-t border-[#EAE5D9] flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#5A3825] text-white flex items-center justify-center font-bold text-xs uppercase">
                      {rev.authorName ? rev.authorName[0] : 'U'}
                    </div>
                    <div>
                      <div className="flex items-center gap-1 font-semibold text-[#5A3825]">
                        <span>{rev.authorName}</span>
                        {rev.verifiedPurchase && (
                          <span
                            title="Verified Purchase"
                            className="text-emerald-600 inline-flex items-center text-[11px]"
                          >
                            <FaCheckCircle />
                          </span>
                        )}
                      </div>
                      {rev.authorLocation && (
                        <div className="flex items-center gap-1 text-[10px] text-[#8C7364]">
                          <FaMapMarkerAlt className="text-[9px]" />
                          <span>{rev.authorLocation}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleHelpful(rev.id, rev.helpfulCount)}
                    disabled={hasVoted}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] transition-colors ${
                      hasVoted
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300 cursor-default'
                        : 'bg-[#FAF8F4] text-[#8C7364] border-[#E2D9CC] hover:text-[#5A3825] hover:bg-[#EAE5D9]'
                    }`}
                  >
                    <FaThumbsUp className={hasVoted ? 'text-emerald-600' : 'text-[#8C7364]'} />
                    <span>Helpful ({helpfulCount})</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ─── Write a Review Modal ─── */}
      {isFormOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setIsFormOpen(false)}
        >
          <div
            className="relative w-full max-w-xl bg-[#FAF8F4] border border-[#E2D9CC] rounded-3xl p-6 sm:p-8 shadow-2xl my-8 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#EAE5D9] hover:bg-[#DDD5C5] text-[#5A3825] flex items-center justify-center transition-colors"
            >
              <FaTimes />
            </button>

            <div className="mb-6">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#8B5A2B]">
                Your Voice Matters
              </span>
              <h3 className="text-xl sm:text-2xl font-bold font-serif text-[#5A3825] mt-1">
                Write a Review & Suggestion
              </h3>
              <p className="text-xs text-[#8C7364] mt-1">
                Tell us about your experience with{' '}
                <span className="font-semibold text-[#5A3825]">
                  {productName || 'our rural products'}
                </span>
                . Your suggestions directly guide our village artisan cooperatives!
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Star Rating Selector */}
              <div>
                <label className="block text-xs font-bold text-[#5A3825] uppercase tracking-wider mb-1.5">
                  Your Overall Rating *
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="p-1 focus:outline-none transition-transform hover:scale-125"
                    >
                      <FaStar
                        className={`text-2xl transition-colors ${
                          star <= (hoverRating || rating)
                            ? 'text-amber-400'
                            : 'text-[#D9CEBF]'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-semibold text-[#5A3825] ml-2">
                    {rating === 5
                      ? 'Exceptional (5/5)'
                      : rating === 4
                      ? 'Very Good (4/5)'
                      : rating === 3
                      ? 'Average (3/5)'
                      : rating === 2
                      ? 'Could Be Better (2/5)'
                      : 'Disappointed (1/5)'}
                  </span>
                </div>
              </div>

              {/* Name & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#5A3825] mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="e.g. Ramesh V."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2D9CC] bg-[#F4F1EA] text-[#5A3825] text-xs focus:ring-2 focus:ring-[#5A3825] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#5A3825] mb-1">
                    City / State
                  </label>
                  <input
                    type="text"
                    value={authorLocation}
                    onChange={(e) => setAuthorLocation(e.target.value)}
                    placeholder="e.g. Hyderabad, TS"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2D9CC] bg-[#F4F1EA] text-[#5A3825] text-xs focus:ring-2 focus:ring-[#5A3825] outline-none"
                  />
                </div>
              </div>

              {/* Headline / Title */}
              <div>
                <label className="block text-xs font-semibold text-[#5A3825] mb-1">
                  Review Headline
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Authentic Araku aroma, completely fresh!"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2D9CC] bg-[#F4F1EA] text-[#5A3825] text-xs focus:ring-2 focus:ring-[#5A3825] outline-none"
                />
              </div>

              {/* Review Comment */}
              <div>
                <label className="block text-xs font-semibold text-[#5A3825] mb-1">
                  Detailed Experience & Review *
                </label>
                <textarea
                  required
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share details on the aroma, texture, quality, packaging, and your overall experience..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2D9CC] bg-[#F4F1EA] text-[#5A3825] text-xs focus:ring-2 focus:ring-[#5A3825] outline-none"
                />
              </div>

              {/* Suggestions Section */}
              <div className="bg-[#F4EFE6] border border-[#E2D9CC] rounded-2xl p-3.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#8B5A2B] mb-1">
                  <FaLightbulb className="text-amber-600" />
                  <span>Suggestions for URVA (Optional)</span>
                </div>
                <p className="text-[11px] text-[#8C7364] mb-2">
                  What new pack sizes, blends, handicrafts, or improvements would you love to see next?
                </p>
                <textarea
                  rows={2}
                  value={suggestion}
                  onChange={(e) => setSuggestion(e.target.value)}
                  placeholder="e.g. Please introduce a 1kg family pouch or combo gift hamper with raw honey..."
                  className="w-full px-3 py-2 rounded-xl border border-[#E2D9CC] bg-[#FAF8F4] text-[#5A3825] text-xs focus:ring-2 focus:ring-[#8B5A2B] outline-none"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#8C7364] hover:bg-[#EAE5D9] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-[#5A3825] hover:bg-[#3F2618] disabled:opacity-50 text-[#F4F1EA] text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all"
                >
                  {isSubmitting ? 'Posting Feedback...' : 'Submit Feedback'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default ProductReviews;
