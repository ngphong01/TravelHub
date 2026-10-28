import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import { StarIcon as StarOutline, HandThumbUpIcon, ChatBubbleBottomCenterTextIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarSolid, CheckBadgeIcon } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';

interface Review {
  id: string | number;
  author?: string;
  name?: string;
  rating: number;
  comment: string;
  date?: string;
  createdAt?: string;
  helpfulCount?: number;
  user?: {
    name?: string;
    avatarUrl?: string;
  };
}

interface ReviewSectionProps {
  type: 'tour' | 'destination';
  targetId: number;
  slug: string;
  title: string;
}

export default function ReviewSection({ type, targetId, slug, title }: ReviewSectionProps) {
  const queryClient = useQueryClient();
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [authorName, setAuthorName] = useState<string>('');
  const [comment, setComment] = useState<string>('');
  const [helpfulVotes, setHelpfulVotes] = useState<Record<string, number>>({});
  const [selectedStarFilter, setSelectedStarFilter] = useState<number | null>(null);

  // Query reviews
  const { data: reviews = [], isLoading, isError, refetch } = useQuery<Review[]>({
    queryKey: ['reviews', type, targetId || slug],
    queryFn: async () => {
      if (type === 'tour') {
        const res = await api.get(`/tour/${targetId}/reviews`);
        return res.data || [];
      } else {
        const res = await api.get(`/review/slug/${slug}`);
        return res.data || [];
      }
    },
    enabled: !!(targetId || slug),
  });

  // Submit mutation
  const submitMutation = useMutation({
    mutationFn: async (newReview: { rating: number; comment: string; author: string }) => {
      if (type === 'tour') {
        const res = await api.post(`/tour/${targetId}/reviews`, {
          rating: newReview.rating,
          comment: newReview.comment,
          author: newReview.author,
        });
        return res.data;
      } else {
        const res = await api.post(`/review`, {
          slug,
          rating: newReview.rating,
          comment: newReview.comment,
          author: newReview.author,
        });
        return res.data;
      }
    },
    onSuccess: () => {
      toast.success('Cảm ơn bạn đã gửi đánh giá trải nghiệm!');
      setComment('');
      setRating(5);
      queryClient.invalidateQueries({ queryKey: ['reviews', type, targetId || slug] });
      queryClient.invalidateQueries({ queryKey: ['tour', slug] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Có lỗi xảy ra khi gửi đánh giá');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.error('Vui lòng nhập nội dung đánh giá');
      return;
    }
    submitMutation.mutate({
      rating,
      comment: comment.trim(),
      author: authorName.trim() || 'Du khách TravelHub',
    });
  };

  const handleHelpful = (reviewId: string | number) => {
    setHelpfulVotes((prev) => ({
      ...prev,
      [String(reviewId)]: (prev[String(reviewId)] || 0) + 1,
    }));
    toast.success('Cảm ơn phản hồi của bạn!');
  };

  // Calculate averages
  const totalReviews = reviews.length;
  const avgRating =
    totalReviews > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
      : '—';

  const starCounts = [5, 4, 3, 2, 1].map((s) => {
    const count = reviews.filter((r) => Math.round(r.rating) === s).length;
    const percent = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
    return { star: s, count, percent };
  });



  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200/80 dark:border-slate-800 p-6 sm:p-10 shadow-sm mt-10 transition-colors">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100 dark:border-slate-800 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300 text-xs font-bold mb-2">
            <CheckBadgeIcon className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            Đánh giá TravelHub
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2.5">
            <ChatBubbleBottomCenterTextIcon className="w-7 h-7 text-cyan-600 dark:text-cyan-400" />
            Đánh Giá & Nhận Xét Từ Cộng Đồng
          </h2>
          <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
            Nhận xét đã được duyệt về {title}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 pb-8 border-b border-gray-100 dark:border-slate-800">
        <div className="rounded-2xl bg-cyan-50 dark:bg-slate-800 p-6 text-center">
          <span className="text-4xl font-bold text-cyan-700 dark:text-cyan-300">{avgRating}</span>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{totalReviews} đánh giá đã duyệt</p>
        </div>
        <div className="space-y-2">
          {starCounts.map((item) => (
            <div key={item.star} className="flex items-center gap-3 text-sm">
              <span className="w-8">{item.star} ★</span>
              <div className="h-2 flex-1 rounded bg-gray-100 dark:bg-slate-700">
                <div className="h-2 rounded bg-amber-400" style={{ width: `${item.percent}%` }} />
              </div>
              <span className="w-8 text-right">{item.count}</span>
            </div>
          ))}
        </div>
      </div>


      {/* Submit Review Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-gray-50/70 dark:bg-slate-800/40 border border-gray-200/80 dark:border-slate-800 rounded-2xl p-6 mb-10 shadow-inner"
      >
        <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">Chia sẻ trải nghiệm của bạn</h3>
        <p className="text-xs text-gray-500 dark:text-slate-400 mb-4">
          Ý kiến đóng góp chân thực của bạn giúp hàng nghìn du khách đưa ra quyết định đúng đắn.
        </p>

        {/* Star Rating Selector */}
        <div className="mb-4">
          <label className="text-xs font-semibold text-gray-700 dark:text-slate-300 block mb-1">Mức độ hài lòng:</label>
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="p-1 text-amber-400 hover:scale-125 transition-transform"
              >
                {star <= (hoverRating || rating) ? (
                  <StarSolid className="w-7 h-7" />
                ) : (
                  <StarOutline className="w-7 h-7 text-gray-300 dark:text-slate-600" />
                )}
              </button>
            ))}
            <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 ml-2">
              {rating === 5
                ? 'Tuyệt vời (5/5)'
                : rating === 4
                ? 'Rất tốt (4/5)'
                : rating === 3
                ? 'Hài lòng (3/5)'
                : rating === 2
                ? 'Tạm được (2/5)'
                : 'Chưa tốt (1/5)'}
            </span>
          </div>
        </div>

        {/* Name input */}
        <div className="mb-4">
          <label className="text-xs font-semibold text-gray-700 dark:text-slate-300 block mb-1">Họ tên của bạn:</label>
          <input
            type="text"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            placeholder="Ví dụ: Nguyễn Văn Phong"
            className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
          />
        </div>

        {/* Comment textarea */}
        <div className="mb-4">
          <label className="text-xs font-semibold text-gray-700 dark:text-slate-300 block mb-1">Nhận xét chi tiết:</label>
          <textarea
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Cảm nhận về hướng dẫn viên, lịch trình, xe đưa đón, chất lượng đồ ăn và khách sạn..."
            className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 bg-white dark:bg-slate-800 text-gray-900 dark:text-white resize-none"
          ></textarea>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitMutation.isPending}
          className="px-6 py-2.5 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md shadow-cyan-600/20 transition flex items-center gap-2"
        >
          {submitMutation.isPending ? 'Đang gửi...' : 'Gửi đánh giá trải nghiệm'}
        </button>
      </form>

      {/* Review List Header with Tripadvisor Filters */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-3 border-b border-gray-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              Đánh giá từ khách hàng ({reviews.length})
            </h3>
            <p className="text-xs text-gray-500 dark:text-slate-400">Nhận xét đã được duyệt</p>
          </div>

          {/* Star Filter Tabs */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => setSelectedStarFilter(null)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                selectedStarFilter === null
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700'
              }`}
            >
              Tất cả ({reviews.length})
            </button>
            {[5, 4, 3, 2, 1].map((s) => {
              const count = reviews.filter((r) => r.rating === s).length;
              return (
                <button
                  key={s}
                  onClick={() => setSelectedStarFilter(selectedStarFilter === s ? null : s)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition flex items-center gap-1 ${
                    selectedStarFilter === s
                      ? 'bg-amber-500 text-white shadow-sm'
                      : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <span>{s}★</span>
                  <span className="text-[10px] opacity-80">({count})</span>
                </button>
              );
            })}
          </div>
        </div>


        {/* Reviews List */}
        {isLoading ? (
          <p className="text-xs text-gray-400 italic">Đang tải đánh giá...</p>
        ) : isError ? (
          <div role="alert" className="text-sm text-red-700">Không tải được đánh giá. <button type="button" onClick={() => refetch()} className="underline">Thử lại</button></div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 dark:bg-slate-800/40 rounded-2xl border border-gray-100 dark:border-slate-800">
            <p className="text-sm text-gray-500 dark:text-slate-400">Chưa có đánh giá nào. Hãy là người đầu tiên đánh giá!</p>
          </div>
        ) : (
          (selectedStarFilter ? reviews.filter((r) => r.rating === selectedStarFilter) : reviews).map((rev, idx) => {
            const author = rev.author || rev.user?.name || rev.name || 'Du khách TravelHub';
            const dateStr = rev.date || rev.createdAt ? new Date(rev.date || rev.createdAt!).toLocaleDateString('vi-VN') : 'Gần đây';
            const reviewId = rev.id || idx;
            const extraVotes = helpfulVotes[String(reviewId)] || 0;

            return (
              <div
                key={reviewId}
                className="p-5 rounded-2xl bg-white dark:bg-slate-800/60 border border-gray-100 dark:border-slate-800 shadow-sm hover:border-gray-200 dark:hover:border-slate-700 transition"
              >
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                      {author.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-gray-900 dark:text-white text-sm">{author}</h4>
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                          <CheckBadgeIcon className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          Đã duyệt
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-400 dark:text-slate-500 mt-0.5">{dateStr}</p>
                    </div>
                  </div>

                  <div className="flex items-center text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <StarSolid
                        key={s}
                        className={`w-4 h-4 ${s <= rev.rating ? 'text-amber-400' : 'text-gray-200 dark:text-slate-700'}`}
                      />
                    ))}
                  </div>
                </div>

                <p className="text-sm text-gray-700 dark:text-slate-200 leading-relaxed mt-2 mb-3">{rev.comment}</p>

                <div className="flex items-center gap-2 pt-2 border-t border-gray-50 dark:border-slate-800">
                  <button
                    onClick={() => handleHelpful(reviewId)}
                    className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition px-2.5 py-1 rounded-md hover:bg-gray-50 dark:hover:bg-slate-700"
                  >
                    <HandThumbUpIcon className="w-3.5 h-3.5" />
                    <span>Hữu ích ({ (rev.helpfulCount || 0) + extraVotes })</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
