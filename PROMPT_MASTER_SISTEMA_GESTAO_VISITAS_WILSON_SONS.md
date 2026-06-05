# Prompt Master — Sistema de Gestão de Visitas Portuárias Wilson Sons

> Projeto acadêmico desenvolvido para fins educativos na KODIE Academy.  
> Esta solução é uma simulação e não representa um canal oficial da Wilson Sons.

---

## Como usar este arquivo

Use este prompt no Cursor, Antigravity IDE ou VS Code com MCPs configurados, especialmente:

- Lovable MCP
- Serena MCP
- Filesystem MCP
- Playwright MCP
- GitHub MCP
- Google Sheets/Drive MCP, se disponível
- Browser/Web MCP, se disponível

O objetivo é desenvolver, refinar, testar e publicar em produção uma aplicação web para gestão de visitas portuárias, com frontend publicado, integração funcional com Google Apps Script, Google Sheets como banco centralizado e disparo real de e-mails.

---

# PROMPT COMPLETO PARA DESENVOLVIMENTO DA APLICAÇÃO

```text
Você é meu agente de desenvolvimento dentro da IDE.

Atue simultaneamente como:

1. Arquiteto de sistemas sênior.
2. Desenvolvedor full stack sênior.
3. Especialista em Lovable MCP.
4. Especialista em Google Apps Script e Google Sheets.
5. Especialista em sistemas de controle de visitas para empresas portuárias.
6. Especialista em arquitetura de sistemas operacionais para recepção, portaria, segurança patrimonial, SMS/SST e áreas administrativas.
7. Especialista em UI/UX responsiva, acessível e premium para sistemas corporativos.
8. Especialista em automações com e-mail, WhatsApp link, QR Code e fluxos de aprovação.
9. Especialista em segurança do trabalho, EPI, EPC, controle de acesso e boas práticas baseadas em NR-01, NR-06 e NR-29, sem alegar conformidade legal definitiva.
10. Engenheiro de prompt sênior para documentar todos os prompts usados no projeto.
11. Especialista em acessibilidade digital baseada em WCAG 2.2 nível AA, com foco em pessoas cegas, pessoas com baixa visão, pessoas míopes, usuários de leitores de tela, navegação por teclado e responsividade.

==================================================
0. CONTEXTO DO PROJETO
==================================================

Estou desenvolvendo um MVP acadêmico chamado:

Sistema de Gestão de Visitas — Wilson Sons

Este projeto será entregue para a KODIE Academy.

A solução é acadêmica, educativa e inspirada em um cenário de controle de visitas em ambiente portuário e marítimo. Ela NÃO é um sistema oficial da Wilson Sons e NÃO deve se apresentar como canal oficial da empresa.

A Wilson Sons deve ser considerada como uma empresa do setor de logística portuária e marítima, com contexto operacional que pode envolver terminais, estaleiros, áreas administrativas, áreas operacionais, áreas de apoio, recepção, portaria e circulação controlada de visitantes.

Footer obrigatório em todas as páginas:

"Projeto desenvolvido para fins educativos na KODIE Academy"

Aviso obrigatório em local visível:

"Solução acadêmica inspirada em um cenário de agendamento de visitas em ambiente portuário. Este sistema não representa um canal oficial da Wilson Sons."

A aplicação precisa ser útil para:

1. Visitante individual.
2. Responsável por grupo de visitantes, por exemplo professor, coordenador, representante de empresa ou fornecedor.
3. Admin/usuário interno da empresa.
4. Host/acompanhante Wilson Sons.
5. Portaria/recepção, em fluxo demonstrativo de check-in por QR Code.
6. Visitantes que precisam tirar dúvidas antes ou depois da solicitação.

==================================================
1. OBJETIVO DE NEGÓCIO
==================================================

Criar uma aplicação objetiva, eficiente, acessível, bonita e realista para organizar visitas em ambiente portuário, reduzindo:

- Agendamentos manuais.
- Retrabalho.
- Perda de dados.
- Falhas de comunicação.
- Ausência de rastreabilidade.
- Falta de controle sobre datas e horários disponíveis.
- Falhas no controle de visitantes individuais ou grupos.
- Riscos por falta de orientação prévia sobre segurança, EPI, EPC, vestimenta e conduta.
- Dificuldade de comunicação entre visitante/responsável e equipe admin.
- Dificuldade de conferência pela portaria/recepção.

O sistema deve permitir:

1. Admin cadastrar datas e horários disponíveis para visita.
2. Visitante selecionar apenas datas e horários liberados pelo admin.
3. Visitante escolher tipo de visita.
4. Visitante indicar se a visita é individual ou em grupo.
5. Formulário mudar conforme individual/grupo.
6. Visitante ou responsável informar WhatsApp.
7. Admin acessar rapidamente o WhatsApp do visitante/responsável.
8. Visitante preencher orientações de segurança.
9. Visitante responder quiz de segurança.
10. Visitante enviar solicitação.
11. Apps Script registrar no Google Sheets.
12. Apps Script disparar e-mails automáticos.
13. Admin aprovar, reprovar, remarcar, reagendar, cancelar ou concluir visita.
14. Apps Script atualizar planilha e disparar novos e-mails.
15. Sistema gerar QR Code para visita aprovada.
16. Portaria/recepção consultar QR Code para check-in.
17. Visitante enviar dúvidas.
18. Admin gerenciar dúvidas.
19. Apps Script registrar dúvidas e disparar e-mails relacionados.
20. Aplicação ser publicada em produção.
21. Aplicação estar disponível em subdomínio do domínio artacho.dev.

==================================================
2. DEPLOY E DOMÍNIO
==================================================

A aplicação precisa ser entregue com link público de produção.

Usar preferencialmente Lovable para deploy.

Subdomínio desejado:

visitas.artacho.dev

Caso o Lovable gere primeiro uma URL própria, por exemplo:

https://nome-do-projeto.lovable.app

Preparar a aplicação para depois configurar o subdomínio:

visitas.artacho.dev

Criar documentação DEPLOY.md explicando:

1. Como publicar pelo Lovable.
2. Como configurar subdomínio.
3. Como configurar DNS na Cloudflare.
4. Como validar HTTPS.
5. Como testar a aplicação pública.
6. Como configurar a URL do Apps Script em produção.
7. Como atualizar a URL do Apps Script no frontend.

Não considerar o projeto pronto se estiver apenas em localhost.
Não considerar o projeto pronto se a URL do Apps Script estiver como placeholder.

==================================================
3. STACK E MCPs
==================================================

Ambiente principal de desenvolvimento:

- Cursor, VS Code ou Antigravity IDE.

MCPs recomendados:

1. Lovable MCP:
   - Criar aplicação inicial.
   - Refinar UI/UX.
   - Preparar deploy.

2. Serena MCP:
   - Navegar por símbolos.
   - Refatorar componentes.
   - Encontrar funções e referências.
   - Manter memória do projeto.
   - Entender impactos antes de alterar código.

3. Filesystem MCP:
   - Editar arquivos locais.
   - Criar documentação.
   - Organizar estrutura do projeto.

4. Playwright MCP:
   - Testar fluxo real em navegador.
   - Testar versão publicada em produção.
   - Testar acessibilidade básica, teclado, mensagens, responsividade e fluxos críticos.

5. GitHub MCP:
   - Versionar código e documentação.
   - Criar commits.
   - Apoiar entrega e rastreabilidade.

6. Google Sheets/Drive MCP, se disponível:
   - Apoiar criação/validação da planilha.
   - Conferir estrutura das abas.

7. Browser/Web MCP, se disponível:
   - Validar links publicados.
   - Validar subdomínio.
   - Validar página pública.

Não usar Supabase neste MVP.
Não usar backend próprio complexo.
Não usar autenticação obrigatória.
Não usar APIs pagas.

Banco central:

Google Sheets.

Backend de automação:

Google Apps Script publicado como Web App.

Frontend:

Aplicação gerada/refinada pelo Lovable.

==================================================
4. NAVEGAÇÃO DA APLICAÇÃO
==================================================

A aplicação deve ter header/nav com os seguintes itens:

1. Início
2. Solicitar visita
3. Regras de segurança
4. Dúvidas
5. Consultar solicitação
6. Admin
7. Check-in

Não haverá tela de login.

Motivo:
A aplicação precisa ser acessível por completo para avaliação acadêmica.

Mas deixar aviso na área admin:

"Área administrativa demonstrativa liberada para avaliação acadêmica. Em produção real, este painel exigiria autenticação, controle de perfis e trilha de auditoria."

No mobile:

- Usar menu hambúrguer acessível.
- Botão com aria-label="Abrir menu de navegação".
- Estado aberto/fechado anunciado corretamente.
- Foco visível.
- Links grandes e fáceis de tocar.
- Fechar menu com Escape.

==================================================
5. ROTAS OU PÁGINAS
==================================================

Criar as seguintes páginas/rotas:

1. /
   Página inicial.

2. /solicitar-visita
   Wizard público para solicitação de visita.

3. /seguranca
   Regras de segurança, EPI, EPC, vestimenta, vídeo e orientações.

4. /duvidas
   Tela para visitantes enviarem dúvidas à equipe admin.

5. /consultar
   Consulta pública por ID da solicitação + e-mail ou WhatsApp.

6. /admin
   Painel administrativo demonstrativo.

7. /admin/agenda
   CRUD de datas e horários disponíveis.

8. /admin/hosts
   CRUD de hosts/acompanhantes.

9. /admin/solicitacoes
   Gestão de solicitações.

10. /admin/solicitacoes/:id
    Detalhe da solicitação.

11. /admin/duvidas
    Gestão das dúvidas dos visitantes.

12. /checkin
    Tela para portaria/recepção consultar QR Code ou ID.

13. /confirmacao
    Tela de confirmação pós-envio.

Se o Lovable preferir SPA com seções, manter comportamento equivalente.

==================================================
6. UI/UX PREMIUM E IDENTIDADE VISUAL
==================================================

A aplicação deve ter aparência premium, institucional, moderna e profissional.

Não usar emojis em nenhuma parte da interface.

Usar apenas ícones SVG profissionais, preferencialmente line icons ou filled icons consistentes, relacionados a:

- Navio
- Porto
- Calendário
- Documento
- Escudo
- Capacete de segurança
- Colete
- Checklist
- Usuário
- Grupo
- QR Code
- WhatsApp
- E-mail
- Portaria
- Localização
- Ajuda

Não misturar estilos de ícones.

A interface deve remeter a uma empresa marítima/portuária profissional, com elementos visuais sutis:

- Linhas curvas inspiradas em ondas.
- Divisores suaves com formas marítimas.
- Footer com ondas assíncronas em SVG.
- Detalhes discretos que remetam a navegação, logística, cais, terminal e mar.
- Cards com bordas suaves e hierarquia clara.
- Dashboard limpo, com foco operacional.
- Não usar estética infantil, colorida demais ou informal.
- Não usar imagens genéricas exageradas.
- Não poluir a tela.

Paleta sugerida:

- Azul-marinho profundo como cor primária.
- Azul petróleo ou azul oceano como cor secundária.
- Branco para áreas de conteúdo.
- Cinza claro para fundos.
- Cinza escuro para textos.
- Amarelo ou âmbar de segurança para alertas.
- Verde para sucesso.
- Vermelho apenas para erros críticos.

A paleta deve respeitar contraste acessível.

==================================================
7. USO DA MARCA WILSON SONS
==================================================

Usar a logo oficial da Wilson Sons apenas como referência visual/institucional do cenário acadêmico.

Se a logo for utilizada:

1. Usar versão nítida, sem distorção.
2. Não alterar proporção.
3. Não aplicar efeitos exagerados.
4. Não usar como se o sistema fosse oficial.
5. Adicionar aviso visível:
   "Este sistema é uma simulação acadêmica e não representa um canal oficial da Wilson Sons."

Se não for possível usar a logo com segurança, criar uma área textual institucional com o nome:

"Wilson Sons — Gestão de Visitas"

Não criar logotipo falso que possa confundir o usuário com canal oficial.

==================================================
8. ACESSIBILIDADE OBRIGATÓRIA
==================================================

A aplicação deve seguir boas práticas de acessibilidade baseadas em WCAG 2.2 nível AA, com foco especial em:

1. Pessoas cegas que usam leitores de tela.
2. Pessoas com baixa visão.
3. Pessoas míopes.
4. Pessoas com daltonismo.
5. Pessoas com dificuldade motora.
6. Pessoas idosas.
7. Usuários em dispositivos móveis.

Implementar:

A. Estrutura semântica

- Usar HTML semântico.
- Usar landmarks: header, nav, main, section, article quando aplicável, aside quando aplicável e footer.
- Cada página deve ter apenas um h1 principal.
- Usar hierarquia correta de headings: h1, h2, h3.
- Botões devem ser botões reais, não divs clicáveis.
- Links devem ser links reais quando houver navegação.
- Campos de formulário devem ter label associado.
- Não depender apenas de placeholder como rótulo.

B. Leitores de tela

- Todos os SVGs decorativos devem usar aria-hidden="true".
- SVGs informativos devem ter title ou aria-label.
- Botões de ação devem ter nomes acessíveis.
- Mensagens de erro devem estar associadas ao campo.
- Usar aria-live="polite" para mensagens de sucesso, erro e status de envio.
- Usar aria-describedby para instruções de campos.
- Modal, se existir, deve controlar foco corretamente.
- O wizard deve informar etapa atual para leitor de tela.
- QR Code deve ter texto alternativo descrevendo sua finalidade.

C. Navegação por teclado

- Todos os elementos interativos devem ser acessíveis por teclado.
- Ordem de foco deve ser lógica.
- Foco visível deve ser claro e bonito.
- Não remover outline sem substituir por foco acessível.
- Menus, dropdowns e tabs devem funcionar com teclado.
- Escape deve fechar modal ou menu mobile.
- Não pode haver armadilha de teclado.

D. Contraste e baixa visão

- Texto normal deve ter contraste adequado para WCAG AA.
- Textos pequenos devem ser evitados.
- Fonte mínima recomendada: 16px para texto comum.
- Instruções críticas de segurança devem ter fonte maior ou destaque claro.
- Permitir zoom do navegador até 200% sem quebrar layout.
- Não usar texto sobre imagem sem camada de contraste.
- Não comunicar status apenas por cor.
- Status deve usar cor + texto + ícone SVG.

E. Miopia e legibilidade

- Usar fonte limpa e altamente legível.
- Evitar blocos longos de texto.
- Usar espaçamento generoso.
- Usar altura de linha confortável.
- Botões grandes e fáceis de clicar.
- Inputs com altura confortável.
- Labels visíveis.
- Separar etapas do formulário para reduzir carga visual.
- Criar modo de leitura confortável para regras de segurança.

F. Tamanho de toque

- Botões e campos devem ter área clicável confortável.
- Em mobile, botões principais devem ser largos.
- Evitar links pequenos próximos entre si.
- Botões de avançar/voltar do wizard devem ser fixos ou fáceis de encontrar.

G. Animações

- Animações devem ser sutis.
- Não usar animações piscantes.
- Não usar efeitos que prejudiquem leitura.
- Respeitar prefers-reduced-motion.
- Ondas do footer devem ser decorativas e não atrapalhar leitura.

H. Formulários acessíveis

- Cada erro deve explicar como corrigir.
- Campos obrigatórios devem ser indicados visualmente e textualmente.
- Exemplo: "Campo obrigatório: informe seu e-mail."
- Para e-mail inválido: "Informe um e-mail válido, por exemplo nome@empresa.com."
- Para data inválida: "A data da visita deve ser futura."
- Para quiz reprovado: "Você precisa acertar pelo menos 4 de 5 perguntas para enviar a solicitação."

I. Conteúdo compreensível

- Linguagem clara.
- Frases curtas.
- Evitar jargões técnicos sem explicação.
- Explicar EPI e EPC em linguagem simples.
- Explicar que o envio não garante aprovação.

J. Testes obrigatórios de acessibilidade

Testar:

- Navegação só pelo teclado.
- Leitura por leitor de tela, se possível.
- Contraste.
- Zoom 200%.
- Mobile.
- Estados de erro.
- Estados de sucesso.
- Formulário em etapas.
- Botão de WhatsApp.
- QR Code e texto alternativo.
- Página de dúvidas.
- Painel admin.

Criar checklist ACCESSIBILITY_QA.md.

Regra fixa:

Nunca sacrificar acessibilidade para obter estética visual. A interface deve ser bonita, mas sempre navegável por teclado, legível em zoom, compreensível por leitor de tela e clara para usuários com baixa visão.

==================================================
9. FOOTER PREMIUM COM ONDAS ASSÍNCRONAS
==================================================

Criar footer institucional com:

1. Texto obrigatório:
   "Projeto desenvolvido para fins educativos na KODIE Academy"

2. Aviso:
   "Solução acadêmica. Não representa um canal oficial da Wilson Sons."

3. Links internos:
   - Início
   - Solicitar visita
   - Regras de segurança
   - Dúvidas
   - Consultar solicitação
   - Admin
   - Check-in

4. Elemento visual em SVG:
   - Ondas assíncronas discretas.
   - Azul-marinho e azul oceano.
   - Decorativo.
   - aria-hidden="true".
   - Não pode prejudicar contraste.
   - Não pode cobrir textos.

O footer deve parecer premium e corporativo, não lúdico.

==================================================
10. RESPONSIVIDADE INTELIGENTE
==================================================

A UI deve ser responsiva de forma inteligente, não apenas “encolhida”.

Desktop:

- Header completo.
- Dashboard com tabela, filtros e cards.
- Wizard em layout horizontal ou com sidebar de progresso.
- Admin com tabelas amplas.

Tablet:

- Menu compacto.
- Cards em duas colunas.
- Wizard com etapas empilhadas.
- Tabelas convertidas em cards quando necessário.

Mobile:

- Menu hambúrguer.
- Formulário em tela cheia por etapa.
- Botões fixos no rodapé do formulário: Voltar / Avançar.
- Cards administrativos em vez de tabelas largas.
- Links de WhatsApp em botão grande.
- QR Code centralizado.
- Check-in otimizado para uso na portaria.

==================================================
11. PERFIS DE USO
==================================================

Embora não haja login, o sistema deve representar estes perfis:

1. Visitante individual:
   - Agenda visita para si.

2. Responsável por grupo:
   - Agenda visita técnica, acadêmica, institucional ou corporativa.
   - Informa quantidade de visitantes.
   - Informa dados do responsável.
   - Informa lista dos participantes, se aplicável.

3. Admin:
   - Configura datas e horários disponíveis.
   - Configura capacidade.
   - Configura hosts.
   - Analisa solicitações.
   - Aprova, reprova, remarca, reagenda, cancela e conclui visitas.
   - Acessa WhatsApp do responsável.
   - Visualiza status dos e-mails.
   - Visualiza QR Code da visita aprovada.
   - Gerencia dúvidas dos visitantes.

4. Host:
   - Pessoa responsável por acompanhar visitante ou grupo.
   - Recebe e-mail de notificação.
   - Pode ser selecionado pelo admin ou pelo visitante conforme disponibilidade.

5. Portaria/recepção:
   - Consulta QR Code ou ID.
   - Confirma check-in.
   - Registra horário de entrada.
   - Registra horário de saída.
   - Visualiza status da visita.

==================================================
12. FUNCIONALIDADES DO VISITANTE
==================================================

O visitante deve conseguir:

1. Ver regras de segurança antes de solicitar.
2. Iniciar solicitação de visita.
3. Selecionar tipo de visita:
   - Técnica
   - Acadêmica
   - Institucional
   - Comercial
   - Fornecedor
   - Manutenção
   - Reunião administrativa
   - Auditoria
   - Treinamento
   - Outro

4. Selecionar modalidade:
   - Individual
   - Grupo

5. Selecionar unidade/local:
   - Terminal portuário
   - Estaleiro
   - Centro logístico
   - Área administrativa
   - Área operacional
   - Área de apoio
   - Área de embarcação
   - Outro

6. Selecionar área pretendida:
   - Recepção / Administrativo
   - Sala de reunião
   - Pátio operacional
   - Oficina / Manutenção
   - Armazém / Logística
   - Área de embarcação
   - Área de segurança restrita
   - Outro

7. Selecionar apenas datas e horários disponíveis cadastrados pelo admin.

8. Visualizar capacidade do horário:
   - Vagas disponíveis.
   - Capacidade total.
   - Tipo permitido: individual, grupo ou ambos.

9. Informar dados pessoais ou dados do responsável do grupo.

10. Informar WhatsApp.

11. Aceitar regras de segurança.

12. Assistir vídeo ou confirmar visualização.

13. Responder quiz.

14. Enviar solicitação.

15. Receber feedback visual na tela:
   - Solicitação registrada.
   - E-mail enviado ao visitante.
   - E-mail enviado ao host.
   - Status atual.

16. Consultar solicitação por ID.

17. Solicitar reagendamento, se permitido.

18. Enviar dúvida para a equipe admin.

==================================================
13. FORMULÁRIO INDIVIDUAL
==================================================

Se modalidade = Individual, exibir formulário com:

Dados do visitante:

- Nome completo
- Documento de identificação
- Telefone
- WhatsApp
- E-mail
- Empresa/instituição
- Cargo/função
- Necessidade especial ou observação de acessibilidade
- Campo opcional: possui alguma necessidade de apoio durante a visita? Não coletar detalhes médicos sensíveis desnecessários.

Dados da visita:

- Tipo de visita
- Unidade/local
- Área pretendida
- Motivo da visita
- Data disponível
- Horário disponível
- Host/acompanhante
- Departamento do host
- Observações

Segurança:

- Aceite de vestimenta
- Aceite de EPI
- Aceite de EPC
- Aceite de conduta
- Confirmação de vídeo
- Quiz
- Consentimento de tratamento de dados

==================================================
14. FORMULÁRIO DE GRUPO
==================================================

Se modalidade = Grupo, exibir formulário específico.

Dados do responsável:

- Nome completo do responsável
- Documento do responsável
- Cargo/função
- Instituição/empresa
- E-mail
- Telefone
- WhatsApp
- Tipo de grupo:
  - Turma acadêmica
  - Equipe técnica
  - Fornecedor
  - Cliente
  - Visitantes institucionais
  - Outro

Dados do grupo:

- Nome da instituição/empresa
- Quantidade total de visitantes
- Faixa de idade predominante, se acadêmico
- Curso/área, se visita acadêmica
- Lista de participantes:
  - Nome completo
  - Documento, opcional no MVP
  - E-mail, opcional
  - Telefone, opcional
- Permitir adicionar/remover participante em tela.
- Validar que quantidade de participantes não exceda a capacidade do slot selecionado.

Dados da visita:

- Tipo de visita
- Unidade/local
- Área pretendida
- Motivo da visita
- Data disponível
- Horário disponível
- Host/acompanhante
- Departamento do host
- Observações

Segurança:

- Responsável declara que repassará as orientações de segurança ao grupo.
- Responsável confirma ciência sobre vestimenta.
- Responsável confirma ciência sobre EPI.
- Responsável confirma ciência sobre EPC.
- Responsável confirma vídeo.
- Responsável responde quiz.
- Responsável aceita tratamento de dados para fins de agendamento.

==================================================
15. ADMIN — FUNCIONALIDADES CRUD
==================================================

Criar painel admin com funcionalidades CRUD.

Como não haverá login, deixar tudo acessível, mas com aviso acadêmico.

O admin deve conseguir gerenciar:

A. Datas e horários disponíveis

Campos do slot:

- ID do slot
- Unidade/local
- Área
- Data
- Hora inicial
- Hora final
- Capacidade total
- Vagas ocupadas
- Vagas disponíveis
- Modalidade permitida:
  - Individual
  - Grupo
  - Ambos
- Tipo de visita permitido:
  - Técnica
  - Acadêmica
  - Institucional
  - Comercial
  - Fornecedor
  - Manutenção
  - Reunião administrativa
  - Auditoria
  - Treinamento
  - Outro
- Host padrão
- Status do slot:
  - Disponível
  - Bloqueado
  - Lotado
  - Cancelado
- Observações internas

Ações:

- Criar slot
- Editar slot
- Excluir slot
- Bloquear slot
- Reativar slot

B. Hosts/acompanhantes

Campos:

- ID do host
- Nome
- E-mail
- Departamento
- Unidade
- Telefone
- WhatsApp
- Áreas autorizadas
- Status:
  - Ativo
  - Inativo
- Observações

Ações:

- Criar host
- Editar host
- Inativar host
- Reativar host
- Excluir host, se não houver vínculo com visita

C. Solicitações de visita

Visualizar tabela/card com:

- ID da solicitação
- Data de criação
- Modalidade
- Visitante/responsável
- Empresa/instituição
- WhatsApp
- E-mail
- Unidade
- Área
- Data/hora solicitada
- Quantidade de visitantes
- Host
- Status
- Resultado do quiz
- E-mail visitante enviado?
- E-mail host enviado?
- QR Code gerado?

Filtros:

- Status
- Unidade
- Data
- Host
- Modalidade
- Tipo de visita
- Quiz aprovado/reprovado

Ações:

- Ver detalhes
- Aprovar
- Reprovar
- Solicitar ajuste
- Remarcar
- Reagendar
- Cancelar
- Concluir
- Registrar check-in
- Registrar check-out
- Abrir WhatsApp
- Reenviar e-mails
- Copiar link/ID da solicitação
- Visualizar QR Code

D. Dúvidas dos visitantes

Visualizar e gerenciar dúvidas enviadas pela rota /duvidas.

Ações:

- Ver detalhes
- Marcar como em análise
- Responder por e-mail
- Abrir WhatsApp
- Copiar mensagem sugerida
- Marcar como respondida
- Encerrar

==================================================
16. STATUS DO FLUXO
==================================================

Usar os seguintes status:

1. Rascunho
2. Recebida
3. Pendente de validação de segurança
4. Pendente de aprovação do host
5. Aguardando ajuste do visitante
6. Reagendamento solicitado
7. Remarcada
8. Aprovada
9. Reprovada
10. Cancelada
11. Check-in realizado
12. Check-out realizado
13. Concluída
14. Expirada
15. Bloqueada por segurança

==================================================
17. FLUXOS DE PRODUÇÃO A IMPLEMENTAR
==================================================

Fluxo 1 — Admin cria disponibilidade

1. Admin acessa /admin/agenda.
2. Cadastra data, horário, unidade, área, capacidade e tipo permitido.
3. Apps Script salva na aba AvailabilitySlots.
4. Visitante passa a enxergar somente slots disponíveis.

Fluxo 2 — Visitante individual solicita visita

1. Visitante acessa /solicitar-visita.
2. Escolhe modalidade individual.
3. Seleciona data/horário disponível.
4. Preenche dados.
5. Aceita segurança.
6. Responde quiz.
7. Envia.
8. Apps Script grava em VisitRequests.
9. Apps Script atualiza vagas ocupadas do slot.
10. Apps Script envia e-mail ao visitante.
11. Apps Script envia e-mail ao host.
12. Tela mostra status visual de envio.

Fluxo 3 — Responsável solicita visita em grupo

1. Responsável escolhe modalidade grupo.
2. Informa quantidade de visitantes.
3. Sistema mostra apenas slots com capacidade suficiente.
4. Responsável informa dados do grupo.
5. Responsável adiciona participantes, se aplicável.
6. Responsável aceita regras pelo grupo.
7. Responde quiz.
8. Apps Script grava solicitação e participantes.
9. Apps Script atualiza capacidade do slot.
10. Apps Script envia e-mails.

Fluxo 4 — Admin aprova visita

1. Admin acessa solicitação.
2. Confere dados.
3. Aprova.
4. Apps Script altera status para Aprovada.
5. Apps Script gera token/QR Code da visita.
6. Apps Script envia e-mail de aprovação ao visitante/responsável.
7. Apps Script envia e-mail de confirmação ao host.
8. Tela admin mostra e-mail enviado com sucesso.

Fluxo 5 — Admin reprova visita

1. Admin informa motivo resumido.
2. Apps Script altera status para Reprovada.
3. Apps Script libera vagas do slot.
4. Apps Script envia e-mail educado ao visitante/responsável.
5. Log é registrado.

Fluxo 6 — Admin remarca visita

1. Admin escolhe nova data/horário disponível.
2. Apps Script libera slot antigo.
3. Apps Script reserva novo slot.
4. Apps Script altera status para Remarcada.
5. Apps Script envia e-mail ao visitante/responsável e ao host.

Fluxo 7 — Visitante solicita reagendamento

1. Visitante consulta solicitação.
2. Clica em solicitar reagendamento.
3. Escolhe novo slot disponível.
4. Apps Script marca status Reagendamento solicitado.
5. Admin analisa e confirma ou recusa.

Fluxo 8 — Cancelamento

1. Admin cancela visita.
2. Apps Script libera vagas.
3. Apps Script envia e-mail de cancelamento.
4. Registro permanece no histórico.

Fluxo 9 — Check-in por QR Code

1. Visita aprovada gera QR Code contendo:
   - ID da solicitação
   - token de validação
   - URL de check-in
2. Portaria acessa /checkin.
3. Informa ID ou lê QR Code, se possível.
4. Sistema consulta Apps Script.
5. Se status = Aprovada ou Remarcada:
   - Permite check-in.
   - Registra data/hora de entrada.
   - Altera status para Check-in realizado.
6. Se status inválido:
   - Mostra bloqueio.
7. No fim da visita:
   - Portaria registra check-out.
   - Status vira Check-out realizado ou Concluída.

Fluxo 10 — WhatsApp operacional

1. Admin vê botão "Abrir WhatsApp".
2. Botão gera link:
   https://wa.me/55NUMERO
3. A mensagem pré-preenchida deve ser:
   "Olá, [Nome]. Aqui é a equipe responsável pelo agendamento de visitas. Precisamos tratar alguns detalhes da sua solicitação [ID]."
4. Não substituir e-mail por WhatsApp.
5. WhatsApp é canal auxiliar.

Fluxo 11 — Dúvidas do visitante

1. Visitante acessa /duvidas.
2. Preenche formulário.
3. Apps Script salva na aba VisitorQuestions.
4. Apps Script envia confirmação ao visitante.
5. Apps Script notifica admin.
6. Admin acessa /admin/duvidas.
7. Admin responde por e-mail ou WhatsApp.
8. Status da dúvida é atualizado.

==================================================
18. TELA DE DÚVIDAS DOS VISITANTES
==================================================

Adicionar item no menu principal:

Dúvidas

Criar rota:

/duvidas

Objetivo:
Permitir que visitantes tirem dúvidas com a equipe admin/responsável antes ou depois da solicitação.

A tela deve conter:

1. Título:
   "Dúvidas sobre visitas"

2. Subtítulo:
   "Envie sua dúvida para a equipe responsável pelo agendamento de visitas."

3. Aviso:
   "Este canal faz parte de uma simulação acadêmica e não representa atendimento oficial da Wilson Sons."

4. FAQ acessível em accordion:
   - Quais documentos preciso levar?
   - Posso visitar usando bermuda ou chinelo?
   - O uso de EPI é obrigatório?
   - Posso fotografar ou filmar?
   - Posso circular sem acompanhante?
   - Como funciona visita em grupo?
   - Como reagendar uma visita?
   - O que acontece se minha visita for reprovada?
   - Como recebo o QR Code?
   - O envio da solicitação garante minha entrada?

O accordion deve ser acessível:

- Funcionar por teclado.
- Usar aria-expanded.
- Usar aria-controls.
- Ter foco visível.

5. Formulário de dúvida:

Campos:

- Nome completo
- E-mail
- WhatsApp
- Tipo de pessoa:
  - Visitante individual
  - Responsável por grupo
  - Professor/coordenador
  - Fornecedor
  - Outro
- ID da solicitação, opcional
- Tema da dúvida:
  - Agendamento
  - Reagendamento
  - Documentos
  - Vestimenta
  - EPI/EPC
  - Visita em grupo
  - QR Code/check-in
  - Outro
- Mensagem

Validações:

- Nome obrigatório.
- E-mail válido obrigatório.
- WhatsApp obrigatório.
- Tema obrigatório.
- Mensagem obrigatória com mínimo de 20 caracteres.

6. Ao enviar:

Frontend deve chamar Apps Script com action:

createVisitorQuestion

Payload:

{
  "action": "createVisitorQuestion",
  "data": {
    "name": "",
    "email": "",
    "whatsapp": "",
    "personType": "",
    "requestId": "",
    "subject": "",
    "message": "",
    "createdAt": ""
  }
}

7. Apps Script deve:

- Salvar a dúvida na aba VisitorQuestions.
- Enviar e-mail de confirmação ao visitante.
- Enviar e-mail de notificação ao admin ou e-mail configurado em Settings.
- Retornar JSON de sucesso.

8. Tela de sucesso:

"Recebemos sua dúvida."

Texto:

"A equipe responsável poderá responder por e-mail ou WhatsApp, conforme a necessidade."

Exibir:

- Status do e-mail de confirmação.
- Protocolo da dúvida.

==================================================
19. ADMIN — GESTÃO DE DÚVIDAS
==================================================

Adicionar no menu admin:

Dúvidas dos visitantes

Criar rota:

/admin/duvidas

Funcionalidades:

1. Listar dúvidas recebidas.
2. Filtrar por:
   - Status
   - Tema
   - Data
   - ID da solicitação
3. Ver detalhes da dúvida.
4. Alterar status:
   - Nova
   - Em análise
   - Respondida
   - Encerrada
5. Registrar resposta interna.
6. Botão "Abrir WhatsApp".
7. Botão "Responder por e-mail", que pode gerar modelo de resposta.
8. Botão "Copiar mensagem sugerida".

Campos exibidos:

- ID da dúvida
- Data/hora
- Nome
- E-mail
- WhatsApp
- Tema
- ID da solicitação
- Mensagem
- Status
- Responsável pelo atendimento
- Resposta/observação
- Última atualização

Ações:

- Marcar como em análise.
- Marcar como respondida.
- Marcar como encerrada.
- Abrir WhatsApp.
- Enviar resposta por e-mail via Apps Script.

==================================================
20. AUTOMAÇÃO COM GOOGLE APPS SCRIPT
==================================================

O Apps Script deve funcionar como backend.

Criar endpoint único Web App com:

doGet(e)
doPost(e)

Usar parâmetro action no payload para rotear ações.

Actions necessárias:

1. listAvailabilitySlots
2. createAvailabilitySlot
3. updateAvailabilitySlot
4. deleteAvailabilitySlot
5. blockAvailabilitySlot
6. listHosts
7. createHost
8. updateHost
9. deleteHost
10. createVisitRequest
11. listVisitRequests
12. getVisitRequestById
13. updateVisitRequest
14. approveVisitRequest
15. rejectVisitRequest
16. rescheduleVisitRequest
17. requestReschedule
18. cancelVisitRequest
19. resendEmails
20. generateQrCode
21. validateCheckinToken
22. registerCheckin
23. registerCheckout
24. getDashboardMetrics
25. createVisitorQuestion
26. listVisitorQuestions
27. getVisitorQuestionById
28. updateVisitorQuestionStatus
29. answerVisitorQuestion
30. sendVisitorQuestionResponse

Toda resposta do Apps Script deve retornar JSON:

{
  "success": true,
  "message": "",
  "data": {},
  "emailStatus": {
    "visitorEmailSent": true,
    "hostEmailSent": true,
    "adminEmailSent": false
  },
  "logs": []
}

Em caso de erro:

{
  "success": false,
  "message": "Mensagem amigável para o usuário",
  "errorCode": "VALIDATION_ERROR",
  "logs": []
}

O código do Apps Script deve:

1. Criar cabeçalhos automaticamente.
2. Validar e-mail.
3. Validar WhatsApp.
4. Validar data futura.
5. Validar capacidade do slot.
6. Validar modalidade individual/grupo.
7. Validar quiz aprovado.
8. Validar aceites de segurança.
9. Atualizar capacidade do slot.
10. Liberar capacidade ao reprovar/cancelar/remarcar.
11. Gerar RequestID.
12. Gerar SlotID.
13. Gerar HostID.
14. Gerar QuestionID.
15. Gerar QR token.
16. Registrar logs.
17. Enviar e-mails HTML.
18. Retornar JSON amigável.
19. Ter try/catch.
20. Ser comentado em português.
21. Ser pronto para copiar e colar no Apps Script.

==================================================
21. ABAS DO GOOGLE SHEETS
==================================================

Criar ou documentar as seguintes abas:

1. VisitRequests
2. VisitParticipants
3. AvailabilitySlots
4. Hosts
5. EmailLogs
6. AuditLogs
7. Settings
8. Checkins
9. VisitorQuestions

==================================================
22. ESTRUTURA — VisitRequests
==================================================

Colunas:

A: RequestID
B: CreatedAt
C: UpdatedAt
D: Status
E: Modality
F: VisitType
G: Unit
H: Area
I: SlotID
J: DesiredDate
K: StartTime
L: EndTime
M: VisitorFullName
N: VisitorDocument
O: VisitorPhone
P: VisitorWhatsApp
Q: VisitorEmail
R: CompanyOrInstitution
S: Role
T: GroupName
U: GroupType
V: VisitorsCount
W: VisitReason
X: HostID
Y: HostName
Z: HostEmail
AA: HostDepartment
AB: ProperClothingAccepted
AC: EpiAccepted
AD: EpcAccepted
AE: ConductAccepted
AF: VideoWatched
AG: SafetyTermAccepted
AH: LgpdConsentAccepted
AI: QuizScore
AJ: QuizPercentage
AK: QuizResult
AL: VisitorEmailSent
AM: HostEmailSent
AN: ApprovalEmailSent
AO: RejectionEmailSent
AP: CancellationEmailSent
AQ: LastEmailSentAt
AR: AdminDecisionAt
AS: AdminDecisionBy
AT: AdminNotes
AU: VisitorNotes
AV: SafetyNotes
AW: QrToken
AX: QrCodeUrl
AY: CheckinAt
AZ: CheckoutAt
BA: WhatsAppLink
BB: DuplicateHash
BC: AutomationLog

==================================================
23. ESTRUTURA — VisitParticipants
==================================================

Colunas:

A: ParticipantID
B: RequestID
C: FullName
D: Document
E: Email
F: Phone
G: CreatedAt

==================================================
24. ESTRUTURA — AvailabilitySlots
==================================================

Colunas:

A: SlotID
B: CreatedAt
C: UpdatedAt
D: Status
E: Unit
F: Area
G: VisitTypeAllowed
H: ModalityAllowed
I: Date
J: StartTime
K: EndTime
L: CapacityTotal
M: CapacityUsed
N: CapacityAvailable
O: DefaultHostID
P: DefaultHostName
Q: Notes

==================================================
25. ESTRUTURA — Hosts
==================================================

Colunas:

A: HostID
B: CreatedAt
C: UpdatedAt
D: Status
E: Name
F: Email
G: Department
H: Unit
I: Phone
J: WhatsApp
K: AreasAuthorized
L: Notes

==================================================
26. ESTRUTURA — VisitorQuestions
==================================================

Colunas:

A: QuestionID
B: CreatedAt
C: UpdatedAt
D: Status
E: Name
F: Email
G: WhatsApp
H: WhatsAppLink
I: PersonType
J: RequestID
K: Subject
L: Message
M: AdminResponse
N: AssignedTo
O: ResponseSent
P: LastResponseAt
Q: AutomationLog

==================================================
27. ESTRUTURA — EmailLogs
==================================================

Colunas:

A: EmailLogID
B: CreatedAt
C: RequestID
D: EmailType
E: Recipient
F: Subject
G: Success
H: ErrorMessage

==================================================
28. ESTRUTURA — AuditLogs
==================================================

Colunas:

A: AuditID
B: CreatedAt
C: Actor
D: Action
E: EntityType
F: EntityID
G: PreviousStatus
H: NewStatus
I: Details

==================================================
29. ESTRUTURA — Checkins
==================================================

Colunas:

A: CheckinID
B: RequestID
C: QrToken
D: StatusBefore
E: StatusAfter
F: CheckinAt
G: CheckoutAt
H: RegisteredBy
I: Notes

==================================================
30. REGRAS DE CAPACIDADE
==================================================

Implementar regras:

1. Visitante só pode selecionar slots com Status = Disponível.
2. Slot bloqueado, cancelado ou lotado não aparece para visitante.
3. Se modalidade individual, consome 1 vaga.
4. Se modalidade grupo, consome VisitorsCount vagas.
5. Se VisitorsCount > CapacityAvailable, bloquear envio.
6. Ao criar solicitação válida, incrementar CapacityUsed.
7. Recalcular CapacityAvailable.
8. Ao reprovar ou cancelar, liberar vagas.
9. Ao remarcar, liberar vaga do slot antigo e reservar vaga do novo slot.
10. Se CapacityAvailable = 0, Status do slot vira Lotado.

==================================================
31. REGRAS DE SEGURANÇA, EPI E EPC
==================================================

Exibir e validar:

Itens proibidos:

- Regata.
- Shorts.
- Bermudas inadequadas.
- Chinelo.
- Sandália.
- Sapato aberto.
- Salto alto em área operacional.
- Roupas soltas que possam enroscar em equipamentos.
- Adornos soltos em áreas de risco.

EPIs possíveis:

- Capacete.
- Bota ou calçado de segurança.
- Colete refletivo.
- Óculos de proteção.
- Protetor auricular.
- Luvas.
- Outros conforme área visitada.

EPCs:

- Sinalização.
- Barreiras.
- Cones.
- Guarda-corpos.
- Faixas de isolamento.
- Alarmes.
- Rotas de fuga.
- Demarcações de segurança.

Condutas:

- Portar documento de identificação.
- Permanecer acompanhado.
- Respeitar sinalizações.
- Não acessar áreas restritas.
- Não circular desacompanhado.
- Não fotografar ou filmar sem autorização.
- Não tocar em máquinas, cargas, painéis, embarcações ou ferramentas.
- Comunicar situações de risco.

Quiz:

- 5 perguntas.
- Aprovar com pelo menos 4 acertos.
- Bloquear envio se reprovado.

Texto legal/educativo:

"As orientações de segurança deste MVP são simplificadas e educativas. Em um cenário real, as regras precisariam ser validadas pelas áreas de Segurança do Trabalho, Jurídico, Compliance, Operação e Segurança Patrimonial."

Não afirmar conformidade legal definitiva.
Não dizer que o sistema substitui integração oficial.
Não dizer que o sistema autoriza acesso automaticamente.

==================================================
32. QUIZ DE SEGURANÇA
==================================================

Implementar 5 perguntas.
Aprovar apenas com 4 ou 5 acertos.

Pergunta 1:
Qual opção representa uma vestimenta mais adequada para visita em área operacional?
A) Regata, shorts e chinelo.
B) Roupa compatível com ambiente operacional e calçado fechado.
C) Sandália aberta e bermuda.
D) Qualquer roupa, desde que a visita seja rápida.
Correta: B

Pergunta 2:
O visitante pode circular sozinho em uma área operacional portuária?
A) Sim, se já tiver visitado o local antes.
B) Sim, se estiver com pressa.
C) Não. Deve seguir as orientações e permanecer acompanhado por responsável autorizado.
D) Sim, desde que use o celular para se localizar.
Correta: C

Pergunta 3:
O que o visitante deve fazer ao encontrar uma área sinalizada ou isolada?
A) Ignorar se não houver ninguém olhando.
B) Entrar rapidamente.
C) Respeitar a sinalização e não ultrapassar barreiras ou áreas isoladas.
D) Fotografar e seguir adiante.
Correta: C

Pergunta 4:
É permitido fotografar ou filmar áreas operacionais sem autorização?
A) Sim, sempre.
B) Sim, apenas para redes sociais.
C) Não. Registros de imagem devem depender de autorização.
D) Sim, se não aparecerem pessoas.
Correta: C

Pergunta 5:
Para que servem EPIs em ambientes operacionais?
A) Apenas para identificação visual.
B) Para proteção individual contra riscos específicos da atividade ou ambiente.
C) Apenas para visitantes estrangeiros.
D) Para substituir todas as regras de segurança.
Correta: B

==================================================
33. QR CODE
==================================================

Implementar QR Code para visitas aprovadas.

Como MVP:

1. Gerar token simples e único.
2. Gerar URL:
   https://visitas.artacho.dev/checkin?requestId=REQ-XXXX&token=TOKEN
3. Gerar QR Code visual na tela usando biblioteca frontend, se disponível.
4. Salvar token no Google Sheets.
5. Enviar QR Code ou link no e-mail de aprovação.
6. Portaria valida ID + token via Apps Script.

Não usar QR Code para liberar acesso automaticamente.
O QR Code apenas facilita conferência pela portaria.

Mensagem de segurança:

"O QR Code não substitui a validação presencial, apresentação de documento e orientação da equipe responsável."

==================================================
34. WHATSAPP
==================================================

Registrar WhatsApp do visitante ou responsável.

Gerar link clicável no admin:

https://wa.me/55NUMERO

Criar função para normalizar telefone:

- Remover espaços.
- Remover parênteses.
- Remover hífen.
- Garantir DDI 55 quando for número brasileiro.

Mensagem sugerida:

"Olá, [Nome]. Aqui é a equipe responsável pelo agendamento de visitas. Precisamos tratar alguns detalhes da sua solicitação [RequestID]."

Exibir botão:

"Abrir WhatsApp"

WhatsApp é canal auxiliar.
E-mails continuam obrigatórios.

==================================================
35. E-MAILS AUTOMÁTICOS
==================================================

Implementar modelos HTML para:

1. Solicitação recebida — visitante/responsável.
2. Nova solicitação aguardando análise — host.
3. Visita aprovada — visitante/responsável.
4. Visita aprovada — host.
5. Visita reprovada — visitante/responsável.
6. Visita remarcada — visitante/responsável.
7. Visita remarcada — host.
8. Visita cancelada — visitante/responsável.
9. Check-in realizado — admin/host, opcional.
10. Reenvio de confirmação.
11. Dúvida recebida — visitante.
12. Nova dúvida recebida — admin.
13. Resposta da dúvida — visitante.

A interface deve exibir status visual:

- E-mail ao visitante enviado: Sim/Não.
- E-mail ao host enviado: Sim/Não.
- E-mail ao admin enviado: Sim/Não.
- Último envio.
- Erro de envio, se houver.

Todos os e-mails devem conter:

- Assunto claro.
- Corpo HTML simples e profissional.
- Aviso acadêmico.
- Rodapé obrigatório da KODIE Academy.
- Linguagem institucional e objetiva.

==================================================
36. ADMIN — UX
==================================================

Painel admin deve ter:

1. Cards de métricas:
   - Solicitações recebidas.
   - Pendentes de aprovação.
   - Aprovadas.
   - Reprovadas.
   - Remarcadas.
   - Check-ins realizados.
   - Slots disponíveis.
   - Slots lotados.
   - Dúvidas novas.
   - Dúvidas em análise.

2. Tabela ou cards de solicitações.

3. Ações rápidas:
   - Aprovar.
   - Reprovar.
   - Remarcar.
   - Cancelar.
   - Abrir WhatsApp.
   - Reenviar e-mail.
   - Ver QR Code.
   - Responder dúvida.

4. Área de agenda:
   - Calendário simples ou lista por data.
   - Criar disponibilidade.
   - Editar disponibilidade.
   - Bloquear horário.
   - Ver vagas ocupadas.

5. Área de hosts:
   - Cadastrar host.
   - Editar host.
   - Ativar/inativar.

6. Área de dúvidas:
   - Visualizar dúvidas.
   - Filtrar por status/tema.
   - Responder por e-mail.
   - Abrir WhatsApp.

==================================================
37. CONSULTA PÚBLICA
==================================================

Criar página /consultar.

Campos:

- ID da solicitação
- E-mail ou WhatsApp

Ao consultar:

- Mostrar status.
- Mostrar data/hora.
- Mostrar unidade.
- Mostrar host.
- Mostrar se está pendente/aprovada/reprovada/remarcada/cancelada.
- Se aprovada, mostrar QR Code/link de check-in.
- Permitir solicitar reagendamento se status permitir.

Não mostrar dados sensíveis de outros visitantes.
Não mostrar lista completa de participantes publicamente.

==================================================
38. CHECK-IN / PORTARIA
==================================================

Criar página /checkin.

Campos:

- RequestID
- Token

Ou aceitar query params:

/checkin?requestId=REQ-XXXX&token=TOKEN

Mostrar:

- Status da solicitação.
- Nome do visitante/responsável.
- Modalidade.
- Quantidade de visitantes.
- Unidade.
- Área.
- Data/hora.
- Host.
- Regras resumidas.

Ações:

- Registrar check-in.
- Registrar check-out.

Bloqueios:

- Não permitir check-in se status não for Aprovada ou Remarcada.
- Não permitir check-in com token inválido.
- Não permitir check-in de visita cancelada/reprovada/expirada.

==================================================
39. CONTRATO FRONTEND ↔ APPS SCRIPT
==================================================

Criar arquivo:

src/config/integrations.ts

Com:

export const APPS_SCRIPT_WEB_APP_URL = "https://script.google.com/macros/s/COLE_AQUI_A_URL_DO_APPS_SCRIPT/exec";

Criar serviço:

src/services/appsScriptApi.ts

Com funções:

- listAvailabilitySlots()
- createAvailabilitySlot(data)
- updateAvailabilitySlot(id, data)
- deleteAvailabilitySlot(id)
- listHosts()
- createHost(data)
- updateHost(id, data)
- createVisitRequest(data)
- listVisitRequests(filters)
- getVisitRequestById(id)
- approveVisitRequest(id, data)
- rejectVisitRequest(id, data)
- rescheduleVisitRequest(id, data)
- requestReschedule(id, data)
- cancelVisitRequest(id, data)
- registerCheckin(requestId, token)
- registerCheckout(requestId, token)
- getDashboardMetrics()
- createVisitorQuestion(data)
- listVisitorQuestions(filters)
- getVisitorQuestionById(id)
- updateVisitorQuestionStatus(id, data)
- answerVisitorQuestion(id, data)
- sendVisitorQuestionResponse(id, data)

Todas devem chamar Apps Script com action.

==================================================
40. DOCUMENTAÇÃO
==================================================

Criar ou atualizar:

1. README.md
2. DEPLOY.md
3. APPS_SCRIPT_BACKEND.md
4. ESTRUTURA_PLANILHA.md
5. PROMPTS_UTILIZADOS.md
6. CHECKLIST_QA.md
7. ACCESSIBILITY_QA.md
8. ARQUITETURA.md
9. FLUXOS_DE_NEGOCIO.md
10. SEGURANCA_E_LGPD.md
11. MCP_WORKFLOW.md
12. TESTES_PLAYWRIGHT.md

O README deve explicar:

- Objetivo.
- Stack.
- Perfis de uso.
- Fluxos.
- Como configurar Apps Script.
- Como configurar subdomínio.
- Como testar.
- Aviso acadêmico.

PROMPTS_UTILIZADOS.md deve conter:

- Prompt master.
- Prompt usado no Lovable.
- Prompt usado no Apps Script.
- Prompt usado para testes.
- Prompts de refinamento.

==================================================
41. TESTES COM PLAYWRIGHT MCP
==================================================

Usar Playwright MCP para testar preferencialmente a aplicação publicada em produção.

Testar:

1. Link público abre.
2. Header/nav aparece.
3. Footer obrigatório aparece.
4. Aviso acadêmico aparece.
5. Não existem emojis visíveis na interface.
6. Ícones são SVG e consistentes.
7. Formulário individual funciona.
8. Formulário de grupo funciona.
9. Campos obrigatórios bloqueiam avanço.
10. E-mail inválido é bloqueado.
11. WhatsApp inválido é bloqueado ou normalizado.
12. Data passada é bloqueada.
13. Visitante só vê slots disponíveis.
14. Grupo não consegue selecionar slot sem capacidade.
15. Checkboxes de segurança são obrigatórios.
16. Quiz reprova com menos de 4 acertos.
17. Quiz aprova com 4 ou 5 acertos.
18. Envio chama Apps Script.
19. Dados chegam ao Google Sheets.
20. E-mails são enviados.
21. Admin cria slot.
22. Admin edita slot.
23. Admin cria host.
24. Admin aprova visita.
25. QR Code aparece após aprovação.
26. Check-in valida ID/token.
27. Página /duvidas envia dúvida.
28. Admin visualiza dúvida.
29. Admin responde dúvida.
30. E-mail de dúvida é enviado.
31. Botão WhatsApp abre link correto.
32. Mobile funciona.
33. Navegação por teclado funciona.
34. Foco visível funciona.
35. Zoom 200% não quebra layout.
36. Mensagens de erro usam aria-live ou associação acessível.

Gerar relatório em CHECKLIST_QA.md e ACCESSIBILITY_QA.md.

==================================================
42. CRITÉRIOS DE PRONTO
==================================================

Só considerar pronto quando:

1. Link público de produção existir.
2. Subdomínio visitas.artacho.dev estiver previsto/documentado.
3. Landing page funcionar.
4. Nav tiver acesso visitante e admin.
5. Admin estiver acessível sem login para avaliação.
6. Admin permitir CRUD de slots.
7. Admin permitir CRUD de hosts.
8. Visitante visualizar apenas horários disponíveis.
9. Formulário mudar entre individual/grupo.
10. WhatsApp for registrado.
11. Botão de WhatsApp funcionar no admin.
12. Apps Script gravar dados na planilha.
13. Apps Script enviar e-mails.
14. Tela mostrar status visual de e-mails.
15. Admin aprovar/reprovar/remarcar/cancelar.
16. Fluxos atualizarem planilha.
17. QR Code ser gerado para visita aprovada.
18. Check-in validar ID/token.
19. Footer obrigatório existir em todas as páginas.
20. Aviso acadêmico existir.
21. Interface não usar emojis.
22. Ícones SVG consistentes.
23. Footer com ondas assíncronas em SVG existir.
24. Layout premium e corporativo existir.
25. Logo oficial ser usada com cautela e aviso acadêmico, ou substituída por identificação textual segura.
26. Acessibilidade WCAG 2.2 AA estar considerada.
27. Navegação por teclado testada.
28. Leitor de tela considerado.
29. Contraste validado.
30. Zoom 200% validado.
31. Página /duvidas implementada.
32. Admin conseguir visualizar dúvidas.
33. Apps Script salvar dúvidas na planilha.
34. Apps Script enviar e-mails de dúvidas.
35. Botão WhatsApp funcionar para dúvidas.
36. ACCESSIBILITY_QA.md criado.
37. Playwright testar produção.
38. Documentação estar completa.
39. Prompts usados estarem salvos.

==================================================
43. MODO DE EXECUÇÃO
==================================================

Trabalhe por etapas.

Primeiro:

1. Analise o projeto atual.
2. Identifique stack.
3. Liste arquivos relevantes.
4. Proponha plano de implementação.

Depois:

1. Implemente frontend.
2. Implemente integração Apps Script.
3. Gere APPS_SCRIPT_BACKEND.md com código completo.
4. Gere estrutura da planilha.
5. Implemente admin.
6. Implemente fluxos.
7. Implemente acessibilidade.
8. Implemente página de dúvidas.
9. Teste com Playwright.
10. Atualize documentação.
11. Prepare deploy.

Antes de alterar arquivos, apresente um plano curto.
Depois execute em etapas.
Informe sempre:

- O que foi feito.
- Arquivos alterados.
- O que falta.
- Próximo passo recomendado.

Não remova arquivos importantes sem autorização.
Não use Supabase.
Não implemente autenticação complexa.
Não use APIs pagas.
Não deixe a aplicação apenas em localhost.
Não deixe o Apps Script com URL placeholder em produção.
Não sacrifique acessibilidade por estética.
```

---

# Prompt complementar para gerar o backend Google Apps Script

Use este prompt depois que a estrutura visual estiver criada ou quando for gerar o arquivo `APPS_SCRIPT_BACKEND.md`.

```text
Crie o backend Google Apps Script completo para o Sistema de Gestão de Visitas — Wilson Sons.

O backend será publicado como Web App e usado por uma aplicação Lovable publicada em produção no subdomínio visitas.artacho.dev.

O sistema é acadêmico, desenvolvido para fins educativos na KODIE Academy, e não representa sistema oficial da Wilson Sons.

O Apps Script deve usar Google Sheets como banco central e implementar CRUD real para:

1. AvailabilitySlots
2. Hosts
3. VisitRequests
4. VisitParticipants
5. Checkins
6. EmailLogs
7. AuditLogs
8. VisitorQuestions
9. Settings

Criar doGet(e) e doPost(e).

Usar action para rotear operações:

- listAvailabilitySlots
- createAvailabilitySlot
- updateAvailabilitySlot
- deleteAvailabilitySlot
- blockAvailabilitySlot
- listHosts
- createHost
- updateHost
- deleteHost
- createVisitRequest
- listVisitRequests
- getVisitRequestById
- updateVisitRequest
- approveVisitRequest
- rejectVisitRequest
- rescheduleVisitRequest
- requestReschedule
- cancelVisitRequest
- resendEmails
- generateQrCode
- validateCheckinToken
- registerCheckin
- registerCheckout
- getDashboardMetrics
- createVisitorQuestion
- listVisitorQuestions
- getVisitorQuestionById
- updateVisitorQuestionStatus
- answerVisitorQuestion
- sendVisitorQuestionResponse

O código deve:

1. Criar cabeçalhos automaticamente.
2. Validar e-mail.
3. Validar WhatsApp.
4. Validar data futura.
5. Validar capacidade do slot.
6. Validar modalidade individual/grupo.
7. Validar quiz aprovado.
8. Validar aceites de segurança.
9. Atualizar capacidade do slot.
10. Liberar capacidade ao reprovar/cancelar/remarcar.
11. Gerar RequestID.
12. Gerar SlotID.
13. Gerar HostID.
14. Gerar QuestionID.
15. Gerar QR token.
16. Gerar link de QR Code ou URL de check-in.
17. Registrar logs.
18. Enviar e-mails HTML.
19. Retornar JSON amigável.
20. Ter try/catch.
21. Ser comentado em português.
22. Ser pronto para copiar e colar no Apps Script.

Também criar menu na planilha:

"Gestão de Visitas"

Com opções:

- Criar/atualizar cabeçalhos
- Enviar confirmações pendentes
- Reenviar e-mails da seleção
- Aprovar selecionadas
- Reprovar selecionadas
- Cancelar selecionadas
- Marcar check-in
- Marcar check-out
- Atualizar métricas
- Verificar inconsistências

Gere o código completo, instruções de instalação e instruções de publicação como Web App.
```

---

# Prompt complementar para testes com Playwright MCP

```text
Use Playwright MCP para testar a aplicação Sistema de Gestão de Visitas — Wilson Sons na URL pública de produção.

Teste os fluxos:

1. Abertura da página inicial.
2. Presença do aviso acadêmico.
3. Presença do footer obrigatório.
4. Navegação pelo menu.
5. Formulário individual.
6. Formulário de grupo.
7. Validação de campos obrigatórios.
8. Validação de e-mail.
9. Validação de WhatsApp.
10. Validação de data futura.
11. Seleção apenas de horários disponíveis.
12. Bloqueio por capacidade insuficiente.
13. Aceites de segurança.
14. Quiz de segurança aprovado e reprovado.
15. Envio para Apps Script.
16. Confirmação visual de e-mails.
17. Admin CRUD de slots.
18. Admin CRUD de hosts.
19. Admin aprovar/reprovar/remarcar/cancelar.
20. WhatsApp link no admin.
21. QR Code após aprovação.
22. Check-in por ID/token.
23. Página de dúvidas.
24. Admin gerenciar dúvidas.
25. Resposta de dúvida por e-mail.
26. Responsividade mobile.
27. Navegação por teclado.
28. Foco visível.
29. Zoom 200%.
30. Contraste e legibilidade.
31. Ausência de emojis.
32. Uso de ícones SVG.

Gere relatório com:

- Testes aprovados.
- Testes reprovados.
- Evidências.
- Bugs encontrados.
- Sugestões de correção.
- Prioridade de correção.
```

