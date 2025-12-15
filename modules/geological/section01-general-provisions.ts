/**
 * Файл: section01-general-provisions.ts
 * Назначение: Общие положения и нормативная база для ТЗ на ИГИ
 * 
 * Описание:
 * Реализация Раздела 1 инструкции РК - общие положения, нормативная база,
 * определение стадии проектирования и уровня ответственности объекта
 */

import type { 
  InstructionBlock, 
  GeologicalInput, 
  WorkItem 
} from './types';

// ============================================================================
// РАЗДЕЛ 1.1: НОРМАТИВНАЯ БАЗА
// ============================================================================

/**
 * Блок 1.1: Нормативная база Республики Казахстан
 */
export const block_01_01_normative_base: InstructionBlock = {
  id: 'block-01-01-normative-base-rk',
  section: 'Раздел 1: Общие положения',
  title: 'Нормативная база РК для инженерно-геологических изысканий',
  description: 'Перечень обязательных нормативных документов',
  priority: 1,
  tags: ['нормативы', 'общие-положения', 'обязательный'],
  
  condition: (input: GeologicalInput) => true,
  
  variants: [
    {
      id: 'variant-base-normatives',
      priority: 'ОБЯЗАТЕЛЬНЫЙ',
      normative: {
        document: 'Закон РК "Об архитектурной, градостроительной и строительной деятельности"',
        section: 'Статья 11-16',
        priority: 'ОБЯЗАТЕЛЬНЫЙ'
      },
      recommendation: 
        '**НОРМАТИВНАЯ БАЗА:**\n\n' +
        '**1. Законодательство РК:**\n' +
        '- Закон РК от 16.07.2001 "Об архитектурной, градостроительной и строительной деятельности"\n' +
        '- Закон РК от 16.05.2014 "О разрешениях и уведомлениях"\n\n' +
        '**2. Правила осуществления изысканий:**\n' +
        '- Правила осуществления ИГИ (Приказ №509 от 30.09.2020)\n\n' +
        '**3. Строительные нормы РК (СП РК):**\n' +
        '- СП РК 1.02-102-2014 "Инженерно-геологические изыскания"\n' +
        '- СП РК 1.02-105-2014 "Инженерные изыскания. Основные положения"\n' +
        '- СП РК 5.01-102-2013 "Основания зданий и сооружений"\n\n' +
        '**4. Ценообразование:**\n' +
        '- СЦИ РК 8.03-04-2025, Раздел 1602\n\n' +
        '**5. ГОСТы:**\n' +
        '- ГОСТ 25100-2020 "Грунты. Классификация"\n' +
        '- ГОСТ 19912-2012 "Методы полевых испытаний"\n' +
        '- ГОСТ 5686-2012 "Испытания свай"\n' +
        '- ГОСТ 12248-2010 "Лабораторные испытания"',
      note: 'Обязательно для всех ТЗ'
    }
  ],
  
  generateWorks: () => []
};

// ============================================================================
// РАЗДЕЛ 1.2: СТАДИЯ ПРОЕКТИРОВАНИЯ
// ============================================================================

/**
 * Блок 1.2: Определение стадии проектирования
 */
export const block_01_02_design_stage: InstructionBlock = {
  id: 'block-01-02-design-stage',
  section: 'Раздел 1: Общие положения',
  title: 'Стадия проектирования (ТЭО / Рабочая документация)',
  description: 'Определение стадии изысканий и корректировка объёмов работ',
  priority: 2,
  tags: ['стадия', 'проектирование', 'объёмы'],
  
  condition: (input: GeologicalInput) => !!input.designStage,
  
  variants: [
    {
      id: 'variant-pre-design-teo',
      priority: 'ОБЯЗАТЕЛЬНЫЙ',
      condition: (input) => input.designStage === 'предпроектная' || input.designStage === 'ТЭО',
      normative: {
        document: 'Правила осуществления ИГИ РК',
        section: 'Глава 2, п. 15-16',
        priority: 'ОБЯЗАТЕЛЬНЫЙ'
      },
      recommendation:
        '**ИЗЫСКАНИЯ ДЛЯ ТЭО:**\n\n' +
        '**Задачи:**\n' +
        '1. Изучение общих инженерно-геологических условий\n' +
        '2. Обоснование принципиальных решений\n' +
        '3. Выбор типа фундаментов\n\n' +
        '**Плотность сети выработок:**\n' +
        '- Снижение на 20-30% от рабочей стадии\n' +
        '- Достаточно для выбора площадки\n\n' +
        '**Лабораторные испытания:**\n' +
        '- Минимальный набор характеристик',
      recommendedValues: {
        drillingDensityCoefficient: {
          value: 0.7,
          unit: 'коэффициент',
          explanation: 'Снижение плотности сети на 30%'
        }
      }
    },
    {
      id: 'variant-working-design',
      priority: 'ОБЯЗАТЕЛЬНЫЙ',
      condition: (input) => input.designStage === 'рабочая' || input.designStage === 'РД',
      normative: {
        document: 'Правила осуществления ИГИ РК',
        section: 'Глава 4, п. 21-23',
        priority: 'ОБЯЗАТЕЛЬНЫЙ'
      },
      recommendation:
        '**ИЗЫСКАНИЯ ДЛЯ РАБОЧЕЙ ДОКУМЕНТАЦИИ:**\n\n' +
        '**Задачи:**\n' +
        '1. Детализация ИГУ конкретных участков\n' +
        '2. Выделение ИГЭ\n' +
        '3. Нормативные и расчётные характеристики\n\n' +
        '**Плотность сети:**\n' +
        '- Полная согласно СП РК 1.02-102-2014\n\n' +
        '**Лабораторные испытания:**\n' +
        '- Полный комплекс для каждого ИГЭ',
      recommendedValues: {
        drillingDensityCoefficient: {
          value: 1.0,
          unit: 'коэффициент',
          explanation: 'Полная плотность сети'
        }
      }
    }
  ],
  
  calculateValues: (input: GeologicalInput) => {
    const isPreDesign = input.designStage === 'предпроектная' || input.designStage === 'ТЭО';
    return {
      designStage: {
        value: isPreDesign ? 'предпроектная (ТЭО)' : 'рабочая',
        unit: 'стадия',
        explanation: 'Стадия проектирования',
        confidence: 100
      },
      drillingDensityCoefficient: {
        value: isPreDesign ? 0.7 : 1.0,
        unit: 'коэффициент',
        explanation: 'Корректировка плотности сети',
        confidence: 100
      }
    };
  },
  
  generateWorks: () => []
};

// ============================================================================
// РАЗДЕЛ 1.3: УРОВЕНЬ ОТВЕТСТВЕННОСТИ
// ============================================================================

/**
 * Блок 1.3: Уровень ответственности здания/сооружения
 */
export const block_01_03_responsibility_level: InstructionBlock = {
  id: 'block-01-03-responsibility-level',
  section: 'Раздел 1: Общие положения',
  title: 'Уровень ответственности здания/сооружения',
  description: 'Определение уровня ответственности согласно СП РК 5.01-102-2013',
  priority: 3,
  tags: ['ответственность', 'классификация', 'коэффициент'],
  
  condition: (input: GeologicalInput) => !!input.responsibilityLevel,
  
  variants: [
    {
      id: 'variant-elevated-responsibility',
      priority: 'ОБЯЗАТЕЛЬНЫЙ',
      condition: (input) => input.responsibilityLevel === 'I' || input.responsibilityLevel === 'повышенная',
      normative: {
        document: 'СП РК 5.01-102-2013',
        section: 'Раздел 5.1, Таблица 5.1',
        priority: 'ОБЯЗАТЕЛЬНЫЙ'
      },
      recommendation:
        '**ПОВЫШЕННЫЙ УРОВЕНЬ (I):**\n\n' +
        '**Объекты:**\n' +
        '- Уникальные здания\n' +
        '- Массовое пребывание людей (>300 чел)\n' +
        '- Опасные производства\n' +
        '- Высотные здания (>75 м)\n\n' +
        '**Требования:**\n' +
        '- Увеличение объёмов на 15-20%\n' +
        '- Дополнительные испытания\n' +
        '- γn = 1.0',
      recommendedValues: {
        volumeIncreaseFactor: {
          value: 1.2,
          unit: 'коэффициент',
          explanation: 'Увеличение объёмов на 20%'
        }
      }
    },
    {
      id: 'variant-normal-responsibility',
      priority: 'ОБЯЗАТЕЛЬНЫЙ',
      condition: (input) => input.responsibilityLevel === 'II' || input.responsibilityLevel === 'нормальная',
      normative: {
        document: 'СП РК 5.01-102-2013',
        section: 'Раздел 5.1',
        priority: 'ОБЯЗАТЕЛЬНЫЙ'
      },
      recommendation:
        '**НОРМАЛЬНЫЙ УРОВЕНЬ (II):**\n\n' +
        '**Объекты:**\n' +
        '- Жилые здания\n' +
        '- Общественные здания\n' +
        '- Производственные здания\n\n' +
        '**Требования:**\n' +
        '- Стандартные объёмы\n' +
        '- γn = 0.95',
      recommendedValues: {
        volumeIncreaseFactor: {
          value: 1.0,
          unit: 'коэффициент',
          explanation: 'Стандартный объём'
        }
      }
    },
    {
      id: 'variant-reduced-responsibility',
      priority: 'ОБЯЗАТЕЛЬНЫЙ',
      condition: (input) => input.responsibilityLevel === 'III' || input.responsibilityLevel === 'пониженная',
      normative: {
        document: 'СП РК 5.01-102-2013',
        section: 'Раздел 5.1',
        priority: 'ОБЯЗАТЕЛЬНЫЙ'
      },
      recommendation:
        '**ПОНИЖЕННЫЙ УРОВЕНЬ (III):**\n\n' +
        '**Объекты:**\n' +
        '- Временные сооружения (<5 лет)\n' +
        '- Вспомогательные постройки\n\n' +
        '**Требования:**\n' +
        '- Сокращение объёмов на 10-15%\n' +
        '- γn = 0.90',
      recommendedValues: {
        volumeIncreaseFactor: {
          value: 0.85,
          unit: 'коэффициент',
          explanation: 'Сокращение на 15%'
        }
      }
    }
  ],
  
  calculateValues: (input: GeologicalInput) => {
    let factor = 1.0;
    let gamma_n = 0.95;
    
    if (input.responsibilityLevel === 'I' || input.responsibilityLevel === 'повышенная') {
      factor = 1.2;
      gamma_n = 1.0;
    } else if (input.responsibilityLevel === 'III' || input.responsibilityLevel === 'пониженная') {
      factor = 0.85;
      gamma_n = 0.90;
    }
    
    return {
      volumeIncreaseFactor: {
        value: factor,
        unit: 'коэффициент',
        explanation: 'Корректировка объёмов',
        confidence: 100
      },
      reliabilityCoefficient: {
        value: gamma_n,
        unit: 'γn',
        explanation: 'Коэффициент надёжности',
        confidence: 100
      }
    };
  },
  
  generateWorks: () => []
};

// ============================================================================
// ЭКСПОРТЫ
// ============================================================================

export const section01_blocks: InstructionBlock[] = [
  block_01_01_normative_base,
  block_01_02_design_stage,
  block_01_03_responsibility_level
];

export default section01_blocks;

