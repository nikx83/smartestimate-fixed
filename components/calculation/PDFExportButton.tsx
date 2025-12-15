/**
 * Путь: /components/calculation/PDFExportButton.tsx
 * Назначение: Кнопка экспорта результатов расчёта в PDF
 * Описание: Пока заглушка, скачивает JSON. PDF генерация будет реализована позже
 */

'use client';

import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import { useState } from 'react';
import type { CalculationResultDisplay } from '@/types/calculation';

interface PDFExportButtonProps {
  result: CalculationResultDisplay;
}

export function PDFExportButton({ result }: PDFExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);

    try {
     // TODO: Реализовать экспорт в PDF (следующий этап)
      // Пока просто имитация
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Временная заглушка - скачивание JSON
      const dataStr = JSON.stringify(result, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `estimate_${Date.now()}.json`;
      link.click();
      URL.revokeObjectURL(url);

      alert('Экспорт в PDF будет реализован на следующем этапе. Пока сохранён JSON.');
    } catch (error) {
      console.error('Ошибка экспорта:', error);
      alert('Ошибка при экспорте');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button
      onClick={handleExport}
      disabled={isExporting}
      variant="outline"
      size="lg"
      className="w-full md:w-auto"
    >
      {isExporting ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Экспорт...
        </>
      ) : (
        <>
          <Download className="w-4 h-4 mr-2" />
          Экспортировать в PDF
        </>
      )}
    </Button>
  );
}
