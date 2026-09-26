import threading
import time
import unittest

import _support  # noqa: F401
from otmetki.queue_timer import QueueTimer
from otmetki.transport import NETWORK_ERROR, ThreadTransport

try:
    from BaseHTTPServer import BaseHTTPRequestHandler, HTTPServer
except ImportError:
    from http.server import BaseHTTPRequestHandler, HTTPServer


class Handler(BaseHTTPRequestHandler):

    def do_POST(self):
        length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(length)
        status = 200 if self.path == '/ok' else 429
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Retry-After', '7')
        self.end_headers()
        self.wfile.write(b'{"echo":' + str(len(body)).encode('ascii') + b'}')

    def log_message(self, *args):
        pass


def wait_for(transport, results, count, timeout=5.0):
    deadline = time.time() + timeout
    while len(results) < count and time.time() < deadline:
        transport.poll()
        time.sleep(0.01)


class ThreadTransportTest(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.server = HTTPServer(('127.0.0.1', 0), Handler)
        cls.thread = threading.Thread(target=cls.server.serve_forever)
        cls.thread.daemon = True
        cls.thread.start()
        cls.base = 'http://127.0.0.1:%d' % cls.server.server_address[1]

    @classmethod
    def tearDownClass(cls):
        cls.server.shutdown()
        cls.server.server_close()

    def test_callbacks_run_on_poll_thread(self):
        transport = ThreadTransport(timeout=5)
        results = []
        main = threading.current_thread()

        def done(status, body, headers):
            results.append((status, body, threading.current_thread() is main, headers))

        transport.request('POST', self.base + '/ok', {'Content-Type': 'application/json'}, b'{"a":1}', done)
        transport.request('POST', self.base + '/busy', {}, b'', done)
        wait_for(transport, results, 2)
        transport.stop()
        self.assertEqual(len(results), 2)
        self.assertEqual(results[0][:3], (200, b'{"echo":7}', True))
        self.assertEqual(results[1][0], 429)
        retry = [v for k, v in results[1][3].items() if k.lower() == 'retry-after']
        self.assertEqual(retry, ['7'])

    def test_network_error(self):
        transport = ThreadTransport(timeout=2)
        results = []
        transport.request('POST', 'http://127.0.0.1:1/nothing', {}, b'', lambda s, b, h: results.append(s))
        wait_for(transport, results, 1)
        transport.stop()
        self.assertEqual(results, [NETWORK_ERROR])


class QueueTimerTest(unittest.TestCase):

    def test_arena(self):
        timer = QueueTimer()
        timer.enqueued(1, 100.0)
        queue_type, wait = timer.arena_created(142.34)
        self.assertEqual(queue_type, 1)
        self.assertAlmostEqual(wait, 42.34)
        self.assertEqual(timer.take_last_wait(), 42.3)
        self.assertIsNone(timer.take_last_wait())

    def test_dequeued_and_unknown(self):
        timer = QueueTimer()
        self.assertIsNone(timer.dequeued(5))
        timer.enqueued(7, 10)
        self.assertEqual(timer.dequeued(15), (7, 5))
        self.assertIsNone(timer.arena_created(20))
        timer.enqueued(1, 0)
        self.assertIsNone(timer.arena_created(99999))


if __name__ == '__main__':
    unittest.main()
