/**
 * Файл: section32-sandy-soils.ts
 * Назначение: Детальные лабораторные испытания песчаных грунтов
 */

import type { 
  InstructionBlock, 
  GeologicalInput, 
  WorkItem 
} from './types';

/**
 * Блок 32.1: Физические характеристики песчаных грунтов
 */
export const block_32_01_physical_properties: InstructionBlock = {
  id: 'block-32-01-sandy-physical',
  section: 'Раздел 32: Лабораторные испытания песчаных грунтов',
  title: 'Определение физических характеристик песчаных грунтов',
  description: 'Плотность, влажность, гранулометрия',
  priority: 18,
  tags: ['лаборатория', 'песчаные', 'физические-свойства'],
  
  condition: (input: GeologicalInput) => {
    return input.soilTypes?.includes('песчаные') || 
           input.soilTypes?.includes('песок');
  },
  
  variants: [
    {
      id: 'variant-sandy-physical',
      priority: 'ОБЯЗАТЕЛЬНЫЙ',
      normative: {
        document: 'ГОСТ 5180-2015',
        section: 'Физические характеристики',
        priority: 'ОБЯЗАТЕЛЬНЫЙ'
      },
      recommendation:
        '**ФИЗИЧЕСКИЕ ХАРАКТЕРИСТИКИ ПЕСКОВ:**\n\n' +
        
        '**1. ПЛОТНОСТЬ:**\n' +
        '- Плотность грунта ρ (г/см³)\n' +
        '- Плотность частиц ρs (г/см³)\n' +
        '- Плотность сухого грунта ρd (г/см³)\n' +
        '- Коэффициент пористости e\n\n' +
        
        '**2. ГРАНУЛОМЕТРИЧЕСКИЙ СОСТАВ:**\n' +
        '- Ситовый анализ\n' +
        '- Фракции: >10, 10-5, 5-2, 2-1, 1-0.5, 0.5-0.25, 0.25-0.1, <0.1 мм\n' +
        '- Коэффициент неоднородности Cu = d60/d10\n' +
        '- Классификация:\n' +
        '  * Гравелистый: >25% частиц >2мм\n' +
        '  * Крупный: >50% частиц >0.5мм\n' +
        '  * Средней крупности: >50% частиц >0.25мм\n' +
        '  * Мелкий: >75% частиц >0.1мм\n' +
        '  * Пылеватый: >75% частиц <0.1мм\n\n' +
        
        '**3. ПЛОТНОСТЬ СЛОЖЕНИЯ:**\n' +
        '- По коэффициенту пористости e:\n' +
        '  * Плотные: e < 0.55\n' +
        '  * Средней плотности: 0.55 ≤ e ≤ 0.70\n' +
        '  * Рыхлые: e > 0.70\n\n' +
        
        '**4. СТЕПЕНЬ ВЛАЖНОСТИ:**\n' +
        '- Sr = (W × ρs) / (e × ρw)\n' +
        '- Маловлажные: Sr < 0.5\n' +
        '- Влажные: 0.5 ≤ Sr ≤ 0.8\n' +
        '- Насыщенные водой: Sr > 0.8\n\n' +
        
        '**КОЛИЧЕСТВО:** 6 определений на каждый ИГЭ',
      
      recommendedValues: {
        samplesPerIGE: {
          value: 6,
          unit: 'образцов',
          explanation: 'Для песчаных грунтов'
        }
      }
    }
  ],
  
  calculateValues: (input: GeologicalInput) => {
    const numberOfIGE = input.expectedIGE || 2;
    return {
      totalSamples: {
        value: numberOfIGE * 6,
        unit: 'образцов',
        explanation: 'Физические испытания песков',
        confidence: 90
      }
    };
  },
  
  generateWorks: (input: GeologicalInput) => {
    const works: WorkItem[] = [];
    const values = block_32_01_physical_properties.calculateValues!(input);
    
    const qty = typeof values.totalSamples.value === 'number'
      ? values.totalSamples.value
      : parseInt(String(values.totalSamples.value));
    
    works.push({
      workId: 'LAB-SANDY-01',
      name: 'Определение физических характеристик песчаных грунтов',
      description: 
        'Плотность, влажность, гранулометрический состав, ' +
        'коэффициент пористости, степень влажности',
      unit: 'определение',
      quantity: qty,
      category: 'mandatory',
      module: 'geological',
      priority: 'ОБЯЗАТЕЛЬНЫЙ',
      normativeBase: 'ГОСТ 5180-2015',
      tags: ['лаборатория', 'песчаные', 'физические'],
      priceTableCode: '1602-0701'
    });
    
    return works;
  }
};

/**
 * Блок 32.2: Угол внутреннего трения песков
 */
export const block_32_02_friction_angle: InstructionBlock = {
  id: 'block-32-02-sandy-friction',
  section: 'Раздел 32: Лабораторные испытания песчаных грунтов',
  title: 'Определение угла внутреннего трения песчаных грунтов',
  description: 'Испытания на срез в стабилометре',
  priority: 19,
  tags: ['лаборатория', 'песчаные', 'срез', 'прочность'],
  
  condition: (input: GeologicalInput) => {
    return input.soilTypes?.includes('песчаные') || 
           input.soilTypes?.includes('песок');
  },
  
  variants: [
    {
      id: 'variant-sandy-triaxial',
      priority: 'ОБЯЗАТЕЛЬНЫЙ',
      normative: {
        document: 'ГОСТ 12248-2010',
        section: 'Трехосное сжатие',
        priority: 'ОБЯЗАТЕЛЬНЫЙ'
      },
      recommendation:
        '**ОПРЕДЕЛЕНИЕ УГЛА ТРЕНИЯ φ:**\n\n' +
        
        '**1. МЕТОДЫ:**\n' +
        
        '**А. Трехосное сжатие (основной метод):**\n' +
        '- Стабилометр с измерением порового давления\n' +
        '- 3-4 образца при σ3 = 0.1, 0.2, 0.3, 0.4 МПа\n' +
        '- Определение φ в условиях:\n' +
        '  * CD (консолидированно-дренированных)\n' +
        '  * CU (консолидированно-недренированных)\n\n' +
        
        '**Б. Одноплоскостной срез (вспомогательный):**\n' +
        '- Для предварительной оценки\n' +
        '- 4 образца при разных σn\n\n' +
        
        '**2. ТИПИЧНЫЕ ЗНАЧЕНИЯ φ:**\n' +
        '- Гравелистый песок: 38-43°\n' +
        '- Крупный песок: 36-41°\n' +
        '- Средний песок: 33-38°\n' +
        '- Мелкий песок: 28-34°\n' +
        '- Пылеватый песок: 26-32°\n\n' +
        
        '**3. ВЛИЯНИЕ ПЛОТНОСТИ:**\n' +
        '- Плотные: φ выше на 3-5°\n' +
        '- Рыхлые: φ ниже на 3-5°\n\n' +
        
        '**КОЛИЧЕСТВО:** 4 испытания на ИГЭ',
      
      recommendedValues: {
        testsPerIGE: {
          value: 4,
          unit: 'испытаний',
          explanation: 'Для определения φ'
        }
      }
    }
  ],
  
  calculateValues: (input: GeologicalInput) => {
    const numberOfIGE = input.expectedIGE || 2;
    return {
      frictionTests: {
        value: numberOfIGE * 4,
        unit: 'испытаний',
        explanation: 'Определение угла трения',
        confidence: 85
      }
    };
  },
  
  generateWorks: (input: GeologicalInput) => {
    const works: WorkItem[] = [];
    const values = block_32_02_friction_angle.calculateValues!(input);
    
    const qty = typeof values.frictionTests.value === 'number'
      ? values.frictionTests.value
      : parseInt(String(values.frictionTests.value));
    
    works.push({
      workId: 'LAB-SANDY-02',
      name: 'Определение угла внутреннего трения песчаных грунтов',
      description: 
        'Трехосное сжатие в стабилометре, определение φ',
      unit: 'испытание',
      quantity: qty,
      category: 'mandatory',
      module: 'geological',
      priority: 'ОБЯЗАТЕЛЬНЫЙ',
      normativeBase: 'ГОСТ 12248-2010',
      tags: ['лаборатория', 'песчаные', 'трение'],
      priceTableCode: '1602-0703'
    });
    
    return works;
  }
};

export const section32_blocks: InstructionBlock[] = [
  block_32_01_physical_properties,
  block_32_02_friction_angle
];

export default section32_blocks;
