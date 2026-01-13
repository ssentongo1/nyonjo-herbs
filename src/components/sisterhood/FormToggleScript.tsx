'use client';

import { useEffect } from 'react';

export default function FormToggleScript() {
  useEffect(() => {
    const toggleBtn = document.getElementById('toggle-form');
    const form = document.getElementById('create-post-form');
    
    if (toggleBtn && form) {
      toggleBtn.addEventListener('click', function() {
        form.classList.toggle('hidden');
      });
    }
  }, []);

  return null;
}