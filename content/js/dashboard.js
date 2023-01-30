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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8657732397362263, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.438, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [0.5, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [0.991, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.724, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.726, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.499, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [0.843, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.473, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 507.54141671984956, 1, 23726, 13.0, 1065.0, 1901.9500000000007, 10713.0, 9.756306110174659, 61.54362613099787, 80.83216059894713], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 11351.74999999999, 9177, 23726, 10776.0, 13261.5, 13830.9, 22309.44000000007, 0.210005237530624, 0.122000738010906, 0.10623311820396801], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 3.2500000000000004, 2, 11, 3.0, 4.0, 5.0, 8.0, 0.21072452993679106, 0.10819552212481129, 0.07655227064109987], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 4.708000000000004, 3, 16, 5.0, 6.0, 6.0, 11.0, 0.21072328660895656, 0.12088190724593093, 0.08931045545731167], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 16.43399999999998, 10, 440, 14.0, 19.0, 22.0, 44.0, 0.2095445883643243, 0.12312995533661872, 2.333229879423853], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 44.564000000000014, 26, 70, 46.0, 55.0, 56.0, 58.99000000000001, 0.21066752956086776, 0.8761444480626593, 0.08805244399614394], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.676, 1, 13, 2.0, 4.0, 4.0, 7.990000000000009, 0.21067108008534707, 0.1316216948867601, 0.08949406234094334], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 39.50799999999995, 24, 54, 41.0, 49.0, 50.0, 53.0, 0.21066593186389632, 0.8646170102575349, 0.07694243995810277], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1179.1000000000001, 787, 1763, 1167.5, 1576.9, 1634.95, 1708.96, 0.21059672159871554, 0.8907052603849455, 0.1028304304681228], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 6.920000000000001, 4, 16, 7.0, 8.900000000000034, 9.0, 14.980000000000018, 0.21052622714685174, 0.31306894712886435, 0.10793580981650112], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 4.532000000000009, 3, 18, 4.0, 6.0, 6.0, 11.960000000000036, 0.20971254282330126, 0.2022804449921903, 0.11509614166669463], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 10.46600000000001, 7, 19, 10.0, 13.0, 14.0, 18.0, 0.21066486674604518, 0.3433471133172638, 0.13804309139316046], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 526.0, 526, 526, 526.0, 526.0, 526.0, 526.0, 1.9011406844106464, 0.9022991920152091, 2248.6539775427755], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 5.102, 3, 15, 5.0, 6.0, 7.0, 12.990000000000009, 0.20971368629265208, 0.2106782873301896, 0.12349350862741135], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 16.327999999999985, 8, 30, 17.0, 20.0, 21.0, 23.0, 0.21066380163896437, 0.3309540667330258, 0.12569881132949925], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 8.001999999999985, 6, 20, 8.0, 10.0, 11.0, 14.990000000000009, 0.2106638903974764, 0.32601677124197737, 0.12076142935870962], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2385.172, 1728, 3743, 2317.5, 3068.0000000000005, 3371.5499999999997, 3643.87, 0.2103746688702712, 0.32126677264641235, 0.11628131111384131], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 13.72, 9, 62, 13.0, 17.0, 20.0, 34.0, 0.20954046100577745, 0.12312753007010385, 1.6898292255719827], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 15.279999999999992, 10, 36, 15.0, 18.0, 20.0, 23.99000000000001, 0.21066655318761668, 0.38137394039990413, 0.17610407180527332], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 10.41399999999999, 7, 23, 10.0, 13.0, 14.0, 17.99000000000001, 0.210665843103664, 0.3566136579616731, 0.15141607473075852], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 80.0, 80, 80, 80.0, 80.0, 80.0, 80.0, 12.5, 6.4208984375, 1704.8095703125], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 589.0, 589, 589, 589.0, 589.0, 589.0, 589.0, 1.697792869269949, 0.8588444397283532, 3246.9360144312395], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 3.054000000000001, 1, 20, 3.0, 4.0, 5.0, 8.0, 0.20968264112899843, 0.17629354728406463, 0.08907416883897883], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 746.0359999999997, 548, 999, 719.5, 908.9000000000001, 927.0, 955.96, 0.20963305829476084, 0.18452663348699438, 0.09744661694170524], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.9659999999999944, 2, 27, 4.0, 5.0, 6.0, 11.990000000000009, 0.20970620998805514, 0.18999874123847454, 0.10280519278711296], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1003.9060000000006, 786, 1344, 974.0, 1213.8000000000002, 1238.85, 1279.0, 0.209635519300723, 0.19832830347844024, 0.11116414744169197], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 61.0, 61, 61, 61.0, 61.0, 61.0, 61.0, 16.393442622950822, 8.452868852459016, 1079.4857838114754], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 29.39600000000001, 20, 655, 27.0, 32.0, 36.0, 78.99000000000001, 0.20948392378472092, 0.12310617367976946, 9.582252919996412], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 37.25200000000001, 27, 250, 36.0, 43.0, 49.94999999999999, 96.97000000000003, 0.20960423367015335, 47.43244778142827, 0.06509193975303591], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 1109.0, 1109, 1109, 1109.0, 1109.0, 1109.0, 1109.0, 0.9017132551848511, 0.47287111136158705, 0.37160448602344454], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 3.361999999999998, 2, 12, 3.0, 4.0, 5.0, 9.0, 0.21068750281794535, 0.2288918083592795, 0.09073553588155654], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.970000000000002, 2, 14, 4.0, 5.0, 6.0, 7.0, 0.21068652625954726, 0.21621787056810357, 0.07797870454332853], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.276, 1, 12, 2.0, 3.0, 4.0, 8.0, 0.2107250627960687, 0.1195021007971729, 0.08210869146057755], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 207.948, 90, 344, 220.5, 310.90000000000003, 320.95, 334.95000000000005, 0.2107058815596955, 0.19192136991166367, 0.06913786738677509], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 112.52399999999997, 81, 369, 111.0, 129.0, 136.95, 243.7800000000002, 0.20957436285202205, 0.12319493273815611, 61.996353510873554], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 272.38799999999986, 17, 525, 337.5, 456.80000000000007, 474.0, 506.99, 0.21068439561810168, 0.11743350695132096, 0.08867673292129084], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 553.4840000000002, 334, 1048, 526.5, 858.1000000000004, 947.95, 1003.97, 0.21071689258327111, 0.11332412101028637, 0.0901308583510476], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 8.501999999999999, 5, 261, 7.0, 10.0, 13.0, 33.97000000000003, 0.20946303731458332, 0.0985474497665744, 0.15239254179625447], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 559.9860000000002, 326, 1110, 514.5, 899.3000000000002, 972.0, 1058.99, 0.21065812124975877, 0.10836714571727826, 0.08516842011464858], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 4.44, 2, 16, 4.0, 6.0, 7.0, 11.990000000000009, 0.20968176179648623, 0.12873927779205946, 0.10525041558925188], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.818000000000004, 3, 36, 5.0, 6.0, 6.0, 11.0, 0.20967886005152228, 0.1227993253530258, 0.0993107882079964], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 900.0219999999998, 613, 1515, 907.0, 1145.7, 1296.6, 1444.8000000000002, 0.2095940414929132, 0.19153456740209024, 0.09272080155887664], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 519.6560000000009, 276, 1157, 435.0, 924.9000000000001, 981.95, 1076.99, 0.20959790737449277, 0.18560222194741607, 0.08658194806583051], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 5.839999999999994, 3, 38, 6.0, 7.0, 8.0, 14.990000000000009, 0.20971456589294574, 0.139866098691465, 0.09850850214307313], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1236.4759999999999, 948, 9951, 1158.5, 1480.8000000000002, 1502.95, 1557.96, 0.20962971845051775, 0.15750111274074927, 0.11627898445302157], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 168.59799999999996, 145, 213, 164.0, 189.0, 191.0, 195.0, 0.2107989787211079, 4.075778079451611, 0.10663463962649794], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 230.424, 198, 341, 225.0, 258.0, 260.95, 270.95000000000005, 0.2107814723085841, 0.4085352499077831, 0.15108750065869211], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 9.586, 6, 34, 10.0, 12.0, 13.0, 16.0, 0.21052401110556265, 0.17186119423008422, 0.130343967813405], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 9.328000000000005, 6, 20, 9.0, 11.0, 12.0, 16.980000000000018, 0.2105250747995591, 0.17503227415185763, 0.13363408068331387], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 10.264000000000003, 7, 24, 10.0, 12.0, 13.0, 17.99000000000001, 0.21052161783337045, 0.17037243155731682, 0.12890337341945632], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 12.839999999999987, 9, 38, 13.0, 15.0, 16.0, 21.99000000000001, 0.21052268150318246, 0.1882594967571086, 0.14679022909499245], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 9.759999999999998, 6, 39, 10.0, 12.0, 13.949999999999989, 24.960000000000036, 0.21050734796948822, 0.1580383914880933, 0.11656022099482405], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2066.764, 1701, 2747, 1983.0, 2573.5, 2679.75, 2707.99, 0.2103601534114527, 0.17580028102012893, 0.13435111360458013], "isController": false}]}, function(index, item){
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
