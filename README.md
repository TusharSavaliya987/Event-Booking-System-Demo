# Event Booking System 🎟️

A modern event management web application built with **React, TypeScript, and Radix UI**, featuring full **CRUD** operations, **rich text editing**, and **persistent local storage**.



## 🚀 Features

### 🎯 Core Functionality
- 🗓️ **Full CRUD Operations** – Create, Read, Update, Delete events.
- 📝 **Rich text editor** (Quill Editor) for event descriptions.
- 🔍 **Filter events** by category (Conference/Workshop/Meetup).
- ⏳ **Toggle between upcoming/past events**.
- 💾 **Persistent local storage** for event data.
- 🌗 **Dark/Light theme toggle**.

### 🛠️ Technical Highlights
- ⚡ **React + Vite** for fast development.
- 🦾 **TypeScript** for type safety.
- 🧰 **Redux Toolkit** for state management.
- 🎨 **Radix UI** for accessible components.
- 📱 **Fully responsive design**.
- 🚀 **Optimized performance** with React Router.

## 🏗️ Tech Stack

### **Frontend:**
- React + TypeScript
- Redux Toolkit + React-Redux
- React Router 
- date-fns (for date formatting)
- Quill (rich text editor)

### **UI Components:**
- Radix UI Primitives
- Lucide React icons
- Tailwind CSS (Dark mode support)

### **Build Tools:**
- Vite
- npm

## 📂 Project Structure

```plaintext
src/
├── components/
│   ├── EventDetails.tsx
│   ├── EventForm.tsx
│   ├── EventList.tsx
│   ├── LoadingSkeleton.tsx
│   ├── Navigation.tsx
├── context/
│   └── ThemeContext.tsx
├── store/
│   ├── slices/
│   │   └── eventsSlice.ts
│   └── store.ts
├── types/
│   └── event.ts
├── App.tsx
├── main.tsx
```

## 🔑 Key Components

### 📌 **State Management (Redux Toolkit)**
Redux slice for managing event data:

```typescript
interface EventsState {
  events: Event[];
  loading: boolean;
  error: string | null;
}
```

### 🎨 **UI Components (Radix UI)**
- **Forms:** `Form.Root`, `Form.Field`, `Form.Control`
- **Select Menus:** `Select.Root`, `Select.Trigger`, `Select.Content`
- **Switch Controls:** `Switch.Root`, `Switch.Thumb`
- **Navigation:** `NavigationMenu`, `NavigationMenuList`

### ✍️ **Rich Text Editor**
TipTap editor with formatting controls:

```tsx
const editor = useEditor({
  extensions: [StarterKit],
  content: '',
  editorProps: {
    attributes: {
      class: 'prose dark:prose-invert focus:outline-none min-h-[200px]',
    },
  },
});
```

## 🔍 Features in Depth

### 📆 **Event Management**
- **Create Events:** Title, Date/Time, Location, Category, Image URL, Description.
- **Edit Events:** Preserve creation date, track last updated timestamp.
- **Delete Events:** Confirmation dialog, immediate state update.

### 🎯 **Filtering System**
Filter upcoming/past events and categories:

```typescript
const filteredEvents = events.filter(event => {
  const eventDate = new Date(event.date);
  const isPastEvent = eventDate < new Date();
  return showPastEvents === isPastEvent &&
    (selectedCategory === 'all' || event.category === selectedCategory);
});
```

### 🌗 **Dark Mode Support**
Persist theme selection using Context API:

```typescript
const { theme, toggleTheme } = useTheme();
// Theme persists in localStorage
```

---

### 📸 Screenshot
Make sure to add the project screenshot to the repository and update the image path accordingly.

![Event Booking System Screenshot](./src/Image/screenshot.png)

---

### 📌 How to Run

   ```
1. **Install dependencies:**
   ```sh
   npm install
   ```
2. **Start the development server:**
   ```sh
   npm run dev
   ```
3. **Open in browser:**
   ```
   http://localhost:5173
   ```

---

## 💡 Future Enhancements
- ✅ Authentication (Login/Register)
- 📅 Calendar view for events

---


