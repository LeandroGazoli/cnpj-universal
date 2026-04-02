const PESOS_DV: number[] = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
const TAMANHO_SEM_DV = 12;
const VALOR_BASE = '0'.charCodeAt(0);

const REGEX_CNPJ_ALFANUMERICO = /^[A-Z0-9]{12}\d{2}$/i;
const REGEX_CNPJ_NUMERICO = /^\d{14}$/;
const REGEX_MASCARA = /[.\-/]/g;

function removerMascara(cnpj: string): string {
  return cnpj.replace(REGEX_MASCARA, '').toUpperCase();
}

function isSequenciaRepetida(cnpj: string): boolean {
  return /^(.)\1+$/.test(cnpj);
}

function charParaValor(char: string): number {
  return char.toUpperCase().charCodeAt(0) - VALOR_BASE;
}

function calcularDVAlfanumerico(cnpj12: string): string {
  let somaDV1 = 0;
  let somaDV2 = 0;

  for (let i = 0; i < TAMANHO_SEM_DV; i++) {
    const valor = charParaValor(cnpj12[i]);
    somaDV1 += valor * PESOS_DV[i + 1];
    somaDV2 += valor * PESOS_DV[i];
  }

  const dv1 = somaDV1 % 11 < 2 ? 0 : 11 - (somaDV1 % 11);
  somaDV2 += dv1 * PESOS_DV[TAMANHO_SEM_DV];
  const dv2 = somaDV2 % 11 < 2 ? 0 : 11 - (somaDV2 % 11);

  return `${dv1}${dv2}`;
}

function validarCNPJNumerico(cnpj: string): boolean {
  if (isSequenciaRepetida(cnpj)) return false;

  let length = cnpj.length - 2;
  let numbers = cnpj.substring(0, length);
  const digits = cnpj.substring(length);
  let sum = 0;
  let pos = length - 7;

  for (let i = length; i >= 1; i--) {
    sum += parseInt(numbers.charAt(length - i)) * pos--;
    if (pos < 2) pos = 9;
  }
  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(0))) return false;

  length += 1;
  numbers = cnpj.substring(0, length);
  sum = 0;
  pos = length - 7;
  for (let i = length; i >= 1; i--) {
    sum += parseInt(numbers.charAt(length - i)) * pos--;
    if (pos < 2) pos = 9;
  }
  result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  return result === parseInt(digits.charAt(1));
}

function validarCNPJAlfanumerico(cnpj: string): boolean {
  if (isSequenciaRepetida(cnpj)) return false;
  const cnpj12 = cnpj.substring(0, TAMANHO_SEM_DV);
  const dvInformado = cnpj.substring(TAMANHO_SEM_DV);
  return dvInformado === calcularDVAlfanumerico(cnpj12);
}

/**
 * Classe utilitária para validação e cálculo de CNPJ.
 * Suporta o formato numérico legado e o novo formato alfanumérico (SERPRO).
 *
 * @example
 * CNPJ.isValid('11.222.333/0001-81')   // true  (numérico)
 * CNPJ.isValid('12.ABC.345/01DE-35')   // true  (alfanumérico)
 * CNPJ.calculaDV('12ABC34501DE')       // '35'
 */
export class CNPJ {
  /**
   * Verifica se um CNPJ é válido.
   * Aceita com ou sem máscara, numérico ou alfanumérico.
   */
  static isValid(cnpj: string): boolean {
    if (typeof cnpj !== 'string') return false;

    const cnpjLimpo = removerMascara(cnpj);

    if (REGEX_CNPJ_NUMERICO.test(cnpjLimpo)) {
      return validarCNPJNumerico(cnpjLimpo);
    }

    if (REGEX_CNPJ_ALFANUMERICO.test(cnpjLimpo)) {
      return validarCNPJAlfanumerico(cnpjLimpo);
    }

    return false;
  }

  /**
   * Calcula os dois dígitos verificadores de um CNPJ alfanumérico
   * a partir dos 12 primeiros caracteres.
   *
   * @param cnpj12 - Os 12 primeiros caracteres do CNPJ (A-Z / 0-9).
   * @returns String com os dois dígitos verificadores (ex.: '35').
   * @throws Error se o valor fornecido for inválido.
   *
   * @example
   * CNPJ.calculaDV('12ABC34501DE') // '35'
   */
  static calculaDV(cnpj12: string): string {
    if (typeof cnpj12 !== 'string') {
      throw new Error('O valor fornecido deve ser uma string.');
    }

    const limpo = removerMascara(cnpj12).substring(0, TAMANHO_SEM_DV);

    if (!/^[A-Z0-9]{12}$/i.test(limpo)) {
      throw new Error(
        'calculaDV requer exatamente 12 caracteres alfanuméricos (A-Z / 0-9).',
      );
    }

    if (isSequenciaRepetida(limpo)) {
      throw new Error('CNPJ inválido: sequência de caracteres repetidos.');
    }

    return calcularDVAlfanumerico(limpo);
  }

  /**
   * Formata um CNPJ sem máscara para o padrão XX.XXX.XXX/XXXX-XX.
   * Funciona para CNPJs numéricos e alfanuméricos.
   *
   * @example
   * CNPJ.formatar('12ABC34501DE35') // '12.ABC.345/01DE-35'
   */
  static formatar(cnpj: string): string {
    const limpo = removerMascara(cnpj);
    if (limpo.length !== 14) {
      throw new Error('O CNPJ deve ter 14 caracteres para ser formatado.');
    }
    return `${limpo.slice(0, 2)}.${limpo.slice(2, 5)}.${limpo.slice(5, 8)}/${limpo.slice(8, 12)}-${limpo.slice(12)}`;
  }
}
