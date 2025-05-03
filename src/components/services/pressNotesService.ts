import { NewPressNoteRequestType, PressNoteType,  } from "@/types/pressNoteTypes";

// Importa las variables de entorno de Vite
const {
  VITE_NEWS_GET,
  VITE_NEWS_POST,
  VITE_NEWS_PUT,
  VITE_NEWS_DELETE
} = import.meta.env;

const getApiUrl = (endpoint: string, id?: string): string => {
  const baseUrl = {
    GET: VITE_NEWS_GET,
    POST: VITE_NEWS_POST,
    PUT: VITE_NEWS_PUT,
    DELETE: VITE_NEWS_DELETE
  }[endpoint];

  if (!baseUrl) throw new Error(`URL no configurada para NEWS_${endpoint}`);
  return id ? `${baseUrl}/${id}` : baseUrl;
};

export const getPressNotes = async (eventId: string = "1"): Promise<PressNoteType[]> => {
  const url = getApiUrl("GET", eventId);
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Error al obtener anuncios (${response.status})`);
  return response.json();
};
export const createPressNote = async (newPressNote: NewPressNoteRequestType): Promise<PressNoteType> => {
  const response = await fetch(getApiUrl("POST"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newPressNote),
  });
  if (!response.ok) throw new Error(`Error al crear anuncio (${response.status})`);
  return response.json();
};

export const updatePressNote = async (editPressNote: NewPressNoteRequestType): Promise<PressNoteType> => {
  const response = await fetch(getApiUrl("PUT"), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(editPressNote),
  });
  if (!response.ok) throw new Error(`Error al actualizar anuncio (${response.status})`);
  return response.json();
};

export const deletePressNote = async (pressNoteId: string): Promise<void> => {
  const response = await fetch(getApiUrl("DELETE", pressNoteId), {
    method: "DELETE",
  });
  if (!response.ok) throw new Error(`Error al eliminar anuncio (${response.status})`);
};
