import '$lib/i18n';
import { waitLocale } from 'svelte-i18n';

export const load = async () => {
  await waitLocale();
};

export const ssr = false;
