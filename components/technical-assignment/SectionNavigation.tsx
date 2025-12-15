/**
 * Путь: /components/technical-assignment/SectionNavigation.tsx
 * Название: SectionNavigation
 * Назначение: Боковое навигационное меню для быстрого перехода между разделами ТЗ
 * 
 * Особенности:
 * - Sticky позиционирование
 * - Индикаторы заполненности разделов
 * - Плавная прокрутка к разделу
 * - Прогресс-бар общей заполненности
 */

'use client';

import { useState, useEffect } from 'react';
import { 
  FileText, Building2, MapPin, Target, Wrench, 
  BookOpen, Database, Cog, Shield, Leaf, 
  HardHat, TrendingUp, FileCheck, MoreHorizontal, User 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Section {
  id: string;
  number: string;
  title: string;
  icon: React.ReactNode;
  completeness: number; // 0-100%
}

interface SectionNavigationProps {
  sections: Section[];
  currentSection?: string;
  onSectionClick: (sectionId: string) => void;
  className?: string;
}

export function SectionNavigation({
  sections,
  currentSection,
  onSectionClick,
  className,
}: SectionNavigationProps) {
  const [isSticky, setIsSticky] = useState(false);

  // Отслеживание скролла для эффекта sticky
  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Вычисление общего прогресса
  const overallProgress = Math.round(
    sections.reduce((sum, s) => sum + s.completeness, 0) / sections.length
  );

  return (
    <div className={cn("w-72", className)}>
      <div
        className={cn(
          "transition-all duration-300",
          isSticky ? "fixed top-20 w-72" : "relative"
        )}
      >
        {/* Общий прогресс */}
        <div className="bg-white rounded-xl shadow-sm border border-amber-100 p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Прогресс заполнения
            </span>
            <span className="text-sm font-bold text-amber-600">
              {overallProgress}%
            </span>
          </div>
          
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
          
          <p className="text-xs text-gray-500 mt-2">
            {overallProgress === 100
              ? '🎉 Техническое задание готово!'
              : overallProgress > 75
              ? 'Почти готово! Осталось совсем немного'
              : overallProgress > 50
              ? 'Отличная работа, продолжайте!'
              : 'Заполните обязательные разделы'}
          </p>
        </div>

        {/* Навигация по разделам */}
        <div className="bg-white rounded-xl shadow-sm border border-amber-100 overflow-hidden">
          <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100">
            <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-600" />
              Разделы документа
            </h3>
          </div>

          <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
            <nav className="p-2 space-y-1">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => onSectionClick(section.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200",
                    currentSection === section.id
                      ? "bg-amber-100 text-amber-900 shadow-sm"
                      : "hover:bg-gray-50 text-gray-700"
                  )}
                >
                  {/* Иконка раздела */}
                  <div
                    className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                      currentSection === section.id
                        ? "bg-amber-200 text-amber-700"
                        : "bg-gray-100 text-gray-500"
                    )}
                  >
                    {section.icon}
                  </div>

                  {/* Номер и название */}
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-gray-500 mb-0.5">
                      Раздел {section.number}
                    </div>
                    <div className="text-sm font-medium truncate">
                      {section.title}
                    </div>
                  </div>

                  {/* Индикатор заполненности */}
                  <div className="flex-shrink-0">
                    {section.completeness === 100 ? (
                      <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                        <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    ) : section.completeness > 0 ? (
                      <div className="relative w-5 h-5">
                        <svg className="w-5 h-5 transform -rotate-90">
                          <circle
                            cx="10"
                            cy="10"
                            r="8"
                            stroke="currentColor"
                            strokeWidth="2"
                            fill="none"
                            className="text-gray-200"
                          />
                          <circle
                            cx="10"
                            cy="10"
                            r="8"
                            stroke="currentColor"
                            strokeWidth="2"
                            fill="none"
                            strokeDasharray={`${2 * Math.PI * 8}`}
                            strokeDashoffset={`${2 * Math.PI * 8 * (1 - section.completeness / 100)}`}
                            className="text-amber-500 transition-all duration-500"
                          />
                        </svg>
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                    )}
                  </div>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Подсказка */}
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-xs text-blue-700 leading-relaxed">
            💡 <strong>Совет:</strong> Зелёная галочка означает, что раздел полностью заполнен. 
            Кольцо показывает процент заполнения.
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * Хук для автоматического отслеживания текущего раздела при скролле
 */
export function useActiveSection(sectionIds: string[]) {
  const [activeSection, setActiveSection] = useState<string | undefined>(
    sectionIds[0]
  );

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;

      for (const id of sectionIds) {
        const element = document.getElementById(id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Вызвать сразу для инициализации

    return () => window.removeEventListener('scroll', handleScroll);
  }, [sectionIds]);

  return activeSection;
}

/**
 * Функция плавной прокрутки к разделу
 */
export function scrollToSection(sectionId: string) {
  const element = document.getElementById(sectionId);
  if (element) {
    const yOffset = -80; // Отступ сверху для fixed header
    const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;

    window.scrollTo({
      top: y,
      behavior: 'smooth',
    });
  }
}

/**
 * Иконки для каждого раздела ТЗ
 */
export const SECTION_ICONS = {
  general: <FileText className="w-4 h-4" />,
  object: <Building2 className="w-4 h-4" />,
  natural: <MapPin className="w-4 h-4" />,
  purpose: <Target className="w-4 h-4" />,
  works: <Wrench className="w-4 h-4" />,
  normative: <BookOpen className="w-4 h-4" />,
  initial: <Database className="w-4 h-4" />,
  production: <Cog className="w-4 h-4" />,
  safety: <Shield className="w-4 h-4" />,
  environmental: <Leaf className="w-4 h-4" />,
  protection: <HardHat className="w-4 h-4" />,
  forecast: <TrendingUp className="w-4 h-4" />,
  reporting: <FileCheck className="w-4 h-4" />,
  other: <MoreHorizontal className="w-4 h-4" />,
  customer: <User className="w-4 h-4" />,
};
