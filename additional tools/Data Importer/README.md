# Data Importer

[![Static Badge](https://img.shields.io/badge/Python-254F72?style=for-the-badge)](https://www.python.org/downloads/)
[![Static Badge](https://img.shields.io/badge/Jupyter%20Notebook-F37726?style=for-the-badge)](https://jupyter.org/)

<br>

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

#### CFIA data
- Add new file of data into the [data/CFIA](data/CFIA/) folder 
- Make sure the raw files are Excel 2010+ files (.xlsx)
- Make sure headers of the new file match the other files (spaces, lower vs uppercase)

#### HC Data
- New data should be added to the already existing files inside [data/Health Canada](data/Health%20Canada/) folder (Copy paste new rows to the existing files)
- There is a file for English and French (“....-en.csv” / “....-fr.csv”) 

<br>

The [Data Importer](DataImporter.ipynb) will read all of the files within each organisation folder with their corresponding file extensions
(.xlsx for CFIA and .csv for HC)

<br>

Once the Notebook runs new files are created. These new files are located in the main root of the app, inside the [data](../../data/) folder. These are the files use by the application.
