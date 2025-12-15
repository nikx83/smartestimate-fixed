/**
 * Путь: /modules/calculations/geodetic/README.md
 * Назначение: Документация модуля геодезии
 */

# Расчётный модуль: Геодезические работы

## Описание

Модуль выполняет расчёт стоимости инженерно-геодезических изысканий **строго по СЦИ РК 8.03-04-2025, Раздел 1**.

## Соответствие нормативам

✅ **Таблицы цен (импортированы полностью):**

### Топографические съёмки (16 позиций):
- 1601-0101 — М 1:500 (4 категории)
- 1601-0102 — М 1:1000 (4 категории)
- 1601-0103 — М 1:2000 (4 категории)
- 1601-0104 — М 1:5000 (4 категории)

### Разбивочные работы (8 позиций):
- 1601-0201 — Геодезическая сетка (4 категории)
- 1601-0202 — Вынос осей (4 категории)

### Мониторинг (4 позиции):
- 1601-0301 — Деформационный мониторинг (4 категории)

**Всего:** 28 ценовых позиций

✅ **Коэффициенты (реализованы полностью):**
- Сезонные (2)
- Рельеф местности (4)
- Растительность (5)
- Застройка (5)
- Коммуникации (5)
- Точность (4)
- Срочность (3)
- Удалённость (5)
- Сейсмичность (6)
- Объём работ (5)

**Всего:** 44 коэффициента

## Модули расчёта

### 1. Топографическая съёмка
```typescript
import { calculateTopographicSurvey } from '@/modules/calculations/geodetic';

const result = await calculateTopographicSurvey({
  scale: '1:500',
  area: 10,
  category: 'II',
  season: 'winter',
  terrain: 'hilly',
  vegetation: 'bushes'
});
```

### 2. Разбивочные работы
```typescript
import { calculateLayoutWorks } from '@/modules/calculations/geodetic';

const result = await calculateLayoutWorks({
  workType: 'construction_grid',
  category: 'III',
  quantity: 4,
  season: 'summer',
  accuracyRequirement: 'increased'
});
```

### 3. Мониторинг деформаций
```typescript
import { calculateDeformationMonitoring } from '@/modules/calculations/geodetic';

const result = await calculateDeformationMonitoring({
  category: 'II',
  marksCount: 20,
  cyclesCount: 4,
  season: 'winter',
  buildingHeight: 45
});
```

## Тестирование
```bash
npm run test:geodetic
```

## Категории сложности

### I категория
- Открытая местность
- Минимальная застройка
- Простые условия

### II категория
- Слабо застроенная территория
- Холмистый рельеф
- Умеренные условия

### III категория
- Застроенная территория
- Сложный рельеф
- Затруднённые условия

### IV категория
- Плотная застройка
- Очень сложные условия
- Высокие требования

## Версия

**v1.0** — Полная реализация по СЦИ РК 8.03-04-2025

SmartEstimate Team, 2025
