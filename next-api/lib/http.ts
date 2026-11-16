import { NextResponse } from 'next/server'
import { ZodError } from 'zod'

export function jsonData<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ data }, init)
}

export function jsonList<T>(
  data: T[],
  meta: { page: number; size: number; totalElements: number; totalPages: number },
) {
  return NextResponse.json({ data, meta })
}

export function jsonError(
  status: number,
  code: string,
  message: string,
  details?: unknown,
) {
  return NextResponse.json(
    { error: { code, message, ...(details === undefined ? {} : { details }) } },
    { status },
  )
}

export function handleRouteError(error: unknown) {
  if (error instanceof ZodError) {
    return jsonError(400, 'VALIDATION_ERROR', 'Request validation failed', error.flatten())
  }

  console.error('University API request failed', error)
  return jsonError(500, 'INTERNAL_ERROR', 'An unexpected error occurred')
}
