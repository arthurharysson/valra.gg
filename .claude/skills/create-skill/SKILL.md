---
name: create-skill
description: Cria uma nova skill para o projeto Valra.gg seguindo o padrão estabelecido — frontmatter correto, seções obrigatórias e template base de acordo com o tipo da skill.
argument-hint: <skill-name> [workflow|utility] [descrição opcional]
allowed-tools: [Read, Write, Edit, Glob, Grep, Bash]
---

# create-skill

O usuário invocou: $ARGUMENTS

## O que é uma skill neste projeto

Skills são instruções executáveis que vivem em `.claude/skills/{nome}/SKILL.md`. Elas são invocadas no chat com `/nome-da-skill [argumentos]` e definem um protocolo que a IA deve seguir, com plano de ação, etapas e regras invioláveis.

Existem dois tipos de skill neste projeto:

| Tipo | Quando usar | Exemplos |
|------|-------------|---------|
| `workflow` | Processo com múltiplas etapas que exige aprovação entre passos | `task-manager`, `create-component` |
| `utility` | Consulta, geração rápida ou ação pontual sem etapas de aprovação | `create-skill`, `status` |

---

## Passo 0 — Leitura e validação antes de criar

1. Verificar se já existe uma skill com o mesmo nome em `.claude/skills/`
2. Confirmar o tipo (`workflow` ou `utility`) — se não informado, perguntar ao usuário
3. Apresentar o plano antes de criar qualquer arquivo

---

## Estrutura obrigatória de arquivos

```
.claude/skills/{skill-name}/
└── SKILL.md
```

- Nome da pasta: `kebab-case`
- Um único arquivo `SKILL.md` por skill
- Nunca criar arquivos extras (README, exemplos) a menos que o usuário solicite

---

## Frontmatter obrigatório

```yaml
---
name: nome-da-skill
description: O que a skill faz em uma linha — usado pelo agente para decidir quando invocá-la.
argument-hint: <arg-obrigatório> [arg-opcional] [opção1|opção2]
allowed-tools: [Read, Write, Edit, Glob, Grep, Bash]
---
```

### Regras do frontmatter

- `name`: igual ao nome da pasta, sem espaços, kebab-case
- `description`: começa com verbo no presente ("Cria", "Gerencia", "Executa") — nunca genérica
- `argument-hint`: usa `<obrigatório>` e `[opcional]`, com `|` para alternativas
- `allowed-tools`: listar apenas as ferramentas que a skill realmente precisa

---

## Template: skill tipo `workflow`

Usar quando a skill executa ações em múltiplas etapas que precisam de aprovação do usuário.

```markdown
---
name: {skill-name}
description: {descrição em uma linha}
argument-hint: {dica de argumentos}
allowed-tools: [Read, Write, Edit, Glob, Grep, Bash]
---

# {skill-name}

O usuário invocou: $ARGUMENTS

## O que esta skill faz

{Parágrafo curto explicando o objetivo e quando usar.}

---

## Protocolo de execução

### Passo 0 — Leitura e apresentação do plano

1. Ler os arquivos relevantes antes de propor qualquer mudança
2. Apresentar o plano no formato:

\`\`\`
## Plano: {título}

### O que será feito:
1. {etapa 1} — {arquivo(s) afetado(s)}
2. {etapa 2} — ...

### Arquivos criados:
- {path}

### Arquivos editados:
- {path} — {o que muda}

---
✅ Posso iniciar a Etapa 1?
\`\`\`

**Aguardar aprovação antes de qualquer ação.**

---

### Passo 1..N — Execução etapa por etapa

Para cada etapa:
1. Anunciar: `### Etapa {X} de {total}: {descrição}`
2. Executar apenas essa etapa
3. Reportar e perguntar: `✅ Etapa {X} concluída. Posso avançar para a Etapa {X+1}?`
4. Aguardar aprovação

**Nunca pular etapas nem executar múltiplas sem aprovação.**

---

### Passo Final — Resumo

\`\`\`
## ✅ {Título} — concluído

### O que foi implementado
- {item}

### Arquivos criados/editados
| Arquivo | Ação | Descrição |
|---------|------|-----------|
| {path}  | Criado | {descrição} |
\`\`\`

---

## Regras invioláveis

1. Nunca executar sem apresentar o plano primeiro
2. Nunca avançar etapas sem aprovação explícita
3. Sempre ler os arquivos antes de editar — nunca assumir estado atual
4. Ao encontrar bloqueio, parar e relatar antes de improvisar
```

---

## Template: skill tipo `utility`

Usar quando a skill executa uma ação pontual ou gera algo sem etapas de aprovação.

```markdown
---
name: {skill-name}
description: {descrição em uma linha}
argument-hint: {dica de argumentos}
allowed-tools: [Read, Write, Edit, Glob, Grep, Bash]
---

# {skill-name}

O usuário invocou: $ARGUMENTS

## O que esta skill faz

{Parágrafo curto explicando o objetivo.}

---

## Comportamento

{Descrever o que a skill faz, em que ordem, com quais dados de entrada.}

---

## Output esperado

{Formato do resultado que será apresentado ao usuário.}

---

## Regras

- {Regra 1}
- {Regra 2}
```

---

## Passo Final — Resumo pós-criação (obrigatório)

Ao criar a skill, apresentar:

```
## Skill criada: /{skill-name}

**Tipo:** workflow | utility
**Localização:** .claude/skills/{skill-name}/SKILL.md

### Como invocar
/{skill-name} {exemplo de argumentos}

### O que faz
{descrição em 1-2 frases}

### Adicionar ao CLAUDE.md?
Deseja que eu registre esta skill na seção de skills do CLAUDE.md?
```

---

## Regras gerais

- Sempre criar a pasta + `SKILL.md` juntos — nunca um sem o outro
- O nome da skill deve ser descritivo e único no projeto
- Não duplicar skills — verificar se já existe algo similar antes de criar
- Skills devem ser auto-contidas: qualquer pessoa lendo o `SKILL.md` deve entender o protocolo completo sem consultar outros arquivos
