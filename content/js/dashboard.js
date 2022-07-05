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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8891299723463093, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.472, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.85, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.358, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [0.988, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.997, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.624, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.532, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [0.992, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [0.978, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 225.6402467560091, 1, 6670, 15.0, 653.9000000000015, 1509.9500000000007, 2784.980000000003, 21.8458512864934, 147.16377314034924, 180.9528176692786], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 25.822000000000003, 12, 111, 22.0, 39.0, 52.0, 98.83000000000015, 0.4732975015571488, 0.2748776925303242, 0.23849756914403203], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 8.28000000000001, 4, 52, 7.0, 13.0, 16.0, 27.0, 0.47318597060379475, 5.076132073775371, 0.1709753995345743], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 8.639999999999995, 4, 40, 8.0, 12.0, 15.0, 24.99000000000001, 0.47317074555621697, 5.080906541621045, 0.199618908281529], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 27.491999999999983, 14, 247, 22.0, 42.0, 56.0, 85.95000000000005, 0.47053819217344417, 0.2539757462853362, 5.238413467555921], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 53.77799999999996, 24, 207, 48.0, 78.90000000000003, 106.0, 182.0, 0.4730731494088005, 1.9674622579284693, 0.1968058219220205], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 3.2299999999999964, 1, 34, 2.0, 4.0, 7.0, 20.970000000000027, 0.47309597792723407, 0.2955510039451474, 0.20004937347899646], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 47.364000000000004, 23, 226, 41.0, 73.7000000000001, 99.0, 158.8800000000001, 0.4730718066233837, 1.941585558998204, 0.17185811724990113], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 928.7420000000002, 584, 3358, 864.5, 1227.8000000000004, 1551.0499999999997, 2135.4200000000005, 0.472831570774848, 1.9997035272171308, 0.22995129125573663], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 11.505999999999993, 5, 67, 10.0, 19.0, 24.94999999999999, 40.99000000000001, 0.4729979651627539, 0.7033581362626729, 0.2415800154102737], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 4.581999999999999, 2, 53, 3.0, 7.0, 11.0, 25.940000000000055, 0.4712153397556843, 0.45451572581063177, 0.25769588892888984], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 17.099999999999994, 8, 88, 15.0, 24.0, 36.94999999999999, 68.98000000000002, 0.4730646452299, 0.7709059610757678, 0.3090627418542998], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 673.0, 673, 673, 673.0, 673.0, 673.0, 673.0, 1.4858841010401187, 0.6341126485884101, 1757.4889139115899], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 5.461999999999998, 2, 29, 4.0, 9.0, 12.949999999999989, 17.0, 0.47122155706681546, 0.47338899215840213, 0.27656655839566024], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 17.842000000000002, 9, 79, 16.0, 25.0, 36.94999999999999, 69.97000000000003, 0.47303958206006846, 0.7431479551326687, 0.2813292045650212], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 10.850000000000003, 5, 75, 9.0, 16.0, 22.94999999999999, 43.99000000000001, 0.4730270514710195, 0.7320416979849994, 0.270235180772018], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2370.875999999999, 1536, 5216, 2246.5, 3168.300000000001, 3670.85, 4659.76, 0.4720637399344209, 0.7208699128641145, 0.26000385676075527], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 24.257999999999992, 12, 136, 19.0, 39.0, 49.0, 103.79000000000019, 0.47048948785337286, 0.25394945784320094, 3.793321495817819], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 22.516000000000002, 11, 122, 20.0, 32.0, 45.0, 77.98000000000002, 0.47307717781078806, 0.8563944289840194, 0.3945389744632939], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 16.96799999999999, 8, 104, 15.0, 24.0, 33.0, 63.0, 0.4730718066233837, 0.8009466033799089, 0.33909639263824576], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 83.0, 83, 83, 83.0, 83.0, 83.0, 83.0, 12.048192771084338, 5.6122929216867465, 1643.1664156626505], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 722.0, 722, 722, 722.0, 722.0, 722.0, 722.0, 1.3850415512465375, 0.6343598511080333, 2648.8135171398894], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.8479999999999994, 1, 26, 2.0, 5.0, 6.0, 14.970000000000027, 0.4711092266742044, 0.39598478758862743, 0.199209272607354], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 494.25600000000003, 315, 2015, 455.0, 649.3000000000002, 848.1499999999999, 1620.7100000000003, 0.47093706114552614, 0.4146959544975902, 0.21799235056931582], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.9900000000000007, 1, 23, 3.0, 7.0, 9.0, 16.0, 0.4711039000807472, 0.4268044913514746, 0.23003120121130236], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1421.6760000000002, 943, 5855, 1314.0, 1938.4, 2297.95, 3285.6000000000004, 0.47048948785337286, 0.44508581228363364, 0.24856915325065893], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 56.0, 56, 56, 56.0, 56.0, 56.0, 56.0, 17.857142857142858, 8.353097098214285, 1175.8335658482142], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 53.16199999999999, 28, 832, 45.0, 74.90000000000003, 98.94999999999999, 175.76000000000022, 0.4701271788044102, 0.2537538994111187, 21.503727344571256], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 55.15600000000003, 28, 233, 48.0, 79.0, 96.94999999999999, 186.7900000000002, 0.470694999995293, 106.51621461167898, 0.14525353515479747], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 312.0, 312, 312, 312.0, 312.0, 312.0, 312.0, 3.205128205128205, 1.6808143028846154, 1.3146033653846154], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 3.030000000000001, 1, 38, 2.0, 5.0, 7.0, 16.970000000000027, 0.4732016444703549, 0.5141955095884849, 0.2028667206274275], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 4.0299999999999985, 2, 25, 3.0, 6.0, 9.0, 16.99000000000001, 0.47319627045627477, 0.4855391145811645, 0.17421386129103084], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.686, 1, 16, 2.0, 5.0, 6.949999999999989, 12.990000000000009, 0.4731967182861193, 0.2683496740975902, 0.1834561495699115], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 155.59599999999992, 86, 782, 137.0, 200.0, 276.74999999999994, 631.8900000000001, 0.4731340303543869, 0.4309539467303127, 0.15432301380699728], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 204.8859999999999, 114, 608, 185.0, 300.4000000000002, 355.95, 467.6800000000003, 0.47052225146779414, 0.25396714219605915, 139.18912047863407], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 2.8939999999999966, 1, 18, 2.0, 5.0, 7.0, 13.0, 0.4731913443839285, 0.2637256173372577, 0.19824129564522006], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 3.7960000000000003, 2, 40, 3.0, 6.0, 8.0, 12.0, 0.4732410576369749, 0.254510334815682, 0.2014971690719932], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 16.209999999999987, 8, 409, 11.0, 28.0, 34.0, 69.93000000000006, 0.46996103083132346, 0.19859066176857618, 0.34099711514421227], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 5.346, 2, 84, 4.0, 8.0, 10.0, 18.980000000000018, 0.47320433152316904, 0.24339985689118004, 0.19039080526127505], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 4.469999999999998, 2, 31, 4.0, 7.0, 9.0, 17.980000000000018, 0.4711047878379588, 0.289246378087503, 0.2355523939189794], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 5.301999999999999, 2, 38, 4.0, 8.0, 12.0, 27.980000000000018, 0.47108880872004233, 0.2758951850366177, 0.2222030220818168], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 639.9159999999994, 379, 2286, 611.5, 847.9000000000001, 1012.55, 1704.3400000000006, 0.47068259331047074, 0.4301000091665435, 0.2073025874834202], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 19.187999999999974, 4, 128, 16.0, 37.0, 45.0, 74.99000000000001, 0.47079649350771635, 0.4168709849886538, 0.19355988649096542], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 9.510000000000007, 4, 74, 8.0, 15.900000000000034, 23.0, 41.950000000000045, 0.4712299951086326, 0.31417327144591267, 0.22042887466507327], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 639.4580000000005, 423, 4231, 607.5, 771.8000000000001, 805.0, 940.98, 0.4710670611068192, 0.35408694102004856, 0.2603749576039645], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 206.09199999999996, 141, 1023, 188.0, 240.80000000000007, 307.0, 882.4500000000005, 0.4732123928647143, 9.149409115951705, 0.23845468234198494], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 304.84400000000016, 202, 1386, 275.0, 389.80000000000007, 483.79999999999995, 891.5400000000004, 0.4731188086489903, 0.9169957331188844, 0.3382060233701767], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 17.601999999999997, 8, 85, 15.0, 25.0, 39.0, 60.99000000000001, 0.4729805150947001, 0.3860102990915936, 0.29191766166001026], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 17.598000000000017, 8, 94, 15.0, 25.0, 39.0, 78.94000000000005, 0.4729894636867069, 0.39340806261387223, 0.29931364498924423], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 17.480000000000015, 8, 83, 15.0, 27.900000000000034, 42.94999999999999, 64.99000000000001, 0.4729738038728987, 0.38277160254639636, 0.28868030021539226], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 20.956000000000007, 10, 98, 18.0, 31.0, 43.0, 73.96000000000004, 0.47297648833876466, 0.4229583009147365, 0.3288664645480473], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 18.32800000000001, 8, 98, 15.0, 28.900000000000034, 48.0, 86.97000000000003, 0.4729447241124246, 0.35503646374263864, 0.26095094640968747], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2648.0419999999967, 1674, 6670, 2462.5, 3614.000000000002, 4056.3999999999996, 5441.850000000001, 0.4721167828073953, 0.394526418179801, 0.3006056078031462], "isController": false}]}, function(index, item){
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
