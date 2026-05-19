import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'Materialify Docs',
  description:
    'A Material Design inspired icon management plugin for Obsidian.',
  base: '/materialify/',
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/getting-started/installation' },
      { text: 'Features', link: '/features/files-and-folders/naming' },
      { text: 'Reference', link: '/reference/icon-names' },
      {
        text: 'v2.12.0',
        items: [
          {
            text: 'Changelog',
            link: 'https://github.com/himanshu-17lodhi/Materialify/releases',
          },
          { text: 'Migration Guide', link: '/getting-started/migration' },
        ],
      },
    ],

    search: {
      provider: 'local',
    },

    sidebar: [
      {
        text: 'Getting Started',
        collapsed: false,
        items: [
          { text: 'Installation', link: '/getting-started/installation' },
          { text: 'Quick Start', link: '/getting-started/quick-start' },
          { text: 'First Icons', link: '/getting-started/first-icons' },
          { text: 'Migration Guide', link: '/getting-started/migration' },
        ],
      },
      {
        text: 'Features',
        collapsed: false,
        items: [
          {
            text: 'Files & Folders',
            collapsed: true,
            items: [
              {
                text: 'Icon Selection',
                link: '/features/files-and-folders/naming',
              },
              {
                text: 'Icon in Tabs',
                link: '/features/files-and-folders/tabs',
              },
            ],
          },
          {
            text: 'Notes & Content',
            collapsed: true,
            items: [
              { text: 'Inline Icons', link: '/features/notes/inline-icons' },
              { text: 'Title Icons', link: '/features/notes/title-icons' },
            ],
          },
          {
            text: 'Icon Packs',
            collapsed: true,
            items: [
              { text: 'Overview', link: '/features/icon-packs/overview' },
              {
                text: 'Predefined Packs',
                link: '/features/icon-packs/predefined-packs',
              },
              {
                text: 'Custom Packs',
                link: '/features/icon-packs/custom-packs',
              },
              {
                text: 'Emoji Support',
                link: '/features/icon-packs/emoji-support',
              },
            ],
          },
          {
            text: 'Automation',
            collapsed: true,
            items: [
              {
                text: 'Custom Rules',
                link: '/features/automation/custom-rules',
              },
              {
                text: 'Frontmatter Support',
                link: '/features/automation/frontmatter',
              },
            ],
          },
        ],
      },
      {
        text: 'Customization',
        collapsed: true,
        items: [
          { text: 'Settings', link: '/customization/settings' },
          { text: 'Colors', link: '/customization/colors' },
          { text: 'Performance', link: '/customization/performance' },
          {
            text: 'Syncing',
            items: [
              {
                text: 'Syncing Overview',
                link: '/customization/syncing/overview',
              },
              {
                text: 'Background Checker',
                link: '/customization/syncing/background-checker',
              },
              {
                text: 'Troubleshooting',
                link: '/customization/syncing/troubleshooting',
              },
            ],
          },
        ],
      },
      {
        text: 'Integrations',
        collapsed: true,
        items: [{ text: 'Metadatamenu', link: '/integrations/metadatamenu' }],
      },
      {
        text: 'Developer',
        collapsed: true,
        items: [
          { text: 'Architecture', link: '/developer/architecture' },
          { text: 'Contributing', link: '/developer/contributing' },
          { text: 'API Reference', link: '/developer/api' },
          { text: 'Roadmap', link: '/developer/roadmap' },
        ],
      },
      {
        text: 'Reference',
        collapsed: true,
        items: [
          { text: 'Icon Names', link: '/reference/icon-names' },
          { text: 'PNG to SVG', link: '/reference/png-to-svg' },
          { text: 'Unicode Issues', link: '/reference/unicode-issues' },
        ],
      },
      {
        text: 'Deprecated',
        collapsed: true,
        items: [{ text: 'Inheritance', link: '/deprecated/inheritance' }],
      },
    ],

    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/himanshu-17lodhi/Materialify',
      },
    ],

    footer: {
      message:
        'Released under the <a href="https://github.com/himanshu-17lodhi/Materialify/blob/main/LICENSE">MIT License</a>.',
      copyright:
        'Copyright © 2021-present <a href="https://github.com/himanshu-17lodhi/">Himanshu Lodhi</a>',
    },
  },
});
