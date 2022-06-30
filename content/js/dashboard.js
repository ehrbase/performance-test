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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9044308111792775, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.468, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.849, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.363, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [0.995, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.995, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.611, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.516, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 22005, 0, 0.0, 233.82399454669397, 1, 6939, 15.0, 700.0, 1701.0, 2992.970000000005, 21.025365161051145, 140.8352618627776, 185.20522699905788], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query participation #2", 500, 0, 0.0, 8.908, 4, 55, 7.0, 15.0, 18.0, 24.99000000000001, 0.48658911733707294, 5.203949913010031, 0.17581833341280956], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 9.385999999999996, 4, 52, 8.0, 14.0, 18.0, 23.99000000000001, 0.4865715970642216, 5.224391463149987, 0.2052723925114685], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 27.556000000000022, 14, 273, 22.0, 42.0, 54.94999999999999, 92.86000000000013, 0.4832496022855773, 0.2604262309817119, 5.379927212944904], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 53.77199999999999, 25, 217, 48.0, 78.0, 99.0, 161.91000000000008, 0.48646413543161526, 2.0232917507844235, 0.20237668134166809], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.9839999999999995, 1, 20, 2.0, 5.0, 6.0, 11.990000000000009, 0.48648969468879744, 0.3040560591804984, 0.20571292753930595], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 48.294000000000025, 23, 169, 43.0, 74.90000000000003, 91.94999999999999, 147.99, 0.4864598758165229, 1.9961196919930648, 0.1767217517614712], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 957.3720000000004, 566, 3002, 885.0, 1294.8000000000002, 1708.8, 2595.4700000000003, 0.4861458165207905, 2.056149932960492, 0.23642638342515007], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 11.966000000000012, 5, 103, 10.0, 20.0, 27.0, 43.98000000000002, 0.4862318586893523, 0.7231749226405113, 0.24833912313919068], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 4.292000000000002, 1, 28, 3.0, 7.0, 10.0, 17.980000000000018, 0.48397510044903214, 0.4669603508238708, 0.2646738830580644], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 17.47999999999999, 8, 88, 15.0, 26.900000000000034, 38.0, 65.93000000000006, 0.4864447311225393, 0.7928479064878107, 0.31780422375095585], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 809.0, 809, 809, 809.0, 809.0, 809.0, 809.0, 1.2360939431396785, 0.5275127472187886, 1462.0396032911], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 5.210000000000003, 2, 27, 4.0, 8.0, 12.0, 19.0, 0.48398259598584836, 0.4857975307207953, 0.2840561915893504], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 19.512000000000004, 9, 91, 16.0, 31.0, 43.94999999999999, 80.97000000000003, 0.4864134981691396, 0.763745194234638, 0.2892830277197324], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 11.459999999999996, 5, 80, 9.0, 19.0, 26.0, 43.99000000000001, 0.48639835636267414, 0.7528724558933971, 0.27787406100797307], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2441.5140000000033, 1573, 5551, 2313.0, 3179.4, 3552.8999999999996, 4477.88, 0.48518629212872577, 0.7410462508684835, 0.26723151246152477], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 24.258000000000003, 12, 106, 20.0, 38.0, 47.0, 70.96000000000004, 0.48320803748921237, 0.2609512155581391, 3.895864802256775], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 23.744000000000014, 12, 148, 20.0, 38.0, 48.94999999999999, 67.97000000000003, 0.4864683951213058, 0.8807738325731453, 0.4057070404624952], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 17.88200000000001, 8, 139, 15.0, 27.0, 37.94999999999999, 73.92000000000007, 0.4864527766238037, 0.8237393697906988, 0.34868783011901555], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 78.0, 78, 78, 78.0, 78.0, 78.0, 78.0, 12.82051282051282, 5.972055288461538, 1748.4975961538462], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 608.0, 608, 608, 608.0, 608.0, 608.0, 608.0, 1.644736842105263, 0.7533023231907895, 3145.4660516036183], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 3.066, 1, 42, 2.0, 5.0, 8.0, 21.950000000000045, 0.48405287793638574, 0.40700149209299624, 0.20468251576802252], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 486.93800000000005, 310, 1701, 457.0, 648.4000000000002, 804.8499999999999, 1363.93, 0.48392498001389833, 0.42572165917550797, 0.2240043364517459], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 4.091999999999996, 1, 26, 3.0, 7.0, 10.0, 20.0, 0.48410208744820105, 0.43871751674993226, 0.23637797238681696], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1401.148, 924, 3747, 1311.0, 1961.8000000000002, 2227.3499999999995, 2826.96, 0.4835374828585962, 0.45756623133787083, 0.25546267404931694], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 57.0, 57, 57, 57.0, 57.0, 57.0, 57.0, 17.543859649122805, 8.20655153508772, 1155.2049067982455], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 54.50599999999997, 28, 812, 45.0, 76.0, 113.94999999999999, 169.94000000000005, 0.48283614086454707, 0.26075037685360797, 22.085038247864897], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 55.462, 28, 343, 47.0, 82.90000000000003, 107.94999999999999, 171.99, 0.48343088968687215, 109.3984275141307, 0.1491837511143082], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 310.0, 310, 310, 310.0, 310.0, 310.0, 310.0, 3.225806451612903, 1.6916582661290323, 1.3230846774193548], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.938000000000002, 1, 44, 2.0, 4.900000000000034, 6.0, 17.970000000000027, 0.4866208464477651, 0.5289150411097292, 0.20861967928766495], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 4.211999999999995, 2, 29, 3.0, 7.0, 9.0, 18.99000000000001, 0.4866146897296077, 0.49944535049396255, 0.17915404104302937], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.723999999999998, 1, 14, 2.0, 5.0, 7.949999999999989, 11.990000000000009, 0.4866037974560353, 0.2760906311737857, 0.18865401131840434], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 155.34600000000006, 84, 729, 137.0, 210.80000000000007, 296.9, 503.6700000000003, 0.4865379806143807, 0.4433007186652511, 0.1586950053957062], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 218.92999999999995, 114, 861, 193.0, 326.0, 398.9, 542.4300000000005, 0.4832538058653481, 0.26097593226907956, 142.955348012812], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 2.812, 1, 20, 2.0, 5.0, 6.0, 10.990000000000009, 0.4866113746382044, 0.2707916266834321, 0.20386355441385715], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 3.972000000000001, 2, 39, 3.0, 6.0, 8.949999999999989, 14.990000000000009, 0.486670105802081, 0.261319034154508, 0.20721500598604228], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 16.116, 7, 415, 11.0, 30.0, 35.94999999999999, 50.99000000000001, 0.4826590264960499, 0.20409312350858358, 0.3502106022329737], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 5.621999999999999, 2, 99, 4.0, 8.0, 10.949999999999989, 30.960000000000036, 0.4866241616682255, 0.2504403644522996, 0.19579019004620007], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 4.605999999999997, 2, 68, 4.0, 7.0, 10.0, 21.99000000000001, 0.4840421000456936, 0.29732664153197386, 0.24202105002284677], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 5.384000000000004, 2, 54, 4.0, 9.0, 12.949999999999989, 23.99000000000001, 0.4840177344097888, 0.28360414125573563, 0.22830133371086717], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 651.7460000000003, 372, 1878, 611.0, 902.0, 1199.0499999999993, 1672.5700000000004, 0.48348418039761737, 0.4413870617215904, 0.21294078648371623], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 19.24400000000001, 5, 155, 16.0, 37.0, 43.0, 58.98000000000002, 0.4835884584844144, 0.4283346990677382, 0.19881908302923681], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 9.533999999999999, 4, 51, 8.0, 16.0, 22.0, 40.99000000000001, 0.48399056024811293, 0.3228179225092394, 0.22639792808481063], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 649.5920000000009, 380, 4639, 621.0, 775.8000000000001, 809.0, 931.8100000000002, 0.48383272934880955, 0.36381953281111656, 0.2674309812611584], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 18.344000000000012, 8, 120, 15.0, 30.0, 44.0, 65.94000000000005, 0.48621814663366864, 0.39695153377514353, 0.30008776237546736], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 18.036000000000005, 8, 110, 15.0, 28.0, 41.0, 59.0, 0.48622334766719766, 0.40400221985269374, 0.30768821219564846], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 18.698000000000004, 9, 89, 16.0, 31.0, 44.0, 74.97000000000003, 0.48619639806260456, 0.3936101699159172, 0.29675073123938267], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 20.726000000000028, 10, 81, 19.0, 31.900000000000034, 39.94999999999999, 59.99000000000001, 0.48620396256229487, 0.43492463838580286, 0.33806369271909564], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 18.31400000000001, 8, 99, 15.0, 30.900000000000034, 44.94999999999999, 87.93000000000006, 0.48601066890620387, 0.3649826214735066, 0.26816018352734877], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2749.1719999999978, 1712, 6939, 2599.5, 3664.4, 4013.1499999999996, 5119.660000000002, 0.48522678529491114, 0.4050695948647479, 0.30895299219949424], "isController": false}]}, function(index, item){
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
