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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8903424803233354, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.152, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.591, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.998, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.919, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.997, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.569, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.495, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.124, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 325.4208040842385, 1, 28312, 9.0, 835.0, 1519.0, 5972.0, 15.223524474220074, 95.8969704981875, 125.97596416262196], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6215.795999999998, 5110, 28312, 5953.5, 6386.8, 6581.75, 27757.42000000019, 0.32968025630661846, 0.19150623841585998, 0.16612794165450695], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.524000000000001, 1, 20, 2.0, 3.0, 4.0, 6.990000000000009, 0.3307722738741504, 0.16981473837732383, 0.11951732552093325], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.628, 2, 13, 3.0, 5.0, 5.0, 7.990000000000009, 0.3307698668651286, 0.18984058442900853, 0.13954353758372612], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 13.64600000000001, 9, 362, 12.0, 15.900000000000034, 19.0, 69.94000000000005, 0.32759431768000324, 0.17042262594854934, 3.604497243457614], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 31.752000000000002, 20, 58, 32.0, 40.0, 41.0, 43.99000000000001, 0.33068214435466053, 1.375272807602184, 0.13756893896004432], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.2619999999999982, 1, 10, 2.0, 3.0, 4.0, 7.0, 0.33068914294633445, 0.20658706214277306, 0.13983242079664338], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 28.03599999999999, 18, 47, 28.0, 36.0, 37.0, 40.0, 0.33068345656803483, 1.3571940134307086, 0.1201310994563564], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 809.8979999999997, 595, 1128, 799.0, 958.0, 1043.0, 1081.94, 0.3305439828434451, 1.397939581972594, 0.16075283540628485], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 5.664000000000001, 3, 14, 5.0, 8.0, 9.0, 11.0, 0.3306572142791011, 0.4916943815966114, 0.16888058893356434], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.8900000000000006, 2, 30, 4.0, 5.0, 5.0, 9.980000000000018, 0.32770210043938297, 0.3160885172118974, 0.17921208617778756], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 7.607999999999994, 5, 15, 7.5, 10.0, 11.0, 13.990000000000009, 0.33068914294633445, 0.5388908981699002, 0.2160459342100564], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 431.0, 431, 431, 431.0, 431.0, 431.0, 431.0, 2.320185614849188, 1.003752175174014, 2744.2924340197214], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.255999999999996, 2, 19, 4.0, 5.0, 6.0, 12.0, 0.3277076847452073, 0.3292150120842209, 0.19233624856627887], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 7.964000000000009, 5, 22, 8.0, 10.0, 11.0, 13.0, 0.3306856436134682, 0.5195090837279516, 0.196667536094338], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.599999999999998, 4, 18, 7.0, 8.0, 9.0, 12.0, 0.3306845500871354, 0.5117569466490081, 0.18891646660251385], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1587.6380000000013, 1324, 1950, 1568.0, 1782.7, 1846.9, 1926.96, 0.33036031077655154, 0.5044989086547134, 0.18195626491989753], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 11.924, 8, 76, 11.0, 15.0, 17.94999999999999, 39.99000000000001, 0.32758015231166765, 0.17041525677534028, 2.64111497801282], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 10.782000000000002, 7, 33, 11.0, 13.0, 15.0, 19.0, 0.33068914294633445, 0.5986345421592282, 0.2757895781993844], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 7.732000000000003, 5, 28, 8.0, 10.0, 11.0, 14.0, 0.33068979907949186, 0.559883019103619, 0.23703741457455765], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 67.0, 67, 67, 67.0, 67.0, 67.0, 67.0, 14.925373134328359, 7.039995335820895, 2035.5643656716418], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 429.0, 429, 429, 429.0, 429.0, 429.0, 429.0, 2.331002331002331, 1.0812754953379953, 4457.909928613054], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.473999999999999, 1, 16, 2.0, 3.0, 4.0, 8.990000000000009, 0.3277167059489758, 0.275458052712249, 0.13857552116787747], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 566.656, 452, 729, 557.0, 661.0, 672.95, 691.96, 0.3276138507273355, 0.2884889505267048, 0.15164938012183304], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.333999999999998, 2, 12, 3.0, 4.0, 5.0, 9.990000000000009, 0.32771069175794504, 0.2968950057136359, 0.16001498620993407], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 768.4180000000002, 618, 956, 742.5, 895.9000000000001, 913.0, 942.9100000000001, 0.3275683487738134, 0.3098815772858211, 0.1730610123892901], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 49.0, 49, 49, 49.0, 49.0, 49.0, 49.0, 20.408163265306122, 9.665975765306122, 1343.8097895408164], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 26.264, 16, 1690, 22.0, 27.0, 32.89999999999998, 70.84000000000015, 0.3272202054550226, 0.17022800356244638, 14.92622636406651], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 30.725999999999992, 20, 225, 29.0, 36.0, 44.0, 106.97000000000003, 0.3277100473934271, 74.11838303745759, 0.10112927243781537], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 411.0, 411, 411, 411.0, 411.0, 411.0, 411.0, 2.4330900243309004, 1.2759466240875914, 0.9979470802919709], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.790000000000004, 1, 8, 3.0, 4.0, 4.0, 6.0, 0.3307250153787132, 0.3593760076777813, 0.14178543139771008], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.426, 2, 9, 3.0, 4.0, 5.0, 7.990000000000009, 0.33072392159197267, 0.3393505191952164, 0.12176066253923212], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.902000000000002, 1, 9, 2.0, 3.0, 3.0, 6.0, 0.3307733679807411, 0.1875814477735314, 0.1282392842659709], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 90.77800000000005, 64, 129, 89.0, 111.0, 113.0, 116.99000000000001, 0.3307569571418365, 0.30126984521070543, 0.10788361688024746], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 81.514, 56, 383, 79.0, 93.0, 103.0, 300.7500000000002, 0.3276557151020451, 0.1704545663984477, 96.88561911694164], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 210.7500000000001, 12, 357, 265.0, 337.0, 340.0, 348.0, 0.3307197652683394, 0.18432136448856834, 0.1385534954102711], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 430.4780000000005, 323, 556, 412.0, 509.0, 521.0, 539.99, 0.33066683596808666, 0.17783352855076662, 0.1407917387520369], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 7.474, 4, 238, 6.0, 8.0, 11.0, 29.99000000000001, 0.32717331417406403, 0.14751874110088586, 0.23739235588997032], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 406.4579999999999, 315, 516, 399.0, 472.0, 481.0, 497.0, 0.33065502760969484, 0.17007745077373276, 0.13303698376483813], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.606000000000001, 2, 15, 3.0, 5.0, 5.0, 10.990000000000009, 0.3277147727920709, 0.2012085496114286, 0.16385738639603542], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.260000000000001, 2, 24, 4.0, 5.0, 6.0, 10.0, 0.3277100473934271, 0.19192479738507046, 0.15457417274514185], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 629.8600000000002, 467, 881, 619.0, 757.9000000000001, 836.95, 866.99, 0.3275797230772053, 0.2993355690239959, 0.14427583506623007], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 251.71200000000007, 172, 322, 244.5, 295.0, 300.95, 315.0, 0.3276956572460719, 0.2901610638492049, 0.13472643720761354], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.425999999999999, 2, 35, 4.0, 6.0, 6.0, 11.990000000000009, 0.3277096178184895, 0.21848694646568453, 0.15329385442876609], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1041.776000000001, 811, 14546, 924.5, 1081.9, 1113.0, 4853.540000000034, 0.3274898232537424, 0.24616424985999807, 0.18101488277501776], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 131.58000000000015, 114, 159, 127.0, 149.0, 151.0, 153.0, 0.3307617708191381, 6.395172245639237, 0.16667292357683133], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 178.1699999999999, 156, 265, 170.0, 201.0, 203.0, 208.99, 0.3307289530708845, 0.6410166605950344, 0.23641952504676508], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 6.874, 4, 19, 7.0, 9.0, 9.0, 14.990000000000009, 0.3306545902792841, 0.2698548316819341, 0.20407587993799564], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 6.757999999999997, 4, 17, 7.0, 9.0, 10.0, 13.0, 0.33065568360747993, 0.27502221902863944, 0.20924304978285843], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.124000000000013, 5, 21, 8.0, 10.0, 11.0, 15.980000000000018, 0.33065174765981226, 0.26759219707340137, 0.20181381082752214], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 9.65000000000001, 6, 19, 9.0, 12.0, 13.0, 16.99000000000001, 0.33065349695831847, 0.2956862438473651, 0.22990750960383083], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 7.495999999999994, 4, 31, 7.0, 9.0, 10.0, 24.930000000000064, 0.33063884715491887, 0.2482083869106032, 0.18243256703371988], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1615.9240000000002, 1373, 2044, 1591.0, 1820.9, 1898.9, 1959.97, 0.33032822733981393, 0.2760402025556174, 0.21032617600152215], "isController": false}]}, function(index, item){
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
