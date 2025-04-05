import { ActivityDay, ActivityDetail, ActivityType } from "@/types/activityTypes";
import { SponsorType, NewSponsorRequestType } from "@/types/sponsorTypes";

const API_GET_TYPE_URL = "https://dvi5sj2sd8.execute-api.us-east-1.amazonaws.com/web/typeactivity/event";


const API_GET_URL = "https://nl62yyb5a0.execute-api.us-east-1.amazonaws.com/web/activity/event/1";
const API_POST_URL = "https://nl62yyb5a0.execute-api.us-east-1.amazonaws.com/web/activity/event";
const API_PUT_URL = "https://vmy2jxg4e6.execute-api.us-east-1.amazonaws.com/web/sponsor/event";
  
export const getActivityTypes = async (): Promise<ActivityType[]> => {
  const response = await fetch(API_GET_TYPE_URL);
  if (!response.ok) throw new Error("Error al obtener los tipos de actividad");
  return response.json();
};

export const getActivities = async (): Promise<ActivityDay[]> => {
  const response = await fetch(API_GET_URL);
  if (!response.ok) throw new Error("Error al obtener los actividad");
  return response.json();
};

export const createActivityDetail = async <T extends Record<string, unknown>>(
  newActivity: T[]
): Promise<ActivityDetail> => {
  const response = await fetch(API_POST_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newActivity),
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


