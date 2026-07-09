import test from "node:test";
import assert from "node:assert/strict";

import {
  expandProductsWithVariants,
  escapeAttr,
  escapeHtml,
  productMatchesSearch,
  productVariantGroupKey,
  readMoney,
  readPositiveInteger,
} from "../js/utils.js";

test("escapeHtml neutralizes markup and quotes", () => {
  assert.equal(
    escapeHtml(`<img src=x onerror="alert('x')">`),
    "&lt;img src=x onerror=&quot;alert(&#39;x&#39;)&quot;&gt;"
  );
});

test("productVariantGroupKey groups same model by name, brand, category and color", () => {
  const base = {
    nome: "Calca Pantalona",
    marca_id: "marca-1",
    categoria: "Calca",
    cor: "Preto",
  };

  assert.equal(
    productVariantGroupKey({ ...base, tamanho: "M" }),
    productVariantGroupKey({ ...base, tamanho: "P" })
  );
});

test("expandProductsWithVariants includes other sizes from the same model", () => {
  const allProducts = [
    { id: "m", nome: "Calca Pantalona", marca_id: "marca-1", categoria: "Calca", cor: "Preto", tamanho: "M" },
    { id: "p", nome: "Calca Pantalona", marca_id: "marca-1", categoria: "Calca", cor: "Preto", tamanho: "P" },
    { id: "g", nome: "Calca Pantalona", marca_id: "marca-1", categoria: "Calca", cor: "Azul", tamanho: "G" },
  ];

  assert.deepEqual(
    expandProductsWithVariants([allProducts[0]], allProducts).map(product => product.id),
    ["m", "p"]
  );
});

test("escapeAttr uses the same escaping rules as escapeHtml", () => {
  assert.equal(escapeAttr(`" onclick="bad()`), "&quot; onclick=&quot;bad()");
});

test("readPositiveInteger accepts zero and positive integers", () => {
  assert.equal(readPositiveInteger("0", -1), 0);
  assert.equal(readPositiveInteger("12", -1), 12);
});

test("readPositiveInteger rejects negative or invalid values", () => {
  assert.equal(readPositiveInteger("-1", 99), 99);
  assert.equal(readPositiveInteger("abc", 99), 99);
});

test("readMoney accepts Brazilian comma decimals", () => {
  assert.equal(readMoney("19,90", -1), 19.9);
});

test("readMoney rejects negative or invalid values", () => {
  assert.equal(readMoney("-5", 0), 0);
  assert.equal(readMoney("abc", 0), 0);
});

test("productMatchesSearch finds products by barcode", () => {
  assert.equal(
    productMatchesSearch({ nome: "Vestido Tule", sku: "LW-9345", barcode: "2240260091723" }, "2240260091723"),
    true
  );
});

test("productMatchesSearch ignores accents and case for names", () => {
  assert.equal(
    productMatchesSearch({ nome: "Vestido Básico Boêmia", sku: "LW-9345" }, "boemia"),
    true
  );
});
