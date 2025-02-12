import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootState } from '../store/store';
import { Calendar, MapPin, Clock, ChevronDown } from 'lucide-react';
import * as Select from '@radix-ui/react-select';
import * as Switch from '@radix-ui/react-switch';
import { format } from 'date-fns';

// Category options for the select component
const CATEGORY_OPTIONS = [
  { value: 'all', label: 'All Categories' },
  { value: 'conference', label: 'Conference' },
  { value: 'workshop', label: 'Workshop' },
  { value: 'meetup', label: 'Meetup' }
];

// Reusable event info display items
const EventInfoItem = ({ icon: Icon, value }: { 
  icon: React.ComponentType<{ className?: string }>,
  value: React.ReactNode 
}) => (
  <div className="flex items-center gap-2">
    <Icon className="w-4 h-4" />
    <span>{value}</span>
  </div>
);

const EventList = () => {
  const [showPastEvents, setShowPastEvents] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(3);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: 'title' | 'date'; direction: 'asc' | 'desc' } | null>(null);
  const [locationFilter, setLocationFilter] = useState('all');
  const events = useSelector((state: RootState) => state.events.events);

  const filteredEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    const now = new Date();
    const isPastEvent = eventDate < now;

    if (showPastEvents !== isPastEvent) return false;
    if (selectedCategory !== 'all' && event.category !== selectedCategory) return false;
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = locationFilter === 'all' || event.location === locationFilter;
    
    return matchesSearch && matchesLocation;
  });

  const sortedEvents = [...filteredEvents].sort((a, b) => {
    if (!sortConfig) return 0;
    if (sortConfig.key === 'title') {
      return sortConfig.direction === 'asc' 
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title);
    }
    return sortConfig.direction === 'asc'
      ? new Date(a.date).getTime() - new Date(b.date).getTime()
      : new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEvents = sortedEvents.slice(indexOfFirstItem, indexOfLastItem);

  const locations = Array.from(new Set(events.map(event => event.location)));

  // Date formatting helper
  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      formattedDate: format(date, 'PPP'),
      formattedTime: format(date, 'p')
    };
  };

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
                  {CATEGORY_OPTIONS.map(({ value, label }) => (
                    <Select.Item 
                      key={value}
                      value={value}
                      className="px-3 py-2 outline-none cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md text-gray-900 dark:text-white"
                    >
                      <Select.ItemText>{label}</Select.ItemText>
                    </Select.Item>
                  ))}
                </Select.Viewport>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
        </div>

        <div className="flex-1">
          <input
            type="text"
            placeholder="Search events..."
            className="px-3 py-2 border border-gray-200 rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <Select.Root value={locationFilter} onValueChange={setLocationFilter}>
            <Select.Trigger className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 rounded-md">
              <span className="text-gray-700 dark:text-gray-300">Location :-</span>
              <Select.Value />
              <ChevronDown className="w-4 h-4" />
            </Select.Trigger>
            <Select.Portal>
              <Select.Content className="bg-white dark:bg-gray-700 rounded-md shadow-lg">
                <Select.Viewport className="p-1">
                  <Select.Item 
                    value="all"
                    className="px-3 py-2 outline-none cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md text-gray-900 dark:text-white"
                  >
                    <Select.ItemText>All Locations</Select.ItemText>
                  </Select.Item>
                  {locations.map((location) => (
                    <Select.Item 
                      key={location}
                      value={location}
                      className="px-3 py-2 outline-none cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md text-gray-900 dark:text-white"
                    >
                      <Select.ItemText>{location}</Select.ItemText>
                    </Select.Item>
                  ))}
                </Select.Viewport>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
        </div>

        <div className="flex items-center gap-2">
          <Select.Root
            value={sortConfig ? `${sortConfig.key}-${sortConfig.direction}` : ''}
            onValueChange={(value) => {
              const [key, direction] = value.split('-') as ['title' | 'date', 'asc' | 'desc'];
              setSortConfig({ key, direction });
            }}
          >
            <Select.Trigger className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 rounded-md">
              <Select.Value placeholder="Sort by" />
              <ChevronDown className="w-4 h-4" />
            </Select.Trigger>
            <Select.Portal>
              <Select.Content className="bg-white dark:bg-gray-700 rounded-md shadow-lg">
                <Select.Viewport className="p-1">
                  <Select.Item 
                    value="title-asc"
                    className="px-3 py-2 outline-none cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md text-gray-900 dark:text-white"
                  >
                    <Select.ItemText>Name (A-Z)</Select.ItemText>
                  </Select.Item>
                  <Select.Item 
                    value="title-desc"
                    className="px-3 py-2 outline-none cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md text-gray-900 dark:text-white"
                  >
                    <Select.ItemText>Name (Z-A)</Select.ItemText>
                  </Select.Item>
                  <Select.Item 
                    value="date-asc"
                    className="px-3 py-2 outline-none cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md text-gray-900 dark:text-white"
                  >
                    <Select.ItemText>Date (Oldest First)</Select.ItemText>
                  </Select.Item>
                  <Select.Item 
                    value="date-desc"
                    className="px-3 py-2 outline-none cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md text-gray-900 dark:text-white"
                  >
                    <Select.ItemText>Date (Newest First)</Select.ItemText>
                  </Select.Item>
                </Select.Viewport>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentEvents.map(event => {
          const { formattedDate, formattedTime } = formatEventDate(event.date);
          
          return (
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
                <div className="space-y-2">
                  <EventInfoItem icon={Calendar} value={formattedDate} />
                  <EventInfoItem icon={Clock} value={formattedTime} />
                  <EventInfoItem icon={MapPin} value={event.location} />
                </div>
                <div className="mt-4">
                  <span className="inline-block px-3 py-1 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                    {event.category}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {filteredEvents.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            {showPastEvents ? 'No past events found.' : 'No upcoming events found.'}
          </p>
        </div>
      )}

      {filteredEvents.length > itemsPerPage && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: Math.ceil(filteredEvents.length / itemsPerPage) }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={`px-3 py-1 rounded-md ${
                currentPage === index + 1 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventList;