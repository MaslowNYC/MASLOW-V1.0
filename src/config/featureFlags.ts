
export interface FeatureFlags {
  enablePayments: boolean;
  enableStore: boolean;
}

export const featureFlags: FeatureFlags = {
  enablePayments: false,
  enableStore: true,
};
