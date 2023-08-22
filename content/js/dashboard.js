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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8930014890448841, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.243, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.648, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.979, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.496, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.105, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 322.7703467347392, 1, 18373, 9.0, 837.9000000000015, 1498.0, 6023.990000000002, 15.333571224943913, 96.59012839786523, 126.88661041598304], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6166.015999999998, 5000, 18373, 6013.0, 6501.7, 6623.05, 16024.83000000008, 0.33075433155872613, 0.19209268410282226, 0.16666917488701433], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.285999999999997, 1, 13, 2.0, 3.0, 4.0, 7.0, 0.3318501842432223, 0.17036812535010196, 0.11990680485350806], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.600000000000001, 2, 15, 3.0, 4.0, 5.0, 7.0, 0.33184732102976205, 0.19045897367422016, 0.13999808855943086], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 13.411999999999992, 8, 398, 11.0, 15.0, 19.0, 38.98000000000002, 0.3298318385354411, 0.17158663936153792, 3.629116528104311], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 33.72200000000002, 24, 56, 34.0, 40.0, 42.0, 44.99000000000001, 0.33178676462781487, 1.379866808972775, 0.1380284782533683], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.295999999999999, 1, 10, 2.0, 3.0, 4.0, 5.990000000000009, 0.33179579163489725, 0.2072784041667579, 0.1403003689237407], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 29.78599999999998, 21, 61, 30.0, 35.0, 36.0, 44.0, 0.331790727643609, 1.3617384853272188, 0.12053335027677983], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 851.3280000000002, 674, 1088, 858.0, 1014.8000000000001, 1054.0, 1073.0, 0.33163602018204164, 1.4025580360962595, 0.1612839238775945], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 5.577999999999998, 3, 28, 5.0, 8.0, 9.0, 12.0, 0.33175572427914457, 0.4933278895674768, 0.16944164433397715], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.8599999999999977, 2, 18, 4.0, 5.0, 5.0, 10.990000000000009, 0.3299778980803865, 0.3182836618290807, 0.1804566630127114], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 7.495999999999993, 5, 22, 7.0, 9.0, 11.0, 13.0, 0.3317975530594057, 0.5406971628571884, 0.21677008105150627], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 476.0, 476, 476, 476.0, 476.0, 476.0, 476.0, 2.100840336134454, 0.9088596376050421, 2484.8530232405465], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 3.9160000000000026, 2, 16, 4.0, 5.0, 6.0, 9.990000000000009, 0.3299798580294659, 0.3314976364780194, 0.19366981901924707], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 7.75, 5, 19, 7.0, 9.0, 10.0, 15.0, 0.33179711270152523, 0.5212552081778035, 0.1973285562844032], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.59, 4, 24, 6.0, 8.0, 9.0, 12.0, 0.33179579163489725, 0.5134766689079472, 0.18955130674454576], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1538.4019999999994, 1303, 1917, 1505.0, 1735.8000000000002, 1803.0, 1879.0, 0.3314654152300403, 0.5061677582513343, 0.18256493573217064], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 11.595999999999991, 8, 66, 10.0, 14.0, 16.94999999999999, 34.0, 0.329820959990079, 0.17158098007452635, 2.659181489920012], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 10.973999999999998, 8, 33, 11.0, 13.0, 15.0, 21.99000000000001, 0.3318004154141201, 0.6006462383372154, 0.2767163620738853], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 7.63999999999999, 5, 20, 7.0, 10.0, 11.0, 14.0, 0.33180085578076723, 0.5617641227301503, 0.23783381654597963], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 50.0, 50, 50, 50.0, 50.0, 50.0, 50.0, 20.0, 9.43359375, 2727.65625], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 432.0, 432, 432, 432.0, 432.0, 432.0, 432.0, 2.314814814814815, 1.0737666377314814, 4426.952220775463], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.2220000000000018, 1, 18, 2.0, 3.0, 3.0, 6.0, 0.3300110025668256, 0.27738649415946526, 0.1395456680775737], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 555.8619999999984, 415, 729, 551.5, 640.0, 651.0, 679.0, 0.32986991909610364, 0.2904755905743629, 0.15269369301909486], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.3000000000000016, 2, 16, 3.0, 4.0, 5.0, 9.0, 0.3299833424408736, 0.29895395177326445, 0.1611246789262078], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 753.5919999999996, 625, 927, 732.0, 871.8000000000001, 884.95, 911.99, 0.32984010670987135, 0.31203067360441356, 0.17426122825199256], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 50.0, 50, 50, 50.0, 50.0, 50.0, 50.0, 20.0, 9.47265625, 1316.93359375], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 25.68199999999997, 17, 949, 22.0, 28.0, 34.94999999999999, 82.95000000000005, 0.32961722869700333, 0.1714749940421686, 15.035567141051782], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 31.12800000000003, 21, 258, 29.0, 36.0, 41.0, 98.98000000000002, 0.3299635258318545, 74.62805364229413, 0.10182468179967387], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 475.0, 475, 475, 475.0, 475.0, 475.0, 475.0, 2.1052631578947367, 1.104029605263158, 0.8634868421052632], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.6380000000000012, 1, 12, 2.0, 3.0, 4.0, 8.980000000000018, 0.331797993418455, 0.36054193872719636, 0.14224542881904467], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.3920000000000012, 1, 16, 3.0, 4.0, 5.0, 8.990000000000009, 0.33179645216689624, 0.340451025640898, 0.12215552975285145], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.7260000000000006, 1, 12, 2.0, 2.0, 3.0, 5.990000000000009, 0.3318517259940121, 0.18819298418162378, 0.1286573586129129], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 92.31799999999997, 66, 127, 92.0, 111.0, 114.0, 116.99000000000001, 0.3318297023421204, 0.30224695475734287, 0.1082335161936213], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 83.89399999999996, 59, 358, 81.0, 95.0, 105.0, 300.98, 0.3299006075449588, 0.1716224146926514, 97.54941890482236], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 212.15999999999997, 12, 365, 261.0, 334.0, 337.0, 342.99, 0.33179270918700837, 0.18491935259777104, 0.13900300023557283], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 414.94000000000017, 316, 526, 399.5, 487.90000000000003, 499.0, 517.99, 0.3317473597886371, 0.17841463721601597, 0.14125180553500563], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 7.168000000000006, 4, 292, 6.0, 8.0, 10.949999999999989, 25.0, 0.32955748339359836, 0.14859373599380696, 0.2391222755482848], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 390.4760000000002, 301, 494, 394.0, 454.0, 466.0, 482.99, 0.33173349327310825, 0.1706321760174598, 0.13347089768410214], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.311999999999999, 2, 18, 3.0, 4.0, 5.0, 8.0, 0.3300083888132436, 0.20261677161208438, 0.1650041944066218], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.1679999999999975, 2, 28, 4.0, 5.0, 5.0, 11.990000000000009, 0.33000294362625715, 0.1932676419161159, 0.1556556853237131], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 671.7799999999999, 532, 869, 678.5, 796.0, 833.8499999999999, 850.99, 0.32985055131221147, 0.3014106048519037, 0.14527597523614003], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 241.15799999999993, 175, 329, 234.0, 282.0, 288.0, 300.97, 0.3299604773340249, 0.2921664691440759, 0.13565757906018017], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.534, 3, 43, 4.0, 6.0, 7.0, 11.990000000000009, 0.32998225355440386, 0.22000213312903033, 0.15435693305914008], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 983.1540000000001, 819, 8737, 930.0, 1073.0, 1104.0, 1167.97, 0.3298072540445912, 0.24790619288150617, 0.18229580643480336], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 133.99400000000014, 117, 161, 134.5, 149.0, 150.0, 155.97000000000003, 0.33182155433179766, 6.415662818324712, 0.1672069551125074], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 181.23599999999976, 159, 218, 178.0, 201.0, 203.0, 212.95000000000005, 0.3317997548663411, 0.6430920815241952, 0.23718498101773602], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 6.842000000000003, 5, 19, 7.0, 9.0, 10.0, 15.990000000000009, 0.33175154198116713, 0.27075007924714956, 0.20475290481650157], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 6.8919999999999995, 5, 18, 7.0, 9.0, 10.949999999999989, 13.0, 0.3317537431774843, 0.2759355279313429, 0.20993791560450176], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.137999999999998, 6, 17, 8.0, 10.0, 10.0, 13.990000000000009, 0.3317473597886371, 0.26847886184613423, 0.20248251940224432], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 9.439999999999989, 7, 23, 9.0, 11.900000000000034, 13.0, 17.0, 0.3317491206989556, 0.29666600323753967, 0.23066931048599257], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 7.7239999999999975, 5, 28, 7.0, 9.0, 11.0, 15.0, 0.33171720710034047, 0.2490179045606472, 0.18302756055829333], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1621.3500000000006, 1386, 2005, 1596.0, 1817.7, 1884.9, 1956.0, 0.33140214258113226, 0.27693762444150455, 0.2110099579715803], "isController": false}]}, function(index, item){
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
