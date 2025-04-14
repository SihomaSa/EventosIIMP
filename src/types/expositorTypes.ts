export interface ExpositorType {//GET
	idAuthor: number;
	nombres: string;
	apellidos: string;
	hojaVida: string;
	foto: string;
	especialidad: string;
}
export interface NewExpositorType {//POST
	nombres: string;
	apellidos: string;
	especialidad: string;
	hojaDeVida: string;
	foto: string;
}
export interface UpdateExpositorRequestType {//PUT
	nombres: string;
	apellidos: string;
	especialidad: string;
	hojaDeVida: string;
	foto: string;
	idAuthor: number;
}
