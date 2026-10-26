// components/SEOHead.tsx - SEO Head component with Schema.org markup
import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  schema?: any; // JSON-LD schema object
}

export default function SEOHead({
  title = 'TravelHub - Sàn Thương Mại Điện Tử Du Lịch Hàng Đầu',
  description = 'TravelHub - Khám phá và đặt tour du lịch, khách sạn nghỉ dưỡng, vé tham quan với giá tốt nhất Việt Nam.',
  keywords = 'travelhub, du lịch, tour du lịch, khách sạn, vé tham quan, du lịch việt nam',
  image = '/logo.png',
  url = window.location.href,
  type = 'website',
  schema,
}: SEOHeadProps) {
  const fullTitle = title.includes('TravelHub') ? title : `${title} | TravelHub`;
  const siteUrl = process.env.REACT_APP_SITE_URL || 'https://www.daophong.id.vn';

  return (
    <Helmet>
      {/* Favicon & Icons */}
      <link rel="icon" type="image/x-icon" href="/favicon.ico?v=2" />
      <link rel="icon" type="image/png" sizes="32x32" href="/logo.png" />
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      <link rel="shortcut icon" href="/favicon.ico?v=2" />
      <link rel="apple-touch-icon" href="/logo.png" />

      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image.startsWith('http') ? image : `${siteUrl}${image}`} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image.startsWith('http') ? image : `${siteUrl}${image}`} />

      {/* Schema.org JSON-LD */}
      {schema && (
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      )}
    </Helmet>
  );
}

