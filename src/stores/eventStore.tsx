import { useState, createContext, useContext, useEffect } from "react";
import { NewEventType } from "@/types/createEvent";
import { EventType } from "@/types/eventTypes";

const EventContext = createContext<{
  events: NewEventType[];
  selectedEvent: EventType | null;
  addEvent: (event: NewEventType) => void;
  selectEvent: (event: EventType) => void;
} | null>(null);

export function EventProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<NewEventType[]>(() => {
    const storedEvents = localStorage.getItem("events");
    return storedEvents ? JSON.parse(storedEvents) : [];
  });

  const [selectedEvent, setSelectedEvent] = useState<EventType | null>(() => {
    const storedSelectedEvent = localStorage.getItem("selectedEvent");
    return storedSelectedEvent ? JSON.parse(storedSelectedEvent) : null;
  });

  useEffect(() => {
    localStorage.setItem("events", JSON.stringify(events));
    localStorage.setItem("selectedEvent", JSON.stringify(selectedEvent));
  }, [events, selectedEvent]);

  const addEvent = (event: NewEventType) => {
    setEvents((prev) => [...prev, event]);
  };

const selectEvent = (event: EventType) => {
    setSelectedEvent(event);
  };
  
  return (
    <EventContext.Provider value={{ events, addEvent, selectEvent, selectedEvent }}>
      {children}
    </EventContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useEventStore() {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error("useEventStore must be used within an EventProvider");
  }
  return context;
}
