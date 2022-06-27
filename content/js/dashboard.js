/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9202453987730062, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.002, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.997, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.731, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.764, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 22005, 0, 0.0, 181.12719836400808, 1, 3771, 11.0, 577.0, 1253.9500000000007, 2141.980000000003, 27.13644805414218, 181.77235162394777, 239.03565922962946], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query participation #2", 500, 0, 0.0, 7.251999999999999, 4, 28, 7.0, 10.0, 12.0, 20.99000000000001, 0.6287639381245984, 6.727447475418474, 0.22719009483017713], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 7.463999999999997, 4, 32, 7.0, 9.0, 11.0, 16.0, 0.6287433809040575, 6.750911009862469, 0.26525111381889926], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 19.71600000000001, 12, 274, 18.0, 25.0, 30.0, 44.950000000000045, 0.6242407671669332, 0.3364072509310551, 6.949555415725624], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 43.408, 26, 75, 45.0, 54.0, 56.0, 58.99000000000001, 0.6286034693882682, 2.6144747813717135, 0.26150886519472877], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.1580000000000004, 1, 10, 2.0, 3.0, 4.0, 6.0, 0.6286477284442981, 0.3929048302776863, 0.26582467423474715], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 38.92599999999998, 22, 63, 40.0, 47.0, 49.0, 53.99000000000001, 0.6285868738489002, 2.5793178418098277, 0.22835382526542083], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 748.0619999999993, 562, 988, 748.0, 888.9000000000001, 906.0, 927.97, 0.6282054181460904, 2.6569899081940602, 0.30551396312182916], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 8.376000000000001, 5, 28, 8.0, 10.0, 12.0, 21.0, 0.6282851459569222, 0.9344514426683521, 0.32089172981979525], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.170000000000004, 1, 19, 3.0, 4.0, 5.0, 11.990000000000009, 0.6253181305989421, 0.6033342900700732, 0.34197085267129657], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 12.350000000000001, 8, 31, 13.0, 15.0, 16.0, 20.0, 0.6285710693879603, 1.0244971824301814, 0.41065824748100144], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 572.0, 572, 572, 572.0, 572.0, 572.0, 572.0, 1.7482517482517483, 0.7460800917832169, 2067.8147536057695], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.000000000000006, 2, 19, 4.0, 5.0, 6.0, 10.990000000000009, 0.6253298615019423, 0.6276748484825746, 0.3670148894166673], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 13.276000000000003, 9, 32, 14.0, 16.0, 18.0, 22.0, 0.6285686987873652, 0.9869510709553491, 0.37382650152490765], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 7.974, 5, 26, 8.0, 10.0, 11.0, 15.0, 0.6285702791857752, 0.9729334887787634, 0.3590953255114048], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1861.5399999999995, 1467, 2334, 1860.0, 2088.0, 2154.8, 2242.99, 0.6271456219591277, 0.9578669460391364, 0.34542004959467576], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 16.422000000000008, 11, 69, 15.0, 21.0, 24.94999999999999, 42.99000000000001, 0.6241979056911868, 0.33709125180393196, 5.032595614635194], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 16.94800000000002, 11, 37, 17.0, 20.0, 22.0, 31.0, 0.6285955666411875, 1.1381017388210564, 0.5242388807730217], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 12.536000000000001, 8, 26, 13.0, 15.0, 17.0, 22.0, 0.6285876640928098, 1.0644248140009103, 0.45056967328527575], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 75.0, 75, 75, 75.0, 75.0, 75.0, 75.0, 13.333333333333334, 6.2109375, 1818.4375], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 682.0, 682, 682, 682.0, 682.0, 682.0, 682.0, 1.466275659824047, 0.6715657074780058, 2804.169148643695], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.1199999999999997, 1, 20, 2.0, 2.0, 3.9499999999999886, 12.990000000000009, 0.6252931061435048, 0.5257591449116773, 0.26440616695325936], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 400.06799999999976, 300, 571, 409.5, 461.0, 466.95, 485.99, 0.6250507853763119, 0.5498737788070281, 0.28933014869958185], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 2.8579999999999988, 1, 21, 3.0, 4.0, 5.0, 9.990000000000009, 0.6253376823484682, 0.5667122746282993, 0.305340665209213], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1135.554000000001, 919, 1434, 1120.0, 1318.8000000000002, 1353.95, 1390.98, 0.6245986953382452, 0.5910509138503511, 0.32998817790819396], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 50.0, 50, 50, 50.0, 50.0, 50.0, 50.0, 20.0, 9.35546875, 1316.93359375], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 39.63600000000001, 26, 786, 38.5, 46.0, 50.94999999999999, 76.95000000000005, 0.6235961292141068, 0.33676626899941503, 28.523433105596027], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 39.08000000000003, 27, 174, 39.0, 47.0, 53.0, 78.97000000000003, 0.6246447333079311, 141.35454112817084, 0.19276146066924435], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 244.0, 244, 244, 244.0, 244.0, 244.0, 244.0, 4.0983606557377055, 2.1492379610655736, 1.680968237704918], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.006000000000002, 1, 12, 2.0, 3.0, 4.0, 5.0, 0.6288105921886633, 0.6834630752988108, 0.269577978487132], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.1240000000000014, 2, 29, 3.0, 4.0, 6.0, 9.0, 0.6288042658081392, 0.6453840657855023, 0.2315031330172544], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.9340000000000006, 1, 24, 2.0, 3.0, 3.0, 6.990000000000009, 0.6287789615589694, 0.35675837565015744, 0.24377465599503012], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 118.51599999999998, 83, 176, 117.5, 144.0, 149.0, 159.96000000000004, 0.6287014799632838, 0.5728305476618593, 0.20506474053489923], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 155.32599999999996, 104, 619, 156.0, 181.90000000000003, 206.95, 303.0, 0.6243615902739449, 0.33717964787255034, 184.69762129160435], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 2.0800000000000005, 1, 9, 2.0, 3.0, 4.0, 7.0, 0.6287979395549117, 0.3499162283945028, 0.26343194928618857], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 3.0140000000000007, 1, 19, 3.0, 4.0, 5.0, 9.0, 0.6288548804169559, 0.3376655932113858, 0.267754617052532], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 10.524000000000003, 6, 314, 9.0, 13.0, 17.0, 39.92000000000007, 0.623379214043487, 0.2635968746883104, 0.4523151914397566], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 4.122000000000003, 2, 54, 4.0, 5.0, 5.0, 7.0, 0.6288137554266627, 0.3236180167088391, 0.2529992844099463], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.3579999999999974, 2, 25, 3.0, 4.0, 5.0, 13.980000000000018, 0.6252759029921954, 0.3840806083809481, 0.31263795149609763], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 3.7599999999999985, 2, 28, 3.0, 5.0, 6.0, 15.940000000000055, 0.6252555732155519, 0.36636068743098743, 0.2949203533819449], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 513.0340000000007, 367, 911, 519.0, 620.0, 627.0, 644.99, 0.6245464231601798, 0.5701669709248658, 0.2750687859816808], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 15.234000000000007, 6, 119, 14.0, 25.800000000000068, 33.0, 50.0, 0.6247735195991453, 0.5533882639418212, 0.2568648942883205], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 6.6720000000000015, 4, 41, 7.0, 8.0, 9.0, 12.0, 0.6253415928450916, 0.417097956946482, 0.29251818649687394], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 512.5059999999997, 359, 3771, 499.0, 561.9000000000001, 582.95, 661.9000000000001, 0.6250937640646097, 0.470041209306396, 0.3455108109966495], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 12.452, 8, 26, 13.0, 15.0, 16.0, 20.99000000000001, 0.6282646200318405, 0.5129191624478697, 0.38775707017590155], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 12.255999999999998, 8, 25, 13.0, 15.0, 16.0, 21.0, 0.6282725144596919, 0.5220306505887542, 0.39757870055652383], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 12.519999999999996, 8, 34, 13.0, 15.0, 17.0, 24.0, 0.628244095447869, 0.508607768678011, 0.38344976528800595], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 15.115999999999996, 10, 39, 16.0, 18.0, 20.0, 25.99000000000001, 0.628254357572224, 0.5619931557970286, 0.4368331079994371], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 12.007999999999997, 8, 33, 13.0, 14.0, 16.0, 20.0, 0.6280483898723429, 0.4716496209099919, 0.3465306057401111], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2105.706000000001, 1620, 2722, 2087.0, 2445.7000000000003, 2529.8, 2607.95, 0.6267690556595992, 0.5232297456445819, 0.39907560965826044], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 22005, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
