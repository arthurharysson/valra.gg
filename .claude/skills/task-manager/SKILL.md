---
name: task-manager
description: Gerencia o backlog de tarefas do TASKS.md — adicionar novas tasks, executar uma task passo a passo com aprovação entre etapas e marcar como concluída ao final.
argument-hint: [add <descrição> | run <#N> | status | complete <#N>]
allowed-tools: [Read, Write, Edit, Glob, Grep, Bash]
---

# task-manager

O usuário invocou: $ARGUMENTS

## Modos de operação

- `add <descrição>` — Adiciona uma nova task ao TASKS.md seguindo o template
- `run <#N>` — Executa a task número N passo a passo com aprovação entre etapas
- `status` — Lê o TASKS.md e exibe resumo visual do progresso
- `complete <#N>` — Marca a task N como concluída no TASKS.md (usar ao final de cada sessão)

---

## MODO: `add`

### Template de nova task

Antes de adicionar, verificar:
1. A task já existe no TASKS.md?
2. Qual é a posição correta na ordem ordinal (Primeiro/Segundo/etc.)?
3. A task tem dependências de outras?

### Formato obrigatório no TASKS.md

```markdown
### #N · {Título da Task} `[ ]`
> ← depende de: #{M} (ou "nenhum")

- [ ] Sub-task 1 — descrição clara do que fazer
- [ ] Sub-task 2 — ...
- [ ] Sub-task 3 — ...
```

### Regras de adição
- Nunca inserir no meio de uma task existente — sempre no final da seção correta
- Numerar sequencialmente (#N onde N = último número + 1)
- Sub-tasks devem ser acionáveis e verificáveis — não genéricas
- Incluir a dependência se a task precisar de algo anterior para funcionar

---

## MODO: `run`

### Protocolo de execução passo a passo

Este é o protocolo obrigatório toda vez que o usuário pede "execute a task #N":

---

**PASSO 0 — Leitura e apresentação do plano**

1. Ler o TASKS.md e localizar a task #N
2. Verificar se as dependências estão marcadas como `[x]` — se não estiverem, alertar o usuário antes de continuar
3. Ler todos os arquivos relevantes antes de propor qualquer mudança
4. Apresentar o plano completo ao usuário no seguinte formato:

```
## Executando Task #N · {Título}

**Dependências:** OK | ⚠️ {descrição do problema}

### O que será feito (sub-tasks):
1. {sub-task 1} — {arquivo(s) afetado(s)}
2. {sub-task 2} — {arquivo(s) afetado(s)}
...

### Arquivos que serão criados:
- {path completo}

### Arquivos que serão editados:
- {path completo} — {o que muda}

### Ordem de execução:
Etapa 1 → Etapa 2 → ... → Etapa N

---
✅ Posso iniciar a Etapa 1?
```

**Aguardar aprovação do usuário antes de qualquer ação.**

---

**PASSO 1..N — Execução etapa por etapa**

Para cada etapa:

1. Anunciar qual etapa está sendo executada:
   ```
   ### Etapa {X} de {total}: {descrição}
   ```

2. Executar apenas essa etapa (criar/editar arquivos)

3. Ao terminar a etapa, relatar o que foi feito e perguntar:
   ```
   ✅ Etapa {X} concluída.
   - {arquivo criado/editado} — {o que mudou}
   
   Posso avançar para a Etapa {X+1}: {descrição}?
   ```

4. Aguardar aprovação antes de continuar

**Nunca pular etapas ou executar múltiplas etapas sem aprovação.**

---

**PASSO FINAL — Encerramento da sessão**

Após a última etapa aprovada:

1. Apresentar resumo completo:
   ```
   ## ✅ Task #N concluída — {Título}

   ### O que foi implementado
   - {item 1}
   - {item 2}

   ### Arquivos criados
   | Arquivo | Descrição |
   |---------|-----------|
   | {path} | {descrição} |

   ### Arquivos editados
   | Arquivo | O que mudou |
   |---------|-------------|
   | {path} | {mudança} |

   ### Como testar
   1. `npm run dev`
   2. Acessar {rota ou componente}
   3. Verificar {comportamento esperado}

   ---
   Marcar task #N como concluída no TASKS.md?
   ```

2. **Aguardar confirmação do usuário** para marcar como concluída

3. Ao confirmar, executar o MODO `complete #N`

---

## MODO: `complete`

Ao receber confirmação do usuário para marcar como concluída:

1. Ler o TASKS.md
2. Localizar a task #N
3. Substituir `[ ]` por `[x]` em **todas** as sub-tasks da task
4. Substituir o `[ ]` do título da task por `[x]`
5. Adicionar uma linha na tabela "Controle de sessões" no TASKS.md:
   ```
   | {número da sessão} | {data atual} | Task #{N} — {título} | {observações se houver} |
   ```
6. Confirmar:
   ```
   ✅ Task #N marcada como concluída no TASKS.md.
   Próxima task disponível: #{N+1} · {título}
   ```

---

## MODO: `status`

Ler o TASKS.md e exibir:

```
## Status do Backlog — AR INTER

### Progresso geral
▓▓▓░░░░░░░ 3/17 tasks concluídas (18%)

### Concluídas [x]
- #1 · Dark/Light Mode
- ...

### Em progresso [~]
- #2 · NavBar — Completar funcionalidades

### Pendentes [ ]
- #3 · Footer
- #4 · Animações globais
- ...

### Próxima recomendada
#3 · Footer — sem dependências pendentes
```

---

## Regras gerais invioláveis

1. **Nunca executar** sem apresentar o plano completo primeiro
2. **Nunca avançar** para a próxima etapa sem aprovação explícita do usuário
3. **Nunca marcar** como concluída sem confirmação final do usuário
4. **Sempre verificar** dependências antes de iniciar uma task
5. **Sempre ler** os arquivos antes de editar — nunca assumir o estado atual
6. **Uma task por sessão** — não misturar tasks diferentes na mesma conversa
7. **Ao encontrar um bloqueio** (erro, dúvida técnica, conflito), parar e relatar antes de improvisar uma solução

---

## Como adicionar uma nova task (guia rápido para o usuário)

O usuário pode pedir:
- `"adicione ao backlog: implementar página de parceiros"`
- `"adicione como tarefa urgente antes do #3: corrigir bug no Hero"`
- `"crie uma task para integrar o gateway Mercado Pago"`

O agente vai classificar na posição correta, criar as sub-tasks e confirmar antes de salvar.

---

## Exemplo de fluxo completo

```
Usuário: execute a task #1
Agente:  [apresenta plano da task #1 com todas as etapas]
Usuário: pode começar
Agente:  Etapa 1 de 7: instalar next-themes → executa → relata
Usuário: ok
Agente:  Etapa 2 de 7: configurar ThemeProvider → executa → relata
...
Agente:  ✅ Task #1 concluída. Marcar no TASKS.md?
Usuário: sim
Agente:  [marca todas as sub-tasks como [x] e atualiza a tabela]
```