@AGENTS.md

# Valra.gg

## O que é o projeto

**Valra.gg** é um hub centralizado — um "Super App" — exclusivo para jogadores de **Valorant**. O objetivo da plataforma é unificar em uma única interface funcionalidades que hoje estão espalhadas em diversos sites diferentes, entregando tudo que um jogador de Valorant precisa sem precisar sair do ecossistema.

O sistema é dividido em três pilares principais:

### 1. Estatísticas Pessoais (Tracker)

O jogador faz login com sua conta Riot e acessa um painel completo com seu histórico de partidas, desempenho por agente, evolução de elo e outros dados obtidos via **Riot API**. Funciona como um tracker integrado à plataforma.

### 2. E-sports (VLR)

Seção dedicada ao cenário competitivo do Valorant. Exibe resultados de partidas do **VCT (VALORANT Champions Tour)**, cronograma de campeonatos, resultados de times e standings de ligas regionais e internacionais.

### 3. Pro Settings (ProSettings)

Banco de dados com as configurações de jogadores profissionais. O usuário pode consultar e copiar **códigos de mira** (crosshair codes), **sensibilidade do mouse**, **DPI** e a lista de **periféricos** (mouse, headset, monitor) utilizados por cada pro-player.

---

## Stack Tecnológica

| Tecnologia | Versão | Papel |
|---|---|---|
| Next.js | 16.2.4 | Framework fullstack principal (App Router) |
| React | 19.2.4 | Biblioteca de UI |
| TypeScript | 5.x | Tipagem estática |
| Tailwind CSS | 4.x | Estilização utilitária |
| ESLint | 9.x | Linting e qualidade de código |

> **Atenção:** Next.js 16 e Tailwind CSS v4 introduzem mudanças incompatíveis com versões anteriores. Antes de escrever qualquer código, consulte a documentação em `node_modules/next/dist/docs/`.

## Arquitetura

O projeto usa o **App Router** do Next.js — roteador moderno baseado em React Server Components. O diretório `pages/` não existe; toda a aplicação vive dentro de `src/app/`.

Todo o código fonte fica dentro de `src/`. Nenhum arquivo de código deve ficar na raiz — apenas arquivos de configuração (`next.config.ts`, `tsconfig.json`, etc.).

O layout global é composto por:
- **Sidebar fixa** à esquerda — navegação entre as seções (Home, Perfil, Esports, Pro Settings)
- **Header minimalista** no topo da área de conteúdo — barra de pesquisa global e acesso à conta Riot
- **Área de conteúdo** flexível à direita, onde cada página é renderizada

```
valra.gg/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Layout raiz global (fontes, metadata, providers)
│   │   ├── globals.css             # Estilos globais + paleta de cores
│   │   ├── (public)/               # Rotas acessíveis sem autenticação
│   │   │   ├── layout.tsx          # Layout com Sidebar + Header
│   │   │   ├── page.tsx            # Dashboard home "/"
│   │   │   ├── esports/            # Partidas e campeonatos VCT
│   │   │   └── pro-settings/       # Configurações de pro-players
│   │   └── (private)/              # Rotas protegidas (requer login Riot)
│   │       ├── layout.tsx          # Layout com guard de autenticação
│   │       └── profile/            # Estatísticas pessoais do jogador
│   └── components/
│       ├── layout/                 # Componentes estruturais (Sidebar, TopHeader, PageWrapper)
│       └── ui/                     # Componentes reutilizáveis (GlassCard, Button, Badge, etc.)
├── public/                         # Assets estáticos servidos diretamente
├── next.config.ts
└── tsconfig.json
```

## Comandos

```bash
npm run dev      # Servidor de desenvolvimento (http://localhost:3000)
npm run build    # Build de produção
npm run start    # Serve o build de produção
npm run lint     # Executa o ESLint
```

## Paleta de Cores

| Token | Valor | Uso |
|-------|-------|-----|
| `--color-bg` | `#111111` | Background principal (preto web padrão) |
| `--color-red` | `#FF4655` | Vermelho Valorant — CTAs, alertas, dados inimigos |
| `--color-navy` | `#0D1B2A` | Azul marinho escuro — acentos secundários |

As cores são definidas como CSS custom properties em `src/app/globals.css` e registradas no `@theme` do Tailwind v4.

## Convenções

- Componentes de servidor por padrão — use `"use client"` apenas quando necessário (interatividade, hooks de estado/efeito, APIs do browser).
- Imagens via `next/image`, links via `next/link`.
- TypeScript estrito — sem `any` sem justificativa explícita.

## Gestão de Tasks

O backlog do projeto vive em `TASKS.md` na raiz do repositório. Use a skill `/task-manager` para interagir com ele:

```
/task-manager status          # ver progresso geral
/task-manager run #N          # executar a task N passo a passo
/task-manager add <descrição> # adicionar nova task ao backlog
/task-manager complete #N     # marcar task N como concluída
```

## Skills do Projeto

As skills ficam em `.claude/skills/{nome}/SKILL.md` e são invocadas com `/{nome}`.

| Skill | Tipo | O que faz |
|-------|------|-----------|
| `/task-manager` | workflow | Gerencia o backlog de tasks do TASKS.md |
| `/create-component` | workflow | Cria componentes React seguindo o padrão do projeto |
| `/create-skill` | utility | Cria nova skill seguindo o padrão estabelecido |

Para criar uma nova skill: `/create-skill <nome> [workflow|utility]`
