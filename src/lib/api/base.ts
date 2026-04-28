import { ApiError } from './error-handler'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_API ?? ''

export async function fetchApi<T>(path: string, options?: RequestInit): Promise<T> {
  const method = options?.method ?? 'GET'
  const url = `${BASE_URL}${path}`

  console.log(`\n→ [${method}] ${url}`)

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  })

  const data = await response.json()

  console.log(`← [${response.status}] ${url}`)
  console.log(JSON.stringify(data, null, 2))

  if (!response.ok) {
    throw new ApiError(response.status, data?.message ?? response.statusText, data?.errors)
  }

  return data as T
}
