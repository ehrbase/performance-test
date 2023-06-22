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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8902148479047012, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.176, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.597, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [0.5, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.936, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.997, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.497, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.139, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 325.85786002978296, 1, 19596, 9.0, 842.0, 1505.9500000000007, 6046.990000000002, 15.202846919846943, 95.76666221188648, 125.80485563561223], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6200.691999999997, 5172, 19596, 6038.0, 6526.3, 6658.9, 17268.51000000009, 0.3279488504736893, 0.19046334068867948, 0.1652554754340075], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.382, 1, 10, 2.0, 3.0, 4.0, 6.0, 0.32902789366871366, 0.16891919334040964, 0.11888703189201569], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.6559999999999975, 2, 15, 3.0, 5.0, 5.0, 7.0, 0.329024862434705, 0.18883906435693407, 0.13880736383964118], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 13.735999999999976, 8, 368, 12.0, 15.0, 18.94999999999999, 64.96000000000004, 0.32695936941308174, 0.1700923102344168, 3.597510952321477], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 34.641999999999996, 25, 53, 35.0, 41.0, 43.0, 47.99000000000001, 0.328978101901625, 1.3681858714350288, 0.13686003067391822], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.4820000000000007, 1, 16, 2.0, 3.0, 4.0, 6.0, 0.3289887084495486, 0.20552477215064524, 0.1391133894127486], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 30.57200000000002, 21, 48, 31.0, 36.0, 38.0, 43.98000000000002, 0.3289802664476974, 1.3502037652367211, 0.11951236242045257], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 860.9999999999997, 675, 1103, 862.5, 1015.8000000000001, 1062.0, 1088.99, 0.3288311958209501, 1.390695847708737, 0.15991985890511048], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 5.860000000000004, 4, 36, 5.0, 8.0, 9.0, 12.990000000000009, 0.3288785635636755, 0.4890494897695745, 0.1679721569763694], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.8659999999999988, 2, 23, 4.0, 5.0, 5.0, 11.0, 0.32713863611976934, 0.3155450217596264, 0.17890394162799889], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 8.08400000000001, 5, 23, 8.0, 10.0, 11.0, 17.980000000000018, 0.32898199810506373, 0.5361089356034188, 0.21493062180887462], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 468.0, 468, 468, 468.0, 468.0, 468.0, 468.0, 2.136752136752137, 0.9243956997863247, 2527.32914329594], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.0180000000000025, 2, 15, 4.0, 5.0, 6.0, 10.990000000000009, 0.32714291696327624, 0.32864764659110535, 0.19200477841301664], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 8.240000000000007, 5, 28, 8.0, 10.0, 11.0, 14.990000000000009, 0.3289811322741018, 0.5168312864264358, 0.19565381792473438], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.639999999999998, 4, 19, 6.0, 8.0, 9.0, 11.990000000000009, 0.328981348731415, 0.5091211261212507, 0.18794344629675563], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1579.9240000000004, 1339, 1963, 1551.5, 1797.8000000000002, 1869.9, 1914.93, 0.32858829923353494, 0.5017742279242879, 0.1809802741872204], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 11.365999999999996, 7, 54, 10.0, 14.0, 16.0, 32.99000000000001, 0.3269495346854222, 0.1700871939670618, 2.6360306234012167], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 11.468, 8, 32, 11.0, 14.0, 15.0, 22.970000000000027, 0.32898329686005184, 0.5955465109594206, 0.2743669292172698], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 8.094, 5, 24, 8.0, 10.0, 11.0, 15.990000000000009, 0.3289824310222537, 0.5569923149292886, 0.2358135784866545], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 64.0, 64, 64, 64.0, 64.0, 64.0, 64.0, 15.625, 7.3699951171875, 2130.9814453125], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 534.0, 534, 534, 534.0, 534.0, 534.0, 534.0, 1.8726591760299625, 0.8686651451310861, 3581.354605571161], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.3899999999999997, 1, 28, 2.0, 3.0, 3.9499999999999886, 7.0, 0.3271741705153255, 0.27500203154711506, 0.13834610921204682], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 568.2960000000005, 425, 707, 561.0, 662.0, 673.95, 702.99, 0.3270528288434431, 0.2879949280238487, 0.15138968835135938], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.366000000000003, 2, 20, 3.0, 4.0, 5.0, 9.990000000000009, 0.3271536195622161, 0.29639031680084327, 0.15974297830186332], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 764.9440000000002, 597, 955, 747.0, 891.9000000000001, 917.95, 942.98, 0.32700234983888593, 0.3093461389769797, 0.17276198365511455], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 94.0, 94, 94, 94.0, 94.0, 94.0, 94.0, 10.638297872340425, 5.038646941489362, 700.4965924202128], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 23.000000000000007, 15, 635, 21.0, 25.0, 28.0, 56.98000000000002, 0.32681575565685395, 0.17001759882418227, 14.907777291730124], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 30.293999999999954, 19, 260, 28.0, 36.0, 42.0, 101.96000000000004, 0.3270866328197419, 73.97738497978115, 0.10093689059671723], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 511.0, 511, 511, 511.0, 511.0, 511.0, 511.0, 1.9569471624266144, 1.0262506115459882, 0.802654109589041], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.75, 1, 13, 3.0, 4.0, 4.0, 7.0, 0.328976586736322, 0.35747611115954375, 0.14103586091527867], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.368000000000001, 2, 10, 3.0, 4.0, 5.0, 7.0, 0.32897593738403597, 0.3375569405945122, 0.12111711757205232], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.8659999999999988, 1, 17, 2.0, 3.0, 3.0, 5.0, 0.32902919278610077, 0.1865923267019693, 0.12756307571883008], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 91.56999999999995, 66, 119, 91.0, 111.0, 115.0, 118.0, 0.32900970710239835, 0.2996783631948027, 0.10731371305879009], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 82.02200000000002, 59, 343, 80.0, 93.0, 104.94999999999999, 310.0, 0.3270252345752008, 0.17012657491265157, 96.69919021193851], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 209.36400000000006, 12, 356, 260.0, 331.0, 334.0, 345.98, 0.32897139198980974, 0.18334693664307067, 0.13782102262073087], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 431.8900000000001, 324, 553, 421.0, 510.0, 523.0, 545.97, 0.32893892854064927, 0.1769042552115439, 0.14005602816769833], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 7.042000000000003, 4, 289, 6.0, 8.0, 10.0, 24.0, 0.3267576621404195, 0.14733132830747375, 0.23709076461946457], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 402.55599999999964, 294, 512, 398.0, 471.0, 483.95, 498.98, 0.32890971691398485, 0.16917972362867673, 0.1323347689146111], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.5680000000000005, 2, 21, 3.0, 5.0, 5.0, 10.0, 0.3271698888538454, 0.20087400470830186, 0.16358494442692267], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.265999999999992, 2, 58, 4.0, 5.0, 6.0, 9.0, 0.3271581148625968, 0.19160155572680465, 0.15431383738147877], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 677.9540000000004, 528, 882, 682.0, 794.9000000000001, 834.95, 853.99, 0.32699935581126904, 0.2988052414317994, 0.14402022409265852], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 246.604, 175, 321, 240.0, 292.0, 298.95, 316.96000000000004, 0.32709583384578345, 0.2896299448303812, 0.13447983012604964], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.539999999999999, 3, 38, 4.0, 5.900000000000034, 6.0, 10.990000000000009, 0.3271452714749606, 0.21811069168815464, 0.15302986819971304], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 983.6360000000006, 819, 8716, 936.5, 1081.8000000000002, 1111.95, 1139.96, 0.3269721982079308, 0.24577516668225233, 0.18072877361883674], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 134.93600000000004, 117, 171, 136.0, 150.0, 151.0, 154.99, 0.32903005887005815, 6.361690153175009, 0.16580030310249025], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 182.53800000000004, 160, 235, 178.0, 204.0, 206.95, 215.0, 0.3290034288737357, 0.6376722610546797, 0.23518604485895953], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 7.418000000000003, 5, 20, 7.0, 9.0, 10.0, 14.0, 0.32887510244459445, 0.2684025506484101, 0.2029776022900231], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 7.249999999999995, 5, 16, 7.0, 9.0, 10.0, 13.0, 0.32887683299502873, 0.27354266350605067, 0.20811737087966659], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.41999999999999, 6, 25, 8.0, 10.0, 10.0, 15.990000000000009, 0.3288720740251574, 0.2661519301419807, 0.2007275842438705], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 9.994, 7, 32, 10.0, 12.0, 13.0, 18.0, 0.32887358822790413, 0.2940945639415763, 0.2286699168147146], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 7.739999999999999, 5, 28, 7.0, 9.0, 10.0, 16.980000000000018, 0.32884525331607556, 0.2468619479263676, 0.18144293762068622], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1614.931999999998, 1412, 1984, 1589.0, 1833.9, 1902.9, 1959.0, 0.3285325960185792, 0.27453967552642417, 0.2091828638712047], "isController": false}]}, function(index, item){
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
