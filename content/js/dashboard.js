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

    var data = {"OkPercent": 97.800467985535, "KoPercent": 2.1995320144650075};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8991916613486493, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.986, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.987, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.977, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.727, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.586, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 517, 2.1995320144650075, 188.00621144437272, 1, 3918, 16.0, 562.0, 1240.9500000000007, 2255.970000000005, 26.179468302294058, 173.71911784422298, 216.90001956777425], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 24.887999999999998, 15, 71, 26.0, 30.0, 31.94999999999999, 37.0, 0.5677070086836464, 0.32970804212329236, 0.2871799125958289], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 7.362000000000002, 4, 27, 7.0, 9.0, 12.0, 22.0, 0.5674982407554537, 6.065905565809934, 0.20616147027444215], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 7.668000000000005, 5, 36, 7.0, 9.0, 11.0, 22.980000000000018, 0.5674782740942763, 6.0934841718959785, 0.2405132528876132], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 21.900000000000006, 14, 258, 20.0, 27.900000000000034, 32.0, 49.0, 0.5636489278833743, 0.30436051316571167, 6.2760987067639], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 41.397999999999996, 25, 58, 42.0, 51.0, 53.0, 54.0, 0.5673649416124739, 2.3596763328395367, 0.23714081543958868], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.5640000000000005, 1, 23, 2.0, 3.0, 4.0, 6.990000000000009, 0.5673990653802595, 0.3546244158626622, 0.2410337826566532], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 36.044000000000004, 23, 61, 36.5, 45.0, 47.0, 51.99000000000001, 0.5673539971223804, 2.328507237025749, 0.20721718254274446], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 750.4019999999999, 577, 947, 740.0, 880.0, 902.0, 927.99, 0.5670310029871193, 2.398060495261889, 0.27687060692730436], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 11.397999999999996, 7, 42, 12.0, 15.0, 16.0, 25.99000000000001, 0.5670547967732313, 0.8432226656196945, 0.29072633623627586], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.4860000000000024, 2, 19, 3.0, 5.0, 6.0, 12.970000000000027, 0.5645067509362344, 0.5445648884280632, 0.30981718166617556], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 18.07599999999999, 11, 59, 19.0, 23.0, 24.0, 27.0, 0.5673321094088627, 0.9244599157880583, 0.3717576615364715], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 680.0, 680, 680, 680.0, 680.0, 680.0, 680.0, 1.4705882352941175, 0.6275850183823529, 1739.3999885110293], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.625999999999999, 2, 28, 4.0, 6.0, 8.0, 15.980000000000018, 0.5645169484923446, 0.5672414043121192, 0.3324255077547693], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 19.076000000000004, 12, 35, 20.0, 23.0, 25.0, 30.99000000000001, 0.5673211661853892, 0.8913934099264184, 0.3385090161516336], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 11.021999999999984, 7, 24, 11.0, 14.0, 16.0, 19.0, 0.567319235072129, 0.8780295644945526, 0.32521131932357394], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1974.314, 1544, 2547, 1966.5, 2229.8, 2303.85, 2388.99, 0.5660610191136164, 0.8643453253124374, 0.3128813836116278], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 18.874000000000006, 11, 226, 17.0, 24.0, 30.0, 48.99000000000001, 0.5636139830374736, 0.30421394977015825, 4.545238546800251], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 22.46199999999999, 15, 41, 23.0, 28.0, 30.0, 34.0, 0.5673462718541784, 1.027078480158766, 0.4742660241281022], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 17.787999999999997, 11, 45, 18.5, 22.0, 24.0, 28.99000000000001, 0.5673404780410868, 0.9604542411537437, 0.40777596859203113], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 92.0, 92, 92, 92.0, 92.0, 92.0, 92.0, 10.869565217391305, 5.063264266304348, 1482.4431046195652], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 603.0, 603, 603, 603.0, 603.0, 603.0, 603.0, 1.658374792703151, 0.7595486111111112, 3171.5510986733], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.404000000000001, 1, 18, 2.0, 3.0, 4.0, 9.990000000000009, 0.5644334668406628, 0.47426742533109667, 0.23977398249578932], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 412.08199999999965, 318, 543, 412.5, 478.0, 494.0, 528.99, 0.5642232789497322, 0.4967457011828377, 0.2622756648242896], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.2079999999999993, 1, 36, 3.0, 4.0, 6.0, 13.0, 0.5644984656931702, 0.5113529197130767, 0.27673655251755025], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1186.9800000000002, 921, 1471, 1186.0, 1357.9, 1381.95, 1419.99, 0.5639210104562233, 0.5334086984392922, 0.29903233269309504], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 70.0, 70, 70, 70.0, 70.0, 70.0, 70.0, 14.285714285714285, 6.682477678571428, 940.6947544642857], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 6, 1.2, 44.00000000000001, 10, 703, 43.0, 52.0, 57.94999999999999, 105.91000000000008, 0.5631765862713317, 0.3026370180475569, 25.76092900483318], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 44.78600000000005, 10, 195, 46.0, 54.0, 59.94999999999999, 80.99000000000001, 0.5639706238981423, 124.97798201406034, 0.17513931484336842], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 304.0, 304, 304, 304.0, 304.0, 304.0, 304.0, 3.289473684210526, 1.7250462582236843, 1.3556229440789473], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.3240000000000003, 1, 16, 2.0, 3.0, 4.0, 7.0, 0.5675091908113452, 0.6165765674887604, 0.24440581362090158], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.464000000000002, 2, 25, 3.0, 5.0, 7.0, 13.980000000000018, 0.5675046819136258, 0.5823074651694001, 0.2100432367629533], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.236000000000002, 1, 11, 2.0, 3.0, 4.0, 7.0, 0.5675091908113452, 0.3218342404258362, 0.22112906946653002], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 119.71000000000004, 86, 220, 119.0, 144.90000000000003, 150.0, 161.98000000000002, 0.56744156486765, 0.5169503484374929, 0.18619176347219762], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 11, 2.2, 169.14599999999987, 26, 570, 171.0, 201.0, 223.95, 346.85000000000014, 0.5637264573738239, 0.3019151549402168, 166.76173678484253], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 2.310000000000001, 1, 14, 2.0, 3.0, 4.0, 7.0, 0.5675001730875529, 0.31644785042284435, 0.23885993613353051], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 3.3099999999999996, 1, 22, 3.0, 5.0, 6.0, 9.0, 0.5675517067982478, 0.30523085981529596, 0.2427613745875318], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 11.76400000000001, 6, 321, 10.0, 15.0, 20.0, 42.960000000000036, 0.5629964925318516, 0.2378088387634345, 0.4096019403674115], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 4.4619999999999935, 2, 63, 4.0, 6.0, 6.949999999999989, 9.0, 0.5675124114964394, 0.2919407988077699, 0.22944349449172452], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.796, 2, 20, 3.0, 5.0, 6.0, 10.990000000000009, 0.5644251837486185, 0.34667060929416377, 0.28331498481131834], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.098, 2, 37, 4.0, 5.0, 6.0, 11.0, 0.56440415852984, 0.33057768882141125, 0.267320328991184], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 520.9480000000002, 378, 756, 515.0, 631.9000000000001, 645.0, 699.9000000000001, 0.563925462588057, 0.5152075894216606, 0.24947093218006816], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 16.679999999999996, 6, 119, 15.0, 29.0, 34.0, 53.99000000000001, 0.5640902409003783, 0.49941487095589604, 0.2330177459969336], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 9.912000000000004, 6, 46, 10.0, 12.0, 13.0, 17.0, 0.5645252342779722, 0.37631009547533023, 0.26517249774189905], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 560.382, 369, 3918, 539.0, 631.9000000000001, 667.8499999999999, 727.99, 0.5643086090921403, 0.42407791973274345, 0.3130149316057966], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 171.1979999999999, 142, 231, 175.0, 188.90000000000003, 192.95, 201.99, 0.567590363223777, 10.974337501433165, 0.2871209063964028], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 259.43799999999965, 210, 408, 261.0, 285.0, 290.0, 307.99, 0.5674190264678279, 1.0998963449561556, 0.4067241849876813], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 18.14199999999999, 12, 36, 19.0, 23.0, 24.0, 27.99000000000001, 0.5670303599395319, 0.4627023111165168, 0.3510715314469367], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 17.688000000000006, 11, 38, 19.0, 22.0, 24.0, 29.99000000000001, 0.5670419350192625, 0.4715396691196901, 0.3599387282837115], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 17.823999999999977, 12, 44, 19.0, 22.0, 24.0, 30.99000000000001, 0.5669924227132628, 0.45892388842553006, 0.3471721182043123], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 20.367999999999984, 14, 51, 21.0, 25.0, 27.0, 34.97000000000003, 0.5670117121939271, 0.5071775797757129, 0.3953577758852187], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 17.816000000000045, 11, 45, 19.0, 22.0, 24.0, 32.97000000000003, 0.5668040977669052, 0.425496072260154, 0.3138456283533547], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2190.8499999999976, 1706, 2798, 2176.0, 2483.9, 2566.95, 2698.0, 0.5657055706158949, 0.47267020701712503, 0.36130023748319856], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["No results for path: $['rows'][1]", 500, 96.71179883945841, 2.1272069772388855], "isController": false}, {"data": ["500", 17, 3.288201160541586, 0.0723250372261221], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 23505, 517, "No results for path: $['rows'][1]", 500, "500", 17, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Query cross patient #1", 500, 500, "No results for path: $['rows'][1]", 500, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 6, "500", 6, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 11, "500", 11, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
