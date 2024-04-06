import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function ageValidator(minAge: number): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const age = control.value;
    if (age < minAge) {
      return { 'age': 'You must be at least ' + minAge + ' years old.' };
    }
    return null;
  };
}