import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { removeFromCart, updateQuantity } from '../store/slices/cartSlice';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Trash } from 'lucide-react';


const CartPage = () => {
  const { items } = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
      
      {items.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 text-lg">Your cart is empty</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {items.map(item => (
              <div key={item.id} className="flex items-center bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                <img
                  src={item.event.imageUrl}
                  alt={item.event.title}
                  className="w-20 h-20 object-cover rounded-md"
                />
                <div className="ml-4 flex-1">
                  <h3 className="font-semibold">{item.event.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {format(new Date(item.event.date), 'PPP p')} • {item.event.location}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => dispatch(updateQuantity({
                        id: item.id,
                        quantity: Math.max(1, item.quantity - 1)
                      }))}
                      className="px-3 py-1 rounded bg-gray-100 dark:bg-gray-700"
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => dispatch(updateQuantity({
                        id: item.id,
                        quantity: item.quantity + 1
                      }))}
                      className="px-3 py-1 rounded bg-gray-100 dark:bg-gray-700"
                    >
                      +
                    </button>
                  </div>
                  <AlertDialog.Root>
                    <AlertDialog.Trigger asChild>
                      <button className="text-red-500 hover:text-red-700">
                        <Trash className="w-5 h-5" />
                      </button>
                    </AlertDialog.Trigger>
                    <AlertDialog.Portal>
                      <AlertDialog.Overlay className="fixed inset-0 bg-black/50" />
                      <AlertDialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 p-6 rounded-lg">
                        <AlertDialog.Title className="text-lg font-medium mb-4">
                          Remove item?
                        </AlertDialog.Title>
                        <div className="flex justify-end gap-4">
                          <AlertDialog.Cancel className="px-4 py-2 text-gray-500">
                            Cancel
                          </AlertDialog.Cancel>
                          <AlertDialog.Action asChild>
                            <button
                              onClick={() => dispatch(removeFromCart(item.id))}
                              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                            >
                              Remove
                            </button>
                          </AlertDialog.Action>
                        </div>
                      </AlertDialog.Content>
                    </AlertDialog.Portal>
                  </AlertDialog.Root>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 flex justify-end">
            <Link 
              to="/checkout"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Proceed to Checkout
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage; 