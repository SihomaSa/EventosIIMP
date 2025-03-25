export interface ExpositorType {
	idautor: number;
	nombres: string;
	apellidos: string;
	especialidad: string;
	hojavida: string;
	image?: string;
}

export interface NewExpositorType {
	nombres: string;
	apellidos: string;
	especialidad: string;
	hojavida: string;
	image?: string;
}
