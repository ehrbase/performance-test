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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8931503935332908, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.21, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.662, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [0.5, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.99, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.497, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.122, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 323.0755583918337, 1, 19480, 9.0, 832.0, 1496.0, 6045.0, 15.296868583596526, 96.35892897352512, 126.58289292671951], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6204.9859999999935, 4938, 19480, 6034.5, 6520.5, 6707.3, 16712.250000000084, 0.3299245528532535, 0.1916107722923422, 0.1662510442112098], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.256000000000001, 1, 9, 2.0, 3.0, 4.0, 5.0, 0.33100131870925376, 0.16993232740101738, 0.11960008586174208], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.5980000000000016, 1, 14, 3.0, 5.0, 5.0, 7.0, 0.33099847012507105, 0.18997178796602104, 0.13963997958401436], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 12.044000000000002, 7, 390, 10.0, 13.0, 16.0, 32.99000000000001, 0.3289201026756992, 0.17111233193005054, 3.6190847625459996], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 33.78000000000004, 24, 46, 34.0, 40.0, 41.0, 43.0, 0.3309564044366692, 1.3764134268930541, 0.13768303543947372], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.2939999999999987, 1, 26, 2.0, 3.0, 4.0, 6.0, 0.3309642909387934, 0.20675895171528863, 0.13994876755517338], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 30.102, 21, 59, 30.0, 35.0, 36.94999999999999, 43.99000000000001, 0.3309559663086826, 1.3583124503566049, 0.1202300971355761], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 861.0379999999997, 669, 1098, 860.5, 1006.0, 1055.85, 1072.99, 0.3308007229980602, 1.399025389741142, 0.160877695364291], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 5.654000000000001, 3, 13, 5.0, 8.0, 9.0, 11.0, 0.33089945752342936, 0.4920546025053722, 0.16900431277807965], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.716000000000003, 2, 22, 3.0, 5.0, 5.0, 9.0, 0.3291418219448069, 0.31747721577451676, 0.17999943387606623], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 7.867999999999992, 5, 23, 8.0, 10.0, 11.0, 14.0, 0.3309511469773901, 0.5393178598365631, 0.2162171067655019], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 579.0, 579, 579, 579.0, 579.0, 579.0, 579.0, 1.7271157167530224, 0.7471799438687392, 2042.8152660837652], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 3.7800000000000042, 2, 13, 4.0, 5.0, 6.0, 10.990000000000009, 0.3291452886801669, 0.33065922843571727, 0.193179998532012], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 8.022000000000002, 6, 17, 8.0, 10.0, 11.0, 14.0, 0.3309511469773901, 0.5199261910683566, 0.19682543799729546], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.785999999999996, 4, 26, 7.0, 8.0, 10.0, 13.0, 0.3309515850926168, 0.5121702015743367, 0.18906902078045001], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1554.1379999999992, 1324, 1963, 1539.0, 1753.7, 1819.6, 1884.99, 0.3306093328369785, 0.5048604686040153, 0.1820934216016171], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 10.344000000000014, 7, 66, 9.0, 12.0, 15.0, 33.99000000000001, 0.32890928418814663, 0.17110670388658947, 2.6518311037669324], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 11.157999999999998, 8, 37, 11.0, 14.0, 15.0, 18.0, 0.3309561853725309, 0.599117959362221, 0.2760122874102943], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 7.830000000000008, 5, 24, 8.0, 10.0, 11.0, 14.0, 0.3309539947470982, 0.5603303224931558, 0.2372267892034864], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 76.0, 76, 76, 76.0, 76.0, 76.0, 76.0, 13.157894736842104, 6.206311677631579, 1794.5106907894738], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 579.0, 579, 579, 579.0, 579.0, 579.0, 579.0, 1.7271157167530224, 0.8011523100172712, 3303.0109833765114], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.2159999999999997, 1, 20, 2.0, 3.0, 4.0, 7.0, 0.32913445537463404, 0.2766497237163098, 0.1391750187277505], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 548.2299999999997, 425, 722, 535.0, 637.0, 649.95, 676.98, 0.3290395860945239, 0.2897444191184503, 0.15230933965703544], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.181999999999999, 1, 16, 3.0, 4.0, 5.0, 9.0, 0.3291433386325411, 0.29819293621366666, 0.16071452081667045], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 741.4739999999999, 607, 937, 726.0, 859.9000000000001, 879.0, 912.99, 0.329005593753105, 0.3112412194575882, 0.17382033810588848], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 52.0, 52, 52, 52.0, 52.0, 52.0, 52.0, 19.230769230769234, 9.108323317307693, 1266.2823016826924], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 22.145999999999997, 15, 695, 20.0, 24.900000000000034, 27.0, 64.94000000000005, 0.32876092636938786, 0.17102952449827794, 14.996506709681745], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 29.98600000000001, 20, 268, 28.0, 34.0, 41.94999999999999, 113.99000000000001, 0.3290426175998315, 74.41977126088308, 0.10154049527494802], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 556.0, 556, 556, 556.0, 556.0, 556.0, 556.0, 1.7985611510791368, 0.9431907598920862, 0.7376910971223021], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.6180000000000003, 1, 10, 2.0, 3.0, 4.0, 6.0, 0.3309485183103887, 0.3596188728605006, 0.14188124954908266], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.319999999999999, 2, 16, 3.0, 4.0, 5.0, 6.0, 0.33094786115016295, 0.3395802999893435, 0.12184310903672993], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.76, 1, 9, 2.0, 3.0, 3.0, 6.990000000000009, 0.3310019760817972, 0.1877110913383403, 0.12832791455514989], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 91.636, 64, 119, 92.0, 111.0, 113.0, 116.99000000000001, 0.3309785314085387, 0.30147166604497866, 0.10795588817426946], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 80.81199999999998, 57, 382, 78.0, 90.0, 101.94999999999999, 335.3400000000006, 0.32898979078881224, 0.17114858540147282, 97.28009643842232], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 212.978, 12, 400, 263.0, 334.0, 339.0, 364.96000000000004, 0.33094348014868624, 0.18444604839419604, 0.1386472197107289], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 408.5819999999997, 290, 528, 398.0, 479.0, 491.0, 505.99, 0.33089332594779425, 0.1779553354811619, 0.1408881739387093], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 7.0699999999999985, 4, 275, 6.0, 8.0, 10.0, 32.98000000000002, 0.32870473242777376, 0.14820924024338614, 0.23850353143929282], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 384.46800000000013, 286, 487, 383.0, 449.0, 460.0, 474.0, 0.33088719459939153, 0.1701968694018023, 0.13313039470209895], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.3, 2, 16, 3.0, 4.0, 5.0, 9.990000000000009, 0.32913142217687524, 0.20207833636408518, 0.1645657110884376], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.063999999999999, 2, 45, 4.0, 5.0, 6.0, 9.0, 0.3291221062761611, 0.19275177573718416, 0.15524021223768145], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 676.1580000000001, 524, 893, 676.0, 819.8000000000001, 841.0, 863.0, 0.32897160843430573, 0.3006074450469377, 0.14488886269909362], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 238.84200000000004, 171, 324, 234.0, 280.90000000000003, 286.0, 295.99, 0.32905647662119547, 0.29136601359101966, 0.13528591470461257], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.575999999999995, 3, 52, 4.0, 5.0, 6.0, 10.0, 0.32914658872475444, 0.21944498787917688, 0.15396603124917715], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 973.4220000000004, 808, 8568, 918.5, 1078.9, 1102.0, 1128.97, 0.32897896771663593, 0.24728359496208188, 0.18183798410899993], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 134.05800000000002, 117, 168, 133.0, 150.0, 151.0, 154.98000000000002, 0.33097108239458906, 6.399219217496654, 0.1667783969878984], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 183.05200000000002, 160, 255, 184.0, 204.0, 206.0, 211.99, 0.33094041351666553, 0.6414265118268175, 0.23657068622480384], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 7.272000000000001, 5, 19, 7.0, 9.0, 10.0, 13.0, 0.33089463983772927, 0.27005074165897336, 0.20422403552484852], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 7.154000000000002, 5, 28, 7.0, 9.0, 10.0, 14.990000000000009, 0.33089682967747486, 0.2752227918013692, 0.20939565003027705], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.710000000000004, 6, 18, 9.0, 10.0, 11.949999999999989, 14.0, 0.3308911361544229, 0.2677859310962225, 0.20195992196925228], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 9.802000000000001, 7, 24, 9.5, 12.0, 13.0, 17.99000000000001, 0.3308924500269677, 0.2958999271622994, 0.23007365665937599], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 8.109999999999987, 5, 40, 8.0, 9.0, 11.0, 17.0, 0.33084274911797323, 0.24836145476023166, 0.18254507153481922], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1615.7059999999994, 1416, 1963, 1583.5, 1828.8000000000002, 1894.95, 1947.98, 0.330538956990932, 0.27621629969405315, 0.21046035152156997], "isController": false}]}, function(index, item){
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
