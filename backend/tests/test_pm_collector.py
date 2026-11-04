import json

import pytest

ROWER_1 = "430391865"
ROWER_2 = "430331314"


@pytest.fixture
def collector(load, tmp_path, monkeypatch):
    monkeypatch.chdir(tmp_path)  # the endpoint writes workout.json to the cwd
    module = load("pm-collector.py")
    module.app.testing = True
    return module


def poll(collector, ergs):
    """Advance every erg to its next scripted reading, then hit the endpoint."""
    for erg in ergs:
        erg.advance()
    collector.rowers_list = ergs
    response = collector.app.test_client().get("/rowers")
    assert response.status_code == 200
    return {r["rower"]: r["distance"] for r in response.get_json()}


def totals_for(collector, readings, serial=ROWER_1, fake_erg=None):
    erg = fake_erg(serial, readings)
    return [poll(collector, [erg])[serial] for _ in readings]


def test_reports_all_five_rowers_even_with_no_ergs(collector):
    totals = poll(collector, [])
    assert list(totals.values()) == [0, 0, 0, 0, 0]


def test_tracks_distance_during_normal_rowing(collector, fake_erg):
    assert totals_for(collector, [0, 150, 400], fake_erg=fake_erg) == [0, 150, 400]


def test_keeps_rowers_separate(collector, fake_erg):
    a = fake_erg(ROWER_1, [100, 300])
    b = fake_erg(ROWER_2, [50, 60])
    poll(collector, [a, b])
    totals = poll(collector, [a, b])
    assert totals[ROWER_1] == 300
    assert totals[ROWER_2] == 60


def test_ignores_unknown_serials(collector, fake_erg):
    totals = poll(collector, [fake_erg("999", [5000])])
    assert list(totals.values()) == [0, 0, 0, 0, 0]


def test_holds_total_when_monitor_resets(collector, fake_erg):
    # monitor reset to 0 after 500 m: total should not drop
    assert totals_for(collector, [500, 0], fake_erg=fake_erg) == [500, 500]


def test_holds_total_while_idle_after_reset(collector, fake_erg):
    assert totals_for(collector, [500, 0, 0], fake_erg=fake_erg) == [500, 500, 500]


def test_adds_new_distance_after_reset(collector, fake_erg):
    assert totals_for(collector, [500, 0, 100], fake_erg=fake_erg) == [500, 500, 600]


def test_survives_two_resets(collector, fake_erg):
    readings = [500, 0, 0, 200, 0, 0, 100]
    assert totals_for(collector, readings, fake_erg=fake_erg)[-1] == 800


def test_each_rower_handles_its_own_reset(collector, fake_erg):
    # rower 3 used to compare against rower 1's previous reading
    one = fake_erg(ROWER_1, [0, 0, 0])
    three = fake_erg(3, [300, 0, 50])
    for _ in range(3):
        totals = poll(collector, [one, three])
    assert totals[3] == 350
    assert totals[ROWER_1] == 0


def test_writes_workout_json(collector, fake_erg, tmp_path):
    poll(collector, [fake_erg(ROWER_1, [1234])])
    written = json.loads((tmp_path / "workout.json").read_text())
    assert {"rower": int(ROWER_1), "distance": 1234} in written
