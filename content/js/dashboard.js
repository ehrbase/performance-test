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

    var data = {"OkPercent": 97.8174856413529, "KoPercent": 2.1825143586470963};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8788130185067007, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [0.998, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.394, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.001, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.824, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.323, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.995, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.909, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #4"], "isController": false}, {"data": [0.999, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.53, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.497, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [0.952, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [0.884, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 513, 2.1825143586470963, 286.91844288449255, 1, 7059, 28.0, 809.0, 1850.0, 3855.970000000005, 17.074900005956785, 113.46564012350879, 141.43423513137975], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 39.07199999999998, 16, 97, 33.0, 64.0, 69.94999999999999, 84.0, 0.3696557026785252, 0.2146436160922217, 0.1862718189278506], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 14.240000000000004, 5, 95, 12.0, 24.0, 28.94999999999999, 47.99000000000001, 0.36941045047387977, 3.954882308601057, 0.13347838542513232], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 14.783999999999994, 5, 54, 13.0, 24.0, 27.0, 39.960000000000036, 0.3693998065822613, 3.966551632488565, 0.15584054340189146], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 1, 0.2, 62.33799999999997, 15, 290, 51.0, 128.0, 139.95, 168.96000000000004, 0.36650227817816117, 0.1977351373247386, 4.080201143780309], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 71.78399999999999, 28, 168, 62.5, 117.0, 132.0, 156.93000000000006, 0.3690649738886531, 1.5349657346238303, 0.1535367957778967], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 6.922000000000003, 1, 28, 6.0, 14.0, 16.0, 20.0, 0.36909167277513383, 0.23064048431840212, 0.15607099053870407], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 59.98599999999995, 25, 156, 51.0, 104.0, 112.0, 136.0, 0.369038006486212, 1.514650906883223, 0.1340645882938192], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1148.7359999999992, 584, 2558, 905.5, 2270.7000000000003, 2385.35, 2504.83, 0.3689348040550362, 1.5602188011666458, 0.17942337150332818], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 21.006, 7, 79, 18.0, 36.0, 40.0, 52.98000000000002, 0.3686328807258824, 0.5482067726799537, 0.18827636388636373], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 9.811999999999994, 2, 84, 7.0, 21.0, 25.0, 32.99000000000001, 0.36693504295708546, 0.3539934159927905, 0.20066760161715613], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 32.41000000000001, 12, 110, 26.0, 57.0, 61.0, 68.0, 0.36897645930189654, 0.6012002977178806, 0.2410598156962586], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 809.0, 809, 809, 809.0, 809.0, 809.0, 809.0, 1.2360939431396785, 0.5275127472187886, 1462.0396032911], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 9.568000000000007, 2, 47, 7.0, 20.0, 23.0, 32.0, 0.3669385436649528, 0.36866788488734253, 0.2153613913502311], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 32.72999999999996, 12, 110, 27.0, 56.0, 61.94999999999999, 69.98000000000002, 0.3689497770805447, 0.5796849542465381, 0.21942423265825362], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 21.28999999999999, 7, 72, 17.0, 39.0, 42.94999999999999, 50.98000000000002, 0.36894950483286953, 0.5710372724780641, 0.21077681672580925], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2931.209999999999, 1496, 6057, 2565.0, 4560.1, 5034.65, 5938.240000000002, 0.3682348808281455, 0.5623586726034722, 0.20281686795612702], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 59.31000000000002, 13, 571, 48.0, 122.0, 142.89999999999998, 164.0, 0.366482936554474, 0.19787358583396858, 2.954768675970447], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 38.62800000000002, 14, 107, 33.0, 63.0, 69.94999999999999, 82.98000000000002, 0.36901948570492316, 0.6680643721742333, 0.3077564851484418], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 32.775999999999954, 11, 99, 26.0, 56.900000000000034, 61.0, 79.98000000000002, 0.369000694459307, 0.6246417810445819, 0.26449854466126105], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 230.0, 230, 230, 230.0, 230.0, 230.0, 230.0, 4.3478260869565215, 2.0253057065217392, 592.96875], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 580.0, 580, 580, 580.0, 580.0, 580.0, 580.0, 1.7241379310344827, 0.7896686422413793, 3297.3161368534484], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 8.191999999999993, 1, 80, 6.0, 18.0, 20.0, 28.99000000000001, 0.36686692709326935, 0.30824058899201107, 0.1551302533509625], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 595.7759999999997, 309, 1345, 465.0, 1164.7, 1235.95, 1287.96, 0.3668055637067903, 0.3228755825330859, 0.16979085663771348], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 10.049999999999992, 2, 50, 7.0, 23.0, 27.0, 33.99000000000001, 0.3669231949029965, 0.33242023158540907, 0.17916171626122876], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1697.7000000000003, 920, 3722, 1319.0, 3218.9, 3457.7, 3641.99, 0.36667994048051206, 0.34692291017184823, 0.19372446074214553], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 96.0, 96, 96, 96.0, 96.0, 96.0, 96.0, 10.416666666666666, 4.872639973958333, 685.9029134114584], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 2, 0.4, 96.27599999999998, 17, 817, 80.5, 171.0, 191.84999999999997, 239.87000000000012, 0.366266825382291, 0.1974593100448677, 16.75313043677319], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 114.58199999999998, 18, 384, 105.0, 211.0, 240.0, 272.99, 0.3666664955556354, 81.41096344050874, 0.11315098886287187], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 309.0, 309, 309, 309.0, 309.0, 309.0, 309.0, 3.236245954692557, 1.6971328883495145, 1.327366504854369], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 8.122000000000007, 1, 52, 5.0, 19.0, 21.0, 31.970000000000027, 0.3694852479319911, 0.40143128886061097, 0.15840236703334384], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 9.337999999999992, 2, 53, 7.0, 19.0, 21.0, 34.97000000000003, 0.3694811523969351, 0.3790768377161188, 0.13602968208363722], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 5.608000000000002, 1, 29, 4.0, 12.0, 13.0, 18.980000000000018, 0.3694178196812515, 0.2095385493497877, 0.14322155704439146], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 177.65000000000006, 84, 469, 138.0, 348.0, 379.95, 418.93000000000006, 0.3693902548940515, 0.3365217368618968, 0.12048471204552069], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 10, 2.0, 308.4959999999996, 45, 940, 255.5, 520.0, 568.9, 634.98, 0.36654795400263035, 0.19644035087253076, 108.43161438532107], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 6.439999999999993, 1, 24, 5.0, 13.900000000000034, 16.0, 20.0, 0.3694759648495346, 0.20598429366910323, 0.15479022355512728], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 8.857999999999997, 2, 65, 6.0, 19.900000000000034, 22.0, 31.0, 0.36952702757632394, 0.198795436581402, 0.1573376797102317], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 52.58200000000003, 8, 653, 36.0, 119.90000000000003, 140.0, 171.99, 0.3661061825083252, 0.15464267945060642, 0.2656414976598493], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 9.796000000000003, 3, 137, 7.0, 19.0, 22.0, 30.0, 0.36949016269390844, 0.1900947504408018, 0.14866205764637724], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 9.536000000000003, 2, 35, 7.0, 20.0, 23.0, 30.99000000000001, 0.3668631585743991, 0.22528622319697764, 0.18343157928719955], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 11.238000000000003, 2, 127, 8.0, 22.0, 26.899999999999977, 35.97000000000003, 0.3668295145158107, 0.2148976137556666, 0.17302603077259432], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 805.6340000000001, 384, 1812, 627.0, 1549.7000000000005, 1639.75, 1721.8200000000002, 0.36655789672011324, 0.3349945412656218, 0.16144297990309675], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 30.75399999999995, 7, 142, 27.0, 52.0, 63.94999999999999, 85.98000000000002, 0.36673023324042836, 0.3247038080350594, 0.15077483222091828], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 18.543999999999993, 6, 158, 15.0, 32.0, 36.0, 44.0, 0.3669476996782603, 0.24452262328892285, 0.17164838686121744], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 824.1980000000007, 507, 6101, 801.5, 987.9000000000001, 1044.95, 1207.6500000000003, 0.3668217099760832, 0.27562496102519335, 0.20275496860006165], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 246.0280000000003, 142, 646, 190.5, 500.0, 524.0, 574.99, 0.3695879390150334, 7.145947430134944, 0.18623767239429417], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 381.2480000000002, 211, 871, 299.5, 681.8000000000001, 710.9, 820.7800000000002, 0.3694756918247592, 0.716178114347554, 0.2641173890778552], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 31.27599999999998, 11, 73, 25.0, 55.0, 59.94999999999999, 68.0, 0.3686258145708937, 0.3007605061582629, 0.2275112449304735], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 30.977999999999977, 11, 106, 24.0, 55.0, 59.94999999999999, 70.99000000000001, 0.36862826051696423, 0.306501439032572, 0.23327257110839145], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 31.142000000000017, 11, 88, 24.0, 55.0, 61.0, 69.0, 0.3686222815949844, 0.2983838977124776, 0.2249891855438137], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 35.03999999999996, 13, 87, 29.0, 60.0, 64.0, 75.99000000000001, 0.3686209227761284, 0.3297011769881754, 0.2563067353677768], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 34.51600000000005, 11, 89, 29.5, 60.0, 64.0, 78.96000000000004, 0.3684671692067565, 0.2766058570712166, 0.20330463925958733], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 3277.787999999999, 1666, 7059, 2850.5, 5021.200000000001, 5574.749999999998, 6705.500000000002, 0.36802834701540055, 0.3075861602664084, 0.23433054907621206], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["No results for path: $['rows'][1]", 500, 97.46588693957115, 2.1272069772388855], "isController": false}, {"data": ["500", 13, 2.53411306042885, 0.055307381408211016], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 23505, 513, "No results for path: $['rows'][1]", 500, "500", 13, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Query cross patient #1", 500, 500, "No results for path: $['rows'][1]", 500, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 2, "500", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 10, "500", 10, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
