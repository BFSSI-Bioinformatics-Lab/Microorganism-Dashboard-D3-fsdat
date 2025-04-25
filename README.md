# FSDAT - Microbiology Dashboard

[![Static Badge](https://img.shields.io/badge/D3-%23ff9933?style=for-the-badge)](https://d3js.org/)
[![Static Badge](https://img.shields.io/badge/Bootstrap-%237733ff?style=for-the-badge)](https://getbootstrap.com/)
[![GitHub deployments](https://img.shields.io/github/deployments/BFSSI-Bioinformatics-Lab/Microorganism-Dashboard-D3-fsdat/github-pages?style=for-the-badge&label=Github%20Pages)](https://bfssi-bioinformatics-lab.github.io/Microorganism-Dashboard-D3-fsdat/)

<br>

## Website Links
**Development**: https://bfssi-bioinformatics-lab.github.io/Microorganism-Dashboard-D3-fsdat/

<br>

>[!IMPORTANT]
> The website on Github pages is currently synced with the [development](https://github.com/BFSSI-Bioinformatics-Lab/Microorganism-Dashboard-D3-fsdat/tree/development) branch,
> but you can change which branch the website is synced with [here](https://github.com/BFSSI-Bioinformatics-Lab/Microorganism-Dashboard-D3-fsdat/settings/pages)

<br>

## Additional Tools
The below are some additional tools that accompany this app. The instructions (README) on how to use each tool
is located in the respective folder for each tool.

<br>

| Name | Location | Description |
| ---- | -------- | ----------- |
| Data Importer | [additional tools/Data Importer](additional%20tools/Data%20Importer) | Processes the raw CFIA and HC data to be used by the app |

<br>

## Requirements 
- [Python](https://www.python.org/downloads/)

<br>

## How to Run Locally

### Step 1.
In the terminal, enter the following command to host the website onto some port on your computer:

```bash
python3 -m http.server [YourServerPortNumber]
```

<br>

> [!NOTE]  
> If you leave `[YourServerPortNumber]` as blank, then the website will be hosted at port 8000

<br>

### Step 2.
In your browser, visit the following link:
```
localhost:[YourServerPortNumber]
```
