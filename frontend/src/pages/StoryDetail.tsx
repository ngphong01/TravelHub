import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getStoryBySlug, getFeaturedStories, likeStory } from '../services/story';
import Skeleton from '../components/Skeleton';
import SEOHead from '../components/SEOHead';
import toast from 'react-hot-toast';
import {
  CalendarDaysIcon,
  EyeIcon,
  ClockIcon,
  MapPinIcon,
  ArrowLeftIcon,
  ShareIcon,
  BookmarkIcon,
  ChatBubbleLeftEllipsisIcon,
  TagIcon,
  SparklesIcon,
  ChevronRightIcon,
  CheckBadgeIcon,
} from '@heroicons/react/24/outline';
import {
  HeartIcon as HeartIconSolid,
  BookmarkIcon as BookmarkIconSolid,
} from '@heroicons/react/24/solid';

export default function StoryDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [hasLiked, setHasLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  // Fetch story details
  const { data: story, isLoading, error } = useQuery({
    queryKey: ['story', slug],
    queryFn: () => getStoryBySlug(slug!),
    enabled: !!slug,
    retry: 1,
  });

  // Fetch related/featured stories
  const { data: relatedStories = [] } = useQuery({
    queryKey: ['featured-stories-aside'],
    queryFn: () => getFeaturedStories(4),
  });

  // Like mutation
  const likeMutation = useMutation({
    mutationFn: () => likeStory(story!.id, !hasLiked),
    onSuccess: (data) => {
      setHasLiked(!hasLiked);
      queryClient.setQueryData(['story', slug], (old: any) => {
        if (!old) return old;
        return { ...old, likes: data.likes };
      });
      toast.success(hasLiked ? 'Đã bỏ thích câu chuyện' : 'Cảm ơn bạn đã yêu thích câu chuyện này!');
    },
    onError: () => {
      toast.error('Không thể cập nhật lượt thích');
    },
  });

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: story?.title,
        text: story?.excerpt,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast.success('Đã sao chép liên kết vào bộ nhớ tạm!');
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleSaveToggle = () => {
    setIsSaved(!isSaved);
    toast.success(isSaved ? 'Đã bỏ lưu câu chuyện' : 'Đã lưu vào danh sách đọc của bạn!');
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Gần đây';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Estimate read time (words / 200 words per minute)
  const calculateReadTime = (content?: string) => {
    if (!content) return '3 phút đọc';
    const words = content.trim().split(/\s+/).length;
    const minutes = Math.max(1, Math.round(words / 180));
    return `${minutes} phút đọc`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 py-12 transition-colors">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <Skeleton className="h-8 w-40 rounded-lg" />
          <Skeleton className="h-14 w-full rounded-2xl" />
          <Skeleton className="h-6 w-1/2 rounded-lg" />
          <Skeleton className="h-[420px] w-full rounded-3xl" />
          <div className="space-y-4 pt-6">
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-3/4 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !story) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex items-center justify-center px-4 transition-colors">
        <div className="text-center max-w-md bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-slate-800">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-950/40 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ChatBubbleLeftEllipsisIcon className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Không tìm thấy câu chuyện
          </h2>
          <p className="text-gray-500 dark:text-slate-400 mb-6 text-sm">
            Câu chuyện này có thể đã được gỡ xuống hoặc đường dẫn không chính xác.
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-200 font-semibold hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors text-sm"
            >
              Quay lại
            </button>
            <Link
              to="/stories"
              className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors text-sm shadow-md"
            >
              Xem tất cả câu chuyện
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const otherStories = relatedStories.filter((s) => s.slug !== slug).slice(0, 3);
  const heroImage =
    story.image ||
    story.destination?.image ||
    '/uploads/stories/story-ninhbinh-trangan.jpg';

  return (
    <>
      <SEOHead
        title={`${story.title} - Trải Nghiệm Du Lịch TravelHub`}
        description={story.excerpt || story.title}
        image={heroImage}
        type="article"
      />

      <div className="min-h-screen bg-gray-50/50 dark:bg-slate-950 text-gray-900 dark:text-slate-100 transition-colors">
        {/* Navigation Breadcrumb */}
        <div className="border-b border-gray-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md sticky top-0 z-30">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between text-xs sm:text-sm">
            <div className="flex items-center gap-2 text-gray-500 dark:text-slate-400 truncate">
              <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Trang chủ
              </Link>
              <span>/</span>
              <Link to="/stories" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Câu chuyện du lịch
              </Link>
              <span>/</span>
              <span className="text-gray-800 dark:text-slate-200 font-medium truncate max-w-[200px] sm:max-w-xs">
                {story.title}
              </span>
            </div>

            <Link
              to="/stories"
              className="inline-flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-semibold hover:underline flex-shrink-0 ml-4"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              <span>Tất cả câu chuyện</span>
            </Link>
          </div>
        </div>

        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          {/* Header Metadata */}
          <header className="mb-8 sm:mb-12">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {story.category && (
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                  {story.category}
                </span>
              )}
              {story.destination && (
                <Link
                  to={`/destinations/${story.destination.slug}`}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 hover:bg-emerald-200 transition-colors"
                >
                  <MapPinIcon className="w-3.5 h-3.5" />
                  {story.destination.name}
                </Link>
              )}
              {story.featured && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                  <SparklesIcon className="w-3.5 h-3.5 text-amber-500" />
                  Câu chuyện nổi bật
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white leading-[1.2] tracking-tight mb-6">
              {story.title}
            </h1>

            {/* Author info & Actions bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-y border-gray-200 dark:border-slate-800">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-lg flex items-center justify-center shadow-md shadow-blue-500/20 flex-shrink-0">
                  {story.author ? story.author.charAt(0).toUpperCase() : 'T'}
                </div>
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-gray-900 dark:text-white">
                    <span>{story.author || 'Du khách TravelHub'}</span>
                    <CheckBadgeIcon className="w-4 h-4 text-blue-500" title="Tác giả được xác thực" />
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-slate-400 mt-0.5">
                    <span className="flex items-center gap-1">
                      <CalendarDaysIcon className="w-3.5 h-3.5" />
                      {formatDate(story.publishedAt || story.createdAt)}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <ClockIcon className="w-3.5 h-3.5" />
                      {calculateReadTime(story.content)}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <EyeIcon className="w-3.5 h-3.5" />
                      {story.views || 1} lượt xem
                    </span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={() => likeMutation.mutate()}
                  disabled={likeMutation.isPending}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
                    hasLiked
                      ? 'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-950/40 dark:border-rose-900 dark:text-rose-400 shadow-sm'
                      : 'bg-white dark:bg-slate-900 text-gray-700 dark:text-slate-300 border-gray-200 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <HeartIconSolid className={`w-4 h-4 ${hasLiked ? 'text-rose-500' : 'text-gray-400'}`} />
                  <span>{story.likes || 0}</span>
                </button>

                <button
                  type="button"
                  onClick={handleSaveToggle}
                  className={`p-2 rounded-xl text-xs font-semibold transition-all border ${
                    isSaved
                      ? 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-950/40 dark:border-blue-900 dark:text-blue-400'
                      : 'bg-white dark:bg-slate-900 text-gray-700 dark:text-slate-300 border-gray-200 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800'
                  }`}
                  title={isSaved ? 'Đã lưu' : 'Lưu câu chuyện'}
                >
                  {isSaved ? (
                    <BookmarkIconSolid className="w-4 h-4 text-blue-600" />
                  ) : (
                    <BookmarkIcon className="w-4 h-4" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleShare}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-900 text-gray-700 dark:text-slate-300 border border-gray-200 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <ShareIcon className="w-4 h-4 text-gray-500" />
                  <span>{copied ? 'Đã sao chép' : 'Chia sẻ'}</span>
                </button>
              </div>
            </div>
          </header>

          {/* Featured Cover Image */}
          <div className="relative rounded-3xl overflow-hidden shadow-2xl mb-10 aspect-[16/9] border border-gray-100 dark:border-slate-800">
            <img
              src={heroImage}
              alt={story.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/uploads/stories/story-ninhbinh-trangan.jpg';
              }}
            />
            {story.destination && (
              <div className="absolute bottom-4 left-4 px-3.5 py-1.5 rounded-xl bg-black/60 backdrop-blur-md text-white text-xs font-semibold flex items-center gap-1.5">
                <MapPinIcon className="w-4 h-4 text-cyan-400" />
                <span>Ảnh chụp tại: {story.destination.name}</span>
              </div>
            )}
          </div>

          {/* Excerpt quote */}
          {story.excerpt && (
            <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-indigo-950/40 border-l-4 border-blue-600 dark:border-blue-500 mb-10">
              <p className="text-lg sm:text-xl font-medium text-gray-800 dark:text-slate-200 italic leading-relaxed">
                "{story.excerpt}"
              </p>
            </div>
          )}

          {/* Story Main Content */}
          <div className="prose prose-lg dark:prose-invert max-w-none text-gray-800 dark:text-slate-200 leading-relaxed font-normal space-y-6">
            {story.content ? (
              story.content.split('\n\n').map((paragraph: string, idx: number) => {
                const trimmed = paragraph.trim();
                if (!trimmed) return null;
                // Check if it's a heading
                if (trimmed.startsWith('#')) {
                  const headingText = trimmed.replace(/^#+\s*/, '');
                  return (
                    <h3 key={idx} className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
                      {headingText}
                    </h3>
                  );
                }
                return (
                  <p key={idx} className="text-base sm:text-lg leading-relaxed text-gray-700 dark:text-slate-300">
                    {trimmed}
                  </p>
                );
              })
            ) : (
              <p className="text-gray-500 italic">Nội dung câu chuyện đang được cập nhật...</p>
            )}
          </div>

          {/* Tags */}
          {story.tags && story.tags.length > 0 && (
            <div className="mt-10 pt-6 border-t border-gray-200 dark:border-slate-800">
              <div className="flex items-center gap-2 flex-wrap">
                <TagIcon className="w-4 h-4 text-gray-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400">
                  Chủ đề:
                </span>
                {story.tags.map((tag: string, i: number) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Linked Destination CTA Card */}
          {story.destination && (
            <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white shadow-xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md mb-2 inline-block">
                    Điểm đến trong câu chuyện
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold mb-1">
                    Khám phá {story.destination.name}
                  </h3>
                  <p className="text-sm text-blue-100 max-w-xl">
                    Lên kế hoạch trải nghiệm thực tế ngay hôm nay với các tour và ưu đãi độc quyền từ TravelHub.
                  </p>
                </div>
                <Link
                  to={`/destinations/${story.destination.slug}`}
                  className="px-6 py-3.5 rounded-2xl bg-white text-blue-700 hover:bg-blue-50 font-bold text-sm transition-all shadow-lg hover:shadow-xl flex items-center gap-2 flex-shrink-0"
                >
                  <span>Xem tour & trải nghiệm</span>
                  <ChevronRightIcon className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}

          {/* Related Stories */}
          {otherStories.length > 0 && (
            <section className="mt-16 pt-10 border-t border-gray-200 dark:border-slate-800">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">
                    Câu chuyện du lịch khác
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 mt-1">
                    Cùng cảm nhận thêm những góc nhìn và chia sẻ chân thật từ cộng đồng
                  </p>
                </div>
                <Link
                  to="/stories"
                  className="text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                  <span>Xem tất cả</span>
                  <ChevronRightIcon className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {otherStories.map((item) => (
                  <Link
                    key={item.id}
                    to={`/stories/${item.slug}`}
                    className="group bg-white dark:bg-slate-900 rounded-2xl border border-gray-200/80 dark:border-slate-800 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative aspect-[16/10] overflow-hidden bg-gray-100 dark:bg-slate-800">
                        <img
                          src={item.image || '/uploads/stories/story-ninhbinh-trangan.jpg'}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {item.destination && (
                          <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/90 dark:bg-slate-900/90 text-gray-800 dark:text-white backdrop-blur-sm">
                            {item.destination.name}
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h4 className="font-bold text-sm text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {item.title}
                        </h4>
                        {item.excerpt && (
                          <p className="text-xs text-gray-500 dark:text-slate-400 mt-2 line-clamp-2">
                            {item.excerpt}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="px-4 pb-4 pt-1 flex items-center justify-between text-[11px] text-gray-400 dark:text-slate-500 border-t border-gray-50 dark:border-slate-800/50">
                      <span>{item.author || 'Du khách'}</span>
                      <span className="flex items-center gap-1 text-rose-500 font-semibold">
                        <HeartIconSolid className="w-3 h-3" />
                        {item.likes || 0}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </article>
      </div>
    </>
  );
}