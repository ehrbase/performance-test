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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8878536481599659, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.142, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.561, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.938, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.992, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.496, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.101, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 326.6239523505659, 1, 19622, 10.0, 840.9000000000015, 1526.0, 5978.990000000002, 15.153097536823864, 95.45327798955368, 125.39317524560525], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6164.760000000002, 5165, 19622, 5970.5, 6594.9, 6735.8, 17221.30000000009, 0.32686190346068306, 0.18983207285849885, 0.16470775604073482], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.4899999999999975, 1, 16, 2.0, 3.0, 4.0, 6.0, 0.3279955340128089, 0.16838919158776733, 0.11851401131322195], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.6919999999999997, 2, 15, 4.0, 5.0, 5.0, 7.990000000000009, 0.32799295208744556, 0.18824681432745374, 0.13837202666189108], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 13.783999999999994, 8, 399, 12.0, 16.0, 20.94999999999999, 47.92000000000007, 0.3259392918512569, 0.16956164078328426, 3.586287110632922], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 34.07599999999999, 23, 74, 34.0, 40.900000000000034, 42.0, 60.92000000000007, 0.3279372354366353, 1.3638570155530791, 0.13642701396094398], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.5600000000000036, 1, 31, 2.0, 3.0, 4.0, 7.0, 0.32794605418587064, 0.2048734085187923, 0.13867250142820506], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 30.153999999999982, 21, 64, 30.0, 35.0, 36.0, 46.0, 0.3279406768433218, 1.3459370722423798, 0.11913469900948799], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 859.008000000001, 691, 1144, 866.5, 980.8000000000001, 1049.9, 1080.0, 0.32778846368169384, 1.3862859155770977, 0.15941274893894875], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 6.001999999999997, 3, 34, 5.0, 8.0, 9.0, 22.920000000000073, 0.32787981762013024, 0.48756433309409036, 0.16746205528840635], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 4.015999999999997, 2, 22, 4.0, 5.0, 6.0, 11.0, 0.3261602007581268, 0.31460126161211854, 0.17836885978960057], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 8.164000000000001, 5, 36, 8.0, 10.0, 11.0, 18.980000000000018, 0.32794777497273114, 0.5344235659909631, 0.21425494282886437], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 459.0, 459, 459, 459.0, 459.0, 459.0, 459.0, 2.1786492374727673, 0.942521105664488, 2576.8846166938997], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.332000000000007, 2, 26, 4.0, 5.900000000000034, 6.0, 13.0, 0.3261642432663392, 0.3276644713774568, 0.1914303810576854], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 8.456, 6, 36, 8.0, 10.0, 11.0, 19.970000000000027, 0.3279451937992123, 0.5152038210124325, 0.19503771779660184], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.716000000000002, 4, 16, 7.0, 8.0, 9.0, 12.0, 0.32794497870325306, 0.5075172726570627, 0.18735137943496394], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1592.286, 1332, 2069, 1573.5, 1787.0, 1857.75, 1972.93, 0.3275760746296916, 0.5002284996671826, 0.18042275985463482], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 12.1, 7, 78, 11.0, 15.0, 18.0, 37.99000000000001, 0.3259295183935064, 0.16955655639004374, 2.6278067420476456], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 11.614, 8, 42, 11.0, 14.0, 16.0, 21.99000000000001, 0.3279497108795349, 0.5936754478071314, 0.2735049346592996], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 8.249999999999998, 6, 20, 8.0, 10.0, 12.0, 15.990000000000009, 0.32795078639319064, 0.5552456619899792, 0.23507409884043162], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 52.0, 52, 52, 52.0, 52.0, 52.0, 52.0, 19.230769230769234, 9.070763221153847, 2622.7463942307695], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 550.0, 550, 550, 550.0, 550.0, 550.0, 550.0, 1.8181818181818181, 0.8433948863636362, 3477.1697443181815], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.5319999999999996, 1, 41, 2.0, 3.0, 4.0, 7.990000000000009, 0.3261593497165349, 0.274149037006366, 0.13791699065162072], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 580.7639999999993, 437, 721, 580.0, 668.0, 682.95, 710.97, 0.32605342972342194, 0.2871148809725652, 0.15092707586806836], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.384000000000002, 2, 19, 3.0, 4.0, 5.0, 9.0, 0.32617211580675737, 0.2955011069873895, 0.15926372842126824], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 777.5579999999991, 599, 969, 767.0, 889.9000000000001, 911.0, 927.0, 0.32602302765848956, 0.30841969445610884, 0.17224458785472935], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 61.0, 61, 61, 61.0, 61.0, 61.0, 61.0, 16.393442622950822, 7.764472336065574, 1079.4537653688524], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 23.601999999999997, 16, 690, 21.0, 28.0, 34.0, 53.960000000000036, 0.3257846849922724, 0.16948121049046233, 14.86074476170805], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 32.947999999999986, 18, 310, 29.0, 43.0, 51.0, 132.8900000000001, 0.3260683139203128, 73.74707116779247, 0.10062264374884652], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 496.0, 496, 496, 496.0, 496.0, 496.0, 496.0, 2.0161290322580645, 1.0572864163306452, 0.8269279233870968], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.8440000000000003, 1, 21, 3.0, 4.0, 4.0, 8.0, 0.32794755987338603, 0.3563579388151517, 0.1405947058441567], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.5200000000000093, 2, 26, 3.0, 5.0, 5.0, 9.0, 0.3279466994788271, 0.33650085606386565, 0.12073818916359162], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.892000000000002, 1, 11, 2.0, 3.0, 3.0, 5.990000000000009, 0.3279966098270408, 0.18600674930923913, 0.12716274814583517], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 90.4880000000001, 66, 118, 90.0, 110.0, 113.0, 116.0, 0.3279798279286631, 0.2987402981517025, 0.1069777954376694], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 86.67999999999992, 59, 500, 82.0, 102.0, 115.94999999999999, 402.0900000000008, 0.3260079350331387, 0.16959735065576498, 96.39838149285553], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 212.6159999999998, 12, 370, 261.5, 334.90000000000003, 339.0, 357.0, 0.32794368813342323, 0.18277416235803318, 0.13739047090745954], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 435.3239999999999, 335, 554, 431.0, 508.0, 519.9, 548.98, 0.3278707874341553, 0.17632980600377313, 0.13960123371219896], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 7.468, 4, 277, 6.0, 8.900000000000034, 11.949999999999989, 32.950000000000045, 0.3257299281960946, 0.14686793471427623, 0.23634505532197103], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 405.8259999999999, 287, 534, 405.0, 473.0, 486.0, 504.0, 0.3278707874341553, 0.1686453344232851, 0.13191676213171094], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.782000000000001, 2, 26, 3.0, 5.0, 6.0, 12.980000000000018, 0.32615466906716506, 0.20025068553634504, 0.1630773345335825], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.285999999999999, 2, 34, 4.0, 5.0, 6.0, 9.0, 0.32614786108971217, 0.19100989626378057, 0.15383732119758886], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 675.9120000000004, 538, 879, 679.0, 798.8000000000001, 829.95, 848.0, 0.32600198339606695, 0.29789386316751354, 0.14358095167150997], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 248.06399999999996, 177, 319, 242.0, 292.90000000000003, 300.0, 311.99, 0.3260831994761799, 0.2887332986299288, 0.1340635029096404], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.690000000000004, 3, 33, 4.0, 6.0, 6.0, 12.990000000000009, 0.3261667964810517, 0.21745833361872927, 0.15257216358830444], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 986.6100000000006, 804, 8706, 936.5, 1085.0, 1106.9, 1145.93, 0.32599348143434526, 0.24503949472151357, 0.18018780321468694], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 135.68799999999993, 117, 173, 138.0, 152.0, 153.0, 158.99, 0.327934009183464, 6.340498385703849, 0.1652479968151049], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 183.86999999999992, 160, 227, 178.0, 205.90000000000003, 207.95, 217.0, 0.3279172336902166, 0.6355670047629978, 0.23440958502074075], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 7.514000000000001, 5, 36, 7.0, 9.0, 10.0, 16.99000000000001, 0.3278748724566746, 0.2675862399030933, 0.20236027284435387], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 7.364, 5, 36, 7.0, 9.0, 10.949999999999989, 15.0, 0.32787594747951926, 0.2727101789333802, 0.20748399801438325], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.483999999999996, 5, 24, 8.0, 10.0, 12.0, 16.99000000000001, 0.32787014243990464, 0.26534107982556, 0.2001160537352934], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 10.021999999999998, 7, 21, 10.0, 12.0, 14.0, 18.99000000000001, 0.32787293743331886, 0.29319973392291443, 0.22797415180910452], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 7.9780000000000095, 5, 30, 8.0, 9.0, 11.0, 25.99000000000001, 0.32785337348007176, 0.24611735032018162, 0.18089566017210992], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1627.1860000000008, 1414, 1974, 1608.0, 1833.8000000000002, 1896.8, 1963.97, 0.3275318704886579, 0.273703414937353, 0.20854568316270014], "isController": false}]}, function(index, item){
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
