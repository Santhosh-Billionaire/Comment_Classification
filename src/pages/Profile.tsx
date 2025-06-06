import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getUserProfile, getUserPosts } from '../services/api';
import { User, Post } from '../types';
import PostCard from '../components/post/PostCard';
import { Calendar, MapPin, Link as LinkIcon } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

const Profile: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'posts' | 'media' | 'likes'>('posts');

  useEffect(() => {
    const fetchProfile = async () => {
      if (!username) return;
      
      setIsLoading(true);
      try {
        const userData = await getUserProfile(username);
        setUser(userData);
        
        const userPosts = await getUserPosts(userData.id);
        setPosts(userPosts);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [username]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="loader"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-text-secondary">User not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Profile Header */}
      <motion.div 
        className="card mb-6 relative pb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Cover Photo */}
        <div className="h-32 md:h-48 bg-gradient-to-r from-primary/30 to-accent-blue/30 rounded-t-xl"></div>
        
        {/* Profile Picture and Basic Info */}
        <div className="px-4">
          <div className="flex flex-col sm:flex-row sm:items-end relative -mt-16 mb-4">
            <div className="relative">
              {user.avatar ? (
                <img 
                  src={user.avatar} 
                  alt={user.displayName} 
                  className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-background-card object-cover"
                />
              ) : (
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-background-card bg-primary/20 flex items-center justify-center">
                  <span className="text-primary font-bold text-4xl">
                    {user.displayName.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              
              {/* Animated glow effect */}
              <motion.div 
                className="absolute -inset-1 rounded-full opacity-0 bg-primary/20 -z-10"
                animate={{ opacity: [0, 0.5, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
              ></motion.div>
            </div>
            
            <div className="sm:ml-4 mt-4 sm:mt-0">
              <h1 className="text-2xl font-bold">{user.displayName}</h1>
              <p className="text-text-secondary">@{user.username}</p>
            </div>
            
            <div className="flex-1"></div>
            
            <motion.button 
              className="btn-primary mt-4 sm:mt-0"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Follow
            </motion.button>
          </div>
          
          {/* Bio and Details */}
          <div className="mb-6">
            <p className="mb-4">{user.bio}</p>
            
            <div className="flex flex-wrap gap-y-2">
              <div className="flex items-center text-text-secondary mr-4">
                <Calendar size={16} className="mr-1" />
                <span className="text-sm">Joined {format(new Date(user.createdAt), 'MMMM yyyy')}</span>
              </div>
              <div className="flex items-center text-text-secondary mr-4">
                <MapPin size={16} className="mr-1" />
                <span className="text-sm">New York, USA</span>
              </div>
              <div className="flex items-center text-text-secondary">
                <LinkIcon size={16} className="mr-1" />
                <a href="#" className="text-sm text-primary hover:underline">nightwalker.io</a>
              </div>
            </div>
          </div>
          
          {/* Followers/Following */}
          <div className="flex space-x-4">
            <div>
              <span className="font-bold">{user.following}</span>{' '}
              <span className="text-text-secondary">Following</span>
            </div>
            <div>
              <span className="font-bold">{user.followers}</span>{' '}
              <span className="text-text-secondary">Followers</span>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Tabs for different content types */}
      <div className="border-b border-white/10 mb-6">
        <div className="flex">
          <button 
            className={`flex-1 py-3 text-center font-medium ${
              activeTab === 'posts' 
                ? 'text-primary border-b-2 border-primary' 
                : 'text-text-secondary hover:text-text-primary'
            }`}
            onClick={() => setActiveTab('posts')}
          >
            Posts
          </button>
          <button 
            className={`flex-1 py-3 text-center font-medium ${
              activeTab === 'media' 
                ? 'text-primary border-b-2 border-primary' 
                : 'text-text-secondary hover:text-text-primary'
            }`}
            onClick={() => setActiveTab('media')}
          >
            Media
          </button>
          <button 
            className={`flex-1 py-3 text-center font-medium ${
              activeTab === 'likes' 
                ? 'text-primary border-b-2 border-primary' 
                : 'text-text-secondary hover:text-text-primary'
            }`}
            onClick={() => setActiveTab('likes')}
          >
            Likes
          </button>
        </div>
      </div>
      
      {/* Posts/Media/Likes content */}
      {activeTab === 'posts' && (
        posts.length > 0 ? (
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-text-secondary mb-2">No posts yet</p>
            <p className="text-text-muted">Posts will appear here once created</p>
          </div>
        )
      )}
      
      {activeTab === 'media' && (
        <div className="grid grid-cols-3 gap-1 md:gap-2">
          {posts
            .filter(post => post.media && post.media.length > 0)
            .map((post) => (
              <motion.div 
                key={post.id} 
                className="aspect-square rounded-md overflow-hidden relative"
                whileHover={{ scale: 1.02 }}
              >
                <img 
                  src={post.media![0].url} 
                  alt="Media post" 
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="flex items-center text-white">
                    <Heart size={16} className="mr-1" />
                    <span>{post.likes}</span>
                  </div>
                </div>
              </motion.div>
            ))
          }
        </div>
      )}
      
      {activeTab === 'likes' && (
        <div className="text-center py-12">
          <p className="text-text-secondary">Liked posts will appear here</p>
        </div>
      )}
    </div>
  );
};

export default Profile;