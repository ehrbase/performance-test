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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8714103382259094, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.471, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [0.5, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [0.999, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.814, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.836, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [0.846, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.493, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 483.6868751329492, 1, 23024, 13.0, 1008.0, 1796.9500000000007, 10389.920000000013, 10.271117294804881, 69.23253723662373, 85.09743270954303], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 10952.708000000004, 9024, 23024, 10496.0, 12596.5, 13167.3, 18703.02000000004, 0.22098275450583837, 0.12840306536227913, 0.11178619808010183], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 7.634000000000003, 5, 19, 7.0, 9.0, 10.0, 13.990000000000009, 0.22179735706269324, 2.368230450087832, 0.08057482112043153], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 9.005999999999998, 6, 32, 9.0, 10.0, 12.0, 17.99000000000001, 0.22179489738659072, 2.3815703619360034, 0.09400291549392614], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 16.720000000000002, 10, 474, 14.0, 20.0, 24.0, 40.97000000000003, 0.22064816723012853, 0.1296545006875397, 2.4568656276932868], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 44.882, 28, 111, 46.0, 55.0, 58.0, 61.99000000000001, 0.22175673020588338, 0.9222632856397438, 0.09268738332824032], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.6179999999999994, 1, 8, 2.0, 4.0, 4.0, 7.0, 0.22176233641701254, 0.13853865647395222, 0.09420568002089888], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 39.39400000000001, 24, 69, 40.0, 49.900000000000034, 52.0, 59.97000000000003, 0.22175456648091024, 0.9101270840771352, 0.08099239049205122], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1111.0220000000008, 783, 1912, 1105.0, 1437.2000000000003, 1522.6499999999999, 1593.98, 0.2216826958034579, 0.9376052300046641, 0.10824350381028217], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 6.670000000000003, 4, 18, 6.0, 8.0, 9.949999999999989, 13.0, 0.22164387945941946, 0.32958921063637947, 0.11363577804315937], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 4.217999999999993, 2, 16, 4.0, 5.0, 6.0, 12.0, 0.22079237082873532, 0.21296760995239275, 0.12117706289623952], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 10.036, 6, 21, 10.0, 12.0, 13.0, 18.0, 0.22175289454053243, 0.3614312314337389, 0.14530878148114967], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 518.0, 518, 518, 518.0, 518.0, 518.0, 518.0, 1.9305019305019306, 0.9162343146718146, 2283.382224300193], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.545999999999996, 3, 21, 4.0, 6.0, 6.0, 12.990000000000009, 0.2207936383170579, 0.2218092028058014, 0.13001812881365812], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 15.684000000000008, 7, 37, 17.0, 20.0, 20.0, 24.980000000000018, 0.2217515176673869, 0.3483729335807637, 0.13231462626442717], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 7.593999999999998, 5, 29, 7.0, 9.0, 10.0, 15.0, 0.22175200940583323, 0.3431763933842949, 0.1271176069543204], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2179.8699999999985, 1608, 3725, 2142.5, 2752.9, 2970.0, 3314.6500000000005, 0.2214821764433329, 0.3382166934826212, 0.12242081237004533], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 14.065999999999992, 9, 57, 12.0, 18.0, 23.0, 40.98000000000002, 0.22064378561190698, 0.12965192601615289, 1.7793714663897735], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 14.630000000000003, 9, 34, 15.0, 17.0, 19.0, 24.0, 0.2217556483381188, 0.4014361942195842, 0.1853738622826462], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 10.011999999999995, 6, 25, 10.0, 12.0, 14.0, 19.980000000000018, 0.22175417308090611, 0.37538390498232843, 0.1593858119019013], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 79.0, 79, 79, 79.0, 79.0, 79.0, 79.0, 12.658227848101266, 6.502175632911392, 1726.3894382911392], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 658.0, 658, 658, 658.0, 658.0, 658.0, 658.0, 1.5197568389057752, 0.768783244680851, 2906.451842705167], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.727999999999998, 1, 17, 3.0, 3.0, 4.0, 9.990000000000009, 0.22078593611249836, 0.1856412997977159, 0.09379090059466483], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 690.4919999999994, 523, 1034, 666.5, 837.9000000000001, 853.95, 909.7700000000002, 0.2207309638305828, 0.1943079154454726, 0.10260540896812248], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.602, 2, 14, 3.0, 4.0, 5.0, 10.980000000000018, 0.22079802588901015, 0.20003568027098984, 0.10824278222293271], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 943.1400000000003, 725, 1323, 903.5, 1147.9, 1188.75, 1296.5500000000004, 0.2207206352163305, 0.20880301419962063, 0.11704228996334715], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 60.0, 60, 60, 60.0, 60.0, 60.0, 60.0, 16.666666666666668, 8.59375, 1097.4772135416667], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 29.63599999999998, 20, 553, 28.0, 34.0, 38.0, 82.7800000000002, 0.2205909278010305, 0.1296208663741778, 10.0903115802737], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 36.864000000000004, 26, 230, 34.0, 42.900000000000034, 50.94999999999999, 122.7800000000002, 0.220716250719535, 49.94705724126979, 0.0685427419226681], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 925.0, 925, 925, 925.0, 925.0, 925.0, 925.0, 1.0810810810810811, 0.5669341216216216, 0.44552364864864863], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 3.0179999999999993, 2, 13, 3.0, 4.0, 4.0, 7.990000000000009, 0.22176656585158583, 0.24091558904748156, 0.09550689017631772], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.807999999999999, 2, 17, 4.0, 5.0, 5.0, 8.0, 0.2217651888086641, 0.22761251312295502, 0.08207910796726922], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.2320000000000007, 1, 12, 2.0, 3.0, 4.0, 7.0, 0.22179893128402953, 0.1257820872909656, 0.08642360701399197], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 189.43599999999998, 88, 330, 188.0, 265.0, 273.0, 289.99, 0.22178141933011364, 0.20200951916346707, 0.07277202821769353], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 113.42999999999998, 85, 376, 111.0, 130.0, 146.84999999999997, 272.6900000000003, 0.22068303163756078, 0.12973748539630037, 65.28252338247061], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 252.4319999999999, 17, 511, 305.5, 417.0, 434.95, 457.96000000000004, 0.22176263148860828, 0.12360841176708004, 0.09333954508944352], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 506.7279999999997, 306, 1315, 474.0, 820.7, 890.9, 1007.8200000000002, 0.22178102583482814, 0.11927444212646308, 0.09486336847231906], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 8.100000000000007, 5, 269, 7.0, 10.0, 12.0, 28.99000000000001, 0.22056698950321696, 0.10375910597030726, 0.1604711007616178], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 514.226, 283, 1194, 457.0, 874.8000000000001, 919.6999999999999, 1002.96, 0.22173656985943677, 0.11405358272525776, 0.08964740226738947], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.9959999999999996, 2, 16, 4.0, 5.0, 6.0, 11.990000000000009, 0.22078457122090778, 0.13555612087138372, 0.11082350547611973], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.428000000000002, 2, 31, 4.0, 5.0, 6.0, 12.0, 0.22078184148835223, 0.12930183413962862, 0.10456952453305744], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 862.0460000000002, 574, 1445, 851.0, 1156.4, 1268.9, 1330.96, 0.2206935515551171, 0.20166519836488148, 0.09763103403756646], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 472.696, 247, 985, 387.0, 862.0, 888.0, 956.97, 0.22071381496324893, 0.1954330304348901, 0.09117377317329523], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 5.556000000000002, 3, 47, 5.0, 6.0, 8.0, 12.980000000000018, 0.22079441831710495, 0.14726815206111588, 0.10371300313528073], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1172.8479999999997, 893, 9118, 1081.0, 1415.0, 1435.95, 1556.89, 0.22070904103687342, 0.16583784214315542, 0.12242454620014073], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 167.53399999999993, 142, 281, 170.0, 186.0, 189.95, 225.95000000000005, 0.2218501056450203, 4.289450560898076, 0.11222495578527394], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 226.942, 194, 310, 220.0, 254.0, 258.0, 278.99, 0.22183593191943984, 0.42996093011702285, 0.15901130276256722], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 9.286000000000001, 6, 24, 9.0, 11.0, 13.0, 19.0, 0.2216407354394227, 0.18094888166734122, 0.13722678346542383], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 9.069999999999997, 6, 26, 9.0, 11.0, 12.0, 18.0, 0.2216425039396955, 0.18428794990657768, 0.14069104253984577], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 10.06200000000001, 7, 28, 10.0, 12.0, 14.0, 19.0, 0.22163808274192906, 0.17936884330963285, 0.13571003699139603], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 12.283999999999999, 8, 33, 12.0, 15.0, 16.0, 22.0, 0.22163916346287257, 0.19820038903768267, 0.154541369836417], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 9.313999999999984, 6, 35, 9.0, 11.0, 12.0, 20.0, 0.22160016593420426, 0.16635377300320525, 0.12270243562958381], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2016.3959999999988, 1629, 2756, 1957.0, 2492.9, 2584.95, 2651.79, 0.22143627108405456, 0.1850441714153675, 0.1414251184462614], "isController": false}]}, function(index, item){
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
