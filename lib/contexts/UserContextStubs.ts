// Development stubs for user context hooks
// These provide the same interface but don't require UserProvider

export function useUser() {
  return {
    userData: null,
    isLoading: false,
    error: null,
    refreshUserData: async () => {},
    clearCustomData: async () => {}
  };
}

export function useUserSettings() {
  return {
    settings: { subscriptionStatus: 'premium' }, // Always premium in dev
    updateSettings: async () => {}
  };
}

export function useFavorites() {
  return {
    favorites: [],
    addFavorite: async () => {},
    removeFavorite: async () => {},
    isFavorite: () => false,
    clearAllFavorites: async () => {}
  };
}

export function useVenues() {
  return {
    venues: [],
    createVenue: async () => ({ id: 'dev-venue', name: 'Dev Venue', ingredients: [], cocktailIds: [], customCocktailIds: [], createdAt: '', updatedAt: '', isDefault: false }),
    updateVenue: async () => {},
    deleteVenue: async () => {},
    addIngredientToVenue: async () => {},
    removeIngredientFromVenue: async () => {},
    addCocktailToVenue: async () => {},
    removeCocktailFromVenue: async () => {},
    clearAllVenues: async () => {}
  };
}

export function useUserCocktails() {
  return {
    getAllUserCocktails: () => [],
    createUserCocktail: async () => ({ id: 'dev-cocktail', name: 'Dev Cocktail', ingredients: [], instructions: { steps: [] }, createdAt: '', updatedAt: '' }),
    updateUserCocktail: async () => {},
    deleteUserCocktail: async () => {},
    clearAllUserCocktails: async () => {}
  };
}
