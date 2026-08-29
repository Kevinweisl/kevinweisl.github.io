/** Every static route, in one place. Navbar, sitemap and each page's metadata read from here. */
export const routes = {
  home: { path: '', label: 'Home' },
  publications: { path: '/publications', label: 'Publications' },
  notes: { path: '/notes', label: 'Notes' },
  experience: { path: '/experience', label: 'Experience' },
} as const;

/** Order = navbar order. */
export const navRoutes = [routes.publications, routes.notes, routes.experience];
