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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.890427568602425, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.167, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.623, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.95, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.998, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.497, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.116, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 324.66236970857074, 1, 18712, 9.0, 845.0, 1514.0, 6025.970000000005, 15.26679379793403, 96.16948012523902, 126.33402150885351], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6161.222000000003, 5227, 18712, 6013.5, 6440.6, 6584.85, 15871.170000000076, 0.3292365334026925, 0.191211190214761, 0.1659043469099505], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.428, 1, 21, 2.0, 3.0, 4.0, 6.0, 0.3303493973435944, 0.1695976383569346, 0.11936452833704096], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.7060000000000026, 2, 12, 4.0, 5.0, 5.0, 7.0, 0.33034721474352835, 0.18959800935246, 0.13936523121992603], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 12.375999999999992, 8, 377, 11.0, 14.900000000000034, 17.94999999999999, 38.0, 0.3282662160228053, 0.17077216400147327, 3.611890093680613], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 34.321999999999974, 24, 55, 34.0, 41.0, 42.0, 47.0, 0.3302952773720651, 1.3736638678683468, 0.137407996250488], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.229999999999999, 1, 13, 2.0, 3.0, 3.0, 6.0, 0.3303057508213052, 0.2063475506424777, 0.13967030283752457], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 30.35400000000001, 21, 45, 30.0, 36.0, 37.0, 40.0, 0.3302944046146092, 1.3555972629080706, 0.119989764176401], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 862.1199999999995, 674, 1092, 868.5, 1005.8000000000001, 1050.9, 1078.99, 0.33015089876979176, 1.3962771472766842, 0.1605616675657776], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 5.656, 4, 23, 5.0, 7.0, 8.0, 12.980000000000018, 0.33024335632927904, 0.49107896593374656, 0.16866921421895795], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.895999999999998, 2, 16, 4.0, 5.0, 5.0, 10.0, 0.3284937444936236, 0.31685210583378615, 0.1796450165199504], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 7.777999999999994, 5, 20, 8.0, 10.0, 11.0, 13.0, 0.3302937500495441, 0.5382465660597409, 0.21578761599916502], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 479.0, 479, 479, 479.0, 479.0, 479.0, 479.0, 2.08768267223382, 0.9031674060542798, 2469.290269441545], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.060000000000005, 2, 11, 4.0, 5.0, 6.0, 9.0, 0.3284963343094054, 0.33000728912834815, 0.19279911808589129], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 8.110000000000003, 5, 21, 8.0, 10.0, 11.0, 13.990000000000009, 0.3302904772631338, 0.5188882750761484, 0.196432520169188], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.616, 4, 23, 6.0, 8.0, 9.0, 12.990000000000009, 0.33028894998500485, 0.5111447284479854, 0.18869046459104283], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1578.2280000000007, 1336, 2043, 1558.5, 1770.9, 1852.95, 1934.9, 0.3299478484430751, 0.5038503418837118, 0.18172908840028745], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 10.962000000000002, 7, 66, 10.0, 13.0, 17.0, 45.930000000000064, 0.32825824207207105, 0.17076801575606737, 2.646582076706073], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 11.116000000000001, 8, 37, 11.0, 13.0, 15.0, 20.0, 0.3302978956721067, 0.5979262814319735, 0.2754632840859171], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 7.786000000000004, 5, 17, 8.0, 9.0, 10.0, 13.990000000000009, 0.3302959319431838, 0.5592161720402512, 0.23675509184208682], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 60.0, 60, 60, 60.0, 60.0, 60.0, 60.0, 16.666666666666668, 7.861328125, 2273.046875], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 543.0, 543, 543, 543.0, 543.0, 543.0, 543.0, 1.8416206261510129, 0.8542673802946592, 3521.9951369705336], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.301999999999999, 1, 17, 2.0, 3.0, 4.0, 6.0, 0.3285030248558529, 0.27611898293328235, 0.13890801734627373], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 564.3920000000002, 436, 711, 553.0, 654.0, 665.95, 688.95, 0.3283964401825884, 0.28917808015336116, 0.15201163344389348], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.284000000000002, 2, 10, 3.0, 4.0, 5.0, 8.0, 0.3285006507597892, 0.2976106823401992, 0.1604007083788033], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 766.014, 620, 962, 744.5, 896.9000000000001, 910.95, 931.99, 0.32835805212749747, 0.3106286412855743, 0.17347822871189075], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 64.0, 64, 64, 64.0, 64.0, 64.0, 64.0, 15.625, 7.4005126953125, 1028.8543701171875], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 22.480000000000018, 15, 604, 20.0, 24.900000000000034, 32.0, 65.86000000000013, 0.32813049618581114, 0.1707015592022885, 14.967749489100816], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 30.056000000000015, 20, 400, 28.0, 35.0, 40.0, 113.88000000000011, 0.3283863031386506, 74.27133221541058, 0.10133796073419296], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 480.0, 480, 480, 480.0, 480.0, 480.0, 480.0, 2.0833333333333335, 1.092529296875, 0.8544921875], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.7360000000000024, 1, 7, 3.0, 3.0, 4.0, 6.0, 0.3303009504079547, 0.3589152055941751, 0.14160363010653526], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.3960000000000004, 2, 9, 3.0, 4.0, 5.0, 7.0, 0.3302996412285297, 0.33891517190940273, 0.12160445775698799], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.8600000000000008, 1, 10, 2.0, 3.0, 3.0, 5.0, 0.33035048865444283, 0.18734163307277488, 0.12807533593341192], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 93.83800000000006, 66, 121, 94.0, 112.0, 115.0, 118.0, 0.330333028546059, 0.30088371001483855, 0.10774534329529659], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 81.53200000000004, 57, 362, 80.0, 93.90000000000003, 101.94999999999999, 275.95000000000005, 0.3283323932082475, 0.17080659100191944, 97.08570833938012], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 215.66800000000006, 13, 374, 261.5, 335.0, 339.0, 357.9000000000001, 0.33029615013413327, 0.1840852693779797, 0.13837602383549139], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 423.3179999999999, 333, 557, 408.0, 500.90000000000003, 512.95, 531.96, 0.3302538264859606, 0.1776114109219564, 0.1406158870584754], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 7.281999999999999, 4, 268, 6.0, 8.0, 10.949999999999989, 30.0, 0.32807688547426467, 0.14792615116437768, 0.23804797451892448], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 400.7560000000001, 305, 536, 398.5, 466.90000000000003, 476.0, 488.99, 0.3302293971530263, 0.16985852126413134, 0.13286573401078794], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.4899999999999993, 2, 14, 3.0, 4.0, 5.0, 9.990000000000009, 0.3285002191096461, 0.2016907937074469, 0.16425010955482308], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.245999999999999, 2, 47, 4.0, 5.0, 6.0, 9.0, 0.32849072309348915, 0.1923820034632777, 0.15494240161538597], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 674.6640000000001, 539, 878, 679.0, 791.9000000000001, 838.95, 850.99, 0.32834274254185875, 0.30003280041390884, 0.14461189149060383], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 246.80999999999986, 174, 323, 239.0, 292.0, 300.0, 308.99, 0.32842254055854164, 0.2908046892088235, 0.13502528278822853], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.582000000000002, 3, 43, 4.0, 6.0, 7.0, 9.990000000000009, 0.32849784505413643, 0.21901246464541943, 0.15366256619231577], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 985.5000000000002, 816, 8701, 938.5, 1080.8000000000002, 1106.95, 1134.97, 0.3283196730461368, 0.24678802298861519, 0.18147356928136077], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 133.564, 117, 169, 128.0, 151.0, 152.0, 161.97000000000003, 0.33033673866465996, 6.386954385905654, 0.16645874721773882], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 180.2239999999999, 159, 249, 172.0, 203.0, 205.0, 209.99, 0.33030815108030587, 0.640201064971283, 0.23611871737381238], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 6.993999999999996, 5, 15, 7.0, 9.0, 10.0, 13.0, 0.3302398664245788, 0.2695163659860203, 0.20381991755891976], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 6.853999999999996, 5, 18, 7.0, 8.0, 9.0, 13.0, 0.3302413932488092, 0.2746776338319758, 0.20898088166526202], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.416000000000007, 5, 25, 8.0, 10.0, 11.0, 15.0, 0.33023528603659535, 0.26725516005018257, 0.20155962282507042], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 9.753999999999992, 7, 22, 9.0, 12.0, 13.0, 16.99000000000001, 0.33023768527159736, 0.2953144050586469, 0.22961839054040756], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 7.864000000000001, 5, 38, 8.0, 9.0, 11.0, 18.99000000000001, 0.33020475336346566, 0.24788251558401334, 0.1821930523929278], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1614.283999999999, 1419, 2006, 1593.0, 1795.0, 1854.9, 1948.92, 0.3298966895526997, 0.2756795861495514, 0.210051407801133], "isController": false}]}, function(index, item){
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
