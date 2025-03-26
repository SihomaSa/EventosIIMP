export interface AdType {
    idPublicidad: number;
    idEvento: number;
    foto: string;
    prefijoIdioma: string;
    estado: number;
    url: string;
    descripcionIdioma: string;
  }
  export interface NewAdType {
    idEvento: number;
    foto: File;
    prefijoIdioma: string;
    estado: number;
    url: string;
    descripcionIdioma: string;
  }
  
  export interface NewAdRequestType {
    evento: string;
    foto: string;
    idioma: LanguageType;
    url: string;
  }
  
  export interface UpdateAdRequestType {
    foto: string;
    url: string;
    idioma: LanguageType;
    evento: string;
    estado: string;
    idPublicidad: string;
  }
  export type LanguageType = "1" | "2";