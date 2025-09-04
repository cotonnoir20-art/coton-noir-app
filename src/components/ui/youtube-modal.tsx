import React from 'react';
import { X } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface YouTubeModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoId: string;
  title: string;
}

export function YouTubeModal({ isOpen, onClose, videoId, title }: YouTubeModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 bg-black">
        <div className="relative">
          {/* Header with close button */}
          <div className="absolute top-2 right-2 z-10">
            <button
              onClick={onClose}
              className="p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          
          {/* Video title */}
          <div className="absolute top-2 left-2 z-10">
            <h3 className="text-white font-roboto text-sm bg-black/50 px-3 py-1 rounded-full">
              {title}
            </h3>
          </div>
          
          {/* YouTube iframe */}
          <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
              title={title}
              className="absolute top-0 left-0 w-full h-full rounded-lg"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}