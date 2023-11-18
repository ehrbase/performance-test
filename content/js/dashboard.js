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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8594767070835992, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.454, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.998, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [0.5, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.994, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [0.986, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.549, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.677, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.241, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 513.6173580089289, 1, 32821, 14.0, 1216.800000000003, 2420.9500000000007, 10267.980000000003, 9.620961539484828, 60.60501619252238, 79.61427776863071], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 10473.811999999998, 8776, 32821, 10251.0, 10905.8, 11179.65, 31726.57000000018, 0.20790954437870807, 0.12078326308416346, 0.10476691884708338], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 3.4679999999999978, 2, 13, 3.0, 4.0, 5.0, 9.980000000000018, 0.20863463652090894, 0.10711065895059281, 0.07538556202415655], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 5.087999999999998, 3, 19, 5.0, 6.0, 7.0, 10.990000000000009, 0.2086331565654142, 0.11971835058486133, 0.08801711292603412], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 20.829999999999995, 13, 577, 18.0, 24.0, 26.94999999999999, 81.98000000000002, 0.20680170818210958, 0.1075950512351232, 2.275424654382645], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 52.67800000000002, 31, 78, 55.0, 68.0, 69.0, 73.0, 0.20857736885489356, 0.8674516860508045, 0.08677144446502408], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 3.408, 2, 12, 3.0, 4.0, 5.0, 10.0, 0.20858311160948567, 0.1303171876447045, 0.0881996946551829], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 46.03599999999996, 28, 68, 47.0, 58.0, 61.0, 64.0, 0.20857658577649515, 0.8560418972741544, 0.07577196280161738], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1210.894, 882, 1772, 1163.0, 1481.6000000000001, 1695.0499999999997, 1767.93, 0.20850743704326447, 0.88183333604393, 0.10140303090580634], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 8.786, 5, 27, 8.0, 12.0, 13.0, 19.99000000000001, 0.2085570107273384, 0.31012875566857956, 0.10651886387734179], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 5.463999999999998, 3, 20, 5.0, 7.0, 7.0, 16.970000000000027, 0.20696760584426846, 0.19963278707855703, 0.11318540944608432], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 12.023999999999996, 8, 27, 12.0, 15.0, 16.0, 20.99000000000001, 0.20857632475166904, 0.3399077112335871, 0.13626714966686188], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 603.0, 603, 603, 603.0, 603.0, 603.0, 603.0, 1.658374792703151, 0.7174414386401327, 1961.5091858416254], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 6.059999999999999, 4, 23, 6.0, 7.900000000000034, 9.0, 16.980000000000018, 0.2069688909199436, 0.20793258981828958, 0.12147295258094346], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 12.302, 8, 25, 12.0, 15.0, 16.0, 20.99000000000001, 0.208574845623328, 0.32768411840209977, 0.12404500096153004], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 9.486, 6, 29, 9.0, 11.0, 12.0, 16.0, 0.2085732795103033, 0.3227814079812234, 0.11915563331399164], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2388.348, 1996, 3081, 2342.0, 2759.3, 2878.3999999999996, 3013.9700000000003, 0.20838230317457937, 0.3182123938448452, 0.11477306542037378], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 18.109999999999996, 12, 86, 17.0, 21.0, 24.94999999999999, 48.99000000000001, 0.20679563545403637, 0.10758017867453097, 1.6672898108481682], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 17.323999999999995, 12, 33, 17.0, 21.0, 23.0, 29.0, 0.2085778909104258, 0.3775809786714506, 0.17395070198974963], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 12.076, 8, 24, 12.0, 15.0, 16.0, 21.99000000000001, 0.20857728184589228, 0.35311359799252706, 0.14950754382312978], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 64.0, 64, 64, 64.0, 64.0, 64.0, 64.0, 15.625, 7.3699951171875, 2130.9814453125], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 675.0, 675, 675, 675.0, 675.0, 675.0, 675.0, 1.4814814814814814, 0.6872106481481481, 2833.249421296296], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 3.5959999999999988, 2, 29, 3.0, 4.0, 5.0, 11.0, 0.2069518435477175, 0.17396242623718916, 0.08750991040640789], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 777.8160000000001, 585, 985, 755.5, 945.0, 953.0, 965.99, 0.2068999477370732, 0.1821677260547449, 0.09577204612048115], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 4.632000000000006, 3, 15, 4.0, 6.0, 6.0, 13.990000000000009, 0.2069601527200359, 0.18749902664053175, 0.10105476207033003], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1055.7479999999991, 792, 1359, 1009.0, 1316.0, 1332.0, 1351.99, 0.20688590780088142, 0.19572699914887137, 0.10930202746120785], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 72.0, 72, 72, 72.0, 72.0, 72.0, 72.0, 13.888888888888888, 6.578233506944445, 914.5372178819445], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 38.53199999999998, 25, 1683, 34.0, 41.0, 46.94999999999999, 109.99000000000001, 0.20665281541729197, 0.10750588017670469, 9.426516609513387], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 49.16800000000002, 32, 779, 45.0, 54.0, 63.94999999999999, 203.94000000000005, 0.20687186977002053, 46.78831462586705, 0.06383936606184228], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 596.0, 596, 596, 596.0, 596.0, 596.0, 596.0, 1.6778523489932886, 0.8798893666107382, 0.6881816275167786], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 3.9920000000000027, 2, 13, 4.0, 5.0, 5.949999999999989, 9.0, 0.20861409313367574, 0.22666287923434456, 0.08943514344305044], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 4.922, 3, 13, 5.0, 6.0, 7.0, 12.0, 0.20861339681856225, 0.2140666813947725, 0.07680395566464646], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.793999999999999, 1, 16, 3.0, 4.0, 5.0, 9.990000000000009, 0.2086352459204507, 0.11831696646334466, 0.0808869068656435], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 128.34800000000007, 83, 174, 132.5, 162.0, 167.0, 172.0, 0.2086257571028725, 0.19002668936271508, 0.0680478543675385], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 125.67399999999998, 85, 660, 122.0, 141.0, 152.95, 576.3700000000006, 0.20684003446782334, 0.10761499168296221, 61.16122464503147], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 270.3240000000002, 16, 522, 282.0, 486.90000000000003, 497.0, 511.94000000000005, 0.2086115690135051, 0.11627813283466824, 0.08739683897147821], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 590.9399999999997, 445, 728, 575.0, 699.0, 710.95, 724.99, 0.20859224846173646, 0.11218148159215124, 0.08881466829034872], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 10.808, 7, 394, 9.0, 12.0, 15.0, 43.930000000000064, 0.20662173057270172, 0.09317510086239779, 0.1499218220854662], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 552.3059999999997, 393, 680, 558.0, 647.0, 655.95, 673.99, 0.20857710782810743, 0.10728481295326411, 0.0839196957277151], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 5.133999999999998, 3, 18, 5.0, 6.0, 7.0, 13.990000000000009, 0.20695081565524973, 0.12707426802531258, 0.10347540782762488], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 5.714000000000001, 3, 35, 5.0, 7.0, 8.0, 13.0, 0.20694816031363408, 0.12120007931805615, 0.09761324358543483], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 954.3060000000004, 666, 1428, 910.0, 1229.9000000000003, 1387.85, 1420.97, 0.20687323925014242, 0.1890364831042488, 0.09111311611505298], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 335.01199999999983, 226, 415, 332.0, 396.90000000000003, 400.95, 406.98, 0.20691133518229302, 0.1832232202935327, 0.08506803917162632], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 6.979999999999998, 4, 75, 7.0, 8.0, 9.0, 17.960000000000036, 0.2069700046651039, 0.1380004845167809, 0.09681507054158668], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1697.467999999999, 1278, 19338, 1511.5, 1850.9, 1889.95, 10698.300000000081, 0.2068623695008742, 0.1554687874938045, 0.11433994251708478], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 172.07599999999982, 127, 222, 177.0, 206.0, 207.0, 211.0, 0.20865170105385802, 4.0342252167682515, 0.10514089623417062], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 235.128, 180, 323, 232.0, 283.0, 285.95, 293.98, 0.20863402712492712, 0.40438490307489, 0.14914073032758463], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 11.004000000000001, 7, 26, 11.0, 14.0, 15.0, 21.980000000000018, 0.20855448798830425, 0.17021793683301667, 0.12871722305528155], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 10.871999999999998, 7, 35, 11.0, 13.900000000000034, 15.0, 21.99000000000001, 0.2085556188637723, 0.1734421032135501, 0.1319766025622309], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 12.39600000000001, 8, 31, 12.0, 15.0, 17.0, 24.980000000000018, 0.2085518783224921, 0.16877834676233636, 0.12728996479644294], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 15.181999999999999, 10, 47, 15.0, 18.0, 19.0, 27.960000000000036, 0.20855274820383946, 0.18650970030970085, 0.14500933273548214], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 11.559999999999993, 7, 50, 12.0, 14.0, 14.0, 45.840000000000146, 0.20852978576900988, 0.1565419254086871, 0.11505793843700253], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2742.5060000000017, 2329, 3539, 2697.5, 3121.8, 3285.25, 3445.99, 0.20832725712166728, 0.1740895675699042, 0.13264587074543657], "isController": false}]}, function(index, item){
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
