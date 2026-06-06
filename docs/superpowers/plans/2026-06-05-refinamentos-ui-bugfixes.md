# Refinamentos UI, Bugfixes e Conformidade KODIE — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Corrigir o footer obrigatório (KODIE Academy), traduzir labels em inglês no check-in, adicionar seções "Como funciona" e "Acesso rápido" na home, e adicionar feed de atividade recente no admin dashboard.

**Architecture:** Todas as mudanças estão em `src/App.tsx` (JSX) e `src/styles.css` (CSS). Um novo import de imagem é necessário. Nenhuma lógica de negócio ou integração com Apps Script é alterada. A estrutura existente do componente é preservada — novos elementos são adicionados, não substituídos.

**Tech Stack:** React 19, TypeScript 5.7, Vite 6, Lucide React (ícones já importados), CSS custom properties (`var(--navy)` etc.)

---

## Nota prévia: tooltips já implementados

Ao analisar o código, confirmou-se que os botões de ação na tabela de solicitações (`RequestsTable`, linha 1554 de `src/App.tsx`) **já possuem** atributos `title` e `aria-label`. Essa tarefa não existe.

---

## Mapa de arquivos

| Arquivo | O que muda |
|---------|-----------|
| `src/App.tsx` | Footer (redesign), CheckinPage (labels), HomePage (2 seções novas), AdminMetrics (activity feed), 1 import novo |
| `src/styles.css` | Estilos do footer novo, `.section-how`, `.section-quick`, `.activity-feed` |

---

## Task 1: Redesign do Footer (crítico — conformidade KODIE)

**Files:**
- Modify: `src/App.tsx:265-274` (função `Footer`)
- Modify: `src/styles.css` (bloco `.site-footer` / `.footer-inner`)

- [ ] **Step 1: Substituir a função `Footer` em `src/App.tsx`**

Localizar as linhas 265–274:
```tsx
function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <strong>Wilson Sons - Gestão de Visitas</strong>
        <span>Portal de agendamento, acompanhamento e controle de visitas.</span>
      </div>
    </footer>
  );
}
```

Substituir por:
```tsx
function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner footer-top">
        <div className="footer-brand">
          <img src={logoImage} alt="Wilson Sons" className="footer-logo" />
          <div>
            <strong>Wilson Sons — Gestão de Visitas</strong>
            <span className="footer-tagline">Portal de agendamento e controle de visitas</span>
          </div>
        </div>
        <nav className="footer-links" aria-label="Links do rodapé">
          <a href="/solicitar-visita" className="footer-link">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            Solicitar visita
          </a>
          <a href="/consultar" className="footer-link">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            Consultar
          </a>
          <a href="/seguranca" className="footer-link">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            Segurança
          </a>
          <a href="/duvidas" className="footer-link">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            Dúvidas
          </a>
        </nav>
      </div>
      <div className="footer-inner footer-bottom">
        <span className="footer-copy">© 2026 Wilson Sons. Todos os direitos reservados.</span>
        <span className="footer-kodie-badge">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
          Projeto desenvolvido para fins educativos na KODIE Academy
        </span>
      </div>
    </footer>
  );
}
```

- [ ] **Step 2: Atualizar o CSS do footer em `src/styles.css`**

Localizar o bloco existente:
```css
.site-footer {
  background: var(--navy);
  color: #fff;
  padding: 18px 0;
  border-top: 4px solid #0b6f8e;
}

.footer-inner {
  display: flex;
  gap: 16px;
  align-items: center;
  justify-content: space-between;
}

.footer-inner span {
  color: #d7e6ec;
  font-size: 0.9rem;
  text-align: right;
}
```

Substituir por:
```css
.site-footer {
  background: var(--navy);
  color: #fff;
  padding: 0;
  border-top: 4px solid #0b6f8e;
}

.footer-inner {
  width: min(1180px, calc(100% - 32px));
  margin: 0 auto;
  display: flex;
  gap: 16px;
  align-items: center;
  justify-content: space-between;
}

.footer-top {
  padding: 28px 0 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  flex-wrap: wrap;
  gap: 20px;
}

.footer-bottom {
  padding: 16px 0;
  flex-wrap: wrap;
  gap: 12px;
}

.footer-brand {
  display: flex;
  align-items: center;
  gap: 14px;
}

.footer-logo {
  height: 36px;
  width: auto;
  filter: brightness(0) invert(1);
}

.footer-brand strong {
  display: block;
  font-size: 14px;
  font-weight: 700;
}

.footer-tagline {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
}

.footer-links {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  align-items: center;
}

.footer-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: rgba(255, 255, 255, 0.65);
  font-size: 13px;
  text-decoration: none;
  transition: color 0.15s;
}

.footer-link:hover {
  color: #fff;
}

.footer-copy {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.35);
}

.footer-kodie-badge {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  background: #e07b28;
  color: #fff;
  font-size: 11px;
  font-weight: 600;
  padding: 5px 14px;
  border-radius: 20px;
  letter-spacing: 0.2px;
}
```

- [ ] **Step 3: Remover regras de responsividade do footer antigo**

Em `src/styles.css`, no bloco `@media (max-width: 720px)`, localizar e **remover** estas duas regras que eram específicas do footer antigo de uma linha:
```css
  .footer-inner {
    align-items: flex-start;
    display: grid;
    gap: 6px;
  }

  .footer-inner span {
    text-align: left;
  }
```

Substituir por responsividade do footer novo (adicionar após a remoção, dentro do mesmo `@media (max-width: 720px)`):
```css
  .footer-top {
    flex-direction: column;
    align-items: flex-start;
  }

  .footer-links {
    gap: 14px;
  }

  .footer-kodie-badge {
    font-size: 10px;
  }
```

- [ ] **Step 4: Verificar no browser**

```bash
npm run dev
```

Abrir http://127.0.0.1:5176/ e confirmar:
- Footer exibe logo Wilson Sons branca
- Links com ícones SVG à direita
- Badge âmbar com texto "Projeto desenvolvido para fins educativos na KODIE Academy" visível
- Em mobile (375px), footer empilha corretamente

- [ ] **Step 5: Commit**

```bash
git add src/App.tsx src/styles.css
git commit -m "fix: footer obrigatório KODIE + logo + links SVG

Adiciona texto exigido pelo regulamento da KODIE Academy em badge
ambar no footer. Redesenha footer em duas zonas: identidade+navegacao
e copyright+badge."
```

---

## Task 2: Traduzir labels em inglês no Check-in

**Files:**
- Modify: `src/App.tsx:837` (função `CheckinPage`)

- [ ] **Step 1: Corrigir labels dos campos**

Em `src/App.tsx`, função `CheckinPage` (por volta da linha 837), localizar:
```tsx
        <label>RequestID<input value={requestId} onChange={(event) => setRequestId(event.target.value)} /></label>
        <label>Token<input value={token} onChange={(event) => setToken(event.target.value)} /></label>
```

Substituir por:
```tsx
        <label>ID da solicitação<input value={requestId} onChange={(event) => setRequestId(event.target.value)} /></label>
        <label>Token de acesso<input value={token} onChange={(event) => setToken(event.target.value)} /></label>
```

- [ ] **Step 2: Corrigir mensagem do estado vazio**

Na mesma função `CheckinPage`, localizar (por volta da linha 847):
```tsx
        ) : <p>Informe um RequestID para iniciar a conferência.</p>}
```

Substituir por:
```tsx
        ) : <p>Informe um ID da solicitação para iniciar a conferência.</p>}
```

- [ ] **Step 3: Verificar no browser**

Abrir http://127.0.0.1:5176/checkin e confirmar:
- Campo "ID da solicitação" (antes era "RequestID")
- Campo "Token de acesso" (antes era "Token")
- Texto de instrução em português

- [ ] **Step 4: Commit**

```bash
git add src/App.tsx
git commit -m "fix: traduzir labels do check-in para português"
```

---

## Task 3: Seção "Como funciona" na Home

**Files:**
- Modify: `src/App.tsx:27` (adicionar import), `src/App.tsx:328-360` (função `HomePage`)
- Modify: `src/styles.css` (adicionar estilos `.section-how`)

- [ ] **Step 1: Adicionar import da imagem `wilson-sons-004.jpg`**

Em `src/App.tsx`, após a linha 27:
```tsx
import videoContextImage from "../images/images-wilson-sons/wilson-sons-001.jpg";
```

Adicionar:
```tsx
import portYardImage from "../images/images-wilson-sons/wilson-sons-004.jpg";
```

- [ ] **Step 2: Atualizar a função `HomePage`**

Localizar a função `HomePage` (linha 328):
```tsx
function HomePage({ navigate }: SharedProps) {
  return (
    <div className="page home-page">
      <section className="hero-section">
        ...
      </section>
    </div>
  );
}
```

Substituir por (mantendo `hero-section` intacta, adicionando `section-how` abaixo):
```tsx
function HomePage({ navigate }: SharedProps) {
  return (
    <div className="page home-page">
      <section className="hero-section">
        <div className="hero-copy">
          <div className="hero-brand-row">
            <div className="hero-logo-wrap" aria-hidden="true">
              <img src={logoImage} alt="" />
            </div>
          </div>
          <span className="hero-kicker">Portal de visitas</span>
          <h1>WS Visitas</h1>
          <p>Solicite sua visita à Wilson Sons, acompanhe a análise do pedido e consulte as orientações necessárias antes da chegada.</p>
          <div className="button-row">
            <button className="primary-button" type="button" onClick={() => navigate("/solicitar-visita")}>Solicitar visita</button>
            <button className="secondary-button" type="button" onClick={() => navigate("/consultar")}>Consultar solicitação</button>
          </div>
          <div className="hero-quick-list" aria-label="Principais recursos do portal">
            <span><CalendarDays aria-hidden="true" /> Agendamento</span>
            <span><Search aria-hidden="true" /> Consulta de status</span>
            <span><ShieldCheck aria-hidden="true" /> Orientações de acesso</span>
          </div>
        </div>
        <div className="hero-visual">
          <figure className="hero-media" aria-label="Imagem de um terminal portuário">
            <img src={heroImage} alt="Vista aérea de um terminal portuário com pátio de contêineres e guindastes" />
          </figure>
          <p className="hero-media-caption">Terminal Wilson Sons em operação.</p>
        </div>
      </section>

      <section className="section-how" aria-labelledby="how-title">
        <div className="section-how-inner">
          <p className="section-how-label">Processo</p>
          <h2 id="how-title">Como funciona o agendamento</h2>
          <div className="how-steps">
            <article className="how-step">
              <img src={videoContextImage} alt="Vista aérea de navio e operações portuárias Wilson Sons" className="how-step-img" />
              <div className="how-step-num" aria-hidden="true">1</div>
              <h3 className="how-step-title">Solicite e realize o quiz</h3>
              <p className="how-step-desc">Escolha data e horário disponíveis, preencha seus dados e conclua o quiz de segurança obrigatório antes do envio.</p>
            </article>
            <article className="how-step">
              <img src={portYardImage} alt="Vista aérea de pátio de contêineres com guindastes azuis" className="how-step-img" />
              <div className="how-step-num" aria-hidden="true">2</div>
              <h3 className="how-step-title">Aguarde a aprovação</h3>
              <p className="how-step-desc">Nossa equipe analisa sua solicitação. Você receberá notificação por e-mail com o resultado e o QR Code de acesso.</p>
            </article>
            <article className="how-step">
              <img src={maritimeCrewImage} alt="Funcionários Wilson Sons com capacetes e EPIs em embarcação" className="how-step-img" />
              <div className="how-step-num" aria-hidden="true">3</div>
              <h3 className="how-step-title">Compareça com segurança</h3>
              <p className="how-step-desc">Apresente o QR Code na portaria com documento de identificação e use os EPIs exigidos durante toda a visita.</p>
            </article>
          </div>
        </div>
      </section>
    </div>
  );
}
```

- [ ] **Step 3: Adicionar estilos em `src/styles.css`**

Adicionar antes do bloco `@media` responsivo (antes da linha com `@media (max-width: 1024px)`):
```css
/* ── Seção Como Funciona (home) ── */
.section-how {
  background: #fff;
  padding: 64px 0;
}

.section-how-inner {
  width: min(1180px, calc(100% - 32px));
  margin: 0 auto;
}

.section-how-label {
  font-size: 11px;
  font-weight: 700;
  color: #e07b28;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 8px;
}

.section-how h2 {
  font-size: 26px;
  font-weight: 800;
  color: var(--navy);
  margin-bottom: 36px;
}

.how-steps {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px;
}

.how-step-img {
  width: 100%;
  height: 160px;
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 16px;
}

.how-step-num {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: var(--navy);
  color: #fff;
  font-size: 17px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
}

.how-step-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--navy);
  margin-bottom: 6px;
}

.how-step-desc {
  font-size: 13px;
  color: #4a6175;
  line-height: 1.65;
}
```

- [ ] **Step 4: Adicionar responsividade no media query existente**

Dentro do bloco `@media (max-width: 1024px)` já existente, adicionar:
```css
  .how-steps {
    grid-template-columns: 1fr;
    max-width: 480px;
  }
```

- [ ] **Step 5: Verificar no browser**

Abrir http://127.0.0.1:5176/ e confirmar:
- Hero inalterada
- Seção "Como funciona" aparece abaixo da hero com fundo branco
- 3 cards com fotos reais, numeração Navy, textos descritivos
- Em mobile, cards empilham em coluna única

- [ ] **Step 6: Commit**

```bash
git add src/App.tsx src/styles.css
git commit -m "feat: seção 'Como funciona' na home com fotos Wilson Sons"
```

---

## Task 4: Seção "Acesso rápido" na Home

**Files:**
- Modify: `src/App.tsx` (função `HomePage` — adicionar `section-quick` após `section-how`)
- Modify: `src/styles.css` (adicionar estilos `.section-quick`)

- [ ] **Step 1: Adicionar a seção `section-quick` na função `HomePage`**

Em `src/App.tsx`, na função `HomePage`, após o fechamento de `</section>` da seção `section-how` e antes do `</div>` de fechamento da div principal, adicionar:

```tsx
      <section className="section-quick" aria-labelledby="quick-title">
        <div className="section-how-inner">
          <p className="section-how-label">Atalhos</p>
          <h2 id="quick-title">Acesso rápido</h2>
          <div className="quick-grid">
            <button className="quick-card quick-card-primary" type="button" onClick={() => navigate("/solicitar-visita")}>
              <div className="quick-card-icon">
                <CalendarDays aria-hidden="true" />
              </div>
              <div className="quick-card-body">
                <strong className="quick-card-title">Solicitar visita</strong>
                <p className="quick-card-desc">Escolha data, horário e preencha o formulário de agendamento</p>
              </div>
              <ChevronRight className="quick-card-arrow" aria-hidden="true" />
            </button>
            <button className="quick-card" type="button" onClick={() => navigate("/consultar")}>
              <div className="quick-card-icon">
                <Search aria-hidden="true" />
              </div>
              <div className="quick-card-body">
                <strong className="quick-card-title">Consultar status</strong>
                <p className="quick-card-desc">Verifique o andamento da sua solicitação pelo ID e e-mail</p>
              </div>
              <ChevronRight className="quick-card-arrow" aria-hidden="true" />
            </button>
            <button className="quick-card" type="button" onClick={() => navigate("/seguranca")}>
              <div className="quick-card-icon">
                <ShieldCheck aria-hidden="true" />
              </div>
              <div className="quick-card-body">
                <strong className="quick-card-title">Normas de segurança</strong>
                <p className="quick-card-desc">EPIs obrigatórios, conduta e regras para acesso às instalações</p>
              </div>
              <ChevronRight className="quick-card-arrow" aria-hidden="true" />
            </button>
            <button className="quick-card" type="button" onClick={() => navigate("/duvidas")}>
              <div className="quick-card-icon">
                <HelpCircle aria-hidden="true" />
              </div>
              <div className="quick-card-body">
                <strong className="quick-card-title">Dúvidas</strong>
                <p className="quick-card-desc">Envie sua pergunta antes ou depois de solicitar o agendamento</p>
              </div>
              <ChevronRight className="quick-card-arrow" aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>
```

- [ ] **Step 2: Adicionar estilos em `src/styles.css`**

Após o bloco `/* ── Seção Como Funciona ── */` adicionado na Task 3, adicionar:
```css
/* ── Seção Acesso Rápido (home) ── */
.section-quick {
  background: var(--surface, #f0f4f8);
  padding: 64px 0;
}

.section-quick h2 {
  font-size: 26px;
  font-weight: 800;
  color: var(--navy);
  margin-bottom: 28px;
}

.quick-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
}

.quick-card {
  background: #fff;
  border: 1px solid #e2eaf0;
  border-radius: 12px;
  padding: 22px 18px;
  display: flex;
  align-items: center;
  gap: 14px;
  cursor: pointer;
  text-align: left;
  transition: box-shadow 0.2s, border-color 0.2s;
  width: 100%;
}

.quick-card:hover {
  box-shadow: 0 4px 20px rgba(3, 36, 63, 0.1);
  border-color: #b8d0e0;
}

.quick-card-icon {
  width: 42px;
  height: 42px;
  border-radius: 10px;
  background: #eef6fa;
  color: var(--ocean, #075a75);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.quick-card-primary .quick-card-icon {
  background: #fff0e0;
  color: #e07b28;
}

.quick-card-body {
  flex: 1;
  min-width: 0;
}

.quick-card-title {
  display: block;
  font-size: 14px;
  font-weight: 700;
  color: var(--navy);
  margin-bottom: 4px;
}

.quick-card-desc {
  font-size: 12px;
  color: #6b8499;
  line-height: 1.5;
  margin: 0;
}

.quick-card-arrow {
  color: #e07b28;
  flex-shrink: 0;
}
```

- [ ] **Step 3: Adicionar responsividade**

Dentro do bloco `@media (max-width: 1024px)`:
```css
  .quick-grid {
    grid-template-columns: repeat(2, 1fr);
  }
```

Dentro do bloco `@media (max-width: 720px)`:
```css
  .quick-grid {
    grid-template-columns: 1fr;
  }

  .section-how,
  .section-quick {
    padding: 40px 0;
  }
```

- [ ] **Step 4: Verificar no browser**

Abrir http://127.0.0.1:5176/ e confirmar:
- Seção "Acesso rápido" aparece após "Como funciona"
- 4 cards com ícones Lucide, primeiro card com ícone âmbar
- Clicar em cada card navega para a rota correta
- Em tablet (1024px): 2 colunas; em mobile (720px): 1 coluna

- [ ] **Step 5: Commit**

```bash
git add src/App.tsx src/styles.css
git commit -m "feat: seção 'Acesso rápido' na home com 4 cards de navegação"
```

---

## Task 5: Feed de Atividade Recente no Admin Dashboard

**Files:**
- Modify: `src/App.tsx:972-1020` (função `AdminMetrics`)
- Modify: `src/styles.css` (adicionar estilos `.activity-feed`)

- [ ] **Step 1: Atualizar a função `AdminMetrics`**

Localizar a função `AdminMetrics` (linha 972):
```tsx
function AdminMetrics({ requests, slots, questions, navigate }: SharedProps) {
  ...
  return (
    <section className="metrics-grid" aria-label="Ações rápidas do painel administrativo">
      {metrics.map((metric) => (
        <MetricCard ... />
      ))}
    </section>
  );
}
```

Substituir o `return` por (mantendo toda a lógica existente intacta, apenas expandindo o JSX retornado):
```tsx
  const recentRequests = [...requests]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 5);

  return (
    <>
      <section className="metrics-grid" aria-label="Ações rápidas do painel administrativo">
        {metrics.map((metric) => (
          <MetricCard
            key={metric.label}
            icon={metric.icon}
            label={metric.label}
            value={String(metric.value)}
            action={metric.action}
            onClick={() => navigate(metric.href)}
          />
        ))}
      </section>

      {recentRequests.length > 0 && (
        <section className="activity-feed" aria-labelledby="activity-title">
          <h2 id="activity-title">Atividade recente</h2>
          <ul className="activity-list">
            {recentRequests.map((request) => (
              <li key={request.id} className="activity-item">
                <span className={`activity-dot status-${statusTone(request.status)}`} aria-hidden="true" />
                <div className="activity-info">
                  <a
                    href={`/admin/solicitacoes/${request.id}`}
                    className="activity-id"
                    onClick={(event) => { event.preventDefault(); navigate(`/admin/solicitacoes/${request.id}`); }}
                  >
                    {request.id}
                  </a>
                  <span className="activity-name">{request.visitorName}</span>
                </div>
                <StatusBadge status={request.status} />
                <time className="activity-time" dateTime={request.createdAt}>
                  {formatTimestamp(request.createdAt)}
                </time>
              </li>
            ))}
          </ul>
          <button className="small-button activity-see-all" type="button" onClick={() => navigate("/admin/solicitacoes")}>
            Ver todas as solicitações
          </button>
        </section>
      )}
    </>
  );
```

- [ ] **Step 2: Adicionar estilos em `src/styles.css`**

Após o bloco `/* ── Seção Acesso Rápido ── */`, adicionar:
```css
/* ── Admin: Feed de Atividade Recente ── */
.activity-feed {
  margin-top: 32px;
  background: #fff;
  border: 1px solid #e2eaf0;
  border-radius: 12px;
  padding: 24px;
}

.activity-feed h2 {
  font-size: 16px;
  font-weight: 700;
  color: var(--navy);
  margin-bottom: 16px;
}

.activity-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0;
}

.activity-item {
  display: grid;
  grid-template-columns: 16px 1fr auto auto;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #f0f4f8;
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--ocean, #075a75);
  flex-shrink: 0;
}

.activity-dot.status-success { background: #15724d; }
.activity-dot.status-warning { background: #ad7100; }
.activity-dot.status-danger  { background: #a83a38; }
.activity-dot.status-neutral { background: #6b8499; }

.activity-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.activity-id {
  font-size: 13px;
  font-weight: 600;
  color: var(--navy);
  text-decoration: none;
}

.activity-id:hover {
  text-decoration: underline;
}

.activity-name {
  font-size: 12px;
  color: #6b8499;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.activity-time {
  font-size: 11px;
  color: #8fa5b8;
  white-space: nowrap;
}

.activity-see-all {
  margin-top: 16px;
  width: 100%;
}
```

- [ ] **Step 3: Verificar no browser**

Abrir http://127.0.0.1:5176/admin e confirmar:
- 4 metric cards existentes continuam no topo
- Seção "Atividade recente" aparece abaixo com fundo branco e borda
- Lista as últimas 5 solicitações com ID clicável, nome, badge de status e hora
- Botão "Ver todas as solicitações" navega para `/admin/solicitacoes`
- Se não houver solicitações, a seção não aparece

- [ ] **Step 4: Commit**

```bash
git add src/App.tsx src/styles.css
git commit -m "feat: feed de atividade recente no painel admin"
```

---

## Task 6: Push e Verificação Final

- [ ] **Step 1: Build de produção para verificar sem erros TypeScript**

```bash
npm run build
```

Saída esperada: sem erros de TypeScript ou Vite. Se aparecer erro de tipo, corrigir antes de continuar.

- [ ] **Step 2: Rodar script de análise Playwright para confirmar footer**

```bash
node scripts/analyze-all-screens.mjs
```

Verificar em `screenshots-analysis/report.json` que **nenhuma** rota tem `WRONG_FOOTER` nos issues.

- [ ] **Step 3: Push para o GitHub**

```bash
git push origin master
```

- [ ] **Step 4: Confirmar no GitHub**

Acessar https://github.com/brartacho/ws-visitas e verificar que os commits estão visíveis.

---

## Self-Review

**Spec coverage:**
- ✅ Footer obrigatório KODIE → Task 1
- ✅ Labels inglês no check-in → Task 2
- ✅ Seção "Como funciona" → Task 3
- ✅ Seção "Acesso rápido" → Task 4
- ✅ Feed de atividade recente no admin → Task 5
- ✅ Tooltips na tabela → confirmado que já existiam, não necessário

**Placeholder scan:** Sem TBDs. Todo código presente e completo.

**Type consistency:**
- `portYardImage` importado na Task 3, usado na Task 3 ✓
- `recentRequests` derivado de `requests` (já tipado como `VisitRequest[]`) ✓
- `formatTimestamp` já existe em App.tsx (linha 1839) ✓
- `statusTone` já importado de utils.ts ✓
- `StatusBadge` já definido (linha 1885) ✓
- `ChevronRight` já importado de lucide-react (linha 6) ✓
- `CalendarDays`, `Search`, `ShieldCheck`, `HelpCircle` já importados ✓
