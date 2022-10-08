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

    var data = {"OkPercent": 97.79621357158051, "KoPercent": 2.2037864284194852};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8985534992554776, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.977, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.493, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.985, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.977, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.695, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.606, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 518, 2.2037864284194852, 190.09138481174358, 1, 3363, 17.0, 567.0, 1234.9500000000007, 2263.0, 25.93775380486599, 172.11031586256965, 214.89738610644577], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 25.305999999999976, 16, 59, 26.0, 30.0, 32.0, 42.950000000000045, 0.5617680864044259, 0.32625888541560166, 0.28417565308348885], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 7.554000000000006, 4, 33, 7.0, 10.0, 13.0, 23.960000000000036, 0.5615283453893469, 5.997379364759828, 0.20399271922347367], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 7.909999999999992, 5, 35, 8.0, 10.0, 12.0, 18.0, 0.561509427181773, 6.029487132379778, 0.23798348769227487], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 22.70400000000001, 13, 261, 20.0, 28.0, 33.0, 51.98000000000002, 0.5584296065975107, 0.30147891181335496, 6.217982787524235], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 43.11400000000003, 27, 102, 44.0, 53.0, 55.0, 60.98000000000002, 0.561314013653402, 2.3345104643666637, 0.2346117166441954], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.7019999999999986, 1, 19, 2.0, 4.0, 5.0, 10.980000000000018, 0.5613461529825444, 0.350809550617144, 0.23846247709707696], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 38.27999999999996, 23, 77, 39.0, 46.0, 49.0, 59.97000000000003, 0.5613070821237166, 2.3036579838775766, 0.2050086413225293], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 757.2260000000007, 573, 1325, 745.5, 905.0, 922.95, 1027.8200000000002, 0.5609896755460113, 2.3724472515432824, 0.2739207400127008], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 11.542, 7, 42, 11.0, 14.0, 16.0, 28.970000000000027, 0.5611836035619446, 0.8345238609656398, 0.28771620299806727], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.6139999999999977, 2, 22, 3.0, 5.0, 6.0, 12.0, 0.5590990007782658, 0.5392848379479501, 0.30684925628650916], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 18.966000000000008, 11, 48, 19.0, 23.0, 25.0, 34.98000000000002, 0.5612925894784582, 0.9145868086699498, 0.3678001245508256], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 643.0, 643, 643, 643.0, 643.0, 643.0, 643.0, 1.5552099533437014, 0.6636979976671851, 1839.4898789852255], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.649999999999996, 2, 25, 4.0, 6.0, 7.949999999999989, 13.980000000000018, 0.559110254305708, 0.5618086164900623, 0.32924168295541206], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 19.74600000000003, 12, 44, 20.0, 25.0, 28.0, 32.0, 0.5612837682347064, 0.8819072545225439, 0.33490662342910704], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 11.197999999999997, 7, 27, 11.0, 14.0, 16.0, 21.99000000000001, 0.5612825080796617, 0.8686866329588456, 0.3217508127370717], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2002.5359999999994, 1559, 2876, 1983.5, 2245.9, 2369.5499999999997, 2617.5600000000004, 0.5602165573123947, 0.8554211403460122, 0.3096509486707182], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 19.618, 12, 165, 17.0, 24.0, 30.0, 50.99000000000001, 0.5583915642669602, 0.3013634909914689, 4.503122595426326], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 23.35600000000001, 15, 57, 24.0, 28.0, 31.0, 40.99000000000001, 0.5613083423891079, 1.0161796866580375, 0.4692186924658949], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 18.633999999999993, 12, 64, 19.0, 23.0, 25.0, 32.99000000000001, 0.5612995206502094, 0.950322843697729, 0.403434030467338], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 83.0, 83, 83, 83.0, 83.0, 83.0, 83.0, 12.048192771084338, 5.6122929216867465, 1643.1899472891566], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 572.0, 572, 572, 572.0, 572.0, 572.0, 572.0, 1.7482517482517483, 0.800712958916084, 3343.435861013986], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.458000000000003, 1, 18, 2.0, 3.0, 5.0, 10.0, 0.55905524136651, 0.46974835036774654, 0.23748928710393732], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 415.74399999999986, 320, 651, 418.5, 483.0, 499.0, 527.97, 0.558844042275434, 0.49200978759455644, 0.25977516027647135], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.1220000000000017, 2, 23, 3.0, 4.0, 5.949999999999989, 11.980000000000018, 0.5590839967796762, 0.5065432046135611, 0.27408219373378656], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1184.8380000000016, 926, 1840, 1175.5, 1354.0, 1389.0, 1572.3700000000006, 0.5585013398447143, 0.5282822722319835, 0.29615842532781234], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 57.0, 57, 57, 57.0, 57.0, 57.0, 57.0, 17.543859649122805, 8.20655153508772, 1155.2391721491229], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 7, 1.4, 45.67199999999993, 12, 709, 44.0, 53.0, 59.94999999999999, 91.0, 0.5579603647275312, 0.2996704860448533, 25.52232762093512], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 45.61200000000001, 9, 184, 46.0, 54.900000000000034, 64.94999999999999, 88.99000000000001, 0.5587622299083072, 123.82378258806092, 0.1735218643660563], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 278.0, 278, 278, 278.0, 278.0, 278.0, 278.0, 3.5971223021582737, 1.8863815197841725, 1.482407823741007], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.3900000000000032, 1, 11, 2.0, 4.0, 5.0, 9.0, 0.5615762772210061, 0.6102261127212751, 0.2418507209516247], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.315999999999996, 2, 14, 3.0, 4.0, 6.0, 9.990000000000009, 0.5615699699335438, 0.5761861445806813, 0.2078466978562628], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.209999999999999, 1, 22, 2.0, 3.0, 4.0, 8.990000000000009, 0.5615434808732674, 0.3183874763028651, 0.2188045399105798], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 124.08800000000006, 88, 292, 123.0, 149.0, 154.95, 187.93000000000006, 0.5614879880874708, 0.5114947206793781, 0.18423824609120137], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 11, 2.2, 174.242, 28, 635, 178.0, 206.90000000000003, 230.0, 346.85000000000014, 0.5585113215829999, 0.29909044860467116, 165.218993685471], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 2.3960000000000017, 1, 16, 2.0, 4.0, 4.0, 8.990000000000009, 0.5615655549166187, 0.3131067979054728, 0.23636206461822526], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 3.379999999999998, 2, 22, 3.0, 5.0, 6.0, 10.0, 0.56160970821006, 0.30200342680203707, 0.24021977753516238], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 11.918000000000001, 7, 340, 10.0, 14.900000000000034, 20.0, 38.930000000000064, 0.5577667910114766, 0.23569459779157817, 0.4057971282261231], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 4.502000000000004, 2, 51, 4.0, 6.0, 6.949999999999989, 9.990000000000009, 0.5615788001756619, 0.2889520356950717, 0.22704455397726955], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.755999999999998, 2, 15, 4.0, 5.0, 6.0, 9.990000000000009, 0.5590483655102937, 0.34333649638239805, 0.28061607409403416], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.058000000000004, 2, 25, 4.0, 5.0, 6.0, 11.990000000000009, 0.5590333642292439, 0.32740029185734365, 0.26477654458123373], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 532.6499999999995, 379, 962, 535.0, 634.0, 648.9, 728.6500000000003, 0.5585793316710013, 0.5103549523783191, 0.24710589574898784], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 16.854000000000003, 6, 119, 15.0, 27.0, 34.94999999999999, 49.99000000000001, 0.5588721512889269, 0.4948900223437086, 0.23086222655782818], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 10.184000000000006, 6, 53, 10.0, 12.900000000000034, 14.0, 21.0, 0.5591171316843851, 0.3726100712930254, 0.26263216830096603], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 550.8260000000004, 407, 3363, 536.0, 618.8000000000001, 639.8499999999999, 671.0, 0.5588952652628708, 0.42004144802218146, 0.3100122174504987], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 174.14400000000012, 144, 354, 179.0, 190.0, 194.95, 212.99, 0.5616456667351875, 10.8593652150794, 0.2841137259461202], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 264.93600000000043, 212, 489, 267.0, 288.0, 293.0, 409.8600000000001, 0.5614810522604103, 1.0883224521814663, 0.4024678636319739], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 18.41799999999996, 12, 39, 19.0, 23.0, 24.0, 30.0, 0.5611653383883107, 0.45782104198863527, 0.3474402583380752], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 17.935999999999993, 11, 34, 19.0, 22.0, 24.0, 29.99000000000001, 0.5611735260777337, 0.46672319905386145, 0.35621366401418647], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 18.144000000000016, 12, 49, 19.0, 22.900000000000034, 24.0, 32.99000000000001, 0.5611439255608914, 0.4541583290031727, 0.34359105598308487], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 20.832000000000008, 14, 44, 22.0, 26.0, 28.0, 33.0, 0.561155261560079, 0.5019391333826776, 0.39127427417372695], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 18.11, 11, 42, 19.0, 22.0, 24.0, 31.960000000000036, 0.5609953403727029, 0.4211672517848067, 0.3106292558509009], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2217.538000000001, 1728, 3120, 2197.5, 2517.7000000000003, 2632.7, 2851.7400000000002, 0.5599242086591159, 0.46783964197606215, 0.3576078442022088], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["No results for path: $['rows'][1]", 500, 96.52509652509653, 2.1272069772388855], "isController": false}, {"data": ["500", 18, 3.474903474903475, 0.07657945118059988], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 23505, 518, "No results for path: $['rows'][1]", 500, "500", 18, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Query cross patient #1", 500, 500, "No results for path: $['rows'][1]", 500, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 7, "500", 7, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 11, "500", 11, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
