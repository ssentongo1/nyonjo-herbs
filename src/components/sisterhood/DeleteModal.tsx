'use client';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  postUsername: string;
}

export default function DeleteModal({ isOpen, onClose, onConfirm, postUsername }: DeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl p-6 max-w-md w-full">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Post</h3>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete this post by <span className="font-semibold">{postUsername}</span>? This action cannot be undone.
        </p>
        
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-3 bg-rose-600 text-white font-medium rounded-lg hover:bg-rose-700 transition-colors"
          >
            Delete Post
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}