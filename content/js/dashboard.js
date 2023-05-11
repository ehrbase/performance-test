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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8916400765794512, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.197, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.627, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.95, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.999, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.497, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.137, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 324.48640714741515, 1, 18885, 9.0, 843.0, 1495.0, 6039.0, 15.269828689477754, 96.18859769149815, 126.35913549536806], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6186.627999999991, 4997, 18885, 6032.5, 6485.8, 6683.45, 16143.720000000081, 0.32926732094278455, 0.19122907074012052, 0.16591986094382502], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.3560000000000025, 1, 9, 2.0, 3.0, 4.0, 5.0, 0.3303129517029615, 0.16957892757789442, 0.11935135950204663], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.7139999999999955, 2, 15, 4.0, 5.0, 5.0, 7.990000000000009, 0.33031033316421443, 0.18957684170306685, 0.13934967180365296], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 12.610000000000001, 8, 354, 11.0, 15.0, 18.0, 36.0, 0.3283649526891776, 0.1708235292451678, 3.6129764862782854], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 34.383999999999986, 24, 54, 34.0, 41.0, 42.0, 45.0, 0.33023964830798413, 1.3734325123493116, 0.13738485369062622], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.329999999999999, 1, 15, 2.0, 3.0, 4.0, 6.0, 0.3302488094530419, 0.20631197841328658, 0.13964622509098354], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 30.17000000000001, 22, 51, 30.0, 35.0, 37.0, 39.0, 0.3302387758444866, 1.3553689508099436, 0.11996955528725489], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 866.2460000000002, 673, 1113, 869.5, 1016.7, 1062.95, 1085.97, 0.33009531832411926, 1.3960420859564908, 0.16053463723184708], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 5.712000000000001, 3, 15, 5.0, 7.0, 9.0, 12.0, 0.3301794591396316, 0.4909839494399496, 0.1686365792285423], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.962, 2, 21, 4.0, 5.0, 5.0, 11.0, 0.3285012982371306, 0.31685939187675416, 0.1796491474734308], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 7.908000000000007, 5, 19, 8.0, 10.0, 11.0, 13.990000000000009, 0.3302427019665292, 0.5381633781236006, 0.21575426524961724], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 486.0, 486, 486, 486.0, 486.0, 486.0, 486.0, 2.05761316872428, 0.8901588220164609, 2433.7243602109056], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.066000000000004, 2, 21, 4.0, 5.0, 5.949999999999989, 10.990000000000009, 0.3285036723425531, 0.33001466091358184, 0.19280342488073673], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 8.289999999999983, 5, 21, 8.0, 10.0, 11.0, 15.0, 0.3302407388938388, 0.5188101358065502, 0.1964029394397928], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.882, 5, 16, 7.0, 8.0, 9.0, 12.0, 0.33023921207565915, 0.5110677556332205, 0.18866204986744198], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1560.162, 1330, 1926, 1538.0, 1765.8000000000002, 1810.0, 1903.96, 0.3298803655866164, 0.5037472914760233, 0.18169192010825355], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 11.186000000000005, 7, 57, 10.0, 13.0, 17.94999999999999, 39.0, 0.32835805212749747, 0.17081993940316326, 2.6473867952779484], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 11.181999999999999, 8, 21, 11.0, 14.0, 14.0, 18.99000000000001, 0.33024531943308766, 0.5978311045764736, 0.27541943632407895], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 8.095999999999997, 5, 24, 8.0, 10.0, 12.0, 15.0, 0.33024379257255293, 0.5591278961142194, 0.23671771850415416], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 45.0, 45, 45, 45.0, 45.0, 45.0, 45.0, 22.22222222222222, 10.481770833333334, 3030.729166666667], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 440.0, 440, 440, 440.0, 440.0, 440.0, 440.0, 2.2727272727272725, 1.0542436079545454, 4346.462180397727], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.383999999999998, 1, 16, 2.0, 3.0, 4.0, 8.990000000000009, 0.3285628202255387, 0.27616924316047203, 0.13893330191177564], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 559.9900000000007, 429, 720, 551.5, 648.0, 664.9, 677.99, 0.32843979928386985, 0.2892162611447835, 0.15203170396538507], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.554000000000001, 2, 37, 3.0, 4.0, 5.0, 14.970000000000027, 0.3285444691509885, 0.2976503803477183, 0.1604221040776311], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 759.0339999999999, 606, 935, 738.5, 886.9000000000001, 899.0, 927.97, 0.3283623649445593, 0.31063272123578517, 0.1734805072607486], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 50.0, 50, 50, 50.0, 50.0, 50.0, 50.0, 20.0, 9.47265625, 1316.93359375], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 22.653999999999975, 15, 591, 21.0, 25.0, 29.0, 75.97000000000003, 0.328232383275641, 0.17075456337379563, 14.972397092583197], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 30.479999999999965, 21, 249, 29.0, 35.0, 40.0, 107.8900000000001, 0.3284918021585853, 74.29519299365585, 0.10137051707237595], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 454.0, 454, 454, 454.0, 454.0, 454.0, 454.0, 2.2026431718061676, 1.1550970539647576, 0.9034278634361234], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.731999999999998, 1, 15, 3.0, 4.0, 4.0, 6.0, 0.3302682240354682, 0.3588796441079158, 0.1415895999527056], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.4659999999999997, 2, 18, 3.0, 4.0, 5.0, 7.0, 0.33026647881109356, 0.3388811444839883, 0.12159224854666235], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.7980000000000003, 1, 10, 2.0, 3.0, 3.0, 5.0, 0.3303142609879039, 0.1873210883772321, 0.12806129063691196], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 92.49600000000008, 67, 121, 92.0, 112.0, 115.0, 118.99000000000001, 0.330297677478851, 0.3008515105090812, 0.10773381277142212], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 82.37400000000001, 59, 362, 80.0, 94.90000000000003, 103.89999999999998, 325.4400000000005, 0.32842491352572023, 0.170854722347936, 97.11306598286411], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 203.96999999999994, 12, 392, 260.5, 336.0, 342.0, 362.99, 0.33026255212368727, 0.18406654406495077, 0.13836194810650573], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 429.2299999999998, 326, 549, 420.0, 500.90000000000003, 511.0, 527.97, 0.3302259075433504, 0.17759639603827979, 0.14060399969619217], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 7.415999999999992, 4, 254, 6.0, 8.900000000000034, 11.0, 29.980000000000018, 0.32818089330839156, 0.14797304711857176, 0.2381234411407568], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 396.18199999999996, 296, 548, 392.5, 463.90000000000003, 472.0, 486.96000000000004, 0.33020497143396793, 0.16984595752342307, 0.13285590647538553], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.487999999999999, 2, 14, 3.0, 4.0, 6.0, 10.0, 0.3285604452651154, 0.20172777103772532, 0.1642802226325577], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.2700000000000005, 3, 42, 4.0, 5.0, 5.0, 9.990000000000009, 0.32855180933481404, 0.19241777888298955, 0.15497121475460465], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 674.1319999999998, 530, 875, 679.0, 790.9000000000001, 825.95, 852.0, 0.3283981656992057, 0.3000834449476599, 0.14463630149447437], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 242.8059999999999, 178, 311, 236.0, 286.0, 293.0, 301.99, 0.3284825224304291, 0.29085780069618583, 0.13504994330391662], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.674000000000001, 3, 36, 4.0, 6.0, 6.0, 10.990000000000009, 0.3285047514927256, 0.21901706923007686, 0.1536657968408355], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 983.9240000000001, 802, 8534, 935.0, 1086.9, 1115.0, 1212.2000000000007, 0.3283185951115988, 0.2467872127376452, 0.18147297346988758], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 134.546, 117, 166, 134.0, 150.0, 152.0, 156.0, 0.3303194982314694, 6.386621047685914, 0.1664500596557014], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 183.80399999999992, 162, 255, 180.5, 205.0, 207.0, 211.99, 0.3302954955621497, 0.6401765361300333, 0.23610967065575544], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 7.221999999999994, 5, 27, 7.0, 9.0, 10.0, 14.0, 0.3301761886177702, 0.26946439706030934, 0.20378061641253004], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 7.037999999999998, 5, 16, 7.0, 9.0, 10.0, 13.990000000000009, 0.3301774968187398, 0.2746244881010634, 0.20894044720560878], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.752, 6, 25, 8.0, 10.0, 12.0, 18.0, 0.33017357224693017, 0.26720521587573587, 0.20152195571712048], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 9.940000000000005, 7, 21, 10.0, 12.0, 13.0, 18.99000000000001, 0.33017422633575283, 0.29525765702921114, 0.22957426674907813], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 8.102000000000002, 5, 32, 8.0, 9.900000000000034, 10.0, 20.940000000000055, 0.3301668134808431, 0.24785403436607312, 0.18217211876628547], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1614.8139999999987, 1388, 1974, 1581.5, 1841.6000000000001, 1912.6, 1958.94, 0.32985533864268485, 0.27564503108391786, 0.210025078901397], "isController": false}]}, function(index, item){
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
