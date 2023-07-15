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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8897468623697086, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.156, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.617, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.935, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.497, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.113, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 326.68891725164747, 1, 18273, 9.0, 849.9000000000015, 1515.0, 6105.0, 15.167872632459957, 95.54635013586878, 125.51544042286454], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6227.6779999999935, 5223, 18273, 6092.5, 6584.9, 6801.549999999999, 15290.230000000072, 0.3269878079325934, 0.1899051945855397, 0.1647712000910334], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.432000000000001, 1, 20, 2.0, 3.0, 4.0, 7.0, 0.32811520781176684, 0.16845063076047262, 0.11855725282261108], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.666000000000003, 2, 15, 4.0, 5.0, 5.0, 8.0, 0.3281126240019634, 0.18831549829315813, 0.13842251325082833], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 13.486000000000004, 8, 354, 11.0, 15.0, 18.0, 70.97000000000003, 0.3261957357083862, 0.16969504918868597, 3.589108744361707], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 34.04800000000004, 24, 49, 34.0, 40.0, 42.0, 44.99000000000001, 0.3280568666894994, 1.3643545495500373, 0.1364767824313738], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.32, 1, 11, 2.0, 3.0, 4.0, 7.0, 0.3280659071284785, 0.2049482826651943, 0.138723181432257], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 29.891999999999992, 21, 50, 30.0, 35.0, 36.0, 39.99000000000001, 0.32805492951739834, 1.3464059890938138, 0.11917620486374239], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 876.4540000000003, 671, 1104, 875.5, 1038.5000000000002, 1072.95, 1087.99, 0.327908631538908, 1.3867941305584612, 0.15947118994763299], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 5.571999999999998, 3, 15, 5.0, 7.0, 8.0, 12.0, 0.3279991918099914, 0.48774184507909374, 0.16752302472326708], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.8319999999999994, 2, 16, 4.0, 5.0, 5.0, 9.0, 0.3263669225818495, 0.3148006573274596, 0.17848191078694897], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 7.812, 5, 26, 8.0, 10.0, 10.949999999999989, 14.990000000000009, 0.3280568666894994, 0.5346013418099947, 0.2143262146633546], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 440.0, 440, 440, 440.0, 440.0, 440.0, 440.0, 2.2727272727272725, 0.9832208806818182, 2688.1591796875], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.165999999999998, 2, 19, 4.0, 5.0, 6.0, 10.990000000000009, 0.32636990503941243, 0.3278710791143496, 0.1915510868444208], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 8.058, 5, 17, 8.0, 10.0, 10.949999999999989, 14.0, 0.32805514475761316, 0.5153765546123241, 0.19510310855213517], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.630000000000001, 4, 23, 6.0, 8.0, 10.0, 12.0, 0.32805449903781614, 0.5076867628615407, 0.18741394720422114], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1581.3480000000009, 1351, 1946, 1555.0, 1778.8000000000002, 1860.0, 1923.98, 0.32768921430612463, 0.5004012708033497, 0.18048507506704523], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 11.624000000000002, 8, 53, 11.0, 14.0, 18.0, 33.99000000000001, 0.3261867980460106, 0.16969039959676788, 2.6298810592459603], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 11.063999999999995, 8, 22, 11.0, 13.0, 14.0, 19.99000000000001, 0.3280600953605085, 0.5938752728229768, 0.27359699359167405], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 7.842000000000001, 5, 17, 8.0, 10.0, 11.0, 14.0, 0.3280594496212225, 0.5554296371121189, 0.23515198830271225], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 61.0, 61, 61, 61.0, 61.0, 61.0, 61.0, 16.393442622950822, 7.7324538934426235, 2235.78381147541], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 455.0, 455, 455, 455.0, 455.0, 455.0, 455.0, 2.197802197802198, 1.0194883241758241, 4203.172218406593], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.318, 1, 18, 2.0, 3.0, 4.0, 7.990000000000009, 0.32640442029922145, 0.2743550279255302, 0.1380206191304325], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 560.1999999999996, 432, 706, 550.0, 651.9000000000001, 670.95, 690.98, 0.3262789645993849, 0.287313481610265, 0.15103147384776214], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.246, 1, 14, 3.0, 4.0, 5.0, 8.990000000000009, 0.32638013102203983, 0.29568956186568024, 0.15936529835060537], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 766.6999999999996, 620, 956, 744.5, 892.0, 910.0, 926.99, 0.32622702138418125, 0.3086126737158889, 0.1723523618836348], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 53.0, 53, 53, 53.0, 53.0, 53.0, 53.0, 18.867924528301884, 8.936468160377359, 1242.3901827830189], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 23.481999999999996, 15, 622, 21.0, 27.0, 34.94999999999999, 67.99000000000001, 0.3260557685786577, 0.1696222348432976, 14.873110303036231], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 29.654000000000018, 20, 248, 28.0, 34.0, 40.0, 107.99000000000001, 0.32632070145897984, 73.80415381269029, 0.10070052896585707], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 469.0, 469, 469, 469.0, 469.0, 469.0, 469.0, 2.1321961620469083, 1.1181536513859276, 0.8745335820895523], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.682, 1, 9, 3.0, 3.0, 4.0, 6.0, 0.3280616020953951, 0.3564818606128584, 0.14064359699206877], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.3479999999999994, 2, 13, 3.0, 4.0, 5.0, 7.0, 0.3280594496212225, 0.33661654717921363, 0.12077969971406338], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.8260000000000023, 1, 21, 2.0, 2.0, 3.0, 5.990000000000009, 0.32811628441119534, 0.18607461671916528, 0.12720914542113726], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 92.204, 67, 126, 92.0, 112.0, 115.0, 118.99000000000001, 0.3280917396998879, 0.2988422329448071, 0.10701429790992438], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 82.124, 57, 386, 80.0, 91.0, 99.94999999999999, 313.97, 0.3262559712999147, 0.16972638522575934, 96.47172416982536], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 202.6000000000001, 12, 367, 261.0, 333.90000000000003, 338.0, 354.93000000000006, 0.32805557523889006, 0.1828365208443232, 0.13743734548582406], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 435.38399999999996, 332, 547, 424.0, 507.0, 517.95, 532.99, 0.3280080138917954, 0.17640360676792055, 0.139659662164866], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 7.2899999999999965, 5, 307, 6.0, 8.0, 10.0, 25.0, 0.32599348143434526, 0.1469867678838394, 0.23653628584542824], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 401.94, 297, 497, 395.0, 465.0, 473.9, 491.99, 0.3279948885276572, 0.16870916771133038, 0.13196669343104958], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.5280000000000022, 2, 16, 3.0, 4.900000000000034, 5.0, 8.990000000000009, 0.32640143721080833, 0.20040219491094463, 0.16320071860540417], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.242, 2, 50, 4.0, 5.0, 5.0, 9.0, 0.326391422955631, 0.19115253931711082, 0.15395220438239235], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 680.5759999999999, 532, 859, 680.0, 791.8000000000001, 835.9, 853.98, 0.32623830272565574, 0.2981098068783431, 0.14368503371999097], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 244.82, 175, 320, 239.0, 289.0, 296.0, 306.0, 0.3263200625490296, 0.2889430311658502, 0.13416088509095844], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.4939999999999936, 3, 56, 4.0, 5.0, 7.0, 11.970000000000027, 0.3263733136290885, 0.21759602045675291, 0.1526687668245443], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 974.0220000000004, 822, 8345, 921.0, 1077.0, 1112.85, 1141.95, 0.3262033969516945, 0.2451972819020398, 0.18030383073697176], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 134.77799999999996, 117, 169, 135.0, 150.0, 152.0, 157.0, 0.32807731601260076, 6.343269177062344, 0.1653202100219746], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 182.872, 160, 226, 180.0, 203.0, 205.0, 216.0, 0.3280538533205611, 0.6358318000232918, 0.23450724670961984], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 7.056000000000003, 5, 17, 7.0, 9.0, 10.0, 14.990000000000009, 0.3279933824055166, 0.26768295860362723, 0.20243341570340476], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 6.852000000000005, 5, 30, 6.0, 9.0, 9.949999999999989, 12.990000000000009, 0.3279942430450461, 0.2728085710389611, 0.20755885692694323], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.32399999999999, 6, 17, 8.0, 10.0, 11.0, 14.0, 0.32799144598308877, 0.26543924921938034, 0.20019009154241257], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 9.665999999999993, 7, 22, 9.0, 12.0, 12.949999999999989, 17.0, 0.3279918762972079, 0.2933060947696447, 0.22805685148790233], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 7.602000000000004, 5, 29, 7.0, 9.0, 10.0, 13.990000000000009, 0.3279875732068263, 0.24621809316388618, 0.1809697059197821], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1632.9360000000001, 1421, 2022, 1612.0, 1841.8000000000002, 1920.95, 1970.0, 0.32766924280225357, 0.2738182107014809, 0.20863315069049737], "isController": false}]}, function(index, item){
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
