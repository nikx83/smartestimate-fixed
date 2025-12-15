/**
 * Путь: /components/geological/CategoriesStep.tsx
 * Название: CategoriesStep (Геологический дизайн)
 * Дизайн: Карточки выбора вместо таблиц
 */

'use client';

import { useGeologicalStore } from '@/store/geologicalStore';
import { Layers, AlertTriangle, Mountain } from 'lucide-react';

const GEOTECH_CATEGORIES = [
  {
    value: 'I' as const,
    icon: <Layers size={28} />,
    title: 'Категория I',
    subtitle: 'Простые условия',
    description: 'Однородные грунты, отсутствие грунтовых вод, простой рельеф',
    examples: 'Малоэтажные здания, сухие песчаные грунты'
  },
  {
    value: 'II' as const,
    icon: <Mountain size={28} />,
    title: 'Категория II',
    subtitle: 'Средняя сложность',
    description: 'Неоднородные грунты, наличие подземных вод, умеренный рельеф',
    examples: 'Многоэтажные здания, слоистые грунты'
  },
  {
    value: 'III' as const,
    icon: <AlertTriangle size={28} />,
    title: 'Категория III',
    subtitle: 'Сложные условия',
    description: 'Особые грунты (просадочные, набухающие), высокие грунтовые воды, карст',
    examples: 'Высотные здания, сейсмичные районы, слабые грунты'
  }
];

const RESPONSIBILITY_LEVELS = [
  {
    value: 'I' as const,
    title: 'Повышенный',
    description: 'Высотные здания >16 этажей, большие пролёты >36м'
  },
  {
    value: 'II' as const,
    title: 'Нормальный',
    description: 'Жилые здания до 16 этажей, обычные конструкции'
  },
  {
    value: 'III' as const,
    title: 'Пониженный',
    description: 'Временные сооружения, малоэтажные здания'
  }
];

export function CategoriesStep() {
  const { input, updateInputField } = useGeologicalStore();

  return (
    <div className="space-y-8">
      {/* ГЕОТЕХНИЧЕСКАЯ КАТЕГОРИЯ */}
      <div>
        <div style={{ marginBottom: '16px' }}>
          <h3 style={{ 
            fontSize: '16px', 
            fontWeight: 600, 
            color: 'var(--text-primary)',
            marginBottom: '4px'
          }}>
            Геотехническая категория сложности
          </h3>
          <p style={{ 
            fontSize: '14px', 
            color: 'var(--text-secondary)' 
          }}>
            Выберите категорию на основе геологических условий участка
          </p>
        </div>

        <div className="geo-category-grid">
          {GEOTECH_CATEGORIES.map((category) => (
            <div
              key={category.value}
              className={`geo-category-card ${
                input.geotechCategory === category.value ? 'selected' : ''
              }`}
              onClick={() => updateInputField('geotechCategory', category.value)}
            >
              <div className="geo-category-icon">
                {category.icon}
              </div>
              <div className="geo-category-title">
                {category.title}
              </div>
              <div className="geo-category-desc">
                <strong>{category.subtitle}</strong><br />
                {category.description}
              </div>
              <div style={{
                marginTop: '12px',
                padding: '8px',
                background: 'rgba(0, 151, 167, 0.05)',
                borderRadius: '6px',
                fontSize: '12px',
                color: 'var(--text-secondary)'
              }}>
                {category.examples}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* УРОВЕНЬ ОТВЕТСТВЕННОСТИ */}
      <div>
        <div style={{ marginBottom: '16px' }}>
          <h3 style={{ 
            fontSize: '16px', 
            fontWeight: 600, 
            color: 'var(--text-primary)',
            marginBottom: '4px'
          }}>
            Уровень ответственности объекта
          </h3>
          <p style={{ 
            fontSize: '14px', 
            color: 'var(--text-secondary)' 
          }}>
            Согласно СП РК 2.01-101-2013 «Нагрузки и воздействия»
          </p>
        </div>

        <div className="geo-category-grid">
          {RESPONSIBILITY_LEVELS.map((level) => (
            <div
              key={level.value}
              className={`geo-category-card ${
                input.responsibilityLevel === level.value ? 'selected' : ''
              }`}
              onClick={() => updateInputField('responsibilityLevel', level.value)}
              style={{ padding: '16px' }}
            >
              <div style={{
                width: '48px',
                height: '48px',
                margin: '0 auto 12px',
                borderRadius: '50%',
                background: input.responsibilityLevel === level.value
                  ? 'linear-gradient(135deg, var(--mineral-turquoise), var(--mineral-malachite))'
                  : 'linear-gradient(135deg, rgba(0, 151, 167, 0.1), rgba(0, 105, 92, 0.1))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                fontWeight: 700,
                color: input.responsibilityLevel === level.value ? 'white' : 'var(--mineral-turquoise)'
              }}>
                {level.value}
              </div>
              <div className="geo-category-title">
                {level.title}
              </div>
              <div className="geo-category-desc">
                {level.description}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ПОДСКАЗКА */}
      <div style={{
        padding: '16px 20px',
        background: 'linear-gradient(135deg, rgba(0, 151, 167, 0.05), rgba(0, 105, 92, 0.05))',
        border: '1.5px solid rgba(0, 151, 167, 0.2)',
        borderRadius: '10px',
        fontSize: '14px',
        color: 'var(--text-primary)'
      }}>
        <strong>💡 Совет:</strong> При неуверенности в выборе категории рекомендуется выбрать более высокую категорию сложности для обеспечения надёжности изысканий
      </div>
    </div>
  );
}
