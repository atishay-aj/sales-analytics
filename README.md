# **Sales & Revenue Analytics API**  
**GraphQL API using NestJS, MongoDB, and Mongoose**

## **📌 Overview**  
This is a **GraphQL API** for an **e-commerce platform** that provides analytics on **revenue, customer spending, and product sales trends**. It includes:  
✅ Customer spending insights  
✅ Top-selling products  
✅ Sales analytics (total revenue, completed orders, category-wise breakdown)  
✅ Placing new orders  
✅ Paginated order history  

---

## **🛠️ Tech Stack**
- **NestJS** (GraphQL API framework)
- **MongoDB** (NoSQL database)
- **Mongoose** (MongoDB ODM)
- **Apollo GraphQL** (GraphQL server)

---

## **🚀 Setup Instructions**

### **1️⃣ Clone the Repository**
```sh
git clone https://github.com/atishay-aj/sales-analytics.git
cd sales-analytics
```

### **2️⃣ Install Dependencies**
```sh
npm install
```

### **3️⃣ Start MongoDB**
If MongoDB is **not running**, start it using:
```sh
mongod --dbpath ./data/db
```
or use **Docker**:
```sh
docker run --name mongodb -d -p 27017:27017 mongo
```

### **4️⃣ Import Sample Data**
The seed_data folder contains JSON seed files to populate the database.

```sh
mongoimport --uri "mongodb://localhost:27017/ecommerce" --collection customers --file customers.json --jsonArray
mongoimport --uri "mongodb://localhost:27017/ecommerce" --collection products --file products.json --jsonArray
mongoimport --uri "mongodb://localhost:27017/ecommerce" --collection orders --file orders.json --jsonArray
```

### **5️⃣ Start the Server**
```sh
npm run start
```
The server will be available at:  
**📍 http://localhost:3000/graphql**

---

## **🎯 GraphQL API Endpoints**

### ✅ **Get Customer Spending**
```graphql
query GetCustomerSpending {
  getCustomerSpending(customerId: "7895595e-7f25-47fe-a6f8-94b31bfab736") {
    customerId
    totalSpent
    averageOrderValue
    lastOrderDate
  }
}
```

### ✅ **Get Top-Selling Products**
```graphql
query GetTopSellingProducts {
  getTopSellingProducts(limit: 5) {
    productId
    name
    totalSold
  }
}
```

### ✅ **Get Sales Analytics**
```graphql
query getSalesAnalytics {
  getSalesAnalytics(
    startDate: "2024-12-15T05:05:58.471+00:00"
    endDate: "2025-02-16T05:05:58.471+00:00"
  ) {
    totalRevenue
    completedOrders
    categoryBreakdown {
      category
      revenue
    }
  }
}
```

### ✅ **Paginated Customer Orders**
```graphql
query GetCustomerOrders {
  getCustomerOrders(
    customerId: "7895595e-7f25-47fe-a6f8-94b31bfab736"
    page: 1
    limit: 10
  ) {
    orders {
      _id
      customerId
      products {
        productId
        quantity
        priceAtPurchase
      }
      totalAmount
      orderDate
      status
    }
    totalOrders
    currentPage
    totalPages
  }
}
```

### ✅ **Place an Order**
```graphql
mutation PlaceOrder {
  placeOrder(
    input: {
      products: [
        { productId: "1e2c1b29-ec24-40dc-b2fc-1a3c17c3093c", quantity: 10 }
      ]
      customerId: "7895595e-7f25-47fe-a6f8-94b31bfab736"
    }
  )
}
```
---

**📄 Sample Queries File**
A queries.graphql file is provided with sample queries for testing the API.

You can use it with GraphQL Playground or any GraphQL client
---

## **🔹 Features**
✅ **Optimized Queries**: Uses MongoDB Aggregation Pipelines  
✅ **Pagination**: Supports paginated order history  
✅ **Stock Management**: Reduces stock on order placement  
✅ **Indexes for Performance**: Uses MongoDB indexes to speed up queries  


---

## **📜 License**
This project is **open-source** under the **MIT License**.

---

Now you're all set! 🎉 **Run the project and start querying! 🚀**
