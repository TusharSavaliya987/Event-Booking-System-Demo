import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Event } from "../../types/event";

interface EventsState {
  events: Event[];
  loading: boolean;
  error: string | null;
  // Add pagination metadata if needed
}

const initialState: EventsState = {
  events: JSON.parse(localStorage.getItem("events") || "[]"),
  loading: true,
  error: null,
};

const eventsSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    addEvent: (state, action: PayloadAction<Event>) => {
      state.events.push(action.payload);
      localStorage.setItem("events", JSON.stringify(state.events));
    },
    updateEvent: (state, action: PayloadAction<Event>) => {
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
  },
});

export const { addEvent, updateEvent, deleteEvent, setLoading } =
  eventsSlice.actions;
export default eventsSlice.reducer;
