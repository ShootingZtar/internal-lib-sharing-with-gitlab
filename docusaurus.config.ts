import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Vue Component Library with GitLab',
  tagline: 'Learn to build, publish, and share Vue components internally using GitLab Package Registry',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  // Set the production url of your site here
  // For GitHub Pages: https://<username>.github.io
  url: 'https://shootingstar.github.io',

  // Set the /<baseUrl>/ pathname under which your site is served
  // baseUrl: '/', // For vercel
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/internal-lib-sharing-with-gitlab/', // For GitHub Pages

  // GitHub Pages deployment config
  organizationName: 'shootingstar', // Your GitHub username or org
  projectName: 'internal-lib-sharing-with-gitlab', // Your repo name
  trailingSlash: false,

  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: '/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      defaultMode: 'dark',
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Vue + GitLab Registry',
      logo: {
        alt: 'Course Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'courseSidebar',
          position: 'left',
          label: '📚 Course',
        },
        {
          href: 'https://docs.gitlab.com/ee/user/packages/npm_registry/',
          label: 'GitLab Docs',
          position: 'right',
        },
        {
          href: 'https://vuejs.org/',
          label: 'Vue.js',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Course',
          items: [
            {
              label: 'Getting Started',
              to: '/',
            },
            {
              label: 'Build Your Library',
              to: '/building-library/project-setup',
            },
            {
              label: 'Publish to GitLab',
              to: '/publishing/gitlab-registry-setup',
            },
          ],
        },
        {
          title: 'Resources',
          items: [
            {
              label: 'Vue.js Documentation',
              href: 'https://vuejs.org/guide/introduction.html',
            },
            {
              label: 'GitLab Package Registry',
              href: 'https://docs.gitlab.com/ee/user/packages/',
            },
            {
              label: 'Vite',
              href: 'https://vitejs.dev/',
            },
          ],
        },
        {
          title: 'Tools',
          items: [
            {
              label: 'GitLab',
              href: 'https://gitlab.com',
            },
            {
              label: 'npm',
              href: 'https://www.npmjs.com/',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Internal Training. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'json', 'yaml'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
