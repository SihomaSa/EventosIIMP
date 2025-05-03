export interface PressNoteType {//GET
  idTipPre: number;
  idPrensa: number;
  titulo: string;
  foto: string;
  descripcion_prensa: string;
  descripcionIdioma: string;
  prefijoIdioma: string;
  descripcion: string;
  subtitulo: string;
  url: string;
  fecha: string;
  evento: number;
  idNews: number;
  tipoprensa: number;
  ididioma: string;
}
export interface NewPressNoteType {//POST
  evento: string;
  titulo: string;
  subtitulo: string;
  fecha: string;
  descripcion: string;
  url: string;
  foto: string;
  idioma: string;
}
export interface NewPressNoteRequestType {//PUT
  titulo: string;
  fecha?: string;
  url: string;
  evento: number | string;
  tipoprensa: number | string;
  foto?: string;
  idioma?: string;
  idNews?: number;
  ididioma?: string;
}