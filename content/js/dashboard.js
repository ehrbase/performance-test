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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.878557753669432, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.363, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.813, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.348, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [0.5, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.939, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.525, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.499, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [0.941, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [0.868, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 286.5126143373742, 1, 7678, 26.0, 809.9000000000015, 1844.9500000000007, 3720.0, 17.016849613184313, 114.62208537582586, 140.9533940782558], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 36.52400000000002, 14, 134, 33.0, 57.900000000000034, 64.0, 79.98000000000002, 0.36924240320679647, 0.21444545860460343, 0.18606355474092476], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 15.53600000000002, 4, 95, 13.0, 27.0, 35.94999999999999, 65.90000000000009, 0.3689876234171353, 3.9468235043178934, 0.13332560611751962], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 15.729999999999999, 5, 56, 14.0, 27.0, 31.0, 41.99000000000001, 0.3689750978706447, 3.9620538802804948, 0.15566136941417824], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 71.96199999999993, 15, 695, 69.0, 128.0, 148.0, 179.99, 0.3659871992317197, 0.1975437352415662, 4.07446686644688], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 66.26399999999995, 26, 172, 54.0, 112.90000000000003, 124.94999999999999, 155.99, 0.3687552224958386, 1.533614798432864, 0.15340793435862035], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 7.417999999999997, 1, 40, 6.0, 15.0, 16.0, 20.0, 0.3687840525974567, 0.2303855920772647, 0.15594091286591674], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 59.830000000000005, 23, 136, 50.5, 98.90000000000003, 110.94999999999999, 128.0, 0.36873890556817873, 1.5133815291215238, 0.13395593053843993], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1215.8799999999999, 583, 2654, 917.0, 2314.9, 2394.9, 2575.71, 0.3686279887435757, 1.5590048018864169, 0.1792741585881843], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 18.485999999999983, 6, 70, 17.0, 30.900000000000034, 36.0, 43.98000000000002, 0.369052443090268, 0.5487889117363106, 0.18849065208614277], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 10.841999999999995, 2, 48, 8.0, 22.0, 24.0, 32.99000000000001, 0.36697570914386035, 0.3539702907016429, 0.20068984093804862], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 28.216000000000008, 9, 72, 24.0, 48.0, 52.0, 62.99000000000001, 0.3687212305259882, 0.6008679732334197, 0.24089306955262316], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 946.0, 946, 946, 946.0, 946.0, 946.0, 946.0, 1.0570824524312896, 0.4511181950317125, 1250.3065952034885], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 10.639999999999999, 2, 47, 8.0, 21.0, 24.0, 31.980000000000018, 0.36698163477106954, 0.3686696069388154, 0.21538668212637968], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 29.669999999999984, 11, 100, 25.0, 49.0, 55.94999999999999, 68.0, 0.3687155204898902, 0.5792542431321204, 0.21928491404135073], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 18.95199999999999, 6, 67, 17.0, 32.0, 36.0, 48.0, 0.36871470478488444, 0.5706112107613811, 0.21064267802652092], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2894.1820000000007, 1534, 5978, 2557.0, 4437.3, 4941.2, 5586.6900000000005, 0.3682408471896227, 0.5623260694910985, 0.20282015411615936], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 69.81199999999994, 12, 235, 61.0, 129.0, 151.95, 183.92000000000007, 0.3659454126546851, 0.19752118069176855, 2.9504348895283985], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 34.12999999999997, 13, 85, 31.0, 56.0, 63.0, 75.0, 0.36873673008692603, 0.6675107069623395, 0.3075206713810887], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 27.751999999999995, 9, 74, 23.0, 47.0, 52.0, 64.0, 0.368733738842117, 0.6242943069999676, 0.2643071917090956], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 173.0, 173, 173, 173.0, 173.0, 173.0, 173.0, 5.780346820809248, 2.692602962427746, 788.3399566473989], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 918.0, 918, 918, 918.0, 918.0, 918.0, 918.0, 1.0893246187363836, 0.49891918572984745, 2083.2716333061003], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 8.657999999999994, 1, 72, 6.0, 19.0, 24.0, 31.980000000000018, 0.3668061018928662, 0.3083141405861415, 0.15510453331993268], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 614.8039999999996, 318, 1373, 474.0, 1221.8000000000002, 1259.85, 1342.8300000000002, 0.3666562780721213, 0.3228687817386841, 0.16972175371697804], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 10.442, 2, 74, 8.0, 20.0, 24.94999999999999, 39.98000000000002, 0.3667773111555319, 0.3322880657540025, 0.17909048396266208], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1672.0520000000004, 930, 3742, 1328.5, 3164.7000000000003, 3495.9, 3697.94, 0.36653962403297685, 0.3467486320283057, 0.19365032871273485], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 103.0, 103, 103, 103.0, 103.0, 103.0, 103.0, 9.70873786407767, 4.541489684466019, 639.2881523058253], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 101.19200000000006, 28, 1040, 92.0, 164.0, 176.0, 201.98000000000002, 0.36567028826520165, 0.19737268069048788, 16.725844689224136], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 121.058, 30, 460, 114.0, 214.90000000000003, 232.0, 279.0, 0.366288290862206, 82.8894341338106, 0.11303427725825888], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 617.0, 617, 617, 617.0, 617.0, 617.0, 617.0, 1.6207455429497568, 0.8499417544570502, 0.6647589141004863], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 9.391999999999998, 1, 40, 8.0, 20.0, 21.94999999999999, 32.0, 0.36898844033014133, 0.4009542260153824, 0.1581893801805977], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 11.008000000000001, 2, 63, 10.0, 20.0, 24.0, 39.97000000000003, 0.36898462810039334, 0.3786092173743792, 0.13584687968149248], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 6.706000000000002, 1, 29, 6.0, 13.0, 16.0, 19.980000000000018, 0.3689993328492062, 0.20925937751842044, 0.1430593116612645], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 197.8540000000002, 92, 460, 145.5, 370.80000000000007, 393.9, 438.9200000000001, 0.3689456934076046, 0.3360540407209051, 0.12033970859193352], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 317.36400000000015, 115, 947, 276.0, 508.0, 547.95, 666.8900000000001, 0.3661171736047092, 0.19761388967095586, 108.30418163475711], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 7.250000000000002, 1, 33, 6.0, 13.900000000000034, 17.899999999999977, 25.99000000000001, 0.36897918219454057, 0.20564463776391237, 0.15458209879048626], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 10.318000000000001, 2, 40, 8.0, 20.0, 24.0, 31.99000000000001, 0.36901703456434953, 0.1984583702196611, 0.15712053424810196], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 59.025999999999975, 7, 424, 54.0, 118.0, 136.0, 160.99, 0.3655638822884299, 0.15447572998537745, 0.26524801224639005], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 12.009999999999998, 3, 96, 11.0, 22.0, 25.94999999999999, 32.99000000000001, 0.3689911633996189, 0.1897962262443489, 0.14846128839906542], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 9.75400000000001, 2, 47, 8.0, 20.0, 23.0, 28.99000000000001, 0.3668001819328902, 0.2252059984209252, 0.1834000909664451], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 11.681999999999992, 2, 67, 9.0, 22.0, 28.0, 37.0, 0.36678242319942844, 0.21480770216496994, 0.17300381875519916], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 826.6680000000001, 379, 1805, 635.0, 1602.8000000000004, 1665.6999999999998, 1748.8600000000001, 0.3663057334173394, 0.33472259552337763, 0.16133191969845712], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 31.840000000000003, 7, 413, 28.0, 55.0, 64.0, 93.95000000000005, 0.36640961810591144, 0.3244406883132919, 0.15064301681893427], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 16.809999999999974, 5, 66, 15.0, 29.0, 33.0, 46.99000000000001, 0.36698648315385246, 0.24467318546285802, 0.1716665287409134], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 840.5200000000001, 455, 7678, 785.0, 996.0, 1067.8, 2832.190000000014, 0.3668289762610296, 0.2757343079276144, 0.20275898492553007], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 264.4399999999998, 143, 611, 195.0, 504.90000000000003, 529.0, 568.99, 0.36909003803841933, 7.136236940441048, 0.18598677698029722], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 397.95200000000006, 207, 848, 315.5, 700.7, 743.0, 801.95, 0.36896338997659295, 0.715122392305121, 0.26375117330358017], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 27.45, 10, 110, 22.0, 48.0, 52.0, 64.0, 0.3690303800570078, 0.30117419816156443, 0.2277609376914345], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 27.469999999999988, 9, 72, 23.0, 48.0, 52.94999999999999, 62.99000000000001, 0.36904427128887235, 0.3069518518549272, 0.23353582792498953], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 27.990000000000023, 9, 75, 22.0, 51.0, 56.0, 67.99000000000001, 0.36900940900191076, 0.29863455794333343, 0.22522546936151777], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 30.46199999999999, 11, 125, 26.0, 52.0, 56.0, 69.98000000000002, 0.3690235710115748, 0.32999860762793864, 0.2565867017189856], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 29.376000000000015, 9, 121, 24.0, 52.0, 56.0, 68.98000000000002, 0.3689029563882925, 0.2769329996144964, 0.20354508824158718], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 3130.0699999999993, 1685, 6928, 2746.5, 4712.9, 5307.9, 6497.510000000001, 0.36847803097131543, 0.3079202498852191, 0.23461687128251726], "isController": false}]}, function(index, item){
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
