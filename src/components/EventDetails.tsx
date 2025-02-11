import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { RootState } from '../store/store';
import { Calendar, MapPin, Clock, Edit, Trash } from 'lucide-react';
import { format } from 'date-fns';
import { useDispatch } from 'react-redux';
import { deleteEvent } from '../store/slices/eventsSlice';
import * as AlertDialog from '@radix-ui/react-alert-dialog';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const event = useSelector((state: RootState) =>
    state.events.events.find(e => e.id === id)
  );

  if (!event) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400 text-lg">Event not found.</p>
      </div>
    );
  }

  const handleDelete = () => {
    new Promise((resolve) => {
      dispatch(deleteEvent(event.id));
      resolve(null);
    }).then(() => {
      navigate('/');
    });
  };

  return (
    <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
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
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{event.title}</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(`/edit/${event.id}`)}
              className="flex items-center gap-2 px-4 py-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-md transition-colors"
            >
              <Edit className="w-4 h-4" />
              Edit
            </button>
            <AlertDialog.Root>
              <AlertDialog.Trigger asChild>
                <button className="flex items-center gap-2 px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-md transition-colors">
                  <Trash className="w-4 h-4" />
                  Delete
                </button>
              </AlertDialog.Trigger>
              <AlertDialog.Portal>
                <AlertDialog.Overlay className="fixed inset-0 bg-black/50" />
                <AlertDialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-lg p-6 w-[90vw] max-w-md">
                  <AlertDialog.Title className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                    Delete Event
                  </AlertDialog.Title>
                  <AlertDialog.Description className="text-gray-600 dark:text-gray-400 mb-6">
                    Are you sure you want to delete this event? This action cannot be undone.
                  </AlertDialog.Description>
                  <div className="flex justify-end gap-4">
                    <AlertDialog.Cancel asChild>
                      <button className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors">
                        Cancel
                      </button>
                    </AlertDialog.Cancel>
                    <AlertDialog.Action asChild>
                      <button
                        onClick={handleDelete}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                      >
                        Delete
                      </button>
                    </AlertDialog.Action>
                  </div>
                </AlertDialog.Content>
              </AlertDialog.Portal>
            </AlertDialog.Root>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <Calendar className="w-5 h-5" />
            <span>{format(new Date(event.date), 'PPP')}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <Clock className="w-5 h-5" />
            <span>{format(new Date(event.date), 'p')}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <MapPin className="w-5 h-5" />
            <span>{event.location}</span>
          </div>
          <div className="mt-2">
            <span className="inline-block px-3 py-1 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 rounded-full">
              {event.category}
            </span>
          </div>
        </div>

        <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: event.description }} />
      </div>
    </div>
  );
};

export default EventDetails;