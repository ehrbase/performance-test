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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8712401616677302, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.471, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [0.5, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.813, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.827, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [0.848, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.492, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 487.6245054243788, 1, 24739, 12.0, 1018.0, 1817.0, 10490.0, 10.143966206631362, 63.98900745978557, 84.04397076774784], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 11029.664, 8933, 24739, 10597.0, 12738.800000000001, 13115.8, 21710.360000000066, 0.21835643981179423, 0.12686466505323094, 0.11045765217041935], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.9080000000000004, 2, 13, 3.0, 4.0, 4.0, 8.0, 0.219141962793201, 0.11250500123048211, 0.07961016617096754], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 4.367999999999999, 2, 19, 4.0, 5.0, 6.0, 9.0, 0.219140233971645, 0.12571030882775755, 0.09287779447626361], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 16.51600000000002, 10, 398, 14.0, 20.0, 25.0, 43.98000000000002, 0.21788514576734136, 0.12803092876920605, 2.426100031288307], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 44.71800000000003, 26, 63, 47.0, 56.0, 57.0, 59.0, 0.21907878248281107, 0.9111259782689183, 0.09156808486586245], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.643999999999999, 1, 10, 2.0, 4.0, 4.0, 7.990000000000009, 0.2190841581121606, 0.13687796256552806, 0.09306797732303695], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 39.18800000000001, 24, 70, 40.0, 49.0, 50.0, 56.98000000000002, 0.2190773426268863, 0.8991391978822669, 0.08001457631099168], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1125.9080000000017, 775, 1856, 1129.5, 1421.3000000000002, 1510.75, 1597.99, 0.2190060454428784, 0.9262843582159243, 0.10693654562640548], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 6.505999999999999, 4, 25, 6.0, 8.0, 9.0, 13.990000000000009, 0.2189936715208804, 0.32564829449371074, 0.11227702885592013], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 4.296000000000002, 2, 22, 4.0, 5.0, 6.0, 11.0, 0.21805095589178042, 0.21032334926159224, 0.11967249727654357], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 10.110000000000003, 6, 23, 10.0, 12.0, 13.0, 18.99000000000001, 0.2190765747114652, 0.3570691437435893, 0.1435550601869074], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 589.0, 589, 589, 589.0, 589.0, 589.0, 589.0, 1.697792869269949, 0.8057884125636673, 2008.1358101655348], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.666, 3, 17, 4.0, 6.0, 7.0, 12.990000000000009, 0.21805266756911396, 0.21905562466310863, 0.1284040610782966], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 15.622000000000005, 7, 36, 16.0, 20.0, 21.0, 24.0, 0.21907551883655124, 0.3441689237378402, 0.13071791211829376], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 7.756000000000002, 5, 17, 8.0, 9.0, 10.0, 15.0, 0.21907551883655124, 0.3390343412651085, 0.1255833296455621], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2218.465999999999, 1598, 3593, 2150.5, 2863.0000000000005, 3126.9, 3407.3000000000006, 0.218837630793781, 0.3341783121567805, 0.12095908108328128], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 13.97600000000001, 9, 79, 12.0, 17.0, 20.94999999999999, 47.0, 0.21788030353340848, 0.1280280834366086, 1.7570854947059442], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 14.76, 9, 44, 15.0, 18.0, 20.0, 25.99000000000001, 0.21907811054769089, 0.3965891448275001, 0.18313560803596035], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 10.116, 6, 22, 10.0, 12.0, 14.0, 19.0, 0.21907753460658275, 0.37085291019310807, 0.15746197799848136], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 63.0, 63, 63, 63.0, 63.0, 63.0, 63.0, 15.873015873015872, 8.153521825396826, 2164.8375496031745], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 677.0, 677, 677, 677.0, 677.0, 677.0, 677.0, 1.4771048744460857, 0.7472073485967503, 2824.882293205317], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.7500000000000027, 1, 18, 3.0, 3.0, 4.0, 7.0, 0.21803992572687972, 0.1833323984871518, 0.09262438251093034], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 709.398, 545, 1027, 705.0, 848.0, 864.0, 939.7000000000003, 0.21798697745796666, 0.19189240353531278, 0.10132988405272668], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.7280000000000024, 2, 22, 3.0, 5.0, 5.0, 11.0, 0.2180536185125778, 0.19754933831084326, 0.10689737938800199], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 955.1619999999997, 749, 1398, 923.5, 1152.0, 1185.95, 1241.99, 0.2179790897018831, 0.20620949607921013, 0.1155885211993384], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 74.0, 74, 74, 74.0, 74.0, 74.0, 74.0, 13.513513513513514, 6.967905405405406, 889.8463893581081], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 29.682000000000002, 20, 584, 28.0, 32.900000000000034, 39.0, 67.93000000000006, 0.21782581950429813, 0.12799606821672974, 9.963829478106764], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 37.46000000000002, 25, 235, 35.0, 45.0, 52.94999999999999, 115.93000000000006, 0.2179483044057814, 49.32068391115425, 0.06768316484476415], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 1027.0, 1027, 1027, 1027.0, 1027.0, 1027.0, 1027.0, 0.9737098344693281, 0.5106271299902629, 0.4012749513145083], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.969999999999998, 2, 24, 3.0, 4.0, 4.0, 7.0, 0.2191029748925519, 0.23802200325192635, 0.0943597772730619], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.8379999999999947, 2, 26, 4.0, 5.0, 5.0, 8.0, 0.21910201477448707, 0.22486670860461816, 0.0810934214839166], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.048, 1, 11, 2.0, 3.0, 3.0, 6.0, 0.21914253907311473, 0.12427564830580903, 0.08538854793962185], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 198.52399999999992, 89, 410, 196.0, 281.0, 308.0, 332.0, 0.21912237107935295, 0.19958752610295247, 0.0718995280104127], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 117.53799999999998, 84, 379, 116.0, 135.0, 147.95, 247.83000000000015, 0.21791467855841595, 0.12810999657438124, 64.46358830948765], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 265.958, 18, 490, 321.5, 437.7000000000001, 450.0, 487.0, 0.21909980653487085, 0.12212417810185074, 0.09221876622707942], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 507.80199999999974, 310, 1106, 466.5, 833.8000000000001, 896.0, 983.8500000000001, 0.21912448374271631, 0.11784574652534306, 0.09372707410088842], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 8.16, 4, 263, 7.0, 10.0, 13.0, 26.970000000000027, 0.2178026672985848, 0.10245871373476688, 0.1584599483764118], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 520.1000000000005, 290, 1057, 463.0, 876.9000000000001, 919.0, 1014.94, 0.21907523087243205, 0.11268468247345576, 0.0885714312316278], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.946000000000002, 2, 23, 4.0, 5.0, 6.0, 12.970000000000027, 0.21803878473902938, 0.13387027768874527, 0.1094452493709581], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.464000000000001, 3, 32, 4.0, 5.0, 6.0, 10.990000000000009, 0.21803602740102362, 0.12769373632096473, 0.10326901688427388], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 864.0340000000006, 589, 1373, 867.0, 1127.2000000000003, 1239.6999999999998, 1324.8200000000002, 0.2179425093813353, 0.19915135298164968, 0.09641402026342276], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 474.0380000000001, 248, 1036, 391.0, 853.8000000000001, 892.95, 957.9200000000001, 0.2179449793540721, 0.19298134006848702, 0.09003000611989502], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 5.634000000000005, 3, 60, 5.0, 7.0, 8.0, 15.0, 0.21805380870226584, 0.14544018685903082, 0.1024256660017479], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1182.8899999999996, 905, 10400, 1102.0, 1410.9, 1432.8, 1562.99, 0.21797234279725652, 0.16378152343268076, 0.12090653389535322], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 169.01199999999983, 143, 270, 165.0, 189.0, 194.0, 220.0, 0.21919211048685197, 4.238070894071467, 0.1108803840158099], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 229.43999999999983, 193, 368, 220.0, 258.0, 265.0, 303.97, 0.21917270195230276, 0.4247990754802293, 0.15710230784471702], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 8.993999999999998, 6, 28, 9.0, 11.0, 12.0, 17.980000000000018, 0.21899184912337563, 0.17878631432338088, 0.13558675033615247], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 8.8, 6, 18, 9.0, 11.0, 12.0, 15.990000000000009, 0.21899271236051807, 0.18208474136522684, 0.13900904593196947], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 9.982, 7, 38, 9.0, 12.0, 13.949999999999989, 19.99000000000001, 0.21899002675620147, 0.17722580573548022, 0.1340886198985726], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 12.086000000000011, 8, 39, 12.0, 14.900000000000034, 16.0, 22.99000000000001, 0.21899088997897687, 0.1958321756471181, 0.15269481977049756], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 9.442000000000004, 6, 42, 9.0, 11.0, 12.949999999999989, 22.980000000000018, 0.2189642291276728, 0.16437499274680992, 0.1212428885892485], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1998.3000000000002, 1590, 3005, 1936.5, 2500.5, 2574.0, 2686.83, 0.21880248524614843, 0.18284323696287272, 0.13974299350681743], "isController": false}]}, function(index, item){
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
