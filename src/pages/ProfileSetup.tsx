import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Upload, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { useAuth } from '../contexts/AuthContext';

const steps = [
  {
    id: 'photo',
    title: 'Add Profile Photo',
    description: 'Choose a photo that represents you',
  },
  {
    id: 'bio',
    title: 'Tell Us About Yourself',
    description: 'Share your story with the community',
  },
  {
    id: 'interests',
    title: 'Select Your Interests',
    description: 'Help us personalize your experience',
  },
  {
    id: 'preferences',
    title: 'Set Your Preferences',
    description: 'Customize your Night Walker experience',
  }
];

const interests = [
  'Digital Art', 'Photography', 'Technology', 'Music',
  'Gaming', 'Science', 'Nature', 'Travel', 'Fashion',
  'Movies', 'Books', 'Fitness', 'Food', 'Coding',
  'Space', 'Cyberpunk', 'AI', 'Virtual Reality'
];

const ProfileSetup: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [bio, setBio] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [notifications, setNotifications] = useState(true);
  const [privateAccount, setPrivateAccount] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { user, updateUserProfile } = useAuth();

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

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setIsLoading(true);
      try {
        await updateUserProfile({
          photo,
          bio,
          interests: selectedInterests,
          preferences: {
            notifications,
            privateAccount
          }
        });
        navigate('/');
      } catch (error) {
        console.error('Error updating profile:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev => 
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div 
              {...getRootProps()} 
              className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all hover:border-primary/50"
            >
              <input {...getInputProps()} />
              {photoPreview ? (
                <div className="relative w-32 h-32 mx-auto">
                  <img 
                    src={photoPreview} 
                    alt="Profile preview" 
                    className="w-full h-full rounded-full object-cover"
                  />
                  <button 
                    className="absolute bottom-0 right-0 p-2 bg-primary rounded-full shadow-lg"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPhoto(null);
                      setPhotoPreview('');
                    }}
                  >
                    <Camera size={20} className="text-white" />
                  </button>
                </div>
              ) : (
                <>
                  <Upload className="w-12 h-12 text-primary mx-auto mb-4" />
                  <p className="text-text-secondary mb-2">
                    Drag & drop your photo here, or click to select
                  </p>
                  <p className="text-text-muted text-sm">
                    Recommended: Square image, at least 400x400px
                  </p>
                </>
              )}
            </div>
          </motion.div>
        );

      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Write a short bio about yourself..."
              className="input w-full min-h-[200px] resize-none"
              maxLength={160}
            />
            <p className="text-text-muted text-sm mt-2">
              {bio.length}/160 characters
            </p>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-2 sm:grid-cols-3 gap-2"
          >
            {interests.map((interest) => (
              <motion.button
                key={interest}
                className={`p-3 rounded-lg text-sm font-medium transition-all ${
                  selectedInterests.includes(interest)
                    ? 'bg-primary text-white'
                    : 'bg-background-lighter text-text-secondary hover:bg-background-card'
                }`}
                onClick={() => toggleInterest(interest)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {interest}
              </motion.button>
            ))}
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Notifications</h3>
                <p className="text-text-secondary text-sm">
                  Receive updates about activity
                </p>
              </div>
              <div className="relative inline-block w-12 h-6">
                <input
                  type="checkbox"
                  checked={notifications}
                  onChange={() => setNotifications(!notifications)}
                  className="sr-only"
                />
                <div
                  className={`block w-12 h-6 rounded-full transition-colors ${
                    notifications ? 'bg-primary' : 'bg-background-lighter'
                  }`}
                >
                  <div
                    className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform transform ${
                      notifications ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Private Account</h3>
                <p className="text-text-secondary text-sm">
                  Only approved followers can see your posts
                </p>
              </div>
              <div className="relative inline-block w-12 h-6">
                <input
                  type="checkbox"
                  checked={privateAccount}
                  onChange={() => setPrivateAccount(!privateAccount)}
                  className="sr-only"
                />
                <div
                  className={`block w-12 h-6 rounded-full transition-colors ${
                    privateAccount ? 'bg-primary' : 'bg-background-lighter'
                  }`}
                >
                  <div
                    className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform transform ${
                      privateAccount ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background-lighter flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <motion.div
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              {steps.map((step, index) => (
                <motion.div
                  key={step.id}
                  className={`w-2 h-2 rounded-full ${
                    index <= currentStep ? 'bg-primary' : 'bg-background-lighter'
                  }`}
                  animate={{
                    scale: index === currentStep ? [1, 1.2, 1] : 1
                  }}
                  transition={{
                    duration: 0.5,
                    repeat: index === currentStep ? Infinity : 0,
                    repeatType: "reverse"
                  }}
                />
              ))}
            </div>
            <h2 className="text-2xl font-bold mb-2">
              {steps[currentStep].title}
            </h2>
            <p className="text-text-secondary">
              {steps[currentStep].description}
            </p>
          </div>

          {/* Step content */}
          <AnimatePresence mode="wait">
            {renderStep()}
          </AnimatePresence>

          {/* Navigation */}
          <div className="mt-8 flex justify-end">
            <motion.button
              className="btn-primary flex items-center"
              onClick={handleNext}
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? (
                <div className="loader mr-2" />
              ) : (
                <>
                  {currentStep === steps.length - 1 ? 'Complete' : 'Next'}
                  <ArrowRight size={18} className="ml-2" />
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfileSetup;