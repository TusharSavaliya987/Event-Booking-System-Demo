import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootState } from '../store/store';
import { Calendar, MapPin, Clock } from 'lucide-react';
import * as Select from '@radix-ui/react-select';
import * as Switch from '@radix-ui/react-switch';
import { format } from 'date-fns';

const EventList = () => {
  const [showPastEvents, setShowPastEvents] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const events = useSelector((state: RootState) => state.events.events);

  const filteredEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    const now = new Date();
    const isPastEvent = eventDate < now;

    if (showPastEvents !== isPastEvent) return false;
    if (selectedCategory !== 'all' && event.category !== selectedCategory) return false;

    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Events</h1>
        <Link
          to="/create"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Create Event
        </Link>
      </div>

      <div className="flex items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
        <div className="flex items-center gap-2">
          <label htmlFor="past-events" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Show Past Events
          </label>
          <Switch.Root
            id="past-events"
            checked={showPastEvents}
            onCheckedChange={setShowPastEvents}
            className="w-[42px] h-[25px] bg-gray-200 dark:bg-gray-700 rounded-full relative data-[state=checked]:bg-blue-600 outline-none cursor-default"
          >
            <Switch.Thumb className="block w-[21px] h-[21px] bg-white rounded-full transition-transform duration-100 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[19px]" />
          </Switch.Root>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="category" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Category
          </label>
          <Select.Root value={selectedCategory} onValueChange={setSelectedCategory}>
            <Select.Trigger className="inline-flex items-center justify-between px-3 py-2 text-sm border dark:border-gray-600 rounded-md w-40 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
              <Select.Value placeholder="Select category" />
            </Select.Trigger>
            <Select.Portal>
              <Select.Content className="bg-white dark:bg-gray-700 rounded-md shadow-lg">
                <Select.Viewport className="p-1">
                  <Select.Item value="all" className="px-3 py-2 outline-none cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md text-gray-900 dark:text-white">
                    <Select.ItemText>All Categories</Select.ItemText>
                  </Select.Item>
                  <Select.Item value="conference" className="px-3 py-2 outline-none cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md text-gray-900 dark:text-white">
                    <Select.ItemText>Conference</Select.ItemText>
                  </Select.Item>
                  <Select.Item value="workshop" className="px-3 py-2 outline-none cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md text-gray-900 dark:text-white">
                    <Select.ItemText>Workshop</Select.ItemText>
                  </Select.Item>
                  <Select.Item value="meetup" className="px-3 py-2 outline-none cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md text-gray-900 dark:text-white">
                    <Select.ItemText>Meetup</Select.ItemText>
                  </Select.Item>
                </Select.Viewport>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map(event => (
          <Link
            key={event.id}
            to={`/event/${event.id}`}
            className="block bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
          >
            <div className="aspect-video w-full">
              <img
                src={event.imageUrl || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&auto=format&fit=crop'}
                alt={event.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&auto=format&fit=crop';
                }}
              />
            </div>
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{event.title}</h2>
              <div className="space-y-2 text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{format(new Date(event.date), 'PPP')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{format(new Date(event.date), 'p')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{event.location}</span>
                </div>
              </div>
              <div className="mt-4">
                <span className="inline-block px-3 py-1 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                  {event.category}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            {showPastEvents ? 'No past events found.' : 'No upcoming events found.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default EventList;