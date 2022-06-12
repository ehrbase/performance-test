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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9180413542376733, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.009, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.998, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.871, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.743, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.776, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 22005, 0, 0.0, 189.4140422631217, 1, 3722, 13.0, 567.9000000000015, 1262.800000000003, 2138.980000000003, 25.908809937303154, 174.18973454103258, 228.22641555426367], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query participation #2", 500, 0, 0.0, 7.149999999999998, 4, 27, 7.0, 9.0, 11.0, 19.0, 0.5999160117583539, 6.411984353440518, 0.21676652768612392], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 7.454, 4, 38, 7.0, 9.0, 10.949999999999989, 16.980000000000018, 0.5998944185823295, 6.44115541914623, 0.25308045783942024], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 19.495999999999988, 12, 253, 18.0, 23.0, 28.94999999999999, 42.99000000000001, 0.5956642788471276, 0.3210072027724598, 6.631418729352787], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 42.994, 26, 83, 44.0, 53.0, 55.0, 65.93000000000006, 0.5996620304796217, 2.4941021365358482, 0.24946877439874887], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.102000000000002, 1, 11, 2.0, 3.0, 3.0, 6.0, 0.5997030270609994, 0.37481439191312466, 0.2535853620287234], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 38.19999999999998, 22, 60, 39.0, 47.0, 49.0, 53.98000000000002, 0.5996462087368453, 2.460563892303541, 0.21784022426768204], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 747.3219999999992, 561, 969, 751.5, 887.0, 907.95, 929.95, 0.5993040880929065, 2.5347519585257596, 0.291458433467058], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 8.282000000000012, 5, 31, 8.0, 10.0, 12.0, 17.0, 0.599436290112778, 0.8915444041423446, 0.3061574020790848], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.0699999999999976, 1, 16, 3.0, 4.0, 5.0, 8.990000000000009, 0.5966992981622855, 0.5757215884612676, 0.32631992868249987], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 12.559999999999999, 8, 31, 13.0, 15.0, 17.0, 21.0, 0.5996447704379926, 0.9773507049423922, 0.39176010881154005], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 581.0, 581, 581, 581.0, 581.0, 581.0, 581.0, 1.721170395869191, 0.734522913080895, 2035.783199763339], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.058000000000003, 2, 22, 4.0, 5.0, 6.0, 9.990000000000009, 0.5967078434859195, 0.5989454978989917, 0.35021622454593515], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 13.514000000000003, 9, 31, 14.0, 16.0, 18.0, 21.0, 0.5996433321460396, 0.94153372573993, 0.35662381765325984], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 8.017999999999988, 5, 19, 8.0, 10.0, 11.0, 14.0, 0.5996411747210469, 0.928155529231308, 0.3425684445427856], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1843.0600000000002, 1452, 2249, 1822.5, 2126.7000000000003, 2180.9, 2225.92, 0.5984046531945832, 0.9139696070276643, 0.32959006289232906], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 16.340000000000003, 10, 67, 15.0, 20.0, 25.0, 42.930000000000064, 0.5956259611913949, 0.3216612856824623, 4.802234312105622], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 17.113999999999976, 11, 41, 18.0, 21.0, 22.94999999999999, 27.99000000000001, 0.599656277022011, 1.0857057984363363, 0.5001039654070286], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 12.770000000000008, 8, 30, 13.0, 16.0, 17.0, 22.0, 0.5996519620012545, 1.015426271591968, 0.4298286524501179], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 84.0, 84, 84, 84.0, 84.0, 84.0, 84.0, 11.904761904761903, 5.545479910714286, 1623.6049107142856], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 607.0, 607, 607, 607.0, 607.0, 607.0, 607.0, 1.6474464579901154, 0.7545433484349259, 3150.648038509061], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.134000000000002, 1, 22, 2.0, 2.900000000000034, 4.0, 9.980000000000018, 0.5966252489418852, 0.5016546282607062, 0.2522839187420276], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 389.1719999999998, 304, 517, 387.5, 456.0, 463.0, 484.99, 0.5964181511514449, 0.524684889925066, 0.2760763707478368], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 2.7979999999999996, 1, 12, 3.0, 4.0, 4.0, 9.980000000000018, 0.5966957376830065, 0.5407555122752248, 0.29135534066553054], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1120.5559999999987, 911, 1428, 1112.0, 1308.9, 1341.0, 1379.96, 0.5960527005955758, 0.5640381512471807, 0.31490674904512356], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 71.0, 71, 71, 71.0, 71.0, 71.0, 71.0, 14.084507042253522, 6.588358274647888, 927.4180237676057], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 41.160000000000004, 27, 637, 40.0, 46.0, 52.0, 80.97000000000003, 0.595184245234955, 0.32142274181145514, 27.223866873354314], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 39.42999999999999, 28, 189, 40.0, 48.0, 53.0, 77.97000000000003, 0.5959901780818653, 134.8701328089613, 0.18391884401745057], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 245.0, 245, 245, 245.0, 245.0, 245.0, 245.0, 4.081632653061225, 2.14046556122449, 1.6741071428571428], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.091999999999999, 1, 21, 2.0, 3.0, 4.0, 6.0, 0.5999548833927688, 0.6520993996251482, 0.2572072205170171], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.0360000000000023, 1, 25, 3.0, 4.0, 5.0, 9.990000000000009, 0.5999484044372184, 0.6157673565073404, 0.22087944186799935], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.8540000000000005, 1, 11, 2.0, 3.0, 3.0, 5.0, 0.5999282485814696, 0.3403889769783534, 0.23258936981137057], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 118.546, 84, 218, 117.0, 145.0, 149.0, 162.0, 0.5998526761827295, 0.5465454559360221, 0.19565507211428873], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 157.31199999999993, 108, 530, 157.0, 185.0, 209.95, 314.9000000000001, 0.5957508665196354, 0.3217287394388265, 176.23404393007314], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 2.138, 1, 14, 2.0, 3.0, 4.0, 6.990000000000009, 0.5999440852112583, 0.33385950929373387, 0.25134376226135724], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 441.40199999999965, 344, 629, 446.5, 518.0, 525.0, 552.94, 0.5997145358809207, 0.6517444571384021, 0.2576898396363331], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 11.049999999999988, 7, 303, 9.0, 13.0, 17.0, 40.8900000000001, 0.5949880585896641, 0.251591630243481, 0.43171496829308637], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 2.6379999999999972, 1, 22, 2.0, 3.0, 4.0, 6.0, 0.5999584828729853, 0.6386276819644081, 0.24373313366715024], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.432, 2, 16, 3.0, 4.0, 6.0, 10.0, 0.5966181297930809, 0.36647734730453896, 0.29830906489654047], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 3.767999999999999, 2, 35, 3.0, 5.0, 6.0, 11.980000000000018, 0.5965946378073954, 0.3495671705902707, 0.28140157232516794], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 505.14399999999983, 361, 913, 512.0, 618.9000000000001, 626.95, 660.96, 0.595948266922845, 0.5440588650880395, 0.26247330896699517], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 14.418000000000001, 5, 119, 14.0, 22.900000000000034, 29.94999999999999, 46.0, 0.596120921936773, 0.5280094494107941, 0.24508487122595846], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 7.0219999999999905, 4, 32, 7.0, 8.0, 9.0, 13.990000000000009, 0.5967199497800489, 0.39800754462868504, 0.2791297421334409], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 506.6519999999996, 350, 3722, 497.0, 550.9000000000001, 575.75, 621.95, 0.5964935721852661, 0.44853520564712396, 0.3297025018133405], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 12.833999999999993, 8, 39, 13.0, 16.0, 17.0, 19.0, 0.5994226361168922, 0.4893723865173065, 0.36995615822839445], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 12.480000000000004, 8, 26, 13.0, 15.0, 16.0, 20.99000000000001, 0.59942551059065, 0.49806172014741074, 0.37932395592064566], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 12.968000000000016, 8, 44, 14.0, 16.0, 17.0, 23.99000000000001, 0.5994154500531083, 0.48526895321682295, 0.36585415652655534], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 15.315999999999995, 10, 32, 16.0, 18.0, 19.0, 23.99000000000001, 0.599417605854152, 0.5361977802367219, 0.4167825540704651], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 12.301999999999994, 8, 34, 13.0, 15.0, 16.0, 19.99000000000001, 0.5991489688047098, 0.4499468330183807, 0.3305851243893174], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2087.778000000001, 1639, 2653, 2062.0, 2390.8, 2495.85, 2598.91, 0.5979995718323066, 0.4992128456886025, 0.38075753987760147], "isController": false}]}, function(index, item){
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
