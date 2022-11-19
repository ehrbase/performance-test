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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8747075090406297, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.465, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.721, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [0.5, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [0.989, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.794, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.826, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.497, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [0.836, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.486, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 492.4319931929372, 1, 22735, 14.0, 992.0, 1930.0, 10782.990000000002, 10.08442082474731, 67.97410838762747, 83.55063017172476], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 11279.044000000009, 9092, 22735, 10909.5, 13230.7, 13850.099999999999, 19423.27000000004, 0.21694599910357912, 0.12605748971350544, 0.1097441675152871], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 7.171999999999997, 5, 21, 7.0, 8.900000000000034, 10.0, 16.99000000000001, 0.21777060393014966, 2.3252349901339024, 0.07911197720899966], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 9.248000000000005, 6, 39, 9.0, 11.0, 13.0, 20.980000000000018, 0.21776747398876406, 2.338325037935094, 0.09229598018664414], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 22.01999999999999, 14, 268, 20.0, 27.900000000000034, 33.0, 64.88000000000011, 0.2168459838389025, 0.12742030950752542, 2.414529206768717], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 43.894000000000005, 26, 94, 44.0, 54.0, 57.0, 80.97000000000003, 0.21770944410505963, 0.905431041703768, 0.09099574421578663], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.8819999999999992, 1, 13, 3.0, 4.0, 5.0, 9.0, 0.21771437354648443, 0.13600982607560697, 0.09248608641867258], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 38.116000000000014, 22, 71, 39.0, 48.0, 50.0, 60.0, 0.21770783260531834, 0.8935184425475561, 0.07951438417420807], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1139.5660000000005, 796, 1938, 1133.0, 1451.8000000000002, 1555.6999999999998, 1727.9, 0.21762851943400915, 0.9204581227233337, 0.10626392550488728], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 6.422, 4, 32, 6.0, 8.0, 10.0, 14.0, 0.21758940531074814, 0.3235601204694622, 0.11155706815248317], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 4.684000000000001, 3, 24, 4.0, 6.0, 7.0, 15.970000000000027, 0.2168991319262942, 0.2092123453075391, 0.11904034388923568], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 9.228000000000005, 6, 31, 9.0, 11.0, 13.0, 19.980000000000018, 0.21770612633747757, 0.35483547349340827, 0.1426570417699682], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 681.0, 681, 681, 681.0, 681.0, 681.0, 681.0, 1.4684287812041115, 0.6969300660792951, 1736.8458035058736], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.9780000000000015, 3, 19, 5.0, 6.0, 8.0, 12.990000000000009, 0.21690035510926137, 0.21789801201606276, 0.127725502080942], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 14.752000000000004, 6, 33, 16.0, 19.0, 20.0, 26.970000000000027, 0.21770470446804072, 0.3420153663327948, 0.1298999750292704], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 7.060000000000002, 4, 18, 7.0, 8.0, 9.0, 14.990000000000009, 0.2177044200963821, 0.3369124722372438, 0.12479735800446903], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2307.132000000001, 1614, 3927, 2223.5, 3001.8, 3178.6, 3388.83, 0.21741418010068886, 0.3320046167629377, 0.1201722909540917], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 20.161999999999992, 13, 96, 18.0, 25.0, 32.94999999999999, 62.940000000000055, 0.21684316254476727, 0.12741865169415226, 1.7487215198190316], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 14.215999999999996, 9, 32, 14.0, 17.0, 19.94999999999999, 26.980000000000018, 0.2177084961611461, 0.3941097816590607, 0.18199069600970808], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 9.51599999999999, 6, 29, 9.0, 11.0, 13.0, 18.99000000000001, 0.21770697946805478, 0.36853284409132375, 0.15647689149266436], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 109.0, 109, 109, 109.0, 109.0, 109.0, 109.0, 9.174311926605505, 4.712586009174312, 1251.236381880734], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 779.0, 779, 779, 779.0, 779.0, 779.0, 779.0, 1.2836970474967906, 0.6493701861360719, 2455.0004011553274], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.5480000000000005, 1, 14, 2.0, 3.0, 4.0, 8.990000000000009, 0.2169166341653243, 0.18238791212533617, 0.09214720299015242], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 531.0540000000001, 392, 936, 528.5, 630.9000000000001, 651.0, 768.8200000000002, 0.21685999735430803, 0.19090033087414093, 0.10080601439516662], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.529999999999999, 2, 29, 3.0, 4.0, 5.0, 12.0, 0.21690694171623714, 0.19651048720661168, 0.10633523900542094], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 788.4060000000001, 607, 1187, 764.5, 949.8000000000001, 966.0, 1116.7300000000002, 0.21683874266488745, 0.20513072110049133, 0.11498382545608778], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 73.0, 73, 73, 73.0, 73.0, 73.0, 73.0, 13.698630136986301, 7.0633561643835625, 902.0360659246576], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 36.32399999999999, 24, 667, 34.0, 43.0, 50.94999999999999, 98.74000000000024, 0.2167821465161158, 0.1273827982228633, 9.91608959259264], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 41.79599999999999, 27, 202, 39.0, 55.0, 67.94999999999999, 114.77000000000021, 0.21689216945524928, 49.08168550185378, 0.06735518543629812], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 1083.0, 1083, 1083, 1083.0, 1083.0, 1083.0, 1083.0, 0.9233610341643582, 0.4842235110803324, 0.38052573868882733], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 3.3180000000000027, 2, 19, 3.0, 4.0, 5.0, 9.980000000000018, 0.2177373173456079, 0.23653842437656364, 0.09377163764591123], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 4.050000000000002, 2, 20, 4.0, 5.0, 6.0, 10.990000000000009, 0.21773646397724392, 0.22347756214851894, 0.08058800766345259], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.5319999999999987, 1, 25, 2.0, 3.0, 4.0, 9.990000000000009, 0.21777250090811132, 0.12349870019760675, 0.0848547147093129], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 201.47399999999996, 89, 411, 191.0, 300.90000000000003, 315.95, 369.98, 0.21775362744880286, 0.1983408065017314, 0.07145040900663845], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 125.72999999999999, 88, 361, 122.5, 150.0, 176.84999999999997, 257.95000000000005, 0.21686244285132475, 0.12749139706689208, 64.15231561379228], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 265.42599999999993, 18, 829, 315.0, 440.0, 466.0, 546.9300000000001, 0.21773399872843344, 0.12135055704521899, 0.09164389985542462], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 514.0660000000005, 304, 1185, 478.0, 813.8000000000001, 890.8499999999999, 1017.94, 0.21775704150057248, 0.11711033234841822, 0.09314217204809642], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 15.127999999999998, 9, 311, 13.0, 19.0, 25.94999999999999, 51.97000000000003, 0.21675620865646267, 0.10196643874209436, 0.15769860883697723], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 520.4519999999999, 289, 1172, 460.5, 880.6000000000001, 921.9, 1063.88, 0.21770612633747757, 0.11198046269845002, 0.08801790654659739], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 4.313999999999997, 2, 39, 4.0, 5.0, 7.0, 13.980000000000018, 0.21691512848533803, 0.13318038127931336, 0.10888122660299196], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.696000000000001, 2, 28, 4.0, 6.0, 7.0, 13.990000000000009, 0.21691287000455084, 0.12703595436565351, 0.10273705268770231], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 888.4139999999995, 587, 1685, 886.5, 1182.0, 1277.55, 1482.5800000000004, 0.2168306556915662, 0.19813536409878457, 0.09592215530105418], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 488.93200000000013, 237, 1478, 391.0, 866.5000000000002, 915.9, 1114.7800000000002, 0.21687429488744875, 0.1920332928880846, 0.08958772142323322], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.983999999999996, 3, 47, 5.0, 6.0, 7.949999999999989, 14.0, 0.2169012019363204, 0.14467140715088558, 0.10188425598766612], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1196.8179999999995, 891, 8839, 1142.5, 1427.9, 1455.95, 1740.4500000000005, 0.21681683400589916, 0.16291328947345599, 0.12026558761264719], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 171.47000000000008, 141, 365, 172.0, 189.0, 204.79999999999995, 305.5900000000004, 0.21781348370014578, 4.2114151990031115, 0.11018299273112843], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 231.87599999999998, 193, 415, 230.5, 259.0, 270.95, 364.94000000000005, 0.2177962159214261, 0.42213117939591166, 0.15611564695930347], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 8.233999999999996, 5, 25, 8.0, 10.0, 11.0, 17.0, 0.21758732214412288, 0.17763964971922533, 0.13471715062438858], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 8.209999999999999, 5, 25, 8.0, 10.0, 11.949999999999989, 17.99000000000001, 0.21758817434383024, 0.18091691738264057, 0.13811749347997038], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.983999999999995, 6, 29, 9.0, 11.0, 12.0, 20.99000000000001, 0.21758523901738505, 0.17608892912704804, 0.13322846178115277], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 11.427999999999985, 7, 35, 11.0, 14.0, 15.949999999999989, 21.0, 0.21758590182611143, 0.19457576773553564, 0.15171516982797223], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 8.154, 5, 32, 8.0, 10.0, 11.0, 20.980000000000018, 0.2176504977013931, 0.1633887832890995, 0.12051546112957996], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2111.3380000000025, 1600, 3292, 2053.5, 2606.5, 2667.65, 2880.87, 0.21741900163803476, 0.18168712294109643, 0.13885940143679174], "isController": false}]}, function(index, item){
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
