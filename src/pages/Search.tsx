import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search as SearchIcon, Users, Hash, Calendar, TrendingUp } from 'lucide-react';
import { searchUsers, searchPosts } from '../services/api';
import { User, Post } from '../types';
import { motion } from 'framer-motion';

const Search: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'top' | 'users' | 'posts'>('top');

  // Trending topics for demonstration
  const trendingTopics = [
    { tag: 'NightLife', posts: 5432 },
    { tag: 'ArtificialSunset', posts: 3219 },
    { tag: 'NeonCity', posts: 2871 },
    { tag: 'DigitalDreams', posts: 1943 },
    { tag: 'MidnightCoding', posts: 1547 }
  ];

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      if (searchQuery.length >= 2) {
        handleSearch();
      }
    }, 500);

    return () => clearTimeout(delaySearch);
  }, [searchQuery]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    try {
      const [usersResults, postsResults] = await Promise.all([
        searchUsers(searchQuery),
        searchPosts(searchQuery)
      ]);
      
      setUsers(usersResults);
      setPosts(postsResults);
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div 
        className="mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold mb-6">Search</h1>
        
        {/* Search input */}
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon size={20} className="text-text-muted" />
          </div>
          <input 
            type="text"
            placeholder="Search users, posts, or hashtags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-10 w-full"
          />
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="border-b border-white/10 mb-6">
        <div className="flex">
          <button 
            className={`flex-1 py-3 text-center font-medium ${
              activeTab === 'top' 
                ? 'text-primary border-b-2 border-primary' 
                : 'text-text-secondary hover:text-text-primary'
            }`}
            onClick={() => setActiveTab('top')}
          >
            Top
          </button>
          <button 
            className={`flex-1 py-3 text-center font-medium ${
              activeTab === 'users' 
                ? 'text-primary border-b-2 border-primary' 
                : 'text-text-secondary hover:text-text-primary'
            }`}
            onClick={() => setActiveTab('users')}
          >
            Users
          </button>
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
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="loader"></div>
        </div>
      ) : searchQuery.length < 2 ? (
        // Show trending section when no search query
        <div>
          <div className="mb-6">
            <div className="flex items-center mb-3">
              <TrendingUp size={20} className="text-primary mr-2" />
              <h2 className="text-lg font-bold">Trending Topics</h2>
            </div>
            <div className="space-y-3">
              {trendingTopics.map((topic, index) => (
                <motion.div 
                  key={index}
                  className="card flex items-center p-3 hover:bg-background-lighter cursor-pointer transition-colors"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0,
                    transition: { delay: index * 0.1 } 
                  }}
                  whileHover={{ x: 5 }}
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                    <Hash size={16} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">#{topic.tag}</p>
                    <p className="text-sm text-text-secondary">{topic.posts} posts</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center mb-3">
              <Calendar size={20} className="text-primary mr-2" />
              <h2 className="text-lg font-bold">Popular This Week</h2>
            </div>
            <div className="space-y-3">
              {[1, 2, 3].map((_, index) => (
                <motion.div 
                  key={index}
                  className="card p-3 hover:bg-background-lighter cursor-pointer transition-colors"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0,
                    transition: { delay: 0.5 + index * 0.1 } 
                  }}
                  whileHover={{ x: 5 }}
                >
                  <p className="font-medium mb-1">Latest in digital art exploration</p>
                  <p className="text-sm text-text-secondary">
                    Check out new techniques and tools being shared this week
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Show search results based on active tab */}
          {activeTab === 'top' && (
            <>
              {/* Users Section */}
              {users.length > 0 && (
                <section className="mb-8">
                  <div className="flex items-center mb-3">
                    <Users size={20} className="text-primary mr-2" />
                    <h2 className="text-lg font-medium">Users</h2>
                  </div>
                  <div className="space-y-2">
                    {users.slice(0, 3).map((user) => (
                      <Link 
                        key={user.id}
                        to={`/profile/${user.username}`}
                        className="card flex items-center p-3 hover:bg-background-lighter transition-colors"
                      >
                        {user.avatar ? (
                          <img 
                            src={user.avatar} 
                            alt={user.displayName} 
                            className="w-12 h-12 rounded-full object-cover mr-3"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                            <span className="text-primary font-bold">
                              {user.displayName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div>
                          <p className="font-medium">{user.displayName}</p>
                          <p className="text-sm text-text-secondary">@{user.username}</p>
                        </div>
                      </Link>
                    ))}
                    {users.length > 3 && (
                      <button 
                        className="text-primary text-sm font-medium hover:underline mt-2 flex items-center"
                        onClick={() => setActiveTab('users')}
                      >
                        View all users
                      </button>
                    )}
                  </div>
                </section>
              )}

              {/* Posts Section */}
              {posts.length > 0 && (
                <section>
                  <div className="flex items-center mb-3">
                    <Hash size={20} className="text-primary mr-2" />
                    <h2 className="text-lg font-medium">Posts</h2>
                  </div>
                  <div className="space-y-2">
                    {posts.slice(0, 3).map((post) => (
                      <div key={post.id} className="card p-3 hover:bg-background-lighter transition-colors">
                        <div className="flex items-center mb-2">
                          <Link to={`/profile/${post.author.username}`} className="flex items-center">
                            {post.author.avatar ? (
                              <img 
                                src={post.author.avatar} 
                                alt={post.author.displayName} 
                                className="w-8 h-8 rounded-full object-cover mr-2"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-2">
                                <span className="text-primary font-bold text-xs">
                                  {post.author.displayName.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            )}
                            <span className="font-medium">{post.author.displayName}</span>
                          </Link>
                        </div>
                        <p className="line-clamp-2">{post.content}</p>
                      </div>
                    ))}
                    {posts.length > 3 && (
                      <button 
                        className="text-primary text-sm font-medium hover:underline mt-2 flex items-center"
                        onClick={() => setActiveTab('posts')}
                      >
                        View all posts
                      </button>
                    )}
                  </div>
                </section>
              )}

              {users.length === 0 && posts.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-text-secondary">No results found for "{searchQuery}"</p>
                  <p className="text-text-muted text-sm mt-2">Try a different search term</p>
                </div>
              )}
            </>
          )}

          {activeTab === 'users' && (
            <div className="space-y-2">
              {users.length > 0 ? (
                users.map((user) => (
                  <motion.div 
                    key={user.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Link 
                      to={`/profile/${user.username}`}
                      className="card flex items-center p-4 hover:bg-background-lighter transition-colors"
                    >
                      {user.avatar ? (
                        <img 
                          src={user.avatar} 
                          alt={user.displayName} 
                          className="w-14 h-14 rounded-full object-cover mr-4"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center mr-4">
                          <span className="text-primary font-bold text-xl">
                            {user.displayName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-lg">{user.displayName}</p>
                        <p className="text-text-secondary">@{user.username}</p>
                        <p className="text-sm mt-1 line-clamp-1">{user.bio}</p>
                      </div>
                    </Link>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-text-secondary">No users found for "{searchQuery}"</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'posts' && (
            <div className="space-y-4">
              {posts.length > 0 ? (
                posts.map((post) => (
                  <motion.div 
                    key={post.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card p-4"
                  >
                    <div className="flex items-center mb-3">
                      <Link to={`/profile/${post.author.username}`} className="flex items-center">
                        {post.author.avatar ? (
                          <img 
                            src={post.author.avatar} 
                            alt={post.author.displayName} 
                            className="w-10 h-10 rounded-full object-cover mr-3"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                            <span className="text-primary font-bold">
                              {post.author.displayName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div>
                          <p className="font-medium">{post.author.displayName}</p>
                          <p className="text-text-secondary text-sm">@{post.author.username}</p>
                        </div>
                      </Link>
                    </div>
                    <p className="mb-4">{post.content}</p>
                    {post.media && post.media.length > 0 && (
                      <div className="rounded-lg overflow-hidden mb-4">
                        {post.media[0].type === 'image' ? (
                          <img 
                            src={post.media[0].url} 
                            alt="Post media" 
                            className="w-full h-auto rounded-lg"
                            loading="lazy" 
                          />
                        ) : (
                          <video 
                            src={post.media[0].url} 
                            className="w-full h-auto rounded-lg" 
                            controls
                          />
                        )}
                      </div>
                    )}
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-text-secondary">No posts found for "{searchQuery}"</p>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Search;