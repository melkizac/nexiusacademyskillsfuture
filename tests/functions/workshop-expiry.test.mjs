import assert from 'node:assert/strict';
import test from 'node:test';
import { auditHome, auditEvent, isExpired, validateEvents } from '../../scripts/check-workshop-expiry.mjs';

const event = { id: 'test', path: '/workshops/test', registrationClosesAt: '2026-10-17T12:00:00+08:00', endsAt: '2026-10-17T12:00:00+08:00', promotionMarkers: ['Test workshop'], authority: 'verified owner date' };
const cutoff = Date.parse(event.registrationClosesAt);
const closed = '<main><h1>Past event</h1><p>This workshop has ended. Registration closed.</p><a href="/#courses">Current courses</a></main>';

test('Singapore cutoff expires exactly at noon, not UTC noon or the next day', () => {
  assert.equal(isExpired(event, cutoff - 1), false);
  assert.equal(isExpired(event, cutoff), true);
  assert.equal(new Date(cutoff).toISOString(), '2026-10-17T04:00:00.000Z');
});
test('expired homepage links and orphan promotion copy fail; later events pass', () => {
  assert.equal(auditHome('<main><a href="/workshops/test/?source=home">Read more</a></main>', [event], cutoff).length, 1);
  assert.equal(auditHome('<main>Test workshop</main>', [event], cutoff).length, 1);
  assert.deepEqual(auditHome(`<main><session-promotion data-session-id="test" data-expires-at="${event.endsAt}"><a href="/workshops/test/">Test workshop</a></session-promotion></main>`, [event], cutoff - 1), []);
  assert.match(auditHome('<main><a href="/workshops/test/">Test workshop</a></main>', [event], cutoff - 1)[0], /must use SessionPromotion/);
});
test('new unregistered homepage workshops fail rather than disappearing from lifecycle coverage', () => {
  assert.match(auditHome('<main><a href="https://academy.nexiuslabs.com/workshops/new/">New</a></main>', [event], cutoff)[0], /no verified expiry/);
});
test('historical event can remain but registration, offers and missing closure fail', () => {
  assert.deepEqual(auditEvent(closed, event, cutoff), []);
  for (const unsafe of ['<form></form>', '<input>', '<button type="submit">Go</button>', '<a href="#registration">Register</a>', 'REGISTER NOW', 'Reserve your seat']) {
    assert.ok(auditEvent(closed.replace('</main>', `${unsafe}</main>`), event, cutoff).length, unsafe);
  }
  assert.ok(auditEvent('<main>Welcome</main>', event, cutoff).length);
  assert.ok(auditEvent(closed + '<script>{"availability":"https://schema.org/InStock"}</script>', event, cutoff).length);
  assert.deepEqual(auditEvent('<main><form>REGISTER NOW</form></main>', event, cutoff - 1), []);
});
test('missing dates, timezone, duplicates and unknown registry versions fail closed', () => {
  assert.deepEqual(validateEvents({ version: 1, events: [event] }), [event]);
  for (const invalid of [{ ...event, registrationClosesAt: '' }, { ...event, registrationClosesAt: '2026-10-17T12:00:00Z' }, { ...event, authority: '' }]) {
    assert.throws(() => validateEvents({ version: 1, events: [invalid] }));
  }
  assert.throws(() => validateEvents({ version: 1, events: [event, event] }));
  assert.throws(() => validateEvents({ version: 2, events: [event] }));
});

test('creation requires an actual end time and registration cannot outlast the session', () => {
  assert.throws(() => validateEvents({ version: 1, events: [{ ...event, endsAt: '' }] }));
  assert.throws(() => validateEvents({ version: 1, events: [{ ...event, registrationClosesAt: '2026-10-17T13:00:00+08:00' }] }));
  const earlyClose = { ...event, registrationClosesAt: '2026-10-16T12:00:00+08:00' };
  assert.equal(isExpired(earlyClose, cutoff - 1), false);
  assert.equal(isExpired(earlyClose, cutoff), true);
});

test('unlinked banners and wrong or nested boundaries cannot bypass automatic expiry', () => {
  assert.match(auditHome('<main>Test workshop</main>', [event], cutoff - 1)[0], /outside its automatic expiry boundary/);
  assert.ok(auditHome('<main><session-promotion data-session-id="test" data-expires-at="2027-01-01T12:00:00+08:00">Test workshop</session-promotion></main>', [event], cutoff - 1).length);
  assert.ok(auditHome(`<main><session-promotion data-session-id="test" data-expires-at="${event.endsAt}"><session-promotion>Test workshop</session-promotion></session-promotion></main>`, [event], cutoff - 1).length);
});
