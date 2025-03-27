import { ExpositorType, NewExpositorType } from "@/types/expositorTypes";

const API_GET_URL = "https://adrvv5g9n5.execute-api.us-east-1.amazonaws.com/web/author";
const API_POST_URL = "https://adrvv5g9n5.execute-api.us-east-1.amazonaws.com/web/author";

export const getExpositors = async (): Promise<ExpositorType[]> => {
  const response = await fetch(API_GET_URL);
  if (!response.ok) throw new Error("Error al obtener los conferencistas");
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
