/** Formata número como moeda BRL */
export const brl = (v) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v ?? 0);

/** Escapa texto para inserir com segurança em HTML (evita quebra de layout e XSS) */
export const esc = (v) =>
  String(v ?? "")
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");

/** Converte texto em formato brasileiro (1.234,56) para número.
 *  Com vírgula: pontos são separador de milhar e a vírgula é o decimal.
 *  Sem vírgula: pontos são separador de milhar (ex.: "1.520" → 1520). */
export function parseValorBR(str) {
  if (str == null) return NaN;
  let s = String(str).trim().replace(/[R$\s]/g, "");
  if (!s) return NaN;
  if (s.includes(",")) {
    s = s.replace(/\./g, "").replace(",", ".");
  } else {
    s = s.replace(/\./g, "");
  }
  return parseFloat(s);
}

/** Formata data BR curta */
export const dataBR = (iso) =>
  new Date(iso).toLocaleDateString("pt-BR");

/** Gera SKU no formato LW-XXXX */
export const gerarSKU = () => `LW-${String(Math.floor(Math.random() * 9000) + 1000)}`;

/** Exibe toast global */
export function showToast(msg, type = "success") {
  const el = document.getElementById("toast");
  el.textContent = msg;
  el.className = `toast toast--${type} toast--show`;
  clearTimeout(el._timer);
  el._timer = setTimeout(() => el.classList.remove("toast--show"), 3000);
}

/** Converte File para dataURL */
export const fileToDataUrl = (file) =>
  new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result);
    r.onerror = rej;
    r.readAsDataURL(file);
  });

/** Redimensiona e comprime imagem antes de salvar (máx 900px, JPEG ~78%).
 *  Uma foto de celular de 5 MB vira ~80 KB — essencial pra não estourar o banco. */
export function compressImage(file, maxDim = 900, quality = 0.78) {
  return new Promise((res, rej) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width  = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
      res(canvas.toDataURL("image/jpeg", quality));
    };
    img.onerror = () => { URL.revokeObjectURL(url); rej(new Error("Imagem inválida")); };
    img.src = url;
  });
}

/** Cria elemento a partir de HTML string */
export function html(str) {
  const t = document.createElement("template");
  t.innerHTML = str.trim();
  return t.content.firstElementChild;
}
