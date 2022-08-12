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

    var data = {"OkPercent": 97.82174005530739, "KoPercent": 2.1782599446926185};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8809189534141671, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.398, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [0.997, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.829, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.325, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.991, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.954, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.588, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [0.972, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [0.85, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 512, 2.1782599446926185, 279.37843012125046, 1, 6267, 31.0, 779.0, 1801.9000000000015, 3728.9900000000016, 17.636704153573262, 117.6719299036678, 146.087752275495], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 50.41399999999995, 21, 141, 40.0, 88.0, 95.0, 109.99000000000001, 0.3818181262809998, 0.22170582712687972, 0.19240054019628508], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 12.426, 4, 66, 10.0, 22.0, 27.0, 40.98000000000002, 0.38167443628594133, 4.078962155166688, 0.13790970842363115], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 13.500000000000005, 5, 63, 11.0, 24.0, 29.0, 48.950000000000045, 0.381657538690533, 4.098237905034063, 0.1610117741350686], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 46.689999999999976, 15, 287, 37.5, 89.90000000000003, 114.69999999999993, 162.8900000000001, 0.3794907992455723, 0.20487537166380151, 4.224799913476097], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 72.232, 27, 169, 61.0, 122.0, 134.95, 152.99, 0.3817417501790369, 1.5876460448500747, 0.1588105327893259], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 5.296000000000007, 1, 33, 4.0, 11.0, 13.949999999999989, 17.0, 0.3817560319361826, 0.23853265125937495, 0.1614261345980147], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 63.62199999999996, 25, 152, 57.0, 103.90000000000003, 116.0, 137.98000000000002, 0.3817405843684865, 1.5667647580909918, 0.13867919666511425], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1096.7780000000014, 582, 2654, 895.5, 1939.8000000000002, 2095.5499999999997, 2415.78, 0.3813803987255793, 1.6128726038822998, 0.18547601422396334], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 25.401999999999994, 9, 71, 20.0, 43.0, 49.0, 60.0, 0.38158064439812905, 0.5674618421740482, 0.19488933302756006], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 7.737999999999992, 2, 46, 5.0, 18.0, 22.94999999999999, 34.98000000000002, 0.37954668462175517, 0.3660957576833533, 0.20756459315252235], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 42.59000000000002, 15, 111, 33.0, 76.0, 80.0, 95.97000000000003, 0.3817280523547658, 0.6219990210584097, 0.24939069045443196], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 723.0, 723, 723, 723.0, 723.0, 723.0, 723.0, 1.3831258644536653, 0.5902597683264177, 1635.9474952455048], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 8.007999999999994, 2, 59, 6.0, 16.0, 20.0, 26.99000000000001, 0.3795507182238241, 0.3813394992454532, 0.2227636539575374], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 42.488000000000035, 16, 134, 32.0, 75.0, 80.0, 103.88000000000011, 0.38171843532086486, 0.5997251400620369, 0.22701809288125657], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 24.13599999999998, 9, 83, 18.0, 43.0, 49.0, 60.99000000000001, 0.38172601233738473, 0.5907470986437275, 0.21807589572008795], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2824.218000000001, 1513, 6063, 2533.5, 4274.200000000001, 4827.5, 5533.640000000001, 0.381137359617582, 0.5819982369538588, 0.20992331135187134], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 1, 0.2, 45.02199999999996, 12, 750, 37.0, 88.0, 106.0, 139.99, 0.37946977447352365, 0.20468836803710913, 3.0594750566927846], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 48.47999999999998, 19, 116, 39.0, 83.0, 89.0, 106.0, 0.38173184101632285, 0.6910785272499275, 0.3183583908475974], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 41.74800000000004, 16, 107, 31.0, 75.0, 84.0, 95.98000000000002, 0.38172455519546206, 0.6462671275036359, 0.2736189682748722], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 79.0, 79, 79, 79.0, 79.0, 79.0, 79.0, 12.658227848101266, 5.896459651898734, 1726.3647151898733], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 544.0, 544, 544, 544.0, 544.0, 544.0, 544.0, 1.838235294117647, 0.8419261259191176, 3515.5208812040437], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 5.332000000000002, 1, 32, 3.0, 12.0, 16.0, 26.970000000000027, 0.37999638243443923, 0.31931496793400527, 0.1606820640567502], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 569.6440000000001, 319, 1369, 460.0, 1025.6000000000001, 1127.9, 1280.6200000000003, 0.37977558301248626, 0.3343567968815867, 0.17579455698038915], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 7.642000000000001, 2, 88, 5.0, 17.0, 22.0, 36.98000000000002, 0.37987657050471163, 0.34419859268076614, 0.1854866066917537], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1630.801999999999, 918, 3602, 1297.5, 2877.0000000000023, 3151.2, 3492.7700000000004, 0.37928324569361804, 0.35878268994884227, 0.20038304289086656], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 55.0, 55, 55, 55.0, 55.0, 55.0, 55.0, 18.18181818181818, 8.504971590909092, 1197.2123579545455], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 4, 0.8, 81.76400000000001, 14, 1120, 66.0, 139.7000000000001, 161.89999999999998, 201.95000000000005, 0.3791515195634601, 0.20407608381409748, 17.342479368470062], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 102.39, 11, 290, 87.0, 180.0, 213.89999999999998, 269.94000000000005, 0.3797827946240986, 84.80919647122919, 0.11719859677853044], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 469.0, 469, 469, 469.0, 469.0, 469.0, 469.0, 2.1321961620469083, 1.1181536513859276, 0.8745335820895523], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 5.756000000000001, 1, 34, 4.0, 15.0, 18.94999999999999, 24.0, 0.3816817201937111, 0.4147471356218206, 0.16363112809085859], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 7.328000000000006, 1, 53, 5.0, 16.0, 20.0, 32.0, 0.3816785152400414, 0.3915909746485314, 0.14052031273974183], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 4.770000000000004, 1, 34, 3.0, 10.0, 13.0, 19.99000000000001, 0.3816802633899162, 0.21647234688323713, 0.14797564899003585], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 184.686, 86, 445, 142.0, 344.90000000000003, 381.9, 417.0, 0.3816394773981652, 0.34763778520872246, 0.12448006391697967], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 7, 1.4, 292.6000000000004, 38, 956, 254.5, 472.90000000000003, 513.95, 644.9200000000001, 0.37952767022385303, 0.20383749203940713, 112.27125274303624], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 5.199999999999999, 1, 36, 3.0, 12.0, 14.0, 20.0, 0.3816764757520935, 0.21276450776139114, 0.1599015704078595], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 6.857999999999996, 2, 41, 5.0, 15.0, 19.94999999999999, 28.0, 0.38175078545224106, 0.20532823886910145, 0.162542326618337], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 40.51999999999996, 7, 442, 29.0, 96.90000000000003, 120.94999999999999, 155.96000000000004, 0.37903252705534174, 0.16021009038599157, 0.2750206714864443], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 8.32199999999999, 2, 222, 6.0, 16.0, 19.0, 28.99000000000001, 0.38168638204058697, 0.19636944326651784, 0.1535691302741424], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 6.990000000000002, 2, 32, 5.0, 14.900000000000034, 20.0, 26.99000000000001, 0.3799929169320284, 0.23334904881123014, 0.18999645846601418], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 8.003999999999998, 2, 45, 6.0, 17.0, 21.0, 29.980000000000018, 0.37998252080404304, 0.2225383960462819, 0.17923003666831328], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 748.8900000000008, 387, 1816, 619.0, 1383.5000000000002, 1503.6, 1716.6200000000003, 0.3796564868107336, 0.34687922961054835, 0.1672119878433993], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 25.673999999999996, 6, 263, 23.5, 45.0, 53.0, 72.99000000000001, 0.3798523286087301, 0.3363866872489651, 0.1561697561955814], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 22.762000000000004, 8, 80, 17.0, 41.0, 46.0, 60.98000000000002, 0.37955417566526356, 0.25296618623015404, 0.17754536146841918], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 809.1239999999999, 475, 5936, 782.0, 984.0, 1025.0, 1183.6600000000003, 0.37943694592719973, 0.285168356410056, 0.20972784315897952], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 244.5680000000001, 144, 608, 192.0, 466.80000000000007, 512.95, 561.8200000000002, 0.381754574565067, 7.381144918474402, 0.19236851608942832], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 428.12400000000025, 225, 936, 367.0, 686.8000000000001, 751.8499999999999, 840.7900000000002, 0.3816339428281823, 0.7397019896867244, 0.27280863881858347], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 41.76800000000001, 15, 136, 31.0, 77.0, 83.0, 96.0, 0.38155472868406354, 0.3113307732282887, 0.23549080910969544], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 41.607999999999954, 15, 125, 31.0, 76.0, 84.0, 100.99000000000001, 0.3815762763344867, 0.31733209713749105, 0.24146623736791736], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 40.662000000000006, 15, 170, 30.0, 77.0, 83.0, 110.96000000000004, 0.3815256141036285, 0.3087637613904472, 0.23286475470192167], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 44.021999999999984, 18, 117, 34.0, 82.0, 88.0, 107.97000000000003, 0.38153114553200324, 0.34122670203905503, 0.265283374627721], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 41.302000000000035, 16, 123, 30.0, 78.0, 83.0, 98.99000000000001, 0.3811484001295905, 0.28616874988089114, 0.21030160749337753], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 3201.9399999999973, 1673, 6267, 2867.0, 4740.700000000001, 5316.75, 5853.080000000001, 0.3806985818977824, 0.31811084277148566, 0.24239792519272865], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["No results for path: $['rows'][1]", 500, 97.65625, 2.1272069772388855], "isController": false}, {"data": ["500", 12, 2.34375, 0.05105296745373325], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 23505, 512, "No results for path: $['rows'][1]", 500, "500", 12, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Query cross patient #1", 500, 500, "No results for path: $['rows'][1]", 500, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 4, "500", 4, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 7, "500", 7, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
