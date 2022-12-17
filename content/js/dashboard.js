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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8714528823654542, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.46, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [0.5, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [0.997, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.828, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.844, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [0.846, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.486, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 488.21476281642384, 1, 24089, 13.0, 1018.0, 1854.8500000000022, 10545.890000000018, 10.144671080458183, 63.99345386424354, 84.04981073153415], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 11044.438000000004, 9085, 24089, 10654.0, 12707.300000000001, 13210.4, 21612.930000000066, 0.21834852529589502, 0.12686006673495154, 0.11045364853835314], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 3.0999999999999983, 2, 21, 3.0, 4.0, 5.0, 7.0, 0.219173566615833, 0.11252122627500935, 0.07962164724715809], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 4.474, 2, 18, 4.0, 5.0, 6.0, 9.0, 0.21917202944094036, 0.12572854837323943, 0.09289127029039855], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 16.63000000000001, 10, 410, 15.0, 21.0, 25.0, 39.0, 0.2179631258702178, 0.12807675045641478, 2.4269683214572493], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 44.869999999999976, 26, 87, 46.0, 56.0, 58.0, 66.0, 0.21912304328600424, 0.911310054367714, 0.09158658449844707], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.682000000000003, 1, 15, 2.0, 4.0, 4.949999999999989, 7.990000000000009, 0.21912813298448136, 0.13690543689767154, 0.09308665805493103], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 39.18599999999999, 24, 68, 40.0, 49.0, 51.0, 55.0, 0.21912246710862207, 0.899324398185622, 0.08003105732287563], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1130.9939999999997, 795, 1733, 1127.0, 1441.6000000000001, 1537.95, 1624.7600000000002, 0.2190527720033033, 0.9264819878381901, 0.10695936132973795], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 6.797999999999998, 4, 27, 6.0, 8.900000000000034, 10.0, 15.0, 0.21900000219000001, 0.3256577083347021, 0.11228027456030275], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 4.309999999999998, 2, 20, 4.0, 5.0, 6.0, 11.0, 0.21813152894932586, 0.21040106685404164, 0.11971671803664173], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 10.623999999999993, 6, 36, 10.0, 13.0, 15.0, 23.980000000000018, 0.21912160284823023, 0.3571425343297815, 0.14358456592886962], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 643.0, 643, 643, 643.0, 643.0, 643.0, 643.0, 1.5552099533437014, 0.7381172239502333, 1839.4898789852255], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.853999999999998, 3, 18, 5.0, 6.0, 7.0, 14.980000000000018, 0.21813305156359952, 0.2191363783925688, 0.12845139657504934], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 16.253999999999998, 7, 41, 17.0, 20.0, 21.0, 24.99000000000001, 0.21912083462249424, 0.34424011510307884, 0.13074495112728904], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 7.790000000000006, 5, 20, 8.0, 9.0, 10.0, 14.0, 0.219120738594656, 0.33910432193197, 0.12560925151861627], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2248.4300000000026, 1600, 3972, 2161.5, 2881.4, 3092.8, 3388.6200000000003, 0.21884826287002865, 0.33419454798094966, 0.12096495779730099], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 14.136000000000015, 9, 91, 13.0, 18.900000000000034, 22.94999999999999, 36.98000000000002, 0.21795818515809381, 0.1280738472573014, 1.7577135674175182], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 14.898000000000003, 10, 39, 15.0, 18.0, 20.94999999999999, 25.980000000000018, 0.2191233313758316, 0.3966710064498952, 0.18317340982198418], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 10.522000000000004, 7, 38, 10.0, 12.0, 15.0, 20.99000000000001, 0.21912246710862207, 0.3709289716166286, 0.1574942732343221], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 68.0, 68, 68, 68.0, 68.0, 68.0, 68.0, 14.705882352941176, 7.553998161764706, 2005.6583180147056], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 711.0, 711, 711, 711.0, 711.0, 711.0, 711.0, 1.4064697609001406, 0.7114759142053446, 2689.79650140647], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.767999999999999, 2, 19, 3.0, 3.900000000000034, 4.0, 7.990000000000009, 0.21811069030288596, 0.18339189878006326, 0.09265444363452674], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 699.1619999999994, 529, 996, 679.0, 840.0, 857.0, 909.8600000000001, 0.21805979984727092, 0.1919565085725849, 0.10136373508525484], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.697999999999999, 2, 23, 3.0, 4.0, 5.949999999999989, 10.980000000000018, 0.21813295639958466, 0.19762121580220576, 0.10693627354745265], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 953.8239999999992, 734, 1433, 912.0, 1159.7, 1197.75, 1322.0, 0.2180585635522961, 0.20628467880736795, 0.11563066407118827], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 61.0, 61, 61, 61.0, 61.0, 61.0, 61.0, 16.393442622950822, 8.452868852459016, 1079.4857838114754], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 29.954000000000008, 19, 619, 27.0, 35.0, 39.0, 75.84000000000015, 0.2179005284087814, 0.12803996772348422, 9.967246826823555], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 37.72399999999997, 26, 230, 35.0, 45.900000000000034, 54.0, 110.90000000000009, 0.21802452339839187, 49.337931913394115, 0.06770683441473496], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 985.0, 985, 985, 985.0, 985.0, 985.0, 985.0, 1.0152284263959392, 0.5324000634517767, 0.418385152284264], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 3.1160000000000023, 2, 25, 3.0, 4.0, 4.0, 9.990000000000009, 0.21913495163034213, 0.23805674110607927, 0.09437354850486414], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.782, 2, 15, 4.0, 5.0, 5.0, 8.0, 0.2191338951926406, 0.2248994278140079, 0.0811052209746199], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.1199999999999974, 1, 14, 2.0, 3.0, 4.0, 7.0, 0.21917433521136517, 0.12429367988339048, 0.08540093725520966], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 200.31799999999998, 89, 366, 198.5, 277.0, 304.95, 325.96000000000004, 0.21915521799807844, 0.19961744470604273, 0.07191030590561949], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 116.36999999999999, 83, 359, 113.0, 136.90000000000003, 150.95, 245.99, 0.21799325005700523, 0.1281561880217941, 64.48683135475393], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 270.7879999999999, 16, 543, 335.0, 437.90000000000003, 457.95, 488.0, 0.2191310140506806, 0.12214157287859266, 0.09223190142172202], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 492.37600000000066, 301, 1110, 467.0, 759.9000000000001, 870.55, 1008.8900000000001, 0.21916770625215332, 0.11786899170910484, 0.09374556185394839], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 8.133999999999999, 5, 276, 7.0, 10.0, 13.0, 27.960000000000036, 0.2178763159729485, 0.10249335953840723, 0.15851353066391272], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 504.92199999999974, 291, 1109, 455.0, 858.8000000000001, 919.8499999999999, 998.0, 0.21910777560909772, 0.11270142235455845, 0.08858458896695942], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 4.057999999999996, 2, 22, 4.0, 5.0, 6.0, 10.0, 0.21810878742855846, 0.13391325756270409, 0.10948038743972563], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.474000000000004, 2, 39, 4.0, 5.0, 6.0, 11.980000000000018, 0.21810536233843847, 0.1277343426249853, 0.10330185618568619], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 862.9480000000001, 577, 1409, 866.5, 1131.5000000000002, 1247.85, 1311.99, 0.21801748849085678, 0.19921986733962854, 0.09644718973277161], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 471.78600000000023, 248, 1067, 388.5, 850.0, 890.95, 971.8100000000002, 0.2180204354914595, 0.19304815338326292, 0.09006117598914783], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 5.7260000000000035, 3, 45, 5.0, 7.0, 8.949999999999989, 14.990000000000009, 0.21813409837324316, 0.14549373944230964, 0.10246338019290034], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1189.0000000000007, 879, 9681, 1108.5, 1424.7, 1451.9, 1781.5300000000013, 0.21805029024674133, 0.1638400921109841, 0.12094977037123934], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 170.7700000000001, 144, 309, 170.5, 190.0, 194.0, 225.96000000000004, 0.21924708796017772, 4.2391338813706625, 0.11090819488610551], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 230.45199999999988, 194, 350, 222.0, 259.0, 263.95, 293.9200000000001, 0.21922766968879318, 0.4249056135820749, 0.15714170854645917], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 9.394000000000005, 6, 35, 9.0, 11.0, 13.0, 19.980000000000018, 0.21899683680968912, 0.17879038630166028, 0.13558983841537392], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 9.05399999999999, 6, 25, 9.0, 11.0, 12.0, 19.0, 0.21899808376676705, 0.18208920750068436, 0.13901245551601424], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 10.065999999999997, 6, 29, 10.0, 12.0, 13.0, 19.99000000000001, 0.2189941511042123, 0.17722914351715993, 0.13409114525619248], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 12.369999999999994, 8, 39, 12.0, 15.0, 17.0, 24.99000000000001, 0.21899520619493637, 0.19583603541480976, 0.15269782931951617], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 9.514000000000003, 5, 28, 9.0, 11.900000000000034, 13.0, 26.99000000000001, 0.21897420221128908, 0.16438247947445317, 0.12124841079472747], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2002.3820000000012, 1603, 2803, 1949.5, 2444.0, 2573.9, 2731.83, 0.21881771040526354, 0.18285595993250786, 0.13975271738773667], "isController": false}]}, function(index, item){
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
