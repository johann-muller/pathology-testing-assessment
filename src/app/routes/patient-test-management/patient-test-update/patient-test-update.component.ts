import { Component, OnDestroy, OnInit } from '@angular/core';
import { IRequisition } from '../../../domain/interfaces/IRequisition';
import { RequisitionDataService } from '../../../utilities/services/requisition-data.service';
import { Requisition } from '../../../domain/models/Requisition';
import { ActivatedRoute } from '@angular/router';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ITestRequestForm } from '../../../domain/interfaces/forms/ITestRequestForm';
import { ITestRequest } from '../../../domain/interfaces/ITestRequest';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { IRequestedTestsForm } from '../../../domain/interfaces/forms/IRequestedTestsForm';
import { MatSelectModule } from '@angular/material/select';
import { TestTypeService } from '../../../utilities/services/test-type.service';
import { ITestType } from '../../../domain/interfaces/ITestType';
import { Subscription } from 'rxjs';
import { MatChipsModule } from '@angular/material/chips';
import { SampleTakenDatePipe } from '../../../utilities/pipes/sample-taken-date-pipe';
import { MatDividerModule } from '@angular/material/divider';
import { TestRequest } from '../../../domain/models/TestRequest';
import { NotApplicablePipe } from '../../../utilities/pipes/not-applicable-pipe';

@Component({
  selector: 'app-patient-test-update',
  standalone: true,
  imports:
  [
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    ReactiveFormsModule,
    MatInputModule,
    MatChipsModule,
    SampleTakenDatePipe,
    MatDividerModule,
    NotApplicablePipe
  ],
  templateUrl: './patient-test-update.component.html',
  styleUrl: './patient-test-update.component.scss'
})
class PatientTestUpdateComponent implements OnDestroy {
  private _testTypeSubscription: Subscription;
  private _testTypes: Array<ITestType>;
  private _requisitionId: string;
  private _model: IRequisition;
  public requestedTestsForm: FormGroup<IRequestedTestsForm>;

  public constructor(
    private _testTypeService: TestTypeService,
    private _requisitionDataService: RequisitionDataService,
    private _activatedRoute: ActivatedRoute)
  {
    this._model = new Requisition();
    this._testTypes = [];

    this._requisitionId = this._activatedRoute.snapshot.paramMap.get('requisitionId') || '';
    this._requisitionDataService.refreshData();

    if (this._requisitionId == '') console.error("Unable to retrieve Requisition Id. Something went horribly wrong.");
    this._model = this._requisitionDataService.get(this._requisitionId);

    this.requestedTestsForm = new FormGroup<IRequestedTestsForm>({
      requestedTests: new FormArray<FormGroup<ITestRequestForm>>(
        this._model.requestedTests.map(
          test => new FormGroup<ITestRequestForm>({
            description: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
            testId: new FormControl<number>({ value: test.testId, disabled: true}, { nonNullable: true }),
            result: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
            comment: new FormControl<string | null>(null)
          })
        )
      )
    });

    this._testTypeSubscription = this._testTypeService.testTypedata$.subscribe({
      next: (data) => {
        this._testTypes = data;
        this.updateRequestedTestDescriptions();
      },
      error: (error) => {
        console.error('Unable to get test types.', error);
      }
    });
  }

  public ngOnDestroy(): void {
    if(this._testTypeSubscription) this._testTypeSubscription.unsubscribe();
  }

  public onSubmit(formGroup: FormGroup<ITestRequestForm>): void
  {
    const index = this._model.requestedTests.findIndex((test) => test.testId == formGroup.controls.testId.value);
    if (index == -1) return;
    const testRequest = this.mapTestRequestFormToModel(formGroup);
    this._model.requestedTests[index] = testRequest;
    console.log(this._model)

    const controlIndex = this.requestedTestsForm.controls.requestedTests.controls.findIndex((formGroup) => formGroup.controls.testId.value == testRequest.testId);
    if (controlIndex == -1) return;
    this.requestedTestsForm.controls.requestedTests.removeAt(controlIndex);
  }

  public get model(): IRequisition
  {
    return this._model;
  }

  public get finalizedRequistionTest(): Array<ITestRequest>
  {
    return this._model.requestedTests;
  }

  public downloadJson(): void
  {
    const jsonData = JSON.stringify(this._model, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `requisition_${this._model.requisitionId}.json`;
    link.click();

    window.URL.revokeObjectURL(url);
  }

  public downloadText(): void
  {
    console.log("download text clicked");
  }

  private updateRequestedTestDescriptions(): void
  {
    this.requestedTestsForm.controls.requestedTests.controls.forEach(
      (control) => {

        const testType = this._testTypes.find((value: ITestType) => value.testId == control.controls.testId.value);

        if (!testType)
        {
          console.error("Failed to find selected Test Type")
          return;
        }

        control.controls.description.setValue(testType?.mnemonic + " - " + testType?.description);
      })
  }

  private mapTestRequestFormToModel(formGroup: FormGroup<ITestRequestForm>): ITestRequest
  {
    const request = new TestRequest(formGroup.controls.testId.value);
    request.comment = formGroup.controls.comment?.value || '';
    request.result = formGroup.controls.result.value;

    return request;
  }
}

export { PatientTestUpdateComponent }
