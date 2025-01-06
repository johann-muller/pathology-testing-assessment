import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'sampleTakenDatePipe',
  standalone: true,
})
class SampleTakenDatePipe implements PipeTransform {
  transform(value: Date): string {
    if (!(value instanceof Date)) {
      throw new Error('Invalid Date: The input value must be a Date object.');
    }

    return new Intl.DateTimeFormat('en-ZA', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour12: false,
    }).format(new Date(value)).replace(',', '');
  }
}

export { SampleTakenDatePipe }
