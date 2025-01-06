import { FormControl } from "@angular/forms";

interface ITestRequestForm {
  description: FormControl<string>;
  testId: FormControl<number>;
  result: FormControl<string>;
  comment?: FormControl<string | null>;
}

export type { ITestRequestForm }
