# Fluxos de Negócio

## Disponibilidade

1. Admin cria slot com data, hora, unidade, área e capacidade.
2. Visitante visualiza apenas slots com status `Disponível`.
3. Grupo só seleciona slot com capacidade suficiente.
4. Ao enviar solicitação válida, a capacidade usada aumenta.
5. Slot vira `Lotado` quando não há vagas.

## Solicitação Individual

1. Visitante escolhe slot.
2. Informa dados e WhatsApp.
3. Confirma orientações.
4. Responde quiz.
5. Sistema registra solicitação como `Recebida`.

## Solicitação em Grupo

1. Responsável informa quantidade.
2. Sistema filtra slots por capacidade.
3. Responsável aceita regras pelo grupo.
4. Solicitação segue para análise administrativa.

## Aprovação

1. Admin aprova solicitação.
2. Sistema muda status para `Aprovada`.
3. Token de QR é gerado.
4. Visitante consegue consultar o link de check-in.

## Check-in

1. Portaria informa RequestID e token.
2. Sistema valida status e token.
3. Registra check-in.
4. Registra check-out ao fim da visita.

## Dúvidas

1. Visitante envia pergunta.
2. Admin filtra e muda status.
3. Admin pode abrir WhatsApp e registrar resposta.
