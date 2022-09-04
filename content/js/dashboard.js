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

    var data = {"OkPercent": 97.8174856413529, "KoPercent": 2.1825143586470963};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9002339927674963, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.001, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.982, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.495, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.987, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [0.999, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.985, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.702, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.662, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [0.999, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 513, 2.1825143586470963, 187.66594341629582, 1, 3538, 17.0, 537.0, 1183.9500000000007, 2199.980000000003, 26.233053982837188, 175.02659760540377, 217.34398332686018], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 25.672000000000004, 16, 127, 26.0, 30.0, 32.0, 42.98000000000002, 0.5683516778309881, 0.33008244758092475, 0.287506024527785], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 7.494000000000009, 4, 61, 7.0, 10.0, 12.0, 22.970000000000027, 0.5681566385126113, 6.071901092593624, 0.2064006538346596], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 7.9119999999999955, 4, 45, 7.0, 10.0, 12.0, 25.99000000000001, 0.5681327521714034, 6.100640562576413, 0.24079063910389556], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 21.85, 14, 242, 20.0, 26.0, 30.899999999999977, 58.0, 0.56471651231082, 0.3048410323017845, 6.287986009148407], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 43.98599999999999, 27, 227, 45.0, 53.0, 55.94999999999999, 69.92000000000007, 0.5678907741600612, 2.3617989441632754, 0.23736059701221304], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.483999999999998, 1, 13, 2.0, 3.0, 4.0, 8.0, 0.5679223809123559, 0.3548871531130097, 0.2412560895477293], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 38.27399999999996, 22, 98, 39.0, 47.0, 48.0, 61.92000000000007, 0.5678849692206347, 2.330622096688095, 0.20741111180519273], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 781.2739999999999, 576, 1190, 776.0, 926.0, 940.95, 1038.5800000000004, 0.5675549279659285, 2.4002762538139693, 0.27712642967086354], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 12.169999999999996, 7, 80, 12.0, 15.0, 19.0, 30.99000000000001, 0.5676270917058329, 0.8441379819863543, 0.29101974916558815], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.363999999999998, 2, 20, 3.0, 5.0, 6.0, 12.990000000000009, 0.5655328110826333, 0.5454586054017432, 0.31038031233246094], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 18.958, 11, 71, 19.0, 23.0, 26.0, 39.960000000000036, 0.5678707798682995, 0.9253698364929663, 0.37211063798010635], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 647.0, 647, 647, 647.0, 647.0, 647.0, 647.0, 1.5455950540958268, 0.6595947642967542, 1828.11745314915], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.319999999999996, 2, 23, 4.0, 6.0, 7.0, 12.990000000000009, 0.5655430457433838, 0.5682083882617016, 0.33302974275709024], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 19.674000000000003, 12, 53, 20.0, 24.0, 26.94999999999999, 44.99000000000001, 0.5678520768054005, 0.8921632669126224, 0.33882579973447235], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 11.158000000000001, 6, 71, 11.0, 14.0, 17.0, 23.99000000000001, 0.5678469175565775, 0.8787819225791834, 0.3255138091852646], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1965.4720000000002, 1492, 3538, 1948.5, 2209.0, 2287.9, 2592.98, 0.5666807581281854, 0.8652595369538189, 0.31322393466850873], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 18.612, 13, 76, 17.0, 23.900000000000034, 30.94999999999999, 51.97000000000003, 0.5646782463352382, 0.3047564083922481, 4.553821248277731], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 23.433999999999987, 15, 76, 24.0, 28.0, 31.0, 39.0, 0.5678849692206347, 1.0280858603031369, 0.4747163414578743], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 18.688000000000006, 12, 50, 20.0, 24.0, 25.0, 38.92000000000007, 0.5678791643998824, 0.9614948467805225, 0.4081631494124154], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 88.0, 88, 88, 88.0, 88.0, 88.0, 88.0, 11.363636363636363, 5.293412642045455, 1549.8268821022727], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 716.0, 716, 716, 716.0, 716.0, 716.0, 716.0, 1.3966480446927374, 0.6396757157821229, 2671.013006284916], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.3980000000000006, 1, 53, 2.0, 3.0, 4.0, 12.0, 0.5654598998457425, 0.47519394567739837, 0.24021001604775197], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 411.14799999999974, 314, 594, 415.0, 476.0, 493.0, 558.94, 0.5652636446164856, 0.4977576962764953, 0.2627592723021945], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.025999999999999, 2, 45, 3.0, 4.0, 5.0, 10.990000000000009, 0.5655065864552125, 0.5123942520355409, 0.27723076796925455], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1152.3139999999992, 923, 2309, 1135.0, 1335.6000000000001, 1365.95, 1510.6900000000003, 0.5649232382303893, 0.5342927030418857, 0.2995637874600599], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 63.0, 63, 63, 63.0, 63.0, 63.0, 63.0, 15.873015873015872, 7.424975198412699, 1045.2163938492063], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 6, 1.2, 45.69999999999997, 14, 694, 43.0, 52.0, 59.94999999999999, 133.7800000000002, 0.5642455641834971, 0.30324341927451565, 25.809826392924812], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 45.474000000000025, 9, 214, 45.0, 55.0, 63.94999999999999, 111.85000000000014, 0.5650113341273626, 126.17259715511143, 0.17546250415283332], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 305.0, 305, 305, 305.0, 305.0, 305.0, 305.0, 3.278688524590164, 1.719390368852459, 1.3511782786885247], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.292, 1, 25, 2.0, 3.0, 4.0, 12.0, 0.5681921489481627, 0.6174473058601065, 0.24469993914662083], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.2559999999999993, 2, 28, 3.0, 4.0, 6.0, 15.990000000000009, 0.568185692175174, 0.5830062388919697, 0.21029529036561612], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.2760000000000007, 1, 25, 2.0, 3.0, 4.0, 11.970000000000027, 0.5681682596210772, 0.3221114538743962, 0.22138587459844708], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 124.56800000000004, 85, 639, 123.0, 151.0, 155.0, 179.98000000000002, 0.5681024129581889, 0.5174558609279611, 0.1864086042519057], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 7, 1.4, 172.48399999999995, 27, 799, 173.5, 208.0, 238.95, 351.98, 0.5647605245947561, 0.3033227297191672, 167.06763487328467], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 2.359999999999998, 1, 22, 2.0, 3.0, 4.0, 14.0, 0.5681824638437089, 0.3167639430556171, 0.2391471112467173], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 3.3960000000000012, 2, 40, 3.0, 5.0, 6.0, 12.990000000000009, 0.5682283095889664, 0.30553036903303454, 0.24305078085934304], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 12.56600000000001, 7, 317, 10.0, 16.0, 22.0, 54.960000000000036, 0.564067331589237, 0.23842090513910466, 0.41038101761131024], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 4.448000000000004, 2, 52, 4.0, 5.0, 7.0, 16.99000000000001, 0.5681966687765704, 0.29232497873523966, 0.22972013757177745], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.778, 2, 54, 3.0, 5.0, 6.0, 12.0, 0.5654515866006069, 0.34723697206612614, 0.2838301909303827], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.044000000000004, 2, 29, 4.0, 5.0, 6.0, 12.990000000000009, 0.5654336819797416, 0.33111663893214455, 0.2678079450782956], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 527.358, 382, 877, 529.5, 632.9000000000001, 647.95, 736.8500000000001, 0.5649443021412519, 0.5161064119907168, 0.2499216492870968], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 16.038, 6, 106, 15.0, 24.900000000000034, 35.0, 52.97000000000003, 0.5651441682773276, 0.5004760015061092, 0.23345310857549761], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 9.987999999999987, 6, 61, 10.0, 13.0, 14.0, 17.0, 0.5655520013754224, 0.3770265672294286, 0.26565479752107246], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 525.5519999999996, 351, 3260, 512.5, 570.0, 600.95, 675.8300000000002, 0.5653671890282582, 0.42500153355850023, 0.313602112664112], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 175.31599999999983, 142, 266, 181.0, 193.0, 202.0, 233.97000000000003, 0.5682186232517333, 10.986420516016379, 0.2874387176214823], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 267.0879999999999, 212, 710, 270.0, 293.90000000000003, 304.0, 352.98, 0.5680914399981821, 1.1011032335764765, 0.40720616890494693], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 18.955999999999996, 12, 43, 20.0, 23.0, 25.0, 31.0, 0.5676103377735598, 0.4632077284972176, 0.35143061928558295], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 18.727999999999977, 12, 64, 20.0, 23.0, 24.0, 35.97000000000003, 0.5676142039778402, 0.4721441555603487, 0.3603019849468713], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 18.489999999999984, 12, 44, 19.0, 23.0, 26.0, 36.99000000000001, 0.567590363223777, 0.4593435643624768, 0.34753823998174627], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 21.771999999999988, 14, 101, 23.0, 27.0, 29.0, 46.960000000000036, 0.5676071159768915, 0.5076458540982937, 0.3957729304760748], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 17.97400000000001, 11, 75, 19.0, 23.0, 25.0, 29.99000000000001, 0.5674499367293321, 0.4260451807186186, 0.31420323645071413], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2180.953999999998, 1671, 3081, 2163.0, 2485.0, 2594.5, 2698.9, 0.5663963823130269, 0.47318324643396836, 0.3617414394850777], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["No results for path: $['rows'][1]", 500, 97.46588693957115, 2.1272069772388855], "isController": false}, {"data": ["500", 13, 2.53411306042885, 0.055307381408211016], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 23505, 513, "No results for path: $['rows'][1]", 500, "500", 13, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Query cross patient #1", 500, 500, "No results for path: $['rows'][1]", 500, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 6, "500", 6, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 7, "500", 7, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
