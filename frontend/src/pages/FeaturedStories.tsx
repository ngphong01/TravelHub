import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getStories } from '../services/story';
import { 
  BookOpenIcon, 
  CalendarDaysIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  EyeIcon, 
  MapPinIcon,
  ClockIcon,
  SparklesIcon,
  ArrowRightIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import Skeleton from '../components/Skeleton';
import SEOHead from '../components/SEOHead';

function FeaturedStories() {
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState<string | undefined>(undefined);
  const limit = 9;

  const { data, isLoading } = useQuery({
    queryKey: ['stories', page, category],
    queryFn: () => getStories(page, limit, undefined, category),
  });

  const categories = [
    { label: 'Tất cả', value: undefined },
    { label: 'Trải nghiệm du lịch', value: 'Experience' },
    { label: 'Chia sẻ của khách', value: 'Customer Story' },
    { label: 'Cẩm nang hành trình', value: 'Travel Guide' }
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateReadTime = (content?: string, excerpt?: string) => {
    const text = content || excerpt || '';
    const wordCount = text.trim().split(/\s+/).length;
    return Math.max(3, Math.ceil(wordCount / 180));
  };

  return (
    <>
      <SEOHead
        title="Câu Chuyện Du Lịch & Nhật Ký Hành Trình - TravelHub"
        description="Khám phá những câu chuyện trải nghiệm chân thực, cẩm nang khám phá và cảm xúc đáng nhớ từ cộng đồng du khách TravelHub."
        url="/featured-stories"
      />

      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-teal-900 via-teal-800 to-emerald-950 text-white py-20 lg:py-28">
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div 
              className="w-full h-full"
              style={{
                backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                backgroundSize: '36px 36px'
              }}
            />
          </div>
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 dark:bg-white/5 border border-white/20 backdrop-blur-md rounded-full text-teal-200 text-sm font-semibold mb-6 shadow-sm">
              <SparklesIcon className="h-4 w-4 text-amber-300 animate-pulse" />
              <span>Góc Cảm Nhận & Nhật Ký Du Khách TravelHub</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 tracking-tight text-white drop-shadow-sm">
              Khám Phá Qua Từng <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-200 via-emerald-200 to-amber-200">Câu Chuyện</span>
            </h1>
            <p className="text-lg md:text-xl text-teal-100/90 max-w-3xl mx-auto font-light leading-relaxed mb-8">
              Từng cung đường, góc phố và khoảnh khắc đáng nhớ được ghi lại trọn vẹn bởi những tâm hồn đam mê xê dịch.
            </p>

            {/* Category Filter Pills in Hero */}
            <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 max-w-2xl mx-auto">
              {categories.map((cat) => {
                const isActive = category === cat.value;
                return (
                  <button
                    key={cat.label}
                    onClick={() => {
                      setCategory(cat.value);
                      setPage(1);
                    }}
                    className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 backdrop-blur-md ${
                      isActive
                        ? 'bg-white text-teal-900 shadow-lg scale-105'
                        : 'bg-white/10 hover:bg-white/20 text-white border border-white/15'
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Stories Content Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpenIcon className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                {category ? `Danh mục: ${categories.find(c => c.value === category)?.label}` : 'Tất cả câu chuyện nổi bật'}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {data?.total ? `Tìm thấy ${data.total} bài viết được chia sẻ` : 'Cập nhật liên tục từ du khách'}
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white dark:bg-slate-900 rounded-3xl p-4 shadow-sm border border-slate-100 dark:border-slate-800 space-y-4">
                  <Skeleton className="h-56 w-full rounded-2xl" />
                  <Skeleton className="h-6 w-3/4 rounded-lg" />
                  <Skeleton className="h-4 w-full rounded-lg" />
                  <Skeleton className="h-4 w-2/3 rounded-lg" />
                </div>
              ))}
            </div>
          ) : data && data.items.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {data.items.map((story: any) => {
                  const readTime = calculateReadTime(story.content, story.excerpt);
                  const storySlug = story.slug || story.id;

                  return (
                    <article
                      key={story.id}
                      className="group bg-white dark:bg-slate-900 rounded-3xl shadow-sm hover:shadow-2xl border border-slate-200/80 dark:border-slate-800/80 overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1.5"
                    >
                      <Link to={`/stories/${storySlug}`} className="relative h-60 overflow-hidden bg-slate-100 dark:bg-slate-800 block">
                        {story.image ? (
                          <img
                            src={story.image}
                            alt={story.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/uploads/stories/story-ninhbinh-trangan.jpg';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-teal-500 to-emerald-700 text-white">
                            <BookOpenIcon className="h-16 w-16 opacity-60" />
                          </div>
                        )}
                        
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                        {story.destination && (
                          <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-full text-xs font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-1.5 shadow-sm">
                            <MapPinIcon className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
                            <span>{story.destination.name}</span>
                          </div>
                        )}

                        {story.featured && (
                          <div className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full text-xs font-bold shadow-md flex items-center gap-1">
                            <SparklesIcon className="h-3 w-3" />
                            <span>Nổi bật</span>
                          </div>
                        )}

                        <div className="absolute bottom-3 right-3 px-2.5 py-1 bg-black/50 backdrop-blur-md text-white rounded-lg text-xs font-medium flex items-center gap-1">
                          <ClockIcon className="h-3.5 w-3.5" />
                          <span>{readTime} phút đọc</span>
                        </div>
                      </Link>

                      <div className="p-6 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mb-3">
                            <span className="flex items-center gap-1">
                              <CalendarDaysIcon className="h-3.5 w-3.5" />
                              {formatDate(story.publishedAt || story.createdAt)}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <EyeIcon className="h-3.5 w-3.5" />
                              {story.views || 0} lượt xem
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1 text-rose-500">
                              <HeartIconSolid className="h-3.5 w-3.5" />
                              {story.likes || 0}
                            </span>
                          </div>

                          <Link to={`/stories/${storySlug}`}>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white line-clamp-2 mb-2.5 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors leading-snug">
                              {story.title}
                            </h3>
                          </Link>
                          
                          {story.excerpt && (
                            <p className="text-slate-600 dark:text-slate-300 text-sm mb-4 line-clamp-3 leading-relaxed">
                              {story.excerpt}
                            </p>
                          )}
                        </div>

                        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                                {story.author ? story.author.charAt(0).toUpperCase() : 'T'}
                              </div>
                              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                {story.author || 'Thành viên TravelHub'}
                              </span>
                            </div>

                            <Link
                              to={`/stories/${storySlug}`}
                              className="inline-flex items-center gap-1 text-sm font-semibold text-teal-600 dark:text-teal-400 group-hover:translate-x-1 transition-all"
                            >
                              <span>Đọc bài</span>
                              <ArrowRightIcon className="h-3.5 w-3.5" />
                            </Link>
                          </div>

                          {story.tags && Array.isArray(story.tags) && story.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-3">
                              {story.tags.slice(0, 3).map((tag: string, i: number) => (
                                <span
                                  key={i}
                                  className="px-2.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs rounded-md"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>

              {/* Pagination */}
              {data.pages > 1 && (
                <div className="mt-14 flex items-center justify-center gap-2">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    aria-label="Trang trước"
                  >
                    <ChevronLeftIcon className="h-5 w-5" />
                  </button>

                  <div className="flex items-center gap-1.5">
                    {Array.from({ length: Math.min(5, data.pages) }, (_, i) => {
                      const pageNum = i + 1;
                      const isCurrent = page === pageNum;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setPage(pageNum)}
                          className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${
                            isCurrent
                              ? 'bg-teal-600 text-white shadow-md shadow-teal-600/30'
                              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => setPage(p => Math.min(data.pages, p + 1))}
                    disabled={page === data.pages}
                    className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    aria-label="Trang tiếp"
                  >
                    <ChevronRightIcon className="h-5 w-5" />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-24 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
              <div className="w-20 h-20 rounded-full bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 flex items-center justify-center mx-auto mb-5">
                <BookOpenIcon className="h-10 w-10" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Chưa có câu chuyện nào</h3>
              <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
                Chuyên mục này đang được cộng đồng tích cực cập nhật những chuyến phiêu lưu mới.
              </p>
              {category && (
                <button
                  onClick={() => setCategory(undefined)}
                  className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-semibold shadow-md transition-all"
                >
                  Xem tất cả câu chuyện
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default FeaturedStories;
