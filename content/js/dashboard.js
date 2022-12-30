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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8715592427143161, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.476, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [0.5, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [0.994, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.814, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.839, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [0.849, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.494, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 485.1482663263169, 1, 25175, 12.0, 1004.9000000000015, 1775.9500000000007, 10504.850000000024, 10.185386602695823, 64.25031540898846, 84.38714369292522], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 11015.576000000005, 8949, 25175, 10599.0, 12558.8, 13327.249999999998, 23149.890000000076, 0.21919134176664715, 0.1273497414583326, 0.11087999515148751], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.937999999999998, 2, 9, 3.0, 4.0, 5.0, 6.0, 0.21996837734607272, 0.11292927310019911, 0.07991038708275298], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 4.489999999999998, 2, 18, 4.0, 6.0, 7.0, 10.0, 0.2199671193150048, 0.1262095716932233, 0.09322825174092976], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 16.574000000000005, 10, 421, 14.0, 20.0, 25.0, 43.940000000000055, 0.21876352232022342, 0.1285470693508805, 2.435880548335144], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 45.232000000000006, 28, 93, 47.0, 57.0, 58.0, 62.0, 0.2199152622511494, 0.9146048110367113, 0.09191770726903509], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.602000000000001, 1, 8, 2.0, 3.0, 4.0, 7.0, 0.21992087247008527, 0.13740071947113427, 0.09342341750438192], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 40.056000000000026, 24, 69, 41.0, 50.0, 52.0, 56.0, 0.2199133277592635, 0.9025453435167132, 0.08031990681832477], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1108.9620000000007, 768, 1675, 1097.0, 1410.0, 1499.0, 1600.8300000000002, 0.21984438535027365, 0.929830110304722, 0.10734589128431332], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 6.547999999999989, 4, 27, 6.0, 8.0, 9.0, 15.0, 0.21982476449073857, 0.3268841475954028, 0.1127031263258181], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 4.2360000000000015, 2, 18, 4.0, 5.0, 6.0, 11.990000000000009, 0.21894409393927716, 0.21118483498512056, 0.12016267655651734], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 10.078000000000008, 6, 26, 10.0, 12.900000000000034, 14.0, 19.99000000000001, 0.21991207035778815, 0.3584309037374496, 0.14410253829108968], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 548.0, 548, 548, 548.0, 548.0, 548.0, 548.0, 1.8248175182481752, 0.8660755018248174, 2158.3795477874087], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.518000000000001, 3, 16, 4.0, 6.0, 7.0, 12.990000000000009, 0.2189454361699612, 0.21995249965078204, 0.12892978321336585], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 15.735999999999997, 7, 31, 16.0, 20.0, 20.0, 23.0, 0.2199108129706916, 0.34548117571687625, 0.13121631516122323], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 7.729999999999998, 5, 23, 7.0, 10.0, 11.0, 17.99000000000001, 0.2199108129706916, 0.3403270160378757, 0.12606215548222263], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2220.272000000003, 1596, 3634, 2182.5, 2903.7000000000003, 3094.0, 3391.6400000000003, 0.21967188050552652, 0.33542737727261546, 0.12142019957629689], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 13.844000000000003, 10, 85, 12.0, 18.0, 20.94999999999999, 41.97000000000003, 0.2187581624139351, 0.12854391983016492, 1.7641649464983162], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 14.552000000000007, 9, 35, 14.0, 17.0, 19.0, 25.99000000000001, 0.2199138113790443, 0.39810198368305494, 0.18383420169966988], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 9.968000000000016, 6, 27, 10.0, 12.0, 13.949999999999989, 19.980000000000018, 0.21991303758841604, 0.3722921557899144, 0.158062495766674], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 62.0, 62, 62, 62.0, 62.0, 62.0, 62.0, 16.129032258064516, 8.285030241935484, 2199.7542842741937], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 690.0, 690, 690, 690.0, 690.0, 690.0, 690.0, 1.4492753623188406, 0.7331295289855073, 2771.659873188406], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.7500000000000013, 2, 19, 3.0, 3.0, 4.0, 9.0, 0.21891754033008387, 0.18407031467207247, 0.09299719730818992], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 696.236, 527, 922, 690.5, 835.0, 856.0, 890.9200000000001, 0.21886608109776223, 0.19266627228822739, 0.1017385298852879], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.6379999999999963, 2, 13, 3.0, 5.0, 5.0, 10.0, 0.21894169713970188, 0.19835390806003206, 0.10733274605872103], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 938.6259999999992, 723, 1315, 897.5, 1149.9, 1172.9, 1205.0, 0.2188667517328775, 0.20704922956167557, 0.11605922479585204], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 60.0, 60, 60, 60.0, 60.0, 60.0, 60.0, 16.666666666666668, 8.59375, 1097.4772135416667], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 29.47199999999997, 20, 573, 27.0, 34.0, 39.0, 61.960000000000036, 0.21870429080322212, 0.12851226447188163, 10.004012676975512], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 36.70199999999999, 26, 264, 35.0, 44.0, 49.0, 121.76000000000022, 0.21882632935900953, 49.519376859476736, 0.06795583275016116], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 1025.0, 1025, 1025, 1025.0, 1025.0, 1025.0, 1025.0, 0.975609756097561, 0.5116234756097562, 0.40205792682926833], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.9840000000000013, 2, 15, 3.0, 4.0, 4.0, 7.990000000000009, 0.21993528624137634, 0.23895109727913658, 0.09471822385981148], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.756, 2, 13, 4.0, 5.0, 5.0, 9.990000000000009, 0.2199343188150291, 0.2257209110196331, 0.0814014715145469], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.0739999999999994, 1, 29, 2.0, 3.0, 3.0, 7.0, 0.21996915152618995, 0.1247195015246062, 0.08571063619038066], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 199.76199999999992, 90, 358, 193.0, 290.1000000000003, 307.95, 324.97, 0.2199512500049489, 0.20034251014855065, 0.07217150390787386], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 112.77999999999997, 81, 371, 110.0, 131.0, 144.0, 253.97000000000003, 0.21879540004550946, 0.12862776447987959, 64.72412361502512], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 271.8499999999998, 17, 563, 329.0, 445.0, 467.74999999999994, 504.98, 0.21993151332675007, 0.1226126777871371, 0.09256883031623953], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 499.1939999999995, 291, 1060, 466.0, 835.4000000000002, 911.8, 970.99, 0.21996266793599792, 0.11827160663042269, 0.09408559429293661], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 8.139999999999992, 5, 274, 7.0, 10.0, 13.0, 29.0, 0.2186801863505076, 0.10287151617861623, 0.1590983777647736], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 507.5999999999998, 277, 1110, 453.5, 873.4000000000002, 915.0, 987.0, 0.21990771792524985, 0.11311288487149253, 0.08890800314556], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 4.112000000000004, 2, 23, 4.0, 5.0, 7.0, 15.980000000000018, 0.21891629429005008, 0.13440904627255604, 0.10988571803231029], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.415999999999999, 2, 38, 4.0, 5.0, 6.0, 10.990000000000009, 0.21891284379167553, 0.12820724760772043, 0.10368430589742444], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 853.4260000000003, 568, 1458, 845.5, 1117.6000000000001, 1257.95, 1325.93, 0.21882020025549448, 0.1999533687315124, 0.09680229562083885], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 467.11199999999997, 248, 994, 387.0, 834.7, 894.95, 949.98, 0.2188255632022933, 0.19376106094838996, 0.09039376292438482], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 5.4319999999999995, 3, 48, 5.0, 6.0, 7.949999999999989, 12.0, 0.21894649079132952, 0.1460355988383575, 0.10284498249084913], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1171.6959999999997, 911, 9635, 1086.5, 1414.0, 1438.8, 1506.99, 0.21886244057884738, 0.164450331084157, 0.12140026000857941], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 169.85000000000005, 142, 281, 169.5, 189.0, 195.95, 227.99, 0.22003671972778818, 4.25440138075242, 0.1113076375185491], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 229.2599999999997, 194, 328, 224.0, 257.0, 262.95, 289.99, 0.22002093719238325, 0.4264431193897411, 0.15771032021407158], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 8.983999999999993, 6, 25, 9.0, 11.0, 12.0, 16.99000000000001, 0.219822638302512, 0.17946457580166017, 0.13610112566776622], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 8.716000000000005, 5, 33, 9.0, 11.0, 12.0, 17.99000000000001, 0.21982370139148402, 0.18280058143369016, 0.13953652920357873], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 10.047999999999993, 6, 31, 10.0, 12.0, 13.0, 19.0, 0.21982080208214264, 0.1778981414975512, 0.1345973075249057], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 12.170000000000003, 8, 38, 12.0, 15.0, 16.0, 23.99000000000001, 0.21982157522382234, 0.196575014304889, 0.15327402803692297], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 9.298000000000002, 6, 34, 9.0, 11.0, 12.0, 30.90000000000009, 0.2197885282696401, 0.16499378863882325, 0.12169931203992765], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1988.0540000000008, 1591, 2829, 1901.0, 2501.9000000000005, 2582.9, 2714.59, 0.21963463339465533, 0.18353862513880911, 0.14027446312510214], "isController": false}]}, function(index, item){
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
