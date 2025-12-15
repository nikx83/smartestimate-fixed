/**
 * Путь: /app/geological/page.tsx
 * Название: GeologicalSurveyPage (ПОЛНАЯ ИНТЕГРАЦИЯ с геологическим стилем)
 * 
 * ОСОБЕННОСТИ:
 * - Использует классы из globals-GEOLOGICAL.css
 * - Полная интеграция с Zustand store
 * - Автогенерация ТЗ на шаге review
 * - Геологическая палитра и стилистика
 */

'use client';

import { useState, useEffect } from 'react';
import { useGeologicalStore } from '@/store/geologicalStore';
import { useGeologicalEngine } from '@/hooks/useGeologicalEngine';
import GeologicalWizard from '@/components/geological/GeologicalWizard';
import { TechnicalAssignmentDisplay } from '@/components/technical-assignment/TechnicalAssignmentDisplay';
import { EstimateIntegration } from '@/components/technical-assignment/EstimateIntegration';
import { Layers, AlertCircle, CheckCircle2, ArrowLeft, Loader2, FileText } from 'lucide-react';

export default function GeologicalSurveyPage() {
  const { 
    input,
    currentStep,
    technicalAssignment,
    generationStatus 
  } = useGeologicalStore();
  
  const { 
    generateTechnicalAssignment, 
    isGenerating,
    generationError,
    getStatistics
  } = useGeologicalEngine();
  
  const [isGeneratingManually, setIsGeneratingManually] = useState(false);

  // Автогенерация при достижении шага review
  useEffect(() => {
    if (currentStep === 'review' && !technicalAssignment && generationStatus === 'idle') {
      handleGenerate();
    }
  }, [currentStep, technicalAssignment, generationStatus]);

  const handleGenerate = async () => {
    setIsGeneratingManually(true);
    await generateTechnicalAssignment();
    setIsGeneratingManually(false);
  };

  const stats = getStatistics();
  const showWizard = !technicalAssignment;
  const showTechnicalAssignment = !!technicalAssignment;

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* ВИЗАРД (пока не сгенерировано ТЗ) */}
      {showWizard && (
        <>
          <GeologicalWizard isLoading={isGenerating || isGeneratingManually} />

          {/* Генерация в процессе */}
          {(isGenerating || isGeneratingManually) && (
            <div style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 200,
              padding: '32px',
              background: '#FFFFFF',
              borderRadius: '12px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
              minWidth: '400px',
              border: '2px solid var(--mineral-turquoise)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <Loader2 
                  size={40} 
                  style={{ 
                    color: 'var(--mineral-turquoise)',
                    animation: 'spin 1s linear infinite'
                  }} 
                />
                <div>
                  <div style={{ 
                    fontSize: '18px', 
                    fontWeight: 600, 
                    color: 'var(--text-primary)',
                    marginBottom: '4px'
                  }}>
                    Формирование технического задания...
                  </div>
                  <div style={{ 
                    fontSize: '14px', 
                    color: 'var(--text-secondary)' 
                  }}>
                    Применяем нормативы СП РК и генерируем состав работ
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Ошибка генерации */}
          {generationError && (
            <div style={{
              position: 'fixed',
              bottom: '100px',
              left: '50%',
              transform: 'translateX(-50%)',
              maxWidth: '600px',
              width: '90%',
              padding: '20px',
              background: '#FEE',
              border: '2px solid #C00',
              borderRadius: '10px',
              zIndex: 200
            }}>
              <div style={{ display: 'flex', alignItems: 'start', gap: '12px' }}>
                <AlertCircle size={24} style={{ color: '#C00', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ 
                    fontSize: '16px', 
                    fontWeight: 600, 
                    color: '#800',
                    marginBottom: '8px'
                  }}>
                    Ошибка генерации технического задания
                  </div>
                  <div style={{ fontSize: '14px', color: '#600', marginBottom: '12px' }}>
                    {generationError}
                  </div>
                  <button
                    onClick={handleGenerate}
                    style={{
                      padding: '8px 16px',
                      background: '#C00',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Попробовать снова
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* ТЕХНИЧЕСКОЕ ЗАДАНИЕ (после генерации) */}
      {showTechnicalAssignment && (
        <div style={{ minHeight: '100vh' }}>
          {/* ГЕОЛОГИЧЕСКАЯ ШАПКА */}
          <header className="geo-header">
            <div className="geo-logo">
              <div className="geo-logo-icon">
                <Layers />
              </div>
              <div>
                <div className="geo-title">Техническое задание</div>
                <div className="geo-subtitle">
                  {input.projectName || 'Инженерно-геологические изыскания'}
                </div>
              </div>
            </div>

            {/* Статус */}
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={20} style={{ color: 'var(--mineral-turquoise)' }} />
              <span style={{ 
                fontSize: '14px', 
                fontWeight: 600,
                color: 'var(--mineral-turquoise)'
              }}>
                Готово
              </span>
            </div>
          </header>

          {/* ОСНОВНОЙ КОНТЕНТ */}
          <main className="geo-main" style={{ paddingTop: '96px' }}>
            {/* СТАТИСТИКА */}
            {stats && (
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(4, 1fr)', 
                gap: '16px',
                marginBottom: '24px'
              }}>
                <div className="geo-card" style={{ padding: '20px', textAlign: 'center' }}>
                  <div style={{ 
                    fontSize: '32px', 
                    fontWeight: 700, 
                    color: 'var(--mineral-turquoise)',
                    marginBottom: '4px'
                  }}>
                    {stats.totalWorks}
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                    Всего работ
                  </div>
                </div>

                <div className="geo-card" style={{ padding: '20px', textAlign: 'center' }}>
                  <div style={{ 
                    fontSize: '32px', 
                    fontWeight: 700, 
                    color: 'var(--mineral-malachite)',
                    marginBottom: '4px'
                  }}>
                    {stats.mandatoryWorks}
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                    Обязательных
                  </div>
                </div>

                <div className="geo-card" style={{ padding: '20px', textAlign: 'center' }}>
                  <div style={{ 
                    fontSize: '32px', 
                    fontWeight: 700, 
                    color: '#D97706',
                    marginBottom: '4px'
                  }}>
                    {stats.recommendedWorks}
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                    Рекомендуемых
                  </div>
                </div>

                <div className="geo-card" style={{ padding: '20px', textAlign: 'center' }}>
                  <div style={{ 
                    fontSize: '32px', 
                    fontWeight: 700, 
                    color: '#7C3AED',
                    marginBottom: '4px'
                  }}>
                    {stats.appliedBlocks}
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                    Блоков применено
                  </div>
                </div>
              </div>
            )}

            {/* ОТОБРАЖЕНИЕ ТЗ */}
            <div className="geo-card">
              <div className="geo-card-header">
                <div className="geo-card-icon">
                  <FileText size={18} />
                </div>
                <h2 className="geo-card-title">Техническое задание</h2>
              </div>

              <TechnicalAssignmentDisplay
                assignment={technicalAssignment}
                onUpdate={(updated) => {
                  useGeologicalStore.getState().setTechnicalAssignment(updated);
                }}
                onExport={(format) => {
                  console.log('Экспорт в формате:', format);
                }}
              />
            </div>

            {/* ИНТЕГРАЦИЯ СО СМЕТОЙ */}
            <div style={{ marginTop: '24px' }}>
              <EstimateIntegration
                assignment={technicalAssignment}
                onEstimateCreated={(estimate) => {
                  console.log('Смета создана:', estimate);
                }}
              />
            </div>
          </main>

          {/* ГЕОЛОГИЧЕСКИЙ ФУТЕР */}
          <footer className="geo-footer">
            <div className="geo-footer-content">
              <button
                onClick={() => {
                  if (confirm('Вернуться к визарду? Несохранённые изменения будут потеряны.')) {
                    useGeologicalStore.getState().setTechnicalAssignment(null);
                    useGeologicalStore.getState().setCurrentStep('project-info');
                  }
                }}
                className="geo-btn geo-btn-back"
              >
                <ArrowLeft size={20} />
                Вернуться к визарду
              </button>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="geo-btn"
                  style={{
                    background: 'var(--soil-medium)',
                    color: 'var(--text-primary)'
                  }}
                >
                  🔄 Пересоздать ТЗ
                </button>

                <button
                  onClick={() => alert('Функция экспорта в разработке')}
                  className="geo-btn geo-btn-next"
                >
                  <FileText size={20} />
                  Экспортировать
                </button>
              </div>
            </div>
          </footer>
        </div>
      )}

      {/* АНИМАЦИЯ ВРАЩЕНИЯ */}
      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
