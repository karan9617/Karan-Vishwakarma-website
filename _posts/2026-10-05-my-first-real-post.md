---
layout: post
title: "System Design: Your Database Is Fast. So Why Is Your API Taking 8 Seconds?"
date: 2026-10-05
---

Imagine you're building an e-commerce API.

Your product endpoint queries the database, retrieves 100 products, and returns them to the client.

The database query takes just 40 milliseconds.

Yet the API takes 8 seconds to respond.

How?

The problem might be hiding in the way your application loads related data.

### The N+1 query problem

Suppose your endpoint needs to return products alongside their sellers.

Your code looks innocent:

```js
const products = await db.product.findMany({
  take: 100,
});

for (const product of products) {
  product.seller = await db.seller.findUnique({
    where: { id: product.sellerId },
  });
}
```

The first query retrieves 100 products. Then the loop executes another 100 queries, one for each seller. That’s 101 database queries for a single API request.

Worse, each query waits for the previous one to finish.

If each seller lookup takes 80 ms:

![](https://cdn-images-1.medium.com/max/1280/1*vgXCalEhXt7PjVOthFM13A.png)

Your database isn’t necessarily slow. Your application is making hundreds of unnecessary round trips.

### The fix: batch the queries

Instead of fetching each seller separately, retrieve all required sellers in one query.

```js
const products = await db.product.findMany({
  take: 100,
});
```

```js
const sellerIds = [...new Set(products.map((p) => p.sellerId))];
```

```js
const sellers = await db.seller.findMany({
  where: {
    id: { in: sellerIds },
  },
});
```

```js
const sellerMap = new Map(sellers.map((s) => [s.id, s]));

const result = products.map((product) => ({
  ...product,
  seller: sellerMap.get(product.sellerId),
}));
```

Now you have approximately three database operations:

1. Fetch products.
2. Fetch the distinct sellers.
3. Associate sellers with products in memory.

The exact latency depends on indexes, network round trips, query plans, and the number of unique sellers, but you’ve eliminated the sequential-query bottleneck.

### Why this matters under load

Imagine 500 requests arrive simultaneously, and each request loads 100 products.

With the original implementation:

![](https://cdn-images-1.medium.com/max/1280/1*lMdoq7UvqMynuD72Zt2nMQ.png)

That’s 50,500 database queries for 500 API requests.

With batching, you might need only around 1,500 queries, assuming three operations per request. That’s a dramatic reduction in database round trips.

And it can improve performance without adding a single database server.

### But batching isn’t always the answer

There are trade-offs.

- A huge `IN` query can become expensive when the identifier list grows.
- Fetching unnecessary columns increases network traffic and memory usage.
- Large joins can duplicate data and make pagination difficult.
- An ORM may hide N+1 queries behind apparently simple property access.
- Caching can help repeated reads, but it won’t fix inefficient queries for unique data.

The right solution depends on the data model and access pattern.

The lesson: **before scaling infrastructure, inspect how your application uses it**. Sometimes the biggest performance improvement doesn’t come from adding more machines.

It comes from asking the database to do less unnecessary work.

#system #software #interview #ai