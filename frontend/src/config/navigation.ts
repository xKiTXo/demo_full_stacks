
export const DASHBOARD_URL_PREFIX = "/dashboard"

// Performance
const urlPatterns = [
  { name: "Home", url: "/" },
  { name: "Login", url: "/login", icon: "lucide:user-round" },
  { name: "Register", url: "/register" },
  { name: "Products", url: "/products" },
  { name: "Carts", url: "/cart", icon: "uil:cart" },
  // { name: "Favorites", url: "/favorites" },
  // { name: "FAQ", url: "/faqs" },
  { name: "About US", url: "/about-us" },
  { name: "Contact US", url: "/contact-us" },
  // { name: "Points Center", url: "/points-center" },
  // { name: "Promotions", url: "/promotions" },
  { name: "Privacy Policy", url: "/privacy-policy" },
  { name: "Terms and Conditions", url: "/terms-and-conditions" },
  {
    name: "Dashboard", url: `${DASHBOARD_URL_PREFIX}`,
    icon: "ix:dashboard"
  },
  {
    name: "Account", url: `${DASHBOARD_URL_PREFIX}/account`,
    icon: "lucide:user-round"
  },
  {
    name: "Orders", url: `${DASHBOARD_URL_PREFIX}/orders`,
    icon: "icon-park-twotone:transaction-order"
  },
  { name: "Checkout", url: `${DASHBOARD_URL_PREFIX}/checkout` },
];

const socialUrls = [
  { icon: "thesvg-color:instagram", hyperlink: "https://www.instagram.com/cat.ion2" },
  { icon: "logos:facebook", hyperlink: "https://www.facebook.com/wong.sa.961" },
  { icon: "thesvg-color:youtube", hyperlink: "https://www.youtube.com/" },
]

export const Navigation = {
  urls: urlPatterns,
  social_urls: socialUrls,
};
