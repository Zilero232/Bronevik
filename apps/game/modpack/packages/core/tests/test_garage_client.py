# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import unittest

import _support  # noqa: F401
from otmetki.core.client.garage import run_in_order, run_processor


def adisp_async(func):
    """The client's decorator (client_common/adisp.py, RU 1.45): the call returns a caller that takes the callback."""
    def wrapper(*args, **kwargs):
        def caller(callback):
            kwargs['callback'] = callback
            func(*args, **kwargs)
        return caller
    return wrapper


class Result(object):

    def __init__(self, success):
        self.success = success
        self.userMsg = ''


class Processor(object):
    """Processor.request as the client declares it: @adisp_async over request(self, callback=None)."""

    def __init__(self, success=True):
        self.success = success
        self.sent = 0

    @adisp_async
    def request(self, callback=None):
        self.sent += 1
        callback(Result(self.success))


class RunProcessorTest(unittest.TestCase):

    def test_the_request_goes_out_and_answers_once(self):
        processor = Processor()
        answers = []
        run_processor(lambda: processor, answers.append, 'test')
        assert processor.sent == 1
        assert answers == [True]

    def test_a_refused_request_reports_failure(self):
        answers = []
        run_processor(lambda: Processor(success=False), answers.append, 'test')
        assert answers == [False]

    def test_steps_run_one_after_another(self):
        first, second = Processor(), Processor()
        answers = []
        run_in_order([lambda: first, lambda: None, lambda: second], answers.append, 'test')
        assert (first.sent, second.sent) == (1, 1)
        assert answers == [True]


if __name__ == '__main__':
    unittest.main()
