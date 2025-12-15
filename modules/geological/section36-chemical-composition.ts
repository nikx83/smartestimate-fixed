/**
 * Файл: section36-chemical-composition.ts
 * Назначение: Химический анализ грунтов и оценка коррозионной активности
 */

import type { 
  InstructionBlock, 
  GeologicalInput, 
  WorkItem 
} from './types';

/**
 * Блок 36.1: Водная вытяжка и химический состав
 */
export const block_36_01_water_extract: InstructionBlock = {
  id: 'block-36-01-water-extract',
  section: 'Раздел 36: Химический состав грунтов',
  title: 'Химический анализ водной вытяжки из грунтов',
  description: 'Определение растворимых солей и агрессивности к бетону',
  priority: 20,
  tags: ['лаборатория', 'химия', 'коррозия'],
  
  condition: (input: GeologicalInput) => {
    // Обязательно для всех объектов с подземными конструкциями
    return input.foundationType === 'свайный' || 
           input.foundationType === 'ленточный' ||
           input.foundationType === 'плитный' ||
           input.hasBasement === true;
  },
  
  variants: [
    {
      id: 'variant-full-chemical',
      priority: 'ОБЯЗАТЕЛЬНЫЙ',
      normative: {
        document: 'ГОСТ 25100-2020',
        section: 'Химические исследования',
        priority: 'ОБЯЗАТЕЛЬНЫЙ'
      },
      recommendation:
        '**ХИМИЧЕСКИЙ АНАЛИЗ ГРУНТОВ:**\n\n' +
        
        '**1. ВОДНАЯ ВЫТЯЖКА (1:5):**\n' +
        
        '**А. Основные показатели:**\n' +
        '- pH среды\n' +
        '- Общая минерализация (мг/л)\n' +
        '- Сухой остаток\n\n' +
        
        '**Б. Анионы:**\n' +
        '- HCO₃⁻ (гидрокарбонаты)\n' +
        '- SO₄²⁻ (сульфаты)\n' +
        '- Cl⁻ (хлориды)\n' +
        '- CO₃²⁻ (карбонаты)\n\n' +
        
        '**В. Катионы:**\n' +
        '- Ca²⁺ (кальций)\n' +
        '- Mg²⁺ (магний)\n' +
        '- Na⁺ + K⁺ (натрий + калий)\n\n' +
        
        '**2. ОЦЕНКА АГРЕССИВНОСТИ К БЕТОНУ:**\n\n' +
        
        '**Общекислотная агрессия (pH):**\n' +
        '- Слабая: pH = 4.0-5.0\n' +
        '- Средняя: pH = 3.0-4.0\n' +
        '- Сильная: pH < 3.0\n\n' +
        
        '**Сульфатная агрессия (SO₄²⁻):**\n' +
        '- Слабая: 250-500 мг/л\n' +
        '- Средняя: 500-3000 мг/л\n' +
        '- Сильная: >3000 мг/л\n\n' +
        
        '**Выщелачивающая агрессия (HCO₃⁻):**\n' +
        '- При HCO₃⁻ < 0.5 мг-экв/л\n\n' +
        
        '**Магнезиальная агрессия (Mg²⁺):**\n' +
        '- Слабая: 1000-2000 мг/л\n' +
        '- Средняя: 2000-4000 мг/л\n' +
        '- Сильная: >4000 мг/л\n\n' +
        
        '**3. ОПРЕДЕЛЕНИЕ ОРГАНИКИ:**\n' +
        '- Содержание органического вещества (%)\n' +
        '- Обязательно для торфов и заторфованных грунтов\n\n' +
        
        '**4. ЗАСОЛЕННОСТЬ:**\n' +
        '- Степень засоления по сухому остатку:\n' +
        '  * Незасоленные: <0.3%\n' +
        '  * Слабозасоленные: 0.3-0.5%\n' +
        '  * Среднезасоленные: 0.5-1.0%\n' +
        '  * Сильнозасоленные: 1.0-2.0%\n' +
        '  * Солончаки: >2.0%\n\n' +
        
        '**КОЛИЧЕСТВО АНАЛИЗОВ:**\n' +
        '- 2-3 анализа на каждый ИГЭ\n' +
        '- Дополнительно из зоны замачивания фундаментов\n' +
        '- Обязательно для глубин 0-3 м и 3-10 м',
      
      recommendedValues: {
        analysesPerIGE: {
          value: 2,
          unit: 'анализов',
          explanation: 'Минимум химических анализов'
        }
      }
    }
  ],
  
  calculateValues: (input: GeologicalInput) => {
    const numberOfIGE = input.expectedIGE || 3;
    const analysesPerIGE = 2;
    
    // Дополнительно для глубин
    const depthZones = 2; // 0-3м и 3-10м
    
    return {
      chemicalAnalyses: {
        value: numberOfIGE * analysesPerIGE + depthZones,
        unit: 'анализов',
        explanation: 'Химический анализ водной вытяжки',
        confidence: 85
      },
      corrosionAssessment: {
        value: 1,
        unit: 'объект',
        explanation: 'Оценка коррозионной активности',
        confidence: 100
      }
    };
  },
  
  generateWorks: (input: GeologicalInput) => {
    const works: WorkItem[] = [];
    const values = block_36_01_water_extract.calculateValues!(input);
    
    const qty = typeof values.chemicalAnalyses.value === 'number'
      ? values.chemicalAnalyses.value
      : parseInt(String(values.chemicalAnalyses.value));
    
    works.push({
      workId: 'LAB-CHEM-01',
      name: 'Химический анализ водной вытяжки из грунтов',
      description: 
        'Определение pH, солевого состава (SO₄²⁻, Cl⁻, HCO₃⁻, Ca²⁺, Mg²⁺, Na⁺+K⁺), ' +
        'оценка агрессивности к бетону',
      unit: 'анализ',
      quantity: qty,
      category: 'mandatory',
      module: 'geological',
      priority: 'ОБЯЗАТЕЛЬНЫЙ',
      normativeBase: 'ГОСТ 25100-2020, СП РК 2.03-01-2001',
      tags: ['лаборатория', 'химия', 'коррозия'],
      priceTableCode: '1602-0705'
    });
    
    return works;
  }
};

/**
 * Блок 36.2: Коррозионная активность к металлам
 */
export const block_36_02_metal_corrosion: InstructionBlock = {
  id: 'block-36-02-metal-corrosion',
  section: 'Раздел 36: Химический состав грунтов',
  title: 'Оценка коррозионной активности грунтов к металлам',
  description: 'Определение агрессивности к стальным конструкциям',
  priority: 21,
  tags: ['лаборатория', 'коррозия', 'металл'],
  
  condition: (input: GeologicalInput) => {
    return input.foundationType === 'свайный' || 
           input.hasUndergroundPipelines === true ||
           input.hasMetalStructures === true;
  },
  
  variants: [
    {
      id: 'variant-metal-corrosion',
      priority: 'ОБЯЗАТЕЛЬНЫЙ',
      normative: {
        document: 'ГОСТ 9.602-2016',
        section: 'Коррозионная активность',
        priority: 'ОБЯЗАТЕЛЬНЫЙ'
      },
      recommendation:
        '**КОРРОЗИОННАЯ АКТИВНОСТЬ К МЕТАЛЛАМ:**\n\n' +
        
        '**1. ОПРЕДЕЛЯЕМЫЕ ПАРАМЕТРЫ:**\n' +
        '- Удельное электрическое сопротивление ρ (Ом·м)\n' +
        '- pH среды\n' +
        '- Окислительно-восстановительный потенциал Eh (мВ)\n' +
        '- Содержание хлоридов Cl⁻\n' +
        '- Наличие микробиологической коррозии\n\n' +
        
        '**2. ОЦЕНКА СТЕПЕНИ АГРЕССИВНОСТИ:**\n\n' +
        
        '**По удельному сопротивлению ρ:**\n' +
        '```\n' +
        'Высокая:        ρ < 5 Ом·м\n' +
        'Повышенная:     5 ≤ ρ < 10 Ом·м\n' +
        'Средняя:        10 ≤ ρ < 20 Ом·м\n' +
        'Пониженная:     ρ ≥ 20 Ом·м\n' +
        '```\n\n' +
        
        '**По pH:**\n' +
        '- Кислые грунты (pH < 5.5): повышенная агрессивность\n' +
        '- Нейтральные (pH 5.5-8.5): средняя агрессивность\n' +
        '- Щелочные (pH > 8.5): пониженная агрессивность\n\n' +
        
        '**По содержанию хлоридов:**\n' +
        '- >50 мг/л: высокая коррозионная активность\n\n' +
        
        '**3. МИКРОБИОЛОГИЧЕСКАЯ КОРРОЗИЯ:**\n' +
        '- Анализ на сульфатредуцирующие бактерии (СРБ)\n' +
        '- При наличии органики и анаэробных условий\n' +
        '- Обязательно для подземных трубопроводов\n\n' +
        
        '**4. РЕКОМЕНДАЦИИ ПО ЗАЩИТЕ:**\n' +
        '- Высокая агрессивность: катодная защита + изоляция\n' +
        '- Средняя: усиленная изоляция\n' +
        '- Низкая: стандартная изоляция\n\n' +
        
        '**КОЛИЧЕСТВО:** 2-4 определения на объект',
      
      recommendedValues: {
        measurementsPerSite: {
          value: 3,
          unit: 'определений',
          explanation: 'На разных глубинах'
        }
      }
    }
  ],
  
  calculateValues: (input: GeologicalInput) => {
    const depthLevels = 3; // Обычно 3 уровня глубин
    
    return {
      corrosionTests: {
        value: depthLevels,
        unit: 'определений',
        explanation: 'Коррозионная активность к металлам',
        confidence: 85
      }
    };
  },
  
  generateWorks: (input: GeologicalInput) => {
    const works: WorkItem[] = [];
    const values = block_36_02_metal_corrosion.calculateValues!(input);
    
    const qty = typeof values.corrosionTests.value === 'number'
      ? values.corrosionTests.value
      : parseInt(String(values.corrosionTests.value));
    
    works.push({
      workId: 'LAB-CHEM-02',
      name: 'Оценка коррозионной активности грунтов к металлам',
      description: 
        'Определение удельного электрического сопротивления, pH, Eh, ' +
        'содержания хлоридов, оценка степени агрессивности',
      unit: 'определение',
      quantity: qty,
      category: 'mandatory',
      module: 'geological',
      priority: 'ОБЯЗАТЕЛЬНЫЙ',
      normativeBase: 'ГОСТ 9.602-2016',
      tags: ['лаборатория', 'коррозия', 'металл'],
      priceTableCode: '1602-0706'
    });
    
    return works;
  }
};

export const section36_blocks: InstructionBlock[] = [
  block_36_01_water_extract,
  block_36_02_metal_corrosion
];

export default section36_blocks;
