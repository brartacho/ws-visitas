# Sistema de Gestão de Visitas - Wilson Sons

Portal para agendamento, acompanhamento, análise administrativa e controle de visitas.

## Objetivo

Organizar o fluxo de solicitação, orientação de segurança, análise administrativa, dúvidas, consulta pública e check-in de visitas portuárias.

## Stack

- React + Vite + TypeScript.
- UI responsiva com CSS próprio.
- Ícones SVG consistentes via `lucide-react`.
- Backend em Google Apps Script.
- Base operacional em Google Sheets.
- Deploy preferencial via Lovable ou outro host estático compatível.

## Perfis Representados

- Visitante individual.
- Responsável por grupo.
- Admin.
- Host ou acompanhante.
- Portaria/recepção.
- Visitantes com dúvidas.

## Rotas

- `/` início.
- `/solicitar-visita` wizard público.
- `/seguranca` regras de segurança.
- `/duvidas` envio de dúvidas.
- `/consultar` consulta pública por ID e contato.
- `/admin` painel administrativo.
- `/admin/agenda` gestão de slots.
- `/admin/hosts` gestão de hosts.
- `/admin/solicitacoes` gestão de solicitações.
- `/admin/solicitacoes/:id` detalhe.
- `/admin/duvidas` gestão de dúvidas.
- `/checkin` conferência por ID e token.
- `/confirmacao` pós-envio.

## Como Rodar

```bash
npm install
npm run dev
```

Build de produção:

```bash
npm run build
```

## Configuração Apps Script

Configure a variável de ambiente `VITE_APPS_SCRIPT_WEB_APP_URL` com a URL pública do Apps Script publicado como Web App.

O código do backend está em `apps-script/Codigo.gs`. Ele deve ser colado no Apps Script aberto a partir da própria planilha Google:

1. Abra a planilha Google.
2. Acesse Extensões > Apps Script.
3. Cole o conteúdo de `apps-script/Codigo.gs`.
4. Execute `setupHeaders` uma vez para criar as abas.
5. Execute `seedDemoData` para inserir slots e hosts iniciais, se desejar carregar dados de teste.
6. Execute uma função que use e-mail, por exemplo criando uma solicitação de teste, para autorizar o `MailApp`.
7. Publique como Web App com `Executar como: Eu` e `Quem tem acesso: Qualquer pessoa`.
8. Copie a URL `/exec` para `VITE_APPS_SCRIPT_WEB_APP_URL`.

A URL da planilha fica apenas no `SPREADSHEET_ID` dentro de `apps-script/Codigo.gs`. Não use a URL da planilha em `VITE_APPS_SCRIPT_WEB_APP_URL`.

Sem essa variável, o frontend mantém fallback local para leitura. Ações de gravação exigem Apps Script configurado.

Valide o endpoint antes de testar o formulário:

```bash
npm run verify:apps-script
```

Quando o comando acima retornar `OK`, valide uma gravação real:

```bash
npm run verify:apps-script:write
```

Se a cópia administrativa não for enviada, publique a versão atualizada do Apps Script e rode:

```bash
npm run verify:apps-script:repair
npm run verify:apps-script:write
```

O e-mail administrativo padrão é `br.artacho@gmail.com` e fica na chave `ADMIN_EMAIL` da aba `Settings`.

Se o teste retornar login do Google, `401 Unauthorized` ou HTML em vez de JSON, a implantação do Web App ainda não está pública para o formulário.
