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

    var data = {"OkPercent": 97.79621357158051, "KoPercent": 2.2037864284194852};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8988725803020634, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [0.998, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.988, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.492, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.991, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.973, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.725, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.582, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [0.999, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 518, 2.2037864284194852, 191.76647521803977, 1, 3581, 17.0, 567.0, 1256.6000000000058, 2274.9900000000016, 25.73025540877226, 170.26497329411856, 213.17823712857793], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 27.466000000000015, 18, 53, 29.0, 33.0, 34.94999999999999, 45.0, 0.557024863361801, 0.32331485531000664, 0.28177624923966105], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 7.485999999999998, 4, 35, 7.0, 10.0, 12.0, 21.0, 0.5568951978927086, 5.9463159120272655, 0.20230958360946052], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 7.905999999999995, 4, 37, 7.0, 10.0, 11.0, 17.99000000000001, 0.5568778310276734, 5.979626894289551, 0.23602048697852565], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 22.208000000000002, 14, 260, 20.0, 28.0, 32.0, 53.950000000000045, 0.5541897856172233, 0.2992841322718013, 6.170773374616778], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 42.64, 25, 76, 43.0, 53.0, 56.0, 64.99000000000001, 0.5567302563965523, 2.3155096402715283, 0.23269584935324647], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.5719999999999987, 1, 13, 2.0, 3.0, 4.0, 7.0, 0.5567624929151973, 0.3479765580719983, 0.23651531681456134], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 37.861999999999966, 22, 79, 38.0, 47.0, 49.0, 65.92000000000007, 0.5567203382187398, 2.284959679877455, 0.20333340477911008], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 778.7180000000001, 576, 1268, 769.5, 918.9000000000001, 940.95, 1084.99, 0.5563981897028499, 2.3529351343339973, 0.27167880356584473], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 12.375999999999989, 7, 36, 13.0, 15.0, 17.94999999999999, 22.99000000000001, 0.5564941757319568, 0.8275503154208989, 0.28531195533132553], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.69, 2, 21, 3.0, 5.0, 7.0, 13.990000000000009, 0.5548638253199899, 0.5353254661272281, 0.30452487288069763], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 19.53400000000001, 13, 44, 20.0, 24.0, 26.0, 35.98000000000002, 0.5566899659973769, 0.9069925635266755, 0.36478414764085926], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 684.0, 684, 684, 684.0, 684.0, 684.0, 684.0, 1.461988304093567, 0.6239149305555555, 1729.2280587536548], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.886000000000001, 2, 25, 4.0, 6.0, 8.0, 16.0, 0.554874909000515, 0.557584259142119, 0.32674762707745164], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 20.602, 13, 48, 21.0, 26.0, 27.0, 36.98000000000002, 0.5566775701246734, 0.8747013772759762, 0.33215819858024953], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 11.714000000000002, 7, 31, 12.0, 15.0, 16.0, 23.980000000000018, 0.556672611930162, 0.8616150418923975, 0.31910822578418474], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2032.8360000000005, 1575, 2704, 2018.5, 2294.9, 2364.95, 2553.95, 0.5554845769707204, 0.8483215078767713, 0.3070354204740505], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 1, 0.2, 19.044000000000015, 7, 181, 17.0, 24.0, 29.0, 53.950000000000045, 0.5541560037815606, 0.2989465996571991, 4.468965116433718], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 24.431999999999984, 16, 79, 25.0, 30.0, 31.0, 42.97000000000003, 0.5567054616146017, 1.0078467373858893, 0.46537097181845616], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 19.755999999999997, 12, 44, 21.0, 25.0, 27.0, 35.99000000000001, 0.5566986434367457, 0.9423755493223863, 0.4001271499701609], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 86.0, 86, 86, 86.0, 86.0, 86.0, 86.0, 11.627906976744185, 5.416515261627907, 1585.8693677325582], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 617.0, 617, 617, 617.0, 617.0, 617.0, 617.0, 1.6207455429497568, 0.7423141207455429, 3099.58721636953], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.4999999999999987, 1, 49, 2.0, 3.0, 4.0, 9.0, 0.5549026201391918, 0.4661962340978782, 0.2357252341411606], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 412.95200000000034, 319, 579, 411.0, 482.0, 494.0, 535.98, 0.5546933156127309, 0.48822978919435234, 0.25784572092935537], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.2239999999999993, 2, 20, 3.0, 4.0, 5.0, 10.0, 0.5549660582758759, 0.5027808221905398, 0.2720634387250876], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1198.7540000000015, 939, 1816, 1196.5, 1381.8000000000002, 1410.0, 1594.3000000000006, 0.5542708788297346, 0.5243434990538596, 0.2939151242231894], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 61.0, 61, 61, 61.0, 61.0, 61.0, 61.0, 16.393442622950822, 7.668417008196721, 1079.4857838114754], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 4, 0.8, 45.001999999999995, 12, 718, 43.0, 51.0, 58.0, 103.98000000000002, 0.5537245729676094, 0.29807037022578675, 25.328573240041816], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 45.844000000000015, 9, 191, 47.0, 57.0, 63.94999999999999, 89.99000000000001, 0.5545247556486664, 122.41155208845113, 0.17220592997683196], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 280.0, 280, 280, 280.0, 280.0, 280.0, 280.0, 3.571428571428571, 1.8729073660714284, 1.4718191964285714], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.3920000000000003, 1, 10, 2.0, 4.0, 4.949999999999989, 7.0, 0.5569187689421996, 0.605070487816288, 0.2398448995151465], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.529999999999997, 2, 20, 3.0, 5.0, 6.0, 15.960000000000036, 0.5569125658409881, 0.571249801251828, 0.20612291255247508], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.386000000000001, 1, 26, 2.0, 3.0, 4.0, 10.0, 0.5569063628779584, 0.315884467895462, 0.2169976941292045], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 122.43799999999995, 85, 282, 119.0, 149.0, 156.89999999999998, 230.9000000000001, 0.5568468214626584, 0.5073298704189604, 0.1827153632924348], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 13, 2.6, 166.63599999999985, 27, 605, 169.0, 198.0, 225.95, 328.6800000000003, 0.5542733365702897, 0.29640199699140435, 163.96531163464076], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 2.424, 1, 15, 2.0, 4.0, 4.0, 8.990000000000009, 0.5569094643422008, 0.31054228919862953, 0.23440232337059427], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 3.5559999999999996, 2, 23, 3.0, 5.0, 6.0, 11.0, 0.556957851657618, 0.29959654843472566, 0.23823001858011392], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 12.148, 6, 357, 10.0, 14.900000000000034, 20.0, 43.8900000000001, 0.5535235092504849, 0.23380746542692163, 0.4027099749918079], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 4.672000000000003, 2, 62, 4.0, 6.0, 7.0, 10.0, 0.5569206298995092, 0.2865552433241924, 0.22516127029140315], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.9339999999999966, 2, 27, 4.0, 5.0, 7.0, 12.0, 0.55489523023158, 0.3408487302887342, 0.278531394862336], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.077999999999998, 2, 26, 4.0, 5.0, 6.0, 10.970000000000027, 0.5548816825788236, 0.3250945570407272, 0.26281017192454054], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 527.18, 385, 822, 517.0, 639.0, 662.8, 786.4600000000005, 0.554442973322422, 0.5066071063233112, 0.24527604190923546], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 16.659999999999993, 6, 105, 15.0, 26.900000000000034, 31.94999999999999, 52.97000000000003, 0.5546367074102792, 0.49110805564059984, 0.22911262425248838], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 10.937999999999995, 7, 45, 11.0, 13.0, 15.0, 20.99000000000001, 0.5548853773276055, 0.3697584920351753, 0.2606444008736115], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 565.8659999999996, 449, 2790, 543.0, 652.9000000000001, 702.8, 763.99, 0.5546305550409817, 0.4167106182494529, 0.30764663599929454], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 174.70999999999995, 142, 336, 178.0, 190.0, 193.0, 295.8900000000001, 0.5569082237523585, 10.767798752024362, 0.28171724599972825], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 268.80199999999985, 215, 518, 271.0, 292.0, 300.95, 394.8800000000001, 0.5568319380981072, 1.0793741219456376, 0.3991353931289166], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 19.800000000000008, 13, 55, 20.0, 24.0, 25.0, 33.0, 0.5564514423777839, 0.4539437400464748, 0.3445216938159325], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 19.74600000000001, 12, 55, 21.0, 24.0, 27.0, 40.97000000000003, 0.5564669247189286, 0.46268268461346695, 0.35322607526103866], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 19.53399999999996, 13, 53, 21.0, 24.0, 26.0, 35.97000000000003, 0.556432245471198, 0.4504395101810408, 0.3407060721781652], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 22.511999999999993, 15, 64, 23.0, 28.0, 30.0, 38.99000000000001, 0.5564402956256003, 0.49775323319633774, 0.38798669050456897], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 19.91400000000001, 12, 64, 21.0, 24.0, 26.0, 37.98000000000002, 0.5563393759207417, 0.41764027506253254, 0.3080511974092388], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2213.6259999999993, 1653, 3581, 2211.5, 2546.5, 2651.75, 2807.92, 0.5552674334539744, 0.46404306737503986, 0.35463369285048757], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["No results for path: $['rows'][1]", 500, 96.52509652509653, 2.1272069772388855], "isController": false}, {"data": ["500", 18, 3.474903474903475, 0.07657945118059988], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 23505, 518, "No results for path: $['rows'][1]", 500, "500", 18, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Query cross patient #1", 500, 500, "No results for path: $['rows'][1]", 500, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 4, "500", 4, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 13, "500", 13, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
