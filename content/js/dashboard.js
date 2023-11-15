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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8615826419910657, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.445, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [0.5, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.997, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [0.972, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.62, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.685, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.28, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 499.74307594128805, 1, 31021, 14.0, 1199.800000000003, 2349.0, 9810.980000000003, 9.918035380866483, 62.47632811758283, 82.07258915762101], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 10027.602000000014, 8451, 31021, 9771.0, 10569.0, 10833.45, 29933.150000000165, 0.21426150273590513, 0.12446124279920653, 0.10796771036301468], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 3.4320000000000004, 2, 10, 3.0, 4.0, 5.0, 8.0, 0.2150020704699386, 0.11037962740893693, 0.07768629499402079], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 5.055999999999997, 3, 17, 5.0, 6.0, 7.0, 10.990000000000009, 0.21500068370217415, 0.12339653497910623, 0.09070341343685473], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 20.834, 12, 573, 18.0, 24.0, 29.0, 84.77000000000021, 0.21318725174344533, 0.11090525476196363, 2.3456843412044908], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 52.846000000000004, 31, 73, 55.0, 68.0, 69.0, 72.0, 0.21494495044874057, 0.8939337987554257, 0.08942045790152683], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 3.3999999999999986, 2, 13, 3.0, 4.0, 5.0, 9.990000000000009, 0.21495104919756625, 0.1342835309396241, 0.09089238701420525], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 46.082000000000015, 28, 66, 46.5, 59.900000000000034, 62.0, 64.0, 0.21494467324110772, 0.8821778590597031, 0.07808536957587117], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1213.6840000000004, 851, 1787, 1183.0, 1547.4, 1728.3999999999999, 1772.92, 0.2148667138800459, 0.9087162367846228, 0.10449572608619422], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 8.859999999999982, 6, 35, 9.0, 12.0, 12.0, 17.980000000000018, 0.2149306289901871, 0.3196064629586405, 0.1097741396111991], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 5.376000000000003, 3, 25, 5.0, 6.0, 7.0, 12.990000000000009, 0.21334817098746495, 0.2057872284824502, 0.11667478100876989], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 12.026000000000005, 8, 24, 12.0, 15.0, 16.0, 20.0, 0.21494319481247495, 0.35027134630422374, 0.14042675520463452], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 585.0, 585, 585, 585.0, 585.0, 585.0, 585.0, 1.7094017094017093, 0.7395165598290598, 2021.8633146367522], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 5.916, 4, 40, 6.0, 7.0, 8.0, 14.980000000000018, 0.21334990066428625, 0.214331226867537, 0.12521805693284768], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 12.339999999999987, 8, 27, 12.0, 15.0, 16.0, 24.0, 0.21494245560578523, 0.33767585718513937, 0.1278319877577375], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 9.499999999999998, 6, 20, 9.0, 11.0, 12.0, 15.990000000000009, 0.21494245560578523, 0.3326381433818788, 0.1227942739544769], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2348.040000000002, 1981, 3001, 2301.0, 2692.9, 2821.75, 2961.9700000000003, 0.21474517693069872, 0.3279288873225614, 0.11827761698136141], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 18.629999999999992, 12, 150, 17.0, 22.0, 25.0, 84.87000000000012, 0.21318243427905326, 0.11090274859843208, 1.7187833763748668], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 17.360000000000003, 12, 32, 17.0, 21.0, 23.0, 27.99000000000001, 0.21494513525422634, 0.3891073697969843, 0.1792608842842864], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 12.337999999999994, 8, 26, 13.0, 15.0, 17.0, 21.0, 0.21494421122997526, 0.3639169223159379, 0.15407133890898617], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 85.0, 85, 85, 85.0, 85.0, 85.0, 85.0, 11.76470588235294, 5.549172794117647, 1604.503676470588], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 614.0, 614, 614, 614.0, 614.0, 614.0, 614.0, 1.6286644951140066, 0.7554840187296417, 3114.7285983306188], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 3.577999999999999, 2, 29, 3.0, 4.0, 5.0, 12.990000000000009, 0.21334061535967094, 0.17932070414670154, 0.09021141254954836], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 778.2980000000002, 559, 997, 757.0, 950.9000000000001, 959.95, 980.99, 0.2132838287347918, 0.1878126574301261, 0.09872708478544073], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 4.604000000000001, 2, 25, 4.0, 6.0, 7.0, 13.0, 0.21334343727852284, 0.1932820705055258, 0.10417160023365372], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1056.794, 826, 1405, 1014.5, 1317.9, 1341.95, 1373.98, 0.2132629963536293, 0.20174804413840255, 0.11267117287823578], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 81.0, 81, 81, 81.0, 81.0, 81.0, 81.0, 12.345679012345679, 5.847318672839506, 812.9219714506172], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 37.58200000000002, 25, 1337, 34.0, 41.0, 45.94999999999999, 122.88000000000011, 0.21306224997144965, 0.11084022576395601, 9.718884468912513], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 47.19000000000007, 30, 501, 45.0, 53.0, 63.89999999999998, 184.73000000000025, 0.2132690909959496, 48.23520152102982, 0.06581350854953132], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 656.0, 656, 656, 656.0, 656.0, 656.0, 656.0, 1.524390243902439, 0.7994116806402438, 0.6252381859756098], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 4.094000000000002, 3, 14, 4.0, 5.0, 6.0, 8.990000000000009, 0.21498025406366425, 0.2336041782218553, 0.09216438626362168], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 4.962, 3, 14, 5.0, 6.0, 7.0, 10.990000000000009, 0.21497960703447672, 0.22058713174530764, 0.07914776548046652], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.680000000000001, 1, 12, 2.0, 4.0, 5.0, 8.0, 0.2150026251820535, 0.12192790475534207, 0.08335550995827659], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 129.56, 83, 175, 134.0, 163.90000000000003, 167.95, 173.0, 0.2149933803538189, 0.19582663651348678, 0.07012479398259328], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 123.39200000000002, 83, 569, 122.0, 137.90000000000003, 154.0, 487.6600000000003, 0.2132309824617517, 0.11092800455781225, 63.050985526947066], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 274.5000000000001, 16, 527, 288.0, 491.0, 501.0, 522.0, 0.21497757353952834, 0.1198143076120549, 0.09006384672700944], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 577.9979999999998, 414, 761, 555.5, 693.0, 708.95, 743.96, 0.2149551152223904, 0.11560344873449475, 0.09152385765328341], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 10.659999999999997, 6, 378, 9.0, 12.0, 16.94999999999999, 41.0, 0.21303047784440424, 0.09605302922416005, 0.15457191898280503], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 544.6959999999997, 392, 725, 542.0, 649.0, 664.95, 680.99, 0.2149392216362979, 0.11055726311333444, 0.08647945245522923], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 5.148000000000003, 3, 19, 5.0, 6.0, 7.949999999999989, 16.950000000000045, 0.213339340969175, 0.13098493853586915, 0.1066696704845875], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 5.712000000000006, 4, 44, 5.0, 7.0, 7.0, 14.990000000000009, 0.21333560891316175, 0.12494091603643773, 0.10062607334478235], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 964.8200000000003, 692, 1443, 936.0, 1215.9, 1345.1499999999999, 1411.97, 0.21324853434282345, 0.19487417430167503, 0.09392098534044277], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 332.4800000000007, 222, 474, 332.0, 399.0, 405.95, 411.99, 0.2132888327512681, 0.1888585132264671, 0.08769003768387097], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 6.803999999999998, 4, 76, 7.0, 8.0, 9.0, 15.990000000000009, 0.21335299594543966, 0.14224435924014756, 0.09980086431432186], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1630.0259999999998, 1275, 18193, 1472.0, 1784.9, 1809.9, 9005.750000000065, 0.21324298654479404, 0.16030041725255179, 0.11786672889097015], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 171.01400000000004, 131, 230, 168.5, 206.0, 209.0, 212.0, 0.21501889801094617, 4.157321099842091, 0.10834936657582835], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 233.92200000000014, 180, 358, 219.0, 283.0, 286.0, 293.97, 0.21499726308484093, 0.41670626759483853, 0.15368944978330426], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 11.034000000000008, 7, 24, 11.0, 14.0, 14.949999999999989, 20.99000000000001, 0.21492804209150776, 0.17540772857059955, 0.13265090097835244], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 10.910000000000002, 7, 27, 11.0, 13.0, 14.949999999999989, 20.99000000000001, 0.21492933553306345, 0.17876705504576706, 0.1360099701420167], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 12.368000000000011, 8, 25, 12.0, 15.0, 17.0, 20.0, 0.21492582479934524, 0.1739366994818998, 0.13118031298788163], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 15.143999999999991, 11, 36, 15.0, 18.0, 19.0, 23.99000000000001, 0.21492693343970784, 0.19219799044929187, 0.14944138340729687], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 11.680000000000001, 7, 81, 12.0, 14.0, 15.0, 46.74000000000024, 0.21490984317169104, 0.16133139213331116, 0.11857818495313033], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2653.907999999997, 2252, 3345, 2606.5, 3050.3, 3187.45, 3308.94, 0.21470312783810697, 0.17942975224976673, 0.13670550717816968], "isController": false}]}, function(index, item){
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
