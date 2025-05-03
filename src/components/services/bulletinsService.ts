import {BulletinType,NewBulletinRequestType,UpdateBulletinRequestType} from "@/types/bulletinTypes";

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

export const getBulletins = async (eventId: string = "2"): Promise<BulletinType[]> => {
  const url = getApiUrl("GET",eventId);
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Error al obtener boletines (${response.status})`);
  return response.json();
};

export const createBulletin = async (newBulletin: NewBulletinRequestType): Promise<BulletinType> => {
  const response = await fetch(getApiUrl("POST"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newBulletin),
  });
  if (!response.ok) throw new Error(`Error al crear boletín (${response.status})`);
  return response.json();
};

export const updateBulletin = async (updatedBulletin: UpdateBulletinRequestType): Promise<BulletinType> => {
  const response = await fetch(getApiUrl("PUT"), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedBulletin),
  });
  if (!response.ok) throw new Error(`Error al actualizar boletín (${response.status})`);
  return response.json();
};

export const deleteBulletin = async (bulletinId: string): Promise<void> => {
  const response = await fetch(getApiUrl("DELETE", bulletinId), {
    method: "DELETE",
  });
  if (!response.ok) throw new Error(`Error al eliminar boletín (${response.status})`);
};
