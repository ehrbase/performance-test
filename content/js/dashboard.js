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

    var data = {"OkPercent": 97.80472239948946, "KoPercent": 2.1952776005105297};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8792384599021484, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.379, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.833, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.338, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.993, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.922, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.544, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.501, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [0.96, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [0.855, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 516, 2.1952776005105297, 293.2262497340985, 1, 7143, 32.0, 810.9000000000015, 1860.9000000000015, 3864.0, 16.84499451758315, 111.6284065785419, 139.52988975370332], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 51.40600000000002, 19, 126, 43.0, 84.0, 88.0, 105.0, 0.3647252342447817, 0.21178069915091965, 0.18378732506865952], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 15.194000000000003, 5, 84, 12.5, 25.900000000000034, 32.0, 61.98000000000002, 0.36474039966794036, 3.902450145914397, 0.1317909647237675], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 16.148000000000003, 5, 44, 14.0, 28.0, 32.0, 39.960000000000036, 0.36473215164979295, 3.916472473390966, 0.1538713764772564], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 72.54799999999999, 14, 265, 66.0, 130.90000000000003, 148.0, 183.93000000000006, 0.36221726226051104, 0.19557043830824256, 4.032496865009596], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 71.79400000000001, 28, 177, 61.0, 120.90000000000003, 131.95, 156.96000000000004, 0.36485298249070536, 1.5174477826972121, 0.15178454154398485], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 7.006000000000007, 1, 37, 6.0, 13.0, 16.0, 20.0, 0.36487694525021436, 0.22800675706492984, 0.1542887864192801], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 63.378, 25, 153, 53.0, 104.0, 116.0, 137.96000000000004, 0.36485431367255056, 1.4974383521628563, 0.13254473113885626], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1159.4879999999998, 606, 2634, 904.5, 2219.2000000000003, 2351.85, 2503.7300000000005, 0.364467083519819, 1.5413455332007646, 0.17725059335241197], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 25.034, 9, 84, 22.0, 41.900000000000034, 47.0, 58.960000000000036, 0.3646103372864386, 0.5422040567275347, 0.18622188125078848], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 10.536000000000008, 2, 57, 7.0, 23.0, 25.0, 36.0, 0.36266415993199325, 0.34985262348533314, 0.1983319624628088], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 39.50599999999999, 14, 106, 30.0, 71.90000000000003, 76.0, 86.99000000000001, 0.36482928907905415, 0.5944636744949304, 0.2383503851502805], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 1211.0, 1211, 1211, 1211.0, 1211.0, 1211.0, 1211.0, 0.8257638315441783, 0.35240116639141206, 976.7052345685383], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 10.725999999999997, 3, 58, 8.0, 20.0, 25.0, 36.0, 0.3626681057337102, 0.36439786259738544, 0.2128550112753514], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 40.95400000000001, 15, 114, 32.0, 71.0, 76.94999999999999, 87.99000000000001, 0.36483035388544327, 0.5732126162896753, 0.2169743022619482], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 25.714, 8, 88, 21.5, 44.0, 48.0, 57.98000000000002, 0.36482263417994076, 0.564649956786759, 0.2084191806594388], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2943.307999999999, 1563, 6161, 2647.5, 4447.300000000001, 4856.85, 5936.890000000001, 0.3642047879818247, 0.5561627627100186, 0.2005971683806144], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 66.24799999999989, 12, 241, 56.0, 131.90000000000003, 145.0, 199.83000000000015, 0.36220834078878833, 0.1955245899620478, 2.920304747609606], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 46.77800000000008, 18, 145, 39.0, 76.90000000000003, 84.0, 106.94000000000005, 0.36482609469717975, 0.660452089760353, 0.30425926256971825], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 40.43200000000002, 14, 93, 32.0, 72.0, 77.89999999999998, 85.98000000000002, 0.36482290037124376, 0.6176316319786973, 0.2615039149145439], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 108.0, 108, 108, 108.0, 108.0, 108.0, 108.0, 9.25925925925926, 4.313151041666667, 1262.8038194444446], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 1157.0, 1157, 1157, 1157.0, 1157.0, 1157.0, 1157.0, 0.8643042350907519, 0.395858092048401, 1652.9328948789973], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 8.065999999999992, 1, 39, 5.0, 19.0, 21.0, 28.0, 0.3626510078796811, 0.3046983851966584, 0.15334754532412295], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 585.7439999999991, 321, 1334, 471.0, 1167.8000000000004, 1210.95, 1292.0, 0.3625655427859972, 0.3191844339644874, 0.16782819070367447], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 10.28999999999999, 2, 44, 7.0, 21.0, 25.0, 36.0, 0.36266310773270277, 0.32858127552241617, 0.17708159557260877], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1644.7740000000006, 936, 3669, 1341.0, 3001.2000000000007, 3381.1, 3618.88, 0.3624186370159899, 0.3428296265457155, 0.19147312756411186], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 94.0, 94, 94, 94.0, 94.0, 94.0, 94.0, 10.638297872340425, 4.976313164893617, 700.4965924202128], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 3, 0.6, 105.01999999999998, 14, 857, 95.0, 176.0, 196.0, 254.92000000000007, 0.36199907473036497, 0.1949704391555575, 16.557922521700036], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 120.80999999999996, 11, 340, 100.0, 228.0, 256.95, 303.97, 0.36234457229571376, 80.1423123594103, 0.11181727035688041], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 359.0, 359, 359, 359.0, 359.0, 359.0, 359.0, 2.785515320334262, 1.4607634052924792, 1.1424965181058497], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 8.554, 1, 46, 6.0, 19.0, 24.0, 29.0, 0.36472656449459845, 0.3963231402136568, 0.15636226739563347], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 10.230000000000008, 2, 60, 7.0, 20.900000000000034, 24.0, 39.99000000000001, 0.3647241700519149, 0.3741756549899008, 0.13427833213825383], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 6.480000000000001, 1, 31, 5.0, 12.900000000000034, 16.0, 24.960000000000036, 0.3647462533264858, 0.20686811723819973, 0.14141041266661608], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 192.638, 87, 472, 140.5, 364.0, 390.95, 434.94000000000005, 0.3646967692242608, 0.33224587974707553, 0.11895382902431945], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 12, 2.4, 320.4520000000001, 30, 1132, 279.0, 506.7000000000001, 541.9, 831.2200000000007, 0.36223956786268513, 0.19383708126011556, 107.1571146658485], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 6.797999999999996, 1, 24, 5.0, 13.0, 16.0, 20.980000000000018, 0.36472230772934106, 0.2033341112556222, 0.15279870118738995], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 9.766000000000007, 2, 39, 7.0, 20.0, 24.0, 32.0, 0.3647507767367791, 0.19618462480640853, 0.1553040416574567], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 61.405999999999985, 8, 382, 48.0, 128.90000000000003, 146.0, 178.96000000000004, 0.36193487488635245, 0.1529627264988447, 0.2626148555083593], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 11.15000000000001, 2, 89, 8.5, 20.0, 25.0, 32.0, 0.3647273626491461, 0.18762373375777874, 0.1467457748158674], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 9.791999999999993, 2, 36, 7.0, 20.0, 23.0, 27.99000000000001, 0.3626481145561876, 0.22271835632280612, 0.1813240572780938], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 11.414000000000009, 2, 40, 8.0, 24.0, 27.0, 32.0, 0.3626410129578887, 0.21240280767551464, 0.17105039966666039], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 784.4759999999998, 379, 1775, 632.0, 1519.4, 1626.85, 1711.97, 0.36237030766688605, 0.3311059600675168, 0.15959864136500546], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 29.24199999999997, 5, 246, 25.0, 54.80000000000007, 65.94999999999999, 96.98000000000002, 0.3624115444023, 0.32092108524861795, 0.14899927753258624], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 22.657999999999994, 7, 60, 20.0, 40.0, 44.0, 55.97000000000003, 0.36266600129544296, 0.24168997324612906, 0.1696455220903488], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 843.0280000000001, 482, 6414, 811.0, 1024.6000000000001, 1078.5, 1312.0700000000008, 0.36254792883619213, 0.27243423357911667, 0.20039270285281716], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 266.03800000000024, 142, 661, 196.0, 495.90000000000003, 527.8, 574.99, 0.36462442954507995, 7.049957797001183, 0.18373652895045048], "isController": false}, {"data": ["Query single patient #1", 500, 1, 0.2, 428.21200000000005, 38, 913, 367.5, 720.6000000000001, 769.0, 886.8500000000001, 0.36465048979853787, 0.7056855871346932, 0.2606681235669236], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 40.68, 15, 103, 32.0, 72.0, 77.0, 91.98000000000002, 0.36458827046616255, 0.29748693862521053, 0.2250193231783347], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 40.71999999999995, 14, 102, 32.0, 72.0, 76.0, 86.99000000000001, 0.36460049994020555, 0.30317314891414676, 0.2307237538684113], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 40.428000000000026, 15, 108, 32.0, 73.0, 79.0, 86.0, 0.3645377661125693, 0.2950570102890785, 0.22249619513706623], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 45.219999999999985, 16, 123, 36.0, 75.0, 82.94999999999999, 96.0, 0.3645598268194999, 0.3260688597917488, 0.2534830045854335], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 42.617999999999995, 14, 125, 32.0, 76.0, 81.0, 94.97000000000003, 0.3642382176221364, 0.27345184187981886, 0.2009712821840889], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 3365.806, 1782, 7143, 2934.0, 5264.9000000000015, 5836.95, 6842.34, 0.36362181876361305, 0.30386213528731576, 0.23152482991589426], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["No results for path: $['rows'][1]", 500, 96.89922480620154, 2.1272069772388855], "isController": false}, {"data": ["400", 1, 0.1937984496124031, 0.0042544139544777706], "isController": false}, {"data": ["500", 15, 2.9069767441860463, 0.06381620931716656], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 23505, 516, "No results for path: $['rows'][1]", 500, "500", 15, "400", 1, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Query cross patient #1", 500, 500, "No results for path: $['rows'][1]", 500, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 3, "500", 3, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 12, "500", 12, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Query single patient #1", 500, 1, "400", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
