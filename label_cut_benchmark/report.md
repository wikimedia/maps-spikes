# Label Cutting Preformance Test
The test is referring to the following [Pull Request](https://github.com/kartotherian/osm-bright.tm2source/pull/76).

## SQL Query comparison
### Status quo
```
EXPLAIN ANALYSE SELECT
   osm_id,
   ST_AsMVTGeom(
    geometry,
   ST_MakeEnvelope(1.5028131254999999e+07,-5.009377085000001e+06,1.7532819797500003e+07,-2.5046885425000004e+06,3857),
       4096,
       2048) AS geom,
    name,
    name_,
    scalerank,
    code
FROM layer_country_label(ST_MakeEnvelope(1.5028131254999999e+07,-5.009377085000001e+06,1.7532819797500003e+07,-2.5046885425000004e+06,3857), 4);

Subquery Scan on layer_country_label  (cost=166.96..851.83 rows=222 width=140) (actual time=0.054..0.085 rows=0 loops=1)
  ->  Result  (cost=166.96..844.06 rows=222 width=144) (actual time=0.045..0.067 rows=0 loops=1)
        ->  Sort  (cost=166.96..167.51 rows=222 width=188) (actual time=0.036..0.049 rows=0 loops=1)
              Sort Key: (to_int((planet_osm_point.population)::text)) DESC NULLS LAST
              Sort Method: quicksort  Memory: 25kB
              ->  Index Scan using planet_osm_point_place on planet_osm_point  (cost=0.43..158.31 rows=222 width=188) (actual time=0.023..0.028 rows=0 loops=1)
                    Index Cond: ((place)::text = 'country'::text)
                    Filter: (way && '0103000020110F00000100000005000000C2F52868F4A96C41D8A37045F81B53C1C2F52868F4A96C41D8A37045F81B43C15D8FC23C79B87041D8A37045F81B43C15D8FC23C79B87041D8A37045F81B53C1C2F52868F4A96C41D8A37045F81B53C1'::geometry)
                    Rows Removed by Filter: 1
Planning Time: 0.417 ms
Execution Time: 0.131 ms
```
### Adding buffer to the layer function WHERE clause
```
Subquery Scan on layer_country_label_v2  (cost=170.27..889.08 rows=233 width=140) (actual time=0.444..0.533 rows=1 loops=1)
  ->  Result  (cost=170.27..880.92 rows=233 width=144) (actual time=0.426..0.497 rows=1 loops=1)
        ->  Sort  (cost=170.27..170.86 rows=233 width=188) (actual time=0.086..0.139 rows=1 loops=1)
              Sort Key: (to_int((planet_osm_point.population)::text)) DESC NULLS LAST
              Sort Method: quicksort  Memory: 25kB
              ->  Index Scan using planet_osm_point_place on planet_osm_point  (cost=0.43..161.11 rows=233 width=188) (actual time=0.062..0.071 rows=1 loops=1)
                    Index Cond: ((place)::text = 'country'::text)
                    Filter: (way && '0103000020110F0000010000000500000084EBD1E334786B4154B81E4E777F55C184EBD1E334786B41C0F52868F4A93CC17C14EEFE58517141C0F52868F4A93CC17C14EEFE5851714154B81E4E777F55C184EBD1E334786B4154B81E4E777F55C1'::geometry)
Planning Time: 0.597 ms
Execution Time: 0.606 ms


Subquery Scan on layer_country_label_v2  (cost=170.27..889.08 rows=233 width=140) (actual time=0.459..0.511 rows=1 loops=1)
  ->  Result  (cost=170.27..880.92 rows=233 width=144) (actual time=0.441..0.476 rows=1 loops=1)
        ->  Sort  (cost=170.27..170.86 rows=233 width=188) (actual time=0.128..0.145 rows=1 loops=1)
              Sort Key: (to_int((planet_osm_point.population)::text)) DESC NULLS LAST
              Sort Method: quicksort  Memory: 25kB
              ->  Index Scan using planet_osm_point_place on planet_osm_point  (cost=0.43..161.11 rows=233 width=188) (actual time=0.060..0.071 rows=1 loops=1)
                    Index Cond: ((place)::text = 'country'::text)
                    Filter: (way && '0103000020110F0000010000000500000084EBD1E334786B4154B81E4E777F55C184EBD1E334786B41C0F52868F4A93CC17C14EEFE58517141C0F52868F4A93CC17C14EEFE5851714154B81E4E777F55C184EBD1E334786B4154B81E4E777F55C1'::geometry)
Planning Time: 0.471 ms
Execution Time: 0.563 ms
```

## Tile Rendering
### Baseline (osm-intl)
The baseline test is with `osm-intl` source (kartotherian + pre-generated) tiles in tilerator. The request cycle with cached data is more important to understand the performance with the mapnik rendering execution.

```
ab -n 100 -c 10 http://localhost:6533/osm-intl/4/14/9@2x.png
This is ApacheBench, Version 2.3 <$Revision: 1879490 $>
Copyright 1996 Adam Twiss, Zeus Technology Ltd, http://www.zeustech.net/
Licensed to The Apache Software Foundation, http://www.apache.org/

Benchmarking localhost (be patient).....done


Server Software:        
Server Hostname:        localhost
Server Port:            6533

Document Path:          /osm-intl/4/14/9@2x.png
Document Length:        22574 bytes

Concurrency Level:      10
Time taken for tests:   5.203 seconds
Complete requests:      100
Failed requests:        0
Total transferred:      2365100 bytes
HTML transferred:       2257400 bytes
Requests per second:    19.22 [#/sec] (mean)
Time per request:       520.272 [ms] (mean)
Time per request:       52.027 [ms] (mean, across all concurrent requests)
Transfer rate:          443.94 [Kbytes/sec] received

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        0    0   0.1      0       1
Processing:   118  497  92.6    495     747
Waiting:      117  497  92.6    495     746
Total:        118  497  92.6    495     747

Percentage of the requests served within a certain time (ms)
  50%    495
  66%    527
  75%    561
  80%    569
  90%    620
  95%    635
  98%    746
  99%    747
 100%    747 (longest request)
 ```

### Kartotherian without cached data (genview)
```
ab -n 100 -c 10 http://localhost:6533/genview/4/14/9@2x.png
This is ApacheBench, Version 2.3 <$Revision: 1879490 $>
Copyright 1996 Adam Twiss, Zeus Technology Ltd, http://www.zeustech.net/
Licensed to The Apache Software Foundation, http://www.apache.org/

Benchmarking localhost (be patient).....done


Server Software:        
Server Hostname:        localhost
Server Port:            6533

Document Path:          /genview/4/14/9@2x.png
Document Length:        22574 bytes

Concurrency Level:      10
Time taken for tests:   11.108 seconds
Complete requests:      100
Failed requests:        0
Total transferred:      2365100 bytes
HTML transferred:       2257400 bytes
Requests per second:    9.00 [#/sec] (mean)
Time per request:       1110.756 [ms] (mean)
Time per request:       111.076 [ms] (mean, across all concurrent requests)
Transfer rate:          207.94 [Kbytes/sec] received

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        0    0   0.1      0       1
Processing:   261 1065 211.2   1065    1813
Waiting:      260 1065 211.1   1065    1812
Total:        261 1065 211.2   1066    1813

Percentage of the requests served within a certain time (ms)
  50%   1066
  66%   1134
  75%   1180
  80%   1205
  90%   1275
  95%   1444
  98%   1606
  99%   1813
 100%   1813 (longest request)
```
### Kartotherian + Tegola with cache (osm-tegola)
```
ab -n 100 -c 10 http://localhost:6533/osm-tegola/4/14/9@2x.png
This is ApacheBench, Version 2.3 <$Revision: 1879490 $>
Copyright 1996 Adam Twiss, Zeus Technology Ltd, http://www.zeustech.net/
Licensed to The Apache Software Foundation, http://www.apache.org/

Benchmarking localhost (be patient).....done


Server Software:        
Server Hostname:        localhost
Server Port:            6533

Document Path:          /osm-tegola/4/14/9@2x.png
Document Length:        22772 bytes

Concurrency Level:      10
Time taken for tests:   5.143 seconds
Complete requests:      100
Failed requests:        0
Total transferred:      2384900 bytes
HTML transferred:       2277200 bytes
Requests per second:    19.44 [#/sec] (mean)
Time per request:       514.335 [ms] (mean)
Time per request:       51.433 [ms] (mean, across all concurrent requests)
Transfer rate:          452.82 [Kbytes/sec] received

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        0    0   0.1      0       1
Processing:   135  486  75.6    495     721
Waiting:      134  485  75.5    493     720
Total:        135  486  75.6    495     722

Percentage of the requests served within a certain time (ms)
  50%    495
  66%    511
  75%    521
  80%    538
  90%    560
  95%    575
  98%    634
  99%    722
 100%    722 (longest request)
```

### Kartotherian + Tegola without cache (osm-tegola)

```
➜  mediawiki git:(master) ab -n 100 -c 10 http://localhost:6533/osm-tegola/4/14/9@2x.png
This is ApacheBench, Version 2.3 <$Revision: 1879490 $>
Copyright 1996 Adam Twiss, Zeus Technology Ltd, http://www.zeustech.net/
Licensed to The Apache Software Foundation, http://www.apache.org/

Benchmarking localhost (be patient).....done


Server Software:        
Server Hostname:        localhost
Server Port:            6533

Document Path:          /osm-tegola/4/14/9@2x.png
Document Length:        22772 bytes

Concurrency Level:      10
Time taken for tests:   7.617 seconds
Complete requests:      100
Failed requests:        0
Total transferred:      2384900 bytes
HTML transferred:       2277200 bytes
Requests per second:    13.13 [#/sec] (mean)
Time per request:       761.713 [ms] (mean)
Time per request:       76.171 [ms] (mean, across all concurrent requests)
Transfer rate:          305.76 [Kbytes/sec] received

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        0    0   0.1      0       1
Processing:   222  724 174.0    691    1448
Waiting:      221  723 174.1    691    1447
Total:        222  724 174.1    691    1448

Percentage of the requests served within a certain time (ms)
  50%    691
  66%    729
  75%    773
  80%    805
  90%    869
  95%   1150
  98%   1408
  99%   1448
 100%   1448 (longest request)
```

## Conclusion
The SQL query change changed the performance slightly, but still keeping an acceptable performance and the MVT resulted from the query didn't affect the image rendering during requests.

Because we use cached data, this change is safe to move forward.