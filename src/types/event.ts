export interface AppEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  imageUrl: string;
  category: string;
  description: string;
  slots: number;
  price: number;
  totalSlots: number;
  createdAt: string;
  updatedAt: string;
  checkoutCount?: number;
  // Add any other properties used in your components
}
