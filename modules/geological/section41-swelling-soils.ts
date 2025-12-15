/**
 * Файл: section41-swelling-soils.ts
 * Назначение: Исследование набухающих грунтов
 */

import type { 
  InstructionBlock, 
  GeologicalInput, 
  WorkItem 
} from './types';

/**
 * Блок 41.1: Выявление набухающих грунтов
 */
export const block_41_01_swelling_identification: InstructionBlock = {
  id: 'block-41-01-swelling-id',
  section: 'Раздел 41: Набухающие грунты',
  title: 'Выявление и исследование набухающих грунтов',
  description: 'Определение набухания глинистых грунтов',
  priority: 27,
  tags: ['специфические', 'набухающие', 'глинистые'],
  
  condition: (input: GeologicalInput) => {
    return (input.soilTypes?.includes('глинистые') || 
            input.soilTypes?.includes('глина')) &&
           (input.region === 'Западный Казахстан' ||
            input.region === 'Актюбинская область' ||
            input.hasSwellingRisk === true);
  },
  
  variants: [
    {
      id: 'variant-swelling-full',
      priority: 'ОБЯЗАТЕЛЬНЫЙ',
      normative: {
        document: 'ГОСТ 12248-2010',
        section: 'Испытания на набухание',
        priority: 'ОБЯЗАТЕЛЬНЫЙ'
      },
      recommendation:
        '**ИССЛЕДОВАНИЕ НАБУХАЮЩИХ ГРУНТОВ:**\n\n' +
        
        '**1. ПРИЗНАКИ НАБУХАНИЯ:**\n' +
        '- Глинистые грунты с Ip > 17%\n' +
        '- Наличие монтмориллонита в составе\n' +
        '- Низкая природная влажность W < 0.7×WL\n' +
        '- Показатель консистенции IL < 0\n' +
        '- Трещиноватость в сухом состоянии\n\n' +
        
        '**2. ЛАБОРАТОРНЫЕ ИСПЫТАНИЯ:**\n\n' +
        
        '**А. Испытание на свободное набухание:**\n' +
        '- Образец ненарушенного сложения\n' +
        '- Замачивание без нагрузки\n' +
        '- Измерение увеличения высоты образца\n' +
        '- Определение относительного набухания εsw\n\n' +
        
        '**Формула:**\n' +
        '```\n' +
        'εsw = (hsat - h₀) / h₀\n' +
        '\n' +
        'где:\n' +
        'hsat - высота образца после полного насыщения\n' +
        'h₀ - начальная высота образца\n' +
        '```\n\n' +
        
        '**Б. Испытание с нагрузкой (компрессионно-набухающее):**\n' +
        '- Образец под вертикальной нагрузкой\n' +
        '- Нагрузки: 0.05, 0.1, 0.2 МПа\n' +
        '- Замачивание под нагрузкой\n' +
        '- Определение εsw при разных давлениях\n\n' +
        
        '**В. Определение давления набухания рsw:**\n' +
        '- Образец под нагрузкой, исключающей набухание\n' +
        '- Постепенное увеличение нагрузки\n' +
        '- рsw - давление, при котором набухание прекращается\n\n' +
        
        '**3. КЛАССИФИКАЦИЯ ПО НАБУХАНИЮ:**\n\n' +
        
        '**По относительному набуханию εsw:**\n' +
        '- Ненабухающие: εsw < 0.04\n' +
        '- Слабонабухающие: 0.04 ≤ εsw < 0.08\n' +
        '- Средненабухающие: 0.08 ≤ εsw < 0.12\n' +
        '- Сильнонабухающие: εsw ≥ 0.12\n\n' +
        
        '**По давлению набухания рsw:**\n' +
        '- Слабонабухающие: рsw < 0.1 МПа\n' +
        '- Средненабухающие: 0.1 ≤ рsw < 0.3 МПа\n' +
        '- Сильнонабухающие: рsw ≥ 0.3 МПа\n\n' +
        
        '**4. РАСЧЁТ ПОДЪЁМА ФУНДАМЕНТА:**\n' +
        '```\n' +
        'Hsw = Σ(hi × εswi)\n' +
        '\n' +
        'где:\n' +
        'hi - мощность i-го набухающего слоя\n' +
        'εswi - относительное набухание i-го слоя\n' +
        '```\n\n' +
        
        '**5. ПРОТИВОНАБУХАЮЩИЕ МЕРОПРИЯТИЯ:**\n\n' +
        
        '**При слабом набухании (εsw < 0.08):**\n' +
        '- Водозащитные мероприятия (отмостка, гидроизоляция)\n' +
        '- Дренажные системы\n\n' +
        
        '**При среднем/сильном набухании:**\n' +
        '- Замена грунта на непучинистый\n' +
        '- Уплотнение с переувлажнением\n' +
        '- Химическая стабилизация (известь, цемент)\n' +
        '- Свайные фундаменты с прорезкой набухающего слоя\n' +
        '- Гибкие конструкции фундаментов\n\n' +
        
        '**6. МИНЕРАЛОГИЧЕСКИЙ АНАЛИЗ:**\n' +
        '- Обязателен для εsw > 0.08\n' +
        '- Определение содержания монтмориллонита\n' +
        '- Рентгеноструктурный анализ\n\n' +
        
        '**7. КОЛИЧЕСТВО ИСПЫТАНИЙ:**\n' +
        '- 6-12 определений на каждый набухающий слой\n' +
        '- Минимум 3 определения давления набухания\n' +
        '- Минералогический анализ: 2-3 пробы\n\n' +
        
        '**ВАЖНО:** Набухание исследуется на глубину активной зоны (обычно 5-10 м)',
      
      recommendedValues: {
        swellingTests: {
          value: 6,
          unit: 'испытаний',
          explanation: 'На каждый набухающий слой'
        },
        pressureTests: {
          value: 3,
          unit: 'определений',
          explanation: 'Определение давления набухания'
        }
      }
    }
  ],
  
  calculateValues: (input: GeologicalInput) => {
    const swellingLayers = input.expectedIGE || 2;
    const swellingTests = swellingLayers * 6;
    const pressureTests = 3;
    
    return {
      swellingTests: {
        value: swellingTests,
        unit: 'испытаний',
        explanation: 'Определение относительного набухания',
        confidence: 90
      },
      pressureDetermination: {
        value: pressureTests,
        unit: 'определений',
        explanation: 'Определение давления набухания',
        confidence: 85
      },
      mineralAnalysis: {
        value: 2,
        unit: 'анализов',
        explanation: 'Минералогический состав',
        confidence: 100
      }
    };
  },
  
  generateWorks: (input: GeologicalInput) => {
    const works: WorkItem[] = [];
    const values = block_41_01_swelling_identification.calculateValues!(input);
    
    const swellQty = typeof values.swellingTests.value === 'number'
      ? values.swellingTests.value
      : parseInt(String(values.swellingTests.value));
    
    const pressQty = typeof values.pressureDetermination.value === 'number'
      ? values.pressureDetermination.value
      : parseInt(String(values.pressureDetermination.value));
    
    works.push({
      workId: 'SPEC-SWELL-01',
      name: 'Определение относительного набухания грунтов',
      description: 
        'Компрессионно-набухающие испытания в одометре. ' +
        'Определение εsw при природной влажности и после замачивания',
      unit: 'испытание',
      quantity: swellQty,
      category: 'mandatory',
      module: 'geological',
      priority: 'ОБЯЗАТЕЛЬНЫЙ',
      normativeBase: 'ГОСТ 12248-2010, разд. 7',
      tags: ['специфические', 'набухающие', 'лаборатория'],
      priceTableCode: '1602-0709'
    });
    
    works.push({
      workId: 'SPEC-SWELL-02',
      name: 'Определение давления набухания',
      description: 
        'Испытания для определения давления рsw, исключающего набухание',
      unit: 'определение',
      quantity: pressQty,
      category: 'mandatory',
      module: 'geological',
      priority: 'ОБЯЗАТЕЛЬНЫЙ',
      normativeBase: 'ГОСТ 12248-2010',
      tags: ['специфические', 'набухающие'],
      priceTableCode: '1602-0710'
    });
    
    return works;
  }
};

export const section41_blocks: InstructionBlock[] = [
  block_41_01_swelling_identification
];

export default section41_blocks;
