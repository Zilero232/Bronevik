"""Synthesises our original sounds (CC0, Три отметки) and encodes them to the MP3 files the client plays: the
sixth-sense chime from its custom detection-sound slot, the goal and record chimes and the countdown tick through the
same custom-MP3 event (core/client/sound.play_mp3).

Client pipeline (RU 1.45 source): the battle sounds are Wwise banks; a new Wwise event needs a bank built
with the Wwise authoring tool (proprietary, licensed per project) plus a bank loader such as openwg/wot.wwise.
The one Wwise-free path is `SoundGroups.CUSTOM_MP3_EVENTS` ('sixthSense', 'sixthSense_off',
'soundExploring'): with Settings > Sound > detection alert set to the user sound (`bulbVoices` = 'sixthSense'),
the client checks `ResMgr.isFile('audioww/sixthSense.mp3')` and plays that file through `WWISE.WW_prepareMP3`.
So the sixth-sense package ships `res/audioww/sixthSense.mp3` and `sixthSense_off.mp3`.

Deterministic: pure additive synthesis, no samples and no randomness. Needs lameenc (LGPL encoder, host only):

    uv run --with lameenc python tools/assets/sound.py
"""
import array
import math
import os
import sys

MODPACK_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT_DIR = os.path.join(MODPACK_DIR, 'assets', 'otmetki', 'sounds')
RATE = 44100
BITRATE = 128
PEAK = 0.7
# (start s, frequency Hz, length s, gain): a rising fifth for the lamp, the falling reply for "lamp off".
CHIMES = {
    'sixthSense': ((0.0, 659.26, 0.9, 1.0), (0.11, 987.77, 0.8, 0.9), (0.11, 1318.51, 0.5, 0.25)),
    'sixthSense_off': ((0.0, 987.77, 0.5, 0.55), (0.09, 659.26, 0.6, 0.5)),
    # A goal from the site met (session_goals): a rising major arpeggio.
    'otmetki_goal': ((0.0, 523.25, 0.7, 0.8), (0.1, 659.26, 0.7, 0.8), (0.2, 783.99, 0.7, 0.85), (0.3, 1046.5, 0.9, 0.9)),
    # A new personal best on the tank (personal_best): a short fanfare that lands on a held chord.
    'otmetki_record': ((0.0, 392.0, 0.25, 0.7), (0.14, 523.25, 0.25, 0.75), (0.28, 659.26, 1.0, 0.9), (0.28, 783.99, 1.0, 0.8),
                       (0.28, 1046.5, 0.9, 0.35)),
    # A second of the sixth-sense countdown (sixth_sense tick_sound): one short high click.
    'otmetki_tick': ((0.0, 1760.0, 0.12, 1.0),),
}
# Partials of a small bell (ratio, relative gain, decay factor).
PARTIALS = ((1.0, 1.0, 1.0), (2.01, 0.35, 1.6), (3.02, 0.12, 2.4), (4.17, 0.05, 3.2))
ATTACK_S = 0.006
DECAY_PER_S = 6.5


def render(notes):
    length = int(RATE * max(start + duration for start, _, duration, _ in notes)) + int(RATE * 0.05)
    samples = [0.0] * length
    for start, frequency, duration, gain in notes:
        first = int(start * RATE)
        for index in range(int(duration * RATE)):
            t = index / float(RATE)
            envelope = min(1.0, t / ATTACK_S)
            value = 0.0
            for ratio, partial_gain, decay in PARTIALS:
                value += partial_gain * math.exp(-DECAY_PER_S * decay * t) * math.sin(2 * math.pi * frequency * ratio * t)
            samples[first + index] += gain * envelope * value
    top = max(abs(value) for value in samples) or 1.0
    return array.array('h', [int(round(value / top * PEAK * 32767)) for value in samples])


def encode(pcm):
    import lameenc
    encoder = lameenc.Encoder()
    encoder.set_bit_rate(BITRATE)
    encoder.set_in_sample_rate(RATE)
    encoder.set_channels(1)
    encoder.set_quality(2)
    return bytes(encoder.encode(pcm.tobytes()) + encoder.flush())


def main(argv):
    for name, notes in sorted(CHIMES.items()):
        with open(os.path.join(OUT_DIR, name + '.mp3'), 'wb') as handle:
            handle.write(encode(render(notes)))
    return 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
