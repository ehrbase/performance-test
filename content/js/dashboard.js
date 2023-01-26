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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8668793873643905, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.459, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [0.5, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.728, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.743, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.499, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [0.842, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.475, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 505.5457562220814, 1, 23347, 13.0, 1062.0, 1928.0, 10674.860000000022, 9.787583822192019, 61.74092865440085, 81.09130017620149], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 11296.592000000004, 9216, 23347, 10747.0, 13149.0, 13470.949999999999, 22406.36000000007, 0.21075304169327425, 0.12244710559675777, 0.10661140195030865], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 3.2079999999999993, 2, 9, 3.0, 4.0, 5.0, 7.0, 0.21149196584320154, 0.10857757945647412, 0.07683106571647556], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 4.620000000000004, 2, 19, 4.0, 6.0, 6.0, 10.0, 0.2114908028994543, 0.12132219476484127, 0.08963575044762029], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 16.39799999999997, 10, 459, 14.0, 19.0, 22.0, 46.950000000000045, 0.2102060060900884, 0.1235186093012374, 2.3405946107804567], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 45.33600000000001, 28, 65, 47.0, 57.0, 59.0, 61.0, 0.2114324037919133, 0.8793254808131437, 0.08837213752240126], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.629999999999997, 1, 9, 2.0, 4.0, 4.0, 6.990000000000009, 0.21143812601543158, 0.1321009248092194, 0.08981990704757105], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 39.92999999999995, 25, 61, 40.0, 50.0, 52.0, 55.0, 0.21143052625480846, 0.8677550654261192, 0.07722169611259606], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1163.7, 810, 1734, 1164.0, 1453.6000000000001, 1597.95, 1682.93, 0.211363671911163, 0.8939609990695772, 0.10320491792537256], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 6.856000000000001, 4, 38, 7.0, 8.0, 10.0, 12.990000000000009, 0.21131900674995172, 0.3142359030939639, 0.10834226420285611], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 4.4899999999999975, 3, 26, 4.0, 5.0, 6.0, 11.0, 0.2103679419451798, 0.20291261712761088, 0.11545584313788188], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 10.093999999999989, 7, 42, 10.0, 12.0, 13.0, 16.0, 0.21142998982176028, 0.34460610645753703, 0.13854445622109487], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 528.0, 528, 528, 528.0, 528.0, 528.0, 528.0, 1.893939393939394, 0.8988813920454545, 2240.136348839962], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 5.0100000000000025, 3, 18, 5.0, 6.0, 8.0, 13.0, 0.2103697121469155, 0.21133733064712248, 0.1238798207271387], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 15.953999999999997, 7, 24, 17.0, 20.0, 21.0, 22.0, 0.21142909577272895, 0.33215634830131524, 0.12615544679407947], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 7.877999999999995, 5, 16, 8.0, 9.0, 10.0, 13.990000000000009, 0.21142981101134914, 0.32720208574979986, 0.12120048736685736], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2382.116000000002, 1644, 3831, 2291.5, 3033.6000000000004, 3320.0499999999997, 3617.96, 0.2111733509367439, 0.3224744927668904, 0.11672277014667679], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 13.665999999999997, 9, 103, 12.0, 16.0, 19.0, 35.99000000000001, 0.21020070383603673, 0.12351549365740395, 1.6951537229277258], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 14.968000000000007, 9, 32, 15.0, 18.0, 19.0, 25.0, 0.21143106269057868, 0.3827459718946803, 0.1767431539679056], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 10.314, 6, 29, 10.0, 13.0, 14.0, 17.99000000000001, 0.21143043684911142, 0.35790795687791666, 0.15196562648529882], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 71.0, 71, 71, 71.0, 71.0, 71.0, 71.0, 14.084507042253522, 7.234815140845071, 1920.9121919014087], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 695.0, 695, 695, 695.0, 695.0, 695.0, 695.0, 1.4388489208633093, 0.7278552158273381, 2751.7198741007196], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.980000000000002, 2, 16, 3.0, 4.0, 4.0, 10.0, 0.2103444895843719, 0.17686191946498458, 0.08935532516523612], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 745.7999999999994, 572, 1013, 724.5, 903.7, 930.95, 972.9100000000001, 0.21029415104671811, 0.1851204625356764, 0.09775392177562288], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.8139999999999987, 2, 13, 4.0, 5.0, 6.0, 9.990000000000009, 0.2103648441638271, 0.19058356404221097, 0.10312807790062618], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 988.8699999999997, 791, 1337, 938.5, 1203.9, 1236.0, 1289.99, 0.2102960084555819, 0.19894125620215503, 0.11151438729627047], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 57.0, 57, 57, 57.0, 57.0, 57.0, 57.0, 17.543859649122805, 9.046052631578947, 1155.2391721491229], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 29.345999999999975, 19, 672, 27.0, 33.0, 38.0, 69.97000000000003, 0.21014204341282447, 0.12348102435735411, 9.612356751422556], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 37.366, 27, 241, 35.0, 43.0, 48.0, 128.8800000000001, 0.21027124570153005, 47.583401362652296, 0.06529907825496735], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 1050.0, 1050, 1050, 1050.0, 1050.0, 1050.0, 1050.0, 0.9523809523809523, 0.49944196428571425, 0.392485119047619], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 3.1900000000000035, 2, 10, 3.0, 4.0, 4.0, 7.0, 0.211462001758518, 0.22972124999629942, 0.09106908474170551], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.894000000000001, 2, 16, 4.0, 5.0, 5.0, 9.0, 0.21146101800717446, 0.21702467303368744, 0.07826535725070226], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.2580000000000005, 1, 12, 2.0, 3.0, 4.0, 7.0, 0.21149268150724912, 0.11993741706843225, 0.08240779289198476], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 196.65599999999998, 92, 294, 197.5, 275.90000000000003, 280.0, 289.99, 0.21147550690679007, 0.19262238285842984, 0.06939040070379049], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 111.34600000000006, 81, 394, 109.0, 129.90000000000003, 141.0, 276.8100000000002, 0.210238886036648, 0.12359747011138877, 62.1929329670131], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 266.88399999999973, 17, 479, 326.0, 439.90000000000003, 451.95, 474.99, 0.21145842452477892, 0.11787692054470844, 0.08900252047869113], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 537.3659999999996, 331, 1012, 517.5, 833.6000000000001, 903.95, 944.95, 0.21147980029539498, 0.11373441486394235, 0.09045718020447559], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 8.292000000000007, 5, 269, 7.0, 10.0, 13.0, 30.0, 0.21011996589332713, 0.09884461793991663, 0.1528704829985632], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 539.9480000000003, 314, 1085, 505.5, 876.8000000000001, 932.0, 981.9300000000001, 0.21143481781718923, 0.10875471962157396, 0.08548243610968392], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 4.331999999999996, 2, 16, 4.0, 5.900000000000034, 6.0, 12.0, 0.2103433392257514, 0.12914546953576383, 0.10558249644730101], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.800000000000009, 3, 33, 5.0, 6.0, 6.0, 11.980000000000018, 0.21034059611366301, 0.12318687392121566, 0.09962420812024077], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 918.4940000000003, 603, 1528, 934.5, 1161.8000000000002, 1325.95, 1435.8300000000002, 0.2102599275276082, 0.19213116873716626, 0.09301537809570948], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 526.084000000001, 267, 1057, 427.5, 949.9000000000001, 986.0, 1052.89, 0.21026655912233058, 0.1861824138884847, 0.08685815869994709], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 5.745999999999999, 3, 35, 5.0, 7.0, 8.0, 14.0, 0.2103703317245613, 0.14031536774206577, 0.09881653277296287], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1250.41, 951, 11046, 1150.0, 1485.0, 1500.95, 1550.8300000000002, 0.21028601421365226, 0.15800611821901206, 0.11664302350913525], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 173.40799999999993, 145, 207, 181.0, 193.0, 196.0, 199.0, 0.21155711111148723, 4.090448479390953, 0.10701814800366248], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 232.70000000000007, 198, 353, 225.5, 261.0, 264.0, 270.99, 0.21153867307713461, 0.4100028514091014, 0.15163025980333672], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 9.332, 6, 22, 9.0, 11.0, 13.0, 16.99000000000001, 0.2113172205361456, 0.17252069957833763, 0.13083507599601202], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 9.097999999999995, 6, 20, 9.0, 11.0, 12.0, 15.0, 0.21131775639711678, 0.17570328530432927, 0.13413724771301358], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 10.148, 7, 22, 10.0, 12.0, 13.0, 18.99000000000001, 0.21131552366099918, 0.17101492930967443, 0.12938948567914696], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 12.646000000000003, 8, 25, 13.0, 15.0, 17.0, 21.0, 0.21131623813142347, 0.18896913322199788, 0.14734354885335585], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 9.758, 6, 53, 10.0, 11.0, 12.0, 19.99000000000001, 0.2112670402713007, 0.15859676418647614, 0.11698087093147216], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2072.177999999999, 1693, 2728, 1998.0, 2536.7000000000003, 2641.85, 2698.98, 0.21112038633341734, 0.17642365799743023, 0.13483665299028805], "isController": false}]}, function(index, item){
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
