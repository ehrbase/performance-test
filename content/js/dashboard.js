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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8669644756434801, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.451, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [0.5, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [0.993, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.737, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.751, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [0.841, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.477, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 508.1696234843673, 1, 24925, 13.0, 1053.0, 1939.0, 10809.980000000003, 9.738480067914557, 61.34534384489114, 80.68446971117254], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 11442.223999999984, 9270, 24925, 10891.5, 13357.300000000001, 13725.9, 23936.810000000078, 0.2096487921504138, 0.12181741340771114, 0.10605280696671324], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 3.2100000000000013, 2, 16, 3.0, 4.0, 5.0, 7.0, 0.21040122672331227, 0.10801760634835206, 0.0764348206455783], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 4.669999999999997, 3, 18, 4.0, 6.0, 7.0, 10.0, 0.2103998986714088, 0.12069639499761617, 0.08917339455409318], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 16.980000000000004, 10, 417, 15.0, 20.0, 26.0, 56.98000000000002, 0.20916765080046368, 0.10881415943155762, 2.3290327679950065], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 43.85399999999998, 26, 62, 45.0, 56.0, 57.0, 59.99000000000001, 0.21033272112489304, 0.8747520144353449, 0.08791250453267013], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.6239999999999988, 1, 10, 2.0, 4.0, 4.0, 7.0, 0.21033679127018182, 0.13142475372190954, 0.08935205488528232], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 38.90800000000003, 23, 65, 40.0, 49.0, 51.0, 53.0, 0.21033201328961793, 0.8632346253082416, 0.0768204814163253], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1157.390000000001, 793, 1739, 1145.5, 1496.1000000000004, 1621.9, 1680.94, 0.21026408327803386, 0.8893102975362936, 0.10266800941310249], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 6.874, 4, 18, 7.0, 9.0, 9.949999999999989, 14.0, 0.21020468050149793, 0.31257887602191003, 0.10777095435867813], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 4.642000000000001, 2, 28, 4.0, 6.0, 7.0, 13.0, 0.20932685089941466, 0.20190842177916102, 0.11488446309128032], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 10.213999999999992, 6, 18, 10.0, 13.0, 13.949999999999989, 17.0, 0.21033148241628805, 0.34281566811795394, 0.1378246334973919], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 535.0, 535, 535, 535.0, 535.0, 535.0, 535.0, 1.8691588785046729, 0.8086302570093458, 2210.826153621495], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 5.0500000000000025, 3, 14, 5.0, 6.0, 7.0, 12.0, 0.20932851598641877, 0.21029134539100472, 0.1232666944724712], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 16.086, 7, 29, 17.0, 20.0, 21.0, 24.99000000000001, 0.21033015524468757, 0.33044181952410695, 0.12549973130322667], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 7.840000000000006, 5, 17, 8.0, 10.0, 10.0, 13.990000000000009, 0.21033033219993327, 0.32550056712944947, 0.12057021972789143], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2361.4379999999983, 1723, 3634, 2279.5, 2979.4, 3209.95, 3536.0, 0.21005384940483343, 0.3207649461453438, 0.11610398316712472], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 14.187999999999994, 9, 59, 13.0, 18.0, 23.0, 39.0, 0.20916362577615394, 0.10881206551485836, 1.686790255526835], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 14.997999999999992, 9, 25, 15.0, 18.0, 19.0, 24.0, 0.2103328096046374, 0.3807578442306762, 0.1758250830288766], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 10.330000000000004, 6, 21, 10.0, 13.0, 13.949999999999989, 19.980000000000018, 0.21033219024799005, 0.3560488527535849, 0.15117626174074286], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 59.0, 59, 59, 59.0, 59.0, 59.0, 59.0, 16.949152542372882, 7.994570974576272, 2311.6061970338983], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 575.0, 575, 575, 575.0, 575.0, 575.0, 575.0, 1.7391304347826089, 0.806725543478261, 3325.991847826087], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 3.0000000000000013, 2, 19, 3.0, 4.0, 4.0, 8.990000000000009, 0.209305031944134, 0.1759879223670892, 0.08891375868720534], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 756.4499999999996, 577, 1032, 741.0, 904.0, 932.8, 962.98, 0.20925431388230784, 0.18420510119120112, 0.09727055996872903], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.8260000000000054, 2, 15, 4.0, 5.0, 6.0, 9.990000000000009, 0.20932220632303775, 0.1896389687772904, 0.10261694099039546], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1003.5759999999993, 805, 1385, 962.0, 1210.8000000000002, 1250.95, 1302.97, 0.20925098609527196, 0.19795265892612396, 0.11096023969700458], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 66.0, 66, 66, 66.0, 66.0, 66.0, 66.0, 15.151515151515152, 7.176254734848484, 997.7065577651515], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 30.313999999999975, 19, 718, 28.0, 35.0, 39.0, 76.93000000000006, 0.2091018698307404, 0.10877993855227902, 9.56477693639832], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 37.565999999999974, 26, 248, 36.0, 44.0, 50.0, 109.94000000000005, 0.2092254182102272, 47.320582305984225, 0.06497429979575416], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 1105.0, 1105, 1105, 1105.0, 1105.0, 1105.0, 1105.0, 0.9049773755656109, 0.47458286199095023, 0.37294966063348417], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 3.2180000000000004, 2, 10, 3.0, 4.0, 5.0, 6.0, 0.2103637820883654, 0.2285282016315815, 0.09059612099704017], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.953999999999999, 2, 14, 4.0, 5.0, 5.0, 8.0, 0.21036280852861314, 0.21590948414411368, 0.0778588910472113], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.2600000000000007, 1, 13, 2.0, 3.0, 4.0, 7.0, 0.21040175794876803, 0.11930683745748832, 0.08198271623199066], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 205.1320000000002, 92, 343, 204.5, 309.0, 322.0, 334.99, 0.21038210439328325, 0.19162645760611252, 0.06903162800404607], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 113.74799999999999, 82, 369, 112.0, 133.0, 145.84999999999997, 253.93000000000006, 0.20919591783453775, 0.10888810957598499, 61.884401787537286], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 268.61799999999994, 17, 531, 323.5, 447.90000000000003, 478.95, 510.0, 0.21036086143614202, 0.11726508700209688, 0.08854055788962618], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 537.1259999999997, 328, 1022, 510.0, 835.9000000000001, 900.6999999999999, 986.9000000000001, 0.21038529120690466, 0.11313386852896921, 0.08998902104357837], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 8.577999999999996, 5, 281, 7.0, 10.0, 15.949999999999989, 27.0, 0.20907948574809687, 0.09427157164526738, 0.1521134930491525], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 536.388, 315, 1089, 500.0, 857.2000000000003, 915.8499999999999, 979.97, 0.2103333404846669, 0.10818815797527237, 0.08503711226626182], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 4.368000000000004, 2, 15, 4.0, 6.0, 7.0, 10.0, 0.20930398054310195, 0.12850732969458364, 0.10506078710854924], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.801999999999997, 3, 31, 5.0, 6.0, 6.0, 9.990000000000009, 0.20930152731510512, 0.12257833881459149, 0.09913207104279881], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 903.3820000000002, 598, 1489, 915.5, 1153.8000000000004, 1279.75, 1398.9, 0.20921999021687326, 0.1911808955525688, 0.09255532770336287], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 519.7059999999999, 268, 1107, 431.0, 921.4000000000002, 964.95, 1036.0, 0.20922375476297878, 0.18525905339955126, 0.08642739088353518], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 5.820000000000005, 3, 38, 6.0, 7.0, 8.0, 14.0, 0.20932930472108754, 0.13962101086377224, 0.09832753473715147], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1236.2780000000018, 943, 10635, 1131.0, 1473.0, 1495.95, 1537.99, 0.2092469578631031, 0.15722538507717654, 0.11606667193969], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 171.01399999999987, 146, 201, 175.0, 192.0, 194.0, 198.99, 0.2104490477601487, 4.069024117776547, 0.10645762376929398], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 232.07999999999996, 197, 345, 228.5, 260.0, 263.0, 273.97, 0.21043124516797254, 0.4078445230323311, 0.15083645893876158], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 9.595999999999995, 6, 33, 9.0, 12.0, 13.0, 16.0, 0.21020247122433272, 0.17161061127299035, 0.13014488941037786], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 9.389999999999997, 6, 30, 9.0, 12.0, 13.0, 17.99000000000001, 0.2102036200426629, 0.17477692009445708, 0.13343003225364344], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 10.488, 7, 30, 11.0, 12.0, 13.949999999999989, 19.99000000000001, 0.21020026199360653, 0.1701123624186735, 0.12870660573241338], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 12.781999999999996, 8, 23, 13.0, 15.0, 17.0, 21.0, 0.2102013224185596, 0.18798402795761668, 0.14656615645200347], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 9.722000000000001, 6, 50, 10.0, 11.900000000000034, 12.0, 23.99000000000001, 0.2101817062887207, 0.15778201117304935, 0.11637990963447721], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2079.672000000001, 1687, 2742, 2029.5, 2537.0, 2630.8, 2718.9, 0.21003284913760512, 0.17551485286673837, 0.1341420735703064], "isController": false}]}, function(index, item){
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
