import { NavigationMenu, NavigationMenuList, NavigationMenuItem } from '@radix-ui/react-navigation-menu';

import { Link } from 'react-router-dom';
import { Calendar, Sun, Moon } from 'lucide-react';
import * as Switch from '@radix-ui/react-switch';
import { useTheme } from '../context/ThemeContext';
import { clearUserSession, getUserSession } from '../utils/auth';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { CircleUser } from 'lucide-react';
import { ShoppingCart } from 'lucide-react';
import { RootState } from '../store/store';
import { useSelector } from 'react-redux';

const Navigation = () => {
  const { theme, toggleTheme } = useTheme();
  const user = getUserSession();

  const cartItemsCount = useSelector((state: RootState) => 
    state.cart.items.reduce((sum, item) => sum + item.quantity, 0)
  );

  const handleLogout = () => {
    clearUserSession();
    window.location.href = '/login';
  };

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

            {user ? (
              <>
                <NavigationMenuItem>
                  <Link to="/" className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                    All Events
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/create" className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                    Create Event
                  </Link>
                </NavigationMenuItem>
              </>
            ) : null}

            <NavigationMenuItem className="ml-auto flex items-center gap-4">
              {user && (
                <Link 
                  to="/cart" 
                  className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all relative group"
                >
                  <div className="relative">
                    <ShoppingCart className="w-6 h-6 text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all duration-300 hover:scale-110" />
                    {cartItemsCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium shadow-sm animate-[bounce_0.5s_ease-in-out_1]">
                        {cartItemsCount}
                      </span>
                    )}
                  </div>
                  <span className="sr-only">Cart</span>
                </Link>
              )}

              <div className="flex items-center gap-2">
                <Sun className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                <Switch.Root
                  checked={theme === 'dark'}
                  onCheckedChange={toggleTheme}
                  className="w-[42px] h-[25px] bg-gray-200 dark:bg-gray-700 rounded-full relative data-[state=checked]:bg-blue-600 outline-none cursor-default"
                >
                  <Switch.Thumb className="block w-[21px] h-[21px] bg-white rounded-full transition-transform duration-100 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[19px]" />
                </Switch.Root>
                <Moon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </div>

              {user ? (
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-full">
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      {user?.name ? (
                        <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                          {user.name.charAt(0)}
                        </span>
                      ) : (
                        <CircleUser className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      )}
                    </div>
                  </DropdownMenu.Trigger>

                  <DropdownMenu.Portal>
                    <DropdownMenu.Content
                      align="end"
                      className="bg-white dark:bg-gray-700 rounded-md shadow-lg p-2 min-w-[200px]"
                    >
                      <div className="px-4 py-3 border-b dark:border-gray-600">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {user?.name || 'User'}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {user?.email}
                        </p>
                      </div>
                      
                      <DropdownMenu.Item
                        onClick={handleLogout}
                        className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md cursor-pointer outline-none"
                      >
                        Logout
                      </DropdownMenu.Item>
                    </DropdownMenu.Content>
                  </DropdownMenu.Portal>
                </DropdownMenu.Root>
              ) : (
                <div className="flex gap-4">
                  <Link to="/login" className="px-4 py-2 text-blue-600 dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                    Login
                  </Link>
                  <Link to="/register" className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                    Register
                  </Link>
                </div>
              )}
            </NavigationMenuItem>
          </NavigationMenuList> 
        </NavigationMenu>
      </div>
    </header>
  );
};

export default Navigation;