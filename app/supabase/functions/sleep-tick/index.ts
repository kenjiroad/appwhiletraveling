// Moves the marmot along the night on every lock screen that said "Bonne nuit".
// Run every 10 minutes by Supabase Cron. Sends an ActivityKit push update to each iPhone through
// Apple's push service (APNs), signed with the APNs key stored in the Supabase secrets.
//
// Secrets (Supabase → Edge Functions → Secrets), never in the code:
//   APNS_KEY_ID       the 10-character id of the APNs key
//   APNS_TEAM_ID      the Apple Team ID
//   APNS_PRIVATE_KEY  the content of the AuthKey_XXXX.p8 file
//   APNS_BUNDLE_ID    fr.debout.app
//   APNS_HOST         optional, api.push.apple.com (default) or api.sandbox.push.apple.com
// SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are provided by Supabase automatically.

import { createClient } from 'npm:@supabase/supabase-js@2';

const env = (name: string) => {
  const value = Deno.env.get(name);
  if (!value) throw new Error(`Missing secret ${name}`);
  return value;
};

function base64url(data: ArrayBuffer | Uint8Array | string) {
  const bytes = typeof data === 'string' ? new TextEncoder().encode(data) : new Uint8Array(data);
  let binary = '';
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/** APNs wants a JWT signed with the .p8 key (ES256). Valid up to an hour: one per run is enough. */
async function apnsToken() {
  const pem = env('APNS_PRIVATE_KEY').replace(/-----[^-]+-----/g, '').replace(/\s+/g, '');
  const der = Uint8Array.from(atob(pem), (c) => c.charCodeAt(0));
  const key = await crypto.subtle.importKey('pkcs8', der, { name: 'ECDSA', namedCurve: 'P-256' }, false, ['sign']);
  const header = base64url(JSON.stringify({ alg: 'ES256', kid: env('APNS_KEY_ID') }));
  const claims = base64url(JSON.stringify({ iss: env('APNS_TEAM_ID'), iat: Math.floor(Date.now() / 1000) }));
  const signature = await crypto.subtle.sign({ name: 'ECDSA', hash: 'SHA-256' }, key, new TextEncoder().encode(`${header}.${claims}`));
  return `${header}.${claims}.${base64url(signature)}`;
}

type Night = { user_id: string; push_token: string; bedtime_at: string; alarm_at: string };

Deno.serve(async () => {
  const supabase = createClient(env('SUPABASE_URL'), env('SUPABASE_SERVICE_ROLE_KEY'));
  const now = Date.now();

  // Nights that ended more than an hour ago are forgotten.
  await supabase.from('sleep_activities').delete().lt('alarm_at', new Date(now - 3_600_000).toISOString());

  const { data: nights, error } = await supabase
    .from('sleep_activities')
    .select('user_id, push_token, bedtime_at, alarm_at')
    .gt('alarm_at', new Date(now).toISOString());
  if (error) return new Response(error.message, { status: 500 });
  if (!nights?.length) return Response.json({ sent: 0 });

  const jwt = await apnsToken();
  const host = Deno.env.get('APNS_HOST') ?? 'api.push.apple.com';
  const topic = `${env('APNS_BUNDLE_ID')}.push-type.liveactivity`;

  const results = await Promise.all(
    (nights as Night[]).map(async (night) => {
      const bedtime = Date.parse(night.bedtime_at) / 1000;
      const alarm = Date.parse(night.alarm_at) / 1000;
      const progress = Math.min(1, Math.max(0, (now / 1000 - bedtime) / Math.max(alarm - bedtime, 1)));
      const response = await fetch(`https://${host}/3/device/${night.push_token}`, {
        method: 'POST',
        headers: {
          authorization: `bearer ${jwt}`,
          'apns-push-type': 'liveactivity',
          'apns-topic': topic,
          // Low priority: no budget limit, iOS applies it at the next good moment.
          'apns-priority': '5',
        },
        body: JSON.stringify({
          aps: {
            timestamp: Math.floor(now / 1000),
            event: 'update',
            'content-state': { alarmAt: alarm, bedtimeAt: bedtime, progress },
            'stale-date': Math.floor(alarm),
          },
        }),
      });
      // 410: the activity is gone (ended, dismissed): stop sending.
      if (response.status === 410) await supabase.from('sleep_activities').delete().eq('user_id', night.user_id);
      return response.status;
    })
  );

  return Response.json({ sent: results.filter((s) => s === 200).length, statuses: results });
});
