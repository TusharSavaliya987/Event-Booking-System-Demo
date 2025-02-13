import { Theme } from '@radix-ui/themes';
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import Navigation from './components/Navigation';
import EventList from './components/EventList';
import EventDetails from './components/EventDetails';
import EventForm from './components/EventForm';
import { ThemeProvider } from './context/ThemeContext';
import '@radix-ui/themes/styles.css';
import LoadingSkeleton from './components/LoadingSkeleton';
import { useSelector } from 'react-redux';
import { RootState } from './store/store';

import ProtectedRoute from './components/ProtectedRoute';
import AuthForm from './components/AuthForm';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const isLoading = useSelector((state: RootState) => state.events.loading);

  return (
    <ThemeProvider>
      <Theme accentColor="blue" radius="medium">
        <Router>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            <Navigation />
            <main className="container mx-auto px-4 py-8">
              {isLoading ? (
                <LoadingSkeleton />
              ) : (
                <Routes>
                  <Route path="/login" element={<AuthForm type="login" />} />
                  <Route path="/register" element={<AuthForm type="register" />} />
                  <Route element={<ProtectedRoute />}>
                    <Route path="/" element={<EventList />} />
                    <Route path="/event/:id" element={<EventDetails />} />
                    <Route path="/create" element={<EventForm />} />
                    <Route path="/edit/:id" element={<EventForm />} />
                  </Route>
                </Routes>
              )}
            </main>
          </div>
        </Router>
      </Theme>
    </ThemeProvider>
  );
}

export default App;