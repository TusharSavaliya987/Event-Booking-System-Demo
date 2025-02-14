import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppEvent } from "../../types/event";
import { createAction } from "@reduxjs/toolkit";

interface EventsState {
  events: AppEvent[];
  loading: boolean;
  error: string | null;
  // Add pagination metadata if needed
}

const initialState: EventsState = {
  events: JSON.parse(localStorage.getItem("events") || "[]").map(
    (event: AppEvent) => ({
      ...event,
      checkoutCount: event.checkoutCount || 0,
    })
  ),
  loading: true,
  error: null,
};

// Create action first
export const updateEventSlots = createAction<{
  eventId: string;
  quantity: number;
}>("events/updateSlots");

export const incrementCheckoutCount = createAction<{
  eventId: string;
  quantity: number;
}>("events/incrementCheckoutCount");

const eventsSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    addEvent: (state, action: PayloadAction<AppEvent>) => {
      state.events.push(action.payload);
      localStorage.setItem("events", JSON.stringify(state.events));
    },
    updateEvent: (state, action: PayloadAction<AppEvent>) => {
      const index = state.events.findIndex(
        (event) => event.id === action.payload.id
      );
      if (index !== -1) {
        state.events[index] = action.payload;
        localStorage.setItem("events", JSON.stringify(state.events));
      }
    },
    deleteEvent: (state, action: PayloadAction<string>) => {
      state.events = state.events.filter(
        (event) => event.id !== action.payload
      );
      localStorage.setItem("events", JSON.stringify(state.events));
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    [updateEventSlots.type]: (state, action) => {
      const event = state.events.find((e) => e.id === action.payload.eventId);
      if (event) {
        event.slots = Math.max(0, event.slots - action.payload.quantity);
      }
    },
    incrementCheckoutCount: (
      state,
      action: PayloadAction<{ eventId: string; quantity: number }>
    ) => {
      const { eventId, quantity } = action.payload;
      const event = state.events.find((e) => e.id === eventId);
      if (event) {
        if (!event.checkoutCount) {
          event.checkoutCount = 0; // Initialize if undefined
        }
        event.checkoutCount += quantity;
      }
    },
  },
});

export const { addEvent, updateEvent, deleteEvent, setLoading } =
  eventsSlice.actions;
export default eventsSlice.reducer;
