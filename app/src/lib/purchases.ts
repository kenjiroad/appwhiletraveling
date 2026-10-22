// Placeholder until RevenueCat is wired up (needs an Apple Developer account and a
// development build, it doesn't run in Expo Go). Every screen goes through these
// functions, so only this file changes when purchases go live.

export type Plan = {
  id: 'weekly' | 'yearly';
  title: string;
  price: string;
  detail: string;
};

export const PLANS: Plan[] = [
  { id: 'yearly', title: 'Annuel', price: '29,99 €/an', detail: 'Soit 0,58 €/semaine' },
  { id: 'weekly', title: 'Hebdomadaire', price: '4,99 €/semaine', detail: '3 jours gratuits' },
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
