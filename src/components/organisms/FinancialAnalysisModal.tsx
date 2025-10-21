import React, { useState, useEffect } from 'react';
import apiClient from '../../lib/axios/axios';

interface FinanzasCosecha {
  id: string;
  fkCosechaId: string;
  cantidadCosechada: number;
  precioPorKilo: number;
  fechaVenta?: string;
  cantidadVendida: number;
  costoInventario: number;
  costoManoObra: number;
  costoTotalProduccion: number;
  ingresosTotales: number;
  ganancias: number;
  margenGanancia: number;
  fechaCalculo: string;
  cosecha?: {
    fecha?: string;
  };
}

interface FinancialAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  cosechaId?: string;
  cultivoId?: string;
}

export const FinancialAnalysisModal: React.FC<FinancialAnalysisModalProps> = ({
  isOpen,
  onClose,
  cosechaId,
  cultivoId
}) => {
  const [finanzas, setFinanzas] = useState<FinanzasCosecha | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && (cosechaId || cultivoId)) {
      loadFinancialData();
    }
  }, [isOpen, cosechaId, cultivoId]);

  const loadFinancialData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Si tenemos cultivoId, usar análisis dinámico del cultivo completo
      // Si solo tenemos cosechaId, usar análisis de cosecha individual
      const endpoint = cultivoId
        ? `/finanzas/cultivo/${cultivoId}/dinamico`
        : `/finanzas/cosecha/${cosechaId}/calcular`;

      const response = await apiClient.get(endpoint);
      setFinanzas(response.data);
    } catch (err) {
      setError('Error al cargar los datos financieros');
      console.error('Error loading financial data:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('es-CO').format(num);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="h-6 w-6 bg-green-600 rounded text-white flex items-center justify-center font-bold">💰</div>
            <h2 className="text-2xl font-bold text-gray-900">
              {cultivoId ? 'Análisis Financiero del Cultivo' : 'Análisis Financiero de Cosecha'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              <span className="ml-3 text-gray-600">Calculando análisis financiero...</span>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {finanzas && (
            <div className="space-y-6">
              {/* Resumen Ejecutivo */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 bg-blue-600 rounded text-white flex items-center justify-center">📦</div>
                    <div>
                      <p className="text-sm font-medium text-blue-600">Producción</p>
                      <p className="text-2xl font-bold text-blue-900">
                        {formatNumber(finanzas.cantidadCosechada)} KG
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 p-6 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 bg-green-600 rounded text-white flex items-center justify-center">💵</div>
                    <div>
                      <p className="text-sm font-medium text-green-600">Ingresos Totales</p>
                      <p className="text-2xl font-bold text-green-900">
                        {formatCurrency(finanzas.ingresosTotales)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className={`p-6 rounded-lg ${finanzas.ganancias >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
                  <div className="flex items-center space-x-3">
                    <div className={`h-8 w-8 rounded text-white flex items-center justify-center ${finanzas.ganancias >= 0 ? 'bg-green-600' : 'bg-red-600'}`}>
                      {finanzas.ganancias >= 0 ? '📈' : '📉'}
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${finanzas.ganancias >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {finanzas.ganancias >= 0 ? 'Ganancias' : 'Pérdidas'}
                      </p>
                      <p className={`text-2xl font-bold ${finanzas.ganancias >= 0 ? 'text-green-900' : 'text-red-900'}`}>
                        {formatCurrency(Math.abs(finanzas.ganancias))}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Gráfico de Inversión vs Ganancias */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Distribución: Inversión vs Resultados
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Costo de Producción</span>
                    <span className="text-sm font-bold text-gray-900">
                      {formatCurrency(finanzas.costoTotalProduccion)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                      className="bg-blue-600 h-4 rounded-full"
                      style={{
                        width: `${finanzas.costoTotalProduccion > 0 ?
                          (finanzas.costoTotalProduccion / (finanzas.costoTotalProduccion + finanzas.ingresosTotales)) * 100 : 0}%`
                      }}
                    ></div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Ingresos por Ventas</span>
                    <span className="text-sm font-bold text-gray-900">
                      {formatCurrency(finanzas.ingresosTotales)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                      className="bg-green-600 h-4 rounded-full"
                      style={{
                        width: `${finanzas.ingresosTotales > 0 ?
                          (finanzas.ingresosTotales / (finanzas.costoTotalProduccion + finanzas.ingresosTotales)) * 100 : 0}%`
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Tabla Detallada */}
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Detalle Financiero
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Concepto
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Cantidad
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Valor Unitario
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          Producción Cosechada
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                          {formatNumber(finanzas.cantidadCosechada)} KG
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                          {formatCurrency(finanzas.precioPorKilo)}/KG
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900">
                          {formatCurrency(finanzas.cantidadCosechada * finanzas.precioPorKilo)}
                        </td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          Cantidad Vendida
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                          {formatNumber(finanzas.cantidadVendida)} KG
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                          {formatCurrency(finanzas.precioPorKilo)}/KG
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900">
                          {formatCurrency(finanzas.ingresosTotales)}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">
                          Costo Inventario
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                          -
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                          -
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-red-600">
                          -{formatCurrency(finanzas.costoInventario)}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">
                          Costo Mano de Obra
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                          -
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                          -
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-red-600">
                          -{formatCurrency(finanzas.costoManoObra)}
                        </td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                          Resultado Final
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                          -
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                          -
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-bold ${
                          finanzas.ganancias >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {finanzas.ganancias >= 0 ? '+' : ''}{formatCurrency(finanzas.ganancias)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Métricas Adicionales */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Margen de Ganancia</h4>
                  <p className={`text-2xl font-bold ${finanzas.margenGanancia >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {typeof finanzas.margenGanancia === 'number' ? finanzas.margenGanancia.toFixed(2) : '0.00'}%
                  </p>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Eficiencia de Ventas</h4>
                  <p className="text-2xl font-bold text-blue-600">
                    {finanzas.cantidadCosechada > 0 ?
                      ((finanzas.cantidadVendida / finanzas.cantidadCosechada) * 100).toFixed(1) : 0}%
                  </p>
                  <p className="text-sm text-gray-600">
                    {formatNumber(finanzas.cantidadVendida)} de {formatNumber(finanzas.cantidadCosechada)} KG vendidos
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Cerrar
          </button>
          <button
            onClick={loadFinancialData}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
          >
            {loading ? 'Recalculando...' : 'Recalcular'}
          </button>
        </div>
      </div>
    </div>
  );
};