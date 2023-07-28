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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8912359072537758, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.199, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.627, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.976, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.999, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.496, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.091, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 324.0754733035533, 1, 18562, 9.0, 841.0, 1514.0, 6056.980000000003, 15.299009225618242, 96.3724134309094, 126.60060692212637], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6193.322000000001, 5323, 18562, 6030.5, 6536.400000000001, 6788.8, 15985.66000000008, 0.3299297777461045, 0.19161380676111897, 0.16625367706737298], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.2100000000000004, 1, 7, 2.0, 3.0, 4.0, 6.0, 0.33108022206212656, 0.1699728354885552, 0.11962859586229181], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.5760000000000005, 2, 19, 3.0, 4.0, 5.0, 7.990000000000009, 0.3310771528954021, 0.1900169468048406, 0.13967317387774777], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 13.387999999999995, 8, 355, 11.0, 15.0, 20.0, 35.99000000000001, 0.329113874058652, 0.1712131365720552, 3.621216815448079], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 33.454000000000036, 24, 53, 33.0, 40.0, 41.0, 44.99000000000001, 0.3310113987085259, 1.37664214237694, 0.1377059139158516], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.3140000000000023, 1, 8, 2.0, 3.0, 4.0, 5.990000000000009, 0.3310197261275194, 0.20679358300882367, 0.13997220841134367], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 29.460000000000015, 21, 50, 30.0, 35.0, 36.0, 38.0, 0.3310074542878706, 1.3585237677833755, 0.12024880175301549], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 855.7280000000001, 685, 1115, 860.5, 992.0, 1044.9, 1080.99, 0.3308620146585107, 1.3992846049821865, 0.16090750322259603], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 5.581999999999999, 4, 18, 5.0, 7.0, 8.0, 12.980000000000018, 0.3309785314085387, 0.49217218707138277, 0.16904469914713452], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.8659999999999988, 2, 25, 4.0, 5.0, 5.0, 10.0, 0.32931741720301494, 0.31764658803280266, 0.18009546253289882], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 7.631999999999996, 5, 19, 7.0, 10.0, 11.0, 14.990000000000009, 0.3310057012421982, 0.5394067614451842, 0.21625274817483456], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 409.0, 409, 409, 409.0, 409.0, 409.0, 409.0, 2.444987775061125, 1.0577437347188265, 2891.907185971883], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 3.8639999999999963, 2, 12, 4.0, 5.0, 5.949999999999989, 10.0, 0.32932197216438963, 0.33083672459495045, 0.19328369655351385], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 7.858000000000001, 5, 23, 8.0, 10.0, 11.0, 15.990000000000009, 0.33100350996121963, 0.5200084536227673, 0.19685657965467065], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.523999999999999, 4, 16, 6.0, 8.0, 8.0, 11.0, 0.3310021952065586, 0.5122485241853374, 0.18909793378499684], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1564.361999999999, 1321, 2031, 1538.0, 1761.0, 1837.75, 1985.5300000000004, 0.33067623952335007, 0.5049626391650953, 0.18213027254997013], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 11.610000000000001, 7, 63, 10.0, 14.0, 16.0, 48.87000000000012, 0.3291049923910926, 0.1712085161100185, 2.653409001153184], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 10.89200000000001, 8, 28, 11.0, 13.0, 14.0, 18.99000000000001, 0.3310092073521117, 0.599213943125667, 0.2760565069127963], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 7.657999999999999, 5, 23, 7.0, 10.0, 11.0, 14.980000000000018, 0.3310076734198852, 0.5604212045749895, 0.23726526590839428], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 42.0, 42, 42, 42.0, 42.0, 42.0, 42.0, 23.809523809523807, 11.23046875, 3247.209821428571], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 445.0, 445, 445, 445.0, 445.0, 445.0, 445.0, 2.247191011235955, 1.0423981741573034, 4297.625526685393], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.2619999999999965, 1, 18, 2.0, 3.0, 4.0, 7.0, 0.3293460504821626, 0.27682757725634977, 0.13926449204958632], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 558.6919999999999, 445, 719, 554.0, 641.9000000000001, 653.0, 676.98, 0.32921442196202577, 0.2898983754173616, 0.15239026954101584], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.224000000000003, 1, 10, 3.0, 4.0, 5.0, 8.0, 0.32932349051284887, 0.2983561478356202, 0.16080248560197702], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 752.1479999999993, 606, 938, 734.0, 870.0, 886.0, 909.99, 0.3291775761601699, 0.3114039158223811, 0.17391119990493353], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 55.0, 55, 55, 55.0, 55.0, 55.0, 55.0, 18.18181818181818, 8.611505681818182, 1197.2123579545455], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 23.43999999999999, 16, 697, 21.0, 26.0, 29.94999999999999, 58.98000000000002, 0.32895559231086036, 0.1711307945116391, 15.005386442226845], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 30.68, 20, 315, 29.0, 35.0, 39.0, 115.90000000000009, 0.32923718378414685, 74.46377641449348, 0.10160053718338906], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 436.0, 436, 436, 436.0, 436.0, 436.0, 436.0, 2.293577981651376, 1.2027845470183487, 0.9407253440366973], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.605999999999998, 1, 14, 2.0, 3.0, 4.0, 7.990000000000009, 0.33102410914791747, 0.3597010121972454, 0.14191365616790602], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.314000000000001, 2, 9, 3.0, 4.0, 5.0, 7.0, 0.3310227942296107, 0.33965718762206465, 0.12187069670367501], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.7839999999999994, 1, 9, 2.0, 3.0, 3.0, 6.0, 0.33108175666682776, 0.18775633487694685, 0.12835884511399476], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 92.03000000000007, 67, 130, 92.0, 113.0, 116.0, 118.0, 0.3310552319306744, 0.3015415286856048, 0.10798090572738794], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 82.12999999999998, 58, 379, 79.0, 92.0, 102.74999999999994, 300.97, 0.3291708581089266, 0.1712427810773499, 97.33363684257996], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 209.84200000000004, 12, 347, 260.0, 333.0, 335.0, 341.0, 0.33101841124403336, 0.18448781004011944, 0.1386786117418851], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 418.42200000000025, 322, 539, 406.0, 491.0, 498.9, 517.96, 0.33096889157194337, 0.17799597488045404, 0.14092034836461653], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 7.480000000000007, 3, 312, 6.0, 9.0, 12.0, 27.970000000000027, 0.3288906780541775, 0.1482930810199163, 0.23863845097095107], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 387.68200000000024, 297, 518, 387.0, 451.0, 459.0, 478.99, 0.3309581569602155, 0.17023336997315927, 0.1331589459644617], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.3520000000000003, 2, 19, 3.0, 4.0, 5.0, 10.990000000000009, 0.3293430133831827, 0.20220824799232498, 0.16467150669159134], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.189999999999998, 2, 58, 4.0, 5.0, 6.0, 8.990000000000009, 0.32933086554738084, 0.1928740365013865, 0.15533867974549312], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 670.7600000000002, 534, 875, 677.0, 794.5000000000002, 832.95, 858.98, 0.3291738920335968, 0.3007922876120673, 0.14497795440151579], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 244.8139999999999, 179, 335, 239.0, 286.90000000000003, 296.95, 314.98, 0.3292573468838097, 0.2915438759697452, 0.13536849906062878], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.370000000000001, 3, 40, 4.0, 5.0, 6.0, 9.0, 0.329323924329266, 0.21956321911995427, 0.15404898413449064], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 983.4780000000005, 812, 8740, 928.5, 1083.0, 1112.0, 1150.99, 0.3291279557336065, 0.24739558477315843, 0.18192033490744264], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 133.7999999999998, 117, 164, 132.5, 149.0, 151.0, 154.0, 0.3310565471066982, 6.400871650162946, 0.16682146319048463], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 180.56599999999986, 159, 254, 173.0, 202.90000000000003, 204.0, 208.99, 0.33102673901587076, 0.6415938273361219, 0.23663239546837636], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 7.0520000000000005, 5, 23, 7.0, 9.0, 10.0, 13.990000000000009, 0.3309754641268933, 0.2701167042241075, 0.204273919265817], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 7.068000000000006, 4, 22, 7.0, 9.0, 10.0, 13.990000000000009, 0.3309769977606096, 0.2752894714479383, 0.20944638139538577], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.4, 5, 31, 8.0, 10.0, 11.0, 14.0, 0.3309719587317684, 0.26785133976621467, 0.20200925215562038], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 9.62, 7, 18, 9.0, 12.0, 13.0, 15.990000000000009, 0.33097349233299905, 0.2959723990861822, 0.2301300063877884], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 7.895999999999994, 5, 37, 7.5, 9.0, 11.0, 14.990000000000009, 0.33103024557147737, 0.2485022071027836, 0.18264852416785618], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1627.6120000000003, 1375, 1983, 1601.5, 1835.8000000000002, 1883.9, 1945.99, 0.3306438760455786, 0.2763039757528926, 0.21052715545089573], "isController": false}]}, function(index, item){
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
