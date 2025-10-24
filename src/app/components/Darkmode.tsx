import { useState, useEffect } from 'react';

export default function DarkModeToggle() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div>
      <label htmlFor="dark-mode-toggle" className="relative inline-block w-11 h-6 cursor-pointer">
        <input
          type="checkbox"
          id="dark-mode-toggle"
          className="peer sr-only"
          checked={darkMode}
          onChange={() => setDarkMode(!darkMode)}
        />
        <span className="absolute inset-0 bg-gray-200 rounded-full transition-colors duration-200 ease-in-out peer-checked:bg-blue-600"></span>
        <span className="absolute top-1/2 left-0.5 -translate-y-1/2 w-5 h-5 bg-white rounded-full shadow-xs transition-transform duration-200 ease-in-out peer-checked:translate-x-full"></span>
      </label>
      <label htmlFor="dark-mode-toggle" className="text-sm text-gray-500 ml-2">Dark mode</label>
    </div>
  );
}
