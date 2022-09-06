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

    var data = {"OkPercent": 97.8387577111253, "KoPercent": 2.1612422888747074};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9007870665815784, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.985, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.995, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.989, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.706, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.665, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [0.998, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 508, 2.1612422888747074, 188.498744947882, 1, 3333, 19.0, 547.8000000000029, 1220.9500000000007, 2206.970000000005, 26.088462140374904, 174.53215227974368, 216.1460226541195], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 29.771999999999995, 19, 72, 32.0, 36.0, 37.0, 44.0, 0.5651454458319393, 0.3282203594635866, 0.2858841220126412], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 7.948000000000001, 4, 74, 7.0, 10.0, 12.0, 18.99000000000001, 0.565148639743739, 6.037018216082887, 0.2053079042819052], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 8.037999999999986, 5, 39, 8.0, 10.0, 11.0, 15.0, 0.565130754302623, 6.068308917212301, 0.2395183079759164], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 21.816000000000003, 14, 278, 20.0, 28.0, 32.94999999999999, 47.98000000000002, 0.5616866776907038, 0.3032373039853916, 6.2542495107709035], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 43.95800000000001, 27, 69, 45.0, 54.0, 56.0, 59.99000000000001, 0.564911111236647, 2.3494388314248753, 0.23611519102469225], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.5939999999999985, 1, 12, 2.0, 3.0, 4.0, 7.990000000000009, 0.5649404722224419, 0.35302379797615724, 0.23998936075855687], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 39.35600000000002, 24, 81, 40.0, 48.0, 50.0, 53.99000000000001, 0.5649085582516759, 2.3185027801268556, 0.2063240242052019], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 774.8580000000002, 571, 990, 779.5, 915.0, 933.0, 962.9100000000001, 0.5645813290696152, 2.387732429311595, 0.27567447708477305], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 13.626000000000003, 8, 33, 14.0, 17.0, 19.0, 28.99000000000001, 0.5646763331725888, 0.8396538555253015, 0.28950690909727456], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.400000000000001, 2, 34, 3.0, 4.0, 6.0, 15.960000000000036, 0.5624746183328477, 0.5425726843763675, 0.30870189013970745], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 22.785999999999994, 15, 45, 24.5, 28.0, 29.94999999999999, 34.99000000000001, 0.5648792005829553, 0.9205269246140463, 0.37015033553824517], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 703.0, 703, 703, 703.0, 703.0, 703.0, 703.0, 1.4224751066856332, 0.6070523648648649, 1682.4921652738265], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.258000000000003, 2, 23, 4.0, 5.0, 7.0, 11.0, 0.56248537538024, 0.5651363074325693, 0.3312291810100437], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 23.586000000000006, 15, 61, 25.0, 29.0, 30.0, 38.99000000000001, 0.5648696280898369, 0.8875094792184464, 0.3370462331668851], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 12.98, 8, 32, 14.0, 16.0, 17.0, 22.0, 0.5648702662459513, 0.8742073457988904, 0.3238074670765365], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1940.066, 1502, 2404, 1948.0, 2188.9, 2238.95, 2370.6600000000003, 0.5637391691612125, 0.8608638439541794, 0.31159801732934206], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 18.546000000000003, 12, 80, 17.0, 23.0, 29.0, 61.91000000000008, 0.5616475594166953, 0.3031525610988297, 4.5293804156865916], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 27.45800000000002, 18, 77, 28.0, 33.0, 35.0, 47.930000000000064, 0.5648919644118062, 1.0225714058748765, 0.4722143765004943], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 23.103999999999985, 15, 81, 25.0, 29.0, 30.0, 39.0, 0.5648849442345583, 0.9563292480618798, 0.4060110536685888], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 106.0, 106, 106, 106.0, 106.0, 106.0, 106.0, 9.433962264150942, 4.39453125, 1286.6487323113208], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 712.0, 712, 712, 712.0, 712.0, 712.0, 712.0, 1.4044943820224718, 0.6432693995786517, 2686.0186973314608], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.3200000000000025, 1, 17, 2.0, 3.0, 4.0, 7.990000000000009, 0.5624062890520868, 0.47265964640672997, 0.23891282786880635], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 416.11800000000005, 322, 562, 425.0, 480.0, 490.95, 522.9100000000001, 0.562205193651579, 0.49496896627331044, 0.26133757048647616], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.0180000000000007, 1, 32, 3.0, 4.0, 5.0, 11.990000000000009, 0.5624499419551661, 0.5094972572831643, 0.2757322957631771], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1164.935999999999, 934, 1473, 1160.5, 1342.0, 1370.9, 1430.97, 0.5618659342931501, 0.5315284660245287, 0.29794258039177784], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 57.0, 57, 57, 57.0, 57.0, 57.0, 57.0, 17.543859649122805, 8.20655153508772, 1155.2391721491229], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 2, 0.4, 43.98, 13, 619, 43.0, 50.0, 57.0, 92.99000000000001, 0.5612667566190189, 0.3025545723175378, 25.673569218784028], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 47.90799999999998, 8, 223, 48.0, 56.0, 64.0, 90.97000000000003, 0.5619265539516922, 125.96305101991074, 0.17450453530921695], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 311.0, 311, 311, 311.0, 311.0, 311.0, 311.0, 3.215434083601286, 1.686218850482315, 1.3251105305466238], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.3139999999999987, 1, 11, 2.0, 4.0, 4.0, 9.0, 0.5651844140224513, 0.6140828007176712, 0.24340461580459088], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.134000000000004, 1, 15, 3.0, 4.0, 6.0, 9.990000000000009, 0.5651793031339192, 0.5799214312459378, 0.20918257410913613], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.371999999999999, 1, 23, 2.0, 3.0, 4.0, 8.980000000000018, 0.5651607769378233, 0.3205024558355111, 0.22021401367010887], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 124.67600000000002, 87, 190, 124.0, 148.0, 153.95, 172.96000000000004, 0.5650981801578207, 0.5147514641693848, 0.18542284036428489], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 5, 1.0, 170.5619999999999, 38, 522, 170.0, 203.0, 231.84999999999997, 395.19000000000074, 0.5616910946123713, 0.3021305680438209, 166.15963513669877], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 2.2, 1, 8, 2.0, 3.0, 4.0, 6.0, 0.5651761088755256, 0.31508788841728086, 0.23788174113803862], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 3.4539999999999993, 2, 27, 3.0, 5.0, 6.0, 10.0, 0.5652201928305209, 0.303976965228219, 0.2417641059177424], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 11.306, 7, 312, 10.0, 14.0, 18.0, 41.86000000000013, 0.5610897709968208, 0.2370352230416003, 0.4082147259693667], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 4.513999999999999, 2, 56, 4.0, 5.0, 6.0, 15.970000000000027, 0.5651876083747239, 0.2907448692268912, 0.2285035838546247], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.8960000000000035, 2, 18, 4.0, 5.0, 7.0, 11.990000000000009, 0.5623999631065624, 0.3453630070316867, 0.2822984189812237], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 3.957999999999999, 2, 29, 4.0, 5.0, 6.0, 10.990000000000009, 0.5623828837644561, 0.3293938060836331, 0.26636298693921995], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 531.2919999999999, 385, 798, 529.0, 638.9000000000001, 652.95, 684.98, 0.5618798251429985, 0.513434151547417, 0.24856597733376784], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 16.273999999999997, 7, 107, 15.0, 24.0, 32.0, 47.99000000000001, 0.5620604687134662, 0.4976178208718907, 0.23217927565019156], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 12.238000000000005, 7, 47, 13.0, 15.0, 15.949999999999989, 24.99000000000001, 0.5624936016352814, 0.3750195378636943, 0.2642181859243851], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 532.9380000000006, 351, 3333, 520.5, 592.9000000000001, 622.8499999999999, 711.9300000000001, 0.5623012967792507, 0.42260127362649474, 0.3119015005572406], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 173.02399999999997, 144, 243, 177.0, 192.0, 196.0, 221.93000000000006, 0.5650055879052643, 10.924296967078254, 0.2858133735692646], "isController": false}, {"data": ["Query single patient #1", 500, 1, 0.2, 276.6019999999999, 34, 435, 280.0, 305.0, 311.95, 330.97, 0.5650796592795687, 1.0934997756633753, 0.40504733389765957], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 22.93400000000002, 15, 52, 24.0, 28.0, 29.0, 37.99000000000001, 0.5646521009010718, 0.4608255930117527, 0.3495990546594527], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 22.33400000000001, 15, 45, 24.0, 28.0, 29.0, 33.99000000000001, 0.564665492162443, 0.46959545423103854, 0.3584302440484257], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 22.01399999999999, 15, 46, 23.0, 28.0, 29.0, 34.99000000000001, 0.5646265954936022, 0.4569770061465251, 0.345723511107899], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 25.421999999999993, 17, 51, 27.0, 31.0, 32.0, 37.99000000000001, 0.564644449036886, 0.5049961593590382, 0.39370716466048494], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 22.26799999999999, 14, 64, 24.0, 27.0, 28.0, 36.97000000000003, 0.5644054327409334, 0.42366344207732803, 0.3125174612930754], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2171.391999999999, 1696, 2794, 2163.5, 2460.7000000000003, 2560.0, 2664.96, 0.5633675860825672, 0.4707805440299937, 0.35980703251757706], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["No results for path: $['rows'][1]", 500, 98.4251968503937, 2.1272069772388855], "isController": false}, {"data": ["400", 1, 0.1968503937007874, 0.0042544139544777706], "isController": false}, {"data": ["500", 7, 1.3779527559055118, 0.029780897681344395], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 23505, 508, "No results for path: $['rows'][1]", 500, "500", 7, "400", 1, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Query cross patient #1", 500, 500, "No results for path: $['rows'][1]", 500, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 2, "500", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 5, "500", 5, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Query single patient #1", 500, 1, "400", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
