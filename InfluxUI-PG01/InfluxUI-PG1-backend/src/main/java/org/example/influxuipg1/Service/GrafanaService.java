package org.example.influxuipg1.Service;

import org.example.influxuipg1.Model.GrafanaRequest;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * content is from Yufei. I moved content from test here.
 */
@Service
public class GrafanaService {

    public String  createGrafanaDashboard(String key,String username, String query, String graphType) throws IOException, InterruptedException {
        String url = "http://localhost:3000/api/dashboards/db";
        String string = UUID.randomUUID().toString();
        query = query.replaceAll("\"","\\\\\"").replace("\n","");
        
        // Available graph types
        String panelType = getPanelType(graphType);
        
        String dashboardJson = "{\n" +
                "    \"dashboard\": {\n" +
                "        \"title\": \""+username+"\",\n" +
                "        \"panels\": [\n" +
                "            {\n" +
                "                \"type\": \"" + panelType + "\",\n" +
                "                \"title\": \"Test Panel\",\n" +
                "                \"datasource\": \"InfluxDB\",\n" +
                "                \"targets\": [\n" +
                "                    {\n" +
                "                        \"query\": \""+query+"\",\n" +
                "                        \"type\": \"flux\",\n" +
                "                        \"maxDataPoints\": 1000 \n" +
                "                    }\n" +
                "                ],\n" +
                "                \"gridPos\": {\n" +
                "                    \"x\": 0,\n" +
                "                    \"y\": 0,\n" +
                "                    \"w\": 24,\n" +
                "                    \"h\": 8\n" +
                "                }\n" +
                "            }\n" +
                "        ],\n" +
                "        \"schemaVersion\": 30,\n" +
                "        \"version\": 1,\n" +
                "        \"time\": {\n" +
                "            \"from\": \"now-1d\",\n" +
                "            \"to\": \"now\"\n" +
                "        }\n" +
                "    },\n" +
                "    \"folderId\": 0,\n" +
                "    \"overwrite\": true\n" +
                "}\n";

        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .header("Authorization", "Bearer " + key)
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(dashboardJson))
                .build();
        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        String responseBody = response.body();
        return extractUidFromResponse(responseBody);
    }

    // This method returns the panel type based on user's selection
    private String getPanelType(String graphType) {
        switch (graphType.toLowerCase()) {
            case "table":
                return "table";
            case "bar":
                return "barchart";
            case "gauge":
                return "gauge";
            case "heatmap":
                return "heatmap";
            default:
                return "graph"; // Default to line graph
        }
    }

    private String extractUidFromResponse(String responseBody) {
        Pattern pattern = Pattern.compile("\"uid\":\"([^\"]+)\"");
        Matcher matcher = pattern.matcher(responseBody);
        if (matcher.find()) {
            return matcher.group(1);
        }
        return null;
    }

    public int updateGrafanaDashboard(GrafanaRequest grafanaRequest) throws IOException, InterruptedException {
        String uid = grafanaRequest.getUid();
        String key = "glsa_59XrtzqaLhSMrlep4eCcGvPsXCaf9xE6_b83d1d4f";
        String url = "http://localhost:3000/api/dashboards/db";
        String updatedDashboardJson = "{" +
                "  \"dashboard\": {\n" +
                "    \"uid\": \"" + uid + "\",\n" +
                "    \"title\": \"sepTes Updated\",\n" +
                "    \"panels\": [{\n" +
                "      \"type\": \"graph\",\n" +
                "      \"title\": \"Updated Panel\",\n" +
                "      \"datasource\": \"influxdb1\",\n" +
                "      \"targets\": [{\n" +
                "        \"query\": \""+ grafanaRequest.getQuery()+"\",\n" +
                "        \"type\": \"flux\"\n" +
                "      }],\n" +
                "      \"gridPos\": {\"x\": 0, \"y\": 0, \"w\": 24, \"h\": 8}\n" +
                "    }],\n" +
                "    \"schemaVersion\": 30,\n" +
                "    \"version\": 2\n" +
                "  },\n" +
                "  \"folderId\": 0,\n" +
                "  \"overwrite\": true\n" +
                "}\n";

        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .header("Authorization", "Bearer " + key)
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(updatedDashboardJson))
                .build();
        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        System.out.println("Updated Dashboard: " + response.body());
        return 1;
    }

    public int deleteGrafanaDashboard(String uid) throws IOException, InterruptedException {
//        String uid = "your-dashboard-uid";
        String url = "http://localhost:3000/api/dashboards/uid/" + uid;

        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .header("Authorization", "Bearer glsa_59XrtzqaLhSMrlep4eCcGvPsXCaf9xE6_b83d1d4f")
                .DELETE()

                .DELETE()
                .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        System.out.println("Delete response: " + response.body());
        return 1;
    }
}
