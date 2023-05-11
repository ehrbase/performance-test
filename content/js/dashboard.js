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

    var data = {"OkPercent": 91.49117209104446, "KoPercent": 8.508827908955542};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8138268453520527, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [0.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.073, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.509, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.0, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [0.5, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.847, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.85, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [0.843, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.129, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 2000, 8.508827908955542, 354.2668368432277, 1, 9081, 9.0, 869.0, 1544.9500000000007, 6219.980000000003, 13.985377382065874, 22.919314398185502, 115.84320566247135], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6738.757999999998, 5293, 9081, 6271.5, 8275.5, 8488.55, 8749.89, 0.30020077427783703, 0.17434804928786374, 0.15127304641344133], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.540000000000002, 1, 16, 2.0, 4.0, 4.0, 6.0, 0.30108275379921273, 0.15457247509744543, 0.10878966690010616], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.8160000000000003, 2, 15, 4.0, 5.0, 5.0, 8.0, 0.3010800342990375, 0.17280053413856183, 0.12701813946990645], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 500, 100.0, 7.012000000000005, 4, 388, 6.0, 8.0, 9.0, 14.970000000000027, 0.3006509694791162, 0.11236536379819585, 3.347090871154223], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 34.017999999999994, 24, 54, 34.0, 40.0, 42.0, 46.0, 0.3010069887802655, 1.2518569074105514, 0.12522361056679016], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.354, 1, 8, 2.0, 3.0, 4.0, 7.0, 0.301016412016816, 0.18805000872195055, 0.1272852601594544], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 30.185999999999986, 21, 46, 30.0, 36.0, 37.0, 40.99000000000001, 0.30100481427099945, 1.235386663071164, 0.10934940518438652], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 947.8279999999995, 728, 1349, 940.0, 1166.8000000000002, 1239.0, 1315.98, 0.30088598888286444, 1.272509727455967, 0.1463293188121743], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 5.486000000000005, 4, 14, 5.0, 7.0, 8.0, 11.0, 0.30086498683715684, 0.44739269932305376, 0.15366444151936817], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.9639999999999973, 2, 16, 4.0, 5.0, 6.0, 9.0, 0.3008255254068214, 0.29016443330036285, 0.16451395920685544], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 8.363999999999995, 5, 18, 8.0, 10.0, 12.0, 15.0, 0.3010013713622479, 0.49051171719325853, 0.19665031000131236], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 543.0, 543, 543, 543.0, 543.0, 543.0, 543.0, 1.8416206261510129, 0.7967167357274401, 2178.250532343462], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.119999999999993, 2, 14, 4.0, 5.0, 6.0, 9.0, 0.3008278783211398, 0.30221156905052704, 0.17656011217871584], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 12.780000000000015, 6, 23, 13.0, 16.0, 17.0, 19.0, 0.30099955933664513, 0.4728720713871625, 0.17901243323829774], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.878000000000002, 5, 16, 7.0, 8.0, 9.0, 12.0, 0.3010008277522763, 0.46581935717510725, 0.17195848069832192], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1825.773999999998, 1330, 2739, 1709.5, 2344.9, 2452.9, 2614.91, 0.30061969744431166, 0.4590644795807077, 0.1655756927329998], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 12.866000000000009, 8, 110, 11.0, 16.0, 20.94999999999999, 37.99000000000001, 0.3006316270484287, 0.15639597074703954, 2.4238424930779567], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 11.392000000000003, 8, 40, 11.0, 14.0, 15.0, 18.0, 0.30100354582176975, 0.5448957841067118, 0.25103225403495255], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 8.240000000000013, 6, 18, 8.0, 10.0, 12.0, 14.990000000000009, 0.301002639793151, 0.5096203971052576, 0.21575775157048127], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 52.0, 52, 52, 52.0, 52.0, 52.0, 52.0, 19.230769230769234, 9.070763221153847, 2622.7463942307695], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 559.0, 559, 559, 559.0, 559.0, 559.0, 559.0, 1.7889087656529516, 0.8298160778175312, 3421.1866894007153], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.412, 1, 17, 2.0, 3.0, 4.0, 7.0, 0.30082371549777603, 0.25285349625594805, 0.12720377813529005], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 607.0900000000001, 436, 764, 601.0, 691.0, 708.0, 732.96, 0.3007108202368759, 0.26479878292557946, 0.13919621952371014], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.452000000000002, 2, 14, 3.0, 4.0, 5.0, 8.990000000000009, 0.3008133994320643, 0.2725269519405472, 0.14688154269143763], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 802.7540000000001, 661, 1023, 778.5, 927.0, 940.95, 979.8600000000001, 0.30069147010465264, 0.28445589258308407, 0.1588614114517745], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 63.0, 63, 63, 63.0, 63.0, 63.0, 63.0, 15.873015873015872, 7.517981150793651, 1045.1853918650793], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 500, 100.0, 14.263999999999998, 9, 521, 13.0, 16.0, 18.0, 28.0, 0.3005387457556416, 0.11056245206407005, 13.746712669631581], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 13.40000000000001, 6, 193, 10.5, 24.0, 28.0, 39.950000000000045, 0.300750613380876, 2.2658239888238065, 0.09280975959800469], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 906.0, 906, 906, 906.0, 906.0, 906.0, 906.0, 1.1037527593818985, 0.5788234685430463, 0.4527110927152318], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.736, 1, 8, 3.0, 4.0, 4.0, 7.0, 0.3010211238563455, 0.32709884250604904, 0.1290510482157575], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.356000000000001, 2, 10, 3.0, 4.0, 5.0, 8.0, 0.3010200364956692, 0.3088718384241842, 0.11082475953014384], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.9000000000000004, 1, 12, 2.0, 3.0, 3.0, 6.990000000000009, 0.3010836603101884, 0.17074442615110305, 0.11672872377260236], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 168.25999999999985, 68, 265, 186.0, 244.0, 249.0, 259.99, 0.3010515731449955, 0.27421270780084833, 0.09819455608440282], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 500, 100.0, 52.90800000000001, 36, 221, 52.0, 66.90000000000003, 71.0, 109.87000000000012, 0.3007120862201694, 0.110626220703125, 88.95615598988404], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 237.14400000000023, 14, 425, 307.0, 387.0, 395.0, 403.0, 0.30101550591074044, 0.16776617126788934, 0.12610903519112077], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 458.9939999999998, 293, 797, 419.5, 681.6000000000001, 715.0, 755.96, 0.30103526026003424, 0.1618975861111362, 0.12817516940759272], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 8.13799999999999, 4, 267, 7.0, 9.0, 12.0, 40.97000000000003, 0.3004919654458279, 0.13548842320897772, 0.21803274445922863], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 458.46399999999966, 290, 860, 408.5, 703.9000000000001, 726.0, 778.97, 0.3009698452292668, 0.1548084249811593, 0.12109333616646281], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.6119999999999997, 2, 28, 3.0, 5.0, 6.0, 9.0, 0.30082154363566904, 0.1846967897452944, 0.1504107718178345], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.227999999999999, 2, 33, 4.0, 5.0, 6.0, 9.0, 0.300816295098379, 0.17617435579438365, 0.14188893606691116], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 774.0940000000002, 596, 1143, 758.5, 989.0, 1049.9, 1107.97, 0.3006798973839646, 0.2747550652159664, 0.1324283532423516], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 432.3959999999997, 237, 856, 340.5, 746.0, 780.95, 833.98, 0.3007258318677961, 0.2662803896609858, 0.12363825704720914], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.7600000000000025, 3, 38, 5.0, 6.0, 7.0, 9.0, 0.3008295072833832, 0.2005657352709361, 0.14072005272337945], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 949.138, 807, 1224, 934.0, 1083.9, 1098.0, 1124.99, 0.30068496033965375, 0.226015840647495, 0.1661989136252383], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 134.6440000000001, 117, 163, 137.0, 149.0, 150.0, 157.98000000000002, 0.3011465855096695, 5.822572181636865, 0.15174964660448192], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 182.8, 159, 238, 181.5, 201.0, 203.0, 210.0, 0.30112445895462836, 0.5836374266912505, 0.21525693745584762], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 7.563999999999999, 5, 25, 7.0, 9.0, 10.949999999999989, 15.980000000000018, 0.30086009885059406, 0.2455388605570605, 0.18568709225935104], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 7.3620000000000045, 5, 19, 7.0, 9.0, 11.0, 14.0, 0.30086209023335464, 0.2502414559303227, 0.19038929147579473], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.938000000000002, 5, 29, 9.0, 11.0, 12.0, 15.0, 0.3008534007565861, 0.24347677904393603, 0.183626343235221], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 10.211999999999987, 7, 30, 10.0, 12.0, 13.0, 17.0, 0.3008559351354604, 0.26903983238563717, 0.2091888923988748], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 8.304000000000004, 5, 29, 8.0, 10.0, 12.0, 13.990000000000009, 0.3008450738123388, 0.2258423991116045, 0.16599361982809713], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1620.1380000000001, 1417, 2004, 1602.0, 1825.0000000000005, 1887.9, 1934.99, 0.30058698626678176, 0.2511868066585428, 0.19138937016205246], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["No results for path: $['rows'][1]", 500, 25.0, 2.1272069772388855], "isController": false}, {"data": ["412", 1500, 75.0, 6.381620931716656], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 23505, 2000, "412", 1500, "No results for path: $['rows'][1]", 500, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Query cross patient #1", 500, 500, "No results for path: $['rows'][1]", 500, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 500, "412", 500, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 500, "412", 500, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 500, "412", 500, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
