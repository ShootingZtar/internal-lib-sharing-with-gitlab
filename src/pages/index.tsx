import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero', styles.heroBanner)}>
      <div className="container">
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <Heading as="h1" className={styles.heroTitle}>
              {siteConfig.title}
            </Heading>
            <p className={styles.heroSubtitle}>{siteConfig.tagline}</p>
            <div className={styles.buttons}>
              <Link
                className={clsx('button button--lg', styles.primaryButton)}
                to="/intro">
                🚀 Start Learning
              </Link>
              <Link
                className={clsx('button button--lg button--outline', styles.secondaryButton)}
                to="/building-library/project-setup">
                📖 Jump to Setup
              </Link>
            </div>
          </div>
          <div className={styles.heroVisual}>
            <div className={styles.codePreview}>
              <div className={styles.codeHeader}>
                <span className={styles.dot} style={{background: '#ff5f56'}}></span>
                <span className={styles.dot} style={{background: '#ffbd2e'}}></span>
                <span className={styles.dot} style={{background: '#27ca40'}}></span>
                <span className={styles.codeTitle}>package.json</span>
              </div>
              <pre className={styles.codeBlock}>
{`{
  "name": "@myorg/vue-components",
  "version": "1.0.0",
  "publishConfig": {
    "registry": "https://gitlab.com/api/v4/..."
  }
}`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

type FeatureItem = {
  icon: string;
  title: string;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    icon: '🧩',
    title: 'Build Reusable Components',
    description: (
      <>
        Learn to create a Vue 3 component library with TypeScript, 
        proper exports, and tree-shaking support using Vite.
      </>
    ),
  },
  {
    icon: '🦊',
    title: 'GitLab Package Registry',
    description: (
      <>
        Publish your library to GitLab's npm registry for secure, 
        internal distribution within your organization.
      </>
    ),
  },
  {
    icon: '🔐',
    title: 'Secure & Private',
    description: (
      <>
        Keep your components internal with proper authentication, 
        access controls, and scoped packages.
      </>
    ),
  },
  {
    icon: '⚡',
    title: 'CI/CD Automation',
    description: (
      <>
        Automate versioning, building, and publishing with GitLab CI/CD 
        pipelines for seamless releases.
      </>
    ),
  },
];

function Feature({icon, title, description}: FeatureItem) {
  return (
    <div className={clsx('col col--3')}>
      <div className={styles.featureCard}>
        <div className={styles.featureIcon}>{icon}</div>
        <Heading as="h3" className={styles.featureTitle}>{title}</Heading>
        <p className={styles.featureDescription}>{description}</p>
      </div>
    </div>
  );
}

function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <Heading as="h2" className={styles.sectionTitle}>
          What You'll Learn
        </Heading>
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CourseOutline(): ReactNode {
  return (
    <section className={styles.outline}>
      <div className="container">
        <Heading as="h2" className={styles.sectionTitle}>
          Course Outline
        </Heading>
        <div className={styles.outlineGrid}>
          <div className={styles.outlineCard}>
            <div className={styles.outlineNumber}>01</div>
            <h3>Project Setup</h3>
            <p>Initialize a Vue 3 + TypeScript + Vite project configured for library development.</p>
          </div>
          <div className={styles.outlineCard}>
            <div className={styles.outlineNumber}>02</div>
            <h3>Create Components</h3>
            <p>Build reusable, well-documented components with props, events, and slots.</p>
          </div>
          <div className={styles.outlineCard}>
            <div className={styles.outlineNumber}>03</div>
            <h3>Configure Build</h3>
            <p>Set up Vite for library mode with proper entry points and type declarations.</p>
          </div>
          <div className={styles.outlineCard}>
            <div className={styles.outlineNumber}>04</div>
            <h3>Publish to GitLab</h3>
            <p>Configure npm for GitLab registry and publish your first package version.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  return (
    <Layout
      title="Learn Vue Component Libraries"
      description="A comprehensive course on building and sharing Vue component libraries internally using GitLab Package Registry">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
        <CourseOutline />
      </main>
    </Layout>
  );
}
