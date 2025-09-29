# DNCommerce - Sistema de Gestão de Produtos e Vendas

Sistema de gerenciamento de estoque, produtos e vendas para a loja online DNCommerce, desenvolvido com **Node.js**, **Express** e **PostgreSQL**.  

Permite cadastrar produtos, gerenciar estoque, criar pedidos e registrar vendas.

---

## 📦 Estrutura do Banco de Dados

mermaid https://www.mermaidchart.com/d/7cfbed46-9932-45e1-b2aa-c7188c5e7657

O banco de dados possui as seguintes tabelas:

 Schema |    Name     | Type  |     Owner      
--------+-------------+-------+----------------
 public | customers   | table | 
 public | order_items | table | 
 public | orders      | table | 
 public | products    | table | 
 public | sale_items  | table | 
 public | sales       | table | 
 public | stock       | table | 
(7 rows)                            |

**Exemplo de relacionamento:**  

![Esquema do banco](./assets/db_schema.png)

---

## 🔧 Como rodar o projeto

1. Instale dependências:

```bash
npm install
Configure o arquivo .env com os dados do PostgreSQL:

bash
Copiar código
DATABASE_URL=postgresql://usuario:senha@localhost:5432/seu_banco
Rode migrações do Prisma:

bash
Copiar código
npx prisma migrate dev
Inicie o servidor:

bash
Copiar código
npm run dev
Teste as rotas no Postman.

🛠 Rotas da API
1️⃣ Produtos
Criar produto
POST /products

Body (JSON):

json
Copiar código
{
  "sku": "PRD001",
  "name": "Shampoo XYZ",
  "description": "Shampoo hidratante",
  "price": 29.90,
  "cost_price": 15.50,
  "active": true
}
Retorno:

json
Copiar código
{
  "id": "6cd5f642-facf-4ae1-8337-8d18d61986c0",
  "sku": "PRD001",
  "name": "Shampoo XYZ",
  "description": "Shampoo hidratante",
  "price": 29.90,
  "cost_price": 15.50,
  "active": true
}
Listar produtos
GET /products

Retorno:

json
Copiar código
[
  {
    "id": "6cd5f642-facf-4ae1-8337-8d18d61986c0",
    "sku": "PRD001",
    "name": "Shampoo XYZ",
    "price": 29.90
  }
]
2️⃣ Estoque
Consultar estoque de um produto
GET /stock/:product_id

Exemplo:

bash
Copiar código
GET /stock/6cd5f642-facf-4ae1-8337-8d18d61986c0
Retorno:

json
Copiar código
{
  "product_id": "6cd5f642-facf-4ae1-8337-8d18d61986c0",
  "warehouse": "Main Warehouse",
  "quantity": 15,
  "min_quantity": 3
}
3️⃣ Pedidos
Criar pedido
POST /orders

Body (JSON):

json
Copiar código
{
  "customer_id": "123456",
  "items": [
    { "product_id": "6cd5f642-facf-4ae1-8337-8d18d61986c0", "unit_price": 29.90, "quantity": 2 },
    { "product_id": "6c7d3514-61c4-40f5-97a0-4770181483aa", "unit_price": 35.00, "quantity": 1 },
    { "product_id": "31a6a8eb-4cea-415c-9d33-fd382bd98bbb", "unit_price": 50.00, "quantity": 5 }
  ],
  "shipping_address": { "street": "Rua Teste 123", "city": "São Paulo" }
}
Retorno:

json
Copiar código
{
  "id": "id_do_pedido",
  "customer_id": "123456",
  "items": [...],
  "status": "pending"
}
4️⃣ Vendas
Criar venda
POST /sales

Body (JSON):

json
Copiar código
{
  "order_id": "id_do_pedido",
  "customer_id": "123456",
  "payment_method": "credit_card"
}
Retorno:

json
Copiar código
{
  "id": "id_da_venda",
  "order_id": "id_do_pedido",
  "customer_id": "123456",
  "status": "completed",
  "total": 94.80
}