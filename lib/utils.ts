import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

const API_URL = process.env.NEXT_PUBLIC_API_URL

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const getImageUrl = (imagePath: string | null) => {
  console.log('API_URL:', API_URL);
  console.log('imagePath:', imagePath);
  
  if (!imagePath || !API_URL) return '/placeholder.png';
  // Remove leading slash if present
  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
  const fullUrl = `${API_URL}/${cleanPath}`;
  console.log('Full URL:', fullUrl);
  return fullUrl;
};

export { getImageUrl };