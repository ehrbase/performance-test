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

    var data = {"OkPercent": 97.87279302276112, "KoPercent": 2.1272069772388855};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8941714528823654, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.192, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.658, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.998, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.976, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.999, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.593, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.495, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.115, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 321.71078493937625, 1, 25900, 9.0, 808.0, 1508.0, 5961.0, 15.411528124645528, 97.08125476487831, 127.53171041366562], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6177.307999999995, 5198, 25900, 5956.5, 6361.400000000001, 6507.85, 25396.23000000017, 0.3335238866472378, 0.1937578357268119, 0.16806477100583467], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.3379999999999983, 1, 7, 2.0, 3.0, 4.0, 6.0, 0.33470136939718276, 0.17183189150956343, 0.12093701823921643], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.6119999999999988, 2, 13, 3.0, 5.0, 5.0, 7.0, 0.3346993529592108, 0.19209585617935335, 0.1412012895296671], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 13.129999999999995, 8, 353, 11.0, 15.0, 19.0, 49.92000000000007, 0.3318233160298535, 0.1726226549631477, 3.6510286149495697], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 32.435999999999986, 21, 63, 33.0, 40.0, 42.0, 47.99000000000001, 0.33464760603142074, 1.3917647522285859, 0.13921863297791529], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.1919999999999993, 1, 13, 2.0, 3.0, 4.0, 5.990000000000009, 0.33466149324619643, 0.20906865609816827, 0.14151213532773735], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 28.06799999999998, 18, 48, 28.0, 35.900000000000034, 37.0, 41.98000000000002, 0.3346471580759395, 1.3734618727708314, 0.12157103789477487], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 803.9499999999998, 593, 1103, 788.5, 958.0, 1064.95, 1088.97, 0.3345190920081382, 1.4147511493657852, 0.16268604279302032], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 5.601999999999996, 3, 20, 5.0, 8.0, 9.0, 12.990000000000009, 0.33459363602904274, 0.49754792531033565, 0.1708910855890521], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.7440000000000015, 2, 17, 4.0, 5.0, 5.0, 10.970000000000027, 0.3319341203712617, 0.32017055667177624, 0.1815264720780337], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 7.450000000000001, 5, 35, 7.0, 10.0, 11.0, 15.980000000000018, 0.33464312653057404, 0.5453343082742521, 0.21862915200093166], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 466.0, 466, 466, 466.0, 466.0, 466.0, 466.0, 2.1459227467811157, 0.928363063304721, 2538.1760494903433], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.009999999999998, 2, 19, 4.0, 5.0, 6.0, 12.990000000000009, 0.3319374258119853, 0.3334642083076635, 0.19481874307910468], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 7.61, 5, 19, 7.0, 10.0, 11.0, 15.0, 0.3346413347638135, 0.5257234977030218, 0.19902009069449456], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.4319999999999995, 4, 19, 6.0, 8.0, 9.0, 13.0, 0.33463931904914246, 0.5178772219632486, 0.191175782855223], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1562.1019999999996, 1321, 1938, 1537.0, 1749.9, 1823.95, 1877.91, 0.33428180223353726, 0.5104685517291061, 0.18411614888644048], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 11.794, 7, 78, 10.0, 14.0, 17.94999999999999, 58.79000000000019, 0.3318118653268546, 0.17261669802565305, 2.675233164197765], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 10.814000000000004, 7, 27, 10.0, 14.0, 16.0, 21.99000000000001, 0.3346473820535302, 0.6057999986195796, 0.2790906877672996], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 7.558000000000001, 5, 36, 7.0, 10.0, 11.0, 16.99000000000001, 0.3346458142166912, 0.566580854067988, 0.23987307386235482], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 50.0, 50, 50, 50.0, 50.0, 50.0, 50.0, 20.0, 9.43359375, 2727.65625], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 568.0, 568, 568, 568.0, 568.0, 568.0, 568.0, 1.7605633802816902, 0.8166675836267606, 3366.9777453785214], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.4259999999999966, 1, 28, 2.0, 3.0, 4.0, 10.990000000000009, 0.3320072961923411, 0.2790644530329199, 0.14038980395633174], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 552.5119999999993, 434, 696, 534.5, 645.9000000000001, 657.0, 682.99, 0.3318768365234441, 0.2922428342397996, 0.15362267628135987], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.1559999999999997, 2, 15, 3.0, 4.0, 4.949999999999989, 7.0, 0.33198172506999835, 0.30076442008270327, 0.16210045169433512], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 747.772, 600, 935, 727.0, 871.9000000000001, 888.0, 921.9300000000001, 0.3317951311055281, 0.3138801381379259, 0.17529410735165107], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 54.0, 54, 54, 54.0, 54.0, 54.0, 54.0, 18.51851851851852, 8.77097800925926, 1219.3829571759259], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 25.853999999999992, 16, 1578, 22.0, 26.0, 31.899999999999977, 69.94000000000005, 0.331466294186943, 0.17243692341438124, 15.119912696750104], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 32.138000000000005, 21, 277, 29.0, 37.900000000000034, 48.94999999999999, 174.64000000000033, 0.33195241130231573, 75.07788109277904, 0.10243843942532399], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 452.0, 452, 452, 452.0, 452.0, 452.0, 452.0, 2.2123893805309733, 1.1602081028761062, 0.907425331858407], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.742000000000004, 1, 20, 3.0, 4.0, 4.0, 7.990000000000009, 0.33463663146735484, 0.363626490429727, 0.1434623839982117], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.417999999999999, 2, 9, 3.0, 4.0, 5.0, 7.0, 0.3346357356163522, 0.3433643689154857, 0.12320085188219215], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.8179999999999983, 1, 11, 2.0, 3.0, 3.0, 5.0, 0.33470226559963584, 0.18980952407848098, 0.12976249945610882], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 91.10599999999992, 65, 127, 91.0, 110.0, 113.0, 116.99000000000001, 0.3346796379569548, 0.3048428174988588, 0.10916308503674114], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 83.57399999999997, 56, 486, 79.0, 93.90000000000003, 103.94999999999999, 364.4500000000005, 0.33188851201104524, 0.172656571516996, 98.13722905451601], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 211.22799999999995, 12, 385, 267.0, 337.0, 340.0, 347.99, 0.33463192830310157, 0.18650174590025692, 0.14019247777542046], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 420.9200000000005, 330, 560, 412.5, 492.90000000000003, 500.0, 526.0, 0.33457147082302574, 0.17993345185248877, 0.1424542590613664], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 7.186, 4, 243, 6.0, 8.0, 11.0, 33.97000000000003, 0.33141620108214015, 0.14943181074378414, 0.2404709349648732], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 392.1580000000004, 298, 503, 390.0, 457.90000000000003, 469.95, 483.98, 0.33456206828947116, 0.17208709666869856, 0.1346089571633419], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.403999999999999, 2, 22, 3.0, 5.0, 6.0, 14.970000000000027, 0.3320037689067846, 0.20384188432557085, 0.1660018844533923], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.082000000000003, 2, 45, 4.0, 5.0, 5.0, 10.990000000000009, 0.33199451013878034, 0.19443401140168745, 0.1565950667939755], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 606.2, 450, 874, 578.5, 742.7, 825.75, 858.9200000000001, 0.33185326775912766, 0.30324064567860676, 0.1461580310150064], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 245.54799999999992, 174, 359, 238.0, 290.0, 297.0, 308.98, 0.3319636513080364, 0.29394019753663053, 0.1364811496100423], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.4259999999999975, 3, 42, 4.0, 5.0, 6.0, 16.99000000000001, 0.33193896837351894, 0.2213066924787941, 0.15527223227628476], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1027.7540000000015, 811, 13059, 934.0, 1085.8000000000002, 1101.0, 3567.4100000000226, 0.3317418570643765, 0.24936037578224732, 0.18336512802581748], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 132.45999999999995, 114, 182, 129.0, 149.0, 151.0, 158.97000000000003, 0.33464872592537065, 6.470325269986225, 0.1686315845483313], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 178.91200000000006, 155, 229, 177.0, 200.90000000000003, 202.0, 205.0, 0.33462297026071813, 0.648564018853662, 0.23920313889731024], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 6.672000000000002, 4, 15, 7.0, 9.0, 9.949999999999989, 13.0, 0.3345902774757171, 0.27306683670823395, 0.20650493687954416], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 6.5619999999999985, 4, 21, 6.0, 8.0, 10.0, 14.0, 0.33459184479221177, 0.2782961134062253, 0.2117339017825715], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.005999999999997, 5, 23, 8.0, 10.0, 11.0, 15.0, 0.3345866950931523, 0.2707766993072717, 0.20421551214181657], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 9.239999999999991, 6, 32, 9.0, 11.0, 12.0, 18.99000000000001, 0.33458826237608524, 0.29920490013711426, 0.23264340118337176], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 7.667999999999992, 5, 67, 7.0, 9.0, 10.0, 42.80000000000018, 0.3346404388876284, 0.25121235525127816, 0.18464047653467777], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1611.3519999999994, 1398, 2034, 1590.5, 1809.5000000000002, 1895.9, 1959.99, 0.3342397916482835, 0.2793089180774928, 0.2128167423385555], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["No results for path: $['rows'][1]", 500, 100.0, 2.1272069772388855], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 23505, 500, "No results for path: $['rows'][1]", 500, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Query cross patient #1", 500, 500, "No results for path: $['rows'][1]", 500, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
