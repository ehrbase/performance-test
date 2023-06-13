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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8857051691129547, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.149, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.541, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.88, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.973, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.497, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.089, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 327.99893639651384, 1, 16373, 10.0, 851.0, 1523.9500000000007, 6054.94000000001, 15.122183770721831, 95.25854418662853, 125.13736119300552], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6174.202000000002, 5369, 16373, 6033.0, 6493.3, 6687.75, 13731.320000000058, 0.3261029781028372, 0.18939131065189288, 0.16432532880963283], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.4459999999999993, 1, 18, 2.0, 3.0, 4.0, 6.990000000000009, 0.3272523305274719, 0.1680076393374973, 0.11824547099137166], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.8619999999999988, 2, 15, 4.0, 5.0, 5.0, 8.0, 0.3272497602895506, 0.18782027013649588, 0.13805849262215417], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 13.133999999999991, 8, 358, 11.0, 15.900000000000034, 18.94999999999999, 34.98000000000002, 0.32534883902520284, 0.1692544726924959, 3.5797903997040628], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 35.01799999999999, 24, 60, 35.0, 41.0, 42.0, 48.99000000000001, 0.3272131387854895, 1.3608455725362814, 0.13612577844005716], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.5620000000000007, 1, 11, 2.0, 4.0, 4.0, 6.990000000000009, 0.3272208478946611, 0.20442035996747426, 0.13836584681483227], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 31.033999999999992, 22, 44, 31.0, 36.900000000000034, 38.0, 41.99000000000001, 0.3272133529225061, 1.342951982872017, 0.11887047586637915], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 871.57, 693, 1127, 872.0, 1010.9000000000001, 1068.95, 1089.98, 0.32705133136055975, 1.3831684289418844, 0.1590542607593347], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 5.964000000000002, 3, 18, 6.0, 8.0, 9.0, 13.980000000000018, 0.3271977216568246, 0.48655004174224936, 0.1671136801040227], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 4.113999999999993, 3, 24, 4.0, 5.0, 5.949999999999989, 10.990000000000009, 0.32554817429328375, 0.31401092503048755, 0.17803415781663953], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 8.229999999999993, 5, 24, 8.0, 10.0, 11.0, 16.99000000000001, 0.32721592258856586, 0.5332309396316073, 0.2137768088005377], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 472.0, 472, 472, 472.0, 472.0, 472.0, 472.0, 2.1186440677966103, 0.9165618379237289, 2505.9110997086864], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.318000000000001, 2, 17, 4.0, 5.0, 7.0, 11.0, 0.3255509298385658, 0.32704833694749125, 0.19107041878220513], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 8.482000000000005, 6, 20, 8.0, 10.0, 11.0, 15.0, 0.3272133529225061, 0.5140540947069968, 0.19460247258770136], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.990000000000002, 5, 18, 7.0, 8.0, 9.0, 14.990000000000009, 0.3272127105122973, 0.5063840375741627, 0.18693304262665422], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1578.5559999999994, 1337, 1960, 1556.5, 1765.0, 1840.9, 1918.97, 0.32685891200435113, 0.499133348916332, 0.18002776012739652], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 11.280000000000001, 7, 52, 10.0, 14.0, 17.0, 33.99000000000001, 0.3253393126361138, 0.16924951683045333, 2.623048208128668], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 11.59400000000001, 8, 28, 11.0, 14.0, 16.0, 21.0, 0.32721784986459723, 0.5923505863989282, 0.27289457400816997], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 8.318000000000003, 5, 17, 8.0, 10.0, 11.0, 15.0, 0.32721720743673094, 0.5540036569386082, 0.23454827173687548], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 51.0, 51, 51, 51.0, 51.0, 51.0, 51.0, 19.607843137254903, 9.248621323529413, 2674.1727941176473], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 519.0, 519, 519, 519.0, 519.0, 519.0, 519.0, 1.9267822736030829, 0.8937710741811175, 3684.86196411368], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.4819999999999975, 1, 29, 2.0, 3.0, 4.0, 6.0, 0.3255536854304959, 0.2736399536981271, 0.1376608845619187], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 588.3819999999997, 441, 726, 580.5, 676.0, 691.9, 708.99, 0.32544392178150605, 0.28657816280234555, 0.15064494035589246], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.5699999999999985, 2, 14, 3.0, 4.0, 5.0, 10.0, 0.3255706439461767, 0.2949561934524488, 0.15897004098934406], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 778.7220000000007, 610, 964, 762.0, 895.7, 913.95, 948.99, 0.3254055855217944, 0.30783559057697013, 0.17191838063211987], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 59.0, 59, 59, 59.0, 59.0, 59.0, 59.0, 16.949152542372882, 8.027674788135593, 1116.0454184322034], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 23.031999999999993, 15, 614, 21.0, 25.0, 28.0, 79.87000000000012, 0.3252110782503384, 0.16918280614720485, 14.834579555735651], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 30.363999999999983, 21, 304, 29.0, 35.900000000000034, 40.0, 101.97000000000003, 0.3254710379596872, 73.61198489631307, 0.10043832812037222], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 438.0, 438, 438, 438.0, 438.0, 438.0, 438.0, 2.28310502283105, 1.1972923801369864, 0.936429794520548], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.7619999999999996, 1, 9, 3.0, 4.0, 4.0, 6.990000000000009, 0.3272069289339271, 0.3555531463809278, 0.14027718925975977], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.554000000000002, 2, 10, 3.0, 5.0, 5.0, 8.0, 0.3272050017865393, 0.33573981194056124, 0.12046512272805207], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.8820000000000014, 1, 10, 2.0, 3.0, 3.0, 5.0, 0.3272536156615726, 0.18558539760823423, 0.1268746927906683], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 92.49000000000001, 67, 124, 92.0, 112.0, 115.0, 118.0, 0.32723733804206045, 0.29806400152852564, 0.10673561611918769], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 83.32000000000001, 57, 392, 81.0, 95.0, 106.94999999999999, 300.94000000000005, 0.32541151540237784, 0.1692870784863288, 96.22202416863865], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 204.2379999999999, 13, 373, 260.0, 334.0, 338.0, 346.99, 0.32720050519758004, 0.18235996125128018, 0.13707911790015803], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 457.0179999999999, 351, 579, 451.0, 529.0, 541.0, 555.98, 0.32713692381373605, 0.1759351321420533, 0.13928876834256732], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 7.454000000000006, 4, 290, 6.0, 8.0, 10.949999999999989, 30.99000000000001, 0.32515270796929774, 0.1466076726528364, 0.23592623244256664], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 424.29200000000014, 314, 537, 424.5, 488.0, 502.0, 521.98, 0.32712558023899796, 0.16826202574969007, 0.13161693267428434], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.731999999999998, 2, 21, 3.0, 5.0, 6.0, 10.0, 0.3255494460776175, 0.19987909398775283, 0.16277472303880874], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.4220000000000015, 2, 38, 4.0, 5.0, 6.0, 10.990000000000009, 0.3255418155206618, 0.19065496307216415, 0.15355146181296842], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 686.5159999999988, 538, 891, 685.0, 809.9000000000001, 842.95, 861.98, 0.3253841973910695, 0.2973293431062477, 0.14330886037438706], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 252.58200000000005, 176, 330, 246.0, 302.0, 310.0, 318.0, 0.32548947106659, 0.2882075764753787, 0.1338194016787445], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.682000000000004, 3, 41, 4.0, 6.0, 6.0, 11.990000000000009, 0.32555410937185636, 0.21704984961841803, 0.15228556483312422], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 988.1860000000005, 823, 8357, 939.5, 1085.0, 1107.0, 1145.95, 0.3253856796460845, 0.24458262839881614, 0.17985185027312875], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 134.88800000000012, 117, 169, 133.0, 151.0, 152.0, 157.99, 0.3272343397098217, 6.3269705019103935, 0.16489542899440232], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 184.11799999999994, 162, 250, 180.5, 205.0, 207.0, 214.97000000000003, 0.3272054300395526, 0.634187391654102, 0.23390075662983642], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 7.357999999999996, 5, 19, 7.0, 9.0, 10.0, 14.990000000000009, 0.32719408171345, 0.2670306308874485, 0.2019400973075199], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 7.224000000000001, 5, 15, 7.0, 9.0, 10.0, 13.990000000000009, 0.327195580503855, 0.27214428503021326, 0.20705345328759575], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.508000000000001, 5, 17, 8.0, 10.0, 11.0, 15.990000000000009, 0.3271895854246201, 0.26479031380589546, 0.1997006746976441], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 9.916000000000007, 6, 25, 10.0, 12.0, 14.0, 19.970000000000027, 0.3271912982819839, 0.2925901794431597, 0.22750019958669196], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 8.233999999999998, 5, 48, 8.0, 10.0, 11.0, 21.960000000000036, 0.32716346657174566, 0.24559944178551424, 0.18051499864554324], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1630.55, 1422, 2032, 1612.5, 1813.9, 1864.85, 1948.96, 0.32684844233837834, 0.2731323052669665, 0.20811053164513935], "isController": false}]}, function(index, item){
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
