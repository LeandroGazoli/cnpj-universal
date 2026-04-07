# CNPJ Universal ⚡

[![npm version](https://img.shields.io/npm/v/cnpj-universal?logo=npm&logoColor=white)](https://www.npmjs.com/package/cnpj-universal)
[![npm downloads](https://img.shields.io/npm/dm/cnpj-universal?logo=npm&logoColor=white)](https://www.npmjs.com/package/cnpj-universal)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![NestJS](https://img.shields.io/badge/NestJS-Compatible-ea2845?logo=nestjs&logoColor=white)](https://nestjs.com/)

**Validador Type-Safe para CNPJ Numérico (Legado) e Alfanumérico (Novo Formato SERPRO).**

Compatível com **NestJS**, **class-validator** e **TypeScript/JavaScript puro**, com suporte completo para ambos os formatos de CNPJ brasileiros.

---

## 📋 Índice

- [Características](#-características)
- [Instalação](#-instalação)
- [Casos de Uso](#-casos-de-uso)
- [Uso Básico](#-uso-básico)
  - [Decorator @IsCNPJ (NestJS/Class-Validator)](#decorator-iscnpj-nestjsclass-validator)
  - [Classe Utilitária CNPJ](#classe-utilitária-cnpj)
- [Compatibilidade](#-compatibilidade)
- [Formatos Aceitos](#-formatos-aceitos)
- [Sobre o Novo CNPJ Alfanumérico](#-sobre-o-novo-cnpj-alfanumérico)
- [Tratamento de Erros](#-tratamento-de-erros)
- [Contribuindo](#-contribuindo)
- [Licença](#-licença)

---

## ✨ Características

✅ **Validação Dual**: Suporta CNPJ numérico (legado) e alfanumérico (novo formato SERPRO)  
✅ **Sem Dependências Externas**: Apenas `class-validator` como peer dependency  
✅ **Type-Safe**: Totalmente tipado em TypeScript  
✅ **NestJS Ready**: Funciona como decorator em DTOs  
✅ **Flexível**: Com ou sem máscara (`XX.XXX.XXX/XXXX-XX`)  
✅ **Batch Operations**: Métodos utilitários para cálculo de dígitos verificadores  
✅ **Leve**: ~2KB minificado  
✅ **Zero Breaking Changes**: API estável desde v1.0.0

---

## 🚀 Instalação

```bash
npm install cnpj-universal
```

Com yarn:

```bash
yarn add cnpj-universal
```

Com pnpm:

```bash
pnpm add cnpj-universal
```

**Peer Dependency:** `class-validator >= 0.13.0`

---

## 💡 Casos de Uso

- **Formulários de Cadastro de Empresas**: Validar CNPJ ao integrar com APIs de Receita Federal
- **Gateways de Pagamento**: Garantir CNPJ válido antes de processar transações
- **Sistemas de Fornecedores**: Importar e validar CNPJ de base de dados terceira
- **NFC-e e Nota Fiscal**: Validar CNPJ do emitente/destinatário em projetos de nota fiscal
- **Consultas em APIs Externas**: Validar antes de chamar SERPRO, BrAPI, etc.
- **Portais B2B**: Permitir apenas empresas com CNPJ válido

---

## 📖 Uso Básico

### Decorator `@IsCNPJ` (NestJS/class-validator)

**Com DTO + Validação Automática:**

```typescript
import { IsCNPJ } from "cnpj-universal";

export class EmpresaDto {
  @IsCNPJ()
  cnpj: string;
}
```

Use em um controller NestJS:

```typescript
import { Controller, Post, Body } from "@nestjs/common";

@Controller("empresas")
export class EmpresasController {
  @Post()
  criar(@Body() empresa: EmpresaDto) {
    // Se chegar aqui, CNPJ foi validado automaticamente 🎉
    return { mensaje: `Empresa ${empresa.cnpj} criada!` };
  }
}
```

**Formatos Aceitos Automaticamente:**

```
11.222.333/0001-81   ✅ Numérico com máscara
11222333000181       ✅ Numérico sem máscara
12.ABC.345/01DE-35   ✅ Alfanumérico com máscara
12ABC34501DE35       ✅ Alfanumérico sem máscara
00.000.000/0000-00   ❌ Sequência repetida (inválido)
```

---

### Classe Utilitária `CNPJ`

**para validações manuais:**

#### `CNPJ.isValid(cnpj: string): boolean`

```typescript
import { CNPJ } from "cnpj-universal";

// Numérico
CNPJ.isValid("11.222.333/0001-81"); // ✅ true
CNPJ.isValid("11222333000181"); // ✅ true

// Alfanumérico
CNPJ.isValid("12.ABC.345/01DE-35"); // ✅ true
CNPJ.isValid("12ABC34501DE35"); // ✅ true

// Inválido
CNPJ.isValid("00.000.000/0000-00"); // ❌ false (sequência repetida)
CNPJ.isValid("12.345.678/9999-99"); // ❌ false (dígitos verificadores inválidos)
```

#### `CNPJ.calculaDV(cnpj12: string): string`

Calcula dígitos verificadores para CNPJ alfanumérico:

```typescript
CNPJ.calculaDV("12ABC34501DE"); // '35'
CNPJ.calculaDV("11222333000181"); // Retorna último 2 dígitos do numérico
```

#### `CNPJ.formatar(cnpj: string): string`

Formata para padrão `XX.XXX.XXX/XXXX-XX`:

```typescript
CNPJ.formatar("12ABC34501DE35"); // '12.ABC.345/01DE-35'
CNPJ.formatar("11222333000181"); // '11.222.333/0001-81'
```

---

## 🔗 Compatibilidade

| Tecnologia        | Versão   | Suporte                    |
| ----------------- | -------- | -------------------------- |
| Node.js           | ≥ 18.x   | ✅ Full                    |
| TypeScript        | ≥ 5.x    | ✅ Full                    |
| NestJS            | ≥ 10.x   | ✅ Full                    |
| class-validator   | ≥ 0.13.0 | ✅ Peer                    |
| React/Vue/Angular | Qualquer | ✅ Full (validação manual) |

---

## 📋 Formatos Aceitos

| Formato                      | Exemplo              | Status           |
| ---------------------------- | -------------------- | ---------------- |
| **Numérico com máscara**     | `11.222.333/0001-81` | ✅               |
| **Numérico sem máscara**     | `11222333000181`     | ✅               |
| **Alfanumérico com máscara** | `12.ABC.345/01DE-35` | ✅               |
| **Alfanumérico sem máscara** | `12ABC34501DE35`     | ✅               |
| **Maiúsculas/Minúsculas**    | `12.abc.345/01de-35` | ✅ (normalizado) |

---

## 📚 Sobre o Novo CNPJ Alfanumérico

A **Receita Federal** e o **SERPRO** atualizaram o formato CNPJ para suportar caracteres alfanuméricos (A–Z, 0–9) nos 12 primeiros dígitos, com dígitos verificadores calculados pelo algoritmo **módulo 11** com pesos de 2 a 9.

**Migração Gradual:**

- ✅ Formato numérico legado **permanece válido**
- ✅ Novo formato alfanumérico agora também válido
- ✅ Ambos coexistem durante período de transição

Referência: [SERPRO — Documentação CNPJ Alfanumérico](https://www.serpro.gov.br)

---

## ⚠️ Tratamento de Erros

Com NestJS, erros de validação são capturados automaticamente:

```typescript
// Requisição com CNPJ inválido
POST /empresas
{
  "cnpj": "00.000.000/0000-00"
}

// Resposta (400 Bad Request)
{
  "statusCode": 400,
  "message": [
    "cnpj must be a valid CNPJ"
  ],
  "error": "Bad Request"
}
```

Para validação manual com tratamento:

```typescript
import { CNPJ } from "cnpj-universal";

try {
  const cnpj = "00.000.000/0000-00";

  if (!CNPJ.isValid(cnpj)) {
    throw new Error(`CNPJ inválido: ${cnpj}`);
  }

  const cnpjFormatado = CNPJ.formatar(cnpj);
  console.log(`✅ CNPJ válido: ${cnpjFormatado}`);
} catch (erro) {
  console.error(`❌ ${erro.message}`);
}
```

---

## 🤝 Contribuindo

Encontrou um bug? Tem uma sugestão? **Abra uma issue!**

[👉 Issues](https://github.com/LeandroGazoli/cnpj-universal/issues)

### Desenvolvimento Local

```bash
# Clone
git clone https://github.com/LeandroGazoli/cnpj-universal.git
cd cnpj-universal

# Instale dependências
npm install

# Rode testes
npm test

# Build
npm run build
```

---

## 📄 Licença

[MIT](LICENSE) © Leandro Gazoli
