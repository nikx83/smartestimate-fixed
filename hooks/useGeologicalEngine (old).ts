/**
 * Файл: /hooks/useGeologicalEngine.ts
 * Назначение: Хук для работы с Rules Engine из UI компонентов
 * 
 * Описание:
 * Обёртка над Rules Engine, интегрированная с geologicalStore.
 * Обрабатывает генерацию ТЗ, управление состоянием, обработку ошибок.
 */

'use client';

import { useCallback, useState } from 'react';
import { useGeologicalStore } from '@/store/geologicalStore';
import { createRulesEngine } from '@/modules/technical-assignment/geological/rules-engine';
import allInstructionBlocks from '@/modules/technical-assignment/geological/instructions';
import type { GeologicalInput, TechnicalAssignment } from '@/modules/technical-assignment/geological/rules-engine/types';

/**
 * Результат генерации ТЗ
 */
interface GenerationResult {
  success: boolean;
  technicalAssignment?: TechnicalAssignment;
  error?: string;
  executionTime?: number;
}

/**
 * Хук для работы с Rules Engine
 */
export function useGeologicalEngine() {
  const store = useGeologicalStore();
  const [isGenerating, setIsGenerating] = useState(false);
  
  /**
   * Генерация технического задания
   */
  const generateTechnicalAssignment = useCallback(
    async (customInput?: Partial<GeologicalInput>): Promise<GenerationResult> => {
      const startTime = Date.now();
      
      try {
        setIsGenerating(true);
        store.setGenerationStatus('processing');
        store.setGenerationError(null);
        
        // Получаем входные данные
        const input: GeologicalInput = {
          ...store.input,
          ...customInput
        } as GeologicalInput;
        
        // Валидация минимальных требований
        if (!input.projectName) {
          throw new Error('Не указано наименование проекта');
        }
        
        if (!input.objectType) {
          throw new Error('Не указан тип объекта');
        }
        
        // Создаём движок
        const engine = createRulesEngine(allInstructionBlocks, {
          strictMode: false,
          enableLogging: true,
          autoSelectHighestPriority: true
        });
        
        // Генерируем ТЗ
        const technicalAssignment = engine.generateTechnicalAssignment(input);
        
        const executionTime = Date.now() - startTime;
        
        // Сохраняем результат в store
        store.setTechnicalAssignment(technicalAssignment);
        store.setGenerationStatus('success');
        
        console.log(`✅ ТЗ сгенерировано за ${executionTime}ms`);
        console.log(`📊 Применено блоков: ${technicalAssignment.appliedBlocks.length}`);
        console.log(`🔨 Всего работ: ${technicalAssignment.works.length}`);
        
        return {
          success: true,
          technicalAssignment,
          executionTime
        };
        
      } catch (error: any) {
        const executionTime = Date.now() - startTime;
        const errorMessage = error.message || 'Неизвестная ошибка при генерации ТЗ';
        
        console.error('❌ Ошибка генерации ТЗ:', error);
        
        store.setGenerationStatus('error');
        store.setGenerationError(errorMessage);
        
        return {
          success: false,
          error: errorMessage,
          executionTime
        };
        
      } finally {
        setIsGenerating(false);
      }
    },
    [store]
  );
  
  /**
   * Пересоздать ТЗ с текущими параметрами
   */
  const regenerate = useCallback(async () => {
    return await generateTechnicalAssignment();
  }, [generateTechnicalAssignment]);
  
  /**
   * Проверка готовности к генерации
   */
  const canGenerate = useCallback((): { ready: boolean; reason?: string } => {
    const input = store.input;
    
    if (!input.projectName) {
      return { ready: false, reason: 'Не указано наименование проекта' };
    }
    
    if (!input.objectType) {
      return { ready: false, reason: 'Не выбран тип объекта' };
    }
    
    if (!input.geotechnicalCategory) {
      return { ready: false, reason: 'Не определена геотехническая категория' };
    }
    
    if (!input.responsibilityLevel) {
      return { ready: false, reason: 'Не указан уровень ответственности' };
    }
    
    return { ready: true };
  }, [store.input]);
  
  /**
   * Получить краткую статистику по текущему ТЗ
   */
  const getStatistics = useCallback(() => {
    const ta = store.technicalAssignment;
    
    if (!ta) {
      return null;
    }
    
    return {
      totalBlocks: ta.statistics.totalBlocksChecked,
      appliedBlocks: ta.statistics.appliedBlocksCount,
      totalWorks: ta.statistics.totalWorks,
      mandatoryWorks: ta.statistics.mandatoryWorks,
      recommendedWorks: ta.statistics.recommendedWorks,
      recommendations: ta.recommendations.length,
      warnings: ta.warnings.length
    };
  }, [store.technicalAssignment]);
  
  /**
   * Получить работы по модулю
   */
  const getWorksByModule = useCallback((module: string) => {
    const ta = store.technicalAssignment;
    
    if (!ta) {
      return [];
    }
    
    return ta.works.filter(work => work.module === module);
  }, [store.technicalAssignment]);
  
  /**
   * Получить работы по категории
   */
  const getWorksByCategory = useCallback((category: 'mandatory' | 'recommended' | 'optional') => {
    const ta = store.technicalAssignment;
    
    if (!ta) {
      return [];
    }
    
    return ta.works.filter(work => work.category === category);
  }, [store.technicalAssignment]);
  
  /**
   * Очистить результаты генерации
   */
  const clearResults = useCallback(() => {
    store.setTechnicalAssignment(null);
    store.setGenerationStatus('idle');
    store.setGenerationError(null);
  }, [store]);
  
  return {
    // Основные методы
    generateTechnicalAssignment,
    regenerate,
    clearResults,
    
    // Проверки
    canGenerate,
    isGenerating,
    
    // Данные
    technicalAssignment: store.technicalAssignment,
    generationStatus: store.generationStatus,
    generationError: store.generationError,
    
    // Статистика и фильтры
    getStatistics,
    getWorksByModule,
    getWorksByCategory
  };
}

export default useGeologicalEngine;
