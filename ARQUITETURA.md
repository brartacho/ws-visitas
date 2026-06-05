# Arquitetura

## Camadas

- `src/App.tsx`: composição da SPA, roteamento simples, estados demonstrativos e telas em React.
- `src/data.ts`: seeds de slots, hosts, solicitações, dúvidas e quiz.
- `src/types.ts`: contratos TypeScript do domínio.
- `src/utils.ts`: validações, capacidade, WhatsApp, token e formatação.
- `src/config/integrations.ts`: URL do Apps Script.
- `src/services/appsScriptApi.ts`: service layer baseada em `action`.
- `src/styles.css`: design system responsivo.

## Decisão de MVP

O app funciona localmente com dados demonstrativos para avaliação acadêmica. A camada `appsScriptApi` já contém o contrato para substituir ações locais por chamadas reais ao Apps Script.

## Integração Planejada

Frontend envia `POST` para o Apps Script com corpo:

```json
{
  "action": "createVisitRequest",
  "data": {}
}
```

O Apps Script retorna JSON amigável:

```json
{
  "ok": true,
  "data": {}
}
```

## Segurança

Sem login no MVP por exigência acadêmica. Em produção real, `/admin` exigiria autenticação, perfis, auditoria, controle de sessão e autorização por ação.
