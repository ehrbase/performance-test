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

    var data = {"OkPercent": 97.78345032971708, "KoPercent": 2.2165496702829186};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9003190810465859, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.001, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.986, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.497, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.989, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.967, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.708, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.668, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 521, 2.2165496702829186, 186.396511380558, 1, 4002, 17.0, 551.9000000000015, 1235.9500000000007, 2185.9900000000016, 26.412308439128644, 174.07950650531617, 218.8291278923753], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 26.43400000000001, 17, 137, 27.5, 30.900000000000034, 32.0, 46.98000000000002, 0.573358989236905, 0.33295807584736725, 0.2900390199460125], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 7.817999999999999, 4, 39, 7.0, 10.0, 13.899999999999977, 25.0, 0.573064588963693, 6.139999804441709, 0.20818362020946657], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 7.976000000000009, 5, 33, 8.0, 10.0, 11.0, 19.980000000000018, 0.5730455422214225, 6.153296997828731, 0.24287281769931385], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 22.151999999999983, 14, 280, 20.0, 27.0, 33.0, 52.950000000000045, 0.568630907364339, 0.30701848690158706, 6.331571880633001], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 45.197999999999944, 27, 138, 46.0, 55.900000000000034, 58.0, 64.97000000000003, 0.5729063424169544, 2.3827555226739143, 0.23945694780708637], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.470000000000002, 1, 12, 2.0, 3.0, 4.0, 8.980000000000018, 0.5729431056037274, 0.3580894410023296, 0.24338891693127088], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 40.536, 24, 108, 41.0, 50.0, 52.0, 63.930000000000064, 0.5728984652050118, 2.351359926683319, 0.2092422128776117], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 777.2640000000001, 587, 1152, 773.5, 914.0, 940.8499999999999, 992.8900000000001, 0.5725651951359441, 2.421335715156831, 0.2795728491874727], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 11.84400000000001, 7, 159, 12.0, 14.0, 16.0, 29.99000000000001, 0.5724694845141279, 0.8512419975921933, 0.29350242125968473], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.685999999999998, 2, 96, 3.0, 5.0, 7.0, 16.970000000000027, 0.5696512594989347, 0.5495599266004352, 0.3126406326546888], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 18.645999999999997, 12, 65, 20.0, 23.0, 25.0, 39.930000000000064, 0.5728682712325032, 0.9333187777053418, 0.37538536132520467], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 654.0, 654, 654, 654.0, 654.0, 654.0, 654.0, 1.529051987767584, 0.6525348814984709, 1808.5504467698777], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.449999999999998, 2, 24, 4.0, 6.0, 7.0, 13.990000000000009, 0.5697109742285543, 0.5724604973092551, 0.3354840990818538], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 19.63399999999999, 12, 52, 21.0, 24.0, 26.0, 38.0, 0.5728564570661271, 0.9001230853705064, 0.3418118117845739], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 11.142, 7, 32, 12.0, 14.0, 15.0, 22.0, 0.5728518627996875, 0.886624757540449, 0.3283828549447427], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1897.3480000000002, 1486, 3885, 1882.5, 2122.0, 2189.95, 2303.95, 0.5714978043054358, 0.8727441195733426, 0.3158864816766374], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 19.949999999999978, 12, 228, 17.0, 26.0, 32.94999999999999, 70.93000000000006, 0.5685966352725511, 0.30699998251565347, 4.58542091218821], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 23.342000000000017, 15, 81, 24.0, 28.0, 30.0, 46.930000000000064, 0.5728964959358722, 1.037061265121603, 0.4789056645713932], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 18.555999999999983, 12, 51, 20.0, 24.0, 25.0, 31.0, 0.5728925574382078, 0.9698858400581372, 0.41176652565871186], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 99.0, 99, 99, 99.0, 99.0, 99.0, 99.0, 10.101010101010102, 4.705255681818182, 1377.62389520202], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 637.0, 637, 637, 637.0, 637.0, 637.0, 637.0, 1.5698587127158556, 0.719007554945055, 3002.268936420722], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.206000000000001, 1, 22, 2.0, 3.0, 4.0, 8.990000000000009, 0.5694300347010663, 0.4783690523744663, 0.24189654794430063], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 414.3379999999998, 315, 623, 417.5, 480.0, 490.0, 535.9300000000001, 0.5692361988683584, 0.5011913491040222, 0.2646058893177135], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.1140000000000008, 1, 21, 3.0, 4.0, 5.0, 12.990000000000009, 0.5695000814385116, 0.5159159077603498, 0.27918851648645787], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1175.9219999999993, 932, 1631, 1173.5, 1360.0, 1391.95, 1478.7800000000002, 0.5689045855985218, 0.5381870714015079, 0.3016749902148411], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 53.0, 53, 53, 53.0, 53.0, 53.0, 53.0, 18.867924528301884, 8.82591391509434, 1242.4270341981132], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 5, 1.0, 45.39600000000003, 11, 723, 43.0, 53.900000000000034, 61.0, 107.99000000000001, 0.5681385621776524, 0.30556644586434895, 25.987900637110585], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 44.178000000000004, 9, 189, 45.0, 54.0, 60.0, 101.90000000000009, 0.5689725607292863, 124.87300243513143, 0.17669265069522758], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 315.0, 315, 315, 315.0, 315.0, 315.0, 315.0, 3.1746031746031744, 1.6648065476190477, 1.3082837301587302], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.3100000000000005, 1, 74, 2.0, 3.0, 4.0, 7.990000000000009, 0.573102029354286, 0.6226854289525414, 0.246814448188711], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.1619999999999986, 2, 38, 3.0, 4.0, 6.0, 11.990000000000009, 0.5730954605108574, 0.5879466920930019, 0.2121124800132958], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.138000000000001, 1, 21, 2.0, 3.0, 4.0, 9.980000000000018, 0.5730764117164326, 0.32505632803868034, 0.22329832839341465], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 122.96200000000007, 84, 185, 123.0, 149.0, 153.0, 159.0, 0.5730173028304762, 0.5220299546227598, 0.18802130249125004], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 16, 3.2, 168.98999999999995, 29, 658, 170.0, 198.90000000000003, 217.0, 351.96000000000004, 0.5687292200561223, 0.30343925488509965, 168.24165560488333], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 2.3319999999999985, 1, 25, 2.0, 3.0, 4.0, 11.980000000000018, 0.5730915192770795, 0.31956568115938705, 0.24121332500822387], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 3.21, 2, 45, 3.0, 4.0, 5.0, 9.0, 0.5731486724730448, 0.3083058502574584, 0.2451553892023375], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 11.753999999999984, 7, 317, 10.0, 15.0, 19.0, 43.0, 0.5679578620702973, 0.23996885248089675, 0.4132115305101284], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 4.407999999999999, 2, 69, 4.0, 5.0, 6.0, 13.960000000000036, 0.5731040000366786, 0.2948496952376204, 0.23170415626482907], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.6519999999999984, 2, 34, 3.0, 5.0, 6.0, 11.990000000000009, 0.5694203073503051, 0.34970636774188407, 0.2858223027129461], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.0180000000000025, 2, 40, 4.0, 5.0, 7.0, 12.990000000000009, 0.5693963146392932, 0.33356615118269306, 0.2696847779297433], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 529.4419999999998, 383, 857, 532.0, 637.9000000000001, 648.95, 699.9000000000001, 0.5688929343497553, 0.5198103630959153, 0.2516684563090226], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 16.427999999999987, 7, 138, 15.0, 25.0, 32.0, 56.960000000000036, 0.5690891273245868, 0.5038728471358314, 0.2350827156819338], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 10.355999999999995, 6, 67, 10.0, 12.0, 14.0, 30.940000000000055, 0.5697194131890044, 0.37957889723686083, 0.2676123415467882], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 540.1879999999995, 382, 4002, 518.0, 614.9000000000001, 649.75, 773.9300000000001, 0.5695156497205387, 0.4280232684873323, 0.31590321195436133], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 173.12600000000023, 144, 404, 178.0, 190.0, 194.0, 228.87000000000012, 0.5732367238374759, 11.083509663338072, 0.28997717084747315], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 264.4820000000003, 213, 482, 267.0, 289.0, 295.9, 340.95000000000005, 0.5730113926125079, 1.110704243178013, 0.4107327755640438], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 18.74800000000001, 12, 42, 20.0, 23.0, 24.0, 29.0, 0.5724452341644475, 0.4669587830844723, 0.35442410005884734], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 18.254000000000005, 12, 36, 20.0, 23.0, 24.0, 27.99000000000001, 0.5724524435132552, 0.4760713536926045, 0.3633731330894686], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 18.68199999999997, 12, 69, 20.0, 23.0, 25.0, 38.98000000000002, 0.5724262285697931, 0.46335443558773864, 0.3504992630012307], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 21.146000000000015, 14, 64, 22.0, 26.0, 27.0, 32.98000000000002, 0.5724360588922218, 0.5120295201697845, 0.39913998637602177], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 18.64400000000002, 11, 41, 20.0, 22.0, 24.0, 36.98000000000002, 0.5721157641921897, 0.42945109997837405, 0.3167867561493863], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2156.951999999999, 1628, 2756, 2145.0, 2468.4, 2556.9, 2648.83, 0.5710311337594748, 0.4772169641358186, 0.36470152488153956], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["No results for path: $['rows'][1]", 500, 95.96928982725528, 2.1272069772388855], "isController": false}, {"data": ["500", 21, 4.030710172744722, 0.08934269304403318], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 23505, 521, "No results for path: $['rows'][1]", 500, "500", 21, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Query cross patient #1", 500, 500, "No results for path: $['rows'][1]", 500, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 5, "500", 5, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 16, "500", 16, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
