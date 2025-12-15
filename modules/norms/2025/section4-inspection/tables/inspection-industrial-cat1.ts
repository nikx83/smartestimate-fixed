/**
 * Таблица 1604-0301-01
 * Инженерное обследование одноэтажных промышленных зданий I категории
 * СЦИ РК 8.03-04-2025, Раздел 4, Глава 1
 */

export interface InspectionIndustrialCat1Price {
  code: string;
  workType: string;
  unit: string;
  heightCategory: string;
  workComplexity: 'I' | 'II' | 'III';
  pricePerUnit: number;
}

export const table1604_0301_01: InspectionIndustrialCat1Price[] = [
  {
    code: '1604-0301-01-01',
    workType: 'Инженерное обследование строительных конструкций одноэтажных промышленных зданий I категории сложности, I категория сложности работ',
    unit: '100 м³ строительного объема здания',
    heightCategory: 'до 4.5м',
    workComplexity: 'I',
    pricePerUnit: 3893
  },
  {
    code: '1604-0301-01-02',
    workType: 'Инженерное обследование строительных конструкций одноэтажных промышленных зданий I категории сложности, I категория сложности работ',
    unit: '100 м³ строительного объема здания',
    heightCategory: 'от 4.5 до 6м',
    workComplexity: 'I',
    pricePerUnit: 3315
  },
  {
    code: '1604-0301-01-03',
    workType: 'Инженерное обследование строительных конструкций одноэтажных промышленных зданий I категории сложности, I категория сложности работ',
    unit: '100 м³ строительного объема здания',
    heightCategory: 'от 6 до 10м',
    workComplexity: 'I',
    pricePerUnit: 2737
  }
];

export const metadata = {
  code: '1604-0301-01',
  name: 'Инженерное обследование одноэтажных промышленных зданий I категории',
  normDocument: 'СЦИ РК 8.03-04-2025',
  section: 'Раздел 4. Обмерные работы и обследования зданий и сооружений',
  chapter: 'Глава 1. Инженерное обследование строительных конструкций промышленных зданий',
  effectiveDate: new Date('2025-01-01'),
  notes: 'Цены без учёта НДС'
};

export default table1604_0301_01;
