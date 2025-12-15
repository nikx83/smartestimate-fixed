/**
 * Файл: section37-water-chemistry.ts
 * Назначение: Химический анализ подземных вод
 */

import type { 
  InstructionBlock, 
  GeologicalInput, 
  WorkItem 
} from './types';

/**
 * Блок 37.1: Химический анализ подземных вод
 */
export const block_37_01_water_analysis: InstructionBlock = {
  id: 'block-37-01-water-chemistry',
  section: 'Раздел 37: Химический анализ подземных вод',
  title: 'Химический анализ подземных вод',
  description: 'Определение агрессивности воды к бетону и металлам',
  priority: 22,
  tags: ['лаборатория', 'вода', 'химия', 'коррозия'],
  
  condition: (input: GeologicalInput) => {
    return input.hasGroundwater === true || 
           input.groundwaterDepth !== undefined;
  },
  
  variants: [
    {
      id: 'variant-full-water-analysis',
      priority: 'ОБЯЗАТЕЛЬНЫЙ',
      normative: {
        document: 'СП РК 2.03-01-2001',
        section: 'Агрессивность подземных вод',
        priority: 'ОБЯЗАТЕЛЬНЫЙ'
      },
      recommendation:
        '**ХИМИЧЕСКИЙ АНАЛИЗ ПОДЗЕМНЫХ ВОД:**\n\n' +
        
        '**1. ОСНОВНЫЕ ПОКАЗАТЕЛИ:**\n' +
        '- pH\n' +
        '- Общая минерализация (мг/л)\n' +
        '- Жёсткость общая (°Ж)\n' +
        '- Карбонатная жёсткость (°Ж)\n\n' +
        
        '**2. АНИОНЫ:**\n' +
        '- HCO₃⁻ (гидрокарбонаты), мг/л\n' +
        '- SO₄²⁻ (сульфаты), мг/л\n' +
        '- Cl⁻ (хлориды), мг/л\n' +
        '- CO₃²⁻ (карбонаты), мг/л\n' +
        '- NO₃⁻ (нитраты), мг/л\n' +
        '- NO₂⁻ (нитриты), мг/л\n\n' +
        
        '**3. КАТИОНЫ:**\n' +
        '- Ca²⁺ (кальций), мг/л\n' +
        '- Mg²⁺ (магний), мг/л\n' +
        '- Na⁺ + K⁺ (натрий + калий), мг/л\n' +
        '- Fe²⁺/Fe³⁺ (железо общее), мг/л\n' +
        '- NH₄⁺ (аммоний), мг/л\n\n' +
        
        '**4. АГРЕССИВНЫЕ КОМПОНЕНТЫ:**\n' +
        '- Свободная CO₂ (углекислота), мг/л\n' +
        '- Растворенный O₂ (кислород), мг/л\n' +
        '- H₂S (сероводород), мг/л\n\n' +
        
        '**5. ОЦЕНКА АГРЕССИВНОСТИ К БЕТОНУ:**\n\n' +
        
        '**Общекислотная (по pH):**\n' +
        '- Слабая: pH = 5.0-6.5\n' +
        '- Средняя: pH = 4.0-5.0\n' +
        '- Сильная: pH < 4.0\n\n' +
        
        '**Углекислотная (свободная CO₂):**\n' +
        '- Слабая: 15-30 мг/л\n' +
        '- Средняя: 30-60 мг/л\n' +
        '- Сильная: >60 мг/л\n\n' +
        
        '**Сульфатная (SO₄²⁻):**\n' +
        '- Слабая: 250-500 мг/л\n' +
        '- Средняя: 500-3000 мг/л\n' +
        '- Сильная: >3000 мг/л\n\n' +
        
        '**Магнезиальная (Mg²⁺):**\n' +
        '- Слабая: 1000-2000 мг/л\n' +
        '- Средняя: 2000-4000 мг/л\n' +
        '- Сильная: >4000 мг/л\n\n' +
        
        '**Выщелачивающая:**\n' +
        '- При HCO₃⁻ < 3 мг-экв/л (183 мг/л)\n\n' +
        
        '**6. ОЦЕНКА АГРЕССИВНОСТИ К МЕТАЛЛАМ:**\n' +
        '- pH < 6.5: повышенная коррозионная активность\n' +
        '- O₂ > 4 мг/л: усиленная коррозия\n' +
        '- Cl⁻ > 50 мг/л: питтинговая коррозия\n' +
        '- H₂S > следов: сульфидная коррозия\n\n' +
        
        '**7. САНИТАРНО-ХИМИЧЕСКИЕ ПОКАЗАТЕЛИ:**\n' +
        '- Окисляемость перманганатная\n' +
        '- БПК (биохимическое потребление кислорода)\n' +
        '- ХПК (химическое потребление кислорода)\n' +
        '- Нефтепродукты\n' +
        '- Фенолы\n\n' +
        
        '**КОЛИЧЕСТВО ПРОБ:**\n' +
        '- 1-2 пробы из каждого водоносного горизонта\n' +
        '- Отбор после откачки (прокачки скважины)\n' +
        '- В полиэтиленовые бутыли объёмом 1-1.5 л',
      
      recommendedValues: {
        samplesPerAquifer: {
          value: 2,
          unit: 'пробы',
          explanation: 'На каждый водоносный горизонт'
        }
      }
    }
  ],
  
  calculateValues: (input: GeologicalInput) => {
    const aquifers = input.numberOfAquifers || 1;
    const samplesPerAquifer = 2;
    
    return {
      waterSamples: {
        value: aquifers * samplesPerAquifer,
        unit: 'проб',
        explanation: 'Химический анализ подземных вод',
        confidence: 90
      },
      fullAnalysis: {
        value: aquifers,
        unit: 'полных анализов',
        explanation: 'Полный химический анализ (макрокомпоненты + агрессивность)',
        confidence: 90
      }
    };
  },
  
  generateWorks: (input: GeologicalInput) => {
    const works: WorkItem[] = [];
    const values = block_37_01_water_analysis.calculateValues!(input);
    
    const qty = typeof values.waterSamples.value === 'number'
      ? values.waterSamples.value
      : parseInt(String(values.waterSamples.value));
    
    works.push({
      workId: 'LAB-WATER-01',
      name: 'Химический анализ подземных вод (полный)',
      description: 
        'Определение pH, минерализации, макрокомпонентного состава, ' +
        'агрессивных компонентов (CO₂, O₂, H₂S), оценка агрессивности к бетону и металлам',
      unit: 'анализ',
      quantity: qty,
      category: 'mandatory',
      module: 'geological',
      priority: 'ОБЯЗАТЕЛЬНЫЙ',
      normativeBase: 'СП РК 2.03-01-2001, ГОСТ 31861-2012',
      tags: ['лаборатория', 'вода', 'химия'],
      priceTableCode: '1602-0707'
    });
    
    return works;
  }
};

export const section37_blocks: InstructionBlock[] = [
  block_37_01_water_analysis
];

export default section37_blocks;
