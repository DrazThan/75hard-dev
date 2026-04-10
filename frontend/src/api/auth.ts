import { http } from './client'
import type { Token, User } from '@/types'

export async function login(username: string, password: string): Promise<Token> {
  const form = new URLSearchParams({ username, password })
  const { data } = await http.post<Token>('/auth/login', form, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
  return data
}

export async function me(token?: string): Promise<User> {
  const { data } = await http.get<User>('/auth/me', {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  })
  return data
}
