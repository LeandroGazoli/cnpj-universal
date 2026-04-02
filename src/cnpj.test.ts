import { CNPJ } from '../src/cnpj';
import { IsCNPJConstraint } from '../src/is-cnpj.validator';

const constraint = new IsCNPJConstraint();

// ─── CNPJ.isValid ────────────────────────────────────────────────────────────

describe('CNPJ.isValid — formato numérico (legado)', () => {
  it('aceita CNPJ numérico válido sem máscara', () => {
    expect(CNPJ.isValid('11222333000181')).toBe(true);
  });

  it('aceita CNPJ numérico válido com máscara', () => {
    expect(CNPJ.isValid('11.222.333/0001-81')).toBe(true);
  });

  it('rejeita CNPJ numérico com dígito errado', () => {
    expect(CNPJ.isValid('11.222.333/0001-99')).toBe(false);
  });

  it('rejeita sequência de zeros', () => {
    expect(CNPJ.isValid('00000000000000')).toBe(false);
  });

  it('rejeita sequência repetida', () => {
    expect(CNPJ.isValid('11111111111111')).toBe(false);
  });
});

describe('CNPJ.isValid — formato alfanumérico (novo SERPRO)', () => {
  it('aceita CNPJ alfanumérico válido sem máscara', () => {
    expect(CNPJ.isValid('12ABC34501DE35')).toBe(true);
  });

  it('aceita CNPJ alfanumérico válido com máscara', () => {
    expect(CNPJ.isValid('12.ABC.345/01DE-35')).toBe(true);
  });

  it('aceita letras minúsculas (case-insensitive)', () => {
    expect(CNPJ.isValid('12.abc.345/01de-35')).toBe(true);
  });

  it('rejeita CNPJ alfanumérico com dígito errado', () => {
    expect(CNPJ.isValid('12.ABC.345/01DE-99')).toBe(false);
  });

  it('rejeita sequência repetida alfanumérica', () => {
    expect(CNPJ.isValid('AAAAAAAAAAAA00')).toBe(false);
  });
});

describe('CNPJ.isValid — entradas inválidas', () => {
  it('rejeita string vazia', () => {
    expect(CNPJ.isValid('')).toBe(false);
  });

  it('rejeita valor não-string', () => {
    expect(CNPJ.isValid(null as any)).toBe(false);
    expect(CNPJ.isValid(undefined as any)).toBe(false);
    expect(CNPJ.isValid(12345 as any)).toBe(false);
  });

  it('rejeita CNPJ com tamanho incorreto', () => {
    expect(CNPJ.isValid('1234567')).toBe(false);
  });
});

// ─── CNPJ.calculaDV ──────────────────────────────────────────────────────────

describe('CNPJ.calculaDV', () => {
  it('calcula corretamente os DVs do exemplo SERPRO', () => {
    expect(CNPJ.calculaDV('12ABC34501DE')).toBe('35');
  });

  it('lança erro para menos de 12 caracteres', () => {
    expect(() => CNPJ.calculaDV('12ABC')).toThrow();
  });

  it('lança erro para caracteres inválidos', () => {
    expect(() => CNPJ.calculaDV('12ABC345@1DE')).toThrow();
  });

  it('lança erro para sequência repetida', () => {
    expect(() => CNPJ.calculaDV('AAAAAAAAAAAA')).toThrow();
  });
});

// ─── CNPJ.formatar ───────────────────────────────────────────────────────────

describe('CNPJ.formatar', () => {
  it('formata CNPJ numérico corretamente', () => {
    expect(CNPJ.formatar('11222333000181')).toBe('11.222.333/0001-81');
  });

  it('formata CNPJ alfanumérico corretamente', () => {
    expect(CNPJ.formatar('12ABC34501DE35')).toBe('12.ABC.345/01DE-35');
  });

  it('lança erro para tamanho diferente de 14', () => {
    expect(() => CNPJ.formatar('123')).toThrow();
  });
});

// ─── Decorator @IsCNPJ ───────────────────────────────────────────────────────

describe('@IsCNPJ (IsCNPJConstraint)', () => {
  it('valida CNPJ numérico via constraint', () => {
    expect(constraint.validate('11.222.333/0001-81')).toBe(true);
  });

  it('valida CNPJ alfanumérico via constraint', () => {
    expect(constraint.validate('12.ABC.345/01DE-35')).toBe(true);
  });

  it('rejeita CNPJ inválido via constraint', () => {
    expect(constraint.validate('00.000.000/0000-00')).toBe(false);
  });

  it('retorna mensagem de erro padrão', () => {
    expect(constraint.defaultMessage()).toBe('CNPJ inválido!');
  });
});
