/**
 * Файл: instruction-blocks-registry.ts
 * Назначение: Центральный реестр всех блоков инструкции
 * 
 * Описание:
 * Собирает все блоки из всех разделов инструкции в единый массив
 * для использования в Rules Engine
 */

import type { InstructionBlock } from './types';

// Импорт разделов
import section01_blocks from './section01-general-provisions';
import section02_blocks from './section02-reconnaissance';
import section03_blocks from './section03-categories';
import section04_blocks from './section04-work-sequence';
import section05_blocks from './section05-drilling-areal';
import section06_blocks from './section06-linear';
import section07_blocks from './section07-survey';
import section08_blocks from './section08-drilling-methods';
import section09_blocks from './section09-laboratory';
import section10_blocks from './section10-hydrogeology';
import section11_blocks from './section11-field-tests';
import section12_blocks from './section12-specific-soils';
import section13_blocks from './section13-hazards';
import section14_blocks from './section14-geophysics';
import section15_blocks from './section15-construction';
import section16_blocks from './section16-organizational';
import section17_blocks from './section17-filtration-tests';
import section18_blocks from './section18-static-penetration';
import section19_blocks from './section19-dynamic-penetration';
import section20_blocks from './section20-plate-load-tests';
import section21_blocks from './section21-screw-plate-tests';
import section22_blocks from './section22-pressuremeter-tests';
import section23_blocks from './section23-pile-load-tests';
import section24_blocks from './section24-shear-tests';
import section25_blocks from './section25-shafts-pits';
import section26_blocks from './section26-trenches';
import section27_blocks from './section27-underground-workings';
import section28_blocks from './section28-support-systems';
import section29_blocks from './section29-dewatering';
import section30_blocks from './section30-field-to-lab-transition';
import section31_blocks from './section31-clayey-soils';
import section32_blocks from './section32-sandy-soils';
import section33_blocks from './section33-coarse-soils';
import section34_blocks from './section34-rock-soils';
import section35_blocks from './section35-organic-soils';
import section36_blocks from './section36-chemical-composition';
import section37_blocks from './section37-water-chemistry';
import section38_blocks from './section38-special-parameters';
import section39_blocks from './section39-microstructure';
import section40_blocks from './section40-subsidence-soils';
import section41_blocks from './section41-swelling-soils';
import section42_blocks from './section42-saline-soils';
import section43_blocks from './section43-frost-heaving-soils';
import section44_blocks from './section44-seismic-survey';
import section45_blocks from './section45-electrical-survey';
import section46_blocks from './section46-ground-penetrating-radar';
import section47_blocks from './section47-data-processing';
import section48_blocks from './section48-report-preparation';
import section49_blocks from './section49-quality-control';
import section50_blocks from './section50-archiving';
import section51_blocks from './section51-safety';
import section52_blocks from './section52-environmental';

// ============================================================================
// РЕЕСТР ВСЕХ БЛОКОВ ИНСТРУКЦИИ
// ============================================================================

/**
 * Полный список всех блоков инструкции
 * Сортировка по приоритету происходит в Rules Engine
 */
export const ALL_INSTRUCTION_BLOCKS: InstructionBlock[] = [
  // ЧАСТЬ I: ОБЩИЕ ПОЛОЖЕНИЯ
  ...section01_blocks,  // ✅ ДОБАВЛЕНО: Нормативная база, стадия, ответственность
  ...section02_blocks,  // ✅ ДОБАВЛЕНО: Рекогносцировка, маршруты
  
  // ЧАСТЬ II: КАТЕГОРИИ И ПОСЛЕДОВАТЕЛЬНОСТЬ
  ...section03_blocks,  // Категории сложности ИГУ
  ...section04_blocks,  // Последовательность работ
  
  // ЧАСТЬ III: БУРОВЫЕ РАБОТЫ
  ...section05_blocks,  // Бурение на площадках
  ...section06_blocks,  // Линейные объекты
  ...section08_blocks,  // Методы бурения
  
  // ЧАСТЬ III-А: ГОРНОПРОХОДЧЕСКИЕ РАБОТЫ
  ...section25_blocks,  // ✅ ДОБАВЛЕНО: Шурфы и закопушки
  ...section26_blocks,  // ✅ ДОБАВЛЕНО: Канавы и траншеи
  ...section27_blocks,  // ✅ ДОБАВЛЕНО: Подземные выработки
  ...section28_blocks,  // ✅ ДОБАВЛЕНО: Крепление выработок
  ...section29_blocks,  // ✅ ДОБАВЛЕНО: Водоотлив
  
  // ЧАСТЬ IV: СПЕЦИАЛЬНЫЕ РАБОТЫ И ПОЛЕВЫЕ ИСПЫТАНИЯ
  ...section07_blocks,  // Топографо-геодезические работы
  ...section10_blocks,  // Гидрогеология
  ...section11_blocks,  // Полевые испытания
  ...section14_blocks,  // Геофизика
  ...section17_blocks,  // ✅ ДОБАВЛЕНО: Опытно-фильтрационные
  ...section18_blocks,  // ✅ ДОБАВЛЕНО: Статическое зондирование (CPT)
  ...section19_blocks,  // ✅ ДОБАВЛЕНО: Динамическое зондирование (DPT)
  ...section20_blocks,  // ✅ ДОБАВЛЕНО: Штамповые испытания
  ...section21_blocks,  // ✅ ДОБАВЛЕНО: Винтовой штамп
  ...section22_blocks,  // ✅ ДОБАВЛЕНО: Прессиометрия
  ...section23_blocks,  // ✅ ДОБАВЛЕНО: Испытания свай
  ...section24_blocks,  // ✅ ДОБАВЛЕНО: Срезные испытания
  ...section44_blocks,  // ✅ ДОБАВЛЕНО: Сейсморазведка
  ...section45_blocks,  // ✅ ДОБАВЛЕНО: Электроразведка
  ...section46_blocks,  // ✅ ДОБАВЛЕНО: Георадар
  
  // ЧАСТЬ V: ЛАБОРАТОРНЫЕ И СПЕЦИФИЧЕСКИЕ
  ...section30_blocks,  // ✅ НОВЫЙ: Переход полевые→лабораторные
  ...section09_blocks,  // Лабораторные испытания
  ...section31_blocks,  // ✅ ДОБАВЛЕНО: Лабораторные - глинистые
  ...section32_blocks,  // ✅ ДОБАВЛЕНО: Лабораторные - песчаные
  ...section33_blocks,  // ✅ ДОБАВЛЕНО: Лабораторные - крупнообломочные
  ...section34_blocks,  // ✅ НОВЫЙ: Скальные грунты
  ...section35_blocks,  // ✅ НОВЫЙ: Органические грунты (торфы)
  ...section36_blocks,  // ✅ ДОБАВЛЕНО: Химия грунтов
  ...section37_blocks,  // ✅ ДОБАВЛЕНО: Химия воды
  ...section38_blocks,  // ✅ НОВЫЙ: Специальные параметры
  ...section39_blocks,  // ✅ НОВЫЙ: Микроструктура
  ...section12_blocks,  // Специфические грунты
  ...section40_blocks,  // ✅ ДОБАВЛЕНО: Просадочные
  ...section41_blocks,  // ✅ ДОБАВЛЕНО: Набухающие
  ...section42_blocks,  // ✅ ДОБАВЛЕНО: Засоленные
  ...section43_blocks,  // ✅ ДОБАВЛЕНО: Пучинистые
  ...section13_blocks,  // Опасные процессы
  
  // ЧАСТЬ VI: ОРГАНИЗАЦИОННЫЕ И КАМЕРАЛЬНЫЕ
  ...section15_blocks,  // Строительный контроль
  ...section16_blocks,  // Организационные вопросы
  ...section47_blocks,  // ✅ НОВЫЙ: Камеральная обработка
  ...section48_blocks,  // ✅ НОВЫЙ: Технический отчёт
  ...section49_blocks,  // ✅ НОВЫЙ: Контроль качества
  ...section50_blocks,  // ✅ НОВЫЙ: Архивирование
  ...section51_blocks,  // ✅ НОВЫЙ: Техника безопасности
  ...section52_blocks   // ✅ НОВЫЙ: Охрана окружающей среды
];

/**
 * Группировка блоков по разделам
 */
export const INSTRUCTION_BLOCKS_BY_SECTION = {
  section01: section01_blocks,
  section02: section02_blocks,
  section03: section03_blocks,
  section04: section04_blocks,
  section05: section05_blocks,
  section06: section06_blocks,
  section07: section07_blocks,
  section08: section08_blocks,
  section09: section09_blocks,
  section10: section10_blocks,
  section11: section11_blocks,
  section12: section12_blocks,
  section13: section13_blocks,
  section14: section14_blocks,
  section15: section15_blocks,
  section16: section16_blocks,
  section17: section17_blocks,
  section18: section18_blocks,
  section19: section19_blocks,
  section20: section20_blocks,
  section21: section21_blocks,
  section22: section22_blocks,
  section23: section23_blocks,
  section24: section24_blocks,
  section25: section25_blocks,
  section26: section26_blocks,
  section27: section27_blocks,
  section28: section28_blocks,
  section29: section29_blocks,
  section30: section30_blocks,
  section31: section31_blocks,
  section32: section32_blocks,
  section33: section33_blocks,
  section34: section34_blocks,
  section35: section35_blocks,
  section36: section36_blocks,
  section37: section37_blocks,
  section38: section38_blocks,
  section39: section39_blocks,
  section40: section40_blocks,
  section41: section41_blocks,
  section42: section42_blocks,
  section43: section43_blocks,
  section44: section44_blocks,
  section45: section45_blocks,
  section46: section46_blocks,
  section47: section47_blocks,
  section48: section48_blocks,
  section49: section49_blocks,
  section50: section50_blocks,
  section51: section51_blocks,
  section52: section52_blocks
};

/**
 * Статистика по блокам
 */
export const INSTRUCTION_STATISTICS = {
  totalSections: 52,  // ✅ ПОЛНОЕ ПОКРЫТИЕ: все 52 раздела инструкции реализованы
  totalBlocks: ALL_INSTRUCTION_BLOCKS.length,
  sections: {
    generalProvisions: section01_blocks.length,    // Общие положения
    reconnaissance: section02_blocks.length,       // Рекогносцировка
    categories: section03_blocks.length,           // Категории
    workSequence: section04_blocks.length,         // Последовательность
    drillingAreal: section05_blocks.length,        // Бурение площадное
    linear: section06_blocks.length,               // Линейные
    survey: section07_blocks.length,               // Геодезия
    drillingMethods: section08_blocks.length,      // Методы бурения
    laboratory: section09_blocks.length,           // Лаборатория
    hydrogeology: section10_blocks.length,         // Гидрогеология
    fieldTests: section11_blocks.length,           // Полевые испытания
    specificSoils: section12_blocks.length,        // Специфические грунты
    hazards: section13_blocks.length,              // Опасные процессы
    geophysics: section14_blocks.length,           // Геофизика
    construction: section15_blocks.length,         // Строительный контроль
    organizational: section16_blocks.length,       // Организационные
    filtrationTests: section17_blocks.length,       // ✅ Опытно-фильтрационные
    staticPenetration: section18_blocks.length,     // ✅ Статическое зондирование
    dynamicPenetration: section19_blocks.length,    // ✅ Динамическое зондирование
    plateLoadTests: section20_blocks.length,        // ✅ Штамповые испытания
    screwPlate: section21_blocks.length,            // ✅ Винтовой штамп
    pressuremeter: section22_blocks.length,         // ✅ Прессиометрия
    pileLoadTests: section23_blocks.length,         // ✅ Испытания свай
    shearTests: section24_blocks.length,            // ✅ Срезные испытания
    shaftsPits: section25_blocks.length,            // ✅ Шурфы и закопушки
    trenches: section26_blocks.length,              // ✅ Канавы и траншеи
    undergroundWorkings: section27_blocks.length,   // ✅ Подземные выработки
    supportSystems: section28_blocks.length,        // ✅ Крепление
    dewatering: section29_blocks.length,            // ✅ Водоотлив
    clayeySoils: section31_blocks.length,           // ✅ Глинистые грунты
    sandySoils: section32_blocks.length,            // ✅ Песчаные грунты
    chemicalSoils: section36_blocks.length,         // ✅ Химия грунтов
    chemicalWater: section37_blocks.length,         // ✅ Химия воды
    subsidenceSoils: section40_blocks.length,       // ✅ Просадочные
    swellingSoils: section41_blocks.length,         // ✅ Набухающие
    salineSoils: section42_blocks.length,           // ✅ Засоленные
    frostHeavingSoils: section43_blocks.length,     // ✅ Пучинистые
    seismicSurvey: section44_blocks.length,         // ✅ Сейсморазведка
    electricalSurvey: section45_blocks.length,      // ✅ Электроразведка
    gpr: section46_blocks.length                    // ✅ Георадар
  }
};

/**
 * Получить блоки по тегам
 */
export function getBlocksByTag(tag: string): InstructionBlock[] {
  return ALL_INSTRUCTION_BLOCKS.filter(block => 
    block.tags && block.tags.indexOf(tag) !== -1
  );
}

/**
 * Получить обязательные блоки
 */
export function getMandatoryBlocks(): InstructionBlock[] {
  return ALL_INSTRUCTION_BLOCKS.filter(block =>
    block.variants.some(v => v.priority === 'ОБЯЗАТЕЛЬНЫЙ')
  );
}

/**
 * Получить блоки по приоритету
 */
export function getBlocksByPriority(minPriority: number): InstructionBlock[] {
  return ALL_INSTRUCTION_BLOCKS.filter(block => 
    block.priority >= minPriority
  );
}

// Экспорт по умолчанию
export default ALL_INSTRUCTION_BLOCKS;