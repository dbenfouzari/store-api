export enum AuthServicesTokens {
  UserReadRepository = "AuthServicesTokens.UserReadRepository",
  UserWriteRepository = "AuthServicesTokens.UserWriteRepository",
  JWTService = "AuthServicesTokens.JWTService",
}

export enum AuthUseCasesTokens {
  LogUserInUseCase = "AuthUseCasesTokens.LogUserInUseCase",
  GetMeUseCase = "AuthUseCasesTokens.GetMeUseCase",
  RefreshUserTokenUseCase = "AuthUseCasesTokens.RefreshUserTokenUseCase",
  SignUserUpUseCase = "AuthUseCasesTokens.SignUserUpUseCase",
  LogUserOutUseCase = "AuthUseCasesTokens.LogUserOutUseCase",
}

export enum AuthRoutesTokens {
  LogUserInRoute = "AuthRoutesTokens.LogUserInRoute",
  GetMeRoute = "AuthRoutesTokens.GetMeRoute",
  RefreshUserTokenRoute = "AuthRoutesTokens.RefreshUserTokenRoute",
  SignUserUpRoute = "AuthRoutesTokens.SignUserUpRoute",
  LogUserOutRoute = "AuthRoutesTokens.LogUserOutRoute",
}
