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

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9046125880481709, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.475, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.001, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.829, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.361, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.998, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [0.994, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.995, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.627, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.524, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 22005, 0, 0.0, 231.96514428538956, 1, 5828, 16.0, 714.0, 1673.7000000000044, 2958.9400000000096, 20.92008442188124, 140.13365033874518, 184.2778450940477], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query participation #2", 500, 0, 0.0, 9.638000000000002, 4, 47, 8.0, 16.0, 20.0, 41.98000000000002, 0.4837700002612358, 5.177459610647391, 0.17479970712564186], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 9.878, 5, 45, 8.0, 15.0, 19.94999999999999, 31.99000000000001, 0.4837559586640208, 5.194159535700706, 0.2040845450613838], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 28.670000000000037, 13, 285, 22.0, 45.900000000000034, 61.94999999999999, 115.99000000000001, 0.48036507745886875, 0.2588717425243185, 5.347814338897562], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 56.69199999999999, 27, 231, 50.0, 82.0, 113.89999999999998, 156.98000000000002, 0.48379387284735914, 2.012185648883694, 0.20126581038376465], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 3.2180000000000004, 1, 23, 2.5, 6.0, 8.0, 12.0, 0.4838285156915264, 0.30239282230720405, 0.20458764384221773], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 50.02400000000002, 23, 199, 45.0, 75.0, 92.94999999999999, 153.99, 0.4837849788634343, 1.9851436285034498, 0.17575001185273198], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 950.9600000000006, 564, 3764, 897.5, 1269.0, 1500.9999999999998, 2072.1900000000005, 0.4833598536773051, 2.044366724879305, 0.23507149133915817], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 12.56800000000002, 6, 58, 11.0, 20.0, 25.94999999999999, 40.99000000000001, 0.4834056508186958, 0.7189714904266346, 0.24689565954900186], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 4.310000000000005, 2, 22, 3.0, 7.0, 9.0, 15.990000000000009, 0.48115600617419385, 0.46424036533213237, 0.2631321908765123], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 19.961999999999996, 10, 114, 17.0, 30.0, 42.0, 85.94000000000005, 0.483767659938426, 0.7884845941769854, 0.3160552387683662], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 737.0, 737, 737, 737.0, 737.0, 737.0, 737.0, 1.3568521031207597, 0.57904723541384, 1604.8711520522388], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 5.6179999999999986, 2, 39, 4.0, 8.0, 11.0, 24.99000000000001, 0.4811629516075173, 0.48296731267604553, 0.28240130265245894], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 21.17999999999999, 10, 97, 18.0, 34.0, 45.0, 66.99000000000001, 0.48376297936073626, 0.7595834655618809, 0.2877066937799691], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 12.784000000000004, 6, 60, 10.0, 23.0, 29.0, 42.98000000000002, 0.4837634474144295, 0.7487940079608112, 0.27636876634515745], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2360.2819999999997, 1485, 5424, 2252.0, 3081.3, 3367.6499999999996, 4482.4800000000005, 0.48271494330995707, 0.7372716516960672, 0.2658703398699373], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 24.968, 12, 186, 19.0, 42.0, 54.94999999999999, 74.97000000000003, 0.4803383118798232, 0.25940145163041234, 3.8727276395310746], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 25.38599999999999, 13, 98, 22.0, 40.0, 50.0, 72.97000000000003, 0.4837788936944259, 0.8759043641694001, 0.40346403829593724], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 19.58, 10, 92, 17.0, 30.900000000000034, 42.89999999999998, 75.91000000000008, 0.4837746809747866, 0.8192043914162891, 0.346768179526849], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 128.0, 128, 128, 128.0, 128.0, 128.0, 128.0, 7.8125, 3.63922119140625, 1065.49072265625], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 673.0, 673, 673, 673.0, 673.0, 673.0, 673.0, 1.4858841010401187, 0.6805465267459138, 2841.669181835067], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 3.143999999999998, 1, 44, 2.0, 5.900000000000034, 8.0, 20.0, 0.4810879515371241, 0.4045085217514296, 0.20342879200739722], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 507.3119999999997, 310, 1841, 465.0, 710.9000000000001, 834.75, 1417.97, 0.480953750525442, 0.4231077896712296, 0.2226289821768159], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 4.105999999999999, 1, 30, 3.0, 6.900000000000034, 10.0, 21.99000000000001, 0.4811365600275595, 0.43603000752497584, 0.2349299609509568], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1409.5260000000005, 916, 3667, 1310.0, 1952.5000000000005, 2316.85, 2938.630000000002, 0.4807202342838134, 0.45490029982521013, 0.2539742644018975], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 91.0, 91, 91, 91.0, 91.0, 91.0, 91.0, 10.989010989010989, 5.140367445054945, 723.5898866758242], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 55.73399999999998, 27, 631, 45.0, 83.0, 120.89999999999998, 192.84000000000015, 0.48005284421709143, 0.25924728794145663, 21.957729606875127], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 57.82000000000002, 29, 299, 48.0, 94.0, 118.94999999999999, 195.94000000000005, 0.48060194432322595, 108.75824878143376, 0.1483107562559955], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 370.0, 370, 370, 370.0, 370.0, 370.0, 370.0, 2.7027027027027026, 1.4173353040540542, 1.1085304054054055], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 3.1420000000000003, 1, 21, 2.0, 6.0, 8.0, 16.0, 0.4837929366231253, 0.5258413461538461, 0.20740732341557813], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 4.274000000000003, 2, 30, 3.0, 8.0, 10.0, 19.99000000000001, 0.4837891917624247, 0.49654535209209794, 0.1781137942328458], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 3.0000000000000013, 1, 24, 2.0, 5.0, 8.949999999999989, 16.0, 0.4837798298643094, 0.27448836049918335, 0.18755917232044028], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 157.28800000000015, 85, 894, 137.0, 217.90000000000003, 284.5499999999999, 687.9200000000001, 0.48373208981937443, 0.4407441794936292, 0.15777980273405376], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 208.86200000000008, 109, 1287, 183.5, 306.90000000000003, 365.79999999999995, 523.3900000000006, 0.4804338509847933, 0.25945304647909245, 142.12115358653477], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 3.0440000000000014, 1, 34, 2.0, 5.0, 7.0, 14.990000000000009, 0.4837873193538149, 0.26922008404353315, 0.20268042969022132], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 4.056000000000002, 2, 21, 3.0, 7.0, 8.949999999999989, 15.990000000000009, 0.48382523845326875, 0.2597914737413528, 0.20600371481018084], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 16.370000000000005, 7, 303, 11.0, 29.0, 36.0, 60.960000000000036, 0.479924747799545, 0.20293692948945607, 0.348226648061584], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 5.71, 2, 70, 5.0, 9.0, 11.0, 17.980000000000018, 0.48379387284735914, 0.24898376073296705, 0.19465144102842966], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 4.681999999999999, 2, 35, 4.0, 8.0, 12.0, 16.99000000000001, 0.4810819340263479, 0.29550833642829377, 0.24054096701317393], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 5.1280000000000046, 2, 46, 4.0, 9.0, 11.0, 16.99000000000001, 0.4810615681837424, 0.2818720126076616, 0.22690697014916758], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 628.212, 367, 2002, 611.5, 846.0, 994.2499999999998, 1415.3300000000006, 0.48058254293524444, 0.438738070739828, 0.211662819202925], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 21.72999999999998, 6, 135, 18.0, 41.900000000000034, 49.94999999999999, 68.0, 0.4806892699579781, 0.4257667654803576, 0.1976271314963953], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 11.268000000000013, 5, 72, 9.0, 19.900000000000034, 28.94999999999999, 46.99000000000001, 0.4811768430757209, 0.3209411951374193, 0.22508174593092806], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 660.662, 366, 4738, 628.5, 786.0, 824.75, 1005.3400000000006, 0.4809694805625804, 0.36166650393865907, 0.2658483652328325], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 20.046000000000017, 10, 86, 17.0, 32.900000000000034, 46.0, 74.0, 0.48338789171337804, 0.39464089596912505, 0.29834096441685054], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 19.610000000000003, 9, 98, 17.0, 32.0, 44.94999999999999, 72.95000000000005, 0.48339864048966347, 0.4016551750724856, 0.30590070218486515], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 19.753999999999998, 10, 87, 17.0, 33.0, 41.94999999999999, 79.94000000000005, 0.48338321848148064, 0.39133270324330804, 0.29503370268645057], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 23.532000000000018, 11, 111, 20.0, 39.0, 49.0, 80.99000000000001, 0.48338648973432113, 0.43240432089515446, 0.33610466864339517], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 21.077999999999996, 10, 116, 17.0, 35.0, 57.0, 85.0, 0.4831660129430511, 0.3628463515168031, 0.2665906223758046], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2709.98, 1649, 5828, 2579.0, 3637.7000000000003, 4110.05, 4992.8, 0.48241919719656556, 0.4027258071596798, 0.30716534821500074], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 22005, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
