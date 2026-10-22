// Placeholder until RevenueCat is wired up (needs an Apple Developer account and a
// development build, it doesn't run in Expo Go). Every screen goes through these
// functions, so only this file changes when purchases go live.

export type Plan = {
  id: 'monthly' | 'yearly';
  title: string;
  price: string;
  detail: string;
};

export const PLANS: Plan[] = [
  { id: 'yearly', title: 'Annuel', price: '29,99 €/an', detail: '3 jours gratuits · soit 2,50 €/mois' },
  { id: 'monthly', title: 'Mensuel', price: '7,99 €/mois', detail: 'Sans engagement' },
];

let pro = false;

export function isPro() {
  return pro;
}

export async function purchase(_plan: Plan['id']): Promise<boolean> {
  pro = true;
  return true;
}

export async function restore(): Promise<boolean> {
  return pro;
}
