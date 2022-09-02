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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9003403531163582, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.001, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.985, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.498, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.989, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.983, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.695, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.668, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [0.998, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 513, 2.1825143586470963, 186.42310146777226, 1, 4951, 16.0, 550.0, 1218.9000000000015, 2201.9600000000064, 26.284919356011088, 175.1394781012822, 217.7736941340626], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 24.69200000000001, 15, 83, 25.0, 29.0, 31.0, 38.99000000000001, 0.5704994722879881, 0.33136213880252163, 0.2885925064894315], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 7.438000000000003, 4, 42, 7.0, 9.900000000000034, 12.0, 18.99000000000001, 0.5702912477402209, 6.100041248096653, 0.20717611734312713], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 7.747999999999996, 5, 36, 7.0, 9.900000000000034, 11.0, 17.99000000000001, 0.5702723849019246, 6.123519154095012, 0.241697475632261], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 22.569999999999993, 14, 272, 20.0, 27.0, 32.0, 75.83000000000015, 0.5656953300719112, 0.30543349303855327, 6.298884915507745], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 43.01200000000001, 26, 135, 44.0, 53.0, 54.94999999999999, 68.96000000000004, 0.570027931368637, 2.3707517332411787, 0.23825386193923503], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.5260000000000002, 1, 13, 2.0, 3.0, 5.0, 8.0, 0.5700610763437195, 0.35628817271482466, 0.24216461739210737], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 37.84000000000003, 23, 108, 38.5, 46.0, 48.0, 63.98000000000002, 0.570014934391281, 2.339428128954479, 0.20818904830306556], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 773.9100000000001, 579, 982, 764.0, 911.0, 930.8499999999999, 966.98, 0.569690202467898, 2.409338922587647, 0.2781690441737783], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 10.838, 7, 26, 11.0, 14.0, 16.0, 21.99000000000001, 0.5696084283819931, 0.8470199706851022, 0.2920355711919398], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.425999999999998, 2, 28, 3.0, 4.0, 6.0, 12.990000000000009, 0.56661718209943, 0.5465686725859276, 0.31097544564441376], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 17.302000000000014, 11, 34, 18.0, 21.0, 23.94999999999999, 29.99000000000001, 0.5699947902476171, 0.9288310026721356, 0.37350244556264756], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 721.0, 721, 721, 721.0, 721.0, 721.0, 721.0, 1.3869625520110958, 0.5918971047156727, 1640.488199982663], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.412000000000004, 2, 24, 4.0, 6.0, 7.0, 13.980000000000018, 0.5666287403163148, 0.5693633880063961, 0.3336690726667362], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 18.588000000000005, 11, 121, 19.0, 23.0, 24.0, 36.99000000000001, 0.5699752972706164, 0.8955959504965055, 0.3400926822581509], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 10.593999999999994, 7, 51, 11.0, 13.0, 15.0, 22.99000000000001, 0.5699720485707381, 0.8821352752423521, 0.32673202393654616], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1914.8980000000004, 1489, 3874, 1904.5, 2171.9, 2241.5499999999997, 2549.710000000001, 0.5686580693148694, 0.8683108840159315, 0.314316862531461], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 19.333999999999993, 12, 155, 17.0, 25.900000000000034, 32.94999999999999, 55.98000000000002, 0.5656524518205523, 0.30534626414838195, 4.561677682748166], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 21.696000000000005, 14, 79, 22.0, 27.0, 28.0, 34.0, 0.5700123350669308, 1.0318726226923052, 0.4764946863450125], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 17.189999999999994, 11, 76, 18.0, 21.0, 23.0, 32.97000000000003, 0.5700032376183897, 0.964962043484407, 0.4096898270382176], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 75.0, 75, 75, 75.0, 75.0, 75.0, 75.0, 13.333333333333334, 6.2109375, 1818.4635416666667], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 681.0, 681, 681, 681.0, 681.0, 681.0, 681.0, 1.4684287812041115, 0.6725518538913362, 2808.289739353891], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.3060000000000023, 1, 21, 2.0, 3.0, 4.0, 7.990000000000009, 0.5665131793626047, 0.47607908722263514, 0.24065745412376274], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 414.9780000000003, 317, 596, 414.0, 478.90000000000003, 487.95, 527.96, 0.5663187581762271, 0.4985584975421766, 0.26324973524598055], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.2119999999999984, 1, 23, 3.0, 4.0, 6.0, 15.970000000000027, 0.5665979194524398, 0.5133189022023661, 0.2777657769190671], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1169.4860000000015, 921, 1712, 1169.5, 1354.0, 1372.95, 1452.92, 0.5660148816632686, 0.5353572162369293, 0.3001426569757372], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 53.0, 53, 53, 53.0, 53.0, 53.0, 53.0, 18.867924528301884, 8.82591391509434, 1242.4270341981132], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 5, 1.0, 44.258000000000024, 12, 599, 43.0, 52.900000000000034, 59.0, 89.98000000000002, 0.5652764258249926, 0.30396304526564033, 25.856980259416655], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 44.60399999999999, 10, 206, 45.0, 54.0, 62.94999999999999, 101.0, 0.5660129594327192, 126.15478914708356, 0.17577355576133272], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 273.0, 273, 273, 273.0, 273.0, 273.0, 273.0, 3.663003663003663, 1.9209306318681316, 1.50955815018315], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.2319999999999998, 1, 20, 2.0, 3.0, 4.0, 6.0, 0.570319869602065, 0.6196948667504657, 0.24561627196729557], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.2620000000000013, 2, 22, 3.0, 4.0, 6.0, 12.990000000000009, 0.5703133643811928, 0.58522171217197, 0.2110827784184298], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.1399999999999992, 1, 11, 2.0, 3.0, 4.0, 6.990000000000009, 0.5703042573212809, 0.323387019162223, 0.22221816276483503], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 119.99799999999998, 84, 200, 119.0, 146.0, 153.0, 164.96000000000004, 0.5702346629685048, 0.519494915360069, 0.18710824878654064], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 8, 1.6, 168.55000000000013, 27, 628, 166.0, 203.90000000000003, 226.95, 368.7800000000002, 0.5657939106996155, 0.3037119828926553, 167.37333147375733], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 2.310000000000002, 1, 21, 2.0, 3.0, 4.0, 8.980000000000018, 0.5703094613199015, 0.3180143578258435, 0.24004236116101318], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 3.299999999999998, 1, 17, 3.0, 4.900000000000034, 6.0, 8.990000000000009, 0.5703595546632597, 0.3067086225531575, 0.24396238763916772], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 12.546000000000003, 7, 301, 10.0, 15.0, 20.94999999999999, 85.6700000000003, 0.5651026508965354, 0.2387624923004764, 0.41113425284953015], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 4.3500000000000005, 2, 60, 4.0, 5.0, 6.0, 11.990000000000009, 0.5703218211972652, 0.29335371722930814, 0.23057933005436307], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.8660000000000023, 2, 38, 3.0, 5.0, 7.0, 11.0, 0.5665067606916822, 0.34791702899494903, 0.284359838862817], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.096000000000004, 2, 39, 4.0, 5.0, 6.0, 11.980000000000018, 0.5664907146506961, 0.33179980756310423, 0.2683085904351442], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 534.2239999999998, 378, 1127, 539.0, 641.0, 652.9, 702.97, 0.5659572204256225, 0.5169997100884138, 0.2503697469265693], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 16.059999999999985, 6, 107, 15.0, 25.0, 34.89999999999998, 49.950000000000045, 0.5661392136326323, 0.5012609866391146, 0.23386414781894868], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 9.433999999999989, 6, 58, 9.0, 12.0, 13.0, 17.99000000000001, 0.5666390146827501, 0.37768703762256406, 0.2661653965453153], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 533.9939999999998, 352, 4066, 514.0, 599.9000000000001, 647.0, 715.99, 0.5664451488504562, 0.42565144555385875, 0.3142000435029874], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 173.34599999999983, 141, 269, 178.0, 191.0, 195.0, 234.82000000000016, 0.5703894847557706, 11.028458406913575, 0.28853686826512615], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 262.03799999999984, 212, 832, 263.5, 286.0, 294.0, 356.8900000000001, 0.5702307609843552, 1.1053143689313192, 0.40873962750245774], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 17.550000000000004, 11, 89, 18.0, 21.0, 23.0, 30.99000000000001, 0.5695883129591593, 0.4648218875985815, 0.35265526407822956], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 17.109999999999985, 11, 51, 18.0, 21.0, 23.0, 26.0, 0.5695986949354702, 0.47366581473688524, 0.36156167158989805], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 16.921999999999997, 11, 62, 18.0, 21.0, 23.0, 32.0, 0.5695636572821562, 0.4610050466899808, 0.3487464971835077], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 20.136000000000013, 13, 60, 21.0, 25.0, 27.0, 41.99000000000001, 0.5695753360209695, 0.5095029373000078, 0.39714530265524634], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 17.098000000000013, 10, 124, 18.0, 21.0, 22.0, 35.99000000000001, 0.5690586858841579, 0.4271885765879014, 0.31509401845343504], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2178.7240000000015, 1658, 4951, 2152.0, 2476.9, 2543.65, 2654.9300000000003, 0.5680120600320586, 0.4745973735264347, 0.36277332740328744], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 23505, 513, "No results for path: $['rows'][1]", 500, "500", 13, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Query cross patient #1", 500, 500, "No results for path: $['rows'][1]", 500, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 5, "500", 5, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 8, "500", 8, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
