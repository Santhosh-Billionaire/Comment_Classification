import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Share2, MoreHorizontal } from 'lucide-react';
import { Post } from '../../types';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';
import { likePost, unlikePost } from '../../services/api';
import CommentsList from './CommentsList';

interface PostCardProps {
  post: Post;
  showComments?: boolean;
}

const PostCard: React.FC<PostCardProps> = ({ post, showComments = false }) => {
  const [liked, setLiked] = useState(post.hasLiked);
  const [likesCount, setLikesCount] = useState(post.likes);
  const [showCommentsSection, setShowCommentsSection] = useState(showComments);
  
  const handleLike = async () => {
    try {
      if (liked) {
        await unlikePost(post.id);
        setLikesCount(prev => prev - 1);
      } else {
        await likePost(post.id);
        setLikesCount(prev => prev + 1);
      }
      setLiked(!liked);
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const toggleComments = () => {
    setShowCommentsSection(!showCommentsSection);
  };

  return (
    <motion.div 
      className="card mb-4 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Post Header */}
      <div className="flex items-center mb-4">
        <Link to={`/profile/${post.author.username}`} className="flex items-center flex-1">
          {post.author.avatar ? (
            <img 
              src={post.author.avatar} 
              alt={post.author.displayName} 
              className="w-10 h-10 rounded-full object-cover border-2 border-primary/30"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-primary font-bold">
                {post.author.displayName.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div className="ml-3">
            <p className="font-medium">{post.author.displayName}</p>
            <p className="text-text-secondary text-sm">@{post.author.username}</p>
          </div>
        </Link>
        
        <div className="text-text-secondary text-sm">
          {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
        </div>
        
        <button className="icon-button ml-2">
          <MoreHorizontal size={20} className="text-text-secondary" />
        </button>
      </div>
      
      {/* Post Content */}
      <div className="mb-4">
        <p className="whitespace-pre-line mb-4">{post.content}</p>
        
        {post.media && post.media.length > 0 && (
          <div className="rounded-lg overflow-hidden mb-2">
            {post.media.map((media, index) => (
              media.type === 'image' ? (
                <img 
                  key={index}
                  src={media.url}
                  alt="Post content"
                  className="w-full h-auto rounded-lg object-cover max-h-[400px]"
                  loading="lazy"
                />
              ) : (
                <video 
                  key={index}
                  src={media.url}
                  controls
                  className="w-full h-auto rounded-lg"
                />
              )
            ))}
          </div>
        )}
      </div>
      
      {/* Post Actions */}
      <div className="flex items-center justify-between mt-2 pt-3 border-t border-white/5">
        <motion.button 
          className="icon-button flex items-center text-text-secondary"
          onClick={handleLike}
          whileTap={{ scale: 1.2 }}
        >
          <Heart 
            size={20} 
            className={`mr-2 ${liked ? 'fill-error text-error' : ''}`} 
          />
          <span>{likesCount}</span>
        </motion.button>
        
        <button 
          className="icon-button flex items-center text-text-secondary"
          onClick={toggleComments}
        >
          <MessageCircle size={20} className="mr-2" />
          <span>{post.comments}</span>
        </button>
        
        <button className="icon-button flex items-center text-text-secondary">
          <Share2 size={20} />
        </button>
      </div>
      
      {/* Comments Section */}
      {showCommentsSection && (
        <motion.div 
          className="mt-4 pt-4 border-t border-white/5"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <CommentsList postId={post.id} />
        </motion.div>
      )}
    </motion.div>
  );
};

export default PostCard;