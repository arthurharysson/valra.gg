import { z } from 'zod'

export interface ApiErrorResponse {
  success: false
  message: string
  status?: number
  errors?: Record<string, string[]> | string
}

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly errors?: Record<string, string[]> | string
  ) {
    super(message)
    this.name = 'ApiError'
  }

  toResponse(): ApiErrorResponse {
    return {
      success: false,
      message: this.message,
      status: this.status,
      ...(this.errors && { errors: this.errors }),
    }
  }
}

export function handleZodError(error: z.ZodError): never {
  const errors = error.issues.reduce<Record<string, string[]>>((acc, issue) => {
    const key = issue.path.join('.')
    if (!acc[key]) acc[key] = []
    acc[key].push(issue.message)
    return acc
  }, {})

  throw new ApiError(422, 'Dados inválidos', errors)
}
