# Maps v2

## New stack benchmark

### Load testing

#### Setup

#### Scenario

- We have preloaded our PostGIS DB with a predefined area (specifically `"asia/israel-and-palestine"`)
- We have pregenerated vector tiles for a specific BBOX (specifically `x/y/z = 4/9/6`) stored in
  - Swift object storage (via tegola)
  - Cassandra (via tilerator)
- We request a random tile included in the BBOX already pregenerated
- For consistency between stacks we use openmaptiles data schema and osm-bright style

##### System

- 6 cores/12 threads cpu
- 32G ram

##### Services

- Kartotherian x 6-12 workers (depending on test)
- Tegola x 3 workers
- Cassandra x 1 node
- Swift x (max of 3-12 workers for different components of swift)
- PostgreSQL/PostGIS x 1 node
- Grafana/Prometheus x 1 node

#### Current production information

- ~80 req/s per DC traffic reaching the service level
- 9 nodes per DC

  - 12 cores/24 threads
  - 124 GB memory

- Cache ratio
  - For a timewindow of 1 month (webrequest dataset sampled 1/128)
    - all traffic: ~13 m requests
    - cache hit traffic: ~9 m requests
    - cache miss traffic: ~4 m requests

#### Results

##### Baseline metrics

- Vector tiles access - swift
  - [System metrics](https://snapshot.raintank.io/dashboard/snapshot/hRqbnAbHtdZ4Uya5eYhm7ad9Ypqjcs55)
  - [Load test report](./report-1000users-swift.html)
- Average tile pregeneration (asMVT)
  - ~200 ms

##### Medium load kartotherian

- 100 users total - 10 users spawn/rate
  - raster - kartotherian - swift
    - [System metrics](https://snapshot.raintank.io/dashboard/snapshot/04NgUhXhli3M3bLRKpD1OvEiqLR3bnAJ)
    - [Load test report](./report-100users-kartotherian-swift.html)
  - raster - kartotherian - cassandra
    - [System metrics](https://snapshot.raintank.io/dashboard/snapshot/kDMeflXnQNrsparxALOA54JOWnhe19dU)
    - [Load test report](./report-100users-karthotherian-cassandra.html)
  - raster - kartotherian - tegola - swift
    - [System metrics](https://snapshot.raintank.io/dashboard/snapshot/RyOJwvaj5tO7ZnMUGBds0Va8uxwXwJGw)
    - [Load test report](./report_100users-kartotherian-tegola-swift.html)

##### High load (peak) kartotherian

- 1000 users total - 100 users spawn/rate
  - raster - kartotherian - swift
    - [System metrics](https://snapshot.raintank.io/dashboard/snapshot/GAJYjmu5HQ8U7uzJh8gMRdSgvs6cuF4f)
    - [Load test report](./report-1000users-kartotherian-swift.html)
  - raster - kartotherian - cassandra
    - [System metrics](https://snapshot.raintank.io/dashboard/snapshot/oAMljgxThgtS94zzjISqApuASs5Z6nU1)
    - [Load test report](./report-1000users-karthotherian-cassandra.html)
  - raster - kartotherian - tegola - swift
    - [System metrics](https://snapshot.raintank.io/dashboard/snapshot/15Rf1HhYml7mqYpUXeiuTy2mlUdHCSgB)
    - [Load test report](./report_1000users-kartotherian-tegola-swift.html)

##### Experimental

- On the fly tile generation - kartotherian - tegola - PostgreSQL
  - [Load test report](./report-100users-**kart1otherian**-tegola-postgres-onthefly.html)
- On the fly tile generation - kartotherian - 6x tegola workers - 6x PostgreSQL workers
  - [Load test report](./report-100users-kartotherian-6-tegola-6-postgres-onthefly.html)
  - [System metrics](https://snapshot.raintank.io/dashboard/snapshot/V2XCUoAfzceJOAzgaPZnbXN63kYtiX7U)

##### Pregeneration

Reference tile is `(z/x/y: 4/9/6)` for zoom level 0-12 and both processes are running with the same concurrency (ncpu)

- Tegola

  - [System metrics](https://snapshot.raintank.io/dashboard/snapshot/FBYiH9WrzO9Y2Fqipho9GMFwkrvaDhYM)
  - Total time ellapsed ~30m

- Tilerator
  - [System metrics](https://snapshot.raintank.io/dashboard/snapshot/uUxmmQgKJsSoC2VzezIXAS05XAbyjam7)
  - Total time ellapsed ~40m

#### Findings

- For reqular load (around twice the requests in current production)
  - Tegola (backed by swift) and cassandra backends performed equally well
- For very high load (saturated CPU) kartotherian backed by swift
  - introduced a lot of latency which led to timeouts from swift
  - in extreme cases because of lack of connection pooling kartotherian was running out of tcp sockets
  - `tilelive-http` even though is a viable backend for HTTP based sources its codebase is pretty old
    - Maybe using a newer node HTTP request mechanism would improve performance
- For very high load (saturated CPU) kartotherian backed by cassandra
  - because of connection pooling introduced a lot of latency but eventually returned tiles without any errors
- When errors are encountered on maps source fetching kartotherian returned no errors instead it returned an empty tile
  - can be very misleading since response has 20x status code
- For tile pregeneration
  - Tegola backed pregeneration was faster than tilerator/cassandra
- Given our current traffic it might be interesting to see how the system behaves by introducing more on-the-fly tile generation
  - Currently tile pregeneration is a process that takes so long that it doesn't manage to finish between 2 OSM syncs
  - We pregenerate tiles that we eventually might never use
- Given our traffic we can find interesting tile pregeneration caching strategies that are more efficient instead of full planet pregeneration.
  - Focus on some specific zoom levels
  - Analyze where most of the traffic lands and optimize for that
  - Let tiles get cached organically with time
