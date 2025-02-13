import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User as UserIcon, XCircle } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { LoginFormValues, RegisterFormValues, User } from '../types/auth';
import { getUsers, setUserSession, saveUser } from '../utils/auth';
import { useTheme } from '../context/ThemeContext';
import { FormikTouched, FormikErrors } from 'formik';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface AuthFormProps {
  type: 'login' | 'register';
}

const AuthForm = ({ type }: AuthFormProps) => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  const validationSchema = Yup.object({
    ...(type === 'register' && { 
      name: Yup.string().required('Full name is required') 
    }),
    email: Yup.string()
      .email('Please enter a valid email address')
      .required('Email address is required'),
    password: Yup.string()
      .min(
        type === 'login' ? 1 : 6, 
        type === 'login' ? 'Password is required' : 'Password must be at least 6 characters'
      )
      .required('Password is required'),
  });

  const formik = useFormik<LoginFormValues | RegisterFormValues>({
    initialValues: {
      ...(type === 'register' && { name: '' }),
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      const users = getUsers();
      
      if (type === 'register') {
        const newUser: User = {
          id: uuidv4(),
          name: (values as RegisterFormValues).name,
          email: values.email,
          password: values.password
        };
        saveUser(newUser);
        resetForm();
        toast.success('Account created successfully!', {
          position: "top-center",
          autoClose: 3000,
          theme: isDarkMode ? 'dark' : 'light',
        });
        setTimeout(() => {
          navigate('/login');
        }, 1000);
      } else {
        const user = users.find(u => 
          u.email === values.email && 
          u.password === values.password
        );

        if (user) {
          setUserSession(user);
          resetForm();
          toast.success(`Welcome back, ${user.name}!`, {
            position: "top-center",
            autoClose: 3000,
            theme: isDarkMode ? 'dark' : 'light',
          });
          setTimeout(() => {
            window.location.href = '/';
          }, 1000);
        } else {
          if (type === 'login') {
            toast.error('Invalid email or password. Please try again.', {
              position: "top-center",
              autoClose: 3000,
              theme: isDarkMode ? 'dark' : 'light',
            });
          }
          formik.setSubmitting(false);
        }
      }
    },
  });

  return (
    <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar
        theme={isDarkMode ? 'dark' : 'light'}
      />
      <div className="container mx-auto p-4">
        <div className={`flex flex-col md:flex-row rounded-2xl shadow-xl overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          {/* Left Side - Illustration */}
          <div className="md:w-1/2 bg-gradient-to-br from-indigo-600 to-blue-500 p-12 hidden md:flex flex-col items-center justify-center">
            <div className="mb-8 flex items-center justify-center rounded-full border-4 border-white/20 p-2">
              <img 
                src="https://thumbs.dreamstime.com/b/valentines-day-event-planning-service-logo-minimalist-style-abstract-minimalist-style-modern-flat-illustration-white-351756020.jpg" 
                alt="Auth Illustration"
                className="rounded-full w-48 h-48 object-cover shadow-xl border-4 border-white/30"
              />
            </div>
            <h2 className="text-4xl font-bold text-white mb-4 text-center">
              {type === 'login' ? 'Welcome Back!' : 'Join Our Community'}
            </h2>
            <p className="text-lg text-indigo-100 text-center">
              {type === 'login' 
                ? 'Sign in to access your account'
                : 'Create your account to get started'}
            </p>
          </div>

          {/* Right Side - Form */}
          <div className="md:w-1/2 p-12">
            <h2 className={`text-4xl font-bold mb-8 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {type === 'login' ? 'Sign In' : 'Create Account'}
            </h2>

            {type === 'login' && formik.status && (
              <div className="mb-6 p-4 border border-red-300 bg-red-50 rounded-lg flex items-center">
                <XCircle className="h-5 w-5 text-red-500 mr-2" />
                <span className="text-red-600">{formik.status}</span>
              </div>
            )}

            <form onSubmit={formik.handleSubmit} className="space-y-6">
              {type === 'register' && (
                <div className="relative">
                  <UserIcon className={`h-5 w-5 absolute top-3.5 left-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <input
                    type="text"
                    placeholder="Full Name"
                    {...formik.getFieldProps('name')}
                    className={`pl-10 w-full rounded-lg py-3 px-4 border-2 focus:ring-2 focus:ring-indigo-500 ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                  />
                  {(type === 'register' && (formik.touched as FormikTouched<RegisterFormValues>).name && (formik.errors as FormikErrors<RegisterFormValues>).name) && (
                    <div className="text-red-500 text-sm mt-1 flex items-center">
                      <XCircle className="h-4 w-4 mr-1" />
                      {(formik.errors as FormikErrors<RegisterFormValues>).name}
                    </div>
                  )}
                </div>
              )}

              <div className="relative">
                <Mail className={`h-5 w-5 absolute top-3.5 left-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                <input
                  type="email"
                  placeholder="Email Address"
                  {...formik.getFieldProps('email')}
                  className={`pl-10 w-full rounded-lg py-3 px-4 border-2 focus:ring-2 focus:ring-indigo-500 ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                />
                {formik.touched.email && formik.errors.email && (
                  <div className="text-red-500 text-sm mt-1 flex items-center">
                    <XCircle className="h-4 w-4 mr-1" />
                    {formik.errors.email}
                  </div>
                )}
              </div>

              <div className="relative">
                <Lock className={`h-5 w-5 absolute top-3.5 left-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                <input
                  type="password"
                  placeholder="Password"
                  {...formik.getFieldProps('password')}
                  className={`pl-10 w-full rounded-lg py-3 px-4 border-2 focus:ring-2 focus:ring-indigo-500 ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                />
                {formik.touched.password && formik.errors.password && (
                  <div className="text-red-500 text-sm mt-1 flex items-center">
                    <XCircle className="h-4 w-4 mr-1" />
                    {formik.errors.password}
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 px-6 bg-gradient-to-r from-indigo-600 to-blue-500 text-white rounded-lg font-semibold
                         hover:from-indigo-700 hover:to-blue-600 transition-all duration-300 shadow-lg"
              >
                {type === 'login' ? 'Sign In' : 'Create Account'}
              </button>

              <div className={`text-center text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {type === 'login' ? "Don't have an account?" : "Already have an account?"}{' '}
                <Link 
                  to={type === 'login' ? '/register' : '/login'} 
                  className="font-semibold text-indigo-600 hover:text-indigo-500"
                >
                  {type === 'login' ? 'Register here' : 'Sign in here'}
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;