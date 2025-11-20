# Live Video Streaming Platform Design Guidelines

## Design Approach
**Reference-Based Approach**: Kick.com-inspired design with modern streaming platform aesthetics, dark theme optimized for long viewing sessions, vibrant accent system for CTAs and status indicators.

## Typography System

**Font Stack**: Inter (primary UI), Roboto Mono (stats/numbers)

**Hierarchy**:
- Hero/Stream Titles: text-3xl to text-5xl, font-bold
- Section Headers: text-2xl, font-semibold
- Streamer Names: text-xl, font-medium
- Body/Chat: text-base, font-normal
- Metadata (viewer counts, timestamps): text-sm, font-medium
- Stats/Rankings: text-lg to text-2xl, font-bold (Roboto Mono)

## Layout System

**Spacing Primitives**: Tailwind units of 2, 4, 6, 8, and 12 (p-4, gap-6, m-8, etc.)

**Container Strategy**:
- Full-width sections: w-full with max-w-7xl center constraint
- Stream grid: gap-4 on mobile, gap-6 on desktop
- Sidebar navigation: fixed w-64, hidden on mobile with hamburger menu
- Main content area: Adjust for sidebar (ml-0 md:ml-64)

**Grid Patterns**:
- Stream cards: grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
- Featured/Live section: grid-cols-1 md:grid-cols-2 gap-6
- Category filters: Horizontal scroll on mobile, grid on desktop

## Core Component Library

### Navigation
**Top Bar**: Fixed header with logo (left), search bar (center), user profile/login (right), h-16, backdrop-blur effect
**Sidebar**: Categories list, Following section, Recommended streamers, collapsible on mobile

### Stream Cards
- Thumbnail area: aspect-video with rounded-lg, relative positioning for live badge overlay
- Live badge: Absolute top-2 left-2, rounded-full, px-3 py-1, font-semibold, pulsing animation
- Viewer count: Absolute bottom-2 right-2, backdrop-blur-md, rounded-md, px-2 py-1
- Stream info below: Streamer avatar (48px rounded-full), name, category tag, subscriber count
- Hover state: Transform scale-105 transition

### Stream Page Layout
**Two-column**: 
- Left (main): 70% width, video player (aspect-video, rounded-lg), stream title, streamer info bar, description tabs
- Right (chat): 30% width, sticky position, full viewport height, chat messages scrollable area, input at bottom

### Streamer Profiles
**Hero Section**: Cover image (h-48), profile avatar (128px, -translate-y-1/2), streamer name, subscribe button, social links
**Stats Bar**: Grid of 4 items (Followers, Total Views, Avg Viewers, Rank), each with large number display and label
**Content Tabs**: Streams (grid), About, Schedule, Clips

### Rating & Interaction Elements
- Rating buttons: Thumb up/down with counts, rounded-full, p-3, hover states
- Subscribe button: Large, prominent, rounded-lg, px-8 py-3, font-semibold
- Comment cards: Rounded-lg, p-4, flex layout with avatar and content

### Leaderboard/Rankings
**Table Layout**: 
- Rank column (w-16, centered)
- Streamer (flex with avatar + name)
- Category tag
- Stats columns (views, rating score, subscribers)
- Alternating row backgrounds for readability

### Category Tags
Small, rounded-full badges, px-3 py-1, text-xs, font-medium, scattered throughout cards and headers

## Images

**Hero/Banner Images**:
- Homepage hero: Large banner showcasing platform (h-96), featuring diverse streamers in action, vibrant streaming setup backgrounds
- Category headers: Each category (Gaming, Health, Academe, etc.) has unique themed banner (h-48)
- Stream thumbnails: Actual stream captures or custom thumbnails per streamer (aspect-video ratio)
- Streamer profile covers: Personal branding images (h-48 to h-64)

**Avatars**: 
- Use throughout for streamer identity (48px standard, 128px for profiles, 32px in chat/comments)
- Rounded-full with border treatment

**Platform Usage**:
- Thumbnails: CDN-hosted or local /public/streams/ directory
- User avatars: /public/avatars/ or external URLs
- Category images: /public/categories/ for consistent theming

## Animations

**Minimal Strategic Use**:
- Live pulse indicator: Gentle opacity pulse on live badges
- Hover transforms: scale-105 on cards, subtle transition-all duration-200
- Chat auto-scroll: Smooth scroll behavior for new messages
- Page transitions: None (instant for snappy feel)

## Accessibility

- Focus states: Visible ring-2 offset-2 on all interactive elements
- ARIA labels: Proper labels for viewer counts, live status, rating buttons
- Keyboard navigation: Full support for tab order through streams, chat, and navigation
- Screen reader: Announce live status, viewer counts, rating changes
- Form inputs: Consistent h-10 to h-12, rounded-lg, proper labels and placeholders

## Page-Specific Layouts

**Homepage**: 
- Featured streams carousel (2 large cards, side by side)
- Category filter bar (horizontal scroll chips)
- Live now grid (4 columns desktop)
- Recommended channels section

**Browse/Category**: 
- Category banner with description
- Filter/sort controls
- Stream grid with infinite scroll or pagination

**Stream Page**: 
- Video player prominence (70% width, aspect-video)
- Streamer info bar below player
- Chat sidebar (fixed, scrollable)
- Related streams below fold

**Dashboard (Streamer)**: 
- Stats overview cards (4-column grid)
- Stream management table
- Analytics graphs placeholder areas
- Quick action buttons (Go Live, Edit Profile)

---

**Design Principle**: Optimize for extended viewing sessions with dark backgrounds, reduce eye strain, maximize content visibility, and create clear visual hierarchy that guides viewers to live content and engagement features.