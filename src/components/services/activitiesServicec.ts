import { SponsorType, NewSponsorType, NewSponsorRequestType } from "@/types/sponsorTypes";

const API_GET_URL = "https://bxhrusut32.execute-api.us-east-1.amazonaws.com/web/activity/event/1";
const API_POST_URL = "https://vmy2jxg4e6.execute-api.us-east-1.amazonaws.com/web/sponsor/event";
const API_PUT_URL = "https://vmy2jxg4e6.execute-api.us-east-1.amazonaws.com/web/sponsor/event";

export const getActivities = async (): Promise<SponsorType[]> => {
  const response = await fetch(API_GET_URL);
  if (!response.ok) throw new Error("Error al obtener los auspiciadores");
  return response.json();
};

export const createSponsor = async (newAd: NewSponsorType): Promise<SponsorType> => {
  const response = await fetch(API_POST_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newAd),
  });

  if (!response.ok) throw new Error("Error al crear el actividad");
  return response.json();
};

export const updateSponsor = async (updatedAd: NewSponsorRequestType): Promise<SponsorType> => {
  const response = await fetch(API_PUT_URL, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedAd),
  });

  if (!response.ok) throw new Error("Error al actualizar el auspiciador");
  return response.json();
};


