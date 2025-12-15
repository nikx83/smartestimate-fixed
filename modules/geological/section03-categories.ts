/**
 * Файл: /modules/geological/section03-categories.ts
 * Назначение: Блоки инструкции для определения категорий сложности и геотехнических категорий
 * 
 * Описание:
 * Реализация Раздела 3 инструкции РК - определение категории сложности ИГУ
 * и геотехнической категории объекта согласно СП РК 1.02-105-2014 и СП РК 1.02-102-2014
 */

import type { InstructionBlock, GeologicalInput, InstructionVariant, WorkItem } from '../rules-engine/types';

// ============================================================================
// РАЗДЕЛ 3.1: КАТЕГОРИИ СЛОЖНОСТИ ИГУ
// ============================================================================

/**
 * Блок 3.1.1: Категория сложности I (простая)
 */
export const block_03_01_category_I: InstructionBlock = {
  id: 'block-03-01-complexity-category-I',
  section: 'Раздел 3: Определение категорий',
  title: 'Категория сложности ИГУ - I (простая)',
  description: 'Определение простой категории сложности инженерно-геологических условий',
  priority: 10,
  tags: ['категория-сложности', 'I', 'простая', 'базовый-расчёт'],
  
  condition: (input: GeologicalInput) => {
    // Условие для категории I:
    // - Один геоморфологический элемент
    // - Слабо расчлененная поверхность
    // - Не более трех литологических слоев
    // - Выдержанные характеристики грунтов
    // - Один горизонт подземных вод
    // - Опасные процессы отсутствуют
    // - Специфические грунты отсутствуют
    
    return (
      (!input.geomorphElements || input.geomorphElements === 1) &&
      (!input.lithologicLayers || input.lithologicLayers <= 3) &&
      input.soilCharacteristics === 'выдержанные' &&
      (!input.aquiferCount || input.aquiferCount === 1) &&
      (!input.hazardsDistribution || input.hazardsDistribution === 'отсутствует') &&
      (!input.specialSoilsDistribution || input.specialSoilsDistribution === 'отсутствует')
    );
  },
  
  variants: [
    {
      id: 'variant-sp-rk-105',
      priority: 'ОБЯЗАТЕЛЬНЫЙ',
      normative: {
        document: 'СП РК 1.02-105-2014',
        section: 'Приложение А, Таблица А.1',
        priority: 'ОБЯЗАТЕЛЬНЫЙ'
      },
      recommendation: 'Присвоить I категорию сложности инженерно-геологических условий. ' +
        'Характеризуется одним геоморфологическим элементом, слабо расчлененной поверхностью, ' +
        'не более трёх литологическими слоями с выдержанными характеристиками, одним горизонтом ' +
        'подземных вод, отсутствием опасных процессов и специфических грунтов.',
      recommendedValues: {
        complexityCategory: {
          value: 'I',
          unit: 'категория',
          explanation: 'Простые инженерно-геологические условия'
        }
      }
    }
  ],
  
  calculateValues: (input: GeologicalInput) => {
    return {
      complexityCategory: {
        value: 'I',
        unit: 'категория',
        explanation: 'Простые инженерно-геологические условия',
        confidence: 100
      }
    };
  }
};

/**
 * Блок 3.1.2: Категория сложности II (средняя)
 */
export const block_03_02_category_II: InstructionBlock = {
  id: 'block-03-02-complexity-category-II',
  section: 'Раздел 3: Определение категорий',
  title: 'Категория сложности ИГУ - II (средняя)',
  description: 'Определение средней категории сложности инженерно-геологических условий',
  priority: 10,
  tags: ['категория-сложности', 'II', 'средняя', 'базовый-расчёт'],
  
  condition: (input: GeologicalInput) => {
    // Условие для категории II:
    // - Несколько геоморфологических элементов одного генезиса
    // - Поверхность слаборасчлененная
    // - Не более четырех литологических слоев
    // - Закономерные изменения характеристик
    // - 2-3 горизонта подземных вод
    // - Ограниченное распространение опасных процессов
    // - Ограниченное распространение специфических грунтов
    
    const isCategoryII = (
      (input.geomorphElements === 2) ||
      (input.lithologicLayers === 4) ||
      input.soilCharacteristics === 'закономерные' ||
      (input.aquiferCount && input.aquiferCount >= 2 && input.aquiferCount <= 3) ||
      input.hazardsDistribution === 'ограниченное' ||
      input.specialSoilsDistribution === 'ограниченное'
    );
    
    // Но НЕ категория III
    const isNotCategoryIII = !(
      (input.geomorphElements && input.geomorphElements > 2) ||
      (input.lithologicLayers && input.lithologicLayers > 4) ||
      input.soilCharacteristics === 'невыдержанные' ||
      (input.aquiferCount && input.aquiferCount > 3) ||
      input.hazardsDistribution === 'широкое' ||
      input.specialSoilsDistribution === 'широкое'
    );
    
    return isCategoryII && isNotCategoryIII;
  },
  
  variants: [
    {
      id: 'variant-sp-rk-105',
      priority: 'ОБЯЗАТЕЛЬНЫЙ',
      normative: {
        document: 'СП РК 1.02-105-2014',
        section: 'Приложение А, Таблица А.1',
        priority: 'ОБЯЗАТЕЛЬНЫЙ'
      },
      recommendation: 'Присвоить II категорию сложности инженерно-геологических условий. ' +
        'Характеризуется несколькими геоморфологическими элементами одного генезиса, ' +
        'не более четырёх литологических слоёв с закономерными изменениями характеристик, ' +
        '2-3 горизонтами подземных вод, ограниченным распространением опасных процессов ' +
        'и специфических грунтов.',
      recommendedValues: {
        complexityCategory: {
          value: 'II',
          unit: 'категория',
          explanation: 'Условия средней сложности'
        }
      }
    }
  ],
  
  calculateValues: (input: GeologicalInput) => {
    return {
      complexityCategory: {
        value: 'II',
        unit: 'категория',
        explanation: 'Инженерно-геологические условия средней сложности',
        confidence: 95
      }
    };
  }
};

/**
 * Блок 3.1.3: Категория сложности III (сложная)
 */
export const block_03_03_category_III: InstructionBlock = {
  id: 'block-03-03-complexity-category-III',
  section: 'Раздел 3: Определение категорий',
  title: 'Категория сложности ИГУ - III (сложная)',
  description: 'Определение сложной категории инженерно-геологических условий',
  priority: 10,
  tags: ['категория-сложности', 'III', 'сложная', 'базовый-расчёт'],
  
  condition: (input: GeologicalInput) => {
    // Условие для категории III:
    // Хотя бы одно из условий выполнено
    return (
      (input.geomorphElements && input.geomorphElements > 2) ||
      (input.lithologicLayers && input.lithologicLayers > 4) ||
      input.soilCharacteristics === 'невыдержанные' ||
      (input.aquiferCount && input.aquiferCount > 3) ||
      input.hazardsDistribution === 'широкое' ||
      input.specialSoilsDistribution === 'широкое'
    );
  },
  
  variants: [
    {
      id: 'variant-sp-rk-105',
      priority: 'ОБЯЗАТЕЛЬНЫЙ',
      normative: {
        document: 'СП РК 1.02-105-2014',
        section: 'Приложение А, Таблица А.1',
        priority: 'ОБЯЗАТЕЛЬНЫЙ'
      },
      recommendation: 'Присвоить III категорию сложности инженерно-геологических условий. ' +
        'Характеризуется геоморфологическими элементами разного генезиса ИЛИ сильнорасчлененной поверхностью ' +
        'ИЛИ более четырёх литологических слоёв ИЛИ линзами и выклиниваниями ИЛИ невыдержанными горизонтами вод ' +
        'ИЛИ широким распространением опасных процессов ИЛИ широким распространением специфических грунтов.',
      recommendedValues: {
        complexityCategory: {
          value: 'III',
          unit: 'категория',
          explanation: 'Сложные условия'
        }
      }
    }
  ],
  
  calculateValues: (input: GeologicalInput) => {
    return {
      complexityCategory: {
        value: 'III',
        unit: 'категория',
        explanation: 'Сложные инженерно-геологические условия',
        confidence: 100
      }
    };
  }
};

// ============================================================================
// РАЗДЕЛ 3.2: ГЕОТЕХНИЧЕСКИЕ КАТЕГОРИИ
// ============================================================================

/**
 * Блок 3.2.1: Геотехническая категория I
 */
export const block_03_04_geotechnical_I: InstructionBlock = {
  id: 'block-03-04-geotechnical-category-I',
  section: 'Раздел 3: Определение категорий',
  title: 'Геотехническая категория I',
  description: 'Определение I геотехнической категории объекта',
  priority: 20,
  dependencies: ['block-03-01-complexity-category-I'], // Зависит от определения категории сложности
  tags: ['геотехническая-категория', 'I', 'базовый-расчёт'],
  
  condition: (input: GeologicalInput) => {
    return (
      input.responsibilityLevel === 'II' &&
      input.complexityCategory === 'I'
    );
  },
  
  variants: [
    {
      id: 'variant-sp-rk-102',
      priority: 'ОБЯЗАТЕЛЬНЫЙ',
      normative: {
        document: 'СП РК 1.02-102-2014',
        section: 'п. 3.8',
        priority: 'ОБЯЗАТЕЛЬНЫЙ'
      },
      recommendation: 'Присвоить I геотехническую категорию объекта строительства. ' +
        'Объект нормального уровня ответственности (II) в простых инженерно-геологических условиях (I категория сложности).',
      recommendedValues: {
        geotechnicalCategory: {
          value: 'I',
          unit: 'категория',
          explanation: 'Простые геотехнические условия, типовые решения'
        }
      }
    }
  ],
  
  calculateValues: (input: GeologicalInput) => {
    return {
      geotechnicalCategory: {
        value: 'I',
        unit: 'категория',
        explanation: 'Простые геотехнические условия',
        confidence: 100
      }
    };
  }
};

/**
 * Блок 3.2.2: Геотехническая категория II
 */
export const block_03_05_geotechnical_II: InstructionBlock = {
  id: 'block-03-05-geotechnical-category-II',
  section: 'Раздел 3: Определение категорий',
  title: 'Геотехническая категория II',
  description: 'Определение II геотехнической категории объекта',
  priority: 20,
  tags: ['геотехническая-категория', 'II', 'базовый-расчёт'],
  
  condition: (input: GeologicalInput) => {
    return (
      (input.responsibilityLevel === 'II' && input.complexityCategory === 'II') ||
      (input.responsibilityLevel === 'I' && input.complexityCategory === 'I')
    );
  },
  
  variants: [
    {
      id: 'variant-sp-rk-102',
      priority: 'ОБЯЗАТЕЛЬНЫЙ',
      normative: {
        document: 'СП РК 1.02-102-2014',
        section: 'п. 3.8',
        priority: 'ОБЯЗАТЕЛЬНЫЙ'
      },
      recommendation: 'Присвоить II геотехническую категорию объекта строительства. ' +
        'Объект нормального уровня ответственности (II) в условиях средней сложности (II категория сложности) ' +
        'ИЛИ объект повышенного уровня ответственности (I) в простых условиях (I категория сложности).',
      recommendedValues: {
        geotechnicalCategory: {
          value: 'II',
          unit: 'категория',
          explanation: 'Условия средней сложности, требуются дополнительные исследования'
        }
      }
    }
  ],
  
  calculateValues: (input: GeologicalInput) => {
    return {
      geotechnicalCategory: {
        value: 'II',
        unit: 'категория',
        explanation: 'Геотехнические условия средней сложности',
        confidence: 100
      }
    };
  }
};

/**
 * Блок 3.2.3: Геотехническая категория III
 */
export const block_03_06_geotechnical_III: InstructionBlock = {
  id: 'block-03-06-geotechnical-category-III',
  section: 'Раздел 3: Определение категорий',
  title: 'Геотехническая категория III',
  description: 'Определение III геотехнической категории объекта',
  priority: 20,
  tags: ['геотехническая-категория', 'III', 'базовый-расчёт'],
  
  condition: (input: GeologicalInput) => {
    return (
      (input.responsibilityLevel === 'I' && input.complexityCategory === 'II') ||
      input.complexityCategory === 'III' ||
      input.isUnique === true
    );
  },
  
  variants: [
    {
      id: 'variant-sp-rk-102',
      priority: 'ОБЯЗАТЕЛЬНЫЙ',
      normative: {
        document: 'СП РК 1.02-102-2014',
        section: 'п. 3.8',
        priority: 'ОБЯЗАТЕЛЬНЫЙ'
      },
      recommendation: 'Присвоить III геотехническую категорию объекта строительства. ' +
        'Объект повышенного уровня ответственности (I) в условиях средней сложности (II категория сложности) ' +
        'ИЛИ любой объект в сложных условиях (III категория сложности) ИЛИ уникальное сооружение. ' +
        'Требуется максимальный объём изысканий и специальные исследования.',
      recommendedValues: {
        geotechnicalCategory: {
          value: 'III',
          unit: 'категория',
          explanation: 'Сложные условия, максимальный объём изысканий'
        }
      },
      warnings: [
        'Для III геотехнической категории требуется максимальный объём изысканий',
        'Рекомендуется привлечение специализированных организаций',
        'Необходим детальный анализ всех опасных процессов'
      ]
    }
  ],
  
  calculateValues: (input: GeologicalInput) => {
    return {
      geotechnicalCategory: {
        value: 'III',
        unit: 'категория',
        explanation: 'Сложные геотехнические условия',
        confidence: 100
      }
    };
  }
};

// ============================================================================
// ЭКСПОРТ ВСЕХ БЛОКОВ РАЗДЕЛА 3
// ============================================================================

export const section03Blocks: InstructionBlock[] = [
  // Категории сложности ИГУ
  block_03_01_category_I,
  block_03_02_category_II,
  block_03_03_category_III,
  
  // Геотехнические категории
  block_03_04_geotechnical_I,
  block_03_05_geotechnical_II,
  block_03_06_geotechnical_III
];

export default section03Blocks;
