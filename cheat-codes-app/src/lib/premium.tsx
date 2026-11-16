import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { Platform } from 'react-native';
import Purchases, {
  PURCHASES_ERROR_CODE,
  type CustomerInfo,
  type PurchasesPackage,
} from 'react-native-purchases';

import { PREMIUM_ENTITLEMENT, REVENUECAT_KEYS } from '../config';

export type PremiumStatus = 'loading' | 'free' | 'premium';

interface PremiumState {
  status: PremiumStatus;
  isPremium: boolean;
  configured: boolean;
  packages: PurchasesPackage[];
  purchase: (pkg: PurchasesPackage) => Promise<'success' | 'cancelled' | 'error'>;
  restore: () => Promise<boolean>;
}

const PremiumContext = createContext<PremiumState | null>(null);

const apiKey = Platform.OS === 'android' ? REVENUECAT_KEYS.android : REVENUECAT_KEYS.ios;
const hasPremium = (info: CustomerInfo) => !!info.entitlements.active[PREMIUM_ENTITLEMENT];

export function PremiumProvider({ children }: { children: ReactNode }) {
  const configured = !!apiKey;
  const [status, setStatus] = useState<PremiumStatus>(configured ? 'loading' : 'free');
  const [packages, setPackages] = useState<PurchasesPackage[]>([]);

  const apply = useCallback((info: CustomerInfo) => setStatus(hasPremium(info) ? 'premium' : 'free'), []);

  useEffect(() => {
    if (!configured) return;
    Purchases.configure({ apiKey });
    Purchases.addCustomerInfoUpdateListener(apply);
    Purchases.getCustomerInfo()
      .then(apply)
      .catch(() => setStatus('free'));
    Purchases.getOfferings()
      .then((o) => setPackages(o.current?.availablePackages ?? []))
      .catch(() => {});
    return () => {
      Purchases.removeCustomerInfoUpdateListener(apply);
    };
  }, [configured, apply]);

  const purchase = useCallback(
    async (pkg: PurchasesPackage) => {
      try {
        const { customerInfo } = await Purchases.purchasePackage(pkg);
        apply(customerInfo);
        return hasPremium(customerInfo) ? 'success' : 'error';
      } catch (e: any) {
        if (e?.code === PURCHASES_ERROR_CODE.PURCHASE_CANCELLED_ERROR || e?.userCancelled) return 'cancelled';
        return 'error';
      }
    },
    [apply],
  );

  const restore = useCallback(async () => {
    if (!configured) return false;
    try {
      const info = await Purchases.restorePurchases();
      apply(info);
      return hasPremium(info);
    } catch {
      return false;
    }
  }, [configured, apply]);

  return (
    <PremiumContext.Provider
      value={{ status, isPremium: status === 'premium', configured, packages, purchase, restore }}
    >
      {children}
    </PremiumContext.Provider>
  );
}

export function usePremium() {
  const ctx = useContext(PremiumContext);
  if (!ctx) throw new Error('usePremium must be used inside PremiumProvider');
  return ctx;
}
