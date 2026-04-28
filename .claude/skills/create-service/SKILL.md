---
name: create-service
description: Cria um service seguindo o padrão do projeto Valra.gg — api/leaderboard, actions/leaderboard e leaderboard/ com index + types (+ schema só para POST). Apresenta plano antes de executar.
argument-hint: <service-name> [get|post|put|patch|delete] [descrição opcional]
allowed-tools: [Read, Write, Edit, Glob, Grep, Bash]
---

# create-service

O usuário invocou: $ARGUMENTS

## O que esta skill faz

Cria a estrutura completa de um service dentro de `src/services/`. A estrutura é dividida em três responsabilidades: chamadas HTTP (`api/{nome}/index.ts`), lógica de negócio (`actions/{nome}/index.ts`) e definição do contrato (`{nome}/types.ts` + `{nome}/index.ts`).

---

## Estrutura de pastas

```
src/services/
├── api.ts                         # Base API client (já existente — não recriar)
├── api/
│   └── {service-name}/
│       └── index.ts              # chamadas HTTP — apenas index.ts, sem outros arquivos
├── actions/
│   └── {service-name}/
│       └── index.ts              # lógica de negócio — apenas index.ts, sem outros arquivos
└── {service-name}/
    ├── index.ts                  # re-export de types (mínimo)
    ├── types.ts                  # tipos de request e response
    └── schema.ts                 # apenas se houver endpoints POST (Zod — não importado em nenhum lugar)
```

**Regra:** cada pasta de service tem no máximo 3 arquivos: `index.ts`, `types.ts` e `schema.ts`.

---

## Convenção de nomes de funções

### `api/{service}/index.ts` — começa com o método HTTP

| Método HTTP | Prefixo | Exemplo |
|-------------|---------|---------|
| GET         | `get`   | `getLeaderboard` |
| POST        | `post`  | `postLeaderboard` |
| PUT         | `put`   | `putLeaderboard` |
| PATCH       | `patch` | `patchLeaderboard` |
| DELETE      | `delete`| `deleteLeaderboard` |

Cada função tem **1 comentário** descrevendo o que o endpoint faz:

```typescript
import { api } from '../../api'
import type { GetLeaderboardRequest, GetLeaderboardResponse } from '../../leaderboard/types'

// Retorna o ranking dos melhores jogadores de uma região
export async function getLeaderboard({ region }: GetLeaderboardRequest): Promise<GetLeaderboardResponse> {
  return api.get<GetLeaderboardResponse>(`/valorant/v3/leaderboard/${region}`, {
    Authorization: process.env.NEXT_SECRET_API_KEY ?? '',
  })
}
```

### `actions/{service}/index.ts` — descreve a ação de negócio

| Ação        | Prefixo  | Exemplo |
|-------------|----------|---------|
| Listagem    | `list`   | `listLeaderboard` |
| Busca única | `find`   | `findLeaderboard` |
| Criação     | `create` | `createLeaderboard` |
| Atualização | `update` | `updateLeaderboard` |
| Remoção     | `remove` | `removeLeaderboard` |

```typescript
import { getLeaderboard } from '../../api/leaderboard'
import type { GetLeaderboardRequest } from '../../leaderboard/types'

// Lista o leaderboard de uma região
export async function listLeaderboard(params: GetLeaderboardRequest) {
  return getLeaderboard(params)
}
```

---

## Protocolo de execução

### Passo 0 — Leitura e apresentação do plano

1. Verificar se já existe pasta em `src/services/api/{service-name}/`, `src/services/actions/{service-name}/` ou `src/services/{service-name}/`
2. Identificar quais métodos HTTP o service terá
3. Apresentar o plano:

```
## Plano: Service {ServiceName}

### Arquivos a criar:
1. `services/{name}/types.ts`           — interfaces de request e response
2. `services/{name}/index.ts`           — re-export de types
3. `services/api/{name}/index.ts`       — chamadas HTTP
4. `services/actions/{name}/index.ts`   — lógica de negócio
5. `services/{name}/schema.ts`          — (apenas se houver POST)

### Funções planejadas:
**api/{name}/index.ts:**
- `get{ServiceName}` — {descrição do endpoint}

**actions/{name}/index.ts:**
- `list{ServiceName}` — {descrição da ação}

---
✅ Posso iniciar a Etapa 1?
```

**Aguardar aprovação antes de qualquer ação.**

---

### Passo 1 — Criar `{name}/types.ts`

```typescript
export interface Get{ServiceName}Request {
  // params de query ou path
}

export interface {ServiceName}Item {
  // campos do item retornado pela API
}

export type Get{ServiceName}Response = {ServiceName}Item[]
```

Reportar: `✅ Etapa 1 concluída. Posso avançar para a Etapa 2?`

---

### Passo 2 — Criar `{name}/index.ts`

```typescript
export * from './types'
```

Reportar: `✅ Etapa 2 concluída. Posso avançar para a Etapa 3?`

---

### Passo 3 — Criar `api/{name}/index.ts`

- Importar `api` de `../../api`
- Importar tipos de `../../{name}/types`
- 1 comentário por função descrevendo o endpoint
- Nome começa com método HTTP

Reportar: `✅ Etapa 3 concluída. Posso avançar para a Etapa 4?`

---

### Passo 4 — Criar `actions/{name}/index.ts`

- Importar função de `../../api/{name}`
- Importar tipos de `../../{name}/types`
- 1 comentário por função descrevendo a ação
- Nome descreve a ação de negócio

Reportar: `✅ Etapa 4 concluída. Posso avançar para a Etapa Final?`

---

### Passo 5 — Criar `{name}/schema.ts` (somente se houver POST)

```typescript
import { z } from 'zod'

// Schema do body do POST /{endpoint}
export const post{ServiceName}Schema = z.object({
  // campos
})

export type Post{ServiceName}Body = z.infer<typeof post{ServiceName}Schema>
```

**Não importar o schema em nenhum outro arquivo — salvo apenas para uso futuro.**

---

### Passo Final — Resumo

```
## ✅ Service {ServiceName} — concluído

### Arquivos criados
| Arquivo | Descrição |
|---------|-----------|
| src/services/{name}/types.ts          | Tipos de request/response |
| src/services/{name}/index.ts          | Re-export de types |
| src/services/api/{name}/index.ts      | Chamadas HTTP |
| src/services/actions/{name}/index.ts  | Lógica de negócio |

### Como usar
\`\`\`typescript
import { listLeaderboard } from '@/services/actions/{name}'

const data = await listLeaderboard({ region: 'br' })
\`\`\`
```

---

## Regras invioláveis

1. Nunca executar sem apresentar o plano primeiro
2. Nunca avançar etapas sem aprovação explícita
3. Nunca recriar ou modificar `src/services/api.ts` — é o base client global
4. `schema.ts` só é criado se houver POST e nunca é importado em outros arquivos
5. Nomes em `api/` sempre começam com o método HTTP (`get`, `post`, `put`, `patch`, `delete`)
6. Nomes em `actions/` sempre descrevem a ação (`list`, `find`, `create`, `update`, `remove`)
7. Todos os tipos ficam em `{name}/types.ts` — sem interfaces inline nos outros arquivos
8. Cada pasta de service tem no máximo 3 arquivos: `index.ts`, `types.ts`, `schema.ts`
9. `api/{name}/index.ts` e `actions/{name}/index.ts` têm apenas `index.ts` — sem outros arquivos
10. Sempre usar TypeScript strict — sem `any`
