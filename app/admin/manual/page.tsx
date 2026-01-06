import Link from "next/link";

export const metadata = {
  title: "Admin Manual | Zionlight Admin",
};

export default function AdminManualPage() {
  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold">Admin Manual</h1>
        <p className="text-muted-foreground">
          Complete guide to managing the Zionlight Family Foundation website
        </p>
      </div>

      {/* Table of Contents */}
      <nav className="rounded-lg border bg-card p-6">
        <h2 className="text-lg font-semibold mb-4">📑 Table of Contents</h2>
        <div className="grid gap-2 sm:grid-cols-2">
          <a href="#getting-started" className="text-primary hover:underline">1. Getting Started</a>
          <a href="#dashboard" className="text-primary hover:underline">2. Dashboard Overview</a>
          <a href="#programs" className="text-primary hover:underline">3. Managing Programs</a>
          <a href="#blog" className="text-primary hover:underline">4. Managing Blog Posts</a>
          <a href="#events" className="text-primary hover:underline">5. Managing Events</a>
          <a href="#team" className="text-primary hover:underline">6. Managing Team Members</a>
          <a href="#gallery" className="text-primary hover:underline">7. Managing the Gallery</a>
          <a href="#media" className="text-primary hover:underline">8. Media Library</a>
          <a href="#content" className="text-primary hover:underline">9. Content Management</a>
          <a href="#settings" className="text-primary hover:underline">10. Site Settings</a>
          <a href="#best-practices" className="text-primary hover:underline">11. Best Practices</a>
          <a href="#troubleshooting" className="text-primary hover:underline">12. Troubleshooting</a>
        </div>
      </nav>

      {/* Getting Started */}
      <section id="getting-started" className="rounded-lg border bg-card p-6 space-y-4">
        <h2 className="text-xl font-semibold">🚀 Getting Started</h2>
        
        <div>
          <h3 className="font-medium mb-2">Accessing the Admin Panel</h3>
          <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
            <li>Navigate to <code className="bg-muted px-1 rounded">/admin</code> or <code className="bg-muted px-1 rounded">/login</code></li>
            <li>Enter your admin credentials (email and password)</li>
            <li>You will be redirected to the Dashboard</li>
          </ol>
        </div>

        <div>
          <h3 className="font-medium mb-2">Navigation</h3>
          <p className="text-muted-foreground mb-2">The sidebar on the left contains all sections:</p>
          <div className="grid gap-2 text-sm">
            <div className="flex items-center gap-2"><span>📊</span> <strong>Dashboard</strong> - Overview and quick actions</div>
            <div className="flex items-center gap-2"><span>📝</span> <strong>Content</strong> - Manage page content sections</div>
            <div className="flex items-center gap-2"><span>📋</span> <strong>Programs</strong> - Foundation programs and initiatives</div>
            <div className="flex items-center gap-2"><span>✍️</span> <strong>Blog</strong> - Blog posts and articles</div>
            <div className="flex items-center gap-2"><span>📅</span> <strong>Events</strong> - Events and registrations</div>
            <div className="flex items-center gap-2"><span>👥</span> <strong>Team</strong> - Team members and leadership</div>
            <div className="flex items-center gap-2"><span>🖼️</span> <strong>Gallery</strong> - Photos and media gallery</div>
            <div className="flex items-center gap-2"><span>🎨</span> <strong>Media</strong> - Hero images and managed images</div>
            <div className="flex items-center gap-2"><span>⚙️</span> <strong>Settings</strong> - Site-wide settings</div>
          </div>
        </div>
      </section>

      {/* Dashboard */}
      <section id="dashboard" className="rounded-lg border bg-card p-6 space-y-4">
        <h2 className="text-xl font-semibold">📊 Dashboard Overview</h2>
        
        <div>
          <h3 className="font-medium mb-2">Statistics Cards</h3>
          <p className="text-muted-foreground">
            The dashboard shows counts for Programs, Blog Posts, Events, Team Members, Gallery Items, and Media Library.
          </p>
        </div>

        <div>
          <h3 className="font-medium mb-2">Quick Actions</h3>
          <p className="text-muted-foreground">
            Shortcuts to quickly create new content: New Program, New Blog Post, New Event, New Team Member, New Gallery Item, Upload Media.
          </p>
        </div>
      </section>

      {/* Programs */}
      <section id="programs" className="rounded-lg border bg-card p-6 space-y-4">
        <h2 className="text-xl font-semibold">📋 Managing Programs</h2>
        
        <div>
          <h3 className="font-medium mb-2">Creating a New Program</h3>
          <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
            <li>Go to <Link href="/admin/programs" className="text-primary hover:underline">Programs</Link> → Click &quot;Add Program&quot;</li>
            <li>Fill in: <strong>Title</strong>, <strong>Description</strong>, <strong>Full Content</strong></li>
            <li>Upload an image and set the display order</li>
            <li>Toggle &quot;Is Active&quot; to publish</li>
            <li>Toggle &quot;Is Featured&quot; to show on homepage</li>
            <li>Click <strong>Save</strong></li>
          </ol>
        </div>

        <div className="bg-amber-500/10 border border-amber-500/20 rounded-md p-3 text-sm">
          <strong>💡 Tip:</strong> Use the Order field to control display sequence. Lower numbers appear first.
        </div>
      </section>

      {/* Blog */}
      <section id="blog" className="rounded-lg border bg-card p-6 space-y-4">
        <h2 className="text-xl font-semibold">✍️ Managing Blog Posts</h2>
        
        <div>
          <h3 className="font-medium mb-2">Creating a New Blog Post</h3>
          <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
            <li>Go to <Link href="/admin/blog" className="text-primary hover:underline">Blog</Link> → Click &quot;New Post&quot;</li>
            <li>Fill in: <strong>Title</strong>, <strong>Category</strong>, <strong>Tags</strong></li>
            <li>Write the <strong>Excerpt</strong> (short summary) and <strong>Content</strong> (full article)</li>
            <li>Upload a featured image</li>
            <li>Set the publication date and status</li>
            <li>Click <strong>Save</strong></li>
          </ol>
        </div>

        <div className="bg-blue-500/10 border border-blue-500/20 rounded-md p-3 text-sm">
          <strong>📝 Best Practice:</strong> Always add an excerpt for social sharing and SEO. Use relevant tags for discoverability.
        </div>
      </section>

      {/* Events */}
      <section id="events" className="rounded-lg border bg-card p-6 space-y-4">
        <h2 className="text-xl font-semibold">📅 Managing Events</h2>
        
        <div>
          <h3 className="font-medium mb-2">Creating a New Event</h3>
          <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
            <li>Go to <Link href="/admin/events" className="text-primary hover:underline">Events</Link> → Click &quot;New Event&quot;</li>
            <li>Fill in: <strong>Title</strong>, <strong>Description</strong>, <strong>Location</strong></li>
            <li>Set <strong>Start Date/Time</strong> and optionally <strong>End Date/Time</strong></li>
            <li>Configure registration settings (allow registration, max capacity)</li>
            <li>Upload an event image</li>
            <li>Click <strong>Save</strong></li>
          </ol>
        </div>

        <div>
          <h3 className="font-medium mb-2">Managing Registrations</h3>
          <p className="text-muted-foreground">
            From the Events list, click on the registration count to view all attendees with their name, email, and registration date.
          </p>
        </div>

        <div className="grid gap-2 text-sm">
          <div className="flex items-center gap-2">🟢 <strong>Published</strong> - Visible on the website</div>
          <div className="flex items-center gap-2">🟡 <strong>Draft</strong> - Not visible to the public</div>
          <div className="flex items-center gap-2">⚫ <strong>Past</strong> - Event date has passed</div>
        </div>
      </section>

      {/* Team */}
      <section id="team" className="rounded-lg border bg-card p-6 space-y-4">
        <h2 className="text-xl font-semibold">👥 Managing Team Members</h2>
        
        <div>
          <h3 className="font-medium mb-2">Adding a Team Member</h3>
          <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
            <li>Go to <Link href="/admin/team" className="text-primary hover:underline">Team</Link> → Click &quot;Add Member&quot;</li>
            <li>Fill in: <strong>Name</strong>, <strong>Role</strong>, <strong>Bio</strong></li>
            <li>Add email and LinkedIn URL (optional)</li>
            <li>Upload a profile photo</li>
            <li>Set order, active status, and featured flag</li>
            <li>Mark as &quot;Director&quot; for leadership prominence</li>
            <li>Click <strong>Save</strong></li>
          </ol>
        </div>
      </section>

      {/* Gallery */}
      <section id="gallery" className="rounded-lg border bg-card p-6 space-y-4">
        <h2 className="text-xl font-semibold">🖼️ Managing the Gallery</h2>
        
        <div>
          <h3 className="font-medium mb-2">Adding a Gallery Item</h3>
          <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
            <li>Go to <Link href="/admin/gallery" className="text-primary hover:underline">Gallery</Link> → Click &quot;Add Item&quot;</li>
            <li>Fill in: <strong>Title</strong>, <strong>Description</strong></li>
            <li>Upload the photo</li>
            <li>Add <strong>Category</strong> and <strong>Tags</strong></li>
            <li>Set date taken (optional) and display order</li>
            <li>Click <strong>Save</strong></li>
          </ol>
        </div>

        <div className="bg-amber-500/10 border border-amber-500/20 rounded-md p-3 text-sm">
          <strong>💡 Tip:</strong> Featured items are displayed larger and appear first. Use consistent categories for easy filtering.
        </div>
      </section>

      {/* Media */}
      <section id="media" className="rounded-lg border bg-card p-6 space-y-4">
        <h2 className="text-xl font-semibold">🎨 Media Library</h2>
        
        <div>
          <h3 className="font-medium mb-2">Understanding Contexts</h3>
          <div className="grid gap-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="bg-purple-500/20 text-purple-500 px-2 py-0.5 rounded text-xs font-medium">HERO</span>
              Hero slider images on the homepage
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-blue-500/20 text-blue-500 px-2 py-0.5 rounded text-xs font-medium">HOME</span>
              Featured images on the homepage
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-gray-500/20 text-gray-500 px-2 py-0.5 rounded text-xs font-medium">GLOBAL</span>
              Placeholders and default images
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-2">Adding a Managed Image</h3>
          <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
            <li>Go to <Link href="/admin/media" className="text-primary hover:underline">Media</Link> → Click &quot;Add Image&quot;</li>
            <li>Enter a unique <strong>Key</strong> (e.g., &quot;hero-slide-1&quot;)</li>
            <li>Add <strong>Title</strong> and <strong>Alt Text</strong></li>
            <li>Upload the image</li>
            <li>Select the appropriate <strong>Context</strong></li>
            <li>Set order for hero slides</li>
            <li>Click <strong>Save</strong></li>
          </ol>
        </div>
      </section>

      {/* Content */}
      <section id="content" className="rounded-lg border bg-card p-6 space-y-4">
        <h2 className="text-xl font-semibold">📝 Content Management</h2>
        
        <p className="text-muted-foreground">
          Manage text content for various pages without editing code. Content is organized by page:
        </p>

        <div className="grid gap-2 text-sm">
          <div className="flex items-center gap-2">
            <span className="bg-blue-500/20 text-blue-500 px-2 py-0.5 rounded text-xs font-medium">Home</span>
            Homepage sections
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-purple-500/20 text-purple-500 px-2 py-0.5 rounded text-xs font-medium">About</span>
            About page sections
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-green-500/20 text-green-500 px-2 py-0.5 rounded text-xs font-medium">Programs</span>
            Programs page sections
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-amber-500/20 text-amber-500 px-2 py-0.5 rounded text-xs font-medium">Gallery</span>
            Gallery page sections
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-rose-500/20 text-rose-500 px-2 py-0.5 rounded text-xs font-medium">Contact</span>
            Contact page sections
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-gray-500/20 text-gray-500 px-2 py-0.5 rounded text-xs font-medium">Legal</span>
            Legal/policy pages
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-2">Editing Content</h3>
          <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
            <li>Go to <Link href="/admin/content" className="text-primary hover:underline">Content</Link></li>
            <li>Find the section and click <strong>Edit</strong></li>
            <li>Update Title, Subtitle, Body, CTA Text/Link</li>
            <li>Click <strong>Save</strong></li>
          </ol>
        </div>
      </section>

      {/* Settings */}
      <section id="settings" className="rounded-lg border bg-card p-6 space-y-4">
        <h2 className="text-xl font-semibold">⚙️ Site Settings</h2>
        
        <div>
          <h3 className="font-medium mb-2">Available Settings</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 font-medium">Setting</th>
                  <th className="text-left py-2 font-medium">Description</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                <tr className="border-b"><td className="py-2">Footer Tagline</td><td>Tagline in the website footer</td></tr>
                <tr className="border-b"><td className="py-2">Footer Copyright</td><td>Legal/copyright text in footer</td></tr>
                <tr className="border-b"><td className="py-2">Contact Email</td><td>Primary contact email</td></tr>
                <tr className="border-b"><td className="py-2">Contact Phone</td><td>Primary phone number</td></tr>
                <tr className="border-b"><td className="py-2">Contact Address</td><td>Physical address</td></tr>
                <tr className="border-b"><td className="py-2">Facebook URL</td><td>Facebook page link</td></tr>
                <tr className="border-b"><td className="py-2">Instagram URL</td><td>Instagram profile link</td></tr>
                <tr><td className="py-2">Twitter/X URL</td><td>Twitter/X profile link</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <p className="text-muted-foreground">
          Go to <Link href="/admin/settings" className="text-primary hover:underline">Settings</Link>, update any values, and click <strong>Save Settings</strong>.
        </p>
      </section>

      {/* Best Practices */}
      <section id="best-practices" className="rounded-lg border bg-card p-6 space-y-4">
        <h2 className="text-xl font-semibold">✨ Best Practices</h2>
        
        <div>
          <h3 className="font-medium mb-2">Content Guidelines</h3>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            <li>Use clear, concise titles (under 60 characters for SEO)</li>
            <li>Add alt text to all images for accessibility</li>
            <li>Preview before publishing - visit the public site to verify</li>
            <li>Use consistent formatting and brand voice</li>
          </ul>
        </div>

        <div>
          <h3 className="font-medium mb-2">Recommended Image Sizes</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 font-medium">Type</th>
                  <th className="text-left py-2 font-medium">Size</th>
                  <th className="text-left py-2 font-medium">Format</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                <tr className="border-b"><td className="py-2">Hero Images</td><td>1920×1080 px</td><td>JPG, WebP</td></tr>
                <tr className="border-b"><td className="py-2">Program Images</td><td>800×600 px</td><td>JPG, PNG, WebP</td></tr>
                <tr className="border-b"><td className="py-2">Team Photos</td><td>400×400 px (square)</td><td>JPG, PNG</td></tr>
                <tr className="border-b"><td className="py-2">Gallery Photos</td><td>1200×800 px</td><td>JPG, WebP</td></tr>
                <tr><td className="py-2">Blog Featured</td><td>1200×630 px</td><td>JPG, WebP</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-2">Workflow Tips</h3>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            <li><strong>Draft first</strong> - Create as draft, review, then publish</li>
            <li><strong>Test on mobile</strong> - Always check how content appears on phones</li>
            <li><strong>Use featured sparingly</strong> - Only 3-4 featured items per section</li>
          </ul>
        </div>
      </section>

      {/* Troubleshooting */}
      <section id="troubleshooting" className="rounded-lg border bg-card p-6 space-y-4">
        <h2 className="text-xl font-semibold">🔧 Troubleshooting</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-1">Changes not appearing on website?</h3>
            <ul className="list-disc list-inside text-muted-foreground text-sm">
              <li>Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)</li>
              <li>Wait 30 seconds for cache to update</li>
              <li>Ensure the item is set to &quot;Published&quot; or &quot;Active&quot;</li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-1">Image not uploading?</h3>
            <ul className="list-disc list-inside text-muted-foreground text-sm">
              <li>Check file size (max 10MB recommended)</li>
              <li>Use supported formats: JPG, PNG, WebP, GIF</li>
              <li>Try a different browser if issue persists</li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-1">Form not saving?</h3>
            <ul className="list-disc list-inside text-muted-foreground text-sm">
              <li>Check all required fields are filled (marked with *)</li>
              <li>Ensure slug is unique and URL-friendly</li>
              <li>Look for validation error messages</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Quick Reference */}
      <section className="rounded-lg border bg-card p-6 space-y-4">
        <h2 className="text-xl font-semibold">📌 Quick Reference</h2>
        
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <h3 className="font-medium mb-2">Status Meanings</h3>
            <div className="space-y-1 text-sm">
              <div className="flex items-center gap-2">🟢 <strong>Published/Active</strong> - Visible on website</div>
              <div className="flex items-center gap-2">🟡 <strong>Draft/Inactive</strong> - Hidden from public</div>
              <div className="flex items-center gap-2">⭐ <strong>Featured</strong> - Highlighted/prominent</div>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Keyboard Shortcuts</h3>
            <div className="space-y-1 text-sm text-muted-foreground">
              <div><kbd className="bg-muted px-1.5 py-0.5 rounded text-xs">Ctrl/Cmd + S</kbd> Save (in editors)</div>
              <div><kbd className="bg-muted px-1.5 py-0.5 rounded text-xs">Escape</kbd> Cancel/close dialogs</div>
            </div>
          </div>
        </div>
      </section>

      <p className="text-center text-muted-foreground text-sm">
        This manual is for internal staff use. Last updated: January 2026
      </p>
    </div>
  );
}
