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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8713677940863646, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.471, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [0.5, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [0.996, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.819, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.839, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.499, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [0.844, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.489, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 485.1803871516689, 1, 24773, 12.0, 1005.0, 1796.9500000000007, 10554.990000000002, 10.240402209713677, 69.025526669484, 84.8429545635249], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 11022.931999999992, 9055, 24773, 10688.0, 12703.300000000001, 13136.8, 22645.290000000074, 0.2204379484810062, 0.12808650326777216, 0.11151060284488398], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 7.877999999999992, 5, 25, 8.0, 9.0, 10.0, 14.990000000000009, 0.2212414833091, 2.362295135226113, 0.08037288260838399], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 9.165999999999993, 6, 35, 9.0, 11.0, 12.0, 20.0, 0.22123874226659976, 2.375598526848649, 0.09376720131221122], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 16.267999999999983, 10, 418, 14.0, 19.0, 23.0, 44.960000000000036, 0.22005560364993026, 0.12930630592988238, 2.4502675711098685], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 46.58400000000002, 28, 97, 48.0, 57.0, 59.0, 76.99000000000001, 0.22120360420304547, 0.9199628918511247, 0.09245619394424165], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.7700000000000005, 1, 11, 2.5, 4.0, 5.0, 9.990000000000009, 0.22120800808382543, 0.13820488761305944, 0.09397019874654695], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 40.62199999999996, 25, 88, 42.0, 50.0, 52.0, 59.99000000000001, 0.2212041913770182, 0.9078557004873128, 0.08079137458496563], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1120.1599999999999, 762, 1699, 1123.5, 1431.6000000000001, 1509.9, 1611.8700000000001, 0.22112798268479444, 0.9352590752029734, 0.10797264779530978], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 6.536000000000001, 4, 18, 6.0, 8.0, 9.0, 14.990000000000009, 0.22105896084603685, 0.3287194240916687, 0.11333589301188413], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 4.216000000000001, 2, 25, 4.0, 5.0, 6.0, 11.990000000000009, 0.22017857363035714, 0.21237556539105476, 0.12084019373072337], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 10.149999999999997, 6, 24, 10.0, 12.0, 13.0, 18.0, 0.2212054635979865, 0.3605389831494526, 0.14495006452563372], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 530.0, 530, 530, 530.0, 530.0, 530.0, 530.0, 1.8867924528301887, 0.8954893867924528, 2231.6830041273583], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.6439999999999975, 3, 20, 4.0, 6.0, 7.0, 13.0, 0.2201799310396456, 0.2211926727146424, 0.12965673673526007], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 15.755999999999991, 8, 28, 17.0, 19.0, 20.0, 23.0, 0.2212045828280652, 0.34752622490931717, 0.1319882813554178], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 7.698, 5, 20, 8.0, 9.0, 10.0, 14.0, 0.2212045828280652, 0.3423292133334601, 0.12680379894538502], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2219.4300000000017, 1569, 3534, 2168.0, 2881.800000000001, 3153.8499999999995, 3351.82, 0.22090094006604055, 0.33732911034244945, 0.12209954304431538], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 13.872000000000003, 10, 84, 12.0, 17.0, 21.0, 41.950000000000045, 0.22005037393160043, 0.12930323290857743, 1.7745859257101138], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 14.675999999999991, 10, 33, 14.0, 17.0, 19.0, 26.0, 0.22120673583358882, 0.40044251785359564, 0.18491500573589065], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 10.142, 6, 21, 10.0, 12.0, 14.0, 17.99000000000001, 0.22120614864610777, 0.37445621307239857, 0.15899191933938994], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 58.0, 58, 58, 58.0, 58.0, 58.0, 58.0, 17.241379310344826, 8.856411637931034, 2351.4614762931033], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 735.0, 735, 735, 735.0, 735.0, 735.0, 735.0, 1.3605442176870748, 0.6882440476190477, 2601.966411564626], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.7600000000000002, 2, 18, 3.0, 3.0, 4.0, 8.990000000000009, 0.2201949606181313, 0.18514439559786233, 0.09353985143446006], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 680.4099999999997, 544, 990, 656.0, 819.0, 844.95, 893.98, 0.22012283734815377, 0.19377258597887967, 0.10232272517355585], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.6659999999999995, 2, 23, 3.0, 5.0, 5.0, 9.0, 0.22018972427402347, 0.1994845792053265, 0.10794457186089823], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 935.6380000000005, 740, 1312, 903.0, 1117.0, 1158.75, 1269.91, 0.2201042325603713, 0.2082198936753489, 0.11671542800808751], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 73.0, 73, 73, 73.0, 73.0, 73.0, 73.0, 13.698630136986301, 7.0633561643835625, 902.0360659246576], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 29.331999999999997, 20, 547, 27.0, 33.0, 39.94999999999999, 82.98000000000002, 0.21999847761053495, 0.12927273824515134, 10.06321161257564], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 36.56999999999999, 26, 228, 35.0, 42.0, 50.0, 123.77000000000021, 0.2201234187984519, 49.81290214484957, 0.0683586398221755], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 952.0, 952, 952, 952.0, 952.0, 952.0, 952.0, 1.050420168067227, 0.5508551076680672, 0.43288799894957986], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 3.008000000000001, 2, 9, 3.0, 4.0, 4.0, 8.0, 0.22120174483936328, 0.24030199706465283, 0.0952636420646086], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.732000000000004, 2, 13, 4.0, 5.0, 5.0, 9.0, 0.22120066837993957, 0.22703310787823874, 0.08187016925390342], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.2440000000000007, 1, 13, 2.0, 3.0, 4.0, 6.990000000000009, 0.22124295175266454, 0.1254542601768439, 0.08620697045831363], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 200.65599999999995, 87, 379, 208.5, 296.80000000000007, 309.0, 333.94000000000005, 0.2212221995592369, 0.20150015405360924, 0.0725885342303746], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 114.59600000000002, 82, 400, 112.0, 132.90000000000003, 151.79999999999995, 270.0, 0.2200872778108887, 0.129387247306792, 65.10628729929141], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 268.44000000000005, 17, 557, 334.0, 440.90000000000003, 457.95, 498.99, 0.22119822192021293, 0.12330634397053462, 0.09310198598399586], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 497.44599999999986, 299, 978, 462.5, 812.7000000000005, 882.75, 932.97, 0.22123179207043311, 0.11896653199918765, 0.09462844231137667], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 8.054, 4, 253, 7.0, 10.0, 14.0, 31.970000000000027, 0.21997582905590335, 0.1034810123188664, 0.1600410084439922], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 502.79600000000016, 288, 1034, 450.0, 846.0, 887.95, 963.96, 0.221164564128877, 0.11375936286359453, 0.08941614213804207], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 4.024000000000003, 2, 16, 4.0, 5.0, 6.0, 12.0, 0.22019350605311946, 0.13519322186587573, 0.11052681846806973], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.478000000000001, 3, 53, 4.0, 5.0, 7.0, 11.0, 0.22018865764186754, 0.12895443347109803, 0.10428857319951734], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 846.2020000000001, 572, 1506, 840.0, 1120.7, 1218.8, 1272.98, 0.22010093829029992, 0.20112368063243805, 0.09736887211475183], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 468.0720000000002, 242, 984, 383.5, 835.9000000000001, 873.0, 916.97, 0.22011770133725905, 0.19490519626904898, 0.09092752701724666], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 5.513999999999997, 3, 41, 5.0, 6.0, 7.0, 13.0, 0.22018099758725665, 0.1468590052266565, 0.10342486312448285], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1169.232000000001, 904, 9929, 1074.5, 1407.0, 1444.0, 1701.6100000000013, 0.22009435004597772, 0.1653759714964611, 0.12208358479112826], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 167.1179999999999, 142, 281, 167.0, 185.90000000000003, 187.0, 223.98000000000002, 0.2213012157403588, 4.278850361761097, 0.11194729468115806], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 228.19999999999996, 194, 372, 222.0, 254.0, 258.0, 314.84000000000015, 0.22128701412563526, 0.4288970212942281, 0.15861784020333622], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 9.094000000000003, 6, 30, 9.0, 11.0, 12.0, 17.99000000000001, 0.2210566152518454, 0.18047200229545188, 0.1368651309274121], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 8.971999999999992, 5, 26, 9.0, 11.0, 12.0, 19.99000000000001, 0.22105729937834265, 0.18380137288741066, 0.14031957480070578], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 10.08000000000001, 7, 24, 10.0, 12.0, 14.0, 18.99000000000001, 0.2210548560888676, 0.17889684549746626, 0.13535292457785153], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 12.10999999999999, 8, 23, 12.0, 15.0, 16.0, 20.0, 0.22105524701155413, 0.1976907435989032, 0.15413422496704066], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 9.400000000000011, 6, 46, 9.0, 11.0, 13.0, 25.980000000000018, 0.22105876537795302, 0.16594734720086549, 0.1224026562200189], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1998.2900000000009, 1599, 3085, 1912.0, 2510.6000000000004, 2582.95, 2795.4800000000005, 0.2208911810521312, 0.18458866458800702, 0.14107698477352912], "isController": false}]}, function(index, item){
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
