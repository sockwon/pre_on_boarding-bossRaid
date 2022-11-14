type HTTP_STATUS_MESSAGES = {
  [key: number]: string;
};

const DEFAULT_HTTP_STATUS_MESSAGES: HTTP_STATUS_MESSAGES = {
  400: "Bad Requests",
  401: "Unauthorized",
  403: "Foribdden",
  404: "Not Found",
  409: "duplicate",
  500: "Internal Server Error",
  503: "Temporary Unavailable",
};

export interface ErrorWithStatusCode extends Error {
  statusCode?: number;
}

//에러를 던질 때 사용한다. 에러를 만드는 역할을 한다.
export const erorrGenerator = (statusCode: number, msg?: string): void => {
  const err: ErrorWithStatusCode = new Error(
    msg || DEFAULT_HTTP_STATUS_MESSAGES[statusCode]
  );
  err.statusCode = statusCode;
  throw err;
};
