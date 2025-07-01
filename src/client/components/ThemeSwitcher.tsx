import { useTheme } from '../context/ThemeContext';
import { Moon, Sun } from 'lucide-react';

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      className='p-2 rounded-full bg-gray-200 dark:bg-gray-800'
    >
      {theme === 'light' ? <Moon className='h-5 w-5' /> : <Sun className='h-5 w-5' />}
    </button>
  );
}
