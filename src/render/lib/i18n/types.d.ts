declare module "*.json" {
  const value: any;
  export default value;
}

declare module "$lib/i18n/utils" {
  export const languages: { code: string; name: string }[];
  export const currentLanguage: import('svelte/store').Writable<string>;
  export function changeLanguage(lang: string): void;
  export function getCurrentLanguage(): string;
  export const t: import('svelte-i18n').MessageFormatter;
}