import React from 'react';

interface ExerciseImageModalProps {
  isOpen: boolean;
  exerciseName: string;
  imageUrl: string;
  onClose: () => void;
}

export const ExerciseImageModal: React.FC<ExerciseImageModalProps> = ({ isOpen, exerciseName, imageUrl, onClose }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="relative max-w-lg w-[90%] bg-surface-container rounded-[1rem] overflow-hidden border border-outline-variant/20 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-outline-variant/10">
          <h3 className="font-headline font-bold text-on-surface text-sm truncate">{exerciseName}</h3>
          <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="p-4 flex items-center justify-center min-h-[200px]">
          <img 
            src={imageUrl} 
            alt={exerciseName}
            className="max-w-full max-h-[400px] rounded-lg object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '';
              (e.target as HTMLImageElement).alt = 'Image unavailable';
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ExerciseImageModal;
