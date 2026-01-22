// App Store identification stub for development
export function useAppStoreIdentification() {
  return {
    hasProSubscription: true, // Always pro in development
    refreshCustomerInfo: async () => {},
    customerInfo: null
  };
}
