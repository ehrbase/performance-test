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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8619442671771963, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.459, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.998, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [0.5, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.998, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [0.967, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.596, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.709, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.288, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 494.6481599659633, 1, 27562, 14.0, 1231.0, 2352.0, 9637.980000000003, 9.987567061806915, 62.914338600140816, 82.64796975106717], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 9872.074000000002, 8358, 27562, 9623.0, 10501.1, 10932.1, 26429.830000000136, 0.21549699209298437, 0.12516671386050796, 0.10859028117185542], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 3.494, 2, 15, 3.0, 4.0, 5.0, 8.990000000000009, 0.21623968698872828, 0.11101500570980895, 0.0781334806502241], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 5.0859999999999985, 3, 18, 5.0, 6.0, 7.0, 11.0, 0.21623837772779309, 0.12410689157656374, 0.0912255656039127], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 20.54799999999999, 13, 610, 18.0, 24.0, 27.0, 60.960000000000036, 0.2147073688857246, 0.11169605710851009, 2.3624100832377524], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 53.82800000000002, 33, 76, 56.0, 68.0, 71.0, 74.0, 0.21619303097440792, 0.8991244364658406, 0.08993967890146268], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 3.451999999999999, 2, 16, 3.0, 4.0, 5.0, 9.990000000000009, 0.21619873333486114, 0.13506298017738674, 0.09141997220116688], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 47.19200000000002, 28, 79, 49.0, 61.0, 63.0, 68.98000000000002, 0.2161914418455831, 0.8872948579676275, 0.07853829723296574], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1219.1780000000015, 874, 1782, 1197.5, 1481.0, 1608.8, 1760.96, 0.21611640548278677, 0.9140136847069115, 0.1051034862601834], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 8.766000000000004, 6, 23, 8.0, 11.0, 12.949999999999989, 19.99000000000001, 0.21615256220762663, 0.3214235039054445, 0.11039823245565306], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 5.464000000000003, 3, 20, 5.0, 7.0, 7.0, 13.0, 0.2148994979517929, 0.2072835772675443, 0.11752316294238674], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 12.045999999999994, 8, 34, 12.0, 14.0, 16.0, 22.99000000000001, 0.2161911614135097, 0.352305032189783, 0.1412420771344121], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 644.0, 644, 644, 644.0, 644.0, 644.0, 644.0, 1.5527950310559004, 0.6717658190993788, 1836.6304954386646], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 6.003999999999997, 4, 29, 6.0, 7.0, 8.949999999999989, 15.0, 0.21490097577937062, 0.2158894363222621, 0.12612840472988454], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 12.181999999999988, 8, 31, 12.0, 15.0, 16.0, 21.99000000000001, 0.21619032012165462, 0.33963625965127636, 0.12857412593172624], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 9.547999999999996, 7, 26, 9.0, 11.900000000000034, 13.0, 20.0, 0.2161898527401199, 0.3345685757185502, 0.12350689829391615], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2368.9019999999978, 1973, 3014, 2321.5, 2758.8, 2907.85, 2986.99, 0.21596518295706438, 0.32979191039237415, 0.11894957342557062], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 18.272000000000002, 11, 86, 16.5, 22.0, 26.94999999999999, 76.0, 0.2147022980875178, 0.11169341915449375, 1.7310372783306123], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 17.159999999999993, 12, 34, 17.0, 21.0, 22.0, 29.0, 0.21619275053821185, 0.3913658824220592, 0.18030137593714152], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 12.103999999999994, 8, 26, 12.0, 15.0, 16.0, 22.99000000000001, 0.21619228314616845, 0.366030003138031, 0.15496595295828874], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 99.0, 99, 99, 99.0, 99.0, 99.0, 99.0, 10.101010101010102, 4.764441287878788, 1377.6041666666665], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 633.0, 633, 633, 633.0, 633.0, 633.0, 633.0, 1.5797788309636651, 0.7328075631911533, 3021.237534557662], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 3.5259999999999994, 2, 27, 3.0, 4.0, 5.0, 11.990000000000009, 0.21488730664977368, 0.18062075557277998, 0.09086543337827344], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 770.4359999999991, 584, 1074, 742.5, 943.0, 957.95, 975.99, 0.21483126293284202, 0.1891874592894757, 0.09944337756852259], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 4.6160000000000005, 3, 19, 4.0, 6.0, 6.0, 14.0, 0.21489201676157732, 0.194685032099495, 0.10492774255936392], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1049.606, 780, 1362, 1004.0, 1311.8000000000002, 1325.95, 1355.98, 0.21481418787562948, 0.20321548040722756, 0.11349069886788628], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 94.0, 94, 94, 94.0, 94.0, 94.0, 94.0, 10.638297872340425, 5.038646941489362, 700.4965924202128], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 37.512000000000015, 25, 1539, 34.0, 40.0, 44.0, 97.0, 0.21456179401123704, 0.111620325476295, 9.787286521743049], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 47.607999999999976, 31, 837, 45.0, 53.0, 59.94999999999999, 190.95000000000005, 0.21479167140998273, 48.57956447001551, 0.06628336734917437], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 625.0, 625, 625, 625.0, 625.0, 625.0, 625.0, 1.6, 0.8390625, 0.65625], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 4.0420000000000025, 2, 13, 4.0, 5.0, 5.0, 9.0, 0.21621696421003833, 0.23494802563100756, 0.09269457742988949], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 4.892000000000003, 3, 12, 5.0, 6.0, 7.0, 9.990000000000009, 0.2162162162162162, 0.22186824324324325, 0.07960304054054054], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.7640000000000007, 1, 18, 2.0, 4.0, 4.949999999999989, 9.0, 0.21624034162514133, 0.12262981326673418, 0.08383536682146592], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 127.86000000000008, 84, 176, 129.0, 164.0, 168.0, 173.0, 0.21623033547271628, 0.19695331660034882, 0.07052825395301487], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 123.35800000000002, 83, 713, 121.5, 140.0, 148.95, 431.98, 0.2147547693812958, 0.11172071601280281, 63.501559200158745], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 268.9359999999999, 15, 528, 289.0, 491.0, 504.0, 522.0, 0.21621387876887818, 0.12050334253143209, 0.09058179100766478], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 581.9539999999997, 432, 764, 565.0, 698.9000000000001, 711.0, 736.99, 0.21619677019321074, 0.11627121417295222, 0.092052531058828], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 10.652000000000003, 6, 403, 9.0, 12.0, 16.0, 42.91000000000008, 0.2145276401702148, 0.09672808275682604, 0.15565823891256797], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 540.6859999999998, 409, 728, 531.5, 641.0, 658.0, 689.95, 0.216177981926656, 0.11119443834041892, 0.086977859915803], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 5.121999999999996, 3, 19, 5.0, 6.0, 8.0, 12.980000000000018, 0.21488573665838925, 0.13193438622509365, 0.10744286832919463], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 5.647999999999998, 4, 42, 5.0, 7.0, 7.0, 12.990000000000009, 0.21488222734883464, 0.12584669976891563, 0.10135558184520227], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 937.1099999999994, 677, 1431, 891.0, 1183.8000000000002, 1311.0, 1406.98, 0.21480219081050453, 0.1962817948860324, 0.09460526177298588], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 328.5039999999999, 229, 480, 327.0, 395.0, 400.0, 446.61000000000035, 0.2148420631541135, 0.19023383504147096, 0.08832862166785331], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 6.808000000000003, 4, 63, 7.0, 8.0, 9.0, 19.980000000000018, 0.21490189943192833, 0.14327702711051932, 0.10052540022255241], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1583.6779999999978, 1272, 14485, 1456.0, 1736.9, 1804.8, 5516.610000000033, 0.21478595076504609, 0.16146030444190235, 0.11871957825489853], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 171.20399999999992, 129, 214, 174.0, 205.0, 207.0, 211.99, 0.2162560540882342, 4.181241113903577, 0.10897277725539926], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 233.96999999999986, 178, 393, 235.0, 281.0, 285.0, 295.98, 0.21623239273684042, 0.41910018768431107, 0.15457237449547576], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 10.909999999999997, 7, 29, 11.0, 13.0, 15.0, 19.0, 0.21615031957824749, 0.1764052573972043, 0.13340527536469962], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 10.739999999999993, 7, 24, 11.0, 13.0, 14.0, 20.980000000000018, 0.21615116055881126, 0.17978330562455583, 0.13678315629112275], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 12.36, 8, 33, 13.0, 15.0, 16.0, 23.99000000000001, 0.21614695572143153, 0.17492494499600345, 0.13192563215419406], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 15.033999999999999, 10, 32, 15.0, 18.0, 20.0, 27.99000000000001, 0.21614845075597922, 0.19329032992359152, 0.1502907196662668], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 11.753999999999992, 7, 72, 11.0, 14.0, 15.949999999999989, 66.65000000000032, 0.21612976431049202, 0.16224717883117024, 0.11925128597209764], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2642.630000000002, 2207, 3324, 2594.0, 3079.2000000000003, 3167.8, 3276.0, 0.21592200206335063, 0.18044837877123973, 0.13748158725127405], "isController": false}]}, function(index, item){
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
