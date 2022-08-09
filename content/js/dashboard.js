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

    var data = {"OkPercent": 97.800467985535, "KoPercent": 2.1995320144650075};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8767921718783238, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [0.993, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.381, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.802, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.348, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.993, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [0.5, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.895, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #4"], "isController": false}, {"data": [0.999, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.514, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [0.927, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [0.859, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 517, 2.1995320144650075, 291.8953839608603, 1, 7059, 31.0, 820.0, 1883.9500000000007, 3703.9600000000064, 16.64601111858645, 110.45865828936653, 137.88167718255374], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 45.960000000000036, 18, 106, 39.5, 75.0, 81.94999999999999, 93.0, 0.36069440887596804, 0.2094605972919064, 0.18175616697265576], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 15.344000000000017, 5, 83, 13.0, 27.0, 32.0, 45.99000000000001, 0.360570335734251, 3.854765204034133, 0.13028420334147742], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 16.05399999999999, 5, 64, 14.0, 27.900000000000034, 32.0, 44.99000000000001, 0.360562795255859, 3.8717225912332043, 0.1521124292485655], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 3, 0.6, 68.81000000000002, 16, 725, 57.0, 127.90000000000003, 147.95, 181.85000000000014, 0.35767784099932326, 0.19268356786865498, 3.981960339250279], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 74.068, 28, 164, 66.5, 122.90000000000003, 135.0, 155.97000000000003, 0.3605136598625722, 1.4994002517286629, 0.14997931552876537], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 7.243999999999996, 1, 39, 6.0, 14.900000000000034, 16.0, 21.0, 0.36052769717980815, 0.22528896970918394, 0.15244970007700873], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 65.276, 25, 164, 59.0, 104.90000000000003, 115.94999999999999, 138.99, 0.36050066332122055, 1.4795496422932168, 0.13096313159716214], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1168.7659999999998, 585, 2617, 923.0, 2285.0000000000005, 2407.95, 2492.9300000000003, 0.3603777623856431, 1.5240720464069255, 0.17526184147270535], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 23.66199999999998, 8, 68, 20.0, 40.0, 44.0, 62.99000000000001, 0.35995228472513685, 0.5352771686585226, 0.18384281729613922], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 9.900000000000011, 2, 59, 6.0, 22.0, 25.0, 35.0, 0.35823701534114194, 0.34558187296521375, 0.19591086776468702], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 37.560000000000024, 13, 140, 29.5, 64.0, 69.0, 84.98000000000002, 0.3604829895286901, 0.587402102958628, 0.23551085936981805], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 974.0, 974, 974, 974.0, 974.0, 974.0, 974.0, 1.026694045174538, 0.438149704825462, 1214.3634897972279], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 10.548000000000002, 2, 46, 8.0, 21.0, 25.0, 32.0, 0.3582516459871875, 0.35991975521381536, 0.21026292894365203], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 38.026000000000025, 14, 170, 31.0, 64.0, 69.0, 88.94000000000005, 0.3604775317959207, 0.566353149969828, 0.21438556334347236], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 23.77399999999998, 8, 53, 21.0, 41.0, 44.94999999999999, 50.0, 0.3604723341088295, 0.5579168308317755, 0.20593390181021998], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2935.694, 1502, 6353, 2639.5, 4333.000000000001, 4975.75, 5625.84, 0.3595709886620076, 0.5490663042610601, 0.19804495859899635], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 69.32600000000001, 13, 295, 59.0, 132.0, 148.0, 177.97000000000003, 0.3576064683858001, 0.19306069676938317, 2.8832021513605137], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 43.14199999999998, 17, 109, 37.5, 68.0, 77.0, 99.96000000000004, 0.3604897469506172, 0.6526019113526873, 0.30064281630451867], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 36.80399999999998, 13, 118, 30.0, 63.900000000000034, 67.94999999999999, 76.0, 0.3604884474267253, 0.6103344005744022, 0.2583969925890785], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 149.0, 149, 149, 149.0, 149.0, 149.0, 149.0, 6.7114093959731544, 3.126310822147651, 915.320889261745], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 719.0, 719, 719, 719.0, 719.0, 719.0, 719.0, 1.3908205841446453, 0.6370066933240612, 2659.8655902294854], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 8.877999999999991, 1, 78, 6.0, 19.0, 22.0, 27.99000000000001, 0.3583335483334623, 0.3010708674914788, 0.15152190080897382], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 609.6180000000002, 325, 1407, 479.5, 1188.4, 1241.9, 1324.0, 0.3582552396620077, 0.3154304438943634, 0.16583299179667152], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 9.643999999999991, 2, 43, 6.0, 20.0, 26.0, 34.99000000000001, 0.35835666235205244, 0.32465923752990483, 0.17497883903908812], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1626.5180000000007, 930, 3824, 1314.5, 3095.4, 3454.9, 3647.8900000000003, 0.3579718175947444, 0.338602885440785, 0.18912378253784837], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 81.0, 81, 81, 81.0, 81.0, 81.0, 81.0, 12.345679012345679, 5.774980709876543, 812.9219714506172], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 3, 0.6, 105.35200000000003, 31, 1077, 97.5, 180.0, 199.95, 238.98000000000002, 0.35733454160053, 0.19245815076516046, 16.344565683091428], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 126.94999999999996, 12, 400, 111.0, 236.90000000000003, 255.95, 283.96000000000004, 0.3579884770669001, 79.33157429169295, 0.11047300659486373], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 572.0, 572, 572, 572.0, 572.0, 572.0, 572.0, 1.7482517482517483, 0.9168078015734267, 0.7170563811188811], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 8.246000000000002, 1, 42, 6.0, 19.0, 22.94999999999999, 31.99000000000001, 0.36055863512692027, 0.3917941395430424, 0.1545754304889824], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 10.46, 2, 75, 7.0, 20.0, 24.94999999999999, 43.960000000000036, 0.3605560350950822, 0.36991992884246366, 0.13274377463949805], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 6.264000000000003, 1, 36, 5.0, 12.0, 14.0, 22.970000000000027, 0.36057527621869034, 0.20446167508489746, 0.13979334439337898], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 204.51600000000008, 89, 470, 150.0, 384.0, 403.0, 450.99, 0.3605224980459681, 0.32844303717491685, 0.11759229916733724], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 11, 2.2, 330.4019999999997, 51, 1307, 287.5, 535.9000000000001, 584.9, 693.99, 0.3577925061075181, 0.19158251312382912, 105.84159215339567], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 6.661999999999998, 1, 32, 5.0, 12.0, 15.949999999999989, 23.960000000000036, 0.360554215095107, 0.20101038333042487, 0.15105249831621181], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 9.939999999999998, 2, 56, 7.0, 20.0, 24.0, 31.980000000000018, 0.3605778765280389, 0.19394019130819817, 0.15352729899045406], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 63.542000000000066, 7, 626, 51.0, 132.90000000000003, 147.89999999999998, 186.98000000000002, 0.35718342297446637, 0.15093441304226696, 0.25916726881838725], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 10.96999999999999, 3, 69, 8.0, 20.0, 24.0, 33.0, 0.36056019516402243, 0.18548005164664236, 0.14506914102302465], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 10.482000000000003, 2, 45, 8.0, 20.0, 24.0, 29.0, 0.3583304666895998, 0.22002610437449835, 0.17916523334479992], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 11.254, 2, 47, 9.0, 22.900000000000034, 26.0, 34.97000000000003, 0.35831891099716573, 0.2098916006911972, 0.16901175196448343], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 815.4919999999998, 384, 1844, 638.0, 1595.8000000000002, 1666.85, 1727.95, 0.3580564125039028, 0.3271439757814223, 0.157698673866465], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 30.55000000000002, 5, 254, 27.0, 55.0, 64.0, 102.0, 0.358089492293556, 0.31707355816161154, 0.14722234009334678], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 21.391999999999992, 7, 69, 18.0, 37.0, 41.0, 51.99000000000001, 0.3582614004151533, 0.23877492581302054, 0.16758516679576022], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 845.9639999999998, 454, 5943, 817.0, 1014.9000000000001, 1088.0, 1589.4700000000023, 0.35814951309573695, 0.2691696449037115, 0.19796154727752646], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 262.8220000000001, 144, 652, 197.0, 524.0, 558.95, 605.94, 0.3605802168385192, 6.97176356043036, 0.18169862489128508], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 430.3780000000003, 221, 967, 355.0, 762.0, 818.8499999999999, 892.95, 0.3604897469506172, 0.6987600887561807, 0.2576938425467303], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 38.11599999999997, 14, 92, 30.0, 64.0, 71.0, 80.0, 0.35992740983998345, 0.2937042813455382, 0.22214269826061478], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 38.10000000000001, 14, 123, 31.0, 64.0, 68.94999999999999, 77.0, 0.35993000081344184, 0.29937107518829736, 0.2277682036397561], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 37.912, 13, 120, 30.5, 65.0, 71.0, 88.97000000000003, 0.35988129675307895, 0.29130844607214756, 0.21965411178776792], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 40.35399999999997, 16, 115, 34.0, 66.0, 72.0, 100.99000000000001, 0.3599015021568897, 0.3218616004171978, 0.25024401321846235], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 37.236000000000026, 13, 152, 28.0, 65.0, 72.0, 86.96000000000004, 0.35967238162102905, 0.2700036684334973, 0.19845204649988418], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 3269.04, 1655, 7059, 2863.5, 5107.500000000002, 5529.4, 6742.280000000001, 0.3592847072620062, 0.3001971092042275, 0.22876330970198053], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["No results for path: $['rows'][1]", 500, 96.71179883945841, 2.1272069772388855], "isController": false}, {"data": ["500", 17, 3.288201160541586, 0.0723250372261221], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 23505, 517, "No results for path: $['rows'][1]", 500, "500", 17, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Query cross patient #1", 500, 500, "No results for path: $['rows'][1]", 500, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 3, "500", 3, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 3, "500", 3, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 11, "500", 11, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
