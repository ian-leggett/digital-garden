---
title: "Accessibility Report"
---

1. Using Cypress visit the main page
2. Crawl internal links
3. Visit each link once
4. Run Cypress axe accessibility tests
5. Generate a report
6. Save the report in the `reports` directory
7. Create separate Github issues for each page, listing all accessibility issues
8. Make sure you don't create duplicate issues

## Cypress Accessibility Report Script
This script uses Cypress and the `cypress-axe` plugin to crawl a website, check each page for accessibility issues, and generate a report. It also ensures that each page is visited only once to avoid duplicate checks.

```javascript
/// <reference types="cypress" />
import 'cypress-axe';

const visited = new Set();

function spider(url, depth = 2) {
  if (visited.has(url) || depth === 0) return;
  visited.add(url);

  cy.visit(url);
  cy.injectAxe();
  cy.checkA11y(null, {
    includedImpacts: ['critical', 'serious'],
  });

  cy.get('a[href^="/"]')
    .then($links => {
    const hrefs = [...new Set(
      $links
        .map((i, el) => el.getAttribute('href'))
        .get()
        .filter(href =>
          typeof href === 'string' &&
          !href.startsWith('#') &&
          !href.includes('logout') && // optionally skip auth-breaking routes
          !href.includes('mailto:') &&
          !visited.has(new URL(href, Cypress.config().baseUrl).toString())
        )
    )];

      cy.wrap(hrefs).each(href => {
        const absolute = new URL(href, Cypress.config().baseUrl).toString();
        cy.then(() => spider(absolute, depth - 1));
      });
    });
}

describe('Spider site for a11y', () => {
  it('Crawls and audits pages', () => {
    spider(`${Cypress.config().baseUrl}/`, 2); // depth: 2 = homepage + 1 level
  });
});
```

## Generate a Report

```javascript
function formatViolationsToMarkdown(url, violations) {
  const header = `## Accessibility Violations on \`${url}\`\n\n`;
  if (!violations.length) return header + '_No violations found._';

  return header + violations.map(v => `
### ❌ ${v.id}
- Impact: \`${v.impact}\`
- Description: ${v.description}
- Help: [${v.help}](${v.helpUrl})
- Affected Elements:
${v.nodes.map(n => `  - \`${n.html}\``).join('\n')}
  `).join('\n');
}
```

## Save the Report in the Reports Directory

```javascript
cy.checkA11y(null, null, (violations) => {
  const safeName = url === '/' ? 'home' : url.replace(/\//g, '-').replace(/^-/, '');
  const markdown = formatViolationsToMarkdown(url, violations);

  cy.writeFile(`reports/a11y-${safeName}.md`, markdown);
  cy.task('log', `✅ Saved report: a11y-${safeName}.md`);
});
```

## Create Separate Github Issues for Each Page

```javascript
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const reportsDir = './reports';

## Prevent Duplicate Issues

```javascript
fs.readdirSync(reportsDir).forEach(file => {
  const page = file.replace('.md', '');
  const title = `Accessibility issues on /${page}`;
  const body = fs.readFileSync(path.join(reportsDir, file), 'utf8');

  // Check if issue already exists
  const existing = execSync(`gh issue list --search "${title}" --state open`, { encoding: 'utf8' });

  if (existing.includes(title)) {
    console.log(`⚠️  Issue already exists for /${page}, skipping.`);
  } else {
    try {
      execSync(`gh issue create --title "${title}" --body "${body}" --label "accessibility,automated"`);
      console.log(`✅ Created issue for /${page}`);
    } catch (err) {
      console.error(`❌ Failed to create issue for /${page}: ${err.message}`);
    }
  }
});
```
