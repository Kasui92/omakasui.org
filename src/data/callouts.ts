export interface CalloutConfig {
  icon: string;
  className: string;
}

export const callouts: Record<string, CalloutConfig> = {
  note: {
    icon: "nf nf-md-information_outline",
    className: "callout-note",
  },
  warning: {
    icon: "nf nf-md-alert_outline",
    className: "callout-warning",
  },
  important: {
    icon: "nf nf-md-alert_circle_outline",
    className: "callout-important",
  },
};
