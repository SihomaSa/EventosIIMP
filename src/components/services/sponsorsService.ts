
import { SponsorType,NewSponsorRequestType, UpdateSponsorRequestType} from "@/types/sponsorTypes";  // NewSponsorType, 

const API_GET_URL = "https://hikjaj4xs7.execute-api.us-east-1.amazonaws.com/web/sponsor/event/1";
const API_POST_URL = "https://hikjaj4xs7.execute-api.us-east-1.amazonaws.com/web/sponsor/event";
const API_PUT_URL = "https://hikjaj4xs7.execute-api.us-east-1.amazonaws.com/web/sponsor/event";
const API_DELETE_URL = "https://hikjaj4xs7.execute-api.us-east-1.amazonaws.com/web/sponsor";

export const getSponsors = async (): Promise<SponsorType[]> => {
  const response = await fetch(API_GET_URL);
  if (!response.ok) throw new Error("Error al obtener los auspiciadores");
  return response.json();
};

export const createSponsor = async (newSponsor:NewSponsorRequestType): Promise<SponsorType> => {
  const response = await fetch(API_POST_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newSponsor),
  });

  if (!response.ok) throw new Error("Error al crear el publicidad");
  return response.json();
};

export const updateSponsor = async (updatedSponsor: UpdateSponsorRequestType): Promise<SponsorType> => {
  const response = await fetch(API_PUT_URL, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedSponsor),
  });

  if (!response.ok) throw new Error("Error al actualizar el publicidad");
  return response.json();
};

export const deleteSponsor = async (sponsorId: string): Promise<void> => {
    const response = await fetch(`${API_DELETE_URL}/${sponsorId}`, {
    method: "DELETE",
  });

  if (!response.ok) throw new Error("Error al eliminar el auspiciador");
};