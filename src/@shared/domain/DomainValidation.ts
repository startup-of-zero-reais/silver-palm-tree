import { EntityValidationException } from '../validation/EntityValidationException';

export default class DomainValidation {
    static notNull(value: string, exceptMessage?: string) {
        if (!value) {
            throw new EntityValidationException(exceptMessage);
        }
    }

    static strMaxLength(value: string, length: number = 255,exceptMessage?: string) {
        if(value.length > length) {
            throw new EntityValidationException(exceptMessage ?? `The value must not be greater than ${length} characters}`);
        } 
    }

    static strMinLength(value: string, length: number = 2,exceptMessage?: string) {
        if(value.length < length) {
            throw new EntityValidationException(exceptMessage ?? `The value must not be at least ${length} characters}`);
        } 
    }

}