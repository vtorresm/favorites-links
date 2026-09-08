/**
 * Estado estándar de retorno para Server Actions
 * Cumple con principios de tipado estricto y predecible
 */

export interface ActionState<T = unknown> {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
  data?: T;
}

