import { ITestRequest } from "../interfaces/ITestRequest";
import { IRequisition } from "../interfaces/IRequisition";

class Requisition implements IRequisition {
  public requisitionId: string;
  public timeSampleTaken: Date;
  public firstName: string;
  public surname: string;
  public gender: string;
  public dateOfBirth: Date;
  public age: number;
  public mobileNumber: string;
  public requestedTests: Array<ITestRequest>

  constructor()
    {
      this.requisitionId = "";
      this.timeSampleTaken = new Date();
      this.firstName = "";
      this.surname = "";
      this.gender = "";
      this.dateOfBirth = new Date();
      this.age = 0;
      this.mobileNumber = "";
      this.requestedTests = [];
    }
}

export { Requisition }
