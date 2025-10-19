# DNCommerce - Sistema de Gestão de Produtos e Vendas

Sistema completo de gerenciamento de estoque, produtos, clientes e vendas para a loja online DNCommerce, desenvolvido com **Node.js**, **Express**, **Prisma ORM** e **PostgreSQL**.  

Permite cadastrar produtos, gerenciar clientes, controlar estoque, criar pedidos e registrar vendas com controle de transações.

## 🔄 **Correções Implementadas**

### **Problemas Corrigidos:**
- ✅ **Schema do banco:** Adicionados relacionamentos corretos entre tabelas
- ✅ **Validações:** Implementadas validações em todos os controllers
- ✅ **Controller de produtos:** Corrigido erro de conversão UUID → Number
- ✅ **CRUD de clientes:** Implementado sistema completo de clientes
- ✅ **Controle de estoque:** Sistema real de entrada/saída de estoque
- ✅ **Sistema de vendas:** Controle de transações e atualização automática de estoque
- ✅ **Timestamps:** Adicionados campos created_at e updated_at

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


---

## 🔧 Como rodar o projeto

1. **Instale dependências:**

```bash
npm install
```

2. **Configure o arquivo .env com os dados do PostgreSQL:**

```bash
DATABASE_URL=postgresql://usuario:senha@localhost:5432/seu_banco
```

3. **Rode migrações do Prisma:**

```bash
npx prisma migrate dev
```

4. **Inicie o servidor:**

```bash
npm run dev
```

5. **Teste as rotas no Postman ou Insomnia.**

---

## 🧪 **Testando o Banco de Dados**

Para verificar se o banco de dados está funcionando corretamente, execute o script de teste:

```bash
node test-db.js
```

### **O que o teste verifica:**
- ✅ **Conexão com o banco** PostgreSQL
- ✅ **Criação de cliente** com validações
- ✅ **Criação de produto** com UUID automático
- ✅ **Gerenciamento de estoque** com quantidades
- ✅ **Criação de pedido** com itens relacionados
- ✅ **Relacionamentos** entre todas as tabelas
- ✅ **Consultas complexas** com joins

### **Resultado esperado:**
```
🔍 Testing database connection...

1️⃣ Creating a test customer...
✅ Customer created: { id: 1, name: 'John Doe', ... }

2️⃣ Creating a test product...
✅ Product created: { id: 'uuid...', sku: 'TEST001', ... }

3️⃣ Creating stock for the product...
✅ Stock created: { quantity: 100, ... }

4️⃣ Creating a test order...
✅ Order created: { id: 1, total_amount: 59.8, ... }

5️⃣ Fetching all data with relationships...
✅ All customers with orders: [...]

🎉 All database tests passed! Database is working correctly.
```

### **Visualizar dados graficamente:**
```bash
npx prisma studio
```
Acesse: `http://localhost:5555`

---

## 🛠️ Rotas da API

## 1️⃣ Clientes

### Criar cliente
**POST /customers**

```json
{
  "name": "João Silva",
  "email": "joao@email.com",
  "phone": "(11) 99999-9999",
  "address": "Rua das Flores 123",
  "city": "São Paulo",
  "state": "SP",
  "zip_code": "01234-567"
}
```

### Listar clientes
**GET /customers**

### Buscar cliente por ID
**GET /customers/:id**

### Atualizar cliente
**PUT /customers/:id**

### Excluir cliente
**DELETE /customers/:id**

---

## 2️⃣ Produtos

### Criar produto
**POST /products**

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
### Listar produtos
**GET /products**

### Buscar produto por ID
**GET /products/:id**

---

## 3️⃣ Estoque

### Criar ou atualizar estoque
**POST /stock**

```json
{
  "product_id": "6cd5f642-facf-4ae1-8337-8d18d61986c0",
  "quantity": 100,
  "min_quantity": 10
}
```

### Listar todos os estoques
**GET /stock/all**

### Buscar itens com estoque baixo
**GET /stock/low**

### Ajustar estoque (entrada/saída)
**PATCH /stock/:product_id/adjust**

```json
{
  "quantity_change": -5,
  "reason": "Venda"
}
```
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
## 4️⃣ Pedidos

### Criar pedido
**POST /orders**

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
## 5️⃣ Vendas

### Criar venda
**POST /sales**

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
```

### Listar vendas
**GET /sales**

### Buscar venda por ID
**GET /sales/:id**

---

## 📝 **Melhorias Implementadas**

- **Validações robustas** em todas as rotas
- **Controle de transações** nas vendas
- **Atualização automática de estoque** nas vendas
- **Sistema completo de clientes** com CRUD
- **Controle avançado de estoque** com entrada/saída
- **Relacionamentos corretos** entre todas as entidades
- **Tratamento de erros** específicos e informativos
