CREATE TABLE IF NOT EXISTS estoque_opcoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo TEXT NOT NULL CHECK (tipo IN ('cor', 'tamanho')),
  nome TEXT NOT NULL,
  ordem INTEGER NOT NULL DEFAULT 0,
  ativo BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (tipo, nome)
);

INSERT INTO estoque_opcoes (tipo, nome, ordem)
VALUES
  ('tamanho', 'Único', 10),
  ('tamanho', 'PP', 20),
  ('tamanho', 'P', 30),
  ('tamanho', 'M', 40),
  ('tamanho', 'G', 50),
  ('tamanho', 'GG', 60),
  ('tamanho', 'XGG', 70),
  ('tamanho', '34', 80),
  ('tamanho', '36', 90),
  ('tamanho', '38', 100),
  ('tamanho', '40', 110),
  ('tamanho', '42', 120),
  ('tamanho', '44', 130),
  ('tamanho', '46', 140),
  ('cor', 'Preto', 10),
  ('cor', 'Branco', 20),
  ('cor', 'Off-white', 30),
  ('cor', 'Azul', 40),
  ('cor', 'Jeans', 50),
  ('cor', 'Vermelho', 60),
  ('cor', 'Verde', 70),
  ('cor', 'Rosa', 80),
  ('cor', 'Bege', 90),
  ('cor', 'Marrom', 100),
  ('cor', 'Vinho', 110),
  ('cor', 'Cinza', 120),
  ('cor', 'Amarelo', 130),
  ('cor', 'Outra', 140)
ON CONFLICT (tipo, nome) DO NOTHING;

ALTER TABLE estoque_opcoes ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON estoque_opcoes TO anon, authenticated;

DROP POLICY IF EXISTS "Permitir leitura publica de opcoes do estoque" ON estoque_opcoes;
DROP POLICY IF EXISTS "Permitir criacao publica de opcoes do estoque" ON estoque_opcoes;
DROP POLICY IF EXISTS "Permitir edicao publica de opcoes do estoque" ON estoque_opcoes;
DROP POLICY IF EXISTS "Permitir exclusao publica de opcoes do estoque" ON estoque_opcoes;

CREATE POLICY "Permitir leitura publica de opcoes do estoque"
ON estoque_opcoes FOR SELECT
USING (true);

CREATE POLICY "Permitir criacao publica de opcoes do estoque"
ON estoque_opcoes FOR INSERT
WITH CHECK (true);

CREATE POLICY "Permitir edicao publica de opcoes do estoque"
ON estoque_opcoes FOR UPDATE
USING (true)
WITH CHECK (true);

CREATE POLICY "Permitir exclusao publica de opcoes do estoque"
ON estoque_opcoes FOR DELETE
USING (true);
