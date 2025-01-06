import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { IRequisition } from '../../domain/interfaces/IRequisition';

@Injectable({
  providedIn: 'root'
})
class RequisitionDataService {
  private _requisitionData: Map<string, IRequisition>;
  private _requisitionDataSubject: BehaviorSubject<Map<string, IRequisition>>;
  public requisitionData$: Observable<Map<string, IRequisition>>;

  constructor(private _httpClient: HttpClient) {
    this._requisitionData = new Map([]);
    this._requisitionDataSubject = new BehaviorSubject<Map<string, IRequisition>>(this._requisitionData);
    this.requisitionData$ = this._requisitionDataSubject.asObservable();

    this.fetch();
  }

  public refreshData(): void
  {
    this._requisitionDataSubject.next(this._requisitionData);
  }

  public get(requisitionId: string): IRequisition
  {
    return this._requisitionData.get(requisitionId) as IRequisition;
  }

  public add(model: IRequisition): void
  {
    this._requisitionData.set(model.requisitionId, model);
    this._requisitionDataSubject.next(this._requisitionData);
    console.log(model);
  }

  public remove(model: IRequisition): void
  {
    this._requisitionData.delete(model.requisitionId);
    this._requisitionDataSubject.next(this._requisitionData);
  }

  public count(): number
  {
    return this._requisitionData.size;
  }

  private fetch(): void
  {
    this._httpClient.get<Array<IRequisition>>('/requisitions.json')
      .subscribe({
        next: (data) => {
          const newData = new Map<string, IRequisition>(
            data.map((item) => [ item.requisitionId, item ])
          );

          this._requisitionData = newData;
          this._requisitionDataSubject.next(this._requisitionData);
        },
        error: (error) => {
          console.error("Requisition data failed to load.", error);
        },
        complete: () => {
          console.log("Requisition data fetch completed.");
        }
      });
  }
}

export { RequisitionDataService }
