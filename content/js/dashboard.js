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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8611359285258455, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.45, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [0.5, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.996, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [0.969, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.572, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.707, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.284, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 495.2643692831293, 1, 27346, 14.0, 1194.800000000003, 2345.9500000000007, 9773.960000000006, 9.957496887355525, 62.724906584259784, 82.39913649136658], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 9956.083999999993, 8398, 27346, 9728.0, 10455.6, 10729.65, 26211.320000000134, 0.21477727811037234, 0.12473651861818313, 0.10822761279780481], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 3.407999999999997, 2, 17, 3.0, 4.0, 5.0, 9.990000000000009, 0.21551872771536354, 0.11064487338598025, 0.07787297778777785], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 5.0059999999999985, 3, 17, 5.0, 6.0, 7.0, 11.990000000000009, 0.21551742717019584, 0.12369311242401933, 0.09092141458742636], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 20.874, 12, 589, 18.0, 23.0, 26.0, 88.99000000000001, 0.2140253371755162, 0.11134124742848557, 2.3549057362856844], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 53.053999999999974, 32, 77, 56.0, 67.0, 70.0, 73.0, 0.2154750751361587, 0.8961385324542093, 0.08964099805469102], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 3.3600000000000008, 2, 14, 3.0, 4.0, 5.0, 8.990000000000009, 0.21547953246112966, 0.1346136833112395, 0.09111585698795814], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 46.45800000000002, 27, 66, 48.0, 59.0, 61.0, 65.0, 0.21547572515123165, 0.884357407080403, 0.07827829077759586], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1203.5539999999999, 859, 1801, 1155.5, 1508.9000000000008, 1695.8, 1766.91, 0.21539710178891602, 0.9109715583204885, 0.10475366864343767], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 8.552000000000007, 5, 26, 8.0, 11.0, 12.0, 21.99000000000001, 0.21545483377228666, 0.32038596673183456, 0.11004187310830656], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 5.3260000000000005, 3, 31, 5.0, 6.0, 7.0, 13.0, 0.21419147003889719, 0.2066006414766788, 0.11713596017752188], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 11.809999999999999, 8, 33, 12.0, 15.0, 16.0, 23.0, 0.21547535371356688, 0.35113855224156854, 0.14077442542419555], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 612.0, 612, 612, 612.0, 612.0, 612.0, 612.0, 1.6339869281045751, 0.706890829248366, 1932.663462520425], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 5.914, 4, 19, 6.0, 7.0, 8.0, 17.0, 0.21419403923692087, 0.21517924814786415, 0.12571349373182564], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 12.151999999999989, 8, 49, 12.0, 15.0, 16.0, 23.0, 0.21547433226659174, 0.33851143853573123, 0.12814830893589294], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 9.374, 6, 22, 9.0, 11.0, 12.0, 18.0, 0.21547331082930077, 0.3334596781292004, 0.12309754573744233], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2332.1079999999984, 1971, 2975, 2280.5, 2699.5, 2821.9, 2963.99, 0.21527181295462716, 0.3287452855472963, 0.11856767822891574], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 18.488000000000017, 12, 153, 17.0, 22.0, 25.0, 75.98000000000002, 0.21401883280121117, 0.11133786369290352, 1.7255268394597651], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 17.075999999999993, 12, 34, 17.0, 21.0, 22.94999999999999, 29.0, 0.21547776808127822, 0.39007157565424433, 0.17970509173965973], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 12.016, 8, 30, 12.0, 15.0, 17.0, 24.0, 0.21547665375099603, 0.36481838806117123, 0.15445299204417098], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 75.0, 75, 75, 75.0, 75.0, 75.0, 75.0, 13.333333333333334, 6.2890625, 1818.4375], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 651.0, 651, 651, 651.0, 651.0, 651.0, 651.0, 1.5360983102918586, 0.7125456029185868, 2937.701012864823], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 3.4200000000000017, 2, 27, 3.0, 4.0, 5.0, 9.990000000000009, 0.21417724880756817, 0.18002392560660352, 0.09056518431023147], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 765.2779999999995, 539, 1002, 738.0, 934.0, 949.95, 971.0, 0.21412331704425885, 0.1885518908320104, 0.09911567605369014], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 4.496000000000004, 2, 16, 4.0, 5.0, 6.0, 11.990000000000009, 0.21418055163486158, 0.1940404683175561, 0.10458034747795976], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1045.0339999999997, 808, 1500, 980.5, 1309.9, 1329.85, 1367.0, 0.21410525414293669, 0.202556951997602, 0.11311615477668821], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 92.0, 92, 92, 92.0, 92.0, 92.0, 92.0, 10.869565217391305, 5.148182744565218, 715.7247792119565], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 36.94599999999996, 23, 1406, 34.0, 39.900000000000034, 43.0, 105.86000000000013, 0.21389139022986908, 0.11127156493100933, 9.756705896130063], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 47.366000000000014, 31, 557, 45.0, 54.0, 61.94999999999999, 171.6700000000003, 0.21410635433402647, 48.42456588531586, 0.06607188278276598], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 587.0, 587, 587, 587.0, 587.0, 587.0, 587.0, 1.7035775127768313, 0.8933800042589438, 0.6987329642248723], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 3.8939999999999997, 2, 17, 4.0, 5.0, 5.0, 9.0, 0.2154970849709316, 0.23416578263477078, 0.09238595732640524], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 4.790000000000002, 3, 13, 5.0, 6.0, 7.0, 10.990000000000009, 0.2154963419495954, 0.2211173451658783, 0.07933800870605222], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.709999999999999, 1, 15, 2.0, 4.0, 4.0, 8.990000000000009, 0.215519285096669, 0.12222090239110026, 0.08355581658532969], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 126.98799999999996, 82, 174, 131.0, 162.0, 167.0, 171.99, 0.2155092526742543, 0.19629651861504274, 0.0702930570246103], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 122.80199999999996, 82, 541, 120.0, 138.0, 151.69999999999993, 436.83000000000015, 0.21407124547935047, 0.11136513005791485, 63.29944572137943], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 266.56199999999995, 16, 530, 284.0, 486.0, 505.0, 525.98, 0.2154944844186713, 0.12010239961189444, 0.09028040411680663], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 583.3480000000006, 453, 761, 553.5, 703.0, 712.0, 743.8900000000001, 0.21547340368683612, 0.11588218568786866, 0.09174453516353569], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 10.424, 7, 405, 9.0, 11.0, 15.0, 39.88000000000011, 0.2138571750579232, 0.09642577763280638, 0.15517175885550483], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 539.2259999999998, 409, 696, 537.5, 643.8000000000001, 655.0, 682.97, 0.21545901172398668, 0.11082462506361428, 0.08668858674832276], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 4.948000000000007, 3, 18, 5.0, 6.0, 7.949999999999989, 13.970000000000027, 0.21417605614496807, 0.13149866040908484, 0.10708802807248403], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 5.653999999999992, 3, 44, 5.0, 7.0, 8.0, 15.990000000000009, 0.2141722947576191, 0.12543092469637865, 0.10102072106243165], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 938.0979999999994, 667, 1428, 898.5, 1170.7, 1345.9, 1401.98, 0.21409058600875203, 0.19563154515063413, 0.09429184989252652], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 328.42199999999997, 226, 444, 327.5, 396.0, 402.0, 413.0, 0.21413083651067807, 0.18960407302011414, 0.08803621305761275], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 6.828000000000002, 4, 85, 6.0, 8.0, 8.0, 14.0, 0.21419523209981153, 0.14280588565123276, 0.1001948400154392], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1590.194000000001, 1277, 14488, 1460.5, 1778.6000000000001, 1810.8, 5216.330000000031, 0.21408545263659082, 0.1609215954579202, 0.11833238885967812], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 172.08799999999997, 126, 230, 185.0, 205.0, 206.95, 211.0, 0.2155334992941278, 4.167282957766211, 0.10860867737868159], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 233.35199999999995, 175, 306, 227.0, 280.0, 283.0, 288.0, 0.215516219535166, 0.4177121055406634, 0.15406042255834132], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 10.792000000000002, 7, 40, 11.0, 13.0, 15.0, 19.0, 0.21545204856116812, 0.17583538232720097, 0.13297431122134595], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 10.54599999999999, 7, 28, 11.0, 13.0, 15.0, 22.970000000000027, 0.21545306979688378, 0.17920266999678114, 0.13634139573084053], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 11.838000000000003, 8, 27, 12.0, 14.0, 16.0, 21.980000000000018, 0.21544861356662684, 0.17435978569218685, 0.13149939792884938], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 14.580000000000004, 10, 28, 14.0, 18.0, 19.0, 25.0, 0.21545009895623046, 0.19266583019063457, 0.14980514693050398], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 11.373999999999986, 7, 49, 11.0, 13.0, 15.949999999999989, 44.74000000000024, 0.21542058067910044, 0.16171479938850714, 0.11885998836298023], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2651.7319999999972, 2245, 3332, 2603.5, 3032.0000000000005, 3162.95, 3286.9, 0.21521084421618705, 0.17985405638007612, 0.13702877971577535], "isController": false}]}, function(index, item){
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
