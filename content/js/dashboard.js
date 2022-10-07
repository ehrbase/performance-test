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

    var data = {"OkPercent": 97.81323122739843, "KoPercent": 2.186768772601574};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8989789406509253, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.98, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.991, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.982, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.708, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.595, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [0.998, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 514, 2.186768772601574, 189.33163156775154, 1, 2808, 17.0, 559.0, 1248.9500000000007, 2256.9900000000016, 25.928054474836937, 172.52093270881156, 214.81702599947934], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 25.138000000000012, 16, 68, 26.0, 30.0, 31.0, 37.98000000000002, 0.5614993379922805, 0.3261028040013566, 0.28403970417968877], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 7.634000000000003, 4, 24, 7.0, 10.0, 12.0, 19.0, 0.5614722250919691, 6.002025133812868, 0.20397233177169194], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 7.9279999999999955, 5, 39, 8.0, 10.0, 11.0, 17.99000000000001, 0.5614520497491432, 6.02883921262526, 0.23795916952258608], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 22.816000000000003, 13, 276, 21.0, 28.0, 32.94999999999999, 58.960000000000036, 0.5581447269276923, 0.30132511407082857, 6.21481071916948], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 42.24200000000003, 26, 59, 44.0, 51.0, 54.0, 56.99000000000001, 0.5612768374519828, 2.334387639252783, 0.2345961781537584], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.7299999999999986, 1, 30, 2.0, 3.900000000000034, 4.0, 8.990000000000009, 0.5613089725239259, 0.35078631493643175, 0.2384466826639724], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 37.701999999999956, 23, 63, 39.0, 45.0, 48.0, 52.99000000000001, 0.5612673866604703, 2.303495069897434, 0.2049941431748202], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 762.4460000000001, 585, 993, 756.0, 902.8000000000001, 924.9, 962.97, 0.5609405851732184, 2.3723031904898133, 0.27389677010411057], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 11.53800000000001, 7, 60, 11.0, 14.0, 16.0, 27.970000000000027, 0.5608518666832679, 0.8339987753098427, 0.28754612305538635], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.685999999999999, 2, 19, 3.0, 5.0, 6.0, 11.0, 0.5590258638906188, 0.5392459565659264, 0.3068091167055935], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 18.354, 11, 43, 19.0, 23.0, 25.0, 31.99000000000001, 0.5612415561207882, 0.914567231546939, 0.3677666837471181], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 702.0, 702, 702, 702.0, 702.0, 702.0, 702.0, 1.4245014245014245, 0.6079171118233618, 1684.8888777599716], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.8, 3, 21, 4.0, 6.0, 8.0, 12.990000000000009, 0.5590352393453474, 0.5617015753892562, 0.32919750910668405], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 18.992, 12, 40, 20.0, 23.900000000000034, 26.0, 33.97000000000003, 0.5612339964125923, 0.8818290514219425, 0.3348769255938417], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 10.790000000000001, 7, 23, 11.0, 14.0, 15.0, 19.0, 0.561232106517364, 0.8686404159235017, 0.3217219204352467], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1983.1759999999977, 1501, 2492, 1961.5, 2241.6000000000004, 2321.5, 2454.4900000000007, 0.5599474097392774, 0.8549784504239362, 0.30950218155510834], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 20.888, 12, 523, 18.0, 25.0, 31.899999999999977, 54.97000000000003, 0.5580986249566079, 0.3012053918745305, 4.500760200089519], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 22.999999999999982, 14, 48, 24.0, 28.0, 30.0, 36.99000000000001, 0.5612623463684643, 1.016032836022154, 0.46918024266738806], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 18.12, 11, 74, 19.0, 23.0, 24.0, 28.99000000000001, 0.5612554161147656, 0.9502163815021439, 0.4034023303324877], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 84.0, 84, 84, 84.0, 84.0, 84.0, 84.0, 11.904761904761903, 5.545479910714286, 1623.628162202381], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 695.0, 695, 695, 695.0, 695.0, 695.0, 695.0, 1.4388489208633093, 0.65900404676259, 2751.7198741007196], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.5959999999999988, 1, 24, 2.0, 3.0, 5.0, 9.0, 0.558950871572094, 0.46972397189371434, 0.23744495032603605], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 416.67999999999967, 314, 554, 423.5, 483.0, 495.0, 537.98, 0.5587697231743037, 0.4919127075270752, 0.2597406135068053], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.312000000000002, 2, 24, 3.0, 4.0, 6.0, 14.990000000000009, 0.5590108638171274, 0.5064452817107298, 0.27404634144159956], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1191.4159999999995, 924, 1436, 1198.5, 1358.0, 1378.0, 1426.94, 0.5584289829109562, 0.5281822005787558, 0.2961200563678215], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 69.0, 69, 69, 69.0, 69.0, 69.0, 69.0, 14.492753623188406, 6.77932518115942, 954.3280117753623], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 4, 0.8, 45.32799999999997, 13, 728, 44.0, 53.0, 59.94999999999999, 89.99000000000001, 0.5576554380885356, 0.30012318608627375, 25.50837960944044], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 45.01800000000001, 11, 209, 45.0, 54.900000000000034, 63.94999999999999, 88.99000000000001, 0.5584826250470523, 124.23819915741726, 0.17343503395015877], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 308.0, 308, 308, 308.0, 308.0, 308.0, 308.0, 3.246753246753247, 1.7026430600649352, 1.3380174512987013], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.470000000000001, 1, 28, 2.0, 4.0, 4.0, 8.0, 0.5615031213958518, 0.6101466193441194, 0.24181921536676823], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.443999999999999, 2, 28, 3.0, 5.0, 6.949999999999989, 10.990000000000009, 0.5614968157515579, 0.5761110863896541, 0.2078196222361723], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.380000000000002, 1, 14, 2.0, 3.0, 4.0, 7.0, 0.5614860964812789, 0.3183549401371598, 0.21878218017190457], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 121.77799999999998, 85, 175, 121.0, 145.0, 150.0, 163.97000000000003, 0.5614198982931713, 0.5114644925774675, 0.1842159041274468], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 9, 1.8, 169.53800000000004, 33, 440, 165.0, 204.90000000000003, 231.89999999999998, 365.8600000000001, 0.5582406932902818, 0.2994307131189912, 165.13893633934782], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 2.436, 1, 11, 2.0, 4.0, 4.0, 7.0, 0.5614924018848176, 0.3130978139416317, 0.23633127462144182], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 3.6179999999999977, 2, 34, 3.0, 5.0, 6.0, 10.990000000000009, 0.5615390662728407, 0.3019336334525668, 0.24018956155029705], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 12.183999999999997, 7, 337, 10.0, 15.0, 19.0, 36.960000000000036, 0.5574633189136154, 0.23556636008506893, 0.40557634042055035], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 4.611999999999999, 2, 57, 4.0, 6.0, 7.0, 10.0, 0.5615056436932248, 0.28885078605175063, 0.22701497704003423], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 4.095999999999999, 2, 19, 4.0, 6.0, 7.0, 12.980000000000018, 0.5589414989469542, 0.34323920607111075, 0.28056243208860787], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.274, 2, 44, 4.0, 5.0, 7.0, 11.0, 0.558915882041921, 0.3273314879095316, 0.26472090116243324], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 528.7679999999998, 381, 767, 527.0, 641.9000000000001, 653.95, 692.8700000000001, 0.5584383383555555, 0.5101945012810575, 0.24704352272955724], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 16.362000000000013, 6, 114, 16.0, 24.0, 30.0, 45.97000000000003, 0.5586080381462257, 0.4946245061206683, 0.2307531251326694], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 10.011999999999995, 6, 59, 10.0, 12.0, 14.0, 18.0, 0.5590433649938226, 0.37265590496542317, 0.2625975181269811], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 552.7739999999994, 361, 2773, 538.5, 624.8000000000001, 659.8, 708.8900000000001, 0.5588552855415196, 0.41997974708445196, 0.30999004119881163], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 171.38400000000001, 141, 283, 172.0, 191.0, 195.95, 207.96000000000004, 0.5613329186954173, 10.85335005590876, 0.2839555194181897], "isController": false}, {"data": ["Query single patient #1", 500, 1, 0.2, 260.56, 26, 367, 265.0, 286.0, 290.0, 308.0, 0.5614047694703596, 1.0864202028383503, 0.4024131843664491], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 18.181999999999988, 11, 87, 18.0, 22.0, 23.0, 27.99000000000001, 0.5607902207158151, 0.4576420600796995, 0.3472080077478777], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 17.67200000000001, 11, 67, 19.0, 22.0, 23.0, 31.0, 0.5608355103098391, 0.4664420742445265, 0.355999103224019], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 17.651999999999994, 11, 50, 19.0, 22.0, 24.0, 31.980000000000018, 0.5607493405587756, 0.45387073529098404, 0.34334944973667214], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 20.650000000000006, 13, 59, 22.0, 25.0, 26.0, 29.0, 0.5607650629907396, 0.501558348586143, 0.39100220212440234], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 17.765999999999988, 11, 45, 18.0, 22.0, 24.0, 30.0, 0.5605839939815702, 0.4208266816538797, 0.3104014888550296], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2207.822000000001, 1707, 2808, 2194.0, 2531.0, 2615.0, 2725.91, 0.5595419813157742, 0.4674885825458713, 0.35736372634816044], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["No results for path: $['rows'][1]", 500, 97.27626459143968, 2.1272069772388855], "isController": false}, {"data": ["400", 1, 0.19455252918287938, 0.0042544139544777706], "isController": false}, {"data": ["500", 13, 2.529182879377432, 0.055307381408211016], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 23505, 514, "No results for path: $['rows'][1]", 500, "500", 13, "400", 1, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Query cross patient #1", 500, 500, "No results for path: $['rows'][1]", 500, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 4, "500", 4, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 9, "500", 9, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Query single patient #1", 500, 1, "400", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
