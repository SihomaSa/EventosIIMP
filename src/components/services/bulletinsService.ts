import { BulletinType, NewBulletinRequestType } from "@/types/bulletinTypes";

const API_GET_URL = "https://xl4i85oqze.execute-api.us-east-1.amazonaws.com/web/news/event/1";
const API_POST_URL = "https://xl4i85oqze.execute-api.us-east-1.amazonaws.com/web/news/event";

export const getBulletins = async (): Promise<BulletinType[]> => {
  const response = await fetch(API_GET_URL);
  if (!response.ok) throw new Error("Error al obtener los boletines");
  return response.json();
};

export const createBulletin = async (newBulletin: NewBulletinRequestType): Promise<BulletinType> => {
  const response = await fetch(API_POST_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newBulletin),
  });

  if (!response.ok) throw new Error("Error al crear el boletin");
  return response.json();
};
