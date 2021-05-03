import os
import random

from locust import HttpUser, task

with open(os.environ["MW_MAPS_BENCHMARK_TILE_LIST"], "r") as f:
    TILES = f.read().splitlines()

BASE_URL = os.environ["MW_MAPS_BENCHMARK_BASE_URL"]


class MapsUser(HttpUser):
    host = BASE_URL

    @task
    def get_random_tile(self):
        url = f"{self.host}/{random.choice(TILES)}"
        self.client.get(url, name="/[z]/[y]/[x].png")
