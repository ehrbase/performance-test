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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8902148479047012, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.178, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.598, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.952, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.998, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.497, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.119, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 323.9065730695583, 1, 18183, 10.0, 838.0, 1507.0, 6031.970000000005, 15.290131961547317, 96.3164932500296, 126.52714680437542], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6162.378, 5061, 18183, 6021.0, 6526.9, 6759.45, 15253.650000000074, 0.3297609233305853, 0.1915157409315746, 0.16616859027205277], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.4159999999999977, 1, 31, 2.0, 3.0, 4.0, 5.990000000000009, 0.33085238160778374, 0.1698558647803008, 0.11954627069812498], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.700000000000004, 2, 13, 4.0, 5.0, 5.0, 7.0, 0.3308497545094822, 0.18988643478785913, 0.13957724018368778], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 13.853999999999992, 8, 358, 12.0, 16.0, 19.94999999999999, 37.99000000000001, 0.3288919760882378, 0.1710976997870753, 3.618775287681811], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 34.59200000000002, 24, 60, 35.0, 41.0, 42.0, 45.99000000000001, 0.33077643151770153, 1.3756649381530768, 0.1376081638931063], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.456, 1, 9, 2.0, 3.0, 4.0, 7.0, 0.33078912391823684, 0.20664952193528838, 0.13987469790683257], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 30.426000000000013, 21, 45, 31.0, 36.0, 37.0, 38.99000000000001, 0.33077949511140986, 1.3575881756832748, 0.12016598845844187], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 847.0740000000002, 666, 1088, 852.0, 992.0, 1037.85, 1075.0, 0.3306305388881027, 1.398305645574312, 0.16079493004519058], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 5.776, 3, 15, 5.0, 8.0, 9.0, 11.990000000000009, 0.3307709609557958, 0.49186352534863265, 0.16893868416004024], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.853999999999998, 2, 13, 4.0, 5.0, 5.0, 8.990000000000009, 0.3290837649815384, 0.3174212163182767, 0.1799676839742788], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 8.00999999999999, 5, 19, 8.0, 10.0, 11.0, 15.0, 0.3307823399278101, 0.5390427719345078, 0.2161068216911181], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 527.0, 527, 527, 527.0, 527.0, 527.0, 527.0, 1.8975332068311195, 0.8209054791271347, 2244.3833758301707], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.08, 2, 15, 4.0, 5.0, 6.0, 9.990000000000009, 0.32908593091828137, 0.33059959765131375, 0.1931451606268429], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 8.168000000000001, 5, 21, 8.0, 10.0, 12.0, 16.99000000000001, 0.33078080809751415, 0.5196585876899922, 0.19672413294080676], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.695999999999999, 4, 19, 7.0, 8.0, 9.0, 13.0, 0.33078080809751415, 0.5119059125002067, 0.18897145775102128], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1566.9259999999988, 1350, 1939, 1548.5, 1756.9, 1796.5, 1917.9, 0.33045921934957695, 0.5046312362198505, 0.18201074190738417], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 12.012000000000004, 8, 70, 11.0, 14.0, 17.94999999999999, 39.960000000000036, 0.32887899620868294, 0.1710909473343042, 2.651586906932506], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 11.370000000000001, 8, 24, 11.0, 14.0, 15.0, 20.980000000000018, 0.3307825587618677, 0.5988036494164665, 0.27586748552991697], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 7.984000000000003, 5, 16, 8.0, 10.0, 11.0, 14.0, 0.3307825587618677, 0.5600400683115602, 0.23710390442501061], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 74.0, 74, 74, 74.0, 74.0, 74.0, 74.0, 13.513513513513514, 6.374049831081082, 1843.0109797297298], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 553.0, 553, 553, 553.0, 553.0, 553.0, 553.0, 1.8083182640144664, 0.838819507233273, 3458.3062556509944], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.351999999999999, 1, 24, 2.0, 3.0, 4.0, 6.990000000000009, 0.3290878802857273, 0.27661057562571123, 0.1391553243786327], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 564.2019999999995, 442, 731, 558.5, 653.0, 667.0, 691.9200000000001, 0.32898286394058307, 0.2896944709412726, 0.15228308350374645], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.302000000000001, 2, 15, 3.0, 4.0, 5.0, 8.990000000000009, 0.32909307871182436, 0.2981474023942838, 0.160689979839758], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 769.6199999999994, 605, 1017, 748.0, 881.9000000000001, 900.0, 929.0, 0.3289395777468428, 0.3111787679288517, 0.17378546050883004], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 94.0, 94, 94, 94.0, 94.0, 94.0, 94.0, 10.638297872340425, 5.038646941489362, 700.4965924202128], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 24.020000000000003, 16, 664, 21.0, 26.0, 35.94999999999999, 60.930000000000064, 0.3287371496648196, 0.1710171552714317, 14.9954221297302], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 30.833999999999964, 21, 263, 29.0, 35.0, 42.0, 101.0, 0.32901490305904896, 74.41350304614335, 0.10153194274087839], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 463.0, 463, 463, 463.0, 463.0, 463.0, 463.0, 2.1598272138228944, 1.13264376349892, 0.8858666306695464], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.676, 1, 9, 2.0, 4.0, 4.0, 7.990000000000009, 0.330787810866115, 0.35944424319222146, 0.14181235250998483], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.3860000000000023, 2, 11, 3.0, 4.0, 5.0, 8.0, 0.33078606014616774, 0.3394142785704882, 0.12178353972178246], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.8099999999999994, 1, 8, 2.0, 3.0, 3.0, 5.990000000000009, 0.33085347624438954, 0.18762687713855417, 0.12827034186427994], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 91.378, 66, 125, 90.0, 110.0, 115.0, 118.0, 0.33082786364598776, 0.3013344303723137, 0.10790674458765616], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 84.71800000000006, 59, 471, 82.0, 93.90000000000003, 105.79999999999995, 363.51000000000045, 0.32895256240888016, 0.17112921828206495, 97.2690882536961], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 211.07199999999997, 12, 372, 261.0, 332.90000000000003, 335.95, 347.95000000000005, 0.33078190226056353, 0.1843559955460217, 0.13857952741189625], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 423.69800000000004, 342, 557, 413.0, 500.0, 513.0, 534.0, 0.33071342160735984, 0.1778585824349503, 0.14081157404375869], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 7.443999999999999, 4, 281, 6.0, 9.0, 11.949999999999989, 32.0, 0.32868009960321737, 0.1481981335818374, 0.23848565820819384], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 390.96999999999986, 286, 508, 384.0, 462.0, 473.0, 491.99, 0.33071298412246963, 0.17010726158900974, 0.1330603022055249], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.536000000000004, 2, 15, 3.0, 5.0, 6.0, 10.990000000000009, 0.329084847946346, 0.20204974096908906, 0.164542423973173], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.211999999999995, 2, 42, 4.0, 5.0, 6.0, 10.980000000000018, 0.329075967845329, 0.1927247545669163, 0.15521844967704485], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 671.3639999999989, 542, 852, 676.0, 784.7, 822.95, 843.99, 0.32891252965968737, 0.3005534600858067, 0.14486284265285057], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 244.18400000000008, 176, 314, 238.0, 287.0, 293.95, 302.99, 0.32900884112557877, 0.2913238343134507, 0.13526633018932485], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.547999999999992, 3, 35, 4.0, 6.0, 6.0, 10.990000000000009, 0.329088530080008, 0.21940627965910378, 0.1539388729573475], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 977.6619999999998, 781, 8398, 927.5, 1082.8000000000002, 1099.0, 1134.97, 0.3289162079381953, 0.24723642032432452, 0.18180329462208844], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 134.94799999999998, 116, 166, 135.0, 150.0, 152.0, 156.0, 0.3308289581203622, 6.396471290456246, 0.16670677967783876], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 183.0620000000002, 158, 280, 180.0, 203.0, 205.0, 213.96000000000004, 0.33079218774706043, 0.6411392216244808, 0.23646472795981274], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 7.322000000000006, 5, 18, 7.0, 9.0, 10.0, 14.0, 0.3307663658236314, 0.26994605427975293, 0.20414486640677248], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 7.158, 5, 18, 7.0, 9.0, 10.0, 14.0, 0.33076811633511577, 0.2751157347302553, 0.2093141986183154], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.522000000000006, 5, 22, 8.0, 10.0, 11.0, 17.99000000000001, 0.3307619896259809, 0.26768141447553384, 0.20188109718382627], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 9.843999999999994, 7, 20, 10.0, 12.0, 14.0, 16.0, 0.33076330247311725, 0.2957844372145099, 0.22998385875083932], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 7.907999999999997, 5, 28, 8.0, 9.0, 11.0, 15.990000000000009, 0.3307416418279694, 0.24828555418904136, 0.18248928479765888], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1615.902, 1430, 1970, 1586.5, 1811.9, 1887.6, 1940.93, 0.33042602488240136, 0.27612192749230435, 0.2103884455305915], "isController": false}]}, function(index, item){
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
