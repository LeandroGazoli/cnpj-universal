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

// ─── Regressão: algoritmo unificado ──────────────────────────────────────────

describe('CNPJ.isValid — algoritmo unificado', () => {
  const dvModulo11 = (base: string): string => {
    const calc = (s: string) => {
      let peso = s.length - 7;
      let soma = 0;
      for (const c of s) {
        soma += Number(c) * peso--;
        if (peso < 2) peso = 9;
      }
      return soma % 11 < 2 ? 0 : 11 - (soma % 11);
    };
    const d1 = calc(base);
    return `${d1}${calc(base + d1)}`;
  };

  it('concorda com o módulo 11 clássico em CNPJs numéricos aleatórios', () => {
    for (let i = 0; i < 500; i++) {
      const base = String(Math.floor(Math.random() * 1e12)).padStart(12, '0');
      if (/^(.)\1+$/.test(base)) continue;
      expect(CNPJ.isValid(base + dvModulo11(base))).toBe(true);
    }
  });
});
