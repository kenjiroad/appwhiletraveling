import { Platform } from 'react-native';
import Purchases, { PURCHASES_ERROR_CODE, type CustomerInfo, type PurchasesPackage } from 'react-native-purchases';

import { ensureUserId } from '@/lib/supabase';

// Subscriptions go through RevenueCat, which talks to the App Store for us. Without
// EXPO_PUBLIC_REVENUECAT_IOS_KEY in app/.env (or on the web), purchases stay fake so the
// whole flow can still be tried: every screen goes through the functions below.
const apiKey = process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY;
export const isPurchasesConfigured = Platform.OS === 'ios' && Boolean(apiKey);

/** The RevenueCat entitlement both plans unlock. */
const ENTITLEMENT = 'pro';

export type Plan = {
  id: 'monthly' | 'yearly';
  title: string;
  price: string;
  detail: string;
};

// Shown until the App Store prices load (and in demo mode). 🟡 Prices still to be confirmed by Kenji.
export const PLANS: Plan[] = [
  { id: 'yearly', title: 'Annuel', price: '29,99 €/an', detail: '3 jours gratuits · soit 2,50 €/mois' },
  { id: 'monthly', title: 'Mensuel', price: '7,99 €/mois', detail: 'Sans engagement' },
];

const TRIAL_UNITS: Record<string, string> = { DAY: 'jours', WEEK: 'semaines', MONTH: 'mois' };

let pro = false;
let configured = false;

const hasPro = (info: CustomerInfo) => info.entitlements.active[ENTITLEMENT] != null;

export function isPro() {
  return pro;
}

/** Called once at launch. Links purchases to the Supabase account when there is one. */
export async function initPurchases() {
  if (!isPurchasesConfigured || configured) return;
  configured = true;
  try {
    Purchases.configure({ apiKey: apiKey! });
    Purchases.addCustomerInfoUpdateListener((info) => {
      pro = hasPro(info);
    });
    const userId = await ensureUserId();
    const info = userId ? (await Purchases.logIn(userId)).customerInfo : await Purchases.getCustomerInfo();
    pro = hasPro(info);
  } catch {
    // Offline or store unavailable: the paywall retries when it opens.
  }
}

async function getPackages(): Promise<Record<Plan['id'], PurchasesPackage | null>> {
  const offering = (await Purchases.getOfferings()).current;
  return { yearly: offering?.annual ?? null, monthly: offering?.monthly ?? null };
}

/** The plans with the real App Store prices (in the buyer's currency), or the defaults. */
export async function loadPlans(): Promise<Plan[]> {
  if (!isPurchasesConfigured) return PLANS;
  try {
    const packages = await getPackages();
    return PLANS.map((plan) => {
      const product = packages[plan.id]?.product;
      if (!product) return plan;
      if (plan.id === 'monthly') return { ...plan, price: `${product.priceString}/mois` };
      const intro = product.introPrice;
      const trial = intro?.price === 0 ? `${intro.periodNumberOfUnits} ${TRIAL_UNITS[intro.periodUnit] ?? 'jours'} gratuits` : null;
      const perMonth = product.pricePerMonthString ? `soit ${product.pricePerMonthString}/mois` : null;
      return {
        ...plan,
        price: `${product.priceString}/an`,
        detail: [trial, perMonth].filter(Boolean).join(' · ') || plan.detail,
      };
    });
  } catch {
    return PLANS;
  }
}

/** True once subscribed, false if the buyer cancelled. Other errors are thrown for the paywall to show. */
export async function purchase(planId: Plan['id']): Promise<boolean> {
  if (!isPurchasesConfigured) {
    pro = true;
    return true;
  }
  const aPackage = (await getPackages())[planId];
  if (!aPackage) throw new Error('Cette offre n’est pas disponible pour le moment.');
  try {
    const { customerInfo } = await Purchases.purchasePackage(aPackage);
    pro = hasPro(customerInfo);
    return pro;
  } catch (error) {
    if ((error as { code?: string }).code === PURCHASES_ERROR_CODE.PURCHASE_CANCELLED_ERROR) return false;
    throw error;
  }
}

export async function restore(): Promise<boolean> {
  if (!isPurchasesConfigured) return pro;
  pro = hasPro(await Purchases.restorePurchases());
  return pro;
}
