# Data Importer

Cleans/processes the raw data from CFIA and Health Canada to be used by the app

<br>

## Requirements
- Some platform that can run a Jupyter Notebook
- [Python 3.6 and up](https://www.python.org/downloads/)

<br>

## How to Run

### Step 1.
Follow the instructions at [DataImporter.ipynb](DataImporter.ipynb) and run the corresponding cell blocks

<br>

## How to Add New Data

### Step 1.
Add the raw data files into the corresponding folder, grouped by organisation, at [data](data)

<br>

> [!NOTE]
> - For CFIA data, make sure the raw files are excel 2010+ files (.xlsx)
> - For HC data, make sure the raw files are CSV UTF-8 files (.csv)
> - For HC data, make the name of each file ends with some language abbreviation (eg. someFile-en.csv)

The [Data Importer](DataImporter.ipynb) will read all of the files within each organisation folder with their corresponding file extensions
(.xlsx for CFIA and .csv for HC)