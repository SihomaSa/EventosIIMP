import { ProgramForm } from "../components/ProgramForm/types/ProgramForm";
import { Program, ProgramCategory } from "../types/Program";

const BASE_URL = "https://jd3gnip3o3.execute-api.us-east-1.amazonaws.com";
const BASE_URL2 = "https://ktgbqfdb72.execute-api.us-east-1.amazonaws.com";

const ProgramsService = {
  getPrograms: async () => {
    const res = await fetch(`${BASE_URL}/web/program/event/1`);
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
  addProgram: async (program: ProgramForm) => {
    const res = await fetch(`${BASE_URL}/web/program/event`, {
      method: "POST",
      body: JSON.stringify([program]),
    });
    if (!res.ok) throw new Error("Error adding program");
  },
};

export default ProgramsService;
