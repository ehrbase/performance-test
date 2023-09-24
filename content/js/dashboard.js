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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8908742820676452, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.178, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.603, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.969, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.496, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.125, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 324.9255902999339, 1, 19881, 9.0, 840.0, 1507.9500000000007, 6047.960000000006, 15.262441925775379, 96.14206655768787, 126.2980093953625], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6190.831999999992, 5373, 19881, 6031.0, 6515.9, 6653.6, 17527.930000000095, 0.32931091033390814, 0.19125438621550633, 0.16594182591044587], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.366, 1, 11, 2.0, 3.0, 4.0, 6.990000000000009, 0.33046031138614224, 0.1696545803699305, 0.11940460470007092], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.6079999999999997, 2, 13, 3.0, 5.0, 5.0, 8.990000000000009, 0.3304581273202291, 0.18966166602282408, 0.13941202246322168], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 13.269999999999998, 8, 339, 11.0, 15.0, 17.94999999999999, 68.0, 0.3285954254259254, 0.170943426834614, 3.615512361595607], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 33.69199999999995, 24, 46, 34.0, 40.0, 41.0, 43.99000000000001, 0.3304033167206546, 1.37411319233537, 0.13745294230761607], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.266000000000002, 1, 10, 2.0, 3.0, 4.0, 6.0, 0.3304116135717231, 0.20641368488082715, 0.13971506706694933], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 29.74199999999999, 21, 42, 30.0, 35.900000000000034, 36.0, 39.0, 0.33040178839880024, 1.3560379883999236, 0.12002877469175166], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 858.046, 678, 1089, 857.5, 1016.0, 1062.0, 1084.0, 0.33025469902898513, 1.3967161402654455, 0.16061214855120567], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 5.431999999999995, 3, 23, 5.0, 7.0, 8.0, 11.990000000000009, 0.3304373801338404, 0.49136748349960946, 0.16876831036132667], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.7959999999999985, 2, 19, 4.0, 5.0, 5.0, 8.990000000000009, 0.32876027786818685, 0.31710919341131527, 0.17979077695916468], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 7.6919999999999975, 5, 21, 7.0, 10.0, 11.0, 16.0, 0.3303950202862543, 0.5384115959979251, 0.21585377790185947], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 456.0, 456, 456, 456.0, 456.0, 456.0, 456.0, 2.1929824561403506, 0.9487219024122807, 2593.8378049616226], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.089999999999994, 2, 16, 4.0, 5.0, 6.0, 10.990000000000009, 0.3287626557184319, 0.3302748355118243, 0.1929554258659937], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 7.917999999999997, 5, 17, 8.0, 10.0, 11.0, 14.0, 0.33039349204115115, 0.5190501118960159, 0.19649378579400495], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.4780000000000015, 4, 16, 6.0, 8.0, 8.0, 13.990000000000009, 0.3303924004461619, 0.5113048251084348, 0.1887495647080124], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1566.846, 1326, 1936, 1548.0, 1766.9, 1823.6999999999998, 1899.92, 0.33004563871092096, 0.5039996735436076, 0.18178294944624943], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 11.445999999999998, 7, 78, 11.0, 14.0, 16.0, 27.99000000000001, 0.3285809574191937, 0.17093590022146357, 2.6491839691922494], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 10.945999999999994, 8, 43, 11.0, 13.0, 14.0, 22.970000000000027, 0.33040026009108475, 0.5981115880209421, 0.27554865441190074], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 7.664, 5, 22, 7.0, 9.0, 10.949999999999989, 15.0, 0.3303976401678949, 0.5593883718119932, 0.2368279959797215], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 79.0, 79, 79, 79.0, 79.0, 79.0, 79.0, 12.658227848101266, 5.970628955696203, 1726.3647151898733], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 411.0, 411, 411, 411.0, 411.0, 411.0, 411.0, 2.4330900243309004, 1.1286306265206814, 4653.146859793188], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.315999999999998, 1, 16, 2.0, 3.0, 3.9499999999999886, 6.990000000000009, 0.3287898953659037, 0.2763601082425654, 0.13902932098968387], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 564.9380000000007, 445, 694, 555.0, 654.9000000000001, 665.0, 686.97, 0.32865784680468985, 0.289408268595954, 0.15213263611857714], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.2640000000000002, 2, 18, 3.0, 4.0, 5.0, 7.990000000000009, 0.3287676276982781, 0.29785255458200155, 0.16053106821204988], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 765.0200000000004, 608, 929, 742.5, 889.0, 902.95, 917.0, 0.32861680585779174, 0.3108734238305678, 0.17361493356354035], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 54.0, 54, 54, 54.0, 54.0, 54.0, 54.0, 18.51851851851852, 8.77097800925926, 1219.3829571759259], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 25.445999999999987, 17, 1227, 22.0, 27.0, 29.0, 58.99000000000001, 0.3283185951115988, 0.17079941289248024, 14.976329665686308], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 30.257999999999992, 19, 241, 29.0, 35.0, 38.94999999999999, 102.99000000000001, 0.3287107831600151, 74.34472006147385, 0.1014380932407859], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 484.0, 484, 484, 484.0, 484.0, 484.0, 484.0, 2.066115702479339, 1.0835001291322315, 0.8474302685950413], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.7379999999999987, 1, 20, 3.0, 4.0, 4.0, 7.990000000000009, 0.3304153254557914, 0.35903948905069694, 0.14165266394051995], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.400000000000001, 2, 10, 3.0, 4.0, 5.0, 8.990000000000009, 0.3304135786764293, 0.3390320812999131, 0.12164640543067758], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.8780000000000014, 1, 12, 2.0, 3.0, 3.0, 6.990000000000009, 0.3304616218395477, 0.18740465665863643, 0.12811842174834026], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 91.65599999999992, 67, 119, 91.0, 110.0, 114.0, 115.99000000000001, 0.3304437132092231, 0.3009845270970454, 0.10778144551941456], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 81.92200000000008, 59, 309, 80.0, 92.0, 99.0, 244.96000000000004, 0.32865201404527244, 0.1709728656270089, 97.1802180984063], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 212.01399999999995, 13, 370, 259.0, 335.0, 338.0, 345.0, 0.33040921180882526, 0.18414828249161586, 0.13842339049412697], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 423.872, 339, 548, 409.0, 496.0, 505.95, 524.99, 0.3303707883505974, 0.1776743133325757, 0.1406656872274028], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 7.223999999999999, 4, 261, 6.0, 8.0, 10.0, 28.99000000000001, 0.3282662160228053, 0.14801151816395453, 0.2381853501024847], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 397.1759999999999, 309, 494, 394.0, 457.0, 468.0, 486.96000000000004, 0.33034721474352835, 0.1699191225366834, 0.13291313718196648], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.4999999999999987, 2, 15, 3.0, 5.0, 5.0, 8.990000000000009, 0.32878773332421496, 0.20186732013502653, 0.16439386666210748], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.146000000000003, 2, 25, 4.0, 5.0, 6.0, 10.990000000000009, 0.32878319312922033, 0.19255328979641087, 0.1550803537904428], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 676.3940000000003, 537, 899, 679.5, 806.7, 838.95, 860.96, 0.3286273891211189, 0.30029290456496305, 0.1447372582945553], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 244.58399999999997, 175, 340, 238.0, 287.0, 290.95, 308.99, 0.3287138086096721, 0.29106259512155835, 0.1351450326412812], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.478000000000002, 3, 44, 4.0, 5.0, 6.0, 14.970000000000027, 0.3287650336030741, 0.21919060165151827, 0.15378754989831298], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 983.5139999999996, 804, 8901, 930.5, 1076.6000000000001, 1105.95, 1133.98, 0.3285712408164338, 0.24697711891486063, 0.18161261943564602], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 134.0400000000001, 117, 177, 132.0, 150.0, 151.0, 159.99, 0.33044174774605684, 6.388984702653645, 0.16651166195016145], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 181.94400000000007, 160, 258, 175.0, 203.0, 205.0, 217.0, 0.3304157621535178, 0.6404096360387777, 0.23619564247692873], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 6.862000000000002, 4, 15, 7.0, 9.0, 9.0, 13.0, 0.3304341045004464, 0.26967488815631646, 0.20393979887136926], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 6.782000000000001, 4, 17, 6.5, 9.0, 10.0, 13.0, 0.33043541474601085, 0.27483901083332507, 0.20910366089396], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.130000000000006, 6, 17, 8.0, 10.0, 11.0, 15.0, 0.3304297370902754, 0.2674125267813302, 0.20167830632951378], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 9.541999999999993, 6, 20, 9.0, 12.0, 12.0, 17.0, 0.3304312656707028, 0.2954875139524602, 0.22975298941166053], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 7.603999999999998, 5, 28, 7.0, 9.0, 10.0, 23.90000000000009, 0.33050268797836135, 0.2481061731209435, 0.18235744014431068], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1621.012, 1423, 1991, 1594.0, 1836.0, 1916.8, 1959.92, 0.3300994589669867, 0.27584903128187527, 0.2101805148891361], "isController": false}]}, function(index, item){
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
