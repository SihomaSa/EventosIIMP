import { ExpositorType, NewExpositorType, UpdateExpositorRequestType } from '@/types/expositorTypes';

// Importa las variables de entorno de Vite
const {
  VITE_AUTHORS_GET,
  VITE_AUTHORS_POST,
  VITE_AUTHORS_PUT,
  VITE_AUTHORS_DELETE
} = import.meta.env;

const getApiUrl = (endpoint: string, id?: string | number): string => {
  const baseUrl = {
    GET: VITE_AUTHORS_GET,
    POST: VITE_AUTHORS_POST,
    PUT: VITE_AUTHORS_PUT,
    DELETE: VITE_AUTHORS_DELETE
  }[endpoint];

  if (!baseUrl) throw new Error(`URL no configurada para AUTHORS_${endpoint}`);
  return id ? `${baseUrl}/${id}` : baseUrl;
};

export const getExpositors = async (): Promise<ExpositorType[]> => {
  const url = getApiUrl("GET");
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Error al obtener expositores (${response.status})`);
  return response.json();
};

export const createExpositor = async (newExpositor: NewExpositorType): Promise<ExpositorType> => {
  const response = await fetch(getApiUrl("POST"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newExpositor),
  });
  if (!response.ok) throw new Error(`Error al crear expositor (${response.status})`);
  return response.json();
};

export const updateExpositor = async (updatedExpositor: UpdateExpositorRequestType): Promise<ExpositorType> => {
  const response = await fetch(getApiUrl("PUT"), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedExpositor),
  });
  if (!response.ok) throw new Error(`Error al actualizar expositor (${response.status})`);
  return response.json();
};

export const deleteExpositor = async (expositorId: string): Promise<void> => {
  const response = await fetch(getApiUrl("DELETE", expositorId), {
    method: "DELETE",
  });
  if (!response.ok) throw new Error(`Error al eliminar expositor (${response.status})`);
};
