# importing libraries
import pandas as pd
import glob
import os
import csv
import shutil

countryDict = {}


file = open('archive/2015.csv')
csvreader = csv.DictReader(file)
for row in csvreader:
    if row["Country"] not in countryDict:
        countryDict[row["Country"]] = row["Region"]

file = open('archive/2016.csv')
csvreader = csv.DictReader(file)
for row in csvreader:
    if row["Country"] not in countryDict:
        countryDict[row["Country"]] = row["Region"]

file = open('archive/2021.csv')
csvreader = csv.DictReader(file)
for row in csvreader:
    if row["Country"] not in countryDict:
        countryDict[row["Country"]] = row["Region"]

countryDict["Northern Cyprus"] = "Middle East and Northern Africa"

path = "/Users/saahitijasti/Desktop/a5"


# # # adding year column
for i in range(2015, 2022):
    df = pd.read_csv(path + "/archive/" + str(i) + ".csv")
    df["year"] = str(i)
    if i == "2017" or i == "2018" or i == "2019" or i == "2022":
       df["Region"] = ""       
    df.to_csv(str(i) + ".csv", index=False)



for i in range(2017, 2020):
    # file = open(path + "/" + str(i) + ".csv")
    with open(path + "/" + str(i) + ".csv") as csvfile, open('outputfile.csv', 'w') as output:
        csvreader = csv.DictReader(csvfile)
        fieldnames = csvreader.fieldnames
        fieldnames.append("Region")
        csvwriter = csv.DictWriter(output, fieldnames)
        csvwriter.writeheader()
        for row in csvreader:
            new_row = {}
            for field in fieldnames:
                if field != "Region":
                    new_row[field] = row[field]
            new_row["Region"] = countryDict[row["Country"]]
            csvwriter.writerow(new_row)
    shutil.move('outputfile.csv', path + "/" + str(i) + ".csv")

    
# merging the files
all_files = glob.glob(os.path.join(path, "20**.csv"))
df_from_each_file = (pd.read_csv(f, sep=',') for f in all_files)
df_merged   = pd.concat(df_from_each_file, ignore_index=True)
df_merged.to_csv( "merged.csv")