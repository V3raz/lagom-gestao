// Versão FIXADA de propósito: "@2" solto pegaria qualquer versão nova do CDN
// sem a gente testar (risco de quebrar o site ou de supply chain).
// Pra atualizar: troque o número, teste local e faça deploy.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.110.2";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./config.js";

export const db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
