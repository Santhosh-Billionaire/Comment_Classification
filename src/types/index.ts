export interface User {
  id: string;
  username: string;
  email: string;
  displayName: string;
  avatar: string;
  bio: string;
  followers: number;
  following: number;
  createdAt: string;
}

export interface Post {
  id: string;
  userId: string;
  author: User;
  content: string;
  media?: {
    type: 'image' | 'video';
    url: string;
  }[];
  likes: number;
  comments: number;
  hasLiked: boolean;
  createdAt: string;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  author: User;
  content: string;
  likes: number;
  createdAt: string;
  replies?: Comment[];
}

export interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'mention';
  userId: string;
  sourceUserId: string;
  sourceUser: User;
  postId?: string;
  commentId?: string;
  read: boolean;
  createdAt: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}