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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8903424803233354, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.163, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.597, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.966, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.998, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.496, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.126, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 326.7088279089559, 1, 21575, 9.0, 840.0, 1508.9500000000007, 6122.0, 15.142037530092423, 95.3836081484841, 125.30165274606858], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6284.085999999999, 5013, 21575, 6096.0, 6661.3, 6848.45, 19571.87000000011, 0.3266532738824375, 0.18971090674865665, 0.16460262629232203], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.3280000000000003, 1, 7, 2.0, 3.0, 4.0, 5.0, 0.32771777993488904, 0.1682465957905962, 0.11841365095303608], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.671999999999999, 2, 14, 4.0, 5.0, 5.0, 8.0, 0.3277152023805232, 0.1880874038975169, 0.13825485100428325], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 12.706000000000007, 8, 396, 11.0, 14.0, 16.94999999999999, 59.81000000000017, 0.3255240122787657, 0.16934560212990363, 3.5817178186961462], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 34.15399999999998, 24, 52, 34.0, 40.0, 42.0, 43.0, 0.32765764756225985, 1.3626942385252654, 0.13631070103664328], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.297999999999999, 1, 8, 2.0, 3.0, 4.0, 6.990000000000009, 0.327666451280586, 0.20469873588740595, 0.13855427090282593], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 29.967999999999993, 21, 48, 30.0, 35.900000000000034, 37.0, 39.0, 0.3276589358817335, 1.3447807484565626, 0.11903234780078598], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 863.2560000000004, 670, 1121, 861.5, 1028.9, 1065.0, 1087.98, 0.32751642331104697, 1.3851353999974454, 0.15928044805556774], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 5.8480000000000025, 3, 21, 5.0, 8.0, 9.0, 12.990000000000009, 0.3276095575501881, 0.4871624505637177, 0.16732402206909022], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.909999999999999, 2, 27, 4.0, 5.0, 5.0, 8.990000000000009, 0.32573438445647634, 0.3141905360073303, 0.17813599149963552], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 8.057999999999998, 5, 20, 8.0, 10.0, 11.0, 14.0, 0.3276610831033699, 0.5339563730326409, 0.21406764120718205], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 455.0, 455, 455, 455.0, 455.0, 455.0, 455.0, 2.197802197802198, 0.9508070054945055, 2599.5385473901097], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.160000000000003, 3, 20, 4.0, 5.0, 6.0, 10.0, 0.3257394774747894, 0.32723775182919, 0.19118108004135587], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 8.406000000000002, 6, 20, 8.0, 10.0, 12.0, 15.0, 0.32765979476701096, 0.5147554574605842, 0.19486798341123993], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.819999999999997, 5, 18, 7.0, 8.0, 9.0, 12.0, 0.32765850644078326, 0.5070739372478258, 0.18718772096470526], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1579.1000000000015, 1341, 1945, 1555.0, 1785.9, 1849.9, 1913.97, 0.3273189566119084, 0.49983586488633525, 0.18028114407140267], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 10.676000000000004, 7, 67, 10.0, 13.0, 15.949999999999989, 31.980000000000018, 0.3255129922000577, 0.16933986921376243, 2.624448499612965], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 11.313999999999997, 8, 26, 11.0, 14.0, 15.0, 22.980000000000018, 0.3276617272753486, 0.5931541215503774, 0.27326476083315204], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 8.044000000000002, 6, 22, 8.0, 10.0, 11.0, 15.0, 0.3276606536567912, 0.5547544451673002, 0.23486613260164524], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 46.0, 46, 46, 46.0, 46.0, 46.0, 46.0, 21.73913043478261, 10.25390625, 2964.84375], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 415.0, 415, 415, 415.0, 415.0, 415.0, 415.0, 2.4096385542168677, 1.1177522590361446, 4608.297251506025], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.3939999999999966, 1, 31, 2.0, 3.0, 4.0, 6.990000000000009, 0.32573671873676696, 0.2737937999842995, 0.13773828048146494], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 560.536, 437, 745, 550.0, 651.0, 662.95, 684.0, 0.3256382835996837, 0.2867493131881551, 0.15073490861938488], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.2840000000000016, 1, 13, 3.0, 4.0, 5.0, 8.990000000000009, 0.3257407507542527, 0.29511030457248805, 0.15905310095422495], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 761.1499999999999, 603, 951, 738.0, 888.0, 905.0, 928.99, 0.3256026579596174, 0.30802202225787206, 0.1720224980040557], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 46.0, 46, 46, 46.0, 46.0, 46.0, 46.0, 21.73913043478261, 10.296365489130435, 1431.449558423913], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 22.39199999999999, 16, 599, 21.0, 25.0, 29.94999999999999, 49.99000000000001, 0.3253882206861006, 0.16927496000165299, 14.842659949460701], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 29.78000000000002, 20, 303, 28.0, 35.0, 39.94999999999999, 91.97000000000003, 0.32564252526660353, 73.65077028602323, 0.10049124803149094], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 455.0, 455, 455, 455.0, 455.0, 455.0, 455.0, 2.197802197802198, 1.152558379120879, 0.9014423076923077], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.776000000000001, 2, 11, 3.0, 4.0, 4.0, 7.0, 0.3276713901589796, 0.3560578442810529, 0.14047630886698442], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.4359999999999977, 2, 13, 3.0, 4.0, 5.0, 7.990000000000009, 0.3276696722713472, 0.3362166028830344, 0.12063619770146279], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.8140000000000005, 1, 10, 2.0, 3.0, 3.0, 5.0, 0.32771885392784156, 0.1858492340473016, 0.12705506348569637], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 91.47000000000003, 66, 135, 90.0, 111.0, 114.94999999999999, 117.99000000000001, 0.327702315216857, 0.2984875258065573, 0.10688727859612328], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 82.47800000000005, 59, 397, 80.0, 92.90000000000003, 99.94999999999999, 301.6800000000003, 0.32559099649729206, 0.16938044896882073, 96.27509553653815], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 205.15199999999993, 13, 374, 264.0, 338.0, 345.0, 356.96000000000004, 0.32766537763107106, 0.18261905045686386, 0.13727387402707958], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 423.05199999999974, 328, 562, 415.0, 497.0, 505.0, 522.96, 0.3276175000163809, 0.17619358733791124, 0.13949338867884967], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 7.242, 4, 297, 6.0, 8.0, 10.0, 29.930000000000064, 0.3253297868048841, 0.1466875154938311, 0.23605471835549696], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 399.53200000000004, 303, 527, 396.0, 464.90000000000003, 473.0, 491.99, 0.32759903974169474, 0.16850555685776172, 0.13180742614607246], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.574000000000002, 2, 18, 3.0, 4.0, 5.0, 8.0, 0.3257337478403852, 0.19999225059055528, 0.1628668739201926], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.247999999999998, 2, 60, 4.0, 5.0, 6.0, 9.990000000000009, 0.3257212282296074, 0.19076003689607213, 0.1536360871434574], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 672.6359999999994, 540, 874, 673.5, 794.7, 836.95, 856.96, 0.3255704319538263, 0.2974995203940574, 0.14339088360466373], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 240.73599999999996, 173, 344, 235.0, 285.0, 292.0, 302.98, 0.3256503726417214, 0.28835004822067895, 0.133885553595864], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.550000000000001, 3, 62, 4.0, 5.0, 6.0, 10.990000000000009, 0.32574266069211194, 0.2171755584776482, 0.15237376413234535], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 981.9920000000009, 818, 9379, 920.0, 1090.0, 1110.85, 1135.97, 0.32557700384506444, 0.24472644104451616, 0.1799576017346743], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 134.64999999999995, 118, 168, 132.5, 151.0, 153.0, 157.0, 0.32769114716150655, 6.335802726775381, 0.1651256171243529], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 181.6619999999999, 160, 257, 174.0, 204.0, 206.0, 211.99, 0.32766688074236205, 0.6350817723419663, 0.2342306217806729], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 7.238, 5, 32, 7.0, 9.0, 10.0, 13.0, 0.3276067670453801, 0.26736743289794396, 0.20219480153582053], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 7.087999999999997, 5, 15, 7.0, 9.0, 10.0, 13.990000000000009, 0.3276078403108343, 0.27248718131947336, 0.20731433644669986], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.619999999999992, 5, 21, 8.5, 10.0, 12.0, 15.990000000000009, 0.3276037619395191, 0.2651255015204091, 0.19995346798066352], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 9.978000000000005, 7, 20, 10.0, 12.0, 13.0, 18.0, 0.3276044058861339, 0.29295960011132, 0.22778743846770247], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 7.866000000000007, 5, 28, 8.0, 9.0, 10.0, 17.99000000000001, 0.3275752161832639, 0.24590853948460625, 0.1807421847104923], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1615.6180000000008, 1424, 1962, 1591.0, 1799.8000000000002, 1878.8, 1947.95, 0.3272683954292387, 0.2734832408718299, 0.20837792365221056], "isController": false}]}, function(index, item){
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
