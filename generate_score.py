"""Generate an original, deterministic ambient score for the launch film."""

import math
import os
import random
import wave
from array import array

RATE = 44_100
DURATION = 37.0
TAU = math.tau
random.seed(56)

CHORDS = (
    (55.00, 82.41, 110.00, 164.81),
    (46.25, 69.30, 92.50, 138.59),
    (61.74, 92.50, 123.47, 185.00),
    (51.91, 77.78, 103.83, 155.56),
    (55.00, 82.41, 110.00, 164.81),
)
TRANSITIONS = (0.0, 4.5, 10.0, 16.5, 22.0, 27.5)
IMPACTS = (0.2, 4.5, 10.0, 16.5, 22.0, 27.5)


def smoothstep(x: float) -> float:
    x = max(0.0, min(1.0, x))
    return x * x * (3.0 - 2.0 * x)


def chord_at(t: float) -> tuple[float, ...]:
    return CHORDS[min(4, max(0, int((t - 4.5) / 6.0)))]


def sample(t: float, channel: int) -> float:
    fade_in = smoothstep(t / 2.2)
    fade_out = smoothstep((DURATION - t) / 2.0)
    envelope = fade_in * fade_out
    chord = chord_at(t)

    # Warm, slowly moving pad with subtle stereo phase.
    pad = 0.0
    for index, frequency in enumerate(chord):
        phase = channel * (0.09 + index * 0.037)
        drift = 1.0 + 0.0017 * math.sin(TAU * (0.031 + index * 0.006) * t)
        pad += math.sin(TAU * frequency * drift * t + phase) / (index + 2)
        pad += 0.22 * math.sin(TAU * frequency * 2.003 * t - phase)
    value = 0.15 * pad * envelope

    # A solar shimmer that grows through each chapter.
    shimmer = (
        math.sin(TAU * (440.0 + channel * 1.7) * t)
        + 0.45 * math.sin(TAU * 659.25 * t + channel)
    )
    shimmer_mod = (0.5 + 0.5 * math.sin(TAU * 0.083 * t)) ** 6
    value += 0.018 * shimmer * shimmer_mod * envelope

    # Soft kinetic pulse.
    beat_phase = (t * 1.78) % 1.0
    pulse = math.exp(-beat_phase * 10.5)
    value += 0.10 * pulse * math.sin(TAU * 55.0 * t) * smoothstep((t - 4.0) / 4.0)

    # Chapter impacts: low bloom plus a brief airy transient.
    for impact in IMPACTS:
        dt = t - impact
        if 0 <= dt < 2.4:
            value += 0.30 * math.exp(-dt * 2.4) * math.sin(
                TAU * (46.0 - 8.0 * min(dt, 1.0)) * dt
            )
            noise_seed = int((t * RATE) + impact * 1000 + channel * 91)
            noise = ((noise_seed * 1103515245 + 12345) % 65536) / 32768 - 1
            value += 0.055 * noise * math.exp(-dt * 15.0)

    # Final rise and restrained resolving tone.
    rise = smoothstep((t - 27.5) / 5.5)
    value += 0.038 * rise * math.sin(TAU * (220.0 + 3.0 * t) * t)
    value += 0.07 * smoothstep((t - 31.5) / 1.8) * math.sin(TAU * 110.0 * t)

    return math.tanh(value * 1.35) * fade_out


def main() -> None:
    os.makedirs('public', exist_ok=True)
    frames = int(RATE * DURATION)
    data = array('h')
    for index in range(frames):
        t = index / RATE
        for channel in (0, 1):
            data.append(int(max(-1.0, min(1.0, sample(t, channel))) * 32767))

    with wave.open('public/score.wav', 'wb') as output:
        output.setnchannels(2)
        output.setsampwidth(2)
        output.setframerate(RATE)
        output.writeframes(data.tobytes())


if __name__ == '__main__':
    main()
