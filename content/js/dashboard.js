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

    var data = {"OkPercent": 97.7791959157626, "KoPercent": 2.2208040842373964};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8769623484365029, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [0.996, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.39, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.001, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [0.998, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.814, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.32, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.993, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [0.5, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.894, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.528, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.498, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [0.943, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [0.844, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 522, 2.2208040842373964, 288.46249734098996, 1, 6880, 31.0, 814.9000000000015, 1866.9500000000007, 3618.0, 16.66201174740943, 109.8054459642293, 138.01421305089906], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 47.11200000000003, 18, 119, 40.0, 77.90000000000003, 84.0, 96.99000000000001, 0.3611026051386345, 0.20965673676631175, 0.18196185962064007], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 15.012000000000015, 5, 63, 13.0, 24.0, 30.0, 55.92000000000007, 0.3610585369763658, 3.861049984402271, 0.13046060418091343], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 16.01400000000002, 5, 57, 14.0, 27.0, 32.0, 42.97000000000003, 0.3610449797056617, 3.8769207367267233, 0.15231585081332605], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 2, 0.4, 71.99999999999993, 15, 284, 67.5, 132.0, 147.84999999999997, 180.95000000000005, 0.3585535090914828, 0.193300958790011, 3.9917089879325234], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 66.84399999999994, 25, 160, 56.0, 112.0, 120.94999999999999, 136.98000000000002, 0.36112946852576117, 1.5019409862536066, 0.15023550155466237], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 7.227999999999997, 1, 42, 6.0, 14.900000000000034, 16.0, 21.0, 0.3611456406470863, 0.2256955698896267, 0.15271099843768396], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 58.852, 23, 150, 52.0, 95.0, 107.94999999999999, 136.9000000000001, 0.3611315551697065, 1.4822002827028096, 0.13119232277649495], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1144.9179999999997, 572, 2548, 915.5, 2236.7000000000007, 2331.6, 2408.95, 0.3608513783079246, 1.5260136969259792, 0.17549217421615862], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 23.634000000000015, 8, 111, 20.0, 39.900000000000034, 44.0, 59.99000000000001, 0.361047326083503, 0.5369055807085193, 0.18440210111491415], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 11.615999999999993, 2, 96, 8.0, 24.0, 28.94999999999999, 39.98000000000002, 0.3591871451231006, 0.3464984382991914, 0.19643046998919567], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 35.73599999999998, 13, 100, 29.0, 61.900000000000034, 68.0, 81.95000000000005, 0.36112816438554046, 0.5883715884673721, 0.23593236520891264], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 784.0, 784, 784, 784.0, 784.0, 784.0, 784.0, 1.2755102040816326, 0.5443339445153061, 1508.6607641103317], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 11.281999999999996, 3, 44, 9.0, 22.0, 24.0, 32.0, 0.35920314374591406, 0.3609163743651084, 0.2108213763586859], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 37.51600000000001, 14, 100, 32.0, 62.0, 68.0, 83.98000000000002, 0.36112425202139303, 0.567389678798034, 0.21477018504006673], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 23.03199999999998, 7, 66, 19.0, 43.900000000000034, 46.0, 57.99000000000001, 0.36111747079101336, 0.5588948796521861, 0.20630246134056918], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2867.733999999999, 1500, 5963, 2607.5, 4315.1, 4766.7, 5764.67, 0.3603037504737994, 0.5502464578988671, 0.19844855006564732], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 1, 0.2, 72.15599999999999, 11, 231, 64.0, 136.0, 152.95, 188.99, 0.35853294057244806, 0.1934355240353313, 2.8906718333653627], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 41.90399999999997, 16, 94, 37.0, 68.0, 73.0, 83.97000000000003, 0.36113729356489455, 0.6538150882258408, 0.3011828600629101], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 38.396, 13, 99, 32.0, 65.0, 68.94999999999999, 83.97000000000003, 0.36113807608745896, 0.611352451035094, 0.2588626443830028], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 273.0, 273, 273, 273.0, 273.0, 273.0, 273.0, 3.663003663003663, 1.706301510989011, 499.5707417582417], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 1033.0, 1033, 1033, 1033.0, 1033.0, 1033.0, 1033.0, 0.968054211035818, 0.4433763915779284, 1851.3488474104552], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 9.035999999999992, 1, 52, 7.0, 19.0, 21.0, 28.0, 0.35936295011107905, 0.3018339953397812, 0.15195718495907934], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 600.904, 317, 1379, 469.0, 1171.8000000000002, 1208.0, 1275.99, 0.35921578882709576, 0.3162151331684772, 0.16627762100004237], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 11.478000000000003, 2, 53, 9.0, 24.0, 28.0, 36.0, 0.35931388295422123, 0.3255467993756562, 0.17544623191124087], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1699.1519999999991, 922, 3772, 1339.0, 3172.2000000000003, 3465.65, 3587.9700000000003, 0.35887494141366577, 0.33953845116214476, 0.18960092119608712], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 147.0, 147, 147, 147.0, 147.0, 147.0, 147.0, 6.802721088435374, 3.182132227891157, 447.9365965136055], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 3, 0.6, 103.40200000000013, 30, 1012, 91.5, 179.0, 194.0, 235.96000000000004, 0.358276546500713, 0.19300609473190167, 16.3876532080082], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 124.78599999999994, 10, 310, 108.0, 232.0, 251.0, 287.96000000000004, 0.358694466922631, 78.719180887333, 0.11069087065190568], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 562.0, 562, 562, 562.0, 562.0, 562.0, 562.0, 1.779359430604982, 0.9331211076512455, 0.7298153914590747], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 9.596000000000005, 1, 48, 8.0, 20.0, 23.0, 31.99000000000001, 0.36105410467969445, 0.3923529823791155, 0.15478784370545495], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 11.763999999999996, 2, 55, 10.0, 23.0, 27.0, 43.0, 0.3610465439541673, 0.3703822767577009, 0.13292436237375105], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 6.646000000000001, 1, 38, 5.0, 13.0, 16.0, 19.980000000000018, 0.3610627086491127, 0.20479942266975545, 0.13998231966181424], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 196.12200000000016, 85, 472, 147.0, 364.0, 384.0, 435.95000000000005, 0.3610097876973641, 0.32888696756471464, 0.11775123934660117], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 16, 3.2, 320.35599999999977, 27, 1433, 274.5, 523.0, 556.8, 645.96, 0.35859671066409243, 0.19130504168148865, 106.07949062592338], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 7.036000000000008, 1, 23, 6.0, 13.0, 16.0, 18.0, 0.36104159054706464, 0.2013025466700412, 0.15125668197723705], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 10.850000000000003, 2, 57, 9.0, 20.900000000000034, 24.0, 31.980000000000018, 0.3610833076964185, 0.1942529461689783, 0.1537425021051157], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 62.096000000000046, 7, 392, 49.5, 132.90000000000003, 146.95, 175.99, 0.35818414963501033, 0.15137757623949624, 0.2598933820105593], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 12.056000000000004, 2, 93, 10.5, 22.0, 24.0, 34.99000000000001, 0.3610595798855152, 0.18577784735195293, 0.14527006534456274], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 10.288, 2, 43, 8.0, 20.0, 23.0, 28.99000000000001, 0.3593598507362924, 0.22069888708051025, 0.1796799253681462], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 12.125999999999994, 2, 52, 9.0, 24.0, 28.0, 40.0, 0.3593513277312857, 0.21049635694115837, 0.16949872196700294], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 811.4040000000005, 376, 2465, 632.0, 1555.9, 1628.85, 1698.95, 0.3587168554593477, 0.327808353905745, 0.15798955255094319], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 32.79999999999999, 7, 269, 29.0, 55.0, 64.94999999999999, 95.97000000000003, 0.35874439461883406, 0.3176737668161435, 0.14749159192825112], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 22.083999999999985, 7, 84, 19.0, 37.900000000000034, 40.0, 49.99000000000001, 0.3592083048960092, 0.23928394630733862, 0.16802810355975428], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 833.7560000000007, 461, 6207, 808.0, 997.9000000000001, 1104.85, 1336.6000000000004, 0.3590690058815503, 0.26979968213416256, 0.19846978254781003], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 271.2400000000001, 143, 581, 198.0, 505.0, 531.0, 568.96, 0.3610574940732412, 6.981012093575632, 0.18193912787284422], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 432.30600000000004, 218, 877, 362.5, 734.7, 775.95, 849.9100000000001, 0.36100066496322486, 0.6997504334715484, 0.25805906909480525], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 35.81000000000002, 12, 104, 29.0, 61.0, 66.94999999999999, 84.96000000000004, 0.360996234087286, 0.2944537700551458, 0.2228023632257468], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 35.651999999999994, 13, 115, 29.0, 61.0, 64.0, 79.96000000000004, 0.3610196929022085, 0.30017518254960773, 0.2284577744146788], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 36.85800000000001, 13, 105, 29.0, 65.0, 68.94999999999999, 92.0, 0.36096157275288787, 0.2921624379868018, 0.22031345993218251], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 39.146000000000036, 15, 106, 32.0, 68.0, 76.0, 88.98000000000002, 0.36097955411805477, 0.32286659955455127, 0.25099359622270995], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 35.760000000000005, 13, 87, 28.0, 65.0, 72.0, 80.0, 0.360634312479534, 0.2707462100940102, 0.19898279936614915], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 3169.528000000001, 1655, 6880, 2802.0, 4806.300000000002, 5583.4, 6537.76, 0.36021886898479516, 0.3010592517263489, 0.22935810798641254], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["No results for path: $['rows'][1]", 500, 95.78544061302682, 2.1272069772388855], "isController": false}, {"data": ["500", 22, 4.21455938697318, 0.09359710699851095], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 23505, 522, "No results for path: $['rows'][1]", 500, "500", 22, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Query cross patient #1", 500, 500, "No results for path: $['rows'][1]", 500, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 2, "500", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 3, "500", 3, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 16, "500", 16, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
