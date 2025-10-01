export interface Venta {
  id: string;
  cantidad: number;
  fecha: string;
  fkCosechaId: string;
  precioKilo?: number;
  ventaTotal?: number;
}

export interface CreateVentaDto {
  cantidad: number;
  fecha: string;
  fkCosechaId: string;
  precioKilo?: number;
  ventaTotal?: number;
}