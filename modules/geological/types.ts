/**
 * Файл: /modules/geological/types.ts
 * Назначение: Типы данных для Rules Engine геологических изысканий
 * 
 * Описание:
 * Определяет все типы данных для работы Rules Engine:
 * - Входные данные проекта (GeologicalInput)
 * - Блоки инструкции (InstructionBlock)
 * - Варианты нормативов (InstructionVariant)
 * - Выходные работы (WorkItem)
 */

// ============================================================================
// ВХОДНЫЕ ДАННЫЕ ПРОЕКТА
// ============================================================================

/**
 * Входные данные проекта для определения применимых блоков инструкции
 */
export interface GeologicalInput {
  // Основные параметры проекта
  projectName?: string;
  projectLocation?: string;
  designStage?: 'предпроектная' | 'ТЭО' | 'рабочая' | 'РД';
  
  // Тип объекта
  objectType?: 'площадной' | 'линейный' | string;
  objectSubtype?: string; // 'автодорога', 'трубопровод', 'ЛЭП', 'туннель', и т.д.
  
  // Категории сложности
  geotechnicalCategory?: 'I' | 'II' | 'III';
  geomorphologicalCategory?: 'I' | 'II' | 'III';
  hydrogeologicalCategory?: 'I' | 'II' | 'III';
  
  // Уровень ответственности
  responsibilityLevel?: 'I' | 'II' | 'III' | 'повышенная' | 'нормальная' | 'пониженная';
  
  // Параметры здания/сооружения
  buildingArea?: number; // м²
  buildingVolume?: number; // м³
  numberOfFloors?: number;
  foundationType?: 'ленточный' | 'плитный' | 'свайный' | 'свайно-плитный' | 'столбчатый';
  foundationDepth?: number; // м
  pileLength?: number; // м (для свайных фундаментов)
  
  // Параметры линейных объектов
  linearLength?: number; // км
  roadCategory?: 'I' | 'II' | 'III' | 'IV' | 'V';
  pipelineDiameter?: number; // мм
  pipelinePressure?: 'низкое' | 'среднее' | 'высокое';
  
  // Природные условия
  terrain?: 'равнина' | 'холмистый' | 'горный' | 'предгорье';
  climate?: 'умеренный' | 'резко-континентальный' | 'пустынный';
  seismicity?: number; // баллы (6, 7, 8, 9, 10)
  
  // Специфические грунты
  specialSoils?: string[]; // ['просадочные', 'набухающие', 'засоленные', 'мерзлые', 'торфы', 'заторфованные']
  
  // Опасные геологические процессы
  hazards?: string[]; // ['карст', 'оползни', 'подтопление', 'эрозия', 'суффозия']
  
  // Гидрогеологические условия
  groundwaterDepth?: number; // м
  groundwaterAggressiveness?: boolean;
  artesianConditions?: boolean;
  
  // Геофизические методы
  geophysicsMethods?: string[]; // ['ВЭЗ', 'сейсморазведка', 'георадар']
  
  // Период изысканий
  constructionPhase?: 'проектирование' | 'строительство' | 'эксплуатация' | 'реконструкция';
  excavationDocumentation?: boolean;
  emergencySituation?: boolean;
  structuralDeformations?: boolean;
  loadIncrease?: boolean;
  
  // Дополнительные параметры
  season?: 'лето' | 'зима';
  accessDifficulty?: 'легкий' | 'средний' | 'тяжелый';
  existingData?: boolean; // Есть ли фондовые материалы
}

// ============================================================================
// НОРМАТИВНОЕ ОСНОВАНИЕ
// ============================================================================

/**
 * Нормативный документ с приоритетом
 */
export interface NormativeReference {
  document: string; // Название документа (СП РК, ГОСТ, и т.д.)
  section: string; // Раздел/пункт документа
  priority: 'ОБЯЗАТЕЛЬНЫЙ' | 'РЕКОМЕНДУЕМЫЙ' | 'СПРАВОЧНЫЙ';
}

// ============================================================================
// РЕКОМЕНДУЕМЫЕ ЗНАЧЕНИЯ
// ============================================================================

/**
 * Рекомендуемое значение параметра
 */
export interface RecommendedValue {
  value: number | string | string[];
  min?: number;
  max?: number;
  unit?: string;
  formula?: string;
  explanation?: string;
  confidence?: number; // 0-100%
}

/**
 * Набор рекомендуемых значений
 */
export type RecommendedValues = {
  [key: string]: RecommendedValue;
};

// ============================================================================
// ВАРИАНТЫ БЛОКА ИНСТРУКЦИИ
// ============================================================================

/**
 * Вариант рекомендации блока (альтернативные нормативы)
 */
export interface InstructionVariant {
  id: string;
  priority: 'ОБЯЗАТЕЛЬНЫЙ' | 'РЕКОМЕНДУЕМЫЙ' | 'СПРАВОЧНЫЙ';
  normative: NormativeReference;
  recommendation: string; // Текст рекомендации
  recommendedValues?: RecommendedValues;
  condition?: (input: GeologicalInput) => boolean; // Дополнительное условие для варианта
  note?: string;
  warnings?: string[];
}

// ============================================================================
// БЛОК ИНСТРУКЦИИ
// ============================================================================

/**
 * Блок инструкции - единица правил для генерации ТЗ
 */
export interface InstructionBlock {
  // Идентификация
  id: string;
  section: string; // Раздел инструкции
  title: string;
  description: string;
  priority: number; // Порядок применения (чем меньше, тем раньше)
  
  // Зависимости
  dependencies?: string[]; // ID других блоков, которые должны быть выполнены раньше
  conflicts?: string[]; // ID блоков, с которыми этот блок несовместим
  
  // Теги для фильтрации
  tags?: string[];
  
  // Условие применимости блока
  condition: (input: GeologicalInput) => boolean;
  
  // Варианты рекомендаций (альтернативные нормативы)
  variants: InstructionVariant[];
  
  // Функция расчёта значений (опционально)
  calculateValues?: (input: GeologicalInput) => RecommendedValues;
  
  // Функция генерации работ (опционально)
  generateWorks?: (
    input: GeologicalInput, 
    selectedVariant: InstructionVariant
  ) => WorkItem[];
}

// ============================================================================
// РАБОТА В ТЕХНИЧЕСКОМ ЗАДАНИИ
// ============================================================================

/**
 * Элемент работ в техническом задании
 */
export interface WorkItem {
  workId: string; // Уникальный ID работы
  name: string; // Название работы
  category: 'mandatory' | 'recommended' | 'optional'; // Категория обязательности
  module: 'geological' | 'geodetic' | 'hydrographic' | 'inspection'; // Модуль изысканий
  quantity: number; // Количество
  unit: string; // Единица измерения
  normativeBase: string; // Нормативное основание
  description?: string; // Дополнительное описание
  priority: 'ОБЯЗАТЕЛЬНЫЙ' | 'РЕКОМЕНДУЕМЫЙ' | 'СПРАВОЧНЫЙ';
  tags?: string[];
  priceTableCode?: string; // Код таблицы из СЦИ РК для расчёта цены
}

// ============================================================================
// РЕЗУЛЬТАТ РАБОТЫ RULES ENGINE
// ============================================================================

/**
 * Применённый блок с выбранным вариантом
 */
export interface AppliedBlock {
  block: InstructionBlock;
  selectedVariant: InstructionVariant;
  calculatedValues?: RecommendedValues;
  generatedWorks?: WorkItem[];
  appliedAt: Date;
}

/**
 * Результат работы Rules Engine
 */
export interface RulesEngineResult {
  // Входные данные
  input: GeologicalInput;
  
  // Применённые блоки
  appliedBlocks: AppliedBlock[];
  
  // Все сгенерированные работы
  allWorks: WorkItem[];
  
  // Статистика
  statistics: {
    totalBlocksEvaluated: number;
    blocksApplied: number;
    blocksSkipped: number;
    mandatoryWorks: number;
    recommendedWorks: number;
    optionalWorks: number;
  };
  
  // Предупреждения и конфликты
  warnings: string[];
  conflicts: string[];
  
  // Время выполнения
  executionTime: number; // мс
}

// ============================================================================
// КОНФИГУРАЦИЯ RULES ENGINE
// ============================================================================

/**
 * Настройки Rules Engine
 */
export interface RulesEngineConfig {
  // Автоматический выбор варианта по приоритету
  autoSelectVariant?: boolean; // default: true
  
  // Включать ли справочные блоки
  includeReferenceBlocks?: boolean; // default: true
  
  // Детальное логирование
  verboseLogging?: boolean; // default: false
  
  // Максимальная глубина зависимостей
  maxDependencyDepth?: number; // default: 10
}

// ============================================================================
// ЭКСПОРТЫ
// ============================================================================

export type Priority = 'ОБЯЗАТЕЛЬНЫЙ' | 'РЕКОМЕНДУЕМЫЙ' | 'СПРАВОЧНЫЙ';
export type WorkCategory = 'mandatory' | 'recommended' | 'optional';
export type SurveyModule = 'geological' | 'geodetic' | 'hydrographic' | 'inspection';