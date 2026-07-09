/** Formata número como moeda BRL */
export const brl = (v) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v ?? 0);

/** Escapa texto antes de inserir em HTML montado por template string. */
export function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export const escapeAttr = escapeHtml;

export function readPositiveInteger(value, fallback = 0) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
}

export function readMoney(value, fallback = 0) {
  const parsed = Number.parseFloat(String(value).replace(",", "."));
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
}

export function normalizeSearchText(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export function productMatchesSearch(product, search) {
  const query = normalizeSearchText(search);
  if (!query) return true;

  return [product?.nome, product?.sku, product?.barcode]
    .some(value => normalizeSearchText(value).includes(query));
}

export function productVariantGroupKey(product) {
  return [
    product?.nome,
    product?.marca_id || product?.marcas?.nome,
    product?.categoria,
    product?.cor,
  ].map(normalizeSearchText).join("|");
}

export function expandProductsWithVariants(products, allProducts) {
  if (!products.length) return [];

  const directIds = new Set(products.map(product => product.id));
  const groupKeys = new Set(products.map(productVariantGroupKey).filter(Boolean));
  const expanded = [];
  const seen = new Set();

  for (const product of [...products, ...allProducts]) {
    const isDirectMatch = directIds.has(product.id);
    const isSameVariantGroup = groupKeys.has(productVariantGroupKey(product));
    if (!isDirectMatch && !isSameVariantGroup) continue;
    if (seen.has(product.id)) continue;
    seen.add(product.id);
    expanded.push(product);
  }

  return expanded;
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

/** Cria elemento a partir de HTML string */
export function html(str) {
  const t = document.createElement("template");
  t.innerHTML = str.trim();
  return t.content.firstElementChild;
}

/** Alias curto de escapeHtml (usado por código mais novo) */
export const esc = escapeHtml;

/** Converte texto em formato brasileiro (1.234,56) para número.
 *  Com vírgula: pontos são separador de milhar e a vírgula é o decimal.
 *  Sem vírgula: pontos são separador de milhar (ex.: "1.520" → 1520).
 *  Use em texto digitado livre (prompt); para <input type=number>, readMoney basta. */
export function parseValorBR(str) {
  if (str == null) return NaN;
  let s = String(str).trim().replace(/[R$\s]/g, "");
  if (!s) return NaN;
  if (s.includes(",")) {
    s = s.replace(/\./g, "").replace(",", ".");
  } else {
    s = s.replace(/\./g, "");
  }
  return Number(s);
}

/** Redimensiona e comprime imagem antes de salvar (máx 900px, JPEG ~78%).
 *  Uma foto de celular de 5 MB vira ~80 KB — essencial pra não estourar o banco. */
export function compressImage(file, maxDim = 900, quality = 0.78, type = "image/jpeg") {
  return new Promise((res, rej) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width  = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext("2d");
      if (type === "image/jpeg") {
        // JPEG não tem transparência — sem isso, PNG transparente vira fundo preto
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      res(canvas.toDataURL(type, quality));
    };
    img.onerror = () => { URL.revokeObjectURL(url); rej(new Error("Imagem inválida")); };
    img.src = url;
  });
}
