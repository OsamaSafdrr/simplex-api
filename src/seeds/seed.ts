import { AppDataSource } from '../data-source';
import { Product } from '../products/entities/product.entity';
import { Order } from '../orders/entities/order.entity';

async function seed() {
    console.log('🌱 Seeding started...');
    try {
        await AppDataSource.initialize();
        console.log('✅ Database connected');
    } catch (error) {
        console.error('❌ Database connection error:', error);
        return;
    }

    const productRepo = AppDataSource.getRepository(Product);
    const orderRepo = AppDataSource.getRepository(Order);

    console.log('🛠️ Creating 100 product records...');
    const products = Array.from({ length: 100 }, (_, i) =>
        productRepo.create({
            name: `Product ${i + 1}`,
            price: parseFloat((Math.random() * 100).toFixed(2)),
        })
    );

    try {
        await productRepo.save(products);
        console.log(`✅ ${products.length} products inserted.`);
    } catch (error) {
        console.error('❌ Error inserting products:', error);
        return;
    }

    console.log('🛠️ Creating 10,000 order records...');
    const orders = Array.from({ length: 10_000 }, () =>
        orderRepo.create({
            product: products[Math.floor(Math.random() * 100)],
            quantity: Math.floor(Math.random() * 10) + 1,
        })
    );

    try {
        await orderRepo.save(orders);
        console.log(`✅ ${orders.length} orders inserted.`);
    } catch (error) {
        console.error('❌ Error inserting orders:', error);
        return;
    }

    console.log('🎉 Seeding completed successfully!');
    process.exit(0);
}

seed().catch((err) => {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
});
