import { useSyncExternalStore } from 'react';
import { Platform } from 'react-native';
import Purchases, { PURCHASES_ERROR_CODE, type CustomerInfo, type PurchasesPackage } from 'react-native-purchases';

import { ensureUserId } from '@/lib/supabase';

// Subscriptions go through RevenueCat, which talks to the App Store for us. Without
// EXPO_PUBLIC_REVENUECAT_IOS_KEY in app/.env (or on the web), purchases stay fake so the
// whole flow can still be tried: every screen goes through the functions below.
const apiKey = process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY;
export const isPurchasesConfigured = Platform.OS === 'ios' && Boolean(apiKey);

/**
 * Hard paywall (decided 26/10/2026): once purchases are live, the app only works with a
 * subscription or during the free trial. In demo mode nothing is locked.
 */
export const requiresSubscription = isPurchasesConfigured;

export type Plan = {
  id: 'monthly' | 'yearly';
  title: string;
  price: string;
  detail: string;
  /** Label of the buy button: the free trial when the plan has one. */
  cta: string;
};

// Shown until the App Store prices load (and in demo mode). Decided 04/11/2026: 1 week free on the yearly plan.
export const PLANS: Plan[] = [
  {
    id: 'yearly',
    title: 'Annuel',
    price: '29,99 €/an',
    detail: '1 semaine gratuite · soit 2,50 €/mois',
    cta: 'Essayer 1 semaine gratuite',
  },
  { id: 'monthly', title: 'Mensuel', price: '7,99 €/mois', detail: 'Sans engagement', cta: 'Continuer' },
];

/** "1 semaine", "3 jours"… from the App Store's free trial (introductory offer). */
function trialLength(units: number, unit: string) {
  const names: Record<string, [string, string]> = {
    DAY: ['jour', 'jours'],
    WEEK: ['semaine', 'semaines'],
    MONTH: ['mois', 'mois'],
  };
  const [one, many] = names[unit] ?? ['jour', 'jours'];
  return `${units} ${units > 1 ? many : one}`;
}

let pro = false;
let known = false; // false until RevenueCat has answered once
let configured = false;
const listeners = new Set<() => void>();

// Both plans unlock the project's only entitlement (`debout_pro` in the RevenueCat dashboard). Any active
// entitlement counts, so renaming it there can never lock out someone who paid.
const hasPro = (info: CustomerInfo) => Object.keys(info.entitlements.active).length > 0;

function setPro(value: boolean) {
  pro = value;
  known = true;
  listeners.forEach((listener) => listener());
}

export function isPro() {
  return pro;
}

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};
const proSnapshot = () => (!requiresSubscription ? true : known ? pro : null);

/** True when the app is unlocked, false when the paywall must show, null while still checking. */
export function useProStatus(): boolean | null {
  return useSyncExternalStore(subscribe, proSnapshot, proSnapshot);
}

/** Called once at launch. Links purchases to the Supabase account when there is one. */
export async function initPurchases() {
  if (!isPurchasesConfigured || configured) return;
  configured = true;
  try {
    Purchases.configure({ apiKey: apiKey! });
    Purchases.addCustomerInfoUpdateListener((info) => setPro(hasPro(info)));
    const userId = await ensureUserId();
    const info = userId ? (await Purchases.logIn(userId)).customerInfo : await Purchases.getCustomerInfo();
    setPro(hasPro(info));
  } catch {
    // Offline or store unavailable: show the paywall, where buying or restoring retries.
    setPro(false);
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
      const trial = intro?.price === 0 ? trialLength(intro.periodNumberOfUnits, intro.periodUnit) : null;
      const free = trial ? `${trial} ${trial.includes('semaine') ? 'gratuite' : 'gratuits'}` : null;
      const perMonth = product.pricePerMonthString ? `soit ${product.pricePerMonthString}/mois` : null;
      return {
        ...plan,
        price: `${product.priceString}/an`,
        detail: [free, perMonth].filter(Boolean).join(' · ') || plan.detail,
        cta: free ? `Essayer ${free}` : 'Continuer',
      };
    });
  } catch {
    return PLANS;
  }
}

/** True once subscribed, false if the buyer cancelled. Other errors are thrown for the paywall to show. */
export async function purchase(planId: Plan['id']): Promise<boolean> {
  if (!isPurchasesConfigured) {
    setPro(true);
    return true;
  }
  const aPackage = (await getPackages())[planId];
  if (!aPackage) throw new Error('Cette offre n’est pas disponible pour le moment.');
  try {
    const { customerInfo } = await Purchases.purchasePackage(aPackage);
    setPro(hasPro(customerInfo));
    return pro;
  } catch (error) {
    if ((error as { code?: string }).code === PURCHASES_ERROR_CODE.PURCHASE_CANCELLED_ERROR) return false;
    throw error;
  }
}

export async function restore(): Promise<boolean> {
  if (!isPurchasesConfigured) return pro;
  setPro(hasPro(await Purchases.restorePurchases()));
  return pro;
}
