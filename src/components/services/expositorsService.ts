import { ExpositorType, NewExpositorType,UpdateExpositorRequestType } from "@/types/expositorTypes";

const API_GET_URL = "https://zo7zhx2dui.execute-api.us-east-1.amazonaws.com/web/author";
const API_POST_URL = "https://zo7zhx2dui.execute-api.us-east-1.amazonaws.com/web/author";
const API_PUT_URL = "https://zo7zhx2dui.execute-api.us-east-1.amazonaws.com/web/author";
const API_DELETE_URL = "https://zo7zhx2dui.execute-api.us-east-1.amazonaws.com/web/author";

export const getExpositors = async (): Promise<ExpositorType[]> => {
  const response = await fetch(API_GET_URL);
  if (!response.ok) throw new Error("Error al obtener los publicidades");
  return response.json();
};

export const createExpositor = async (newExpositor: NewExpositorType): Promise<ExpositorType> => {
  const response = await fetch(API_POST_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newExpositor),
  });

  if (!response.ok) throw new Error("Error al crear el conferencista");
  return response.json();
};
export const updateExpositor = async (updatedExpositor: UpdateExpositorRequestType): Promise<ExpositorType> => {
  const response = await fetch(API_PUT_URL, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedExpositor),
  });

  if (!response.ok) throw new Error("Error al actualizar el publicidad");
  return response.json();
};

export const deleteExpositor = async (expositorId: number): Promise<void> => {
  const response = await fetch(`${API_DELETE_URL}/${expositorId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Error al eliminar al expositor");
  }
};
