import { ITestRequest } from "../interfaces/ITestRequest";

class TestRequest implements ITestRequest {
  public testId: number;
  public result?: string;
  public comment?: string;

  constructor(testId: number)
    {
      this.testId = testId;
      this.result = "";
      this.comment = "";
    }
}

export { TestRequest }
