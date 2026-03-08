# Store Config SEO Enhancement

## Overview
Enhanced the global store configuration SEO fields and implemented them across the home page and default pages to provide centralized, CMS-controlled SEO management.

## Implementation Date
2026-02-21

## Changes Made

### 1. Enhanced Store Config SEO Fields
**File**: [src/globals/store/config.ts](src/globals/store/config.ts)

Added comprehensive SEO configuration fields to the store-config global:

#### New Fields Added:
- **keywords** (array): Keywords for search engine discoverability
- **canonicalUrl** (text): Canonical URL for the site
- **Open Graph** (collapsible group):
  - `ogTitle`: Title for social media sharing
  - `ogDescription`: Description for social sharing
  - `ogImage`: Image for Facebook, LinkedIn, etc.
- **Twitter** (collapsible group):
  - `twitterCard`: Card type (summary or summary_large_image)
  - `twitterTitle`: Title for Twitter
  - `twitterDescription`: Description for Twitter
  - `twitterImage`: Image for Twitter
- **Robots** (collapsible group):
  - `noIndex`: Prevent search engine indexing
  - `noFollow`: Prevent following links

#### Existing Fields Enhanced:
- **metaTitle**: Enhanced description
- **metaDescription**: Enhanced description with character count guidance
- **ogImage**: Moved to Open Graph group

### 2. Created Store Config Server Action
**File**: [src/feature/store/actions/index.ts](src/feature/store/actions/index.ts)

Created `getStoreConfig()` server action to fetch store configuration:
```typescript
export const getStoreConfig = async (): Promise<StoreConfig | null>
```

### 3. Updated Root Layout with Store Config
**File**: [src/app/(frontend)/layout.tsx](src/app/(frontend)/layout.tsx)

Implemented dynamic metadata generation using store config:
- Uses store config for site-wide defaults
- Implements template title pattern: `%s | Store Name`
- Sets favicon from store config
- Configures robots directives
- Provides fallback values when store config unavailable

### 4. Updated Home Page with Store Config
**File**: [src/app/(frontend)/page.tsx](src/app/(frontend)/page.tsx)

Converted from static metadata to dynamic `generateMetadata()`:
- Fetches store config for SEO values
- Uses CMS-controlled metadata with intelligent fallbacks
- Handles keywords array from CMS
- Supports separate OpenGraph and Twitter metadata
- Implements canonical URL from store config
- Configures robots directives

### 5. Enhanced Auth Pages Metadata

#### Login Page
**File**: [src/app/(frontend)/(auth)/login/page.tsx](src/app/(frontend)/(auth)/login/page.tsx)
- Title: "Login"
- Optimized description for sign-in experience
- Set `noindex` but `follow` for privacy

#### Register Page
**File**: [src/app/(frontend)/(auth)/register/page.tsx](src/app/(frontend)/(auth)/register/page.tsx)
- Title: "Create Account"
- Emphasizes benefits of account creation
- Set `noindex` but `follow` for privacy

#### Forgot Password Page
**File**: [src/app/(frontend)/(auth)/forgot-password/page.tsx](src/app/(frontend)/(auth)/forgot-password/page.tsx)
- Title: "Forgot Password"
- Clear description of password reset process
- Set `noindex` but `follow` for privacy

### 6. Enhanced Order Confirmation Page
**File**: [src/app/(frontend)/order/confirmation/page.tsx](src/app/(frontend)/order/confirmation/page.tsx)
- Title: "Order Confirmation"
- Description focused on confirmation and status
- Set `noindex` but `follow` for privacy

## SEO Best Practices Implemented

### 1. CMS Control
- All site-wide SEO settings controlled through PayloadCMS admin
- Easy updates without code changes
- Content editors can optimize SEO independently

### 2. Fallback Strategy
- Smart fallbacks ensure site functions without store config
- Default values maintain SEO quality
- Graceful degradation for missing fields

### 3. Social Media Optimization
- Separate OpenGraph and Twitter metadata
- Image optimization for social sharing
- Platform-specific title and description support

### 4. Privacy Protection
- Auth pages set to `noindex` (privacy)
- Order-related pages excluded from indexing
- Still allow following for SEO link juice

### 5. Hierarchical Title Structure
- Template title in layout: `%s | Store Name`
- Individual pages provide specific titles
- Consistent branding across all pages

## Benefits

### For Administrators
1. **Centralized Control**: Manage site-wide SEO from one location in CMS
2. **No Code Changes**: Update SEO settings without developer intervention
3. **Visual Management**: Upload images and configure settings through admin UI

### For SEO
1. **Search Engine Optimization**: Comprehensive metadata for better rankings
2. **Social Media Sharing**: Optimized OpenGraph and Twitter cards
3. **Canonical URLs**: Prevent duplicate content issues
4. **Robot Control**: Fine-grained control over indexing

### For Developers
1. **DRY Principle**: Single source of truth for site-wide SEO
2. **Type Safety**: Full TypeScript support with generated types
3. **Consistent Pattern**: Reusable approach across all pages
4. **Easy Maintenance**: Update one location instead of many files

## Files Modified

### Configuration
- [src/globals/store/config.ts](src/globals/store/config.ts) - Enhanced SEO fields

### Actions
- [src/feature/store/actions/index.ts](src/feature/store/actions/index.ts) - Created store config action

### Pages
- [src/app/(frontend)/layout.tsx](src/app/(frontend)/layout.tsx) - Site-wide defaults
- [src/app/(frontend)/page.tsx](src/app/(frontend)/page.tsx) - Home page metadata
- [src/app/(frontend)/(auth)/login/page.tsx](src/app/(frontend)/(auth)/login/page.tsx) - Login metadata
- [src/app/(frontend)/(auth)/register/page.tsx](src/app/(frontend)/(auth)/register/page.tsx) - Register metadata
- [src/app/(frontend)/(auth)/forgot-password/page.tsx](src/app/(frontend)/(auth)/forgot-password/page.tsx) - Forgot password metadata
- [src/app/(frontend)/order/confirmation/page.tsx](src/app/(frontend)/order/confirmation/page.tsx) - Order confirmation metadata

## Type Generation

After modifying the store config, TypeScript types were regenerated:
```bash
pnpm run generate:types
```

This ensures full type safety when accessing the new SEO fields.

## Usage Example

### In Admin Panel
1. Navigate to **Globals > Store Config**
2. Go to **SEO** tab
3. Fill in the following fields:
   - Meta Title (e.g., "Best Online Store | Quality Products")
   - Meta Description (120-160 characters)
   - Keywords (add items like "online shopping", "quality products", etc.)
   - Canonical URL (e.g., "https://yourstore.com")
   - Open Graph settings (title, description, image)
   - Twitter settings (card type, title, description, image)
   - Robots settings (noIndex, noFollow checkboxes)

### In Code
```typescript
import { getStoreConfig } from '@/feature/store/actions'

export async function generateMetadata(): Promise<Metadata> {
  const storeConfig = await getStoreConfig()

  return {
    title: storeConfig?.metaTitle || 'Default Title',
    description: storeConfig?.metaDescription || 'Default description',
    // ... other metadata
  }
}
```

## Future Enhancements

### Potential Improvements
1. **Structured Data**: Add JSON-LD schema markup fields
2. **Multi-language**: Support for internationalized SEO
3. **A/B Testing**: Support for SEO title/description variants
4. **Analytics Integration**: Track metadata performance
5. **Preview**: Show how metadata appears in search results
6. **Validation**: Character count warnings for descriptions
7. **Image Optimization**: Auto-generate optimized OG images

## Related Documentation
- [Frontend Pages SEO Enhancement](FRONTEND_PAGES_SEO_ENHANCEMENT.md)
- [Account Pages SEO Enhancement](ACCOUNT_PAGES_SEO_ENHANCEMENT.md)

## Summary

This enhancement provides centralized, CMS-controlled SEO management for the entire site. Administrators can now manage all SEO settings through the PayloadCMS admin panel without requiring developer intervention. The implementation follows SEO best practices with comprehensive metadata, social media optimization, and privacy protection where appropriate.
