import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testDatabase() {
  console.log('🔍 Testing database connection...');
  
  try {
    // Test 1: Create a customer
    console.log('\n1️⃣ Creating a test customer...');
    const customer = await prisma.customers.create({
      data: {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '(11) 99999-9999',
        city: 'São Paulo'
      }
    });
    console.log('✅ Customer created:', customer);

    // Test 2: Create a product
    console.log('\n2️⃣ Creating a test product...');
    const product = await prisma.products.create({
      data: {
        sku: 'TEST001',
        name: 'Test Shampoo',
        description: 'A test product',
        price: 29.90,
        cost_price: 15.00,
        active: true
      }
    });
    console.log('✅ Product created:', product);

    // Test 3: Create stock for the product
    console.log('\n3️⃣ Creating stock for the product...');
    const stock = await prisma.stock.create({
      data: {
        product_id: product.id,
        quantity: 100,
        min_quantity: 10
      }
    });
    console.log('✅ Stock created:', stock);

    // Test 4: Create an order
    console.log('\n4️⃣ Creating a test order...');
    const order = await prisma.orders.create({
      data: {
        customer_id: customer.id,
        status: 'pending',
        total_amount: 59.80,
        shipping_address: JSON.stringify({
          street: 'Test Street 123',
          city: 'São Paulo',
          zipCode: '01234-567'
        }),
        order_items: {
          create: [
            {
              product_id: product.id,
              unit_price: 29.90,
              quantity: 2,
              subtotal: 59.80
            }
          ]
        }
      },
      include: {
        order_items: true
      }
    });
    console.log('✅ Order created:', order);

    // Test 5: List all data with relationships
    console.log('\n5️⃣ Fetching all data with relationships...');
    
    const allCustomers = await prisma.customers.findMany({
      include: {
        orders: {
          include: {
            order_items: {
              include: {
                product: true
              }
            }
          }
        }
      }
    });
    console.log('✅ All customers with orders:', JSON.stringify(allCustomers, null, 2));

    console.log('\n🎉 All database tests passed! Database is working correctly.');
    
  } catch (error) {
    console.error('❌ Database test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabase();