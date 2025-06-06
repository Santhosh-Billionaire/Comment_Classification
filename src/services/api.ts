import axios from 'axios';
import { AuthResponse, User, Post, Comment, Notification } from '../types';

// For development, we'll use a base URL that points to our FastAPI backend
const API_URL = '/api';

// Create an axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Authentication
export const login = async (email: string, password: string): Promise<AuthResponse> => {
  // For demo purposes, simulate a login response
  return mockLogin(email, password);
};

export const signup = async (
  name: string,
  username: string,
  email: string,
  password: string
): Promise<AuthResponse> => {
  // For demo purposes, simulate a signup response
  return mockSignup(name, username, email, password);
};

export const getProfile = async (): Promise<User> => {
  // For demo purposes, return a mock user
  return MOCK_USERS[0];
};

// Posts
export const getFeedPosts = async (page = 1, limit = 10): Promise<Post[]> => {
  // For demo purposes, return mock posts
  return MOCK_POSTS;
};

export const createPost = async (
  content: string,
  media?: File[]
): Promise<Post> => {
  // In a real app, we'd upload the media files and create a post
  // For demo, we'll return a mock post
  return {
    id: 'new-post-' + Date.now(),
    userId: MOCK_USERS[0].id,
    author: MOCK_USERS[0],
    content,
    likes: 0,
    comments: 0,
    hasLiked: false,
    createdAt: new Date().toISOString(),
  };
};

export const likePost = async (postId: string): Promise<void> => {
  // Mock implementation
  console.log(`Liked post ${postId}`);
};

export const unlikePost = async (postId: string): Promise<void> => {
  // Mock implementation
  console.log(`Unliked post ${postId}`);
};

// Comments
export const getPostComments = async (postId: string): Promise<Comment[]> => {
  // Return mock comments for the given post
  return MOCK_COMMENTS.filter(comment => comment.postId === postId);
};

export const addComment = async (
  postId: string,
  content: string
): Promise<Comment> => {
  // Mock implementation
  return {
    id: 'new-comment-' + Date.now(),
    postId,
    userId: MOCK_USERS[0].id,
    author: MOCK_USERS[0],
    content,
    likes: 0,
    createdAt: new Date().toISOString(),
  };
};

// User
export const getUserProfile = async (username: string): Promise<User> => {
  // Find user by username
  const user = MOCK_USERS.find(u => u.username === username);
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};

export const getUserPosts = async (userId: string): Promise<Post[]> => {
  // Return mock posts for the given user
  return MOCK_POSTS.filter(post => post.userId === userId);
};

export const updateProfile = async (profileData: Partial<User>): Promise<User> => {
  // Mock implementation
  return {
    ...MOCK_USERS[0],
    ...profileData,
  };
};

// Notifications
export const getNotifications = async (): Promise<Notification[]> => {
  // Return mock notifications
  return MOCK_NOTIFICATIONS;
};

export const markNotificationAsRead = async (notificationId: string): Promise<void> => {
  // Mock implementation
  console.log(`Marked notification ${notificationId} as read`);
};

// Search
export const searchUsers = async (query: string): Promise<User[]> => {
  // Mock implementation - filter users by username or display name
  return MOCK_USERS.filter(
    user => 
      user.username.toLowerCase().includes(query.toLowerCase()) ||
      user.displayName.toLowerCase().includes(query.toLowerCase())
  );
};

export const searchPosts = async (query: string): Promise<Post[]> => {
  // Mock implementation - filter posts by content
  return MOCK_POSTS.filter(
    post => post.content.toLowerCase().includes(query.toLowerCase())
  );
};

// Mock data and helper functions
function mockLogin(email: string, password: string): Promise<AuthResponse> {
  // In a real app, this would validate credentials with the backend
  return Promise.resolve({
    access_token: 'mock-jwt-token',
    token_type: 'bearer',
    user: MOCK_USERS[0],
  });
}

function mockSignup(
  name: string,
  username: string,
  email: string,
  password: string
): Promise<AuthResponse> {
  // In a real app, this would create a new user on the backend
  const newUser = {
    ...MOCK_USERS[0],
    displayName: name,
    username,
    email,
  };
  
  return Promise.resolve({
    access_token: 'mock-jwt-token',
    token_type: 'bearer',
    user: newUser,
  });
}

// Mock data
const MOCK_USERS: User[] = [
  {
    id: 'user1',
    username: 'cosmicwanderer',
    email: 'cosmic@example.com',
    displayName: 'Cosmic Wanderer',
    avatar: 'https://images.pexels.com/photos/1851164/pexels-photo-1851164.jpeg?auto=compress&cs=tinysrgb&w=400',
    bio: 'Exploring the digital cosmos ✨',
    followers: 1024,
    following: 256,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'user2',
    username: 'stardust',
    email: 'stardust@example.com',
    displayName: 'Star Dust',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
    bio: 'Digital artist and night owl 🦉',
    followers: 3500,
    following: 420,
    createdAt: '2023-11-15T00:00:00Z',
  },
  {
    id: 'user3',
    username: 'nebula_dreamer',
    email: 'nebula@example.com',
    displayName: 'Nebula Dreamer',
    avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=400',
    bio: 'Finding beauty in the chaos of the universe',
    followers: 892,
    following: 150,
    createdAt: '2023-12-20T00:00:00Z',
  },
];

const MOCK_POSTS: Post[] = [
  {
    id: 'post1',
    userId: 'user2',
    author: MOCK_USERS[1],
    content: 'Just finished my latest digital artwork. What do you think? #digitalart #nightwalker',
    media: [
      {
        type: 'image',
        url: 'https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&w=600',
      },
    ],
    likes: 248,
    comments: 42,
    hasLiked: true,
    createdAt: '2024-06-15T18:30:00Z',
  },
  {
    id: 'post2',
    userId: 'user3',
    author: MOCK_USERS[2],
    content: 'The night sky was absolutely breathtaking yesterday. Spent hours just gazing at the stars ✨',
    media: [
      {
        type: 'image',
        url: 'https://images.pexels.com/photos/1624438/pexels-photo-1624438.jpeg?auto=compress&cs=tinysrgb&w=600',
      },
    ],
    likes: 189,
    comments: 24,
    hasLiked: false,
    createdAt: '2024-06-14T23:45:00Z',
  },
  {
    id: 'post3',
    userId: 'user1',
    author: MOCK_USERS[0],
    content: "Working on a new project that combines AI and artistic expression. Can't wait to share more details!",
    likes: 156,
    comments: 31,
    hasLiked: false,
    createdAt: '2024-06-13T14:20:00Z',
  },
  {
    id: 'post4',
    userId: 'user2',
    author: MOCK_USERS[1],
    content: 'Sometimes the most beautiful moments happen in the darkest hours. #nightphilosophy',
    media: [
      {
        type: 'image',
        url: 'https://images.pexels.com/photos/1144694/pexels-photo-1144694.jpeg?auto=compress&cs=tinysrgb&w=600',
      },
    ],
    likes: 302,
    comments: 47,
    hasLiked: false,
    createdAt: '2024-06-12T02:10:00Z',
  },
];

const MOCK_COMMENTS: Comment[] = [
  {
    id: 'comment1',
    postId: 'post1',
    userId: 'user1',
    author: MOCK_USERS[0],
    content: 'This is absolutely stunning! The colors are otherworldly.',
    likes: 24,
    createdAt: '2024-06-15T19:10:00Z',
  },
  {
    id: 'comment2',
    postId: 'post1',
    userId: 'user3',
    author: MOCK_USERS[2],
    content: "You've outdone yourself with this one. What software do you use?",
    likes: 16,
    createdAt: '2024-06-15T19:30:00Z',
  },
  {
    id: 'comment3',
    postId: 'post2',
    userId: 'user1',
    author: MOCK_USERS[0],
    content: "There's something magical about stargazing. Great capture!",
    likes: 18,
    createdAt: '2024-06-15T00:15:00Z',
  },
];

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif1',
    type: 'like',
    userId: 'user1',
    sourceUserId: 'user2',
    sourceUser: MOCK_USERS[1],
    postId: 'post3',
    read: false,
    createdAt: '2024-06-15T20:00:00Z',
  },
  {
    id: 'notif2',
    type: 'comment',
    userId: 'user1',
    sourceUserId: 'user3',
    sourceUser: MOCK_USERS[2],
    postId: 'post3',
    commentId: 'comment4',
    read: false,
    createdAt: '2024-06-15T19:45:00Z',
  },
  {
    id: 'notif3',
    type: 'follow',
    userId: 'user1',
    sourceUserId: 'user2',
    sourceUser: MOCK_USERS[1],
    read: true,
    createdAt: '2024-06-14T14:30:00Z',
  },
];