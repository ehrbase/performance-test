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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8896192299510742, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.474, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.001, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.859, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.387, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [0.99, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.996, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.616, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.52, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [0.995, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [0.976, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 227.15247819612773, 1, 7055, 16.0, 644.9000000000015, 1454.0, 2878.980000000003, 21.611289174771475, 145.57496079046246, 179.00990070633196], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 27.51199999999999, 13, 125, 23.0, 41.900000000000034, 67.0, 105.92000000000007, 0.46847316164104275, 0.2720758534761177, 0.2360665541081817], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 9.478000000000002, 5, 42, 8.0, 15.900000000000034, 21.0, 31.99000000000001, 0.4682862502727767, 5.01471465152947, 0.16920499277434317], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 10.162000000000003, 5, 56, 8.5, 16.0, 21.0, 38.92000000000007, 0.4682704617802332, 5.028287304005398, 0.19755160106353586], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 28.671999999999993, 14, 293, 23.0, 42.0, 52.0, 106.80000000000018, 0.4645898879223354, 0.25076511421245506, 5.172192111635375], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 58.47799999999998, 27, 366, 51.0, 84.0, 121.79999999999995, 204.96000000000004, 0.46820907220626673, 1.9472330643511233, 0.1947822898045602], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 3.0980000000000016, 1, 16, 3.0, 5.0, 7.0, 11.0, 0.4682301182468341, 0.2925112196715646, 0.19799183711023352], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 51.758000000000045, 25, 268, 46.0, 75.90000000000003, 98.89999999999998, 183.95000000000005, 0.46820819532896774, 1.9216242818271543, 0.17009125845935155], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 951.0960000000002, 584, 3418, 889.0, 1294.8000000000002, 1522.75, 2381.2700000000004, 0.4679750625448671, 1.9791643389782045, 0.22758943471420295], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 11.73400000000001, 5, 74, 10.0, 17.900000000000034, 26.94999999999999, 46.97000000000003, 0.4679592950286812, 0.6958655255206281, 0.23900655400390652], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 4.487999999999999, 2, 43, 3.0, 8.0, 11.0, 17.99000000000001, 0.46569417304822913, 0.4491902262319008, 0.25467650088575033], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 17.660000000000004, 9, 105, 15.0, 24.0, 34.94999999999999, 65.99000000000001, 0.4681994267366219, 0.7629776029195979, 0.30588419578789067], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 896.0, 896, 896, 896.0, 896.0, 896.0, 896.0, 1.1160714285714286, 0.47629220145089285, 1320.07816859654], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 5.418, 2, 30, 4.0, 8.0, 12.0, 21.970000000000027, 0.4656998117641361, 0.4678418489842621, 0.2733257684279744], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 19.550000000000004, 10, 106, 17.0, 29.0, 43.0, 85.99000000000001, 0.4681924120992156, 0.7355330227227824, 0.2784464638363499], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 11.478000000000007, 5, 52, 10.0, 17.0, 24.94999999999999, 47.97000000000003, 0.4681906584727059, 0.7245570492073063, 0.2674722023501298], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2440.281999999998, 1497, 7055, 2316.5, 3209.5000000000014, 3694.7999999999997, 4850.490000000002, 0.4673268437212302, 0.7136363855423095, 0.2573948631433338], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 24.118000000000002, 11, 92, 20.0, 39.0, 50.0, 67.97000000000003, 0.46456700961003317, 0.25075276550933734, 3.7455715149808926], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 23.982000000000003, 12, 107, 21.0, 38.0, 50.0, 82.96000000000004, 0.46820994908685015, 0.8475834616423682, 0.39047978175797854], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 18.197999999999986, 8, 117, 16.0, 26.0, 38.0, 71.97000000000003, 0.46820468785261665, 0.7927062005634374, 0.33560765711310603], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 96.0, 96, 96, 96.0, 96.0, 96.0, 96.0, 10.416666666666666, 4.852294921875, 1420.654296875], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 763.0, 763, 763, 763.0, 763.0, 763.0, 763.0, 1.3106159895150722, 0.6002723623853211, 2506.4788458387943], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.797999999999998, 1, 22, 2.0, 5.0, 7.0, 12.990000000000009, 0.4652430848594082, 0.39105407770443473, 0.19672876537512082], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 486.60800000000063, 306, 2254, 454.0, 620.7, 826.6499999999999, 1397.5800000000004, 0.4650864270107314, 0.40954402548813146, 0.21528414687801434], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.7600000000000025, 1, 23, 3.0, 6.0, 9.949999999999989, 14.990000000000009, 0.46525001139862526, 0.4215010625728698, 0.22717285712823498], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1373.2760000000012, 909, 4771, 1267.5, 1801.1000000000006, 2238.45, 3505.3400000000006, 0.4648589850268921, 0.4397593236185553, 0.24559444423784044], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 58.0, 58, 58, 58.0, 58.0, 58.0, 58.0, 17.241379310344826, 8.065059267241379, 1135.2875808189654], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 56.38, 29, 715, 46.0, 83.80000000000007, 118.89999999999998, 194.91000000000008, 0.4642719519385675, 0.2505935064023102, 21.235907895408815], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 57.12600000000005, 29, 399, 47.0, 81.90000000000003, 106.89999999999998, 223.97000000000003, 0.4648183629283185, 105.18635741109883, 0.14344004168491079], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 382.0, 382, 382, 382.0, 382.0, 382.0, 382.0, 2.617801047120419, 1.3728116819371727, 1.0737074607329842], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 3.011999999999998, 1, 22, 2.0, 5.0, 7.949999999999989, 15.990000000000009, 0.4682937063199045, 0.5088623925383018, 0.20076263386175597], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 4.273999999999998, 2, 23, 3.0, 7.0, 11.0, 17.99000000000001, 0.46828844320316787, 0.48050327163867235, 0.17240697567147878], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.8239999999999985, 1, 34, 2.0, 5.0, 6.949999999999989, 13.0, 0.46829721513012107, 0.265571167771692, 0.181556635162752], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 159.60799999999992, 86, 741, 138.0, 213.4000000000002, 297.69999999999993, 699.7200000000003, 0.46822222575990124, 0.4264800314340992, 0.1527209212927803], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 207.55000000000013, 117, 772, 191.0, 285.90000000000003, 335.84999999999997, 482.8700000000001, 0.46464126441898007, 0.2507928449775532, 137.44941653834826], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 2.9419999999999993, 1, 28, 2.0, 5.0, 7.0, 11.990000000000009, 0.46828493452440045, 0.2609911083812701, 0.19618577823336697], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 3.962, 2, 29, 3.0, 7.0, 9.949999999999989, 16.99000000000001, 0.4683244101922378, 0.2518661483759446, 0.19940375277716377], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 16.895999999999994, 7, 323, 12.0, 30.0, 37.0, 55.99000000000001, 0.46414567490494296, 0.19613327635558386, 0.33677757466247327], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 5.438000000000001, 2, 68, 4.5, 8.0, 12.0, 18.0, 0.46829546071844014, 0.24087490440918907, 0.18841575177343492], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 4.3619999999999965, 2, 19, 4.0, 7.0, 9.0, 14.990000000000009, 0.4652374571981539, 0.28564398604985486, 0.23261872859907695], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 5.1080000000000005, 2, 30, 4.0, 8.0, 11.0, 19.0, 0.4652266351553159, 0.27246197789940874, 0.21943795388673595], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 639.1179999999994, 369, 2274, 605.5, 851.9000000000001, 1035.0499999999997, 1794.4800000000005, 0.46480367157716257, 0.424727972198698, 0.20471333582158233], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 21.251999999999992, 7, 128, 17.0, 41.900000000000034, 50.94999999999999, 75.97000000000003, 0.46490739509597084, 0.4116564298901052, 0.1911386848978552], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 10.138000000000003, 4, 105, 8.0, 16.0, 24.0, 52.960000000000036, 0.465705450616594, 0.3104900079984911, 0.21784463949741065], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 646.8740000000003, 394, 4736, 609.5, 774.8000000000001, 813.8499999999999, 920.97, 0.46555801784018325, 0.3499459588982104, 0.2573299200171325], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 202.14399999999995, 142, 1132, 186.0, 242.90000000000003, 295.79999999999995, 505.39000000000055, 0.468370912292863, 9.055800649337725, 0.23601503002257548], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 303.86000000000007, 203, 1169, 273.0, 392.7000000000001, 491.84999999999997, 864.0200000000018, 0.46823099520625105, 0.9075222055623033, 0.3347120004794686], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 18.63000000000003, 8, 88, 16.0, 30.900000000000034, 44.94999999999999, 70.98000000000002, 0.4679369595328117, 0.3818941371593419, 0.28880484221165725], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 17.47199999999999, 8, 97, 15.0, 25.0, 36.94999999999999, 66.99000000000001, 0.46794571829667764, 0.3892129372367805, 0.2961218998596163], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 18.49800000000001, 8, 79, 16.0, 31.0, 42.94999999999999, 70.99000000000001, 0.4678537676263907, 0.37862802321256467, 0.2855552780922795], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 22.390000000000033, 11, 189, 19.0, 32.0, 45.89999999999998, 87.94000000000005, 0.4678598965468197, 0.4183827986981331, 0.32530883431771057], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 18.522000000000016, 9, 95, 15.0, 31.0, 50.849999999999966, 78.93000000000006, 0.4676161769010702, 0.3510363587359587, 0.25801087885654755], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2642.064000000003, 1677, 6642, 2499.0, 3430.8000000000015, 3962.4499999999994, 4779.82, 0.46690049043227516, 0.39016740104277553, 0.29728429664242517], "isController": false}]}, function(index, item){
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
