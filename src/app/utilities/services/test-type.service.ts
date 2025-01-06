import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, pipe, timer } from 'rxjs';
import { ITestType } from '../../domain/interfaces/ITestType'

@Injectable({
  providedIn: 'root'
})
class TestTypeService {
  private _testTypeData: Array<ITestType>;
  private _testTypeDataSubject: BehaviorSubject<Array<ITestType>>;
  public testTypedata$: Observable<Array<ITestType>>;

  constructor(private _httpClient: HttpClient) {
    this._testTypeData = [];
    this._testTypeDataSubject = new BehaviorSubject<Array<ITestType>>(this._testTypeData);
    this.testTypedata$ = this._testTypeDataSubject.asObservable();
  }

  public initialize(): void {
    this.fetchData();
  }

  public refreshData(): void {
    this.fetchData();
  }

  private fetchData(): void {
    this._httpClient.get<Array<ITestType>>('/pathology-testing-assessment/test-types.json')
      .subscribe({
        next: (data) => {
          this._testTypeData = data.filter((value) => value.isActive);
          this._testTypeDataSubject.next(this._testTypeData);
        },
        error: (error) => {
          console.error("Test type data failed to load.", error);
        },
        complete: () => {
          console.log("Test type data fetch completed.");
        }
      });
  }
}

export { TestTypeService }
