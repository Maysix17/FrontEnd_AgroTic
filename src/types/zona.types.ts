export interface Zona {
  id: string;
  nombre: string;
  tipoLote: string;
  coorX: number;
  coorY: number;
  areaMetrosCuadrados?: number;
  coordenadas?: any;
  fkMapaId: string;
  mapa?: any;
  cultivosVariedad?: any[];
  mqttConfig?: any;
  sensores?: any[];
  mediciones?: any[];
}

export interface CreateZonaData {
  nombre: string;
  tipoLote: string;
  coorX: number;
  coorY: number;
  coordenadas?: any;
  fkMapaId: string;
}