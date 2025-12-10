export interface Volume {
  id: number;
  isOwned: boolean;
  isRead: boolean;
}

export interface Manga {
  id: string;
  title: string;
  author: string;
  coverImage: string;
  totalVolumes: number;
  status: 'owned' | 'wishlist';
  volumes: Volume[];
}
