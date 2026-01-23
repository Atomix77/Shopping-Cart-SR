# Shopping Cart Checkout System

A JavaScript implementation of a simple checkout system with special pricing offers.

[Getting Started](#installation) • [Example Code](#shopping-cart) • [Testing](#testing)

---

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Shopping Cart](#shopping-cart)
- [Functions](#functions)
- [Testing](#testing)
- [Project Structure](#project-structure)

---

## Features

| Feature | Description |
|---------|-------------|
| **Cart Management** | Add items with quantities, accumulates across multiple calls |
| **Special Offers** | Automatic application of discounts (e.g. "3 for 140") |
| **Input Validation** | Comprehensive validation with detailed error messages |
| **Error Handling** | Valid items processed even when invalid items present |

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/) (v20.x or higher)
- npm (included with Node.js)

### Setup

```bash
# Clone the repository
git clone https://github.com/Atomix77/Shopping-Cart-SR.git

# Navigate to project directory
cd Shopping-Cart-SR/shopping-cart

# Install dependencies
npm install
```

---
## Shopping Cart

### Pricing Rules

| Item Code | Unit Price | Special Offer |
|:---------:|:----------:|:-------------:|
| **A** | £50 | 3 for £140 |
| **B** | £35 | 2 for £60 |
| **C** | £25 | — |
| **D** | £12 | — |


### Example Code

```javascript
const ShoppingCart = require('./src/shoppingCart');

// Create a new shopping cart
const cart = new ShoppingCart();

// Add items
cart.addItemsToCart([
  {code: 'A', quantity: 3},
  {code: 'B', quantity: 3},
  {code: 'C', quantity: 1},
  {code: 'D', quantity: 2}
]);

// Calculate cart total
cart.getTotal(); // Output: 284

```

### Calculation Breakdown

```
┌──────────┬──────────┬─────────────────────────────┬─────────┐
│ Item     │ Quantity │ Calculation                 │ Subtotal│
├──────────┼──────────┼─────────────────────────────┼─────────┤
│ A        │ 3        │ Special: 3 for 140          │ £140    │
│ B        │ 3        │ Special: 2 for 60 + 1 × 35  │ £95     │
│ C        │ 1        │ 1 × 25                      │ £25     │
│ D        │ 2        │ 2 × 12                      │ £24     │
├──────────┴──────────┴─────────────────────────────┼─────────┤
│                                           TOTAL   │ £284    │
└───────────────────────────────────────────────────┴─────────┘
```

---

## Functions

### `addItemsToCart(items)`

Adds an array of items to the cart. Separates items into valid and invalid, adds valid ones, then throws errors for invalid items.

**Implementation Flow:**
1. Validates input is an array
2. Calls `separateValidAndInvalidItems()` to categorise items
3. Calls `addValidItemsToCart()` to process valid items
4. Throws aggregated errors for any invalid items

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `items` | `Array<Object>` | Array of item objects |
| `items[].code` | `string` | Product code (A, B, C, or D) |
| `items[].quantity` | `integer` | Positive integer quantity |

#### Returns

`void` — Modifies cart state internally.

#### Throws

| Error Message | Cause |
|---------------|-------|
| `Items should be an array` | Input is not an array |
| `Invalid item format` | Missing/invalid `code` or `quantity` properties or quantity is not an integer |
| `Unknown product code X` | Product code not in pricing rules |
| `Quantity must be a positive integer` | Quantity ≤ 0 |

---

### `separateValidAndInvalidItems(items)`

Separates valid and invalid items from the input array during validation.

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `items` | `Array<Object>` | Array of item objects to validate |

#### Returns

`Object` — Object with `validItems` and `invalidItems` arrays.

---

### `addValidItemsToCart(items)`

Adds validated items to the cart. If an item already exists, the quantity is accumulated.

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `items` | `Array<Object>` | Array of validated item objects |
| `items[].code` | `string` | Product code (A, B, C, or D) |
| `items[].quantity` | `integer` | Positive integer quantity |

#### Returns

`Object.<string, integer>` — The updated cart state.
---

### `validateItem(item)`

Validates a single item against the expected format and pricing rules.

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `item` | `Object` | Item object to validate |

#### Returns

`?string` — Error message if invalid, `null` if valid.

---

### `getTotal()`

Calculates and returns the total price, applying special pricing where applicable.

#### Returns

`number` — The calculated cart total.

---

## Testing

### Run Tests

```bash
# Run all tests
npm test
```

### Debug Tests (VS Code)

```bash
# In JavaScript Debug Terminal
npm test
```

### Test Coverage

| Category | Scenarios Covered |
|----------|-------------------|
| **Valid Operations** | Zero-total initialisation, batch processing, cumulative additions, and multi-buy discount logic |
| **Invalid Operations** | Input type enforcement, malformed item objects, and strict product code validation |
| **Error Handling** | Validates that correct items are added to the total even when accompanied by invalid items in a batch |

---

## Project Structure

```
shopping-cart/
├── src/
│   └── shoppingCart.js     # Core checkout logic
│   └── pricingRules.json   # Pricing rules data
├── tests/
│   └── test.js             # Jest test suite
├── package.json            # Dependencies & scripts
├── package-lock.json       # Locked dependencies
└── README.md               # Documentation
```
---