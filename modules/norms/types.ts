/** modules/norms/types.ts 
 * Типы для нормативной базы
 */

export type NormVersion = '2025' | '2026' | '2027';
export type SectionCode = '1' | '2' | '3' | '4';

/**
 * Метаданные таблицы
 */
export interface TableMetadata {
  code: string;
  name: string;
  section: SectionCode;
  status: 'active' | 'deprecated' | 'replaced' | 'removed';
  effectiveDate: Date;
  expiryDate?: Date;
  replacedBy?: string;
  notes?: string;
}

/**
 * Реестр таблиц версии
 */
export interface NormRegistry {
  version: NormVersion;
  effectiveDate: string;
  sections: {
    [sectionCode: string]: {
      name: string;
      tables: {
        [tableCode: string]: TableMetadata;
      };
    };
  };
}

