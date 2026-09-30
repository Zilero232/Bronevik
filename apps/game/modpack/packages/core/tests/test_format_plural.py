# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import unittest

import _support  # noqa: F401
from otmetki.core.format import FORMS, count_phrase, counted, plural

RUSSIAN_BATTLES_BY_COUNT = {
    0: u'боёв',
    1: u'бой',
    2: u'боя',
    4: u'боя',
    5: u'боёв',
    11: u'боёв',
    12: u'боёв',
    14: u'боёв',
    21: u'бой',
    22: u'боя',
    25: u'боёв',
    101: u'бой',
    111: u'боёв',
    1002: u'боя',
}


class Lang(object):

    def __init__(self, language):
        self.language = language


class PluralTest(unittest.TestCase):

    def test_russian_forms(self):
        forms = FORMS['battles']['ru']

        for count, word in RUSSIAN_BATTLES_BY_COUNT.items():
            self.assertEqual(plural(count, forms), word, count)

    def test_english_forms(self):
        forms = FORMS['battles']['en']

        words = [plural(count, forms) for count in (0, 1, 2, 21)]

        self.assertEqual(words, [u'battles', u'battle', u'battles', u'battles'])

    def test_phrase_puts_the_count_before_the_matching_form(self):
        phrase = count_phrase(2, FORMS['battles']['ru'])

        self.assertEqual(phrase, u'2 боя')

    def test_phrase_keeps_the_thousands_separator(self):
        phrase = count_phrase(12345, FORMS['hits']['ru'])

        self.assertEqual(phrase, u'12 345 попаданий')

    def test_counted_picks_the_russian_form_for_a_few(self):
        self.assertEqual(counted(2, 'battles', Lang('ru')), u'2 боя')

    def test_counted_picks_the_russian_form_for_many(self):
        self.assertEqual(counted(5, 'battles', Lang('ru')), u'5 боёв')

    def test_counted_follows_the_english_translator(self):
        self.assertEqual(counted(1, 'battles', Lang('en')), u'1 battle')

    def test_counted_falls_back_to_russian_without_a_language(self):
        self.assertEqual(counted(3, 'missions', object()), u'3 задачи')

    def test_a_single_form_is_used_as_is(self):
        self.assertEqual(plural(7, u'шт.'), u'шт.')


if __name__ == '__main__':
    unittest.main()
