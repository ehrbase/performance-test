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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8921080621144437, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.212, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.618, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.983, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.501, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.496, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.119, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 324.42233567326093, 1, 17597, 9.0, 835.0, 1494.0, 6087.960000000006, 15.221749908688928, 95.88573702443769, 125.96127948141464], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6219.4959999999965, 4929, 17597, 6067.0, 6600.7, 6851.3, 15340.500000000071, 0.32831083419186613, 0.19067357051000464, 0.16543788129199508], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.3640000000000003, 1, 9, 2.0, 3.0, 4.0, 6.0, 0.3293601520326462, 0.1690897710205883, 0.11900708618367098], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.531999999999997, 2, 15, 3.0, 4.0, 5.0, 8.0, 0.3293575485785916, 0.18903000476086337, 0.13894771580659335], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 13.133999999999993, 8, 362, 11.0, 15.0, 18.94999999999999, 35.0, 0.3274169097737222, 0.17033033398980424, 3.6025452367387967], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 33.83199999999997, 24, 54, 33.0, 41.0, 42.0, 45.0, 0.3292939936775553, 1.3694996326313882, 0.13699144658851423], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.2260000000000044, 1, 15, 2.0, 3.0, 4.0, 6.0, 0.3293022349084079, 0.20572063739575935, 0.1392459645657623], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 29.896000000000008, 21, 50, 30.0, 35.0, 37.0, 41.99000000000001, 0.3292942105467667, 1.351492257428713, 0.11962641242519259], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 855.7759999999995, 655, 1098, 860.5, 1008.3000000000002, 1060.85, 1077.98, 0.32915395583807205, 1.3920608672729462, 0.16007682617906238], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 5.5939999999999985, 4, 14, 5.0, 7.0, 8.0, 11.990000000000009, 0.32925496187227543, 0.48960920214114506, 0.16816439947187506], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.803999999999999, 2, 26, 4.0, 5.0, 5.0, 9.990000000000009, 0.3276003276003276, 0.3159903511466011, 0.17915642915642915], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 7.852000000000005, 5, 20, 7.0, 10.0, 12.0, 16.0, 0.3292976804929981, 0.5366233714994834, 0.2151368635252107], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 459.0, 459, 459, 459.0, 459.0, 459.0, 459.0, 2.1786492374727673, 0.942521105664488, 2576.8846166938997], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.095999999999997, 2, 15, 4.0, 5.0, 6.0, 10.990000000000009, 0.32760504983528016, 0.32911190509379984, 0.19227601069433925], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 8.133999999999997, 6, 19, 8.0, 10.0, 11.0, 14.990000000000009, 0.32929702987250936, 0.5173275634044966, 0.1958416906175373], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.572000000000003, 4, 25, 6.0, 8.0, 9.0, 12.990000000000009, 0.3292968129995844, 0.509609328641183, 0.1881236675827704], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1562.0999999999992, 1337, 2026, 1531.5, 1771.9, 1851.8, 1934.6400000000003, 0.32896273444351676, 0.5023460131608121, 0.18118650608021822], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 11.691999999999991, 8, 82, 10.0, 14.0, 19.0, 33.99000000000001, 0.32740340290000836, 0.17032330738170262, 2.639689935881318], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 11.094000000000008, 8, 23, 11.0, 13.0, 15.0, 19.99000000000001, 0.32929833111605794, 0.5961168060284645, 0.2746296628643686], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 7.894000000000005, 5, 21, 8.0, 10.0, 10.0, 14.990000000000009, 0.32929833111605794, 0.5575271578508014, 0.23604001468670555], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 63.0, 63, 63, 63.0, 63.0, 63.0, 63.0, 15.873015873015872, 7.486979166666667, 2164.8065476190477], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 399.0, 399, 399, 399.0, 399.0, 399.0, 399.0, 2.506265664160401, 1.1625744047619047, 4793.091126253133], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.3259999999999996, 1, 19, 2.0, 3.0, 4.0, 7.0, 0.3276071963507179, 0.27536600583108045, 0.13852921486314537], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 556.8579999999997, 408, 681, 546.0, 643.9000000000001, 656.8499999999999, 675.0, 0.32750698408643564, 0.28839484630916007, 0.15159991255563526], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.2660000000000005, 1, 24, 3.0, 4.0, 5.0, 9.0, 0.32760311799543584, 0.29679754745658765, 0.1599624599587089], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 746.7080000000007, 584, 931, 722.0, 871.0, 887.0, 911.98, 0.3274658011090612, 0.30978456659410025, 0.17300683437500206], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 47.0, 47, 47, 47.0, 47.0, 47.0, 47.0, 21.27659574468085, 10.077293882978724, 1400.9931848404256], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 26.532000000000014, 17, 1452, 23.0, 28.0, 31.94999999999999, 71.97000000000003, 0.32709497791454706, 0.17016285711411952, 14.920514080457515], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 30.808000000000014, 21, 225, 29.0, 37.0, 42.0, 88.80000000000018, 0.3275342306024403, 74.07861844567157, 0.1010750164749718], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 418.0, 418, 418, 418.0, 418.0, 418.0, 418.0, 2.3923444976076556, 1.2545790968899522, 0.98123504784689], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.754, 1, 7, 3.0, 4.0, 4.0, 6.0, 0.32930353619309305, 0.35783138452872715, 0.1411760277234061], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.349999999999998, 2, 8, 3.0, 4.0, 5.0, 6.990000000000009, 0.3293022349084079, 0.33789174925841137, 0.12123724859420876], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.9039999999999988, 1, 20, 2.0, 3.0, 3.0, 6.0, 0.32936101985981076, 0.1867805057058503, 0.12769172351986804], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 92.37799999999997, 65, 126, 92.0, 111.0, 114.0, 118.0, 0.3293386747675198, 0.2999780032640756, 0.10742101305893713], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 82.86199999999997, 58, 379, 79.5, 94.90000000000003, 105.84999999999997, 306.95000000000005, 0.32747459452095706, 0.1703603430149014, 96.83206296386776], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 214.5559999999998, 13, 351, 264.0, 334.0, 336.0, 341.99, 0.3292976804929981, 0.18352878831460837, 0.13795771965966425], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 417.5019999999998, 330, 527, 406.5, 487.0, 497.0, 511.98, 0.3292569132427789, 0.17707526825383865, 0.14019142009165197], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 7.314000000000002, 4, 260, 6.0, 8.0, 11.0, 30.960000000000036, 0.32704555548360553, 0.14746113615462453, 0.2372996559807802], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 393.28799999999984, 279, 498, 395.5, 453.0, 462.95, 481.97, 0.3292445549535502, 0.16935195267537542, 0.13246948890709245], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.6380000000000012, 2, 19, 3.0, 5.0, 6.0, 11.0, 0.3276054791361175, 0.20114144608170742, 0.16380273956805871], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.144000000000002, 2, 24, 4.0, 5.0, 6.0, 11.980000000000018, 0.3276011861783749, 0.1918610423467121, 0.15452282512124518], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 669.6940000000002, 500, 878, 674.5, 798.0, 836.95, 845.98, 0.3274400670073353, 0.29920795419866575, 0.14421432638701975], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 241.81000000000012, 174, 304, 238.0, 282.0, 289.0, 297.0, 0.3275325141526799, 0.29001660733142226, 0.13465936372878734], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.465999999999998, 3, 37, 4.0, 5.0, 6.0, 10.0, 0.3276059084380799, 0.21841780249000148, 0.15324534193539088], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 977.4780000000005, 818, 8342, 928.0, 1063.9, 1104.85, 1139.97, 0.32743148987221654, 0.24612040241166389, 0.18098263990983846], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 134.08599999999996, 118, 172, 132.0, 151.0, 152.0, 156.98000000000002, 0.3293395424815076, 6.367673919066454, 0.16595625382857218], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 182.52800000000005, 159, 276, 179.0, 203.90000000000003, 205.0, 209.0, 0.32930548813940425, 0.6382577103175361, 0.23540197003715224], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 6.988, 5, 17, 7.0, 9.0, 10.0, 13.0, 0.3292519264530217, 0.2687100854063035, 0.20321017335772432], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 6.952000000000001, 5, 27, 7.0, 9.0, 10.0, 14.0, 0.3292532273401344, 0.2738557287674471, 0.2083555579261788], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.402000000000008, 5, 19, 8.0, 10.0, 11.0, 14.0, 0.32924954152001346, 0.2664574097197757, 0.20095797211914881], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 9.763999999999976, 7, 22, 9.0, 12.0, 13.0, 17.0, 0.3292504087643825, 0.2944315349703444, 0.22893192484398467], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 7.856000000000003, 5, 32, 8.0, 9.0, 11.0, 15.0, 0.32922742833212726, 0.24714884417303665, 0.18165380567153505], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1619.021999999999, 1420, 1969, 1596.5, 1809.9, 1870.95, 1956.98, 0.3289183716698659, 0.27486205060705177, 0.20942849446167244], "isController": false}]}, function(index, item){
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
