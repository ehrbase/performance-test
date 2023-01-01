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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8700701978302489, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.462, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [0.5, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [0.994, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.783, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.821, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [0.844, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.492, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 487.7331631567742, 1, 24916, 13.0, 1010.0, 1821.9500000000007, 10391.910000000014, 10.127388370371584, 63.8844330490979, 83.90662141566713], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 10992.139999999994, 8961, 24916, 10509.5, 12648.1, 13260.8, 23108.870000000083, 0.2180286114586245, 0.12667419742032907, 0.11029181712457763], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.965999999999997, 1, 13, 3.0, 4.0, 4.0, 8.0, 0.21879597450414268, 0.11232737476227818, 0.07948447511283309], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 4.409999999999998, 3, 22, 4.0, 5.0, 6.0, 10.990000000000009, 0.21879415539548575, 0.1255117800414221, 0.09273111664222736], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 16.670000000000012, 11, 474, 15.0, 19.0, 24.0, 39.0, 0.217516612831305, 0.12781437608078566, 2.4219965034204485], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 44.501999999999995, 27, 86, 46.0, 55.0, 57.0, 61.99000000000001, 0.21874591218576603, 0.9097416051607848, 0.09142895548389439], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.759999999999998, 1, 21, 3.0, 3.0, 4.0, 8.990000000000009, 0.21875069726784754, 0.13666962508755498, 0.09292632159327509], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 39.025999999999996, 24, 71, 40.0, 49.0, 51.0, 58.98000000000002, 0.21874600788535611, 0.8977793308592431, 0.07989356147375311], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1122.3140000000003, 782, 1736, 1106.5, 1451.0, 1553.9, 1690.7500000000002, 0.21867004876342086, 0.9248632628851325, 0.10677248474776409], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 6.687999999999993, 4, 23, 6.0, 9.0, 10.0, 14.0, 0.2186514018834632, 0.3251393321894221, 0.11210154881720524], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 4.17800000000001, 3, 15, 4.0, 5.0, 6.0, 11.0, 0.21769096068762478, 0.20997611209059952, 0.11947492178363783], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 10.448, 7, 31, 10.0, 12.0, 14.0, 20.0, 0.2187453379899841, 0.3565292667043784, 0.1433380095617962], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 524.0, 524, 524, 524.0, 524.0, 524.0, 524.0, 1.9083969465648853, 0.9057430820610687, 2257.236626312023], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.617999999999989, 3, 25, 4.0, 6.0, 7.0, 12.990000000000009, 0.2176920032584139, 0.21869330143746385, 0.12819167770002304], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 15.661999999999988, 7, 29, 16.0, 19.0, 20.0, 21.99000000000001, 0.21874447670196326, 0.3436488546047025, 0.13052038600087848], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 7.669999999999998, 4, 17, 7.5, 9.0, 10.0, 14.990000000000009, 0.2187446680987151, 0.33852232713155744, 0.1253936720448689], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2243.3680000000018, 1605, 3514, 2197.5, 2866.100000000001, 3033.5499999999997, 3402.76, 0.2184934613646752, 0.3336527446001526, 0.12076884680899039], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 14.298000000000004, 10, 111, 13.0, 17.900000000000034, 22.94999999999999, 39.99000000000001, 0.21751188158653165, 0.12781159596624217, 1.7541143731851354], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 14.659999999999993, 10, 30, 14.0, 17.0, 19.0, 25.0, 0.2187467734850911, 0.39598933737992986, 0.18285863096019334], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 10.261999999999995, 6, 31, 10.0, 12.900000000000034, 14.0, 20.0, 0.21874648638456246, 0.3702925140905549, 0.15722403708890426], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 57.0, 57, 57, 57.0, 57.0, 57.0, 57.0, 17.543859649122805, 9.011787280701753, 2392.7151864035086], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 629.0, 629, 629, 629.0, 629.0, 629.0, 629.0, 1.589825119236884, 0.8042279411764706, 3040.4535969793324], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.759999999999999, 2, 27, 2.0, 3.0, 4.0, 8.990000000000009, 0.2176741861488691, 0.1830248772208753, 0.09246901462378718], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 704.1359999999997, 548, 962, 678.0, 849.8000000000001, 871.8, 935.96, 0.21762321499998477, 0.1915721860012561, 0.10116079134764917], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.600000000000001, 2, 19, 3.0, 4.0, 5.0, 11.990000000000009, 0.21769503624840048, 0.19722447468555038, 0.10672159003583695], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 950.9559999999996, 751, 1325, 901.0, 1156.0, 1196.0, 1230.96, 0.21761923684415546, 0.20586907316728698, 0.11539770078747698], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 66.0, 66, 66, 66.0, 66.0, 66.0, 66.0, 15.151515151515152, 7.8125, 997.7065577651515], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 29.230000000000025, 20, 522, 27.0, 33.0, 40.0, 78.87000000000012, 0.2174637292246026, 0.12778330128099186, 9.947266676641004], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 37.460000000000015, 26, 231, 35.0, 43.0, 51.94999999999999, 116.93000000000006, 0.21758571245177757, 49.23863104453109, 0.06757056304654811], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 978.0, 978, 978, 978.0, 978.0, 978.0, 978.0, 1.0224948875255624, 0.5362106978527608, 0.4213797290388548], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.9479999999999977, 2, 11, 3.0, 4.0, 4.949999999999989, 7.0, 0.2187618951780503, 0.2376514721034831, 0.0942128864975783], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.6940000000000017, 2, 13, 4.0, 5.0, 5.0, 7.0, 0.21876103375964026, 0.2245167561927967, 0.08096721854971059], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.0820000000000003, 1, 14, 2.0, 3.0, 3.9499999999999886, 8.0, 0.21879674045367942, 0.12407954604380485, 0.08525380804786922], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 201.91000000000005, 89, 369, 216.0, 302.0, 312.0, 327.99, 0.21877835914480415, 0.19927418296674831, 0.07178664909438885], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 117.01999999999995, 85, 460, 111.0, 136.0, 165.95, 316.8700000000001, 0.21755144112601144, 0.12789645269322159, 64.35613529872207], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 269.86999999999995, 17, 541, 335.5, 443.90000000000003, 460.0, 504.0, 0.21875835383463707, 0.1219338555678595, 0.09207504931907087], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 517.6559999999994, 311, 1078, 489.5, 838.7, 899.95, 970.0, 0.21879540004550946, 0.11766876441314698, 0.09358631369134096], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 8.05, 5, 286, 7.0, 9.0, 13.949999999999989, 29.970000000000027, 0.217438857280527, 0.1022875702544948, 0.15819526237694592], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 525.5460000000004, 305, 1177, 477.0, 878.9000000000001, 922.95, 991.97, 0.21873356764073099, 0.11250894278520451, 0.08843329785474867], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 4.011999999999995, 2, 14, 4.0, 5.0, 6.0, 12.990000000000009, 0.21767314374873206, 0.133645783404556, 0.10926171473325028], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.4959999999999996, 3, 75, 4.0, 5.0, 6.0, 11.0, 0.21766622625533555, 0.1274771606910032, 0.10309386692757593], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 859.4040000000001, 589, 1325, 867.5, 1110.9, 1248.6, 1318.0, 0.21757444527219433, 0.1988150236187939, 0.09625119502764067], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 479.4199999999999, 264, 1046, 397.5, 854.1000000000004, 909.75, 975.95, 0.21758173566691197, 0.19265970268217356, 0.08987995526084351], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 5.669999999999997, 3, 51, 5.0, 7.0, 8.0, 17.980000000000018, 0.21769266671775186, 0.1451993079767818, 0.10225602801878776], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1183.0720000000013, 912, 10630, 1088.5, 1422.0, 1439.0, 1513.89, 0.21760881855385014, 0.16350837614424157, 0.12070489154158874], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 169.50599999999986, 142, 286, 170.0, 189.0, 191.0, 220.98000000000002, 0.218864260823166, 4.2317319336307255, 0.11071453818984373], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 231.15799999999984, 194, 378, 227.5, 258.0, 262.95, 295.94000000000005, 0.2188457723811383, 0.42416542275641506, 0.15686796574976125], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 9.115999999999994, 6, 19, 9.0, 11.0, 13.0, 16.0, 0.21864872464385404, 0.17850618535377144, 0.13537430803144868], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 8.996000000000006, 6, 29, 9.0, 11.0, 13.0, 19.980000000000018, 0.21864977640873864, 0.1817996021776643, 0.13879136197820324], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 9.789999999999997, 6, 26, 10.0, 12.0, 14.0, 16.0, 0.21864585624559701, 0.176947272977821, 0.1338778826816302], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 12.073999999999996, 8, 26, 12.0, 15.0, 17.0, 21.99000000000001, 0.2186474816620357, 0.1955250834304128, 0.15245537295575537], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 9.197999999999997, 5, 34, 9.0, 11.0, 12.0, 28.87000000000012, 0.21861956610137476, 0.1641162565017459, 0.12105204490183544], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2004.3580000000004, 1630, 2808, 1935.0, 2527.7000000000003, 2584.95, 2637.99, 0.21846482148365579, 0.18256106678884676, 0.1395273371585067], "isController": false}]}, function(index, item){
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
