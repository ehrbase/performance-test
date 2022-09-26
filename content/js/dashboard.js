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

    var data = {"OkPercent": 97.83024888321634, "KoPercent": 2.169751116783663};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9011912359072538, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.99, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.499, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.993, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.987, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.706, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.684, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [0.998, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 510, 2.169751116783663, 185.14162944054553, 1, 3116, 16.0, 542.9000000000015, 1209.9000000000015, 2192.9900000000016, 26.64678974486875, 178.0363350177702, 220.77183349724234], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 25.64599999999997, 16, 62, 27.0, 30.0, 32.0, 41.99000000000001, 0.5770493619565205, 0.335101130064618, 0.2919058295834742], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 7.093999999999996, 4, 34, 7.0, 9.0, 11.0, 17.980000000000018, 0.5770134017132681, 6.175249266183207, 0.2096181498411482], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 7.707999999999995, 4, 61, 7.0, 9.0, 11.949999999999989, 18.99000000000001, 0.5769774459516377, 6.195550007356462, 0.24453926908497145], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 21.416, 14, 246, 20.0, 26.900000000000034, 32.0, 44.0, 0.5738485728385994, 0.3097706327254364, 6.3896693627985455], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 42.301999999999964, 26, 70, 43.0, 53.0, 54.0, 57.0, 0.5767964035590645, 2.3988692050707328, 0.24108287180007776], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.4200000000000004, 1, 20, 2.0, 3.0, 4.0, 6.990000000000009, 0.5768303403529741, 0.36038827459662254, 0.24504023247416376], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 37.40399999999999, 22, 110, 38.0, 47.0, 48.0, 51.98000000000002, 0.576785757544646, 2.367249288174277, 0.21066198566572034], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 770.1039999999994, 585, 1081, 770.5, 920.9000000000001, 935.95, 990.0, 0.5764459570386357, 2.437877770255158, 0.28146775246027134], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 11.291999999999993, 7, 25, 12.0, 14.0, 16.0, 20.0, 0.5766686773181217, 0.8575513754124623, 0.295655327726576], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.4939999999999984, 1, 40, 3.0, 5.0, 6.949999999999989, 15.970000000000027, 0.5746492341075007, 0.5543165280038065, 0.3153836616879057], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 17.772, 11, 45, 18.0, 22.0, 24.0, 28.0, 0.5767631360688055, 0.9398276447906176, 0.37793756279508645], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 725.0, 725, 725, 725.0, 725.0, 725.0, 725.0, 1.379310344827586, 0.5886314655172414, 1631.4372306034484], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.345999999999998, 2, 22, 4.0, 6.0, 7.0, 12.990000000000009, 0.5746598013975726, 0.57733556109783, 0.33839830101829715], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 18.68400000000002, 12, 49, 20.0, 23.0, 25.0, 29.99000000000001, 0.5767598095308405, 0.9061257082610461, 0.34414086291342144], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 10.516000000000005, 6, 38, 11.0, 13.0, 14.0, 19.0, 0.5767591442278521, 0.8926068705856297, 0.33062267349780194], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1915.8599999999997, 1565, 2392, 1895.0, 2172.7000000000003, 2231.5, 2353.8, 0.5756455865252882, 0.8790456641654866, 0.3181791034895635], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 18.197999999999993, 11, 70, 17.0, 23.0, 27.0, 41.0, 0.5738123518846867, 0.3097510802017524, 4.627482814320061], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 22.555999999999983, 14, 94, 23.0, 28.0, 30.0, 37.98000000000002, 0.5767817653905563, 1.0441597457661334, 0.4821535070061681], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 17.832000000000015, 11, 86, 18.0, 22.0, 24.0, 30.0, 0.5767751119232105, 0.9764915296249, 0.4145571116948075], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 98.0, 98, 98, 98.0, 98.0, 98.0, 98.0, 10.204081632653061, 4.753268494897959, 1391.681281887755], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 712.0, 712, 712, 712.0, 712.0, 712.0, 712.0, 1.4044943820224718, 0.6432693995786517, 2686.0186973314608], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.1540000000000012, 1, 18, 2.0, 3.0, 4.0, 7.990000000000009, 0.5745614085487843, 0.4828425549481803, 0.24407637960812611], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 407.24, 309, 554, 407.0, 476.0, 486.9, 530.99, 0.5743548272225809, 0.505698111420816, 0.2669852517167466], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 2.897999999999998, 1, 18, 3.0, 4.0, 5.0, 7.990000000000009, 0.5746267799064508, 0.5206253304103985, 0.28170180030570147], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1163.3399999999995, 945, 1523, 1158.0, 1335.9, 1375.9, 1434.92, 0.5739921845224155, 0.5429999697936613, 0.3043728087848356], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 57.0, 57, 57, 57.0, 57.0, 57.0, 57.0, 17.543859649122805, 8.20655153508772, 1155.2391721491229], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 3, 0.6, 44.44999999999999, 13, 652, 43.0, 51.0, 57.94999999999999, 88.99000000000001, 0.5733938378511033, 0.3088912921258118, 26.22828844232977], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 44.576000000000015, 10, 185, 45.0, 55.0, 58.0, 83.94000000000005, 0.574179382826065, 128.46478006991782, 0.17830961302606316], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 261.0, 261, 261, 261.0, 261.0, 261.0, 261.0, 3.8314176245210727, 2.009249281609195, 1.578963122605364], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.1679999999999997, 1, 21, 2.0, 3.0, 4.0, 8.0, 0.577055355766168, 0.6270134723671272, 0.24851700380164068], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.0300000000000002, 1, 18, 3.0, 4.0, 5.0, 9.0, 0.5770480300157302, 0.59206705745321, 0.2135753939218377], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.1380000000000026, 1, 13, 2.0, 3.0, 4.0, 7.0, 0.577035376884886, 0.3272365368269748, 0.22484093298541946], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 122.35799999999998, 84, 250, 121.0, 149.90000000000003, 153.0, 159.99, 0.5769714537603537, 0.5255669033018922, 0.18931875826511607], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 6, 1.2, 167.59799999999987, 33, 566, 169.0, 196.90000000000003, 217.95, 322.97, 0.573923663561357, 0.30844473610129064, 169.7782775058655], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 2.2779999999999974, 1, 18, 2.0, 3.0, 4.0, 8.0, 0.5770440342302521, 0.3216389348921216, 0.24287693237620964], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 3.056, 2, 13, 3.0, 4.0, 5.0, 8.990000000000009, 0.5770959837582107, 0.3103964851392013, 0.24684378992782838], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 11.595999999999997, 7, 319, 10.0, 15.0, 19.0, 41.8900000000001, 0.5732097798759803, 0.24218784929970963, 0.41703250586680213], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 4.428000000000002, 2, 60, 4.0, 5.0, 6.0, 11.0, 0.5770573537303872, 0.2968836107777002, 0.23330248480896515], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.561999999999999, 2, 14, 3.0, 4.0, 6.0, 10.990000000000009, 0.5745528255358854, 0.35279338965483165, 0.2883985862553175], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 3.922000000000004, 2, 24, 4.0, 5.0, 6.0, 15.960000000000036, 0.5745389612105766, 0.33651375360092295, 0.2721205040889938], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 532.2079999999999, 374, 818, 540.5, 641.0, 650.95, 718.99, 0.5740659946267423, 0.5245696209298721, 0.25395692926358815], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 16.574, 7, 103, 15.0, 28.0, 36.0, 51.99000000000001, 0.5742954543366198, 0.5084825412746143, 0.23723337615663107], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 9.837999999999994, 6, 63, 10.0, 12.0, 13.0, 20.0, 0.5746697085849908, 0.3830398088073879, 0.26993762678650446], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 523.4840000000003, 428, 3116, 511.0, 578.0, 608.95, 685.98, 0.57441883174698, 0.4317408229411393, 0.31862294573465294], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 174.54800000000012, 144, 272, 181.0, 191.0, 195.0, 249.8900000000001, 0.5768802546580196, 11.153826489995167, 0.29182028507114666], "isController": false}, {"data": ["Query single patient #1", 500, 1, 0.2, 265.4080000000001, 18, 377, 270.0, 289.0, 294.95, 345.93000000000006, 0.5769601355163967, 1.1164899822411671, 0.4135632221377296], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 18.259999999999994, 12, 40, 19.0, 22.0, 23.0, 27.99000000000001, 0.5766420748043165, 0.47054556431058403, 0.35702253459564126], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 18.002, 11, 35, 19.0, 22.0, 23.94999999999999, 27.0, 0.5766580360180609, 0.4796015329012242, 0.3660426986442769], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 17.854000000000006, 12, 49, 19.0, 22.0, 23.0, 29.0, 0.5766148097747743, 0.4666795924486525, 0.3530639509070151], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 20.849999999999987, 13, 50, 22.0, 26.0, 27.0, 33.99000000000001, 0.576630769479164, 0.5156836001019484, 0.4020648138751202], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 17.57400000000001, 11, 84, 19.0, 22.0, 23.0, 30.0, 0.5764745353903482, 0.4327882574443039, 0.3192002554358666], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2139.7659999999973, 1652, 2718, 2139.5, 2440.9, 2529.35, 2619.91, 0.5753581028832345, 0.48080047091622324, 0.3674650383648783], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["No results for path: $['rows'][1]", 500, 98.03921568627452, 2.1272069772388855], "isController": false}, {"data": ["400", 1, 0.19607843137254902, 0.0042544139544777706], "isController": false}, {"data": ["500", 9, 1.7647058823529411, 0.03828972559029994], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 23505, 510, "No results for path: $['rows'][1]", 500, "500", 9, "400", 1, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Query cross patient #1", 500, 500, "No results for path: $['rows'][1]", 500, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 3, "500", 3, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 6, "500", 6, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Query single patient #1", 500, 1, "400", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
