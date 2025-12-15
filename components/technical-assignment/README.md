/**
 * Путь: /components/technical-assignment/README.md
 * Название: Technical Assignment UI Components Documentation
 * Назначение: Полная документация всех компонентов для работы с ТЗ
 */

# 📘 Компоненты технического задания

Набор React-компонентов для работы с техническим заданием на инженерно-геологические изыскания.

---

## 📁 Структура компонентов

```
/components/technical-assignment/
├── TechnicalAssignmentDisplay.tsx  ← Главный компонент (44 KB)
├── EditableSection.tsx             ← Редактируемые разделы (8 KB)
├── WorkCard.tsx                    ← Карточка работы (13 KB)
├── SectionNavigation.tsx           ← Навигация по разделам (NEW!)
├── AssignmentStats.tsx             ← Статистика и метрики (NEW!)
├── AssignmentPreview.tsx           ← Предпросмотр документа (NEW!)
├── WorksFilter.tsx                 ← Фильтры и поиск (NEW!)
├── ExportDialog.tsx                ← Диалог экспорта (NEW!)
└── README.md                       ← Эта документация
```

---

## 🎯 Основные компоненты

### 1. TechnicalAssignmentDisplay

**Назначение:** Главный компонент для отображения и редактирования всего ТЗ

**Использование:**
```tsx
import { TechnicalAssignmentDisplay } from '@/components/technical-assignment/TechnicalAssignmentDisplay';

<TechnicalAssignmentDisplay
  assignment={technicalAssignment}
  onUpdate={(updated) => console.log('ТЗ обновлено', updated)}
  onExport={(format) => console.log('Экспорт в', format)}
/>
```

**Особенности:**
- 15 разделов ТЗ по нормам РК
- Вкладки: Все / Полевые / Лабораторные / Камеральные
- Интерактивный выбор работ с чекбоксами
- Фильтры и поиск
- Экспорт в PDF/DOCX

---

### 2. EditableSection

**Назначение:** Универсальный компонент для редактируемых разделов

**Использование:**
```tsx
import { EditableSection } from '@/components/technical-assignment/EditableSection';

<EditableSection
  title="Общие сведения"
  sectionNumber="1"
  standardContent={<div>Стандартный контент...</div>}
  userNotes={assignment.generalInfo.userNotes}
  onUserNotesChange={(notes) => updateNotes('generalInfo', notes)}
  hint="Укажите дополнительные требования заказчика"
  icon={<FileText className="w-4 h-4" />}
/>
```

**Особенности:**
- Сворачиваемые секции
- Inline редактирование заметок
- Всплывающие подсказки
- Тёплый, приятный дизайн

---

### 3. WorkCard

**Назначение:** Карточка отдельной работы с детальной информацией

**Использование:**
```tsx
import { WorkCard } from '@/components/technical-assignment/WorkCard';

<WorkCard
  work={interactiveWorkItem}
  isSelected={true}
  onToggle={(id) => toggleWork(id)}
  onNotesChange={(id, notes) => updateWorkNotes(id, notes)}
/>
```

**Особенности:**
- Чекбокс для выбора
- Категория работы (обязательная/рекомендуемая/опциональная)
- Раскрываемые детали
- Нормативные цитаты
- Экономическое обоснование
- Поле для заметок пользователя

---

## 🆕 Новые компоненты

### 4. SectionNavigation

**Назначение:** Боковое меню навигации по разделам ТЗ

**Использование:**
```tsx
import { SectionNavigation, useActiveSection, scrollToSection, SECTION_ICONS } from '@/components/technical-assignment/SectionNavigation';

const sections = [
  {
    id: 'general',
    number: '1',
    title: 'Общие сведения',
    icon: SECTION_ICONS.general,
    completeness: 100,
  },
  // ... остальные разделы
];

const activeSection = useActiveSection(sections.map(s => s.id));

<SectionNavigation
  sections={sections}
  currentSection={activeSection}
  onSectionClick={scrollToSection}
/>
```

**Особенности:**
- Sticky позиционирование при скролле
- Прогресс-бар общей заполненности
- Индикаторы заполненности каждого раздела
- Автоматическое отслеживание активного раздела
- Плавная прокрутка к выбранному разделу

---

### 5. AssignmentStats

**Назначение:** Дашборд со статистикой и ключевыми метриками ТЗ

**Использование:**
```tsx
import { AssignmentStats } from '@/components/technical-assignment/AssignmentStats';

<AssignmentStats
  statistics={assignment.statistics}
  projectName={assignment.generalInfo.projectName}
  deadline={assignment.generalInfo.workDeadline}
  estimatedCost={1500000}
  onExport={(format) => handleExport(format)}
  onShare={() => handleShare()}
/>
```

**Особенности:**
- Сетка метрик (работы, заполненность, срок, стоимость)
- Распределение работ по категориям (графики)
- Объёмы работ (буровые, лабораторные, пробы)
- Экспорт в PDF/DOCX/Excel
- Предупреждения о незаполненных разделах

---

### 6. AssignmentPreview

**Назначение:** Предпросмотр ТЗ в формате, близком к финальному документу

**Использование:**
```tsx
import { AssignmentPreview } from '@/components/technical-assignment/AssignmentPreview';

<AssignmentPreview
  assignment={technicalAssignment}
  onExport={(format) => exportDocument(format)}
  onClose={() => setShowPreview(false)}
/>
```

**Особенности:**
- Fullscreen режим предпросмотра
- Масштабирование (50%-150%)
- Постраничная навигация
- Печать (Ctrl+P)
- Экспорт напрямую из предпросмотра
- Стили для печати (print-friendly)

---

### 7. WorksFilter

**Назначение:** Панель фильтрации и поиска работ

**Использование:**
```tsx
import { WorksFilter } from '@/components/technical-assignment/WorksFilter';

<WorksFilter
  onSearchChange={(search) => setSearchTerm(search)}
  onCategoryFilter={(categories) => setFilteredCategories(categories)}
  onModuleFilter={(modules) => setFilteredModules(modules)}
  onStatusFilter={(status) => setStatusFilter(status)}
  totalWorks={statistics.totalWorks}
  filteredCount={filteredWorks.length}
  selectedCount={statistics.selectedWorks}
/>
```

**Особенности:**
- Полнотекстовый поиск по названию работ
- Фильтр по категориям (обязательные/рекомендуемые/опциональные)
- Фильтр по модулям (буровые/лабораторные/камеральные и т.д.)
- Фильтр по статусу выбора (все/выбранные/не выбранные)
- Быстрые пресеты ("Все обязательные", "Полевые работы")
- Счётчики работ в реальном времени
- Кнопка сброса всех фильтров

---

### 8. ExportDialog

**Назначение:** Диалоговое окно экспорта с настройками форматирования

**Использование:**
```tsx
import { ExportDialog } from '@/components/technical-assignment/ExportDialog';

<ExportDialog
  isOpen={showExportDialog}
  onClose={() => setShowExportDialog(false)}
  onExport={async (options) => {
    await exportTechnicalAssignment(assignment, options);
  }}
  projectName={assignment.generalInfo.projectName}
/>
```

**Особенности:**
- Выбор формата (PDF/DOCX/Excel)
- Настройки страницы (размер, ориентация, поля)
- Размер шрифта (10-14 pt)
- Опции включения/исключения разделов
- Прогресс-бар экспорта
- Обработка ошибок
- Красивая анимация

---

## 🎨 Дизайн-система

### Цветовая палитра

**Основные цвета:**
- Amber/Orange: Теплые акценты для кнопок и заголовков
- Blue: Интерактивные элементы и ссылки
- Gray: Нейтральные тексты и фоны
- Green: Успех и завершённость
- Red: Обязательные элементы и предупреждения
- Yellow: Рекомендации

**Градиенты:**
```css
from-amber-50 to-orange-50    /* Заголовки секций */
from-amber-500 to-orange-500  /* Прогресс-бары */
from-blue-50 to-indigo-50     /* Модальные окна */
```

### Типографика

- Заголовки: `font-semibold`, `text-lg` / `text-base`
- Основной текст: `text-sm`, `text-gray-700`
- Подписи: `text-xs`, `text-gray-500`
- Акценты: `font-bold`, цветные классы

### Отступы и размеры

- Секции: `p-4` / `p-5`
- Карточки: `rounded-xl`, `shadow-sm`
- Кнопки: `px-4 py-2`, `rounded-lg`
- Иконки: `w-4 h-4` / `w-5 h-5`

---

## 🔧 Интеграция

### Пример полного потока:

```tsx
import { useState } from 'react';
import { TechnicalAssignmentDisplay } from '@/components/technical-assignment/TechnicalAssignmentDisplay';
import { SectionNavigation, useActiveSection, scrollToSection } from '@/components/technical-assignment/SectionNavigation';
import { AssignmentStats } from '@/components/technical-assignment/AssignmentStats';
import { ExportDialog } from '@/components/technical-assignment/ExportDialog';

export function TechnicalAssignmentPage() {
  const [assignment, setAssignment] = useState<TechnicalAssignment>(/* ... */);
  const [showExportDialog, setShowExportDialog] = useState(false);

  // Вычисляем разделы для навигации
  const sections = [
    { id: 'general', number: '1', title: 'Общие сведения', icon: SECTION_ICONS.general, completeness: 100 },
    { id: 'object', number: '2', title: 'Характеристика объекта', icon: SECTION_ICONS.object, completeness: 85 },
    // ... остальные
  ];

  const activeSection = useActiveSection(sections.map(s => s.id));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Статистика */}
      <div className="max-w-7xl mx-auto p-6">
        <AssignmentStats
          statistics={assignment.statistics}
          projectName={assignment.generalInfo.projectName}
          deadline={assignment.generalInfo.workDeadline}
          onExport={(format) => setShowExportDialog(true)}
        />
      </div>

      {/* Основной контент */}
      <div className="max-w-7xl mx-auto px-6 pb-12 flex gap-6">
        {/* Боковая навигация */}
        <SectionNavigation
          sections={sections}
          currentSection={activeSection}
          onSectionClick={scrollToSection}
        />

        {/* ТЗ */}
        <div className="flex-1">
          <TechnicalAssignmentDisplay
            assignment={assignment}
            onUpdate={setAssignment}
            onExport={(format) => setShowExportDialog(true)}
          />
        </div>
      </div>

      {/* Диалог экспорта */}
      <ExportDialog
        isOpen={showExportDialog}
        onClose={() => setShowExportDialog(false)}
        onExport={async (options) => {
          await exportToFile(assignment, options);
          setShowExportDialog(false);
        }}
        projectName={assignment.generalInfo.projectName}
      />
    </div>
  );
}
```

---

## 🚀 Best Practices

### 1. Производительность

- Используйте `React.memo()` для карточек работ
- Виртуализация для длинных списков (react-window)
- Debounce для поиска (300ms)
- Lazy loading для тяжёлых компонентов

### 2. Доступность (A11y)

- Все кнопки имеют `aria-label`
- Форм-контролы связаны с `<label>`
- Keyboard navigation (Tab, Enter, Escape)
- Focus indicators (ring-2)

### 3. Адаптивность

- Mobile-first подход
- Breakpoints: `sm:`, `md:`, `lg:`
- Горизонтальные списки → вертикальные на мобильных
- Убирать второстепенные элементы на маленьких экранах

### 4. UX

- Immediate feedback на действия
- Loading states для асинхронных операций
- Оптимистичные обновления UI
- Undo/Redo для важных действий
- Подсказки и hints
- Плавные анимации (transition-all duration-200)

---

## 📦 Зависимости

```json
{
  "react": "^19",
  "lucide-react": "^0.546.0",
  "tailwindcss": "^4",
  "clsx": "^2.1.1",
  "tailwind-merge": "^3.3.1"
}
```

---

## 🎯 Roadmap

### Планируется добавить:

- [ ] Автосохранение (debounced)
- [ ] История изменений (version control)
- [ ] Комментарии и обсуждения
- [ ] Шаблоны ТЗ
- [ ] Импорт из других форматов
- [ ] Collaborative editing (realtime)
- [ ] AI-ассистент для заполнения
- [ ] Мобильное приложение

---

**Версия:** 2.0  
**Последнее обновление:** 10 декабря 2025  
**Автор:** SmartEstimate Team
