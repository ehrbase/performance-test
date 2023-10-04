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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8722186768772602, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.998, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.768, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.78, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.449, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 466.97294192724917, 1, 21215, 11.0, 1022.0, 1901.0, 10422.980000000003, 10.61921714616163, 66.89324472032222, 87.87492810258014], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 10594.029999999997, 8969, 21215, 10410.0, 11273.6, 11560.949999999999, 20432.15000000007, 0.2286504501670063, 0.13284546496412017, 0.115218390904468], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.9240000000000017, 2, 22, 3.0, 4.0, 5.0, 8.0, 0.22956630333973058, 0.11785673957883766, 0.08294876194892609], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 4.185999999999994, 3, 27, 4.0, 5.0, 6.0, 9.990000000000009, 0.22956482772996195, 0.1317554149464609, 0.0968476616985777], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 16.319999999999983, 10, 446, 14.0, 18.0, 21.94999999999999, 76.93000000000006, 0.22826297355436492, 0.11874801625209545, 2.511561448278349], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 43.024000000000015, 26, 65, 45.0, 55.0, 57.0, 59.0, 0.22949823424058574, 0.9544593995534423, 0.09547485135399368], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.651999999999997, 1, 12, 2.0, 4.0, 4.0, 7.0, 0.22950487078187262, 0.14337554774206224, 0.09704649321147542], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 37.59199999999999, 23, 56, 38.0, 48.0, 49.0, 52.0, 0.22949760220905213, 0.9419061208789116, 0.08337217580250722], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1036.3319999999999, 740, 1483, 1026.5, 1257.0, 1390.95, 1433.89, 0.22942504706654843, 0.9702864702945038, 0.11157585296791124], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 6.8679999999999986, 4, 27, 6.5, 9.0, 10.0, 16.99000000000001, 0.22944968329060217, 0.34119660863616486, 0.11718963316502434], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 4.4899999999999975, 3, 20, 4.0, 6.0, 6.0, 11.980000000000018, 0.2283917429989937, 0.22029766452884383, 0.12490173445257469], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 9.297999999999996, 6, 28, 9.0, 12.0, 13.0, 16.0, 0.22949686484332937, 0.3739880013014767, 0.14993496345721422], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 573.0, 573, 573, 573.0, 573.0, 573.0, 573.0, 1.7452006980802792, 0.7550038176265271, 2064.206001854276], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 5.038000000000002, 3, 16, 5.0, 6.0, 7.0, 12.0, 0.2283933078933641, 0.22944382789353765, 0.1340472441835076], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 9.663999999999989, 6, 28, 10.0, 12.0, 13.0, 17.0, 0.2294957061353382, 0.36053909904001946, 0.13648719241837984], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 7.4479999999999995, 5, 16, 7.0, 9.0, 10.0, 13.990000000000009, 0.22949517945375555, 0.3551594783517197, 0.13110808591840528], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2077.638000000001, 1596, 2689, 2047.0, 2447.8, 2582.95, 2655.95, 0.229274817508709, 0.35011652820951494, 0.1262802705809686], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 14.21599999999999, 9, 72, 13.0, 17.0, 20.0, 39.950000000000045, 0.22825828429204095, 0.11874557678243469, 1.84033241710458], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 14.095999999999997, 9, 28, 14.0, 18.0, 19.0, 24.99000000000001, 0.22949823424058574, 0.4154523162051916, 0.1913979414467385], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 9.473999999999991, 6, 22, 9.0, 12.0, 13.0, 17.99000000000001, 0.22949749687080165, 0.38855674345691166, 0.1645030885773129], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 63.0, 63, 63, 63.0, 63.0, 63.0, 63.0, 15.873015873015872, 7.486979166666667, 2164.8065476190477], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 582.0, 582, 582, 582.0, 582.0, 582.0, 582.0, 1.7182130584192439, 0.7970226589347079, 3285.9851535652924], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.8600000000000025, 2, 20, 3.0, 4.0, 4.0, 9.990000000000009, 0.2283887175973507, 0.19196919250314035, 0.09657452609341098], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 694.9199999999994, 520, 907, 676.0, 830.9000000000001, 851.0, 877.98, 0.22833083311071076, 0.2010626909416592, 0.10569220204538761], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.7480000000000033, 2, 15, 3.0, 5.0, 5.949999999999989, 9.990000000000009, 0.22838694412330704, 0.20691098821546208, 0.11151706256020852], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 955.5200000000001, 754, 1234, 918.0, 1153.8000000000002, 1178.0, 1206.0, 0.22830643655204313, 0.21597922671125946, 0.12061892790493683], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 57.0, 57, 57, 57.0, 57.0, 57.0, 57.0, 17.543859649122805, 8.309347587719298, 1155.2049067982455], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 31.517999999999965, 20, 1748, 27.0, 33.0, 36.0, 105.0, 0.22807742589992508, 0.11865148979604405, 10.40380523807178], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 38.94600000000002, 26, 368, 37.0, 44.0, 50.94999999999999, 136.92000000000007, 0.22833125019122744, 51.641819332983914, 0.07046159673869909], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 473.0, 473, 473, 473.0, 473.0, 473.0, 473.0, 2.1141649048625792, 1.1086978065539113, 0.8671379492600423], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 3.2559999999999976, 2, 10, 3.0, 4.0, 5.0, 7.990000000000009, 0.22953985064300997, 0.24942508516502307, 0.09840624456277478], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.9160000000000026, 2, 11, 4.0, 5.0, 6.0, 8.0, 0.22953900762941754, 0.23552629951787626, 0.08450801355106485], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.217999999999999, 1, 13, 2.0, 3.0, 4.0, 8.0, 0.22956746276071402, 0.1301876184568108, 0.08900222921484714], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 127.47600000000006, 90, 170, 127.5, 154.0, 158.95, 164.99, 0.22955607986164198, 0.20909106567163285, 0.07487473698612149], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 100.3380000000001, 68, 422, 97.0, 113.90000000000003, 124.94999999999999, 388.41000000000054, 0.22829986913851502, 0.11876721024294759, 67.50675525044039], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 262.21200000000005, 14, 454, 320.5, 416.0, 422.0, 436.99, 0.22953679474819813, 0.12792865637767983, 0.09616336420603222], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 497.6139999999996, 365, 648, 484.5, 592.9000000000001, 608.0, 636.9300000000001, 0.22951803965888112, 0.12343542931693595, 0.09772447782350797], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 8.574, 5, 354, 7.0, 9.0, 12.949999999999989, 27.99000000000001, 0.22804320232859476, 0.10282209662806199, 0.1654649407520956], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 468.42400000000015, 328, 630, 485.5, 549.9000000000001, 565.0, 596.98, 0.22950539750793858, 0.11804959757949837, 0.09234006227858467], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 4.216000000000003, 2, 28, 4.0, 5.0, 6.0, 11.0, 0.22838777869589663, 0.1402242972108371, 0.11419388934794833], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.741999999999999, 3, 35, 4.0, 6.0, 6.949999999999989, 14.990000000000009, 0.22838433612327638, 0.1337542677895411, 0.10772425229252197], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 776.935999999999, 545, 1153, 742.5, 1013.8000000000001, 1109.0, 1140.96, 0.22831352561289622, 0.20862817290160462, 0.10055605473771113], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 280.0340000000001, 194, 376, 272.0, 337.90000000000003, 346.0, 356.0, 0.22834584896931534, 0.2021908835146171, 0.09388047110945484], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 5.260000000000002, 3, 42, 5.0, 6.0, 7.0, 13.990000000000009, 0.22839445549619838, 0.15227263546075154, 0.10683685955339747], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1266.154, 966, 10929, 1173.5, 1501.0, 1515.95, 1854.9600000000028, 0.22829507412284467, 0.17160254053036597, 0.12618653511086922], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 167.29000000000008, 144, 203, 176.0, 185.0, 187.0, 191.0, 0.2295727330036975, 4.438714809226207, 0.11568313499014445], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 227.6499999999999, 196, 320, 230.5, 252.0, 254.95, 263.99, 0.22955439360222724, 0.44492080129519185, 0.16409552355159213], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 8.350000000000007, 5, 20, 8.0, 11.0, 12.0, 15.0, 0.2294471562548901, 0.18725711225954514, 0.141611916751065], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 8.28999999999999, 5, 22, 8.0, 11.0, 12.0, 17.980000000000018, 0.22944841976578823, 0.1908432749987495, 0.14519782813303786], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 9.376000000000001, 6, 23, 9.0, 12.0, 12.0, 16.99000000000001, 0.22944431340624769, 0.18568632515907374, 0.14004169519424298], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 11.677999999999995, 8, 26, 11.0, 14.900000000000034, 16.0, 22.0, 0.22944557688583614, 0.2051812589942666, 0.15953637767843293], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 8.932000000000006, 5, 50, 9.0, 11.0, 12.0, 48.6700000000003, 0.2294390490577397, 0.17223837050896004, 0.12659478781017863], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2073.164, 1693, 2765, 2004.0, 2529.8, 2669.6499999999996, 2749.98, 0.22925957410907438, 0.19158174820398047, 0.14597386945226218], "isController": false}]}, function(index, item){
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
