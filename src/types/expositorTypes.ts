import { LanguageType } from "./languageTypes";

export interface ExpositorType {//GET
	apellidos: string;
	hojaVida: string;
	prefijoIdioma: string;
	foto: string;
	idAutor: number;
	especialidad: string;
	nombres: string;
	descripcionIdioma: string;
}
export interface NewExpositorType {//POST
	nombres: string;
	apellidos: string;
	especialidad: string;
	idIdioma: string;
	hojaDeVida: string;
	descripcionIdioma: LanguageType;
	foto: string;
}
export interface UpdateExpositorRequestType {//PUT
	nombres: string;
	apellidos: string;
	especialidad: string;
	hojaDeVida: string;
	descripcionIdioma: LanguageType;
	foto: string ;
	idAuthor: string;
}
