/**
 * Путь: /app/calculation/inspection/industrial/page.tsx
 * Назначение: Страница расчёта обследования промышленных зданий
 * Описание: Основная страница с формой, результатами и интеграцией с расчётным модулем
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { IndustrialBuildingForm } from '@/components/calculation/IndustrialBuildingForm';
import { CalculationSummary } from '@/components/calculation/CalculationSummary';
import { EstimateTable } from '@/components/calculation/EstimateTable';
import { PDFExportButton } from '@/components/calculation/PDFExportButton';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type {
  IndustrialBuildingFormData,
  CalculationResultDisplay,
} from '@/types/calculation';

// Импортируем расчётный модуль
import { calculateIndustrialInspection } from '@/modules/calculations/inspection/industrial';

export default function IndustrialInspectionPage() {
  const [result, setResult] = useState<CalculationResultDisplay | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = async (formData: IndustrialBuildingFormData) => {
    setIsCalculating(true);
    setError(null);

    try {
      // Вызываем расчётный модуль
      const calculationResult = await calculateIndustrialInspection({
        buildingCategory: formData.buildingCategory,
        floors: formData.floors,
        heightCategory: formData.heightCategory,
        volume: formData.volume,
        workComplexity: formData.workComplexity,
        hasDifficultSoils: formData.hasDifficultSoils,
        hasHazardousEquipment: formData.hasHazardousEquipment,
        isWinterConditions: formData.isWinterConditions,
        isHeritageMonument: formData.isHeritageMonument,
        seismicity: formData.seismicity || undefined,
        structureSpacing: formData.structureSpacing || undefined,
      });

      // Преобразуем результат для UI
      const displayResult: CalculationResultDisplay = {
        ...calculationResult,
        items: calculationResult.items.map((item) => ({
          ...item,
          notes: undefined,
        })),
      };

      setResult(displayResult);

      // Прокрутка к результатам
      setTimeout(() => {
        document.getElementById('results')?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 100);
    } catch (err: any) {
      setError(err.message || 'Произошла ошибка при расчёте');
      console.error('Ошибка расчёта:', err);
    } finally {
      setIsCalculating(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          href="/calculation/inspection"
          className="inline-flex items-center text-sm text-gray-600 hover:text-blue-600"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Назад к выбору типа здания
        </Link>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Обследование промышленных зданий
        </h1>
        <p className="mt-2 text-gray-600">
          Расчёт стоимости по СЦИ РК 8.03-04-2025, Раздел 4, Таблицы 1604-0301 до 1604-0306
        </p>
      </div>

      {/* Ошибка */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Успех */}
      {result && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Расчёт выполнен успешно! Итоговая стоимость:{' '}
            <strong>
              {new Intl.NumberFormat('ru-RU', {
                minimumFractionDigits: 2,
              }).format(result.totalCost)}{' '}
              ₸
            </strong>
          </AlertDescription>
        </Alert>
      )}

      <Separator />

      {/* Форма */}
      {!result && (
        <IndustrialBuildingForm
          onCalculate={handleCalculate}
          isCalculating={isCalculating}
        />
      )}

      {/* Результаты */}
      {result && (
        <div id="results" className="space-y-6">
          {/* Действия */}
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <button
              onClick={handleReset}
              className="text-sm text-gray-600 hover:text-blue-600 underline"
            >
              Выполнить новый расчёт
            </button>
            <PDFExportButton result={result} />
          </div>

          {/* Grid с результатами */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Левая колонка - Сводка */}
            <div className="lg:col-span-1">
              <CalculationSummary result={result} />
            </div>

            {/* Правая колонка - Таблица сметы */}
            <div className="lg:col-span-2">
              <EstimateTable items={result.items} totalCost={result.totalCost} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
