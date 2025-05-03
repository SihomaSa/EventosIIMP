import { LanguageType } from "./languageTypes";

export interface SponsorType { //GET
	idSponsor: number;
	idEvento: string | number;
	prefijoIdioma: string;
	foto: string;
	categoria: string;
	nombre: string;
	url: string;
	descripcionIdioma: string;
	idCategoria?: number;
}
export interface NewSponsorRequestType {//POST
    descripcion: string;
    foto: string;
	url: string;
	idEvento: string | number;
	categoria: string;
    idioma: LanguageType;
  }
  export interface UpdateSponsorRequestType {  //PUT
	descripcion: string;
	foto: string;
	url: string;
	idEvento:string;//Esto no
	categoria: string;
	idioma: LanguageType;
	estado: string; //Esto no
	idSponsor: number;
  }

  export interface NewSponsorType {
	idEvento: number;
	descripcion: string;
	foto: string;
	url: string;
	categoria: string;
	idioma: LanguageType;
}