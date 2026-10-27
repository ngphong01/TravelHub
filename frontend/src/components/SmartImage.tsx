import React from 'react';
import { getAuthenticImage, handleImageError } from '../utils/imageFallback';

interface SmartImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  nameOrSlug?: string;
  category?: 'destination' | 'tour' | 'hotel' | 'restaurant' | 'avatar';
}

export default function SmartImage({
  src,
  alt,
  nameOrSlug,
  category = 'tour',
  onError,
  ...rest
}: SmartImageProps) {
  const initialSrc = getAuthenticImage(src, nameOrSlug || alt, category);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    handleImageError(e, nameOrSlug || alt, category);
    if (onError) {
      onError(e);
    }
  };

  return (
    <img
      src={initialSrc}
      alt={alt || nameOrSlug || 'TravelHub'}
      onError={handleError}
      {...rest}
    />
  );
}
