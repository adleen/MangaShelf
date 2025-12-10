import type { Manga } from './types';

export const initialMangaData: Manga[] = [
  {
    id: 'berserk',
    title: 'Berserk',
    author: 'Kentaro Miura',
    coverImage: 'berserk-cover',
    totalVolumes: 42,
    status: 'owned',
    volumes: Array.from({ length: 42 }, (_, i) => ({
      id: i + 1,
      isOwned: i < 20,
      isRead: i < 5,
    })),
  },
  {
    id: 'one-piece',
    title: 'One Piece',
    author: 'Eiichiro Oda',
    coverImage: 'one-piece-cover',
    totalVolumes: 108,
    status: 'owned',
    volumes: Array.from({ length: 108 }, (_, i) => ({
      id: i + 1,
      isOwned: i % 3 === 0,
      isRead: i % 5 === 0 && i % 3 === 0,
    })),
  },
  {
    id: 'vagabond',
    title: 'Vagabond',
    author: 'Takehiko Inoue',
    coverImage: 'vagabond-cover',
    totalVolumes: 37,
    status: 'wishlist',
    volumes: Array.from({ length: 37 }, (_, i) => ({
      id: i + 1,
      isOwned: false,
      isRead: false,
    })),
  },
  {
    id: 'monster',
    title: 'Monster',
    author: 'Naoki Urasawa',
    coverImage: 'monster-cover',
    totalVolumes: 9,
    status: 'owned',
    volumes: Array.from({ length: 9 }, (_, i) => ({
      id: i + 1,
      isOwned: true,
      isRead: true,
    })),
  },
];
