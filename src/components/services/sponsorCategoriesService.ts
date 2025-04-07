import { SponsorCategoryType } from "@/types/sponsorCategoryTypes";

const API_GET_URL = "https://d47n68si9j.execute-api.us-east-1.amazonaws.com/web/category/sponsors";

export const getSponsorCategories = async (): Promise<SponsorCategoryType[]> => {
  const response = await fetch(API_GET_URL);
  if (!response.ok) throw new Error("Error al obtener los auspiciadores");
  return response.json();
};
