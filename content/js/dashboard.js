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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8916613486492235, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.162, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.679, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.986, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.497, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.084, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 323.0670070197814, 1, 18169, 9.0, 834.9000000000015, 1529.9500000000007, 6044.980000000003, 15.27997358101994, 96.25250298546176, 126.44308533861995], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6186.474000000002, 5204, 18169, 6025.0, 6613.8, 6886.5, 15925.660000000076, 0.3295770340176231, 0.19140894326232485, 0.1660759272979429], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.220000000000001, 1, 15, 2.0, 3.0, 4.0, 5.0, 0.3306998601139592, 0.1697775619731538, 0.11949116039273916], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.461999999999998, 2, 13, 3.0, 4.0, 5.0, 8.0, 0.3306974541587189, 0.1897990242027546, 0.13951298847320956], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 13.427999999999987, 8, 382, 11.0, 15.0, 17.94999999999999, 69.91000000000008, 0.32854187857617834, 0.17091557044562106, 3.614923189372853], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 33.88600000000001, 24, 74, 33.0, 40.0, 41.0, 45.0, 0.33062900846344134, 1.3750518209309983, 0.13754683359904885], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.227999999999998, 1, 31, 2.0, 3.0, 4.0, 6.990000000000009, 0.330637316653342, 0.2065546853870209, 0.13981050596767292], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 29.731999999999992, 21, 63, 29.0, 35.0, 37.0, 41.99000000000001, 0.33063141342284186, 1.3569804174866325, 0.12011219315751677], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 847.9980000000004, 674, 1112, 850.0, 1000.6000000000001, 1043.0, 1078.0, 0.3304856486607069, 1.3976928745228614, 0.16072446585257036], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 5.533999999999999, 3, 14, 5.0, 7.0, 8.0, 12.990000000000009, 0.33054354580672457, 0.4915253541360914, 0.16882253364933295], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.738000000000002, 2, 17, 4.0, 5.0, 5.0, 10.0, 0.3287700056548441, 0.31711857645053326, 0.17979609684249287], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 7.483999999999999, 5, 21, 7.0, 9.0, 10.949999999999989, 14.0, 0.33063666072843223, 0.5388053731681076, 0.21601164651105584], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 465.0, 465, 465, 465.0, 465.0, 465.0, 465.0, 2.150537634408602, 0.9303595430107526, 2543.6344926075267], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 3.920000000000002, 2, 23, 4.0, 5.0, 6.0, 10.0, 0.3287723836458096, 0.33028460818386796, 0.19296113532337067], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 7.815999999999997, 5, 31, 8.0, 9.0, 11.0, 14.0, 0.33063534888642016, 0.5194300704170635, 0.19663762448420885], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.5340000000000025, 4, 23, 6.0, 8.0, 9.0, 13.980000000000018, 0.3306346929693178, 0.5116797893509839, 0.18888798377641688], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1568.0240000000006, 1282, 2106, 1551.5, 1742.8000000000002, 1800.95, 1888.99, 0.33026669696313166, 0.5043372428791197, 0.18190470418672486], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 11.701999999999995, 7, 91, 10.0, 15.0, 22.0, 33.0, 0.3285248249783995, 0.17090669874437814, 2.648731401388346], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 11.010000000000009, 8, 40, 11.0, 13.0, 15.0, 20.99000000000001, 0.33063884715491887, 0.5985434935151803, 0.27574763229521554], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 7.669999999999997, 5, 34, 7.0, 9.0, 11.0, 15.990000000000009, 0.330637316653342, 0.5597941623584625, 0.236999795335501], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 44.0, 44, 44, 44.0, 44.0, 44.0, 44.0, 22.727272727272727, 10.719992897727273, 3099.609375], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 499.0, 499, 499, 499.0, 499.0, 499.0, 499.0, 2.004008016032064, 0.9295935621242485, 3832.5518223947897], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.2740000000000014, 1, 39, 2.0, 3.0, 3.0, 6.0, 0.3287522798970611, 0.27632849104511664, 0.13901341522990962], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 545.0020000000007, 424, 684, 535.0, 636.9000000000001, 646.0, 666.99, 0.32866411185097055, 0.2894137854464245, 0.15213553614976566], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.130000000000001, 2, 14, 3.0, 4.0, 5.0, 7.990000000000009, 0.3287721674633912, 0.2978566674584596, 0.160533284894234], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 746.5360000000001, 576, 932, 728.0, 869.0, 881.0, 907.99, 0.32863667703624927, 0.3108922220818214, 0.1736254319107528], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 50.0, 50, 50, 50.0, 50.0, 50.0, 50.0, 20.0, 9.47265625, 1316.93359375], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 25.286000000000005, 17, 721, 23.0, 28.0, 32.94999999999999, 95.92000000000007, 0.3283714222291691, 0.1708268948590827, 14.978739387035635], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 31.09200000000001, 21, 281, 29.0, 35.0, 40.94999999999999, 106.88000000000011, 0.3286494217742073, 74.33084191909407, 0.1014191575006343], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 428.0, 428, 428, 428.0, 428.0, 428.0, 428.0, 2.336448598130841, 1.2252665011682242, 0.9583089953271028], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.550000000000001, 1, 13, 2.0, 3.900000000000034, 4.0, 6.990000000000009, 0.3306447506508742, 0.359288789547592, 0.14175102103099002], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.2680000000000007, 2, 9, 3.0, 4.0, 5.0, 7.0, 0.330644313347648, 0.33926883445069067, 0.12173135364459307], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.7000000000000006, 1, 12, 2.0, 2.0, 3.0, 5.0, 0.33070160992157743, 0.1875407538062102, 0.12821146400279906], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 91.01799999999996, 65, 130, 90.0, 110.0, 113.94999999999999, 116.0, 0.33067951995915446, 0.30119931158310836, 0.10785835904917733], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 84.30599999999995, 59, 346, 81.5, 96.90000000000003, 102.0, 311.60000000000036, 0.3286012561768821, 0.1709464601347528, 97.16520933378723], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 206.72799999999998, 12, 379, 259.0, 334.0, 341.0, 365.97, 0.33064059631692827, 0.1842772409414396, 0.13852032794918187], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 407.00400000000013, 303, 526, 391.0, 484.0, 492.0, 512.0, 0.33060977004768055, 0.17780283834273258, 0.140767441153114], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 6.991999999999999, 4, 254, 6.0, 8.0, 10.949999999999989, 27.980000000000018, 0.328320750987753, 0.14803610736187053, 0.2382249199061528], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 380.054, 286, 496, 373.0, 444.0, 453.95, 469.98, 0.33058069805420204, 0.17003921823450072, 0.13300707773274534], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.2800000000000002, 2, 11, 3.0, 4.0, 5.0, 8.990000000000009, 0.32875033450346536, 0.20184435820866573, 0.16437516725173268], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 3.979999999999994, 2, 42, 4.0, 5.0, 5.0, 8.0, 0.328741904730596, 0.19252910906834544, 0.1550608788914823], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 671.118, 530, 867, 674.5, 811.7, 836.95, 846.0, 0.328587003595399, 0.3002560011076668, 0.14471947131008298], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 238.55800000000002, 175, 312, 234.0, 280.0, 284.0, 300.95000000000005, 0.3286669203975292, 0.29102107753285517, 0.1351257553587498], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.397999999999997, 3, 39, 4.0, 5.0, 7.0, 8.0, 0.32877562641620106, 0.2191976639751998, 0.15379250493492214], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 989.1859999999997, 770, 8660, 946.5, 1076.9, 1107.95, 1140.99, 0.32860816696449524, 0.24700487518968908, 0.1816330297870159], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 134.26799999999997, 116, 169, 135.5, 149.0, 150.0, 154.0, 0.33067930126140926, 6.3935777233176525, 0.16663136665125702], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 182.048, 157, 246, 176.0, 203.0, 205.0, 220.97000000000003, 0.3306513103380777, 0.6408661739659046, 0.23636402262448528], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 6.913999999999999, 5, 47, 7.0, 9.0, 10.0, 14.0, 0.3305396125282446, 0.2697609956894329, 0.20400491710727595], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 6.86, 5, 18, 7.0, 9.0, 10.0, 14.990000000000009, 0.3305420161873036, 0.2749276763739144, 0.20917111961852808], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.186000000000012, 5, 20, 8.0, 10.0, 12.0, 14.990000000000009, 0.33053633486768297, 0.2674987949884742, 0.20174336844951354], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 9.474000000000002, 7, 23, 9.0, 12.0, 13.0, 16.0, 0.33053699039459505, 0.29558205808030724, 0.22982650113374187], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 7.627999999999995, 5, 27, 7.0, 9.0, 10.0, 24.960000000000036, 0.33048652242912885, 0.248094037750484, 0.1823485206762283], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1628.7099999999996, 1392, 1987, 1610.0, 1809.9, 1876.0, 1956.92, 0.3301881808480289, 0.27592317210299494, 0.2102370057743309], "isController": false}]}, function(index, item){
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
