import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'notApplicablePipe',
  standalone: true,
})
class NotApplicablePipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (value == '' || value == null || value == undefined) return 'N/A';
    return value;
  }
}

export { NotApplicablePipe }
