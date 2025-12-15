/**
 * Файл: /hooks/useGeologicalIntegration.ts
 * Назначение: Интеграция геологических изысканий с модулем смет
 */

import { useCallback } from 'react';
import { useGeologicalStore } from '@/store/geologicalStore';

/**
 * Хук интеграции геологии со сметами
 */
export function useGeologicalIntegration() {
  const geologicalStore = useGeologicalStore();
  
  /**
   * Экспорт выбранных работ в модуль смет
   */
  const exportToEstimate = useCallback(() => {
    const selectedWorks = geologicalStore.selectedWorks;
    
    // Формируем работы для экспорта
    const estimateWorks = selectedWorks.map(work => ({
      id: work.workId,
      module: work.module,
      name: work.name,
      quantity: work.quantity,
      unit: work.unit,
      category: work.category,
      normativeBase: work.normativeReference
    }));
    
    // TODO: Интеграция с calcStore
    console.log('Экспорт работ в смету:', estimateWorks);
    
    return estimateWorks;
  }, [geologicalStore.selectedWorks]);
  
  /**
   * Проверка, есть ли работы для экспорта
   */
  const hasWorksToExport = useCallback(() => {
    return geologicalStore.selectedWorks.length > 0;
  }, [geologicalStore.selectedWorks]);
  
  /**
   * Получить количество выбранных работ
   */
  const getSelectedWorksCount = useCallback(() => {
    return geologicalStore.selectedWorks.length;
  }, [geologicalStore.selectedWorks]);
  
  /**
   * Получить статистику по выбранным работам
   */
  const getExportStatistics = useCallback(() => {
    const selectedWorks = geologicalStore.selectedWorks;
    
    return {
      total: selectedWorks.length,
      mandatory: selectedWorks.filter(w => w.category === 'mandatory').length,
      recommended: selectedWorks.filter(w => w.category === 'recommended').length,
      optional: selectedWorks.filter(w => w.category === 'optional').length
    };
  }, [geologicalStore.selectedWorks]);
  
  return {
    exportToEstimate,
    hasWorksToExport,
    getSelectedWorksCount,
    getExportStatistics,
    selectedWorks: geologicalStore.selectedWorks
  };
}

export default useGeologicalIntegration;
