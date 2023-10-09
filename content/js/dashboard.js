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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8728993831099766, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.998, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.778, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.789, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.462, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 464.8845777494156, 1, 19962, 11.0, 1013.9000000000015, 1871.9000000000015, 10424.990000000002, 10.61418683949209, 66.86154470554493, 87.8333018856156], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 10538.252, 8957, 19962, 10421.0, 11210.300000000001, 11467.35, 19431.990000000063, 0.22853047591014547, 0.13276281604622167, 0.11515793512659675], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.9239999999999995, 1, 11, 3.0, 4.0, 5.0, 7.0, 0.22945168390001783, 0.11779789525691245, 0.08290734672168612], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 4.2500000000000036, 2, 23, 4.0, 5.0, 6.0, 9.990000000000009, 0.2294504203531701, 0.13168975248609532, 0.09679939608649364], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 16.28599999999998, 10, 423, 14.0, 19.0, 22.0, 82.65000000000032, 0.22810156541542315, 0.11866404776606451, 2.5097854858745827], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 42.00799999999997, 26, 59, 43.0, 54.0, 56.0, 58.0, 0.229404205162604, 0.9540683423515949, 0.09543573378834892], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.6720000000000006, 1, 12, 3.0, 4.0, 4.0, 7.990000000000009, 0.2294100994584545, 0.14331634250446088, 0.09700641900928789], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 36.989999999999995, 23, 63, 37.0, 48.0, 49.0, 54.99000000000001, 0.22940283688724208, 0.9415171841937315, 0.08333774933794341], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1035.7719999999995, 735, 1453, 1031.5, 1277.0, 1384.9, 1423.95, 0.22933412835831166, 0.9699019560767811, 0.11153163664300704], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 6.989999999999998, 4, 25, 7.0, 9.0, 10.0, 15.990000000000009, 0.22934969728133456, 0.341047927292247, 0.1171385660919316], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 4.391999999999997, 3, 17, 4.0, 5.0, 6.0, 10.0, 0.22824046685218052, 0.22015174952594455, 0.12481900530978622], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 9.303999999999998, 6, 32, 9.0, 12.0, 13.0, 18.0, 0.22940273163596722, 0.3738346018635302, 0.14987346432076376], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 531.0, 531, 531, 531.0, 531.0, 531.0, 531.0, 1.8832391713747645, 0.8147216337099811, 2227.476533074388], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 5.003999999999999, 3, 18, 5.0, 6.0, 7.0, 11.990000000000009, 0.22824192548540212, 0.22929174918563283, 0.13395839571945964], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 9.666000000000007, 6, 30, 10.0, 12.0, 13.0, 21.980000000000018, 0.22940136337818284, 0.3603908860157388, 0.1364310842747201], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 7.454, 5, 17, 7.0, 9.0, 10.0, 14.990000000000009, 0.22940041613235485, 0.35501282563389075, 0.1310539486693629], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2062.2860000000014, 1605, 2715, 2027.5, 2460.9, 2581.75, 2653.8, 0.22918055118839284, 0.34997257783086105, 0.12622835045923197], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 14.310000000000004, 10, 85, 13.0, 17.900000000000034, 21.0, 36.0, 0.22809688278238052, 0.11866161174511908, 1.839031117432943], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 13.883999999999995, 9, 44, 13.0, 17.0, 18.0, 25.980000000000018, 0.229404205162604, 0.4152820987812213, 0.19131952266490604], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 9.419999999999996, 6, 23, 9.0, 12.0, 13.0, 19.980000000000018, 0.2294036789009178, 0.38839790248760764, 0.16443584014968132], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 64.0, 64, 64, 64.0, 64.0, 64.0, 64.0, 15.625, 7.3699951171875, 2130.9814453125], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 530.0, 530, 530, 530.0, 530.0, 530.0, 530.0, 1.8867924528301887, 0.875221108490566, 3608.3836969339623], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.8740000000000006, 2, 22, 3.0, 4.0, 4.0, 8.0, 0.2282279650464307, 0.1918340740186654, 0.09650655162607862], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 705.6120000000001, 513, 933, 702.5, 837.0, 855.95, 889.96, 0.2281728692418865, 0.20092359172275537, 0.10561908205142014], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.7779999999999996, 2, 15, 4.0, 5.0, 6.0, 10.980000000000018, 0.22823452832367672, 0.20677290456167788, 0.11144264078304529], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 961.7319999999993, 758, 1249, 935.0, 1154.0, 1171.0, 1204.99, 0.228155273352833, 0.21583622543908484, 0.12053906531629167], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 70.0, 70, 70, 70.0, 70.0, 70.0, 70.0, 14.285714285714285, 6.766183035714285, 940.6668526785713], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 31.228000000000026, 20, 1638, 27.0, 33.0, 38.0, 116.8900000000001, 0.227927500820539, 0.1185734950801849, 10.396966370436893], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 39.332000000000015, 25, 318, 37.0, 45.0, 50.94999999999999, 150.8900000000001, 0.2281740146305178, 51.606257269481496, 0.07041307482738636], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 449.0, 449, 449, 449.0, 449.0, 449.0, 449.0, 2.2271714922048997, 1.1679600501113585, 0.9134883073496659], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 3.273999999999999, 2, 11, 3.0, 4.0, 5.0, 6.990000000000009, 0.2294203099376619, 0.24929518854564042, 0.09835499615491561], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 4.0120000000000005, 2, 11, 4.0, 5.0, 6.0, 10.0, 0.2294195730685281, 0.23540374962776675, 0.08446404203792489], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.2880000000000016, 1, 23, 2.0, 3.0, 4.0, 7.990000000000009, 0.22945221038197827, 0.1301222588778502, 0.0889575464078568], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 125.06400000000001, 86, 168, 124.0, 152.0, 157.0, 164.97000000000003, 0.22944041776511268, 0.20898571489618967, 0.0748370112632301], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 100.46600000000002, 69, 488, 97.0, 115.0, 123.89999999999998, 378.93000000000006, 0.22813788836483082, 0.11868294385823146, 67.45885861131555], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 253.46999999999994, 15, 450, 316.0, 418.0, 426.0, 440.0, 0.2294173624895271, 0.1278620927210918, 0.0961133286211007], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 501.4119999999995, 365, 668, 476.5, 609.9000000000001, 621.95, 646.0, 0.2294036789009178, 0.1233739257885981, 0.09767578515703142], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 8.535999999999992, 5, 318, 7.0, 10.0, 13.0, 27.99000000000001, 0.22789675001002746, 0.10275606293665017, 0.1653586770092289], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 468.53, 325, 610, 473.0, 559.0, 569.0, 584.99, 0.22938673456514008, 0.1179885614871142, 0.09229231898519309], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 4.139999999999997, 2, 18, 4.0, 5.0, 6.0, 10.990000000000009, 0.22822661076636214, 0.14012534419425737, 0.11411330538318108], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.592000000000003, 2, 41, 4.0, 6.0, 6.0, 11.990000000000009, 0.22822254802258857, 0.13365951589319003, 0.1076479401317483], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 772.0340000000002, 539, 1163, 720.5, 985.0, 1101.0, 1134.94, 0.22814694488426107, 0.20847595488051943, 0.10048268763945481], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 279.11799999999994, 195, 373, 268.5, 343.90000000000003, 351.0, 365.99, 0.22818442778191048, 0.20204795167396095, 0.09381410556267998], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 5.290000000000003, 3, 54, 5.0, 6.0, 7.0, 11.990000000000009, 0.22824265480900427, 0.15217142857876495, 0.10676585122413383], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1251.8420000000006, 926, 11156, 1157.5, 1489.8000000000002, 1514.0, 1827.4600000000023, 0.22815194189243823, 0.1714949523379186, 0.12610742100695316], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 166.7779999999999, 144, 209, 170.0, 185.0, 187.0, 193.99, 0.2294477880085997, 4.436299038011468, 0.11562017442620845], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 226.0559999999999, 196, 297, 219.0, 252.0, 255.0, 263.99, 0.22943136354271393, 0.4446823452508396, 0.1640075762824869], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 8.355999999999996, 5, 22, 8.0, 11.0, 12.0, 17.99000000000001, 0.2293462256491645, 0.18717474046607738, 0.1415496236428437], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 8.410000000000002, 5, 41, 8.0, 11.0, 12.0, 16.99000000000001, 0.22934633084859518, 0.19075836274126662, 0.14513322499012665], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 9.287999999999998, 6, 24, 9.0, 11.0, 12.0, 17.0, 0.22934401648341315, 0.1856051561523138, 0.139980478810677], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 11.510000000000003, 7, 28, 11.0, 14.0, 15.0, 22.980000000000018, 0.22934464766928503, 0.20509100323949314, 0.15946620033254974], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 8.644, 6, 39, 9.0, 11.0, 12.0, 35.80000000000018, 0.2293186667229262, 0.17214800028962948, 0.1265283659164583], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2061.406, 1679, 2751, 1991.5, 2517.7000000000003, 2685.9, 2734.98, 0.22914557572596755, 0.19148648496530052, 0.14590128454426843], "isController": false}]}, function(index, item){
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
