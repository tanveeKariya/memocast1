import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Settings, 
  Bell, 
  Save, 
  Globe, 
  HelpCircle, 
  Shield, 
  User,
  Edit3,
  Trash2,
  Plus,
  ChevronRight,
  Download,
  LogOut,
  FileText
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { personalitiesAPI, authAPI } from '../services/api';
import { DraftsModal } from './DraftsModal';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSettingsUpdated: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onSettingsUpdated }) => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'general' | 'personalities' | 'account'>('general');
  const [notifications, setNotifications] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [language, setLanguage] = useState('English');
  const [personalities, setPersonalities] = useState<any[]>([]);
  const [showPersonalityForm, setShowPersonalityForm] = useState(false);
  const [editingPersonality, setEditingPersonality] = useState<any>(null);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showDraftsModal, setShowDraftsModal] = useState(false);
  const [profileData, setProfileData] = useState({
    username: user?.username || '',
    email: user?.email || ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [personalityForm, setPersonalityForm] = useState({
    name: '',
    icon: '👤',
    description: '',
    color: '#8B5CF6'
  });

  useEffect(() => {
    if (isOpen) {
      loadPersonalities();
      // Load saved preferences
      const savedNotifications = localStorage.getItem('notifications') !== 'false';
      const savedAutoSave = localStorage.getItem('autoSave') !== 'false';
      const savedLanguage = localStorage.getItem('language') || 'English';
      
      setNotifications(savedNotifications);
      setAutoSave(savedAutoSave);
      setLanguage(savedLanguage);
      
      // Update profile data when user changes
      setProfileData({
        username: user?.username || '',
        email: user?.email || ''
      });
    }
  }, [isOpen, user]);

  const loadPersonalities = async () => {
    try {
      const response = await personalitiesAPI.getPersonalities();
      setPersonalities(response.data);
    } catch (error) {
      console.error('Error loading personalities:', error);
    }
  };

  const handleNotificationsToggle = async () => {
    const newNotifications = !notifications;
    setNotifications(newNotifications);
    localStorage.setItem('notifications', newNotifications.toString());
    
    try {
      await authAPI.updatePreferences({
        ...user?.preferences,
        notifications: newNotifications
      });
    } catch (error) {
      console.error('Error updating notifications preference:', error);
    }
  };

  const handleAutoSaveToggle = async () => {
    const newAutoSave = !autoSave;
    setAutoSave(newAutoSave);
    localStorage.setItem('autoSave', newAutoSave.toString());
    
    try {
      await authAPI.updatePreferences({
        ...user?.preferences,
        autoSave: newAutoSave
      });
    } catch (error) {
      console.error('Error updating auto-save preference:', error);
    }
  };

  const handleLanguageChange = async (newLanguage: string) => {
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
    
    try {
      await authAPI.updatePreferences({
        ...user?.preferences,
        language: newLanguage
      });
    } catch (error) {
      console.error('Error updating language preference:', error);
    }
  };

  const handleCreatePersonality = async () => {
    try {
      await personalitiesAPI.createPersonality(personalityForm);
      setPersonalityForm({ name: '', icon: '👤', description: '', color: '#8B5CF6' });
      setShowPersonalityForm(false);
      loadPersonalities();
      onSettingsUpdated();
    } catch (error) {
      console.error('Error creating personality:', error);
    }
  };

  const handleUpdatePersonality = async () => {
    try {
      await personalitiesAPI.updatePersonality(editingPersonality._id, personalityForm);
      setPersonalityForm({ name: '', icon: '👤', description: '', color: '#8B5CF6' });
      setEditingPersonality(null);
      loadPersonalities();
      onSettingsUpdated();
    } catch (error) {
      console.error('Error updating personality:', error);
    }
  };

  const handleDeletePersonality = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this identity?')) {
      try {
        await personalitiesAPI.deletePersonality(id);
        loadPersonalities();
        onSettingsUpdated();
      } catch (error) {
        console.error('Error deleting personality:', error);
      }
    }
  };

  const handleExportData = async () => {
    try {
      const response = await authAPI.exportData();
      const blob = new Blob([JSON.stringify(response.data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `memocast-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      await authAPI.updateProfile(profileData);
      setShowEditProfile(false);
      onSettingsUpdated();
      window.location.reload();
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    
    try {
      await authAPI.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowChangePassword(false);
      alert('Password changed successfully');
    } catch (error) {
      console.error('Error changing password:', error);
      alert('Error changing password');
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        await authAPI.deleteAccount();
        logout();
      } catch (error) {
        console.error('Error deleting account:', error);
      }
    }
  };

  const openHelpAndSupport = () => {
    window.open('mailto:support@memocast.co?subject=Help and Support', '_blank');
  };

  const openPrivacyPolicy = () => {
    window.open('https://memocast.co/privacy', '_blank');
  };

  if (!isOpen) return null;

  const renderGeneralSettings = () => (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Preferences */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Settings className="w-5 h-5 mr-2" />
          Preferences
        </h3>
        
        {/* Settings toggles */}
        {[
          { icon: Bell, label: 'Notifications', state: notifications, setState: handleNotificationsToggle },
          { icon: Save, label: 'Auto-save', state: autoSave, setState: handleAutoSaveToggle }
        ].map((setting, index) => (
          <motion.div 
            key={setting.label}
            className="flex items-center justify-between py-3 border-b border-gray-100"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ backgroundColor: 'rgba(0,0,0,0.02)' }}
          >
            <div className="flex items-center">
              <setting.icon className="w-5 h-5 mr-3 text-gray-600" />
              <span className="text-gray-700">{setting.label}</span>
            </div>
            <motion.button
              onClick={setting.setState}
              className={`w-12 h-6 rounded-full transition-colors ${
                setting.state ? 'bg-purple-600' : 'bg-gray-300'
              }`}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div 
                className="w-5 h-5 bg-white rounded-full"
                animate={{ x: setting.state ? 24 : 4 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </motion.button>
          </motion.div>
        ))}

        {/* Language */}
        <motion.div 
          className="flex items-center justify-between py-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center">
            <Globe className="w-5 h-5 mr-3 text-gray-600" />
            <span className="text-gray-700">Language</span>
          </div>
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900"
          >
            <option value="English">English</option>
            <option value="Spanish">Spanish</option>
            <option value="French">French</option>
            <option value="German">German</option>
          </select>
        </motion.div>
      </div>

      {/* Support */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Support</h3>
        
        {[
          { icon: HelpCircle, label: 'Help & Support', action: openHelpAndSupport },
          { icon: Shield, label: 'Privacy Policy', action: openPrivacyPolicy }
        ].map((item, index) => (
          <motion.button 
            key={item.label}
            onClick={item.action}
            className="flex items-center justify-between w-full py-3 text-left hover:bg-gray-50 rounded-lg px-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <div className="flex items-center">
              <item.icon className="w-5 h-5 mr-3 text-gray-600" />
              <span className="text-gray-700">{item.label}</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </motion.button>
        ))}
      </div>
    </motion.div>
  );

  const renderPersonalities = () => (
    <motion.div 
      className="space-y-4"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Your Identities</h3>
        <motion.button
          onClick={() => setShowPersonalityForm(true)}
          className="p-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Plus className="w-5 h-5" />
        </motion.button>
      </div>

      <div className="max-h-64 overflow-y-auto space-y-3">
        {personalities.map((personality, index) => (
          <motion.div 
            key={personality._id} 
            className="bg-gray-50 rounded-xl p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.01 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{personality.icon}</span>
                <div>
                  <h4 className="font-semibold text-gray-900">{personality.name}</h4>
                  {user?.currentPersonality?._id === personality._id && (
                    <span className="text-sm text-green-600 font-medium">Active</span>
                  )}
                  <p className="text-sm text-gray-600 mt-1">{personality.description}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <motion.button
                  onClick={() => {
                    setEditingPersonality(personality);
                    setPersonalityForm({
                      name: personality.name,
                      icon: personality.icon,
                      description: personality.description,
                      color: personality.color
                    });
                  }}
                  className="p-2 text-gray-600 hover:text-purple-600 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Edit3 className="w-4 h-4" />
                </motion.button>
                <motion.button 
                  onClick={() => handleDeletePersonality(personality._id)}
                  className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Trash2 className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add/Edit Personality Form */}
      <AnimatePresence>
        {(showPersonalityForm || editingPersonality) && (
          <motion.div 
            className="bg-white border border-gray-200 rounded-xl p-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h4 className="font-semibold text-gray-900 mb-4">
              {editingPersonality ? 'Edit Identity' : 'Add New Identity'}
            </h4>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Identity name"
                value={personalityForm.name}
                onChange={(e) => setPersonalityForm({...personalityForm, name: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900"
              />
              <input
                type="text"
                placeholder="Icon (emoji)"
                value={personalityForm.icon}
                onChange={(e) => setPersonalityForm({...personalityForm, icon: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900"
              />
              <textarea
                placeholder="Description"
                rows={3}
                value={personalityForm.description}
                onChange={(e) => setPersonalityForm({...personalityForm, description: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none bg-white text-gray-900"
              />
              <div className="flex space-x-3">
                <motion.button 
                  onClick={editingPersonality ? handleUpdatePersonality : handleCreatePersonality}
                  className="flex-1 bg-purple-600 text-white py-3 rounded-xl hover:bg-purple-700 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {editingPersonality ? 'Update' : 'Create'}
                </motion.button>
                <motion.button
                  onClick={() => {
                    setShowPersonalityForm(false);
                    setEditingPersonality(null);
                    setPersonalityForm({ name: '', icon: '👤', description: '', color: '#8B5CF6' });
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-xl hover:bg-gray-400 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );

  const renderAccount = () => (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Profile Section */}
      <motion.div 
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <img
          src={user?.avatar || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150'}
          alt="Profile"
          className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
          onError={(e) => {
            e.currentTarget.src = 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150';
          }}
        />
        <h3 className="text-xl font-semibold text-gray-900">{user?.username}</h3>
        <p className="text-gray-600">{user?.email}</p>
        <span className="inline-block bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium mt-2">
          Premium Member
        </span>
      </motion.div>

      {/* Account Options */}
      <div className="space-y-2">
        {[
          { icon: Edit3, label: 'Edit Profile', action: () => setShowEditProfile(true) },
          { icon: Shield, label: 'Change Password', action: () => setShowChangePassword(true) },
          { icon: FileText, label: 'View Drafts', action: () => setShowDraftsModal(true) },
          { icon: Shield, label: 'Privacy Settings', action: openPrivacyPolicy },
          { icon: Download, label: 'Export Data', action: handleExportData }
        ].map((item, index) => (
          <motion.button 
            key={item.label}
            onClick={item.action}
            className="flex items-center justify-between w-full py-3 text-left hover:bg-gray-50 rounded-lg px-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <div className="flex items-center">
              <item.icon className="w-5 h-5 mr-3 text-gray-600" />
              <span className="text-gray-700">{item.label}</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </motion.button>
        ))}
      </div>

      {/* Edit Profile Form */}
      <AnimatePresence>
        {showEditProfile && (
          <motion.div 
            className="bg-gray-50 rounded-xl p-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h4 className="font-semibold text-gray-900 mb-4">Edit Profile</h4>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Username"
                value={profileData.username}
                onChange={(e) => setProfileData({...profileData, username: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900"
              />
              <input
                type="email"
                placeholder="Email"
                value={profileData.email}
                onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900"
              />
              <div className="flex space-x-3">
                <motion.button 
                  onClick={handleUpdateProfile}
                  className="flex-1 bg-purple-600 text-white py-3 rounded-xl hover:bg-purple-700 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Update
                </motion.button>
                <motion.button
                  onClick={() => setShowEditProfile(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-xl hover:bg-gray-400 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Change Password Form */}
      <AnimatePresence>
        {showChangePassword && (
          <motion.div 
            className="bg-gray-50 rounded-xl p-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h4 className="font-semibold text-gray-900 mb-4">Change Password</h4>
            <div className="space-y-4">
              <input
                type="password"
                placeholder="Current Password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900"
              />
              <input
                type="password"
                placeholder="New Password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900"
              />
              <input
                type="password"
                placeholder="Confirm New Password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900"
              />
              <div className="flex space-x-3">
                <motion.button 
                  onClick={handleChangePassword}
                  className="flex-1 bg-purple-600 text-white py-3 rounded-xl hover:bg-purple-700 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Change Password
                </motion.button>
                <motion.button
                  onClick={() => setShowChangePassword(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-xl hover:bg-gray-400 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Danger Zone */}
      <motion.div 
        className="border-t border-gray-200 pt-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Danger Zone</h4>
        
        <motion.button
          onClick={logout}
          className="flex items-center justify-between w-full py-3 text-left hover:bg-red-50 rounded-lg px-3 text-red-600 mb-2"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <div className="flex items-center">
            <LogOut className="w-5 h-5 mr-3" />
            <span>Sign Out</span>
          </div>
          <ChevronRight className="w-5 h-5" />
        </motion.button>
        
        <motion.button 
          onClick={handleDeleteAccount}
          className="flex items-center justify-between w-full py-3 text-left hover:bg-red-50 rounded-lg px-3 text-red-600"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <div className="flex items-center">
            <Trash2 className="w-5 h-5 mr-3" />
            <span>Delete Account</span>
          </div>
          <ChevronRight className="w-5 h-5" />
        </motion.button>
      </motion.div>
    </motion.div>
  );

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div 
          className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", damping: 20 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Settings</h2>
            <motion.button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-6 h-6 text-gray-600" />
            </motion.button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            {[
              { id: 'general', label: 'General Settings' },
              { id: 'personalities', label: 'Your Identities' },
              { id: 'account', label: 'Account' }
            ].map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 py-4 px-6 text-center font-medium transition-colors relative ${
                  activeTab === tab.id
                    ? 'text-purple-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600"
                    layoutId="activeTab"
                    transition={{ type: "spring", damping: 30, stiffness: 300 }}
                  />
                )}
              </motion.button>
            ))}
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            <AnimatePresence mode="wait">
              {activeTab === 'general' && renderGeneralSettings()}
              {activeTab === 'personalities' && renderPersonalities()}
              {activeTab === 'account' && renderAccount()}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>

      {/* Drafts Modal */}
      <DraftsModal
        isOpen={showDraftsModal}
        onClose={() => setShowDraftsModal(false)}
      />
    </AnimatePresence>
  );
};