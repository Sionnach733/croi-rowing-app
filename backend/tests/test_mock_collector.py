import pytest


@pytest.fixture
def client(load):
    app = load("mock-collector.py").app
    app.testing = True
    return app.test_client()


def distances(response):
    return {r["rower"]: r["distance"] for r in response.get_json()}


@pytest.mark.parametrize("path", ["/", "/rowers"])
def test_returns_five_rowers(client, path):
    response = client.get(path)
    assert response.status_code == 200
    assert sorted(distances(response)) == [1, 2, 3, 4, 5]


def test_each_rower_advances_between_1_and_1000_metres(client):
    before = distances(client.get("/rowers"))
    after = distances(client.get("/rowers"))
    for rower, metres in after.items():
        assert 1 <= metres - before[rower] <= 1000


def test_first_reading_starts_just_above_61km(client):
    for metres in distances(client.get("/rowers")).values():
        assert 61_001 <= metres <= 62_000


def test_allows_cross_origin_requests_from_the_ui(client):
    response = client.get("/rowers", headers={"Origin": "http://localhost:4200"})
    assert response.headers["Access-Control-Allow-Origin"] in ("*", "http://localhost:4200")
