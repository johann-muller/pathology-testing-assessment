import { ITestRequest } from "./ITestRequest";

interface IRequisition
{
  requisitionId: string;
  timeSampleTaken: Date;
  firstName: string;
  surname: string;
  gender: string;
  dateOfBirth: Date;
  age: number;
  mobileNumber: string;
  requestedTests: Array<ITestRequest>;
}

export type { IRequisition }
