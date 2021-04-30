# Maps v2

## New stack benchmark

### Load testing

#### Setup

#### Scenario

- We have preloaded our PostGIS DB with a predefined area (specifically `"asia/israel-and-palestine"`)
- We have pregenerated tiles for a specific BBOX (specifically `x/y/z = 4/9/6`) stored in
  - Swift object storage (via tegola)
  - Cassandra (via tilerator)
- We request a random tile included in the BBOX already pregenerated

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

- (sampled) [Cache miss varnish traffic](https://turnilo.wikimedia.org/#webrequest_sampled_128/4/N4IgbglgzgrghgGwgLzgFwgewHYgFwhLYCmAtAMYAWcATmiADTjTxKoY4DKxaG2A5lHyh+NTDAAO3GhGJC8AM0RRiAXyYYAtsWQ5i+EAFE05APQBVACoBhRiAUQEaYjXkBtUGgCeE/QS36TDTECgYA+mEBdgEASnACcvgeIFBotPQEAEwADJkAjKTZAMykRXmWeXl42dnV2QB0NdkAWnbE2AAmBjn5hQAspdkVVTV1jTWtqgC66p4+filoMgJ2waEEMDJhlJipdnDkHLgEELhMYIgwiXhuIJpwElD1AO4QANYQ2h0QcPWYNPwQFMmNhMBklAgVLMQN5fAZUstAUEQgYAB5hcgHSiBEAHI4Gcg4NKnITnS7XW6aaBCYEgUHg5RqWlQCRINDuOZw/yfHHfbTYKBYY4gCJRJiieIwBC0CDeAwABTyABE7FB/hlQGtwpEedF5gY+e1BTg7N9gochQY4FByO1vit1IRPrL8NgpQhpkwVDIKZqQi52raDJRZaT7P97hqYfqCB0QnApfQyQgrgYQI7YQttNbNvpPSAJKcSB0lTyBUL3LTC9hi5x1cHQ+mgA) to `maps.wikimedia.org`
- (sampled) [All varnish traffic](https://turnilo.wikimedia.org/#webrequest_sampled_128/4/N4IgbglgzgrghgGwgLzgFwgewHYgFwhLYCmAtAMYAWcATmiADTjTxKoY4DKxaG2A5lHyh+NTDAAO3GhGJC8AM0RRiAXyYYAtsWQ5i+EAFE05APQBVACoBhRiAUQEaYjXkBtUGgCeE/QS36TDTECgYA+mEBdgEASnACcvgeIFBotPQEAEwADJkAjKTZAMykRXmWeXl42dnV2QB0NdkAWnbE2AAmBjn5hQAspdkVVTV1jTWtqgC66p4+filoMgJ2waEEMDJhlJipdnDkHLgEELhMYIgwiXhuIJpwElD1AO4QANYQ2h0QcPWYNPwQFMmNhMBklAgVNMmFAJEg0O45r4DFEmN9tNgoFhjiAIqiQKJ4jAELQIN4DAAFPIAETsUH+GVAa3CkU+gRA3mRBHR7SxODs32Ch2xBjgUHI7W+K3UhE+ZPw2GJCGhKRcskRIDWLnaEoMlDJQiYCn+90ZHPmBg6ITgxPo50uCxAMs5C20Ys2+hVElOJA61LZmOx7mBIG92F9nAZeoNTqAA===) to `maps.wikimedia.org`

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

- For very high load (saturated CPU) kartotherian backed by swift
  - introduced a lot of latency which led to timeouts from swift
  - in extreme cases because of lack of connection pooling kartotherian was running out of tcp sockets
  - `tilelive-http` even though is a viable backend for HTTP based sources its codebase is pretty old
    - Maybe using a newer node HTTP request mechanism would improve performance
- For very high load (saturated CPU) kartotherian backed by cassandra
  - because of connection pooling introduced a lot of latency but eventually returned tiles without any errors
- When errors are encountered on maps source fetching kartotherian returned no errors instead it returned an empty tile
  - can be very misleading since response has 20x status code
- Roughly 60% of the traffic is a cache miss in the varnish level.