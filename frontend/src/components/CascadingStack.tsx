import React, { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from 'framer-motion';
// Removed: import { useDrag } from '@use-gesture/react';
import MessageCard from './MessageCard';
import messageService from '../api/messageService';

interface Message {
  message_id: string;
  recipient_user_id: string;
  text_content: string | null;
  image_url: string | null;
  sender_device_model: string | null;
  is_read: boolean;
  created_at: string;
}

interface CascadingStackProps {
  messages: Message[];
  onMessageRead: (messageId: string) => void;
}

const CascadingStack: React.FC<CascadingStackProps> = ({ messages, onMessageRead }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const y = useMotionValue(0); // Change from x to y for vertical drag
  const scale = useTransform(y, [-200, 0, 200], [0.8, 1, 0.8]); // Adjust for y
  const rotate = useTransform(y, [-200, 0, 200], [-15, 0, 15], { clamp: false }); // Adjust for y

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (Math.abs(info.velocity.y) > 200 || Math.abs(info.delta.y) > 100) {
      if (info.delta.y < 0 && currentIndex < messages.length - 1) { // Swipe UP to go to next message
        setCurrentIndex((prev) => prev + 1);
        onMessageRead(messages[currentIndex + 1].message_id);
      }
      // Removed: else if (info.delta.x < 0 && currentIndex > 0) { // Swipe left, go to previous message
      // Removed:   setCurrentIndex((prev) => prev - 1);
      // Removed:   onMessageRead(messages[currentIndex - 1].message_id);
      // Removed: }
    }
    y.set(0); // Reset position after drag
  };

  return (
    <div className="cascading-stack-container relative w-full max-w-md mx-auto h-96 flex justify-center items-center">
      <AnimatePresence initial={false}>
        {messages.map((message, i) => {
          const isCurrent = i === currentIndex;
          const isBehind = i > currentIndex;

          return (
            <motion.div
              key={message.message_id}
              drag="y" // Enable vertical dragging
              onDragEnd={handleDragEnd}
              dragConstraints={{ top: -200, bottom: 200 }} // Limit drag range for vertical
              dragElastic={0.5} // Make dragging feel more elastic
              style={{ y, scale, rotate, zIndex: isCurrent ? 10 : 10 - i }} // Apply motion values and zIndex
              initial={{ opacity: 0, y: 50, scale: 0.7 }}
              animate={{
                opacity: isCurrent ? 1 : isBehind ? 0.7 : 0,
                y: isCurrent ? 0 : isBehind ? (i - currentIndex) * 20 : (i - currentIndex) * 20,
                scale: isCurrent ? 1 : isBehind ? 1 - (i - currentIndex) * 0.1 : 0.7,
                filter: isCurrent ? 'blur(0px)' : isBehind ? 'blur(2px)' : 'blur(0px)',
                pointerEvents: isCurrent ? 'auto' : 'none',
              }}
              exit={{ opacity: 0, y: -50, scale: 0.7, filter: 'blur(0px)' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="absolute w-full h-full cursor-grab active:cursor-grabbing"
            >
              {isBehind && (
                <div
                  className="absolute inset-0 bg-black bg-opacity-25 rounded-lg"
                  style={{ zIndex: 10 - i + 1, backdropFilter: 'blur(5px)' }}
                ></div>
              )}
              <MessageCard message={message} />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default CascadingStack; 