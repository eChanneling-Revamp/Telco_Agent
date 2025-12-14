'use client';

import React, { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  children,
  size = 'md' 
}) => {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop - Click to close */}
      <div 
        className="absolute inset-0 bg-black/50 transition-all duration-200"
        onClick={onClose}
      />
      
      {/* Modal content with animation */}
      <div 
        className={`relative bg-white rounded-2xl shadow-2xl w-full ${sizeClasses[size]} max-h-[90vh] overflow-hidden transform transition-all duration-200 animate-modal-in`}
      >
        {/* Modal header - Sticky at top */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Modal body - Scrollable content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};







































// 'use client';

// import React, { useEffect } from 'react';

// interface ModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   title: string;
//   children: React.ReactNode;
//   size?: 'sm' | 'md' | 'lg';
// }

// export const Modal: React.FC<ModalProps> = ({ 
//   isOpen, 
//   onClose, 
//   title, 
//   children,
//   size = 'md' 
// }) => {
//   useEffect(() => {
//     if (isOpen) {
//       document.body.style.overflow = 'hidden';
//     } else {
//       document.body.style.overflow = 'unset';
//     }
//     return () => {
//       document.body.style.overflow = 'unset';
//     };
//   }, [isOpen]);

//   if (!isOpen) return null;

//   const sizeClasses = {
//     sm: 'max-w-md',
//     md: 'max-w-2xl',
//     lg: 'max-w-4xl'
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center">
//       <div 
//         className="absolute inset-0 bg-black bg-opacity-50"
//         onClick={onClose}
//       />
//       <div className={`relative bg-white rounded-2xl shadow-xl w-full ${sizeClasses[size]} mx-4 max-h-[90vh] overflow-y-auto`}>
//         <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
//           <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
//           <button
//             onClick={onClose}
//             className="text-gray-400 hover:text-gray-600 transition-colors"
//           >
//             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//             </svg>
//           </button>
//         </div>
//         <div className="p-6">
//           {children}
//         </div>
//       </div>
//     </div>
//   );
// };