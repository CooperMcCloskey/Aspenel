/* Generated from systemTheme.json — do not edit. */
export const systemTheme = {
  "colors": {
    "neutrals": {
      "background": {
        "light": "#f7f0e1",
        "dark": "#1d1c1f"
      },
      "gray0": {
        "light": "#e8dfcd",
        "dark": "#292936"
      },
      "gray1": {
        "light": "#d4c9b6",
        "dark": "#3b3b4f"
      },
      "gray2": {
        "light": "#a69b85",
        "dark": "#4f4f69"
      },
      "gray3": {
        "light": "#756b57",
        "dark": "#8585a3"
      },
      "gray4": {
        "light": "#1f1e1d",
        "dark": "#c2c2c9"
      }
    },
    "accents": {
      "red": "#c85040",
      "yellow": "#c8b63f",
      "blue": "#504d61",
      "green": "#4d6158"
    }
  },
  "font": {
    "fontFamily": "'Charter'",
    "monoFontFamily": "'Iosevka'",
    "lineHeight": "1.2",
    "largeText": "2rem",
    "mediumText": "1.375rem",
    "standardText": "1rem",
    "smallText": "0.75rem"
  },
  "layout": {
    "gridGapSize": "16px",
    "gridRows": "8",
    "gridColumns": "6",
    "standardPadding": "4px",
    "borderWidth": "2px",
    "iconSpacing": "2px"
  }
} as const;

/** Color keys by group, in file order. */
export const colorGroups = {
  "neutrals": [
    "background",
    "gray0",
    "gray1",
    "gray2",
    "gray3",
    "gray4"
  ],
  "accents": [
    "red",
    "yellow",
    "blue",
    "green"
  ]
} as const;

export type ColorGroup = keyof typeof colorGroups;
export type ColorKey = (typeof colorGroups)[ColorGroup][number];
export type Scheme = "light" | "dark";
