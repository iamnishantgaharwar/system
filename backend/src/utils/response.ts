export class ApiResponse {
    constructor(
      public success: boolean,
      public message: string,
      public data: any = null,
      public error: any = null
    ) {}
  
    static success(message: string, data: any = null) {
      return new ApiResponse(true, message, data, null);
    }
  
    static error(message: string, error: any = null) {
      return new ApiResponse(false, message, null, error);
    }
  }
  