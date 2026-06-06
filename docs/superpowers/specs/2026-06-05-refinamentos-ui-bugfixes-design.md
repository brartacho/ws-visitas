# Spec — Refinamentos UI, Bugfixes e Conformidade com Regras do Projeto

**Data:** 2026-06-05
**Escopo:** Correção de bugs, conformidade obrigatória com regras da KODIE Academy, refinamentos cirúrgicos de UI sem alterar a estrutura ou layout existente.

---

## Contexto

O sistema WS Visitas é um portal de agendamento de visitas à Wilson Sons, desenvolvido como projeto acadêmico da KODIE Academy. A análise Playwright de todas as 13 rotas identificou um erro crítico obrigatório e um conjunto de problemas de UI menores.

**O que NÃO muda:** layout das páginas, estrutura do wizard, lógica de negócio, integração com Apps Script, componentes admin.

---

## 1. Correção Crítica — Footer (OBRIGATÓRIO)

### Problema
O footer atual exibe apenas:
```
Wilson Sons - Gestão de Visitas | Portal de agendamento, acompanhamento e controle de visitas.
```

O regulamento da KODIE Academy exige o texto exato:
> "Projeto desenvolvido para fins educativos na KODIE Academy"

### Solução
Ampliar o footer de 1 linha para 2 zonas:
- **Zona superior:** logo oficial `logo.png` (filter branco) + nome do portal + links de navegação com ícones SVG
- **Zona inferior:** copyright © 2026 + badge âmbar com o texto obrigatório da KODIE + ícone SVG de formação

**Arquivo:** `src/App.tsx` — função `Footer()` (linha 265–274)

**Texto exato no badge:**
```
Projeto desenvolvido para fins educativos na KODIE Academy
```

**Cor do badge:** `#E07B28` (âmbar Wilson Sons)

---

## 2. Bugfix — Labels em Inglês no Check-in

### Problema
A página `/checkin` exibe os campos com labels em inglês:
- "RequestID" → deve ser "ID da solicitação"
- "Token" → deve ser "Token de acesso"

### Solução
Localizar e substituir os textos dos labels na seção `CheckinView` do `App.tsx`.

---

## 3. Refinamento — Home: Seção "Como funciona"

### Contexto
A home atual termina após os quick-links (Agendamento, Consulta de status, Orientações). Há espaço vazio antes do footer.

### Solução
Adicionar seção **"Como funciona o agendamento"** abaixo da hero existente (sem alterar a hero), com 3 cards de passo:

| Passo | Imagem | Título | Descrição |
|-------|--------|--------|-----------|
| 1 | `images/images-wilson-sons/wilson-sons-001.jpg` | Solicite e realize o quiz | Escolha data/horário, preencha dados, conclua o quiz de segurança obrigatório. |
| 2 | `images/images-wilson-sons/wilson-sons-004.jpg` | Aguarde a aprovação | A equipe analisa e envia e-mail com resultado e QR Code de acesso. |
| 3 | `images/images-wilson-sons/funcionarios-wilsoin-sons.webp` | Compareça com segurança | Apresente o QR Code na portaria com documento. Use EPIs exigidos. |

**Layout:** grid 3 colunas, fundo `white`, numeração em caixas Navy, label âmbar "Processo" acima.

---

## 4. Refinamento — Home: Seção "Acesso rápido"

Adicionar abaixo da seção "Como funciona", 4 cards de navegação:

| Card | Ícone SVG | Destino |
|------|-----------|---------|
| Solicitar visita (destaque âmbar) | calendar | `/solicitar-visita` |
| Consultar status | search | `/consultar` |
| Normas de segurança | shield | `/seguranca` |
| Dúvidas | help-circle | `/duvidas` |

**Layout:** grid 4 colunas, fundo `#F0F4F8`, primeiro card com `quick-icon` em âmbar.

---

## 5. Refinamento — Admin Dashboard: Atividade recente

### Problema
O Painel administrativo tem grande área vazia abaixo dos 4 cards de métricas.

### Solução
Adicionar seção **"Atividade recente"** que lista as últimas 5 solicitações/ações em ordem cronológica decrescente, usando os dados já disponíveis no estado `requests`. Cada item mostra:
- Ícone de status SVG (check/x/clock)
- ID da solicitação (link)
- Nome do responsável
- Data/hora formatada
- Badge de status colorido

**Fonte de dados:** array `requests` já carregado no estado global — sem chamada extra à API.

---

## 6. Refinamento — Admin Solicitações: Tooltips nos botões de ação

### Problema
A tabela de solicitações tem 4 botões de ação por linha com apenas ícones (aprovar, reprovar, remarcar, mensagem) — sem label, risco de UX.

### Solução
Adicionar atributo `title` em cada botão de ação:
- Aprovar: `title="Aprovar solicitação"`
- Reprovar: `title="Reprovar solicitação"`
- Remarcar: `title="Remarcar / Cancelar"`
- Mensagem: `title="Enviar mensagem ao visitante"`

Solução mínima via HTML `title` — sem necessidade de componente tooltip.

---

## Arquivos Afetados

| Arquivo | Mudanças |
|---------|----------|
| `src/App.tsx` | Footer (redesign), Check-in labels, Home seções novas, Admin atividade recente, tooltips |
| `src/styles.css` | Novos estilos: `.footer-top`, `.footer-bottom`, `.badge-kodie`, `.section-how`, `.section-quick`, `.activity-feed` |

---

## O que NÃO está no escopo

- Alteração do layout da hero da home
- Alteração do wizard de solicitação
- Alteração da lógica de negócio ou Apps Script
- Animações ou transições
- Autenticação no admin
- Qualquer nova funcionalidade

---

## Critério de sucesso

1. Playwright confirma texto "Projeto desenvolvido para fins educativos na KODIE Academy" presente em todas as rotas
2. Check-in exibe "ID da solicitação" e "Token de acesso"
3. Home exibe seções "Como funciona" e "Acesso rápido" abaixo da hero existente
4. Admin dashboard exibe lista de atividade recente
5. Botões de ação na tabela de solicitações têm `title` descritivo
6. Nenhuma regressão visual nas demais páginas
