# Deploy

## Lovable

1. Use o projeto Lovable criado a partir do prompt mestre.
2. Valide se a primeira versão contém as rotas e avisos acadêmicos.
3. Publique pelo painel do Lovable.
4. Registre a URL inicial, por exemplo `https://nome-do-projeto.lovable.app`.
5. Configure a variável `VITE_APPS_SCRIPT_WEB_APP_URL` quando a URL do Apps Script estiver pronta.

Projeto Lovable iniciado nesta sessão:

- ID: `27bcd774-0b64-46e7-b4d1-a3faca4a6dc0`
- URL de edição/status: `https://lovable.dev/projects/27bcd774-0b64-46e7-b4d1-a3faca4a6dc0`
- Status consultado: `ready`
- Screenshot de preview: `https://screenshot2.lovable.dev/57dd4dcb-889f-4b76-a6b1-435f3a90bc39/id-preview-03c3a6c2--27bcd774-0b64-46e7-b4d1-a3faca4a6dc0.lovable.app-1780673876341.png`

## Subdomínio

Subdomínio desejado:

```text
visitas.artacho.dev
```

## Cloudflare

1. Acesse a zona DNS de `artacho.dev`.
2. Crie um registro `CNAME` para `visitas`.
3. Aponte para o host fornecido pelo Lovable.
4. Ative proxy somente se o Lovable confirmar compatibilidade.
5. Aguarde propagação.

## HTTPS

1. Abra `https://visitas.artacho.dev`.
2. Verifique certificado válido.
3. Confirme ausência de mixed content.
4. Teste navegação direta em rotas internas.

## Apps Script em Produção

1. Publique o Apps Script como Web App.
2. Permissão de execução: conta proprietária.
3. Acesso: usuários com link, conforme escopo acadêmico.
4. Copie a URL `/exec`.
5. Configure `VITE_APPS_SCRIPT_WEB_APP_URL`.
6. Rode build e redeploy.

Não considerar pronto com URL placeholder do Apps Script.
