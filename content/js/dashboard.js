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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8918102531376303, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.207, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.616, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [0.5, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.979, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.997, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.497, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.122, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 323.71912359072434, 1, 18323, 9.0, 838.0, 1499.0, 6036.990000000002, 15.295156501238644, 96.34814412423272, 126.56872529910312], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6189.61, 5381, 18323, 6031.5, 6538.8, 6717.9, 15181.370000000072, 0.3297913739768223, 0.1915334257985898, 0.16618393454300812], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.3359999999999994, 1, 9, 2.0, 3.0, 4.0, 6.0, 0.3309334042854552, 0.1698974609051823, 0.1195755464703305], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.635999999999998, 2, 13, 3.0, 5.0, 5.0, 7.990000000000009, 0.3309312139615908, 0.18993318726305325, 0.13961160589004612], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 12.978000000000003, 8, 336, 11.0, 15.0, 18.0, 33.99000000000001, 0.329081165895081, 0.1711961209804381, 3.6208569298240993], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 34.02200000000002, 24, 52, 34.0, 40.0, 42.0, 45.0, 0.3308510680534179, 1.3759753437790736, 0.1376392138581602], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.2479999999999998, 1, 10, 2.0, 3.0, 3.0, 6.0, 0.3308589495360696, 0.20669314317160065, 0.13990422377843567], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 30.133999999999997, 21, 67, 30.0, 35.0, 37.0, 48.950000000000045, 0.3308462517766444, 1.3578621589884972, 0.12019023990323409], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 851.6879999999999, 662, 1084, 863.0, 1004.9000000000001, 1047.9, 1073.95, 0.33070685945553746, 1.3986284212037994, 0.16083204688365005], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 5.558000000000001, 4, 17, 5.0, 7.0, 9.0, 11.990000000000009, 0.33080750774254974, 0.4919178712057206, 0.16895735014585303], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.8320000000000007, 2, 15, 4.0, 5.0, 5.0, 10.0, 0.32923544943931204, 0.3175675251618192, 0.18005063641212377], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 7.5259999999999945, 5, 37, 7.0, 9.0, 10.0, 14.0, 0.3308510680534179, 0.5391547712611514, 0.21615172317161777], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 554.0, 554, 554, 554.0, 554.0, 554.0, 554.0, 1.8050541516245489, 0.7808974503610108, 2135.000070509928], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.041999999999998, 2, 19, 4.0, 5.0, 6.0, 9.0, 0.32923783416817076, 0.33075219959681534, 0.1932343147803424], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 7.9460000000000015, 5, 37, 8.0, 9.0, 10.0, 16.99000000000001, 0.33084887881931946, 0.5197655271928002, 0.19676461640719292], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.5299999999999985, 4, 17, 6.0, 8.0, 9.0, 15.980000000000018, 0.330846908533402, 0.5120082074433276, 0.18900922020707048], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1560.8960000000006, 1323, 1984, 1534.5, 1756.9, 1828.75, 1900.98, 0.3305112082960957, 0.504710626488953, 0.182039376444334], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 11.857999999999999, 8, 51, 11.0, 15.0, 19.0, 36.99000000000001, 0.3290729357254742, 0.17119183944366928, 2.6531505442866354], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 10.909999999999997, 8, 32, 11.0, 13.0, 15.0, 20.0, 0.3308528194615569, 0.5989308398086743, 0.27592608185563433], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 7.590000000000004, 5, 21, 7.0, 9.0, 11.0, 14.0, 0.3308526005345255, 0.5601586543678829, 0.23715411014877116], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 51.0, 51, 51, 51.0, 51.0, 51.0, 51.0, 19.607843137254903, 9.248621323529413, 2674.1727941176473], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 597.0, 597, 597, 597.0, 597.0, 597.0, 597.0, 1.6750418760469012, 0.7769969639865997, 3203.422712520938], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.348, 1, 26, 2.0, 3.0, 4.0, 6.990000000000009, 0.3292720913585174, 0.27676541186834913, 0.1392332183185918], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 555.8459999999999, 416, 686, 545.5, 640.9000000000001, 652.95, 669.99, 0.3291728084826516, 0.28986173157899586, 0.1523710070515399], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.236, 2, 15, 3.0, 4.0, 5.0, 8.0, 0.32928228316432373, 0.2983188153460691, 0.16078236482632993], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 756.354, 601, 921, 735.5, 872.9000000000001, 894.0, 914.96, 0.3290909126809918, 0.3113219316632847, 0.1738654138285318], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 88.0, 88, 88, 88.0, 88.0, 88.0, 88.0, 11.363636363636363, 5.382191051136364, 748.257723721591], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 23.15199999999999, 16, 611, 21.0, 26.0, 32.89999999999998, 56.960000000000036, 0.32894260740962955, 0.17112403944646853, 15.004794132913867], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 30.116000000000028, 20, 234, 28.0, 35.0, 40.0, 120.92000000000007, 0.32919274696204476, 74.45372611109958, 0.1015868242578185], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 536.0, 536, 536, 536.0, 536.0, 536.0, 536.0, 1.8656716417910448, 0.9783844449626865, 0.7652168843283582], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.6200000000000006, 1, 10, 2.0, 3.0, 4.0, 6.990000000000009, 0.3308858807685817, 0.3595508089746177, 0.14185439614981188], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.376, 2, 19, 3.0, 4.0, 5.0, 8.0, 0.3308850048871715, 0.33951580418457034, 0.12181996761959343], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.8120000000000007, 1, 10, 2.0, 3.0, 3.0, 6.990000000000009, 0.33093449945826026, 0.18767282537149052, 0.12830175418450127], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 91.17200000000007, 64, 119, 89.0, 111.0, 114.0, 117.0, 0.33091719657540414, 0.30141579923617695, 0.10793588247674314], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 82.27600000000001, 58, 367, 80.0, 92.0, 102.94999999999999, 289.82000000000016, 0.3291387886112713, 0.1712260977354593, 97.3241541050848], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 211.65400000000008, 12, 364, 260.0, 333.0, 336.0, 343.0, 0.33088084451379707, 0.18441113942623938, 0.13862097880509663], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 417.89, 301, 550, 409.0, 489.80000000000007, 499.0, 519.96, 0.330846908533402, 0.17793037206877912, 0.14086841027398755], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 7.257999999999999, 4, 283, 6.0, 8.0, 10.949999999999989, 24.0, 0.32888526968921, 0.14829064244941909, 0.23863452673738578], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 394.2460000000002, 299, 518, 393.0, 456.0, 470.0, 491.99, 0.3308215158374184, 0.1701630865300065, 0.13310396926271134], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.5160000000000013, 2, 19, 3.0, 4.0, 5.0, 9.0, 0.3292684051160408, 0.20216244041065037, 0.1646342025580204], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.189999999999998, 2, 39, 4.0, 5.0, 6.0, 9.990000000000009, 0.32926038240300814, 0.19283275774502734, 0.15530543427798135], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 671.6200000000003, 546, 971, 674.0, 794.8000000000001, 832.9, 860.0, 0.3291071586072712, 0.30073130798868136, 0.1449485630194134], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 244.04600000000002, 168, 471, 238.0, 285.0, 289.0, 301.99, 0.32918927922690555, 0.2914836048513941, 0.1353405142134055], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.484000000000004, 3, 35, 4.0, 5.0, 7.0, 9.0, 0.32923913494392726, 0.21950668927496933, 0.15400932191224723], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 978.2319999999999, 820, 8039, 930.5, 1081.8000000000002, 1115.0, 1201.3300000000006, 0.3290287597458319, 0.24732102213277757, 0.18186550587513753], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 133.9820000000002, 118, 172, 134.0, 149.0, 151.0, 158.99, 0.3309375659806772, 6.3985711884348575, 0.16676150785745064], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 180.77199999999993, 159, 244, 176.0, 202.0, 203.0, 217.96000000000004, 0.33091303539247274, 0.6413734477283151, 0.23655111514383798], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 7.024000000000001, 5, 21, 7.0, 9.0, 10.0, 16.980000000000018, 0.33080181729286345, 0.2699749870408388, 0.20416674661043918], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 6.849999999999998, 5, 20, 7.0, 8.0, 10.0, 13.0, 0.3308048813568293, 0.2751463139652589, 0.20933746398361855], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.258000000000008, 6, 20, 8.0, 10.0, 11.0, 16.99000000000001, 0.3307967835967137, 0.2677095727875319, 0.2019023337382286], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 9.498000000000014, 7, 21, 9.0, 11.0, 12.0, 17.99000000000001, 0.3307989721414337, 0.2958163347457347, 0.23000866031709066], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 7.610000000000003, 5, 24, 7.0, 9.0, 10.0, 13.990000000000009, 0.33077730682439893, 0.24831232766502317, 0.1825089632380717], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1617.605999999999, 1430, 2068, 1590.0, 1825.0, 1869.6, 1956.92, 0.3304668637571042, 0.27615605467342935, 0.2104144484078437], "isController": false}]}, function(index, item){
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
