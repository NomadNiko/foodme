import { Cocktail, UserCocktail, SearchFilters } from '../types/cocktail';
import { cocktailDB } from '../database/cocktailDB';

// Combined cocktail type for search results
export type CombinedCocktail = (Cocktail | UserCocktail) & {
  isUserCocktail?: boolean;
};

/**
 * Search both regular cocktails and user cocktails, prioritizing user cocktails
 */
export function searchAllCocktails(
  query: string,
  filters?: SearchFilters,
  limit: number = 50
): CombinedCocktail[] {
  // In development mode, only search regular cocktails
  const regularCocktails = cocktailDB.searchCocktails(query, filters);
  
  return regularCocktails
    .map(cocktail => ({ ...cocktail, isUserCocktail: false }))
    .slice(0, limit);
}

/**
 * Get all cocktails available at a specific venue
 */
export function getVenueAllCocktails(venueId: string): CombinedCocktail[] {
  // In development mode, return all cocktails
  const allCocktails = cocktailDB.getAllCocktails();
  
  return allCocktails.map(cocktail => ({ ...cocktail, isUserCocktail: false }));
}
