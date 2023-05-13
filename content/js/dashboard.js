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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8926824079982982, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.193, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.651, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [0.5, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.993, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.496, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.125, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 323.13039778770536, 1, 19226, 9.0, 830.0, 1502.0, 6034.0, 15.351828242400176, 96.70513406969424, 127.03768879344297], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6200.424, 5305, 19226, 6015.0, 6548.7, 6741.95, 17137.60000000009, 0.3312466999547517, 0.19237863762704138, 0.16691728239907408], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.2499999999999982, 1, 8, 2.0, 3.0, 4.0, 6.0, 0.33245233464652, 0.17067726254592, 0.12012437872969964], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.603999999999999, 2, 17, 3.0, 4.0, 5.0, 9.990000000000009, 0.332449682078369, 0.1908046900920686, 0.14025220962681192], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 12.493999999999987, 7, 329, 11.0, 14.900000000000034, 21.0, 36.99000000000001, 0.3303417583695388, 0.17185191220804394, 3.63472714018515], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 33.96599999999996, 24, 54, 34.0, 40.0, 42.0, 48.97000000000003, 0.3323718922397146, 1.3823002941408153, 0.1382719004825375], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.3760000000000003, 1, 20, 2.0, 3.0, 4.0, 8.0, 0.3323809511147392, 0.20764396312266586, 0.1405478045241036], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 29.747999999999998, 22, 46, 30.0, 35.0, 36.0, 38.0, 0.33237167129771195, 1.3641227994918037, 0.12074439621362193], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 843.966, 668, 1085, 848.5, 995.8000000000001, 1041.85, 1074.99, 0.3322279003661816, 1.4050612210886975, 0.1615717718577719], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 5.569999999999999, 4, 14, 5.0, 7.0, 8.0, 12.0, 0.33233433631836035, 0.49418829810090864, 0.16973716591260005], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.707999999999999, 2, 15, 4.0, 5.0, 5.0, 10.990000000000009, 0.33052562829616683, 0.3188119807855537, 0.18075620297446623], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 7.629999999999997, 5, 20, 7.0, 9.0, 10.0, 15.980000000000018, 0.3323723341246011, 0.5416338258565069, 0.21714559719663878], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 416.0, 416, 416, 416.0, 416.0, 416.0, 416.0, 2.403846153846154, 1.0399451622596154, 2843.2452862079326], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 3.798, 2, 14, 4.0, 5.0, 5.0, 10.0, 0.3305278132544297, 0.3320481120829731, 0.1939914216463987], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 7.943999999999993, 5, 21, 8.0, 10.0, 10.949999999999989, 15.980000000000018, 0.33237012471191824, 0.5221554134036229, 0.1976693417476154], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.702000000000003, 4, 24, 6.0, 8.0, 9.0, 12.990000000000009, 0.33236879907840783, 0.5143634370972106, 0.18987865962975445], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1565.0099999999998, 1318, 1935, 1545.0, 1771.9, 1816.4499999999998, 1915.95, 0.33202713857019817, 0.5070255438023482, 0.18287432241561696], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 11.273999999999988, 7, 68, 9.0, 14.0, 21.94999999999999, 48.98000000000002, 0.33033346502627475, 0.171847597806784, 2.66331356177434], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 11.018000000000006, 8, 21, 11.0, 13.0, 14.0, 17.99000000000001, 0.3323752064050032, 0.601686761586932, 0.27719572877917253], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 7.708000000000004, 5, 30, 7.0, 10.0, 11.0, 14.0, 0.33237388073095664, 0.5627342976192059, 0.23824455903957245], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 45.0, 45, 45, 45.0, 45.0, 45.0, 45.0, 22.22222222222222, 10.481770833333334, 3030.729166666667], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 504.0, 504, 504, 504.0, 504.0, 504.0, 504.0, 1.984126984126984, 0.9203714037698413, 3794.5304749503966], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.1640000000000024, 1, 21, 2.0, 3.0, 3.0, 6.0, 0.3305407050962105, 0.2778317287923431, 0.13976965361978433], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 550.8459999999997, 404, 681, 544.5, 635.9000000000001, 646.0, 667.99, 0.33043519637102853, 0.29097336027316417, 0.1529553545701831], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.152, 1, 15, 3.0, 4.0, 5.0, 7.990000000000009, 0.33053983104126, 0.299458111968054, 0.16139640187561521], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 748.2119999999999, 602, 942, 732.0, 873.0, 887.0, 909.99, 0.3303871608906181, 0.31254819006479556, 0.17455024808771913], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 54.0, 54, 54, 54.0, 54.0, 54.0, 54.0, 18.51851851851852, 8.77097800925926, 1219.3829571759259], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 22.229999999999997, 15, 584, 20.0, 25.0, 37.0, 49.99000000000001, 0.330207806376709, 0.17178222708489907, 15.0625064803282], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 29.406000000000027, 20, 281, 28.0, 35.0, 39.94999999999999, 94.99000000000001, 0.3304572537019474, 74.73972037843139, 0.10197704313458532], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 596.0, 596, 596, 596.0, 596.0, 596.0, 596.0, 1.6778523489932886, 0.8798893666107382, 0.6881816275167786], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.524, 1, 7, 2.0, 3.0, 4.0, 5.0, 0.33238581217808433, 0.36118068073112913, 0.14249743315056546], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.269999999999999, 2, 10, 3.0, 4.0, 5.0, 7.0, 0.3323842654606879, 0.34105417144746036, 0.1223719414830853], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.710000000000001, 1, 11, 2.0, 2.0, 3.0, 6.0, 0.33245321884531015, 0.18853409054263678, 0.1288905545718634], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 91.28599999999997, 66, 122, 90.0, 109.0, 112.0, 116.0, 0.3324302312052258, 0.3027939462377208, 0.10842939181889201], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 80.70199999999998, 57, 306, 79.0, 93.0, 102.94999999999999, 293.5300000000004, 0.3303967668693981, 0.17188052898339556, 97.69612992225103], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 211.33800000000005, 12, 361, 260.0, 334.90000000000003, 339.0, 347.0, 0.33237984634744466, 0.1852465840907716, 0.13924897859673216], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 411.0520000000001, 322, 513, 397.0, 481.90000000000003, 492.0, 502.99, 0.33229745141146666, 0.17871047799493048, 0.14148602423378853], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 6.991999999999994, 4, 260, 6.0, 8.0, 10.0, 30.960000000000036, 0.330155040807163, 0.14886316786237816, 0.23955585480441616], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 383.534, 287, 495, 383.0, 444.0, 453.0, 466.0, 0.3322925929322695, 0.17091975744468324, 0.1336958479375928], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.310000000000001, 2, 13, 3.0, 4.0, 5.0, 9.990000000000009, 0.330538956990932, 0.20294252700172738, 0.165269478495466], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.13, 2, 39, 4.0, 5.0, 6.0, 10.990000000000009, 0.3305308722445294, 0.1935768255798503, 0.15590469852940203], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 665.574, 527, 880, 674.5, 785.9000000000001, 833.8, 852.0, 0.33037908356806767, 0.30189356668503575, 0.14550875653242043], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 238.99599999999992, 153, 302, 233.0, 279.0, 284.95, 293.99, 0.3304666453405525, 0.2926146601530589, 0.13586568133630136], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.533999999999999, 3, 57, 4.0, 5.0, 6.0, 10.990000000000009, 0.33052890574439403, 0.22036659105542505, 0.1546126424331687], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 983.6239999999991, 809, 9293, 927.0, 1079.0, 1110.0, 1143.99, 0.33032058934478264, 0.24829205158649675, 0.1825795445011201], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 134.2539999999999, 116, 169, 137.0, 149.0, 151.0, 154.99, 0.3323774158852474, 6.4264102223255914, 0.1674870572234254], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 182.08599999999996, 158, 241, 180.0, 202.0, 204.0, 213.99, 0.33235112497532293, 0.6441607434079816, 0.2375791244940785], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 7.124000000000003, 5, 33, 7.0, 9.0, 10.0, 14.0, 0.33232594262591997, 0.27121886085147223, 0.20510741771443497], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 6.934000000000004, 5, 27, 7.0, 9.0, 10.0, 14.0, 0.33233212741082035, 0.27641659788776346, 0.21030392437715975], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.426000000000004, 6, 20, 8.0, 10.0, 11.0, 15.0, 0.3323208624391022, 0.26894299014834805, 0.2028325576410536], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 9.698000000000002, 7, 34, 9.0, 12.0, 13.0, 19.0, 0.33232307119689475, 0.2971792573493247, 0.23106838544159092], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 7.8959999999999955, 5, 29, 8.0, 9.0, 11.0, 16.0, 0.33235951993990936, 0.2495000845439529, 0.18338196168559454], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1622.935999999999, 1427, 2060, 1600.0, 1815.9, 1893.5, 1969.97, 0.33197004302331756, 0.27741219288621394, 0.21137155083125297], "isController": false}]}, function(index, item){
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
