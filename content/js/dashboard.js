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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8926824079982982, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.216, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.652, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.973, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.497, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.12, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 322.53209955328725, 1, 18805, 9.0, 832.0, 1496.0, 6035.0, 15.375014962921389, 96.8511932153045, 127.2295608844542], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6183.975999999999, 5254, 18805, 6018.0, 6535.1, 6695.8, 16024.14000000008, 0.3315473980160204, 0.19255327448643308, 0.16706880603151028], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.289999999999998, 1, 8, 2.0, 3.0, 4.0, 6.0, 0.332687033323264, 0.1707977541878644, 0.1202091819625075], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.589999999999999, 2, 14, 3.0, 5.0, 5.0, 7.990000000000009, 0.33268437700858194, 0.19093938985518916, 0.1403512215504955], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 12.158000000000001, 8, 362, 11.0, 14.0, 17.0, 29.99000000000001, 0.3306510916776443, 0.17201283500741982, 3.638130712824237], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 33.83400000000001, 24, 52, 34.0, 40.0, 42.0, 45.0, 0.33262794034783566, 1.383365171717511, 0.13837842049626758], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.1580000000000013, 1, 8, 2.0, 3.0, 3.9499999999999886, 6.0, 0.3326370131857312, 0.20780392939945713, 0.14065608077091954], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 29.949999999999992, 22, 41, 30.0, 35.0, 37.0, 38.0, 0.3326255062560205, 1.3651645912082422, 0.12083660969456995], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 842.5559999999998, 655, 1091, 846.0, 987.9000000000001, 1049.95, 1074.98, 0.3324866007899882, 1.406155319245322, 0.16169758514981847], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 5.414, 3, 14, 5.0, 7.0, 8.0, 11.0, 0.3325701955911834, 0.49453902590688564, 0.16985762919354389], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.9420000000000046, 2, 22, 4.0, 5.0, 6.0, 10.980000000000018, 0.3308574169961455, 0.319132011075452, 0.18093764991976707], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 7.58, 5, 22, 7.0, 9.0, 11.0, 14.990000000000009, 0.3326221870973193, 0.5420409861632496, 0.21730883121885408], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 535.0, 535, 535, 535.0, 535.0, 535.0, 535.0, 1.8691588785046729, 0.8086302570093458, 2210.8225029205605], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.037999999999995, 2, 17, 4.0, 5.0, 6.0, 10.0, 0.33086070102765336, 0.3323825310099192, 0.19418679816173795], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 7.8820000000000014, 5, 21, 8.0, 10.0, 10.949999999999989, 14.0, 0.3326197530897049, 0.5225475810477921, 0.19781780237463892], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.574000000000003, 4, 22, 6.0, 8.0, 9.0, 11.990000000000009, 0.3326179829247232, 0.5147490661334356, 0.19002101563570611], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1549.6460000000004, 1323, 1910, 1525.5, 1745.9, 1807.95, 1871.95, 0.3322691858873315, 0.5073951647108195, 0.1830076375395068], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 10.641999999999998, 7, 82, 10.0, 12.0, 15.0, 37.98000000000002, 0.33063491160806274, 0.1720044177370421, 2.665743974840006], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 10.796000000000003, 8, 31, 10.0, 13.0, 15.0, 19.0, 0.33262727650108037, 0.6021430749246267, 0.2774059513007057], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 7.642000000000004, 5, 29, 7.0, 10.0, 11.0, 16.0, 0.33262528497671295, 0.563159944157204, 0.23842476481729227], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 76.0, 76, 76, 76.0, 76.0, 76.0, 76.0, 13.157894736842104, 6.206311677631579, 1794.5106907894738], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 592.0, 592, 592, 592.0, 592.0, 592.0, 592.0, 1.6891891891891893, 0.7835594383445946, 3230.4786475929054], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.302000000000001, 1, 34, 2.0, 3.0, 4.0, 7.0, 0.33086048209019125, 0.2781005132225083, 0.13990487182134062], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 549.638, 413, 705, 533.0, 638.0, 648.95, 691.9300000000001, 0.33076330247311725, 0.2912622826885103, 0.15310723180884528], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.2460000000000018, 2, 10, 3.0, 4.0, 5.0, 7.990000000000009, 0.33086617455837636, 0.29975376835893686, 0.1615557492960822], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 755.4399999999998, 599, 953, 743.0, 878.0, 890.0, 910.99, 0.33072239030269035, 0.31286531905285075, 0.17472735659546432], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 57.0, 57, 57, 57.0, 57.0, 57.0, 57.0, 17.543859649122805, 8.309347587719298, 1155.2049067982455], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 22.413999999999984, 15, 612, 20.0, 25.0, 28.94999999999999, 58.950000000000045, 0.33050268797836135, 0.17193563175093055, 15.075957573700448], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 30.78000000000003, 21, 272, 29.0, 35.0, 41.0, 146.7900000000002, 0.3307648341412816, 74.80928603562967, 0.10207196053578611], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 396.0, 396, 396, 396.0, 396.0, 396.0, 396.0, 2.5252525252525255, 1.3242779356060606, 1.035748106060606], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.654, 1, 20, 2.0, 3.0, 4.0, 6.0, 0.33264210304320957, 0.3614591742941501, 0.14260730784762596], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.2939999999999987, 2, 11, 3.0, 4.0, 5.0, 7.0, 0.33263989004255795, 0.34131646373692975, 0.12246605326762143], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.7759999999999985, 1, 9, 2.0, 3.0, 3.0, 5.0, 0.3326881401335677, 0.18866731431344144, 0.12898163245412728], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 91.26999999999997, 67, 125, 91.0, 110.0, 115.0, 118.0, 0.3326706533917769, 0.303012934692426, 0.10850781077427098], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 81.63999999999996, 57, 351, 79.0, 93.0, 100.94999999999999, 300.5800000000004, 0.33071407783686535, 0.1720456019574966, 97.78995666818794], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 213.51, 12, 368, 261.5, 335.90000000000003, 339.0, 361.8800000000001, 0.33263568542244065, 0.18538917190179796, 0.1393561611779561], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 416.74599999999975, 324, 549, 403.0, 487.0, 502.95, 524.98, 0.3325861231765966, 0.1788657264595542, 0.14160893525878526], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 7.184000000000002, 4, 284, 6.0, 8.0, 10.0, 26.99000000000001, 0.33044327643760996, 0.14899313004297746, 0.23976499452455494], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 389.98000000000013, 278, 487, 390.0, 452.0, 461.0, 481.96000000000004, 0.3325728500828106, 0.17106391197960663, 0.13380860765050584], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.437999999999999, 2, 18, 3.0, 4.0, 5.0, 10.990000000000009, 0.33085763592955114, 0.20313818777858214, 0.16542881796477557], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.106000000000005, 2, 40, 4.0, 5.0, 5.949999999999989, 9.990000000000009, 0.3308493166638214, 0.19376332392232454, 0.15605490229357982], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 665.6420000000006, 519, 851, 670.5, 789.7, 834.95, 845.99, 0.33069548567592505, 0.3021826883806834, 0.1456481094139084], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 238.8779999999999, 167, 311, 234.0, 280.0, 286.0, 294.99, 0.33077818213572885, 0.29289051320731124, 0.13599376433509947], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.446000000000005, 3, 38, 4.0, 6.0, 6.0, 9.0, 0.3308620146585107, 0.22058867776124202, 0.15476846193498695], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 974.4140000000001, 805, 8496, 927.0, 1084.0, 1100.0, 1133.92, 0.33066421181555816, 0.24855034226225906, 0.18276947645274016], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 134.61600000000004, 117, 163, 135.0, 150.0, 151.0, 155.98000000000002, 0.33267330948731055, 6.432131229765146, 0.16763615985884006], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 182.6800000000001, 159, 281, 182.0, 202.0, 203.95, 207.0, 0.3326365705967899, 0.6447139922159716, 0.23778317351254905], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 6.916000000000006, 5, 22, 7.0, 9.0, 10.0, 14.0, 0.33256444433802385, 0.2714135075954393, 0.20525461798987407], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 6.670000000000001, 5, 17, 6.0, 8.0, 9.0, 13.0, 0.3325682047502712, 0.2766129547537632, 0.210453317068531], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.199999999999994, 5, 20, 8.0, 10.0, 10.0, 17.0, 0.3325602416249691, 0.2691367166377228, 0.20297866310117746], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 9.578000000000012, 7, 26, 9.0, 11.0, 12.0, 17.99000000000001, 0.3325617899805784, 0.29739273115538617, 0.2312343695958709], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 7.673999999999997, 5, 27, 7.0, 9.0, 10.0, 24.88000000000011, 0.33253126791512205, 0.24962901460843115, 0.18347672497269918], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1615.1219999999998, 1400, 1973, 1592.0, 1823.6000000000001, 1867.0, 1940.99, 0.33221421438314797, 0.27761623573223, 0.21152701931426998], "isController": false}]}, function(index, item){
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
