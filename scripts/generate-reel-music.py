#!/usr/bin/env python3
"""Generate the original 30-second instrumental beds bundled with Reel Studio."""

from __future__ import annotations

import math
import random
import shutil
import struct
import subprocess
import tempfile
import wave
from pathlib import Path


SAMPLE_RATE = 22_050
DURATION = 30
ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "public" / "music"

TRACKS = (
    ("eazydatafix-coastal-pulse.mp3", 104, 146.83, (0, 2, 4, 7, 9, 7, 4, 2), 11),
    ("eazydatafix-deccan-drive.mp3", 116, 164.81, (0, 4, 7, 9, 12, 9, 7, 4), 23),
    ("eazydatafix-monsoon-code.mp3", 96, 130.81, (0, 2, 5, 7, 9, 7, 5, 2), 37),
)


def envelope(age: float, decay: float) -> float:
    return math.exp(-age / decay) if age >= 0 else 0.0


def render_track(bpm: int, root_hz: float, melody: tuple[int, ...], seed: int) -> list[int]:
    rng = random.Random(seed)
    beat = 60.0 / bpm
    total = SAMPLE_RATE * DURATION
    samples: list[int] = []
    note_length = beat * 2

    for index in range(total):
        time = index / SAMPLE_RATE
        beat_phase = time % beat
        half_phase = time % (beat / 2)
        quarter_phase = time % (beat / 4)

        # Warm tonic/fifth drone.
        drone = 0.10 * math.sin(2 * math.pi * root_hz * time)
        drone += 0.05 * math.sin(2 * math.pi * root_hz * 1.5 * time)

        # Alternating low and high hand-drum inspired pulses.
        beat_number = int(time / beat)
        low = 0.42 * envelope(beat_phase, 0.09) * math.sin(
            2 * math.pi * (72 - 28 * min(beat_phase / 0.11, 1)) * time
        )
        high_noise = (rng.random() * 2 - 1) * envelope(half_phase, 0.025)
        high = (0.13 if beat_number % 2 else 0.07) * high_noise
        tick = 0.035 * envelope(quarter_phase, 0.012) * (rng.random() * 2 - 1)

        # Original pentatonic melody with a soft reed/flute-like harmonic.
        note_index = int(time / note_length) % len(melody)
        semitones = melody[note_index]
        frequency = root_hz * (2 ** (semitones / 12)) * 2
        note_age = time % note_length
        note_env = min(note_age / 0.08, 1.0) * envelope(note_age, note_length * 1.4)
        vibrato = 1 + 0.004 * math.sin(2 * math.pi * 5.2 * time)
        melodic = 0.16 * note_env * math.sin(2 * math.pi * frequency * vibrato * time)
        melodic += 0.045 * note_env * math.sin(2 * math.pi * frequency * 2 * time)

        # Fade the complete bed in and out.
        master = min(1.0, time / 1.2, (DURATION - time) / 1.5)
        value = max(-1.0, min(1.0, master * (drone + low + high + tick + melodic)))
        samples.append(int(value * 28_000))
    return samples


def write_mp3(filename: str, samples: list[int]) -> None:
    OUTPUT.mkdir(parents=True, exist_ok=True)
    ffmpeg = shutil.which("ffmpeg")
    if not ffmpeg:
        raise RuntimeError("ffmpeg is required to encode the bundled MP3 files")
    with tempfile.TemporaryDirectory() as temp_dir:
        wav_path = Path(temp_dir) / "track.wav"
        with wave.open(str(wav_path), "wb") as wav_file:
            wav_file.setnchannels(1)
            wav_file.setsampwidth(2)
            wav_file.setframerate(SAMPLE_RATE)
            wav_file.writeframes(b"".join(struct.pack("<h", sample) for sample in samples))
        subprocess.run(
            [
                ffmpeg,
                "-hide_banner",
                "-loglevel",
                "error",
                "-y",
                "-i",
                str(wav_path),
                "-codec:a",
                "libmp3lame",
                "-b:a",
                "128k",
                str(OUTPUT / filename),
            ],
            check=True,
        )


def main() -> None:
    for filename, bpm, root_hz, melody, seed in TRACKS:
        write_mp3(filename, render_track(bpm, root_hz, melody, seed))
        print(OUTPUT / filename)


if __name__ == "__main__":
    main()
