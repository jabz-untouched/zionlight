# Zionlight Family Foundation - Admin Manual

**Version 1.0** | Last Updated: January 2026

Welcome to the Zionlight Family Foundation Admin Panel. This manual will guide you through managing the website content, events, blog posts, and more.

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Dashboard Overview](#dashboard-overview)
3. [Managing Programs](#managing-programs)
4. [Managing Blog Posts](#managing-blog-posts)
5. [Managing Events](#managing-events)
6. [Managing Team Members](#managing-team-members)
7. [Managing the Gallery](#managing-the-gallery)
8. [Media Library](#media-library)
9. [Content Management](#content-management)
10. [Site Settings](#site-settings)
11. [Best Practices](#best-practices)
12. [Troubleshooting](#troubleshooting)

---

## Getting Started

### Accessing the Admin Panel

1. Navigate to `https://yourwebsite.com/admin` (or `/login`)
2. Enter your admin credentials (email and password)
3. You will be redirected to the Dashboard

### Navigation

The admin panel has a sidebar on the left with the following sections:

| Icon | Section | Purpose |
|------|---------|---------|
| 📊 | Dashboard | Overview and quick actions |
| 📝 | Content | Manage page content sections |
| 📋 | Programs | Foundation programs and initiatives |
| ✍️ | Blog | Blog posts and articles |
| 📅 | Events | Events and registrations |
| 👥 | Team | Team members and leadership |
| 🖼️ | Gallery | Photos and media gallery |
| 🎨 | Media | Hero images and managed images |
| ⚙️ | Settings | Site-wide settings |

### Logging Out

Click the **🚪 Logout** button at the bottom of the sidebar to securely log out.

---

## Dashboard Overview

The Dashboard is your home base. It provides:

### Statistics Cards
- **Programs** - Total number of programs
- **Blog Posts** - Total blog articles
- **Events** - Total events created
- **Team Members** - Total team members
- **Gallery** - Total gallery items
- **Media Library** - Total managed images

### Quick Actions
Shortcuts to create new content:
- ➕ **New Program** - Create a new program
- ✍️ **New Blog Post** - Write a new article
- 📅 **New Event** - Create a new event
- 👤 **New Team Member** - Add a team member
- 🖼️ **New Gallery Item** - Add a gallery image
- 📤 **Upload Media** - Upload new images

---

## Managing Programs

Programs are the core initiatives of the foundation displayed on the Programs page.

### Viewing Programs
1. Click **📋 Programs** in the sidebar
2. You'll see a table with all programs showing:
   - Title and URL slug
   - Status (Published/Draft)
   - Featured status
   - Display order

### Creating a New Program
1. Click **"Add Program"** button (top right)
2. Fill in the form:
   - **Title** (required) - The program name
   - **Slug** - URL-friendly version (auto-generated from title)
   - **Description** - Short summary shown on program cards
   - **Full Content** - Detailed program description
   - **Image** - Upload a program image
   - **Order** - Display order (lower = first)
   - **Is Active** - Toggle to publish/unpublish
   - **Is Featured** - Toggle to feature on homepage
3. Click **Save**

### Editing a Program
1. Find the program in the list
2. Click **Edit** button
3. Make your changes
4. Click **Save**

### Publishing/Unpublishing
- Click the toggle button in the Actions column to switch between Published and Draft status

### Deleting a Program
1. Click the **Delete** button (trash icon)
2. Confirm the deletion

> ⚠️ **Warning**: Deletion is permanent and cannot be undone.

---

## Managing Blog Posts

Blog posts appear on the Blog page and can be categorized and tagged.

### Viewing Blog Posts
1. Click **✍️ Blog** in the sidebar
2. The table shows:
   - Title and URL slug
   - Category
   - Status (Published/Draft)
   - Featured status
   - Published date

### Creating a New Blog Post
1. Click **"New Post"** button
2. Fill in the form:
   - **Title** (required) - Article headline
   - **Slug** - URL path (auto-generated)
   - **Category** - Select from existing categories
   - **Tags** - Add relevant tags
   - **Excerpt** - Short summary for previews
   - **Content** - Full article body (supports rich text)
   - **Featured Image** - Main article image
   - **Is Published** - Toggle to publish immediately
   - **Is Featured** - Toggle to feature on homepage
   - **Published Date** - Set the publication date
3. Click **Save**

### Tips for Blog Posts
- Use descriptive titles for better SEO
- Always add an excerpt for social sharing
- Use relevant tags to improve discoverability
- Add a featured image for visual appeal

---

## Managing Events

Events can have registrations enabled for attendees to sign up.

### Viewing Events
1. Click **📅 Events** in the sidebar
2. The table shows:
   - Event title and slug
   - Date and time
   - Location
   - Status (Published/Draft/Past)
   - Registration count

### Creating a New Event
1. Click **"New Event"** button
2. Fill in the form:
   - **Title** (required) - Event name
   - **Slug** - URL path
   - **Description** - Event details
   - **Start Date & Time** (required)
   - **End Date & Time** (optional)
   - **Location** - Physical address or "Online"
   - **Registration Settings**:
     - **Allow Registration** - Enable/disable signups
     - **Registration Closed** - Manually close registration
     - **Max Capacity** - Limit number of registrants (optional)
   - **Image** - Event banner image
   - **Is Published** - Toggle to publish
   - **Is Featured** - Toggle to feature on homepage
3. Click **Save**

### Managing Registrations
1. From the Events list, click the registration count number
2. View all registrations with:
   - Attendee name
   - Email
   - Phone (if provided)
   - Registration date
   - Additional information

### Event Status
- **Published** - Visible on the website
- **Draft** - Not visible to the public
- **Past** - Event date has passed

---

## Managing Team Members

Team members are displayed on the About page.

### Viewing Team Members
1. Click **👥 Team** in the sidebar
2. The table shows:
   - Name and role
   - Email
   - Status (Active/Inactive)
   - Featured status

### Adding a Team Member
1. Click **"Add Member"** button
2. Fill in the form:
   - **Name** (required) - Full name
   - **Role** (required) - Job title/position
   - **Bio** - Short biography
   - **Email** - Contact email (optional)
   - **LinkedIn URL** - LinkedIn profile (optional)
   - **Photo** - Profile picture
   - **Order** - Display order
   - **Is Active** - Toggle visibility
   - **Is Featured** - Show on homepage team section
   - **Is Director** - Mark as director (shown prominently)
3. Click **Save**

### Team Member Order
Use the **Order** field to control the display sequence. Lower numbers appear first.

---

## Managing the Gallery

The Gallery displays photos organized by categories and tags.

### Viewing Gallery Items
1. Click **🖼️ Gallery** in the sidebar
2. The table shows:
   - Thumbnail and title
   - Tags
   - Status (Active/Inactive)
   - Featured status

### Adding a Gallery Item
1. Click **"Add Item"** button
2. Fill in the form:
   - **Title** (required) - Image title
   - **Description** - Caption or description
   - **Image** (required) - Upload the photo
   - **Category** - Group (e.g., "Events", "Programs", "Community")
   - **Tags** - Searchable tags
   - **Date Taken** - When the photo was taken (optional)
   - **Order** - Display order
   - **Is Active** - Toggle visibility
   - **Is Featured** - Feature prominently (larger display)
3. Click **Save**

### Tips for Gallery
- Use consistent categories for easy filtering
- Add descriptive tags for search
- Featured items are displayed larger and first

---

## Media Library

The Media Library manages hero images, homepage features, and global images.

### Understanding Contexts
| Context | Description |
|---------|-------------|
| **HERO** | Hero slider images on the homepage |
| **HOME** | Featured images on the homepage |
| **GLOBAL** | Placeholders and default images |

### Adding a Managed Image
1. Click **🎨 Media** in the sidebar
2. Click **"Add Image"** button
3. Fill in:
   - **Key** - Unique identifier (e.g., "hero-slide-1")
   - **Title** - Display name
   - **Description** - Internal notes
   - **Alt Text** - Accessibility text
   - **Image** - Upload the image
   - **Context** - HERO, HOME, or GLOBAL
   - **Position** - Additional positioning info
   - **Order** - Display order (for hero slides)
   - **Is Active** - Toggle visibility
4. Click **Save**

### Hero Slider Images
- Use context "HERO" for homepage slider
- Order determines slide sequence
- Recommended size: 1920x1080 pixels minimum

---

## Content Management

Manage text content for various pages without editing code.

### Viewing Content Sections
1. Click **📝 Content** in the sidebar
2. Content is organized by page:
   - 🔵 **Home** - Homepage sections
   - 🟣 **About** - About page sections
   - 🟢 **Programs** - Programs page sections
   - 🟡 **Gallery** - Gallery page sections
   - 🔴 **Contact** - Contact page sections
   - ⚫ **Legal** - Legal/policy pages

### Editing Content
1. Find the section you want to edit
2. Click **Edit**
3. Update the fields:
   - **Title** - Section heading
   - **Subtitle** - Section subheading
   - **Body** - Main content text
   - **CTA Text** - Call-to-action button text
   - **CTA Link** - Call-to-action URL
   - **Order** - Display order within page
   - **Is Active** - Toggle visibility
4. Click **Save**

### Adding New Content Sections
1. Click **"New Content"** button
2. Select the **Page ID** (home, about, programs, etc.)
3. Enter a unique **Section Key** (e.g., "hero", "intro", "cta")
4. Fill in the content fields
5. Click **Save**

> 💡 **Tip**: Section keys should be lowercase with hyphens (e.g., "our-story", "mission-vision")

---

## Site Settings

Configure global website settings.

### Available Settings

| Setting | Description |
|---------|-------------|
| **Footer Tagline** | Tagline in the website footer |
| **Footer Copyright** | Legal/copyright text in footer |
| **Contact Email** | Primary contact email |
| **Contact Phone** | Primary phone number |
| **Contact Address** | Physical address |
| **Facebook URL** | Facebook page link |
| **Instagram URL** | Instagram profile link |
| **Twitter/X URL** | Twitter/X profile link |

### Updating Settings
1. Click **⚙️ Settings** in the sidebar
2. Update any field values
3. Click **Save Settings**

---

## Best Practices

### Content Guidelines
1. **Use clear, concise titles** - Keep titles under 60 characters for SEO
2. **Add alt text to all images** - Improves accessibility and SEO
3. **Preview before publishing** - Visit the public site to verify changes
4. **Use consistent formatting** - Maintain brand voice and style

### Image Guidelines
| Type | Recommended Size | Format |
|------|-----------------|--------|
| Hero Images | 1920x1080 px | JPG, WebP |
| Program Images | 800x600 px | JPG, PNG, WebP |
| Team Photos | 400x400 px (square) | JPG, PNG |
| Gallery Photos | 1200x800 px | JPG, WebP |
| Blog Featured | 1200x630 px | JPG, WebP |

### Workflow Recommendations
1. **Draft first** - Create content as draft, review, then publish
2. **Regular backups** - The system auto-saves, but review important changes
3. **Test on mobile** - Always check how content appears on mobile devices
4. **Use featured sparingly** - Only 3-4 featured items per section

---

## Troubleshooting

### Common Issues

#### "Changes not appearing on website"
- Clear your browser cache (Ctrl+Shift+R or Cmd+Shift+R)
- Wait 30 seconds for cache to update
- Ensure the item is set to "Published" or "Active"

#### "Image not uploading"
- Check file size (max 10MB recommended)
- Use supported formats: JPG, PNG, WebP, GIF
- Try a different browser if issue persists

#### "Can't delete an item"
- Ensure the item is not being referenced elsewhere
- Check if you have the correct permissions

#### "Form not saving"
- Check all required fields are filled (marked with *)
- Ensure slug is unique and URL-friendly
- Check for any validation error messages

### Getting Help

If you encounter issues not covered here:
1. Note the error message (if any)
2. Note what action you were trying to perform
3. Contact the technical administrator

---

## Quick Reference Card

### Status Meanings
- 🟢 **Published/Active** - Visible on website
- 🟡 **Draft/Inactive** - Hidden from public
- ⭐ **Featured** - Highlighted/prominent display

### Keyboard Shortcuts
- **Ctrl/Cmd + S** - Save (in form editors)
- **Escape** - Cancel/close dialogs

### Important URLs
- Admin Panel: `/admin`
- Dashboard: `/admin/dashboard`
- View Website: `/` (homepage)

---

*This manual is for internal staff use only. For technical documentation, see the developer docs.*
