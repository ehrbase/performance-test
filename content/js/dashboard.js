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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8715592427143161, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.484, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [0.5, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [0.999, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.814, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.834, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [0.846, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.489, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 483.091895341416, 1, 25778, 12.0, 1009.0, 1783.0, 10485.980000000003, 10.232164125566785, 64.54537981318192, 84.77470105310103], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 11024.721999999987, 9036, 25778, 10576.0, 12700.800000000001, 13073.5, 23217.11000000008, 0.22024530040577994, 0.12797456420062409, 0.1114131500099551], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.9520000000000004, 1, 22, 3.0, 4.0, 4.0, 7.990000000000009, 0.22106756178396217, 0.11349358193891285, 0.08030970017933], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 4.446000000000008, 2, 17, 4.0, 5.900000000000034, 6.0, 10.0, 0.2210659979272852, 0.1268150278344198, 0.09369398740277517], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 15.952000000000002, 10, 411, 14.0, 18.0, 21.0, 46.97000000000003, 0.2198327863893608, 0.1291753768538499, 2.4477865531362224], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 44.57800000000002, 27, 110, 46.0, 56.0, 58.0, 71.96000000000004, 0.2210112768793915, 0.9191630224209311, 0.09237580713318316], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.6180000000000034, 1, 10, 2.0, 3.0, 4.0, 8.0, 0.22101645467505054, 0.13808521013139427, 0.09388882596059277], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 38.99399999999998, 24, 88, 40.0, 50.0, 51.0, 58.98000000000002, 0.22100981150957213, 0.9070579358987564, 0.08072038037556639], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1092.1239999999991, 768, 1558, 1085.5, 1383.1000000000004, 1477.0, 1541.98, 0.22093764167626273, 0.9344540293944277, 0.10787970784973766], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 6.5379999999999985, 4, 23, 6.0, 8.0, 9.0, 15.0, 0.2209136280733504, 0.32850331113630016, 0.11326138158057515], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 4.286, 3, 19, 4.0, 5.0, 6.0, 12.0, 0.2200018656158204, 0.212205119811916, 0.12074321140243269], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 10.067999999999993, 6, 30, 10.0, 12.0, 13.0, 18.99000000000001, 0.22100902998694721, 0.36021881938302236, 0.14482134679808747], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 629.0, 629, 629, 629.0, 629.0, 629.0, 629.0, 1.589825119236884, 0.7545459062003179, 1880.4324200119236], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.602000000000001, 3, 24, 4.0, 6.0, 7.0, 13.990000000000009, 0.22000293043903346, 0.2210148579804083, 0.12955250688939177], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 15.594000000000005, 7, 42, 16.0, 19.0, 20.0, 24.980000000000018, 0.2210082484698494, 0.34721777136166276, 0.13187113263191208], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 7.636000000000008, 5, 19, 7.0, 9.0, 10.0, 15.0, 0.22100834615918435, 0.342025523673751, 0.12669130780804805], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2152.714000000001, 1587, 3301, 2075.5, 2768.7000000000003, 3018.0, 3256.6900000000005, 0.22075600986161245, 0.3371077931452168, 0.12201943513835221], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 13.756000000000009, 9, 80, 12.0, 17.0, 21.0, 41.930000000000064, 0.21982795385019868, 0.12917253721797173, 1.7727922293895906], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 14.401999999999992, 9, 34, 14.0, 17.0, 19.0, 26.99000000000001, 0.22101098380387307, 0.40008815506550544, 0.18475136927355015], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 9.962, 6, 26, 10.0, 12.0, 14.0, 20.0, 0.22101020227295734, 0.3741245164296774, 0.15885108288368807], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 58.0, 58, 58, 58.0, 58.0, 58.0, 58.0, 17.241379310344826, 8.856411637931034, 2351.4614762931033], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 687.0, 687, 687, 687.0, 687.0, 687.0, 687.0, 1.455604075691412, 0.7363309679767103, 2783.7631914119356], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.6860000000000035, 2, 17, 3.0, 3.0, 4.0, 7.990000000000009, 0.21998531378045202, 0.18496812027829024, 0.09345079247509437], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 685.0180000000012, 520, 958, 661.5, 823.9000000000001, 844.95, 868.98, 0.2199325774690511, 0.19360510154507035, 0.10223428405787922], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.653999999999999, 2, 20, 3.0, 5.0, 5.0, 10.990000000000009, 0.2200018656158204, 0.199314385498489, 0.10785247708900571], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 935.9119999999998, 751, 1292, 892.5, 1132.7, 1160.0, 1198.95, 0.219928224224742, 0.20805338875854476, 0.11662209546292472], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 70.0, 70, 70, 70.0, 70.0, 70.0, 70.0, 14.285714285714285, 7.366071428571428, 940.6947544642857], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 29.326000000000015, 20, 512, 27.0, 34.900000000000034, 38.0, 70.94000000000005, 0.2197794469294174, 0.12914403419130835, 10.053192670091711], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 36.20000000000004, 26, 251, 34.0, 42.900000000000034, 51.0, 99.87000000000012, 0.2198946616612778, 49.76113547253824, 0.06828760000809213], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 997.0, 997, 997, 997.0, 997.0, 997.0, 997.0, 1.0030090270812437, 0.5259920386158475, 0.41334942326980945], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 3.030000000000003, 2, 11, 3.0, 4.0, 4.0, 8.0, 0.2210327712027896, 0.24011843295059296, 0.09519087119182638], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.9, 2, 22, 4.0, 5.0, 5.0, 8.990000000000009, 0.22103169638732534, 0.226859680569413, 0.08180762981523076], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.005999999999996, 1, 14, 2.0, 3.0, 3.9499999999999886, 6.0, 0.22106824597821592, 0.12535519449584281, 0.08613889662627751], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 201.15200000000004, 89, 345, 211.0, 298.0, 312.0, 329.98, 0.22104830833940112, 0.20134176530394804, 0.07253147617386599], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 113.45400000000008, 80, 373, 112.0, 134.0, 141.0, 301.7900000000002, 0.2198640097127125, 0.12925599008501262, 65.04024006071765], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 267.77000000000015, 17, 503, 338.0, 441.0, 455.74999999999994, 484.98, 0.2210288628330242, 0.12319941599753861, 0.0930307030088217], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 499.30000000000024, 298, 1000, 470.0, 795.7, 883.6999999999999, 947.98, 0.22106883243380426, 0.11887890109115154, 0.094558738873053], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 8.180000000000003, 5, 249, 7.0, 10.0, 14.0, 24.99000000000001, 0.21975722979310294, 0.10337817887073793, 0.1598819689412712], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 509.9180000000007, 269, 1007, 457.0, 864.8000000000001, 894.0, 978.99, 0.22100375485379498, 0.11367664816312728, 0.08935112745065538], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.8340000000000014, 2, 15, 4.0, 5.0, 6.0, 10.0, 0.2199839587697265, 0.13506456515440893, 0.11042163555433537], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.413999999999997, 2, 35, 4.0, 5.0, 6.0, 11.0, 0.21998076488191873, 0.1288326801829448, 0.1041901083669244], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 842.1980000000004, 582, 1339, 838.5, 1104.9, 1231.6499999999999, 1296.8600000000001, 0.21989079343634776, 0.2009316546155517, 0.09727590764322806], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 466.9140000000001, 241, 1017, 381.0, 852.7, 889.95, 949.98, 0.21989330776707142, 0.19470650496629036, 0.09083483318893673], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 5.620000000000005, 3, 52, 5.0, 6.0, 8.0, 14.990000000000009, 0.22000409207611263, 0.14674101063279776, 0.10334176590684586], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1183.7199999999982, 897, 10169, 1102.0, 1413.9, 1434.0, 1637.8300000000002, 0.2199133277592635, 0.1652399537544263, 0.12198317399146648], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 170.18600000000015, 142, 271, 172.0, 189.0, 191.95, 225.98000000000002, 0.22113394835107048, 4.275616253323091, 0.1118626809041548], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 231.50799999999987, 196, 330, 231.0, 258.0, 262.95, 297.93000000000006, 0.2211150744759794, 0.4285637690070518, 0.15849459439977429], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 9.054000000000016, 6, 25, 9.0, 11.0, 12.0, 18.99000000000001, 0.2209110903552869, 0.18035319486037096, 0.1367750305520038], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 8.832000000000003, 6, 24, 9.0, 11.0, 12.0, 18.980000000000018, 0.22091216399812139, 0.18368069792117236, 0.14022744785037], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 10.062, 6, 34, 10.0, 12.0, 13.0, 20.0, 0.22090855269552617, 0.17877844404717722, 0.13526334232431142], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 12.056, 8, 26, 12.0, 15.0, 15.0, 22.99000000000001, 0.22090952871161146, 0.19756042704020996, 0.1540326206055572], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 9.557999999999995, 6, 37, 9.0, 11.0, 13.0, 33.99000000000001, 0.22090054968892783, 0.16582857573376536, 0.12231505046252157], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1979.8620000000008, 1624, 2962, 1911.5, 2451.1000000000004, 2570.9, 2631.88, 0.220737882593935, 0.18446056007271106, 0.14097907735979834], "isController": false}]}, function(index, item){
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
