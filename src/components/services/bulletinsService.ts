import { BulletinType, NewBulletinRequestType } from "@/types/bulletinTypes";

const API_GET_URL = "https://p47i41cvzj.execute-api.us-east-1.amazonaws.com/web/news/event/1";
const API_POST_URL = "https://p47i41cvzj.execute-api.us-east-1.amazonaws.com/web/news/event";
const API_DELETE_URL = "https://p47i41cvzj.execute-api.us-east-1.amazonaws.com/web/news/9";

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

export const deleteBulletin = async (bulletinId: string): Promise<void> => {
  const response = await fetch(`${API_DELETE_URL}/${bulletinId}`, {
    method: "DELETE",
  });

  if (!response.ok) throw new Error("Error al eliminar la nota de prensa");
};