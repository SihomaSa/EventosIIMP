import { LanguageType } from "./languageTypes";

export interface AdType { //GET
    idPublicidad: number;
    idEvento: number;
    foto: string;
    prefijoIdioma: string;
    estado: number;
    url: string;
    descripcionIdioma: string;
  }
  export interface NewAdRequestType {//POST
    evento: string;
    foto: string;
    idioma: LanguageType;
    url: string;
  }

  export interface UpdateAdRequestType {//PUT
    foto: string;
    url: string;
    idioma: LanguageType;
    evento: string;
    estado: string;
    idPublicidad: string;
  }
  export interface NewAdType {
    idEvento: number;
    foto: File;
    prefijoIdioma: string;
    estado: number;
    url: string;
    descripcionIdioma: string;
  }