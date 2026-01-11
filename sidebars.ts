import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  courseSidebar: [
    'intro',
    {
      type: 'category',
      label: '🏗️ Building Your Library',
      collapsed: false,
      items: [
        'building-library/project-setup',
        'building-library/creating-components',
        'building-library/styling-components',
        'building-library/building-for-distribution',
      ],
    },
    {
      type: 'category',
      label: '📦 Publishing to GitLab',
      collapsed: false,
      items: [
        'publishing/gitlab-registry-setup',
        'publishing/package-configuration',
        'publishing/publishing-workflow',
        'publishing/versioning-strategy',
      ],
    },
    {
      type: 'category',
      label: '🔧 Using the Library',
      collapsed: false,
      items: [
        'consuming/installing-packages',
        'consuming/authentication',
        'consuming/using-components',
      ],
    },
    {
      type: 'category',
      label: '🚀 Advanced Topics',
      collapsed: true,
      items: [
        'advanced/ci-cd-automation',
        'advanced/monorepo-setup',
        'advanced/documentation',
      ],
    },
  ],
};

export default sidebars;
