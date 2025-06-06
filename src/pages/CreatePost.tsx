import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Image, X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { useAuth } from '../contexts/AuthContext';
import { createPost } from '../services/api';

const CreatePost: React.FC = () => {
  const [content, setContent] = useState('');
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [mediaPreviewUrls, setMediaPreviewUrls] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': [],
      'video/*': []
    },
    maxFiles: 4,
    onDrop: (acceptedFiles) => {
      // Create preview URLs for the files
      const newMediaPreviewUrls = acceptedFiles.map(file => URL.createObjectURL(file));
      
      setMediaFiles(prev => [...prev, ...acceptedFiles]);
      setMediaPreviewUrls(prev => [...prev, ...newMediaPreviewUrls]);
    }
  });

  const removeMedia = (index: number) => {
    // Revoke object URL to avoid memory leaks
    URL.revokeObjectURL(mediaPreviewUrls[index]);
    
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
    setMediaPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && mediaFiles.length === 0) return;

    setIsLoading(true);
    try {
      await createPost(content, mediaFiles);
      // Clean up object URLs
      mediaPreviewUrls.forEach(url => URL.revokeObjectURL(url));
      navigate('/');
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <h1 className="text-2xl font-bold mb-6">Create Post</h1>
        
        <form onSubmit={handleSubmit}>
          <div className="flex mb-4">
            {/* User avatar */}
            {user?.avatar ? (
              <img 
                src={user.avatar} 
                alt={user.displayName} 
                className="w-10 h-10 rounded-full object-cover mr-3"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                <span className="text-primary font-bold">
                  {user?.displayName.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
            )}
            
            <div className="flex-1">
              <p className="font-medium">{user?.displayName}</p>
              <p className="text-text-secondary text-sm">@{user?.username}</p>
            </div>
          </div>

          <textarea
            placeholder="What's happening?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="input w-full min-h-[120px] resize-y mb-4"
            maxLength={2000}
          />

          {/* Media upload area */}
          <div 
            {...getRootProps()} 
            className={`border-2 border-dashed rounded-lg p-4 mb-4 transition-all
              ${isDragActive ? 'border-primary bg-primary/5' : 'border-white/10 hover:border-primary/50'}`}
          >
            <input {...getInputProps()} />
            <div className="text-center py-6">
              <Image className="mx-auto mb-2 text-text-secondary" />
              <p className="text-text-secondary">
                {isDragActive
                  ? "Drop the files here..."
                  : "Drag & drop images or videos here, or click to select"}
              </p>
              <p className="text-text-muted text-sm mt-1">
                Up to 4 files (10MB max each)
              </p>
            </div>
          </div>

          {/* Media previews */}
          <AnimatePresence>
            {mediaPreviewUrls.length > 0 && (
              <motion.div 
                className="grid grid-cols-2 gap-2 mb-4"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                {mediaPreviewUrls.map((url, index) => (
                  <motion.div 
                    key={index} 
                    className="relative aspect-video rounded-lg overflow-hidden bg-background-lighter"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    {mediaFiles[index].type.startsWith('image/') ? (
                      <img
                        src={url}
                        alt={`Preview ${index}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <video
                        src={url}
                        className="w-full h-full object-cover"
                        controls
                      />
                    )}
                    <button
                      type="button"
                      onClick={() => removeMedia(index)}
                      className="absolute top-2 right-2 bg-background/80 rounded-full p-1"
                    >
                      <X size={16} className="text-white" />
                    </button>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-between items-center mt-6">
            <div className="text-text-secondary text-sm">
              {content.length > 0 && (
                <span>{content.length}/2000</span>
              )}
            </div>
            <motion.button 
              type="submit" 
              className="btn-primary flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={isLoading || (!content.trim() && mediaFiles.length === 0)}
            >
              {isLoading ? (
                <div className="loader" />
              ) : (
                <>
                  <Send size={18} className="mr-2" />
                  Post
                </>
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default CreatePost;