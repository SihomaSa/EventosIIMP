import { AdType, NewAdRequestType, UpdateAdRequestType } from "@/types/adTypes";

const API_GET_URL = "https://xahhfxc3dc.execute-api.us-east-1.amazonaws.com/web/advertising/event/1";
const API_POST_URL = "https://xahhfxc3dc.execute-api.us-east-1.amazonaws.com/web/advertising/event";
const API_PUT_URL = "https://xahhfxc3dc.execute-api.us-east-1.amazonaws.com/web/advertising/event";
const API_DELETE_URL = "https://xahhfxc3dc.execute-api.us-east-1.amazonaws.com/web/advertising";

export const getAds = async (): Promise<AdType[]> => {
  const response = await fetch(API_GET_URL);
  if (!response.ok) throw new Error("Error al obtener los publicidades");
  return response.json();
};

export const createAd = async (newAd: NewAdRequestType): Promise<AdType> => {
  const response = await fetch(API_POST_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newAd),
  });

  if (!response.ok) throw new Error("Error al crear el publicidad");
  return response.json();
};

export const updateAd = async (updatedAd: UpdateAdRequestType): Promise<AdType> => {
  const response = await fetch(API_PUT_URL, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedAd),
  });

  if (!response.ok) throw new Error("Error al actualizar el publicidad");
  return response.json();
};
export const deleteAd = async (adId: string): Promise<void> => {
  const response = await fetch(`${API_DELETE_URL}/${adId}`, {
    method: "DELETE",
  });

  if (!response.ok) throw new Error("Error al eliminar la publicidad");
};
