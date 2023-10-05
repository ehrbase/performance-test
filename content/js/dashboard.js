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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8726653903424804, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.761, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.799, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.456, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 463.29210806211285, 1, 20217, 11.0, 1008.0, 1879.9500000000007, 10367.990000000002, 10.707779437510164, 67.45109610812877, 88.60778862117922], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 10504.878000000008, 9087, 20217, 10351.5, 11183.300000000001, 11569.25, 19218.810000000063, 0.23046455662537205, 0.13387334996019878, 0.11613253048700388], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.823999999999999, 2, 10, 3.0, 4.0, 5.0, 7.0, 0.2314027402712503, 0.11879954549609276, 0.08361231826207285], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 4.146000000000006, 2, 14, 4.0, 5.0, 6.0, 8.990000000000009, 0.23140145514491053, 0.132809520706265, 0.09762248888925913], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 16.32999999999999, 10, 451, 14.0, 19.0, 22.94999999999999, 74.97000000000003, 0.23014461827523178, 0.11972689414199095, 2.532265052838903], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 42.481999999999985, 26, 62, 44.0, 55.0, 56.0, 59.0, 0.23133464823947394, 0.9620968552772754, 0.09623882827149989], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.6279999999999992, 1, 12, 2.0, 4.0, 4.0, 7.0, 0.2313405351184186, 0.14452231808652694, 0.09782270674440943], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 37.329999999999984, 23, 59, 39.0, 48.0, 49.0, 52.99000000000001, 0.23133389902182772, 0.9494426667558844, 0.08403926800402335], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1015.7900000000006, 743, 1461, 976.5, 1249.8000000000002, 1382.6499999999999, 1443.99, 0.2312568625473961, 0.9780336007838221, 0.11246671635605787], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 6.702000000000003, 4, 16, 6.0, 9.0, 10.0, 13.0, 0.23129120163643152, 0.3439349859802838, 0.1181301742732946], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 4.366000000000002, 3, 18, 4.0, 5.0, 6.0, 10.0, 0.2302645970484684, 0.22210414565502218, 0.12592595151088115], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 9.387999999999993, 6, 19, 9.0, 12.0, 13.0, 17.0, 0.23133422011451044, 0.37698215473367647, 0.15113534497715575], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 493.0, 493, 493, 493.0, 493.0, 493.0, 493.0, 2.028397565922921, 0.8775196501014199, 2399.1684362322517], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 5.055999999999997, 3, 25, 5.0, 6.0, 8.0, 13.0, 0.23026565748904512, 0.23132478956597224, 0.135146152491129], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 9.577999999999994, 6, 19, 9.0, 12.0, 13.0, 17.0, 0.23133282871932295, 0.36342522938384964, 0.13757977801764423], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 7.451999999999995, 5, 17, 7.0, 9.0, 10.0, 13.0, 0.2313322935717845, 0.35800253803334237, 0.13215760912059954], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2051.546000000004, 1638, 2673, 2015.0, 2421.8, 2544.85, 2627.8500000000004, 0.23110977991877876, 0.3529186269109312, 0.12729093347088988], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 14.073999999999995, 9, 98, 13.0, 17.0, 19.0, 41.960000000000036, 0.2301395335992212, 0.11972424896839955, 1.8554999896437212], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 13.899999999999997, 9, 30, 14.0, 17.0, 19.0, 22.99000000000001, 0.23133614668932528, 0.4187794223432316, 0.19293073171160527], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 9.431999999999995, 6, 20, 9.0, 12.0, 13.0, 16.99000000000001, 0.23133529042989037, 0.39166826794063014, 0.16582041325736285], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 53.0, 53, 53, 53.0, 53.0, 53.0, 53.0, 18.867924528301884, 8.89961674528302, 2573.260613207547], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 585.0, 585, 585, 585.0, 585.0, 585.0, 585.0, 1.7094017094017093, 0.7929353632478633, 3269.1339476495727], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.799999999999999, 1, 21, 3.0, 4.0, 4.0, 7.990000000000009, 0.23026682398496082, 0.1935478106172809, 0.09736868631395316], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 699.4559999999999, 523, 905, 701.0, 824.9000000000001, 848.95, 884.99, 0.23021020954654114, 0.2027176250490348, 0.1065621477783794], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.6820000000000013, 2, 12, 3.0, 5.0, 5.0, 9.980000000000018, 0.23026586957833253, 0.20861323229151846, 0.1124345066300452], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 956.5900000000005, 753, 1250, 924.0, 1141.0, 1167.85, 1192.99, 0.23018212470070568, 0.2177536386902545, 0.12160989205379079], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 56.0, 56, 56, 56.0, 56.0, 56.0, 56.0, 17.857142857142858, 8.457728794642858, 1175.8335658482142], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 30.584000000000046, 20, 1346, 27.0, 33.0, 37.0, 72.95000000000005, 0.22999810021569222, 0.11965067184170058, 10.491417247143538], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 39.26199999999996, 26, 280, 38.0, 45.0, 49.0, 120.97000000000003, 0.23022526160496476, 52.07018905968981, 0.07104607682340709], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 455.0, 455, 455, 455.0, 455.0, 455.0, 455.0, 2.197802197802198, 1.152558379120879, 0.9014423076923077], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 3.2079999999999997, 2, 9, 3.0, 4.0, 5.0, 6.990000000000009, 0.23137447078874168, 0.25141864003060627, 0.09919276628540782], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.9220000000000024, 2, 10, 4.0, 5.0, 5.0, 7.990000000000009, 0.23137404251636856, 0.23740919942614608, 0.08518360744987397], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.1500000000000004, 1, 13, 2.0, 3.0, 4.0, 6.0, 0.23140348993487378, 0.13122882875007869, 0.0897140483438915], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 125.99799999999992, 89, 167, 126.0, 154.0, 158.0, 166.0, 0.2313922454905122, 0.21076353641743717, 0.07547364257210067], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 101.40600000000005, 69, 428, 99.0, 116.0, 122.94999999999999, 390.4400000000005, 0.23018445601198065, 0.11974761871302951, 68.06401507408948], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 252.93000000000004, 15, 448, 316.0, 412.0, 421.0, 430.99, 0.23137211531030935, 0.12895154289916663, 0.09693226315246357], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 497.76600000000013, 351, 685, 484.0, 604.8000000000001, 618.0, 652.9300000000001, 0.2313566988175359, 0.12442426524004414, 0.09850734441840396], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 8.316, 5, 293, 7.0, 9.0, 12.0, 28.960000000000036, 0.22996911514783563, 0.10369046890127656, 0.16686235601058777], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 459.5580000000002, 297, 609, 466.5, 549.0, 560.0, 587.99, 0.23133871550566248, 0.11899259262108153, 0.09307768631673138], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 4.019999999999998, 2, 16, 4.0, 5.0, 6.0, 10.0, 0.2302655514445479, 0.14137720200068526, 0.11513277572227396], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.561999999999992, 3, 28, 4.0, 5.0, 6.0, 10.0, 0.23026290036386143, 0.13485445700899545, 0.10861033288646979], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 771.721999999999, 545, 1149, 738.0, 979.5000000000002, 1101.95, 1135.99, 0.23018996657181306, 0.21034282580167107, 0.10138249504285907], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 278.2719999999998, 189, 385, 272.5, 340.90000000000003, 348.0, 371.0, 0.23022928995445144, 0.20385859325644595, 0.09465481549885162], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 5.317999999999999, 3, 49, 5.0, 7.0, 8.0, 12.0, 0.23026714212226174, 0.15352117245926689, 0.1077128526138314], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1257.4879999999998, 950, 10438, 1173.0, 1495.8000000000002, 1512.9, 1530.0, 0.23017046885264164, 0.17301221834039726, 0.12722313024472184], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 166.5780000000001, 143, 215, 169.5, 185.0, 187.0, 190.0, 0.23141087973622862, 4.47425478392819, 0.11660938861708395], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 226.53799999999978, 195, 304, 224.0, 253.0, 255.0, 265.99, 0.2313951368146886, 0.448488517565899, 0.16541136733237505], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 8.479999999999999, 5, 20, 8.0, 11.0, 12.0, 16.0, 0.23128938279965622, 0.18876059580029367, 0.14274891594666284], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 8.271999999999998, 5, 19, 8.0, 11.0, 12.0, 15.990000000000009, 0.23129013172898163, 0.19237511532704196, 0.1463632864847462], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 9.400000000000007, 6, 21, 9.0, 12.0, 13.0, 16.99000000000001, 0.23128617315748182, 0.18717691851302418, 0.1411658771713146], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 11.688000000000004, 7, 24, 11.0, 15.0, 16.0, 20.0, 0.2312873500159357, 0.206828261018645, 0.1608169855579553], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 8.810000000000004, 6, 40, 9.0, 11.0, 12.0, 17.99000000000001, 0.2312807169702226, 0.17362089838103498, 0.12761094246892166], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2069.4000000000005, 1624, 2736, 2025.5, 2498.8, 2655.85, 2720.9300000000003, 0.23109770949816208, 0.19311779394010964, 0.14714424471953289], "isController": false}]}, function(index, item){
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
