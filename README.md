# Microservicos EDA com NestJS e RabbitMQ

Repositorio de estudo sobre arquitetura orientada a eventos com Node.js, NestJS e RabbitMQ.

O projeto esta organizado como um pequeno ecossistema de microservicos. O `order-service` recebe pedidos via HTTP e publica mensagens no RabbitMQ, enquanto `payment-service` e `inventory-service` representam consumidores independentes desse fluxo.

## Visao geral

- `order-service`: API HTTP para criacao de pedidos
- `payment-service`: consumidor de eventos de pedido
- `inventory-service`: consumidor de eventos de pedido
- `docker-compose.yaml`: infraestrutura local do RabbitMQ

## Stack

- Node.js
- NestJS
- TypeScript
- RabbitMQ
- Docker Compose
- class-validator
- class-transformer

## Arquitetura atual

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
RabbitMQ exchange: orders.exchange
    |
    +--> payment-service
    |
    +--> inventory-service
```

## Estrutura do repositorio

```text
.
|-- docker-compose.yaml
|-- README.md
|-- order-service
|-- payment-service
`-- inventory-service
```

## Fluxo de pedidos

1. O cliente envia um `POST /orders` para o `order-service`.
2. O payload e validado no NestJS.
3. O `order-service` usa um provider proprio de RabbitMQ para conectar ao broker.
4. A aplicacao garante a exchange `orders.exchange`.
5. O pedido e publicado com uma routing key.
6. Os microservicos consumidores podem reagir ao evento de forma assincrona.

## Infra local

O projeto usa RabbitMQ com interface de administracao via Docker Compose.

Suba a infraestrutura na raiz:

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

Hoje `payment-service` e `inventory-service` usam a URL do RabbitMQ diretamente no codigo-fonte.

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

Use terminais separados para cada servico.

### 1. RabbitMQ

```bash
docker compose up -d
```

### 2. API de pedidos

```bash
cd order-service
npm run start:dev
```

Servico HTTP disponivel em `http://localhost:3000`.

### 3. Consumidor de pagamento

```bash
cd payment-service
npm run start:dev
```

### 4. Consumidor de estoque

```bash
cd inventory-service
npm run start:dev
```

## Endpoint principal

### `POST /orders`

Cria um pedido e publica uma mensagem no RabbitMQ.

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

## Implementacao atual

- O `order-service` publica mensagens na exchange `orders.exchange`
- O publisher envia a routing key `orders.created`
- `payment-service` e `inventory-service` estao configurados como microservicos RMQ
- Os consumidores atualmente escutam `@EventPattern('order.created')`

## Ponto de atencao

No estado atual do codigo, existe uma diferenca entre o evento publicado e o evento consumido:

- Publicado pelo `order-service`: `orders.created`
- Escutado pelos consumidores: `order.created`

Enquanto isso nao for padronizado, o fluxo completo de publicacao e consumo pode nao acontecer como esperado.

Outro detalhe importante e que `payment-service` e `inventory-service` usam a mesma fila `orders_queue`. Dependendo da estrategia desejada, isso pode fazer os servicos competirem entre si pelas mensagens, em vez de ambos processarem o mesmo evento.

## Scripts uteis

Cada servico possui os scripts padrao do Nest:

```bash
npm run start
npm run start:dev
npm run build
npm run test
npm run test:e2e
```

## Proximos passos sugeridos

- Padronizar o nome do evento entre publisher e consumers
- Separar filas por contexto de negocio
- Mover todas as configuracoes de conexao para `.env`
- Adicionar ack manual e tratamento de falhas
- Criar contratos compartilhados para eventos
- Adicionar testes de integracao do fluxo EDA

## Licenca

Projeto para fins de estudo.
