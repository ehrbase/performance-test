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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8931929376728356, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.209, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.656, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.978, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.496, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.141, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 324.4015315890238, 1, 22905, 9.0, 841.0, 1493.9500000000007, 6035.970000000005, 15.255656372911718, 96.09934098732589, 126.24185836635318], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6246.504000000004, 5092, 22905, 6025.5, 6525.7, 6716.5, 21600.370000000134, 0.3293208876383477, 0.19126018074941578, 0.16594685353651115], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.364000000000001, 1, 7, 2.0, 3.0, 4.0, 5.990000000000009, 0.3304170722536228, 0.16963238188911334, 0.11938898118539107], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.7499999999999996, 2, 21, 4.0, 5.0, 5.0, 9.0, 0.33041467041136624, 0.18963672455807037, 0.13939368907979513], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 12.436, 8, 371, 11.0, 15.0, 16.0, 46.98000000000002, 0.32804330696521233, 0.17067478180199436, 3.60943744099321], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 34.43599999999997, 24, 57, 34.0, 41.0, 42.0, 44.0, 0.33035550877721553, 1.373914364047476, 0.13743305345614631], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.376000000000002, 1, 20, 2.0, 3.0, 4.0, 7.0, 0.3303635849470493, 0.20638368059226264, 0.1396947580879613], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 30.443999999999996, 21, 66, 30.0, 36.0, 37.0, 40.99000000000001, 0.3303587828525292, 1.35586148465054, 0.12001315158314535], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 857.6340000000001, 679, 1090, 860.5, 1007.0, 1062.95, 1087.93, 0.330212386002429, 1.3965371896333785, 0.16059157053633757], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 5.855999999999995, 3, 30, 5.0, 8.0, 9.0, 20.940000000000055, 0.3303426313772645, 0.4912265900629633, 0.1687199181741302], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.7759999999999994, 2, 26, 4.0, 5.0, 5.0, 11.0, 0.32826212124295795, 0.3166286911844551, 0.17951834755474264], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 7.538000000000001, 5, 18, 7.0, 9.0, 10.0, 15.0, 0.3303675140373157, 0.5383667718253995, 0.21583580751070722], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 450.0, 450, 450, 450.0, 450.0, 450.0, 450.0, 2.2222222222222223, 0.9613715277777778, 2628.422309027778], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.0, 2, 19, 4.0, 5.0, 6.0, 12.990000000000009, 0.32826686257633025, 0.32977676191493815, 0.1926644378988032], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 7.862000000000008, 5, 16, 8.0, 10.0, 10.949999999999989, 13.0, 0.3303675140373157, 0.5190093002997755, 0.19647833598508327], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.574000000000003, 4, 14, 6.0, 8.0, 8.0, 11.0, 0.33036685918244774, 0.5112652982568523, 0.18873497326341007], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1557.9540000000002, 1322, 1952, 1538.5, 1759.9, 1809.9, 1888.0, 0.330043460122829, 0.5039963467076845, 0.1817817495207769], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 10.581999999999995, 7, 68, 10.0, 13.0, 15.0, 29.980000000000018, 0.32803620469984035, 0.17065250645083196, 2.6447919003924625], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 10.934000000000006, 8, 25, 11.0, 13.0, 14.0, 19.0, 0.33036904204210354, 0.5980550751209646, 0.27552261904683245], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 7.709999999999996, 5, 19, 7.0, 10.0, 11.0, 15.0, 0.3303686054678647, 0.5593392138532146, 0.23680718399747333], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 79.0, 79, 79, 79.0, 79.0, 79.0, 79.0, 12.658227848101266, 5.970628955696203, 1726.3647151898733], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 478.0, 478, 478, 478.0, 478.0, 478.0, 478.0, 2.092050209205021, 0.9704334466527197, 4000.927530073222], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.253999999999998, 1, 22, 2.0, 3.0, 3.9499999999999886, 6.0, 0.3282681556910209, 0.27592156668439316, 0.13880870255294145], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 551.8880000000001, 430, 700, 540.0, 643.0, 659.0, 682.99, 0.32816344639876716, 0.2889729113791331, 0.15190378280567932], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.2260000000000013, 1, 15, 3.0, 4.0, 5.0, 8.990000000000009, 0.32826707809473793, 0.2973990732610051, 0.16028665922594623], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 751.19, 624, 933, 726.5, 877.8000000000001, 899.0, 923.99, 0.32812403613564384, 0.3104072607860933, 0.17335459330994465], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 49.0, 49, 49, 49.0, 49.0, 49.0, 49.0, 20.408163265306122, 9.665975765306122, 1343.8097895408164], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 22.00000000000001, 15, 638, 20.0, 24.0, 27.0, 50.98000000000002, 0.3279006749507493, 0.1705820005400524, 14.95726613959912], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 29.93199999999998, 20, 270, 28.0, 35.0, 41.0, 91.99000000000001, 0.3281724927129298, 74.22297457988178, 0.10127198017313069], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 465.0, 465, 465, 465.0, 465.0, 465.0, 465.0, 2.150537634408602, 1.1277721774193548, 0.8820564516129031], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.6419999999999977, 1, 10, 2.0, 3.0, 4.0, 7.0, 0.33035965595023986, 0.3589789968480385, 0.1416287978146048], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.3840000000000003, 2, 9, 3.0, 4.0, 5.0, 8.0, 0.33035856457882257, 0.33897563221544397, 0.12162615121700791], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.749999999999999, 1, 11, 2.0, 3.0, 3.0, 5.990000000000009, 0.33041794565946464, 0.1873798879139724, 0.12810148869805418], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 92.31600000000003, 64, 120, 92.0, 112.0, 114.94999999999999, 118.0, 0.3303967668693981, 0.3009417660417542, 0.10776613294372946], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 81.25399999999993, 57, 337, 80.0, 92.0, 99.0, 299.27000000000066, 0.3281053034285035, 0.1706884533099591, 97.01855939952792], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 202.19200000000006, 12, 347, 259.0, 335.0, 338.95, 345.0, 0.33035441743319904, 0.18411774372392678, 0.138400434647307], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 410.76200000000034, 322, 528, 397.0, 484.0, 498.95, 514.98, 0.330315352066618, 0.17764449954746797, 0.1406420834971147], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 7.156000000000006, 4, 281, 6.0, 8.0, 10.0, 35.950000000000045, 0.3278441297869341, 0.14782120426164586, 0.23787909026532425], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 388.9540000000001, 290, 496, 388.0, 456.0, 465.0, 488.99, 0.3302974592858837, 0.16989353005905058, 0.13289311838455475], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.3400000000000025, 2, 17, 3.0, 5.0, 5.0, 8.990000000000009, 0.32826643154036395, 0.20154725407592014, 0.16413321577018197], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.144000000000004, 2, 39, 4.0, 5.0, 6.0, 9.990000000000009, 0.3282584575791595, 0.19224597616679467, 0.15483284669016997], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 672.9859999999998, 543, 867, 678.0, 808.6000000000001, 838.0, 851.97, 0.3280994902646319, 0.29981052151906123, 0.1445047559661611], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 240.63000000000008, 174, 309, 235.0, 284.0, 292.0, 303.98, 0.3281832627848713, 0.29059281855436586, 0.13492690784417072], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.4979999999999976, 2, 52, 4.0, 5.0, 7.0, 13.990000000000009, 0.3282700953821589, 0.21886062189292355, 0.15355603094536535], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 993.5800000000005, 809, 10219, 928.5, 1078.9, 1103.95, 1123.98, 0.32809195498840854, 0.24661685417395304, 0.18134770168304612], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 135.06399999999988, 117, 162, 133.5, 152.0, 154.0, 157.0, 0.3303978584932404, 6.388136118094437, 0.16648954588135942], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 181.95999999999992, 158, 230, 175.5, 204.0, 208.0, 227.96000000000004, 0.3303806116798797, 0.6403415076241934, 0.23617051538053901], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 7.023999999999997, 5, 14, 7.0, 9.0, 10.0, 13.0, 0.33034066711637045, 0.2695986317537324, 0.20388213048588488], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 7.036000000000002, 5, 28, 7.0, 9.0, 10.0, 16.0, 0.3303413218674063, 0.2747607492653209, 0.20904411774421802], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.341999999999997, 5, 33, 8.0, 10.0, 11.0, 13.990000000000009, 0.33033848463166265, 0.26733867734287614, 0.20162261024881756], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 9.699999999999987, 7, 26, 9.0, 12.0, 13.0, 17.0, 0.3303387028788357, 0.2954047398566198, 0.2296886293454405], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 7.707999999999996, 5, 33, 7.0, 9.0, 11.0, 15.0, 0.3303046598060187, 0.24795751468699673, 0.18224817655312556], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1607.432000000001, 1413, 1958, 1580.0, 1800.9, 1869.9, 1948.99, 0.3299988054043244, 0.2757649196997407, 0.2101164268785347], "isController": false}]}, function(index, item){
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
