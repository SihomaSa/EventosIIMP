import { useState, createContext, useContext, useEffect } from "react";
import { NewEventType } from "@/types/createEvent";

const EventContext = createContext<{
  events: NewEventType[];
  addEvent: (event: NewEventType) => void;
} | null>(null);

export function EventProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<NewEventType[]>(() => {
    const storedEvents = localStorage.getItem("events");
    return storedEvents ? JSON.parse(storedEvents) : [];
  });

  useEffect(() => {
    localStorage.setItem("events", JSON.stringify(events));
  }, [events]);

  const addEvent = (event: NewEventType) => {
    setEvents((prev) => [...prev, event]);
  };

  return (
    <EventContext.Provider value={{ events, addEvent }}>
      {children}
    </EventContext.Provider>
  );
}

export function useEventStore() {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error("useEventStore must be used within an EventProvider");
  }
  return context;
}
