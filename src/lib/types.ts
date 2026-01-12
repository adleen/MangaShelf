export interface Volume {
  id: number;
  isOwned: boolean;
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
