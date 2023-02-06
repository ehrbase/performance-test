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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8670495639225697, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.455, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [0.5, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.732, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.749, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [0.846, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.472, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 508.88466283769395, 1, 25771, 13.0, 1067.9000000000015, 1927.9500000000007, 10758.930000000011, 9.715644316069067, 61.20149521151625, 80.49527278154288], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 11379.367999999997, 9120, 25771, 10837.5, 13131.800000000001, 13567.8, 24045.29000000008, 0.20914717728695117, 0.12151410151313799, 0.10579906038539132], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 3.2399999999999975, 2, 10, 3.0, 4.0, 5.0, 8.0, 0.20987204521147546, 0.10774593055480934, 0.07624257892448132], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 4.794, 3, 27, 5.0, 6.0, 6.0, 13.990000000000009, 0.20987098810619137, 0.12039298421224504, 0.08894922738094438], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 16.996000000000006, 10, 425, 15.0, 20.0, 24.0, 61.97000000000003, 0.20864961136923388, 0.10854466257080524, 2.3232645203437543], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 44.18400000000004, 27, 61, 45.0, 55.0, 56.94999999999999, 58.99000000000001, 0.2098022990975144, 0.872546044130445, 0.08769080470091424], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.6579999999999986, 1, 9, 2.0, 4.0, 4.0, 7.990000000000009, 0.2098057324800674, 0.13109293221659335, 0.08912645862190363], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 39.12600000000001, 24, 57, 40.0, 49.0, 50.94999999999999, 53.0, 0.2098011546616348, 0.8610559006260048, 0.07662659359712053], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1165.056, 836, 1734, 1160.0, 1469.0, 1595.85, 1689.93, 0.20973083982939655, 0.8870549485362466, 0.10240763663544754], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 6.890000000000002, 4, 20, 7.0, 8.900000000000034, 9.0, 15.0, 0.20969548022361925, 0.3118216842688548, 0.10750988976308605], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 4.466, 3, 18, 4.0, 5.0, 6.0, 10.990000000000009, 0.20879747271539026, 0.20139780446847472, 0.1145939254551263], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 10.464000000000004, 6, 26, 10.0, 13.0, 14.0, 17.0, 0.20980009827036603, 0.34194957423168054, 0.13747643158146056], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 624.0, 624, 624, 624.0, 624.0, 624.0, 624.0, 1.6025641025641024, 0.6932967748397436, 1895.499987479968], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 5.002000000000001, 3, 17, 5.0, 6.0, 7.0, 12.0, 0.20879869342129606, 0.20977091233753897, 0.12295469934867337], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 16.192000000000007, 7, 49, 17.0, 20.0, 21.0, 24.0, 0.20979877779624007, 0.3296069923415054, 0.12518266917334248], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 7.974000000000009, 5, 26, 8.0, 9.0, 10.0, 14.990000000000009, 0.20979886582733132, 0.32467808658713887, 0.1202655607818784], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2392.8660000000004, 1687, 3792, 2337.5, 3042.9000000000005, 3342.65, 3586.8900000000003, 0.20954845242181433, 0.31998130539675274, 0.11582463288158877], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 14.143999999999997, 9, 93, 13.0, 17.0, 22.899999999999977, 40.950000000000045, 0.20864525799403444, 0.10854239783789266, 1.6826099028464223], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 15.294, 10, 36, 15.0, 18.0, 19.0, 26.0, 0.2098011546616348, 0.37979540860138583, 0.17538065272496034], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 10.55400000000001, 6, 31, 10.0, 13.0, 14.0, 19.99000000000001, 0.2098007144973133, 0.35514917433977816, 0.15079426354494394], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 66.0, 66, 66, 66.0, 66.0, 66.0, 66.0, 15.151515151515152, 7.146661931818182, 2066.43584280303], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 719.0, 719, 719, 719.0, 719.0, 719.0, 719.0, 1.3908205841446453, 0.6451560326842838, 2659.868306675939], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 3.0120000000000005, 2, 18, 3.0, 4.0, 4.949999999999989, 10.0, 0.20879102064984953, 0.17555573123000043, 0.08869540427996538], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 756.3799999999994, 583, 984, 735.0, 912.9000000000001, 932.0, 964.94, 0.2087395056213549, 0.18375191909882982, 0.09703125456617669], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.8699999999999943, 2, 16, 4.0, 5.0, 6.0, 12.990000000000009, 0.20880087328877245, 0.1891666583581319, 0.10236136561617555], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1013.984, 763, 1345, 981.5, 1223.9, 1249.75, 1301.7600000000002, 0.20873000731807406, 0.1974598099502847, 0.11068397848995529], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 76.0, 76, 76, 76.0, 76.0, 76.0, 76.0, 13.157894736842104, 6.2320106907894735, 866.4293791118421], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 30.10000000000001, 20, 581, 27.0, 33.0, 38.0, 113.93000000000006, 0.20859564235359299, 0.10851658656072512, 9.541620984220991], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 37.40799999999998, 26, 234, 35.0, 43.0, 48.0, 135.87000000000012, 0.2087077898930331, 47.20351013761566, 0.06481355193943801], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 1039.0, 1039, 1039, 1039.0, 1039.0, 1039.0, 1039.0, 0.9624639076034649, 0.5047296077959577, 0.39664039942252166], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 3.2880000000000003, 2, 10, 3.0, 4.0, 5.0, 8.0, 0.2098420099507081, 0.22796137569274094, 0.09037141248853739], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.9459999999999997, 2, 14, 4.0, 5.0, 6.0, 8.0, 0.20984112928102133, 0.2153621641492726, 0.07766580859131551], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.300000000000002, 1, 13, 2.0, 3.0, 4.0, 7.0, 0.20987266186114237, 0.11900681724120707, 0.08177655476815997], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 196.32600000000022, 90, 300, 196.0, 273.0, 281.0, 289.0, 0.20985610167108415, 0.19114734823206728, 0.06885903336082448], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 112.102, 80, 389, 109.0, 129.0, 140.0, 345.8700000000001, 0.20867878366980006, 0.10861893720312835, 61.731422997320145], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 265.5420000000001, 17, 475, 325.0, 434.0, 449.0, 463.98, 0.209838046995329, 0.116985530879767, 0.08832050610838554], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 548.778, 327, 1109, 513.0, 843.0000000000003, 925.9, 1053.98, 0.20987636183524286, 0.11286019374736343, 0.08977133445687145], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 8.854000000000005, 5, 278, 7.0, 11.0, 16.0, 32.0, 0.20857336651596545, 0.09404336821688127, 0.1517452715374944], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 552.0040000000004, 311, 1098, 503.0, 900.9000000000001, 957.95, 1037.0, 0.20981550503011692, 0.10792180142032509, 0.08482775301022305], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 4.5180000000000025, 2, 46, 4.0, 5.900000000000034, 6.0, 11.0, 0.20878727165980035, 0.1281900835597979, 0.10480142346986071], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.770000000000005, 3, 29, 5.0, 6.0, 6.0, 10.990000000000009, 0.20878509207631346, 0.1222758862979355, 0.09888747036817581], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 911.5160000000001, 626, 1483, 914.0, 1196.2000000000003, 1340.9, 1415.88, 0.2087010820316299, 0.19070672799591445, 0.09232577164094564], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 524.0400000000001, 272, 1115, 429.0, 938.7, 991.9, 1065.96, 0.20870369543285355, 0.18479856219328383, 0.08621256168759478], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 5.814000000000001, 3, 44, 6.0, 7.0, 8.0, 13.0, 0.2087997397520044, 0.1392677951666201, 0.09807878400460361], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1260.2180000000014, 964, 10946, 1178.5, 1487.0, 1502.95, 1588.0, 0.208718244562681, 0.1568281169252129, 0.11577340128086212], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 169.20799999999988, 144, 201, 164.5, 190.90000000000003, 192.0, 196.99, 0.20993258225053604, 4.05903827732262, 0.10619636484939227], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 229.84799999999996, 197, 330, 219.0, 259.0, 262.95, 267.99, 0.20991645325160585, 0.4068586757158151, 0.15046745770183467], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 9.348000000000008, 6, 28, 9.0, 11.0, 12.0, 18.99000000000001, 0.20969336957953122, 0.17119497750828916, 0.12982968389982694], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 9.251999999999999, 6, 23, 9.0, 11.0, 12.0, 17.980000000000018, 0.20969433695279738, 0.17435346910971755, 0.13310675685480303], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 10.226000000000003, 6, 22, 10.0, 12.0, 13.0, 18.980000000000018, 0.20969125897793126, 0.1697004328394545, 0.12839494079996375], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 12.610000000000008, 8, 24, 13.0, 15.0, 16.0, 21.0, 0.20969222633172388, 0.18752874094077157, 0.1462111812508309], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 9.626000000000001, 6, 38, 10.0, 11.0, 13.0, 25.950000000000045, 0.20967551874771717, 0.15740201954741959, 0.11609962805659728], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2079.4639999999995, 1658, 2745, 2021.0, 2574.8, 2647.95, 2697.91, 0.20953308485503244, 0.17509722269658187, 0.13382288817889768], "isController": false}]}, function(index, item){
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
