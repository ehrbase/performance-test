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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8919166134864922, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.186, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.658, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.978, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.998, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.496, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.104, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 325.14669219314777, 1, 18599, 9.0, 843.0, 1508.0, 6102.980000000003, 15.215660381022664, 95.84737751571411, 125.91088812031086], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6226.269999999998, 5010, 18599, 6078.0, 6517.8, 6736.849999999999, 16610.520000000084, 0.3282112682805471, 0.1906157454678947, 0.16538770940699443], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.2899999999999987, 1, 16, 2.0, 3.0, 4.0, 6.0, 0.3292783798450021, 0.1690477901057774, 0.11897753959243239], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.5639999999999987, 2, 14, 3.0, 4.0, 5.0, 8.0, 0.329275560838599, 0.18898294908247365, 0.13891312722878396], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 13.142, 8, 354, 11.0, 15.0, 19.0, 33.98000000000002, 0.32720607242117444, 0.17022065121043342, 3.6002254081732152], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 33.472, 24, 46, 34.0, 40.0, 41.0, 45.0, 0.32919036288628845, 1.3690686428979155, 0.1369483345601161], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.319999999999999, 1, 13, 2.0, 3.0, 3.0, 7.0, 0.32919881567434073, 0.2056560296631177, 0.13920223358104447], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 29.549999999999997, 21, 53, 29.0, 35.0, 37.0, 40.0, 0.3291894959582114, 1.3510624868735688, 0.11958837157856897], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 848.7300000000004, 650, 1084, 852.0, 996.6000000000001, 1054.95, 1065.99, 0.32904803114110565, 1.3916128895928688, 0.16002531201979553], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 5.542000000000006, 3, 15, 5.0, 8.0, 9.0, 11.0, 0.32916349023898583, 0.4894731818572326, 0.16811768104979455], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.884000000000004, 2, 19, 4.0, 5.0, 5.0, 11.980000000000018, 0.32743041776192144, 0.31582646281994864, 0.17906350971355078], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 7.650000000000002, 5, 17, 7.0, 10.0, 11.0, 15.0, 0.32918797884506373, 0.5364446017368617, 0.21506519321030043], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 441.0, 441, 441, 441.0, 441.0, 441.0, 441.0, 2.2675736961451247, 0.9809913548752834, 2682.0635806405894], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 3.973999999999999, 2, 19, 4.0, 5.0, 6.0, 9.990000000000009, 0.3274336341138696, 0.3289397009270301, 0.1921754043969098], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 7.822000000000005, 5, 16, 7.0, 10.0, 12.0, 15.990000000000009, 0.32918581156482424, 0.5171528387914536, 0.19577554613572068], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.552000000000005, 4, 15, 6.0, 8.0, 9.0, 12.0, 0.3291847279354061, 0.5094358693423021, 0.1880596346115357], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1578.182000000001, 1332, 1965, 1562.5, 1800.7, 1851.0, 1914.99, 0.3288677478084253, 0.5022009628178836, 0.18113418922260927], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 11.491999999999994, 7, 76, 10.0, 14.0, 17.94999999999999, 32.99000000000001, 0.3271983640081799, 0.1702166411042945, 2.638036809815951], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 11.010000000000002, 8, 40, 11.0, 14.0, 15.0, 22.99000000000001, 0.32919101308534277, 0.5959225320961238, 0.27454016130359643], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 7.628, 5, 17, 7.0, 10.0, 11.0, 15.990000000000009, 0.3291897126898025, 0.557343258581482, 0.2359621573381983], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 57.0, 57, 57, 57.0, 57.0, 57.0, 57.0, 17.543859649122805, 8.275082236842104, 2392.6809210526317], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 439.0, 439, 439, 439.0, 439.0, 439.0, 439.0, 2.277904328018223, 1.0566450740318907, 4356.363005410023], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.2380000000000004, 1, 15, 2.0, 3.0, 3.0, 6.990000000000009, 0.32742334201005185, 0.275211469435031, 0.13845147176792233], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 551.3359999999994, 415, 684, 537.5, 639.0, 651.95, 672.0, 0.32732774213906063, 0.2882370101213011, 0.1515169431385886], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.2879999999999994, 2, 20, 3.0, 4.0, 5.0, 8.990000000000009, 0.32743041776192144, 0.2966410867792111, 0.1598781336728132], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 764.3519999999999, 635, 933, 747.5, 884.0, 896.0, 925.97, 0.32729367406786763, 0.3096217334045742, 0.17291589616280895], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 46.0, 46, 46, 46.0, 46.0, 46.0, 46.0, 21.73913043478261, 10.296365489130435, 1431.449558423913], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 25.493999999999993, 16, 1251, 22.0, 26.0, 31.94999999999999, 95.98000000000002, 0.32693221845087744, 0.1700781856357099, 14.913089769375475], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 30.700000000000014, 21, 221, 28.0, 37.0, 46.94999999999999, 128.99, 0.32732859928891134, 74.03211068497929, 0.10101155993681249], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 453.0, 453, 453, 453.0, 453.0, 453.0, 453.0, 2.207505518763797, 1.1576469370860927, 0.9054221854304636], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.612000000000001, 1, 11, 2.0, 4.0, 4.0, 7.0, 0.32923566623141715, 0.3577576349339454, 0.1411469311285079], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.338, 2, 11, 3.0, 4.0, 5.0, 7.0, 0.3292343654830691, 0.33782210952804254, 0.12121226151085651], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.7039999999999993, 1, 15, 2.0, 2.0, 3.0, 5.990000000000009, 0.3292814157520326, 0.18673536224742468, 0.1276608613804267], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 91.68400000000003, 66, 120, 90.5, 110.0, 113.0, 117.0, 0.32926558628042496, 0.29991143064415543, 0.10739717365006049], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 83.07399999999997, 58, 475, 79.0, 92.0, 101.0, 409.910000000001, 0.3272683954292387, 0.17025307317295874, 96.77109126173748], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 213.42599999999993, 12, 379, 261.0, 335.0, 339.0, 348.97, 0.3292304632996926, 0.18349132588844486, 0.1379295593316095], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 415.06799999999987, 324, 537, 402.0, 489.80000000000007, 499.0, 521.0, 0.3291855948383699, 0.1770369130209362, 0.14016105405227466], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 7.170000000000002, 4, 270, 6.0, 8.0, 10.0, 29.0, 0.3268777163538229, 0.14738545939230818, 0.23717787426844766], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 387.46999999999997, 294, 509, 384.0, 456.0, 464.0, 484.98, 0.32916999128357866, 0.16931359971579463, 0.13243948868050234], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.255999999999999, 2, 16, 3.0, 4.0, 5.0, 8.0, 0.32742098349405335, 0.20102817044193974, 0.16371049174702668], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.068000000000002, 2, 27, 4.0, 5.0, 5.0, 9.990000000000009, 0.3274154089549424, 0.19175224111754735, 0.1544351977785519], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 665.5239999999998, 536, 853, 673.5, 768.9000000000001, 802.0, 840.95, 0.32724783263760443, 0.29903229441145784, 0.14412966066363242], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 239.148, 169, 332, 233.0, 281.0, 286.95, 300.0, 0.32733095647414806, 0.28983813627409644, 0.13457649675353156], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.460000000000002, 3, 46, 4.0, 5.0, 6.0, 10.980000000000018, 0.32743577838360677, 0.218304375254172, 0.1531657596149879], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 994.8580000000001, 822, 8658, 942.0, 1100.7, 1122.0, 1145.0, 0.32725854210246597, 0.24599040277508696, 0.1808870457324177], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 132.37599999999983, 116, 169, 127.0, 148.0, 150.0, 159.96000000000004, 0.329261249704488, 6.366160153453852, 0.16591680160890218], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 179.81600000000006, 160, 228, 171.0, 201.0, 203.0, 213.99, 0.3292467230073659, 0.6381438121288566, 0.23535996214979674], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 6.8179999999999925, 4, 20, 7.0, 8.0, 9.0, 16.99000000000001, 0.32916067319940884, 0.26863561152292764, 0.20315385299026012], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 6.644000000000006, 4, 19, 6.0, 8.0, 9.0, 12.990000000000009, 0.32916240675651925, 0.27378018892440914, 0.20829808552560983], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.089999999999998, 6, 18, 8.0, 10.0, 11.0, 13.0, 0.3291587229694857, 0.2663839114375415, 0.20090254087493023], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 9.466000000000005, 7, 29, 9.0, 11.0, 13.0, 18.0, 0.32915937304355897, 0.29435012645480213, 0.22886862656934961], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 7.625999999999994, 5, 29, 7.0, 9.0, 10.0, 18.970000000000027, 0.3291225395621749, 0.2470701048699604, 0.1815959324732703], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1634.096, 1360, 2125, 1610.5, 1836.0, 1900.75, 1975.94, 0.32881173358095045, 0.27477293802983904, 0.20936059599099582], "isController": false}]}, function(index, item){
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
