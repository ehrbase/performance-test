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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8901935758349288, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.193, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.589, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.954, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.997, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.496, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.11, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 325.8315677515417, 1, 20950, 9.0, 848.0, 1505.0, 6044.990000000002, 15.222154078896155, 95.88828299703846, 125.96462402437034], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6217.238000000002, 5287, 20950, 6036.5, 6531.9, 6731.5, 19420.47000000011, 0.32844432999984235, 0.19075110106856077, 0.16550515066398305], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.396000000000003, 1, 7, 2.0, 3.0, 4.0, 5.0, 0.32957877196312935, 0.16920200801634447, 0.1190860797132401], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.6699999999999986, 2, 15, 4.0, 5.0, 5.0, 6.990000000000009, 0.3295759478109895, 0.1891553518437467, 0.1390398529827612], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 13.316000000000011, 8, 362, 12.0, 15.0, 17.94999999999999, 50.840000000000146, 0.3273804652076411, 0.17031137462965085, 3.6021442397407144], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 33.32599999999998, 24, 58, 33.0, 39.0, 41.0, 46.0, 0.32951274291679405, 1.370409388073418, 0.13708244968999442], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.2439999999999998, 1, 13, 2.0, 3.0, 4.0, 6.0, 0.32952099510068183, 0.2058573005623605, 0.13933846765487815], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 29.431999999999984, 21, 48, 29.0, 35.0, 36.0, 38.0, 0.3295136115482658, 1.3523927249902465, 0.11970611669526846], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 860.414, 688, 1099, 857.0, 1003.9000000000001, 1067.0, 1084.99, 0.3293673117435256, 1.39296319398516, 0.1601805871565193], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 5.623999999999999, 3, 15, 5.0, 8.0, 8.0, 11.0, 0.3294882059696673, 0.4899560411250704, 0.16828352707239844], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.905999999999999, 2, 14, 4.0, 5.0, 6.0, 10.980000000000018, 0.32756148165229876, 0.3159528818777265, 0.17913518527860087], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 7.763999999999996, 5, 26, 8.0, 9.0, 10.0, 14.990000000000009, 0.3295110056675893, 0.536971006120667, 0.2152762331949387], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 481.0, 481, 481, 481.0, 481.0, 481.0, 481.0, 2.079002079002079, 0.8994120322245323, 2459.022950233888], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.171999999999996, 2, 16, 4.0, 5.0, 6.0, 10.0, 0.32756384219284335, 0.3290705079123046, 0.1922518253495106], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 8.116000000000003, 5, 19, 8.0, 10.0, 11.0, 13.0, 0.3295092684367026, 0.5176609914324295, 0.1959679145292499], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.618000000000002, 4, 14, 6.0, 8.0, 9.0, 12.0, 0.3295079655255586, 0.5099361016093829, 0.1882442967113787], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1569.456000000001, 1341, 1952, 1542.5, 1773.8000000000002, 1828.95, 1907.94, 0.3291894959582114, 0.5026922917234519, 0.1813114020707336], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 11.669999999999991, 8, 97, 11.0, 14.0, 18.0, 33.99000000000001, 0.3273613886408217, 0.17030145053012902, 2.639351195916625], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 11.03599999999999, 8, 29, 11.0, 13.0, 14.0, 19.980000000000018, 0.32951534882494826, 0.5965096653030223, 0.2748106522426814], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 7.795999999999998, 5, 24, 8.0, 10.0, 10.0, 18.960000000000036, 0.3295129600742327, 0.5578905410256816, 0.23619386005320975], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 44.0, 44, 44, 44.0, 44.0, 44.0, 44.0, 22.727272727272727, 10.719992897727273, 3099.609375], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 420.0, 420, 420, 420.0, 420.0, 420.0, 420.0, 2.3809523809523814, 1.1044456845238095, 4553.436569940476], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.3160000000000034, 1, 19, 2.0, 3.0, 4.0, 8.990000000000009, 0.32759367377304704, 0.2753546396027337, 0.13852349682004822], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 566.4459999999999, 443, 714, 552.0, 655.0, 667.9, 690.97, 0.3274934697802126, 0.2883829459331206, 0.15159365690998122], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.4100000000000006, 2, 25, 3.0, 4.0, 5.0, 8.990000000000009, 0.3275975372527539, 0.296792491489016, 0.15995973498669627], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 770.3900000000007, 584, 956, 759.0, 890.0, 908.0, 929.98, 0.3274261293909481, 0.30974703691631383, 0.17298587500049115], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 53.0, 53, 53, 53.0, 53.0, 53.0, 53.0, 18.867924528301884, 8.936468160377359, 1242.3901827830189], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 22.86999999999999, 16, 562, 21.0, 25.0, 29.0, 63.0, 0.32724312069511674, 0.1702399246342731, 14.927271648114164], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 29.936000000000032, 20, 231, 29.0, 34.0, 38.94999999999999, 110.93000000000006, 0.3275054824417761, 74.0721164564873, 0.10106614497226683], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 439.0, 439, 439, 439.0, 439.0, 439.0, 439.0, 2.277904328018223, 1.194565062642369, 0.9342966970387244], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.764, 1, 8, 3.0, 4.0, 4.0, 7.0, 0.3295314195027239, 0.3580790095653085, 0.14127372379071854], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.398000000000001, 2, 9, 3.0, 4.0, 5.0, 7.0, 0.32953011641639957, 0.33812557482409683, 0.1213211463759596], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.8540000000000003, 1, 10, 2.0, 3.0, 3.0, 5.0, 0.32957985818837865, 0.1869046088364974, 0.1277765661140491], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 92.12200000000006, 67, 119, 90.0, 112.0, 115.0, 118.0, 0.32956074166985794, 0.30018027281532533, 0.10749344503684818], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 80.48799999999989, 56, 333, 79.0, 91.0, 98.0, 293.8100000000002, 0.3274445701831594, 0.17034472361549885, 96.82318496656136], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 204.06399999999996, 13, 376, 260.0, 336.0, 339.0, 349.98, 0.3295257728697477, 0.18365591194774775, 0.13805327789172045], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 426.5799999999999, 321, 576, 417.0, 499.90000000000003, 513.0, 528.97, 0.3294736592398911, 0.17719183484375042, 0.14028370647323488], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 7.801999999999993, 4, 347, 6.0, 8.900000000000034, 11.0, 31.99000000000001, 0.3271735282589591, 0.14751883762933987, 0.23739251122695962], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 402.98399999999975, 286, 510, 404.0, 469.0, 477.0, 492.97, 0.3294606334078354, 0.16946309592015718, 0.13255642672268375], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.5179999999999993, 2, 16, 3.0, 4.900000000000034, 5.0, 11.980000000000018, 0.32759152743480763, 0.20113288009134564, 0.16379576371740384], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.223999999999997, 2, 36, 4.0, 5.0, 6.0, 10.990000000000009, 0.3275840154724482, 0.1918509862490058, 0.15451472604803954], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 678.9680000000004, 537, 868, 679.0, 805.9000000000001, 838.95, 855.98, 0.32742098349405335, 0.29919051607931707, 0.1442059214412286], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 244.46999999999997, 178, 313, 238.5, 287.90000000000003, 293.0, 302.99, 0.3275067695649269, 0.28999381155489734, 0.1346487792840178], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.466000000000001, 3, 38, 4.0, 5.0, 6.0, 10.990000000000009, 0.3275659881683165, 0.21839118728749154, 0.15322666829357773], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 991.2940000000007, 724, 9765, 926.5, 1086.9, 1110.0, 1141.97, 0.3273845380211307, 0.24608511011742626, 0.1809566880077734], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 134.97200000000007, 118, 169, 137.0, 151.0, 152.0, 155.99, 0.32955270470495807, 6.371795341962011, 0.16606366760523275], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 182.86599999999987, 160, 223, 180.0, 204.0, 207.95, 214.98000000000002, 0.32952968205658156, 0.6386922414790215, 0.23556223365763446], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 7.146, 5, 30, 7.0, 9.0, 10.0, 14.0, 0.32948451488676933, 0.2688999061875215, 0.20335372403167798], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 7.028000000000003, 5, 33, 7.0, 9.0, 10.0, 13.0, 0.32948625185665503, 0.2740495464539372, 0.20850301875303953], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.386, 6, 19, 8.0, 10.0, 11.0, 15.990000000000009, 0.32948104100193865, 0.2666447592663248, 0.20109926818965984], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 9.893999999999998, 7, 28, 10.0, 12.0, 13.0, 17.0, 0.32948212658307924, 0.29463874817714014, 0.2290930411397973], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 7.8660000000000005, 5, 29, 8.0, 9.0, 10.0, 14.0, 0.32948972585136854, 0.24734574917891158, 0.18179853037697577], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1613.7519999999988, 1418, 2069, 1586.5, 1812.6000000000001, 1864.75, 1958.94, 0.32915742282904226, 0.2750618147353904, 0.20958070281692923], "isController": false}]}, function(index, item){
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
