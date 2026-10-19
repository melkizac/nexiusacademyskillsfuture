# Automatic session promotion expiry

Every new dated session promotion requires a verified `endsAt` timestamp in
`public/workshop-promotions.json`, with an explicit Singapore `+08:00` offset.
Keep `registrationClosesAt` separate, no later than `endsAt`. Missing or invalid
end times stop the build; never guess them. Keep ended entries in the registry.

Wrap the complete promotional card, banner or invitation using the event ID:

```tsx
<SessionPromotion eventId="verified-session-id">
  <YourSessionPromotion />
</SessionPromotion>
```

Import `SessionPromotion` from `components/sessions/SessionPromotion.tsx`.
It reads the end time automatically from the registry. Do not nest wrappers.
The rendered homepage build check rejects session links without this boundary
or with a deadline that disagrees with the verified registry.

The Netlify edge handler removes expired boundaries from HTML on each request,
even if the underlying static asset was built and cached before the deadline.
It prevents caching that could retain a promotion beyond its cutoff. Assets,
API requests, POSTs and non-HTML responses are left alone. On an already-open
page, the React timer removes the promotion at its end time and rechecks on
visibility/focus/page restoration. A suspended browser applies the cutoff when
it resumes; browser timers cannot run while the device is suspended.

Expiry needs no model run, scheduler or redeployment. The existing Dev job at
08:00, 12:00 and 16:00 Singapore time remains a live verification and archival
backstop. Its live check also verifies that the server expiry handler is active.
The build and audit still reject expired promotions and open expired session
registration. Historical event pages may remain explicitly ended and closed.

Run `npm run test:functions`, `npm run build` and the guarded production release.
After release run `node scripts/check-workshop-expiry.mjs --live`. Do not delete
old registry records or bypass the guard to make a release pass. No additional
scheduler, CRM/enrolment change or outreach is part of this mechanism.
