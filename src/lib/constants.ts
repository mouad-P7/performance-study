export const data = {
  velocityArray: [
    60, 80, 100, 120, 140, 160, 180, 200, 220, 240, 260, 280, 300, 320, 340,
    360, 380, 400, 420, 440, 460, 480, 500, 520, 540, 560, 580, 600, 620, 640,
    660, 680, 700, 720, 740, 760, 780, 800, 820, 840, 860, 880, 900, 920, 940,
    960, 980, 1000, 1020, 1040, 1060, 1080, 1100, 1120, 1140, 1160, 1180, 1200,
    1220, 1240, 1260, 1280, 1300, 1320, 1340, 1360, 1380, 1400, 1420, 1440,
    1460, 1480, 1500, 1520, 1540, 1560, 1580, 1600,
  ], // ft/s
  PI: Math.PI,
  CD0: 0.018,
  k: 0.039,
  gho: 0.002377, // slug/ft^3
  m: 1.08,
  ghoAt1000ft: 0.001756, // slug/ft^3
};

export const aircraftFormFields = [
  {
    name: "wingSpan",
    label: "Wing Span",
    placeholder: "Wing Span in feet",
  },
  {
    name: "wingArea",
    label: "Wing Area",
    placeholder: "Wing Area in feet^2",
  },
  {
    name: "spanEfficiencyFactor",
    label: "Span Efficiency Factor",
    placeholder: "Span Efficiency Factor",
  },
  {
    name: "liftCoefficient1",
    label: "Lift Coefficient 1",
    placeholder: "Lift Coefficient 1",
  },
  {
    name: "liftCoefficient2",
    label: "Lift Coefficient 2",
    placeholder: "Lift Coefficient 2",
  },
  {
    name: "alpha1",
    label: "Alpha 1",
    placeholder: "Alpha 1 in degree",
  },
  {
    name: "alpha2",
    label: "Alpha 2",
    placeholder: "Alpha 2 in degree",
  },
  {
    name: "alpha0",
    label: "Alpha 0",
    placeholder: "Alpha 0 in degree",
  },
  {
    name: "thrustAvailable",
    label: "Thrust Available",
    placeholder: "Thrust Available in lb",
  },
  {
    name: "maxTakeOffWeight",
    label: "Maximum Take-Off Weight",
    placeholder: "Maximum Take-Off Weight in lb",
  },
  {
    name: "maxLiftCoefficient",
    label: "Maximum Lift Coefficient",
    placeholder: "Maximum Lift Coefficient",
  },
  {
    name: "sweepAngle",
    label: "Sweep Angle",
    placeholder: "Sweep Angle in degree",
  },
];
