const ShoppingCart = require('../src/shoppingCart');

describe('Valid Cases', () => {
    // Test cases for valid scenarios

    test('return 0 for a new empty cart', () => {
        const shoppingCart = new ShoppingCart();
        expect(shoppingCart.getTotal()).toBe(0);
    });

    test('return 0 when adding an empty array', () => {
        const shoppingCart = new ShoppingCart();
        shoppingCart.addItemsToCart([]);
        expect(shoppingCart.getTotal()).toBe(0);
    });

    test('calculate total for a single unit of an item', () => {
        const shoppingCart = new ShoppingCart();
        shoppingCart.addItemsToCart([
            {code: 'A', quantity: 1}
        ]);
        expect(shoppingCart.getTotal()).toBe(50);
    });

    test('aggregate total when same item is added in separate calls', () => {
        const shoppingCart = new ShoppingCart();
        shoppingCart.addItemsToCart([
            {code: 'A', quantity: 1}
        ]);
        shoppingCart.addItemsToCart([
            {code: 'A', quantity: 2}
        ]);
        expect(shoppingCart.getTotal()).toBe(140);
    });

    test('aggregate total when same item appears multiple times in one batch', () => {
        const shoppingCart = new ShoppingCart();
        shoppingCart.addItemsToCart([
            {code: 'B', quantity: 1},
            {code: 'B', quantity: 2}
        ]);
        expect(shoppingCart.getTotal()).toBe(95);
    });

    test('calculate total for multiple units of the same item', () => {
        const shoppingCart = new ShoppingCart();
        shoppingCart.addItemsToCart([
            {code: 'A', quantity: 2}
        ]);
        expect(shoppingCart.getTotal()).toBe(100);
    });

    test('apply special pricing when quantity threshold is met', () => {
        const shoppingCart = new ShoppingCart();
        shoppingCart.addItemsToCart([
            {code: 'A', quantity: 3}
        ]);
        expect(shoppingCart.getTotal()).toBe(140);
    });

    test('calculate total for a variety of single items', () => {
        const shoppingCart = new ShoppingCart();
        shoppingCart.addItemsToCart([
            {code: 'A', quantity: 1},
            {code: 'B', quantity: 1},
            {code: 'C', quantity: 1}
        ]);
        expect(shoppingCart.getTotal()).toBe(110);
    });

    test('apply mixed unit and special pricing across multiple product types', () => {
        const shoppingCart = new ShoppingCart();
        shoppingCart.addItemsToCart([
            {code: 'A', quantity: 3},
            {code: 'B', quantity: 2},
            {code: 'C', quantity: 1},
            {code: 'D', quantity: 1}
        ]);
        expect(shoppingCart.getTotal()).toBe(237);
    });

    test('handle quantities exceeding a single special price offer', () => {
        const shoppingCart = new ShoppingCart();
        shoppingCart.addItemsToCart([
            {code: 'A', quantity: 4}
        ]);
        expect(shoppingCart.getTotal()).toBe(190);
    });

    test('handle multiple instances of special offers across different items', () => {
        const shoppingCart = new ShoppingCart();
        shoppingCart.addItemsToCart([
            {code: 'A', quantity: 4},
            {code: 'B', quantity: 4},
            {code: 'C', quantity: 1},
            {code: 'D', quantity: 2}
        ]);
        expect(shoppingCart.getTotal()).toBe(359);
    });  

    test('accurately calculate totals for bulk quantities', () => {
        const shoppingCart = new ShoppingCart();
        shoppingCart.addItemsToCart([
            {code: 'A', quantity: 10},
            {code: 'B', quantity: 10},
            {code: 'C', quantity: 10},
            {code: 'D', quantity: 10}
        ]);
        expect(shoppingCart.getTotal()).toBe(1140);
    });

    test('handle extreme quantities without precision errors', () => {
        const shoppingCart = new ShoppingCart();
        shoppingCart.addItemsToCart([
            {code: 'A', quantity: 1000},
            {code: 'B', quantity: 1000},
            {code: 'C', quantity: 1000},
            {code: 'D', quantity: 1000}
        ]);
        expect(shoppingCart.getTotal()).toBe(113670);
    });

    test('ensure total remains identical regardless of item input order', () => {
        const cart1 = new ShoppingCart();
        cart1.addItemsToCart([
            {code: 'A', quantity: 3}, {code: 'B', quantity: 2},
            {code: 'C', quantity: 1}, {code: 'D', quantity: 1}
        ]);
        const cart2 = new ShoppingCart();
        cart2.addItemsToCart([
            {code: 'D', quantity: 1}, {code: 'C', quantity: 1},
            {code: 'B', quantity: 2}, {code: 'A', quantity: 3}
        ]);
        
        expect(cart1.getTotal()).toBe(237);
        expect(cart2.getTotal()).toBe(237);
    });

    test('throw error on unknown code while still processing valid items in the batch', () => {
        const shoppingCart = new ShoppingCart();
        expect(() => shoppingCart.addItemsToCart([
            {code: 'A', quantity: 2},
            {code: 'E', quantity: 1},
            {code: 'B', quantity: 1}
        ])).toThrow('Unknown product code E');
        expect(shoppingCart.getTotal()).toBe(135);
    });

    test('concatenate multiple validation errors for an invalid batch', () => {
        const shoppingCart = new ShoppingCart();
        expect(() => shoppingCart.addItemsToCart([
            {code: 'A', quantity: 2},
            {code: 'E', quantity: 1},
            {code: 'B', quantity: -1},
            {code: 'C', quantity: 3},
            {code: 'X', quantity: 5}
        ])).toThrow('Unknown product code E; Quantity must be a positive integer; Unknown product code X');
        expect(shoppingCart.getTotal()).toBe(175);
    });

});

describe('Invalid Cases', () => {
    // Test cases for invalid scenarios

    test('throw error if items argument is missing', () => {
        const shoppingCart = new ShoppingCart();
        expect(() => shoppingCart.addItemsToCart()).toThrow('Items should be an array');
        expect(shoppingCart.getTotal()).toBe(0);
    });

    test('throw error if items argument is null', () => {
        const shoppingCart = new ShoppingCart();
        expect(() => shoppingCart.addItemsToCart(null)).toThrow('Items should be an array');
        expect(shoppingCart.getTotal()).toBe(0);
    });

    test('throw error if input is a string instead of an array', () => {
        const shoppingCart = new ShoppingCart();
        expect(() => shoppingCart.addItemsToCart('')).toThrow('Items should be an array');
        expect(shoppingCart.getTotal()).toBe(0);
    });

    test('throw error if a single object is passed instead of an array', () => {
        const shoppingCart = new ShoppingCart();
        expect(() => shoppingCart.addItemsToCart({code: 'A', quantity: 1})).toThrow('Items should be an array');
        expect(shoppingCart.getTotal()).toBe(0);
    });

    test('throw error for unregistered product codes', () => {
        const shoppingCart = new ShoppingCart();
        expect(() => shoppingCart.addItemsToCart([{code: 'E', quantity: 1}])).toThrow('Unknown product code E');
        expect(shoppingCart.getTotal()).toBe(0);
    });

    test('throw error for malformed objects or incorrect data types', () => {
        const shoppingCart = new ShoppingCart();
        expect(() => shoppingCart.addItemsToCart([{code: 'A', qty: 1}])).toThrow('Invalid item format');
        expect(() => shoppingCart.addItemsToCart([{cod: 'A', quantity: 1}])).toThrow('Invalid item format');
        expect(() => shoppingCart.addItemsToCart([{code: 7, quantity: 3}])).toThrow('Invalid item format');
        expect(() => shoppingCart.addItemsToCart([{code: 'C', quantity: '4'}])).toThrow('Invalid item format');
        expect(shoppingCart.getTotal()).toBe(0);
    });

    test('throw error for lowercase codes to enforce strict case-sensitivity', () => {
        const shoppingCart = new ShoppingCart();
        expect(() => shoppingCart.addItemsToCart([{code: 'a', quantity: 2}])).toThrow('Unknown product code a');
        expect(shoppingCart.getTotal()).toBe(0);
    });

    test('throw error for negative quantity values', () => {
        const shoppingCart = new ShoppingCart();
        expect(() => shoppingCart.addItemsToCart([{code: 'A', quantity: -1}])).toThrow('Quantity must be a positive integer');
        expect(shoppingCart.getTotal()).toBe(0);
    });

    test('throw error for zero quantity values', () => {
        const shoppingCart = new ShoppingCart();
        expect(() => shoppingCart.addItemsToCart([{code: 'A', quantity: 0}])).toThrow('Quantity must be a positive integer');
        expect(shoppingCart.getTotal()).toBe(0);
    });

    test('throw error for non-integer (decimal) quantities', () => {
        const shoppingCart = new ShoppingCart();
        expect(() => shoppingCart.addItemsToCart([{code: 'B', quantity: 2.5}])).toThrow('Invalid item format');
        expect(shoppingCart.getTotal()).toBe(0);
    });

});