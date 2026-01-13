'use client';

interface CreatePostHeaderProps {
  title: string;
}

export default function CreatePostHeader({ title }: CreatePostHeaderProps) {
  const toggleForm = () => {
    const form = document.getElementById('create-post-form');
    if (window.innerWidth < 1024) {
      form?.classList.toggle('hidden');
    }
  };

  return (
    <div className="flex items-center justify-between mb-4">
      <h2 
        className="text-lg md:text-xl font-bold text-gray-900 cursor-pointer"
        onClick={toggleForm}
      >
        {title}
      </h2>
      <button
        onClick={toggleForm}
        className="lg:hidden text-rose-600 hover:text-rose-700 bg-rose-50 w-10 h-10 rounded-full flex items-center justify-center"
      >
        <span className="text-xl">+</span>
      </button>
    </div>
  );
}