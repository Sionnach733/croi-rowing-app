import importlib.util
import sys
from pathlib import Path

import pytest

SERVER_DIR = Path(__file__).resolve().parent.parent / "server"
sys.path.insert(0, str(SERVER_DIR))  # so `from pyrow import pyrow` resolves


def load_server_module(filename):
    """Load a fresh copy of a hyphenated server script (resets its module-level state)."""
    name = filename.replace("-", "_").removesuffix(".py")
    spec = importlib.util.spec_from_file_location(name, SERVER_DIR / filename)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


class FakeErg:
    """Stands in for pyrow.PyErg: reports a fixed serial and a scripted sequence of distances."""

    def __init__(self, serial, distances):
        self.serial = serial
        self.distances = list(distances)
        self.current = 0

    def advance(self):
        self.current = self.distances.pop(0)

    def get_erg(self):
        return {"serial": self.serial}

    def get_monitor(self):
        return {"distance": self.current}


@pytest.fixture
def fake_erg():
    return FakeErg


@pytest.fixture
def load():
    return load_server_module
