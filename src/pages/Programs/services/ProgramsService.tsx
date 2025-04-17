import { ProgramForm } from "../components/ProgramForm/types/ProgramForm";
import { Program, ProgramCategory } from "../types/Program";

// Variables de entorno desde Vite
const {
  VITE_PROGRAMS_GET,
  VITE_PROGRAMS_POST,
  VITE_PROGRAMS_PUT,
  VITE_PROGRAMS_DETAIL_DELETE,
  VITE_TYPE_PROGRAMS_GET,
} = import.meta.env;

const getApiUrl = (endpoint: string, id?: string | number): string => {
  const baseUrl = {
    GET: VITE_PROGRAMS_GET,
    POST: VITE_PROGRAMS_POST,
    PUT: VITE_PROGRAMS_PUT,
    DELETE_DETAIL: VITE_PROGRAMS_DETAIL_DELETE,
    GET_TYPES: VITE_TYPE_PROGRAMS_GET,
  }[endpoint];

  if (!baseUrl) throw new Error(`URL no configurada para ${endpoint}`);
  return id ? `${baseUrl.replace(/\/$/, '')}/${id}` : baseUrl;
};

const ProgramsService = {
  getPrograms: async () => {
    const res = await fetch(getApiUrl("GET", "1"));
    if (!res.ok) throw new Error("Error al obtener los programas");
    const data = await res.json();
    return data as Program[];
  },

  getProgramCategories: async () => {
    const res = await fetch(getApiUrl("GET_TYPES"));
    if (!res.ok) throw new Error("Error al obtener las categorías de programa");
    const data = await res.json();
    return data as ProgramCategory[];
  },

  addProgram: async (program: ProgramForm) => {
    const res = await fetch(getApiUrl("POST"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify([program]),
    });
    if (!res.ok) throw new Error("Error al crear el programa");
  },

  updateProgram: async (program: ProgramForm) => {
    const res = await fetch(getApiUrl("PUT"), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify([program]),
    });
    if (!res.ok) throw new Error("Error al actualizar el programa");
  },

  deleteProgram: async (id: number) => {
    const res = await fetch(`${getApiUrl("DELETE")}/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Error al eliminar el programa");
  },

  deleteProgramDetail: async (idProDetalle: number) => {
    const res = await fetch(getApiUrl("DELETE_DETAIL", idProDetalle), {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Error al eliminar el detalle del programa");
  },
};

export default ProgramsService;

