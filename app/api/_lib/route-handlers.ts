type RouteMethod =
  | "GET"
  | "POST"
  | "PATCH"
  | "DELETE"
  | "PUT"
  | "OPTIONS"
  | "HEAD";

type RouteHandler = (...args: any[]) => Response | Promise<Response>;

export function defineRouteHandlers<
  THandlers extends Partial<Record<RouteMethod, RouteHandler>>,
>(handlers: THandlers) {
  return handlers;
}
