/**
 * Путь: /components/geological/GeologicalWizard.tsx
 * Название: GeologicalWizard (Геологический профессиональный стиль)
 * Дизайн: Стратиграфический, минималистичный, инженерный
 */

'use client';

import { useGeologicalStore } from '@/store/geologicalStore';
import type { WizardStep } from '@/store/geologicalStore';
import { ChevronLeft, ChevronRight, Check, Layers, FileText } from 'lucide-react';

// Импорты компонентов шагов
import { ProjectInfoStep } from './ProjectInfoStep';
import { ObjectTypeStep } from './ObjectTypeStep';
import { CategoriesStep } from './CategoriesStep';
import { FoundationStep } from './FoundationStep';
import { GeologyStep } from './GeologyStep';
import { AdditionalStep } from './AdditionalStep';
import { ReviewStep } from './ReviewStep';

interface GeologicalWizardProps {
  onComplete?: () => void;
  isLoading?: boolean;
}

const STEPS_CONFIG: Record<WizardStep, {
  title: string;
  shortTitle: string;
  Component: React.ComponentType;
}> = {
  'project-info': { 
    title: 'Информация о проекте', 
    shortTitle: 'Проект',
    Component: ProjectInfoStep 
  },
  'categories': { 
    title: 'Категории сложности', 
    shortTitle: 'Категории',
    Component: CategoriesStep 
  },
  'object-type': { 
    title: 'Тип объекта', 
    shortTitle: 'Объект',
    Component: ObjectTypeStep 
  },
  'foundation': { 
    title: 'Параметры фундамента', 
    shortTitle: 'Фундамент',
    Component: FoundationStep 
  },
  'geology': { 
    title: 'Геологические условия', 
    shortTitle: 'Геология',
    Component: GeologyStep 
  },
  'additional': { 
    title: 'Дополнительные данные', 
    shortTitle: 'Доп. данные',
    Component: AdditionalStep 
  },
  'review': { 
    title: 'Проверка и завершение', 
    shortTitle: 'Проверка',
    Component: ReviewStep 
  },
};

const STEPS_ORDER: WizardStep[] = [
  'project-info',
  'categories',
  'object-type',
  'foundation',
  'geology',
  'additional',
  'review'
];

export default function GeologicalWizard({ onComplete, isLoading }: GeologicalWizardProps) {
  const { 
    currentStep, 
    completedSteps,
    setCurrentStep,
    canProceed,
    input
  } = useGeologicalStore();

  const currentIndex = STEPS_ORDER.indexOf(currentStep);
  const totalSteps = STEPS_ORDER.length;
  const progress = ((currentIndex + 1) / totalSteps) * 100;

  const handleNext = () => {
    if (currentIndex < totalSteps - 1) {
      setCurrentStep(STEPS_ORDER[currentIndex + 1]);
    } else if (onComplete) {
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentStep(STEPS_ORDER[currentIndex - 1]);
    }
  };

  const handleStepClick = (step: WizardStep) => {
    const stepIndex = STEPS_ORDER.indexOf(step);
    if (stepIndex <= currentIndex || completedSteps.includes(step)) {
      setCurrentStep(step);
    }
  };

  const isStepCompleted = (step: WizardStep) => {
    return completedSteps.includes(step);
  };

  const getStepStatus = (step: WizardStep) => {
    if (step === currentStep) return 'active';
    if (isStepCompleted(step)) return 'completed';
    return 'pending';
  };

  const CurrentStepComponent = STEPS_CONFIG[currentStep].Component;
  const canGoNext = canProceed(currentStep) || currentIndex === totalSteps - 1;
  const canGoPrev = currentIndex > 0;
  const isLastStep = currentIndex === totalSteps - 1;

  return (
    <div className="min-h-screen">
      {/* ШАПКА */}
      <header className="geo-header">
        <div className="geo-logo">
          <div className="geo-logo-icon">
            <Layers />
          </div>
          <div>
            <div className="geo-title">SmartEstimate</div>
            <div className="geo-subtitle">Инженерно-геологические изыскания</div>
          </div>
        </div>
        <div style={{ marginLeft: 'auto', fontSize: '14px', color: 'var(--text-secondary)' }}>
          {input.projectName || 'Новый проект'}
        </div>
      </header>

      {/* СТРАТИГРАФИЧЕСКИЙ ПРОГРЕСС-БАР */}
      <div className="geo-progress-container">
        <div className="geo-progress-bar">
          {/* Горизонтальная линия */}
          <div 
            className="geo-progress-line"
            style={{ '--progress': `${progress}%` } as React.CSSProperties}
          />
          
          {/* Маркеры шагов */}
          <div className="geo-steps">
            {STEPS_ORDER.map((step, idx) => {
              const status = getStepStatus(step);
              const config = STEPS_CONFIG[step];
              
              return (
                <div 
                  key={step}
                  className={`geo-step ${status}`}
                  onClick={() => handleStepClick(step)}
                  style={{ cursor: status === 'pending' ? 'not-allowed' : 'pointer' }}
                >
                  <div className="geo-step-marker">
                    {status === 'completed' ? (
                      <Check size={20} />
                    ) : (
                      idx + 1
                    )}
                  </div>
                  <div className="geo-step-label">{config.shortTitle}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ОСНОВНОЙ КОНТЕНТ */}
      <main className="geo-main">
        <div className="geo-card">
          <div className="geo-card-header">
            <div className="geo-card-icon">
              <FileText size={18} />
            </div>
            <h2 className="geo-card-title">
              {STEPS_CONFIG[currentStep].title}
            </h2>
          </div>
          
          <CurrentStepComponent />
        </div>
      </main>

      {/* НИЖНЯЯ ПАНЕЛЬ НАВИГАЦИИ */}
      <footer className="geo-footer">
        <div className="geo-footer-content">
          <button
            onClick={handlePrev}
            disabled={!canGoPrev}
            className="geo-btn geo-btn-back"
          >
            <ChevronLeft size={20} />
            Назад
          </button>

          <div style={{ 
            fontSize: '14px', 
            color: 'var(--text-secondary)',
            fontWeight: 500 
          }}>
            Шаг {currentIndex + 1} из {totalSteps}
          </div>

          {isLastStep ? (
            <button
              onClick={handleNext}
              disabled={isLoading || !canGoNext}
              className="geo-btn geo-btn-complete"
            >
              {isLoading ? (
                <>Формирование...</>
              ) : (
                <>
                  <Check size={20} />
                  Сформировать ТЗ
                </>
              )}
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={!canGoNext}
              className="geo-btn geo-btn-next"
            >
              Далее
              <ChevronRight size={20} />
            </button>
          )}
        </div>
      </footer>
    </div>
  );
}
