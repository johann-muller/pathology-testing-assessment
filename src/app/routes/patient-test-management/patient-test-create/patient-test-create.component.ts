import { Component, OnDestroy } from '@angular/core';
import { FormGroup, Validators, FormControl, ReactiveFormsModule } from '@angular/forms';
import { ITestType } from '../../../domain/interfaces/ITestType';
import { IRequisitionForm } from '../../../domain/interfaces/forms/IRequisitionForm';
import { Requisition } from '../../../domain/models/Requisition';
import { IRequisition } from '../../../domain/interfaces/IRequisition';
import { TestTypeService } from '../../../utilities/services/test-type.service';
import { Subscription } from 'rxjs';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { RequisitionDataService } from '../../../utilities/services/requisition-data.service';
import { TestRequest } from '../../../domain/models/TestRequest';
import { ITestRequest } from '../../../domain/interfaces/ITestRequest';
import { Router } from '@angular/router';

@Component({
  selector: 'app-patient-test-create',
  standalone: true,
  imports: [
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    ReactiveFormsModule,
    MatInputModule
  ],
  templateUrl: './patient-test-create.component.html',
  styleUrl: './patient-test-create.component.scss'
})
class PatientTestCreateComponent implements OnDestroy {
  private _testTypeSubscription: Subscription;
  private _testTypes: Array<ITestType>;
  private _model: IRequisition;
  private _dateOfBirthChanges: Subscription;
  public requisitionForm: FormGroup<IRequisitionForm>;

  public constructor(
    private _router: Router,
    private _testTypeService: TestTypeService,
    private _requisitionDataService: RequisitionDataService)
  {
    this._testTypes = [];
    this._model = new Requisition();

    this.requisitionForm = new FormGroup<IRequisitionForm>({
      requisitionId: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.pattern(/^\d{4}$/)] }), // custom range validation between 0001 and 9999
      timeSampleTaken: new FormControl<Date>(new Date(), { nonNullable: true, validators: [Validators.required] }),
      firstName: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
      surname: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
      gender: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.pattern(/^[MFU]$/)] }),
      dateOfBirth: new FormControl<Date>(new Date(), { nonNullable: true, validators: [Validators.required] }), // custom validation still required
      age: new FormControl<number>({ value: 0, disabled: true }, { nonNullable: true }),
      mobileNumber: new FormControl<string>('+27', { nonNullable: true, validators: [Validators.required, Validators.pattern(/^\+27\d{9}$/)] }),
      requestedTests: new FormControl<Array<string>>([], { nonNullable: true, validators: [Validators.required] })
    });

    this._testTypeSubscription = this._testTypeService.testTypedata$.subscribe({
      next: (data) => {
        this._testTypes = data;
      },
      error: (error) => {
        console.error('Unable to get test types.', error);
      }
    });

    this._dateOfBirthChanges = this.requisitionForm.controls.dateOfBirth.valueChanges.subscribe({
      next: (value: Date | null) => {
        this.requisitionForm.controls.age.setValue(this.calculateDate(value));
      }
    });
  }

  public ngOnDestroy(): void {
    if(this._testTypeSubscription) this._testTypeSubscription.unsubscribe();
    if(this._dateOfBirthChanges) this._dateOfBirthChanges.unsubscribe();
  }

  public get testTypes(): Array<ITestType>
  {
    return this._testTypes;
  }

  public onSubmit(): void
  {
    this.mapFormToModel();

    this._requisitionDataService.add(this._model);
    this._router.navigate(['/patient-test/read/']);
  }

  private mapFormToModel(): void
  {
    this._model.requisitionId = this.requisitionForm.controls.requisitionId.value;
    this._model.timeSampleTaken = this.requisitionForm.controls.timeSampleTaken.value as Date; // fix this
    this._model.firstName = this.requisitionForm.controls.firstName.value;
    this._model.surname = this.requisitionForm.controls.surname.value;
    this._model.gender = this.requisitionForm.controls.gender.value;
    this._model.dateOfBirth = this.requisitionForm.controls.dateOfBirth.value as Date; // fix this
    this._model.age = this.requisitionForm.controls.age.value;
    this._model.mobileNumber = this.requisitionForm.controls.mobileNumber.value;
    this._model.requestedTests = this.createRequestedTestObjects();
  }

  private createRequestedTestObjects(): Array<ITestRequest>
  {
    let requestedTests: Array<ITestRequest> = [];

    this.requisitionForm.controls.requestedTests.value.forEach((mnemonic) => {
      let testType = this._testTypes.find((value: ITestType) => value.mnemonic == mnemonic);

      if (!testType)
      {
        console.error("Failed to find selected Test Type")
        return;
      }

      requestedTests.push(new TestRequest(testType.testId));
    })

    return requestedTests;
  }

  private calculateDate(value: Date | null): number
  {
    if(value == null) return 0;

    const today = new Date();
    const birthDate = new Date(value);
    const monthDifference = today.getMonth() - birthDate.getMonth();
    let age = today.getFullYear() - birthDate.getFullYear();

    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  }
}

export { PatientTestCreateComponent }
