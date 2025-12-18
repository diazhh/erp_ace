// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'ERP - Manual de Usuario',
  tagline: 'Sistema de Gestión Empresarial',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://erp-docs.example.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  baseUrl: '/',

  // GitHub pages deployment config.
  organizationName: 'empresa',
  projectName: 'erp-docs',

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'es',
    locales: ['es'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          exclude: ['**/prompt-capturas.md'],
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  plugins: [
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'descripcion',
        path: 'docs-descripcion',
        routeBasePath: 'descripcion',
        sidebarPath: require.resolve('./sidebars-descripcion.js'),
        exclude: ['**/prompt-capturas.md'],
      },
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/erp-social-card.jpg',
      navbar: {
        title: 'ERP Docs',
        logo: {
          alt: 'ERP Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'guiaUsoSidebar',
            position: 'left',
            label: 'Guía de Uso',
          },
          {
            to: '/descripcion/intro',
            label: 'Descripción de Módulos',
            position: 'left',
            activeBaseRegex: `/descripcion/`,
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Documentación',
            items: [
              {
                label: 'Guía de Uso',
                to: '/docs/',
              },
              {
                label: 'Descripción de Módulos',
                to: '/descripcion/intro',
              },
            ],
          },
          {
            title: 'ERP',
            items: [
              {
                label: 'Aplicación',
                href: 'http://localhost:5173',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} ERP Sistema de Gestión. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
