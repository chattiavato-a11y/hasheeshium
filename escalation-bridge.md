# Escalation Bridge — WebSocket Path Validation

The escalation workflow already ships with a hardened `/api/secure/escalate` Worker
that receives sanitized user intent, top-k retrieval chunks, and the active
system guardrails before handing the session to a human operator. To validate the
network path that carries those escalations, provision a lightweight WebSocket
bridge Worker dedicated to echo testing.

## Architecture snapshot

1. **L2/L3 checks first.** The browser client must clear existing layer-two and
   layer-three policy checks before attempting to upgrade to a WebSocket or
   WebRTC session.
2. **External TURN/STUN.** Keep relay infrastructure managed by the provider so
   there is no sensitive key material or NAT traversal logic inside the Workers
   footprint.
3. **Escalation API.** Production conversations continue to flow through the
   secure `/api/secure/escalate` Worker. The bridge Worker only confirms that
   zero-trust routing, headers, and firewall rules allow upgraded connections.

## Deploy the bridge Worker

1. Open the Cloudflare dashboard and create a second Worker named something like
   `ops-escalation-bridge`.
2. Paste the contents of `websocket_bridge_worker.js`
   into the editor and deploy.
3. Optionally scope it behind the same IP lists, JWT checks, or client certs that
   protect the primary escalation Worker.

```javascript
export default {
  async fetch(request) {
    const { pathname } = new URL(request.url);

    if (pathname !== '/ws') {
      return new Response('OK');
    }

    if (request.headers.get('Upgrade') !== 'websocket') {
      return new Response('Expected WS', { status: 426 });
    }

    const [client, server] = Object.values(new WebSocketPair());

    server.accept();
    server.addEventListener('message', (event) => {
      server.send(`ACK:${String(event.data ?? '')}`);
    });

    return new Response(null, { status: 101, webSocket: client });
  }
};
```

## Validation checklist

- Initiate a WebSocket connection to `/ws` and confirm each message receives an
  `ACK:` echo response.
- Ensure the Worker responds with HTTP 426 if a client forgets to request a
  WebSocket upgrade.
- Monitor logs for unexpected payloads; because the Worker simply echoes input,
  it should never be reachable from public internet segments.

## Security + compliance notes

- Keep the Worker stateless so it can live behind zero-trust policies and scale
  across regions without managing session affinity.
- Continue routing real escalations through the hardened API Worker so PCI DSS,
  NIST CSF, and CISA Cyber Essentials controls remain enforced end-to-end.
- Rotate WebSocket testing credentials on the same cadence as other privileged
  access to maintain OPS CyberSec Core hygiene.
