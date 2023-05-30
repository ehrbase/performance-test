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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8927674962773878, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.208, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.646, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.989, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.496, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.122, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 323.80999787279404, 1, 22828, 9.0, 833.0, 1499.0, 6028.0, 15.27968552645521, 96.25070686523812, 126.44070166251494], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6216.501999999997, 4934, 22828, 5999.0, 6541.700000000001, 6737.9, 21727.840000000135, 0.32986469609895414, 0.1915760091962979, 0.16622088201861362], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.2660000000000022, 1, 9, 2.0, 3.0, 4.0, 6.0, 0.33093822310001747, 0.1698999348299904, 0.119577287643561], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.5880000000000023, 1, 14, 3.0, 5.0, 5.0, 8.0, 0.33093625174982544, 0.18993607862879874, 0.1396137312069576], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 12.25999999999999, 7, 349, 10.5, 14.0, 17.0, 50.86000000000013, 0.32852568840915375, 0.170907147922305, 3.6147450501034526], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 33.82799999999998, 23, 66, 34.0, 40.0, 42.0, 43.0, 0.33086464195151905, 1.3760317962161657, 0.13764486081186242], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.2579999999999987, 1, 8, 2.0, 3.0, 4.0, 6.0, 0.33087296198799065, 0.20670189698568114, 0.13991014896562495], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 29.934000000000022, 21, 63, 30.0, 35.0, 37.0, 41.99000000000001, 0.3308701156126358, 1.357960101158575, 0.12019890918740285], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 853.9660000000003, 663, 1078, 855.0, 1015.9000000000001, 1057.95, 1075.99, 0.33072260905743395, 1.3986950295616405, 0.16083970635800987], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 5.497999999999998, 3, 18, 5.0, 7.0, 8.0, 11.0, 0.3308092586895322, 0.49192047490150154, 0.16895824442834506], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.8700000000000014, 2, 29, 4.0, 5.0, 5.0, 9.990000000000009, 0.32869133517049876, 0.31704269400513024, 0.17975307392136652], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 7.558000000000002, 5, 23, 7.0, 9.0, 10.0, 14.0, 0.3308801876223016, 0.5392022244992294, 0.2161707475774607], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 454.0, 454, 454, 454.0, 454.0, 454.0, 454.0, 2.2026431718061676, 0.9529012940528634, 2605.2644032213657], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 3.880000000000004, 2, 19, 4.0, 5.0, 6.0, 8.990000000000009, 0.32869652107602093, 0.3302083966758921, 0.1929166105143443], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 7.858000000000006, 5, 17, 8.0, 10.0, 11.0, 14.0, 0.33087974969608697, 0.5198140255210859, 0.1967829761376142], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.5420000000000025, 4, 26, 6.0, 8.0, 8.0, 12.0, 0.3308793117710315, 0.5120583536686244, 0.1890277318223178], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1560.600000000001, 1293, 1926, 1536.0, 1771.9, 1822.9, 1863.98, 0.3305306537433588, 0.5047403208642848, 0.18205008663208433], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 10.39399999999999, 7, 43, 9.0, 13.0, 16.0, 33.98000000000002, 0.3285185652411589, 0.17090344227501736, 2.648680932256844], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 10.883999999999999, 8, 24, 11.0, 13.0, 14.0, 20.0, 0.3308795307334143, 0.5989791942537476, 0.27594835863899986], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 7.639999999999993, 5, 25, 7.0, 10.0, 11.0, 14.0, 0.3308804065858436, 0.5602057321308037, 0.23717404143946214], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 72.0, 72, 72, 72.0, 72.0, 72.0, 72.0, 13.888888888888888, 6.551106770833334, 1894.2057291666667], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 514.0, 514, 514, 514.0, 514.0, 514.0, 514.0, 1.9455252918287937, 0.9024653453307393, 3720.7069248540856], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.1720000000000024, 1, 28, 2.0, 3.0, 3.0, 6.980000000000018, 0.3287064611856837, 0.2762899787179002, 0.13899404071621194], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 553.6700000000004, 437, 696, 544.0, 637.9000000000001, 654.95, 678.97, 0.32858074148844446, 0.28934037149174346, 0.1520969447905495], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.1980000000000004, 1, 12, 3.0, 4.0, 4.0, 7.990000000000009, 0.3286950085033398, 0.2977867640025717, 0.16049560962077142], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 747.9280000000003, 623, 950, 721.0, 870.9000000000001, 886.95, 918.96, 0.3285537523795506, 0.31081377487069767, 0.17358162113021178], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 75.0, 75, 75, 75.0, 75.0, 75.0, 75.0, 13.333333333333334, 6.315104166666667, 877.9557291666667], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 21.722000000000005, 15, 566, 20.0, 24.0, 27.0, 52.99000000000001, 0.32839795000863686, 0.1708406952627939, 14.979949457913506], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 29.75799999999999, 19, 281, 28.0, 34.0, 40.0, 106.98000000000002, 0.3286513659736724, 74.33128163988323, 0.10141975746843797], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 431.0, 431, 431, 431.0, 431.0, 431.0, 431.0, 2.320185614849188, 1.216737964037123, 0.9516386310904873], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.6380000000000003, 1, 17, 2.0, 3.900000000000034, 4.0, 6.0, 0.3308758084123189, 0.3595398640414759, 0.1418500780205156], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.3360000000000007, 2, 8, 3.0, 4.0, 5.0, 7.0, 0.33087449467192803, 0.3395050198210366, 0.12181609813605163], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.7819999999999994, 1, 10, 2.0, 3.0, 3.0, 7.0, 0.3309390992631972, 0.18767543391907346, 0.12830353750731374], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 92.0620000000001, 67, 125, 92.0, 110.0, 113.0, 116.0, 0.3309156634958328, 0.3014144028312482, 0.10793538242930482], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 82.01399999999998, 58, 404, 79.0, 91.0, 100.0, 363.52000000000044, 0.328587867353021, 0.17095810636126396, 97.16125034748167], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 202.01199999999997, 13, 348, 260.0, 333.0, 336.0, 339.99, 0.33087142931825264, 0.18440589201779292, 0.13861703435305703], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 413.73600000000005, 304, 521, 401.5, 483.90000000000003, 494.0, 505.0, 0.3308191081116845, 0.1779154209259627, 0.14085657337567817], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 7.193999999999991, 4, 279, 6.0, 8.0, 10.0, 27.980000000000018, 0.3283408019921093, 0.14804514813259453, 0.2382394686329465], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 390.8280000000003, 294, 490, 391.5, 452.90000000000003, 462.95, 475.97, 0.33081297951341376, 0.17015869574170917, 0.1331005347261001], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.365999999999995, 2, 17, 3.0, 4.0, 5.0, 9.980000000000018, 0.3287043002411375, 0.2018160943404351, 0.16435215012056872], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.042, 2, 25, 4.0, 5.0, 5.0, 9.990000000000009, 0.32869933017650493, 0.1925041750978045, 0.1550407973391132], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 670.0119999999997, 534, 897, 676.0, 796.4000000000002, 832.95, 853.98, 0.3285472756531356, 0.300219698536519, 0.14470197394488685], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 239.056, 172, 310, 233.5, 280.0, 286.0, 296.0, 0.32865374224870153, 0.29100940882257825, 0.13512033738935872], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.421999999999999, 3, 51, 4.0, 5.0, 6.0, 9.0, 0.3286997623500718, 0.21914708472072025, 0.15375701773992617], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 997.7879999999993, 816, 10417, 934.0, 1092.9, 1109.0, 1147.89, 0.32853130081968557, 0.2469470972206252, 0.18159054322650592], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 133.8539999999998, 117, 163, 135.0, 149.0, 151.0, 155.0, 0.33090799831104556, 6.397999507071173, 0.1667466085239253], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 180.47199999999995, 159, 257, 175.0, 201.0, 204.0, 212.99, 0.33088062554967546, 0.6413106311862269, 0.2365279471702758], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 6.789999999999996, 5, 15, 7.0, 8.0, 9.0, 13.0, 0.33080663227600915, 0.2699789166595543, 0.2041697183578494], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 6.747999999999998, 5, 17, 6.0, 9.0, 9.0, 14.0, 0.33080707000870024, 0.27514813437217783, 0.20933884898988062], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.208000000000007, 5, 20, 8.0, 10.0, 11.0, 13.0, 0.3308048813568293, 0.26771612620040824, 0.2019072762187679], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 9.477999999999994, 7, 20, 9.0, 12.0, 13.0, 16.99000000000001, 0.33080597567914466, 0.2958225976456539, 0.23001352996440527], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 7.718, 5, 25, 7.0, 9.0, 11.0, 18.970000000000027, 0.33079393853187034, 0.248324812977377, 0.18251813991260424], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1613.886, 1415, 1973, 1591.0, 1811.8000000000002, 1905.5, 1953.92, 0.3304819351964583, 0.27616864918648565, 0.21042404467586992], "isController": false}]}, function(index, item){
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
