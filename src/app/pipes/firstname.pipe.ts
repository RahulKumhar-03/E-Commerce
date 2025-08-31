import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'firstName'
})
export class FirstNamePipe implements PipeTransform {

  transform(fullName: string): string {
    return fullName?.split(' ')[0];
  }

}
