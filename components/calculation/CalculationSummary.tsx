/**
 * Путь: /components/calculation/CalculationSummary.tsx
 * Назначение: Компонент отображения сводки расчёта (итого, коэффициенты, метаданные)
 * Описание: Показывает итоговую стоимость, разбивку по коэффициентам и информацию о расчёте
 */

'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { TrendingUp, Percent, Calculator } from 'lucide-react';
import type { CalculationResultDisplay } from '@/types/calculation';

interface CalculationSummaryProps {
  result: CalculationResultDisplay;
}

export function CalculationSummary({ result }: CalculationSummaryProps) {
  // Форматирование чисел
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const formatCoefficient = (coef: number) => {
    return coef.toFixed(2);
  };

  // Подсчёт общего коэффициента
  const totalCoefficient = Object.values(result.coefficients).reduce(
    (acc, val) => acc * val,
    1
  );

  return (
    <div className="space-y-4">
      {/* Итоговая стоимость */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Итоговая стоимость</p>
              <p className="text-3xl font-bold text-blue-700">
                {formatPrice(result.totalCost)} ₸
              </p>
            </div>
            <TrendingUp className="w-12 h-12 text-blue-500 opacity-50" />
          </div>
        </CardContent>
      </Card>

      {/* Разбивка расчёта */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Разбивка расчёта
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Базовая цена */}
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Базовая цена</span>
            <span className="font-semibold">{formatPrice(result.basePrice)} ₸</span>
          </div>

          <Separator />

          {/* Коэффициенты */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Percent className="w-4 h-4" />
              Применённые коэффициенты
            </div>

            {Object.entries(result.coefficients).map(([key, value]) => {
              // Пропускаем базовый коэффициент 1.0
              if (value === 1.0 && key === 'base') return null;

              // Человекочитаемые названия коэффициентов
              const coefficientNames: Record<string, string> = {
                difficultSoils: 'Вечномерзлые грунты',
                hazardousEquipment: 'Опасное оборудование',
                winterConditions: 'Зимние условия',
                heritageMonument: 'Памятник архитектуры',
                seismicity: 'Сейсмичность',
                structureSpacing: 'Шаг конструкций',
                smallVolume: 'Малый объём',
              };

              return (
                <div
                  key={key}
                  className="flex justify-between items-center text-sm pl-6"
                >
                  <span className="text-gray-600">
                    {coefficientNames[key] || key}
                  </span>
                  <Badge variant="secondary">{formatCoefficient(value)}</Badge>
                </div>
              );
            })}

            <div className="flex justify-between items-center pt-2 border-t">
              <span className="font-medium text-gray-700">
                Итоговый коэффициент
              </span>
              <Badge variant="default">{formatCoefficient(totalCoefficient)}</Badge>
            </div>
          </div>

          <Separator />

          {/* Расчёт */}
          <div className="bg-gray-50 p-3 rounded-lg text-sm">
            <p className="text-gray-600 mb-1">Формула расчёта:</p>
            <p className="font-mono text-xs">
              {formatPrice(result.basePrice)} × {formatCoefficient(totalCoefficient)} ={' '}
              <span className="font-bold text-blue-700">
                {formatPrice(result.totalCost)} ₸
              </span>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Метаданные */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Раздел СЦИ РК</p>
              <p className="font-medium">{result.metadata.section}</p>
            </div>
            <div>
              <p className="text-gray-500">Версия нормативов</p>
              <p className="font-medium">{result.metadata.normVersion}</p>
            </div>
            <div>
              <p className="text-gray-500">Модуль</p>
              <p className="font-medium capitalize">{result.metadata.module}</p>
            </div>
            <div>
              <p className="text-gray-500">Дата расчёта</p>
              <p className="font-medium">
                {new Date(result.metadata.calculatedAt).toLocaleDateString('ru-RU')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
