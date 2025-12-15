/**
 * Сервис для создания структурированного технического задания
 * Адаптирован для веб-системы SmartEstimate
 * services/AssignmentStructureService.ts
 */

// ============================================================================
// ТИПЫ ДЛЯ СТРУКТУРИРОВАННОГО ТЗ
// ============================================================================

export interface WorkItem {
  workId: string;
  name: string;
  quantity: number;
  unit: string;
  category: 'mandatory' | 'recommended' | 'optional';
  normativeBase?: string;
  description?: string;
  module?: string;
  tags?: string[];
  dependencies?: string[];
}

export interface TechnicalAssignmentResult {
  allWorks: WorkItem[];
  metadata: {
    totalWorks: number;
    highestPriority: string;
    generatedAt: Date;
    projectName: string;
  };
}

export interface StructuredTechnicalAssignment {
  metadata: {
    projectName: string;
    generatedAt: Date;
    totalSections: number;
    totalWorks: number;
    highestPriority: string;
  };
  
  sections: AssignmentSection[];
  worksSummary: WorksSummaryTable;
}

export interface AssignmentSection {
  sectionId: string;
  sectionNumber: string;
  sectionName: string;
  description: string;
  priority: string;
  normativeBase: NormativeDocument[];
  requirementBlocks: RequirementBlock[];
  summary: {
    totalBlocks: number;
    totalWorks: number;
    mandatoryWorks: number;
    optionalWorks: number;
  };
}

export interface RequirementBlock {
  blockId: string;
  blockTitle: string;
  applicationCondition: {
    description: string;
    satisfied: boolean;
  };
  selectedVariant: {
    priority: string;
    normative: NormativeDocument;
    recommendation: string;
  };
  workSpecifications: WorkSpecification[];
  calculations: {
    formulas: string[];
    results: Record<string, number>;
  };
}

export interface WorkSpecification {
  workId: string;
  workName: string;
  workCategory: 'mandatory' | 'recommended' | 'optional';
  volumes: {
    quantity: number;
    unit: string;
    calculation: {
      method: string;
      formula: string;
      result: number;
    };
  };
  normativeJustification: {
    document: string;
    requirement: string;
  };
  technicalRequirements: {
    methodology: string;
    standards: string[];
  };
}

export interface NormativeDocument {
  code: string;
  name: string;
  section?: string;
  priority: string;
}

export interface WorksSummaryTable {
  categories: {
    drilling: WorkCategorySummary;
    laboratory: WorkCategorySummary;
    fieldTests: WorkCategorySummary;
    hydrogeology: WorkCategorySummary;
  };
  totalQuantities: Record<string, number>;
}

interface WorkCategorySummary {
  name: string;
  works: Array<{
    id: string;
    name: string;
    quantity: number;
    unit: string;
  }>;
  total: number;
}

// ============================================================================
// ОСНОВНОЙ СЕРВИС
// ============================================================================

export class AssignmentStructureService {
  /**
   * Преобразует плоский список работ в структурированное ТЗ
   */
  static createStructuredAssignment(
    assignment: TechnicalAssignmentResult
  ): StructuredTechnicalAssignment {
    
    // Группируем работы по разделам
    const sections = this.groupWorksIntoSections(assignment.allWorks);
    
    // Создаем сводную таблицу
    const worksSummary = this.createWorksSummary(assignment.allWorks);
    
    // Рассчитываем метаданные
    const metadata = this.createMetadata(assignment, sections);
    
    return {
      metadata,
      sections,
      worksSummary
    };
  }
  
  /**
   * Группирует работы в иерархические разделы
   */
  private static groupWorksIntoSections(works: WorkItem[]): AssignmentSection[] {
    const sectionGroups = new Map<string, WorkItem[]>();
    
    // Группируем работы по тегам разделов
    works.forEach(work => {
      const sectionTag = work.tags?.find(tag => tag.includes('Раздел'));
      const sectionNumber = sectionTag ? sectionTag.replace('Раздел ', '') : '0';
      
      if (!sectionGroups.has(sectionNumber)) {
        sectionGroups.set(sectionNumber, []);
      }
      sectionGroups.get(sectionNumber)!.push(work);
    });
    
    // Создаем структурированные разделы
    const sections: AssignmentSection[] = [];
    
    sectionGroups.forEach((sectionWorks, sectionNumber) => {
      const section = this.createSection(sectionNumber, sectionWorks);
      if (section) {
        sections.push(section);
      }
    });
    
    return sections.sort((a, b) => 
      parseInt(a.sectionNumber) - parseInt(b.sectionNumber)
    );
  }
  
  /**
   * Создает структурированный раздел
   */
  private static createSection(sectionNumber: string, works: WorkItem[]): AssignmentSection | null {
    if (works.length === 0) return null;
    
    const sectionName = this.getSectionName(sectionNumber);
    const requirementBlocks = this.createRequirementBlocks(works);
    
    // Определяем приоритет раздела
    const sectionPriority = this.determineSectionPriority(requirementBlocks);
    
    // Извлекаем нормативную базу
    const normativeBase = this.extractSectionNormatives(requirementBlocks);
    
    // Подсчитываем сводку
    const summary = this.calculateSectionSummary(requirementBlocks);
    
    return {
      sectionId: `section-${sectionNumber}`,
      sectionNumber,
      sectionName,
      description: this.getSectionDescription(sectionNumber),
      priority: sectionPriority,
      normativeBase,
      requirementBlocks,
      summary
    };
  }
  
  /**
   * Создает блоки требований из работ
   */
  private static createRequirementBlocks(works: WorkItem[]): RequirementBlock[] {
    const blocks: RequirementBlock[] = [];
    
    // Группируем работы по типам
    const workGroups = this.groupWorksByType(works);
    
    workGroups.forEach((groupWorks, groupType) => {
      const block = this.createRequirementBlock(groupType, groupWorks);
      if (block) {
        blocks.push(block);
      }
    });
    
    return blocks;
  }
  
  /**
   * Создает детализированный блок требований
   */
  private static createRequirementBlock(blockType: string, works: WorkItem[]): RequirementBlock | null {
    if (works.length === 0) return null;
    
    const workSpecifications = works.map(work => 
      this.createWorkSpecification(work)
    );
    
    // Берем первую работу как образец для блока
    const sampleWork = works[0];
    
    return {
      blockId: `block-${blockType}-${works[0].workId}`,
      blockTitle: this.getBlockTitle(blockType, works),
      applicationCondition: {
        description: this.getBlockCondition(blockType),
        satisfied: true
      },
      selectedVariant: {
        priority: works.some(w => w.category === 'mandatory') ? 'ВЫСШИЙ' : 'РЕКОМЕНДУЕМЫЙ',
        normative: {
          code: sampleWork.normativeBase?.split(',')[0] || 'СП РК 1.02-105-2014',
          name: sampleWork.normativeBase || 'Нормативный документ',
          priority: 'ОБЯЗАТЕЛЬНЫЙ'
        },
        recommendation: this.getBlockRecommendation(blockType)
      },
      workSpecifications,
      calculations: {
        formulas: this.extractCalculationFormulas(works),
        results: this.calculateBlockResults(works)
      }
    };
  }
  
  /**
   * Создает детализированную спецификацию работы
   */
  private static createWorkSpecification(work: WorkItem): WorkSpecification {
    return {
      workId: work.workId,
      workName: work.name,
      workCategory: work.category,
      volumes: {
        quantity: work.quantity,
        unit: work.unit,
        calculation: {
          method: 'Нормативный расчет',
          formula: 'Согласно требованиям нормативного документа',
          result: work.quantity
        }
      },
      normativeJustification: {
        document: work.normativeBase || 'СП РК 1.02-105-2014',
        requirement: 'Выполнение в полном объеме согласно ТЗ'
      },
      technicalRequirements: {
        methodology: work.description || 'Стандартная методика выполнения работ',
        standards: [work.normativeBase || 'СП РК 1.02-105-2014']
      }
    };
  }
  
  /**
   * Создает сводную таблицу работ
   */
  private static createWorksSummary(works: WorkItem[]): WorksSummaryTable {
    const categories = {
      drilling: this.filterWorksByCategory(works, ['бурение', 'скважины']),
      laboratory: this.filterWorksByCategory(works, ['лаборатор', 'испытания']),
      fieldTests: this.filterWorksByCategory(works, ['полевые', 'зондирование']),
      hydrogeology: this.filterWorksByCategory(works, ['гидрогеолог', 'вода'])
    };
    
    const totalQuantities: Record<string, number> = {};
    works.forEach(work => {
      if (!totalQuantities[work.unit]) {
        totalQuantities[work.unit] = 0;
      }
      totalQuantities[work.unit] += work.quantity;
    });
    
    return {
      categories,
      totalQuantities
    };
  }
  
  // ============================================================================
  // ВСПОМОГАТЕЛЬНЫЕ МЕТОДЫ
  // ============================================================================
  
  private static groupWorksByType(works: WorkItem[]): Map<string, WorkItem[]> {
    const groups = new Map<string, WorkItem[]>();
    
    works.forEach(work => {
      let groupType = 'other';
      
      if (work.name.includes('бурение') || work.name.includes('скважин')) {
        groupType = 'drilling';
      } else if (work.name.includes('лаборатор') || work.name.includes('испытания')) {
        groupType = 'laboratory';
      } else if (work.name.includes('зондирование') || work.name.includes('полевые')) {
        groupType = 'field';
      } else if (work.name.includes('гидрогеолог') || work.name.includes('вода')) {
        groupType = 'hydrogeology';
      }
      
      if (!groups.has(groupType)) {
        groups.set(groupType, []);
      }
      groups.get(groupType)!.push(work);
    });
    
    return groups;
  }
  
  private static filterWorksByCategory(
    works: WorkItem[],
    keywords: string[]
  ): WorkCategorySummary {
    const filteredWorks = works.filter(work =>
      keywords.some(keyword =>
        work.name.toLowerCase().includes(keyword) ||
        work.tags?.some(tag => tag.toLowerCase().includes(keyword))
      )
    );
    
    return {
      name: keywords[0],
      works: filteredWorks.map(w => ({
        id: w.workId,
        name: w.name,
        quantity: w.quantity,
        unit: w.unit
      })),
      total: filteredWorks.reduce((sum, w) => sum + w.quantity, 0)
    };
  }
  
  private static getSectionName(sectionNumber: string): string {
    const names: Record<string, string> = {
      '3': 'Определение категорий сложности',
      '4': 'Порядок выполнения работ',
      '5': 'Буровые работы',
      '6': 'Линейные объекты',
      '7': 'Геологическая и геоморфологическая съёмка',
      '8': 'Способы бурения и типы выработок',
      '9': 'Лабораторные испытания грунтов',
      '10': 'Гидрогеологические исследования',
      '11': 'Полевые испытания грунтов',
      '12': 'Специфические грунты',
      '13': 'Опасные геологические процессы',
      '14': 'Геофизические исследования',
      '15': 'Изыскания при строительстве и эксплуатации',
      '16': 'Организационные работы'
    };
    
    return names[sectionNumber] || `Раздел ${sectionNumber}`;
  }
  
  private static getSectionDescription(sectionNumber: string): string {
    const descriptions: Record<string, string> = {
      '3': 'Определение категорий сложности инженерно-геологических условий и геотехнических категорий объекта',
      '4': 'Установление этапности и последовательности выполнения изыскательских работ',
      '5': 'Определение объемов буровых работ, расстояний между выработками, глубины и способов бурения',
      '9': 'Лабораторные исследования физико-механических свойств грунтов и грунтовых вод',
      '10': 'Изучение гидрогеологических условий территории строительства',
      '11': 'Полевые методы исследования свойств грунтов в природном залегании'
    };
    
    return descriptions[sectionNumber] || 'Выполнение работ согласно техническому заданию';
  }
  
  private static getBlockTitle(blockType: string, works: WorkItem[]): string {
    const titles: Record<string, string> = {
      'drilling': 'Буровые работы и выработки',
      'laboratory': 'Лабораторные исследования',
      'field': 'Полевые испытания',
      'hydrogeology': 'Гидрогеологические исследования',
      'other': 'Прочие работы'
    };
    
    return titles[blockType] || 'Блок работ';
  }
  
  private static getBlockCondition(blockType: string): string {
    const conditions: Record<string, string> = {
      'drilling': 'Наличие проектируемых фундаментов и необходимость изучения грунтовых условий',
      'laboratory': 'Необходимость определения физико-механических характеристик грунтов',
      'field': 'Требуется уточнение свойств грунтов в природном состоянии',
      'hydrogeology': 'Наличие подземных вод или необходимость оценки их влияния',
      'other': 'Выполнение дополнительных исследований по заданию'
    };
    
    return conditions[blockType] || 'Выполнение согласно техническому заданию';
  }
  
  private static getBlockRecommendation(blockType: string): string {
    const recommendations: Record<string, string> = {
      'drilling': 'Выполнить бурение в полном объеме согласно расчетной сетке',
      'laboratory': 'Провести испытания всех отобранных образцов',
      'field': 'Выполнить испытания в ключевых точках площадки',
      'hydrogeology': 'Организовать наблюдения за режимом подземных вод',
      'other': 'Выполнить работы в соответствии с методиками'
    };
    
    return recommendations[blockType] || 'Рекомендуется выполнить в полном объеме';
  }
  
  private static extractCalculationFormulas(works: WorkItem[]): string[] {
    const formulas = new Set<string>();
    
    works.forEach(work => {
      if (work.name.includes('бурение')) {
        formulas.add('N = S / (L × L) - количество скважин');
        formulas.add('H = h_фундамента + 5м - глубина бурения');
      } else if (work.name.includes('испытания')) {
        formulas.add('n = N × k - количество испытаний');
      }
    });
    
    return Array.from(formulas);
  }
  
  private static calculateBlockResults(works: WorkItem[]): Record<string, number> {
    const results: Record<string, number> = {};
    
    works.forEach(work => {
      results[work.workId] = work.quantity;
    });
    
    return results;
  }
  
  private static determineSectionPriority(blocks: RequirementBlock[]): string {
    const hasMandatory = blocks.some(block => 
      block.workSpecifications.some(work => work.workCategory === 'mandatory')
    );
    
    const hasRecommended = blocks.some(block => 
      block.workSpecifications.some(work => work.workCategory === 'recommended')
    );
    
    if (hasMandatory) return 'ВЫСШИЙ';
    if (hasRecommended) return 'РЕКОМЕНДУЕМЫЙ';
    return 'СПРАВОЧНЫЙ';
  }
  
  private static extractSectionNormatives(blocks: RequirementBlock[]): NormativeDocument[] {
    const normatives = new Map<string, NormativeDocument>();
    
    blocks.forEach(block => {
      const normative = block.selectedVariant.normative;
      const key = `${normative.code}-${normative.section || ''}`;
      
      if (!normatives.has(key)) {
        normatives.set(key, normative);
      }
    });
    
    return Array.from(normatives.values());
  }
  
  private static calculateSectionSummary(blocks: RequirementBlock[]): {
    totalBlocks: number;
    totalWorks: number;
    mandatoryWorks: number;
    optionalWorks: number;
  } {
    let totalWorks = 0;
    let mandatoryWorks = 0;
    let optionalWorks = 0;
    
    blocks.forEach(block => {
      block.workSpecifications.forEach(work => {
        totalWorks++;
        if (work.workCategory === 'mandatory') {
          mandatoryWorks++;
        } else if (work.workCategory === 'optional') {
          optionalWorks++;
        }
      });
    });
    
    return {
      totalBlocks: blocks.length,
      totalWorks,
      mandatoryWorks,
      optionalWorks
    };
  }
  
  private static createMetadata(
    assignment: TechnicalAssignmentResult,
    sections: AssignmentSection[]
  ): {
    projectName: string;
    generatedAt: Date;
    totalSections: number;
    totalWorks: number;
    highestPriority: string;
  } {
    return {
      projectName: assignment.metadata.projectName,
      generatedAt: assignment.metadata.generatedAt,
      totalSections: sections.length,
      totalWorks: assignment.metadata.totalWorks,
      highestPriority: this.determineHighestPriority(sections)
    };
  }
  
  private static determineHighestPriority(sections: AssignmentSection[]): string {
    const priorities = sections.map(s => s.priority);
    
    if (priorities.includes('ВЫСШИЙ')) return 'ВЫСШИЙ';
    if (priorities.includes('РЕКОМЕНДУЕМЫЙ')) return 'РЕКОМЕНДУЕМЫЙ';
    return 'СПРАВОЧНЫЙ';
  }
}

export default AssignmentStructureService;
