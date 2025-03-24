export interface ExpositorType {
	idautor: number;
	nombres: string;
	apellidos: string;
	especialidad: string;
	hojavida: string;
	image?: string;
}

export interface NewExpositorType {
	nombres: number;
	apellidos: string;
	especialidad: string;
	hojavida: string;
	image?: string;
}
