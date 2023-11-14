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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8622846202935546, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.455, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.998, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [0.5, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.996, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [0.972, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.601, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.72, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.289, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 499.1523931078485, 1, 32317, 15.0, 1219.9000000000015, 2345.0, 9813.990000000002, 9.912928179032416, 62.44415650240959, 82.03032662660797], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 10062.122000000008, 8467, 32317, 9784.0, 10562.6, 10792.85, 31385.530000000184, 0.21417339563780194, 0.124410062728175, 0.10792331264561114], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 3.495999999999999, 2, 18, 3.0, 4.0, 5.0, 8.0, 0.21491917319734394, 0.11033706888825749, 0.07765634187794654], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 5.123999999999999, 3, 18, 5.0, 6.0, 7.0, 10.990000000000009, 0.21491769511947706, 0.12334890488151157, 0.09066840262852938], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 20.627999999999957, 13, 569, 18.0, 23.0, 27.94999999999999, 87.98000000000002, 0.2131129234234119, 0.11086658734070874, 2.344866511925373], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 53.53000000000002, 32, 76, 56.0, 67.0, 69.0, 72.99000000000001, 0.21484750983142206, 0.8935285533146244, 0.0893799210822127], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 3.4359999999999986, 2, 13, 3.0, 4.0, 5.0, 9.0, 0.2148541569982296, 0.13422300075521237, 0.0908514159963217], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 47.18399999999998, 28, 74, 50.0, 59.0, 62.0, 65.99000000000001, 0.21484704823788897, 0.8817771856443929, 0.0780499042426706], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1213.0399999999984, 870, 1785, 1170.5, 1480.8000000000002, 1648.2499999999998, 1761.97, 0.21477368008687167, 0.9083227774306796, 0.10445048113599813], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 8.855999999999987, 6, 21, 9.0, 11.0, 12.0, 18.0, 0.21483273982208412, 0.31946089966258373, 0.1097241434833496], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 5.410000000000006, 3, 22, 5.0, 6.900000000000034, 8.0, 11.990000000000009, 0.21329301810900383, 0.20573403019184, 0.11664461927836145], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 12.193999999999997, 8, 25, 12.0, 15.0, 16.0, 20.0, 0.21484870998389066, 0.35011737386447084, 0.1403650263468973], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 622.0, 622, 622, 622.0, 622.0, 622.0, 622.0, 1.607717041800643, 0.6955260249196141, 1901.5917026728296], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 6.0459999999999905, 4, 18, 6.0, 8.0, 9.0, 14.990000000000009, 0.21329465590239635, 0.2142757280013224, 0.12518563300521504], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 12.373999999999992, 8, 25, 12.0, 15.0, 16.0, 21.0, 0.21484778678849395, 0.3375271319184747, 0.12777568569745393], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 9.537999999999997, 7, 19, 9.0, 12.0, 13.0, 17.980000000000018, 0.21484714055643692, 0.3324906368273351, 0.12273982150929258], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2342.7760000000007, 1970, 3006, 2294.0, 2708.3, 2812.5499999999997, 2944.9700000000003, 0.21464847020035288, 0.32778121029003304, 0.11822435272753812], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 18.326, 13, 97, 17.0, 22.0, 25.0, 74.96000000000004, 0.21310574776036514, 0.11087492482694747, 1.7181650913179438], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 17.45400000000002, 12, 33, 17.0, 21.0, 23.0, 28.0, 0.21484944854592042, 0.3889341516250568, 0.17918108306466413], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 12.264, 9, 25, 12.0, 15.0, 16.0, 21.99000000000001, 0.214849356225389, 0.36375632556788984, 0.15400334713812064], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 116.0, 116, 116, 116.0, 116.0, 116.0, 116.0, 8.620689655172413, 4.066204202586206, 1175.7139008620688], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 662.0, 662, 662, 662.0, 662.0, 662.0, 662.0, 1.5105740181268883, 0.7007057212990936, 2888.887249811178], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 3.6700000000000004, 2, 42, 3.0, 4.0, 5.0, 11.0, 0.21328064448292028, 0.17927029639931083, 0.09018605377060983], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 780.5419999999997, 603, 991, 760.5, 947.9000000000001, 958.0, 967.0, 0.2132247081380195, 0.18776059724134136, 0.09869971841545043], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 4.5960000000000045, 3, 16, 4.0, 6.0, 6.0, 12.990000000000009, 0.21328655816921643, 0.19323053992105838, 0.1041438272310627], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1063.2659999999998, 789, 1426, 1027.0, 1315.6000000000001, 1333.85, 1353.98, 0.21320716017870173, 0.20170729897656298, 0.11264167349284923], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 90.0, 90, 90, 90.0, 90.0, 90.0, 90.0, 11.11111111111111, 5.262586805555555, 731.6297743055555], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 38.03000000000003, 25, 1667, 34.0, 40.0, 46.0, 106.90000000000009, 0.21295544248094792, 0.11078466187893142, 9.714012420200271], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 47.13600000000001, 29, 501, 45.0, 54.0, 60.0, 186.72000000000025, 0.21321688848330297, 48.223394846627755, 0.06579739918039428], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 654.0, 654, 654, 654.0, 654.0, 654.0, 654.0, 1.529051987767584, 0.8018563646788991, 0.6271502293577982], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 4.020000000000003, 2, 11, 4.0, 5.0, 5.949999999999989, 9.0, 0.21490189943192833, 0.2335190356610361, 0.0921307947759927], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 4.872000000000001, 3, 16, 5.0, 6.0, 7.0, 10.990000000000009, 0.21490116050924699, 0.22050663902213957, 0.07911888428904894], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.775999999999998, 1, 16, 3.0, 4.0, 5.0, 7.990000000000009, 0.21491981986280378, 0.12188094589114139, 0.08332340672415342], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 127.46599999999991, 83, 176, 129.0, 164.0, 168.95, 173.99, 0.21491085927379042, 0.1957514722199776, 0.07009787792719337], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 123.08400000000006, 82, 713, 121.0, 139.0, 149.0, 485.8100000000002, 0.2131555331979085, 0.1108887539940018, 63.02867568065891], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 270.686, 16, 528, 284.0, 489.90000000000003, 502.0, 518.99, 0.21489829723185205, 0.11977012423163115, 0.09003063428951615], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 576.9719999999996, 448, 750, 550.0, 699.0, 709.0, 735.98, 0.21487225414746428, 0.1155588858218262, 0.09148857696122502], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 11.012000000000002, 7, 387, 9.0, 13.0, 20.0, 45.98000000000002, 0.21292225143988672, 0.09600423116436532, 0.15449339142562094], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 535.5880000000009, 387, 691, 526.0, 642.0, 653.95, 677.0, 0.21486505185553162, 0.11051911275666705, 0.08644961070749906], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 5.055999999999997, 3, 20, 5.0, 6.0, 7.0, 15.990000000000009, 0.21327937080879378, 0.13094811838007495, 0.10663968540439689], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 5.7280000000000015, 3, 37, 5.0, 7.0, 7.949999999999989, 15.960000000000036, 0.21327636863711283, 0.1249062217142216, 0.10059813090988817], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 937.2719999999996, 689, 1424, 892.5, 1161.0, 1321.5, 1406.95, 0.21319379657218487, 0.19481207752984286, 0.09389687720122594], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 332.3020000000001, 219, 427, 331.0, 400.0, 404.0, 411.99, 0.21323643869559006, 0.18881212043913911, 0.08766849676840177], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 6.802000000000004, 4, 58, 7.0, 8.0, 9.0, 14.990000000000009, 0.21329556579848263, 0.14220607004519734, 0.09977400001706364], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1622.4140000000004, 1282, 17811, 1450.0, 1767.9, 1802.75, 9044.140000000067, 0.21318152534792292, 0.16024214050346655, 0.11783275717473084], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 171.0879999999999, 130, 217, 173.5, 206.0, 208.95, 212.0, 0.21493386270110826, 4.15567696953033, 0.10830651675173032], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 232.774, 179, 386, 224.0, 282.0, 285.95, 295.0, 0.21490984317169104, 0.4165368308996943, 0.15362695820476355], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 11.321999999999994, 7, 39, 11.0, 14.0, 15.0, 22.970000000000027, 0.2148299706714124, 0.17532769022442, 0.13259037252376235], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 11.133999999999999, 7, 28, 11.0, 14.0, 15.0, 22.99000000000001, 0.21483117062793863, 0.1786854065776578, 0.1359478501629924], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 12.410000000000004, 8, 29, 12.0, 15.0, 17.0, 23.99000000000001, 0.214826924688125, 0.1738566608967735, 0.13111994915046693], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 15.160000000000002, 11, 32, 15.0, 18.0, 19.0, 27.970000000000027, 0.21482821691290993, 0.19210971338800856, 0.1493727445722577], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 11.718000000000007, 8, 57, 12.0, 14.0, 15.0, 50.70000000000027, 0.2148119729319729, 0.1612579215942743, 0.11852418428375458], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2638.1720000000005, 2225, 3329, 2582.5, 3044.0, 3168.95, 3300.8900000000003, 0.21460166925762414, 0.179344962204354, 0.13664090659762787], "isController": false}]}, function(index, item){
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
