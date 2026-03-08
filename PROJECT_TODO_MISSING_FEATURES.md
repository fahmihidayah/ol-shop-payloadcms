# Single-Brand Online Store - TODO & Missing Features

## Project Status Overview

This is a comprehensive analysis of missing features and improvements needed for a complete single-brand e-commerce store built with PayloadCMS and Next.js.

**Last Updated**: 2026-02-21

---

## 1. CRITICAL MISSING FEATURES (High Priority)

### 1.1 Email Notification System ⚠️ CRITICAL
**Status**: Not Implemented
**Impact**: Customers receive no order confirmations or updates

**Required Emails**:
- [ ] Order confirmation email (after successful checkout)
- [ ] Payment received confirmation
- [ ] Order shipped notification (with tracking number)
- [ ] Order delivered notification
- [ ] Order cancelled notification
- [ ] Password reset email
- [ ] Welcome email for new customers
- [ ] Newsletter subscription confirmation

**Implementation Tasks**:
- [ ] Choose email service provider (Resend, SendGrid, or NodeMailer)
- [ ] Create email templates collection in PayloadCMS
- [ ] Design HTML email templates using React Email or MJML
- [ ] Implement email service in `src/lib/email-service.ts`
- [ ] Add email queue system for reliability
- [ ] Add email configuration to store-config global
- [ ] Trigger emails from order service hooks
- [ ] Add email preferences to customer accounts

**Estimated Effort**: 2-3 days

---

### 1.2 Inventory Management ⚠️ CRITICAL
**Status**: Partially Implemented (fields exist but no logic)
**Impact**: Products can be over-sold, stock not tracked

**Missing Features**:
- [ ] Automatic stock decrement when order is placed
- [ ] Prevent checkout when product is out of stock
- [ ] Show "Out of Stock" badge on products
- [ ] Inventory reservation during checkout (prevent race conditions)
- [ ] Stock increment when order is cancelled
- [ ] Low stock alerts for admin
- [ ] Inventory history/audit log
- [ ] Backorder support
- [ ] Bulk inventory update tools

**Implementation Tasks**:
- [ ] Create `InventoryService` in `src/feature/inventory/services/`
- [ ] Add `decrementStock` method called from OrderService
- [ ] Add `reserveStock` method for cart/checkout
- [ ] Add `releaseStock` method for cart abandonment
- [ ] Create inventory-history collection
- [ ] Add stock check before checkout
- [ ] Update product display to show stock status
- [ ] Add admin low stock alert dashboard widget
- [ ] Add stock movement tracking

**Estimated Effort**: 3-4 days

---

### 1.3 Discount & Coupon System ⚠️ CRITICAL
**Status**: Not Implemented (discount field in Order exists but manual only)
**Impact**: Cannot run promotions, no marketing capability

**Required Features**:
- [ ] Coupon code creation and management
- [ ] Coupon types (percentage, fixed amount, free shipping)
- [ ] Minimum order value requirements
- [ ] Product-specific coupons
- [ ] Category-specific coupons
- [ ] Single-use vs multi-use coupons
- [ ] Usage limit per customer
- [ ] Expiration dates
- [ ] Automatic discounts (no code needed)
- [ ] Bulk/quantity discounts

**Implementation Tasks**:
- [ ] Create `coupons` collection in `src/collections/shop/coupons.ts`
  - Fields: code, type, value, minOrderValue, maxUses, expiresAt, products, categories
- [ ] Create `CouponService` in `src/feature/coupon/services/`
- [ ] Add coupon validation logic
- [ ] Add coupon application in checkout
- [ ] Update cart to show discount
- [ ] Add coupon UI in checkout page
- [ ] Create admin coupon management interface
- [ ] Add coupon usage tracking
- [ ] Add automatic discount rules engine

**Estimated Effort**: 2-3 days

---

### 1.4 Tax Calculation ⚠️ IMPORTANT
**Status**: Field exists but hardcoded to 0
**Impact**: No tax compliance, incorrect pricing

**Required Features**:
- [ ] Tax rate configuration (by region/country)
- [ ] Product tax categories
- [ ] Tax calculation based on shipping address
- [ ] Display tax breakdown in cart/checkout
- [ ] Tax-inclusive vs tax-exclusive pricing toggle
- [ ] Tax reporting for admin
- [ ] VAT/GST support for international

**Implementation Tasks**:
- [ ] Create `tax-rates` collection with regional rates
- [ ] Add `taxCategory` field to products
- [ ] Create `TaxService` in `src/feature/tax/services/`
- [ ] Implement tax calculation in cart service
- [ ] Update checkout to show tax breakdown
- [ ] Add tax configuration to store-config
- [ ] Add tax reports for admin

**Estimated Effort**: 1-2 days

---

### 1.5 User Account Settings Page
**Status**: Page exists but empty
**Impact**: Users cannot change password or manage preferences

**Required Features**:
- [ ] Change password functionality
- [ ] Update email address
- [ ] Email notification preferences
- [ ] SMS notification preferences (if applicable)
- [ ] Newsletter subscription toggle
- [ ] Account deletion request
- [ ] Marketing consent management

**Implementation Tasks**:
- [ ] Implement password change form in `src/feature/account/components/settings/`
- [ ] Create password change action
- [ ] Add email update with verification
- [ ] Create notification preferences component
- [ ] Add preferences to customer collection
- [ ] Implement GDPR data download
- [ ] Add account deletion workflow

**Estimated Effort**: 1-2 days

---

## 2. IMPORTANT MISSING FEATURES (Medium Priority)

### 2.1 Product Reviews & Ratings
**Status**: Not Implemented
**Impact**: Lower trust, no social proof, reduced conversions

**Required Features**:
- [ ] Customer review submission
- [ ] Star ratings (1-5 stars)
- [ ] Review moderation/approval
- [ ] Verified purchase badge
- [ ] Review photos upload
- [ ] Helpful/not helpful voting
- [ ] Review replies from admin/brand
- [ ] Average rating display on products
- [ ] Review filtering and sorting

**Implementation Tasks**:
- [ ] Create `reviews` collection
  - Fields: product, customer, rating, title, comment, photos, verified, status, helpful
- [ ] Create review submission form
- [ ] Add review moderation in admin
- [ ] Display reviews on product detail page
- [ ] Calculate and cache average ratings
- [ ] Add review email notification
- [ ] Implement review syndication (schema.org markup)

**Estimated Effort**: 2-3 days

---

### 2.2 Wishlist Feature
**Status**: Page/directory exists but not implemented
**Impact**: Lost sales, no saved item functionality

**Required Features**:
- [ ] Add to wishlist button on products
- [ ] Wishlist page showing all saved items
- [ ] Move wishlist items to cart
- [ ] Wishlist sharing (public URL)
- [ ] Wishlist email reminders
- [ ] Stock alert when wishlist item back in stock
- [ ] Price drop alerts for wishlist items

**Implementation Tasks**:
- [ ] Create `wishlists` collection or add to customer model
- [ ] Create `WishlistService` in `src/feature/wishlist/services/`
- [ ] Implement add/remove wishlist actions
- [ ] Create wishlist page UI in `src/feature/wishlist/components/`
- [ ] Add wishlist icon to product cards
- [ ] Add wishlist count to header
- [ ] Implement wishlist persistence for guests (session)
- [ ] Add wishlist sharing functionality

**Estimated Effort**: 2 days

---

### 2.3 Analytics & Reporting Dashboard
**Status**: Not Implemented
**Impact**: No business insights, cannot track performance

**Required Features**:
- [ ] Sales overview dashboard
  - Total revenue (daily, weekly, monthly)
  - Order count
  - Average order value
  - Conversion rate
- [ ] Top selling products
- [ ] Revenue charts and graphs
- [ ] Customer analytics
  - New vs returning customers
  - Customer lifetime value
  - Top customers
- [ ] Traffic sources
- [ ] Product performance metrics
- [ ] Export reports (CSV, PDF)

**Implementation Tasks**:
- [ ] Create analytics service to aggregate data
- [ ] Build admin dashboard page
- [ ] Integrate chart library (Recharts, Chart.js)
- [ ] Create revenue widgets
- [ ] Add product performance reports
- [ ] Implement customer insights
- [ ] Add Google Analytics integration
- [ ] Create scheduled report generation

**Estimated Effort**: 3-4 days

---

### 2.4 Advanced Shipping Options
**Status**: Only flat rate implemented
**Impact**: Limited shipping flexibility, may lose sales

**Required Features**:
- [ ] Multiple shipping zones/regions
- [ ] Weight-based shipping rates
- [ ] Regional shipping rates
- [ ] Free shipping by cart value
- [ ] Free shipping by product/category
- [ ] Shipping provider integration (JNE, SiCepat, etc. for Indonesia)
- [ ] Real-time shipping rate calculation
- [ ] Pickup at store option
- [ ] Express/standard shipping options

**Implementation Tasks**:
- [ ] Create `shipping-zones` collection
- [ ] Create `shipping-methods` collection
- [ ] Create `ShippingService` with rate calculation
- [ ] Integrate shipping API (Raja Ongkir for Indonesia)
- [ ] Update checkout to show shipping options
- [ ] Add shipping method selection UI
- [ ] Calculate shipping based on weight/region
- [ ] Add pickup option

**Estimated Effort**: 3-4 days

---

### 2.5 Return & Refund Management
**Status**: Not Implemented
**Impact**: Manual return handling, poor customer experience

**Required Features**:
- [ ] Return request submission
- [ ] Return reasons tracking
- [ ] Return approval workflow
- [ ] Refund processing
- [ ] Return shipping label generation
- [ ] Return status tracking
- [ ] Restocking returned items
- [ ] Partial refunds
- [ ] Exchange requests

**Implementation Tasks**:
- [ ] Create `returns` collection
- [ ] Create return request form
- [ ] Add return management to admin
- [ ] Implement refund workflow
- [ ] Add return status to order detail
- [ ] Create return email notifications
- [ ] Add return policy page
- [ ] Implement automated approval rules

**Estimated Effort**: 3 days

---

## 3. NICE-TO-HAVE FEATURES (Low Priority)

### 3.1 Blog/Content System
**Status**: Posts collection exists but not integrated
**Impact**: No content marketing capability

**Tasks**:
- [ ] Create blog listing page at `/blog`
- [ ] Create blog post detail page at `/blog/[slug]`
- [ ] Add blog category filtering
- [ ] Add blog search
- [ ] Implement related posts
- [ ] Add comment system (or Disqus integration)
- [ ] Add blog RSS feed
- [ ] Create blog post templates

**Estimated Effort**: 2 days

---

### 3.2 Live Chat Support
**Status**: Not Implemented

**Tasks**:
- [ ] Integrate chat widget (Tawk.to, Crisp, Intercom)
- [ ] Add WhatsApp chat button (already have WhatsApp in social links)
- [ ] Create FAQ page
- [ ] Add chatbot for common questions

**Estimated Effort**: 1 day

---

### 3.3 Product Recommendations
**Status**: Related products exist but basic

**Tasks**:
- [ ] Implement "Customers who bought this also bought" algorithm
- [ ] Add "Frequently bought together" feature
- [ ] Create personalized recommendations based on browsing history
- [ ] Add "Recently viewed products"
- [ ] Implement recommendation API

**Estimated Effort**: 2-3 days

---

### 3.4 Loyalty & Rewards Program
**Status**: Not Implemented

**Tasks**:
- [ ] Create points system
- [ ] Reward points for purchases
- [ ] Reward points for reviews
- [ ] Reward points for referrals
- [ ] Points redemption system
- [ ] Membership tiers (Bronze, Silver, Gold)
- [ ] Tier benefits configuration

**Estimated Effort**: 3-4 days

---

### 3.5 Gift Cards
**Status**: Not Implemented

**Tasks**:
- [ ] Create gift card product type
- [ ] Gift card code generation
- [ ] Gift card balance tracking
- [ ] Gift card application in checkout
- [ ] Gift card purchase flow
- [ ] Gift card email delivery

**Estimated Effort**: 2-3 days

---

### 3.6 Advanced Search & Filters
**Status**: Basic search exists

**Tasks**:
- [ ] Implement faceted search
- [ ] Add search autocomplete/suggestions
- [ ] Search result highlighting
- [ ] Search analytics (what users search for)
- [ ] Filter by multiple attributes
- [ ] Filter by ratings
- [ ] Filter by availability
- [ ] Search history for logged-in users

**Estimated Effort**: 2-3 days

---

### 3.7 Multi-language Support (i18n)
**Status**: i18n folder exists but minimal implementation

**Tasks**:
- [ ] Implement language switcher
- [ ] Translate all UI strings
- [ ] Support multi-language product content
- [ ] Multi-language SEO (hreflang tags)
- [ ] RTL support if needed
- [ ] Currency formatting per locale

**Estimated Effort**: 4-5 days

---

### 3.8 Social Media Integration
**Status**: Social links exist but no integration

**Tasks**:
- [ ] Social login (Google, Facebook)
- [ ] Share product on social media
- [ ] Instagram feed integration
- [ ] Facebook Pixel integration
- [ ] TikTok Pixel integration
- [ ] Social proof notifications ("X just bought this")

**Estimated Effort**: 2 days

---

## 4. TECHNICAL IMPROVEMENTS & OPTIMIZATIONS

### 4.1 Testing Coverage
**Status**: Minimal tests exist

**Tasks**:
- [ ] Add E2E tests for checkout flow (Playwright/Cypress)
- [ ] Add integration tests for payment
- [ ] Add unit tests for all services
- [ ] Add component tests for critical UI
- [ ] Set up CI/CD with test automation
- [ ] Aim for >80% code coverage

**Estimated Effort**: Ongoing

---

### 4.2 Performance Optimization

**Tasks**:
- [ ] Implement image optimization (Next.js Image)
- [ ] Add product caching (Redis or in-memory)
- [ ] Optimize database queries (add indexes)
- [ ] Implement lazy loading for images
- [ ] Add route-based code splitting
- [ ] Optimize bundle size
- [ ] Add CDN for static assets
- [ ] Implement service worker for offline support

**Estimated Effort**: 2-3 days

---

### 4.3 Security Enhancements

**Tasks**:
- [ ] Add CSRF protection to all forms
- [ ] Implement rate limiting on login/checkout
- [ ] Add fraud detection for high-risk orders
- [ ] Encrypt sensitive customer data
- [ ] Add security headers (CSP, HSTS)
- [ ] Implement input sanitization
- [ ] Add XSS protection
- [ ] Regular dependency security audits

**Estimated Effort**: 2 days

---

### 4.4 Error Handling & Logging

**Tasks**:
- [ ] Implement centralized error logging (Sentry, LogRocket)
- [ ] Add error boundaries for React components
- [ ] Create user-friendly error pages
- [ ] Add payment failure recovery
- [ ] Implement retry logic for API calls
- [ ] Add monitoring and alerting

**Estimated Effort**: 1-2 days

---

### 4.5 Database Optimization

**Tasks**:
- [ ] Add indexes for common queries (product search, order lookup)
- [ ] Optimize cart queries
- [ ] Add database connection pooling
- [ ] Implement query result caching
- [ ] Regular database maintenance tasks

**Estimated Effort**: 1 day

---

## 5. FIXES FOR INCOMPLETE IMPLEMENTATIONS

### 5.1 Fix Stock Decrement Logic
**File**: `src/feature/order/services/order-service.ts`
- [ ] Add stock decrement after successful order creation
- [ ] Add transaction handling to prevent race conditions

### 5.2 Implement Newsletter Backend
**Files**: Footer component has form but no backend
- [ ] Create newsletter collection or use email service
- [ ] Implement newsletter subscription action
- [ ] Add confirmation email

### 5.3 Complete Payment Options Integration
**Issue**: PaymentOptions collection exists but Duitku API used directly
- [ ] Decide whether to use database or API for payment options
- [ ] Remove unused collection or integrate properly

### 5.4 Fix Account Settings Page
**File**: `src/app/(frontend)/(account)/account/settings/page.tsx`
- [ ] Add actual settings form and functionality

---

## RECOMMENDED IMPLEMENTATION ROADMAP

### Phase 1: Critical MVP Features (Week 1-2)
1. Email notification system (order confirmations, shipping updates)
2. Inventory management (stock decrement, out-of-stock handling)
3. Discount/coupon system (basic percentage & fixed discounts)
4. Tax calculation (basic regional tax rates)
5. Account settings (password change)

**Priority**: These are essential for a functioning store

---

### Phase 2: Customer Trust & Engagement (Week 3)
1. Product reviews & ratings
2. Wishlist functionality
3. Return & refund request system
4. Live chat integration

**Priority**: Build customer confidence and engagement

---

### Phase 3: Business Intelligence (Week 4)
1. Analytics dashboard
2. Sales reports
3. Inventory reports
4. Customer insights

**Priority**: Enable data-driven decisions

---

### Phase 4: Advanced Features (Week 5-6)
1. Advanced shipping options
2. Product recommendations
3. Blog/content system
4. Advanced search & filters

**Priority**: Competitive advantages and SEO

---

### Phase 5: Growth & Scaling (Week 7+)
1. Loyalty program
2. Gift cards
3. Multi-language support
4. Social media integrations
5. Performance optimizations

**Priority**: Long-term growth features

---

## SUMMARY STATISTICS

| Category | Total | Implemented | Missing | Partial |
|----------|-------|-------------|---------|---------|
| **Core E-commerce** | 15 | 10 | 2 | 3 |
| **Marketing** | 10 | 2 | 7 | 1 |
| **Admin** | 8 | 3 | 4 | 1 |
| **Customer Experience** | 12 | 5 | 6 | 1 |
| **Technical** | 6 | 2 | 2 | 2 |
| **TOTAL** | **51** | **22** | **21** | **8** |

**Overall Completion**: ~43% (22/51 features fully implemented)

---

## CRITICAL PATH TO LAUNCH

### Minimum Viable Product (MVP) Checklist:
- [x] Product catalog with variants
- [x] Shopping cart
- [x] Checkout flow
- [x] Payment integration
- [x] Order management
- [ ] ⚠️ Email notifications
- [ ] ⚠️ Inventory management
- [ ] ⚠️ Basic discounts
- [x] User accounts
- [x] Address management
- [x] SEO optimization
- [ ] ⚠️ Tax calculation (if required by law)

**Before Launch**:
1. Implement email notifications (CRITICAL)
2. Fix inventory stock decrement (CRITICAL)
3. Add basic coupon system (HIGH)
4. Implement tax if legally required (HIGH)
5. Add product reviews (MEDIUM)
6. Set up analytics (MEDIUM)
7. Complete testing (HIGH)
8. Security audit (CRITICAL)

---

## NOTES

- This store is well-architected with solid foundations
- Core e-commerce flow is functional
- Missing features are mostly enhancements, not blockers
- Priority should be: Email → Inventory → Discounts → Reviews
- Many "nice-to-have" features can be added post-launch
- Consider third-party services to accelerate development (email, reviews, chat)

---

**Document Version**: 1.0
**Last Updated**: 2026-02-21
**Next Review**: After implementing Phase 1 features
