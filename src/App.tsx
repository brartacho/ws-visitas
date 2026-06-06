import {
  Ban,
  CalendarDays,
  CalendarRange,
  Check,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  HelpCircle,
  Home,
  Lock,
  LockOpen,
  Menu,
  Plus,
  QrCode,
  Repeat,
  Search,
  ShieldCheck,
  Youtube,
  X,
} from "lucide-react";
import { FormEvent, ReactNode, useEffect, useMemo, useState } from "react";
import logoImage from "../images/logo-wilson-sons/logo.png";
import heroImage from "../images/images-wilson-sons/wilson-sons-003.jpg";
import maritimeCrewImage from "../images/images-wilson-sons/funcionarios-wilsoin-sons.webp";
import videoContextImage from "../images/images-wilson-sons/wilson-sons-001.jpg";
import portYardImage from "../images/images-wilson-sons/wilson-sons-004.jpg";
import {
  adminNavItem,
  initialHosts,
  initialQuestions,
  initialRequests,
  initialSlots,
  mainNavItems,
  navItems,
  quizQuestions,
} from "./data";
import { appsScriptApi } from "./services/appsScriptApi";
import type { AvailabilitySlot, Host, QuestionStatus, SlotStatus, VisitMode, VisitRequest, VisitStatus, VisitorQuestion } from "./types";
import {
  capacityAvailable,
  checkinLink,
  formatDateTime,
  isSlotSelectable,
  isValidEmail,
  isValidPhone,
  makeQrToken,
  nextId,
  statusTone,
  whatsappUrl,
} from "./utils";

type RouteState = { path: string; query: URLSearchParams };
type IntegrationState = {
  status: "checking" | "connected" | "blocked" | "offline";
  message: string;
  checkedAt: string;
};

type WizardForm = {
  selectedDate: string;
  slotId: string;
  visitorName: string;
  visitorEmail: string;
  visitorPhone: string;
  organization: string;
  visitType: string;
  mode: VisitMode;
  visitorsCount: number;
  notes: string;
  safetyAccepted: boolean;
  videoAccepted: boolean;
};

const emptyWizard: WizardForm = {
  selectedDate: "",
  slotId: "",
  visitorName: "",
  visitorEmail: "",
  visitorPhone: "",
  organization: "",
  visitType: "Visita técnica",
  mode: "Individual",
  visitorsCount: 1,
  notes: "",
  safetyAccepted: false,
  videoAccepted: false,
};

const visitTypes = ["Visita técnica", "Visita acadêmica", "Visita institucional", "Fornecedor", "Corporativa", "Outra"];
const wilsonSonsVideo = {
  title: "Breakbulk: operações de carga de projeto no Tecon Salvador | Wilson Sons",
  embedUrl: "https://www.youtube.com/embed/0zzFxFoM3kU",
  watchUrl: "https://www.youtube.com/watch?v=0zzFxFoM3kU",
};

export function App() {
  const [route, setRoute] = useState<RouteState>(() => readRoute());
  const [mobileOpen, setMobileOpen] = useState(false);
  const [slots, setSlots] = useState(initialSlots);
  const [hosts, setHosts] = useState(initialHosts);
  const [requests, setRequests] = useState(initialRequests);
  const [questions, setQuestions] = useState(initialQuestions);
  const [lastRequestId, setLastRequestId] = useState<string | null>(null);
  const [integration, setIntegration] = useState<IntegrationState>({
    status: "checking",
    message: "Verificando conexão com o serviço de integração.",
    checkedAt: "",
  });

  useEffect(() => {
    const onPopState = () => setRoute(readRoute());
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("popstate", onPopState);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("popstate", onPopState);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  useEffect(() => {
    let active = true;

    async function loadRemoteData() {
      const remoteBootstrap = await appsScriptApi.getBootstrapData();

      if (!active) return;
      const bootstrap = readApiData(remoteBootstrap) as {
        slots?: unknown[];
        hosts?: unknown[];
        requests?: unknown[];
        questions?: unknown[];
        settings?: unknown[];
      } | null;

      const slotsData = (bootstrap?.slots ?? []).map(toAvailabilitySlot).filter(Boolean) as AvailabilitySlot[];
      const hostsData = (bootstrap?.hosts ?? []).map(toHost).filter(Boolean) as Host[];
      const requestsData = (bootstrap?.requests ?? []).map(toVisitRequest).filter(Boolean) as VisitRequest[];
      const questionsData = (bootstrap?.questions ?? []).map(toVisitorQuestion).filter(Boolean) as VisitorQuestion[];

      if (slotsData.length) setSlots(dedupeAvailabilitySlots(slotsData));
      if (hostsData.length) setHosts(hostsData);
      if (requestsData.length) setRequests(requestsData);
      if (questionsData.length) setQuestions(questionsData);
      setIntegration({
        status: "connected",
        message: "Serviço de integração conectado. Dados sincronizados.",
        checkedAt: new Date().toISOString(),
      });
    }

    loadRemoteData().catch((error: unknown) => {
      if (!active) return;
      const message = error instanceof Error ? error.message : "Não foi possível conectar ao serviço de integração.";
      setIntegration({
        status: message.includes("login do Google") ? "blocked" : "offline",
        message,
        checkedAt: new Date().toISOString(),
      });
    });
    return () => {
      active = false;
    };
  }, []);

  function navigate(path: string) {
    setMobileOpen(false);
    window.history.pushState(null, "", path);
    setRoute(readRoute());
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function updateRequest(id: string, patch: Partial<VisitRequest>) {
    setRequests((current) => current.map((request) => (request.id === id ? { ...request, ...patch } : request)));
  }

  return (
    <div className="app-shell">
      <a className="skip-link" href="#conteudo">
        Ir para o conteúdo principal
      </a>
      <header className="site-header">
        <div className="header-inner">
          <button className="brand-button" type="button" aria-label="Ir para a página inicial" onClick={() => navigate("/")}>
            <span className="brand-mark brand-logo" aria-hidden="true">
              <img src={logoImage} alt="" />
            </span>
            <span>
              <strong>WS Visitas</strong>
            </span>
          </button>

          <nav className="desktop-nav" aria-label="Navegação principal">
            {mainNavItems.map((item) => (
              <button key={item.href} type="button" className={isActive(route.path, item.href) ? "nav-link active" : "nav-link"} onClick={() => navigate(item.href)}>
                {item.label}
              </button>
            ))}
          </nav>
          <button
            type="button"
            className={isActive(route.path, adminNavItem.href) ? "nav-link admin-nav-link active" : "nav-link admin-nav-link"}
            onClick={() => navigate(adminNavItem.href)}
          >
            {adminNavItem.label}
          </button>

          <button
            className="icon-button mobile-menu-button"
            type="button"
            aria-label={mobileOpen ? "Fechar menu de navegação" : "Abrir menu de navegação"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMobileOpen((value) => !value)}
          >
            {mobileOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>

        <nav id="mobile-navigation" className={mobileOpen ? "mobile-nav open" : "mobile-nav"} aria-label="Navegação principal mobile">
          {navItems.map((item) => (
            <button key={item.href} type="button" className={isActive(route.path, item.href) ? "mobile-link active" : "mobile-link"} onClick={() => navigate(item.href)}>
              {item.label}
            </button>
          ))}
        </nav>
      </header>

      <main id="conteudo">
        <RouteView
          route={route}
          navigate={navigate}
          slots={slots}
          setSlots={setSlots}
          hosts={hosts}
          setHosts={setHosts}
          requests={requests}
          setRequests={setRequests}
          questions={questions}
          setQuestions={setQuestions}
          updateRequest={updateRequest}
          lastRequestId={lastRequestId}
          setLastRequestId={setLastRequestId}
          integration={integration}
          setIntegration={setIntegration}
        />
      </main>
      <Footer navigate={navigate} />
    </div>
  );
}

function readRoute(): RouteState {
  return { path: window.location.pathname, query: new URLSearchParams(window.location.search) };
}

function isActive(path: string, href: string) {
  if (href === "/") return path === "/";
  return path.startsWith(href);
}

function Footer(_: { navigate: (path: string) => void }) {
  return (
    <footer className="site-footer">
      <div className="footer-inner footer-bottom">
        <div className="footer-brand footer-brand-minimal">
          <img src={logoImage} alt="Wilson Sons" className="footer-logo" />
          <span className="footer-copy">Wilson Sons — Gestão de Visitas · © 2026</span>
        </div>
        <span className="footer-kodie-badge">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
          Projeto desenvolvido para fins educativos na KODIE Academy
        </span>
      </div>
    </footer>
  );
}

type SharedProps = {
  route: RouteState;
  navigate: (path: string) => void;
  slots: AvailabilitySlot[];
  setSlots: React.Dispatch<React.SetStateAction<AvailabilitySlot[]>>;
  hosts: Host[];
  setHosts: React.Dispatch<React.SetStateAction<Host[]>>;
  requests: VisitRequest[];
  setRequests: React.Dispatch<React.SetStateAction<VisitRequest[]>>;
  questions: VisitorQuestion[];
  setQuestions: React.Dispatch<React.SetStateAction<VisitorQuestion[]>>;
  updateRequest: (id: string, patch: Partial<VisitRequest>) => void;
  lastRequestId: string | null;
  setLastRequestId: React.Dispatch<React.SetStateAction<string | null>>;
  integration: IntegrationState;
  setIntegration: React.Dispatch<React.SetStateAction<IntegrationState>>;
};

type AgendaPlanForm = {
  calendarMonth: string;
  selectedDates: string[];
  startTime: string;
  endTime: string;
  intervalMinutes: number;
  unit: string;
  area: string;
  typeAllowed: string;
  capacityTotal: number;
};

type SingleSlotForm = {
  date: string;
  time: string;
  unit: string;
  area: string;
  typeAllowed: string;
  capacityTotal: number;
};

function RouteView(props: SharedProps) {
  const path = props.route.path;
  if (path === "/solicitar-visita") return <VisitWizard {...props} />;
  if (path === "/seguranca") return <SecurityPage />;
  if (path === "/video") return <VideoPage />;
  if (path === "/duvidas") return <QuestionsPage {...props} />;
  if (path === "/consultar") return <ConsultPage requests={props.requests} />;
  if (path === "/checkin") return <CheckinPage {...props} />;
  if (path === "/confirmacao") return <ConfirmationPage requestId={props.lastRequestId} navigate={props.navigate} />;
  if (path.startsWith("/admin")) return <AdminPage {...props} />;
  return <HomePage {...props} />;
}

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
    </div>
  );
}

function VisitWizard({ slots, hosts, setSlots, setRequests, setLastRequestId, navigate }: SharedProps) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<WizardForm>(emptyWizard);
  const [quiz, setQuiz] = useState<Record<string, string>>({});
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [message, setMessage] = useState("");
  const [calendarMonth, setCalendarMonth] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const visitorsCount = form.mode === "Individual" ? 1 : form.visitorsCount;
  const selectedSlot = slots.find((slot) => slot.id === form.slotId);
  const selectedHost = hosts.find((host) => host.active) ?? hosts[0];
  const score = quizQuestions.filter((question) => quiz[question.id] === question.answer).length;
  const currentQuizQuestion = quizQuestions[currentQuizIndex];
  const answeredQuizCount = quizQuestions.filter((question) => Boolean(quiz[question.id])).length;
  const selectableSlots = dedupeAvailabilitySlots(slots.filter((slot) => isSlotSelectable(slot, visitorsCount)));
  const availableDates = Array.from(new Set(selectableSlots.map((slot) => slot.date))).sort();
  const availableDateSet = new Set(availableDates);
  const availableMonths = Array.from(new Set(availableDates.map((date) => date.slice(0, 7)))).sort();
  const activeCalendarMonth = calendarMonth || form.selectedDate.slice(0, 7) || availableMonths[0] || "";
  const activeMonthIndex = availableMonths.indexOf(activeCalendarMonth);
  const calendarDays = buildCalendarMonth(activeCalendarMonth);
  const availableTimes = selectableSlots.filter((slot) => slot.date === form.selectedDate);

  function setField<K extends keyof WizardForm>(key: K, value: WizardForm[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function selectDate(date: string) {
    if (!availableDateSet.has(date)) return;
    setCalendarMonth(date.slice(0, 7));
    setForm((current) => ({ ...current, selectedDate: date, slotId: "" }));
  }

  function moveCalendarMonth(direction: -1 | 1) {
    const nextMonth = availableMonths[activeMonthIndex + direction];
    if (nextMonth) setCalendarMonth(nextMonth);
  }

  function validateStep() {
    if (step === 0 && !form.selectedDate) return "Escolha a data da visita para continuar.";
    if (step === 0 && !selectedSlot) return "Agora selecione um horário disponível com capacidade suficiente.";
    if (step === 1) {
      if (!form.visitorName.trim()) return "Campo obrigatório: informe o nome do visitante ou responsável.";
      if (!isValidEmail(form.visitorEmail)) return "Informe um e-mail válido, por exemplo nome@empresa.com.";
      if (!isValidPhone(form.visitorPhone)) return "Informe um WhatsApp válido com DDD.";
      if (!form.organization.trim()) return "Campo obrigatório: informe empresa, instituição ou vínculo.";
    }
    if (step === 2 && !form.safetyAccepted) return "Confirme a leitura das orientações de segurança.";
    if (step === 3 && !form.videoAccepted) return "Confirme a visualização do vídeo antes de continuar.";
    if (step === 4 && !quiz[currentQuizQuestion.id]) return "Selecione uma resposta para continuar.";
    if (step === 4 && currentQuizIndex === quizQuestions.length - 1 && score < 4) return "Você precisa acertar pelo menos 4 de 5 perguntas para enviar a solicitação.";
    return "";
  }

  function next() {
    const error = validateStep();
    if (error) {
      setMessage(error);
      return;
    }
    setMessage("");
    if (step === 4 && currentQuizIndex < quizQuestions.length - 1) {
      setCurrentQuizIndex((current) => current + 1);
      return;
    }
    setStep((current) => Math.min(current + 1, 5));
  }

  function previous() {
    setMessage("");
    if (step === 4 && currentQuizIndex > 0) {
      setCurrentQuizIndex((current) => current - 1);
      return;
    }
    setStep((current) => Math.max(current - 1, 0));
  }

  function nextButtonLabel() {
    if (step === 4 && currentQuizIndex < quizQuestions.length - 1) return "Próxima pergunta";
    return "Avançar";
  }

  async function submit() {
    if (isSubmitting) return;
    const error = validateStep();
    if (error || !selectedSlot || !selectedHost) {
      setMessage(error || "Não foi possível preparar a solicitação.");
      return;
    }
    const id = nextId("REQ", Date.now() % 1000);
    const request: VisitRequest = {
      id,
      createdAt: new Date().toISOString(),
      visitorName: form.visitorName,
      visitorEmail: form.visitorEmail,
      visitorPhone: form.visitorPhone,
      organization: form.organization,
      visitType: form.visitType,
      mode: form.mode,
      visitorsCount,
      slotId: selectedSlot.id,
      unit: selectedSlot.unit,
      area: selectedSlot.area,
      hostId: selectedHost.id,
      status: "Recebida",
      safetyAccepted: true,
      quizScore: score,
      emailVisitorSent: false,
      emailHostSent: false,
      emailAdminSent: false,
      lastEmailAt: "",
      notes: form.notes,
    };

    try {
      setIsSubmitting(true);
      setMessage("Registrando sua solicitação...");
      const response = await appsScriptApi.createVisitRequest(request as unknown as Record<string, unknown>);
      const remoteRequest = toVisitRequest(readApiData(response));
      if (remoteRequest) {
        setRequests((current) => [remoteRequest, ...current.filter((item) => item.id !== remoteRequest.id)]);
        setLastRequestId(remoteRequest.id);
      } else {
        setRequests((current) => [request, ...current]);
        setLastRequestId(id);
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Não foi possível enviar a solicitação agora.");
      return;
    } finally {
      setIsSubmitting(false);
    }

    setSlots((current) =>
      current.map((slot) => {
        if (slot.id !== selectedSlot.id) return slot;
        const used = slot.capacityUsed + visitorsCount;
        return { ...slot, capacityUsed: used, status: slot.capacityTotal - used <= 0 ? "Lotado" : slot.status };
      }),
    );
    navigate("/confirmacao");
  }

  return (
    <div className="page narrow-page">
      <PageHeading icon={<CalendarDays />} title="Solicitar visita" text="Preencha uma etapa por vez. O envio não garante aprovação automática de acesso." />
      <ol className="stepper" aria-label="Etapas da solicitação">
        {["Agenda", "Dados", "Segurança", "Vídeo", "Quiz", "Revisão"].map((label, index) => (
          <li key={label} className={index === step ? "active" : index < step ? "done" : ""} aria-current={index === step ? "step" : undefined}>{label}</li>
        ))}
      </ol>
      <div className="form-card">
        <p className="sr-only" aria-live="polite">Etapa atual: {step + 1} de 6.</p>
        {step === 0 && (
          <section className="agenda-step">
            <h2>Escolha a data e depois o horário</h2>
            <div className="agenda-picker-grid">
              <section className="agenda-card" aria-labelledby="calendar-title">
                <div className="agenda-card-header">
                  <h3 id="calendar-title">Data da visita</h3>
                  <span>{availableDates.length} datas disponíveis</span>
                </div>
                <div className="calendar-widget" aria-label="Calendário de datas disponíveis">
                  <div className="calendar-month-bar">
                    <button className="icon-action-button" type="button" aria-label="Mês anterior" disabled={activeMonthIndex <= 0} onClick={() => moveCalendarMonth(-1)}>
                      <ChevronLeft aria-hidden="true" />
                    </button>
                    <strong>{activeCalendarMonth ? formatMonthLabel(activeCalendarMonth) : "Sem datas"}</strong>
                    <button className="icon-action-button" type="button" aria-label="Próximo mês" disabled={activeMonthIndex < 0 || activeMonthIndex >= availableMonths.length - 1} onClick={() => moveCalendarMonth(1)}>
                      <ChevronRight aria-hidden="true" />
                    </button>
                  </div>
                  <div className="calendar-weekdays" aria-hidden="true">
                    {weekdayLabels.map((day) => <span key={day}>{day}</span>)}
                  </div>
                  <div className="calendar-grid">
                    {calendarDays.map((day, index) => {
                      if (!day) return <span key={`empty-${index}`} className="calendar-empty" aria-hidden="true" />;
                      const count = selectableSlots.filter((slot) => slot.date === day.date).length;
                      const available = availableDateSet.has(day.date);
                      return (
                        <button
                          key={day.date}
                          className={form.selectedDate === day.date ? "calendar-day selected" : "calendar-day"}
                          type="button"
                          disabled={!available}
                          aria-label={`${formatDateTime(day.date)}${available ? `, ${count} horário${count === 1 ? "" : "s"} disponível${count === 1 ? "" : "is"}` : ", sem horários disponíveis"}`}
                          onClick={() => selectDate(day.date)}
                        >
                          <span>{day.day}</span>
                          {available && <small>{count}</small>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </section>

              <section className="agenda-card" aria-labelledby="time-title">
                <div className="agenda-card-header">
                  <h3 id="time-title">Horários disponíveis</h3>
                  <span>{form.selectedDate ? formatDateTime(form.selectedDate) : "Selecione uma data"}</span>
                </div>
                <div className="slot-list time-slot-list">
                  {form.selectedDate ? (
                    availableTimes.length ? (
                      availableTimes.map((slot) => (
                        <label key={slot.id} className={form.slotId === slot.id ? "time-slot-option selected" : "time-slot-option"}>
                          <input type="radio" name="slot" value={slot.id} checked={form.slotId === slot.id} onChange={() => setField("slotId", slot.id)} />
                          <strong>{slot.time}</strong>
                        </label>
                      ))
                    ) : (
                      <p className="status-text">Não há horários disponíveis nesta data para a quantidade de visitantes informada.</p>
                    )
                  ) : (
                    <p className="status-text">Escolha uma data no calendário para listar os horários.</p>
                  )}
                </div>
              </section>
            </div>
          </section>
        )}
        {step === 1 && (
          <section className="form-grid">
            <h2>Dados da visita</h2>
            <label>Modalidade<select value={form.mode} onChange={(event) => setForm((current) => ({ ...current, mode: event.target.value as VisitMode, visitorsCount: event.target.value === "Individual" ? 1 : current.visitorsCount }))}><option>Individual</option><option>Grupo</option></select></label>
            <label>Tipo de visita<select value={form.visitType} onChange={(event) => setField("visitType", event.target.value)}>{visitTypes.map((type) => <option key={type}>{type}</option>)}</select></label>
            {form.mode === "Grupo" && <label>Quantidade de visitantes<input type="number" min={2} max={80} value={form.visitorsCount} onChange={(event) => setField("visitorsCount", Number(event.target.value))} /></label>}
            <label>Nome do visitante ou responsável<input value={form.visitorName} onChange={(event) => setField("visitorName", event.target.value)} /></label>
            <label>E-mail<input type="email" value={form.visitorEmail} onChange={(event) => setField("visitorEmail", event.target.value)} /></label>
            <label>WhatsApp com DDD<input inputMode="tel" value={form.visitorPhone} onChange={(event) => setField("visitorPhone", event.target.value)} /></label>
            <label>Empresa, instituição ou vínculo<input value={form.organization} onChange={(event) => setField("organization", event.target.value)} /></label>
            <label className="wide">Observações<textarea value={form.notes} onChange={(event) => setField("notes", event.target.value)} /></label>
          </section>
        )}
        {step === 2 && (
          <section className="safety-acceptance">
            <h2>Orientações de segurança</h2>
            <p>Use roupa compatível com ambiente operacional, calçado fechado e siga sempre o responsável autorizado.</p>
            <ul><li>Não circule desacompanhado.</li><li>Respeite sinalizações, barreiras e áreas isoladas.</li><li>Não fotografe ou filme áreas operacionais sem autorização.</li><li>O QR Code não substitui validação presencial e documento.</li></ul>
            <label className="checkbox-line"><input type="checkbox" checked={form.safetyAccepted} onChange={(event) => setField("safetyAccepted", event.target.checked)} />Li e compreendi as orientações de segurança para a visita.</label>
          </section>
        )}
        {step === 3 && (
          <section className="video-section">
            <h2>Vídeo Wilson Sons</h2>
            <p>Assista ao conteúdo antes do quiz para contextualizar a visita em ambiente portuário e reforçar a atenção às áreas operacionais.</p>
            <WilsonSonsVideoEmbed />
            <label className="checkbox-line"><input type="checkbox" checked={form.videoAccepted} onChange={(event) => setField("videoAccepted", event.target.checked)} />Confirmei a visualização do vídeo antes da visita.</label>
          </section>
        )}
        {step === 4 && (
          <section className="quiz-section">
            <h2>Quiz de segurança</h2>
            <div className="quiz-progress" aria-label={`Pergunta ${currentQuizIndex + 1} de ${quizQuestions.length}`}>
              {quizQuestions.map((question, index) => (
                <span key={question.id} className={index === currentQuizIndex ? "active" : quiz[question.id] ? "answered" : ""} />
              ))}
            </div>
            <fieldset className="single-question-card">
              <legend>{currentQuizIndex + 1}. {currentQuizQuestion.prompt}</legend>
              {currentQuizQuestion.options.map((option) => (
                <label key={option} className="radio-line"><input type="radio" name={currentQuizQuestion.id} value={option} checked={quiz[currentQuizQuestion.id] === option} onChange={() => setQuiz((current) => ({ ...current, [currentQuizQuestion.id]: option }))} />{option}</label>
              ))}
            </fieldset>
            <p className="status-text">Respondidas: {answeredQuizCount} de 5. Aprovação com 4 ou 5 acertos.</p>
          </section>
        )}
        {step === 5 && (
          <section>
            <h2>Revise antes de enviar</h2>
            <ReviewList items={[
              ["Responsável", form.visitorName],
              ["E-mail", form.visitorEmail],
              ["WhatsApp", form.visitorPhone],
              ["Modalidade", form.mode],
              ["Visitantes", String(visitorsCount)],
              ["Data", form.selectedDate ? formatDateTime(form.selectedDate) : "Não selecionada"],
              ["Horário", selectedSlot ? `${selectedSlot.time} - ${selectedSlot.unit}` : "Não selecionado"],
              ["Pontuação do quiz", `${score} de 5`],
            ]} />
          </section>
        )}
        <p className="form-message" aria-live="polite">{message}</p>
        <div className="wizard-actions">
          <button className="secondary-button" type="button" disabled={(step === 0 && currentQuizIndex === 0) || isSubmitting} onClick={previous}>Voltar</button>
          {step < 5 ? <button className="primary-button" type="button" disabled={isSubmitting} onClick={next}>{nextButtonLabel()}</button> : <button className="primary-button" type="button" disabled={isSubmitting} onClick={submit}>{isSubmitting ? "Enviando..." : "Enviar solicitação"}</button>}
        </div>
      </div>
    </div>
  );
}

function SecurityPage() {
  return (
    <div className="page narrow-page">
      <PageHeading icon={<ShieldCheck />} title="Regras de segurança" text="Orientações obrigatórias para visitantes antes da chegada à unidade." />
      <figure className="safety-context-image">
        <img src={maritimeCrewImage} alt="Equipe portuária usando capacete e colete em embarcação próxima ao cais" />
        <figcaption>Visitas em área portuária exigem EPI, acompanhamento e atenção permanente ao cais.</figcaption>
      </figure>
      <section className="content-band">
        <h2>Vestimenta, EPI e EPC</h2>
        <div className="three-columns">
          <InfoList title="Evite" items={["Regata, shorts e chinelo.", "Sapato aberto, sandália ou salto alto em área operacional.", "Roupas soltas ou adornos que possam enroscar."]} />
          <InfoList title="EPIs possíveis" items={["Capacete e colete refletivo.", "Bota ou calçado de segurança.", "Óculos, protetor auricular e luvas conforme área."]} />
          <InfoList title="EPCs no ambiente" items={["Sinalização, cones e barreiras.", "Guarda-corpos e faixas de isolamento.", "Rotas de fuga e demarcações de segurança."]} />
        </div>
      </section>
      <section className="content-band">
        <h2>Conduta durante a visita</h2>
        <ul className="check-list"><li>Portar documento de identificação.</li><li>Permanecer acompanhado por responsável autorizado.</li><li>Não acessar áreas restritas nem circular desacompanhado.</li><li>Não tocar em máquinas, cargas, painéis, embarcações ou ferramentas.</li><li>Comunicar situações de risco à equipe responsável.</li></ul>
      </section>
      <p className="legal-note">As orientações podem variar conforme a unidade, área visitada e atividade prevista. Siga sempre as instruções da equipe responsável.</p>
    </div>
  );
}

function VideoPage() {
  return (
    <div className="page narrow-page">
      <PageHeading icon={<Youtube />} title="Vídeo institucional" text="Conteúdo de orientação complementar antes da visita." />
      <section className="content-band video-section">
        <h2>Operação portuária Wilson Sons</h2>
        <p>Este vídeo apresenta uma operação de carga de projeto no Tecon Salvador e ajuda o visitante a visualizar o contexto operacional tratado nas regras de segurança.</p>
        <figure className="video-context-image">
          <img src={videoContextImage} alt="Vista aérea de operações portuárias com navio, contêineres e pórticos Wilson Sons" />
          <figcaption>Ambiente operacional portuário usado como referência visual antes do vídeo institucional.</figcaption>
        </figure>
        <WilsonSonsVideoEmbed />
      </section>
      <p className="legal-note">Vídeo incorporado do canal Wilson Sons no YouTube como orientação complementar à visita.</p>
    </div>
  );
}

function WilsonSonsVideoEmbed() {
  return (
    <div className="video-shell">
      <div className="video-frame">
        <iframe
          title={wilsonSonsVideo.title}
          src={wilsonSonsVideo.embedUrl}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
      <div className="video-meta">
        <strong>{wilsonSonsVideo.title}</strong>
        <a className="small-link" href={wilsonSonsVideo.watchUrl} target="_blank" rel="noreferrer">Abrir no YouTube</a>
      </div>
    </div>
  );
}

function QuestionsPage({ requests, setQuestions }: SharedProps) {
  const [status, setStatus] = useState("");
  const [form, setForm] = useState({ requestCode: "", name: "", email: "", phone: "", topic: "Agendamento", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (isSubmitting) return;
    const requestCode = form.requestCode.trim().toUpperCase();
    const relatedRequest = requests.find((request) => request.id.toUpperCase() === requestCode);
    if (!relatedRequest) {
      setStatus("Informe um código de solicitação válido para vincular a dúvida ao agendamento.");
      return;
    }
    if (!form.name.trim() || !isValidEmail(form.email) || !isValidPhone(form.phone) || form.message.trim().length < 12) {
      setStatus("Revise os campos. Informe nome, e-mail válido, WhatsApp com DDD e uma dúvida com detalhes.");
      return;
    }
    const question: VisitorQuestion = { id: nextId("DUV", Date.now() % 1000), createdAt: new Date().toISOString(), ...form, requestCode, status: "Nova" };
    try {
      setIsSubmitting(true);
      setStatus("Enviando sua dúvida...");
      const response = await appsScriptApi.createVisitorQuestion(question as unknown as Record<string, unknown>);
      const remoteQuestion = toVisitorQuestion(readApiData(response));
      setQuestions((current) => [remoteQuestion ?? question, ...current]);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Não foi possível enviar a dúvida agora.");
      return;
    } finally {
      setIsSubmitting(false);
    }
    setForm({ requestCode: "", name: "", email: "", phone: "", topic: "Agendamento", message: "" });
    setStatus("Dúvida enviada. A equipe responsável fará a análise.");
  }

  return (
    <div className="page narrow-page">
      <PageHeading icon={<HelpCircle />} title="Dúvidas dos visitantes" text="Envie uma pergunta antes ou depois da solicitação de visita." />
      <section className="faq-list" aria-label="Perguntas frequentes">
        <details><summary>O envio garante a visita?</summary><p>Não. A solicitação depende de análise administrativa e validação das condições do dia.</p></details>
        <details><summary>Posso reagendar?</summary><p>Sim, quando o status permitir e houver slot disponível.</p></details>
        <details><summary>O QR Code libera acesso automaticamente?</summary><p>Não. Ele apenas facilita a conferência presencial pela portaria.</p></details>
      </section>
      <form className="form-card form-grid" onSubmit={submit}>
        <label>Código da solicitação<input value={form.requestCode} placeholder="Ex.: REQ-2401" onChange={(event) => setForm({ ...form, requestCode: event.target.value })} /></label>
        <label>Nome<input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label>
        <label>E-mail<input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></label>
        <label>WhatsApp<input inputMode="tel" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} /></label>
        <label>Tema<select value={form.topic} onChange={(event) => setForm({ ...form, topic: event.target.value })}><option>Agendamento</option><option>Segurança</option><option>Documentos</option><option>Check-in</option></select></label>
        <label className="wide">Mensagem<textarea value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} /></label>
        <button className="primary-button" type="submit" disabled={isSubmitting}>{isSubmitting ? "Enviando..." : "Enviar dúvida"}</button>
        <p className="form-message" aria-live="polite">{status}</p>
      </form>
    </div>
  );
}

function ConsultPage({ requests }: { requests: VisitRequest[] }) {
  const [requestId, setRequestId] = useState("");
  const [contact, setContact] = useState("");
  const [searched, setSearched] = useState(false);
  const result = requests.find((request) => {
    const contactMatches = request.visitorEmail.toLowerCase() === contact.toLowerCase() || request.visitorPhone.replace(/\D/g, "").endsWith(contact.replace(/\D/g, ""));
    return request.id.toLowerCase() === requestId.toLowerCase() && contactMatches;
  });

  return (
    <div className="page narrow-page">
      <PageHeading icon={<Search />} title="Consultar solicitação" text="Informe ID e e-mail ou WhatsApp para visualizar apenas dados essenciais." />
      <div className="form-card form-grid">
        <label>ID da solicitação<input value={requestId} onChange={(event) => setRequestId(event.target.value)} /></label>
        <label>E-mail ou WhatsApp<input value={contact} onChange={(event) => setContact(event.target.value)} /></label>
        <button className="primary-button" type="button" onClick={() => setSearched(true)}>Consultar</button>
      </div>
      {searched && <section className="result-panel" aria-live="polite">{result ? <RequestSummary request={result} /> : <p>Nenhuma solicitação encontrada com os dados informados.</p>}</section>}
    </div>
  );
}

function CheckinPage({ route, requests, updateRequest }: SharedProps) {
  const [requestId, setRequestId] = useState(route.query.get("requestId") ?? "");
  const [token, setToken] = useState(route.query.get("token") ?? "");
  const [message, setMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const request = requests.find((item) => item.id.toLowerCase() === requestId.toLowerCase());
  const valid = Boolean(request && request.qrToken === token && ["Aprovada", "Remarcada", "Check-in realizado"].includes(request.status));

  async function register(kind: "in" | "out") {
    if (isProcessing) return;
    if (!request || !valid) {
      setMessage("Check-in bloqueado: ID, token ou status inválido.");
      return;
    }
    try {
      setIsProcessing(true);
      setMessage(kind === "in" ? "Registrando check-in..." : "Registrando check-out...");
      const response =
        kind === "in" ? await appsScriptApi.registerCheckin(request.id, token) : await appsScriptApi.registerCheckout(request.id, token);
      const remoteRequest = toVisitRequest(readApiData(response));
      if (remoteRequest) {
        updateRequest(request.id, remoteRequest);
        setMessage(kind === "in" ? "Check-in confirmado." : "Check-out confirmado.");
        return;
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Não foi possível concluir o registro agora.");
      return;
    } finally {
      setIsProcessing(false);
    }
    updateRequest(request.id, kind === "in" ? { status: "Check-in realizado", checkinAt: new Date().toISOString() } : { status: "Check-out realizado", checkoutAt: new Date().toISOString() });
    setMessage(kind === "in" ? "Check-in registrado." : "Check-out registrado.");
  }

  return (
    <div className="page narrow-page">
      <PageHeading icon={<QrCode />} title="Check-in portaria" text="Conferência por ID e token. Apresente também um documento de identificação." />
      <div className="form-card form-grid">
        <label>ID da solicitação<input value={requestId} onChange={(event) => setRequestId(event.target.value)} /></label>
        <label>Token de acesso<input value={token} onChange={(event) => setToken(event.target.value)} /></label>
      </div>
      <section className="result-panel">
        {request ? (
          <>
            <RequestSummary request={request} />
            <p className="legal-note">O QR Code não substitui a validação presencial, apresentação de documento e orientação da equipe responsável.</p>
            <div className="button-row"><button className="primary-button" type="button" disabled={isProcessing} onClick={() => register("in")}>{isProcessing ? "Registrando..." : "Registrar check-in"}</button><button className="secondary-button" type="button" disabled={isProcessing} onClick={() => register("out")}>{isProcessing ? "Aguarde..." : "Registrar check-out"}</button></div>
          </>
        ) : <p>Informe o ID da solicitação para iniciar a conferência.</p>}
        <p className="form-message" aria-live="polite">{message}</p>
      </section>
    </div>
  );
}

function AdminPage(props: SharedProps) {
  const path = props.route.path;
  const requestId = decodeURIComponent(path.replace("/admin/solicitacoes/", ""));
  const currentRequest = props.requests.find((request) => request.id === requestId);
  const [pendingRequestId, setPendingRequestId] = useState<string | null>(null);

  return (
    <div className="page admin-page">
      <PageHeading icon={<Home />} title="Painel administrativo" text="Acompanhe solicitações, agenda e dúvidas em uma visão direta." />
      <nav className="admin-nav" aria-label="Navegação administrativa">
        {[
          ["/admin", "Resumo"],
          ["/admin/agenda", "Agenda"],
          ["/admin/hosts", "Hosts"],
          ["/admin/solicitacoes", "Solicitações"],
          ["/admin/duvidas", "Dúvidas"],
          ["/admin/configuracoes", "Configurações"],
        ].map(([href, label]) => {
          const active = href === "/admin" ? path === "/admin" : path.startsWith(href);
          return <a key={href} className={active ? "active" : ""} href={href} onClick={(event) => { event.preventDefault(); props.navigate(href); }}>{label}</a>;
        })}
      </nav>
      {path === "/admin" && <AdminMetrics {...props} />}
      {path === "/admin/agenda" && <AdminAgenda {...props} />}
      {path === "/admin/hosts" && <AdminHosts {...props} />}
      {path === "/admin/duvidas" && <AdminQuestions {...props} />}
      {path === "/admin/configuracoes" && <AdminSettings {...props} />}
      {path === "/admin/solicitacoes" && <RequestsTable {...props} pendingRequestId={pendingRequestId} setPendingRequestId={setPendingRequestId} />}
      {path.startsWith("/admin/solicitacoes/") && (
        <section className="result-panel">
          {currentRequest ? (
            <>
              <RequestSummary request={currentRequest} />
              <ReviewList items={[["Quiz", `${currentRequest.quizScore} de 5`], ["Último e-mail", currentRequest.lastEmailAt ? formatDateTime(currentRequest.lastEmailAt) : "Sem envio"], ["Observações", currentRequest.notes ?? "Sem observações"]]} />
              <div className="button-row"><button className="primary-button" type="button" disabled={pendingRequestId === currentRequest.id} onClick={() => setRequestStatus(currentRequest, "Aprovada", props.updateRequest, props.setSlots, setPendingRequestId)}>{pendingRequestId === currentRequest.id ? "Processando..." : "Aprovar e gerar QR"}</button><button className="secondary-button" type="button" disabled={pendingRequestId === currentRequest.id} onClick={() => setRequestStatus(currentRequest, "Remarcada", props.updateRequest, props.setSlots, setPendingRequestId)}>{pendingRequestId === currentRequest.id ? "Aguarde..." : "Marcar como remarcada"}</button></div>
            </>
          ) : <p>Não encontramos a solicitação informada.</p>}
        </section>
      )}
    </div>
  );
}

function AdminSettings({ integration, setIntegration }: SharedProps) {
  return (
    <section className="admin-settings">
      <header className="section-heading">
        <h2>Configurações</h2>
        <p>Gerencie recursos técnicos do painel administrativo.</p>
      </header>
      <IntegrationPanel integration={integration} setIntegration={setIntegration} />
    </section>
  );
}

function IntegrationPanel({
  integration,
  setIntegration,
}: {
  integration: IntegrationState;
  setIntegration: React.Dispatch<React.SetStateAction<IntegrationState>>;
}) {
  const [isTesting, setIsTesting] = useState(false);

  async function testConnection() {
    if (isTesting) return;
    setIsTesting(true);
    setIntegration({
      status: "checking",
      message: "Testando conexão com o serviço de integração.",
      checkedAt: new Date().toISOString(),
    });
    try {
      await appsScriptApi.ping();
      setIntegration({
        status: "connected",
        message: "Serviço de integração conectado.",
        checkedAt: new Date().toISOString(),
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Não foi possível conectar ao serviço de integração.";
      setIntegration({
        status: message.includes("login do Google") ? "blocked" : "offline",
        message,
        checkedAt: new Date().toISOString(),
      });
    } finally {
      setIsTesting(false);
    }
  }

  const label =
    integration.status === "connected"
      ? "Conectado"
      : integration.status === "checking"
        ? "Verificando"
        : integration.status === "blocked"
          ? "Bloqueado"
          : "Offline";

  return (
    <section className={`integration-panel ${integration.status}`} aria-live="polite">
      <div>
        <div className="summary-header">
          <h2>Integração do sistema</h2>
          <StatusBadge status={label} />
        </div>
        <p>{integration.message}</p>
        {integration.checkedAt && <small>Última verificação: {formatTimestamp(integration.checkedAt)}</small>}
      </div>
      <button className="secondary-button compact-button" type="button" disabled={isTesting} onClick={testConnection}>
        <Search aria-hidden="true" />
        {isTesting ? "Testando..." : "Testar conexão"}
      </button>
    </section>
  );
}

function AdminMetrics({ requests, slots, questions, navigate }: SharedProps) {
  const pendingRequests = requests.filter((request) => request.status.includes("Pendente") || request.status === "Recebida").length;
  const openQuestions = questions.filter((question) => question.status === "Nova").length;
  const availableSlots = slots.filter((slot) => slot.status === "Disponível").length;
  const metrics = [
    {
      label: "Pendentes",
      value: pendingRequests,
      action: "Analisar solicitações",
      icon: <ClipboardCheck />,
      href: "/admin/solicitacoes?status=pendentes",
    },
    {
      label: "Solicitações",
      value: requests.length,
      action: "Ver todas",
      icon: <ClipboardCheck />,
      href: "/admin/solicitacoes",
    },
    {
      label: "Agenda",
      value: availableSlots,
      action: "Gerenciar horários",
      icon: <CalendarRange />,
      href: "/admin/agenda",
    },
    {
      label: "Dúvidas",
      value: openQuestions,
      action: "Responder visitantes",
      icon: <HelpCircle />,
      href: "/admin/duvidas",
    },
  ];
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
}

function AdminAgenda({ slots, setSlots, hosts }: SharedProps) {
  const unitOptions = useMemo(() => uniqueValues([...slots.map((slot) => slot.unit), ...initialSlots.map((slot) => slot.unit)]), [slots]);
  const areaOptions = useMemo(
    () =>
      uniqueValues([
        ...slots.map((slot) => slot.area),
        ...initialSlots.map((slot) => slot.area),
        ...hosts.map((host) => host.area),
        ...initialHosts.map((host) => host.area),
      ]),
    [slots, hosts],
  );
  const typeOptions = useMemo(
    () => uniqueValues([...visitTypes, ...slots.map((slot) => slot.typeAllowed), ...initialSlots.map((slot) => slot.typeAllowed)]),
    [slots],
  );
  const defaultUnit = unitOptions[0] ?? "Terminal Portuário Santos";
  const defaultArea = areaOptions[0] ?? "Operação de cais";
  const defaultType = typeOptions[0] ?? "Visita técnica";
  const currentMonth = new Date().toISOString().slice(0, 7);
  const [singleForm, setSingleForm] = useState<SingleSlotForm>({
    date: "2026-06-25",
    time: "09:00",
    unit: defaultUnit,
    area: defaultArea,
    typeAllowed: defaultType,
    capacityTotal: 20,
  });
  const [planForm, setPlanForm] = useState<AgendaPlanForm>({
    calendarMonth: currentMonth,
    selectedDates: [],
    startTime: "09:00",
    endTime: "18:00",
    intervalMinutes: 60,
    unit: defaultUnit,
    area: defaultArea,
    typeAllowed: defaultType,
    capacityTotal: 20,
  });
  const [isCreatingSlot, setIsCreatingSlot] = useState(false);
  const [isGeneratingSlots, setIsGeneratingSlots] = useState(false);
  const [busySlotId, setBusySlotId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState("");
  const calendarDays = useMemo(() => buildCalendarMonth(planForm.calendarMonth), [planForm.calendarMonth]);
  const selectedDateSet = useMemo(() => new Set(planForm.selectedDates), [planForm.selectedDates]);
  const preview = useMemo(
    () => buildAgendaPreview(planForm.selectedDates, planForm.startTime, planForm.endTime, planForm.intervalMinutes),
    [planForm.selectedDates, planForm.startTime, planForm.endTime, planForm.intervalMinutes],
  );

  function patchSingle<K extends keyof SingleSlotForm>(key: K, value: SingleSlotForm[K]) {
    setSingleForm((current) => ({ ...current, [key]: value }));
  }

  function patchPlan<K extends keyof AgendaPlanForm>(key: K, value: AgendaPlanForm[K]) {
    setPlanForm((current) => ({ ...current, [key]: value }));
  }

  function toggleDate(date: string) {
    setPlanForm((current) => {
      const selectedDates = current.selectedDates.includes(date)
        ? current.selectedDates.filter((item) => item !== date)
        : [...current.selectedDates, date];
      return { ...current, selectedDates: selectedDates.sort() };
    });
  }

  function clearSelectedDates() {
    setPlanForm((current) => ({ ...current, selectedDates: [] }));
  }

  function mergeLocalSlots(remoteSlots: AvailabilitySlot[]) {
    setSlots((current) => mergeAvailabilitySlots(current, remoteSlots));
  }

  function moveCalendarMonth(direction: -1 | 1) {
    setPlanForm((current) => ({ ...current, calendarMonth: shiftMonth(current.calendarMonth, direction) }));
  }

  async function addSlot(event: FormEvent) {
    event.preventDefault();
    if (isCreatingSlot) return;
    setFeedback("");
    const slot: AvailabilitySlot = {
      id: nextId("SLOT", Date.now() % 1000),
      date: singleForm.date,
      time: singleForm.time,
      unit: singleForm.unit,
      area: singleForm.area,
      typeAllowed: singleForm.typeAllowed,
      capacityTotal: singleForm.capacityTotal,
      capacityUsed: 0,
      status: "Disponível",
    };
    if (slots.some((existingSlot) => slotUniqueKey(existingSlot) === slotUniqueKey(slot))) {
      setFeedback("Já existe um slot para esta data e horário.");
      return;
    }
    try {
      setIsCreatingSlot(true);
      const response = await appsScriptApi.createAvailabilitySlot({
        date: slot.date,
        time: slot.time,
        unit: slot.unit,
        area: slot.area,
        typeAllowed: slot.typeAllowed,
        capacityTotal: slot.capacityTotal,
        capacityUsed: slot.capacityUsed,
        status: slot.status,
      });
      const remoteSlot = toAvailabilitySlot(readApiData(response));
      mergeLocalSlots([remoteSlot ?? slot]);
      setFeedback("Slot único criado com sucesso.");
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "Não foi possível criar o slot.");
      return;
    } finally {
      setIsCreatingSlot(false);
    }
  }

  async function generateSlots(event: FormEvent) {
    event.preventDefault();
    if (isGeneratingSlots) return;
    if (!planForm.selectedDates.length) {
      setFeedback("Selecione ao menos uma data no calendário.");
      return;
    }
    setFeedback("");
    try {
      setIsGeneratingSlots(true);
      const response = await appsScriptApi.createAvailabilitySlots({
        dates: planForm.selectedDates,
        startTime: planForm.startTime,
        endTime: planForm.endTime,
        intervalMinutes: planForm.intervalMinutes,
        unit: planForm.unit,
        area: planForm.area,
        typeAllowed: planForm.typeAllowed,
        capacityTotal: planForm.capacityTotal,
      });
      const result = readApiData(response) as { created?: unknown[]; skipped?: unknown[] } | null;
      const createdSlots = (result?.created ?? []).map(toAvailabilitySlot).filter(Boolean) as AvailabilitySlot[];
      if (createdSlots.length) {
        mergeLocalSlots(createdSlots);
      }
      const createdCount = createdSlots.length;
      const skippedCount = result?.skipped?.length ?? 0;
      setFeedback(
        createdCount > 0
          ? `${createdCount} slot${createdCount === 1 ? "" : "s"} criado${createdCount === 1 ? "" : "s"}${skippedCount ? ` · ${skippedCount} já existiam` : ""}.`
          : skippedCount
            ? `${skippedCount} combinação${skippedCount === 1 ? "" : "ões"} já existia${skippedCount === 1 ? "" : "m"}.`
            : "Nenhum novo slot foi gerado.",
      );
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "Não foi possível gerar a agenda.");
      return;
    } finally {
      setIsGeneratingSlots(false);
    }
  }

  async function setStatus(id: string, status: SlotStatus) {
    if (busySlotId) return;
    try {
      setBusySlotId(id);
      const response = await appsScriptApi.updateAvailabilitySlot(id, { status, Status: status });
      const remoteSlot = toAvailabilitySlot(readApiData(response));
      if (remoteSlot) {
        mergeLocalSlots([remoteSlot]);
        return;
      }
    } catch {
      return;
    } finally {
      setBusySlotId(null);
    }
    setSlots((current) => current.map((slot) => (slot.id === id ? { ...slot, status } : slot)));
  }

  return (
    <section className="agenda-admin">
      <div className="agenda-calendar-layout">
        <section className="agenda-card agenda-calendar-card" aria-labelledby="agenda-calendar-title">
          <div className="agenda-panel-header">
            <div>
              <h2 id="agenda-calendar-title">Calendário de agenda</h2>
              <p>Clique nas datas como num agendamento de hotel. Você pode marcar várias datas no mês e depois liberar os horários de uma vez.</p>
            </div>
            <div className="agenda-preview">
              <CalendarDays aria-hidden="true" />
              <span>
                {planForm.selectedDates.length} data{planForm.selectedDates.length === 1 ? "" : "s"}
              </span>
            </div>
          </div>

          <div className="calendar-widget agenda-calendar-widget" aria-label="Calendário de seleção de datas">
            <div className="calendar-month-bar">
              <button className="icon-action-button" type="button" aria-label="Mês anterior" onClick={() => moveCalendarMonth(-1)}>
                <ChevronLeft aria-hidden="true" />
              </button>
              <strong>{formatMonthLabel(planForm.calendarMonth)}</strong>
              <button className="icon-action-button" type="button" aria-label="Próximo mês" onClick={() => moveCalendarMonth(1)}>
                <ChevronRight aria-hidden="true" />
              </button>
            </div>
            <div className="calendar-weekdays" aria-hidden="true">
              {weekdayLabels.map((day) => (
                <span key={day}>{day}</span>
              ))}
            </div>
            <div className="calendar-grid">
              {calendarDays.map((day, index) => {
                if (!day) return <span key={`empty-${index}`} className="calendar-empty" aria-hidden="true" />;
                const selected = selectedDateSet.has(day.date);
                const slotCount = slots.filter((slot) => slot.date === day.date).length;
                return (
                  <button
                    key={day.date}
                    type="button"
                    className={selected ? "calendar-day selected" : "calendar-day"}
                    aria-pressed={selected}
                    aria-label={`${day.date}${selected ? ", selecionada" : ""}`}
                    onClick={() => toggleDate(day.date)}
                  >
                    <span>{day.day}</span>
                    {slotCount > 0 && <small>{slotCount}</small>}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="selected-date-panel">
            <div className="selected-date-panel-header">
              <strong>Datas selecionadas</strong>
              <button className="small-button" type="button" onClick={clearSelectedDates}>
                Limpar seleção
              </button>
            </div>
            <div className="selected-date-list" aria-label="Datas escolhidas">
              {planForm.selectedDates.length ? (
                planForm.selectedDates.map((date) => (
                  <button key={date} className="selected-date-chip" type="button" onClick={() => toggleDate(date)}>
                    <span>{date}</span>
                    <X aria-hidden="true" />
                  </button>
                ))
              ) : (
                <p className="selected-date-empty">Nenhuma data marcada ainda.</p>
              )}
            </div>
          </div>
        </section>

        <form className="form-card agenda-generator" onSubmit={generateSlots}>
          <div className="agenda-panel-header">
            <div>
              <h2>Horários e capacidade</h2>
              <p>Defina a janela diária para os dias escolhidos. A agenda é montada automaticamente com o intervalo informado.</p>
            </div>
            <div className="agenda-preview">
              <CalendarRange aria-hidden="true" />
              <span>
                {preview.totalSlots} slot{preview.totalSlots === 1 ? "" : "s"}
              </span>
            </div>
          </div>

          <div className="form-grid">
            <label>
              Horário inicial
              <input type="time" value={planForm.startTime} onChange={(event) => patchPlan("startTime", event.target.value)} />
            </label>
            <label>
              Horário final
              <input type="time" value={planForm.endTime} onChange={(event) => patchPlan("endTime", event.target.value)} />
            </label>
            <label>
              Intervalo
              <select value={planForm.intervalMinutes} onChange={(event) => patchPlan("intervalMinutes", Number(event.target.value))}>
                <option value={30}>A cada 30 minutos</option>
                <option value={60}>A cada 1 hora</option>
                <option value={120}>A cada 2 horas</option>
                <option value={180}>A cada 3 horas</option>
              </select>
            </label>
            <label>
              Capacidade
              <input type="number" min={1} value={planForm.capacityTotal} onChange={(event) => patchPlan("capacityTotal", Number(event.target.value))} />
            </label>
            <label>
              Unidade
              <select value={planForm.unit} onChange={(event) => patchPlan("unit", event.target.value)}>
                <option value="">Selecione uma unidade</option>
                {unitOptions.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Área
              <select value={planForm.area} onChange={(event) => patchPlan("area", event.target.value)}>
                <option value="">Selecione uma área</option>
                {areaOptions.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
            </label>
            <label className="wide">
              Tipo permitido
              <select value={planForm.typeAllowed} onChange={(event) => patchPlan("typeAllowed", event.target.value)}>
                <option value="">Selecione um tipo</option>
                {typeOptions.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="form-actions agenda-actions">
            <button className="primary-button compact-button" type="submit" disabled={isGeneratingSlots}>
              {isGeneratingSlots ? <span className="inline-spinner" aria-hidden="true" /> : <Repeat aria-hidden="true" />}
              {isGeneratingSlots ? "Gerando..." : "Gerar agenda"}
            </button>
          </div>
          <p className="agenda-feedback" aria-live="polite">
            {feedback || `Prévia: ${preview.selectedDatesCount} data${preview.selectedDatesCount === 1 ? "" : "s"} · ${preview.timesCount} horário${preview.timesCount === 1 ? "" : "s"} por data.`}
          </p>
        </form>
      </div>

      <details className="agenda-manual">
        <summary>
          <strong>Slot único</strong>
          <span>Criação avulsa para ajustes pontuais</span>
        </summary>
        <form className="form-grid agenda-manual-grid" onSubmit={addSlot}>
          <label>
            Data
            <input type="date" value={singleForm.date} onChange={(event) => patchSingle("date", event.target.value)} />
          </label>
          <label>
            Horário
            <input type="time" value={singleForm.time} onChange={(event) => patchSingle("time", event.target.value)} />
          </label>
          <label>
            Unidade
            <select value={singleForm.unit} onChange={(event) => patchSingle("unit", event.target.value)}>
              <option value="">Selecione uma unidade</option>
              {unitOptions.map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
          </label>
          <label>
            Área
            <select value={singleForm.area} onChange={(event) => patchSingle("area", event.target.value)}>
              <option value="">Selecione uma área</option>
              {areaOptions.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
          </label>
          <label>
            Tipo permitido
            <select value={singleForm.typeAllowed} onChange={(event) => patchSingle("typeAllowed", event.target.value)}>
              <option value="">Selecione um tipo</option>
              {typeOptions.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>
          <label>
            Capacidade
            <input type="number" min={1} value={singleForm.capacityTotal} onChange={(event) => patchSingle("capacityTotal", Number(event.target.value))} />
          </label>
          <div className="form-actions">
            <button className="primary-button compact-button" type="submit" disabled={isCreatingSlot}>
              {isCreatingSlot ? <span className="inline-spinner" aria-hidden="true" /> : <Plus aria-hidden="true" />}
              {isCreatingSlot ? "Criando..." : "Criar slot"}
            </button>
          </div>
        </form>
      </details>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Slot</th>
              <th>Data</th>
              <th>Unidade</th>
              <th>Vagas</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {slots.map((slot) => {
              const busy = busySlotId === slot.id;
              return (
                <tr key={slot.id}>
                  <td>{slot.id}</td>
                  <td>{formatDateTime(slot.date, slot.time)}</td>
                  <td>{slot.unit}</td>
                  <td>
                    {capacityAvailable(slot)} de {slot.capacityTotal}
                  </td>
                  <td>
                    <StatusBadge status={slot.status} />
                  </td>
                  <td>
                    <button
                      className="icon-action-button"
                      type="button"
                      disabled={busy}
                      title={slot.status === "Bloqueado" ? "Liberar slot" : "Bloquear slot"}
                      aria-label={slot.status === "Bloqueado" ? "Liberar slot" : "Bloquear slot"}
                      onClick={() => setStatus(slot.id, slot.status === "Bloqueado" ? "Disponível" : "Bloqueado")}
                    >
                      {busy ? <span className="inline-spinner" aria-hidden="true" /> : slot.status === "Bloqueado" ? <LockOpen aria-hidden="true" /> : <Lock aria-hidden="true" />}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function AdminHosts({ hosts, setHosts }: SharedProps) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", area: "" });
  const [isSaving, setIsSaving] = useState(false);
  const areaOptions = uniqueValues([
    ...hosts.map((host) => host.area),
    ...initialHosts.map((host) => host.area),
    ...initialSlots.map((slot) => slot.area),
  ]);
  async function addHost(event: FormEvent) {
    event.preventDefault();
    if (isSaving) return;
    if (!form.name.trim() || !isValidEmail(form.email)) return;
    const host: Host = { id: nextId("HOST", Date.now() % 1000), active: true, ...form };
    try {
      setIsSaving(true);
      const response = await appsScriptApi.createHost(host as unknown as Record<string, unknown>);
      const remoteHost = toHost(readApiData(response));
      setHosts((current) => [remoteHost ?? host, ...current]);
    } catch {
      return;
    } finally {
      setIsSaving(false);
    }
    setForm({ name: "", email: "", phone: "", area: "" });
  }
  return (
    <section>
      <form className="form-card form-grid" onSubmit={addHost}>
        <label>Nome<input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label>
        <label>E-mail<input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></label>
        <label>WhatsApp<input value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} /></label>
        <label>Área<select value={form.area} onChange={(event) => setForm({ ...form, area: event.target.value })}><option value="">Selecione uma área</option>{areaOptions.map((area) => <option key={area} value={area}>{area}</option>)}</select></label>
        <button className="primary-button" type="submit" disabled={isSaving}>{isSaving ? "Cadastrando..." : "Cadastrar host"}</button>
      </form>
      <section className="cards-list">{hosts.map((host) => <article className="admin-card" key={host.id}><h2>{host.name}</h2><p>{host.area}</p><p>{host.email}</p><StatusBadge status={host.active ? "Ativo" : "Inativo"} /><button className="small-button" type="button" onClick={() => setHosts((current) => current.map((item) => item.id === host.id ? { ...item, active: !item.active } : item))}>{host.active ? "Inativar" : "Ativar"}</button></article>)}</section>
    </section>
  );
}

function AdminQuestions({ questions, setQuestions }: SharedProps) {
  async function setStatus(id: string, status: QuestionStatus) {
    try {
      const response = await appsScriptApi.updateVisitorQuestionStatus(id, { status, Status: status });
      const remoteQuestion = toVisitorQuestion(readApiData(response));
      if (remoteQuestion) {
        setQuestions((current) => current.map((question) => question.id === id ? remoteQuestion : question));
        return;
      }
    } catch {
      // API offline — fall through to local state update
    }
    setQuestions((current) => current.map((question) => question.id === id ? { ...question, status } : question));
  }
  return <section className="cards-list">{questions.map((question) => <article className="admin-card" key={question.id}><div className="summary-header"><h2>{question.topic}</h2><StatusBadge status={question.status} /></div><p className="request-code">Solicitação {question.requestCode}</p><p><strong>{question.name}</strong> - {question.email}</p><p>{question.message}</p><div className="button-row"><button className="small-button" type="button" onClick={() => setStatus(question.id, "Em análise")}>Em análise</button><button className="small-button" type="button" onClick={() => setStatus(question.id, "Respondida")}>Respondida</button><a className="small-link" href={whatsappUrl(question.phone)} target="_blank" rel="noreferrer">WhatsApp</a></div></article>)}</section>;
}

function RequestsTable(props: SharedProps & {
  pendingRequestId: string | null;
  setPendingRequestId: React.Dispatch<React.SetStateAction<string | null>>;
}) {
  const filter = props.route.query.get("status") ?? "todas";
  const filteredRequests = props.requests.filter((request) => {
    if (filter === "pendentes") return request.status.includes("Pendente") || request.status === "Recebida";
    if (filter === "aprovadas") return request.status === "Aprovada";
    if (filter === "reprovadas") return request.status === "Reprovada";
    return true;
  });
  const filterLabel = filter === "pendentes" ? "Pendentes" : filter === "aprovadas" ? "Aprovadas" : filter === "reprovadas" ? "Reprovadas" : "Todas";

  return (
    <section className="admin-table-section">
      <div className="table-toolbar">
        <div>
          <h2>Solicitações</h2>
          <p>{filterLabel} · {filteredRequests.length} registro{filteredRequests.length === 1 ? "" : "s"}</p>
        </div>
        {filter !== "todas" && <button className="small-button" type="button" onClick={() => props.navigate("/admin/solicitacoes")}>Ver todas</button>}
      </div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>ID</th><th>Responsável</th><th>Data e horário</th><th>Modalidade</th><th>Unidade</th><th>Status</th><th>E-mails</th><th>Ações</th></tr></thead>
          <tbody>{filteredRequests.map((request) => {
            const busy = props.pendingRequestId === request.id;
            const slot = props.slots.find((item) => item.id === request.slotId);
            return <tr key={request.id}><td><a href={`/admin/solicitacoes/${request.id}`} onClick={(event) => { event.preventDefault(); props.navigate(`/admin/solicitacoes/${request.id}`); }}>{request.id}</a></td><td>{request.visitorName}</td><td>{slot ? formatDateTime(slot.date, slot.time) : "Não informado"}</td><td>{formatRequestMode(request)}</td><td>{request.unit}</td><td><StatusBadge status={request.status} /></td><td>{request.emailVisitorSent ? "Visitante" : "Pendente"} / {request.emailHostSent ? "Host" : "Pendente"}</td><td className="action-cell"><button className="icon-action-button success-action" type="button" title={busy ? "Processando..." : "Aprovar solicitação"} aria-label={busy ? "Processando aprovação" : "Aprovar solicitação"} disabled={busy} onClick={() => setRequestStatus(request, "Aprovada", props.updateRequest, props.setSlots, props.setPendingRequestId)}>{busy ? <span className="inline-spinner" aria-hidden="true" /> : <Check aria-hidden="true" />}</button><button className="icon-action-button danger-action" type="button" title={busy ? "Processando..." : "Reprovar solicitação"} aria-label={busy ? "Processando reprovação" : "Reprovar solicitação"} disabled={busy} onClick={() => setRequestStatus(request, "Reprovada", props.updateRequest, props.setSlots, props.setPendingRequestId)}>{busy ? <span className="inline-spinner" aria-hidden="true" /> : <Ban aria-hidden="true" />}</button><button className="icon-action-button" type="button" title={busy ? "Processando..." : "Cancelar solicitação"} aria-label={busy ? "Processando cancelamento" : "Cancelar solicitação"} disabled={busy} onClick={() => setRequestStatus(request, "Cancelada", props.updateRequest, props.setSlots, props.setPendingRequestId)}>{busy ? <span className="inline-spinner" aria-hidden="true" /> : <X aria-hidden="true" />}</button><a className="icon-action-button whatsapp-action" href={whatsappUrl(request.visitorPhone, `Olá, ${request.visitorName}. Aqui é a equipe responsável pelo agendamento de visitas. Precisamos tratar alguns detalhes da sua solicitação ${request.id}.`)} title="Abrir WhatsApp" aria-label="Abrir WhatsApp" target="_blank" rel="noreferrer"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg></a></td></tr>;
          })}</tbody>
        </table>
      </div>
    </section>
  );
}

function formatRequestMode(request: VisitRequest) {
  if (request.mode === "Individual") return "Individual";
  return `${request.mode} (${request.visitorsCount})`;
}

async function setRequestStatus(
  request: VisitRequest,
  status: VisitStatus,
  updateRequest: (id: string, patch: Partial<VisitRequest>) => void,
  setSlots: React.Dispatch<React.SetStateAction<AvailabilitySlot[]>>,
  setPendingRequestId?: React.Dispatch<React.SetStateAction<string | null>>,
) {
  const patch: Partial<VisitRequest> = { status, lastEmailAt: new Date().toISOString() };
  if (status === "Aprovada") patch.qrToken = request.qrToken ?? makeQrToken(request.id);
  const shouldReleaseCapacity = isRequestCapacityReserved(request.status) && !isRequestCapacityReserved(status);
  try {
    setPendingRequestId?.(request.id);
    const response =
      status === "Aprovada"
        ? await appsScriptApi.approveVisitRequest(request.id, {})
        : status === "Reprovada"
          ? await appsScriptApi.rejectVisitRequest(request.id, {})
          : status === "Cancelada"
            ? await appsScriptApi.cancelVisitRequest(request.id, {})
            : null;
    if (response) {
      const remoteRequest = toVisitRequest(readApiData(response));
      if (remoteRequest) {
        updateRequest(request.id, remoteRequest);
        if (shouldReleaseCapacity) releaseSlotCapacity(setSlots, request);
        return;
      }
    }
  } catch {
    return;
  } finally {
    setPendingRequestId?.(null);
  }
  updateRequest(request.id, patch);
  if (shouldReleaseCapacity) releaseSlotCapacity(setSlots, request);
}

function isRequestCapacityReserved(status: VisitStatus) {
  return [
    "Recebida",
    "Pendente de aprovação",
    "Reagendamento solicitado",
    "Remarcada",
    "Aprovada",
    "Check-in realizado",
  ].includes(status);
}

function releaseSlotCapacity(setSlots: React.Dispatch<React.SetStateAction<AvailabilitySlot[]>>, request: VisitRequest) {
  setSlots((current) =>
    current.map((slot) => {
      if (slot.id !== request.slotId) return slot;
      const capacityUsed = Math.max(slot.capacityUsed - request.visitorsCount, 0);
      return { ...slot, capacityUsed, status: capacityUsed >= slot.capacityTotal ? "Lotado" : "Disponível" };
    }),
  );
}

function ConfirmationPage({ requestId, navigate }: { requestId: string | null; navigate: (path: string) => void }) {
  return (
    <div className="page narrow-page">
      <section className="result-panel confirmation-panel">
        <Check aria-hidden="true" />
        <h1>Solicitação recebida</h1>
        <p>Seu protocolo é <strong>{requestId ?? "REQ"}</strong>. O envio não garante aprovação automática.</p>
        <div className="button-row"><button className="primary-button" type="button" onClick={() => navigate("/consultar")}>Consultar status</button><button className="secondary-button" type="button" onClick={() => navigate("/")}>Voltar ao início</button></div>
      </section>
    </div>
  );
}

type SheetRow = Record<string, unknown>;

function readApiData(response: unknown) {
  if (response && typeof response === "object" && "data" in response) return (response as { data?: unknown }).data;
  return response;
}

function toAvailabilitySlot(value: unknown): AvailabilitySlot | null {
  const row = value as SheetRow;
  const id = stringValue(row.id ?? row.SlotID);
  if (!id) return null;
  const capacityTotal = numberValue(row.capacityTotal ?? row.CapacityTotal);
  const capacityUsed = numberValue(row.capacityUsed ?? row.CapacityUsed);
  return {
    id,
    date: dateValue(row.date ?? row.Date),
    time: timeValue(row.time ?? row.Time),
    unit: stringValue(row.unit ?? row.Unit),
    area: stringValue(row.area ?? row.Area),
    typeAllowed: stringValue(row.typeAllowed ?? row.TypeAllowed) || "Visita técnica",
    capacityTotal,
    capacityUsed,
    status: (stringValue(row.status ?? row.Status) || "Disponível") as SlotStatus,
  };
}

function toHost(value: unknown): Host | null {
  const row = value as SheetRow;
  const id = stringValue(row.id ?? row.HostID);
  if (!id) return null;
  return {
    id,
    name: stringValue(row.name ?? row.Name),
    email: stringValue(row.email ?? row.Email),
    phone: stringValue(row.phone ?? row.Phone),
    area: stringValue(row.area ?? row.Area),
    active: booleanValue(row.active ?? row.Active),
  };
}

function toVisitRequest(value: unknown): VisitRequest | null {
  const row = value as SheetRow;
  const id = stringValue(row.id ?? row.RequestID);
  if (!id) return null;
  return {
    id,
    createdAt: stringValue(row.createdAt ?? row.CreatedAt),
    visitorName: stringValue(row.visitorName ?? row.VisitorName),
    visitorEmail: stringValue(row.visitorEmail ?? row.VisitorEmail),
    visitorPhone: stringValue(row.visitorPhone ?? row.VisitorPhone),
    organization: stringValue(row.organization ?? row.Organization),
    visitType: stringValue(row.visitType ?? row.VisitType),
    mode: (stringValue(row.mode ?? row.Mode) || "Individual") as VisitMode,
    visitorsCount: numberValue(row.visitorsCount ?? row.VisitorsCount) || 1,
    slotId: stringValue(row.slotId ?? row.SlotID),
    unit: stringValue(row.unit ?? row.Unit),
    area: stringValue(row.area ?? row.Area),
    hostId: stringValue(row.hostId ?? row.HostID),
    status: (stringValue(row.status ?? row.Status) || "Recebida") as VisitStatus,
    safetyAccepted: booleanValue(row.safetyAccepted ?? row.SafetyAccepted),
    quizScore: numberValue(row.quizScore ?? row.QuizScore),
    qrToken: optionalString(row.qrToken ?? row.QrToken),
    checkinAt: optionalString(row.checkinAt ?? row.CheckinAt),
    checkoutAt: optionalString(row.checkoutAt ?? row.CheckoutAt),
    emailVisitorSent: booleanValue(row.emailVisitorSent ?? row.EmailVisitorSent),
    emailHostSent: booleanValue(row.emailHostSent ?? row.EmailHostSent),
    emailAdminSent: booleanValue(row.emailAdminSent ?? row.EmailAdminSent),
    lastEmailAt: optionalString(row.lastEmailAt ?? row.LastEmailAt),
    notes: optionalString(row.notes ?? row.Notes),
  };
}

function toVisitorQuestion(value: unknown): VisitorQuestion | null {
  const row = value as SheetRow;
  const id = stringValue(row.id ?? row.QuestionID);
  if (!id) return null;
  return {
    id,
    createdAt: stringValue(row.createdAt ?? row.CreatedAt),
    requestCode: stringValue(row.requestCode ?? row.RequestCode),
    name: stringValue(row.name ?? row.Name),
    email: stringValue(row.email ?? row.Email),
    phone: stringValue(row.phone ?? row.Phone),
    topic: stringValue(row.topic ?? row.Topic),
    message: stringValue(row.message ?? row.Message),
    status: (stringValue(row.status ?? row.Status) || "Nova") as QuestionStatus,
    answer: optionalString(row.answer ?? row.Answer),
  };
}

function stringValue(value: unknown) {
  return value == null ? "" : String(value);
}

function optionalString(value: unknown) {
  const text = stringValue(value);
  return text || undefined;
}

function numberValue(value: unknown) {
  return Number(value || 0);
}

function booleanValue(value: unknown) {
  return value === true || value === "true" || value === "TRUE" || value === "Sim";
}

function dateValue(value: unknown) {
  const text = stringValue(value);
  return text.includes("T") ? text.slice(0, 10) : text;
}

function timeValue(value: unknown) {
  const text = stringValue(value);
  if (text.includes("T")) return new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date(text));
  return text.slice(0, 5);
}

const weekdayLabels = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

function buildAgendaPreview(selectedDates: string[], startTime: string, endTime: string, intervalMinutes: number) {
  const datesCount = selectedDates.length;
  const timesCount = countGeneratedTimes(startTime, endTime, intervalMinutes);
  return {
    selectedDatesCount: datesCount,
    timesCount,
    totalSlots: datesCount * timesCount,
  };
}

function countGeneratedTimes(startTime: string, endTime: string, intervalMinutes: number) {
  if (!startTime || !endTime || intervalMinutes <= 0) return 0;
  const start = timeToMinutes(startTime);
  const end = timeToMinutes(endTime);
  if (start > end) return 0;
  let count = 0;
  for (let current = start; current <= end; current += intervalMinutes) {
    count += 1;
  }
  return count;
}

function timeToMinutes(value: string) {
  const [hoursText, minutesText] = value.split(":");
  const hours = Number(hoursText);
  const minutes = Number(minutesText);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return 0;
  return hours * 60 + minutes;
}

function shiftMonth(month: string, delta: -1 | 1) {
  const [yearText, monthText] = month.split("-");
  const year = Number(yearText);
  const currentMonth = Number(monthText);
  if (Number.isNaN(year) || Number.isNaN(currentMonth)) return month;
  const next = new Date(year, currentMonth - 1 + delta, 1);
  return `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, "0")}`;
}

function mergeAvailabilitySlots(current: AvailabilitySlot[], incoming: AvailabilitySlot[]) {
  return dedupeAvailabilitySlots([...current, ...incoming]);
}

function dedupeAvailabilitySlots(slots: AvailabilitySlot[]) {
  const merged = new Map<string, AvailabilitySlot>();
  slots.forEach((slot) => {
    const key = slotUniqueKey(slot);
    if (!merged.has(key)) merged.set(key, slot);
  });
  return Array.from(merged.values()).sort((left, right) => {
    const dateCompare = left.date.localeCompare(right.date);
    if (dateCompare !== 0) return dateCompare;
    return left.time.localeCompare(right.time);
  });
}

function slotUniqueKey(slot: Pick<AvailabilitySlot, "date" | "time">) {
  return `${slot.date}|${slot.time.slice(0, 5)}`;
}

function buildCalendarMonth(month: string) {
  if (!month) return [];
  const [year, monthNumber] = month.split("-").map(Number);
  const firstDay = new Date(year, monthNumber - 1, 1);
  const daysInMonth = new Date(year, monthNumber, 0).getDate();
  const blanks = Array.from({ length: firstDay.getDay() }, () => null);
  const days = Array.from({ length: daysInMonth }, (_, index) => {
    const day = index + 1;
    return {
      day,
      date: `${year}-${String(monthNumber).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
    };
  });
  return [...blanks, ...days];
}

function formatMonthLabel(month: string) {
  const [year, monthNumber] = month.split("-").map(Number);
  return new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" }).format(new Date(year, monthNumber - 1, 1));
}

function formatTimestamp(value: string) {
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(new Date(value));
}

function uniqueValues(values: Array<string | null | undefined>) {
  return Array.from(new Set(values.map((value) => value?.trim()).filter((value): value is string => Boolean(value))));
}

function MetricCard({
  icon,
  label,
  value,
  action,
  onClick,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  action: string;
  onClick: () => void;
}) {
  return (
    <button className="metric-card" type="button" onClick={onClick}>
      <span className="metric-icon" aria-hidden="true">{icon}</span>
      <span className="metric-content">
        <strong>{value}</strong>
        <span>{label}</span>
        <small>{action}</small>
      </span>
      <ChevronRight className="metric-arrow" aria-hidden="true" />
    </button>
  );
}

function PageHeading({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return <header className="page-heading"><span aria-hidden="true">{icon}</span><div><h1>{title}</h1><p>{text}</p></div></header>;
}

function InfoList({ title, items }: { title: string; items: string[] }) {
  return <article className="info-list"><h3>{title}</h3><ul>{items.map((item) => <li key={item}>{item}</li>)}</ul></article>;
}

function ReviewList({ items }: { items: [string, string][] }) {
  return <dl className="review-list">{items.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>;
}

function StatusBadge({ status }: { status: string }) {
  return <span className={`status-badge ${statusTone(status)}`}>{status}</span>;
}

function RequestSummary({ request }: { request: VisitRequest }) {
  return (
    <>
      <div className="summary-header"><h2>{request.id}</h2><StatusBadge status={request.status} /></div>
      <ReviewList items={[["Responsável", request.visitorName], ["Unidade", request.unit], ["Área", request.area], ["Modalidade", request.mode], ["Quantidade", String(request.visitorsCount)], ["E-mail ao visitante", request.emailVisitorSent ? "Sim" : "Não"]]} />
      {request.status === "Aprovada" && request.qrToken && <div className="qr-area"><PseudoQr value={checkinLink(request)} /><p>{checkinLink(request)}</p></div>}
    </>
  );
}

function PseudoQr({ value }: { value: string }) {
  const cells = useMemo(() => {
    let seed = 0;
    for (const char of value) seed += char.charCodeAt(0);
    return Array.from({ length: 121 }, (_, index) => ((index * 17 + seed) % 5) < 2);
  }, [value]);
  return <svg className="qr-code" viewBox="0 0 110 110" role="img" aria-label="QR Code para conferência da visita"><rect width="110" height="110" fill="#ffffff" />{cells.map((active, index) => active && <rect key={index} x={(index % 11) * 10} y={Math.floor(index / 11) * 10} width="8" height="8" fill="#03243f" />)}</svg>;
}
