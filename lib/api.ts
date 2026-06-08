import { NextResponse } from 'next/server'

export function ok<T>(data: T, status = 200) {
  return NextResponse.json({ ok: true, data }, { status })
}

export function err(message: string, code: string, status = 400) {
  return NextResponse.json({ ok: false, error: { message, code } }, { status })
}

export const API_ERRORS = {
  FORBIDDEN:    { message: 'Forbidden',     code: 'FORBIDDEN' },
  UNAUTHORIZED: { message: 'Unauthorized',  code: 'UNAUTHORIZED' },
  NOT_FOUND:    { message: 'Not found',     code: 'NOT_FOUND' },
  BAD_REQUEST:  { message: 'Bad request',   code: 'BAD_REQUEST' },
} as const
