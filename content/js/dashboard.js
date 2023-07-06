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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8865560519038502, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.159, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.582, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.912, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.988, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.497, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.032, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 334.6537757923855, 1, 19778, 10.0, 856.9000000000015, 1540.0, 6328.950000000008, 14.833602384988307, 93.44069544856738, 122.74932559922894], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6483.790000000005, 5530, 19778, 6311.0, 6856.5, 7104.9, 16601.550000000083, 0.3196982048945795, 0.18567160100864785, 0.16109792356015923], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.4260000000000024, 1, 9, 2.0, 3.0, 4.0, 6.0, 0.32086700832585713, 0.16472948725291636, 0.11593827449274134], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.6759999999999966, 2, 13, 4.0, 5.0, 5.0, 9.0, 0.3208647433178313, 0.184155681929026, 0.1353648135872101], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 13.703999999999994, 8, 384, 12.0, 15.900000000000034, 19.0, 44.950000000000045, 0.3190763632697159, 0.16599137644278356, 3.510774789999892], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 33.839999999999996, 23, 50, 33.0, 40.0, 41.0, 43.99000000000001, 0.32080195355557634, 1.3341821168229187, 0.13345862520964408], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.495999999999999, 1, 9, 2.0, 3.0, 4.0, 7.0, 0.32081059855558236, 0.20041576953319493, 0.13565526286578825], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 29.898000000000003, 21, 41, 30.0, 35.0, 36.0, 38.0, 0.3207998952909142, 1.3166298124395293, 0.11654058696115241], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 868.1819999999997, 678, 1109, 869.5, 1021.5000000000002, 1059.0, 1089.99, 0.3206639025438267, 1.3561546576031014, 0.15594787447932199], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 5.891999999999997, 3, 15, 6.0, 8.0, 9.0, 13.0, 0.32077993149423784, 0.47700664988827235, 0.16383584391746717], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.958000000000001, 2, 26, 4.0, 5.0, 6.0, 9.990000000000009, 0.3192154959970377, 0.30790267338987704, 0.17457097437337998], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 8.28000000000001, 5, 22, 8.0, 10.0, 11.0, 16.0, 0.32079680794344223, 0.5227703529133804, 0.20958307081461217], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 536.0, 536, 536, 536.0, 536.0, 536.0, 536.0, 1.8656716417910448, 0.8071216184701492, 2206.6978340718283], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.209999999999997, 2, 20, 4.0, 5.0, 6.0, 10.0, 0.31922018339837976, 0.32068847154662816, 0.18735481467033813], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 8.327999999999994, 5, 27, 8.0, 10.0, 11.0, 15.990000000000009, 0.3207945439263969, 0.5039701081639003, 0.19078503637810126], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.672000000000005, 5, 21, 6.0, 8.0, 9.0, 11.990000000000009, 0.32079351483830404, 0.4964498934564539, 0.18326582634805455], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1592.614, 1346, 1996, 1571.5, 1790.9, 1861.75, 1957.89, 0.3204789237035826, 0.4893907204927043, 0.17651378219611388], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 11.981999999999994, 8, 73, 11.0, 14.0, 18.0, 35.99000000000001, 0.3190645537786496, 0.16598523285490668, 2.5724579648403627], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 11.596000000000002, 8, 24, 11.0, 14.0, 16.0, 19.0, 0.32080071859360965, 0.5807338867814065, 0.2675427867958424], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 8.234000000000004, 5, 21, 8.0, 10.0, 11.0, 15.990000000000009, 0.3207990719924445, 0.5431372647500206, 0.22994777230708427], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 55.0, 55, 55, 55.0, 55.0, 55.0, 55.0, 18.18181818181818, 8.575994318181818, 2479.6875], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 575.0, 575, 575, 575.0, 575.0, 575.0, 575.0, 1.7391304347826089, 0.806725543478261, 3325.988451086957], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.4139999999999997, 1, 20, 2.0, 3.0, 4.0, 8.0, 0.3192456608129782, 0.26833782492025243, 0.13499352649611288], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 571.3600000000005, 439, 728, 561.0, 662.0, 675.0, 715.9000000000001, 0.319129313112449, 0.28101766887365864, 0.14772196720244224], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.3460000000000014, 2, 10, 3.0, 4.0, 5.0, 8.0, 0.31923078150887624, 0.28921248858749954, 0.15587440503363095], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 776.9840000000005, 630, 943, 760.0, 891.9000000000001, 912.95, 936.94, 0.3190828792252157, 0.3018542733732995, 0.16857796646566572], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 64.0, 64, 64, 64.0, 64.0, 64.0, 64.0, 15.625, 7.4005126953125, 1028.8543701171875], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 23.644000000000002, 16, 601, 21.0, 26.0, 29.0, 77.93000000000006, 0.3189440655034564, 0.16592255188901, 14.548708300455516], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 30.05600000000004, 20, 247, 28.0, 35.0, 38.0, 98.0, 0.31919267235765925, 72.19200308543607, 0.0985008637353714], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 402.0, 402, 402, 402.0, 402.0, 402.0, 402.0, 2.487562189054726, 1.304512593283582, 1.0202891791044775], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.704000000000002, 1, 11, 3.0, 4.0, 4.0, 7.0, 0.32082480206713837, 0.34861813037902883, 0.13754110166745484], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.4820000000000007, 2, 10, 3.0, 5.0, 5.0, 7.0, 0.32082336107385995, 0.3291917126112455, 0.11811563195785664], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.9940000000000004, 1, 20, 2.0, 3.0, 3.0, 7.0, 0.320868037885531, 0.18196413894580732, 0.12439903421929277], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 91.89200000000001, 65, 120, 91.0, 111.0, 114.0, 117.0, 0.32085197750699296, 0.2922478983794408, 0.10465289110091372], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 81.912, 58, 375, 80.0, 91.90000000000003, 100.94999999999999, 316.7500000000002, 0.31913888669037654, 0.16602390266487355, 94.36724951267493], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 203.65999999999988, 13, 373, 260.0, 330.0, 334.0, 341.99, 0.3208192440215334, 0.17880346753469661, 0.13440571844261506], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 444.8440000000001, 343, 577, 435.0, 515.8000000000001, 534.95, 552.99, 0.32072622680989016, 0.17248744176413536, 0.13655921375889854], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 7.295999999999996, 4, 294, 6.0, 8.0, 10.0, 34.91000000000008, 0.3188881263919467, 0.14378304378557197, 0.2313807401457191], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 417.2880000000001, 316, 529, 416.5, 484.0, 491.95, 515.96, 0.32073425050499604, 0.16497454793309227, 0.1290454211016195], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.605999999999997, 2, 22, 3.0, 5.0, 5.0, 11.0, 0.3192430109723823, 0.19600710295746726, 0.15962150548619114], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.191999999999999, 2, 31, 4.0, 5.0, 6.0, 8.990000000000009, 0.3192370999480282, 0.18696257930647656, 0.1505776555418922], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 683.3399999999999, 512, 868, 689.0, 795.7, 832.0, 864.96, 0.3190961155791658, 0.2915834241294739, 0.1405394024669959], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 247.9619999999999, 178, 326, 243.5, 293.0, 300.0, 312.99, 0.3191814655153153, 0.28262209628651513, 0.13122597361518332], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.711999999999999, 3, 50, 4.0, 6.0, 6.949999999999989, 9.990000000000009, 0.3192234442805055, 0.2128291383249452, 0.14932424786168177], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1004.0219999999998, 840, 8191, 958.0, 1104.0, 1137.95, 1161.99, 0.3190535595210368, 0.23982296415911838, 0.17635186981338558], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 135.20399999999975, 118, 171, 136.0, 150.90000000000003, 153.95, 165.0, 0.32079927781666573, 6.202550654005468, 0.16165276108730425], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 183.31799999999993, 159, 251, 178.5, 203.0, 205.0, 211.99, 0.3207723170924171, 0.6217187748598546, 0.22930208604653252], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 7.526000000000001, 5, 23, 7.0, 9.0, 11.0, 13.990000000000009, 0.3207764329404036, 0.2617930398170163, 0.19797920470540534], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 7.324000000000004, 4, 18, 7.0, 9.0, 10.0, 15.0, 0.32077787351215203, 0.26680636977444827, 0.20299224808190872], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.474000000000009, 5, 23, 8.0, 10.0, 11.0, 15.990000000000009, 0.3207716997243288, 0.25959640163920755, 0.1957835081325249], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 10.06399999999999, 7, 28, 10.0, 12.0, 13.0, 17.99000000000001, 0.3207739634189372, 0.2868514902757373, 0.22303814643972977], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 7.916000000000003, 5, 28, 8.0, 9.0, 10.0, 16.970000000000027, 0.3207282841293382, 0.24076859305963236, 0.1769643364580821], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1658.4960000000008, 1409, 2054, 1634.5, 1845.9, 1910.6999999999998, 2033.98, 0.32042326631787527, 0.26776307931725496, 0.20401950160083465], "isController": false}]}, function(index, item){
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
