import React, { useState } from 'react';
import { X, ChevronDown, Check } from 'lucide-react';

interface PublishPortfolioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PublishPortfolioModal: React.FC<PublishPortfolioModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [portfolioName, setPortfolioName] = useState('');
  const [selectedEgo, setSelectedEgo] = useState('Personal');
  const [selectedFolders, setSelectedFolders] = useState<string[]>(['academics', 'work']);
  const [selectedFiles, setSelectedFiles] = useState<string[]>(['Day 1', 'Day 5', 'Day 9']);

  const handleSubmit = () => {
    console.log('Publishing portfolio:', {
      name: portfolioName,
      ego: selectedEgo,
      folders: selectedFolders,
      files: selectedFiles
    });
    onClose();
    setStep(1);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Publish a New Portfolio</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {step === 1 && (
          <div>
            <div className="mb-6">
              <input
                type="text"
                value={portfolioName}
                onChange={(e) => setPortfolioName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
                placeholder="Enter Publish name"
              />
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Choose Your Ego for this folder
                </label>
                <div className="relative">
                  <select
                    value={selectedEgo}
                    onChange={(e) => setSelectedEgo(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none pr-10"
                  >
                    <option value="Personal">Personal</option>
                    <option value="Academic">Academic</option>
                    <option value="Work">Work</option>
                    <option value="Others">Others</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Choose Folders/Projects
                </label>
                <div className="relative">
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none pr-10">
                    <option>academics, work</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Choose notes/Files
                </label>
                <div className="relative">
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none pr-10">
                    <option>Day 1, Day 5, Day 9</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>

            <p className="text-sm text-gray-500 mb-6">0 items selected.</p>

            <button
              onClick={() => setStep(2)}
              className="w-full bg-purple-600 text-white py-3 rounded-xl hover:bg-purple-700 transition-colors font-semibold"
            >
              Publish now
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Publish 1</h3>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Choose Your Ego for this folder
                </label>
                <div className="text-purple-600 font-medium">🎵 Musician</div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Choose Folders/Projects
                </label>
                <div className="text-purple-600 font-medium">academics, work</div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Choose notes/Files
                </label>
                <div className="text-purple-600 font-medium">Day 1, Day 5, Day 9</div>
              </div>
            </div>

            <p className="text-sm text-gray-700 mb-6">
              x items selected. This includes x,y,z notes from these projects/folders a,b,c
            </p>

            <button
              onClick={handleSubmit}
              className="w-full bg-purple-600 text-white py-3 rounded-xl hover:bg-purple-700 transition-colors font-semibold"
            >
              Publish now
            </button>
          </div>
        )}
      </div>
    </div>
  );
};