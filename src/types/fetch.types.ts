export interface FetchResponse<T> {
  data?: T;
  message?: string | null;
  errorMessage?: string | null;
  method?: string;
  params?: {};
  statusCode?: number | null;
  errors?: FetchResponseError | null;
  headers?: any;
  authorization: {
    token: string;
    type: string;
  };
  status?: number | null;
}

export interface FetchResponseError {
  data?: any;
  message: string;
  status: number;
  phone_number?: string;
  statusCode: number | null;
}

export interface ErrorElement {
  domain?: string;
  reason?: string;
  message?: string;
}
