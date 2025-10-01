import React, { useState, useEffect } from "react";
import InputSearch from "../components/atoms/buscador";
import CustomButton from "../components/atoms/Boton";
import DateRangeInput from "../components/atoms/DateRangeInput";
import Table from "../components/atoms/Table";
import { useNavigate } from "react-router-dom";
import { searchCultivos } from "../services/cultivosService";
import type { Cultivo, SearchCultivoDto } from "../types/cultivos.types";

const CultivosPage: React.FC = () => {
  const navigate = useNavigate();
  const [cultivos, setCultivos] = useState<Cultivo[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<SearchCultivoDto>({});

  // Función de búsqueda unificada (utiliza el endpoint POST /cultivos/search)
  const handleSearch = async () => {
    setLoading(true);
    try {
      // Usa los filtros actuales (que son {} en la carga inicial)
      const data = await searchCultivos(filters);
      setCultivos(data);
    } catch (error) {
      console.error("Error searching cultivos:", error);
    } finally {
      setLoading(false);
    }
  };

  // No cargar datos inicialmente - tabla vacía hasta que el usuario busque
  useEffect(() => {
    // Tabla inicia vacía
  }, []);


  const handleFilterChange = (key: keyof SearchCultivoDto, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleDateRangeChange = (dates: [Date | null, Date | null]) => {
    const [startDate, endDate] = dates;
    setFilters(prev => ({
      ...prev,
      fecha_inicio: startDate ? startDate.toISOString().split('T')[0] : undefined,
      fecha_fin: endDate ? endDate.toISOString().split('T')[0] : undefined,
    }));
  };

  const clearFilters = () => {
    setFilters({});
    // Al limpiar filtros, volvemos a llamar a handleSearch (sin filtros)
    handleSearch();
  };

  const exportToExcel = (cultivo?: Cultivo): void => {
    const dataToExport = cultivo ? [cultivo] : cultivos;

    if (dataToExport.length === 0) {
      alert('No hay datos para exportar');
      return;
    }

    // Crear contenido HTML para Excel
    const headers = ['Ficha', 'Lote', 'Nombre del Cultivo', 'Fecha de Siembra', 'Fecha de Cosecha'];
    const htmlContent = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="utf-8">
        <title>Cultivos Export</title>
        <!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Cultivos</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
      </head>
      <body>
        <table border="1">
          <thead>
            <tr>
              ${headers.map(header => `<th>${header}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${dataToExport.map(cultivo => `
              <tr>
                <td>${cultivo.ficha}</td>
                <td>${cultivo.lote}</td>
                <td>${cultivo.nombrecultivo}</td>
                <td>${cultivo.fechasiembra ? new Date(cultivo.fechasiembra).toLocaleDateString() : 'Sin fecha'}</td>
                <td>${cultivo.fechacosecha ? new Date(cultivo.fechacosecha).toLocaleDateString() : 'Sin cosecha'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
      </html>
    `;

    // Crear blob y descargar
    const blob = new Blob([htmlContent], { type: 'application/vnd.ms-excel' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    const fileName = cultivo
      ? `cultivo_${cultivo.ficha}_${new Date().toISOString().split('T')[0]}.xls`
      : `cultivos_${new Date().toISOString().split('T')[0]}.xls`;
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header with title and action buttons */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestión de Cultivos</h1>
        <div className="flex gap-2">
          <CustomButton
            label="Exportar Todos"
            onClick={() => exportToExcel()}
          />
          <CustomButton
            label="Registrar Tipo de Cultivo"
            onClick={() => navigate("/cultivos/tipo-cultivo")}
          />
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Filtros de Búsqueda</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Zone Search */}
          <div>
            <label className="block text-sm font-medium mb-1">Buscar por Zona</label>
            <InputSearch
              placeholder="Nombre de zona..."
              value={filters.buscar || ""}
              onChange={(e) => handleFilterChange("buscar", e.target.value)}
            />
          </div>

          {/* Crop Search */}
          <div>
            <label className="block text-sm font-medium mb-1">Buscar por Cultivo</label>
            <InputSearch
              placeholder="Nombre de variedad o tipo..."
              value={filters.buscar_cultivo || ""}
              onChange={(e) => handleFilterChange("buscar_cultivo", e.target.value)}
            />
          </div>

          {/* Date Range */}
          <div>
            <DateRangeInput
              label="Rango de Fechas"
              onChange={handleDateRangeChange}
            />
          </div>

          {/* Titled User */}
          <div>
            <label className="block text-sm font-medium mb-1">Buscar por Ficha</label>
            <InputSearch
              placeholder="Número de ficha..."
              // Asegúrate de manejar la entrada del input correctamente (e.target.value)
              value={filters.id_titulado || ""}
              onChange={(e) => handleFilterChange("id_titulado", e.target.value)}
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium mb-1">Estado del Cultivo</label>
            <select
              className="w-full border rounded-lg px-3 py-2"
              value={filters.estado_cultivo || ""}
              onChange={(e) => handleFilterChange("estado_cultivo", e.target.value ? parseInt(e.target.value) : undefined)}
            >
              <option value="">Todos</option>
              <option value="1">En Curso</option>
              <option value="0">Finalizado</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 items-end">
            <CustomButton
              label="Buscar"
              onClick={handleSearch}
            />
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              Limpiar
            </button>
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Resultados ({cultivos.length})</h2>
        </div>

        {loading ? (
          <div className="p-8 text-center">Cargando...</div>
        ) : (
          <div className="overflow-x-auto">
            <Table headers={["Ficha", "Lote", "Nombre del Cultivo", "Fecha de Siembra", "Fecha de Cosecha", "Acciones"]}>
              {cultivos.map((cultivo) => (
                <tr key={cultivo.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{cultivo.ficha}</td>
                  <td className="px-4 py-2">{cultivo.lote}</td>

                  <td className="px-4 py-2">{cultivo.nombrecultivo}</td>

                  <td className="px-4 py-2">
                    {cultivo.fechasiembra ? new Date(cultivo.fechasiembra).toLocaleDateString() : 'Sin fecha'}
                  </td>
                  <td className="px-4 py-2">
                    {cultivo.fechacosecha ? new Date(cultivo.fechacosecha).toLocaleDateString() : 'Sin cosecha'}
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex gap-2">
                      <button className="text-blue-600 hover:text-blue-800 text-sm">
                        Actividades
                      </button>
                      <button className="text-green-600 hover:text-green-800 text-sm">
                        Financiero
                      </button>
                      <button
                        className="text-purple-600 hover:text-purple-800 text-sm"
                        onClick={() => exportToExcel(cultivo)}
                      >
                        Exportar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </Table>
          </div>
        )}

        {cultivos.length === 0 && !loading && (
          <div className="p-8 text-center text-gray-500">
            No se encontraron cultivos con los filtros aplicados.
          </div>
        )}
      </div>
    </div>
  );
};

export default CultivosPage;