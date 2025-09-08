// APIRes.ts
import {ERROR_CLASSIFICATION} from "@/lib/errorCodes";
import {AnyErrorCode} from "@/lib/types/Errortypes";


export class EndpointErrorResponse{
  caughtErrors: Set<AnyErrorCode>;
  uncaughtErrors: Set<AnyErrorCode>;
  logs: string[];

  constructor() {
    this.caughtErrors = new Set();
    this.uncaughtErrors = new Set();
    this.logs = [];
  }

  add(error: AnyErrorCode) {
    const category = ERROR_CLASSIFICATION[error];
    if (category === "caught") {
      this.caughtErrors.add(error);
    } else {
      this.uncaughtErrors.add(error);
    }
  }

  log(msg:string){
    this.logs.push(msg);
  }

  checkUncaughtErrors(): boolean {
    return this.uncaughtErrors.size > 0;
  }

  checkErrors():number{
    return this.caughtErrors.size + this.uncaughtErrors.size;
  }

  /**
   * Convert APIRes into a plain object for JSON serialization
   */
  toJSON() {
    return {
      caughtErrors: Array.from(this.caughtErrors),
      uncaughtErrors: Array.from(this.uncaughtErrors)
    };
  }
}
