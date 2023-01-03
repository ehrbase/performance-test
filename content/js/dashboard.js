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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8714528823654542, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.47, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [0.5, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [0.992, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.82, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.843, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [0.846, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.49, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 485.38808764092926, 1, 25591, 12.0, 1018.0, 1820.9500000000007, 10360.970000000005, 10.24108931554406, 64.6016806865767, 84.84864731734001], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 10938.667999999992, 9074, 25591, 10460.5, 12712.1, 13153.699999999999, 23080.90000000008, 0.220509305933729, 0.12811547606525842, 0.11154669968131994], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 3.036, 1, 19, 3.0, 4.0, 4.949999999999989, 7.990000000000009, 0.22130435013534974, 0.11361514639614718, 0.08039572094760752], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 4.487999999999993, 2, 14, 4.0, 5.0, 6.0, 12.990000000000009, 0.221303272677057, 0.1269511410507391, 0.09379455111508081], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 16.40800000000001, 11, 438, 14.0, 19.0, 23.0, 48.940000000000055, 0.22006180215651763, 0.12930994821835765, 2.4503365900279435], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 44.504000000000005, 27, 102, 46.0, 56.0, 58.0, 65.98000000000002, 0.22125401465409592, 0.9201725436987742, 0.09247726393745415], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.7019999999999986, 1, 21, 2.0, 4.0, 5.0, 8.990000000000009, 0.2212592038297313, 0.1382368733552144, 0.09399194693938781], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 39.29999999999999, 24, 71, 41.0, 49.0, 51.0, 64.98000000000002, 0.22125332930947278, 0.9080699019748187, 0.08080932144701447], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1113.352, 769, 1823, 1109.5, 1407.6000000000001, 1518.55, 1598.97, 0.22117698892301405, 0.935466346704662, 0.10799657662256545], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 6.621999999999999, 4, 32, 6.0, 8.0, 9.0, 14.0, 0.22117043393639138, 0.3288851869719556, 0.1133930447427788], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 4.347999999999997, 3, 26, 4.0, 5.0, 6.0, 11.0, 0.2202345321579857, 0.21242954077906645, 0.1208709053445195], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 10.126000000000001, 6, 26, 10.0, 12.0, 13.0, 20.0, 0.221254504188569, 0.3606189135651579, 0.14498219952200178], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 551.0, 551, 551, 551.0, 551.0, 551.0, 551.0, 1.8148820326678765, 0.8613600272232305, 2146.627935004537], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.724000000000002, 3, 18, 4.0, 6.0, 7.0, 12.0, 0.22023637529687862, 0.22124937659341018, 0.1296899749062674], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 15.831999999999988, 7, 35, 17.0, 20.0, 21.0, 22.99000000000001, 0.22125342721558755, 0.3475904305624882, 0.1320174258093008], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 7.8100000000000005, 5, 29, 8.0, 9.0, 10.949999999999989, 16.0, 0.22125362302807708, 0.342405106395336, 0.12683191085691528], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2246.3619999999987, 1619, 3610, 2206.0, 2848.5, 3094.8999999999996, 3352.9, 0.2209858798862188, 0.3374588185907023, 0.1221464922027342], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 14.09999999999999, 9, 88, 12.0, 18.0, 23.94999999999999, 38.99000000000001, 0.2200572500941845, 0.12930727339274586, 1.7746413782009527], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 14.633999999999991, 9, 42, 15.0, 17.0, 19.0, 26.99000000000001, 0.22125430837451981, 0.40052863669622185, 0.18495477340682517], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 10.194, 6, 35, 10.0, 12.0, 14.0, 19.99000000000001, 0.22125528744823178, 0.3745393948911269, 0.1590272378534166], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 81.0, 81, 81, 81.0, 81.0, 81.0, 81.0, 12.345679012345679, 6.341628086419753, 1683.7625385802469], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 719.0, 719, 719, 719.0, 719.0, 719.0, 719.0, 1.3908205841446453, 0.7035596314325452, 2659.868306675939], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.8699999999999997, 2, 36, 3.0, 3.0, 4.0, 8.0, 0.22021435665476774, 0.1851607041794483, 0.09354809096174216], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 699.6060000000003, 532, 974, 677.0, 844.0, 861.0, 902.99, 0.2201599594201163, 0.1938052642778137, 0.10233998113669468], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.7359999999999975, 2, 13, 3.0, 5.0, 6.0, 10.0, 0.2202332710807287, 0.19952403116631134, 0.1079659200024666], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 960.2639999999997, 734, 1305, 927.0, 1168.0, 1191.95, 1247.97, 0.22015840837799613, 0.20827114431625843, 0.1167441560051288], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 74.0, 74, 74, 74.0, 74.0, 74.0, 74.0, 13.513513513513514, 6.967905405405406, 889.8463893581081], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 30.149999999999988, 20, 593, 28.0, 34.900000000000034, 41.0, 80.87000000000012, 0.22000080080291493, 0.12927410337023626, 10.063317880477085], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 37.24399999999998, 26, 243, 35.0, 42.900000000000034, 48.94999999999999, 120.95000000000005, 0.2201248724376364, 49.81323109661148, 0.06835909124528163], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 992.0, 992, 992, 992.0, 992.0, 992.0, 992.0, 1.0080645161290323, 0.5286432081653226, 0.41543283770161293], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 3.1200000000000028, 2, 26, 3.0, 4.0, 4.0, 7.990000000000009, 0.22126047668357096, 0.24036580026595508, 0.0952889357592332], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.7980000000000005, 2, 17, 4.0, 5.0, 5.0, 7.990000000000009, 0.22125939965244573, 0.22708085545853576, 0.08189190670730169], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.106000000000002, 1, 11, 2.0, 3.0, 3.0, 7.0, 0.22130493784429517, 0.12550194380425844, 0.08623112324206422], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 200.95, 90, 385, 213.5, 300.0, 312.0, 342.98, 0.22128427195482966, 0.2015566926708879, 0.07260890173517849], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 118.63199999999998, 83, 404, 116.0, 134.90000000000003, 154.0, 319.8900000000001, 0.22009221863960998, 0.12939015197367695, 65.10774889678775], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 276.148, 18, 593, 343.0, 456.0, 476.9, 509.95000000000005, 0.22125626653060881, 0.1233387007798841, 0.0931264168698168], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 503.8479999999998, 295, 1043, 469.0, 825.200000000001, 918.6999999999999, 985.97, 0.22128613270617892, 0.11900828724865214, 0.0946516856692445], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 8.371999999999998, 5, 262, 7.0, 11.0, 14.0, 30.99000000000001, 0.21997728074644451, 0.10348169522301737, 0.16004206460556752], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 502.2759999999996, 291, 1065, 453.0, 836.7, 908.8, 990.8200000000002, 0.22122826819414462, 0.11379213002005656, 0.08944189749255456], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 4.1739999999999995, 2, 22, 4.0, 5.0, 7.0, 12.0, 0.220213095808552, 0.1352052494783152, 0.1105366516070271], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.5379999999999985, 3, 29, 4.0, 5.0, 6.0, 11.0, 0.22021047717408299, 0.1289672121738958, 0.10429890764592799], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 853.2859999999997, 592, 1370, 849.0, 1134.0, 1252.9, 1313.8600000000001, 0.22012089920267808, 0.20114192050091595, 0.09737770247930974], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 467.3080000000004, 218, 1077, 383.5, 848.0, 894.0, 983.4300000000005, 0.2201224497163282, 0.19490940076395696, 0.09092948850586603], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 5.656, 4, 42, 5.0, 7.0, 8.0, 14.0, 0.22023763640968605, 0.14689678287872615, 0.10345146788384667], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1191.2180000000014, 882, 10069, 1114.5, 1416.0, 1448.55, 1556.6800000000003, 0.2201508473606115, 0.16541842282832195, 0.12211492314533919], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 170.87599999999998, 144, 291, 175.0, 189.0, 191.0, 226.93000000000006, 0.22137891613768174, 4.2803526959081655, 0.1119866001555851], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 231.24399999999994, 196, 445, 229.0, 258.0, 261.0, 288.99, 0.2213494168770962, 0.4290179698927164, 0.15866257030057482], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 9.224000000000013, 6, 33, 9.0, 11.0, 12.949999999999989, 17.0, 0.22116828163745916, 0.1805631674305819, 0.13693426812319248], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 8.983999999999995, 6, 35, 9.0, 11.0, 12.0, 19.0, 0.22116906428676958, 0.1838943014795326, 0.14039051932265648], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 10.095999999999997, 7, 32, 10.0, 12.0, 13.949999999999989, 17.0, 0.2211667163554556, 0.17898737256926722, 0.1354214171434284], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 12.242000000000006, 8, 35, 12.0, 14.0, 16.94999999999999, 22.99000000000001, 0.22116740116360592, 0.19777851652297418, 0.1542124262019674], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 9.527999999999999, 5, 36, 10.0, 11.0, 12.0, 25.980000000000018, 0.22113032979377384, 0.16600107013258975, 0.1224422822197947], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1984.5559999999994, 1572, 2867, 1915.5, 2476.3, 2550.8, 2593.9300000000003, 0.2209674218891212, 0.18465237557103506, 0.14112567765184109], "isController": false}]}, function(index, item){
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
