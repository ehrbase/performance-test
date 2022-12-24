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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8710274409700064, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.467, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [0.5, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [0.993, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.81, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.83, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [0.847, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.494, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 483.6244628802398, 1, 25317, 13.0, 1021.0, 1822.9500000000007, 10369.910000000014, 10.22671502511321, 64.51101873614249, 84.72955460545896], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 10952.51200000001, 9096, 25317, 10484.0, 12641.7, 13048.1, 23002.010000000082, 0.22015957165753738, 0.12792475110960425, 0.11136978331894958], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.955999999999999, 1, 9, 3.0, 4.0, 4.0, 6.990000000000009, 0.2209621487419962, 0.11343946407729963, 0.0802714055976783], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 4.467999999999999, 3, 18, 4.0, 6.0, 6.0, 10.0, 0.2209606840235703, 0.1267546142667243, 0.09364935240842727], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 16.610000000000007, 11, 419, 14.0, 20.0, 25.0, 40.99000000000001, 0.21966329132053225, 0.12907578029343503, 2.4458992652702234], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 44.462, 27, 107, 46.0, 56.0, 58.0, 65.97000000000003, 0.2208937183127961, 0.9186741085116092, 0.09232667132605149], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.6820000000000017, 1, 12, 2.0, 4.0, 4.0, 8.0, 0.22089918337989886, 0.1380119421412023, 0.09383900856470313], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 38.743999999999986, 23, 62, 40.0, 49.0, 50.94999999999999, 54.0, 0.2208919617415122, 0.9065742624969627, 0.08067733758918512], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1113.1319999999996, 785, 1677, 1098.0, 1429.2000000000003, 1522.8, 1572.99, 0.22082376982390187, 0.9339724092844913, 0.1078241063593271], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 6.676000000000006, 4, 22, 6.0, 8.0, 10.0, 14.0, 0.22078574112695223, 0.328313140499435, 0.11319581454262688], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 4.210000000000003, 2, 17, 4.0, 5.0, 6.0, 11.990000000000009, 0.21983104665078607, 0.21204035457758583, 0.12064946115013844], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 10.454000000000015, 6, 30, 10.0, 12.0, 14.0, 25.0, 0.22089069312407034, 0.36002594416413414, 0.14474380379516716], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 537.0, 537, 537, 537.0, 537.0, 537.0, 537.0, 1.86219739292365, 0.8838163407821229, 2202.5921642225326], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.521999999999993, 3, 14, 4.0, 5.900000000000034, 7.0, 13.0, 0.21983230312588345, 0.22084344584826912, 0.12945203006338646], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 15.775999999999994, 7, 32, 16.0, 20.0, 21.0, 24.99000000000001, 0.2208895221055189, 0.3470312448229019, 0.13180029102194538], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 7.6179999999999986, 4, 22, 7.0, 9.0, 10.0, 14.990000000000009, 0.22088981485899278, 0.34184208838397895, 0.12662336066623903], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2191.812, 1586, 3546, 2108.0, 2768.5, 3094.1499999999996, 3416.7000000000003, 0.2206308365129914, 0.3369166458630174, 0.1219502475257355], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 14.086000000000004, 9, 68, 13.0, 18.0, 22.0, 42.950000000000045, 0.219659045229994, 0.1290732852591208, 1.7714300737395414], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 14.593999999999996, 10, 35, 14.5, 17.0, 19.0, 24.0, 0.2208929376109987, 0.3998744603309418, 0.18465269003419424], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 10.174, 6, 32, 10.0, 12.0, 14.0, 22.970000000000027, 0.22089205932807288, 0.3739245248832696, 0.15876616764205237], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 55.0, 55, 55, 55.0, 55.0, 55.0, 55.0, 18.18181818181818, 9.339488636363637, 2479.7230113636365], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 594.0, 594, 594, 594.0, 594.0, 594.0, 594.0, 1.6835016835016834, 0.8516151094276094, 3219.6049031986536], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.7660000000000022, 2, 22, 3.0, 3.0, 4.0, 8.0, 0.2198135541433756, 0.18482370128656872, 0.09337782817614099], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 702.6540000000008, 518, 962, 685.5, 839.0, 856.0, 917.9100000000001, 0.21976292854320473, 0.1934557607884918, 0.10215542381500532], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.6919999999999975, 2, 16, 3.0, 4.900000000000034, 5.0, 10.990000000000009, 0.21983085334819977, 0.1991594540621664, 0.10776864099687136], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 948.798, 727, 1321, 907.0, 1139.0, 1164.95, 1244.8400000000001, 0.21975616734695852, 0.2078906219440158, 0.11653085827089696], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 73.0, 73, 73, 73.0, 73.0, 73.0, 73.0, 13.698630136986301, 7.0633561643835625, 902.0360659246576], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 29.449999999999992, 20, 560, 27.0, 33.0, 37.89999999999998, 74.90000000000009, 0.21960598294539935, 0.12904210546687134, 10.045258048010261], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 36.92200000000002, 26, 247, 35.0, 42.0, 49.0, 115.91000000000008, 0.21972622990658558, 49.72302015268556, 0.06823529405302169], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 974.0, 974, 974, 974.0, 974.0, 974.0, 974.0, 1.026694045174538, 0.538412795174538, 0.42311024127310065], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.994000000000005, 2, 9, 3.0, 4.0, 4.0, 7.990000000000009, 0.22092817227448647, 0.2400048021499846, 0.0951458241924302], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.773999999999996, 2, 18, 4.0, 5.0, 5.0, 8.990000000000009, 0.2209266103892948, 0.22675182374916875, 0.08176873568119405], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.078, 1, 14, 2.0, 3.0, 3.0, 7.0, 0.2209628322839072, 0.12529542040167507, 0.08609782234499899], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 196.21400000000006, 88, 335, 190.0, 276.90000000000003, 310.95, 324.99, 0.22094301128532715, 0.20124585552337643, 0.07249692557799796], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 113.86799999999988, 83, 355, 112.0, 131.90000000000003, 146.89999999999998, 255.91000000000008, 0.2196954318289469, 0.12915688472756448, 64.99037129846151], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 264.14999999999986, 17, 566, 312.5, 439.0, 465.0, 504.99, 0.22092358429957945, 0.12315324797987474, 0.09298639143859251], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 489.77199999999993, 313, 1022, 466.5, 720.0000000000003, 857.9, 957.8900000000001, 0.2209681054636574, 0.11882473555641979, 0.09451565448543157], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 8.226000000000004, 5, 254, 7.0, 11.0, 13.0, 27.0, 0.21958331869444542, 0.10329636762529425, 0.15975544182359555], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 497.91400000000067, 285, 1058, 456.5, 828.9000000000001, 902.8499999999999, 992.8800000000001, 0.22089918337989886, 0.11362286023244779, 0.08930884953054505], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.999999999999996, 2, 20, 4.0, 5.0, 6.0, 10.0, 0.21981239451752718, 0.13495922905968213, 0.11033551834180563], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.499999999999999, 2, 28, 4.0, 5.0, 6.0, 12.980000000000018, 0.21980997866963967, 0.12873265850387658, 0.10410921841286644], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 856.8100000000013, 596, 1397, 855.0, 1131.6000000000001, 1259.1999999999998, 1322.99, 0.21972371939523244, 0.20077898581573528, 0.09720199695902372], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 472.08599999999984, 252, 1015, 387.0, 850.8000000000001, 895.0, 945.99, 0.2197244918541539, 0.19455702539949207, 0.09076509770928427], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 5.580000000000002, 3, 42, 5.0, 6.0, 7.0, 15.990000000000009, 0.21983307634846708, 0.14662694447851857, 0.10326143527696549], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1189.996, 905, 10458, 1114.0, 1415.0, 1432.0, 1546.6300000000003, 0.21974631606288436, 0.1651144633838911, 0.12189053469113116], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 168.04399999999984, 143, 227, 168.5, 187.0, 189.0, 204.92000000000007, 0.22103052387328587, 4.273616545085144, 0.11181036266246297], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 228.53000000000017, 194, 359, 218.0, 256.0, 260.0, 292.95000000000005, 0.22101762703982694, 0.428374897033413, 0.15842474438206344], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 9.397999999999993, 6, 29, 9.0, 11.0, 13.0, 20.970000000000027, 0.2207832063461925, 0.1802487895560712, 0.13669585236668558], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 9.15400000000001, 6, 22, 9.0, 11.0, 13.0, 19.0, 0.22078427874633386, 0.18357436583027695, 0.14014627068859084], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 10.313999999999991, 7, 25, 10.0, 12.0, 14.0, 19.0, 0.22078037915939197, 0.17867471485662081, 0.135184861067323], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 12.298, 8, 29, 12.0, 15.0, 16.0, 22.0, 0.22078125655444353, 0.19744571264877897, 0.15394318083971945], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 9.45, 6, 38, 9.0, 11.0, 13.0, 17.99000000000001, 0.22076010352765815, 0.16572314373315047, 0.12223728388689666], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1991.7999999999997, 1620, 2808, 1915.0, 2499.0, 2573.95, 2652.95, 0.220602217581732, 0.18434719102232802, 0.14089243193208276], "isController": false}]}, function(index, item){
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
