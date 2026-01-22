// Development stubs for user context hooks
// These provide the same interface but don't require UserProvider

import { useCallback, useMemo } from 'react';

export function useUser() {
  const userData = useMemo(() => null, []);
  const refreshUserData = useCallback(async () => {}, []);
  const clearCustomData = useCallback(async () => {}, []);

  return useMemo(() => ({
    userData,
    isLoading: false,
    error: null,
    refreshUserData,
    clearCustomData
  }), [userData, refreshUserData, clearCustomData]);
}

export function useUserSettings() {
  const settings = useMemo(() => ({ subscriptionStatus: 'premium' }), []);
  const updateSettings = useCallback(async () => {}, []);

  return useMemo(() => ({
    settings,
    updateSettings
  }), [settings, updateSettings]);
}

export function useFavorites() {
  const favorites = useMemo(() => [], []);
  const addFavorite = useCallback(async () => {}, []);
  const removeFavorite = useCallback(async () => {}, []);
  const isFavorite = useCallback(() => false, []);
  const clearAllFavorites = useCallback(async () => {}, []);

  return useMemo(() => ({
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    clearAllFavorites
  }), [favorites, addFavorite, removeFavorite, isFavorite, clearAllFavorites]);
}

export function useVenues() {
  const venues = useMemo(() => [], []);
  const createVenue = useCallback(async () => ({ 
    id: 'dev-venue', 
    name: 'Dev Venue', 
    ingredients: [], 
    cocktailIds: [], 
    customCocktailIds: [], 
    createdAt: '', 
    updatedAt: '', 
    isDefault: false 
  }), []);
  const updateVenue = useCallback(async () => {}, []);
  const deleteVenue = useCallback(async () => {}, []);
  const addIngredientToVenue = useCallback(async () => {}, []);
  const removeIngredientFromVenue = useCallback(async () => {}, []);
  const addCocktailToVenue = useCallback(async () => {}, []);
  const removeCocktailFromVenue = useCallback(async () => {}, []);
  const clearAllVenues = useCallback(async () => {}, []);

  return useMemo(() => ({
    venues,
    createVenue,
    updateVenue,
    deleteVenue,
    addIngredientToVenue,
    removeIngredientFromVenue,
    addCocktailToVenue,
    removeCocktailFromVenue,
    clearAllVenues
  }), [venues, createVenue, updateVenue, deleteVenue, addIngredientToVenue, removeIngredientFromVenue, addCocktailToVenue, removeCocktailFromVenue, clearAllVenues]);
}

export function useUserCocktails() {
  const getAllUserCocktails = useCallback(() => [], []);
  const createUserCocktail = useCallback(async () => ({ 
    id: 'dev-cocktail', 
    name: 'Dev Cocktail', 
    ingredients: [], 
    instructions: { steps: [] }, 
    createdAt: '', 
    updatedAt: '' 
  }), []);
  const updateUserCocktail = useCallback(async () => {}, []);
  const deleteUserCocktail = useCallback(async () => {}, []);
  const clearAllUserCocktails = useCallback(async () => {}, []);

  return useMemo(() => ({
    getAllUserCocktails,
    createUserCocktail,
    updateUserCocktail,
    deleteUserCocktail,
    clearAllUserCocktails
  }), [getAllUserCocktails, createUserCocktail, updateUserCocktail, deleteUserCocktail, clearAllUserCocktails]);
}
