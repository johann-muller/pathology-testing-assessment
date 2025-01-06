import { Component, OnDestroy } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { IRequisition } from '../../../domain/interfaces/IRequisition';
import { RequisitionDataService } from '../../../utilities/services/requisition-data.service';
import { Subscription } from 'rxjs';
import { TestTypeService } from '../../../utilities/services/test-type.service';
import { ITestType } from '../../../domain/interfaces/ITestType';
import { MatIconModule } from '@angular/material/icon';
import { SampleTakenStringPipe } from '../../../utilities/pipes/sample-taken-string-pipe';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { DynamicDialogComponent } from '../../../utilities/shared-components/dynamic-dialog/dynamic-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-patient-test-read',
  standalone: true,
  imports: [
    MatCardModule,
    MatTableModule,
    MatChipsModule,
    MatIconModule,
    SampleTakenStringPipe,
    MatDialogModule,
    MatButtonModule
  ],
  templateUrl: './patient-test-read.component.html',
  styleUrl: './patient-test-read.component.scss'
})
class PatientTestReadComponent implements OnDestroy {
  public readonly displayedColumns: Array<string> =
  [
    'requisitionId',
    'timeSampleTaken',
    'requestedTests',
    'actions'
  ];

  private _requisitionSubscription: Subscription;
  private _testTypeSubscription: Subscription;
  private _testTypes: Array<ITestType>;
  public dataSource: MatTableDataSource<IRequisition>;

  constructor(
    private _router: Router,
    private _requisitionDataService: RequisitionDataService,
    private _testTypeService: TestTypeService,
    private _dialog: MatDialog)
  {
    this._testTypes = [];
    this.dataSource = new MatTableDataSource<IRequisition>([]);

    this._requisitionSubscription = this._requisitionDataService.requisitionData$.subscribe({
      next: (data) => {
        this.dataSource = new MatTableDataSource<IRequisition>(Array.from(data.values()));
      },
      error: (error) => {
        console.error('Unable to get requisition data.', error);
      }
    });

    this._testTypeSubscription = this._testTypeService.testTypedata$.subscribe({
      next: (data) => {
        this._testTypes = data;
      },
      error: (error) => {
        console.error('Unable to get requisition data.', error);
      }
    });
  }

  public ngOnDestroy(): void {
    if(this._requisitionSubscription) this._requisitionSubscription.unsubscribe();
    if(this._testTypeSubscription) this._testTypeSubscription.unsubscribe();
  }

  public getRequestedTests(model: IRequisition): Array<string>
  {
    let tests: Array<string> = [];

    model.requestedTests.forEach((test) => {
      let testType = this._testTypes.find((value: ITestType) => value.testId == test.testId);

      if (!testType)
      {
        console.error("Failed to find selected Test Type")
        return;
      }

      tests.push(testType.mnemonic + " - " + testType.description);
    });

    return tests;
  }

  public removeItem(element: IRequisition): void
  {
    const dialogRef = this._dialog.open(DynamicDialogComponent, {
      data: { message: `Are you sure you want to delete this item with Requisition Id: ${element.requisitionId}`},
      width: '600px'
    });

    dialogRef.afterClosed().subscribe({
      next: (val: boolean) => {
        if (!val) return;

        this._requisitionDataService.remove(element);
      }
    });
  }

  public updateItem(id: string): void
  {
    this._router.navigate(['/patient-test/update/', id]);
  }
}

export { PatientTestReadComponent }
