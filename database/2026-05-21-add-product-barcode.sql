ALTER TABLE roupas
  ADD COLUMN IF NOT EXISTS barcode TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS idx_roupas_barcode_unique
  ON roupas(barcode)
  WHERE barcode IS NOT NULL AND barcode <> '';

CREATE INDEX IF NOT EXISTS idx_roupas_barcode
  ON roupas(barcode);
