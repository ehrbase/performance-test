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

    var data = {"OkPercent": 97.79195915762604, "KoPercent": 2.208040842373963};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8986811316741119, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.979, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.496, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.993, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.967, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.72, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.585, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [0.999, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 519, 2.208040842373963, 189.78196128483287, 1, 3558, 17.0, 565.0, 1243.0, 2278.0, 25.94167565234954, 170.96970696487912, 214.92987908094398], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 25.970000000000006, 16, 64, 27.0, 31.0, 33.0, 40.99000000000001, 0.5622279519497504, 0.3264622723257909, 0.2844082803808307], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 7.658, 4, 28, 7.0, 10.0, 12.949999999999989, 20.970000000000027, 0.561995398381678, 6.012931461429694, 0.20416239081834398], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 8.096000000000002, 5, 49, 8.0, 10.0, 11.949999999999989, 18.99000000000001, 0.5619676059393233, 6.034407054983473, 0.23817767673600224], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 21.855999999999995, 14, 299, 20.0, 27.0, 32.0, 51.99000000000001, 0.5583834575550398, 0.3015172517455067, 6.2174689287525045], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 43.59600000000003, 27, 79, 44.0, 53.0, 55.94999999999999, 64.0, 0.5618368920082073, 2.336716943343244, 0.23483026345655542], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.634000000000001, 1, 26, 2.0, 4.0, 4.949999999999989, 8.0, 0.5618735110351958, 0.35113911953016136, 0.23868650126983412], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 38.36200000000002, 23, 56, 40.0, 47.0, 49.0, 52.0, 0.5618248971579526, 2.3058149684479137, 0.2051977651729241], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 766.2759999999995, 588, 1366, 763.0, 895.0, 921.9, 1119.7000000000003, 0.5615037519680707, 2.3746531047367334, 0.2741717538906595], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 11.415999999999997, 7, 37, 12.0, 14.0, 16.0, 21.99000000000001, 0.5615390662728407, 0.835020655863591, 0.28789844706371226], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.5919999999999987, 2, 21, 3.0, 5.0, 6.0, 13.0, 0.559254714796873, 0.5394983866200547, 0.3069347165193776], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 18.302000000000028, 11, 53, 18.5, 23.0, 25.0, 37.0, 0.5617838660167951, 0.9153873092462882, 0.36812204501686474], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 649.0, 649, 649, 649.0, 649.0, 649.0, 649.0, 1.5408320493066257, 0.6575621147919877, 1822.4838092257319], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.613999999999996, 2, 22, 4.0, 6.0, 7.0, 11.0, 0.5592653490375042, 0.5619644597356912, 0.329333013153921], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 19.08200000000002, 12, 46, 19.0, 24.0, 26.0, 33.99000000000001, 0.5617674552383691, 0.8826672392247384, 0.3351952296393004], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 10.983999999999996, 7, 31, 11.0, 14.0, 15.0, 20.0, 0.5617642994293599, 0.8694322925853853, 0.32202699586429123], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1992.7440000000004, 1514, 2961, 1956.0, 2262.8, 2359.6, 2625.87, 0.5606091354622278, 0.8560523397302574, 0.30986794010900487], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 18.479999999999997, 12, 73, 17.0, 23.0, 28.0, 47.99000000000001, 0.5583510330610814, 0.301373241682803, 4.5027957334164155], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 23.018000000000015, 14, 70, 24.0, 28.0, 31.0, 42.99000000000001, 0.5618103777612979, 1.017024917343648, 0.46963836265983505], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 18.506, 11, 52, 19.0, 24.0, 25.0, 32.99000000000001, 0.5618028027218221, 0.9511749385809086, 0.4037957644563097], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 80.0, 80, 80, 80.0, 80.0, 80.0, 80.0, 12.5, 5.82275390625, 1704.8095703125], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 711.0, 711, 711, 711.0, 711.0, 711.0, 711.0, 1.4064697609001406, 0.6441741385372715, 2689.79650140647], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.4720000000000018, 1, 24, 2.0, 3.0, 4.0, 13.960000000000036, 0.559130886949326, 0.46968523377262383, 0.23752142170210624], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 417.28999999999957, 319, 886, 416.0, 477.0, 497.0, 627.96, 0.5589421237788512, 0.49206448033194455, 0.25982075285032535], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.243999999999998, 2, 22, 3.0, 4.0, 6.0, 13.0, 0.559244706469231, 0.5066571353892287, 0.27416097914800186], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1188.282, 933, 1862, 1178.5, 1352.9, 1374.0, 1497.8000000000002, 0.5586654599492732, 0.5284691553816244, 0.29624545385981965], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 67.0, 67, 67, 67.0, 67.0, 67.0, 67.0, 14.925373134328359, 6.981693097014925, 982.8154151119402], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 3, 0.6, 44.510000000000026, 11, 663, 43.0, 52.0, 61.94999999999999, 87.97000000000003, 0.5579472896036566, 0.3005069230099694, 25.521729536167257], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 44.46599999999997, 9, 193, 45.0, 54.0, 63.94999999999999, 85.0, 0.5587116556190749, 122.62103086874913, 0.17350615867857988], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 290.0, 290, 290, 290.0, 290.0, 290.0, 290.0, 3.4482758620689653, 1.808324353448276, 1.4210668103448276], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.3080000000000003, 1, 9, 2.0, 3.0, 5.0, 7.0, 0.5620370921999368, 0.6107268484978434, 0.24204917740251186], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.332, 2, 17, 3.0, 4.0, 6.0, 11.990000000000009, 0.5620320380742984, 0.5766284052818647, 0.20801771721695222], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.2080000000000037, 1, 11, 2.0, 3.0, 4.0, 6.990000000000009, 0.5620118224806977, 0.31868485229205284, 0.21898702848613125], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 122.04199999999992, 82, 282, 121.0, 146.0, 151.0, 219.5600000000004, 0.5619492896960978, 0.5119786076441962, 0.1843896106815321], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 16, 3.2, 165.13000000000002, 30, 586, 169.0, 194.0, 218.89999999999998, 318.97, 0.5584720205517704, 0.29793500607338325, 165.20736764213115], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 2.3959999999999995, 1, 21, 2.0, 4.0, 5.0, 10.990000000000009, 0.5620282475397214, 0.3133647770574449, 0.23655681122033193], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 3.4119999999999986, 2, 15, 3.0, 4.0, 6.0, 10.990000000000009, 0.5620800559382072, 0.3022563544555524, 0.24042096142669409], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 12.041999999999996, 7, 316, 10.0, 15.900000000000034, 20.0, 45.8900000000001, 0.5577767465105486, 0.2356988046704878, 0.4058043712405847], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 4.5699999999999985, 2, 66, 4.0, 6.0, 6.0, 12.0, 0.562040251074621, 0.2891257997832773, 0.22723111713368466], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.9260000000000046, 2, 24, 4.0, 5.0, 6.0, 11.990000000000009, 0.559119632591307, 0.3434119335559002, 0.2806518468280584], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.282000000000003, 2, 41, 4.0, 5.0, 7.0, 16.980000000000018, 0.5590996259623503, 0.3274707660783075, 0.264807928312246], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 525.6400000000008, 381, 1096, 524.0, 637.9000000000001, 654.0, 781.7900000000002, 0.5586448616404271, 0.5104148248843884, 0.24713488508116552], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 16.417999999999996, 6, 116, 16.0, 26.0, 34.0, 58.0, 0.5588259290760484, 0.4948174396020936, 0.23084313281168797], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 10.397999999999993, 6, 52, 10.0, 13.0, 14.0, 17.99000000000001, 0.5592728558037982, 0.372745527425063, 0.2627053160562763], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 562.550000000001, 372, 3558, 541.0, 645.0, 667.95, 713.8600000000001, 0.5590727443091985, 0.4201431673483627, 0.31011066285900857], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 170.76400000000007, 141, 356, 174.0, 188.90000000000003, 192.95, 220.91000000000008, 0.5621135469364812, 10.868411633993817, 0.28435040753232155], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 263.0400000000003, 210, 506, 264.0, 287.0, 294.95, 389.72000000000025, 0.5619410793539477, 1.0892777831396323, 0.40279760961503663], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 18.68000000000001, 12, 50, 19.5, 23.0, 24.94999999999999, 31.99000000000001, 0.5615239310268925, 0.4581454012172716, 0.34766227760844715], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 18.37399999999998, 12, 42, 20.0, 23.0, 24.0, 34.0, 0.5615277147618898, 0.46704958001938396, 0.3564384908156527], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 18.53199999999996, 11, 59, 20.0, 23.0, 25.0, 32.99000000000001, 0.5615043825417058, 0.45448186656690603, 0.3438117654820796], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 21.227999999999998, 14, 47, 22.0, 26.0, 27.94999999999999, 37.98000000000002, 0.5615106883559529, 0.5022570536270783, 0.3915221010606937], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 18.92999999999999, 11, 42, 20.0, 23.0, 25.0, 33.99000000000001, 0.5612976303136643, 0.42136240370939154, 0.3107966370975075], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2212.4040000000005, 1693, 2838, 2206.5, 2562.4000000000005, 2646.95, 2724.92, 0.5602510821249651, 0.4681444911351471, 0.35781660909153046], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["No results for path: $['rows'][1]", 500, 96.33911368015414, 2.1272069772388855], "isController": false}, {"data": ["500", 19, 3.6608863198458574, 0.08083386513507765], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 23505, 519, "No results for path: $['rows'][1]", 500, "500", 19, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Query cross patient #1", 500, 500, "No results for path: $['rows'][1]", 500, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 3, "500", 3, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 16, "500", 16, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
