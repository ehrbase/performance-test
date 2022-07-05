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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9052942513065212, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.459, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.001, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.862, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.38, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [0.998, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.994, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.61, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.531, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 22005, 0, 0.0, 227.03371960918008, 1, 8099, 14.0, 692.9000000000015, 1645.650000000005, 2843.930000000011, 21.551491954795246, 144.36222381029742, 189.83969738847924], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query participation #2", 500, 0, 0.0, 8.436000000000009, 4, 32, 7.0, 14.0, 17.94999999999999, 25.99000000000001, 0.4990039880398724, 5.339557087802746, 0.18030417536596952], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 8.999999999999991, 5, 42, 8.0, 14.0, 17.0, 29.99000000000001, 0.49899004415063913, 5.357730172880091, 0.21051142487605087], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 25.98599999999998, 14, 272, 21.0, 40.0, 50.0, 78.96000000000004, 0.49525741499401726, 0.2668973162991196, 5.513607940363083], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 52.16800000000002, 26, 249, 47.0, 76.0, 96.94999999999999, 166.7700000000002, 0.49897560308686273, 2.0753291929169415, 0.2075816473779331], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 3.180000000000002, 1, 37, 2.0, 5.0, 8.0, 19.970000000000027, 0.49906325826423803, 0.31191453641514877, 0.2110296785433741], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 45.214, 21, 200, 41.0, 62.0, 78.94999999999999, 157.81000000000017, 0.4989148601791104, 2.047226968842767, 0.18124641404944247], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 963.0580000000002, 570, 3001, 874.0, 1334.1000000000006, 1781.4499999999996, 2519.71, 0.4984890795997332, 2.1083556677211375, 0.24242925941471402], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 10.814000000000004, 5, 53, 9.0, 17.0, 24.0, 39.0, 0.4983310891823284, 0.7411701648678575, 0.25451871058824], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 4.016000000000007, 2, 24, 3.0, 7.0, 8.0, 17.99000000000001, 0.4963513214361231, 0.47890147029188435, 0.2714421289103798], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 16.601999999999993, 8, 96, 14.0, 25.0, 35.0, 61.930000000000064, 0.49889942786213615, 0.8131476026385793, 0.32594113011696196], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 698.0, 698, 698, 698.0, 698.0, 698.0, 698.0, 1.4326647564469914, 0.6114008775071633, 1694.5416032414041], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 5.083999999999997, 2, 31, 4.0, 8.0, 10.0, 21.99000000000001, 0.49635821974175476, 0.49821956306578635, 0.291319619203901], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 17.55800000000001, 9, 93, 15.0, 26.0, 39.94999999999999, 61.98000000000002, 0.4988944498990238, 0.783342238599264, 0.2967057812387749], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 10.711999999999994, 5, 59, 9.0, 18.0, 24.0, 34.0, 0.49889295652946114, 0.7722122422843709, 0.2850120894235691], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2302.2579999999966, 1454, 5650, 2209.0, 2971.8, 3403.5499999999997, 3979.51, 0.49761839834551835, 0.7600343505980378, 0.27407888346374254], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 23.294, 12, 114, 18.0, 39.900000000000034, 48.0, 78.99000000000001, 0.4952250401627508, 0.2674408664160168, 3.9927518863121776], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 22.756000000000007, 11, 127, 19.0, 34.0, 46.0, 87.91000000000008, 0.4989163536798074, 0.9033114450413702, 0.41608844340093315], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 17.105999999999995, 8, 124, 14.0, 26.0, 36.0, 77.97000000000003, 0.49890739280974666, 0.8448295108711921, 0.3576152600804238], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 108.0, 108, 108, 108.0, 108.0, 108.0, 108.0, 9.25925925925926, 4.313151041666667, 1262.8038194444446], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 740.0, 740, 740, 740.0, 740.0, 740.0, 740.0, 1.3513513513513513, 0.6189294763513513, 2584.382918074324], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 3.0219999999999954, 1, 34, 2.0, 5.0, 8.0, 18.970000000000027, 0.49591563879885264, 0.4169759423884884, 0.20969870273428046], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 488.67799999999966, 305, 2091, 449.5, 608.0, 793.7499999999995, 1709.99, 0.49577353065119856, 0.4361451438982673, 0.22948891946158995], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.996000000000001, 1, 47, 3.0, 7.0, 9.0, 17.0, 0.49607062458268053, 0.44956400352805426, 0.242221984659512], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1390.2960000000003, 897, 5266, 1276.0, 1836.7000000000014, 2365.3999999999996, 3706.970000000001, 0.49562462580340755, 0.4690041625034198, 0.26184855718715183], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 71.0, 71, 71, 71.0, 71.0, 71.0, 71.0, 14.084507042253522, 6.588358274647888, 927.4180237676057], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 52.13599999999996, 28, 731, 44.0, 73.0, 103.94999999999999, 149.97000000000003, 0.49488438016226266, 0.26725689670872194, 22.636127537148496], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 53.21800000000001, 29, 300, 45.5, 77.90000000000003, 99.79999999999995, 182.93000000000006, 0.4955018343477908, 112.13003278116261, 0.15290876919326354], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 293.0, 293, 293, 293.0, 293.0, 293.0, 293.0, 3.4129692832764507, 1.7898090870307168, 1.3998506825938568], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.826, 1, 30, 2.0, 5.0, 8.0, 13.990000000000009, 0.4990318781563767, 0.5424047660039523, 0.213940424326806], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.873999999999999, 2, 22, 3.0, 6.0, 9.0, 14.990000000000009, 0.4990278936631442, 0.5121858557030904, 0.18372413663184117], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.766, 1, 30, 2.0, 5.0, 8.0, 12.0, 0.49901345040854234, 0.28313165496812803, 0.19346517559784307], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 146.85600000000014, 81, 599, 135.5, 190.90000000000003, 232.95, 456.98, 0.49896564421953293, 0.4546239707586174, 0.16274855973566796], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 202.04799999999986, 111, 628, 181.0, 296.80000000000007, 361.79999999999995, 579.5900000000004, 0.4953118731209106, 0.2674877596053355, 146.52234568558592], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 2.6619999999999995, 1, 19, 2.0, 4.0, 6.0, 11.0, 0.49902440728376024, 0.27769928539704875, 0.20906393625462222], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 3.702, 1, 36, 3.0, 6.0, 8.0, 13.980000000000018, 0.4990577789134114, 0.2679706339431154, 0.21248944492797597], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 15.720000000000011, 6, 452, 11.0, 27.0, 35.0, 59.850000000000136, 0.4946787407853718, 0.20917567847662694, 0.35893193789407346], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 5.322000000000002, 2, 51, 4.0, 8.0, 10.0, 18.0, 0.4990338704268536, 0.25682700167475764, 0.20078315880455438], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 4.430000000000004, 2, 21, 3.0, 7.0, 13.0, 18.99000000000001, 0.4959092446409568, 0.30461612781168146, 0.24795462232047838], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.7760000000000025, 2, 30, 4.0, 7.0, 9.0, 20.0, 0.4958954731685836, 0.29056375380971694, 0.23390382181682215], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 652.0579999999995, 370, 2965, 606.0, 872.6000000000001, 1268.1499999999999, 1806.890000000001, 0.49546746364259747, 0.4523269567496542, 0.21821858017852683], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 19.65800000000001, 5, 117, 16.5, 36.0, 46.94999999999999, 59.0, 0.495594659075478, 0.4389690974428307, 0.20375522604567994], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 8.69599999999999, 4, 55, 7.0, 13.0, 17.94999999999999, 34.97000000000003, 0.496366596513521, 0.33107264201048325, 0.23218710911130525], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 641.3760000000004, 361, 4274, 608.0, 764.9000000000001, 796.95, 912.9000000000001, 0.4962158578678994, 0.3731310649983228, 0.27427556206370224], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 17.06400000000001, 8, 86, 14.0, 27.0, 40.0, 57.98000000000002, 0.49832314262506666, 0.4068341281587458, 0.3075588145889083], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 16.325999999999986, 8, 92, 14.0, 23.0, 37.849999999999966, 62.0, 0.49832562589698615, 0.4140579839240153, 0.3153466851379365], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 16.804000000000002, 8, 85, 14.0, 25.0, 35.94999999999999, 61.99000000000001, 0.49830576041459046, 0.40341355017939007, 0.3041416994717959], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 20.009999999999984, 10, 71, 17.0, 32.0, 41.94999999999999, 60.99000000000001, 0.498312713153263, 0.4457562941878799, 0.3464830583643782], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 17.554000000000006, 8, 100, 14.0, 27.0, 45.0, 83.97000000000003, 0.4983221493232287, 0.37422825471637, 0.27495313903088303], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2654.8180000000007, 1664, 8099, 2512.5, 3503.400000000001, 3998.5499999999997, 5254.680000000001, 0.4972957059510382, 0.4151447864015484, 0.3166375002735126], "isController": false}]}, function(index, item){
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
