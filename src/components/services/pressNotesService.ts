import { NewPressNoteRequestType, PressNoteType } from "@/types/pressNoteTypes";

const API_GET_URL = "https://xl4i85oqze.execute-api.us-east-1.amazonaws.com/web/news/event/1";
const API_POST_URL = "https://xl4i85oqze.execute-api.us-east-1.amazonaws.com/web/news/event";

export const getPressNotes = async (): Promise<PressNoteType[]> => {
  const response = await fetch(API_GET_URL);
  if (!response.ok) throw new Error("Error al obtener las notas de prensa");
  return response.json();
};

export const createPressNote = async (newPressNote: NewPressNoteRequestType): Promise<PressNoteType> => {
  const response = await fetch(API_POST_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newPressNote),
  });

  if (!response.ok) throw new Error("Error al crear la nota de prensa");
  return response.json();
};
