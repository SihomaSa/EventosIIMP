import { EventType } from '@/types/eventTypes';

const {
  VITE_EVENTS_GET,
  VITE_EVENTS_POST,
  VITE_EVENTS_PUT
} = import.meta.env;

const getApiUrl = (endpoint: string, id?: string): string => {
  const baseUrl = {
    GET: VITE_EVENTS_GET,
    POST: VITE_EVENTS_POST,
    PUT: VITE_EVENTS_PUT
  }[endpoint];

  if (!baseUrl) throw new Error(`URL no configurada para EVENTS_${endpoint}`);
  return id ? `${baseUrl}/${id}` : baseUrl;
};

export const createEvent = async (eventId: EventType): Promise<EventType> => {
  const response = await fetch(getApiUrl("GET"), {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(eventId),
  });
  if (!response.ok) throw new Error(`Error al crear anuncio (${response.status})`);
  return response.json();
};