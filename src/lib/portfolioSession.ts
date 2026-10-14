// Gerencia a persistência da inicialização do portfólio durante a sessão de navegação
const PORTFOLIO_ACTIVE_KEY = "jeff_portfolio_initialized";

// Cache síncrono em memória para transições client-side imediatas (zero flicker)
let isInitializedMemory = false;

export function isPortfolioInitialized(): boolean {
  if (isInitializedMemory) return true;
  if (typeof window === "undefined") return false;
  try {
    const isStored =
      sessionStorage.getItem(PORTFOLIO_ACTIVE_KEY) === "true" ||
      localStorage.getItem(PORTFOLIO_ACTIVE_KEY) === "true";
    if (isStored) {
      isInitializedMemory = true;
    }
    return isStored;
  } catch {
    return false;
  }
}

export function setPortfolioInitialized(initialized: boolean = true): void {
  isInitializedMemory = initialized;
  if (typeof window === "undefined") return;
  try {
    if (initialized) {
      sessionStorage.setItem(PORTFOLIO_ACTIVE_KEY, "true");
      localStorage.setItem(PORTFOLIO_ACTIVE_KEY, "true");
    } else {
      sessionStorage.removeItem(PORTFOLIO_ACTIVE_KEY);
      localStorage.removeItem(PORTFOLIO_ACTIVE_KEY);
    }
  } catch {
    // Ignore storage errors (ex: modo anônimo restritivo)
  }
}
