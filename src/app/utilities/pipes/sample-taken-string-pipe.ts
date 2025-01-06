import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'sampleTakenStringPipe',
  standalone: true,
})
class SampleTakenStringPipe implements PipeTransform {
  transform(value: string): string {
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

export { SampleTakenStringPipe }
