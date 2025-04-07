import { Program, ProgramCategory } from "../types/Program";

const BASE_URL = "https://ab7cuydlkd.execute-api.us-east-1.amazonaws.com";
const BASE_URL2 = "https://ktgbqfdb72.execute-api.us-east-1.amazonaws.com";

const ProgramsService = {
  getPrograms: async () => {
    const res = await fetch(`${BASE_URL}/mob/program/event/1`);
    if (!res.ok) throw new Error("Error fetching programs");
    const data = await res.json();
    return data as Program[];
  },
  getProgramCategories: async () => {
    const res = await fetch(`${BASE_URL2}/web/typeprograms/event`);
    if (!res.ok) throw new Error("Error fetching program categories");
    const data = await res.json();
    return data as ProgramCategory[];
  },
};

export default ProgramsService;
