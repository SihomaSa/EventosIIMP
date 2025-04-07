import { Program } from "../types/Program";

const BASE_URL = "https://ab7cuydlkd.execute-api.us-east-1.amazonaws.com";

const ProgramsService = {
  getPrograms: async () => {
    const res = await fetch(`${BASE_URL}/mob/program/event/1`);
    if (!res.ok) throw new Error("Error fetching programs");
    const data = await res.json();
    return data as Program[];
  },
};

export default ProgramsService;
