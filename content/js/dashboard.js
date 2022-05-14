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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.910838445807771, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.499, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.979, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.49, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.998, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.808, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.725, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.58, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 22005, 0, 0.0, 201.81586003181107, 1, 3608, 13.0, 601.9000000000015, 1319.9500000000007, 2305.970000000005, 24.415790764273613, 164.15818299478454, 215.07465694246727], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query participation #2", 500, 0, 0.0, 8.898000000000001, 5, 54, 8.0, 12.0, 16.0, 32.97000000000003, 0.5648370840398503, 6.043463348710081, 0.20409152450658657], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 8.000000000000002, 5, 51, 7.0, 9.900000000000034, 11.0, 30.950000000000045, 0.5648173041947852, 6.064527235208, 0.238282300207175], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 23.034000000000013, 12, 306, 19.0, 29.0, 37.0, 115.91000000000008, 0.5614161160110263, 0.3025506537690671, 6.250140354029003], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 43.80400000000005, 26, 147, 44.0, 53.0, 56.0, 72.90000000000009, 0.5646482749430553, 2.3484736357250706, 0.23490250500560697], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.504, 1, 42, 2.0, 4.0, 4.0, 8.0, 0.5646801595108515, 0.35292509969428215, 0.23877588776191278], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 38.57999999999999, 22, 99, 39.0, 47.0, 49.0, 68.95000000000005, 0.5646355221241136, 2.316902463166002, 0.20512149827165066], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 762.8379999999994, 569, 1655, 753.5, 915.0, 925.95, 1059.89, 0.5643219840658045, 2.3867954228408195, 0.2744456524070026], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 8.879999999999999, 5, 43, 9.0, 12.0, 15.0, 20.99000000000001, 0.5643315380066004, 0.8393329417813012, 0.2882279241967305], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.5959999999999988, 2, 32, 3.0, 5.0, 8.0, 16.980000000000018, 0.5621571544054569, 0.5423938169458901, 0.3074296938154843], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 13.440000000000003, 8, 87, 14.0, 16.900000000000034, 19.0, 35.97000000000003, 0.5646278707092516, 0.9202772619274815, 0.3688828569379779], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 611.0, 611, 611, 611.0, 611.0, 611.0, 611.0, 1.6366612111292964, 0.6984579582651391, 1935.826577843699], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.545999999999997, 2, 69, 4.0, 6.0, 8.0, 14.980000000000018, 0.5621691634473113, 0.5642772978102386, 0.3299449875310879], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 14.342000000000006, 8, 87, 15.0, 17.0, 19.0, 38.91000000000008, 0.5646093806460939, 0.8865249478300933, 0.3357881961069054], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 8.547999999999996, 5, 43, 8.0, 11.0, 12.0, 25.99000000000001, 0.5646042801521269, 0.8739236172276574, 0.322552249891596], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1998.3819999999996, 1522, 3142, 1974.5, 2271.9, 2361.85, 2771.59, 0.5633771077346044, 0.8604705043915245, 0.31029754761945005], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 20.558000000000018, 11, 235, 16.0, 28.900000000000034, 39.94999999999999, 95.94000000000005, 0.5613669509803151, 0.30316008192589283, 4.52602104227879], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 17.74000000000001, 11, 59, 18.0, 22.0, 24.0, 33.0, 0.5646367973800852, 1.0223013890065216, 0.47089826656503203], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 13.18199999999999, 8, 37, 14.0, 16.0, 19.0, 25.980000000000018, 0.5646329716294517, 0.9561265359428411, 0.4047271495859547], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 72.0, 72, 72, 72.0, 72.0, 72.0, 72.0, 13.888888888888888, 6.469726562500001, 1894.2057291666667], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 630.0, 630, 630, 630.0, 630.0, 630.0, 630.0, 1.5873015873015872, 0.7269965277777778, 3035.6243799603176], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.34, 1, 22, 2.0, 3.0, 5.0, 13.990000000000009, 0.5621571544054569, 0.47267315424130707, 0.23770903111090122], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 412.2239999999999, 316, 666, 414.5, 478.90000000000003, 495.95, 567.8300000000002, 0.5619038200469302, 0.4943217160655045, 0.26010001045141107], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.227999999999998, 1, 24, 3.0, 4.0, 7.0, 14.980000000000018, 0.562145777891706, 0.5094446112143586, 0.27448524311118455], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1188.3259999999998, 926, 2473, 1173.5, 1368.7, 1413.95, 1636.6200000000003, 0.5615687084930528, 0.5314063266892267, 0.29668815556127104], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 63.0, 63, 63, 63.0, 63.0, 63.0, 63.0, 15.873015873015872, 7.424975198412699, 1045.1853918650793], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 44.789999999999985, 27, 751, 42.0, 53.0, 63.849999999999966, 115.99000000000001, 0.5609009415283204, 0.3029084186183215, 25.655740526663546], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 42.42200000000004, 28, 182, 42.0, 50.900000000000034, 61.0, 110.95000000000005, 0.561718228655269, 127.11453122226517, 0.17334273462408692], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 309.0, 309, 309, 309.0, 309.0, 309.0, 309.0, 3.236245954692557, 1.6971328883495145, 1.327366504854369], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.252, 1, 20, 2.0, 3.0, 4.0, 7.0, 0.5649723897993105, 0.6140764353971021, 0.24220984289247785], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.3680000000000008, 1, 23, 3.0, 5.0, 7.0, 15.0, 0.5649672827446562, 0.5798638810201502, 0.20800064999485882], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.1279999999999997, 1, 17, 2.0, 3.0, 4.0, 7.0, 0.5648485697469365, 0.32048537013961925, 0.21898914276321663], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 122.95999999999995, 86, 456, 122.0, 146.0, 152.95, 193.84000000000015, 0.5647860421036699, 0.5145950950026601, 0.18421732232678292], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 171.974, 115, 669, 169.0, 202.90000000000003, 239.0, 402.7700000000002, 0.5614980768690867, 0.30323089502793454, 166.10143989163086], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 2.4639999999999986, 1, 29, 2.0, 3.0, 5.0, 11.970000000000027, 0.5649647292519528, 0.3143940442548172, 0.23668932504793727], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 471.76400000000024, 349, 1770, 471.0, 545.9000000000001, 560.95, 670.8800000000001, 0.5647496803516809, 0.6137461272290671, 0.2426658782761129], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 12.544000000000011, 6, 324, 10.0, 17.0, 23.0, 50.0, 0.5607141255102499, 0.23709884408783025, 0.4068462844278473], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 2.857999999999999, 1, 27, 3.0, 4.0, 5.0, 8.990000000000009, 0.56497430496861, 0.60138866446854, 0.22952081139349784], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.7240000000000015, 2, 31, 3.0, 5.0, 7.0, 13.970000000000027, 0.5621508340631926, 0.3453055416267071, 0.2810754170315962], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.277999999999999, 2, 39, 4.0, 5.0, 8.0, 19.980000000000018, 0.5621325058742846, 0.3293745151607137, 0.2651464847043745], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 523.9959999999995, 378, 945, 518.5, 632.9000000000001, 658.9, 773.8100000000002, 0.5616450358441861, 0.5127424270591592, 0.24736514762278122], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 18.192000000000014, 6, 166, 15.0, 34.900000000000034, 40.94999999999999, 62.97000000000003, 0.5618280536478372, 0.4976348092369027, 0.23098594783763618], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 7.553999999999995, 4, 41, 7.0, 9.900000000000034, 12.0, 22.0, 0.5621678993134805, 0.37496159690537817, 0.2629672107140207], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 559.8999999999999, 363, 3414, 540.0, 628.9000000000001, 655.8499999999999, 733.9300000000001, 0.5619625530633141, 0.42256949790893733, 0.31061602054085524], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 13.453999999999995, 8, 53, 14.0, 16.0, 18.94999999999999, 28.99000000000001, 0.5643194364028924, 0.46071391487579894, 0.3482909021549102], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 13.185999999999993, 8, 50, 13.0, 16.0, 19.0, 25.980000000000018, 0.5643258056033038, 0.46889743011671386, 0.3571124238583407], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 13.501999999999992, 8, 66, 14.0, 17.0, 19.0, 27.970000000000027, 0.5643035140308426, 0.45684337219879734, 0.34442353151296545], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 16.271999999999995, 10, 66, 17.0, 19.0, 22.94999999999999, 30.0, 0.5643143411460774, 0.504796812978327, 0.3923748153281319], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 13.228000000000007, 8, 94, 13.0, 16.0, 18.0, 39.97000000000003, 0.5641214260087055, 0.4236419693366158, 0.311258403998944], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2214.746000000001, 1729, 3608, 2197.5, 2563.9, 2664.95, 2832.5200000000004, 0.563042139199782, 0.4700302170640055, 0.3584994870686112], "isController": false}]}, function(index, item){
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
