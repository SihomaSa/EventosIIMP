import { SponsorCategoryType } from "@/types/sponsorCategoryTypes";

// Importa la variable de entorno para la categoría de auspiciadores
const { VITE_CATEGORY_SPONSORS_GET } = import.meta.env;

const getApiUrl = (endpoint: string): string => {
  const baseUrl = {
    GET: VITE_CATEGORY_SPONSORS_GET,
  }[endpoint];

  if (!baseUrl) throw new Error(`URL no configurada para CATEGORY_SPONSORS_${endpoint}`);
  return baseUrl;
};

export const getSponsorCategories = async (): Promise<SponsorCategoryType[]> => {
  const url = getApiUrl("GET");
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Error al obtener categorías de auspiciadores (${response.status})`);
  return response.json();
};
