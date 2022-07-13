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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8883641778345033, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.471, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.002, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.842, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.36, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [0.993, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.99, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.602, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.528, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [0.991, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [0.977, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 227.53099340565856, 1, 6592, 18.0, 651.9000000000015, 1516.9000000000015, 2786.9900000000016, 21.508967789165446, 144.88615111411056, 178.16235566034499], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 30.06400000000002, 15, 123, 26.0, 50.0, 63.94999999999999, 100.97000000000003, 0.4661074620075808, 0.27070192258840664, 0.2348744632772575], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 9.50399999999999, 4, 41, 7.0, 15.0, 21.0, 31.970000000000027, 0.46596020886200407, 4.990247270812811, 0.16836452859271628], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 9.929999999999993, 5, 88, 8.0, 16.0, 20.94999999999999, 30.99000000000001, 0.4659241699094989, 5.003092826480055, 0.19656175918056984], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 28.309999999999995, 13, 250, 23.0, 44.0, 53.94999999999999, 102.8900000000001, 0.4627089015013053, 0.24974984077029924, 5.151251442495], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 56.89600000000003, 26, 262, 51.0, 80.0, 113.0, 194.83000000000015, 0.4657696564110399, 1.9370877865764253, 0.19376745471787402], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 3.2100000000000004, 1, 20, 3.0, 5.0, 8.0, 15.990000000000009, 0.46579655869502434, 0.29099093414335353, 0.196962802651314], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 48.428000000000026, 24, 196, 45.0, 68.90000000000003, 87.94999999999999, 140.8900000000001, 0.4657618466525696, 1.9115839556105672, 0.16920254585425382], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 931.4940000000009, 571, 3148, 878.5, 1282.2000000000003, 1570.6999999999998, 2293.600000000002, 0.4655480478173711, 1.9688999864874681, 0.22640910919243243], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 13.737999999999992, 6, 138, 11.0, 22.900000000000034, 31.0, 45.98000000000002, 0.46511974042597526, 0.6916430468203485, 0.2375562736745948], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 4.199999999999999, 1, 30, 3.0, 7.0, 10.0, 19.980000000000018, 0.4636408230180978, 0.4472096458039114, 0.2535535750880222], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 21.342, 10, 104, 18.0, 35.0, 53.94999999999999, 83.98000000000002, 0.4657531694503181, 0.7589911830014066, 0.3042860062131473], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 993.0, 993, 993, 993.0, 993.0, 993.0, 993.0, 1.0070493454179255, 0.4297661757301108, 1191.1279346047331], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 5.394000000000005, 2, 57, 4.0, 9.0, 11.0, 25.910000000000082, 0.4636524313006192, 0.46578505137037113, 0.2721241320426486], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 22.744000000000018, 11, 109, 19.0, 35.0, 51.94999999999999, 95.98000000000002, 0.4657483971268913, 0.7316934608808606, 0.2769929432131609], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 13.37, 6, 56, 11.0, 21.0, 37.0, 45.0, 0.4657358160157233, 0.7207580126936297, 0.266069777704295], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2370.4759999999983, 1475, 6592, 2252.0, 3067.7000000000003, 3303.95, 4627.52, 0.46449191551821045, 0.7093072785302548, 0.25583343784401436], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 24.692, 12, 514, 19.0, 38.0, 46.94999999999999, 92.97000000000003, 0.462693486848863, 0.24974152062132335, 3.7304662377189586], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 26.31399999999998, 14, 106, 23.0, 38.0, 53.94999999999999, 89.98000000000002, 0.4657618466525696, 0.8431517507405614, 0.3884381025793891], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 21.656000000000002, 10, 171, 18.0, 36.0, 49.89999999999998, 87.97000000000003, 0.46575794187154584, 0.7885636732442556, 0.3338538372399557], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 102.0, 102, 102, 102.0, 102.0, 102.0, 102.0, 9.803921568627452, 4.56686580882353, 1337.0863970588236], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 619.0, 619, 619, 619.0, 619.0, 619.0, 619.0, 1.6155088852988693, 0.7399156906300485, 3089.5692397011308], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.9299999999999993, 1, 23, 2.0, 5.0, 8.0, 15.970000000000027, 0.463328048304729, 0.38944441841441735, 0.19591898917573017], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 494.92800000000017, 304, 2009, 457.0, 691.3000000000006, 796.55, 1382.3100000000006, 0.46320614618971256, 0.4078882950007087, 0.2144137825135974], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.866, 1, 21, 3.0, 7.0, 9.0, 15.0, 0.46361760819675935, 0.4200221594728668, 0.2263757852523239], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1407.2399999999986, 904, 5032, 1298.5, 1944.6000000000004, 2269.6, 3051.120000000001, 0.4632344698327816, 0.4382225227262831, 0.24473617986282703], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 66.0, 66, 66, 66.0, 66.0, 66.0, 66.0, 15.151515151515152, 7.087476325757575, 997.6769649621211], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 54.41600000000003, 28, 676, 46.0, 75.90000000000003, 104.0, 159.8800000000001, 0.4624114944399642, 0.24958931356632091, 21.15081013337797], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 58.87799999999995, 29, 247, 50.0, 91.0, 119.94999999999999, 192.9000000000001, 0.46290895691798917, 104.75426720325916, 0.14285081092391072], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 340.0, 340, 340, 340.0, 340.0, 340.0, 340.0, 2.941176470588235, 1.542394301470588, 1.2063419117647058], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 3.0580000000000003, 1, 38, 2.0, 6.0, 8.0, 13.990000000000009, 0.46598973890594925, 0.5063588304473036, 0.19977489783174976], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.9639999999999986, 2, 22, 3.0, 7.0, 9.0, 13.990000000000009, 0.4659853960176888, 0.4781401518063924, 0.17155907646354365], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.672000000000002, 1, 25, 2.0, 4.900000000000034, 6.0, 11.990000000000009, 0.4659771447530041, 0.2642554567671065, 0.1806571547528737], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 156.3020000000002, 83, 904, 138.0, 210.80000000000007, 263.95, 602.8500000000001, 0.46592764330070596, 0.4243900118974624, 0.15197249302972246], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 213.99800000000002, 112, 950, 192.0, 308.50000000000017, 404.69999999999993, 575.7900000000002, 0.46275686476671035, 0.24977572922383642, 136.891976524807], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 2.868000000000002, 1, 22, 2.0, 4.0, 7.0, 12.0, 0.4659810532103765, 0.259707077028998, 0.19522057795630027], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 3.9660000000000055, 2, 20, 3.0, 7.0, 8.0, 15.990000000000009, 0.4660192726930415, 0.2506264391257665, 0.1984222684513341], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 16.203999999999994, 7, 313, 12.0, 28.0, 35.94999999999999, 56.99000000000001, 0.46229306606630205, 0.19535042247807574, 0.3354333477414672], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 5.545999999999996, 2, 63, 4.0, 9.900000000000034, 12.0, 18.980000000000018, 0.4659923446777616, 0.23969026158713264, 0.18748910742894315], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 4.505999999999999, 2, 28, 4.0, 7.0, 9.949999999999989, 19.99000000000001, 0.46332246687707684, 0.28446823061551463, 0.23166123343853842], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 5.202000000000001, 2, 35, 4.0, 9.0, 12.0, 20.0, 0.46330872855112243, 0.27133874765565785, 0.21853331629901576], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 656.724, 367, 2436, 609.0, 870.5000000000002, 1252.0, 1973.1500000000008, 0.4628845297509774, 0.42297430013016313, 0.20386808878680743], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 21.763999999999985, 7, 139, 17.0, 40.900000000000034, 50.0, 77.91000000000008, 0.46298182518547054, 0.40995141671281055, 0.19034701992488584], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 11.508000000000004, 5, 79, 9.0, 17.0, 28.0, 53.97000000000003, 0.4636743596425256, 0.3091358613979967, 0.21689454909059547], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 643.7959999999997, 388, 4290, 612.5, 767.0, 796.95, 920.98, 0.4635419612089545, 0.3484305497677191, 0.2562155762151057], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 204.46800000000013, 142, 945, 187.0, 249.0, 292.9, 626.8900000000001, 0.46601102022860635, 9.010172896787413, 0.2348258656620712], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 316.21600000000024, 209, 1331, 283.0, 412.90000000000003, 476.1499999999998, 1007.4800000000014, 0.4659137500465914, 0.903030936381807, 0.333055532259868], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 22.513999999999978, 11, 164, 18.0, 36.0, 49.0, 84.98000000000002, 0.46510373208536704, 0.3795818749424434, 0.28705620964643747], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 21.272000000000006, 11, 99, 18.0, 32.0, 48.89999999999998, 81.92000000000007, 0.46511065447580635, 0.3868548784410049, 0.29432783603547125], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 21.87800000000002, 11, 104, 18.0, 35.900000000000034, 54.0, 83.94000000000005, 0.46507431422466994, 0.3763786474034436, 0.2838588343656433], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 25.16200000000003, 12, 108, 22.0, 44.0, 53.0, 84.98000000000002, 0.4650872922338794, 0.415903402706529, 0.32338100788136925], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 20.86200000000001, 10, 107, 18.0, 29.0, 47.0, 97.80000000000018, 0.4653872859916565, 0.3493631451314905, 0.2567810708840683], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2643.521999999999, 1696, 5582, 2483.5, 3602.3000000000006, 4003.499999999999, 5223.1, 0.4641405046135566, 0.38786100703404935, 0.295526961921913], "isController": false}]}, function(index, item){
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
