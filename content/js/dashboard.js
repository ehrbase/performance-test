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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9182458532151784, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.003, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.869, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.726, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.808, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 22005, 0, 0.0, 189.67557373324334, 1, 3786, 13.0, 573.0, 1245.9500000000007, 2127.0, 25.91903320416024, 174.26793068086786, 228.31647061876464], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query participation #2", 500, 0, 0.0, 6.767999999999999, 4, 25, 6.0, 8.0, 11.0, 19.0, 0.6000816110991095, 6.423396628816519, 0.2168263633854204], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 7.088000000000003, 4, 34, 7.0, 8.0, 10.0, 13.990000000000009, 0.6000621664404432, 6.44295655279887, 0.253151226467062], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 19.45, 12, 238, 18.0, 23.900000000000034, 29.94999999999999, 44.0, 0.5959326405417743, 0.32115182456696556, 6.634406349781472], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 40.961999999999975, 25, 66, 43.0, 51.0, 53.0, 55.0, 0.5998706678840042, 2.494969896990209, 0.24955557081893143], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.1060000000000008, 1, 8, 2.0, 3.0, 4.0, 5.0, 0.5999044952043635, 0.37494030950272716, 0.25367055314793885], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 36.04799999999995, 22, 62, 37.0, 45.0, 46.0, 48.0, 0.5998620317327015, 2.461449491616928, 0.21791862871539547], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 742.8680000000007, 556, 943, 743.0, 892.0, 902.95, 920.97, 0.5994988189873266, 2.5355755713223744, 0.29155313657782095], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 8.361999999999995, 5, 26, 8.0, 10.0, 12.0, 17.99000000000001, 0.5996915186827896, 0.8919240067909068, 0.30628775807724506], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.0460000000000003, 1, 22, 3.0, 4.0, 5.949999999999989, 10.980000000000018, 0.5969137173159894, 0.5759284694415991, 0.3264371891571817], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 12.531999999999998, 8, 33, 13.0, 15.0, 17.0, 22.980000000000018, 0.5998548351298986, 0.9776930857732429, 0.3918973483417013], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 604.0, 604, 604, 604.0, 604.0, 604.0, 604.0, 1.6556291390728477, 0.7065526697019868, 1958.2616540769868], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.0280000000000005, 2, 20, 4.0, 5.0, 6.0, 10.990000000000009, 0.5969279698957286, 0.5991664497828376, 0.3503454198313798], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 13.485999999999994, 9, 37, 14.0, 16.0, 18.0, 25.0, 0.5998411620602865, 0.9418443496162217, 0.3567414723581196], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 8.102, 5, 33, 8.0, 10.0, 11.0, 15.0, 0.599827489613987, 0.9284439170294624, 0.34267488420330317], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1849.6420000000005, 1455, 2275, 1827.0, 2094.7000000000003, 2161.85, 2221.96, 0.5986446684705825, 0.9143361928593664, 0.32972225880606304], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 16.409999999999975, 11, 70, 15.0, 21.0, 26.94999999999999, 38.99000000000001, 0.5958921578208463, 0.32180504226067186, 4.804380522430573], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 17.034000000000006, 11, 40, 18.0, 20.0, 22.0, 30.99000000000001, 0.5998670694574083, 1.0860874480215184, 0.5002797630045182], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 12.687999999999999, 8, 26, 13.0, 15.0, 17.0, 20.99000000000001, 0.5998641907472149, 1.0157856511285843, 0.42998077735200746], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 71.0, 71, 71, 71.0, 71.0, 71.0, 71.0, 14.084507042253522, 6.560849471830987, 1920.8846830985917], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 617.0, 617, 617, 617.0, 617.0, 617.0, 617.0, 1.6207455429497568, 0.7423141207455429, 3099.5840508508913], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 1.9740000000000004, 1, 17, 2.0, 3.0, 3.0, 7.990000000000009, 0.5968360527173349, 0.501831876357056, 0.25237305744785743], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 390.51000000000016, 308, 491, 391.5, 459.0, 465.0, 481.97, 0.5966252489418852, 0.5248670793523513, 0.2761722343734898], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 2.9239999999999986, 1, 21, 3.0, 4.0, 5.0, 12.990000000000009, 0.5968752387500955, 0.5409181851172741, 0.29144298767094506], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1120.366, 916, 1450, 1104.5, 1310.9, 1339.95, 1365.0, 0.5962282600270687, 0.5642042812170212, 0.3149995006588322], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 55.0, 55, 55, 55.0, 55.0, 55.0, 55.0, 18.18181818181818, 8.504971590909092, 1197.2123579545455], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 39.754000000000026, 26, 591, 39.0, 47.0, 52.0, 81.94000000000005, 0.5954805408868848, 0.32158275303754624, 27.237419505917885], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 39.59400000000005, 28, 174, 40.0, 46.0, 52.0, 73.97000000000003, 0.5962645220224339, 134.93221571747318, 0.18400350484286046], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 272.0, 272, 272, 272.0, 272.0, 272.0, 272.0, 3.676470588235294, 1.927992876838235, 1.5079273897058822], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 1.9700000000000006, 1, 20, 2.0, 3.0, 3.0, 7.0, 0.6001190636222227, 0.652277849425326, 0.25727760637710523], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 2.9119999999999977, 1, 18, 3.0, 4.0, 5.0, 9.990000000000009, 0.6001118608508625, 0.6159351228068912, 0.22093962064528827], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.9299999999999984, 1, 13, 2.0, 3.0, 3.0, 6.980000000000018, 0.6000952951328671, 0.3404837563205037, 0.23265413297631662], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 118.70399999999998, 84, 292, 118.0, 144.0, 148.0, 156.0, 0.6000240009600384, 0.5467015555622226, 0.19571095343813755], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 158.28200000000007, 107, 570, 161.0, 181.0, 202.95, 323.98, 0.5960143329526788, 0.32187102160432757, 176.31198213804646], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 2.0820000000000007, 1, 29, 2.0, 3.0, 4.0, 6.0, 0.60010897979073, 0.333951270550732, 0.25141284407248354], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 444.44200000000006, 342, 595, 448.5, 518.0, 525.0, 545.98, 0.5998793042839781, 0.6519235204876779, 0.2577606385595218], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 11.072000000000001, 6, 330, 9.0, 14.0, 17.94999999999999, 39.97000000000003, 0.595271402090355, 0.2517114424854724, 0.43192055835266974], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 2.6419999999999995, 1, 13, 2.0, 3.0, 4.0, 8.0, 0.6001219447791791, 0.6388016795012746, 0.24379954006654153], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.294, 2, 26, 3.0, 4.0, 5.0, 10.990000000000009, 0.5968282161282082, 0.36660639447719046, 0.2984141080641041], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 3.7100000000000013, 2, 26, 3.0, 5.0, 6.0, 10.980000000000018, 0.5968111188298683, 0.34969401493937596, 0.28150368202619763], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 513.705999999999, 364, 861, 521.5, 618.0, 629.95, 677.98, 0.5962005332417569, 0.5442891664997305, 0.26258441454300036], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 14.542000000000012, 5, 113, 14.0, 23.0, 29.94999999999999, 52.99000000000001, 0.5963832931569789, 0.5282418426693163, 0.24519274064364072], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 6.858000000000006, 4, 34, 7.0, 8.0, 9.0, 14.980000000000018, 0.5969386597771986, 0.398153422488112, 0.2792320488606232], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 501.2739999999997, 334, 3786, 492.0, 540.0, 565.8, 618.8300000000002, 0.596725647029619, 0.44870971505156904, 0.3298307775573871], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 12.752, 8, 35, 13.0, 15.0, 16.0, 19.99000000000001, 0.5996749761629198, 0.48957839850800866, 0.370111899350552], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 12.473999999999998, 8, 35, 13.0, 15.0, 16.0, 19.0, 0.5996800107462658, 0.49827318392905545, 0.37948500680037134], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 12.832000000000004, 8, 24, 14.0, 16.0, 17.0, 19.0, 0.5996598729200797, 0.48546683071361924, 0.36600334040532206], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 15.366000000000005, 10, 31, 16.0, 19.0, 20.0, 24.0, 0.5996649072498288, 0.5364189990633235, 0.4169545058221466], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 12.231999999999994, 8, 37, 13.0, 15.0, 16.0, 23.950000000000045, 0.5994283850919763, 0.45015666810129856, 0.33073929450875644], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2095.566000000002, 1651, 2618, 2073.5, 2375.8, 2461.85, 2575.98, 0.5982714740571541, 0.49943983094044686, 0.3809306651223286], "isController": false}]}, function(index, item){
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
