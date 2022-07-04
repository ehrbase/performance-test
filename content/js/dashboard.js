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

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.904885253351511, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.473, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.849, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.38, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.998, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [0.991, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.997, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #4"], "isController": false}, {"data": [0.999, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.616, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.513, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 22005, 0, 0.0, 230.91565553283493, 1, 6449, 17.0, 702.9000000000015, 1607.9500000000007, 2942.970000000005, 21.175798098075557, 141.84018530507393, 186.53033912131266], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query participation #2", 500, 0, 0.0, 8.624000000000004, 4, 67, 7.0, 13.0, 17.94999999999999, 31.0, 0.490218186310363, 5.239981449224671, 0.17712961810042416], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 9.053999999999997, 4, 40, 8.0, 14.0, 18.94999999999999, 31.980000000000018, 0.49020472910306256, 5.263400941144059, 0.20680512009035454], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 27.030000000000022, 13, 292, 22.0, 41.0, 52.0, 88.92000000000007, 0.48717558977476894, 0.2625419701770591, 5.42363449553942], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 54.66600000000002, 25, 243, 49.0, 81.90000000000003, 101.89999999999998, 184.93000000000006, 0.4902441415825081, 2.039013475585842, 0.2039492229630356], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.954, 1, 18, 2.0, 5.0, 7.0, 10.990000000000009, 0.49026721524299605, 0.3064170095268725, 0.2073102580080247], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 47.34200000000002, 23, 204, 42.0, 71.0, 93.89999999999998, 150.9000000000001, 0.490224434550626, 2.011567029367385, 0.1780893453640946], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 935.3020000000004, 578, 3286, 878.5, 1232.9, 1555.1499999999996, 2024.7100000000003, 0.48967903497973214, 2.0710936528293167, 0.23814468693350258], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 13.054000000000004, 6, 59, 11.0, 21.900000000000034, 27.94999999999999, 41.98000000000002, 0.48967471887774383, 0.7282955047371132, 0.2500975370830665], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 4.275999999999998, 2, 31, 3.0, 7.0, 9.0, 18.99000000000001, 0.4877492032616765, 0.4706017703345082, 0.2667378455337293], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 21.475999999999974, 10, 123, 18.0, 32.900000000000034, 47.0, 88.99000000000001, 0.4902052097048867, 0.798977045895953, 0.3202610207935246], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 858.0, 858, 858, 858.0, 858.0, 858.0, 858.0, 1.1655011655011656, 0.4973867278554779, 1378.543169070513], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 5.35, 2, 56, 4.0, 9.0, 11.0, 20.0, 0.48775634034466814, 0.4895854266209606, 0.2862710552218218], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 22.687999999999988, 11, 111, 19.0, 34.0, 55.94999999999999, 88.97000000000003, 0.49018742806499493, 0.7696708538476772, 0.29152748407381046], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 13.383999999999995, 6, 62, 11.0, 22.0, 31.0, 54.99000000000001, 0.49018550580281606, 0.7587344010717415, 0.28003761806117905], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2358.952000000001, 1522, 5046, 2211.5, 3070.0000000000005, 3432.5999999999995, 4808.9400000000005, 0.48879677785164044, 0.7465607036718415, 0.26922010030109883], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 23.26400000000001, 11, 235, 19.0, 36.900000000000034, 48.849999999999966, 69.99000000000001, 0.48714568676337483, 0.2630776999806116, 3.9276120995297097], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 26.21199999999999, 13, 170, 23.0, 37.900000000000034, 49.0, 87.0, 0.4902220313624447, 0.8875699669394261, 0.4088375144370388], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 21.416, 10, 108, 18.0, 32.900000000000034, 49.94999999999999, 94.93000000000006, 0.49021530256088475, 0.8301106783599357, 0.35138479695282165], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 120.0, 120, 120, 120.0, 120.0, 120.0, 120.0, 8.333333333333334, 3.8818359375, 1136.5234375], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 767.0, 767, 767, 767.0, 767.0, 767.0, 767.0, 1.303780964797914, 0.597141867666232, 2493.407248207301], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.862000000000001, 1, 43, 2.0, 5.0, 7.949999999999989, 13.980000000000018, 0.4879238838741156, 0.41025631251524763, 0.20631937667723835], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 488.46600000000007, 310, 1618, 454.0, 642.9000000000001, 744.6499999999999, 1322.7200000000003, 0.4877525338744135, 0.4290888599760026, 0.22577607525046095], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 4.051999999999995, 1, 20, 3.0, 7.0, 10.949999999999989, 15.990000000000009, 0.48792483615484, 0.4421818827653237, 0.23824454890373048], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1370.3360000000005, 918, 6399, 1285.0, 1767.4, 2032.95, 2966.96, 0.48729951279794714, 0.4611261991222761, 0.2574502308825091], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 73.0, 73, 73, 73.0, 73.0, 73.0, 73.0, 13.698630136986301, 6.407855308219179, 902.0093107876713], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 53.849999999999966, 27, 878, 45.0, 78.0, 91.89999999999998, 178.92000000000007, 0.4867350107519764, 0.26285591889242477, 22.263373470313546], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 58.05400000000004, 31, 242, 50.0, 87.0, 115.94999999999999, 187.97000000000003, 0.4874572378138128, 110.30957358093886, 0.15042625698160628], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 364.0, 364, 364, 364.0, 364.0, 364.0, 364.0, 2.7472527472527473, 1.440697973901099, 1.1268028846153846], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.8579999999999983, 1, 20, 2.0, 5.0, 7.0, 12.0, 0.49019944254519393, 0.532804667532032, 0.21015386257552746], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 4.060000000000002, 2, 48, 3.0, 6.0, 10.0, 16.980000000000018, 0.4901951172644759, 0.5031201838329729, 0.18047222578975336], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.647999999999999, 1, 19, 2.0, 4.0, 7.0, 12.0, 0.49022587647484456, 0.27814573655457486, 0.19005827437550127], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 153.48399999999987, 87, 732, 137.0, 192.0, 237.89999999999998, 642.8900000000001, 0.49014370033006277, 0.44658600821088723, 0.15987108975609468], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 205.48999999999998, 112, 808, 186.5, 291.0, 352.95, 458.95000000000005, 0.4872605723362683, 0.26313974267769175, 144.1406230966384], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 2.8980000000000006, 1, 18, 2.0, 5.0, 7.0, 11.990000000000009, 0.4901917532100207, 0.2727840514152326, 0.20536353723349499], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 3.9520000000000035, 1, 23, 3.0, 6.0, 8.949999999999989, 16.0, 0.49022539583249586, 0.26322805824662066, 0.20872878181930488], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 16.034000000000013, 7, 502, 11.0, 27.0, 35.0, 63.97000000000003, 0.48652330446628395, 0.2057271394862314, 0.35301446798676656], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 5.642000000000003, 2, 52, 5.0, 9.0, 12.0, 22.99000000000001, 0.490201845511908, 0.25228161385231984, 0.1972296487801817], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 4.376000000000003, 2, 25, 3.5, 7.0, 10.0, 19.980000000000018, 0.487918170267828, 0.2997075479477186, 0.24395908513391404], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 5.0300000000000065, 2, 34, 4.0, 8.0, 11.0, 18.99000000000001, 0.4879034107375831, 0.28588090472905264, 0.23013412830688737], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 644.2420000000005, 368, 2389, 607.5, 835.9000000000001, 1133.9999999999998, 1797.4400000000014, 0.4874196976048196, 0.4449799122157125, 0.2146741050974352], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 20.608, 6, 123, 17.0, 39.900000000000034, 46.94999999999999, 70.99000000000001, 0.4875356632337655, 0.4318309048369388, 0.20044190841935086], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 11.381999999999994, 5, 53, 9.0, 18.0, 26.0, 44.99000000000001, 0.4877634776365323, 0.325334428931398, 0.2281627986209951], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 649.7639999999998, 385, 3677, 624.5, 776.9000000000001, 813.0, 967.8800000000001, 0.4876027013189653, 0.3666543750152376, 0.26951477436184995], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 21.020000000000007, 11, 110, 18.0, 31.0, 47.0, 85.99000000000001, 0.4896545780744432, 0.39975705788108834, 0.3022086849053204], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 20.799999999999994, 10, 81, 18.0, 32.0, 50.89999999999998, 76.99000000000001, 0.489663689184994, 0.4068607942442971, 0.309865303312379], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 21.302000000000014, 10, 106, 18.0, 35.0, 50.94999999999999, 88.87000000000012, 0.4896344389278964, 0.3963935057336193, 0.29884914485345243], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 24.605999999999995, 12, 119, 21.0, 35.0, 58.94999999999999, 88.99000000000001, 0.48964402879106894, 0.4380018851295109, 0.3404556137687901], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 20.966000000000022, 10, 115, 18.0, 32.0, 46.0, 80.97000000000003, 0.48935027007241405, 0.3674905836774281, 0.27000283456143936], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2744.408000000001, 1677, 6449, 2598.0, 3668.8, 4181.199999999999, 4902.6900000000005, 0.48856752003126835, 0.407858455882353, 0.31108010064490915], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 22005, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
