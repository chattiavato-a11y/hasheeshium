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
