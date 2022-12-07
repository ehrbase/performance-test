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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8702403743884279, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.471, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [0.5, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [0.995, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.8, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.823, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [0.839, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.476, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 490.6866198681143, 1, 24610, 13.0, 1044.0, 1827.9500000000007, 10529.990000000002, 10.114214677810304, 68.17493406047315, 83.79747580043436], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 11064.679999999998, 9093, 24610, 10635.5, 12589.500000000002, 13204.15, 21626.760000000068, 0.2176704904116149, 0.12646612979147165, 0.110110658235563], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 7.8439999999999985, 5, 23, 8.0, 9.0, 10.0, 15.990000000000009, 0.21848467766955504, 2.332859477619522, 0.07937138680964305], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 9.196000000000003, 6, 34, 9.0, 11.0, 12.0, 18.99000000000001, 0.21848209998003074, 2.345998488049248, 0.09259885878059897], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 16.614000000000004, 10, 414, 15.0, 20.0, 25.0, 41.97000000000003, 0.2173156218204008, 0.1276962722710482, 2.419758515621299], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 46.558000000000064, 27, 108, 48.0, 57.0, 59.0, 80.99000000000001, 0.21843628453859923, 0.9084538958275176, 0.09129954080324265], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.736, 1, 9, 2.5, 4.0, 5.0, 8.0, 0.21844086521805423, 0.1364760502527579, 0.09279470348618514], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 40.028, 24, 80, 41.0, 49.900000000000034, 51.0, 59.99000000000001, 0.21843590282398304, 0.8965065948802555, 0.07978030044547817], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1130.1900000000005, 767, 1684, 1130.5, 1431.7, 1505.0, 1567.95, 0.21836282905640617, 0.923563879534468, 0.10662247512519833], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 6.704000000000002, 4, 25, 6.0, 8.0, 10.0, 18.980000000000018, 0.21834919276303436, 0.32468994073457036, 0.11194660761776665], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 4.258000000000002, 2, 16, 4.0, 5.0, 6.0, 12.990000000000009, 0.21745436611399915, 0.20974790229927548, 0.11934507202740968], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 10.385999999999996, 7, 26, 10.0, 12.0, 14.0, 18.980000000000018, 0.2184373342606726, 0.35602725671978774, 0.14313618289932747], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 576.0, 576, 576, 576.0, 576.0, 576.0, 576.0, 1.736111111111111, 0.8239746093750001, 2053.4583197699653], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.762000000000004, 3, 21, 4.0, 6.0, 7.949999999999989, 15.990000000000009, 0.21745559556738514, 0.2184558063634031, 0.12805246496790354], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 15.891999999999998, 8, 37, 17.0, 20.0, 21.0, 27.0, 0.2184367616837455, 0.34316543250806464, 0.13033677869996924], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 7.688000000000002, 5, 28, 7.0, 9.0, 11.0, 16.99000000000001, 0.21843762055026184, 0.3380471500607475, 0.12521765943652705], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2244.0899999999974, 1609, 3516, 2206.5, 2874.2000000000003, 3075.95, 3289.9700000000003, 0.21819530661895464, 0.33319744425109915, 0.12060404643196124], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 14.654000000000003, 10, 72, 13.0, 19.0, 25.0, 44.99000000000001, 0.21731146600488083, 0.12769383028300474, 1.7524981311213925], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 14.686000000000012, 9, 27, 15.0, 18.0, 19.0, 24.0, 0.21843657082543685, 0.3954277887742388, 0.1825993209243886], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 10.304000000000007, 7, 28, 10.0, 12.900000000000034, 15.0, 20.0, 0.2184361891098201, 0.3697672450456488, 0.1570010109226832], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 63.0, 63, 63, 63.0, 63.0, 63.0, 63.0, 15.873015873015872, 8.153521825396826, 2164.8375496031745], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 711.0, 711, 711, 711.0, 711.0, 711.0, 711.0, 1.4064697609001406, 0.7114759142053446, 2689.79650140647], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.799999999999999, 2, 20, 3.0, 3.0, 4.0, 9.990000000000009, 0.21744424729499356, 0.18283153996190377, 0.09237133552082245], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 707.0179999999998, 514, 1058, 696.5, 851.8000000000001, 877.0, 961.94, 0.2173812859059539, 0.19135921752084467, 0.10104833212034575], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.629999999999999, 2, 12, 3.0, 5.0, 6.0, 9.980000000000018, 0.21746202678088353, 0.19701337584462253, 0.1066073607851597], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 971.0619999999992, 733, 1434, 940.5, 1162.7, 1195.95, 1339.98, 0.21738506634157453, 0.20564754649975264, 0.11527352639011229], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 70.0, 70, 70, 70.0, 70.0, 70.0, 70.0, 14.285714285714285, 7.366071428571428, 940.6947544642857], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 29.98000000000004, 20, 553, 27.0, 35.0, 41.0, 72.98000000000002, 0.21726038135280218, 0.12766381256229942, 9.937965100161382], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 37.839999999999996, 26, 244, 35.0, 46.0, 54.94999999999999, 127.92000000000007, 0.21737457595654597, 49.19085184123874, 0.06750499526775548], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 1019.0, 1019, 1019, 1019.0, 1019.0, 1019.0, 1019.0, 0.9813542688910696, 0.5146359789008833, 0.4044252944062807], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 3.009999999999999, 2, 14, 3.0, 4.0, 4.0, 8.0, 0.21845441751969477, 0.23731744446997935, 0.09408046692010293], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.785999999999999, 2, 13, 4.0, 5.0, 5.0, 9.990000000000009, 0.21845336763342474, 0.22420099520254558, 0.0808533460283867], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.321999999999997, 1, 17, 2.0, 3.0, 4.0, 8.0, 0.21848639616302928, 0.1239035499178054, 0.08513288287993036], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 194.60000000000005, 89, 438, 191.0, 272.0, 282.0, 336.94000000000005, 0.21846940336005943, 0.19899277071089944, 0.07168527297751949], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 119.0159999999999, 85, 437, 115.0, 140.90000000000003, 159.95, 359.2200000000007, 0.2173434887802944, 0.12777419945872778, 64.29461877082694], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 256.74, 16, 561, 310.0, 425.0, 438.0, 504.6900000000003, 0.21845059979981188, 0.121762316354042, 0.09194551612667862], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 517.5000000000006, 293, 1183, 472.5, 837.0000000000003, 907.0, 1071.8500000000001, 0.2184746536630553, 0.11749626613162226, 0.09344911943790842], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 8.249999999999996, 5, 294, 7.0, 10.0, 14.0, 26.99000000000001, 0.21723498960530577, 0.10219166683864436, 0.15804694067964137], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 528.6519999999998, 290, 1211, 466.5, 876.8000000000001, 917.95, 1001.9100000000001, 0.218424929099268, 0.11235018984948775, 0.08830851625693062], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 4.109999999999994, 2, 57, 4.0, 5.0, 6.0, 11.980000000000018, 0.2174390463993181, 0.13350205357589384, 0.10914420883715772], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.486, 3, 68, 4.0, 5.0, 6.0, 10.990000000000009, 0.21743290020699613, 0.12734051228822035, 0.1029833560550714], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 869.7460000000001, 586, 1440, 863.5, 1164.6000000000001, 1250.85, 1321.95, 0.21734821270217733, 0.19860829698003352, 0.09615111362703742], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 479.63800000000043, 252, 1044, 388.0, 867.9000000000001, 900.8, 964.9200000000001, 0.21735964544294636, 0.19246305089802138, 0.0897882129124671], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 5.709999999999995, 3, 61, 5.0, 7.0, 8.0, 14.0, 0.21745644673556558, 0.14504175109413212, 0.10214506921856155], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1202.6679999999997, 902, 9869, 1137.0, 1416.0, 1493.95, 1790.8700000000001, 0.21737410344051036, 0.1633320143253882, 0.1205746980021581], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 167.6659999999999, 142, 257, 164.5, 188.0, 192.0, 237.8900000000001, 0.21854159327311493, 4.22549316915469, 0.11055131378464213], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 229.90600000000006, 195, 401, 223.0, 257.0, 268.95, 344.8700000000001, 0.21852526042747913, 0.4235442086162325, 0.1566382237829782], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 9.331999999999999, 6, 25, 9.0, 11.0, 13.0, 18.99000000000001, 0.2183471903738584, 0.17826001089115787, 0.13518761591506467], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 9.024000000000004, 6, 32, 9.0, 11.0, 13.0, 18.99000000000001, 0.218348048536151, 0.18154872605922823, 0.13859983549658023], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 10.013999999999994, 7, 33, 10.0, 12.0, 14.0, 20.980000000000018, 0.2183439484882957, 0.1767029429216167, 0.13369302314664197], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 12.209999999999997, 8, 40, 12.0, 15.0, 17.0, 27.970000000000027, 0.21834490197405626, 0.19525450213541315, 0.15224439454050406], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 9.416000000000002, 6, 31, 9.0, 11.0, 12.949999999999989, 22.0, 0.21830972386439648, 0.1638836599919924, 0.1208804818663211], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2010.8980000000001, 1586, 3313, 1957.0, 2477.6000000000004, 2594.5499999999997, 2765.6800000000003, 0.2181542752129622, 0.18230155746336316, 0.13932899998952858], "isController": false}]}, function(index, item){
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
