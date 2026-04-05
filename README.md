# Microservicos EDA com NestJS e RabbitMQ

Projeto de estudo sobre arquitetura orientada a eventos usando Node.js, NestJS e RabbitMQ.

O repositorio esta organizado em multiplos servicos, com um fluxo inicial em que o `order-service` recebe pedidos via HTTP e publica o evento `order.created`. Os servicos `payment-service` e `inventory-service` estao preparados para consumir eventos via RabbitMQ.

## Servicos do projeto

- `order-service`: API HTTP para criacao de pedidos
- `payment-service`: microservico consumidor de eventos de pedido
- `inventory-service`: microservico consumidor de eventos de pedido

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
|-- order-service
|-- payment-service
`-- inventory-service
```

## Fluxo atual

1. O cliente envia um `POST /orders` para o `order-service`.
2. O payload e validado com NestJS.
3. O `order-service` publica o evento `order.created` no RabbitMQ.
4. Os consumidores escutam eventos usando Nest Microservices com transporte RMQ.

## Observacao importante

Atualmente `payment-service` e `inventory-service` estao configurados com a mesma fila: `orders_queue`.

Na pratica, isso significa que eles funcionam como consumidores concorrentes da mesma fila. Ou seja, cada mensagem tende a ser processada por apenas um deles, nao pelos dois ao mesmo tempo.

Se a ideia for que ambos recebam todos os eventos, o proximo passo e separar filas por servico ou ajustar a estrategia de roteamento.

## Pre-requisitos

- Node.js 18+
- npm
- Docker e Docker Compose

## Subindo o RabbitMQ

Na raiz do projeto:

```bash
docker compose up -d
```

Painel de administracao:

- URL: `http://localhost:15672`
- Usuario: `bruno`
- Senha: `root`

AMQP:

- URL: `amqp://bruno:root@localhost:5672`

## Configuracao do order-service

Dentro de `order-service`, crie um arquivo `.env` com base no `.env.example`:

```env
RABBITMQ_URL=amqp://bruno:root@localhost:5672
PORT=3000
```

## Instalacao

Instale as dependencias em cada servico:

```bash
cd order-service
npm install

cd ../payment-service
npm install

cd ../inventory-service
npm install
```

## Como executar

Abra terminais separados.

### 1. Suba o RabbitMQ

```bash
docker compose up -d
```

### 2. Inicie o order-service

```bash
cd order-service
npm run start:dev
```

### 3. Inicie o payment-service

```bash
cd payment-service
npm run start:dev
```

### 4. Inicie o inventory-service

```bash
cd inventory-service
npm run start:dev
```

## Endpoint disponivel

### `POST /orders`

Cria um pedido e publica o evento `order.created`.

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

Exemplo com `curl` no Windows:

```bash
curl -X POST http://localhost:3000/orders ^
  -H "Content-Type: application/json" ^
  -d "{\"orderId\":\"order-001\",\"customerId\":\"customer-123\",\"status\":\"created\",\"totalAmount\":149.9,\"currency\":\"BRL\",\"items\":[{\"productId\":\"product-001\",\"name\":\"Mouse Gamer\",\"quantity\":1,\"price\":149.9}]}"
```

## Scripts uteis

Cada servico possui os scripts padrao do Nest:

```bash
npm run start
npm run start:dev
npm run build
npm run test
npm run test:e2e
```

## Estado atual do projeto

- `order-service` ja expoe endpoint HTTP para pedidos
- `payment-service` consome o evento `order.created`
- `inventory-service` consome o evento `order.created`
- RabbitMQ sobe via `docker-compose.yaml`

## Proximos passos

- Separar filas por contexto para evitar concorrencia indesejada
- Adicionar ack manual e tratamento de erro
- Padronizar configuracoes via `.env` em todos os servicos
- Criar contratos de evento compartilhados
- Adicionar observabilidade e testes de integracao

## Licenca

Projeto para fins de estudo.
