// Subscription validator stub for development
export class SubscriptionValidator {
  static async validateAndHandlePaywall(router: any, isAppResuming: boolean = false): Promise<void> {
    // In development mode, always treat as pro user
    console.log('SubscriptionValidator: Development mode - treating as pro user');
    return Promise.resolve();
  }
}
