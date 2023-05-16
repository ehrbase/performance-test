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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8772176132737716, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.091, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.509, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [0.5, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.845, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.846, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [0.843, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.496, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.102, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 361.0422037864271, 1, 25333, 10.0, 870.9000000000015, 1542.9500000000007, 6332.960000000006, 13.71808160463911, 86.41379131091138, 113.51829594601654], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6987.647999999997, 5076, 25333, 6402.0, 8371.2, 8756.75, 22517.36000000012, 0.29600458925515183, 0.17196132233834152, 0.14915856255435384], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.6299999999999994, 1, 10, 2.0, 4.0, 4.0, 6.0, 0.29681411600445456, 0.15238100480927913, 0.10724728800942207], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.947999999999998, 2, 18, 4.0, 5.0, 5.0, 8.0, 0.29681129687540814, 0.17035055399086535, 0.1252172658693128], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 13.051999999999992, 8, 400, 11.0, 15.900000000000034, 20.0, 39.97000000000003, 0.2948492200058734, 0.15338782030207893, 3.2442052361388436], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 34.22199999999998, 24, 55, 34.0, 41.0, 42.0, 44.0, 0.2967080831589679, 1.2339782039354767, 0.12343519865793001], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.347999999999999, 1, 8, 2.0, 3.0, 4.0, 6.0, 0.29671530226091125, 0.18536303321223394, 0.12546652917868611], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 30.25800000000002, 21, 51, 30.0, 36.0, 37.0, 39.99000000000001, 0.2967057942487735, 1.2177425864719367, 0.10778765181693727], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 948.346, 743, 1353, 940.0, 1164.7, 1227.95, 1284.98, 0.2965810140698033, 1.2543030892990603, 0.14423568848316606], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 5.563999999999997, 4, 42, 5.0, 7.0, 7.0, 13.990000000000009, 0.2965957921361778, 0.44104431508171804, 0.15148398367892674], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.8620000000000023, 2, 14, 4.0, 5.0, 5.0, 9.0, 0.29510137617575766, 0.2846431447876539, 0.16138356509611745], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 8.246000000000004, 6, 19, 8.0, 10.0, 11.0, 14.0, 0.2967047378405948, 0.4835099248847451, 0.19384323204624798], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 524.0, 524, 524, 524.0, 524.0, 524.0, 524.0, 1.9083969465648853, 0.8256053196564885, 2257.2328989742364], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.119999999999997, 2, 17, 4.0, 5.0, 6.0, 10.990000000000009, 0.29510329205428487, 0.29646065192301113, 0.1732002719967043], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 12.650000000000006, 6, 23, 13.0, 16.0, 16.0, 18.99000000000001, 0.2967036814399386, 0.46612322204027695, 0.1764575605438697], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.899999999999998, 4, 27, 7.0, 8.0, 9.0, 12.990000000000009, 0.2967038575061922, 0.45916950198109163, 0.16950366859484614], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1815.8000000000013, 1377, 2685, 1683.0, 2331.0, 2432.6, 2591.99, 0.2963438869293972, 0.4525350580374685, 0.16322065647283207], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 11.369999999999996, 6, 79, 10.0, 14.0, 19.0, 39.0, 0.29484035279417253, 0.1533832073603356, 2.377150344403016], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 11.296, 8, 26, 11.0, 14.0, 14.0, 19.99000000000001, 0.29670702673448995, 0.5371179516874915, 0.24744902424927187], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 8.138000000000009, 6, 18, 8.0, 10.0, 11.0, 15.990000000000009, 0.2967057942487735, 0.502345510299845, 0.21267778611191385], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 57.0, 57, 57, 57.0, 57.0, 57.0, 57.0, 17.543859649122805, 8.275082236842104, 2392.6809210526317], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 526.0, 526, 526, 526.0, 526.0, 526.0, 526.0, 1.9011406844106464, 0.8818767823193916, 3635.8238771387832], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.373999999999999, 1, 21, 2.0, 3.0, 4.0, 7.0, 0.29507229271171437, 0.24801921197255827, 0.12477178002360578], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 598.6600000000009, 488, 748, 586.0, 693.0, 705.0, 731.0, 0.2949843805770484, 0.2597562166114554, 0.13654550429054782], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.3480000000000008, 2, 11, 3.0, 4.0, 5.0, 9.0, 0.29510137617575766, 0.2673520485273556, 0.14409246883581917], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 794.3679999999999, 653, 1001, 770.5, 916.9000000000001, 936.9, 972.94, 0.2949807259593658, 0.27905349516025124, 0.155844309320329], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 83.0, 83, 83, 83.0, 83.0, 83.0, 83.0, 12.048192771084338, 5.706419427710843, 793.3334902108434], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 22.749999999999996, 15, 609, 20.0, 27.0, 36.0, 57.930000000000064, 0.29474006873338404, 0.15333103712398535, 13.444637314976921], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 30.02399999999999, 20, 284, 29.0, 34.0, 41.0, 87.94000000000005, 0.2949539281964157, 66.70991140597901, 0.09102093877936265], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 1088.0, 1088, 1088, 1088.0, 1088.0, 1088.0, 1088.0, 0.9191176470588235, 0.48199821920955876, 0.37698184742647056], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.7119999999999993, 2, 10, 3.0, 4.0, 4.0, 7.0, 0.2967545732847289, 0.3224626769918464, 0.12722193132030857], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.367999999999999, 2, 11, 3.0, 4.0, 5.0, 7.0, 0.29675316427899073, 0.3044936691792757, 0.1092538505206831], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.845999999999999, 1, 16, 2.0, 3.0, 3.0, 5.990000000000009, 0.2968153493902522, 0.1683238686957162, 0.11507391963665052], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 154.36199999999997, 66, 265, 154.0, 225.90000000000003, 249.0, 259.99, 0.2967852224702028, 0.27032670395525665, 0.09680299248539817], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 80.84999999999995, 57, 290, 79.0, 94.90000000000003, 101.0, 206.54000000000042, 0.29490713079544123, 0.15341794691996044, 87.20208020854652], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 227.3840000000001, 14, 423, 281.0, 354.90000000000003, 393.95, 414.0, 0.29674858510274627, 0.16538807129295732, 0.12432142871980285], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 466.0500000000001, 295, 797, 435.5, 683.9000000000001, 728.0, 776.95, 0.29677201083811383, 0.15960479891470475, 0.12635995773966566], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 8.038, 4, 299, 6.0, 9.0, 12.0, 46.99000000000001, 0.2946910812333647, 0.13287287023071953, 0.21382370444959958], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 466.9320000000005, 281, 859, 424.5, 708.8000000000001, 730.9, 798.7500000000002, 0.29670174472493965, 0.15261306246491502, 0.11937609260417495], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.527999999999999, 2, 17, 3.0, 4.0, 5.949999999999989, 9.0, 0.29507072550219565, 0.18116593342820841, 0.1475353627510978], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.224000000000004, 2, 24, 4.0, 5.0, 6.0, 9.0, 0.29506706874472566, 0.17280729667665962, 0.13917714277705323], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 766.8719999999992, 593, 1183, 758.0, 955.7, 1016.95, 1098.95, 0.2949360077344019, 0.2695064177706613, 0.12989857371896021], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 433.97600000000034, 249, 907, 345.0, 747.8000000000001, 785.95, 831.98, 0.2949574081502631, 0.2611726870546143, 0.12126666878052808], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.782000000000002, 3, 48, 4.0, 6.0, 7.0, 11.990000000000009, 0.2951045112626637, 0.19674882898841123, 0.13804205165509364], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 995.2119999999994, 819, 9172, 946.0, 1090.3000000000002, 1119.9, 1145.95, 0.29496349826708945, 0.22171518969839982, 0.16303646486247328], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 135.84599999999983, 119, 165, 135.0, 152.0, 153.0, 157.0, 0.2968708623623558, 5.739902452502147, 0.14959508298728086], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 184.198, 162, 252, 180.5, 205.0, 207.0, 213.0, 0.2968539419234948, 0.5753603389404096, 0.21220418504687324], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 7.424000000000008, 5, 18, 7.0, 9.0, 10.0, 14.990000000000009, 0.2965915696812234, 0.2420552155256789, 0.18305260941263007], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 7.499999999999996, 5, 44, 7.0, 9.0, 10.0, 20.940000000000055, 0.29659244934942447, 0.24669019046425616, 0.18768740935393266], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.922000000000004, 6, 42, 9.0, 10.0, 11.0, 16.980000000000018, 0.29658787513175916, 0.24002474414105485, 0.1810228730052241], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 10.062000000000012, 7, 36, 10.0, 12.0, 13.0, 18.0, 0.2965896344295484, 0.26522470131199394, 0.20622248018929537], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 8.558000000000002, 5, 48, 8.0, 10.0, 12.0, 20.960000000000036, 0.2965671169939482, 0.22263096533634566, 0.16363322373201244], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1623.4700000000012, 1444, 2017, 1599.0, 1802.9, 1888.6499999999999, 1971.97, 0.29630876321314853, 0.2476116911807845, 0.1886653453271219], "isController": false}]}, function(index, item){
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
