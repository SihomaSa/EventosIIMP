export interface BulletinType {
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
  export interface NewBulletinType {
    titulo: string;
    descripcion: string;
    url: string;
    foto: string;
    idioma: string;
  }
  
  export interface NewBulletinRequestType {
    titulo: string;
    descripcion: string;
    url: string;
    evento: string;
    tipoprensa: "1";
    foto: string;
    idioma: string;
  }