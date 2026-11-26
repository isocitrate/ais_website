// METR "time horizon" measurements: the length of software tasks (in the time a
// skilled human takes) that frontier AI agents complete with 50% / 80% success.
// Source: METR, Time Horizon 1.1 — https://metr.org/time-horizons
// Raw data: https://metr.org/assets/benchmark_results_1_1.yaml (page last updated
// 8 Sep 2026; METR notes the page is no longer actively updated).
// Licensed CC BY 4.0 — attribute to METR. Values copied verbatim (minutes).
// METR: measurements above 16 hours are unreliable with the current task suite.

export const METR_SOURCE_URL = "https://metr.org/time-horizons";

// Doubling time of the 50% horizon, fitted by METR on 2023+ models (excludes
// points with a 50% horizon above 16 hrs). METR: "the trends for 50%- and
// 80%-time horizons are very similar."
export const DOUBLING_DAYS = {"estimate": 128.744, "low": 104.428, "high": 158.012};

export const timeHorizons = [
  {
    "name": "GPT-2",
    "released": "2019-02-14",
    "p50": {
      "minutes": 0.053778,
      "ciLow": 0.009994,
      "ciHigh": 0.141825
    },
    "p80": {
      "minutes": 0.0128,
      "ciLow": 0.001589,
      "ciHigh": 0.068612
    },
    "frontier": true
  },
  {
    "name": "GPT-3",
    "released": "2020-05-28",
    "p50": {
      "minutes": 0.144057,
      "ciLow": 0.093319,
      "ciHigh": 0.221209
    },
    "p80": {
      "minutes": 0.056238,
      "ciLow": 0.034813,
      "ciHigh": 0.105813
    },
    "frontier": true
  },
  {
    "name": "GPT-3.5",
    "released": "2022-03-15",
    "p50": {
      "minutes": 0.599247,
      "ciLow": 0.255148,
      "ciHigh": 1.115905
    },
    "p80": {
      "minutes": 0.25538,
      "ciLow": 0.141649,
      "ciHigh": 0.492933
    },
    "frontier": true
  },
  {
    "name": "GPT-4",
    "released": "2023-03-14",
    "p50": {
      "minutes": 3.987428,
      "ciLow": 1.93292,
      "ciHigh": 7.995283
    },
    "p80": {
      "minutes": 0.889561,
      "ciLow": 0.342984,
      "ciHigh": 2.523746
    },
    "frontier": true
  },
  {
    "name": "GPT-4 Turbo (Nov ’23)",
    "released": "2023-11-06",
    "p50": {
      "minutes": 4.044959,
      "ciLow": 1.866859,
      "ciHigh": 8.443226
    },
    "p80": {
      "minutes": 0.783032,
      "ciLow": 0.276599,
      "ciHigh": 2.358414
    },
    "frontier": true
  },
  {
    "name": "Claude 3 Opus",
    "released": "2024-03-04",
    "p50": {
      "minutes": 3.952262,
      "ciLow": 1.706313,
      "ciHigh": 8.76484
    },
    "p80": {
      "minutes": 0.638973,
      "ciLow": 0.190491,
      "ciHigh": 2.118276
    },
    "frontier": false
  },
  {
    "name": "GPT-4 Turbo",
    "released": "2024-04-09",
    "p50": {
      "minutes": 3.732787,
      "ciLow": 1.980046,
      "ciHigh": 6.736613
    },
    "p80": {
      "minutes": 0.927933,
      "ciLow": 0.428277,
      "ciHigh": 2.196806
    },
    "frontier": false
  },
  {
    "name": "GPT-4o",
    "released": "2024-05-13",
    "p50": {
      "minutes": 6.991195,
      "ciLow": 4.001482,
      "ciHigh": 12.905741
    },
    "p80": {
      "minutes": 1.267009,
      "ciLow": 0.562997,
      "ciHigh": 3.01517
    },
    "frontier": true
  },
  {
    "name": "Claude 3.5 Sonnet",
    "released": "2024-06-20",
    "p50": {
      "minutes": 11.395377,
      "ciLow": 5.489734,
      "ciHigh": 22.384214
    },
    "p80": {
      "minutes": 1.671757,
      "ciLow": 0.57927,
      "ciHigh": 4.573519
    },
    "frontier": true
  },
  {
    "name": "o1-preview",
    "released": "2024-09-12",
    "p50": {
      "minutes": 20.326586,
      "ciLow": 11.716193,
      "ciHigh": 33.379877
    },
    "p80": {
      "minutes": 4.420545,
      "ciLow": 2.012646,
      "ciHigh": 8.912444
    },
    "frontier": true
  },
  {
    "name": "Claude 3.5 Sonnet (new)",
    "released": "2024-10-22",
    "p50": {
      "minutes": 20.522872,
      "ciLow": 10.144026,
      "ciHigh": 40.82028
    },
    "p80": {
      "minutes": 2.595677,
      "ciLow": 0.89379,
      "ciHigh": 7.363864
    },
    "frontier": true
  },
  {
    "name": "o1",
    "released": "2024-12-05",
    "p50": {
      "minutes": 38.831588,
      "ciLow": 21.164512,
      "ciHigh": 64.95249
    },
    "p80": {
      "minutes": 7.090121,
      "ciLow": 3.036033,
      "ciHigh": 16.640636
    },
    "frontier": true
  },
  {
    "name": "Claude 3.7 Sonnet",
    "released": "2025-02-24",
    "p50": {
      "minutes": 60.388937,
      "ciLow": 33.006168,
      "ciHigh": 104.226017
    },
    "p80": {
      "minutes": 12.09179,
      "ciLow": 4.575608,
      "ciHigh": 28.889879
    },
    "frontier": true
  },
  {
    "name": "o3",
    "released": "2025-04-16",
    "p50": {
      "minutes": 119.732634,
      "ciLow": 74.615398,
      "ciHigh": 190.943818
    },
    "p80": {
      "minutes": 29.981603,
      "ciLow": 15.127348,
      "ciHigh": 57.823511
    },
    "frontier": true
  },
  {
    "name": "Claude Opus 4",
    "released": "2025-05-22",
    "p50": {
      "minutes": 100.366123,
      "ciLow": 59.994073,
      "ciHigh": 163.454074
    },
    "p80": {
      "minutes": 20.429752,
      "ciLow": 8.483125,
      "ciHigh": 41.937268
    },
    "frontier": false
  },
  {
    "name": "Claude Opus 4.1",
    "released": "2025-08-05",
    "p50": {
      "minutes": 100.472004,
      "ciLow": 59.272391,
      "ciHigh": 159.451918
    },
    "p80": {
      "minutes": 23.455761,
      "ciLow": 10.538456,
      "ciHigh": 47.785951
    },
    "frontier": false
  },
  {
    "name": "GPT-5",
    "released": "2025-08-07",
    "p50": {
      "minutes": 203.012577,
      "ciLow": 112.641357,
      "ciHigh": 405.551565
    },
    "p80": {
      "minutes": 38.312431,
      "ciLow": 19.184874,
      "ciHigh": 70.093125
    },
    "frontier": true
  },
  {
    "name": "Gemini 3 Pro",
    "released": "2025-11-18",
    "p50": {
      "minutes": 224.325884,
      "ciLow": 139.565157,
      "ciHigh": 379.235434
    },
    "p80": {
      "minutes": 54.142849,
      "ciLow": 25.650451,
      "ciHigh": 103.295501
    },
    "frontier": true
  },
  {
    "name": "GPT-5.1-Codex-Max",
    "released": "2025-11-19",
    "p50": {
      "minutes": 223.714694,
      "ciLow": 134.31077,
      "ciHigh": 396.206723
    },
    "p80": {
      "minutes": 50.632499,
      "ciLow": 27.30204,
      "ciHigh": 88.365435
    },
    "frontier": false
  },
  {
    "name": "Claude Opus 4.5",
    "released": "2025-11-24",
    "p50": {
      "minutes": 292.994594,
      "ciLow": 161.717714,
      "ciHigh": 623.704698
    },
    "p80": {
      "minutes": 49.430584,
      "ciLow": 20.660485,
      "ciHigh": 104.641318
    },
    "frontier": true
  },
  {
    "name": "GPT-5.2",
    "released": "2025-12-11",
    "p50": {
      "minutes": 352.249302,
      "ciLow": 198.067494,
      "ciHigh": 815.177445
    },
    "p80": {
      "minutes": 66.002649,
      "ciLow": 31.665111,
      "ciHigh": 131.730719
    },
    "frontier": true
  },
  {
    "name": "Claude Opus 4.6",
    "released": "2026-02-05",
    "p50": {
      "minutes": 718.80683,
      "ciLow": 316.685725,
      "ciHigh": 3633.786163
    },
    "p80": {
      "minutes": 69.874587,
      "ciLow": 27.026521,
      "ciHigh": 170.437873
    },
    "frontier": true
  },
  {
    "name": "GPT-5.3-Codex",
    "released": "2026-02-05",
    "p50": {
      "minutes": 349.530732,
      "ciLow": 194.913134,
      "ciHigh": 816.351994
    },
    "p80": {
      "minutes": 54.739407,
      "ciLow": 22.361504,
      "ciHigh": 122.058963
    },
    "frontier": false
  },
  {
    "name": "Gemini 3.1 Pro",
    "released": "2026-02-19",
    "p50": {
      "minutes": 384.147435,
      "ciLow": 233.50073,
      "ciHigh": 694.750898
    },
    "p80": {
      "minutes": 89.801503,
      "ciLow": 52.025934,
      "ciHigh": 158.618017
    },
    "frontier": false
  },
  {
    "name": "GPT-5.4",
    "released": "2026-03-05",
    "p50": {
      "minutes": 341.735276,
      "ciLow": 186.581591,
      "ciHigh": 768.779526
    },
    "p80": {
      "minutes": 53.877851,
      "ciLow": 23.957027,
      "ciHigh": 108.679232
    },
    "frontier": false
  },
  {
    "name": "Claude Mythos Preview (early)",
    "released": "2026-04-07",
    "p50": {
      "minutes": 1044.780145,
      "ciLow": 508.876789,
      "ciHigh": 3304.261235
    },
    "p80": {
      "minutes": 185.911829,
      "ciLow": 97.30292,
      "ciHigh": 398.514614
    },
    "frontier": true
  }
];
