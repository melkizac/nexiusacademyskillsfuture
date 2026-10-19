import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const readSource = (path) => readFile(new URL('../../' + path, import.meta.url), 'utf8');

test('homepage no longer promotes the ended October workshop and retains current courses', async () => {
  const source = await readSource('pages/HomePage.tsx');
  assert.doesNotMatch(source, /CoursePreviewCTA|build-your-first-ai-agent|first-ai-agent-20261017|17 October 2026/);
  assert.match(source, /<CourseList \/>/);
  assert.match(source, /<Hero \/>/);
});

test('past workshop retains its historical details but cannot submit a registration', async () => {
  const source = await readSource('pages/FirstAIAgentWorkshopPage.tsx');
  assert.match(source, /This event has ended/);
  assert.match(source, /Registration closed/);
  assert.match(source, /Past event · 17 October 2026/);
  assert.match(source, /2026-10-17T10:00:00\+08:00/);
  assert.match(source, /2026-10-17T12:00:00\+08:00/);
  assert.match(source, /Devan Nair Institute/);
  assert.match(source, /id="registration"/);
  assert.match(source, /Explore current courses/);
  assert.doesNotMatch(source, /<form|<input|type="submit"|submitLeadCapture|REGISTER NOW|href="#registration"|reserve_seat|Seats are limited/);
});

test('workshop search and social metadata clearly describe a past event', async () => {
  const seo = await readSource('scripts/postbuild-seo.mjs');
  const event = seo.split("path: '/workshops/build-your-first-ai-agent',")[1].split("path: '/workshops/linkedin-ai-agent',")[0];
  assert.match(event, /lastmod: '2026-10-19'/);
  assert.match(event, /Past Event: Build Your First AI Agent/);
  assert.match(event, /Registration is closed/);
  assert.match(event, /This event has ended and registration is closed/);
  assert.doesNotMatch(event, /Join Nexius Academy|EventScheduled|InStock/);
});
