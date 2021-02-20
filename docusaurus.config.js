module.exports = {
  title: 'yurets.pro',
  tagline: 'yurets.pro Docs & Blog',
  url: 'https://docs.yurets.pro',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'https://yurets.pro/favicon.ico',
  organizationName: 'yurymuski', // Usually your GitHub org/user name.
  projectName: 'blog-docusaurus', // Usually your repo name.
  themeConfig: {
    navbar: {
      title: '',
      logo: {
        alt: 'docs.yurets.pro',
        src: 'https://yurets.pro/favicon.ico',
      },
      items: [
        {
          href: 'https://yurets.pro',
          label: 'Resume',
          position: 'left',
        },
        {
          to: 'docs',
          label: 'Docs',
          position: 'left',
        },
        {
          to: 'blog', 
          label: 'Blog', 
          position: 'left'
        }
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Github',
          items: [
            {
              label: 'blog-docusaurus',
              href: 'https://github.com/yurymuski/blog-docusaurus',
            },
            {
              label: 'resume',
              href: 'https://github.com/yurymuski/resume',
            },
            {
              label: 'geo-checker',
              href: 'https://github.com/yurymuski/geo-checker',
            },
            {
              label: 'curl-http3',
              href: 'https://github.com/yurymuski/curl-http3',
            },
            {
              label: 'nginx-http3',
              href: 'https://github.com/yurymuski/nginx-http3',
            },
          ],
        },
        {
          title: 'Contact',
          items: [
            {
              label: 'LinkedIn',
              href: 'https://www.linkedin.com/in/yury-muski',
            },
            {
              label: 'Telegram',
              href: 'https://t.me/yury_muski',
            }
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Medium Blog',
              href: 'https://yuretspro.medium.com',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} yures.pro. Built with Docusaurus.`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl:
            'https://github.com/yurymuski/blog-docusaurus/edit/main/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl:
            'https://github.com/yurymuski/blog-docusaurus/edit/main/blog/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
