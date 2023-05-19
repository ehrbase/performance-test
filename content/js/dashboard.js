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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.887747287811104, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.143, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.61, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [0.5, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.946, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.998, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.497, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.032, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 333.6259519251247, 1, 18898, 9.0, 847.0, 1541.9500000000007, 6350.980000000003, 14.878324360763761, 93.72241073321877, 123.11940376523516], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6498.040000000002, 5616, 18898, 6346.0, 6897.0, 7131.2, 16428.60000000008, 0.32082624307336144, 0.18632673341617065, 0.16166634904868601], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.3479999999999963, 1, 7, 2.0, 3.0, 4.0, 6.0, 0.32205081961933596, 0.16533724256062607, 0.11636601880776787], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.677999999999999, 2, 12, 4.0, 5.0, 5.0, 7.0, 0.32204874529808836, 0.1848352227530659, 0.13586431442263103], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 12.666, 8, 331, 11.0, 15.0, 21.0, 36.99000000000001, 0.3201331754009668, 0.16654115612094633, 3.5224028195729424], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 33.624000000000024, 24, 49, 33.0, 40.0, 42.0, 45.0, 0.3219759535478852, 1.3390646612635881, 0.13394702755019444], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.2119999999999993, 1, 12, 2.0, 3.0, 4.0, 6.990000000000009, 0.3219846619386439, 0.20114922664918936, 0.13615171740178986], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 29.883999999999993, 22, 50, 29.5, 36.0, 37.0, 39.99000000000001, 0.32197388019094336, 1.3214480918137497, 0.11696707366311615], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 856.8000000000005, 678, 1116, 861.0, 1010.9000000000001, 1057.0, 1081.99, 0.32183730480567463, 1.3611172209911946, 0.15651853300119725], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 5.854000000000003, 4, 16, 6.0, 8.0, 9.0, 14.990000000000009, 0.32194195386571806, 0.47873460211998775, 0.1644293377654009], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.850000000000002, 2, 16, 4.0, 5.0, 5.0, 9.980000000000018, 0.3202974410156248, 0.3089462748686941, 0.17516266305541978], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 8.172000000000006, 6, 27, 8.0, 10.0, 11.0, 15.990000000000009, 0.3219711848668392, 0.524684117089007, 0.21035031511319863], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 528.0, 528, 528, 528.0, 528.0, 528.0, 528.0, 1.893939393939394, 0.8193507339015151, 2240.132649739583], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.083999999999998, 2, 20, 4.0, 5.0, 6.0, 10.0, 0.3202999032053692, 0.32177315764296427, 0.18798851740862005], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 8.465999999999996, 6, 19, 8.0, 10.0, 11.949999999999989, 15.0, 0.3219697335571667, 0.5058163379597165, 0.19148395286749464], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.834000000000001, 5, 25, 7.0, 8.0, 9.0, 13.0, 0.32196828226057794, 0.4982679263487895, 0.18393695812738095], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1592.4000000000005, 1370, 1969, 1568.5, 1800.0, 1839.6499999999999, 1928.91, 0.32163710714439636, 0.4911593367312149, 0.17715168791937458], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 11.008000000000015, 7, 80, 10.0, 13.0, 18.899999999999977, 38.0, 0.32011882810899406, 0.16653369230658419, 2.5809580516287647], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 11.400000000000004, 8, 25, 11.0, 14.0, 15.0, 20.0, 0.3219753315379989, 0.5828602459231483, 0.2685223956381358], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 8.144000000000016, 5, 22, 8.0, 10.0, 11.949999999999989, 15.990000000000009, 0.32197242885697214, 0.5451238472984581, 0.23078883084083743], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 70.0, 70, 70, 70.0, 70.0, 70.0, 70.0, 14.285714285714285, 6.738281249999999, 1948.3258928571427], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 493.0, 493, 493, 493.0, 493.0, 493.0, 493.0, 2.028397565922921, 0.9409070740365112, 3879.195455121704], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.3960000000000004, 1, 26, 2.0, 3.0, 4.0, 7.0, 0.320330273325009, 0.26924948198590676, 0.13545215659153215], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 562.7699999999994, 426, 742, 549.5, 649.0, 661.0, 696.96, 0.32019672887021783, 0.28195760975543377, 0.1482160639496907], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.2299999999999995, 2, 10, 3.0, 4.0, 5.0, 8.0, 0.3203052380796804, 0.29018591056533233, 0.15639904203109395], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 763.0259999999997, 599, 947, 751.0, 880.0, 900.9, 926.99, 0.320163308900604, 0.3028763661768595, 0.16914877940940115], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 50.0, 50, 50, 50.0, 50.0, 50.0, 50.0, 20.0, 9.47265625, 1316.93359375], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 22.688000000000013, 15, 556, 20.0, 25.0, 39.89999999999998, 62.99000000000001, 0.3200067585427404, 0.16647539096025707, 14.597183292511136], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 29.848000000000003, 20, 298, 28.0, 34.0, 38.0, 88.99000000000001, 0.3202389751328031, 72.4286460278118, 0.09882374623238846], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 539.0, 539, 539, 539.0, 539.0, 539.0, 539.0, 1.8552875695732838, 0.9729388914656771, 0.7609577922077921], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.725999999999999, 1, 16, 3.0, 4.0, 4.0, 6.990000000000009, 0.32198694278549617, 0.34988094834653266, 0.13803932410432893], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.385999999999999, 1, 26, 3.0, 4.0, 5.0, 7.990000000000009, 0.32198528398458076, 0.3303839431010145, 0.11854341021697945], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.826, 1, 11, 2.0, 3.0, 3.0, 6.0, 0.32205185678998033, 0.18263548218409129, 0.12485799525939666], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 91.46199999999995, 66, 119, 89.0, 111.90000000000003, 114.0, 117.0, 0.3220298702026405, 0.29332078148115703, 0.10503708657000188], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 81.18200000000004, 57, 384, 79.0, 91.90000000000003, 100.0, 282.93000000000006, 0.32018688668201856, 0.1665690980511505, 94.67713615082852], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 204.3859999999999, 12, 374, 260.0, 332.0, 337.0, 343.99, 0.3219813444009054, 0.17945114556937572, 0.13489257494920745], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 427.9040000000003, 341, 556, 414.0, 502.90000000000003, 513.0, 532.0, 0.3218625801276893, 0.17309857568566384, 0.1370430516949927], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 7.341999999999999, 4, 280, 6.0, 8.0, 11.0, 31.99000000000001, 0.3199531076725395, 0.1442632317807502, 0.23215347558661803], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 402.25799999999987, 309, 507, 399.5, 463.90000000000003, 474.95, 491.0, 0.32189324732345764, 0.16557069560326015, 0.1295117362277974], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.574, 2, 21, 3.0, 5.0, 5.0, 11.0, 0.3203263741360798, 0.1966722604327097, 0.1601631870680399], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.187999999999998, 3, 40, 4.0, 5.0, 6.0, 8.0, 0.3203187812511011, 0.18759607060947056, 0.15108786264090024], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 673.6840000000002, 533, 859, 679.5, 782.9000000000001, 833.95, 853.0, 0.3201684342098691, 0.2925632866938639, 0.14101168342641696], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 244.41200000000018, 176, 322, 238.0, 288.0, 293.0, 303.0, 0.32025415369637344, 0.28357191767386597, 0.13166699092399728], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.757999999999999, 3, 34, 4.0, 6.0, 6.0, 12.980000000000018, 0.32030318618391423, 0.213549011952754, 0.14982932244345207], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1005.8059999999991, 835, 8783, 948.5, 1111.0, 1143.95, 1176.95, 0.3201243619121156, 0.24062785410876417, 0.17694373910376704], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 134.50600000000006, 118, 169, 135.0, 149.0, 151.0, 156.97000000000003, 0.3219512823319575, 6.224824290057179, 0.16223326336258798], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 183.82599999999996, 161, 254, 180.0, 204.0, 206.0, 221.97000000000003, 0.3219282730930418, 0.623959241103995, 0.23012841396885408], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 7.463999999999999, 5, 20, 7.0, 9.0, 10.0, 14.0, 0.32193760076646905, 0.26274069564115804, 0.1986958629730551], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 7.3540000000000045, 5, 18, 7.0, 9.0, 11.0, 15.0, 0.32193925907611154, 0.26777234994894045, 0.20372718738410187], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.803999999999988, 6, 22, 9.0, 11.0, 12.0, 14.0, 0.3219344914819353, 0.26053743401952595, 0.19649321989864213], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 10.210000000000006, 7, 26, 10.0, 12.0, 13.949999999999989, 17.980000000000018, 0.3219357351885416, 0.2878904024116206, 0.22384594087328288], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 8.354, 5, 39, 8.0, 10.0, 11.0, 17.99000000000001, 0.32193304050303967, 0.24167299566903483, 0.17762907019943108], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1677.5620000000015, 1443, 2065, 1646.5, 1891.6000000000001, 1969.0, 2032.99, 0.32161538402163314, 0.26875927759878093, 0.2047785452950242], "isController": false}]}, function(index, item){
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
