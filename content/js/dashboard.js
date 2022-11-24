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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.874452244203361, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.454, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.733, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [0.5, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [0.993, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.789, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.817, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.497, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [0.843, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.476, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 491.0054031057241, 1, 25280, 14.0, 996.0, 1868.0, 10696.970000000005, 10.095270491401946, 68.04726496767194, 83.64052095493399], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 11311.862000000005, 9111, 25280, 10856.0, 13130.0, 13816.9, 23838.52000000008, 0.21731411059636643, 0.12627138262191212, 0.10993038016495879], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 7.213999999999997, 5, 27, 7.0, 9.0, 10.0, 15.0, 0.21823435314246556, 2.3301866497044017, 0.07928044860253633], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 9.334000000000001, 6, 33, 9.0, 11.0, 13.949999999999989, 24.970000000000027, 0.2182318766064594, 2.3433116608165974, 0.09249280707734704], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 22.276000000000003, 15, 312, 19.0, 28.0, 35.94999999999999, 65.98000000000002, 0.21703206909259326, 0.1275296545836956, 2.4166012224548328], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 44.532000000000046, 26, 98, 45.0, 54.900000000000034, 57.0, 76.99000000000001, 0.2181726469970935, 0.9073574545830001, 0.09118934854956642], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.9860000000000024, 1, 14, 3.0, 4.0, 6.0, 12.970000000000027, 0.2181777878430464, 0.1363116864968458, 0.09268294698410663], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 38.630000000000045, 23, 69, 39.0, 48.0, 50.0, 66.92000000000007, 0.2181711238300028, 0.8954198865542882, 0.07968359405509869], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1162.1080000000004, 793, 1865, 1172.0, 1497.7, 1542.9, 1746.6100000000004, 0.2181016519455322, 0.9224592329844724, 0.10649494723902937], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 6.558000000000003, 4, 33, 6.0, 8.0, 10.0, 15.990000000000009, 0.21807197334637113, 0.32427770950610624, 0.11180447852230942], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 4.496000000000003, 3, 15, 4.0, 5.0, 6.949999999999989, 11.990000000000009, 0.21714762694558845, 0.20945203379924526, 0.11917672494474678], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 9.355999999999993, 6, 21, 9.0, 11.0, 12.949999999999989, 18.0, 0.21816960068417987, 0.355590882365133, 0.14296074419832489], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 767.0, 767, 767, 767.0, 767.0, 767.0, 767.0, 1.303780964797914, 0.618786668839635, 1542.1016847294654], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.952000000000003, 3, 20, 5.0, 6.0, 8.0, 12.980000000000018, 0.21714875862569155, 0.2181475580916359, 0.12787177876102737], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 14.856, 7, 34, 16.0, 18.0, 19.0, 23.0, 0.21816826794903066, 0.3427559844646739, 0.13017657394224386], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 7.185999999999994, 4, 21, 7.0, 9.0, 10.0, 16.0, 0.21816817275428593, 0.33763016117719186, 0.12506320059254475], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2269.694000000001, 1626, 3796, 2229.5, 2923.4, 3081.8, 3433.8100000000004, 0.21790166795010749, 0.33274904022486584, 0.1204417422458602], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 19.701999999999984, 13, 82, 18.0, 25.0, 32.94999999999999, 50.97000000000003, 0.21702622848781766, 0.1275262226009812, 1.750197846535545], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 14.433999999999987, 9, 37, 14.0, 17.900000000000034, 19.94999999999999, 26.0, 0.218171599817434, 0.3949481213843512, 0.18237782172238626], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 9.596000000000007, 6, 29, 9.0, 11.0, 13.0, 17.99000000000001, 0.21817074304155323, 0.3693178998077043, 0.1568102215611164], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 89.0, 89, 89, 89.0, 89.0, 89.0, 89.0, 11.235955056179774, 5.771594101123596, 1532.4130969101125], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 746.0, 746, 746, 746.0, 746.0, 746.0, 746.0, 1.3404825737265416, 0.6780956769436998, 2563.59961461126], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.5960000000000005, 1, 15, 2.0, 3.0, 4.0, 11.0, 0.21714385476376702, 0.1825789638199252, 0.09224372736546743], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 526.268, 406, 764, 512.0, 632.9000000000001, 661.8499999999999, 744.99, 0.21710463184047846, 0.19111568089223058, 0.10091973120709742], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.4500000000000037, 2, 24, 3.0, 4.0, 5.0, 11.0, 0.2171451750124967, 0.19672631866293294, 0.10645202915651694], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 777.0660000000005, 607, 1328, 750.5, 935.8000000000001, 958.8, 1111.88, 0.2170870049982112, 0.20536557872247768, 0.11511547237698112], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 65.0, 65, 65, 65.0, 65.0, 65.0, 65.0, 15.384615384615385, 7.9326923076923075, 1013.0558894230769], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 36.65600000000001, 24, 609, 34.0, 43.900000000000034, 57.0, 84.97000000000003, 0.21697028765486798, 0.1274933513523541, 9.924695579837906], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 41.317999999999984, 29, 197, 39.0, 50.0, 59.94999999999999, 97.97000000000003, 0.21709105797590378, 49.12669304567248, 0.06741694964486074], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 1059.0, 1059, 1059, 1059.0, 1059.0, 1059.0, 1059.0, 0.9442870632672333, 0.4951974150141643, 0.389149551463645], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 3.193999999999998, 2, 10, 3.0, 4.0, 5.0, 7.0, 0.21818778462596503, 0.23702778845079692, 0.09396563771489316], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 4.040000000000003, 2, 24, 4.0, 5.0, 6.0, 10.980000000000018, 0.21818683251193263, 0.22393980563480587, 0.08075469679885007], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.3579999999999997, 1, 10, 2.0, 3.0, 4.0, 7.0, 0.2182356866851352, 0.12376137267082507, 0.08503519432360249], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 195.85400000000004, 87, 448, 191.0, 270.90000000000003, 281.95, 381.8700000000001, 0.21820759048195945, 0.1987419391388481, 0.07159936562689294], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 129.09200000000007, 87, 475, 126.0, 154.90000000000003, 174.0, 243.95000000000005, 0.21704996967811924, 0.12760164233030055, 64.20778985829675], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 259.4640000000001, 17, 604, 309.0, 425.0, 435.95, 516.95, 0.21818473789031068, 0.12162648553806102, 0.09183361526437882], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 516.4100000000005, 295, 1235, 473.5, 839.0, 886.6499999999999, 1029.7300000000002, 0.21820816185808614, 0.11735294611022132, 0.09333513173226732], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 15.19, 9, 321, 13.0, 18.0, 29.0, 53.960000000000036, 0.2169431752063455, 0.10205439153188348, 0.15783463430539785], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 532.9680000000001, 279, 1228, 463.0, 897.9000000000001, 942.0, 1069.8400000000001, 0.21815960556743313, 0.1122137166488503, 0.08820124678214582], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 4.256000000000002, 2, 21, 4.0, 5.0, 7.0, 11.0, 0.21714262883289312, 0.13332006071633615, 0.1089954211133858], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.608, 3, 27, 4.0, 5.0, 7.0, 11.990000000000009, 0.21714036561226202, 0.12716918814582973, 0.10284480207221394], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 880.6259999999994, 581, 1712, 864.5, 1199.9, 1276.95, 1427.95, 0.21705449239853464, 0.198339901447493, 0.09602117681302362], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 480.90400000000045, 242, 1105, 390.0, 859.5000000000002, 901.75, 1030.91, 0.21708474293693078, 0.1922196360042427, 0.08967465455304856], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 5.050000000000001, 3, 46, 5.0, 6.0, 7.0, 15.0, 0.2171495130856468, 0.14483702874755544, 0.10200089433026964], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1203.3880000000006, 884, 10196, 1122.5, 1431.7, 1490.6999999999998, 1850.2700000000007, 0.21706711932396616, 0.16310135053734967, 0.12040441775001248], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 170.81199999999995, 143, 291, 175.0, 190.0, 204.95, 275.8100000000002, 0.2182673154735375, 4.220190018613837, 0.11041256778837151], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 231.04599999999982, 193, 385, 228.5, 260.0, 274.95, 340.9200000000001, 0.2182496898671907, 0.4229977377874021, 0.15644069566652144], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 8.622000000000003, 5, 34, 8.0, 10.0, 12.0, 19.980000000000018, 0.2180703564752503, 0.17803400196612232, 0.13501621680205927], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 8.451999999999991, 5, 36, 8.0, 10.0, 12.0, 18.99000000000001, 0.21807121246285704, 0.18131854659680244, 0.1384241094734932], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.836, 6, 30, 9.0, 11.0, 12.0, 18.0, 0.2180677885527495, 0.17647945024565337, 0.1335239291236074], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 11.551999999999996, 7, 36, 11.0, 14.0, 15.0, 22.980000000000018, 0.2180692151688946, 0.19500796974834814, 0.15205216760799878], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 8.243999999999991, 5, 35, 8.0, 10.0, 11.0, 24.940000000000055, 0.21803146368446136, 0.16367477192273663, 0.12072640616122032], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2044.6199999999994, 1609, 3047, 1965.5, 2547.7000000000003, 2606.9, 2826.98, 0.21786919569229027, 0.1820633295369626, 0.13914692771753695], "isController": false}]}, function(index, item){
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
