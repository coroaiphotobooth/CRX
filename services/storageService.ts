import { GalleryItem } from '../types';

const STORAGE_KEY = 'coroai_gallery';

export const getGalleryItems = (): GalleryItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to load gallery", e);
    return [];
  }
};

export const saveGalleryItem = (item: GalleryItem): void => {
  const items = getGalleryItems();
  // Prepend to list (newest first)
  const newItems = [item, ...items];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
};

export const deleteGalleryItem = (id: string): void => {
  const items = getGalleryItems();
  const newItems = items.filter(item => item.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
};