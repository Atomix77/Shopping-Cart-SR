const ShoppingCart = require('../src/shoppingCart');

describe('ShoppingCart-Valid', () => {
    // Test cases for valid scenarios

    test('Empty Cart', () => {
        const shoppingCart = new ShoppingCart();
        expect(shoppingCart.getTotal()).toBe(0);
    });

    test('Empty Array', () => {
        const shoppingCart = new ShoppingCart();
        shoppingCart.addItemsToCart([]);
        expect(shoppingCart.getTotal()).toBe(0);
    });

    test('Add Item', () => {
        const shoppingCart = new ShoppingCart();
        shoppingCart.addItemsToCart([
            {code: 'A', quantity: 1}
        ]);
        expect(shoppingCart.getTotal()).toBe(50);
    });

    test('Add Same Item to Cart Separately', () => {
        const shoppingCart = new ShoppingCart();
        shoppingCart.addItemsToCart([
            {code: 'A', quantity: 1}
        ]);
        shoppingCart.addItemsToCart([
            {code: 'A', quantity: 2}
        ]);
        expect(shoppingCart.getTotal()).toBe(140);
    });

    test('Add Same Item Multiple Times in One Go', () => {
        const shoppingCart = new ShoppingCart();
        shoppingCart.addItemsToCart([
            {code: 'B', quantity: 1},
            {code: 'B', quantity: 2}
        ]);
        expect(shoppingCart.getTotal()).toBe(95);
    });

    test('Add Multiple Items', () => {
        const shoppingCart = new ShoppingCart();
        shoppingCart.addItemsToCart([
            {code: 'A', quantity: 2}
        ]);
        expect(shoppingCart.getTotal()).toBe(100);
    });

    test('Special Price', () => {
        const shoppingCart = new ShoppingCart();
        shoppingCart.addItemsToCart([
            {code: 'A', quantity: 3}
        ]);
        expect(shoppingCart.getTotal()).toBe(140);
    });

    test('Add Multiple Single Items to the Cart', () => {
        const shoppingCart = new ShoppingCart();
        shoppingCart.addItemsToCart([
            {code: 'A', quantity: 1},
            {code: 'B', quantity: 1},
            {code: 'C', quantity: 1}
        ]);
        expect(shoppingCart.getTotal()).toBe(110);
    });

    test('Add Multiple Different Amounts of Items to the Cart', () => {
        const shoppingCart = new ShoppingCart();
        shoppingCart.addItemsToCart([
            {code: 'A', quantity: 3},
            {code: 'B', quantity: 2},
            {code: 'C', quantity: 1},
            {code: 'D', quantity: 1}
        ]);
        expect(shoppingCart.getTotal()).toBe(237);
    });

    test('Item Quantity Exceeding Special Price Offer', () => {
        const shoppingCart = new ShoppingCart();
        shoppingCart.addItemsToCart([
            {code: 'A', quantity: 4}
        ]);
        expect(shoppingCart.getTotal()).toBe(190);
    });

    test('Item Quantity Exceeding Special Price Offer and Item Quantity Causing 2 Special Offers', () => {
        const shoppingCart = new ShoppingCart();
        shoppingCart.addItemsToCart([
            {code: 'A', quantity: 4},
            {code: 'B', quantity: 4},
            {code: 'C', quantity: 1},
            {code: 'D', quantity: 2}
        ]);
        expect(shoppingCart.getTotal()).toBe(359);
    });  

    test('Large Quantities of Items', () => {
        const shoppingCart = new ShoppingCart();
        shoppingCart.addItemsToCart([
            {code: 'A', quantity: 10},
            {code: 'B', quantity: 10},
            {code: 'C', quantity: 10},
            {code: 'D', quantity: 10}
        ]);
        expect(shoppingCart.getTotal()).toBe(1140);
    });

    test('Very Large Quantities of Items', () => {
        const shoppingCart = new ShoppingCart();
        shoppingCart.addItemsToCart([
            {code: 'A', quantity: 1000},
            {code: 'B', quantity: 1000},
            {code: 'C', quantity: 1000},
            {code: 'D', quantity: 1000}
        ]);
        expect(shoppingCart.getTotal()).toBe(113670);
    });

    test('Order of Items Does Not Matter', () => {
        const shoppingCart1 = new ShoppingCart();
        shoppingCart1.addItemsToCart([
            {code: 'A', quantity: 3},
            {code: 'B', quantity: 2},
            {code: 'C', quantity: 1},
            {code: 'D', quantity: 1}
        ]);
        expect(shoppingCart1.getTotal()).toBe(237);

        const shoppingCart2 = new ShoppingCart();
        shoppingCart2.addItemsToCart([
            {code: 'D', quantity: 1},
            {code: 'C', quantity: 1},
            {code: 'B', quantity: 2},
            {code: 'A', quantity: 3}
        ]);
        expect(shoppingCart2.getTotal()).toBe(237);
    });

    test('One Invalid Item Among Valid Items', () => {
        const shoppingCart = new ShoppingCart();
        expect(() => shoppingCart.addItemsToCart([
            {code: 'A', quantity: 2},
            {code: 'E', quantity: 1},
            {code: 'B', quantity: 1}
        ])).toThrow('Unknown product code E');
        expect(shoppingCart.getTotal()).toBe(135);
    });

    test('Multiple Invalid Items Among Valid Items', () => {
        const shoppingCart = new ShoppingCart();
        expect(() => shoppingCart.addItemsToCart([
            {code: 'A', quantity: 2},
            {code: 'E', quantity: 1},
            {code: 'B', quantity: -1},
            {code: 'C', quantity: 3},
            {code: 'X', quantity: 5}
        ])).toThrow('Unknown product code E; Quantity must be a positive number; Unknown product code X');
        expect(shoppingCart.getTotal()).toBe(175);
    });

});

describe('ShoppingCart-Invalid', () => {
    // Test cases for invalid scenarios

    test('No Input', () => {
        const shoppingCart = new ShoppingCart();
        expect(() => shoppingCart.addItemsToCart()).toThrow('Items should be an array');
        expect(shoppingCart.getTotal()).toBe(0);
    });

    test('Null Input', () => {
        const shoppingCart = new ShoppingCart();
        expect(() => shoppingCart.addItemsToCart(null)).toThrow('Items should be an array');
        expect(shoppingCart.getTotal()).toBe(0);
    });

    test('Empty Non-array Input', () => {
        const shoppingCart = new ShoppingCart();
        expect(() => shoppingCart.addItemsToCart('')).toThrow('Items should be an array');
        expect(shoppingCart.getTotal()).toBe(0);
    });

    test('Non-array Input', () => {
        const shoppingCart = new ShoppingCart();
        expect(() => shoppingCart.addItemsToCart({code: 'A', quantity: 1})).toThrow('Items should be an array');
        expect(shoppingCart.getTotal()).toBe(0);
    });

    test('Unknown Product Code', () => {
        const shoppingCart = new ShoppingCart();
        expect(() => shoppingCart.addItemsToCart([{code: 'E', quantity: 1}])).toThrow('Unknown product code E');
        expect(shoppingCart.getTotal()).toBe(0);
    });

    test('Invalid Item Format', () => {
        const shoppingCart = new ShoppingCart();
        expect(() => shoppingCart.addItemsToCart([{code: 'A', qty: 1}])).toThrow('Invalid item format');
        expect(() => shoppingCart.addItemsToCart([{cod: 'A', quantity: 1}])).toThrow('Invalid item format');
        expect(() => shoppingCart.addItemsToCart([{code: 7, quantity: 3}])).toThrow('Invalid item format');
        expect(() => shoppingCart.addItemsToCart([{code: 'C', quantity: '4'}])).toThrow('Invalid item format');
        expect(shoppingCart.getTotal()).toBe(0);
    });

    test('Lowercase Item Code', () => {
        const shoppingCart = new ShoppingCart();
        expect(() => shoppingCart.addItemsToCart([
            {code: 'a', quantity: 2}
        ])).toThrow('Unknown product code a');
        expect(shoppingCart.getTotal()).toBe(0);
    });

    test('Negative Quantity', () => {
        const shoppingCart = new ShoppingCart();
        expect(() => shoppingCart.addItemsToCart([{code: 'A', quantity: -1}])).toThrow('Quantity must be a positive number');
        expect(shoppingCart.getTotal()).toBe(0);
    });

    test('Zero Quantity', () => {
        const shoppingCart = new ShoppingCart();
        expect(() => shoppingCart.addItemsToCart([{code: 'A', quantity: 0}])).toThrow('Quantity must be a positive number');
        expect(shoppingCart.getTotal()).toBe(0);
    });

    test('Test Non-integer Quantity', () => {
        const shoppingCart = new ShoppingCart();
        expect(() => shoppingCart.addItemsToCart([{code: 'B', quantity: 2.5}])).toThrow('Invalid item format');
        expect(shoppingCart.getTotal()).toBe(0);
    });

});