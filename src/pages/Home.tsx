import React, { useState, useEffect } from 'react';
import { getFeedPosts } from '../services/api';
import { Post } from '../types';
import PostCard from '../components/post/PostCard';
import { motion } from 'framer-motion';

const Home: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [feedType, setFeedType] = useState<'all' | 'following'>('all');

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const fetchedPosts = await getFeedPosts();
        setPosts(fetchedPosts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [feedType]);

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div 
        className="mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold">Home</h1>
        
        <div className="flex border-b border-white/10 mt-4">
          <button 
            className={`flex-1 py-3 text-center font-medium ${
              feedType === 'all' 
                ? 'text-primary border-b-2 border-primary' 
                : 'text-text-secondary hover:text-text-primary'
            }`}
            onClick={() => setFeedType('all')}
          >
            For You
          </button>
          <button 
            className={`flex-1 py-3 text-center font-medium ${
              feedType === 'following' 
                ? 'text-primary border-b-2 border-primary' 
                : 'text-text-secondary hover:text-text-primary'
            }`}
            onClick={() => setFeedType('following')}
          >
            Following
          </button>
        </div>
      </motion.div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="loader"></div>
        </div>
      ) : posts.length > 0 ? (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-text-secondary mb-4">No posts to show right now.</p>
          <p className="text-text-muted">
            {feedType === 'following' 
              ? 'Try following more users to see their posts.'
              : 'Check back later for new content.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default Home;