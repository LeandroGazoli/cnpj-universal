import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { CNPJ } from './cnpj';

/**
 * Constraint que valida CNPJs numéricos (legado) e alfanuméricos (novo formato SERPRO).
 */
@ValidatorConstraint({ async: false })
export class IsCNPJConstraint implements ValidatorConstraintInterface {
  validate(cnpj: string): boolean {
    return CNPJ.isValid(cnpj);
  }

  defaultMessage(): string {
    return 'CNPJ inválido!';
  }
}

/**
 * Decorator para validação de CNPJ em DTOs com class-validator.
 * Suporta o formato numérico legado e o novo formato alfanumérico (SERPRO).
 *
 * @example
 * export class EmpresaDto {
 *   \@IsCNPJ()
 *   cnpj: string;
 * }
 */
export function IsCNPJ(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsCNPJConstraint,
    });
  };
}
