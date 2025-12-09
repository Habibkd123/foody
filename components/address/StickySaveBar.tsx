import React from 'react';
import { Button } from '@/components/ui/button';

interface StickySaveBarProps {
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  editMode?: boolean;
}

export default function StickySaveBar({ onClick, disabled, loading, editMode }: StickySaveBarProps) {
  return (
    <div className="sticky bottom-0 left-0 right-0 -mx-3 sm:mx-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-t border-gray-200 px-3 sm:px-0 py-3 pb-[env(safe-area-inset-bottom)] shadow-lg">
      <Button
        onClick={onClick}
        className="w-full bg-green-600 hover:bg-green-700 text-white h-12 sm:h-14 text-base sm:text-lg rounded-lg"
        disabled={disabled}
      >
        {loading ? 'Saving...' : (editMode ? 'Update Address' : 'Save & Continue')}
      </Button>
    </div>
  );
}
