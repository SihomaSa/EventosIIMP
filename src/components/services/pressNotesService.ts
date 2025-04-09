import { NewPressNoteRequestType, PressNoteType } from "@/types/pressNoteTypes";

const API_GET_URL = "https://p47i41cvzj.execute-api.us-east-1.amazonaws.com/web/news/event/1";
const API_POST_URL = "https://p47i41cvzj.execute-api.us-east-1.amazonaws.com/web/news/event";
const API_DELETE_URL = "https://p47i41cvzj.execute-api.us-east-1.amazonaws.com/web/news";

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

export const deletePressNote = async (pressNoteId: string): Promise<void> => {
  const response = await fetch(`${API_DELETE_URL}/${pressNoteId}`, {
    method: "DELETE",
  });

  if (!response.ok) throw new Error("Error al eliminar la nota de prensa");
};