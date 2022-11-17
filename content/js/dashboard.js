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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8706658157838758, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.427, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.706, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.498, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [0.5, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [0.999, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [0.991, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.739, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.763, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.496, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [0.834, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.471, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 509.82352690916986, 1, 25866, 15.0, 1026.0, 1983.9000000000015, 10812.87000000002, 9.74195123346241, 65.6658658023163, 80.71322873204184], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 11606.973999999984, 9468, 25866, 10942.0, 13761.100000000006, 14974.849999999999, 22913.110000000026, 0.209663737105156, 0.12179047078839016, 0.10606036701217852], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 7.421999999999996, 5, 20, 7.0, 9.0, 10.0, 14.980000000000018, 0.21048262402793863, 2.247429862453815, 0.07646439076014958], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 9.374000000000006, 6, 36, 9.0, 11.0, 13.0, 21.99000000000001, 0.21047996588540713, 2.2601215408670003, 0.08920732929127606], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 22.278, 14, 278, 20.0, 27.900000000000034, 33.94999999999999, 80.8900000000001, 0.20949129647459666, 0.12311050634465341, 2.3326364867220226], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 43.10199999999994, 27, 92, 44.0, 53.900000000000034, 55.0, 62.97000000000003, 0.21043399064494653, 0.8751851029990211, 0.08795483202737998], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 3.0020000000000024, 1, 19, 3.0, 4.0, 5.0, 12.0, 0.21043859612203755, 0.13150028382905654, 0.08939530206356089], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 37.87399999999995, 24, 72, 38.0, 47.0, 48.94999999999999, 53.0, 0.2104322193612793, 0.8636101292548343, 0.07685708011827974], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1206.968, 807, 2852, 1171.0, 1592.0, 1721.4499999999998, 2494.1100000000006, 0.21035891437971466, 0.889687555219215, 0.10271431366197006], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 6.82, 4, 22, 7.0, 8.0, 9.0, 15.0, 0.2103758195715991, 0.31283336349596647, 0.10785869655770461], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 4.906, 3, 21, 4.0, 6.0, 7.0, 15.980000000000018, 0.2095662816235519, 0.20215123717454356, 0.11501586940667594], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 9.626000000000001, 6, 21, 10.0, 12.0, 13.0, 18.0, 0.21043133373062767, 0.3429664950967395, 0.1378900634113781], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 841.0, 841, 841, 841.0, 841.0, 841.0, 841.0, 1.1890606420927465, 0.5643393281807373, 1406.4114056926278], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 5.299999999999993, 3, 17, 5.0, 6.900000000000034, 7.949999999999989, 13.980000000000018, 0.20956777484708888, 0.21056731489821504, 0.12340758616483848], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 15.377999999999986, 7, 27, 16.0, 19.0, 20.0, 23.0, 0.21043018242192515, 0.33062280626534823, 0.12555941548808228], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 7.5760000000000005, 4, 26, 7.0, 9.0, 10.0, 18.0, 0.21043009386023906, 0.3256668740104525, 0.12062740732027377], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2441.9519999999993, 1743, 7165, 2308.0, 3249.9, 3491.5499999999997, 4183.640000000001, 0.21017852563967834, 0.32093152501860084, 0.11617289600786909], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 20.268000000000022, 13, 90, 18.0, 25.0, 30.94999999999999, 54.930000000000064, 0.20948515253032926, 0.12310689576940545, 1.6893831929643155], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 14.612, 9, 26, 14.0, 17.0, 19.0, 23.99000000000001, 0.21043266217940057, 0.3809505227568194, 0.17590855354059268], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 10.027999999999999, 6, 38, 10.0, 12.0, 13.0, 20.0, 0.21043230792475448, 0.3562540883051824, 0.15124822132091725], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 101.0, 101, 101, 101.0, 101.0, 101.0, 101.0, 9.900990099009901, 5.085860148514851, 1350.3442141089108], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 721.0, 721, 721, 721.0, 721.0, 721.0, 721.0, 1.3869625520110958, 0.7016080097087379, 2652.4900312066575], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.8080000000000003, 2, 15, 3.0, 3.0, 4.949999999999989, 9.0, 0.2095992253212632, 0.17622341430326072, 0.0890387334128413], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 553.8120000000004, 408, 1294, 538.5, 657.0, 680.9, 980.99, 0.20955091144168933, 0.18446619393727304, 0.09740843149047278], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.6140000000000003, 2, 13, 3.0, 5.0, 5.949999999999989, 9.0, 0.20959412935227448, 0.1898734504706017, 0.10275024700668144], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 827.0459999999994, 611, 1920, 810.5, 971.9000000000001, 1002.95, 1439.8700000000001, 0.2095088525870572, 0.19819660213828924, 0.11109697944801959], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 74.0, 74, 74, 74.0, 74.0, 74.0, 74.0, 13.513513513513514, 6.967905405405406, 889.8463893581081], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 36.51000000000001, 23, 722, 33.0, 43.0, 54.0, 88.94000000000005, 0.20942303117219935, 0.12307038927971879, 9.579467558697086], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 41.384, 29, 205, 39.0, 49.0, 57.0, 118.63000000000034, 0.2095380900435462, 47.417479791229866, 0.06507139905649188], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 1112.0, 1112, 1112, 1112.0, 1112.0, 1112.0, 1112.0, 0.8992805755395684, 0.4715953799460431, 0.37060195593525175], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 3.519999999999997, 2, 18, 3.0, 4.0, 5.0, 7.0, 0.21044993353991098, 0.2286694721221182, 0.09063322333115306], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 4.2780000000000005, 2, 18, 4.0, 5.0, 6.0, 11.990000000000009, 0.21044922491550463, 0.2159624191611915, 0.0778908752372815], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.6000000000000023, 1, 28, 2.0, 4.0, 4.0, 9.0, 0.210484130338509, 0.11932970223652017, 0.08201481250494637], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 202.93000000000012, 91, 601, 198.0, 273.0, 303.0, 339.8900000000001, 0.21046490434580561, 0.1917137967742465, 0.06905879673846746], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 123.19199999999992, 89, 384, 121.5, 146.90000000000003, 165.0, 240.98000000000002, 0.20950771135033167, 0.12315575272035288, 61.97663664281491], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 266.39000000000004, 18, 716, 317.0, 428.90000000000003, 448.0, 521.95, 0.21044621331501612, 0.11732458597864223, 0.08857648236208197], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 544.1419999999995, 331, 1570, 506.5, 845.5000000000002, 932.55, 1227.5200000000013, 0.2104698655560593, 0.11316742691012978, 0.09002519639995504], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 15.307999999999991, 10, 322, 13.0, 19.0, 25.0, 47.960000000000036, 0.2093982104828932, 0.09850508981612743, 0.1523453777439018], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 555.0120000000002, 305, 1889, 496.5, 894.9000000000001, 974.8, 1183.8100000000002, 0.21042070674423616, 0.1082450145021951, 0.08507243417198611], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 4.494000000000003, 2, 16, 4.0, 6.0, 7.0, 12.0, 0.2095980830997712, 0.12871164472978197, 0.10520841280593984], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.982, 3, 45, 5.0, 6.0, 7.0, 12.990000000000009, 0.20959439293080032, 0.12276172837824242, 0.09927078180804508], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 915.5000000000001, 594, 1825, 916.5, 1303.6000000000001, 1385.75, 1498.7700000000002, 0.20951341765829368, 0.19146089044459585, 0.09268513496016312], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 526.9400000000002, 262, 1795, 413.5, 939.7, 992.95, 1533.6600000000012, 0.20952193380364023, 0.18552307871005724, 0.08655056445208965], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 5.123999999999997, 3, 41, 5.0, 6.0, 7.0, 10.990000000000009, 0.20956874106189322, 0.13976884292801903, 0.0984400043464557], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1253.8519999999999, 937, 10257, 1171.0, 1478.9, 1519.6999999999998, 2143.86, 0.20948664459794694, 0.1573936170519196, 0.1161996231754237], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 171.46400000000014, 144, 365, 177.0, 186.0, 190.0, 256.8100000000002, 0.21052489751647988, 4.070478745590556, 0.10649599307962557], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 232.84999999999997, 195, 483, 234.5, 254.0, 265.84999999999997, 428.85000000000014, 0.210508588750421, 0.40801827214550357, 0.15089189857696195], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 8.959999999999994, 5, 21, 9.0, 11.0, 13.0, 19.0, 0.21037404926707784, 0.171738772941816, 0.13025112034699937], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 8.906000000000006, 5, 35, 9.0, 11.0, 12.0, 20.0, 0.21037458035530585, 0.17494289907952704, 0.1335385519833484], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 9.466000000000006, 6, 31, 9.0, 11.0, 14.0, 23.980000000000018, 0.21037192494098017, 0.17026320262645142, 0.1288117157597603], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 12.045999999999994, 8, 25, 12.0, 14.900000000000034, 16.0, 22.0, 0.210372898585116, 0.18816130063254924, 0.14668579061501255], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 8.58, 5, 44, 8.0, 10.0, 12.0, 29.90000000000009, 0.21039024866444272, 0.1579385625496521, 0.1164953818288467], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2141.9360000000015, 1664, 4684, 2066.0, 2632.9, 2686.9, 3316.7300000000023, 0.21017614021606948, 0.17562269016421903, 0.13423358955206], "isController": false}]}, function(index, item){
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
