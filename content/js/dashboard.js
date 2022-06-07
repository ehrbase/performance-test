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

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9171324698932061, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.005, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.995, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.873, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.725, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.759, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 22005, 0, 0.0, 190.21735969097983, 1, 3014, 12.0, 578.9000000000015, 1279.9000000000015, 2140.0, 25.84020291693088, 173.7240342492044, 227.6220676749395], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query participation #2", 500, 0, 0.0, 7.248000000000002, 4, 31, 7.0, 9.0, 13.0, 19.0, 0.5977393497791353, 6.384197153864086, 0.21598003849441413], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 7.5980000000000025, 5, 33, 7.0, 9.0, 11.0, 17.0, 0.5977207711554301, 6.417816644072822, 0.2521634503311971], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 20.30800000000003, 13, 266, 19.0, 26.0, 29.94999999999999, 45.99000000000001, 0.5941608250754881, 0.32019698213833725, 6.614681060410708], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 43.68799999999997, 25, 81, 45.0, 54.0, 56.0, 58.99000000000001, 0.5975986097465943, 2.4855199989362746, 0.2486103591328605], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.250000000000001, 1, 19, 2.0, 3.0, 3.0, 6.0, 0.5976364672991255, 0.3735227920619534, 0.2527115140044153], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 38.47599999999999, 23, 72, 40.0, 48.0, 49.0, 51.99000000000001, 0.5975943242881456, 2.452144273014553, 0.2170948131203029], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 737.0400000000003, 559, 1025, 729.0, 881.9000000000001, 905.0, 932.96, 0.5972345650699004, 2.525998927068104, 0.2904519662156351], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 8.207999999999993, 5, 94, 8.0, 10.0, 11.949999999999989, 18.0, 0.5973630007694036, 0.8884607911834, 0.30509848574452936], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.287999999999999, 1, 27, 3.0, 4.0, 5.0, 17.0, 0.5952253404093721, 0.5742994495356052, 0.3255138580363754], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 12.317999999999993, 8, 28, 13.0, 15.0, 16.0, 20.99000000000001, 0.597580754075202, 0.973986600147961, 0.3904116449963966], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 651.0, 651, 651, 651.0, 651.0, 651.0, 651.0, 1.5360983102918586, 0.6555419546850998, 1816.8817804339476], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.018, 2, 23, 4.0, 5.0, 7.0, 10.990000000000009, 0.5952366780079096, 0.5974688155504392, 0.3493527768386266], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 13.139999999999995, 9, 40, 14.0, 16.0, 17.0, 22.0, 0.5975678986524844, 0.9382749708685649, 0.3553895022259404], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 7.843999999999999, 5, 21, 8.0, 10.0, 11.0, 15.0, 0.5975657561358052, 0.9249430893313001, 0.34138278060492777], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1850.0380000000007, 1435, 2413, 1837.5, 2116.9, 2186.0, 2279.87, 0.596361953538633, 0.9108497024750214, 0.32846498222245013], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 16.983999999999998, 11, 67, 15.0, 22.0, 27.0, 38.99000000000001, 0.594122700596618, 0.3208494662401658, 4.790114273560233], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 16.68999999999999, 11, 50, 17.0, 20.0, 21.0, 25.99000000000001, 0.5975936100510465, 1.0819712431978907, 0.4983837333824157], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 12.277999999999992, 8, 23, 13.0, 15.0, 16.0, 20.99000000000001, 0.5975893246643041, 1.0119334853202182, 0.42835016045273366], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 74.0, 74, 74, 74.0, 74.0, 74.0, 74.0, 13.513513513513514, 6.294869087837838, 1843.0109797297298], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 614.0, 614, 614, 614.0, 614.0, 614.0, 614.0, 1.6286644951140066, 0.7459410627035831, 3114.7285983306188], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.0360000000000005, 1, 19, 2.0, 3.0, 4.0, 8.0, 0.595145989311178, 0.5004108367157464, 0.25165841149583995], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 395.4780000000001, 307, 618, 399.0, 460.90000000000003, 471.9, 506.85000000000014, 0.5949335459229205, 0.5233788432707067, 0.27538916090572685], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 2.804000000000001, 1, 11, 3.0, 4.0, 5.0, 9.0, 0.5952147118029887, 0.5394133325714585, 0.29063218349755304], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1140.1019999999999, 908, 1438, 1135.5, 1328.9, 1345.95, 1392.95, 0.5945791033984952, 0.5626437023370526, 0.3141282177134628], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 56.0, 56, 56, 56.0, 56.0, 56.0, 56.0, 17.857142857142858, 8.353097098214285, 1175.8335658482142], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 40.154, 27, 607, 39.0, 46.0, 51.0, 74.98000000000002, 0.5937022440757421, 0.32062240329480995, 27.156079792987903], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 39.17, 27, 180, 40.0, 46.0, 50.94999999999999, 81.95000000000005, 0.5945593066962837, 134.54633248321264, 0.1834772860508063], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 279.0, 279, 279, 279.0, 279.0, 279.0, 279.0, 3.5842293906810037, 1.8796202956989245, 1.4700940860215053], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.0200000000000005, 1, 12, 2.0, 3.0, 4.0, 6.0, 0.5977872307865206, 0.6497433475248022, 0.25627792413601813], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.125999999999999, 1, 30, 3.0, 4.0, 6.949999999999989, 19.950000000000045, 0.5977672198803031, 0.6135286602482407, 0.22007640810046314], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.0480000000000005, 1, 32, 2.0, 3.0, 4.0, 8.0, 0.5977500687412579, 0.3391531151744832, 0.23174489969753845], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 117.11400000000003, 84, 160, 116.0, 142.0, 146.0, 153.99, 0.5976764729437838, 0.5445626457583499, 0.19494525582346073], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 159.67199999999994, 105, 576, 161.0, 188.90000000000003, 207.89999999999998, 334.7800000000002, 0.5942639268722583, 0.3209257339456629, 175.7941798830964], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 2.1220000000000017, 1, 11, 2.0, 3.0, 4.0, 6.990000000000009, 0.5977615027245969, 0.33264493624275815, 0.2504293795594259], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 446.14199999999965, 338, 675, 452.0, 518.0, 531.95, 560.94, 0.5975536154981507, 0.6493960600302362, 0.25676131915936157], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 11.129999999999999, 6, 321, 9.0, 14.0, 18.94999999999999, 38.98000000000002, 0.5934929433689033, 0.2509594184362648, 0.43063013371396014], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 2.7380000000000013, 1, 26, 2.0, 4.0, 5.0, 7.990000000000009, 0.5977943778634351, 0.6363240936241643, 0.2428539660070205], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.4480000000000017, 2, 23, 3.0, 4.0, 5.0, 11.990000000000009, 0.5951389054205252, 0.36556872217725617, 0.2975694527102626], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 3.9339999999999944, 2, 28, 4.0, 5.0, 6.0, 19.0, 0.5951204880940195, 0.34870341099258956, 0.2807062458490346], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 514.9599999999997, 363, 866, 519.0, 621.0, 632.0, 677.98, 0.5945084069433826, 0.5427443741669451, 0.26183915188619683], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 14.539999999999996, 5, 133, 14.0, 23.900000000000034, 31.94999999999999, 46.97000000000003, 0.5946809358374952, 0.5267339929732501, 0.2444928456910014], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 6.589999999999992, 4, 42, 7.0, 8.0, 9.0, 11.990000000000009, 0.595247307398805, 0.3970253036654139, 0.2784408791445582], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 510.26799999999986, 330, 3014, 498.0, 564.9000000000001, 591.9, 660.7700000000002, 0.5950432893993038, 0.44744466097408586, 0.3289008806640683], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 12.394, 8, 27, 13.0, 15.0, 16.94999999999999, 20.980000000000018, 0.597340877350387, 0.4876728256493394, 0.368671322739692], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 12.092000000000006, 8, 31, 12.0, 14.0, 16.0, 23.0, 0.59735015471369, 0.49633731019198835, 0.378010644779757], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 12.187999999999999, 8, 44, 13.0, 15.0, 16.0, 24.0, 0.5973044843231464, 0.48355997803114104, 0.3645657252948892], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 14.980000000000002, 10, 30, 15.0, 18.0, 19.0, 25.980000000000018, 0.5973280322461565, 0.5343285913451946, 0.4153296474211557], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 11.982, 8, 40, 12.0, 15.0, 16.0, 21.0, 0.5971796399962258, 0.4484679132393532, 0.3294985318338551], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2083.4719999999998, 1627, 2669, 2062.5, 2380.8, 2511.5499999999997, 2632.0, 0.5960264111223297, 0.49756564187872293, 0.37950119145679584], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 22005, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
