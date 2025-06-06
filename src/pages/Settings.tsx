import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  User, Bell, Shield, Moon, Eye, Trash2, Save, LogOut, Camera, Upload 
} from 'lucide-react';
import { updateProfile } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';

const Settings: React.FC = () => {
  const { user, logout, updateUserProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'account' | 'privacy' | 'notifications' | 'theme'>('account');
  
  // Account settings
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState(user?.avatar || '');

  // Privacy settings
  const [privateAccount, setPrivateAccount] = useState(false);
  const [activityStatus, setActivityStatus] = useState(true);
  const [allowTagging, setAllowTagging] = useState(true);
  
  // Notification settings
  const [likesNotifications, setLikesNotifications] = useState(true);
  const [commentsNotifications, setCommentsNotifications] = useState(true);
  const [followsNotifications, setFollowsNotifications] = useState(true);
  const [mentionsNotifications, setMentionsNotifications] = useState(true);
  
  // Theme settings
  const [themeMode, setThemeMode] = useState<'dark' | 'system'>('dark');

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': []
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  });

  const handleSaveAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setSaveMessage('New passwords do not match');
      return;
    }
    
    setIsSaving(true);
    setSaveMessage('');
    
    try {
      await updateUserProfile({
        displayName,
        bio,
        email,
        photo,
        password: newPassword || undefined
      });
      
      setSaveMessage('Profile updated successfully');
      
      // Clear password fields
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Error updating profile:', error);
      setSaveMessage('Error updating profile');
    } finally {
      setIsSaving(false);
      // Clear save message after 3 seconds
      setTimeout(() => setSaveMessage(''), 3000);
    }
  };

  const handleDeleteAccount = () => {
    // In a real app, this would open a confirmation dialog
    alert('In a real app, this would delete your account after confirmation');
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold">Settings</h1>
      </motion.div>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Tabs - Sidebar on desktop */}
        <motion.div 
          className="md:w-64 mb-6 md:mb-0"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="card">
            <button
              className={`w-full text-left px-4 py-3 flex items-center rounded-lg ${
                activeTab === 'account'
                  ? 'bg-primary/10 text-primary'
                  : 'hover:bg-white/5'
              }`}
              onClick={() => setActiveTab('account')}
            >
              <User size={20} className="mr-3" />
              <span>Account</span>
            </button>
            
            <button
              className={`w-full text-left px-4 py-3 flex items-center rounded-lg ${
                activeTab === 'privacy'
                  ? 'bg-primary/10 text-primary'
                  : 'hover:bg-white/5'
              }`}
              onClick={() => setActiveTab('privacy')}
            >
              <Shield size={20} className="mr-3" />
              <span>Privacy</span>
            </button>
            
            <button
              className={`w-full text-left px-4 py-3 flex items-center rounded-lg ${
                activeTab === 'notifications'
                  ? 'bg-primary/10 text-primary'
                  : 'hover:bg-white/5'
              }`}
              onClick={() => setActiveTab('notifications')}
            >
              <Bell size={20} className="mr-3" />
              <span>Notifications</span>
            </button>
            
            <button
              className={`w-full text-left px-4 py-3 flex items-center rounded-lg ${
                activeTab === 'theme'
                  ? 'bg-primary/10 text-primary'
                  : 'hover:bg-white/5'
              }`}
              onClick={() => setActiveTab('theme')}
            >
              <Moon size={20} className="mr-3" />
              <span>Appearance</span>
            </button>
            
            <div className="border-t border-white/10 mt-4 pt-4">
              <button
                className="w-full text-left px-4 py-3 flex items-center text-error hover:bg-error/5 rounded-lg"
                onClick={handleLogout}
              >
                <LogOut size={20} className="mr-3" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </motion.div>
        
        {/* Tab content */}
        <motion.div 
          className="flex-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="card">
            {/* Account Settings */}
            {activeTab === 'account' && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Account Settings</h2>
                
                <AnimatePresence>
                  {saveMessage && (
                    <motion.div 
                      className={`p-3 rounded-lg mb-6 ${
                        saveMessage.includes('Error') 
                          ? 'bg-error/10 border border-error/20' 
                          : 'bg-success/10 border border-success/20'
                      }`}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      {saveMessage}
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <form onSubmit={handleSaveAccount}>
                  <div className="space-y-6">
                    {/* Profile Photo */}
                    <div className="space-y-4">
                      <h3 className="text-md font-medium text-text-secondary">Profile Photo</h3>
                      <div 
                        {...getRootProps()} 
                        className="flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 cursor-pointer transition-all hover:border-primary/50"
                      >
                        <input {...getInputProps()} />
                        {photoPreview ? (
                          <div className="relative">
                            <img 
                              src={photoPreview} 
                              alt="Profile preview" 
                              className="w-32 h-32 rounded-full object-cover"
                            />
                            <button 
                              type="button"
                              className="absolute bottom-0 right-0 p-2 bg-primary rounded-full shadow-lg"
                              onClick={(e) => {
                                e.stopPropagation();
                                setPhoto(null);
                                setPhotoPreview(user?.avatar || '');
                              }}
                            >
                              <Camera size={20} className="text-white" />
                            </button>
                          </div>
                        ) : (
                          <>
                            <Upload className="w-12 h-12 text-primary mb-4" />
                            <p className="text-text-secondary mb-2">
                              Drag & drop your photo here, or click to select
                            </p>
                            <p className="text-text-muted text-sm">
                              Recommended: Square image, at least 400x400px
                            </p>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Profile Information */}
                    <div className="space-y-4">
                      <h3 className="text-md font-medium text-text-secondary">Profile Information</h3>
                      
                      <div>
                        <label htmlFor="displayName" className="block text-sm font-medium text-text-secondary mb-1">
                          Display Name
                        </label>
                        <input
                          id="displayName"
                          type="text"
                          value={displayName}
                          onChange={(e) => setDisplayName(e.target.value)}
                          className="input w-full"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="bio" className="block text-sm font-medium text-text-secondary mb-1">
                          Bio
                        </label>
                        <textarea
                          id="bio"
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                          className="input w-full min-h-[80px] resize-y"
                          maxLength={160}
                        />
                        <p className="text-xs text-text-muted mt-1">
                          {bio.length}/160 characters
                        </p>
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-1">
                          Email
                        </label>
                        <input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="input w-full"
                        />
                      </div>
                    </div>
                    
                    {/* Password Change */}
                    <div className="space-y-4 pt-6 border-t border-white/10">
                      <h3 className="text-md font-medium text-text-secondary">Change Password</h3>
                      
                      <div>
                        <label htmlFor="currentPassword" className="block text-sm font-medium text-text-secondary mb-1">
                          Current Password
                        </label>
                        <input
                          id="currentPassword"
                          type="password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="input w-full"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="newPassword" className="block text-sm font-medium text-text-secondary mb-1">
                          New Password
                        </label>
                        <input
                          id="newPassword"
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="input w-full"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-text-secondary mb-1">
                          Confirm New Password
                        </label>
                        <input
                          id="confirmPassword"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="input w-full"
                        />
                      </div>
                    </div>
                    
                    {/* Danger Zone */}
                    <div className="space-y-4 pt-6 border-t border-white/10">
                      <h3 className="text-md font-medium text-error">Danger Zone</h3>
                      
                      <div className="bg-background p-4 rounded-lg border border-error/20">
                        <h4 className="text-md font-medium mb-2">Delete Account</h4>
                        <p className="text-text-secondary text-sm mb-4">
                          Once you delete your account, there is no going back. Please be certain.
                        </p>
                        <button
                          type="button"
                          onClick={handleDeleteAccount}
                          className="bg-error/10 text-error px-4 py-2 rounded-md hover:bg-error/20 transition-colors"
                        >
                          <Trash2 size={16} className="inline-block mr-2" />
                          Delete Account
                        </button>
                      </div>
                    </div>
                    
                    {/* Save Button */}
                    <motion.div 
                      className="pt-6 flex justify-end"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <button
                        type="submit"
                        className="btn-primary flex items-center"
                        disabled={isSaving}
                      >
                        {isSaving ? (
                          <div className="loader mr-2" />
                        ) : (
                          <Save size={18} className="mr-2" />
                        )}
                        Save Changes
                      </button>
                    </motion.div>
                  </div>
                </form>
              </div>
            )}
            
            {/* Privacy Settings */}
            {activeTab === 'privacy' && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Privacy Settings</h2>
                
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">Private Account</h3>
                      <p className="text-sm text-text-secondary mt-1">
                        When your account is private, only people you approve can see your content
                      </p>
                    </div>
                    <div className="relative inline-block w-12 h-6 transition-colors rounded-full cursor-pointer">
                      <input 
                        type="checkbox" 
                        id="privateAccount" 
                        checked={privateAccount}
                        onChange={() => setPrivateAccount(!privateAccount)}
                        className="sr-only"
                      />
                      <label 
                        htmlFor="privateAccount"
                        className={`block h-6 rounded-full transition-colors cursor-pointer ${
                          privateAccount ? 'bg-primary' : 'bg-background-lighter'
                        }`}
                      >
                        <span 
                          className={`absolute left-1 top-1 bg-white h-4 w-4 rounded-full transition-transform transform ${
                            privateAccount ? 'translate-x-6' : 'translate-x-0'
                          }`} 
                        />
                      </label>
                    </div>
                  </div>
                  
                  <div className="border-t border-white/10 pt-4"></div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">Activity Status</h3>
                      <p className="text-sm text-text-secondary mt-1">
                        Allow people to see when you were last active
                      </p>
                    </div>
                    <div className="relative inline-block w-12 h-6 transition-colors rounded-full cursor-pointer">
                      <input 
                        type="checkbox" 
                        id="activityStatus" 
                        checked={activityStatus}
                        onChange={() => setActivityStatus(!activityStatus)}
                        className="sr-only"
                      />
                      <label 
                        htmlFor="activityStatus"
                        className={`block h-6 rounded-full transition-colors cursor-pointer ${
                          activityStatus ? 'bg-primary' : 'bg-background-lighter'
                        }`}
                      >
                        <span 
                          className={`absolute left-1 top-1 bg-white h-4 w-4 rounded-full transition-transform transform ${
                            activityStatus ? 'translate-x-6' : 'translate-x-0'
                          }`} 
                        />
                      </label>
                    </div>
                  </div>
                  
                  <div className="border-t border-white/10 pt-4"></div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">Allow Tagging</h3>
                      <p className="text-sm text-text-secondary mt-1">
                        Allow others to tag you in their posts and comments
                      </p>
                    </div>
                    <div className="relative inline-block w-12 h-6 transition-colors rounded-full cursor-pointer">
                      <input 
                        type="checkbox" 
                        id="allowTagging" 
                        checked={allowTagging}
                        onChange={() => setAllowTagging(!allowTagging)}
                        className="sr-only"
                      />
                      <label 
                        htmlFor="allowTagging"
                        className={`block h-6 rounded-full transition-colors cursor-pointer ${
                          allowTagging ? 'bg-primary' : 'bg-background-lighter'
                        }`}
                      >
                        <span 
                          className={`absolute left-1 top-1 bg-white h-4 w-4 rounded-full transition-transform transform ${
                            allowTagging ? 'translate-x-6' : 'translate-x-0'
                          }`} 
                        />
                      </label>
                    </div>
                  </div>
                  
                  <div className="border-t border-white/10 pt-4"></div>
                  
                  <div>
                    <h3 className="font-medium mb-4">Who Can See Your Content</h3>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <input 
                          type="radio" 
                          id="everyone" 
                          name="visibility" 
                          className="mr-3" 
                          defaultChecked 
                        />
                        <div>
                          <label htmlFor="everyone" className="font-medium">Everyone</label>
                          <p className="text-text-secondary text-sm">Anyone on the platform</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <input 
                          type="radio" 
                          id="followers" 
                          name="visibility" 
                          className="mr-3" 
                        />
                        <div>
                          <label htmlFor="followers" className="font-medium">Followers only</label>
                          <p className="text-text-secondary text-sm">Only people who follow you</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-6 flex justify-end">
                    <button
                      type="button"
                      className="btn-primary flex items-center"
                    >
                      <Save size={18} className="mr-2" />
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Notification Settings */}
            {activeTab === 'notifications' && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Notification Settings</h2>
                
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">Likes</h3>
                      <p className="text-sm text-text-secondary mt-1">
                        Get notified when someone likes your post
                      </p>
                    </div>
                    <div className="relative inline-block w-12 h-6 transition-colors rounded-full cursor-pointer">
                      <input 
                        type="checkbox" 
                        id="likesNotif" 
                        checked={likesNotifications}
                        onChange={() => setLikesNotifications(!likesNotifications)}
                        className="sr-only"
                      />
                      <label 
                        htmlFor="likesNotif"
                        className={`block h-6 rounded-full transition-colors cursor-pointer ${
                          likesNotifications ? 'bg-primary' : 'bg-background-lighter'
                        }`}
                      >
                        <span 
                          className={`absolute left-1 top-1 bg-white h-4 w-4 rounded-full transition-transform transform ${
                            likesNotifications ? 'translate-x-6' : 'translate-x-0'
                          }`} 
                        />
                      </label>
                    </div>
                  </div>
                  
                  <div className="border-t border-white/10 pt-4"></div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">Comments</h3>
                      <p className="text-sm text-text-secondary mt-1">
                        Get notified when someone comments on your post
                      </p>
                    </div>
                    <div className="relative inline-block w-12 h-6 transition-colors rounded-full cursor-pointer">
                      <input 
                        type="checkbox" 
                        id="commentsNotif" 
                        checked={commentsNotifications}
                        onChange={() => setCommentsNotifications(!commentsNotifications)}
                        className="sr-only"
                      />
                      <label 
                        htmlFor="commentsNotif"
                        className={`block h-6 rounded-full transition-colors cursor-pointer ${
                          commentsNotifications ? 'bg-primary' : 'bg-background-lighter'
                        }`}
                      >
                        <span 
                          className={`absolute left-1 top-1 bg-white h-4 w-4 rounded-full transition-transform transform ${
                            commentsNotifications ? 'translate-x-6' : 'translate-x-0'
                          }`} 
                        />
                      </label>
                    </div>
                  </div>
                  
                  <div className="border-t border-white/10 pt-4"></div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">New Followers</h3>
                      <p className="text-sm text-text-secondary mt-1">
                        Get notified when someone follows you
                      </p>
                    </div>
                    <div className="relative inline-block w-12 h-6 transition-colors rounded-full cursor-pointer">
                      <input 
                        type="checkbox" 
                        id="followsNotif" 
                        checked={followsNotifications}
                        onChange={() => setFollowsNotifications(!followsNotifications)}
                        className="sr-only"
                      />
                      <label 
                        htmlFor="followsNotif"
                        className={`block h-6 rounded-full transition-colors cursor-pointer ${
                          followsNotifications ? 'bg-primary' : 'bg-background-lighter'
                        }`}
                      >
                        <span 
                          className={`absolute left-1 top-1 bg-white h-4 w-4 rounded-full transition-transform transform ${
                            followsNotifications ? 'translate-x-6' : 'translate-x-0'
                          }`} 
                        />
                      </label>
                    </div>
                  </div>
                  
                  <div className="border-t border-white/10 pt-4"></div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">Mentions</h3>
                      <p className="text-sm text-text-secondary mt-1">
                        Get notified when someone mentions you
                      </p>
                    </div>
                    <div className="relative inline-block w-12 h-6 transition-colors rounded-full cursor-pointer">
                      <input 
                        type="checkbox" 
                        id="mentionsNotif" 
                        checked={mentionsNotifications}
                        onChange={() => setMentionsNotifications(!mentionsNotifications)}
                        className="sr-only"
                      />
                      <label 
                        htmlFor="mentionsNotif"
                        className={`block h-6 rounded-full transition-colors cursor-pointer ${
                          mentionsNotifications ? 'bg-primary' : 'bg-background-lighter'
                        }`}
                      >
                        <span 
                          className={`absolute left-1 top-1 bg-white h-4 w-4 rounded-full transition-transform transform ${
                            mentionsNotifications ? 'translate-x-6' : 'translate-x-0'
                          }`} 
                        />
                      </label>
                    </div>
                  </div>
                  
                  <div className="pt-6 flex justify-end">
                    <button
                      type="button"
                      className="btn-primary flex items-center"
                    >
                      <Save size={18} className="mr-2" />
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Appearance Settings */}
            {activeTab === 'theme' && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Appearance</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-4">Theme Mode</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div
                        className={`border rounded-lg p-4 cursor-pointer transition-all ${
                          themeMode === 'dark' 
                            ? 'border-primary bg-primary/5' 
                            : 'border-white/10 hover:border-white/30'
                        }`}
                        onClick={() => setThemeMode('dark')}
                      >
                        <div className="bg-background-card rounded-md p-3 mb-4">
                          <Moon size={24} className="text-primary mx-auto" />
                        </div>
                        <p className="font-medium text-center">Dark</p>
                      </div>
                      
                      <div
                        className={`border rounded-lg p-4 cursor-pointer transition-all ${
                          themeMode === 'system' 
                            ? 'border-primary bg-primary/5' 
                            : 'border-white/10 hover:border-white/30'
                        }`}
                        onClick={() => setThemeMode('system')}
                      >
                        <div className="bg-background-card rounded-md p-3 mb-4">
                          <div className="w-6 h-6 mx-auto bg-white rounded-full border-4 border-black"></div>
                        </div>
                        <p className="font-medium text-center">System</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-white/10 pt-6">
                    <h3 className="font-medium mb-4">Interface Density</h3>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <input 
                          type="radio" 
                          id="defaultDensity" 
                          name="density" 
                          className="mr-3" 
                          defaultChecked 
                        />
                        <div>
                          <label htmlFor="defaultDensity" className="font-medium">Default</label>
                          <p className="text-text-secondary text-sm">Standard spacing between items</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <input 
                          type="radio" 
                          id="compactDensity" 
                          name="density" 
                          className="mr-3" 
                        />
                        <div>
                          <label htmlFor="compactDensity" className="font-medium">Compact</label>
                          <p className="text-text-secondary text-sm">Less space between items</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-white/10 pt-6">
                    <h3 className="font-medium mb-4">Reduce Motion</h3>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-text-secondary">
                          Minimize animations for a more static experience
                        </p>
                      </div>
                      <div className="relative inline-block w-12 h-6 transition-colors rounded-full cursor-pointer">
                        <input 
                          type="checkbox" 
                          id="reduceMotion" 
                          className="sr-only"
                        />
                        <label 
                          htmlFor="reduceMotion"
                          className="block h-6 rounded-full transition-colors cursor-pointer bg-background-lighter"
                        >
                          <span className="absolute left-1 top-1 bg-white h-4 w-4 rounded-full transition-transform transform" />
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-6 flex justify-end">
                
                    <button
                      type="button"
                      className="btn-primary flex items-center"
                    >
                      <Save size={18} className="mr-2" />
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;