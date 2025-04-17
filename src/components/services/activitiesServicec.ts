import {
  ActivityDay,
  ActivityDetail,
  ActivityType,
} from "@/types/activityTypes";
import { SponsorType, NewSponsorRequestType } from "@/types/sponsorTypes";

const {
  VITE_TYPE_ACTIVITIES_GET,
  VITE_ACTIVITY_GET,
  VITE_ACTIVITY_POST,
  VITE_ACTIVITY_PUT,
  VITE_ACTIVITY_DELETE,
} = import.meta.env;

const getApiUrl = (type: string, id?: number | string): string => {
  const baseUrl = {
    TYPE_GET: VITE_TYPE_ACTIVITIES_GET,
    GET: VITE_ACTIVITY_GET,
    POST: VITE_ACTIVITY_POST,
    PUT: VITE_ACTIVITY_PUT,
    DELETE: VITE_ACTIVITY_DELETE,
  }[type];

  if (!baseUrl) throw new Error(`URL no configurada para ${type}`);
  return id ? `${baseUrl}/${id}` : baseUrl;
};

// Obtener tipos de actividad
export const getActivityTypes = async (): Promise<ActivityType[]> => {
  const response = await fetch(getApiUrl("TYPE_GET"));
  if (!response.ok) throw new Error("Error al obtener los tipos de actividad");
  return response.json();
};

// Obtener actividades
export const getActivities = async (): Promise<ActivityDay[]> => {
  const response = await fetch(getApiUrl("GET", "1"));
  if (!response.ok) throw new Error("Error al obtener las actividades");
  return response.json();
};

// Crear detalle de actividad
export const createActivityDetail = async <T extends Record<string, unknown>>(
  newActivity: T[]
): Promise<ActivityDetail> => {
  const response = await fetch(getApiUrl("POST"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newActivity),
  });

  if (!response.ok) throw new Error("Error al crear la actividad");
  return response.json();
};

// Actualizar detalle de actividad
export const updateActivityDetail = async (
  updatedData: Partial<ActivityDetail>
): Promise<ActivityDetail> => {
  const response = await fetch(getApiUrl("PUT"), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedData),
  });

  if (!response.ok) throw new Error("Error al actualizar la actividad");
  return response.json();
};

// Eliminar actividad
export const deleteActivity = async (activityId: number): Promise<void> => {
  const response = await fetch(getApiUrl("DELETE", activityId), {
    method: "DELETE",
  });

  if (!response.ok) throw new Error("Error al eliminar la actividad");
};

export const updateSponsor = async (updatedAd: NewSponsorRequestType): Promise<SponsorType> => {
  const response = await fetch(getApiUrl("PUT"), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedAd),
  });

  if (!response.ok) throw new Error(`Error al actualizar auspiciador (${response.status})`);
  return response.json();
};