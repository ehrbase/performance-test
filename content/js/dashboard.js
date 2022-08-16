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

    var data = {"OkPercent": 97.80897681344395, "KoPercent": 2.191023186556052};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8788130185067007, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [0.998, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.393, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [0.998, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.832, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.302, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.997, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.915, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #4"], "isController": false}, {"data": [0.999, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.534, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [0.999, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.496, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [0.965, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [0.877, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 515, 2.191023186556052, 291.5355456285885, 1, 7209, 30.0, 815.9000000000015, 1863.8500000000022, 3809.9400000000096, 16.93568259338943, 112.07107630117632, 140.28107416079928], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 46.08199999999995, 17, 124, 39.0, 76.90000000000003, 82.0, 98.97000000000003, 0.3676941020395256, 0.21350459658993134, 0.18528335610585472], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 14.906000000000002, 4, 100, 12.0, 25.0, 32.0, 61.98000000000002, 0.36755489983761425, 3.9266134029078006, 0.13280792279288797], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 15.558000000000012, 4, 68, 13.0, 27.0, 31.0, 42.97000000000003, 0.36754436260456635, 3.946649011902924, 0.15505777797380144], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 1, 0.2, 71.43599999999999, 14, 447, 63.5, 132.90000000000003, 154.89999999999998, 172.0, 0.3644075825929786, 0.1966256484177423, 4.056881290585895], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 65.812, 26, 157, 55.0, 111.90000000000003, 122.94999999999999, 144.96000000000004, 0.3674852032082928, 1.5284161780491534, 0.15287958649094996], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 7.054000000000002, 1, 24, 6.0, 14.900000000000034, 16.0, 20.0, 0.367517076680968, 0.22965654013176223, 0.15540517011997962], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 56.81800000000001, 23, 155, 48.0, 96.90000000000003, 104.94999999999999, 127.0, 0.36748844432586814, 1.508291004406554, 0.1335016614152568], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1128.601999999999, 580, 2523, 915.5, 2123.4000000000015, 2304.0, 2423.0, 0.3672074898577291, 1.552934818650909, 0.17858333002846594], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 23.271999999999995, 7, 79, 20.0, 39.900000000000034, 43.0, 56.0, 0.36676654942362635, 0.5453689648564292, 0.18732314975444977], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 11.552000000000008, 2, 61, 9.0, 24.0, 28.0, 40.99000000000001, 0.3652039517989216, 0.3523233796083261, 0.19972091114003526], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 34.45000000000001, 12, 117, 28.0, 60.0, 67.94999999999999, 83.99000000000001, 0.36746521757983, 0.5987587346482218, 0.24007249078213502], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 762.0, 762, 762, 762.0, 762.0, 762.0, 762.0, 1.3123359580052494, 0.5600496227034121, 1552.2178990321522], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 11.533999999999997, 2, 163, 9.0, 22.0, 24.0, 34.99000000000001, 0.3652196906004869, 0.36696161732792126, 0.21435257231532484], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 34.823999999999984, 13, 88, 29.0, 60.0, 64.94999999999999, 77.0, 0.3674487445746193, 0.5773265683263592, 0.21853152875580387], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 21.734, 8, 63, 16.5, 40.0, 44.0, 55.99000000000001, 0.36744145371597214, 0.5687240161479495, 0.20991528361703488], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2895.8, 1501, 6213, 2464.5, 4424.400000000001, 5087.449999999999, 5758.620000000001, 0.3663739094880584, 0.5595166458780003, 0.20179187983521965], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 1, 0.2, 69.47600000000001, 9, 456, 60.0, 131.0, 143.0, 203.91000000000008, 0.3643640317317348, 0.1965815116042657, 2.937685005837112], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 40.27799999999999, 16, 87, 34.0, 67.0, 72.0, 80.0, 0.3674833125827756, 0.665220876304382, 0.3064753407672758], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 34.512000000000015, 12, 96, 28.0, 60.0, 67.0, 80.0, 0.3674689984779434, 0.6221113778782927, 0.2634006297683696], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 111.0, 111, 111, 111.0, 111.0, 111.0, 111.0, 9.00900900900901, 4.196579391891892, 1228.6739864864865], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 730.0, 730, 730, 730.0, 730.0, 730.0, 730.0, 1.36986301369863, 0.6274079623287672, 2619.78542380137], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 9.000000000000007, 1, 43, 6.0, 20.0, 23.0, 32.98000000000002, 0.36502505166929605, 0.30669305029716687, 0.15435141345000508], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 582.9219999999996, 323, 1386, 472.0, 1135.4, 1222.9, 1313.98, 0.3649331369506479, 0.32131008464441646, 0.16892412784629598], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 10.430000000000005, 2, 66, 7.0, 21.0, 25.0, 42.97000000000003, 0.3650338459381954, 0.33066719266522887, 0.17823918258700946], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1773.9460000000006, 950, 3801, 1367.0, 3339.5000000000005, 3526.35, 3668.67, 0.36479282321191325, 0.34509614821641843, 0.19272745835707525], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 117.0, 117, 117, 117.0, 117.0, 117.0, 117.0, 8.547008547008549, 3.998063568376068, 562.7921340811965], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 103.39400000000002, 30, 1201, 88.0, 171.90000000000003, 195.95, 299.4300000000005, 0.36404965928592387, 0.1964773167028168, 16.651716739877052], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 126.50999999999996, 9, 363, 116.0, 227.90000000000003, 252.0, 298.96000000000004, 0.36457896598113665, 80.48104955562381, 0.1125067902832414], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 453.0, 453, 453, 453.0, 453.0, 453.0, 453.0, 2.207505518763797, 1.1576469370860927, 0.9054221854304636], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 8.902000000000003, 1, 48, 6.0, 20.0, 23.0, 28.0, 0.36759354152851276, 0.39939684447595125, 0.15759137180763388], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 10.877999999999997, 2, 80, 9.0, 21.0, 25.0, 38.940000000000055, 0.36758975806712485, 0.3771155020320362, 0.13533333866338482], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 6.480000000000003, 1, 26, 5.0, 13.0, 16.0, 21.0, 0.3675816509121171, 0.20851787080901782, 0.14250968301963915], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 193.1800000000003, 86, 451, 145.0, 371.80000000000007, 392.0, 427.98, 0.36755462964460406, 0.33487026493153926, 0.11988598271611109], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 13, 2.6, 312.8039999999997, 63, 645, 275.5, 510.7000000000001, 546.8499999999999, 607.95, 0.36447478818547685, 0.1948644522818673, 107.8183338745784], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 7.115999999999999, 1, 41, 6.0, 13.0, 16.0, 20.0, 0.3675867854020995, 0.20493106874755096, 0.15399876068115304], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 10.267999999999995, 2, 64, 8.0, 20.0, 24.0, 35.97000000000003, 0.367607324796511, 0.1977626889777355, 0.15652030626101443], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 59.83000000000005, 7, 600, 49.0, 124.0, 138.84999999999997, 178.9000000000001, 0.36391028883559623, 0.15373574950053315, 0.2640481880906719], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 11.205999999999992, 2, 50, 9.0, 20.0, 24.0, 31.99000000000001, 0.3675946225317859, 0.18905707338438488, 0.14789939890927323], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 10.172000000000008, 2, 64, 8.0, 20.0, 24.0, 31.99000000000001, 0.36502478518291387, 0.2241779755907926, 0.18251239259145696], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 11.414000000000001, 2, 56, 8.0, 24.0, 28.0, 37.0, 0.3650106619614359, 0.2138320858789785, 0.17216811496813822], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 797.4020000000003, 390, 1772, 630.0, 1574.9, 1636.9, 1697.97, 0.364759823893957, 0.3332893151816686, 0.1606510552501705], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 30.243999999999993, 5, 736, 25.0, 54.0, 60.0, 81.99000000000001, 0.3646738940170142, 0.3228624651098252, 0.14992940369254198], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 22.267999999999986, 6, 116, 19.0, 37.0, 43.0, 61.0, 0.36526157842677454, 0.2433990441195808, 0.17085966412736817], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 873.9720000000003, 502, 7209, 845.5, 1039.6000000000001, 1119.5, 1286.6400000000003, 0.3651346105255163, 0.27441934126247486, 0.2018224507396897], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 256.50200000000007, 145, 585, 196.0, 487.90000000000003, 510.9, 555.99, 0.3676327319597104, 7.108122865891991, 0.1852524313390728], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 403.16999999999985, 210, 926, 330.5, 710.2000000000003, 746.6499999999999, 840.94, 0.36751383505832075, 0.7123961394417319, 0.2627149680299715], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 34.47399999999999, 13, 117, 27.0, 60.0, 64.94999999999999, 76.0, 0.36674045484618173, 0.29922224778708806, 0.22634762447537776], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 35.42800000000001, 12, 105, 28.0, 62.0, 68.0, 84.0, 0.36675605734304306, 0.30500708779003066, 0.23208781753739444], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 34.86399999999997, 12, 93, 27.5, 64.0, 69.89999999999998, 83.99000000000001, 0.36673830288182957, 0.29685889789638914, 0.22383929619252296], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 38.08799999999999, 14, 97, 32.0, 64.0, 70.0, 82.97000000000003, 0.36673803388806125, 0.3280170873335284, 0.2549975391877926], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 37.73600000000001, 13, 117, 31.0, 67.0, 74.84999999999997, 90.98000000000002, 0.3670532961385993, 0.27550289169174863, 0.20252452374834826], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 3304.440000000001, 1790, 6763, 3004.5, 5062.900000000001, 5565.749999999999, 6447.4400000000005, 0.3661152970293405, 0.3059665581134811, 0.23311247428040038], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["No results for path: $['rows'][1]", 500, 97.0873786407767, 2.1272069772388855], "isController": false}, {"data": ["500", 15, 2.912621359223301, 0.06381620931716656], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 23505, 515, "No results for path: $['rows'][1]", 500, "500", 15, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Query cross patient #1", 500, 500, "No results for path: $['rows'][1]", 500, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 13, "500", 13, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
