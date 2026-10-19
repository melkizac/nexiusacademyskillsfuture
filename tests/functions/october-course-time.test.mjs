import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = (relativePath) => readFileSync(new URL(`../../${relativePath}`, import.meta.url), 'utf8');

test('Started October Foundation is absent from upcoming schedules and structured metadata', () => {
  for (const path of ['constants.tsx', 'components/courses/Schedule.tsx', 'pages/AICareerFairPage.tsx', 'scripts/postbuild-seo.mjs']) {
    assert.doesNotMatch(source(path), /09 Oct 2026|16 Oct 2026|9 & 16 October 2026|2026-10-09|2026-10-16|October cohort|October registration is closed/, path);
  }
  assert.match(source('constants.tsx'), /06 Nov 2026 & 13 Nov 2026/);
  assert.match(source('components/leads/LeadCaptureModal.tsx'), /SCHEDULES.filter/);
  assert.match(source('components/leads/LeadCaptureModal.tsx'), /!schedule.registrationClosed/);
});
