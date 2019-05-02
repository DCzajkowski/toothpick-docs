module.exports = {
  title: 'Toothpick',
  description: 'A minimal functional language compiled to JavaScript.',
  base: '/',
  head: [
    ['link', { rel: 'icon', type: 'image/png', href: '/assets/favicon.png' }],
  ],
  themeConfig: {
    logo: '/assets/logo.svg',
    repo: 'dczajkowski/toothpick',
    docsRepo: 'dczajkowski/toothpick-docs',
    editLinks: true,
    docsDir: '',
    editLinkText: 'Edit this page on GitHub',
    sidebarDepth: 2,
    nav: [
      { text: 'Documentation', link: '/introduction' },
    ],
    sidebar: [
      ['/introduction', 'Introduction'],
      ['/installation', 'Installation'],
      ['/getting-started', 'Getting Started'],
      ['/specification', 'Specification'],
      ['/standard-library', 'Standard Library'],
    ],
  },
}
