/**
 * ЦЕНТРАЛЬНЫЙ МЕНЕДЖЕР НОРМАТИВОВ
 * Управление версиями, таблицами и коэффициентами
 */

import type { NormVersion, SectionCode, NormRegistry } from './types';

class NormManager {
  private currentVersion: NormVersion;
  private registry: Map<NormVersion, NormRegistry>;

  constructor() {
    this.currentVersion = this.detectActiveVersion();
    this.registry = new Map();
  }

  /**
   * Определить активную версию по дате
   */
  private detectActiveVersion(): NormVersion {
    const now = new Date();
    const year = now.getFullYear();

    if (year >= 2027) return '2027';
    if (year >= 2026) return '2026';
    return '2025';
  }

  /**
   * Получить таблицу по коду
   */
  async getTable(sectionCode: SectionCode, tableCode: string, version?: NormVersion) {
    const targetVersion = version || this.currentVersion;
    
    try {
      const sectionName = this.getSectionName(sectionCode);
      const module = await import(
        `./${targetVersion}/${sectionName}/tables/${tableCode}.ts`
      );
      
      return module.default || module[`table${tableCode.replace(/-/g, '_')}`];
    } catch (error) {
      throw new Error(
        `Не удалось загрузить таблицу ${tableCode} из раздела ${sectionCode}, версия ${targetVersion}`
      );
    }
  }

  /**
   * Получить коэффициенты раздела
   */
  async getCoefficients(sectionCode: SectionCode, version?: NormVersion) {
    const targetVersion = version || this.currentVersion;
    
    try {
      const sectionName = this.getSectionName(sectionCode);
      const module = await import(
        `./${targetVersion}/${sectionName}/coefficients.ts`
      );
      
      return module.COEFFICIENTS;
    } catch (error) {
      throw new Error(
        `Не удалось загрузить коэффициенты раздела ${sectionCode}`
      );
    }
  }

  /**
   * Получить имя папки раздела
   */
  private getSectionName(section: SectionCode): string {
    const sectionMap = {
      '1': 'section1-geodetic',
      '2': 'section2-geological',
      '3': 'section3-hydrographic',
      '4': 'section4-inspection'
    };
    return sectionMap[section];
  }

  /**
   * Проверить доступность таблицы
   */
  async isTableAvailable(sectionCode: SectionCode, tableCode: string): Promise<boolean> {
    try {
      await this.getTable(sectionCode, tableCode);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Получить текущую версию
   */
  getActiveVersion(): NormVersion {
    return this.currentVersion;
  }

  /**
   * Переключить версию вручную (для тестирования)
   */
  setVersion(version: NormVersion) {
    this.currentVersion = version;
  }
}

// Экспорт синглтона
export const normManager = new NormManager();
export default normManager;
