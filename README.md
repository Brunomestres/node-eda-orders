# Microservicos EDA - Order Service

Projeto de estudo de arquitetura orientada a eventos com Node.js, NestJS e RabbitMQ.

Este repositorio contem um servico de pedidos (`order-service`) responsavel por receber requisicoes HTTP e publicar eventos no RabbitMQ quando um pedido e criado.

## Stack

- Node.js
- NestJS
- TypeScript
- RabbitMQ
- Docker Compose
- class-validator
- class-transformer

## Estrutura

```text
.
|-- docker-compose.yaml
|-- README.md
`-- order-service
    |-- .env.example
    |-- package.json
    `-- src
        |-- app.module.ts
        |-- main.ts
        `-- order
            |-- dto
            |-- order.controller.ts
            |-- order.module.ts
            `-- order.service.ts
```

## Como funciona

1. A API recebe um `POST /orders`.
2. O payload e validado pelo NestJS.
3. O `order-service` publica o evento `order.created` no RabbitMQ.
4. Outros microservicos podem consumir esse evento de forma assincrona.

## Pre-requisitos

- Node.js 18+
- npm
- Docker e Docker Compose

## Subindo o RabbitMQ

Na raiz do projeto:

```bash
docker compose up -d
```

Painel do RabbitMQ:

- URL: `http://localhost:15672`
- Usuario: `bruno`
- Senha: `root`

## Configuracao

Dentro de `order-service`, crie o arquivo `.env` com base no `.env.example`:

```env
RABBITMQ_URL=amqp://bruno:root@localhost:5672
PORT=3000
```

## Instalacao

```bash
cd order-service
npm install
```

## Executando o projeto

```bash
# desenvolvimento
npm run start:dev

# build
npm run build

# producao
npm run start:prod
```

## Endpoint disponivel

### `POST /orders`

Recebe um pedido e publica o evento `order.created` no RabbitMQ.

Exemplo de payload:

```json
{
  "orderId": "order-001",
  "customerId": "customer-123",
  "status": "created",
  "totalAmount": 149.9,
  "currency": "BRL",
  "items": [
    {
      "productId": "product-001",
      "name": "Mouse Gamer",
      "quantity": 1,
      "price": 149.9
    }
  ]
}
```

Exemplo com `curl`:

```bash
curl -X POST http://localhost:3000/orders ^
  -H "Content-Type: application/json" ^
  -d "{\"orderId\":\"order-001\",\"customerId\":\"customer-123\",\"status\":\"created\",\"totalAmount\":149.9,\"currency\":\"BRL\",\"items\":[{\"productId\":\"product-001\",\"name\":\"Mouse Gamer\",\"quantity\":1,\"price\":149.9}]}"
```

## Scripts uteis

```bash
npm run start
npm run start:dev
npm run build
npm run test
npm run test:e2e
```

## Proximos passos

- Adicionar consumidores para os eventos publicados
- Documentar a API com Swagger
- Criar testes e2e para o fluxo de pedido
- Evoluir para multiplos microservicos

## Licenca

Projeto para fins de estudo.
