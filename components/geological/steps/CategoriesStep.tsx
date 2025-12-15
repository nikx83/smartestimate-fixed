/**
 * Файл: /components/geological/steps/CategoriesStep.tsx
 * Назначение: Шаг 3 - Определение категорий сложности с AI-рекомендациями
 */

'use client';

import { useGeologicalStore } from '@/store/geologicalStore';
import { useState, useEffect } from 'react';

// Логика рекомендаций вынесена в отдельную функцию для переиспользования
function getRecommendedCategories(input: any) {
  let geotechCategory: 'I' | 'II' | 'III' = 'II';
  let geotechReason = '';
  let geotechConfidence: 'high' | 'medium' | 'low' = 'medium';
  
  let responsibility: 'I' | 'II' | 'III' = 'II';
  let responsibilityReason = '';
  let responsibilityNorm = 'СП РК 2.01-101-2013';
  
  // Геотехническая категория
  if (input.objectType === 'площадной' && input.floors) {
    if (input.floors <= 3) {
      geotechCategory = 'I';
      geotechReason = 'Малоэтажное здание - простые условия';
      geotechConfidence = 'high';
    } else if (input.floors >= 9) {
      geotechCategory = 'II';
      geotechReason = 'Многоэтажное здание - требуется детальное изучение';
      geotechConfidence = 'high';
    }
  }
  
  if (input.objectType === 'линейный') {
    if (input.linearType === 'трубопровод' && input.pipelineDiameter > 1000) {
      geotechCategory = 'III';
      geotechReason = 'Магистральный трубопровод - сложные условия';
      geotechConfidence = 'high';
    } else {
      geotechCategory = 'II';
      geotechReason = 'Линейные объекты - средняя категория';
      geotechConfidence = 'medium';
    }
  }
  
  // Уровень ответственности
  if (input.floors >= 16) {
    responsibility = 'I';
    responsibilityReason = 'Высотное здание (>16 этажей) - повышенная ответственность';
  } else if (input.buildingPurpose === 'промышленное') {
    responsibility = 'II';
    responsibilityReason = 'Промышленное здание - нормальная ответственность';
  } else if (input.buildingPurpose === 'жилое' && input.floors >= 9) {
    responsibility = 'II';
    responsibilityReason = 'Многоквартирный дом - нормальная ответственность';
  } else if (input.buildingPurpose === 'жилое' && input.floors < 9) {
    responsibility = 'III';
    responsibilityReason = 'Малоэтажное жилье - пониженная ответственность';
  } else if (input.buildingPurpose === 'гидротехническое') {
    responsibility = 'I';
    responsibilityReason = 'Гидротехническое сооружение - повышенная ответственность';
    responsibilityNorm = 'СП РК 2.06-04-2011';
  }
  
  return {
    geotechnical: { category: geotechCategory, reason: geotechReason, confidence: geotechConfidence },
    responsibility: { level: responsibility, reason: responsibilityReason, normative: responsibilityNorm }
  };
}

export function CategoriesStep() {
  const { input, updateInputField } = useGeologicalStore();
  const [manualMode, setManualMode] = useState(false);
  
  const recommendations = getRecommendedCategories(input);
  
  // Автоприменение при первом заходе
  useEffect(() => {
    if (!input.geotechnicalCategory && !manualMode) {
      updateInputField('geotechnicalCategory', recommendations.geotechnical.category);
    }
    if (!input.responsibilityLevel && !manualMode) {
      updateInputField('responsibilityLevel', recommendations.responsibility.level);
    }
  }, []);
  
  const applyRecommendations = () => {
    updateInputField('geotechnicalCategory', recommendations.geotechnical.category);
    updateInputField('responsibilityLevel', recommendations.responsibility.level);
    setManualMode(false);
  };
  
  return (
    <div className="space-y-6">
      {/* Панель управления */}
      <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">💡</span>
          <div>
            <div className="font-medium text-blue-900">
              {manualMode ? 'Ручной режим' : 'Режим рекомендаций'}
            </div>
            <div className="text-sm text-blue-700">
              {manualMode ? 'Выбирайте самостоятельно' : 'Оптимальные значения на основе данных'}
            </div>
          </div>
        </div>
        
        <button
          onClick={() => setManualMode(!manualMode)}
          className="px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100 rounded-lg"
        >
          {manualMode ? 'Включить рекомендации' : 'Выбрать вручную'}
        </button>
      </div>
      
      {/* Геотехническая категория */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Геотехническая категория <span className="text-red-500">*</span>
        </label>
        
        {!manualMode && (
          <div className="mb-3 p-3 bg-green-50 border border-green-300 rounded-lg">
            <div className="font-medium text-gray-900">✅ Рекомендуется: Категория {recommendations.geotechnical.category}</div>
            <div className="text-sm text-gray-600 mt-1">{recommendations.geotechnical.reason}</div>
          </div>
        )}
        
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: 'I', label: 'Категория I', desc: 'Простые условия' },
            { value: 'II', label: 'Категория II', desc: 'Средняя сложность' },
            { value: 'III', label: 'Категория III', desc: 'Сложные условия' }
          ].map(opt => (
            <button
              key={opt.value}
              onClick={() => { updateInputField('geotechnicalCategory', opt.value as any); setManualMode(true); }}
              className={`p-4 border-2 rounded-lg ${
                input.geotechnicalCategory === opt.value
                  ? 'border-blue-500 bg-blue-50'
                  : opt.value === recommendations.geotechnical.category && !manualMode
                  ? 'border-green-400 bg-green-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="font-medium">{opt.label}</div>
              <div className="text-sm text-gray-600">{opt.desc}</div>
            </button>
          ))}
        </div>
      </div>
      
      {/* Уровень ответственности */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Уровень ответственности <span className="text-red-500">*</span>
        </label>
        
        {!manualMode && (
          <div className="mb-3 p-3 bg-blue-50 border border-blue-300 rounded-lg">
            <div className="font-medium text-gray-900">📋 Рекомендуется: {recommendations.responsibility.level} - {
              recommendations.responsibility.level === 'I' ? 'Повышенная' :
              recommendations.responsibility.level === 'II' ? 'Нормальная' : 'Пониженная'
            }</div>
            <div className="text-sm text-gray-600 mt-1">{recommendations.responsibility.reason}</div>
            <div className="text-xs text-blue-600 mt-1">📖 {recommendations.responsibility.normative}</div>
          </div>
        )}
        
        <div className="space-y-2">
          {[
            { value: 'I', label: 'I - Повышенная', desc: 'Уникальные здания, высотки >16 этажей' },
            { value: 'II', label: 'II - Нормальная', desc: 'Типовые жилые и общественные' },
            { value: 'III', label: 'III - Пониженная', desc: 'Малоэтажные, временные' }
          ].map(opt => (
            <button
              key={opt.value}
              onClick={() => { updateInputField('responsibilityLevel', opt.value as any); setManualMode(true); }}
              className={`w-full p-4 border-2 rounded-lg text-left ${
                input.responsibilityLevel === opt.value
                  ? 'border-blue-500 bg-blue-50'
                  : opt.value === recommendations.responsibility.level && !manualMode
                  ? 'border-green-400 bg-green-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="font-medium">{opt.label}</div>
              <div className="text-sm text-gray-600">{opt.desc}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
