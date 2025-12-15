/**
 * Файл: section33-coarse-soils.ts
 * Назначение: Лабораторные испытания крупнообломочных грунтов
 */

import type { 
  InstructionBlock, 
  GeologicalInput, 
  WorkItem 
} from './types';

/**
 * Блок 33.1: Испытания крупнообломочных грунтов
 */
export const block_33_01_coarse_soils: InstructionBlock = {
  id: 'block-33-01-coarse-soils',
  section: 'Раздел 33: Крупнообломочные грунты',
  title: 'Лабораторные испытания крупнообломочных грунтов',
  description: 'Определение свойств гравия, гальки, щебня, валунов',
  priority: 48,
  tags: ['лабораторные', 'крупнообломочные', 'гравий', 'галька'],
  
  condition: (input: GeologicalInput) => {
    return input.soilTypes?.includes('крупнообломочные') ||
           input.soilTypes?.includes('гравий') ||
           input.soilTypes?.includes('галька');
  },
  
  variants: [
    {
      id: 'variant-coarse-standard',
      priority: 'ОБЯЗАТЕЛЬНЫЙ',
      normative: {
        document: 'ГОСТ 25100-2020',
        section: 'Крупнообломочные грунты',
        priority: 'ОБЯЗАТЕЛЬНЫЙ'
      },
      recommendation:
        '**ЛАБОРАТОРНЫЕ ИСПЫТАНИЯ КРУПНООБЛОМОЧНЫХ ГРУНТОВ:**\n\n' +
        
        '**1. КЛАССИФИКАЦИЯ:**\n\n' +
        
        '**По размеру частиц:**\n' +
        '- Валунный грунт: d > 200 мм, >50% (масс.)\n' +
        '- Галечниковый: 10 < d ≤ 200 мм, >50%\n' +
        '- Гравийный: 2 < d ≤ 10 мм, >50%\n' +
        '- Щебенистый: угловатые частицы d > 10 мм, >50%\n' +
        '- Дресвяный: угловатые 2 < d ≤ 10 мм, >50%\n\n' +
        
        '**По заполнителю (<2 мм):**\n' +
        '- С песчаным заполнителем: >40% песка\n' +
        '- С пылевато-глинистым: >30% пылевато-глинистых\n' +
        '- Без заполнителя: <30% частиц d<2мм\n\n' +
        
        '**2. ОБЯЗАТЕЛЬНЫЕ ИСПЫТАНИЯ:**\n\n' +
        
        '**А. Гранулометрический состав:**\n' +
        '- Метод: ситовой анализ\n' +
        '- Сита: 200, 100, 40, 20, 10, 5, 2, 1, 0.5, 0.25, 0.1 мм\n' +
        '- Масса пробы: 10-50 кг (зависит от dmax)\n' +
        '- Определение: процент каждой фракции\n\n' +
        
        '**Правило отбора пробы:**\n' +
        '```\n' +
        'M ≥ 0.02 × dmax² (кг)\n' +
        '\n' +
        'где dmax - максимальный размер частиц, мм\n' +
        '\n' +
        'Пример: dmax = 100 мм\n' +
        'M ≥ 0.02 × 100² = 200 кг\n' +
        '```\n\n' +
        
        '**Б. Плотность грунта:**\n' +
        '- Метод: взвешивание в цилиндре известного объёма\n' +
        '- Объём цилиндра: 50-100 л\n' +
        '- Плотность: ρ = M / V, г/см³\n' +
        '- Влажность: W = (Mвлаг - Mсух) / Mсух × 100%\n\n' +
        
        '**В. Влажность:**\n' +
        '- Метод: высушивание до постоянной массы\n' +
        '- Температура: 105-110°C\n' +
        '- Масса пробы: 5-10 кг\n' +
        '- Время: 10-24 часа\n\n' +
        
        '**Г. Плотность частиц грунта (ρs):**\n' +
        '- Метод: пикнометрический\n' +
        '- Для фракции <10 мм\n' +
        '- Типичные значения: 2.60-2.70 г/см³\n\n' +
        
        '**3. СПЕЦИАЛЬНЫЕ ИСПЫТАНИЯ:**\n\n' +
        
        '**А. Степень влажности (Sr):**\n' +
        '```\n' +
        'Sr = (W × ρs) / (e × ρw)\n' +
        '\n' +
        'где:\n' +
        'W - влажность\n' +
        'ρs - плотность частиц\n' +
        'e - коэффициент пористости\n' +
        'ρw = 1 г/см³ - плотность воды\n' +
        '```\n\n' +
        
        '**Б. Прочность частиц:**\n' +
        '- Метод: дробимость в цилиндре\n' +
        '- Нагрузка: 5 МПа\n' +
        '- Определение: процент раздробленных частиц\n' +
        '- Классификация:\n' +
        '  * Высокопрочные: <10% дробления\n' +
        '  * Прочные: 10-20%\n' +
        '  * Средней прочности: 20-30%\n' +
        '  * Низкопрочные: >30%\n\n' +
        
        '**В. Истираемость:**\n' +
        '- Метод: во вращающемся барабане\n' +
        '- Время: 5000 оборотов\n' +
        '- Потеря массы, %\n\n' +
        
        '**Г. Морозостойкость:**\n' +
        '- Циклы замораживание-оттаивание: 15-25\n' +
        '- Потеря массы после циклов, %\n' +
        '- Важно для дорожных материалов\n\n' +
        
        '**4. ОПРЕДЕЛЕНИЕ ЗАПОЛНИТЕЛЯ:**\n\n' +
        
        '**Если заполнитель песчаный:**\n' +
        '- Испытать как песок (раздел 32)\n' +
        '- Определить: плотность сложения, угол трения\n\n' +
        
        '**Если заполнитель глинистый:**\n' +
        '- Испытать как глинистый грунт (раздел 31)\n' +
        '- Определить: W, WL, WP, IL, консистенцию\n\n' +
        
        '**5. ТИПИЧНЫЕ ХАРАКТЕРИСТИКИ:**\n\n' +
        
        '**Гравий/галька с песчаным заполнителем:**\n' +
        '- Плотность: ρ = 2.0-2.2 г/см³\n' +
        '- Угол внутреннего трения: φ = 38-45°\n' +
        '- Сцепление: c = 0\n' +
        '- Модуль деформации: E = 40-80 МПа\n' +
        '- Коэффициент фильтрации: K = 50-200 м/сут\n\n' +
        
        '**Гравий с глинистым заполнителем:**\n' +
        '- Плотность: ρ = 2.1-2.3 г/см³\n' +
        '- Угол трения: φ = 30-38°\n' +
        '- Сцепление: c = 10-30 кПа\n' +
        '- Модуль деформации: E = 30-60 МПа\n' +
        '- Коэффициент фильтрации: K = 0.5-5 м/сут\n\n' +
        
        '**6. ОСОБЕННОСТИ ОТБОРА ПРОБ:**\n' +
        '- Масса пробы: 50-200 кг\n' +
        '- Нарушенного сложения (отбор ненарушенной структуры невозможен)\n' +
        '- Метод отбора: из шурфа, канавы, с отвала\n' +
        '- Квартование для уменьшения массы\n' +
        '- Сохранение природной влажности (герметичная тара)\n\n' +
        
        '**7. КОЛИЧЕСТВО ИСПЫТАНИЙ:**\n' +
        '- Гранулометрический состав: 2-3 пробы на ИГЭ\n' +
        '- Плотность: 3-5 определений\n' +
        '- Влажность: 5-10 определений\n' +
        '- Прочность частиц: 2 пробы на ИГЭ\n\n' +
        
        '**8. ПРИМЕНЕНИЕ РЕЗУЛЬТАТОВ:**\n' +
        '- Классификация грунта\n' +
        '- Оценка несущей способности\n' +
        '- Расчёт осадок (через модуль E)\n' +
        '- Проектирование дренажа (по K)\n' +
        '- Оценка пригодности в качестве материала (дороги, насыпи)\n\n' +
        
        '**ВАЖНО:** Крупнообломочные грунты - отличные основания, но требуют правильной оценки заполнителя',
      
      recommendedValues: {
        sampleMass: {
          value: 100,
          unit: 'кг',
          explanation: 'Типичная масса пробы'
        },
        testsPerIGE: {
          value: 3,
          unit: 'проб',
          explanation: 'Минимум на ИГЭ'
        }
      }
    }
  ],
  
  calculateValues: (input: GeologicalInput) => {
    const ige = input.expectedIGE || 3;
    
    // Количество испытаний
    const grainSize = ige * 2; // гранулометрия
    const density = ige * 3;   // плотность
    const moisture = ige * 5;  // влажность
    const strength = ige * 2;  // прочность частиц
    
    const total = grainSize + density + moisture + strength;
    
    return {
      coarseGrainSize: {
        value: grainSize,
        unit: 'проб',
        explanation: 'Гранулометрический состав',
        confidence: 90
      },
      coarseDensity: {
        value: density,
        unit: 'опр.',
        explanation: 'Плотность',
        confidence: 90
      },
      coarseMoisture: {
        value: moisture,
        unit: 'опр.',
        explanation: 'Влажность',
        confidence: 90
      },
      coarseStrength: {
        value: strength,
        unit: 'проб',
        explanation: 'Прочность частиц',
        confidence: 85
      },
      totalCoarseTests: {
        value: total,
        unit: 'испытаний',
        explanation: 'Всего испытаний крупнообломочных',
        confidence: 90
      }
    };
  },
  
  generateWorks: (input: GeologicalInput) => {
    const works: WorkItem[] = [];
    const values = block_33_01_coarse_soils.calculateValues!(input);
    
    const qtyGrain = typeof values.coarseGrainSize.value === 'number'
      ? values.coarseGrainSize.value
      : parseInt(String(values.coarseGrainSize.value));
    
    const qtyDensity = typeof values.coarseDensity.value === 'number'
      ? values.coarseDensity.value
      : parseInt(String(values.coarseDensity.value));
    
    const qtyMoisture = typeof values.coarseMoisture.value === 'number'
      ? values.coarseMoisture.value
      : parseInt(String(values.coarseMoisture.value));
    
    const qtyStrength = typeof values.coarseStrength.value === 'number'
      ? values.coarseStrength.value
      : parseInt(String(values.coarseStrength.value));
    
    works.push({
      workId: 'LAB-COARSE-01',
      name: 'Гранулометрический состав крупнообломочных грунтов',
      description: 
        'Ситовой анализ (сита 200-0.1 мм). Определение процента каждой фракции. ' +
        'Масса пробы 50-200 кг',
      unit: 'проба',
      quantity: qtyGrain,
      category: 'mandatory',
      module: 'geological',
      priority: 'ОБЯЗАТЕЛЬНЫЙ',
      normativeBase: 'ГОСТ 25100-2020',
      tags: ['лабораторные', 'гранулометрия', 'крупнообломочные'],
      priceTableCode: '1602-0701'
    });
    
    works.push({
      workId: 'LAB-COARSE-02',
      name: 'Плотность крупнообломочных грунтов',
      description: 
        'Определение плотности в цилиндре объёмом 50-100 л',
      unit: 'определение',
      quantity: qtyDensity,
      category: 'mandatory',
      module: 'geological',
      priority: 'ОБЯЗАТЕЛЬНЫЙ',
      normativeBase: 'ГОСТ 5180-2015',
      tags: ['лабораторные', 'плотность'],
      priceTableCode: '1602-0702'
    });
    
    works.push({
      workId: 'LAB-COARSE-03',
      name: 'Влажность крупнообломочных грунтов',
      description: 
        'Высушивание до постоянной массы при 105-110°C',
      unit: 'определение',
      quantity: qtyMoisture,
      category: 'mandatory',
      module: 'geological',
      priority: 'ОБЯЗАТЕЛЬНЫЙ',
      normativeBase: 'ГОСТ 5180-2015',
      tags: ['лабораторные', 'влажность'],
      priceTableCode: '1602-0703'
    });
    
    works.push({
      workId: 'LAB-COARSE-04',
      name: 'Прочность частиц крупнообломочных грунтов',
      description: 
        'Испытание на дробимость в цилиндре под нагрузкой 5 МПа',
      unit: 'проба',
      quantity: qtyStrength,
      category: 'recommended',
      module: 'geological',
      priority: 'РЕКОМЕНДУЕМЫЙ',
      normativeBase: 'ГОСТ 25100-2020',
      tags: ['лабораторные', 'прочность'],
      priceTableCode: '1602-0713'
    });
    
    return works;
  }
};

export const section33_blocks: InstructionBlock[] = [
  block_33_01_coarse_soils
];

export default section33_blocks;
