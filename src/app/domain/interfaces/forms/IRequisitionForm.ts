import { FormArray, FormControl } from "@angular/forms";

interface IRequisitionForm {
  requisitionId: FormControl<string>;
  timeSampleTaken: FormControl<Date | null>;
  firstName: FormControl<string>;
  surname: FormControl<string>;
  gender: FormControl<string>;
  dateOfBirth: FormControl<Date | null>;
  age: FormControl<number>;
  mobileNumber: FormControl<string>;
  requestedTests: FormControl<Array<string>>;
}

export type { IRequisitionForm }
