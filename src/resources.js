// Har content type ek config hai. Naya type add karna = yahan ek entry.
export const resources = {
  projects: {
    title: 'Projects', singular: 'project', path: '/projects', columns: ['title', 'techStack', 'featured'],
    fields: [
      { name: 'title', label: 'Title' },
      { name: 'slug', label: 'Slug (used in the URL)' },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'techStack', label: 'Tech stack (comma separated)', type: 'tags' },
      { name: 'imageUrl', label: 'Cover image', type: 'image' },
      { name: 'githubUrl', label: 'GitHub link' },
      { name: 'liveUrl', label: 'Live site link' },
      { name: 'featured', label: 'Show on the home page', type: 'checkbox' },
    ],
  },
  skills: {
    title: 'Skills', singular: 'skill', path: '/skills', columns: ['name', 'category', 'level'],
    fields: [
      { name: 'name', label: 'Name' },
      { name: 'category', label: 'Category (e.g. Backend)' },
      { name: 'level', label: 'Level (0-100)', type: 'number' },
    ],
  },
  blogs: {
    title: 'Blogs', singular: 'post', path: '/blogs', list: '/blogs/all', columns: ['title', 'slug', 'published'],
    fields: [
      { name: 'title', label: 'Title' },
      { name: 'slug', label: 'Slug (used in the URL)' },
      { name: 'excerpt', label: 'Short summary' },
      { name: 'content', label: 'Content', type: 'textarea', rows: 12 },
      { name: 'coverImage', label: 'Cover image', type: 'image' },
      { name: 'published', label: 'Published (visible on the site)', type: 'checkbox' },
    ],
  },
  experience: {
    title: 'Experience', singular: 'entry', path: '/experience', columns: ['company', 'role', 'startDate', 'current'],
    fields: [
      { name: 'company', label: 'Company' },
      { name: 'role', label: 'Role' },
      { name: 'startDate', label: 'Start date', type: 'date' },
      { name: 'endDate', label: 'End date', type: 'date' },
      { name: 'current', label: 'I still work here', type: 'checkbox' },
      { name: 'description', label: 'What you did', type: 'textarea' },
    ],
  },
  testimonials: {
    title: 'Testimonials', singular: 'testimonial', path: '/testimonials', columns: ['name', 'company', 'message'],
    fields: [
      { name: 'name', label: 'Name' },
      { name: 'role', label: 'Their role' },
      { name: 'company', label: 'Company' },
      { name: 'message', label: 'Testimonial', type: 'textarea' },
      { name: 'avatarUrl', label: 'Photo', type: 'image' },
    ],
  },
  services: {
    title: 'Services', singular: 'service', path: '/services', columns: ['name', 'description'],
    fields: [
      { name: 'name', label: 'Name' },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'icon', label: 'Icon name or emoji' },
    ],
  },
  messages: {
    title: 'Messages', singular: 'message', path: '/messages', readOnly: true, columns: ['name', 'email', 'message'],
    fields: [
      { name: 'name', label: 'Name' },
      { name: 'email', label: 'Email' },
      { name: 'message', label: 'Message' },
    ],
  },
};

export const aboutFields = [
  { name: 'fullName', label: 'Full name' },
  { name: 'title', label: 'Headline (e.g. Full-stack developer)' },
  { name: 'bio', label: 'Bio', type: 'textarea', rows: 7 },
  { name: 'avatarUrl', label: 'Profile photo', type: 'image' },
  { name: 'resumeUrl', label: 'Resume link' },
  { name: 'email', label: 'Public email' },
  { name: 'location', label: 'Location' },
  { name: 'github', label: 'GitHub link' },
  { name: 'linkedin', label: 'LinkedIn link' },
];
