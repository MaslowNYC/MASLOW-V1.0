
export interface FeatureFlags {
  enablePayments: boolean;
  enableStore: boolean;
}

export const featureFlags: FeatureFlags = {
  enablePayments: true,
  enableStore: true,
};
