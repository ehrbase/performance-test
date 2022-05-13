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

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9113383321972279, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.499, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.001, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.972, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.495, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.79, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.723, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.622, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 22005, 0, 0.0, 199.84671665530416, 1, 3610, 14.0, 598.9000000000015, 1285.8500000000022, 2252.9900000000016, 24.534781299824953, 164.95135708531706, 216.1228248621626], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query participation #2", 500, 0, 0.0, 8.395999999999997, 4, 39, 8.0, 12.0, 15.0, 24.970000000000027, 0.5677605140730798, 6.067764177902647, 0.20514784199906205], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 7.876000000000004, 4, 39, 7.0, 10.0, 12.0, 21.980000000000018, 0.5677437522638783, 6.095948942520487, 0.23951689548632363], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 21.45800000000001, 13, 244, 19.0, 27.0, 32.94999999999999, 60.0, 0.5640138837657628, 0.3039506070481431, 6.279060815361031], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 41.725999999999985, 26, 79, 43.0, 52.0, 54.0, 63.0, 0.5676799375097925, 2.361082865091998, 0.23616372400309726], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.456000000000005, 1, 13, 2.0, 3.0, 4.0, 7.0, 0.5677076532668738, 0.35481728329179607, 0.24005606822710576], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 36.84199999999999, 22, 63, 37.0, 46.0, 47.94999999999999, 54.99000000000001, 0.5676618914948355, 2.3293207442955657, 0.20622092151960816], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 769.6779999999997, 577, 1984, 770.0, 910.9000000000001, 929.95, 978.97, 0.5673333968746738, 2.3995321697892695, 0.27591018715194093], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 9.403999999999987, 6, 52, 9.0, 12.0, 13.949999999999989, 22.0, 0.5672593770811329, 0.8436875305610989, 0.28972329513030515], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.5320000000000014, 2, 24, 3.0, 5.0, 6.0, 11.0, 0.5649015376619855, 0.5450417179785564, 0.30893052840889834], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 14.077999999999994, 9, 64, 14.0, 17.0, 18.0, 25.980000000000018, 0.5676290249155084, 0.9251687915859215, 0.37084357194187023], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 626.0, 626, 626, 626.0, 626.0, 626.0, 626.0, 1.5974440894568689, 0.6817217452076677, 1889.4409569688498], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.634, 3, 25, 4.0, 6.0, 7.0, 12.990000000000009, 0.564911111236647, 0.5670295279037844, 0.3315542752472898], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 15.112, 10, 66, 15.0, 18.0, 20.0, 31.980000000000018, 0.5676174258549738, 0.8912480488150987, 0.33757716049382713], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 9.008, 5, 37, 9.0, 11.0, 13.0, 18.99000000000001, 0.5676122708691165, 0.8785795403589353, 0.32427068208831367], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1982.414000000001, 1470, 2916, 1958.5, 2242.6000000000004, 2330.95, 2477.3200000000006, 0.5663258140367251, 0.8649741925326543, 0.311921639762415], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 18.138000000000005, 11, 115, 16.0, 23.0, 28.899999999999977, 49.960000000000036, 0.5639769852271869, 0.3045696023736663, 4.547064443394194], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 18.898, 12, 60, 19.0, 23.0, 24.0, 30.99000000000001, 0.5676464243951728, 1.0277504597936038, 0.47340824847019286], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 14.170000000000007, 9, 74, 14.0, 17.0, 19.0, 24.0, 0.5676419133165388, 0.9612217555574981, 0.40688394958431584], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 91.0, 91, 91, 91.0, 91.0, 91.0, 91.0, 10.989010989010989, 5.118904532967033, 1498.7122252747254], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 687.0, 687, 687, 687.0, 687.0, 687.0, 687.0, 1.455604075691412, 0.6666780385735079, 2783.7603484352253], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.5160000000000005, 1, 101, 2.0, 3.0, 4.0, 12.970000000000027, 0.5648370840398503, 0.47492649351397576, 0.23884224354419453], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 415.3259999999998, 315, 571, 421.0, 483.0, 502.9, 538.98, 0.5646450866843137, 0.4967332811413058, 0.26136891707848114], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.302, 1, 38, 3.0, 4.0, 7.0, 16.99000000000001, 0.5648792005829553, 0.5119217755283033, 0.2758199221596462], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1164.5400000000004, 929, 1964, 1150.0, 1353.0, 1383.95, 1518.4500000000005, 0.5642907767801116, 0.5339821901366487, 0.29812627952933635], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 60.0, 60, 60, 60.0, 60.0, 60.0, 60.0, 16.666666666666668, 7.796223958333334, 1097.4446614583335], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 42.710000000000036, 27, 709, 41.0, 50.0, 56.94999999999999, 91.93000000000006, 0.5635364844790782, 0.30433171476262716, 25.776290878936585], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 42.876000000000026, 28, 180, 42.0, 52.0, 57.0, 94.93000000000006, 0.5643595647659037, 127.71225475049663, 0.17415783443947808], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 269.0, 269, 269, 269.0, 269.0, 269.0, 269.0, 3.717472118959108, 1.9494946561338289, 1.5247444237918215], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.3859999999999992, 1, 36, 2.0, 3.0, 5.0, 10.0, 0.5678875491790618, 0.6172449631213826, 0.24345960360313293], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.3580000000000014, 2, 20, 3.0, 4.0, 7.0, 13.0, 0.5678836792502118, 0.5828571746991921, 0.20907436238020494], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.3019999999999996, 1, 40, 2.0, 3.0, 4.0, 11.970000000000027, 0.5677727637134156, 0.32214450753661567, 0.2201228390568613], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 122.98200000000001, 87, 393, 122.0, 149.0, 154.0, 174.0, 0.5677089424377194, 0.51725824540468, 0.18517069020917803], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 163.822, 112, 611, 161.0, 192.0, 236.69999999999993, 356.7700000000002, 0.5640985141645136, 0.30463523274704696, 166.87069698602164], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 2.362, 1, 17, 2.0, 3.0, 4.0, 9.990000000000009, 0.5678798093741055, 0.3160162407946683, 0.2379105842006751], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 471.3199999999998, 350, 873, 479.0, 549.9000000000001, 564.0, 630.8200000000002, 0.5676670473820331, 0.6169165986412322, 0.24391943442196734], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 12.339999999999996, 7, 326, 10.0, 15.0, 20.0, 56.91000000000008, 0.5633485437440144, 0.23821281195425612, 0.4087577812517605], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 3.142000000000002, 1, 47, 3.0, 4.0, 6.0, 12.990000000000009, 0.5678881941723313, 0.6044903629373448, 0.23070457888250961], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.7299999999999978, 2, 24, 3.0, 5.0, 6.0, 12.980000000000018, 0.5648294271612916, 0.34695088836372306, 0.2824147135806458], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.357999999999996, 2, 34, 4.0, 6.0, 7.0, 17.970000000000027, 0.5648128379698819, 0.33094502224797767, 0.266410742909622], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 523.9540000000002, 376, 801, 523.5, 635.0, 647.6999999999999, 696.97, 0.5643035140308426, 0.515169430719329, 0.24853602033975586], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 17.29999999999999, 5, 132, 16.0, 32.0, 37.0, 43.0, 0.5644704251365454, 0.49997526913949875, 0.2320723134594586], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 7.8679999999999986, 5, 50, 8.0, 9.900000000000034, 11.0, 17.99000000000001, 0.5649213234072891, 0.3767981092648227, 0.2642551893672768], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 542.8419999999999, 364, 3610, 528.0, 601.0, 619.95, 684.99, 0.564721614832752, 0.42464418302853424, 0.3121410488235719], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 13.852000000000004, 9, 29, 14.0, 17.0, 18.0, 22.99000000000001, 0.5672407142695074, 0.46309886438409004, 0.3500938783382116], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 13.708, 8, 27, 14.0, 17.0, 18.0, 23.0, 0.5672471495830733, 0.4713247702649044, 0.35896108684553857], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 13.906000000000006, 9, 37, 14.0, 17.0, 18.0, 26.960000000000036, 0.5672220526858531, 0.4592061344497776, 0.3462048661412678], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 16.72400000000001, 11, 39, 17.0, 20.0, 22.0, 28.99000000000001, 0.5672291310730386, 0.5074041836551791, 0.39440150519922224], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 13.890000000000002, 9, 76, 14.0, 16.0, 18.0, 32.960000000000036, 0.5670232865123305, 0.4258211985624826, 0.3128595282026042], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2186.5519999999974, 1660, 3187, 2161.5, 2507.7000000000003, 2606.75, 2720.9700000000003, 0.5659636266496425, 0.4724690884816215, 0.36035965290582705], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 22005, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
