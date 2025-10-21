import React, { useState } from "react";
import InputSearch from "../components/atoms/buscador";
import CustomButton from "../components/atoms/Boton";
import DateRangeInput from "../components/atoms/DateRangeInput";
import Table from "../components/atoms/Table";
import MobileCard from "../components/atoms/MobileCard";
import type { CardField, CardAction } from "../types/MobileCard.types";
import { searchCultivos, finalizeCultivo } from "../services/cultivosService";
import { closeAllHarvestsByCultivo } from "../services/cosechasService";
import type { Cultivo, SearchCultivoDto } from "../types/cultivos.types";
import TipoCultivoModal from "../components/organisms/TipoCultivoModal";
import VariedadModal from "../components/organisms/VariedadModal";
import CultivoModal from "../components/organisms/CultivoModal";
import CosechaModal from "../components/organisms/CosechaModal";
import VentaModal from "../components/organisms/VentaModal";
import ActivityHistoryModal from "../components/organisms/ActivityHistoryModal";
import CultivoDetailsModal from "../components/organisms/CultivoDetailsModal";
import EstadosFenologicosModal from "../components/organisms//EstadosFenologicosModal";
import HarvestSellModal from "../components/organisms/HarvestSellModal";

const CultivosPage: React.FC = () => {
  const [cultivos, setCultivos] = useState<Cultivo[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<SearchCultivoDto>({});
  const [isTipoCultivoModalOpen, setIsTipoCultivoModalOpen] = useState(false);
  const [isVariedadModalOpen, setIsVariedadModalOpen] = useState(false);
  const [isCultivoModalOpen, setIsCultivoModalOpen] = useState(false);
  const [isCosechaModalOpen, setIsCosechaModalOpen] = useState(false);
  const [isVentaModalOpen, setIsVentaModalOpen] = useState(false);
  const [isActivityHistoryModalOpen, setIsActivityHistoryModalOpen] = useState(false);
  const [isCultivoDetailsModalOpen, setIsCultivoDetailsModalOpen] = useState(false);
  const [isEstadosFenologicosModalOpen, setIsEstadosFenologicosModalOpen] = useState(false);
  const [isHarvestSellModalOpen, setIsHarvestSellModalOpen] = useState(false);
  const [selectedCultivo, setSelectedCultivo] = useState<Cultivo | null>(null);
  const [selectedCultivoForDetails, setSelectedCultivoForDetails] = useState<Cultivo | null>(null);

  const handleSearch = async () => {
    await handleSearchWithFilters(filters);
  };

  const handleFilterChange = (key: keyof SearchCultivoDto, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    handleSearchWithFilters(newFilters);
  };

  const handleSearchWithFilters = async (searchFilters: SearchCultivoDto) => {
    setLoading(true);
    try {
      const data = await searchCultivos(searchFilters);
      setCultivos(data);
    } catch (error) {
      console.error("Error searching cultivos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateRangeChange = (dates: [Date | null, Date | null]) => {
    const [startDate, endDate] = dates;
    setFilters((prev) => ({
      ...prev,
      fecha_inicio: startDate ? startDate.toISOString().split("T")[0] : undefined,
      fecha_fin: endDate ? endDate.toISOString().split("T")[0] : undefined,
    }));
  };

  const clearFilters = () => {
    setFilters({});
    setCultivos([]);
  };

  // Funciones removidas ya que ahora se usan desde HarvestSellModal

  const handleOpenHarvestSellModal = (cultivo: Cultivo) => {
    setSelectedCultivo(cultivo);
    setIsHarvestSellModalOpen(true);
  };

  const handleFinalizeCultivo = async (cultivo: Cultivo) => {
    try {
      await finalizeCultivo(cultivo.id);
      console.log('Cultivo finalizado:', cultivo.id);
      // Actualizar la lista para reflejar el cambio
      await handleSearch();
    } catch (error) {
      console.error('Error finalizando cultivo:', error);
      alert('Error al finalizar el cultivo');
    }
  };


  const handleOpenActivityHistoryModal = (cultivo: Cultivo) => {
    setSelectedCultivo(cultivo);
    setIsActivityHistoryModalOpen(true);
  };

  const handleOpenCultivoDetailsModal = (cultivo: Cultivo) => {
    setSelectedCultivoForDetails(cultivo);
    setIsCultivoDetailsModalOpen(true);
  };

  // Función removida ya que no se usa

  // Función de exportación movida al modal de detalles

  return (
    <div className="flex flex-col w-full bg-gray-50 overflow-y-auto" style={{ height: '100%' }}>
      <div className="flex flex-col flex-grow gap-6 p-6">

        {/* Header adaptable */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <h1 className="text-2xl font-bold text-left whitespace-nowrap">
            Gestión de Cultivos
          </h1>

          {/* 🔹 Botones: apilados en móvil, alineados en web */}
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto items-start">
            <CustomButton
              label="Exportar Todos"
              onClick={() => {
                const headers = ["Ficha", "Lote", "Nombre del Cultivo", "Fecha de Siembra", "Fecha de Cosecha"];
                const htmlContent = `
                  <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
                  <head><meta charset="utf-8"><title>Cultivos Export</title></head>
                  <body>
                    <table border="1">
                      <thead><tr>${headers.map((header) => `<th>${header}</th>`).join("")}</tr></thead>
                      <tbody>
                        ${cultivos.map((cultivo) => `
                          <tr>
                            <td>${cultivo.ficha}</td>
                            <td>${cultivo.lote}</td>
                            <td>${cultivo.tipoCultivo?.nombre} ${cultivo.nombrecultivo}</td>
                            <td>${cultivo.fechasiembra ? new Date(cultivo.fechasiembra).toLocaleDateString() : "Sin fecha"}</td>
                            <td>${cultivo.fechacosecha ? new Date(cultivo.fechacosecha).toLocaleDateString() : "Sin cosecha"}</td>
                          </tr>
                        `).join("")}
                      </tbody>
                    </table>
                  </body>
                  </html>
                `;

                const blob = new Blob([htmlContent], { type: "application/vnd.ms-excel" });
                const link = document.createElement("a");
                const url = URL.createObjectURL(blob);
                link.setAttribute("href", url);
                link.setAttribute("download", `cultivos_${new Date().toISOString().split("T")[0]}.xls`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
              size="md"
            />
            <CustomButton
              label="Gestion Tipo de Cultivo"
              onClick={() => setIsTipoCultivoModalOpen(true)}
              size="md"
            />
            <CustomButton
              label="Gestion de Variedad"
              onClick={() => setIsVariedadModalOpen(true)}
              size="md"
            />
            <CustomButton
              label="Registro del Cultivo"
              onClick={() => setIsCultivoModalOpen(true)}
              size="md"
            />
            <CustomButton
              label="Gestión Estados Fenológicos"
              onClick={() => setIsEstadosFenologicosModalOpen(true)}
              size="md"
            />
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4 text-center sm:text-left">
            Filtros de Búsqueda
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Buscar por Zona</label>
              <InputSearch
                placeholder="Nombre de zona..."
                value={filters.buscar || ""}
                onChange={(e) => handleFilterChange("buscar", e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Buscar por Cultivo</label>
              <InputSearch
                placeholder="Nombre de variedad o tipo..."
                value={filters.buscar_cultivo || ""}
                onChange={(e) => handleFilterChange("buscar_cultivo", e.target.value)}
              />
            </div>

            <div>
              <DateRangeInput label="Rango de Fechas" onChange={handleDateRangeChange} />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Buscar por Ficha</label>
              <InputSearch
                placeholder="Número de ficha..."
                value={filters.id_titulado || ""}
                onChange={(e) => handleFilterChange("id_titulado", e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Estado del Cultivo</label>
              <select
                className="w-64 border border-gray-300 rounded-xl h-10 "
                value={filters.estado_cultivo ?? ""}
                onChange={(e) =>
                  handleFilterChange(
                    "estado_cultivo",
                    e.target.value ? parseInt(e.target.value) : undefined
                  )
                }
              >
                <option value="">Todos</option>
                <option value="1">En Curso</option>
                <option value="0">Finalizado</option>
              </select>
            </div>


            <div className="flex gap-2 items-center mt-6">
              <CustomButton label="Buscar" onClick={handleSearch} size="sm" />
              <CustomButton
                label="Limpiar"
                onClick={clearFilters}
                size="sm"
                color="danger"
                variant="solid"
              />
            </div>
          </div>
        </div>

        {/* Tabla escritorio */}
        <div className="hidden md:block bg-white rounded-lg shadow-md flex-grow overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Resultados ({cultivos.length})</h2>
          </div>

          {loading ? (
            <div className="p-8 text-center">Cargando...</div>
          ) : (
            <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-350px)]">
              <Table
                headers={[
                  "Lote",
                  "Nombre del Cultivo",
                  "Fecha de Siembra",
                  "Fecha de Cosecha",
                  "Actividades",
                  "Finanzas",
                  "Cosecha/Venta",
                  "Información",
                ]}
              >
                {cultivos.map((cultivo, index) => (
                  <tr key={`${cultivo.cvzid}-${index}`} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2">{cultivo.lote}</td>
                    <td className="px-4 py-2">{cultivo.tipoCultivo?.nombre} {cultivo.nombrecultivo}</td>
                    <td className="px-4 py-2">
                      {cultivo.fechasiembra
                        ? new Date(cultivo.fechasiembra).toLocaleDateString()
                        : "Sin fecha"}
                    </td>
                    <td className="px-4 py-2">
                      {cultivo.fechacosecha
                        ? new Date(cultivo.fechacosecha).toLocaleDateString()
                        : "Sin cosecha"}
                    </td>
                    <td className="px-4 py-2">
                      <CustomButton label="Actividades" onClick={() => handleOpenActivityHistoryModal(cultivo)} size="sm" variant="bordered" />
                    </td>
                    <td className="px-4 py-2">
                      <CustomButton label="Financiero" onClick={() => {}} size="sm" variant="bordered" />
                    </td>
                    <td className="px-4 py-2">
                      <CustomButton
                        label="Cosecha/Venta"
                        onClick={() => handleOpenHarvestSellModal(cultivo)}
                        size="sm"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <CustomButton
                        label="Ver Detalles"
                        onClick={() => handleOpenCultivoDetailsModal(cultivo)}
                        size="sm"
                        variant="bordered"
                      />
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

        {/* Mobile Cards */}
        <div className="md:hidden bg-white rounded-lg shadow-md flex-grow overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Resultados ({cultivos.length})</h2>
          </div>

          {loading ? (
            <div className="p-8 text-center">Cargando...</div>
          ) : cultivos.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No se encontraron cultivos con los filtros aplicados.
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {cultivos.map((cultivo, index) => {
                const fields: CardField[] = [
                  { label: "Lote", value: cultivo.lote },
                  { label: "Nombre del Cultivo", value: `${cultivo.tipoCultivo?.nombre} ${cultivo.nombrecultivo}` },
                  { label: "Fecha de Siembra", value: cultivo.fechasiembra ? new Date(cultivo.fechasiembra).toLocaleDateString() : "Sin fecha" },
                  { label: "Fecha de Cosecha", value: cultivo.fechacosecha ? new Date(cultivo.fechacosecha).toLocaleDateString() : "Sin cosecha" },
                ];

                const actions: CardAction[] = [
                  {
                    label: "Actividades",
                    onClick: () => handleOpenActivityHistoryModal(cultivo),
                    size: "sm",
                    variant: "bordered",
                  },
                  {
                    label: "Financiero",
                    onClick: () => {},
                    size: "sm",
                    variant: "bordered",
                  },
                  {
                    label: "Cosecha/Venta",
                    onClick: () => handleOpenHarvestSellModal(cultivo),
                    size: "sm",
                  },
                  {
                    label: "Ver Detalles",
                    onClick: () => handleOpenCultivoDetailsModal(cultivo),
                    size: "sm",
                    variant: "bordered",
                  },
                ];

                return (
                  <MobileCard
                    key={`${cultivo.cvzid}-${index}`}
                    fields={fields}
                    actions={actions}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Modales */}
      <TipoCultivoModal
        isOpen={isTipoCultivoModalOpen}
        onClose={() => setIsTipoCultivoModalOpen(false)}
      />
      <VariedadModal
        isOpen={isVariedadModalOpen}
        onClose={() => setIsVariedadModalOpen(false)}
      />
      <CosechaModal
        isOpen={isCosechaModalOpen}
        onClose={() => setIsCosechaModalOpen(false)}
        cvzId={selectedCultivo?.cvzid || ""}
        onSuccess={handleSearch}
        isPerenne={selectedCultivo?.tipoCultivo?.esPerenne || false}
        cultivo={selectedCultivo}
      />
      <VentaModal
        isOpen={isVentaModalOpen}
        onClose={() => setIsVentaModalOpen(false)}
        cultivo={selectedCultivo}
        onSuccess={handleSearch}
      />

      <ActivityHistoryModal
        isOpen={isActivityHistoryModalOpen}
        onClose={() => setIsActivityHistoryModalOpen(false)}
        cvzId={selectedCultivo?.cvzid || ""}
        cultivoName={`${selectedCultivo?.tipoCultivo?.nombre} ${selectedCultivo?.nombrecultivo}` || ""}
      />

      <CultivoDetailsModal
        isOpen={isCultivoDetailsModalOpen}
        onClose={() => setIsCultivoDetailsModalOpen(false)}
        cultivo={selectedCultivoForDetails}
      />

      <CultivoModal
        isOpen={isCultivoModalOpen}
        onClose={() => setIsCultivoModalOpen(false)}
        onSuccess={() => handleSearch()}
      />

      <EstadosFenologicosModal
        isOpen={isEstadosFenologicosModalOpen}
        onClose={() => setIsEstadosFenologicosModalOpen(false)}
      />

      <HarvestSellModal
        isOpen={isHarvestSellModalOpen}
        onClose={() => setIsHarvestSellModalOpen(false)}
        cultivo={selectedCultivo}
        onHarvest={() => setIsCosechaModalOpen(true)}
        onSell={() => setIsVentaModalOpen(true)}
        onFinalize={() => selectedCultivo && handleFinalizeCultivo(selectedCultivo)}
        onCloseHarvest={async () => {
          if (selectedCultivo) {
            try {
              await closeAllHarvestsByCultivo(selectedCultivo.cvzid);
              console.log('Todas las cosechas cerradas para el cultivo:', selectedCultivo.cvzid);

              // For transitorio crops, also finalize the crop
              if (selectedCultivo.tipoCultivo && !selectedCultivo.tipoCultivo.esPerenne) {
                await finalizeCultivo(selectedCultivo.id);
                console.log('Cultivo transitorio finalizado:', selectedCultivo.id);
              }

              // Actualizar la lista para reflejar el cambio
              await handleSearch();
            } catch (error) {
              console.error('Error cerrando cosechas:', error);
              alert('Error al cerrar las cosechas');
            }
          }
        }}
      />
    </div>
  );
};

export default CultivosPage;
