import { FormArray, FormGroup } from "@angular/forms";
import { ITestRequestForm } from "./ITestRequestForm";

interface IRequestedTestsForm {
  requestedTests: FormArray<FormGroup<ITestRequestForm>>;
}

export type { IRequestedTestsForm }
