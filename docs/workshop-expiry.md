# Workshop promotion expiry

Before promoting any dated workshop from the homepage, add its verified route,
Singapore registration cutoff, recognisable promotion text/image names and fact
authority to `public/workshop-promotions.json`. Never guess a missing date. Use
the actual registration closing instant; it must not be later than event end.

`npm run build` checks the rendered homepage and expired event pages. It rejects
unregistered homepage workshop links, expired promotions, open forms, registration
buttons and available structured offers. Keep expired entries in the registry so
an old promotion cannot be reintroduced silently. A historical event page may
remain with a clear ended/registration-closed notice.

The existing Nexius Dev Academy Course Website Lifecycle job also runs
`node scripts/check-workshop-expiry.mjs --live` at 08:00, 12:00 and 16:00 Singapore
time even if no cohort action is due. It reads the public pages, not only the
campaign packet or previous completion ledger. A failed audit requires Dev to
repair the specific promotion through the existing guarded release, or report
the concrete blocker. A job that merely runs successfully is insufficient.

After an event cutoff, the next scheduled audit may be up to 16 hours later.
This is periodic detection and guarded removal, not an instantaneous runtime
switch. Advance closure releases should be planned when an exact cutoff matters.
Do not add a second scheduler or change enrolment, CRM or outreach state.
