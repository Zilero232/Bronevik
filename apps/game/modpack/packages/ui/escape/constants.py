from __future__ import absolute_import, division, print_function, unicode_literals

# The page answers an Esc on its next data change, a frame or two; a page that stays silent this long is stuck, and
# the window closes the way it did before the page could step back.
ANSWER_TIMEOUT_S = 0.6
