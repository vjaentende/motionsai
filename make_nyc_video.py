#!/usr/bin/env python3
"""Build a fast, vertical New York montage with FFmpeg."""

from __future__ import annotations

import math
import random
import shutil
import struct
import subprocess
import urllib.request
import wave
from dataclasses import dataclass
from pathlib import Path


ROOT = Path(__file__).resolve().parent
SOURCE_DIR = ROOT / "assets" / "source"
BUILD_DIR = ROOT / "build"
OUTPUT_DIR = ROOT / "output"
FONT = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
FPS = 30
WIDTH = 1080
HEIGHT = 1920


SOURCES = {
    "aerial_bridge": (
        "https://upload.wikimedia.org/wikipedia/commons/transcoded/b/b8/"
        "Aerial_view_of_MTA_Subway_Trains_on_Williamsburg_Bridge%2C_The_East_River%2C_"
        "Downtown_Manhattan%2C_Williamsburg_Brooklyn%2C_420_Kent%2C_Brooklyn_Shipyard%2C_"
        "Williamsburg_Bank%2C_New_York_City%2C_USA.webm/"
        "Aerial_view_of_MTA_Subway_Trains_on_Williamsburg_Bridge%2C_The_East_River%2C_"
        "Downtown_Manhattan%2C_Williamsburg_Brooklyn%2C_420_Kent%2C_Brooklyn_Shipyard%2C_"
        "Williamsburg_Bank%2C_New_York_City%2C_USA.webm.1080p.vp9.webm"
    ),
    "aerial_midtown": (
        "https://upload.wikimedia.org/wikipedia/commons/transcoded/4/43/"
        "Aerial_views_of_Hells_Kitchen%2C_West_Midtown_Manhattan%2C_Mercedes_House%2C_"
        "Hudson_Yards%2C_West_Side_Highway%2C_Billionaires_Row%2C_New_York_City%2C_USA.webm/"
        "Aerial_views_of_Hells_Kitchen%2C_West_Midtown_Manhattan%2C_Mercedes_House%2C_"
        "Hudson_Yards%2C_West_Side_Highway%2C_Billionaires_Row%2C_New_York_City%2C_USA.webm."
        "1080p.vp9.webm"
    ),
    "nyc_montage": (
        "https://upload.wikimedia.org/wikipedia/commons/transcoded/3/36/"
        "New_York_City_By_Jennifer_Zumdome.webm/"
        "New_York_City_By_Jennifer_Zumdome.webm.1080p.vp9.webm"
    ),
    "subway": (
        "https://upload.wikimedia.org/wikipedia/commons/transcoded/f/f2/"
        "New_York_City_Subway_-_Train_of_R46_cars.webm/"
        "New_York_City_Subway_-_Train_of_R46_cars.webm.1080p.vp9.webm"
    ),
    "skyline_timelapse": (
        "https://upload.wikimedia.org/wikipedia/commons/transcoded/9/97/"
        "Time-lapse_of_New_York_City_skyline_July_2023.webm/"
        "Time-lapse_of_New_York_City_skyline_July_2023.webm.1080p.vp9.webm"
    ),
}


@dataclass(frozen=True)
class Shot:
    source: str
    seek: float
    duration: float
    speed: float
    label: str = ""
    subtitle: str = ""
    pan: int = 0
    accent: str = "white"


SHOTS = [
    Shot("skyline_timelapse", 375, 1.80, 10.0, "NEW YORK.", "48 HOURS // ZERO SLEEP", 1, "0xF7FF00"),
    Shot("aerial_midtown", 288, 1.55, 2.5, "TOUCHDOWN", "MANHATTAN", -1, "0x00F5FF"),
    Shot("subway", 1.5, 1.35, 1.25, "MOVE.", "UPTOWN → DOWNTOWN", 1, "0xFF315B"),
    Shot("nyc_montage", 28, 1.45, 2.0, "NO SLEEP", "CITY MODE: ON", -1, "0xF7FF00"),
    Shot("aerial_bridge", 38, 1.70, 2.4, "BROOKLYN", "CHASING GOLDEN HOUR", 1, "0x00F5FF"),
    Shot("aerial_midtown", 3, 1.55, 2.2, "BIG CITY", "BIGGER ENERGY", -1, "0xFF315B"),
    Shot("skyline_timelapse", 76, 1.50, 9.0, "AFTER DARK", "THE LIGHTS HIT DIFFERENT", 1, "0xF7FF00"),
    Shot("aerial_bridge", 510, 1.45, 3.0, "KEEP UP", "NEXT STOP: EVERYWHERE", -1, "0x00F5FF"),
    Shot("nyc_montage", 118, 1.55, 2.0, "MAIN CHARACTER", "MOMENT UNLOCKED", 1, "0xFF315B"),
    Shot("aerial_midtown", 334, 1.75, 2.2, "ONE MORE VIEW", "BEFORE WE GO", -1, "0xF7FF00"),
    Shot("skyline_timelapse", 448, 2.20, 7.0, "NYC // 2026", "SAVE THIS FEELING.", 1, "0x00F5FF"),
]


def run(command: list[str]) -> None:
    print("+", " ".join(command))
    subprocess.run(command, check=True)


def ensure_tools() -> None:
    if not shutil.which("ffmpeg") or not shutil.which("ffprobe"):
        raise SystemExit("FFmpeg y ffprobe son obligatorios.")
    if not Path(FONT).exists():
        raise SystemExit(f"No se encontró la fuente esperada: {FONT}")


def download_sources() -> None:
    SOURCE_DIR.mkdir(parents=True, exist_ok=True)
    for name, url in SOURCES.items():
        destination = SOURCE_DIR / f"{name}.webm"
        if destination.exists() and destination.stat().st_size > 100_000:
            continue
        print(f"Descargando {name}…")
        request = urllib.request.Request(url, headers={"User-Agent": "motionsai-video/1.0"})
        with urllib.request.urlopen(request) as response, destination.open("wb") as target:
            shutil.copyfileobj(response, target)


def synthesize_audio(path: Path, duration: float) -> None:
    """Create an original 128 BPM electronic beat without external samples."""
    sample_rate = 48_000
    total = int((duration + 0.2) * sample_rate)
    bpm = 128
    beat = 60 / bpm
    eighth = beat / 2
    rng = random.Random(2026)
    samples = [0.0] * total

    def mix(start: float, length: float, fn, gain: float = 1.0) -> None:
        begin = max(0, int(start * sample_rate))
        end = min(total, begin + int(length * sample_rate))
        for i in range(begin, end):
            t = (i - begin) / sample_rate
            samples[i] += gain * fn(t, length)

    # Kick on every quarter note, with extra double hits near section changes.
    t = 0.0
    beat_index = 0
    while t < duration:
        def kick(x: float, _length: float) -> float:
            freq = 145 * math.exp(-18 * x) + 43
            return math.sin(2 * math.pi * freq * x) * math.exp(-13 * x)

        mix(t, 0.28, kick, 0.85)
        if beat_index % 4 in (1, 3):
            def clap(x: float, _length: float) -> float:
                noise = rng.uniform(-1, 1)
                return noise * math.exp(-22 * x) * (0.55 + 0.45 * math.sin(2 * math.pi * 1800 * x))

            mix(t, 0.18, clap, 0.25)
        beat_index += 1
        t += beat

    # Crisp eighth-note hats.
    t = 0.0
    while t < duration:
        def hat(x: float, _length: float) -> float:
            return rng.uniform(-1, 1) * math.exp(-80 * x)

        mix(t, 0.08, hat, 0.13)
        t += eighth

    # Side-chained synth bass progression.
    bass_notes = [55.0, 65.41, 73.42, 49.0]
    t = 0.0
    index = 0
    while t < duration:
        frequency = bass_notes[(index // 4) % len(bass_notes)]

        def bass(x: float, length: float, f: float = frequency) -> float:
            envelope = min(1.0, x * 20) * math.exp(-1.8 * x / length)
            return (
                math.sin(2 * math.pi * f * x)
                + 0.28 * math.sin(2 * math.pi * f * 2 * x)
            ) * envelope

        mix(t + 0.04, beat * 0.82, bass, 0.20)
        t += beat
        index += 1

    # Short risers before a few visual drops.
    for start in (5.7, 11.3, 16.7):
        def riser(x: float, length: float) -> float:
            phase = 2 * math.pi * (450 * x + 1500 * x * x / (2 * length))
            return math.sin(phase) * (x / length) ** 2

        mix(start, 0.65, riser, 0.12)

    peak = max(max(abs(value) for value in samples), 1.0)
    with wave.open(str(path), "wb") as output:
        output.setnchannels(2)
        output.setsampwidth(2)
        output.setframerate(sample_rate)
        for value in samples:
            value = math.tanh(value * 1.45) / peak
            packed = struct.pack("<h", int(max(-1, min(1, value)) * 32767))
            output.writeframesraw(packed + packed)


def escape_drawtext(text: str) -> str:
    return text.replace("\\", "\\\\").replace(":", "\\:").replace("'", r"\'")


def shot_filter(shot: Shot) -> str:
    source_duration = shot.duration * shot.speed
    pan = (
        f"(iw-ow)/2+{shot.pan}*(iw-ow)*0.34*(2*t/{shot.duration}-1)"
        if shot.pan
        else "(iw-ow)/2"
    )
    filters = [
        f"setpts=PTS/{shot.speed}",
        f"trim=duration={shot.duration}",
        "setpts=PTS-STARTPTS",
        "scale=-2:1920:flags=lanczos",
        f"crop={WIDTH}:{HEIGHT}:x='{pan}':y='(ih-oh)/2'",
        "fps=30",
        "eq=contrast=1.10:saturation=1.22:brightness=0.015:gamma=0.97",
        "colorbalance=bs=.035:rs=.025",
        "unsharp=5:5:0.55:3:3:0.15",
        "vignette=PI/6",
        "fade=t=in:st=0:d=0.075:color=white",
        (
            "drawbox=x=58:y=116:w=12:h=190:"
            f"color={shot.accent}@0.95:t=fill"
        ),
    ]
    if shot.label:
        filters.extend(
            [
                (
                    f"drawtext=fontfile={FONT}:text='{escape_drawtext(shot.label)}':"
                    "fontsize=92:fontcolor=white:borderw=3:bordercolor=black@0.45:"
                    "x=92:y=128:enable='between(t,0.10,1.45)'"
                ),
                (
                    f"drawtext=fontfile={FONT}:text='{escape_drawtext(shot.subtitle)}':"
                    f"fontsize=31:fontcolor={shot.accent}:"
                    "box=1:boxcolor=black@0.70:boxborderw=15:"
                    "x=94:y=252:enable='between(t,0.18,1.55)'"
                ),
            ]
        )
    filters.extend(
        [
            (
                f"drawtext=fontfile={FONT}:text='NYC  /  {SHOTS.index(shot) + 1:02d}':"
                "fontsize=25:fontcolor=white@0.78:x=62:y=h-118"
            ),
            "format=yuv420p",
        ]
    )
    return ",".join(filters), source_duration


def render_shots() -> list[Path]:
    BUILD_DIR.mkdir(parents=True, exist_ok=True)
    rendered: list[Path] = []
    for index, shot in enumerate(SHOTS):
        destination = BUILD_DIR / f"shot_{index:02d}.mp4"
        filters, source_duration = shot_filter(shot)
        run(
            [
                "ffmpeg",
                "-y",
                "-hide_banner",
                "-loglevel",
                "warning",
                "-ss",
                str(shot.seek),
                "-t",
                f"{source_duration + 0.25:.3f}",
                "-i",
                str(SOURCE_DIR / f"{shot.source}.webm"),
                "-an",
                "-vf",
                filters,
                "-c:v",
                "libx264",
                "-preset",
                "veryfast",
                "-crf",
                "19",
                "-g",
                "30",
                "-keyint_min",
                "30",
                "-video_track_timescale",
                "90000",
                "-movflags",
                "+faststart",
                str(destination),
            ]
        )
        rendered.append(destination)
    return rendered


def render_flash(path: Path, color: str) -> None:
    run(
        [
            "ffmpeg",
            "-y",
            "-hide_banner",
            "-loglevel",
            "warning",
            "-f",
            "lavfi",
            "-i",
            f"color=c={color}:s={WIDTH}x{HEIGHT}:r={FPS}:d=0.067",
            "-an",
            "-c:v",
            "libx264",
            "-preset",
            "veryfast",
            "-crf",
            "19",
            "-g",
            "30",
            "-video_track_timescale",
            "90000",
            "-pix_fmt",
            "yuv420p",
            str(path),
        ]
    )


def concatenate(shots: list[Path], destination: Path) -> float:
    flash_white = BUILD_DIR / "flash_white.mp4"
    flash_red = BUILD_DIR / "flash_red.mp4"
    render_flash(flash_white, "white")
    render_flash(flash_red, "0xFF315B")
    sequence: list[Path] = []
    for index, shot in enumerate(shots):
        sequence.append(shot)
        if index < len(shots) - 1:
            sequence.append(flash_red if index in (2, 7) else flash_white)
    concat_file = BUILD_DIR / "concat.txt"
    concat_file.write_text(
        "".join(f"file '{path.resolve()}'\n" for path in sequence),
        encoding="utf-8",
    )
    run(
        [
            "ffmpeg",
            "-y",
            "-hide_banner",
            "-loglevel",
            "warning",
            "-f",
            "concat",
            "-safe",
            "0",
            "-i",
            str(concat_file),
            "-c",
            "copy",
            "-movflags",
            "+faststart",
            str(destination),
        ]
    )
    return sum(shot.duration for shot in SHOTS) + 0.067 * (len(SHOTS) - 1)


def mux_audio(video: Path, audio: Path, destination: Path) -> None:
    credits = (
        "Footage: the Dronalist (CC BY 3.0); Jennifer Zumdome (CC BY-SA 2.0); "
        "GK tramrunner RU (CC BY-SA 4.0); David Schwab (CC BY 3.0). "
        "Sources: Wikimedia Commons. Edit and original audio: motionsai."
    )
    run(
        [
            "ffmpeg",
            "-y",
            "-hide_banner",
            "-loglevel",
            "warning",
            "-i",
            str(video),
            "-i",
            str(audio),
            "-map",
            "0:v:0",
            "-map",
            "1:a:0",
            "-c:v",
            "copy",
            "-c:a",
            "aac",
            "-b:a",
            "192k",
            "-af",
            "loudnorm=I=-12:TP=-1.2:LRA=6,afade=t=out:st=18.7:d=1.2",
            "-shortest",
            "-metadata",
            "title=NYC // 2026",
            "-metadata",
            f"comment={credits}",
            "-movflags",
            "+faststart",
            str(destination),
        ]
    )


def main() -> None:
    ensure_tools()
    download_sources()
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    shots = render_shots()
    silent = OUTPUT_DIR / "nyc_dopamine_silent.mp4"
    duration = concatenate(shots, silent)
    audio = BUILD_DIR / "original_beat.wav"
    synthesize_audio(audio, duration)
    final = OUTPUT_DIR / "nyc_dopamine_2026.mp4"
    mux_audio(silent, audio, final)
    print(f"\nVídeo terminado: {final} ({duration:.2f} s)")


if __name__ == "__main__":
    main()
