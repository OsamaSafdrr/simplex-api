# Simplex API

This service handles analytics and product order processing using **NestJS, TypeORM, MySQL, and Redis**.

## Features

- **Optimized Database Queries**: Reduces redundant queries using **JOINs and indexing**.
- **Redis Caching**: Improves response times for frequently accessed data.
- **Seed Data Population**: Populates MySQL with test data for performance testing.
- **Dockerized Setup**: Runs seamlessly in **Docker** with MySQL and Redis.

## Installation

### Prerequisites

- Docker & Docker Compose

### Running the Service

1. **Clone the repository:**
   ```sh
   git clone <repository_url>
   cd simplex-api
   ```

2. **Start the service using Docker:**
   ```sh
   docker-compose up --build
   ```

3. **To stop the service:**
   ```sh
   docker-compose down
   ```

## Database Seeding

To populate the database with test data:

```sh
docker exec -it simplex-app npm run seed
```

## API Endpoints

### Get Top Selling Products

- **Endpoint:** `GET /analytics/top-products`
- **Response (Success):**
  ```json
  [
    {
      "product_id": 1,
      "total_sales": 500
    }
  ]
  ```

## Debugging & Logs

View logs for the NestJS container:
```sh
docker logs -f simplex-app
```

Restart the NestJS container:
```sh
docker-compose restart app
```

## Performance Optimizations

### **1. Query Optimization**
- Replaced **N+1 queries** with optimized **JOINs**.
- Indexed `productId` in the `orders` table:
  ```sql
  CREATE INDEX idx_orders_product_id ON `order` (`productId`);
  ```

### **2. Redis Caching**
- Integrated Redis to store API responses for **60 seconds**.
- Implemented **cache lookup** before querying the database.

## Running Tests

Run tests inside the Docker container:

```sh
docker exec -it simplex-app npm test
```

## Future Improvements

- **Batch Processing**: Precompute `product_sales` for real-time insights.
- **Cache Expiry Tuning**: Adjust Redis TTL dynamically based on API usage.
- **Scalability Enhancements**: Introduce **message queues** for background processing.

---
