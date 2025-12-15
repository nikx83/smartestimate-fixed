/**
 * Валидация входных данных
 */

export function validatePositive(value: number, fieldName: string): void {
  if (value <= 0) {
    throw new Error(`${fieldName} должен быть больше 0`);
  }
}

export function validateRange(
  value: number,
  min: number,
  max: number,
  fieldName: string
): void {
  if (value < min || value > max) {
    throw new Error(`${fieldName} должен быть в диапазоне ${min}-${max}`);
  }
}

export function validateEnum<T>(
  value: T,
  allowedValues: T[],
  fieldName: string
): void {
  if (!allowedValues.includes(value)) {
    throw new Error(
      `${fieldName} должен быть одним из: ${allowedValues.join(', ')}`
    );
  }
}
