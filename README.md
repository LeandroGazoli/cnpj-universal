# cnpj-universal

Validação de CNPJ **numérico** (formato legado) e **alfanumérico** (novo formato SERPRO) para projetos NestJS e qualquer aplicação TypeScript/JavaScript que utilize `class-validator`.

---

## Instalação

```bash
npm install cnpj-universal
# ou
yarn add cnpj-universal
```

> **Peer dependency:** `class-validator >= 0.13.0`

---

## Uso

### Decorator `@IsCNPJ` em DTOs (NestJS / class-validator)

```typescript
import { IsCNPJ } from 'cnpj-universal';

export class EmpresaDto {
  @IsCNPJ()
  cnpj: string;
}
```

Funciona automaticamente com ambos os formatos, com ou sem máscara:

```
11.222.333/0001-81   ✅ numérico com máscara
11222333000181       ✅ numérico sem máscara
12.ABC.345/01DE-35   ✅ alfanumérico com máscara
12ABC34501DE35       ✅ alfanumérico sem máscara
```

---

### Classe utilitária `CNPJ`

#### `CNPJ.isValid(cnpj)`

Retorna `true` se o CNPJ for válido (numérico ou alfanumérico, com ou sem máscara).

```typescript
import { CNPJ } from 'cnpj-universal';

CNPJ.isValid('11.222.333/0001-81')  // true
CNPJ.isValid('12.ABC.345/01DE-35')  // true
CNPJ.isValid('00.000.000/0000-00')  // false
```

#### `CNPJ.calculaDV(cnpj12)`

Calcula os dois dígitos verificadores a partir dos 12 primeiros caracteres do CNPJ alfanumérico.

```typescript
CNPJ.calculaDV('12ABC34501DE')  // '35'
```

#### `CNPJ.formatar(cnpj)`

Formata um CNPJ de 14 caracteres (sem máscara) para o padrão `XX.XXX.XXX/XXXX-XX`.

```typescript
CNPJ.formatar('12ABC34501DE35')  // '12.ABC.345/01DE-35'
CNPJ.formatar('11222333000181')  // '11.222.333/0001-81'
```

---

## Sobre o novo CNPJ alfanumérico

A Receita Federal, em conjunto com o SERPRO, atualizou o formato do CNPJ para suportar caracteres alfanuméricos (letras A–Z e dígitos 0–9) nos 12 primeiros caracteres. Os dois últimos caracteres continuam sendo dígitos verificadores numéricos, calculados pelo algoritmo módulo 11 com pesos de 2 a 9.

Referência: [SERPRO — Cálculo dos dígitos verificadores de CNPJ alfanumérico](https://www.serpro.gov.br)

---

## Licença

MIT
