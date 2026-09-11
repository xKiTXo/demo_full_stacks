import { findNavigationsByName } from "@/utils/navigation";

// Container maxWidth values
export const CONTAINER_MAX_WIDTH_MAIN = "xl";
export const CONTAINER_MAX_WIDTH_CONTENT = "lg";

// ICON
export const SMALL_ICON_WIDTH = 24;
export const NORMAL_ICON_WIDTH = 32;

// Header
export const TOP_BAR_CONFIG = {
  HEIGHT: 32,
  BACKGROUND_COLOR: "rgba(0,0,0,.8)",
} as const;

export const NAV_BAR_CONFIG = {
  HEIGHT: 64,
  BACKGROUND_COLOR: "rgba(0,0,0,.05)",
  ICON_WIDTH: NORMAL_ICON_WIDTH,
  DRAWER_WIDTH_XS: 380,
  DRAWER_WIDTH_MD: 560,
  DRAWER_WIDTH_LG: "80%",
  NAV_LEFT_LISTS: findNavigationsByName([
    "home",
    // "orders",
    "products",
    // "favorites",
  ]),
  NAV_RIGHT_LISTS: findNavigationsByName(["login", "carts"]),
} as const;

// Footer
export const FOOTER_CONFIG = {
  HEIGHT: 200,
  ICON_WIDTH: NORMAL_ICON_WIDTH,
  FOOTER_LEFT_LISTS_1: findNavigationsByName([
    "about us",
    "contact us",
    "promotions",
  ]),
  FOOTER_LEFT_LISTS_2: findNavigationsByName([
    "faq",
    "privacy policy",
    "terms and conditions",
    "points center",
  ]),
} as const;

// Common
export const PAYMENT_GATEWAY = [
  { icon: "selfhst:visa", name: "VISA" },
  { icon: "logos:mastercard", name: "MasterCard" },
  // { icon: "logos:paypal", name: "PayPal" },
  { icon: "logos:google-pay", name: "GooglePay" },
  // { icon: "logos:apple-pay", name: "ApplePay" },
  { icon: "logos:stripe", name: "Stripe" },
];

// UI
export const MIN_HEIGHT = 800

// Dashboard
export const DASHBOARD_CONFIG = {
  DASHBOARD_LEFT_LIST: findNavigationsByName([
    "dashboard",
    "account",
    "orders",
  ]),
};

// Auth
export const ACCESS_TOKEN = 'access_token'
export const REFRESH_TOKEN = 'refresh_token'
