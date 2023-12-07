import type { Router } from "express";

export interface IAppRouterV1 {
  _apiVersion: 1000;

  router: Router;
}
