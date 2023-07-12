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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8902573920442459, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.197, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.61, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.998, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.934, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.999, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.496, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.109, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 324.2780684960648, 1, 16744, 9.0, 844.0, 1507.0, 6026.980000000003, 15.284742958808902, 96.28254652889048, 126.48255234683069], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6162.6500000000015, 5213, 16744, 6013.5, 6527.8, 6742.95, 14102.52000000006, 0.3296704745804284, 0.1914632108766861, 0.166123012581544], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.3539999999999974, 1, 9, 2.0, 3.0, 4.0, 5.0, 0.3307768691704711, 0.1698170975503988, 0.11951898593073663], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.6659999999999995, 2, 12, 3.0, 5.0, 5.0, 8.0, 0.33077533739084414, 0.18984372415817677, 0.13954584546176238], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 13.166000000000013, 8, 382, 11.0, 15.0, 18.94999999999999, 43.99000000000001, 0.32874579534127757, 0.17102165296508984, 3.6171668712013423], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 31.942000000000007, 23, 45, 32.0, 38.0, 40.0, 41.99000000000001, 0.33070795312942325, 1.3753801436248105, 0.13757967581360772], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.287999999999998, 1, 18, 2.0, 3.0, 4.0, 7.0, 0.33071648403400034, 0.20660414257948276, 0.13984398201828332], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 28.140000000000008, 20, 51, 28.0, 33.0, 34.0, 43.98000000000002, 0.3307064219880086, 1.3572882683136949, 0.12013944236283125], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 856.8580000000005, 657, 1095, 864.0, 1010.0, 1052.0, 1078.97, 0.33056277651576255, 1.3980190643404085, 0.16076197529770486], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 5.640000000000004, 4, 18, 5.0, 7.900000000000034, 9.0, 10.0, 0.33073704751037686, 0.4918130953266855, 0.1689213631327413], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.880000000000001, 2, 23, 4.0, 5.0, 5.949999999999989, 8.0, 0.32891599156659396, 0.3172593887014068, 0.1798759328879811], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 7.8679999999999986, 5, 21, 8.0, 10.0, 11.0, 13.0, 0.33070489086077187, 0.5389165609651159, 0.2160562226424379], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 456.0, 456, 456, 456.0, 456.0, 456.0, 456.0, 2.1929824561403506, 0.9487219024122807, 2593.8378049616226], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.134000000000007, 2, 22, 4.0, 5.0, 6.0, 10.990000000000009, 0.3289201026756992, 0.3304330066635924, 0.19304783369931178], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 8.090000000000003, 5, 16, 8.0, 10.0, 10.949999999999989, 14.0, 0.3307031410184334, 0.5195365722536758, 0.19667794226584565], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.635999999999998, 4, 15, 6.0, 8.0, 9.0, 11.0, 0.3307013911946125, 0.5117830094140765, 0.1889260877430159], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1555.626, 1346, 1903, 1541.0, 1734.5000000000002, 1798.9, 1889.97, 0.33038170319697163, 0.5045128643614614, 0.181968047463957], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 11.508000000000004, 7, 82, 11.0, 14.0, 17.0, 34.97000000000003, 0.32873044957833747, 0.17101366972155874, 2.650389249725346], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 11.090000000000005, 8, 25, 11.0, 13.0, 15.0, 20.0, 0.330708390601003, 0.5986693854892434, 0.27580563044263334], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 7.818000000000001, 5, 18, 8.0, 10.0, 11.0, 14.0, 0.3307070781897359, 0.5599122739534443, 0.23704980018678334], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 68.0, 68, 68, 68.0, 68.0, 68.0, 68.0, 14.705882352941176, 6.936465992647058, 2005.6295955882351], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 546.0, 546, 546, 546.0, 546.0, 546.0, 546.0, 1.8315018315018314, 0.8495736034798534, 3502.6435153388275], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.3880000000000003, 1, 21, 2.0, 3.0, 4.0, 7.990000000000009, 0.32892919075524774, 0.2764771911864739, 0.13908822226271705], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 563.1039999999998, 448, 701, 552.0, 651.0, 662.95, 691.0, 0.3288262219182407, 0.28955653570888357, 0.15221057538012311], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.3099999999999987, 2, 15, 3.0, 4.0, 5.0, 8.980000000000018, 0.32892832520222515, 0.29799814118491824, 0.160609533790149], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 767.930000000001, 619, 960, 751.0, 889.0, 905.95, 927.97, 0.3287784368689509, 0.3110263277141811, 0.17370032650986567], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 49.0, 49, 49, 49.0, 49.0, 49.0, 49.0, 20.408163265306122, 9.665975765306122, 1343.8097895408164], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 23.073999999999995, 16, 619, 21.0, 26.0, 30.0, 58.950000000000045, 0.3286031998065185, 0.17094747125872112, 14.989311975549292], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 31.077999999999992, 20, 283, 29.0, 36.900000000000034, 51.94999999999999, 103.95000000000005, 0.3288668825787373, 74.38002516304398, 0.10148626454578222], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 377.0, 377, 377, 377.0, 377.0, 377.0, 377.0, 2.6525198938992043, 1.3910187334217508, 1.0879476127320955], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.8040000000000025, 1, 7, 3.0, 4.0, 4.0, 6.0, 0.33072807802007653, 0.3593793356383978, 0.14178674438556013], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.381999999999999, 2, 10, 3.0, 4.0, 5.0, 6.0, 0.33072676545254664, 0.3393534372350052, 0.12176170954649423], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.7879999999999994, 1, 10, 2.0, 3.0, 3.0, 5.0, 0.33077840096428524, 0.18758430197653325, 0.12824123553009883], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 92.77399999999997, 63, 120, 92.0, 111.0, 113.0, 117.99000000000001, 0.3307611144003466, 0.30127363184799544, 0.10788497286105056], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 84.48600000000008, 59, 506, 80.0, 96.0, 106.0, 464.2300000000016, 0.32881151734678044, 0.17105584316972988, 97.2273821654606], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 200.99999999999977, 12, 362, 259.0, 333.0, 337.0, 341.0, 0.33072173404019595, 0.18432246175203146, 0.13855432021801176], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 432.4940000000003, 331, 545, 419.5, 506.90000000000003, 517.95, 533.97, 0.33068170695251675, 0.17784152620685595, 0.14079807053837629], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 7.087999999999998, 4, 259, 6.0, 8.0, 10.0, 25.960000000000036, 0.32855159344237306, 0.14814019160964656, 0.2383924159450031], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 407.22600000000017, 301, 517, 410.0, 469.90000000000003, 477.95, 489.99, 0.33065852629462733, 0.17007925037562807, 0.13303839143885396], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.4540000000000024, 2, 18, 3.0, 4.0, 5.0, 9.0, 0.3289257285704888, 0.20195204571245315, 0.1644628642852444], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.244, 2, 48, 4.0, 5.0, 6.0, 9.970000000000027, 0.3289157751952773, 0.1926309370530857, 0.15514289005792864], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 676.6100000000002, 534, 861, 681.0, 812.9000000000001, 839.8499999999999, 853.99, 0.32876676299532825, 0.3004202615257408, 0.14479864268641898], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 243.25199999999995, 166, 324, 234.5, 290.0, 295.95, 310.0, 0.3288645032205701, 0.2911960290186749, 0.1352069881404883], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.555999999999997, 3, 68, 4.0, 5.0, 6.0, 9.990000000000009, 0.3289239975054404, 0.21929658431341723, 0.15386190898936128], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 985.0500000000001, 795, 8957, 929.5, 1082.9, 1104.9, 1133.96, 0.3287522798970611, 0.24711320054645203, 0.1817126859587271], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 134.9139999999999, 116, 170, 138.0, 150.0, 152.0, 158.98000000000002, 0.33077117977479775, 6.395354164764733, 0.1666776648083942], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 181.95000000000002, 158, 277, 178.5, 203.0, 206.0, 210.99, 0.33073529732772494, 0.6410289569915127, 0.23642406019911588], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 7.168, 5, 25, 7.0, 9.0, 10.949999999999989, 15.980000000000018, 0.33073245332042156, 0.26991837750430614, 0.20412393603369766], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 6.9579999999999975, 5, 15, 7.0, 9.0, 10.0, 13.0, 0.3307348597849562, 0.2750880736596143, 0.20929315345766758], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.470000000000004, 5, 16, 8.0, 10.0, 11.0, 14.990000000000009, 0.3307282967823444, 0.2676541472915006, 0.20186053270406762], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 9.769999999999985, 7, 22, 10.0, 12.0, 12.949999999999989, 17.99000000000001, 0.33073026565577857, 0.2957548941051299, 0.22996088783878355], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 8.028000000000008, 5, 38, 8.0, 9.0, 11.0, 18.970000000000027, 0.3306985477703973, 0.24825320376619348, 0.18246550731472116], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1619.6159999999993, 1378, 1961, 1600.0, 1808.9, 1878.95, 1947.0, 0.3303904355933581, 0.2760921871499926, 0.21036578516295845], "isController": false}]}, function(index, item){
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
