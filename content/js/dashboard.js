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

    var data = {"OkPercent": 97.84301212507977, "KoPercent": 2.1569878749202296};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.871112529249096, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.441, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.714, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.496, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.993, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [0.5, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [0.999, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.991, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [0.996, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.757, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.76, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.491, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [0.84, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.466, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 507, 2.1569878749202296, 509.73907679217217, 1, 24772, 21.0, 1012.0, 1943.9500000000007, 10783.970000000005, 9.721125094605716, 65.17192609936495, 80.54068168588421], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 11573.798000000003, 9239, 24772, 10871.5, 13814.7, 14754.699999999999, 22295.130000000005, 0.20923671284102444, 0.12155427019699218, 0.1058443527848151], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 7.7099999999999955, 5, 22, 7.0, 9.0, 10.0, 13.0, 0.20998389423531214, 2.242104671196719, 0.07628321157767198], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 9.535999999999996, 6, 33, 9.0, 11.0, 12.0, 20.99000000000001, 0.20998160141208427, 2.2547820258426454, 0.08899610841098103], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 24.323999999999998, 16, 350, 22.0, 29.0, 33.94999999999999, 69.94000000000005, 0.20883479789177092, 0.1227128771869702, 2.3253265288691134], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 46.31200000000002, 29, 87, 48.0, 58.0, 59.0, 70.97000000000003, 0.20990667129580845, 0.8729801172989965, 0.08773442901816994], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 3.1719999999999975, 2, 34, 3.0, 4.0, 5.0, 10.990000000000009, 0.20991134184565807, 0.13115892012474611, 0.08917132197545044], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 40.926000000000066, 25, 78, 42.0, 51.0, 52.0, 62.0, 0.20990623068862677, 0.8614633702082606, 0.07666497097416641], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1175.9379999999987, 814, 2508, 1164.5, 1563.0000000000005, 1633.85, 1863.93, 0.2098387515097898, 0.8874757039513056, 0.10246032788563955], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 11.023999999999997, 7, 39, 11.0, 14.0, 15.949999999999989, 21.0, 0.2098077573480971, 0.3120005264076632, 0.1075674537185068], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 4.774000000000002, 3, 25, 4.0, 6.0, 7.0, 12.0, 0.20902109984394485, 0.20161350637388942, 0.11471665831279004], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 18.668000000000006, 12, 40, 19.0, 23.0, 25.0, 36.98000000000002, 0.20990376332259184, 0.34208286887752704, 0.1375443605365812], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 688.0, 688, 688, 688.0, 688.0, 688.0, 688.0, 1.4534883720930232, 0.6898392078488372, 1719.1744072492734], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 5.194000000000004, 3, 14, 5.0, 7.0, 8.0, 11.990000000000009, 0.2090226726893066, 0.20999593450901619, 0.12308659339028505], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 23.695999999999998, 12, 61, 23.0, 29.0, 30.0, 41.0, 0.20990252966132647, 0.3297818820165168, 0.12524457580377976], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 11.607999999999999, 8, 39, 12.0, 14.0, 16.0, 23.99000000000001, 0.20990252966132647, 0.3248385134566413, 0.12032498526484242], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2374.9080000000004, 1639, 5630, 2259.5, 3121.7000000000003, 3359.1, 3995.5800000000013, 0.2096600446240439, 0.3201635824014294, 0.11588631372774301], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 21.390000000000015, 14, 98, 19.0, 26.0, 30.0, 81.81000000000017, 0.2088289540509476, 0.12270944330273015, 1.6840913110866456], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 23.249999999999993, 15, 67, 24.0, 28.0, 31.0, 42.99000000000001, 0.2099059663252056, 0.3799970345534608, 0.1754682687249766], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 18.400000000000002, 12, 39, 19.0, 23.0, 24.0, 32.0, 0.20990508511861106, 0.3553852979697141, 0.1508692799290017], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 97.0, 97, 97, 97.0, 97.0, 97.0, 97.0, 10.309278350515465, 5.295586340206185, 1406.0285115979382], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 710.0, 710, 710, 710.0, 710.0, 710.0, 710.0, 1.4084507042253522, 0.7124779929577465, 2693.584947183099], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.709999999999999, 1, 23, 2.0, 3.0, 4.0, 10.980000000000018, 0.20902101246434102, 0.17570175669619717, 0.088793105880848], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 549.8499999999989, 422, 1250, 534.0, 641.9000000000001, 662.9, 1046.3300000000006, 0.20898292191562104, 0.18400170752108638, 0.09714440510921447], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.580000000000001, 2, 12, 3.0, 4.900000000000034, 5.0, 9.0, 0.20902389602984192, 0.18938054880059998, 0.10247069903025455], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 822.4740000000002, 626, 1776, 803.5, 966.0, 994.95, 1373.9, 0.2089638818468061, 0.1976573849350833, 0.11080799594024972], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 75.0, 75, 75, 75.0, 75.0, 75.0, 75.0, 13.333333333333334, 6.875, 877.9817708333334], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 3, 0.6, 44.771999999999984, 18, 769, 42.0, 52.0, 62.849999999999966, 98.98000000000002, 0.2087635602370552, 0.12236847334652996, 9.549301915530924], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 46.61599999999997, 17, 206, 45.0, 55.0, 66.89999999999998, 92.97000000000003, 0.2088932542936964, 46.91520215958024, 0.06487114732948775], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 1142.0, 1142, 1142, 1142.0, 1142.0, 1142.0, 1142.0, 0.8756567425569177, 0.4592067097197899, 0.3608663528896673], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 3.4940000000000015, 2, 19, 3.0, 5.0, 5.0, 8.990000000000009, 0.20995250454442196, 0.22814087044103884, 0.09041899853915047], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 4.212000000000003, 2, 24, 4.0, 5.0, 6.0, 9.990000000000009, 0.20995162294704053, 0.215451781381784, 0.0777067041962191], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.499999999999996, 1, 12, 2.0, 4.0, 4.0, 6.990000000000009, 0.20998565797955998, 0.11905899717674284, 0.08182058352914497], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 197.22799999999998, 86, 539, 195.0, 268.90000000000003, 275.0, 293.98, 0.20996414232377394, 0.1912457570183664, 0.06889448419998832], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 4, 0.8, 163.65999999999994, 38, 536, 163.5, 191.90000000000003, 215.0, 312.9100000000001, 0.20885346548466743, 0.12235182616771016, 61.783097426382284], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 257.0500000000001, 18, 649, 309.0, 421.0, 428.95, 450.94000000000005, 0.20994933082849787, 0.11703568039014464, 0.08836734529988532], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 549.3199999999998, 334, 1466, 497.0, 886.7, 962.0, 1154.6600000000003, 0.2099809841220779, 0.11290456051924937, 0.08981608500534191], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 15.563999999999997, 9, 331, 13.0, 18.0, 23.0, 49.99000000000001, 0.20873802417770784, 0.09820634807816987, 0.1518650664183519], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 562.9800000000002, 316, 1806, 494.0, 908.0, 982.9, 1361.8200000000002, 0.20992359201097982, 0.10798928780902327, 0.08487145223881412], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 4.518000000000002, 3, 17, 4.0, 6.0, 7.0, 11.0, 0.2090197017790503, 0.1283327897514714, 0.10491809249456234], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.859999999999999, 3, 28, 5.0, 6.0, 7.0, 12.0, 0.20901769209352958, 0.12241210949747132, 0.09899763736851742], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 911.3460000000002, 600, 2070, 903.5, 1283.4, 1355.35, 1645.2000000000007, 0.20888356746396133, 0.19086164811014683, 0.0924065000597407], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 521.1219999999998, 265, 1858, 417.5, 925.9000000000001, 990.95, 1307.91, 0.20888670904003187, 0.184972444709777, 0.0862881620350913], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 9.593999999999989, 6, 44, 9.0, 12.0, 13.0, 19.0, 0.20902293483250156, 0.13938114697259543, 0.09818362466253247], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1260.0879999999995, 949, 9714, 1183.5, 1482.0, 1536.6, 2389.1400000000035, 0.20894091610562548, 0.15704276754153013, 0.11589691440233912], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 172.02199999999993, 143, 329, 180.0, 187.0, 190.0, 209.96000000000004, 0.21004476053847074, 4.0611834460048435, 0.10625311128801547], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 258.84999999999997, 211, 485, 262.5, 283.0, 292.0, 463.74000000000024, 0.21002340920919044, 0.40706597704255115, 0.15054412339799395], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 17.492000000000008, 11, 57, 18.0, 21.0, 23.0, 35.98000000000002, 0.20980291533739037, 0.17124876124491176, 0.12989750812881395], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 16.738000000000017, 11, 44, 17.0, 21.0, 23.0, 27.980000000000018, 0.20980494015104278, 0.17450484919535608, 0.13317696396306425], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 17.212000000000003, 12, 44, 18.0, 21.0, 23.0, 31.0, 0.2098007144973133, 0.16978901378034034, 0.12846196092755413], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 19.959999999999987, 13, 52, 21.0, 24.0, 25.0, 34.99000000000001, 0.20980124269472072, 0.18763811805872588, 0.14628719461331113], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 17.046000000000017, 11, 53, 18.0, 21.0, 23.0, 39.98000000000002, 0.20979094332497666, 0.15750055070122623, 0.1161635399074822], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2105.924, 1666, 3460, 2037.5, 2563.9, 2651.95, 2984.8, 0.20964360587002095, 0.17517770571278826, 0.13389347484276728], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["No results for path: $['rows'][1]", 500, 98.61932938856016, 2.1272069772388855], "isController": false}, {"data": ["500", 7, 1.3806706114398422, 0.029780897681344395], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 23505, 507, "No results for path: $['rows'][1]", 500, "500", 7, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Query cross patient #1", 500, 500, "No results for path: $['rows'][1]", 500, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 3, "500", 3, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 4, "500", 4, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
