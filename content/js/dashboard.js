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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8897894065092533, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.18, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.605, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.939, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.996, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.496, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.105, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 327.0522016592193, 1, 23465, 9.0, 848.0, 1511.9500000000007, 6022.990000000002, 15.151104957418337, 95.4407444718691, 125.37668648098263], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6233.792000000001, 5185, 23465, 6019.5, 6505.8, 6672.349999999999, 23155.34000000015, 0.32727546448570294, 0.19009079439573492, 0.16491615202599874], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.402000000000001, 1, 14, 2.0, 3.0, 4.0, 6.990000000000009, 0.32842534497798237, 0.1686098516683351, 0.11866931410337254], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.624, 2, 13, 4.0, 4.0, 5.0, 7.0, 0.3284227562814136, 0.18849349423256798, 0.13855335030622137], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 12.787999999999986, 8, 333, 11.0, 15.0, 19.0, 65.95000000000005, 0.3260075099089983, 0.16959712949572506, 3.587037709125667], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 34.37800000000001, 24, 85, 34.0, 41.0, 42.0, 63.850000000000136, 0.3283554644916401, 1.365596386899602, 0.13660100378265494], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.3260000000000005, 1, 23, 2.0, 3.0, 3.0, 6.0, 0.32837012830077655, 0.2051383347414939, 0.13885182183030884], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 30.109999999999992, 22, 71, 30.0, 35.0, 37.0, 39.0, 0.32836063980413943, 1.3476606879992725, 0.11928726367884754], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 862.5259999999996, 667, 1115, 860.5, 1013.6000000000001, 1057.95, 1082.0, 0.3282185935833265, 1.3881050248215312, 0.1596219332075162], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 5.6599999999999975, 3, 39, 5.0, 7.0, 8.0, 12.0, 0.3283114809211632, 0.48820622569674266, 0.16768252394703942], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.9219999999999966, 2, 26, 4.0, 5.0, 6.0, 9.990000000000009, 0.32614913756383557, 0.3145905904913828, 0.17836280960522258], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 7.728000000000002, 5, 17, 8.0, 9.0, 10.0, 14.990000000000009, 0.32835891468184647, 0.535093559100336, 0.2145235487521048], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 441.0, 441, 441, 441.0, 441.0, 441.0, 441.0, 2.2675736961451247, 0.9809913548752834, 2682.0635806405894], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.117999999999994, 3, 19, 4.0, 5.0, 6.0, 9.990000000000009, 0.3261542435602475, 0.3276544256766233, 0.19142451208955935], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 7.992000000000005, 5, 22, 8.0, 9.0, 11.0, 14.0, 0.32835762085202236, 0.5158517463289618, 0.19528299912000158], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.6339999999999995, 4, 29, 6.0, 8.0, 9.0, 11.0, 0.3283533081595797, 0.5081491904038745, 0.1875846535872599], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1571.5120000000006, 1339, 1937, 1549.5, 1754.9, 1842.6, 1912.91, 0.32801317825744963, 0.500895983372028, 0.18066350833711095], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 10.850000000000009, 7, 60, 10.0, 14.0, 17.0, 33.950000000000045, 0.32599900765902073, 0.16959270641605168, 2.6283669992508543], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 11.073999999999996, 8, 43, 11.0, 13.0, 14.0, 19.0, 0.32836214930101554, 0.5944220700984233, 0.27384890185846406], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 7.747999999999998, 5, 18, 7.0, 10.0, 11.0, 13.990000000000009, 0.32836063980413943, 0.5559395750340183, 0.23536788048460777], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 55.0, 55, 55, 55.0, 55.0, 55.0, 55.0, 18.18181818181818, 8.575994318181818, 2479.6875], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 572.0, 572, 572, 572.0, 572.0, 572.0, 572.0, 1.7482517482517483, 0.8109566215034966, 3343.4324464597903], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.3119999999999985, 1, 25, 2.0, 3.0, 4.0, 6.0, 0.32618956441297947, 0.2741744335799761, 0.13792976698322276], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 564.4619999999998, 437, 701, 551.0, 659.0, 670.95, 689.0, 0.3260547054584818, 0.2871160043544606, 0.15092766639386757], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.3439999999999994, 2, 20, 3.0, 4.0, 5.0, 9.0, 0.3261619028546342, 0.29549185439186787, 0.15925874162823936], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 775.5259999999997, 600, 993, 761.5, 897.9000000000001, 910.95, 931.0, 0.32601176120029707, 0.3084090363206443, 0.17223863555601632], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 71.0, 71, 71, 71.0, 71.0, 71.0, 71.0, 14.084507042253522, 6.670884683098592, 927.4180237676057], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 22.48399999999999, 15, 673, 20.0, 24.0, 31.0, 68.97000000000003, 0.3258577226976848, 0.16951920650223018, 14.864076393758651], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 29.859999999999978, 21, 254, 28.0, 35.0, 40.0, 91.0, 0.32613020422273387, 73.76106893556808, 0.10064174270935927], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 486.0, 486, 486, 486.0, 486.0, 486.0, 486.0, 2.05761316872428, 1.0790412808641976, 0.8439429012345679], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.6380000000000003, 1, 7, 3.0, 3.0, 4.0, 5.0, 0.3283729318251821, 0.3568201611046859, 0.1407770674523974], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.389999999999999, 2, 12, 3.0, 4.0, 5.0, 7.990000000000009, 0.32837206919718936, 0.3369373211193153, 0.12089479500716836], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.8499999999999992, 1, 9, 2.0, 3.0, 3.0, 6.0, 0.328425992158501, 0.18625025186168273, 0.1273292176630126], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 91.64999999999999, 66, 122, 90.0, 111.0, 113.0, 116.99000000000001, 0.3284035580555094, 0.29912625257222086, 0.10711600428763685], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 82.02799999999998, 57, 348, 80.0, 92.90000000000003, 103.0, 321.99, 0.3260621474453031, 0.16962555328670645, 96.41441174312824], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 209.048, 12, 364, 260.0, 334.0, 337.0, 341.0, 0.3283681874273075, 0.18301075024085806, 0.13756831289679192], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 434.9780000000001, 346, 554, 422.5, 503.0, 514.0, 539.97, 0.3283179483542734, 0.1765702903693183, 0.139791626447718], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 7.400000000000008, 4, 290, 6.0, 8.0, 11.0, 30.980000000000018, 0.32579954466255634, 0.1468993239903798, 0.2363955680510541], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 407.9, 308, 532, 403.0, 473.90000000000003, 483.0, 499.99, 0.3283069538695899, 0.16886968327407395, 0.13209225097096783], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.5539999999999985, 2, 18, 3.0, 5.0, 6.0, 10.990000000000009, 0.3261874364342233, 0.2002708038677349, 0.16309371821711166], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.196000000000005, 2, 41, 4.0, 5.0, 5.0, 10.0, 0.32617935036815865, 0.19102833809500824, 0.15385217405060608], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 675.9499999999996, 526, 866, 680.5, 803.0, 839.0, 853.0, 0.3260283422958525, 0.2979179493844259, 0.14359256091350533], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 246.45600000000007, 178, 309, 239.0, 291.0, 295.0, 307.99, 0.32612041931259034, 0.2887662552684754, 0.1340788052056646], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.499999999999998, 3, 58, 4.0, 5.0, 6.0, 10.990000000000009, 0.32615743488919124, 0.2174520921613279, 0.15256778448429945], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1003.2779999999998, 818, 11114, 926.0, 1077.9, 1101.95, 1139.95, 0.3259571405475037, 0.2450121783699405, 0.1801677163573116], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 134.8879999999999, 117, 175, 138.0, 150.0, 151.0, 156.0, 0.32839579311853184, 6.349426829271295, 0.16548069262613516], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 182.01200000000006, 157, 235, 179.0, 203.90000000000003, 205.0, 211.0, 0.3283699126470358, 0.6364443841110337, 0.23473317974377952], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 7.022000000000002, 5, 27, 7.0, 9.0, 10.0, 13.0, 0.3283084628729092, 0.2679401030346864, 0.2026278794293736], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 6.912000000000002, 5, 19, 7.0, 9.0, 9.949999999999989, 12.990000000000009, 0.3283097563153665, 0.27307099858531325, 0.20775851766831785], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.418000000000005, 6, 24, 8.0, 10.0, 11.949999999999989, 17.980000000000018, 0.32830393590456597, 0.26569214328464147, 0.2003808202542517], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 9.648000000000001, 7, 21, 9.0, 12.0, 13.0, 16.0, 0.328305876018569, 0.2935868884071912, 0.22827517941916123], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 7.780000000000003, 5, 23, 8.0, 9.0, 10.0, 15.980000000000018, 0.3283345492656141, 0.2464785657870803, 0.18116115267096872], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1618.8060000000005, 1398, 1956, 1587.5, 1797.8000000000002, 1855.95, 1936.94, 0.32796821069727355, 0.274068044507582, 0.20882350915490464], "isController": false}]}, function(index, item){
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
