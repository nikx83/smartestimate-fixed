/**
 * Файл: section31-clayey-soils.ts
 * Назначение: Детальные лабораторные испытания глинистых грунтов
 * 
 * Описание:
 * Расширение раздела 9 - детальная программа испытаний для глинистых грунтов
 * с определением полного комплекса физических и механических характеристик
 */

import type { 
  InstructionBlock, 
  GeologicalInput, 
  WorkItem 
} from './types';

// ============================================================================
// РАЗДЕЛ 31: ГЛИНИСТЫЕ ГРУНТЫ - ЛАБОРАТОРНЫЕ ИСПЫТАНИЯ
// ============================================================================

/**
 * Блок 31.1: Физические характеристики глинистых грунтов
 */
export const block_31_01_physical_properties: InstructionBlock = {
  id: 'block-31-01-clayey-physical',
  section: 'Раздел 31: Лабораторные испытания глинистых грунтов',
  title: 'Определение физических характеристик глинистых грунтов',
  description: 'Плотность, влажность, пластичность, консистенция',
  priority: 15,
  tags: ['лаборатория', 'глинистые', 'физические-свойства'],
  
  condition: (input: GeologicalInput) => {
    return input.soilTypes?.includes('глинистые') || 
           input.soilTypes?.includes('суглинок') ||
           input.soilTypes?.includes('супесь');
  },
  
  variants: [
    {
      id: 'variant-clayey-full-physical',
      priority: 'ОБЯЗАТЕЛЬНЫЙ',
      normative: {
        document: 'ГОСТ 5180-2015',
        section: 'Методы определения физических характеристик',
        priority: 'ОБЯЗАТЕЛЬНЫЙ'
      },
      recommendation:
        '**ФИЗИЧЕСКИЕ ХАРАКТЕРИСТИКИ ГЛИНИСТЫХ ГРУНТОВ:**\n\n' +
        
        '**1. ПЛОТНОСТЬ:**\n' +
        '- Плотность грунта ρ (г/см³)\n' +
        '- Плотность частиц грунта ρs (г/см³)\n' +
        '- Плотность сухого грунта ρd (г/см³)\n' +
        '- Метод: пикнометрический, режущее кольцо\n' +
        '- Количество определений: 3-6 на каждый ИГЭ\n\n' +
        
        '**2. ВЛАЖНОСТЬ:**\n' +
        '- Природная влажность W (%)\n' +
        '- Влажность на границе текучести WL (%)\n' +
        '- Влажность на границе раскатывания Wp (%)\n' +
        '- Метод: высушивание до постоянной массы при 105°C\n' +
        '- Количество определений: 6-12 на каждый ИГЭ\n\n' +
        
        '**3. ПОКАЗАТЕЛИ ПЛАСТИЧНОСТИ:**\n' +
        '- Число пластичности Ip = WL - Wp\n' +
        '- Показатель консистенции IL = (W - Wp) / Ip\n' +
        '- Классификация по Ip:\n' +
        '  * Ip < 1% → супесь\n' +
        '  * 1% ≤ Ip < 7% → супесь пластичная\n' +
        '  * 7% ≤ Ip < 17% → суглинок\n' +
        '  * Ip ≥ 17% → глина\n\n' +
        
        '**4. ГРАНУЛОМЕТРИЧЕСКИЙ СОСТАВ:**\n' +
        '- Ареометрический метод (для фракций <0.1 мм)\n' +
        '- Ситовый анализ (для фракций >0.1 мм)\n' +
        '- Определение содержания:\n' +
        '  * Глинистых частиц (<0.005 мм)\n' +
        '  * Пылеватых частиц (0.005-0.05 мм)\n' +
        '  * Песчаных частиц (>0.05 мм)\n\n' +
        
        '**5. КОЭФФИЦИЕНТ ПОРИСТОСТИ:**\n' +
        '- e = (ρs / ρd) - 1\n' +
        '- Степень влажности Sr = (W × ρs) / (e × ρw)\n\n' +
        
        '**ВАЖНО:** Минимум 6 определений на каждый ИГЭ для статистической обработки',
      
      recommendedValues: {
        samplesPerIGE: {
          value: 6,
          unit: 'определений',
          explanation: 'Минимум для глинистых грунтов'
        },
        testsPerSample: {
          value: 3,
          unit: 'испытаний',
          explanation: 'Повторность для каждого определения'
        }
      }
    }
  ],
  
  calculateValues: (input: GeologicalInput) => {
    const numberOfIGE = input.expectedIGE || 3;
    const samplesPerIGE = 6;
    
    return {
      totalSamples: {
        value: numberOfIGE * samplesPerIGE,
        unit: 'образцов',
        explanation: 'Общее количество образцов для физических испытаний',
        confidence: 90
      },
      densityTests: {
        value: numberOfIGE * 3,
        unit: 'определений',
        explanation: 'Определение плотности',
        confidence: 90
      },
      moistureTests: {
        value: numberOfIGE * 6,
        unit: 'определений',
        explanation: 'Определение влажности',
        confidence: 90
      },
      atterbergTests: {
        value: numberOfIGE * 6,
        unit: 'определений',
        explanation: 'Границы пластичности (Аттерберга)',
        confidence: 90
      }
    };
  },
  
  generateWorks: (input: GeologicalInput) => {
    const works: WorkItem[] = [];
    const values = block_31_01_physical_properties.calculateValues!(input);
    
    const totalTests = typeof values.totalSamples.value === 'number' 
      ? values.totalSamples.value 
      : parseInt(String(values.totalSamples.value));
    
    works.push({
      workId: 'LAB-CLAYEY-01',
      name: 'Определение физических характеристик глинистых грунтов',
      description: 
        'Плотность, влажность, границы пластичности, ' +
        'гранулометрический состав, коэффициент пористости',
      unit: 'определение',
      quantity: totalTests,
      category: 'mandatory',
      module: 'geological',
      priority: 'ОБЯЗАТЕЛЬНЫЙ',
      normativeBase: 'ГОСТ 5180-2015',
      tags: ['лаборатория', 'глинистые', 'физические'],
      priceTableCode: '1602-0701'
    });
    
    return works;
  }
};

/**
 * Блок 31.2: Компрессионные испытания
 */
export const block_31_02_compression: InstructionBlock = {
  id: 'block-31-02-clayey-compression',
  section: 'Раздел 31: Лабораторные испытания глинистых грунтов',
  title: 'Компрессионные испытания глинистых грунтов',
  description: 'Определение модуля деформации и коэффициента сжимаемости',
  priority: 16,
  tags: ['лаборатория', 'глинистые', 'компрессия', 'деформации'],
  
  condition: (input: GeologicalInput) => {
    return (input.soilTypes?.includes('глинистые') || 
            input.soilTypes?.includes('суглинок')) &&
           (input.foundationType === 'ленточный' || 
            input.foundationType === 'плитный' ||
            input.foundationType === 'столбчатый');
  },
  
  variants: [
    {
      id: 'variant-compression-standard',
      priority: 'ОБЯЗАТЕЛЬНЫЙ',
      normative: {
        document: 'ГОСТ 12248-2010',
        section: 'Метод компрессионного сжатия',
        priority: 'ОБЯЗАТЕЛЬНЫЙ'
      },
      recommendation:
        '**КОМПРЕССИОННЫЕ ИСПЫТАНИЯ:**\n\n' +
        
        '**1. ЦЕЛЬ:**\n' +
        '- Определение модуля деформации E (МПа)\n' +
        '- Коэффициент сжимаемости mv (МПа⁻¹)\n' +
        '- Коэффициент относительной сжимаемости a₀,₁₋₀,₂ (МПа⁻¹)\n' +
        '- Структурная прочность рstr (МПа)\n\n' +
        
        '**2. МЕТОДИКА:**\n' +
        '- Компрессионный прибор (одометр)\n' +
        '- Ступенчатое нагружение\n' +
        '- Ступени давления: 0.025, 0.05, 0.1, 0.2, 0.3, 0.4 МПа\n' +
        '- Выдержка до условной стабилизации осадки\n' +
        '- Построение компрессионной кривой e = f(p)\n\n' +
        
        '**3. ОПРЕДЕЛЯЕМЫЕ ПАРАМЕТРЫ:**\n' +
        '```\n' +
        'E₀ = (1 + e₀) / mv    - модуль деформации\n' +
        'mv = Δe / ((1 + e₀) × Δp) - коэффициент сжимаемости\n' +
        'a₀,₁₋₀,₂ = (e₁ - e₂) / (p₂ - p₁) - относительная сжимаемость\n' +
        '```\n\n' +
        
        '**4. КОЛИЧЕСТВО ИСПЫТАНИЙ:**\n' +
        '- Минимум 3 образца на каждый ИГЭ\n' +
        '- Дополнительно: если IL изменяется >0.25\n' +
        '- Дополнительно: если природное давление >100 кПа\n\n' +
        
        '**ВАЖНО:** Образцы ненарушенного сложения (монолиты)',
      
      recommendedValues: {
        samplesPerIGE: {
          value: 3,
          unit: 'образцов',
          explanation: 'Минимум для компрессии'
        }
      }
    }
  ],
  
  calculateValues: (input: GeologicalInput) => {
    const numberOfIGE = input.expectedIGE || 3;
    const samplesPerIGE = 3;
    
    return {
      compressionTests: {
        value: numberOfIGE * samplesPerIGE,
        unit: 'испытаний',
        explanation: 'Компрессионные испытания',
        confidence: 90
      }
    };
  },
  
  generateWorks: (input: GeologicalInput) => {
    const works: WorkItem[] = [];
    const values = block_31_02_compression.calculateValues!(input);
    
    const qty = typeof values.compressionTests.value === 'number'
      ? values.compressionTests.value
      : parseInt(String(values.compressionTests.value));
    
    works.push({
      workId: 'LAB-CLAYEY-02',
      name: 'Компрессионные испытания глинистых грунтов',
      description: 
        'Определение модуля деформации, коэффициента сжимаемости, ' +
        'структурной прочности методом одометрического сжатия',
      unit: 'испытание',
      quantity: qty,
      category: 'mandatory',
      module: 'geological',
      priority: 'ОБЯЗАТЕЛЬНЫЙ',
      normativeBase: 'ГОСТ 12248-2010, разд. 5',
      tags: ['лаборатория', 'глинистые', 'компрессия'],
      priceTableCode: '1602-0702'
    });
    
    return works;
  }
};

/**
 * Блок 31.3: Испытания на срез
 */
export const block_31_03_shear: InstructionBlock = {
  id: 'block-31-03-clayey-shear',
  section: 'Раздел 31: Лабораторные испытания глинистых грунтов',
  title: 'Испытания глинистых грунтов на срез',
  description: 'Определение прочностных характеристик: угол трения и сцепление',
  priority: 17,
  tags: ['лаборатория', 'глинистые', 'срез', 'прочность'],
  
  condition: (input: GeologicalInput) => {
    return (input.soilTypes?.includes('глинистые') || 
            input.soilTypes?.includes('суглинок')) &&
           (input.foundationType === 'ленточный' || 
            input.foundationType === 'свайный' ||
            input.numberOfFloors >= 5);
  },
  
  variants: [
    {
      id: 'variant-direct-shear',
      priority: 'ОБЯЗАТЕЛЬНЫЙ',
      normative: {
        document: 'ГОСТ 12248-2010',
        section: 'Метод одноплоскостного среза',
        priority: 'ОБЯЗАТЕЛЬНЫЙ'
      },
      recommendation:
        '**ИСПЫТАНИЯ НА СРЕЗ:**\n\n' +
        
        '**1. ОПРЕДЕЛЯЕМЫЕ ПАРАМЕТРЫ:**\n' +
        '- Угол внутреннего трения φ (град)\n' +
        '- Удельное сцепление c (кПа)\n' +
        '- Для разных состояний:\n' +
        '  * Природная влажность\n' +
        '  * Водонасыщенное состояние\n\n' +
        
        '**2. МЕТОДЫ ИСПЫТАНИЙ:**\n' +
        
        '**А. Одноплоскостной срез (метод Терцаги-Кулона):**\n' +
        '- Срез по фиксированной плоскости\n' +
        '- 3-4 образца при разных нормальных напряжениях\n' +
        '- σn = 0.1, 0.2, 0.3, 0.4 МПа\n' +
        '- Построение паспорта прочности τ = f(σn)\n' +
        '- Уравнение прочности: τ = σn × tan(φ) + c\n\n' +
        
        '**Б. Трехосное сжатие (для ответственных объектов):**\n' +
        '- Испытание в стабилометре\n' +
        '- Контроль всех напряжений\n' +
        '- Определение φ и c в условиях:\n' +
        '  * Консолидированно-дренированных (CD)\n' +
        '  * Консолидированно-недренированных (CU)\n' +
        '  * Неконсолидированно-недренированных (UU)\n\n' +
        
        '**3. КОЛИЧЕСТВО ИСПЫТАНИЙ:**\n' +
        '- Минимум 4-6 образцов на каждый ИГЭ\n' +
        '- При наличии прослоев: +2 образца\n' +
        '- При IL > 0.5: дополнительно в водонасыщенном состоянии\n\n' +
        
        '**ВАЖНО:** Для зданий >5 этажей обязательны испытания на срез',
      
      recommendedValues: {
        samplesPerIGE: {
          value: 4,
          unit: 'образцов',
          explanation: 'Минимум для определения φ и c'
        }
      }
    }
  ],
  
  calculateValues: (input: GeologicalInput) => {
    const numberOfIGE = input.expectedIGE || 3;
    let samplesPerIGE = 4;
    
    // Увеличить количество для высоток
    if (input.numberOfFloors >= 10) {
      samplesPerIGE = 6;
    }
    
    return {
      shearTests: {
        value: numberOfIGE * samplesPerIGE,
        unit: 'испытаний',
        explanation: 'Испытания на срез',
        confidence: 90
      }
    };
  },
  
  generateWorks: (input: GeologicalInput) => {
    const works: WorkItem[] = [];
    const values = block_31_03_shear.calculateValues!(input);
    
    const qty = typeof values.shearTests.value === 'number'
      ? values.shearTests.value
      : parseInt(String(values.shearTests.value));
    
    works.push({
      workId: 'LAB-CLAYEY-03',
      name: 'Испытания глинистых грунтов на срез',
      description: 
        'Определение угла внутреннего трения и удельного сцепления ' +
        'методом одноплоскостного среза',
      unit: 'испытание',
      quantity: qty,
      category: 'mandatory',
      module: 'geological',
      priority: 'ОБЯЗАТЕЛЬНЫЙ',
      normativeBase: 'ГОСТ 12248-2010, разд. 6',
      tags: ['лаборатория', 'глинистые', 'срез'],
      priceTableCode: '1602-0703'
    });
    
    return works;
  }
};

// ============================================================================
// ЭКСПОРТЫ
// ============================================================================

export const section31_blocks: InstructionBlock[] = [
  block_31_01_physical_properties,
  block_31_02_compression,
  block_31_03_shear
];

export default section31_blocks;
