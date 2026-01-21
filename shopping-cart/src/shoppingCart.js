const pricing = {
    A: {unitPrice: 50, specialPrice: {quantity: 3, price: 140}},
    B: {unitPrice: 35, specialPrice: {quantity: 2, price: 60}},
    C: {unitPrice: 25, specialPrice: null},
    D: {unitPrice: 12, specialPrice: null}
};

class ShoppingCart {
    constructor() {
        this.cart = {};
    }

    addItemToCart(item) {
        const {code, quantity} = item;

        if (this.cart[code]) {
            this.cart[code] += quantity;
        } else {
            this.cart[code] = quantity;
        }
        return this.cart;
    }
    addItemsToCart(items) {
        // Input Validation
        if (!Array.isArray(items)) {
            throw new Error('Items should be an array');
        } 
        
        const validItems = []
        const invalidItems = []

        items.forEach(item => {
            const valid = this.validateItem(item);
            if (valid) {
                invalidItems.push({ item, error: valid });
            } else {
                validItems.push(item);
            }
        });
        
        validItems.forEach(item => this.addItemToCart(item));
        if (invalidItems.length > 0) {
            const errorMessages = invalidItems.map(({item, error}) => error).join('; ');
            throw new Error(errorMessages);
        }
    }
    validateItem(item) {
        if (
            !item.hasOwnProperty('code') ||
            !item.hasOwnProperty('quantity') ||
            typeof item.code !== 'string' ||
            typeof item.quantity !== 'number' ||
            !Number.isInteger(item.quantity)
        ) {
            return 'Invalid item format';
        }
        if (!pricing.hasOwnProperty(item.code)) {
            return `Unknown product code ${item.code}`;
        }
        if (item.quantity <= 0) {
            return 'Quantity must be a positive number';
        }
        return null;
    }
    getTotal() {
        let total = 0;
        for (const code in this.cart) {
            const quantity = this.cart[code];
            const {unitPrice, specialPrice} = pricing[code];

            if (specialPrice) {
                const specialOffers = Math.floor(quantity / specialPrice.quantity);
                const remainder = quantity % specialPrice.quantity;
                total += (specialOffers * specialPrice.price) + (remainder * unitPrice);
            } else {
                total += quantity * unitPrice;
            }
        }
        return total;
    }
}

module.exports = ShoppingCart;