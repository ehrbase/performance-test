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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8899808551372048, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.199, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.576, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.937, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.999, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.496, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.122, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 325.1387364390535, 1, 19075, 10.0, 842.9000000000015, 1501.0, 6065.94000000001, 15.241826606957353, 96.01220533603349, 126.12741587288232], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6197.044000000002, 5251, 19075, 6052.0, 6482.0, 6741.049999999999, 16533.890000000083, 0.32873131409027884, 0.1909177732447556, 0.16564976374080456], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.449999999999999, 1, 12, 2.0, 3.0, 4.0, 6.990000000000009, 0.32983771324832756, 0.16933494553884598, 0.11917964248230586], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.696000000000002, 2, 14, 4.0, 5.0, 5.0, 7.0, 0.32983531982151953, 0.18930421466045433, 0.13914927554970355], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 13.470000000000006, 8, 353, 12.0, 16.0, 18.0, 35.99000000000001, 0.3278649825772548, 0.17056343248899358, 3.6074753502909473], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 33.687999999999995, 24, 50, 34.0, 40.0, 41.0, 44.99000000000001, 0.3297739729189613, 1.3714958166110447, 0.13719112545261478], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.384000000000002, 1, 11, 2.0, 3.0, 4.0, 7.0, 0.32978180316775213, 0.20602023174261982, 0.13944875075355143], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 29.635999999999992, 21, 52, 30.0, 35.0, 36.94999999999999, 39.0, 0.32977179791584227, 1.3534523757996966, 0.11979991096161456], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 854.5459999999998, 664, 1110, 862.5, 984.5000000000002, 1042.0, 1085.97, 0.3296241822848098, 1.3940495531861803, 0.16030551052522976], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 5.956000000000004, 3, 27, 6.0, 8.0, 9.0, 13.990000000000009, 0.32974265564183086, 0.4903344132542698, 0.16841348525456792], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.874, 2, 24, 4.0, 5.0, 5.0, 9.990000000000009, 0.3280056469452178, 0.3163813061955675, 0.17937808817316597], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 8.070000000000004, 5, 21, 8.0, 10.0, 11.0, 16.99000000000001, 0.3297720154148631, 0.5373963475028674, 0.21544675616459316], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 436.0, 436, 436, 436.0, 436.0, 436.0, 436.0, 2.293577981651376, 0.992241255733945, 2712.8211905103212], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.101999999999998, 2, 21, 4.0, 5.900000000000034, 6.0, 10.990000000000009, 0.3280101656910551, 0.32951888432426296, 0.19251377888703525], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 8.292000000000005, 5, 22, 8.0, 10.0, 11.0, 16.0, 0.32976940544554817, 0.5180696681975662, 0.19612262491829963], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.708000000000007, 4, 17, 7.0, 8.0, 9.0, 13.0, 0.329768100476383, 0.5103386782284461, 0.18839290896355865], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1567.3980000000008, 1336, 1963, 1542.0, 1771.9, 1841.8, 1946.98, 0.32943480188779317, 0.5030668887304307, 0.18144651197726108], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 12.151999999999997, 7, 69, 11.0, 15.0, 20.0, 40.960000000000036, 0.327858103013016, 0.17055985357037476, 2.6433559555424413], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 11.397999999999998, 8, 23, 11.0, 14.0, 16.0, 19.99000000000001, 0.32977527793460426, 0.5969802055274953, 0.2750274290587422], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 8.203999999999995, 5, 29, 8.0, 10.0, 12.0, 17.980000000000018, 0.3297746254254917, 0.5583335603969036, 0.23638142095928802], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 45.0, 45, 45, 45.0, 45.0, 45.0, 45.0, 22.22222222222222, 10.481770833333334, 3030.729166666667], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 451.0, 451, 451, 451.0, 451.0, 451.0, 451.0, 2.2172949002217295, 1.0285303492239468, 4240.4509077051], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.4120000000000004, 1, 20, 2.0, 3.0, 4.0, 8.990000000000009, 0.32807214962714604, 0.27575681631404375, 0.13872582108257248], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 571.1259999999994, 453, 720, 562.0, 664.9000000000001, 681.95, 709.9100000000001, 0.32792712672219126, 0.2887648139029952, 0.15179439264288933], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.317999999999999, 1, 15, 3.0, 4.0, 5.0, 8.990000000000009, 0.3280325460770916, 0.2971865950402135, 0.16017214163920487], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 771.9280000000001, 613, 961, 754.5, 898.6000000000001, 916.8, 945.9000000000001, 0.3278690674551262, 0.3101660589203665, 0.17321988817697584], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 46.0, 46, 46, 46.0, 46.0, 46.0, 46.0, 21.73913043478261, 10.296365489130435, 1431.449558423913], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 23.685999999999996, 16, 791, 21.0, 26.0, 32.0, 57.98000000000002, 0.32768985858871846, 0.17047232868046502, 14.947649701834997], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 30.436000000000018, 20, 257, 28.0, 35.0, 41.0, 111.98000000000002, 0.32800973532894456, 74.1861636422119, 0.10122175426166649], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 457.0, 457, 457, 457.0, 457.0, 457.0, 457.0, 2.1881838074398248, 1.1475143599562363, 0.8974972647702407], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.816, 1, 9, 3.0, 4.0, 4.0, 7.0, 0.32978789361834043, 0.35835770225396835, 0.141383677049269], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.4980000000000024, 2, 10, 3.0, 5.0, 5.0, 7.990000000000009, 0.32978702354019773, 0.338389183109298, 0.12141573034634233], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.8319999999999994, 1, 11, 2.0, 3.0, 3.0, 5.0, 0.3298392363562, 0.18705170209414929, 0.1278771258138783], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 91.73599999999998, 67, 133, 91.0, 110.90000000000003, 114.0, 117.0, 0.3298222653776333, 0.30041848158239487, 0.10757874671497022], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 83.72400000000005, 58, 427, 81.0, 95.0, 100.94999999999999, 318.8000000000002, 0.3279228253305954, 0.17059352371275535, 96.96460183774509], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 213.27, 12, 378, 261.5, 335.0, 339.0, 357.95000000000005, 0.3297837607880513, 0.1837996973821765, 0.1381613607207754], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 423.1180000000001, 324, 547, 406.5, 505.0, 516.0, 533.0, 0.3297493970532275, 0.1773401273937333, 0.1404011104640695], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 7.226000000000002, 3, 282, 6.0, 8.0, 10.0, 31.99000000000001, 0.32763209798558685, 0.14772560152434108, 0.23772524297196385], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 399.47399999999993, 295, 510, 400.0, 473.0, 479.95, 495.99, 0.3297256946001482, 0.16959943418246493, 0.13266307243677838], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.597999999999997, 2, 16, 3.0, 5.0, 6.0, 11.0, 0.32806935123629655, 0.20142625177321485, 0.16403467561814827], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.203999999999995, 2, 31, 4.0, 5.0, 6.0, 9.0, 0.3280635393463006, 0.19213182146618157, 0.154740907719007], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 672.094000000001, 529, 857, 674.0, 801.5000000000002, 835.0, 851.99, 0.3279066961170601, 0.2996343502184514, 0.14441984369999422], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 246.03400000000002, 174, 331, 240.5, 289.90000000000003, 296.0, 310.98, 0.3280174820197217, 0.29044602648642764, 0.13485874993193636], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.623999999999999, 3, 59, 4.0, 6.0, 7.0, 10.990000000000009, 0.3280116719673353, 0.21868832868048776, 0.1534351473362828], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 975.0700000000007, 822, 8719, 919.0, 1070.0, 1107.95, 1154.8700000000001, 0.3278357464229842, 0.24642426990159683, 0.18120608640176664], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 135.468, 116, 161, 138.0, 151.0, 152.0, 155.99, 0.32983945394418723, 6.3773395460930855, 0.1662081623390631], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 182.8699999999999, 159, 260, 180.0, 204.0, 206.0, 213.0, 0.32980790668283166, 0.639231494602034, 0.23576112079280542], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 7.408, 5, 21, 7.0, 9.0, 10.0, 13.990000000000009, 0.32973939376752975, 0.2691079187162718, 0.2035110320908973], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 7.233999999999996, 5, 21, 7.0, 9.0, 11.0, 13.0, 0.3297406985095061, 0.2742611819604799, 0.20866403577554682], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.531999999999995, 6, 25, 8.0, 10.0, 11.0, 15.980000000000018, 0.32973504470218, 0.2668503211866637, 0.20125429974498293], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 9.999999999999993, 7, 29, 10.0, 12.0, 13.0, 18.0, 0.32973700176739035, 0.29486666981290727, 0.2292702590413886], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 7.836000000000002, 5, 28, 8.0, 9.0, 10.0, 14.0, 0.32971917158717573, 0.24751799256911902, 0.18192512885425224], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1614.2619999999997, 1435, 1964, 1592.0, 1818.8000000000002, 1914.6999999999998, 1952.99, 0.32940571914209577, 0.27526930461629173, 0.20973879773500628], "isController": false}]}, function(index, item){
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
