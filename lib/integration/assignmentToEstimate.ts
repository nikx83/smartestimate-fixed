/**
 * Путь: /lib/integration/assignmentToEstimate.ts
 * Название: Assignment to Estimate Adapter
 * Назначение: Преобразование данных ТЗ в формат для модуля смет
 * 
 * Функции:
 * - Конвертация InteractiveWorkItem → EstimateItemDisplay
 * - Автозаполнение параметров расчёта
 * - Передача данных в модуль смет
 */

import type { TechnicalAssignment, InteractiveWorkItem } from '@/types/technical-assignment';
import type { EstimateItemDisplay, CalculationResultDisplay } from '@/types/calculation';

/**
 * Преобразовать ТЗ в смету
 */
export function convertAssignmentToEstimate(
  assignment: TechnicalAssignment
): CalculationResultDisplay {
  // Собираем все выбранные работы
  const selectedWorks = [
    ...assignment.works.fieldWorks.filter(w => w.isSelected),
    ...assignment.works.labWorks.filter(w => w.isSelected),
    ...assignment.works.officeWorks.filter(w => w.isSelected),
  ];

  // Преобразуем каждую работу в позицию сметы
  const items: EstimateItemDisplay[] = selectedWorks.map(work => 
    convertWorkToEstimateItem(work)
  );

  // Вычисляем общую стоимость
  const totalCost = items.reduce((sum, item) => sum + item.cost, 0);

  // Собираем коэффициенты (из metadata объекта)
  const coefficients: Record<string, number> = {};
  
  // Если есть сейсмичность
  if (assignment.naturalConditions.seismicity) {
    coefficients.seismicity = getSeismicityCoefficient(assignment.naturalConditions.seismicity);
  }

  // Если зимние условия
  if (assignment.objectCharacteristics.userNotes?.toLowerCase().includes('зим')) {
    coefficients.winterConditions = 1.25;
  }

  // Если сложные грунты
  if (assignment.naturalConditions.geology.soilCharacteristics === 'невыдержанные') {
    coefficients.difficultSoils = 1.20;
  }

  return {
    totalCost,
    basePrice: items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0),
    coefficients,
    items,
    metadata: {
      section: 'Раздел 2', // Геология
      module: 'geological',
      calculatedAt: new Date(),
      normVersion: assignment.metadata.version,
    },
  };
}

/**
 * Преобразовать работу ТЗ в позицию сметы
 */
export function convertWorkToEstimateItem(work: InteractiveWorkItem): EstimateItemDisplay {
  // Базовая цена из работы или вычисляем
  const unitPrice = calculateUnitPrice(work);
  
  // Коэффициент (если есть)
  const coefficient = extractCoefficient(work);
  
  // Стоимость = количество × цена × коэффициент
  const cost = work.quantity * unitPrice * coefficient;

  return {
    code: work.workId,
    workType: work.name,
    unit: work.unit,
    quantity: work.quantity,
    unitPrice,
    coefficient,
    cost,
    section: determineSection(work),
    tableReference: extractTableReference(work),
    notes: work.userNotes || work.economicJustification?.necessity,
  };
}

/**
 * Вычислить цену за единицу работы
 */
function calculateUnitPrice(work: InteractiveWorkItem): number {
  // Если в работе есть прямая цена
  if ('unitPrice' in work && typeof work.unitPrice === 'number') {
    return work.unitPrice;
  }

  // Иначе пытаемся извлечь из нормативной базы
  const priceMatch = work.normativeBase?.match(/(\d+[\s,]?\d*)\s*(₸|тенге)/);
  if (priceMatch) {
    return parseFloat(priceMatch[1].replace(/\s/g, '').replace(',', '.'));
  }

  // Или из названия работы (если там указана стоимость)
  const nameMatch = work.name.match(/(\d+[\s,]?\d*)\s*(₸|тенге)/);
  if (nameMatch) {
    return parseFloat(nameMatch[1].replace(/\s/g, '').replace(',', '.'));
  }

  // Базовая цена по типу работы (примерные значения)
  return estimatePriceByWorkType(work);
}

/**
 * Примерная оценка цены по типу работы
 */
function estimatePriceByWorkType(work: InteractiveWorkItem): number {
  const name = work.name.toLowerCase();
  
  // Буровые работы
  if (name.includes('бурение') || name.includes('скважин')) {
    if (name.includes('колонковое')) return 5000; // за п.м.
    if (name.includes('ударно-канатное')) return 3500;
    if (name.includes('шнековое')) return 2500;
    return 3000; // средняя цена бурения
  }

  // Лабораторные испытания
  if (name.includes('лабораторн') || name.includes('испытан')) {
    if (name.includes('гранулометр')) return 800; // за определение
    if (name.includes('плотност')) return 600;
    if (name.includes('влажност')) return 500;
    if (name.includes('компресси')) return 1500;
    return 700; // средняя цена испытания
  }

  // Отбор проб
  if (name.includes('отбор проб') || name.includes('монолит')) {
    if (name.includes('монолит')) return 1200; // за монолит
    if (name.includes('нарушенн')) return 300; // за нарушенную пробу
    return 500;
  }

  // Полевые испытания
  if (name.includes('штамп') || name.includes('зонд') || name.includes('срез')) {
    if (name.includes('штамп')) return 8000;
    if (name.includes('статическ')) return 6000;
    if (name.includes('динамическ')) return 4000;
    return 5000;
  }

  // Геофизика
  if (name.includes('геофизи') || name.includes('сейсм') || name.includes('электр')) {
    return 15000; // за профиль
  }

  // Геодезия
  if (name.includes('геодез') || name.includes('топограф')) {
    if (name.includes('съёмка')) return 2000; // за га
    if (name.includes('трассиров')) return 5000; // за км
    return 3000;
  }

  // Камеральные работы
  if (name.includes('камеральн') || name.includes('обработка') || name.includes('отчёт')) {
    return 25000; // за отчёт
  }

  // По умолчанию
  return 1000;
}

/**
 * Извлечь коэффициент из работы
 */
function extractCoefficient(work: InteractiveWorkItem): number {
  // Базовый коэффициент
  let coefficient = 1.0;

  // Если работа обязательная - коэффициент чуть выше
  if (work.category === 'mandatory') {
    coefficient *= 1.05;
  }

  // Если есть особые условия в описании
  const description = work.description?.toLowerCase() || '';
  
  if (description.includes('сложн')) coefficient *= 1.15;
  if (description.includes('зим')) coefficient *= 1.25;
  if (description.includes('глубин') && description.includes('>30')) coefficient *= 1.20;
  if (description.includes('сейсм')) coefficient *= 1.15;

  return coefficient;
}

/**
 * Определить раздел работы
 */
function determineSection(work: InteractiveWorkItem): string {
  const module = work.module?.toLowerCase() || '';
  const name = work.name.toLowerCase();

  if (module.includes('бурение') || name.includes('бурение')) return 'Раздел 2.1 Буровые работы';
  if (module.includes('лаборатор') || name.includes('лаборатор')) return 'Раздел 2.2 Лабораторные работы';
  if (module.includes('геофизи') || name.includes('геофизи')) return 'Раздел 2.3 Геофизические работы';
  if (module.includes('полевые') || name.includes('испытан')) return 'Раздел 2.4 Полевые испытания';
  if (module.includes('камеральн') || name.includes('камеральн')) return 'Раздел 2.5 Камеральные работы';
  if (module.includes('геодез') || name.includes('геодез')) return 'Раздел 1 Геодезия';

  return 'Раздел 2 Инженерно-геологические изыскания';
}

/**
 * Извлечь ссылку на таблицу из нормативной базы
 */
function extractTableReference(work: InteractiveWorkItem): string {
  // Пытаемся найти код таблицы в нормативной базе
  const match = work.normativeBase?.match(/(\d{4}-\d{4}(?:-\d{2})?)/);
  if (match) {
    return match[1];
  }

  // Или из цитат нормативов
  const quoteMatch = work.normativeQuotes?.[0]?.document.match(/(\d{4}-\d{4}(?:-\d{2})?)/);
  if (quoteMatch) {
    return quoteMatch[1];
  }

  // Или генерируем по модулю
  const module = work.module?.toLowerCase() || '';
  if (module.includes('бурение')) return '1602-02XX';
  if (module.includes('лаборатор')) return '1602-07XX';
  if (module.includes('геофизи')) return '1602-04XX';

  return 'AUTO';
}

/**
 * Коэффициент сейсмичности
 */
function getSeismicityCoefficient(seismicity: number): number {
  const coefficients: Record<number, number> = {
    7: 1.20,
    8: 1.30,
    9: 1.40,
    10: 1.50,
  };

  return coefficients[seismicity] || 1.0;
}

/**
 * Экспорт сметы в файл с дополнительной информацией из ТЗ
 */
export function exportEstimateWithContext(
  assignment: TechnicalAssignment,
  estimate: CalculationResultDisplay
): string {
  const lines: string[] = [];

  // Заголовок
  lines.push('СМЕТА НА ИНЖЕНЕРНО-ГЕОЛОГИЧЕСКИЕ ИЗЫСКАНИЯ');
  lines.push('='.repeat(80));
  lines.push('');

  // Общая информация из ТЗ
  lines.push(`Проект: ${assignment.generalInfo.projectName}`);
  lines.push(`Вид строительства: ${assignment.generalInfo.constructionType}`);
  lines.push(`Стадия: ${assignment.generalInfo.designStage}`);
  lines.push(`Категория сложности ИГУ: ${assignment.objectCharacteristics.complexityCategory}`);
  
  if (assignment.naturalConditions.seismicity) {
    lines.push(`Сейсмичность: ${assignment.naturalConditions.seismicity} баллов`);
  }

  lines.push('');
  lines.push('-'.repeat(80));
  lines.push('');

  // Позиции сметы
  lines.push('№ | Наименование работ | Ед.изм. | Кол-во | Цена | Коэфф. | Стоимость');
  lines.push('-'.repeat(80));

  estimate.items.forEach((item, index) => {
    lines.push(
      `${index + 1} | ${item.workType.substring(0, 40)} | ${item.unit} | ${item.quantity} | ${item.unitPrice.toFixed(2)} | ${item.coefficient.toFixed(2)} | ${item.cost.toFixed(2)}`
    );
  });

  lines.push('-'.repeat(80));
  lines.push(`ИТОГО: ${estimate.totalCost.toFixed(2)} тенге`);
  lines.push('');

  // Применённые коэффициенты
  if (Object.keys(estimate.coefficients).length > 0) {
    lines.push('Применённые коэффициенты:');
    Object.entries(estimate.coefficients).forEach(([name, value]) => {
      lines.push(`  - ${name}: ${value.toFixed(2)}`);
    });
    lines.push('');
  }

  return lines.join('\n');
}
