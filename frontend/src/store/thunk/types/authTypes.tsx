export interface IApiResponse<T = any> {
  success: boolean;
  error?: string | null;
  data: T | null;
}

export interface IProfileData {
  sub: string;
  email: string;
  role: string[];
  fullname: string;
  iat: number;
  exp: number;
}
