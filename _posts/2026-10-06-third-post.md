---
layout: post
title: "Segment Trees: Range Queries and Updates in O(log n)"
date: 2026-10-06
---

### Data structure: Segment Trees: not that tough

*How to answer thousands of range queries while still supporting updates in O(log n)*

Imagine you have an array of 1 million numbers:

```python
[4, 7, 2, 9, 1, 6, 3, 8, ...]
```

Now someone starts asking questions:

```python
What is the sum from index 100 to 50,000?
```

```python
What is the minimum between index 20,000 and 80,000?
```

```python
Update index 45,321 to a new value.
```

```python
Now what's the sum from 10,000 to 70,000?
```

And this happens thousands or millions of times. At first, this doesn’t sound particularly difficult. For a range sum, just loop through the requested range.

```python
def range_sum(left, right):
    total = 0
    for i in range(left, right + 1):
        total += arr[i]
    return total
```

The problem is the complexity. If the range contains $n$ elements:

```text
Query → O(n)
```

For 1 million elements, a single query can touch 1 million values. If you have 100,000 queries, you’re potentially doing an enormous amount of unnecessary work. There is a better way. That’s where **segment trees** come in.

---

### The Problem Segment Trees Actually Solve

Before understanding the tree, let’s define the problem.

We have an array:

```python
arr = [2, 1, 5, 3, 4, 7, 6, 8]
```

We want to support two operations:

### Query

Calculate something over a range:

```python
sum(2, 6)
```

meaning:

```python
5 + 3 + 4 + 7 + 6
```

### Update

Change one element:

```python
arr[3] = 10
```

Now the array becomes:

```python
[2, 1, 5, 10, 4, 7, 6, 8]
```

The challenge is supporting **both** operations efficiently.

---

### Why Prefix Sums Aren’t Enough

You might immediately think: *“Can’t we use prefix sums?”*

Absolutely. For example:

```python
arr = [2, 1, 5, 3, 4]
```

Prefix sums:

```python
[2, 3, 8, 11, 15]
```

Then:

```python
sum(1, 3)
```

becomes:

```python
prefix[3] - prefix[0]
```

which is:

```python
11 - 2 = 9
```

Excellent.

Range queries become:

```text
O(1)
```

But there’s a catch.

What happens if:

```python
arr[2] = 100
```

Now all the prefix sums after index 2 need to change.

That’s:

```text
O(n)
```

So prefix sums give us:

```text
Query  → O(1)
Update → O(n)
```

What if we want both operations to be fast?

We need something different.

---

### The Key Idea Behind a Segment Tree

Instead of storing every possible range, we store **carefully chosen ranges**.

Take:

```python
[2, 1, 5, 3, 4, 7, 6, 8]
```

We divide the array into halves.

```text
[0........7]
      /           \
   [0....3]       [4....7]
   /   \          /     \
 [0..1] [2..3]  [4..5] [6..7]
 / \    / \    / \    / \
0  1  2  3    4  5  6  7
```

Each node represents a range.

For a **sum segment tree**, each node stores the sum of its range.

For example:

```python
[2, 1, 5, 3, 4, 7, 6, 8]
```

becomes:

```text
        36
      /    \
    11      25
   /  \    /  \
  3    8  11   14
 / \  / \ / \  / \
2  1 5  3 4 7 6  8
```

Notice something important.

The root contains the answer for the entire array.

Its children contain answers for halves.

Their children contain answers for smaller ranges.

We’re essentially creating a hierarchy of precomputed answers.

---

### Why This Makes Queries Fast

Suppose we want:

```python
sum(2, 6)
```

We don’t need to visit:

```python
2 3 4 5 6
```

individually.

The tree already contains answers for several useful ranges.

For example:

```python
[2,3] [4,5] [6,6]
```

We can combine them:

```python
sum(2,6) = sum(2,3) + sum(4,5) + value(6)
```

That’s only a handful of nodes.

The tree has essentially turned a large range into a small collection of precomputed ranges.

---

### The Magic Is the Height of the Tree

A segment tree repeatedly divides the array in half.

For an array of size $n$:

$$
\frac{n}{2}, \frac{n}{4}, \frac{n}{8}, \dots, 1
$$

The number of levels is therefore:

$$
O(\log n)
$$

This is the fundamental reason segment trees are fast.

A query only needs to travel through a logarithmic number of levels.

So:

```text
Range Query → O(log n)
Point Update → O(log n)
```

That’s the important result.

---

### Building the Tree

Let’s implement a sum segment tree.

We’ll use a common array representation.

For simplicity, create:

```python
tree = [0] * (4 * n)
```

Why `4 * n`?

A segment tree contains fewer than roughly `4n` nodes for practical recursive implementations, so this gives us comfortable storage.

Now the build function:

```python
def build(node, left, right):
    if left == right:
        tree[node] = arr[left]
        return

    mid = (left + right) // 2
    build(node * 2, left, mid)
    build(node * 2 + 1, mid + 1, right)
    tree[node] = tree[node * 2] + tree[node * 2 + 1]
```

The important part is this:

```python
tree[node] = tree[node * 2] + tree[node * 2 + 1]
```

The parent doesn’t calculate anything from the original array.

It simply combines the answers from its children.

That’s the core idea behind a segment tree.

---

### The Three Cases During a Query

Suppose we’re querying:

```python
query(ql, qr)
```

for a tree node representing:

```python
[nodeLeft, nodeRight]
```

There are three possibilities.

### Case 1: Completely outside

Suppose the node represents:

```python
[0, 3]
```

but we’re asking for:

```python
[5, 7]
```

There is no overlap.

Return the identity value.

For sums:

```python
0
```

### Case 2: Completely inside

Suppose the node represents:

```python
[4, 7]
```

and we’re asking for:

```python
[3, 7]
```

The entire node is inside our query.

We already have the answer.

Return:

```python
tree[node]
```

We don’t need to explore its children.

This is where much of the efficiency comes from.

### Case 3: Partial overlap

Now suppose the node represents:

```python
[0, 7]
```

and the query is:

```python
[2, 6]
```

The node partially overlaps.

So we split:

```python
[0,3] [4,7]
```

and recursively query both sides.

Eventually, the tree decomposes the requested range into a small number of complete segments.

---

### Query Implementation

```python
def query(node, left, right, ql, qr):
    # No overlap
    if qr < left or right < ql:
        return 0

    # Complete overlap
    if ql <= left and right <= qr:
        return tree[node]

    mid = (left + right) // 2
    left_sum = query(node * 2, left, mid, ql, qr)
    right_sum = query(node * 2 + 1, mid + 1, right, ql, qr)
    return left_sum + right_sum
```

The code looks recursive, but conceptually it’s doing something very simple:

```text
Does this range matter?
    NO  → ignore it
    YES → do we already have its answer?
             YES → use it
             NO  → split it
```

That’s basically the entire query algorithm.

---

### Updating a Value

Now suppose:

```python
arr[3] = 10
```

Only the nodes whose ranges contain index 3 need to change.

Look at the path:

```text
[0..7]
    /\
 [0..3] [4..7]
   /\
 [2..3]
   /\
  [3]
```

We update the leaf.

Then recompute its ancestors.

```python
def update(node, left, right, index, value):
    if left == right:
        tree[node] = value
        return

    mid = (left + right) // 2
    if index <= mid:
        update(node * 2, left, mid, index, value)
    else:
        update(node * 2 + 1, mid + 1, right, index, value)

    tree[node] = tree[node * 2] + tree[node * 2 + 1]
```

Notice how we only travel down one branch. Then we recompute the nodes on that path. Since the tree height is:

$$
O(\log n)
$$

the update is:

```text
O(log n)
```

---

### Complexity

For an array containing $n$ elements:

```text
Build:   O(n)
Query:   O(log n)
Update:  O(log n)
```

They’re useful when you have **lots of queries and lots of updates**.

---

### But Does It Have to Be Sum?

No.

This is where segment trees become much more interesting. The tree doesn’t really care about “sum.” Each node simply stores some information about its range that can be combined from its children. For example:

### Range Minimum

```python
tree[node] = min(tree[left_child], tree[right_child])
```

### Range Maximum

```python
tree[node] = max(tree[left_child], tree[right_child])
```

### Range GCD

```python
tree[node] = gcd(tree[left_child], tree[right_child])
```

So the general idea becomes:

```text
Combine(left_result, right_result)
```

The important question is:

> Can I combine the answers from two smaller ranges to produce the answer for their combined range?

If yes, a segment tree might be useful.

---

### The Connection to Divide and Conquer

There is a deeper idea hiding here. Segment trees are essentially **divide and conquer turned into a reusable data structure**. We repeatedly divide:

```text
[0........7]
```

into:

```text
[0....3] [4....7]
```

then:

```text
[0..1] [2..3] [4..5] [6..7]
```

and eventually: individual elements. Then we combine results on the way back up. That’s exactly the structure of many recursive algorithms. The difference is that we’re **saving those intermediate results** so we can reuse them later.

---

### Segment Tree vs Fenwick Tree

You’ll often encounter another structure called a **Fenwick Tree**, or Binary Indexed Tree. It can also support:

```text
point update
prefix/range sum query
```

in:

```text
O(log n)
```

So why use a segment tree? Because segment trees are more general. A Fenwick Tree is excellent for things like:

```text
prefix sums
frequency counts
cumulative sums
```

A segment tree can handle:

```text
sum
minimum
maximum
GCD
custom combinations
more complicated range information
```

And segment trees can be extended with **lazy propagation**, which lets us efficiently handle range updates as well.

---

### The Next Level: Lazy Propagation

So far we’ve handled:

```text
Point Update
```

For example:

```python
arr[5] = 100
```

But imagine:

```text
Add 10 to every element from index 100,000 to 500,000.
```

Updating every element individually would be expensive. A naive solution could require:

```text
O(n)
```

operations. Lazy propagation changes the game. Instead of immediately updating every descendant node, we say:

> “This entire range needs +10. I’ll remember that and apply it when someone actually needs to go deeper.”

The node gets a lazy value:

```python
lazy[node] += 10
```

The update is effectively postponed. That’s where the technique gets its name.

**Lazy propagation**.

With it, we can support many range-update problems in:

```text
O(log n)
```

per operation.

---

### When Should You Think “Segment Tree”?

You probably shouldn’t reach for a segment tree just because you see an array.

Look for this combination:

```text
ARRAY + RANGE QUERIES + UPDATES
```

For example: Given an array

```text
Perform Q operations:
```

```text
1. Update index i.
2. Find the minimum/sum/maximum between L and R.
```

That’s almost screaming:

> **Segment Tree.**

But if the array never changes:

```text
Static array + many range-sum queries
```

a prefix sum may be much simpler.

This is an important engineering principle:

> *Don’t use a more complicated data structure when a simpler one solves the actual problem.*

---

### A Mental Model Worth Remembering

Forget the implementation for a moment.

Think of a segment tree as:

> **A hierarchy of precomputed answers for ranges.**

Instead of:

```python
Query [2, 7]
```

```python
2 + 3 + 4 + 5 + 6 + 7
```

we reuse:

```python
[2,3] [4,5] [6,7]
```

which were already computed.

When one value changes, we don’t recompute everything.

We only repair the path from that value back to the root.

That’s the entire trick.

```text
GLOBAL ANSWER
      /     \
   RANGE A  RANGE B
     / \     / \
   ... ... ... ...
        ↑
    changed value
```

And that’s why a segment tree can turn:

```text
O(n) query
O(n) update
```

into:

```text
O(log n) query
O(log n) update
```

when the problem has the right structure.

---

### The Pattern to Recognize in LeetCode

When you see something like:

> *Given an array of integers, support multiple operations that update values and query the sum/minimum/maximum over a range.*

Start thinking:

```text
Range Query + Dynamic Updates
      ↓
   Segment Tree
```

And if the updates affect **an entire range**, think:

```text
Range Query + Range Update
      ↓
Segment Tree + Lazy Propagation
```

That distinction alone will save you a lot of time on harder problems.

---

### LeetCode Problems to Practice

A good progression is:

1. **307. Range Sum Query — Mutable** — basic segment tree
2. **303. Range Sum Query — Immutable** — understand why prefix sums can be enough
3. **729. My Calendar I** — interval thinking
4. **715. Range Module** — more advanced range management
5. **732. My Calendar III** — sweep-line/segment-tree-style thinking
6. **218. The Skyline Problem** — advanced range/data-structure combination

The first one, **Range Sum Query — Mutable**, is the best place to start. Once you can implement it from scratch without looking at the solution, the basic segment-tree concept is no longer mysterious.

#interview #systemdesign #technology #ai #algorithm #system
