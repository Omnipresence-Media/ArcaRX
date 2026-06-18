# Industry Toggles + Patient E-Commerce

Two additions, both mock UI (no backend), matching the existing ARCA Rx admin and patient portal styling.

---

## 1. Industry feature toggles (admin Settings)

Add three new sections to `src/routes/admin/settings.tsx`, each a `Card` with a master on/off switch + a list of niche-specific feature switches with descriptions and "connected/beta" badges.

**HRT (Hormone Replacement)**
- Master: "HRT module"
- Toggles: Dose titration calculator · Symptom tracker (energy/mood/libido/sleep) · Lab-driven protocols (TSH/E2/Test/Free T) · Injection scheduler & rotation map · Pellet insertion tracking · Compounding pharmacy routing · Auto-refill rules tied to last lab · Telehealth follow-up cadence

**Med Spa**
- Master: "Med Spa module"
- Toggles: Treatment plan builder (Botox/filler/laser/microneedling) · Injection mapping (face diagram + units per site) · Before/after photo consent + gallery · Membership packages & banked units · Consent forms per procedure · Touch-up window tracking · Provider commission rules · Vendor/product lot tracking (Allergan, Galderma)

**Weight Loss Clinic**
- Master: "Weight Loss module"
- Toggles: GLP-1 titration ladder (semaglutide/tirzepatide) · Weekly weigh-in & body comp · Side-effect monitoring (nausea/constipation) · Meal & habit check-ins · Body measurement tracking · Compounded vs branded routing · Insurance prior auth workflow · Plateau alerts to care team

State is local (`useState`) — no persistence yet.

---

## 2. Patient e-commerce shop

Add a **Shop** entry to the patient portal so patients can browse and "order" products.

**New routes**
- `src/routes/portal.shop.index.tsx` — storefront grid
- `src/routes/portal.shop.$productId.tsx` — product detail
- `src/routes/portal.shop.cart.tsx` — cart + mock checkout
- `src/routes/portal.shop.orders.tsx` — order history

**Storefront**
- Category chips: Supplements · Skincare · Peptides (Rx) · Devices · Apparel
- Product cards: image (gradient placeholder), name, price, "Rx" / "Member −15%" badges, Add-to-cart
- Featured "Bundle of the month" hero
- Search + sort

**Product detail**
- Hero image, price, member price, stock state, Rx-required notice if applicable
- Tabs: Overview · Ingredients · How to use · Reviews (mock)
- Qty stepper, "Add to cart", "Subscribe & save 15%" option

**Cart + checkout**
- Line items, qty edit, remove
- Order summary (subtotal, member discount, shipping, tax, total)
- Shipping address (prefilled from patient profile)
- Payment method (saved card from billing)
- "Place order" → success screen with order #

**Orders**
- List with status (processing / shipped / delivered), tracking #, reorder button

**Data**
- `src/features/portal/shopData.ts` — ~12 mock products across categories, 3 mock past orders
- Cart held in a tiny `useShopCart` zustand-free store (`useState` + context in `PortalShell` or a local module-level signal)

**Nav integration**
- Add "Shop" to `PortalShell` desktop sidebar + bottom tab bar (swap one of the less-used items into a "More" menu if 5 tabs is full)
- Cart icon with badge in portal header

---

## Out of scope
- Real payment processing, real inventory, real shipping
- Persisting toggle state across reloads
- Admin-side product/order management screens (can add next)
- Wiring toggle state to actually hide/show features elsewhere (this pass only ships the toggle UI)

## Verify
- `/admin/settings` shows three new module cards with working switches
- `/portal/shop` renders grid, product detail, cart flow, orders list
- Portal nav includes Shop on mobile + desktop
- No SSR/hydration errors
