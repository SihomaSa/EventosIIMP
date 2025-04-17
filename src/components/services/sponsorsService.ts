
import { SponsorType,NewSponsorRequestType, UpdateSponsorRequestType} from "@/types/sponsorTypes";  // NewSponsorType, 

// Importa las variables de entorno de Vite
const {
  VITE_SPONSORS_GET,
  VITE_SPONSORS_POST,
  VITE_SPONSORS_PUT,
  VITE_SPONSORS_DELETE
} = import.meta.env;

const getApiUrl = (endpoint: string, id?: string): string => {
  const baseUrl = {
    GET: VITE_SPONSORS_GET,
    POST: VITE_SPONSORS_POST,
    PUT: VITE_SPONSORS_PUT,
    DELETE: VITE_SPONSORS_DELETE
  }[endpoint];

  if (!baseUrl) throw new Error(`URL no configurada para SPONSORS_${endpoint}`);
  return id ? `${baseUrl}/${id}` : baseUrl;
};

export const getSponsors = async (eventId: string = "1"): Promise<SponsorType[]> => {
  const url = getApiUrl("GET", eventId);
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Error al obtener auspiciadores (${response.status})`);
  return response.json();
};

export const createSponsor = async (newSponsor: NewSponsorRequestType): Promise<SponsorType> => {
  const response = await fetch(getApiUrl("POST"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newSponsor),
  });

  if (!response.ok) throw new Error(`Error al crear auspiciador (${response.status})`);
  return response.json();
};

export const updateSponsor = async (updatedSponsor: UpdateSponsorRequestType): Promise<SponsorType> => {
  const response = await fetch(getApiUrl("PUT"), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedSponsor),
  });

  if (!response.ok) throw new Error(`Error al actualizar auspiciador (${response.status})`);
  return response.json();
};

export const deleteSponsor = async (sponsorId: string): Promise<void> => {
  const response = await fetch(getApiUrl("DELETE", sponsorId), {
    method: "DELETE",
  });

  if (!response.ok) throw new Error(`Error al eliminar auspiciador (${response.status})`);
};