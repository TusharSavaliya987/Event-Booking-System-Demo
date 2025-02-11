import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { addEvent, updateEvent } from '../store/slices/eventsSlice';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import * as Form from '@radix-ui/react-form';
import * as Select from '@radix-ui/react-select';
import { Bold, Italic, List, ListOrdered } from 'lucide-react';

const EventForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const existingEvent = useSelector((state: RootState) =>
    state.events.events.find(e => e.id === id)
  );

  const [title, setTitle] = useState(existingEvent?.title || '');
  const [date, setDate] = useState(existingEvent?.date?.split('T')[0] || '');
  const [time, setTime] = useState(existingEvent?.date?.split('T')[1]?.slice(0, 5) || '');
  const [location, setLocation] = useState(existingEvent?.location || '');
  const [category, setCategory] = useState(existingEvent?.category || 'conference');
  const [imageUrl, setImageUrl] = useState(existingEvent?.imageUrl || '');

  const editor = useEditor({
    extensions: [StarterKit],
    content: existingEvent?.description || '',
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert max-w-none focus:outline-none min-h-[200px]',
      },
    },
  });        

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    new Promise((resolve) => {
      const eventData = {
        id: existingEvent?.id || crypto.randomUUID(),
        title,
        description: editor?.getHTML() || '',
        date: `${date}T${time}:00.000Z`,
        location,
        category,
        imageUrl,
        createdAt: existingEvent?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      if (existingEvent) {
        dispatch(updateEvent(eventData));
      } else {
        dispatch(addEvent(eventData));
      }
      resolve(null);
    }).then(() => {
      navigate('/');
    });
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        {existingEvent ? 'Edit Event' : 'Create New Event'}
      </h1>

      <Form.Root className="space-y-6" onSubmit={handleSubmit}>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 space-y-6">
          <Form.Field name="title">
            <div className="flex items-baseline justify-between">
              <Form.Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Event Title
              </Form.Label>
              <Form.Message className="text-sm text-red-500" match="valueMissing">
                Please enter a title
              </Form.Message>
            </div>
            <Form.Control asChild>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </Form.Control>
          </Form.Field>

          <Form.Field name="imageUrl">
            <div className="flex items-baseline justify-between">
              <Form.Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Event Image URL
              </Form.Label>
              <Form.Message className="text-sm text-red-500" match="valueMissing">
                Please enter an image URL
              </Form.Message>
            </div>
            <Form.Control asChild>
              <input
                type="url"
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                required
              />
            </Form.Control>
            {imageUrl && (
              <div className="mt-2">
                <img
                  src={imageUrl}
                  alt="Event preview"
                  className="w-full h-48 object-cover rounded-md"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&auto=format&fit=crop';
                  }}
                />
              </div>
            )}
          </Form.Field>

          <div className="grid grid-cols-2 gap-6">
            <Form.Field name="date">
              <div className="flex items-baseline justify-between">
                <Form.Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Date
                </Form.Label>
                <Form.Message className="text-sm text-red-500" match="valueMissing">
                  Please select a date
                </Form.Message>
              </div>
              <Form.Control asChild>
                <input
                  type="date"
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </Form.Control>
            </Form.Field>

            <Form.Field name="time">
              <div className="flex items-baseline justify-between">
                <Form.Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Time
                </Form.Label>
                <Form.Message className="text-sm text-red-500" match="valueMissing">
                  Please select a time
                </Form.Message>
              </div>
              <Form.Control asChild>
                <input
                  type="time"
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                />
              </Form.Control>
            </Form.Field>
          </div>

          <Form.Field name="location">
            <div className="flex items-baseline justify-between">
              <Form.Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Location
              </Form.Label>
              <Form.Message className="text-sm text-red-500" match="valueMissing">
                Please enter a location
              </Form.Message>
            </div>
            <Form.Control asChild>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </Form.Control>
          </Form.Field>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
            <Select.Root value={category} onValueChange={setCategory}>
              <Select.Trigger className="mt-1 inline-flex items-center justify-between px-3 py-2 w-full text-sm border dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                <Select.Value placeholder="Select category" />
              </Select.Trigger>
              <Select.Portal>
                <Select.Content className="bg-white dark:bg-gray-700 rounded-md shadow-lg">
                  <Select.Viewport className="p-1">
                    <Select.Item value="conference" className="px-3 py-2 outline-none cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-900 dark:text-white">
                      <Select.ItemText>Conference</Select.ItemText>
                    </Select.Item>
                    <Select.Item value="workshop" className="px-3 py-2 outline-none cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-900 dark:text-white">
                      <Select.ItemText>Workshop</Select.ItemText>
                    </Select.Item>
                    <Select.Item value="meetup" className="px-3 py-2 outline-none cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-900 dark:text-white">
                      <Select.ItemText>Meetup</Select.ItemText>
                    </Select.Item>
                  </Select.Viewport>
                </Select.Content>
              </Select.Portal>
            </Select.Root>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
            <div className="mt-1 border dark:border-gray-600 rounded-md">
              <div className="border-b dark:border-gray-600 px-3 py-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleBold().run()}
                  className={`p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 ${
                    editor?.isActive('bold') ? 'bg-gray-100 dark:bg-gray-700' : ''
                  }`}
                >
                  <Bold className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleItalic().run()}
                  className={`p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 ${
                    editor?.isActive('italic') ? 'bg-gray-100 dark:bg-gray-700' : ''
                  }`}
                >
                  <Italic className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleBulletList().run()}
                  className={`p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 ${
                    editor?.isActive('bulletList') ? 'bg-gray-100 dark:bg-gray-700' : ''
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                  className={`p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 ${
                    editor?.isActive('orderedList') ? 'bg-gray-100 dark:bg-gray-700' : ''
                  }`}
                >
                  <ListOrdered className="w-4 h-4" />
                </button>
              </div>
              <div className="p-4 bg-white dark:bg-gray-700">
                <EditorContent editor={editor} />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
            >
              Cancel
            </button>
            <Form.Submit asChild>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                {existingEvent ? 'Update Event' : 'Create Event'}
              </button>
            </Form.Submit>
          </div>
        </div>
      </Form.Root>
    </div>
  );
};

export default EventForm;