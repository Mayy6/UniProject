//package org.example.influxuipg1.Controller;
//
//import com.influxdb.client.BucketsApi;
//import com.influxdb.client.InfluxDBClient;
//import com.influxdb.client.QueryApi;
//import com.influxdb.client.domain.Bucket;
//import com.influxdb.exceptions.UnauthorizedException;
//import com.influxdb.query.FluxRecord;
//import com.influxdb.query.FluxTable;
//import jakarta.validation.constraints.NotNull;
//import org.example.influxuipg1.InfluxdbRepository.InfluxdbRepository;
//import org.example.influxuipg1.Model.AuthRequest;
//import org.example.influxuipg1.Model.AuthResponse;
//import org.example.influxuipg1.Model.GrafanaRequest;
//import org.example.influxuipg1.Model.User;
//import org.example.influxuipg1.Service.ApiService;
//import org.example.influxuipg1.Service.GrafanaService;
//import org.example.influxuipg1.Util.JwtTokenUtil;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import java.io.IOException;
//import java.util.*;
//
//@RestController
//@RequestMapping("/grafana")
//public class GrafanaController {
//
//    @Autowired
//    GrafanaService grafanaService;
//
//    @PostMapping("/create")
//    public ResponseEntity<?> createDashboard(@RequestBody GrafanaRequest grafanaRequest) throws IOException, InterruptedException {
//        String testQ = "from(bucket: \"sepBucket\")\n" +
//                "  |> range(start: -40d, stop: -10m)\n" +
//                "  |> filter(fn: (r) => r[\"_measurement\"] == \"testMeasurement4\")\n" +
//                "  |> filter(fn: (r) => r[\"_field\"] == \"ants\" or r[\"_field\"] == \"bees\")\n" +
//                "  |> filter(fn: (r) => r[\"location\"] == \"Portland\" or r[\"location\"] == \"Queensland\")\n" +
//                "  |> yield(name: \"mean\")";
//        String grafanaDashboard = grafanaService.createGrafanaDashboard(testQ);
//        return new ResponseEntity<>(grafanaDashboard, HttpStatus.OK);
//    }
//
//    @PutMapping("/update")
//    public ResponseEntity<?> updateDashboard(@RequestBody GrafanaRequest grafanaRequest) throws IOException, InterruptedException {
//        return new ResponseEntity<>(grafanaService.updateGrafanaDashboard(grafanaRequest), HttpStatus.OK);
//    }
//
//    @DeleteMapping("/delete")
//    public ResponseEntity<?> deleteDashboard(@RequestBody GrafanaRequest grafanaRequest) throws IOException, InterruptedException {
//        return new ResponseEntity<>(grafanaService.deleteGrafanaDashboard(grafanaRequest.getUid()), HttpStatus.OK);
//    }
//}
//
