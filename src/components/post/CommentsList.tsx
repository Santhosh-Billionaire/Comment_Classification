import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Send, Shield, Trash2, AlertTriangle } from 'lucide-react';
import { Comment } from '../../types';
import { getPostComments, addComment } from '../../services/api';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useSentimentAnalysis } from '../../hooks/useSentimentAnalysis';

interface CommentsListProps {
  postId: string;
}

interface ExtendedComment extends Comment {
  sentiment?: {
    isToxic: boolean;
    scores: {
      score: number;
      comparative: number;
      negative: string[];
      positive: string[];
    };
  };
}

const CommentsList: React.FC<CommentsListProps> = ({ postId }) => {
  const [comments, setComments] = useState<ExtendedComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const { user } = useAuth();
  const { analyzeText } = useSentimentAnalysis();

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const data = await getPostComments(postId);
        setComments(data);
      } catch (error) {
        console.error('Error fetching comments:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchComments();
  }, [postId]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    setIsSubmitting(true);
    try {
      const comment = await addComment(postId, newComment);
      setComments(prev => [comment, ...prev]);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const scanComments = async () => {
    setIsScanning(true);
    try {
      const analyzedComments = await Promise.all(
        comments.map(async (comment) => {
          if (!comment.sentiment) {
            const analysis = analyzeText(comment.content);
            return { ...comment, sentiment: analysis };
          }
          return comment;
        })
      );
      setComments(analyzedComments);
    } catch (error) {
      console.error('Error analyzing comments:', error);
    } finally {
      setIsScanning(false);
    }
  };

  const deleteComment = (commentId: string) => {
    setComments(prev => prev.filter(c => c.id !== commentId));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-4">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Purge Protocol Button */}
      {comments.length > 0 && (
        <motion.div 
          className="mb-6 flex justify-end"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.button
            className="flex items-center px-4 py-2 bg-gradient-to-r from-primary to-accent-purple rounded-lg text-white shadow-lg hover:shadow-primary/20 transition-all"
            onClick={scanComments}
            disabled={isScanning}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Shield className={`mr-2 ${isScanning ? 'animate-pulse' : ''}`} />
            {isScanning ? 'Scanning...' : 'Run Purge Protocol'}
          </motion.button>
        </motion.div>
      )}

      {/* Comment form */}
      <form onSubmit={handleSubmitComment} className="mb-4">
        <div className="flex">
          <div className="mr-3">
            {user?.avatar ? (
              <img 
                src={user.avatar} 
                alt={user.displayName} 
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-primary font-bold text-xs">
                  {user?.displayName.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
            )}
          </div>
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="input w-full pr-10"
              disabled={isSubmitting}
            />
            <button 
              type="submit" 
              className="absolute right-2 top-1/2 transform -translate-y-1/2 icon-button text-primary"
              disabled={isSubmitting || !newComment.trim()}
            >
              {isSubmitting ? (
                <div className="loader w-5 h-5"></div>
              ) : (
                <Send size={18} />
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Comments list */}
      <div className="space-y-4">
        <AnimatePresence>
          {comments.length > 0 ? (
            comments.map((comment) => (
              <motion.div 
                key={comment.id} 
                className="flex"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                layout
              >
                <Link to={`/profile/${comment.author.username}`} className="mr-3">
                  {comment.author.avatar ? (
                    <img 
                      src={comment.author.avatar} 
                      alt={comment.author.displayName} 
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-primary font-bold text-xs">
                        {comment.author.displayName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </Link>
                <div className="flex-1">
                  <motion.div 
                    className={`bg-background-lighter p-3 rounded-lg transition-colors duration-500 ${
                      comment.sentiment && (
                        comment.sentiment.isToxic ? 'border-2 border-error/50 shadow-error/20' :
                        comment.sentiment.scores.score > 2 ? 'border-2 border-success/50 shadow-success/20' :
                        'border border-white/10'
                      )
                    }`}
                    animate={
                      comment.sentiment ? {
                        scale: [1, 1.02, 1],
                        transition: { duration: 0.3 }
                      } : {}
                    }
                  >
                    <div className="flex items-baseline justify-between">
                      <Link to={`/profile/${comment.author.username}`} className="font-medium hover:underline">
                        {comment.author.displayName}
                      </Link>
                      <span className="text-xs text-text-secondary">
                        {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="mt-1">{comment.content}</p>
                    
                    {/* Sentiment details */}
                    {comment.sentiment?.isToxic && (
                      <motion.div 
                        className="mt-2 text-xs text-error"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                      >
                        <div className="flex items-center">
                          <AlertTriangle size={14} className="mr-1" />
                          <span>This comment has been flagged as toxic</span>
                        </div>
                        {comment.sentiment.scores.negative.length > 0 && (
                          <div className="mt-1">
                            <span>Negative terms: </span>
                            {comment.sentiment.scores.negative.join(', ')}
                          </div>
                        )}
                      </motion.div>
                    )}
                  </motion.div>
                  
                  <div className="flex items-center mt-1 ml-2">
                    <button className="flex items-center text-xs text-text-secondary hover:text-primary transition-colors">
                      <Heart size={14} className="mr-1" />
                      <span>{comment.likes}</span>
                    </button>
                    <button className="ml-4 text-xs text-text-secondary hover:text-primary transition-colors">
                      Reply
                    </button>
                    {comment.sentiment?.isToxic && (
                      <motion.button
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="ml-4 flex items-center text-xs text-error hover:text-error/80 transition-colors"
                        onClick={() => deleteComment(comment.id)}
                      >
                        <Trash2 size={14} className="mr-1" />
                        Remove
                      </motion.button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <p className="text-text-secondary text-center py-2">No comments yet. Be the first to comment!</p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CommentsList;