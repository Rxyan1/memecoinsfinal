// Bonding curve parameters
const SLOPE = 0.01; // a parameter
const BASE_PRICE = 1; // b parameter

/**
 * Calculate the current price per token based on supply
 * P = a * S + b
 */
export function getCurrentPrice(supply: number): number {
  return SLOPE * supply + BASE_PRICE;
}

/**
 * Calculate the total cost to buy a specific quantity of tokens
 * C = a * ((S + X)^2 - S^2) / 2 + X * b
 */
export function getBuyCost(supply: number, quantity: number): number {
  return SLOPE * (Math.pow(supply + quantity, 2) - Math.pow(supply, 2)) / 2 + quantity * BASE_PRICE;
}

/**
 * Calculate the amount received when selling tokens
 * R = a * ((S^2 - (S - X)^2)) / 2 + X * b
 */
export function getSellReturn(supply: number, quantity: number): number {
  // Ensure we don't try to sell more than the supply
  if (quantity > supply) quantity = supply;
  return SLOPE * (Math.pow(supply, 2) - Math.pow(supply - quantity, 2)) / 2 + quantity * BASE_PRICE;
}

/**
 * Format a price to a readable string with 4 decimals max
 */
export function formatPrice(price: number): string {
  return price.toFixed(4);
}
