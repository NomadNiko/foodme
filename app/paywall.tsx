import React, { useEffect, useState } from 'react';
import { View, Pressable, ScrollView, StatusBar, ActivityIndicator, Alert, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Text } from '~/components/nativewindui/Text';
import { useRouter } from 'expo-router';
import { useUserSettings } from '~/lib/contexts/UserContext';
import { useAppStoreIdentification } from '~/lib/hooks/useAppStoreIdentification';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Purchases from 'react-native-purchases';
import Constants from 'expo-constants';
import { Linking } from 'react-native';
import { APP_CONFIG } from '~/config/app';

interface SubscriptionOption {
  id: string;
  title: string;
  price: string;
  period?: string;
  highlight?: boolean;
}

const handlePrivacyPress = () => {
  Linking.openURL(APP_CONFIG.privacyPolicyUrl);
};

const handleTermsPress = () => {
  Linking.openURL('https://www.apple.com/legal/internet-services/itunes/dev/stdeula/');
};

// Platform-specific product IDs
// NOTE: On Android, we fetch with the simple ID but the product returns with colon format for subscriptions
const getProductId = (baseId: string): string => {
  if (Platform.OS === 'android') {
    // Android: Use simple IDs for fetching
    switch (baseId) {
      case 'monthly':
        return 'bv_499_monthly_01';  // Will return as bv_499_monthly_01:bv-499-monthly-01
      case 'yearly':
        return 'bv_2499_yearly_01';   // Will return as bv_2499_yearly_01:bv-2499-yearly-01
      case 'lifetime':
        return 'us.nomadsoft.barvibez.lifetime';  // lowercase for Android
      default:
        return baseId;
    }
  } else {
    // iOS product IDs
    switch (baseId) {
      case 'monthly':
        return 'bv_499_monthly_01';
      case 'yearly':
        return 'bv_2499_yearly_01';
      case 'lifetime':
        return 'us.nomadsoft.barvibez.Lifetime';  // Uppercase for iOS
      default:
        return baseId;
    }
  }
};

export default function PayWallScreen() {
  const router = useRouter();
  const { settings, updateSettings } = useUserSettings();
  const { hasProSubscription } = useAppStoreIdentification();
  const insets = useSafeAreaInsets();
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingOptionId, setProcessingOptionId] = useState<string | null>(null);
  const [purchaseError, setPurchaseError] = useState<string | null>(null);

  // Create subscription options - conditionally include lifetime for Android
  const subscriptionOptions: SubscriptionOption[] = [
    { id: getProductId('monthly'), title: 'Monthly Premium Access', price: '$4.99', period: 'monthly' },
    { id: getProductId('yearly'), title: 'Yearly Premium Access', price: '$24.99', period: 'yearly' },
  ];
  
  // Add lifetime option - it works on iOS, but may not be available on Android yet
  if (Platform.OS === 'ios' || Platform.OS === 'android') {
    subscriptionOptions.push({
      id: getProductId('lifetime'),
      title: 'Lifetime Premium Access',
      price: '$34.99',
      period: 'one-time',
      highlight: true,
    });
  }

  // Fetch and verify products on mount (only in dev/debug mode)
  useEffect(() => {
    const verifyProducts = async () => {
      if (Platform.OS !== 'android') return; // Only needed for Android debugging
      
      try {
        console.log('=== Verifying Android Product Availability ===');
        
        // Test subscriptions separately from in-app products
        console.log('Testing SUBSCRIPTIONS:');
        const subscriptionIds = [
          'bv_499_monthly_01',
          'bv_2499_yearly_01',
        ];
        
        for (const id of subscriptionIds) {
          try {
            const products = await Purchases.getProducts([id]);
            if (products.length > 0) {
              console.log(`✓ ${id} -> ${products[0].identifier}`);
            } else {
              console.log(`✗ ${id} -> Not found`);
            }
          } catch (error) {
            console.log(`✗ ${id} -> Error: ${error.message}`);
          }
        }
        
        console.log('\nTesting IN-APP PRODUCTS (non-consumables):');
        // Try different methods for the in-app product
        const inAppIds = [
          'us.nomadsoft.barvibez.lifetime',  // This is the correct Android ID
        ];
        
        for (const id of inAppIds) {
          try {
            const products = await Purchases.getProducts([id]);
            if (products.length > 0) {
              console.log(`✓ ${id} -> ${products[0].identifier}`);
            } else {
              console.log(`✗ ${id} -> Not found`);
            }
          } catch (error) {
            console.log(`✗ ${id} -> Error: ${error.message}`);
          }
        }
        
        // Try fetching subscriptions and in-app products separately
        console.log('\nTrying separate batch fetches:');
        try {
          const subs = await Purchases.getProducts(['bv_499_monthly_01', 'bv_2499_yearly_01']);
          console.log(`Subscriptions batch: Found ${subs.length}`);
          
          const inapp = await Purchases.getProducts(['us.nomadsoft.barvibez.lifetime']);
          console.log(`In-app products batch: Found ${inapp.length}`);
        } catch (error) {
          console.log(`Separate batch error: ${error.message}`);
        }
        
        console.log('=====================================');
      } catch (error) {
        console.error('Product verification error:', error);
      }
    };
    
    // Delay slightly to ensure RevenueCat is fully initialized
    setTimeout(verifyProducts, 1000);
  }, []);

  // Redirect premium users away from paywall
  useEffect(() => {
    const checkAndRedirect = async () => {
      if (hasProSubscription()) {
        console.log('User already has Pro subscription, redirecting away from paywall');
        // Small delay to prevent multiple rapid redirects
        setTimeout(() => {
          if (router.canGoBack()) {
            router.back();
          } else {
            router.replace('/popular');
          }
        }, 100);
      }
    };

    checkAndRedirect();
  }, [hasProSubscription]);

  const handlePurchase = async (optionId: string) => {
    setIsProcessing(true);
    setProcessingOptionId(optionId);
    setPurchaseError(null);

    console.log(`Platform.OS: ${Platform.OS}`);
    console.log(`Attempting purchase with product ID: ${optionId}`);
    
    // Log what we're expecting based on the platform
    if (Platform.OS === 'android') {
      console.log('Android product mapping:');
      console.log('- Monthly: bv_499_monthly_01 (may return as bv_499_monthly_01:bv-499-monthly-01)');
      console.log('- Yearly: bv_2499_yearly_01 (may return as bv_2499_yearly_01:bv-2499-yearly-01)');
    }

    try {
      // Get fresh customer info to check current subscription status
      console.log('Checking current subscription status before purchase...');
      const currentCustomerInfo = await Purchases.getCustomerInfo();

      const revenueCatConfig = Constants.expoConfig?.extra?.revenueCat;
      const entitlementIdentifier = revenueCatConfig?.entitlementIdentifier || 'Pro';
      const currentlyHasPro =
        currentCustomerInfo.entitlements.active[entitlementIdentifier]?.isActive;

      if (currentlyHasPro) {
        console.log('Purchase blocked: User already has Pro subscription');
        Alert.alert(
          'Already Subscribed',
          'You already have an active subscription. If you need to change your subscription, please manage it in Settings > Subscriptions.',
          [{ text: 'OK' }]
        );
        setIsProcessing(false);
        setProcessingOptionId(null);
        return;
      }

      console.log('Starting RevenueCat purchase for product:', optionId);

      // Get the product from RevenueCat
      let products = [];
      try {
        products = await Purchases.getProducts([optionId]);
        console.log(`Fetched ${products.length} products for ID: ${optionId}`);
        if (products.length > 0) {
          console.log('Product details:', products.map(p => ({ id: p.identifier, title: p.title, price: p.price })));
        }
      } catch (fetchError) {
        console.error('Error fetching product:', fetchError);
        // For Android subscriptions, try without the colon format if initial fetch fails
        if (Platform.OS === 'android' && (optionId.includes('monthly') || optionId.includes('yearly'))) {
          console.log('Retrying product fetch for Android subscription...');
          // Already using the simple format, so just log the error
          throw new Error(`Unable to fetch subscription product. Please ensure you have an active internet connection and try again.`);
        }
        throw fetchError;
      }
      
      // On Android, the returned identifier might be different (with colon format)
      // So we need to be flexible in matching
      let product = products.find((p) => p.identifier === optionId);
      
      // If not found with exact match, try to find any product returned
      // This handles Android's colon format (e.g., bv_499_monthly_01:bv-499-monthly-01)
      if (!product && products.length > 0) {
        product = products[0];
        console.log(`Product ID mismatch - requested: ${optionId}, got: ${product.identifier}`);
      }

      if (!product) {
        // Special handling for lifetime product on Android
        if (Platform.OS === 'android' && optionId.includes('lifetime')) {
          throw new Error('Lifetime purchase is not yet available on Android. Please choose Monthly or Yearly subscription.');
        }
        throw new Error(`Product not found: ${optionId}`);
      }

      console.log('Found product:', product.identifier, product.title);
      
      // IMPORTANT: For Android, check if this is a test environment issue
      if (Platform.OS === 'android') {
        console.log('Android purchase attempt with product:', {
          identifier: product.identifier,
          price: product.price,
          title: product.title,
          productCategory: product.productCategory,
          productType: product.productType,
        });
        
        // Check if the app is properly configured for purchases
        try {
          const customerInfo = await Purchases.getCustomerInfo();
          console.log('Customer info before purchase:', {
            originalAppUserId: customerInfo.originalAppUserId,
            activeSubscriptions: customerInfo.activeSubscriptions,
          });
        } catch (error) {
          console.error('Error getting customer info:', error);
        }
      }

      // Make the purchase through RevenueCat
      let purchaseResult;
      try {
        purchaseResult = await Purchases.purchaseStoreProduct(product);
      } catch (purchaseError: any) {
        // Special handling for Android test environment
        if (Platform.OS === 'android' && purchaseError.message?.includes('not available for purchase')) {
          console.error('Android purchase error - likely a test environment issue');
          throw new Error(
            'Unable to complete purchase. Please ensure:\n' +
            '1. You are using a Google Play test account\n' +
            '2. The app is signed with the release key\n' +
            '3. Products are active in Google Play Console\n\n' +
            'Original error: ' + purchaseError.message
          );
        }
        throw purchaseError;
      }

      console.log('Purchase result:', {
        productIdentifier: purchaseResult.productIdentifier,
        customerInfo: purchaseResult.customerInfo?.originalAppUserId,
        entitlements: Object.keys(purchaseResult.customerInfo?.entitlements.active || {}),
      });

      // Check if user has Pro entitlement
      const hasProEntitlement =
        purchaseResult.customerInfo?.entitlements.active[entitlementIdentifier]?.isActive;

      if (hasProEntitlement) {
        console.log('Purchase successful - updating user to premium');

        // Use UserDataManager directly to ensure proper data flow
        const { UserDataManager } = await import('~/lib/services/userDataManager');
        UserDataManager.updateSubscriptionStatusFromRevenueCat(hasProEntitlement);

        // Also update settings as backup
        await updateSettings({ subscriptionStatus: 'premium' });

        // Small delay to ensure all listeners have processed the change
        setTimeout(() => {
          // Navigate back to the main app
          if (router.canGoBack()) {
            router.back();
          } else {
            router.replace('/popular');
          }
        }, 100);
      } else {
        console.warn('Purchase completed but Pro entitlement not active');
        Alert.alert(
          'Purchase Issue',
          'Purchase completed but subscription not activated. Please contact support.',
          [{ text: 'OK' }]
        );
      }
    } catch (error: any) {
      console.error('RevenueCat purchase failed:', error);

      // Handle user cancellation gracefully
      if (error?.userCancelled) {
        console.log('User cancelled the purchase');
        // Don't show error for cancellation
      } else {
        const errorMessage = error?.message || 'Purchase failed. Please try again.';
        Alert.alert('Purchase Failed', errorMessage, [{ text: 'OK' }]);
      }
    } finally {
      setIsProcessing(false);
      setProcessingOptionId(null);
    }
  };

  const handleRestorePurchases = async () => {
    setIsProcessing(true);
    setPurchaseError(null);

    try {
      console.log('Restoring RevenueCat purchases...');

      // Restore purchases through RevenueCat
      const customerInfo = await Purchases.restorePurchases();

      console.log('Restore result:', {
        originalAppUserId: customerInfo.originalAppUserId,
        entitlements: Object.keys(customerInfo.entitlements.active || {}),
      });

      // Check if user has Pro entitlement after restore
      const revenueCatConfig = Constants.expoConfig?.extra?.revenueCat;
      const entitlementIdentifier = revenueCatConfig?.entitlementIdentifier || 'Pro';
      const hasProEntitlement = customerInfo.entitlements.active[entitlementIdentifier]?.isActive;

      if (hasProEntitlement) {
        console.log('Restore successful - updating user to premium');

        // Use UserDataManager directly to ensure proper data flow
        const { UserDataManager } = await import('~/lib/services/userDataManager');
        UserDataManager.updateSubscriptionStatusFromRevenueCat(hasProEntitlement);

        // Also update settings as backup
        await updateSettings({ subscriptionStatus: 'premium' });

        // Small delay to ensure all listeners have processed the change
        setTimeout(() => {
          // Navigate back to the main app
          if (router.canGoBack()) {
            router.back();
          } else {
            router.replace('/popular');
          }
        }, 100);
      } else {
        console.log('No active subscription found to restore');
        Alert.alert('No Purchases Found', 'No active purchases found to restore.', [
          { text: 'OK' },
        ]);
      }
    } catch (error: any) {
      console.error('RevenueCat restore failed:', error);
      const errorMessage = error?.message || 'Failed to restore purchases. Please try again.';
      Alert.alert('Restore Failed', errorMessage, [{ text: 'OK' }]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubscriptionSelect = async (optionId: string) => {
    if (optionId === 'free') {
      // User chose to continue with free - go to main app
      // Don't change subscription status as they're already free
      router.replace('/popular');
    } else {
      // Directly process the purchase instead of navigating to another screen
      await handlePurchase(optionId);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#000000' }}>
      <StatusBar barStyle="light-content" />
      <View
        style={{
          flex: 1,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingHorizontal: 24,
        }}>
        {/* Content */}
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
          showsVerticalScrollIndicator={false}>
          {/* Logo */}
          <View className="mb-6 items-center">
            <Image
              source={require('../assets/BarVibesLogo3.png')}
              style={{ width: 200, height: 90 }}
              contentFit="contain"
            />
          </View>

          {/* Features */}
          <View className="mb-6">
            <View className="mb-2 flex-row items-center">
              <FontAwesome name="check-circle" size={18} color="#4CAF50" />
              <Text className="ml-3 text-sm text-white">
                {'Access to over 2000 unique drink recipes'}
              </Text>
            </View>
            <View className="mb-2 flex-row items-center">
              <FontAwesome name="check-circle" size={18} color="#4CAF50" />
              <Text className="ml-3 text-sm text-white">
                {'Add your custom recipes (no more sticky spec sheets!)'}
              </Text>
            </View>
            <View className="mb-2 flex-row items-center">
              <FontAwesome name="check-circle" size={18} color="#4CAF50" />
              <Text className="ml-3 text-sm text-white">
                {"Create venues to track your bar's ingredients & drinks"}
              </Text>
            </View>
            <View className="flex-row items-center">
              <FontAwesome name="check-circle" size={18} color="#4CAF50" />
              <Text className="ml-3 text-sm text-white">
                {'Get cocktail suggestions based on your inventory'}
              </Text>
            </View>
          </View>

          {/* Subscription Options */}
          <View className="mb-5">
            {subscriptionOptions.map((option) => {
              // Check if this is lifetime option on Android
              const isLifetimeOnAndroid = Platform.OS === 'android' && option.period === 'one-time';
              const isDisabled = isProcessing || isLifetimeOnAndroid;
              
              return (
                <Pressable
                  key={option.id}
                  onPress={() => !isLifetimeOnAndroid && handleSubscriptionSelect(option.id)}
                  className="mb-3"
                  disabled={isDisabled}
                  style={({ pressed }) => ({ 
                    opacity: isLifetimeOnAndroid ? 0.4 : (pressed || isProcessing ? 0.8 : 1) 
                  })}>
                  <View
                    className={`rounded-2xl border-2 p-4 ${
                      option.highlight && !isLifetimeOnAndroid
                        ? 'bg-primary/10 border-primary'
                        : 'border-gray-700 bg-gray-900/50'
                    }`}>
                    {option.highlight && !isLifetimeOnAndroid && (
                      <View className="absolute -top-3 self-center rounded-full bg-primary px-3 py-1">
                        <Text className="text-xs font-semibold text-white">BEST VALUE</Text>
                      </View>
                    )}
                    <View className="flex-row items-center justify-between">
                      <View className="flex-1">
                        <Text className={`text-lg font-semibold ${isLifetimeOnAndroid ? 'text-gray-500' : 'text-white'}`}>
                          {option.title}
                        </Text>
                        {option.period && (
                          <Text className={`mt-1 text-sm ${isLifetimeOnAndroid ? 'text-gray-600' : 'text-gray-400'}`}>
                            {option.period === 'one-time'
                              ? isLifetimeOnAndroid 
                                ? 'Coming soon for Android'
                                : 'One-time purchase - lifetime access'
                              : option.period === 'monthly'
                                ? 'One month auto-renewing subscription'
                                : 'One year auto-renewing subscription'}
                          </Text>
                        )}
                      </View>
                      {isProcessing && processingOptionId === option.id ? (
                        <ActivityIndicator size="small" color="#ffffff" />
                      ) : (
                        <Text className={`text-2xl font-bold ${isLifetimeOnAndroid ? 'text-gray-500' : 'text-white'}`}>
                          {option.price}
                        </Text>
                      )}
                    </View>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>

        {/* Continue Free button */}
        {/* Footer Section */}
        <View className="pb-4 pt-2">
          {/* Continue Free button */}
          <Pressable
            onPress={() => handleSubscriptionSelect('free')}
            disabled={isProcessing}
            style={({ pressed }) => ({ opacity: pressed || isProcessing ? 0.6 : 1 })}>
            <Text className="text-center text-xs text-gray-500">
              Continue with Free (Limited Access)
            </Text>
          </Pressable>

          {/* Legal Links */}
          <View className="my-3 flex-row items-center justify-center">
            <Pressable onPress={handlePrivacyPress}>
              <Text className="text-xs underline" style={{ color: '#6ab2ffff' }}>Privacy Policy</Text>
            </Pressable>
            <Text className="mx-2 text-xs text-gray-500">|</Text>
            <Pressable onPress={handleTermsPress}>
              <Text className="text-xs underline" style={{ color: '#6ab2ffff' }}>Terms of Use</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}
