
import { NavigationMenu, NavigationMenuList, NavigationMenuItem } from '@radix-ui/react-navigation-menu';

import { Link } from 'react-router-dom';
import { Calendar, Sun, Moon } from 'lucide-react';
import * as Switch from '@radix-ui/react-switch';
import { useTheme } from '../context/ThemeContext';

const Navigation = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm transition-colors duration-200">
      <div className="container mx-auto px-4">
        <NavigationMenu>
          <NavigationMenuList className="flex items-center h-16">
            <NavigationMenuItem className="flex items-center mr-8">
              <Link to="/" className="flex items-center text-xl font-semibold text-blue-600 dark:text-blue-400">
                <Calendar className="w-6 h-6 mr-2" />
                Event Booking
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/" className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                Events
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/create" className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                Create Event
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem className="ml-auto flex items-center gap-2">
              <Sun className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              <Switch.Root
                checked={theme === 'dark'}
                onCheckedChange={toggleTheme}
                className="w-[42px] h-[25px] bg-gray-200 dark:bg-gray-700 rounded-full relative data-[state=checked]:bg-blue-600 outline-none cursor-default"
              >
                <Switch.Thumb className="block w-[21px] h-[21px] bg-white rounded-full transition-transform duration-100 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[19px]" />
              </Switch.Root>
              <Moon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  );
};

export default Navigation;