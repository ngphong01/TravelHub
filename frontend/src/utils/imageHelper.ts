// Helper function to get destination image from uploads folder
// Maps destination name to uploaded image filename

// Map destination names to image filenames (exact match with uploads/avatars folder)
// Format: { destinationName: { filename: 'ImageName', extension: '.jpg' } }
const destinationImageMap: Record<string, { filename: string; extension: string }> = {
  // Việt Nam (có thể thêm sau khi có ảnh)
  'Ninh Bình': { filename: 'Ninh Binh', extension: '.jpg' },
  'Hạ Long': { filename: 'Ha Long', extension: '.jpg' },
  'Đà Lạt': { filename: 'Da Lat', extension: '.jpg' },
  'Phú Quốc': { filename: 'Phu Quoc', extension: '.jpg' },
  'Hà Nội': { filename: 'Ha Noi', extension: '.jpg' },
  'Đà Nẵng': { filename: 'Da Nang', extension: '.jpg' },
  'Sa Pa': { filename: 'Sapa', extension: '.jpg' },
  'Hội An': { filename: 'Hoi An', extension: '.jpg' },
  'Huế': { filename: 'Hue', extension: '.jpg' },
  'Cần Thơ': { filename: 'Can Tho', extension: '.jpg' },
  'Vũng Tàu': { filename: 'Vung Tau', extension: '.jpg' },
  'Nha Trang': { filename: 'Nha Trang', extension: '.jpg' },
  'Quy Nhơn': { filename: 'Quy Nhon', extension: '.jpg' },
  'Hà Giang': { filename: 'Ha Giang', extension: '.jpg' },
  'Mù Cang Chải': { filename: 'Mu Cang Chai', extension: '.jpg' },
  
  // International - Cities (có ảnh trong uploads/avatars)
  'Amsterdam': { filename: 'Amsterdam', extension: '.jpg' },
  'Barcelona': { filename: 'Barcelona', extension: '.jpg' },
  'Cairo': { filename: 'Cairo', extension: '.jpg' },
  'Cape Town': { filename: 'Cape Town', extension: '.jpg' },
  'Dubai': { filename: 'Dubai', extension: '.jpg' },
  'Grand Canyon': { filename: 'Grand Canyon', extension: '.jpg' },
  'Istanbul': { filename: 'Istanbul', extension: '.jpg' },
  'London': { filename: 'London', extension: '.jpg' },
  'Los Angeles': { filename: 'Los Angeles', extension: '.jpg' },
  'Marrakech': { filename: 'Marrakech', extension: '.jpg' },
  'Melbourne': { filename: 'Melbourne', extension: '.jpg' },
  'New York': { filename: 'New York', extension: '.png' }, // Note: PNG file
  'Prague': { filename: 'Prague', extension: '.jpg' },
  'Rome': { filename: 'Rome', extension: '.jpg' },
  'Santorini': { filename: 'Santorini', extension: '.jpg' },
  'Sydney': { filename: 'Sydney', extension: '.jpg' },
  'Vienna': { filename: 'vienna', extension: '.jpg' }, // Note: file is lowercase
  
  // Other common names
  'Tokyo': { filename: 'Tokyo', extension: '.jpg' },
  'Kyoto': { filename: 'Kyoto', extension: '.jpg' },
  'Seoul': { filename: 'Seoul', extension: '.jpg' },
  'Singapore': { filename: 'Singapore', extension: '.jpg' },
  'Bangkok': { filename: 'Bangkok', extension: '.jpg' },
  'Bali': { filename: 'Bali', extension: '.jpg' },
  'Phuket': { filename: 'Phuket', extension: '.jpg' },
  'Paris': { filename: 'Paris', extension: '.jpg' },
};

// Normalize destination name to match image filename
function normalizeDestinationName(name: string): string {
  // Remove diacritics and special characters, convert to title case
  const normalized = name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
  
  return normalized;
}

import { getAuthenticImage } from './imageFallback';

// Helper function to get destination image
export function getDestinationImage(destinationName: string, fallback?: string): string {
  return getAuthenticImage(fallback, destinationName, 'destination');
}

// Helper to check if image exists (used by components)
export function getDestinationImageUrl(destination: { name: string; image?: string | null }): string {
  if (destination.image && (destination.image.startsWith('http://') || destination.image.startsWith('https://') || destination.image.startsWith('/images/'))) {
    return destination.image;
  }
  return getAuthenticImage(destination.image, destination.name, 'destination');
}

// Helper to get tour image URL with authentic fallback matching tour name
export function getTourImageUrl(image?: string | null, tourTitle?: string): string {
  return getAuthenticImage(image, tourTitle, 'tour');
}

