export interface Cultivo {
  id: string;
  ficha: string;
  lote: string; // CORREGIDO: Propiedades en minúsculas para coincidir con el backend (getRawMany)
  nombrecultivo: string;
  fechasiembra: string;
  fechacosecha: string;
}

export interface SearchCultivoDto {
  buscar?: string; // Buscar por zona
  buscar_cultivo?: string; // Buscar por variedad o tipo de cultivo
  fecha_inicio?: string; // Fecha inicio del rango
  fecha_fin?: string; // Fecha fin del rango
  id_titulado?: string; // Número de ficha del titulado
  estado_cultivo?: number; // Estado: 1=activo, 0=inactivo
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
}
