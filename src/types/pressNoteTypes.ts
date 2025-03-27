export interface PressNoteType {
  idTipPre: number;
  titulo: string;
  foto: string;
  descripcion_prensa: string;
  descripcionIdioma: string;
  prefijoIdioma: string;
  descripcion: string;
  subtitulo: string;
  url: string;
  fecha: string;
}
export interface NewPressNoteType {
  titulo: string;
  descripcion: string;
  url: string;
  foto: string;
  idioma: string;
}
export interface NewPressNoteRequestType {
  titulo: string;
  descripcion: string;
  url: string;
  evento: string;
  tipoprensa: "2";
  foto: string;
  idioma: string;
}