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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.861816634758562, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.442, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.998, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [0.5, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.998, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [0.973, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.615, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.694, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.289, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 494.69772388853534, 1, 26444, 14.0, 1224.9000000000015, 2339.9000000000015, 9742.0, 10.02484780400175, 63.14916782207782, 82.95647107417705], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 9934.141999999983, 8569, 26444, 9703.0, 10424.300000000001, 10802.9, 24997.530000000123, 0.21631593201449836, 0.12564237719960855, 0.1090029501166808], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 3.4079999999999973, 2, 10, 3.0, 4.0, 5.0, 8.0, 0.217093225909816, 0.11145320292289979, 0.07844188826819523], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 5.049999999999997, 3, 16, 5.0, 6.0, 7.0, 10.990000000000009, 0.21709190629271286, 0.1245967619602444, 0.09158564796723823], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 20.35400000000001, 13, 553, 18.0, 23.0, 26.94999999999999, 81.99000000000001, 0.21556044638257238, 0.11213984901607435, 2.371796434953558], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 54.113999999999976, 32, 78, 56.5, 68.0, 70.0, 74.0, 0.21703244591659962, 0.9026154763178537, 0.0902888886332729], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 3.425999999999998, 2, 18, 3.0, 4.0, 5.0, 9.0, 0.2170378158008739, 0.1355871690878682, 0.09177477953298671], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 47.35199999999997, 29, 69, 50.0, 60.0, 62.0, 65.0, 0.21703027919643236, 0.8907376217594124, 0.07884303111432894], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1215.0620000000008, 839, 1772, 1188.5, 1536.3000000000002, 1713.75, 1754.98, 0.21695324744298902, 0.9175529116427528, 0.10551046604160991], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 8.747999999999998, 6, 31, 8.0, 12.0, 12.0, 18.980000000000018, 0.21702123596198133, 0.32271524044108263, 0.11084190078917602], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 5.346000000000006, 3, 19, 5.0, 6.0, 7.0, 13.0, 0.21573213662402504, 0.20808670768058182, 0.11797851221626371], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 12.10599999999999, 8, 25, 12.0, 15.0, 17.0, 22.0, 0.21702896034446836, 0.35367030900040797, 0.14178942819379817], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 652.0, 652, 652, 652.0, 652.0, 652.0, 652.0, 1.5337423312883436, 0.6635232937116564, 1814.0951519363496], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 5.927999999999999, 4, 20, 6.0, 7.0, 9.0, 15.990000000000009, 0.2157335328437045, 0.2167258228238743, 0.12661704417877578], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 12.401999999999985, 8, 27, 13.0, 15.0, 16.0, 23.0, 0.21702792411488417, 0.34095214043247585, 0.12907227127535592], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 9.416000000000004, 6, 21, 9.0, 11.0, 12.0, 17.0, 0.21702698209657614, 0.33586409062330586, 0.12398514113915728], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2318.7160000000035, 1956, 2962, 2270.5, 2656.8, 2764.75, 2920.83, 0.2168282109114027, 0.3311220876176781, 0.11942491304104602], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 18.103999999999996, 13, 79, 17.0, 22.0, 24.94999999999999, 54.950000000000045, 0.2155549634979225, 0.1121369966845491, 1.737911893202], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 17.353999999999974, 12, 41, 17.0, 21.0, 22.0, 28.0, 0.2170312212433632, 0.39288373547952615, 0.181000647404133], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 12.07599999999999, 8, 30, 12.0, 15.0, 16.0, 21.0, 0.21703037340075745, 0.3674489537779563, 0.15556669343374607], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 67.0, 67, 67, 67.0, 67.0, 67.0, 67.0, 14.925373134328359, 7.039995335820895, 2035.5643656716418], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 625.0, 625, 625, 625.0, 625.0, 625.0, 625.0, 1.6, 0.7421875, 3059.909375], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 3.522000000000001, 2, 27, 3.0, 4.0, 5.0, 10.0, 0.21571538339742238, 0.18131678480858926, 0.0912155869248866], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 771.3059999999992, 559, 974, 741.5, 945.0, 957.0, 965.99, 0.2156603022436004, 0.18990532337507512, 0.09982713209322909], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 4.565999999999997, 3, 17, 4.0, 6.0, 6.0, 11.990000000000009, 0.21572264280946815, 0.1954375517195036, 0.10533332168431062], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1044.1999999999998, 796, 1452, 988.5, 1314.9, 1331.9, 1356.0, 0.2156472804074526, 0.2040158052204756, 0.11393083857464048], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 90.0, 90, 90, 90.0, 90.0, 90.0, 90.0, 11.11111111111111, 5.262586805555555, 731.6297743055555], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 37.82200000000005, 24, 1674, 33.0, 41.0, 46.0, 117.98000000000002, 0.21540090632085343, 0.11205685234978693, 9.825562826413147], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 47.599999999999994, 31, 627, 45.0, 54.0, 60.94999999999999, 201.9000000000001, 0.2156386310569657, 48.77112185445233, 0.06654473380273551], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 647.0, 647, 647, 647.0, 647.0, 647.0, 647.0, 1.5455950540958268, 0.8105317812982998, 0.6339354714064915], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 3.968, 3, 12, 4.0, 5.0, 6.0, 9.0, 0.2170739045473944, 0.2358792034462219, 0.09306195712529897], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 4.850000000000006, 3, 13, 5.0, 6.0, 7.0, 9.0, 0.21707305637126786, 0.2227351865818895, 0.07991849829293748], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.7999999999999976, 1, 29, 2.0, 4.0, 5.0, 11.990000000000009, 0.21709379146491417, 0.12311380433749053, 0.08416624532379972], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 128.80200000000008, 84, 175, 134.0, 162.0, 165.0, 172.0, 0.21708361192396863, 0.1977305231226609, 0.0708065687330132], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 121.14800000000002, 81, 512, 120.0, 138.0, 145.95, 449.93000000000006, 0.21560004294752855, 0.11216044812361127, 63.751500980549], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 268.3640000000001, 16, 523, 281.0, 491.0, 501.0, 518.99, 0.21707032340439203, 0.12098066823253963, 0.09094059447312909], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 578.46, 454, 743, 552.0, 704.9000000000001, 712.0, 739.98, 0.21703800422269143, 0.11672363213425622, 0.09241071273544282], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 10.826000000000008, 7, 417, 9.0, 12.0, 17.0, 42.99000000000001, 0.21536472231088072, 0.09710551361148118, 0.15626561394236754], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 543.802, 381, 724, 537.0, 649.0, 660.0, 691.95, 0.21703329377539832, 0.111634381019961, 0.08732198929244542], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 5.106000000000002, 3, 28, 5.0, 6.0, 8.949999999999989, 16.0, 0.21571389434764884, 0.1324428540188577, 0.10785694717382441], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 5.743999999999996, 4, 57, 5.0, 7.0, 7.949999999999989, 14.990000000000009, 0.21570886895643068, 0.12633082597837994, 0.10174549190034769], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 957.8820000000003, 664, 1444, 927.5, 1222.3000000000002, 1390.0, 1409.0, 0.2156281225647499, 0.1970365142236935, 0.0949690266374045], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 329.8039999999999, 215, 429, 330.0, 396.0, 400.0, 407.98, 0.215672302327708, 0.1909689777769103, 0.0886699602343409], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 6.8439999999999985, 4, 95, 7.0, 8.0, 10.0, 17.0, 0.21573464983246046, 0.143832229284296, 0.10091493873998884], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1589.4340000000004, 1277, 14751, 1456.5, 1767.0, 1806.85, 5677.230000000035, 0.21562310116906533, 0.16207739961019657, 0.1191823000602451], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 171.85400000000013, 130, 235, 179.5, 206.0, 208.0, 212.0, 0.21709859880222362, 4.197531444425364, 0.10939734080268299], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 233.40000000000006, 179, 327, 228.0, 281.0, 285.0, 293.99, 0.21708125568481537, 0.4207454482130957, 0.15517917886844226], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 10.920000000000002, 7, 23, 11.0, 14.0, 15.0, 18.99000000000001, 0.21701972882950843, 0.1771148023243247, 0.13394186388696222], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 10.779999999999994, 7, 40, 11.0, 13.0, 14.0, 19.0, 0.2170202940017327, 0.18050620566817946, 0.13733315479797148], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 12.057999999999995, 8, 28, 12.0, 15.0, 16.0, 19.99000000000001, 0.21701718559092695, 0.17562921081157915, 0.13245677831477473], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 14.875999999999996, 10, 31, 15.0, 18.0, 19.0, 24.0, 0.2170181275241921, 0.19406803667497846, 0.15089541679416482], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 11.650000000000016, 7, 61, 12.0, 14.0, 15.0, 57.64000000000033, 0.21700277503148713, 0.16290254218208444, 0.11973297645780294], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2616.0859999999993, 2270, 3303, 2567.5, 2986.8000000000006, 3102.0, 3243.98, 0.21678759801509276, 0.1811717667755663, 0.1380327284236723], "isController": false}]}, function(index, item){
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
