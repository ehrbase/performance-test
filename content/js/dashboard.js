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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8888959795788131, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.174, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.567, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.95, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.999, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.497, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.091, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 326.01723037651755, 1, 17468, 9.0, 852.0, 1519.9500000000007, 6052.990000000002, 15.218142900983985, 95.86301555060477, 125.93143118484298], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6186.271999999999, 5484, 17468, 6028.0, 6585.3, 6795.4, 14797.510000000068, 0.32813200356745115, 0.1905697107828114, 0.1653477674226609], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.341999999999999, 1, 8, 2.0, 3.0, 4.0, 6.0, 0.32933151630158075, 0.16907506976064843, 0.11899673928865709], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.65, 2, 13, 3.0, 4.0, 5.0, 8.0, 0.32932913021542076, 0.1890136944520556, 0.13893572680963062], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 13.275999999999998, 9, 386, 11.0, 16.0, 19.0, 34.0, 0.327443712425834, 0.17034427738902932, 3.6028401444354214], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 34.13399999999998, 23, 55, 34.0, 41.0, 42.0, 45.99000000000001, 0.3292553955081662, 1.3693391068404126, 0.13697538914695195], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.3440000000000016, 1, 8, 2.0, 3.0, 4.0, 6.0, 0.3292640684658533, 0.2056967941780186, 0.13922982582589305], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 30.004, 21, 46, 30.0, 35.0, 37.0, 40.0, 0.3292547450547584, 1.3513302828018394, 0.11961207535192395], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 862.868, 666, 1102, 864.0, 1005.9000000000001, 1064.9, 1083.97, 0.32910001020210033, 1.3918327199046268, 0.1600505908990683], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 5.620000000000001, 4, 18, 5.0, 7.0, 8.0, 11.0, 0.32921507225612406, 0.4895498854249245, 0.16814402616206336], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.898000000000003, 2, 19, 4.0, 5.0, 5.0, 8.990000000000009, 0.3276275896503755, 0.3160166470445043, 0.1791713380900491], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 7.910000000000005, 5, 23, 8.0, 10.0, 11.0, 15.0, 0.3292517096395023, 0.5365484574145839, 0.2151068298328389], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 402.0, 402, 402, 402.0, 402.0, 402.0, 402.0, 2.487562189054726, 1.076162157960199, 2942.2637787624376], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.1579999999999995, 2, 13, 4.0, 5.0, 6.0, 8.990000000000009, 0.32763080987715154, 0.32913778362180135, 0.19229112962516415], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 8.066, 5, 17, 8.0, 10.0, 11.0, 15.0, 0.32924910789954215, 0.5172522777041724, 0.1958131901472863], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.608000000000007, 4, 16, 6.0, 8.0, 9.0, 11.0, 0.3292471566215554, 0.5095324820017042, 0.18809529943711906], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1575.9219999999998, 1339, 1940, 1555.0, 1775.8000000000002, 1847.4499999999998, 1905.96, 0.32889111073105914, 0.5022366394152974, 0.1811470570823412], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 12.104, 7, 87, 10.0, 14.900000000000034, 19.94999999999999, 43.99000000000001, 0.32742677263943304, 0.170335464895266, 2.639878354405429], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 11.153999999999998, 8, 25, 11.0, 13.0, 15.0, 19.980000000000018, 0.3292569132427789, 0.5960418287571013, 0.2745951210052082], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 7.857999999999995, 5, 18, 8.0, 10.0, 11.0, 14.0, 0.32925496187227543, 0.5574537304175612, 0.2360089277482912], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 45.0, 45, 45, 45.0, 45.0, 45.0, 45.0, 22.22222222222222, 10.481770833333334, 3030.729166666667], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 448.0, 448, 448, 448.0, 448.0, 448.0, 448.0, 2.232142857142857, 1.0354178292410714, 4268.846784319197], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.3459999999999988, 1, 22, 2.0, 3.0, 3.0, 7.990000000000009, 0.32764648255118656, 0.27539902734046073, 0.13854582709439822], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 570.8360000000004, 446, 743, 562.0, 660.9000000000001, 672.95, 702.9300000000001, 0.32753852180554954, 0.28842261767312705, 0.15161451107014695], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.3599999999999977, 1, 11, 3.0, 4.0, 5.0, 9.0, 0.32764390611822575, 0.29683450014154217, 0.15998237603428989], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 777.8380000000001, 634, 947, 761.0, 897.9000000000001, 909.0, 936.0, 0.32749089575309803, 0.3098083062743981, 0.1730200923851817], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 49.0, 49, 49, 49.0, 49.0, 49.0, 49.0, 20.408163265306122, 9.665975765306122, 1343.8097895408164], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 23.505999999999997, 15, 605, 21.0, 26.900000000000034, 38.0, 60.98000000000002, 0.3272988159638034, 0.17026889868366962, 14.929812200848882], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 29.99999999999997, 21, 246, 28.0, 36.0, 40.94999999999999, 113.97000000000003, 0.32756985099502617, 74.08667473177762, 0.10108600870549636], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 428.0, 428, 428, 428.0, 428.0, 428.0, 428.0, 2.336448598130841, 1.2252665011682242, 0.9583089953271028], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.7200000000000015, 1, 11, 3.0, 4.0, 4.0, 7.0, 0.3292833674361141, 0.3578094685349985, 0.14116738115669344], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.4879999999999987, 2, 13, 3.0, 4.0, 5.0, 7.990000000000009, 0.32928184945760697, 0.3378708320738303, 0.121229743403826], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.8839999999999997, 1, 10, 2.0, 3.0, 3.0, 5.990000000000009, 0.32933260089762895, 0.18676438932349815, 0.12768070562144404], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 91.64399999999986, 66, 120, 91.0, 110.90000000000003, 113.0, 117.99000000000001, 0.32931568201277744, 0.29995706032240005, 0.1074135134690114], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 82.46400000000004, 59, 363, 79.0, 93.0, 101.94999999999999, 313.7800000000002, 0.32751341986237886, 0.1703805409129764, 96.84354335950165], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 207.84399999999988, 13, 377, 261.0, 333.0, 338.0, 358.96000000000004, 0.32927816299664203, 0.18351791055059918, 0.13794954289605413], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 433.4000000000005, 332, 568, 422.5, 500.90000000000003, 511.95, 550.94, 0.3292103034923946, 0.17705020140263342, 0.14017157453387113], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 7.481999999999995, 4, 293, 6.0, 8.0, 11.0, 26.99000000000001, 0.3272399080848546, 0.14754876754087717, 0.23744067549516307], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 404.8480000000004, 302, 509, 399.0, 468.7000000000001, 477.0, 491.98, 0.32920271710754595, 0.16933043274190968, 0.13245265571123918], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.586000000000001, 2, 23, 3.0, 5.0, 5.0, 10.990000000000009, 0.3276417591217104, 0.20116372107168998, 0.1638208795608552], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.234000000000004, 2, 36, 4.0, 5.0, 5.0, 10.0, 0.3276344595440246, 0.19188052903627636, 0.1545385194919569], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 672.5999999999999, 527, 888, 677.0, 791.0, 831.95, 850.98, 0.32748038556230674, 0.29924479645947855, 0.14423208387558628], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 247.10199999999983, 175, 322, 241.0, 292.0, 295.0, 305.0, 0.3275752161832639, 0.29005441822805395, 0.1346769199347208], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.481999999999996, 3, 35, 4.0, 5.0, 6.0, 9.990000000000009, 0.32763188330014426, 0.21843512016390768, 0.1532574922859073], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 982.9639999999994, 780, 8522, 933.5, 1080.0, 1107.0, 1134.99, 0.3274413536163605, 0.24612781669145398, 0.18098809194029303], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 133.5099999999998, 116, 171, 132.0, 149.0, 150.0, 154.0, 0.32929702987250936, 6.366851951471826, 0.1659348314591942], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 182.4839999999998, 160, 227, 182.0, 203.0, 205.0, 213.0, 0.32927512714959034, 0.6381988648486947, 0.23538026667333997], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 7.012000000000005, 5, 17, 7.0, 9.0, 10.0, 13.990000000000009, 0.3292109537702226, 0.26867664665557883, 0.20318488553005928], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 6.907999999999998, 4, 16, 7.0, 9.0, 10.0, 14.990000000000009, 0.32921268785699004, 0.27382201013152047, 0.20832990403450147], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.293999999999993, 6, 32, 8.0, 10.0, 11.0, 14.990000000000009, 0.3292068353873645, 0.2664228481971317, 0.20093190636435823], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 9.742000000000006, 7, 21, 10.0, 12.0, 13.0, 15.990000000000009, 0.3292087861874528, 0.29439431406221916, 0.2289029841459633], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 7.782, 5, 33, 7.0, 9.0, 10.0, 16.99000000000001, 0.3292770787591259, 0.24718611641887467, 0.18168120068252552], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1630.7780000000002, 1456, 1975, 1607.0, 1809.0, 1873.85, 1946.91, 0.3288889473580351, 0.2748374620544377, 0.2094097594506239], "isController": false}]}, function(index, item){
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
