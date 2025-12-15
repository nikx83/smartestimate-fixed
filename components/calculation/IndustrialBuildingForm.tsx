/**
 * Путь: /components/calculation/IndustrialBuildingForm.tsx
 * Назначение: Форма ввода параметров для расчёта обследования промышленных зданий
 * Описание: Многошаговая форма с валидацией, чекбоксами коэффициентов и полями ввода
 */

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Calculator, AlertCircle } from 'lucide-react';
import type { IndustrialBuildingFormData } from '@/types/calculation';

interface IndustrialBuildingFormProps {
  onCalculate: (data: IndustrialBuildingFormData) => void;
  isCalculating: boolean;
}

export function IndustrialBuildingForm({
  onCalculate,
  isCalculating,
}: IndustrialBuildingFormProps) {
  const [formData, setFormData] = useState<IndustrialBuildingFormData>({
    buildingCategory: 'I',
    floors: 1,
    heightCategory: 'до 4.5м',
    volume: 1000,
    workComplexity: 'I',
    hasDifficultSoils: false,
    hasHazardousEquipment: false,
    isWinterConditions: false,
    isHeritageMonument: false,
    seismicity: 0,
    structureSpacing: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Валидация формы
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (formData.volume <= 0) {
      newErrors.volume = 'Объём должен быть больше 0';
    }

    if (formData.floors <= 0) {
      newErrors.floors = 'Этажность должна быть больше 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onCalculate(formData);
    }
  };

  const updateField = <K extends keyof IndustrialBuildingFormData>(
    field: K,
    value: IndustrialBuildingFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Очистить ошибку при изменении поля
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Основные характеристики здания */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Основные характеристики здания</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Категория сложности здания */}
          <div className="space-y-2">
            <Label htmlFor="buildingCategory">
              Категория сложности здания *
            </Label>
            <Select
              value={formData.buildingCategory}
              onValueChange={(value) =>
                updateField('buildingCategory', value as 'I' | 'II' | 'III')
              }
            >
              <SelectTrigger id="buildingCategory">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="I">I категория</SelectItem>
                <SelectItem value="II">II категория</SelectItem>
                <SelectItem value="III">III категория</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500">
              СЦИ РК 8.03-04-2025, Раздел 4, Таблица 1
            </p>
          </div>

          {/* Этажность */}
          <div className="space-y-2">
            <Label htmlFor="floors">
              Этажность здания *
            </Label>
            <Input
              id="floors"
              type="number"
              min="1"
              value={formData.floors}
              onChange={(e) => updateField('floors', parseInt(e.target.value) || 1)}
              className={errors.floors ? 'border-red-500' : ''}
            />
            {errors.floors && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.floors}
              </p>
            )}
            <p className="text-xs text-gray-500">
              1 = одноэтажное, 2+ = многоэтажное
            </p>
          </div>

          {/* Категория высоты */}
          <div className="space-y-2">
            <Label htmlFor="heightCategory">
              Категория высоты помещений *
            </Label>
            <Select
              value={formData.heightCategory}
              onValueChange={(value) => updateField('heightCategory', value)}
            >
              <SelectTrigger id="heightCategory">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="до 4.5м">до 4.5 м</SelectItem>
                <SelectItem value="от 4.5 до 6м">от 4.5 до 6 м</SelectItem>
                <SelectItem value="от 6 до 9м">от 6 до 9 м</SelectItem>
                <SelectItem value="от 9 до 12м">от 9 до 12 м</SelectItem>
                <SelectItem value="свыше 12м">свыше 12 м</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Строительный объём */}
          <div className="space-y-2">
            <Label htmlFor="volume">
              Строительный объём, м³ *
            </Label>
            <Input
              id="volume"
              type="number"
              min="1"
              step="0.01"
              value={formData.volume}
              onChange={(e) => updateField('volume', parseFloat(e.target.value) || 0)}
              className={errors.volume ? 'border-red-500' : ''}
            />
            {errors.volume && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.volume}
              </p>
            )}
            <p className="text-xs text-gray-500">
              Общий строительный объём здания
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Параметры работ */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Параметры работ</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Категория сложности работ */}
          <div className="space-y-2">
            <Label htmlFor="workComplexity">
              Категория сложности работ *
            </Label>
            <Select
              value={formData.workComplexity}
              onValueChange={(value) =>
                updateField('workComplexity', value as 'I' | 'II' | 'III')
              }
            >
              <SelectTrigger id="workComplexity">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="I">I категория сложности</SelectItem>
                <SelectItem value="II">II категория сложности</SelectItem>
                <SelectItem value="III">III категория сложности</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500">
              Определяется по СЦИ РК 8.03-04-2025, Раздел 4
            </p>
          </div>

          {/* Шаг несущих конструкций */}
          <div className="space-y-2">
            <Label htmlFor="structureSpacing">
              Шаг несущих конструкций (опционально)
            </Label>
            <Select
              value={formData.structureSpacing}
              onValueChange={(value) => updateField('structureSpacing', value as any)}
            >
              <SelectTrigger id="structureSpacing">
                <SelectValue placeholder="Не указано" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Не указано</SelectItem>
                <SelectItem value="до 6м">до 6 м (k=1.15)</SelectItem>
                <SelectItem value="6-12м">6-12 м (k=1.00-1.10)</SelectItem>
                <SelectItem value="свыше 12м">свыше 12 м (k=1.10)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500">
              Таблица 1, коэффициент зависит от шага конструкций
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Дополнительные условия */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Дополнительные условия
            <Badge variant="secondary" className="ml-2">
              Коэффициенты
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Сложные грунты */}
          <label className="flex items-start space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.hasDifficultSoils}
              onChange={(e) => updateField('hasDifficultSoils', e.target.checked)}
              className="mt-1"
            />
            <div className="flex-1">
              <span className="font-medium">Вечномерзлые грунты</span>
              <p className="text-xs text-gray-500">
                Коэффициент 1.20 (Таблица 2, п.1)
              </p>
            </div>
          </label>

          <Separator />

          {/* Опасное оборудование */}
          <label className="flex items-start space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.hasHazardousEquipment}
              onChange={(e) => updateField('hasHazardousEquipment', e.target.checked)}
              className="mt-1"
            />
            <div className="flex-1">
              <span className="font-medium">Опасное оборудование &gt;50%</span>
              <p className="text-xs text-gray-500">
                Коэффициент 1.15 (Таблица 2, п.2)
              </p>
            </div>
          </label>

          <Separator />

          {/* Зимние условия */}
          <label className="flex items-start space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isWinterConditions}
              onChange={(e) => updateField('isWinterConditions', e.target.checked)}
              className="mt-1"
            />
            <div className="flex-1">
              <span className="font-medium">Зимние условия</span>
              <p className="text-xs text-gray-500">
                Коэффициент 1.25 (Таблица 2, п.3)
              </p>
            </div>
          </label>

          <Separator />

          {/* Памятник архитектуры */}
          <label className="flex items-start space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isHeritageMonument}
              onChange={(e) => updateField('isHeritageMonument', e.target.checked)}
              className="mt-1"
            />
            <div className="flex-1">
              <span className="font-medium">Памятник архитектуры</span>
              <p className="text-xs text-gray-500">
                Коэффициент 1.20 (Таблица 2, п.7)
              </p>
            </div>
          </label>

          <Separator />

          {/* Сейсмичность */}
          <div className="space-y-2">
            <Label htmlFor="seismicity">Сейсмичность района</Label>
            <Select
              value={formData.seismicity.toString()}
              onValueChange={(value) =>
                updateField('seismicity', parseInt(value) as any)
              }
            >
              <SelectTrigger id="seismicity">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Не учитывать</SelectItem>
                <SelectItem value="7">7 баллов (k=1.20)</SelectItem>
                <SelectItem value="8">8 баллов (k=1.30)</SelectItem>
                <SelectItem value="9">9 баллов (k=1.40)</SelectItem>
                <SelectItem value="10">10 баллов (k=1.50)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500">
              Таблица 2, п.5 - коэффициенты по сейсмичности
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Кнопка расчёта */}
      <div className="flex justify-end">
        <Button
          type="submit"
          size="lg"
          disabled={isCalculating}
          className="w-full md:w-auto"
        >
          <Calculator className="w-4 h-4 mr-2" />
          {isCalculating ? 'Расчёт...' : 'Рассчитать стоимость'}
        </Button>
      </div>
    </form>
  );
}
