import { EventType } from '@/types/eventTypes';

const {
  VITE_EVENTS_GET,
  VITE_EVENTS_POST,
  VITE_EVENT_GET
} = import.meta.env;

export const fetchEvents = async (): Promise<EventType[]> => {
  const response = await fetch(VITE_EVENTS_GET);
  if (!response.ok) throw new Error(`Error al obtener eventos (${response.status})`);
  return response.json();
};

export const fetchEventById = async (id: number): Promise<EventType> => {
  const response = await fetch(`${VITE_EVENT_GET}/${id}`);
  if (!response.ok) throw new Error(`Error al obtener evento (${response.status})`);
  return response.json();
};

export const createEvent = async (eventData: FormData): Promise<EventType> => {
  const response = await fetch(VITE_EVENTS_POST, {
    method: "POST",
    body: eventData,
  });
  if (!response.ok) throw new Error(`Error al crear evento (${response.status})`);
  return response.json();
};
