---
name: create-component
description: Cria componentes React seguindo o padrão da codebase InterSuite (layout vs ui, index.tsx + types.ts, comentários obrigatórios). Sempre apresenta plano de ação antes de executar.
argument-hint: <ComponentName> [ui|layout] [descrição opcional]
allowed-tools: [Read, Write, Edit, Glob, Grep, Bash]
---

# create-component

O usuário invocou: $ARGUMENTS

## Padrão de Componentes — InterSuite

Antes de criar qualquer componente, siga **obrigatoriamente** este fluxo:

---

## 1. CLASSIFICAÇÃO: layout vs ui

**`src/components/ui/`** — Componentes reutilizáveis e genéricos:
- Não têm lógica de negócio
- Podem aparecer em qualquer parte do app
- Exemplos: Button, Input, Modal, Table, Badge, Card

**`src/components/layout/`** — Componentes estruturais e fixos:
- Fazem parte da estrutura visual da página
- Geralmente aparecem uma vez (Sidebar, Header, Footer, PageWrapper)
- Podem ter lógica de navegação ou contexto global

Se o argumento não especificou `ui` ou `layout`, **pergunte ao usuário** antes de continuar.

---

## 2. ESTRUTURA DE ARQUIVOS

Cada componente vive em sua própria pasta com **PascalCase**:

```
src/components/{ui|layout}/{ComponentName}/
├── index.tsx      # Componente + lógica
└── types.ts       # Interfaces de props e tipos internos
```

**Regras:**
- Nunca criar arquivos extras além de `index.tsx` e `types.ts` (exceto se o usuário solicitar)
- `types.ts` contém TODAS as interfaces e tipos do componente — nada inline no index.tsx
- Não criar `stories.tsx` a menos que o usuário peça explicitamente

---

## 3. COMENTÁRIOS OBRIGATÓRIOS

Cada componente **deve** ter um comentário JSDoc no topo da função principal com até 4 linhas explicando:
- O que é o componente
- Como ele funciona / como age

```typescript
/**
 * Button — Botão base reutilizável da UI.
 * Suporta variantes (primary, secondary, ghost), estados de loading e disabled.
 * Aceita ícones à esquerda/direita via props iconLeft e iconRight.
 * Usa Tailwind para estilização e framer-motion para micro-animações opcionais.
 */
```

Funções auxiliares internas também precisam de comentário de 1 linha se não forem auto-explicativas.

---

## 4. PLANO DE AÇÃO — OBRIGATÓRIO ANTES DE EXECUTAR

**Antes de criar qualquer arquivo**, apresente ao usuário um plano dividido em camadas:

```
## Plano de Ação: {ComponentName}

**Classificação:** ui | layout
**Localização:** src/components/{tipo}/{ComponentName}/

### Camada 1 — Por que esta abordagem?
[Explique por que a estrutura proposta é a melhor forma de implementar]

### Camada 2 — Como será construído?
[Descreva a estrutura do componente: props, estado interno, lógica principal]

### Camada 3 — Como será usado?
[Mostre um exemplo de uso no contexto real do projeto]

### Camada 4 — Como será implementado?
[Liste os arquivos que serão criados/alterados e o que cada um conterá]

---
Posso prosseguir desta forma?
```

**Aguarde confirmação do usuário antes de escrever qualquer código.**

---

## 5. TEMPLATE BASE

### `types.ts`

```typescript
// Props principais do componente
export interface {ComponentName}Props {
  // props aqui
  className?: string
}
```

### `index.tsx`

```typescript
'use client' // apenas se necessário

import { {ComponentName}Props } from './types'

/**
 * {ComponentName} — {descrição em 1 linha}.
 * {como funciona — linha 2}
 * {detalhes adicionais — linha 3 (opcional)}
 * {nota de uso — linha 4 (opcional)}
 */
export function {ComponentName}({ className, ...props }: {ComponentName}Props) {
  return (
    <div className={className}>
      {/* conteúdo */}
    </div>
  )
}
```

---

## 6. RESUMO PÓS-EXECUÇÃO — OBRIGATÓRIO

Ao final de toda criação ou alteração, apresente:

```
## Resumo

### O que foi feito
- [lista do que foi criado/alterado]

### Arquivos criados/modificados
| Arquivo | Ação | Motivo |
|---------|------|--------|
| src/components/ui/X/index.tsx | Criado | ... |
| src/components/ui/X/types.ts  | Criado | ... |

### Decisões técnicas
- [por que foi feito dessa forma e não de outra]

### Como usar
\`\`\`tsx
// exemplo de uso real
\`\`\`
```

---

## 7. REGRAS GERAIS

- Sempre usar TypeScript strict — sem `any`
- Props opcionais com `?`, nunca com `| undefined` explícito
- Tailwind para estilos — sem CSS modules ou styled-components
- Se o componente precisar de estado, usar `useState` / `useReducer` localmente
- Se precisar de contexto externo (auth, tenant, permissões), usar os hooks existentes do projeto
- Nunca duplicar lógica que já existe em `src/hooks/` ou `src/utils/`
- Verificar se o componente já existe antes de criar (`Glob` em `src/components/`)
