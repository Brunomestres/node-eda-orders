# Microservicos EDA com NestJS e RabbitMQ

<p align="center">
  Fluxo distribuido de pedidos com publicacao de eventos, consumers independentes e introducao de dead letter queue.
</p>

<p align="center">
  <img alt="Node.js" src="https://img.shields.io/badge/Node.js-18%2B-2f6f3e">
  <img alt="NestJS" src="https://img.shields.io/badge/NestJS-11-e0234e">
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5.7-2f74c0">
  <img alt="RabbitMQ" src="https://img.shields.io/badge/RabbitMQ-3.13-f27a1a">
  <img alt="Docker Compose" src="https://img.shields.io/badge/Docker_Compose-local-1d63ed">
</p>

## Sobre

Este repositorio foi criado para estudar arquitetura orientada a eventos na pratica, usando microservicos pequenos e responsabilidades separadas.

O fluxo atual comeca no `order-service`, que recebe pedidos via HTTP e publica mensagens no RabbitMQ. A partir disso, `payment-service` e `inventory-service` consomem o evento de criacao do pedido, enquanto um `dead-letter-queue-service` passa a fazer parte da estrategia de tolerancia a falhas.

## Servicos

| Servico | Papel |
|---|---|
| `order-service` | Recebe `POST /orders` e publica eventos |
| `payment-service` | Processa pagamento com retries locais e ack manual |
| `inventory-service` | Reage ao evento de pedido para fluxo de estoque com ack manual |
| `dead-letter-queue-service` | Base para tratar mensagens que falharam definitivamente |

## Arquitetura

```text
Cliente HTTP
    |
    v
POST /orders
    |
    v
order-service
    |
    v
orders.exchange (topic)
    |
    +--> payment.order
    |      |
    |      `--> payments.dlx / payments.failed
    |
    +--> inventory.order
    |
    `--> dead-letter-queue-service (em evolucao)
```

## Stack

- Node.js
- NestJS
- TypeScript
- RabbitMQ
- Docker Compose
- class-validator
- class-transformer

## Estrutura do repositorio

```text
.
|-- docker-compose.yaml
|-- README.md
|-- order-service
|-- payment-service
|-- inventory-service
`-- dead-letter-queue-service
```

## Fluxo de negocio

1. O cliente envia um `POST /orders`.
2. O `order-service` valida o payload e publica o evento `orders.created`.
3. O RabbitMQ distribui a mensagem para as filas configuradas.
4. `payment-service` e `inventory-service` processam mensagens com `ack/nack` manual.
5. O `payment-service` tenta processar o pagamento com retentativas locais.
6. Quando o processamento de pagamento falha de forma definitiva, a estrutura de dead letter entra como proximo passo da arquitetura.

## Infra local

Suba o RabbitMQ na raiz do projeto:

```bash
docker compose up -d
```

Credenciais locais:

- Painel: `http://localhost:15672`
- Usuario: `bruno`
- Senha: `root`
- AMQP: `amqp://bruno:root@localhost:5672`

## Configuracao

No `order-service`, crie um arquivo `.env` com base em `.env.example`:

```env
RABBITMQ_URL=amqp://bruno:root@localhost:5672
PORT=3000
```

Hoje os consumers ainda usam a URL do RabbitMQ diretamente no codigo.

## Instalacao

Instale as dependencias em cada servico:

```bash
cd order-service
npm install

cd ../payment-service
npm install

cd ../inventory-service
npm install

cd ../dead-letter-queue-service
npm install
```

## Como executar

Use um terminal por servico.

### 1. RabbitMQ

```bash
docker compose up -d
```

### 2. order-service

```bash
cd order-service
npm run start:dev
```

API disponivel em `http://localhost:3000`.

### 3. payment-service

```bash
cd payment-service
npm run start:dev
```

### 4. inventory-service

```bash
cd inventory-service
npm run start:dev
```

### 5. dead-letter-queue-service

```bash
cd dead-letter-queue-service
npm run start:dev
```

## Endpoint principal

### `POST /orders`

Cria um pedido e publica o evento `orders.created`.

Payload de exemplo:

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

## Estado atual

- `order-service` publica em `orders.exchange`
- O evento publicado e `orders.created`
- `payment-service` consome pela fila `payment.order`
- `inventory-service` consome pela fila `inventory.order`
- `payment-service` e `inventory-service` usam `noAck: false` com confirmacao manual
- `payment-service` ja possui configuracao de dead letter exchange
- `dead-letter-queue-service` ja existe no repositorio, mas ainda esta em consolidacao

## Ponto de atencao

- Alterar argumentos de uma fila ja criada no RabbitMQ, como `deadLetterExchange`, pode gerar `PRECONDITION_FAILED`
- Em ambiente local, a correcao mais simples costuma ser apagar a fila no painel do RabbitMQ e subir o servico novamente
- Como os consumers usam `ack/nack` manual, falhas de processamento impactam diretamente o destino da mensagem
- O fluxo de dead letter ainda nao esta completamente fechado de ponta a ponta

## Scripts uteis

Cada servico usa os scripts padrao do Nest:

```bash
npm run start
npm run start:dev
npm run build
npm run test
npm run test:e2e
```

## Proximos passos

- Finalizar o consumo da DLQ no `dead-letter-queue-service`
- Padronizar configuracoes via `.env` em todos os servicos
- Criar contratos compartilhados para eventos
- Adicionar logs e observabilidade
- Cobrir o fluxo com testes de integracao

## Licenca

Projeto para fins de estudo.
