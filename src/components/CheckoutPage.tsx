import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart } from '../store/slices/cartSlice';
import { Link } from 'react-router-dom';
import { RootState } from '../store/store';
import { incrementCheckoutCount } from '../store/slices/eventsSlice';

const CheckoutPage = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const dispatch = useDispatch();
  const { items: cartItems } = useSelector((state: RootState) => state.cart);

  // Initialize state with all required fields
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    address: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    cartItems.forEach(item => {
      dispatch(incrementCheckoutCount({
        eventId: item.event.id,
        quantity: item.quantity
      }));
      console.log('Dispatched for:', item.event.id, 'Qty:', item.quantity, 'Current count:', item.event.checkoutCount);
    });

    dispatch(clearCart());
    setIsSubmitted(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {!isSubmitted ? (
        <>
          <h1 className="text-3xl font-bold mb-8">Checkout</h1>
          <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg bg-white text-gray-900 placeholder-gray-500
                           dark:bg-gray-700 dark:text-white dark:placeholder-gray-300 dark:border-gray-600"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg bg-white text-gray-900 placeholder-gray-500
                           dark:bg-gray-700 dark:text-white dark:placeholder-gray-300 dark:border-gray-600"
                required
              />
              <input
                type="text"
                placeholder="Address"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg bg-white text-gray-900 placeholder-gray-500
                           dark:bg-gray-700 dark:text-white dark:placeholder-gray-300 dark:border-gray-600"
                required
              />
            </div>
            <button
              type="submit"
              className="mt-8 w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Complete Purchase
            </button>
          </form>
          
        </>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Thank you for your order!</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            We are sending a confirmation email to {formData.email}
          </p>
          <Link
            to="/"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Events
          </Link>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage; 