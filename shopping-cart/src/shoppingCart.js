/**
 * Shopping Cart Checkout System
 *
 * A simple checkout system that calculates totals with support for special pricing offers (e.g. "3 for 140").
 * 
 * @module ShoppingCart
 */

/**
 * Pricing rules for the available products.
 * 
 * Each product has a unit price and some products have a special offer.
 * 
 * @constant {Object.<string, {unitPrice: number, specialPrice: ?{quantity: number, price: number}}>}
 */
const pricing = {
    A: {unitPrice: 50, specialPrice: {quantity: 3, price: 140}},
    B: {unitPrice: 35, specialPrice: {quantity: 2, price: 60}},
    C: {unitPrice: 25, specialPrice: null},
    D: {unitPrice: 12, specialPrice: null}
};

/**
 * ShoppingCart class for managing items and calculating totals.
 * 
 * @class
 * @example
 * const cart = new ShoppingCart();
 * cart.addItemsToCart([{code: 'A', quantity: 3}]);
 * console.log(cart.getTotal()); // returns 140
 */
class ShoppingCart {
    /**
     * Creates a new ShoppingCart instance with an empty cart.
     * @type {Object.<string, number>} - The cart object storing item codes and their quantities.
     */
    constructor() {
        this.cart = {};
    }

    /**
     * Adds multiple items to the cart with validation.
     * 
     * Validates all items first, adds valid ones to the cart, then throws an error listing any invalid items.
     * 
     * @param {Array<{code: string, quantity: number}>} items - Array of items to add. Quantity must be an integer.
     * @throws {Error} - "Items should be an array" - If input is not an array.
     * @throws {Error} - "Invalid item format" - If item is missing required properties or quantity is not an integer.
     * @throws {Error} - "Unknown product code X" - If product code is not in pricing rules.
     * @throws {Error} - "Quantity must be a positive integer" - If quantity <= 0.
     * 
     * @example
     * cart.addItemsToCart([
     *   {code: 'A', quantity: 2},
     *   {code: 'B', quantity: 1}
     * ]);
     */
    addItemsToCart(items) {
        if (!Array.isArray(items)) {
            throw new Error('Items should be an array');
        } 
        
        // Separate valid and invalid items
        const {validItems, invalidItems} = this.separateValidAndInvalidItems(items);

        // Add valid items to cart
        this.addValidItemsToCart(validItems);

        // Throws all errors for invalid items
        if (invalidItems.length > 0) {
            const errorMessages = invalidItems.map(({item, error}) => error).join('; ');
            throw new Error(errorMessages);
        }
    }

    /**
     * Adds items to the cart. If an item already exists, the quantity is added.
     * 
     * @private
     * @param {Object[]} items - The items to add.
     * @param {string} items[].code - The product code (A, B, C, or D).
     * @param {number} items[].quantity - The quantity to add. Quantity must be an integer.
     * @returns {Object.<string, number>} - The updated cart state.
     */
    addValidItemsToCart(items) {
        items.forEach(item => {
            const {code, quantity} = item;

            if (this.cart[code]) {
                this.cart[code] += quantity;
            } else {
                this.cart[code] = quantity;
            }
        });
        return this.cart;
    }

    /**
     * Separates valid and invalid items from the input array.
     *
     * @private
     * @param {Array<{code: string, quantity: number}>} items - Array of items to validate. Quantity must be an integer.
     * @returns {{validItems: Array, invalidItems: Array}} - Object containing arrays of valid and invalid items.
     */
    separateValidAndInvalidItems(items) {
        const validItems = [];
        const invalidItems = [];

        // Separates valid and invalid items
        items.forEach(item => {
            const validationError = this.validateItem(item);
            if (validationError) {
                invalidItems.push({ item, error: validationError });
            } else {
                validItems.push(item);
            }
        });
        return {validItems, invalidItems};
    }

    /**
     * Validates a single item against the expected format and pricing rules.
     * 
     * @private
     * @param {Object} item - The item to validate.
     * @returns {?string} Error message if invalid, null if valid.
     */
    validateItem(item) {
        // Check required properties and types
        if (
            !item.hasOwnProperty('code') ||
            !item.hasOwnProperty('quantity') ||
            typeof item.code !== 'string' ||
            typeof item.quantity !== 'number' ||
            !Number.isInteger(item.quantity)
        ) {
            return 'Invalid item format';
        }

        // Check if product code exists in pricing rules
        if (!pricing.hasOwnProperty(item.code)) {
            return `Unknown product code ${item.code}`;
        }

        // Check for positive quantity
        if (item.quantity <= 0) {
            return 'Quantity must be a positive integer';
        }

        return null;
    }

    /**
     * Calculates the total price of all items in the cart,
     * applying special pricing offers where applicable.
     * 
     * @returns {number} The calculated total of the cart.
     * 
     * @example
     * With special pricing: 3 × A = 140 (not 150)
     * cart.addItemsToCart([{code: 'A', quantity: 3}]);
     * cart.getTotal(); // Returns 140
     * 
     * @example
     * Mixed: 4 × A = 140 + 50 = 190
     * cart.addItemsToCart([{code: 'A', quantity: 4}]);
     * cart.getTotal(); // Returns 190
     */
    getTotal() {
        let total = 0;

        for (const code in this.cart) {
            const quantity = this.cart[code];
            const {unitPrice, specialPrice} = pricing[code];

            if (specialPrice) {
                // Calculate how many special offers apply
                const specialOffers = Math.floor(quantity / specialPrice.quantity);
                const remainder = quantity % specialPrice.quantity;

                // Apply special price + regular price for remainder
                total += (specialOffers * specialPrice.price) + (remainder * unitPrice);
            } else {
                // No special offer, use unit price
                total += quantity * unitPrice;
            }
        }

        return total;
    }
}

module.exports = ShoppingCart;