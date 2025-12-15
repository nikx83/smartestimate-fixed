/**
 * Путь: /modules/calculations/hydrographic/README.md
 * Назначение: Документация модуля гидрографии
 */

# Расчётный модуль: Гидрографические работы

## Описание

Модуль выполняет расчёт стоимости инженерно-гидрографических работ **строго по СЦИ РК 8.03-04-2025, Раздел 3**.

## Соответствие нормативам

✅ **Таблицы цен (импортированы полностью):**

### Промеры глубин (8 позиций):
- 1603-0101 — Эхолот (4 категории)
- 1603-0102 — Ручной способ (4 категории)

### Гидрологические наблюдения (8 позиций):
- 1603-0201 — Уровень воды (4 категории)
- 1603-0202 — Скорости течения (4 категории)

### Отбор проб (4 позиции):
- 1603-0301 — Пробы воды и донных отложений

### Метеонаблюдения (4 позиции):
- 1603-0401 — Метеорологические наблюдения

**Всего:** 24 ценовые позиции

✅ **Коэффициенты (реализованы полностью):**
- Сезонные (4)
- Ледовые условия (5)
- Погодные условия (5)
- Глубина водоёма (4)
- Удалённость (5)
- Тип водоёма (7)
- Навигационные условия (4)
- Срочность (3)
- Точность (4)
- Объём работ (10)

**Всего:** 51 коэффициент

## Модули расчёта

### 1. Промеры глубин
```typescript
import { calculateDepthSounding } from '@/modules/calculations/hydrographic';

const result = await calculateDepthSounding({
  method: 'echo_sounder',
  category: 'II',
  distance: 25,
  season: 'summer',
  weatherConditions: 'light'
});
```

### 2. Гидрологические наблюдения
```typescript
import { calculateHydrologicalObservations } from '@/modules/calculations/hydrographic';

const result = await calculateHydrologicalObservations({
  observationType: 'water_level',
  category: 'II',
  durationMonths: 6,
  season: 'summer'
});
```

### 3. Отбор проб воды
```typescript
import { calculateWaterSampling } from '@/modules/calculations/hydrographic';

const result = await calculateWaterSampling({
  samples: [
    { sampleType: 'surface', samplesCount: 15 },
    { sampleType: 'depth', samplesCount: 10 }
  ],
  season: 'summer'
});
```

### 4. Метеонаблюдения
```typescript
import { calculateMeteoObservations } from '@/modules/calculations/hydrographic';

const result = await calculateMeteoObservations({
  observationType: 'auto_station',
  duration: 3,
  remoteness: 'moderate'
});
```

## Категории сложности

| Категория | Описание | Водоёмы |
|-----------|----------|---------|
| **I** | Простые условия | Озёра, водохранилища |
| **II** | Средние условия | Медленные реки, заливы |
| **III** | Сложные условия | Средние реки, прибрежная морская зона |
| **IV** | Особо сложные | Быстрые реки, открытое море |

## Сезоны работ

- **Лето** (июнь-август): ×1.0 — оптимальные условия
- **Осень** (сентябрь-ноябрь): ×1.15 — штормы
- **Весна** (март-май): ×1.2 — паводок, ледоход
- **Зима** (декабрь-февраль): ×1.4 — ледовая обстановка

## Тестирование
```bash
npm run test:hydrographic
```

## Версия

**v1.0** — Полная реализация по СЦИ РК 8.03-04-2025

SmartEstimate Team, 2025
