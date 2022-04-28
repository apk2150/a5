import csv
import json

def csv_to_json(csvFilePath, jsonFilePath):
    data = {"id": "COUNTRIES", "children":[]}

    region_cnt = {}
    region_dict = {}
    score_dict = {}

    with open(csvFilePath, encoding='utf-8') as csvf:
        csvReader = csv.DictReader(csvf)
        for row in csvReader:
            if row["Region"] not in region_cnt:
                region_cnt[row["Region"]] = 0
            region_cnt[row["Region"]] += 1

    num_regions = len(region_cnt)   
	
    with open(csvFilePath, encoding='utf-8') as csvf:
        csvReader = csv.DictReader(csvf)
        for row in csvReader:
            if row["year"] == "2019":
                if row["Region"] not in region_dict:
                    region_dict[row["Region"]] = []
                    score_dict[row["Region"]] = 0
                region_dict[row["Region"]].append((row["Country"], row["Happiness Score"], num_regions/region_cnt[row["Region"]]))
                score_dict[row["Region"]] += float(row["Happiness Score"])
    
    for k,v in score_dict.items():
        print(v)
        print("len", len(region_dict[k]))
        score_dict[k] = v/len(region_dict[k])


    for region in region_dict:
        r = {"id":region, "score": score_dict[region], "children":[]}
        for c in region_dict[region]:
            r["children"].append({"id":c[0], "score":c[1], "size":1})
        data["children"].append(r)
                

    with open(jsonFilePath, 'w', encoding='utf-8') as jsonf:
        jsonString = json.dumps(data, indent=4)
        jsonf.write(jsonString)

csvFilePath = r'merged_years.csv'
jsonFilePath = r'countries.json'
csv_to_json(csvFilePath, jsonFilePath)