import { createBrowserClient } from "@supabase/ssr";

export const createClient = () => {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!url || !key) {
    console.warn("Missing Supabase environment variables! Authentication will not work.");
    return null;
  }

  return createBrowserClient(url, key);
};
