export interface Cosecha {
  id: string;
  unidadMedida: string;
  cantidad: number;
  fecha?: string;
  fkCultivosVariedadXZonaId: string;

  // NUEVOS CAMPOS
  rendimiento_por_planta?: number;
  cantidad_plantas_cosechadas?: number;
}

export interface CreateCosechaDto {
  unidadMedida: string;
  cantidad: number;
  fecha?: string;
  fkCultivosVariedadXZonaId: string;

  // NUEVO CAMPO
  cantidad_plantas_cosechadas?: number;
  rendimiento_por_planta?: number;
}