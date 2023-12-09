export enum AUTH_TOKENS {}
// LogUserInUseCase = "AuthTokens.LogUserInUseCase",
// LogUserInRoute = "AuthTokens.LogUserInRoute",
// GetMeUseCase = "AuthTokens.GetMeUseCase",
// GetMeRoute = "AuthTokens.GetMeRoute",
// RefreshUserTokenUseCase = "AuthTokens.RefreshUserTokenUseCase",
// RefreshUserTokenRoute = "AuthTokens.RefreshUserTokenRoute",

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
}

export enum AuthRoutesTokens {
  LogUserInRoute = "AuthRoutesTokens.LogUserInRoute",
  GetMeRoute = "AuthRoutesTokens.GetMeRoute",
  RefreshUserTokenRoute = "AuthRoutesTokens.RefreshUserTokenRoute",
  SignUserUpRoute = "AuthRoutesTokens.SignUserUpRoute",
}
