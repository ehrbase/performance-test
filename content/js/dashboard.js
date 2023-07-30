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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8916613486492235, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.194, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.635, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.975, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.999, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.497, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.108, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 323.24305466922084, 1, 18690, 9.0, 837.0, 1506.0, 6015.0, 15.299776019871159, 96.37724366610102, 126.60695221000562], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6173.320000000002, 5020, 18690, 6005.5, 6505.8, 6739.95, 15676.620000000077, 0.3299147566251832, 0.1916050829224245, 0.1662461078306587], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.272000000000002, 1, 12, 2.0, 3.0, 4.0, 7.0, 0.33099364955583965, 0.16992839014453168, 0.1195973147809186], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.6619999999999986, 2, 22, 3.0, 5.0, 5.0, 7.0, 0.3309914584344237, 0.18996776370751475, 0.13963702152702248], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 13.39199999999999, 8, 383, 11.0, 15.900000000000034, 18.0, 64.98000000000002, 0.32890798601746374, 0.171106028546253, 3.618951443807386], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 34.106, 24, 51, 34.0, 40.0, 42.0, 44.0, 0.33094085160347464, 1.376348744269759, 0.13767656521785174], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.2779999999999956, 1, 9, 2.0, 3.0, 4.0, 6.0, 0.3309498326386696, 0.20674991937234702, 0.13994265384037494], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 30.20399999999999, 21, 54, 30.0, 36.0, 37.0, 42.97000000000003, 0.330939318304717, 1.3582441234691573, 0.12022404922788547], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 852.7059999999999, 681, 1090, 850.0, 1010.4000000000002, 1055.0, 1079.99, 0.3307932819853948, 1.3989939201435246, 0.16087407659055333], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 5.674000000000001, 3, 24, 5.0, 8.0, 8.0, 10.990000000000009, 0.33087142931825264, 0.49201292396210594, 0.168989997591256], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.8479999999999994, 2, 25, 4.0, 5.0, 5.0, 10.990000000000009, 0.3291342387157972, 0.31746990129099617, 0.1799952867977016], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 7.648000000000003, 5, 28, 7.0, 9.0, 10.0, 15.0, 0.33094107064731415, 0.5393014394530073, 0.2162105236943878], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 423.0, 423, 423, 423.0, 423.0, 423.0, 423.0, 2.3640661938534278, 1.0227356678486998, 2796.193945774232], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 3.858000000000002, 2, 20, 4.0, 5.0, 6.0, 10.0, 0.32913900527609824, 0.33065291613044434, 0.19317631071380376], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 7.900000000000007, 5, 22, 8.0, 10.0, 11.0, 15.990000000000009, 0.3309399754310162, 0.519908640503545, 0.19681879398192273], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.701999999999989, 4, 17, 6.0, 8.0, 9.949999999999989, 13.980000000000018, 0.33093822310001747, 0.5121495229773718, 0.18906138722022484], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1568.9720000000013, 1305, 1951, 1544.0, 1771.0, 1837.9, 1912.94, 0.33058834808308346, 0.5048284236142563, 0.1820818635926358], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 11.449999999999998, 7, 67, 10.5, 14.0, 17.94999999999999, 29.980000000000018, 0.3288954375624901, 0.17109950053116613, 2.651719465347577], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 10.988000000000003, 8, 25, 11.0, 13.0, 15.0, 19.0, 0.33094238491644035, 0.599092976897905, 0.27600077804554696], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 7.790000000000005, 5, 18, 7.0, 10.0, 12.0, 15.990000000000009, 0.33094216587086106, 0.5603102953046587, 0.23721831030196489], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 71.0, 71, 71, 71.0, 71.0, 71.0, 71.0, 14.084507042253522, 6.643375880281691, 1920.8846830985917], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 445.0, 445, 445, 445.0, 445.0, 445.0, 445.0, 2.247191011235955, 1.0423981741573034, 4297.625526685393], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.247999999999997, 1, 14, 2.0, 3.0, 3.0, 6.0, 0.329134672033756, 0.27664990582634197, 0.1391751103423988], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 555.3059999999999, 404, 701, 544.5, 635.0, 656.0, 682.9300000000001, 0.32903373977774425, 0.28973927099120095, 0.1523066334518074], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.228000000000002, 1, 14, 3.0, 4.0, 5.0, 8.0, 0.329134672033756, 0.29818508456292564, 0.16071028907898244], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 754.5260000000003, 622, 918, 733.5, 875.9000000000001, 894.0, 906.99, 0.32899628497395006, 0.3112324132979641, 0.17381542008877637], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 58.0, 58, 58, 58.0, 58.0, 58.0, 58.0, 17.241379310344826, 8.16608297413793, 1135.2875808189654], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 22.932000000000006, 16, 545, 21.0, 26.900000000000034, 31.94999999999999, 69.96000000000004, 0.32877951782511033, 0.17103919623106886, 14.997354763291897], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 30.141999999999985, 20, 293, 28.0, 35.900000000000034, 40.94999999999999, 100.94000000000005, 0.3290350389412968, 74.41805719101964, 0.10153815654829082], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 427.0, 427, 427, 427.0, 427.0, 427.0, 427.0, 2.34192037470726, 1.2281359777517564, 0.9605532786885246], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.6459999999999995, 1, 13, 2.0, 3.0, 4.0, 7.990000000000009, 0.3309485183103887, 0.3596188728605006, 0.14188124954908266], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.3720000000000008, 2, 9, 3.0, 4.0, 5.0, 7.0, 0.3309474230447957, 0.3395798504564427, 0.1218429477420781], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.752000000000001, 1, 13, 2.0, 2.0, 3.0, 6.0, 0.3309945260125288, 0.18770686640696838, 0.12832502619821673], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 91.63799999999993, 65, 120, 92.0, 110.0, 113.0, 117.0, 0.3309769977606096, 0.3014702691223615, 0.10795538794144884], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 82.274, 58, 350, 80.0, 95.0, 103.94999999999999, 314.7700000000002, 0.3289774525433576, 0.17114216674255078, 97.27644810117503], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 212.926, 12, 360, 261.0, 335.90000000000003, 338.0, 346.99, 0.33094304205491804, 0.18444580422965062, 0.13864703617339827], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 416.70000000000005, 324, 532, 406.5, 484.90000000000003, 500.95, 524.97, 0.33088828946636983, 0.1779526268476802, 0.14088602949935278], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 7.335999999999997, 4, 301, 6.0, 8.0, 11.0, 30.920000000000073, 0.3287181307772212, 0.1482152814073738, 0.23851325309323762], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 388.964, 288, 509, 386.0, 452.0, 461.95, 487.9000000000001, 0.33087712216314225, 0.17019168849077018, 0.13312634212032678], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.314, 2, 18, 3.0, 4.0, 5.0, 8.990000000000009, 0.3291329387687663, 0.2020792675129991, 0.16456646938438316], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.159999999999999, 2, 38, 4.0, 5.0, 6.0, 9.0, 0.32912492265564314, 0.19275342516192945, 0.15524154066667545], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 666.0639999999992, 536, 876, 670.0, 802.8000000000001, 828.9, 857.99, 0.3289709591016724, 0.3006068517002206, 0.14488857671372485], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 239.74399999999994, 172, 318, 234.0, 280.0, 288.95, 304.97, 0.3290501966074925, 0.29136045289646434, 0.13528333278491633], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.398000000000002, 3, 36, 4.0, 5.0, 6.0, 11.0, 0.3291422552827332, 0.21944209873444803, 0.15396400418010664], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 980.8499999999998, 789, 8542, 933.0, 1085.0, 1104.95, 1127.95, 0.32896100298893965, 0.24727009141661793, 0.1818280543864647], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 133.65999999999994, 116, 165, 133.0, 149.0, 151.0, 154.0, 0.330979626880047, 6.3993844223693905, 0.1667827026075237], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 181.3620000000001, 159, 233, 176.0, 202.0, 204.0, 216.98000000000002, 0.3309542138083365, 0.6414532594604917, 0.23658055127705305], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 7.111999999999994, 5, 29, 7.0, 9.0, 10.0, 13.0, 0.33086967771308173, 0.27003036949374953, 0.2042086292135426], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 7.062000000000004, 4, 27, 7.0, 9.0, 11.0, 13.990000000000009, 0.3308701156126358, 0.2752005724301153, 0.2093787450361211], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.391999999999998, 6, 17, 8.0, 10.0, 11.0, 13.990000000000009, 0.3308672692862531, 0.2677666159474715, 0.20194535478897285], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 9.822, 6, 21, 10.0, 12.0, 13.0, 16.99000000000001, 0.3308681450737704, 0.29587819250537334, 0.23005675712160598], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 7.894000000000002, 5, 42, 8.0, 9.0, 10.0, 18.960000000000036, 0.3308191081116845, 0.24834370761380176, 0.18253202742490404], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1616.2140000000009, 1399, 1965, 1590.0, 1808.0, 1872.8, 1948.98, 0.3305223509129358, 0.27620242275362133, 0.21044977812034582], "isController": false}]}, function(index, item){
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
