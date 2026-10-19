# Session promotion rules

When creating or changing any dated preview, workshop or session promotion:

- Record its verified Singapore end timestamp (`endsAt`, with `+08:00`) in
  `public/workshop-promotions.json` before publishing. Keep registration closing
  time separate and no later than the session end. Ask for a missing end time;
  do not guess it.
- Wrap the complete promotional block in `SessionPromotion` from
  `components/sessions/SessionPromotion.tsx`, using the registry event ID.
  Do not nest these wrappers or hard-code a dated homepage banner outside one.
  The wrapper applies the end timestamp automatically to every new promotion.
- Preserve the Netlify edge expiry handler. It removes expired promotional
  blocks from cached HTML on the server. The React component removes them from
  already-open pages at the cutoff and rechecks when a page resumes.
- Run the function/regression tests and full rendered build. The build must
  reject missing end times, missing expiry wrappers and expired promotions.
- Keep ended registry entries and historical session pages. Do not alter other
  courses, enrolment records or outreach as part of expiry maintenance.

Use the existing guarded production controller and exact live readback. The
08:00/12:00/16:00 Dev job is a verification/archival backstop, not the expiry clock.
